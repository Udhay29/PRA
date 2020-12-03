import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DrayGroupModel } from './model/dray-group.model';
import { DrayGroupQuery } from './query/dray-group.query';
import { DrayGroupService } from './service/dray-group.service';
import { takeWhile } from 'rxjs/operators';
import { MessageService } from 'primeng/components/common/messageservice';
import { DrayGroupUtilsService } from './service/dray-group-utils.service';
import { TimeZoneService } from '../../../../shared/jbh-app-services/time-zone.service';
import * as utils from 'lodash';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-dray-group',
  templateUrl: './dray-group.component.html',
  styleUrls: ['./dray-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DrayGroupComponent implements OnInit, OnDestroy {
  @ViewChild('createDrayGroupForm') createDrayGroupForm;
  drayGroupModel: DrayGroupModel;

  constructor(private readonly drayGroupService: DrayGroupService, private readonly changeDetector: ChangeDetectorRef,
    private readonly messageService: MessageService, private readonly drayGrpUtilsServc: DrayGroupUtilsService,
    private readonly router: Router) {
    this.drayGroupModel = new DrayGroupModel();
  }

  ngOnInit() {
    this.getGridValues(this.drayGroupModel.searchText, this.drayGroupModel.from, this.drayGroupModel.size,
      this.drayGroupModel.sortField, this.drayGroupModel.sortOrder);
    this.drayGroupModel.drayGroupFlag = false;
  }

  ngOnDestroy() {
    this.drayGroupModel.isSubscriberFlag = false;
  }

  getGridValues(searchText, from, size, field, order) {
    this.drayGroupModel.isPageLoading = true;
    const params = DrayGroupQuery.getDrayGroupView(searchText, from, size, field, order);
    this.drayGroupService.getDrayGroup(params).pipe(takeWhile(() => this.drayGroupModel.isSubscribe)).subscribe(data => {
      if (!utils.isEmpty(data)) {
        this.drayGroupModel.totalRuleRecords = data['hits']['total'];
        this.drayGroupModel.isRuleRecordEmpty = this.drayGroupModel.totalRuleRecords === 0;
        this.drayGroupModel.drayGroupArray = data['hits']['hits'].map((drayGroup) => {
          const drayGroupItem = drayGroup['_source'];
          drayGroupItem['countriesToShow'] = drayGroupItem.drayGroupCountries.map((country) => country.drayGroupCountryName).join(', ');
          return drayGroupItem;
        });
      }
      this.drayGroupModel.isPageLoading = false;
      this.changeDetector.detectChanges();
    }, (error) => {
      this.drayGrpUtilsServc.handleError(error, this.drayGroupModel, this.messageService, this.changeDetector);
    });
  }
  onPage(event: Event) {
    this.drayGroupModel.from = event['first'];
    this.drayGroupModel.size = event['rows'];
    this.getGridValues(this.drayGroupModel.searchText, this.drayGroupModel.from, this.drayGroupModel.size,
      this.drayGroupModel.sortField, this.drayGroupModel.sortOrder);
  }
  loadConfigValuesLazy(event) {
    this.drayGroupModel.from = event['first'];
    this.drayGroupModel.size = event['rows'];
    this.drayGroupModel.sortOrder = (event['sortOrder'] === 1) ? 'asc' : 'desc';
  }
  onSortSelect(fieldName) {
    this.drayGroupModel.sortField = fieldName;
    this.getGridValues(this.drayGroupModel.searchText, this.drayGroupModel.from, this.drayGroupModel.size,
      this.drayGroupModel.sortField, this.drayGroupModel.sortOrder);
  }
  loadDrayGroupData(query: object) {
    let drayGroup = [];
    this.drayGroupModel.isPageLoading = true;
    this.drayGroupService.getDrayGroup(query)
      .pipe(takeWhile(() => true)).subscribe((data) => {
        drayGroup = data['hits']['hits'].map(this.parseDrayGroupData.bind(this));
        this.drayGroupModel.isPageLoading = false;
        this.drayGroupModel.drayGroupArray = drayGroup;
        this.drayGroupModel.totalRuleRecords = data['hits']['total'];
        this.drayGroupModel.isRuleRecordEmpty = this.drayGroupModel.totalRuleRecords === 0;
        this.changeDetector.detectChanges();
      }, (error) => {
        this.drayGrpUtilsServc.handleError(error, this.drayGroupModel, this.messageService, this.changeDetector);
      });
  }

  parseDrayGroupData(drayGroup) {
    drayGroup = drayGroup['_source'];
    drayGroup['countriesToShow'] = drayGroup.drayGroupCountries.map((country) => country.drayGroupCountryName).join(', ');
    return drayGroup;
  }


  onCreateDrayGroup() {
    this.drayGroupModel.splitScreenData = {
      isCreate: true,
      titleText: 'Create'
    };
    this.drayGroupModel.isShowDrayGroupCreation = true;
    this.drayGroupModel.drayGroupCreatebutton = true;
  }

  showPopupEvent(event: boolean) {
    this.drayGroupModel.formChanged = event;
  }

  canDeactivate(component: CanDeactivateGuardService, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.drayGroupModel.showPopup = false;
    this.drayGroupModel.routingUrl = nextState.url;
    if (this.drayGroupModel.formChanged) {
      this.drayGroupModel.showPopup = true;
    }
    this.changeDetector.detectChanges();
    return !this.drayGroupModel.formChanged;
  }

  onClickPopupNo() {
    this.drayGroupModel.showPopup = false;
  }

  onClickPopupYes() {
    this.drayGroupModel.formChanged = false;
    this.router.navigate([this.drayGroupModel.routingUrl]);
    this.drayGroupModel.showPopup = false;
  }

  closeClick() {
    this.drayGroupModel.isShowDrayGroupCreation = false;
  }
  onCreateClose() {
    this.getGridValues(this.drayGroupModel.searchText, this.drayGroupModel.from, this.drayGroupModel.size,
      this.drayGroupModel.sortField, this.drayGroupModel.sortOrder);
    this.drayGroupModel.isShowDrayGroupCreation = false;
  }
  searchDrayGroup(event) {
    this.drayGroupModel.searchFlag = true;
    const from = 0;
    this.drayGroupModel.drayGroupArray = [];
    this.drayGroupModel.searchText = `${event['target']['value'].replace(/[[\]{}() *:\"~&/!?\\^$|]/g, '\\$&')}`;
    this.drayGroupModel.searchText = this.drayGroupModel.searchText ? this.drayGroupModel.searchText : '*';
    this.getGridValues(this.drayGroupModel.searchText, this.drayGroupModel.from, this.drayGroupModel.size,
      this.drayGroupModel.sortField, this.drayGroupModel.sortOrder);
    this.changeDetector.detectChanges();
  }

  onDrayGroupKeyPress() {
    this.drayGroupModel.isShowDrayGroupCreation = false;
  }

  checkIfDrayGroupFormIsTouched() {
    const drayGroupForm = this.createDrayGroupForm.drayGroupModel.drayGroupForm;
    utils.forIn(drayGroupForm.value, (value: FormControl, name: string) => {
      if (name !== 'expirationDate' && name !== 'rateScopeTypeName' && drayGroupForm.value[name]) {
        this.drayGroupModel.showSearchPopup = true;
      }
    });
  }

  onClickSearchFocusPopupYes() {
    this.drayGroupModel.isShowDrayGroupCreation = false;
    this.drayGroupModel.showSearchPopup = false;
    this.changeDetector.detectChanges();
  }
  onClickSearchPopupNo() {
    this.drayGroupModel.showSearchPopup = false;
    this.changeDetector.detectChanges();
  }


}
