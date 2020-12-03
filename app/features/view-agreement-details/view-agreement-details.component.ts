import { FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';
import { Observable } from 'rxjs';
import * as moment from 'moment-timezone';
import { ViewAgreementDetailsModel } from './model/view-agreement-details.model';
import { ViewAgreementDetailsService } from './service/view-agreement-details.service';
import { AgreementDetails, CanComponentDeactivate } from './model/view-agreement-details.interface';
import { ViewAgreementDetailsUtility } from './service/view-agreement-details-utility';
import { BroadcasterService } from '../../shared/jbh-app-services/broadcaster.service';
import { LocalStorageService } from './../../shared/jbh-app-services/local-storage.service';

@Component({
  selector: 'app-view-agreement-details',
  templateUrl: './view-agreement-details.component.html',
  styleUrls: ['./view-agreement-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewAgreementDetailsComponent implements OnInit, OnDestroy {
  viewAgreementModel: ViewAgreementDetailsModel;
  /**
   *Creates an instance of ViewAgreementDetailsComponent.
   * @memberof ViewAgreementDetailsComponent
   */
  constructor(private readonly route: ActivatedRoute, private readonly service: ViewAgreementDetailsService,
    private readonly changeDetector: ChangeDetectorRef, private readonly shared: BroadcasterService,
    private readonly messageService: MessageService, private readonly localStore: LocalStorageService, private readonly router: Router,
    private readonly formBuilder: FormBuilder) {
    this.viewAgreementModel = new ViewAgreementDetailsModel();
  }
  /**
   * @memberof ViewAgreementDetailsComponent
   */
  ngOnInit() {
    this.viewAgreementModel.dropdownForm = this.formBuilder.group({
      dropdown: ['']
    });
    this.getAgreementId();
    this.getOverflowMenuList();
    this.getDetailsList();
    if (this.localStore.getAccessorialTab('accessType', 'create')) {
      this.setTabIndex(this.localStore.getAccessorialTab('accessType', 'create'));
    }
    this.localStore.clearItem('createSection', 'valueChanges', true);
    this.localStore.clearItem('createContract', 'valueChanges', true);
  }
  /**
   * @memberof ViewAgreementDetailsComponent
   */
  ngOnDestroy() {
    this.viewAgreementModel.isSubscribe = false;
  }
  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.viewAgreementModel.changedEvent = '';
    this.viewAgreementModel.isChangesAvailable = false;
    if (this.viewAgreementModel.detailType === 'Sections' || this.viewAgreementModel.detailType === 'Contracts') {
      this.shared.broadcast('navigationStarts', true);
      this.viewAgreementModel.routingUrl = nextState.url;
      this.shared.on<boolean>('saved').pipe(takeWhile(() => this.viewAgreementModel.isSubscribe))
        .subscribe((index: boolean) => {
          this.viewAgreementModel.isChangesAvailable = index;
        });
      this.viewAgreementModel.isShowPopup = this.viewAgreementModel.isChangesAvailable;
      this.changeDetector.detectChanges();
    }
    return !this.viewAgreementModel.isChangesAvailable;
    }
  popupCancel() {
    this.viewAgreementModel.isShowPopup = false;
  }
  popupYes() {
    this.viewAgreementModel.isShowPopup = false;
    if (utils.isEmpty(this.viewAgreementModel.changedEvent)) {
      this.shared.broadcast('loseChanges', true);
      this.router.navigate([this.viewAgreementModel.routingUrl]);
    } else {
      this.localStore.clearItem('createSection', 'valueChanges', true);
      this.localStore.clearItem('createContract', 'valueChanges', true);
      this.viewAgreementModel.detailType = this.viewAgreementModel.changedEvent;
      this.viewAgreementModel.dropdownForm.patchValue({
        dropdown: this.viewAgreementModel.changedEvent
      });
      this.onChangeValue(this.viewAgreementModel.changedEvent);
      this.viewAgreementModel.changedEvent = '';
    }
  }
  showPopup() {
    this.viewAgreementModel.isShowPopup = true;
  }
  setDropdownValue(event: string, eventName: string) {
    this.viewAgreementModel.changedEvent = event;
    this.viewAgreementModel.dropdownForm.patchValue({
      dropdown: eventName
    });
    this.viewAgreementModel.isShowPopup = true;
  }
  onChangeValue(event: string) {
    if ((event !== 'Sections' && !utils.isUndefined(this.localStore.getItem('createSection', 'valueChanges', true))) ||
      (event !== 'Contracts' && !utils.isUndefined(this.localStore.getItem('createContract', 'valueChanges', true)))) {
      const eventName = !utils.isUndefined(this.localStore.getItem('createContract', 'valueChanges', true)) ? 'Contracts' : 'Sections';
      this.setDropdownValue(event, eventName);
    } else {
      this.resetShowVariables();
      switch (event) {
        case 'Mileage':
          this.viewAgreementModel.showViewMileageFlag = true;
          this.viewAgreementModel.isPageLoaded = false;
          break;
        case 'Cargo Release':
          this.viewAgreementModel.showCargoFlag = true;
          break;
        case 'Contracts':
          this.viewAgreementModel.isShowContracts = true;
          break;
        case 'Line Haul':
          this.viewAgreementModel.showLineHaul = true;
          break;
        case 'Rating Rule':
          this.viewAgreementModel.isShowRatingRule = true;
          break;
        case 'Accessorials':
          this.onAccessorialsSelected();
          break;
        case 'Sections':
          this.viewAgreementModel.showSections = true;
          break;
        case 'Fuel':
          this.viewAgreementModel.isShowFuel = true;
          break;
        default: break;
      }
    }
  }
  onAccessorialsSelected() {
    this.viewAgreementModel.isShowAccessorialFlag = true;
    if (!this.localStore.isAccessorialTabRetained()) {
      this.localStore.setAccessorialTab('accessType', 'create', { id: 0, text: 'rates' });
      if (this.localStore.getAccessorialTab('accessType', 'create')) {
        this.setTabIndex(this.localStore.getAccessorialTab('accessType', 'create'));
      }
    }
    this.localStore.setAccessorialTabRetained(false);
    this.getAccessorialDocumentTab(this.viewAgreementModel.agreementId);
  }
  resetShowVariables() {
    this.viewAgreementModel.showViewMileageFlag = false;
    this.viewAgreementModel.showCargoFlag = false;
    this.viewAgreementModel.isShowContracts = false;
    this.viewAgreementModel.showLineHaul = false;
    this.viewAgreementModel.isShowRatingRule = false;
    this.viewAgreementModel.showSections = false;
    this.viewAgreementModel.isShowAccessorialFlag = false;
    this.viewAgreementModel.isShowFuel = false;
  }
  getAgreementId() {
    this.route.queryParams.subscribe((params: Params) => {
      this.viewAgreementModel.agreementId = Number(params['id']);
    });
    this.viewAgreementModel.isPageLoaded = true;
    this.service.getAgreementDetails(this.viewAgreementModel.agreementId)
      .pipe(takeWhile(() => this.viewAgreementModel.isSubscribe)).subscribe((data: AgreementDetails) => {
        this.viewAgreementModel.isPageLoaded = false;
        if (!utils.isEmpty(data)) {
          this.viewAgreementModel.agreementDetails = data;
          this.viewAgreementModel.agreementDetails['cargoReleaseAmount'] = `${'$'}${data['cargoReleaseAmount'].toLocaleString()}`;
          this.localStore.setAgreementDetails(data);
          this.getAgreementName(data);
          this.getStatus(data);
          this.setManageTeams(data);
        }
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.viewAgreementModel.isPageLoaded = false;
        this.viewAgreementModel.agreementDetails = null;
        this.changeDetector.detectChanges();
      });
  }
  /**
   * @memberof ViewAgreementDetailsComponent
   */
  getOverflowMenuList() {
    this.viewAgreementModel.overflowMenuList = ViewAgreementDetailsUtility.overflowMenuList(this.viewAgreementModel);
    this.changeDetector.detectChanges();
  }
  /**
   * @memberof ViewAgreementDetailsComponent
   */
  getDetailsList() {
    this.service.getDetailsList('customerAgreement').pipe(takeWhile(() => this.viewAgreementModel.isSubscribe)).
      subscribe((viewDetailList: string[]) => {
        if (!utils.isEmpty(viewDetailList)) {
          this.viewAgreementModel.detailsList = [];
          utils.forEach(viewDetailList, (detail: string) => {
            this.viewAgreementModel.detailsList.push({
              label: detail,
              value: detail
            });
          });
          if (!utils.isUndefined(this.localStore.getItem('agreementDetails', 'create', true))) {
            this.viewAgreementModel.detailType = this.localStore.getItem('agreementDetails', 'create', true);
            this.onChangeValue(this.viewAgreementModel.detailType);
          } else {
            this.viewAgreementModel.detailType = 'Line Haul';
            this.viewAgreementModel.showLineHaul = true;
          }
          this.changeDetector.detectChanges();
        }
      }, (error: HttpErrorResponse) => {
        this.viewAgreementModel.detailsList = [];
        this.changeDetector.detectChanges();
      });
  }
  mileageDatatableSubscription() {
    this.shared.on<string>('mileageCreate').pipe(takeWhile(() => this.viewAgreementModel.isSubscribe)).subscribe((name: string) => {
      this.viewAgreementModel.showViewMileageFlag = true;
      this.changeDetector.detectChanges();
    }, (error: Error) => {
      this.viewAgreementModel.showViewMileageFlag = false;
      ViewAgreementDetailsUtility.toastMessage(this.messageService, 'error', error.message);
      this.changeDetector.detectChanges();
    });
  }

  getStatus(data: AgreementDetails) {
    if (data && data.invalidReasonTypeName && data.expirationDate) {
      if (data.invalidReasonTypeName.toLowerCase() === 'active' && this.isActive(data.expirationDate)) {
        this.viewAgreementModel.agreementStatus = 'Active';
      } else {
        this.viewAgreementModel.agreementStatus = 'Inactive';
      }
    }
  }
  isActive(expirationDate: string): boolean {
    const currentDateValue = moment().format('YYYY-MM-DD');
    const expirationDateValue = moment(expirationDate).format('YYYY-MM-DD');
    if (currentDateValue <= expirationDateValue) {
      return true;
    }
    return false;
  }
  getAgreementName(data: AgreementDetails) {
    if (data && data.customerAgreementName) {
      this.viewAgreementModel.agreementName = data.customerAgreementName.substring(0, data.customerAgreementName.lastIndexOf('(')).trim();
    }
  }
  setManageTeams(data: AgreementDetails) {
    if (data && data.ultimateParentAccountID && data['customerAgreementID'] && data.effectiveDate && data.expirationDate) {
      this.viewAgreementModel.manageTeams = {
        'agreementName': data.customerAgreementName,
        'parentId': data.ultimateParentAccountID,
        'agreementId': data['customerAgreementID'],
        'effectiveDate': data.effectiveDate,
        'expirationDate': data.expirationDate
      };
    }
  }
  onTeamsClose(event: boolean) {
    this.viewAgreementModel.isManageTeams = event;
  }
  successCall(event: boolean) {
    this.toastMessage('success', 'Teams Updated',
      `You have updated Teams for ${this.viewAgreementModel.agreementName} Successfully`);
  }
  toastMessage(severity: string, summary: string, detail: string) {
    this.messageService.clear();
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail
    });
  }
  loader(event: boolean) {
    this.viewAgreementModel.isPageLoaded = event;
  }
  onTabChange(event: Event) {
    this.viewAgreementModel.accesorialType = event['originalEvent'].srcElement.innerText.toLowerCase();
  }
  setTabIndex(event) {
    this.viewAgreementModel.accessTabIndex = event.id;
    this.viewAgreementModel.accesorialType = event.text;
    if (this.viewAgreementModel.accesorialType === 'documentation' || this.viewAgreementModel.accesorialType === 'rules') {
      this.viewAgreementModel.rateTabflag = false;
    }
  }
  getAccessorialDocumentTab(id: number) {
    this.viewAgreementModel.accessorialTabLoading = true;
    this.service.getDocumentDetails(id).pipe(takeWhile(() => this.viewAgreementModel.isSubscribe)).subscribe((data) => {
      this.viewAgreementModel.showDocumentationTab = true;
      if (data) {
        this.viewAgreementModel.showAllTab = true;
        if (this.viewAgreementModel.rateTabflag) {
          this.viewAgreementModel.accesorialType = 'rates';
        }
      } else {
        this.viewAgreementModel.accesorialType = 'documentation';
      }
      this.viewAgreementModel.accessorialTabLoading = false;
      this.changeDetector.detectChanges();
    }, (accessorialError: Error) => {
      this.messageService.clear();
      this.messageService.add({severity: 'error', summary: `Pricing Accessorials Down`,
      detail: `Pricing Accessorials is down. Please contact JBH Helpdesk`});
      this.viewAgreementModel.accessorialTabLoading = false;
      this.changeDetector.detectChanges();
    });
  }

}
