import { Component, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Input, OnDestroy, OnInit,
  Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { Table } from 'primeng/table';

import { LocalStorageService } from '../../../../shared/jbh-app-services/local-storage.service';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';

import { CreateCarrierSectionModel } from './model/create-carrier-section.model';
import { CreateCarrierSectionService } from './service/create-carrier-section.service';
import { RootObject, Embedded, CarrierSegmentTypesItem, ServiceOfferingBusinessUnit,
ESRootObject, BucketsItem, BillToAccountItem, CarrierDetails } from './model/create-carrier-section.interface';
import { DateValidation } from '../../../../shared/jbh-app-services/date-validation';
import { CreateCarrierSectionQuery } from './query/create-carrier-section.query';
import { CreateCarrierSectionUtility } from './service/create-carrier-section-utility';
@Component({
  selector: 'app-create-carrier-section',
  templateUrl: './create-carrier-section.component.html',
  styleUrls: ['./create-carrier-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCarrierSectionComponent implements OnInit, OnDestroy {
  createSectionModel: CreateCarrierSectionModel;
  @Input() set agreementDetails(agreementDetails: CarrierDetails) {
    this.createSectionModel.carrierDetails = agreementDetails;
  }
  @Output() splitCloseEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() loaderEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('codestable') codestable: Table;
  constructor(private readonly formBuilder: FormBuilder, private readonly service: CreateCarrierSectionService,
    private readonly changeDetector: ChangeDetectorRef, private readonly messageService: MessageService,
    private readonly store: LocalStorageService, private readonly shared: BroadcasterService, private readonly route: ActivatedRoute) {
    this.createSectionModel = new CreateCarrierSectionModel();
  }
  ngOnInit() {
    this.route.paramMap.pipe(takeWhile(() => this.createSectionModel.isSubscribeFlag)).subscribe((params: Params) => {
      this.createSectionModel.agreementId = Number(params.get('id'));
    });
    this.createSectionForm();
    this.callCarrierSegmentType();
    this.callBusinessUnit();
    this.valueChangesSubscription();
    this.navigationSubscription();
    this.saveSubscription();
  }
  ngOnDestroy() {
    this.createSectionModel.isSubscribeFlag = false;
  }
  /** function called when the page navigation starts and it checks for dirty formfields
   * @memberof CreateCarrierSectionComponent */
  navigationSubscription() {
    this.shared.on<boolean>('navigationStarts').pipe(takeWhile(() => this.createSectionModel.isSubscribeFlag))
    .subscribe((value: boolean) => {
      this.changeDetector.detectChanges();
      this.shared.broadcast('saved', this.createSectionModel.carrierSectionForm.touched &&
      this.createSectionModel.carrierSectionForm.dirty);
    });
  }
  /** function called on page navigation to make the form as pristine & untouched
   * @memberof CreateCarrierSectionComponent */
  saveSubscription() {
    this.shared.on<boolean>('loseChanges').pipe(takeWhile(() => this.createSectionModel.isSubscribeFlag)).subscribe((value: boolean) => {
      this.changeDetector.detectChanges();
      this.createSectionModel.carrierSectionForm.markAsPristine();
      this.createSectionModel.carrierSectionForm.markAsUntouched();
    });
  }
  /** function called when the value of the formfields are changed
   * @memberof CreateCarrierSectionComponent */
  valueChangesSubscription() {
    this.createSectionModel.carrierSectionForm.valueChanges.pipe(takeWhile(() => this.createSectionModel.isSubscribeFlag))
    .subscribe((value: object) => {
      const isValueChanged = this.createSectionModel.carrierSectionForm.touched && this.createSectionModel.carrierSectionForm.dirty;
      this.store.setItem('createCarrierSection', 'valueChanges', isValueChanged, true);
      this.changeDetector.detectChanges();
    });
  }
  /** function to create all the formfields
   * @memberof CreateCarrierSectionComponent */
  createSectionForm() {
    this.createSectionModel.carrierSectionForm = this.formBuilder.group({
      carrierSegment: [null, Validators.required],
      businessUnit: [null],
      sectionName: [null, Validators.required],
      effectiveDate: [null, Validators.required],
      expirationDate: [null, Validators.required],
      account: [null]
    });
    if (!utils.isUndefined(this.createSectionModel.carrierDetails) && !utils.isNull(this.createSectionModel.carrierDetails) &&
    !utils.isNull(this.createSectionModel.carrierDetails.agreementExpirationDate)) {
      const expiration = new Date(this.createSectionModel.carrierDetails.agreementExpirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
      this.createSectionModel.carrierSectionForm.patchValue({ expirationDate: expiration });
    }
  }
  /** function to call carrier segment type service
   * @memberof CreateCarrierSectionComponent */
  callCarrierSegmentType() {
    this.loaderEvent.emit(true);
    this.service.getCarrierSegmentTypes().pipe(takeWhile(() => this.createSectionModel.isSubscribeFlag))
    .subscribe((segmentType: RootObject) => {
      if (!utils.isEmpty(segmentType) && !utils.isEmpty(segmentType._embedded)) {
        this.createSectionModel.carrierSegmentList = this.getCarrierSegmentList(segmentType._embedded);
        this.createSectionModel.carrierSegmentFilteredList = this.createSectionModel.carrierSegmentList;
      }
      this.loaderEvent.emit(false);
      this.changeDetector.detectChanges();
    }, (error: HttpErrorResponse) => {
      this.loaderEvent.emit(false);
      this.createSectionModel.carrierSegmentList = [];
      this.createSectionModel.carrierSegmentFilteredList = [];
      this.changeDetector.detectChanges();
    });
  }

  getCarrierSegmentList(segmentType: Embedded): SelectItem[] {
    const listValues = [];
    utils.forEach(segmentType.carrierSegmentTypes, (carrierSegmentType: CarrierSegmentTypesItem) => {
      const value = { label: carrierSegmentType.carrierSegmentTypeName, value: carrierSegmentType };
      listValues.push(value);
      if (carrierSegmentType.defaultIndicator.toLowerCase() === 'y') {
        this.createSectionModel.carrierSectionForm.patchValue({carrierSegment: value});
        this.onCarrierSegmentSelect(value);
      }
    });
    return listValues;
  }
  /** auto complete field search function to filter the search results
   * @param {string} value
   * @param {string} fullKey
   * @param {string} filteredkey
   * @memberof CreateCarrierSectionComponent */
  onAutoCompleteSearch(value: string, fullKey: string, filteredkey: string) {
    const filteredList = [];
    utils.forEach(this.createSectionModel[fullKey], (result: SelectItem) => {
      if (result.label.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        filteredList.push(result);
      }
    });
    this.createSectionModel[filteredkey] = filteredList;
  }
  /** auto complete field clear function called when the filed is empty
   * @param {string} value
   * @param {string} controlName
   * @memberof CreateCarrierSectionComponent */
  onAutoCompleteClear(value: string, controlName: string) {
    if (utils.isEmpty(value)) {
      this.createSectionModel.carrierSectionForm.controls[controlName].setValue(value);
      this.createSectionModel.carrierSectionForm.updateValueAndValidity();
    }
    if (controlName === 'account') {
      CreateCarrierSectionUtility.clearTableData(this.createSectionModel, this.codestable);
    }
  }
  /** function called when carrer segment is selected to patch the businessunit value
   * @param {SelectItem} event
   * @memberof CreateCarrierSectionComponent */
  onCarrierSegmentSelect(event: SelectItem) {
    this.createSectionModel.carrierSectionForm.controls['businessUnit'].setValue({ label: event.value.defaultBusinessUnitCode,
    value: event.value.defaultBusinessUnitCode});
    this.createSectionModel.carrierSectionForm.updateValueAndValidity();
  }
  /** function to call businessunit service
   * @memberof CreateCarrierSectionComponent */
  callBusinessUnit() {
    this.service.getBusinessUnit().pipe(takeWhile(() => this.createSectionModel.isSubscribeFlag))
    .subscribe((dataList: RootObject) => {
      if (!utils.isEmpty(dataList) && !utils.isEmpty(dataList._embedded) &&
      !utils.isEmpty(dataList._embedded.serviceOfferingBusinessUnitTransitModeAssociations)) {
        this.createSectionModel.buList = this
        .getBusinessUnit(dataList._embedded.serviceOfferingBusinessUnitTransitModeAssociations);
        this.createSectionModel.buFilteredList = this.createSectionModel.buList;
      }
      this.changeDetector.detectChanges();
    }, (error: HttpErrorResponse) => {
      this.createSectionModel.buList = [];
      this.createSectionModel.buFilteredList = [];
      this.changeDetector.detectChanges();
    });
  }

  getBusinessUnit(data: ServiceOfferingBusinessUnit[]): SelectItem[] {
    const businessUnitList = [];
    utils.forEach(data, (dataValue: ServiceOfferingBusinessUnit) => {
      businessUnitList.push({
        label: dataValue.financeBusinessUnitServiceOfferingAssociation.financeBusinessUnitCode,
        value: dataValue.financeBusinessUnitServiceOfferingAssociation.financeBusinessUnitCode});
    });
    return businessUnitList;
  }
  /** function called when date is selected in calendar field
   * @param {Date} value
   * @param {number} key
   * @memberof CreateCarrierSectionComponent */
  onDateSelected(value: Date, key: number) {
    if (key === 0) {
      this.createSectionModel.expirationMinDate = new Date(value);
    } else {
      this.createSectionModel.effectiveMaxDate = new Date(value);
    }
    const fieldName = (key === 0) ? 'effective' : 'expiration';
    this.onTypeDate(moment(value).format('MM/DD/YYYY'), fieldName);
  }
  onFilter() {
    this.createSectionModel.isBillToLoading = false;
  }
  /** function called when date is typed manually in calendar field
   * @param {string} event
   * @param {string} fieldName
   * @memberof CreateCarrierSectionComponent */
  onTypeDate(event: string, fieldName: string) {
    if (!utils.isEmpty(event)) {
      DateValidation.onTypeDate(fieldName, this.createSectionModel, 'carrierSectionForm');
      DateValidation.validateDateFormat(event, fieldName, this.createSectionModel);
      DateValidation.setFormErrors(this.createSectionModel, 'carrierSectionForm');
    } else {
      const formField = `${fieldName}Date`;
      this.createSectionModel.carrierSectionForm.controls[formField].setErrors(null);
      this.createSectionModel.carrierSectionForm.controls[formField].setErrors({required: true});
    }
    this.onAccountSelect(this.createSectionModel.carrierSectionForm.get('account').value);
  }
  /** function to fetch account when value is typed in find account field
   * @param {string} event
   * @memberof CreateCarrierSectionComponent */
  onAccountSearch(event: string) {
    const query = CreateCarrierSectionQuery.getAccountNameQuery(event);
    this.service.getAccountName(query).pipe(takeWhile(() => this.createSectionModel.isSubscribeFlag))
    .subscribe((data: ESRootObject) => {
      this.handleAccountSearchData(data);
      this.changeDetector.detectChanges();
    }, (error: HttpErrorResponse) => {
      this.changeDetector.detectChanges();
      this.createSectionModel.accountList = [];
    });
  }
  /** function to traverse the ES response to get the account name
   * @param {ESRootObject} data
   * @memberof CreateCarrierSectionComponent */
  handleAccountSearchData(data: ESRootObject) {
    const resultList = [];
    if (!utils.isEmpty(data) && !utils.isEmpty(data.aggregations) &&
      !utils.isEmpty(data.aggregations.unique) && !utils.isEmpty(data.aggregations.unique.buckets)) {
      utils.forEach(data.aggregations.unique.buckets, (bucket: BucketsItem) => {
        if (bucket.key && !utils.isEmpty(bucket.Level) && !utils.isEmpty(bucket.Level.hits) && !utils.isEmpty(bucket.Level.hits.hits)) {
          resultList.push(CreateCarrierSectionUtility.getSearchResults(bucket.Level.hits.hits));
        }
      });
    }
    this.createSectionModel.accountList = resultList;
  }
  /** function called when account is selected to fetch the bill to accounts
   * @param {SelectItem} event
   * @memberof CreateCarrierSectionComponent */
  onAccountSelect(event: SelectItem) {
    CreateCarrierSectionUtility.clearTableData(this.createSectionModel, this.codestable);
    if (!utils.isEmpty(event) && !utils.isEmpty(event.value)) {
      const param = CreateCarrierSectionUtility.getRequestParam(this.createSectionModel);
      this.createSectionModel.isBillToLoading = true;
      this.service.getBillToAccounts(event.value.OrganizationID, param).pipe(takeWhile(() => this.createSectionModel.isSubscribeFlag))
      .subscribe((data: BillToAccountItem[]) => {
        this.createSectionModel.filteredCodesList = [];
        utils.forEach(data, (billToAccount: BillToAccountItem) => {
          this.createSectionModel.isBillToLoading = false;
          this.createSectionModel.filteredCodesList.push({
            billToDisplay: `${billToAccount.billingPartyName} (${billToAccount.billingPartyCode})`,
            assignment: utils.isNull(billToAccount.sectionName) ? 'Unassigned' : billToAccount.sectionName,
            rowDetail: billToAccount
          });
          this.createSectionModel.billToCount = utils.uniqBy(this.createSectionModel.filteredCodesList, 'rowDetail.billingPartyID').length;
        });
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.createSectionModel.isBillToLoading = false;
        this.changeDetector.detectChanges();
      });
    }
  }
  /** function called when save button is clicked
   * @memberof CreateCarrierSectionComponent */
  onClickSave() {
    if (this.createSectionModel.carrierSectionForm.valid) {
      this.loaderEvent.emit(true);
      const requestParam = CreateCarrierSectionUtility.createSaveRequest(this.createSectionModel);
      this.service.saveCarrierSection(requestParam, this.createSectionModel.agreementId).pipe(takeWhile(() => this.createSectionModel
      .isSubscribeFlag)).subscribe((data: HttpResponseBase) => {
        this.cancelSplitView();
        this.loaderEvent.emit(false);
        this.showToastMessage('success', 'Section Created!', 'You have created the section successfully!');
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        const errorObj = CreateCarrierSectionUtility.handleError(error);
        this.showToastMessage('error', errorObj.title, errorObj.message);
        this.loaderEvent.emit(false);
        this.changeDetector.detectChanges();
      });
    } else {
      utils.forIn(this.createSectionModel.carrierSectionForm.controls, (value: FormControl, name: string) => {
        this.createSectionModel.carrierSectionForm.controls[name].markAsTouched();
      });
      this.showToastMessage('error', 'Missing Required Information',
      'Provide the required information in the highlighted fields and submit the form again');
    }
  }
  /** function to display success or error as toast message
   * @param {string} type
   * @param {string} title
   * @param {string} message
   * @memberof CreateCarrierSectionComponent */
  showToastMessage(type: string, title: string, message: string) {
    this.messageService.clear();
    this.messageService.add({
      severity: type,
      summary: title,
      detail: message
    });
  }
  /** function called when cancel button is clicked
   * @memberof CreateCarrierSectionComponent */
  onClickCancel() {
    if (this.createSectionModel.carrierSectionForm.dirty && this.createSectionModel.carrierSectionForm.touched) {
      this.createSectionModel.isShowPopup = true;
    } else {
      this.cancelSplitView();
    }
  }
  /** function called to close the splitview through confirmation popup
   * @memberof CreateCarrierSectionComponent */
  cancelSplitView() {
    this.createSectionModel.carrierSectionForm.reset();
    this.store.clearItem('createCarrierSection', 'valueChanges', true);
    this.createSectionModel.selectedCodesList = [];
    this.splitCloseEvent.emit(false);
  }
  /** function to cancel the confirmation popup
   * @memberof CreateCarrierSectionComponent */
  popupCancel() {
    this.createSectionModel.isShowPopup = false;
  }
}
