import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import { Observable } from 'rxjs';

import { LocalStorageService } from '../../shared/jbh-app-services/local-storage.service';
import { BroadcasterService } from '../../shared/jbh-app-services/broadcaster.service';

import { ViewCarrierAgreementModel } from './model/view-carrier-agreement.model';
import { ViewCarrierAgreementService } from './service/view-carrier-agreement.service';
import { CanComponentDeactivate, CarrierDetails, Carrier, DetailList } from './model/view-carrier-agreeement.interface';

@Component({
  selector: 'app-view-carrier-agreement',
  templateUrl: './view-carrier-agreement.component.html',
  styleUrls: ['./view-carrier-agreement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewCarrierAgreementComponent implements OnInit, OnDestroy {
  viewCarrierAgreementModel: ViewCarrierAgreementModel;
  constructor(private readonly route: ActivatedRoute, private readonly service: ViewCarrierAgreementService,
    private readonly changeDetector: ChangeDetectorRef, private readonly formBuilder: FormBuilder,
    private readonly store: LocalStorageService, private readonly shared: BroadcasterService, private readonly router: Router) {
    this.viewCarrierAgreementModel = new ViewCarrierAgreementModel();
  }
  ngOnInit() {
    this.viewCarrierAgreementModel.dropdownForm = this.formBuilder.group({
      dropdown: ['']
    });
    this.getAgreementId();
    this.getDetailsList();
  }
  ngOnDestroy() {
    this.viewCarrierAgreementModel.isSubscribe = false;
  }
  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.viewCarrierAgreementModel.changedEvent = '';
    this.viewCarrierAgreementModel.isChangesAvailable = false;
    if (this.viewCarrierAgreementModel.dropdownForm.get('dropdown').value === 'Sections') {
      this.shared.broadcast('navigationStarts', true);
      this.viewCarrierAgreementModel.routingUrl = nextState.url;
      this.shared.on<boolean>('saved').pipe(takeWhile(() => this.viewCarrierAgreementModel.isSubscribe))
        .subscribe((index: boolean) => {
          this.viewCarrierAgreementModel.isChangesAvailable = index;
        });
      this.viewCarrierAgreementModel.isShowPopup = this.viewCarrierAgreementModel.isChangesAvailable;
      this.changeDetector.detectChanges();
    }
    return !this.viewCarrierAgreementModel.isChangesAvailable;
  }
  getAgreementId() {
    this.route.paramMap.subscribe((params: Params) => {
      this.viewCarrierAgreementModel.agreementId = Number(params.get('id'));
    });
    if (this.viewCarrierAgreementModel.agreementId) {
      this.viewCarrierAgreementModel.isPageLoaded = true;
      this.getAgreementDetails();
    }
  }
  getAgreementDetails() {
    this.service.getAgreementDetails(this.viewCarrierAgreementModel.agreementId)
      .pipe(takeWhile(() => this.viewCarrierAgreementModel.isSubscribe)).subscribe((data: CarrierDetails) => {
        this.viewCarrierAgreementModel.isPageLoaded = false;
        if (!utils.isEmpty(data)) {
          this.viewCarrierAgreementModel.agreementDetails = data;
          this.onClickOverlay();
        }
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.viewCarrierAgreementModel.isPageLoaded = false;
        this.viewCarrierAgreementModel.agreementDetails = null;
        this.changeDetector.detectChanges();
      });
  }
  onClickOverlay() {
    if (this.viewCarrierAgreementModel.agreementDetails && this.viewCarrierAgreementModel.agreementDetails.carriers &&
      this.viewCarrierAgreementModel.agreementDetails.carriers.length > 1) {
      this.viewCarrierAgreementModel.overlayData = [];
      const overlayValue = utils.slice(this.viewCarrierAgreementModel.agreementDetails.carriers, 1,
        this.viewCarrierAgreementModel.agreementDetails.carriers.length);
      utils.forEach(overlayValue, (value: Carrier) => {
        this.viewCarrierAgreementModel.overlayData.push(`${value.carrierName} (${value.carrierCode})`);
      });
      this.viewCarrierAgreementModel.showOverlayFlag = true;
    }
  }
  getDetailsList() {
    this.viewCarrierAgreementModel.isPageLoaded = true;
    this.service.getDetailsList().pipe(takeWhile(() => this.viewCarrierAgreementModel.isSubscribe)).subscribe((data: string[]) => {
      this.viewCarrierAgreementModel.isPageLoaded = false;
      if (data) {
        this.viewCarrierAgreementModel.detailsList = [];
        utils.forEach(data, (detail: string) => {
          this.viewCarrierAgreementModel.detailsList.push({ label: detail, value: detail });
        });
        this.setDefaultValue();
        this.changeDetector.detectChanges();
      }
    }, (error: HttpErrorResponse) => {
      this.viewCarrierAgreementModel.isPageLoaded = false;
      this.viewCarrierAgreementModel.detailsList = [];
      this.changeDetector.detectChanges();
    });
  }
  setDefaultValue() {
    let dropDownvalue = this.viewCarrierAgreementModel.defaultSetValue;
    if (!utils.isUndefined(this.store.getItem('agreementDetails', 'create', true))) {
      dropDownvalue = this.store.getItem('agreementDetails', 'create', true);
    }
    this.viewCarrierAgreementModel.dropdownForm.patchValue({ dropdown: dropDownvalue });
    this.onChangeValue(dropDownvalue);
  }
  setDropdownValue(event: string, eventName: string) {
    this.viewCarrierAgreementModel.changedEvent = event;
    this.viewCarrierAgreementModel.dropdownForm.patchValue({
      dropdown: eventName
    });
    this.viewCarrierAgreementModel.isShowPopup = true;
  }
  onChangeValue(value: string) {
    if (value !== 'Sections' && !utils.isUndefined(this.store.getItem('createCarrierSection', 'valueChanges', true))) {
      this.setDropdownValue(value, 'Sections');
    } else {
      this.resetVariables();
      switch (value.toLowerCase()) {
        case 'line haul':
          this.viewCarrierAgreementModel.isShowLineHaul = true;
          break;
        case 'sections':
          this.viewCarrierAgreementModel.isShowSections = true;
          break;
        case 'mileage':
          this.viewCarrierAgreementModel.isShowViewMileageFlag = true;
          break;
        default: break;
      }
    }
  }
  resetVariables() {
    this.viewCarrierAgreementModel.isShowLineHaul = false;
    this.viewCarrierAgreementModel.isShowSections = false;
    this.viewCarrierAgreementModel.isShowViewMileageFlag = false;
  }
  popupCancel() {
    this.viewCarrierAgreementModel.isShowPopup = false;
  }
  popupYes() {
    this.viewCarrierAgreementModel.isShowPopup = false;
    if (utils.isEmpty(this.viewCarrierAgreementModel.changedEvent)) {
      this.shared.broadcast('loseChanges', true);
      this.router.navigate([this.viewCarrierAgreementModel.routingUrl]);
    } else {
      this.store.clearItem('createCarrierSection', 'valueChanges', true);
      this.viewCarrierAgreementModel.dropdownForm.patchValue({
        dropdown: this.viewCarrierAgreementModel.changedEvent
      });
      this.onChangeValue(this.viewCarrierAgreementModel.changedEvent);
      this.viewCarrierAgreementModel.changedEvent = '';
    }
  }
  loader(event: boolean) {
    this.viewCarrierAgreementModel.isPageLoaded = event;
  }
}
