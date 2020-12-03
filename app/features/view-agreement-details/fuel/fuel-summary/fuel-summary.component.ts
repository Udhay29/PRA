import { Router, RouterStateSnapshot } from '@angular/router';
import { HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter,
  OnDestroy, OnInit, Output, ViewChild, ElementRef
} from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { takeWhile, debounceTime } from 'rxjs/operators';
import * as utils from 'lodash';
import { MessageService } from 'primeng/components/common/messageservice';

import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { FuelSummaryModel } from './model/fuel-summary.model';
import { AgreementDetails, BillToList, RootObject, CarrierRootObject, SaveResponse } from './model/fuel-summary.interface';
import { FuelSummaryUtility } from './service/fuel-summary-utility';
import { FuelSummaryHelperUtility } from './service/fuel-summary-helper-utility';
import { FuelSummaryService } from './service/fuel-summary.service';
import { FuelSummaryQuery } from './query/fuel-summary.query';
import * as moment from 'moment';

@Component({
  selector: 'app-fuel-summary',
  templateUrl: './fuel-summary.component.html',
  styleUrls: ['./fuel-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuelSummaryComponent implements OnInit, OnDestroy {
  fuelSummaryModel: FuelSummaryModel;
  @Output() fuelLoaderEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('billtotable') billtotable;
  constructor(
    private readonly shared: BroadcasterService, private readonly changeDetector: ChangeDetectorRef,
    private readonly messageService: MessageService, private readonly formBuilder: FormBuilder,
    private readonly service: FuelSummaryService, private readonly router: Router) {
    this.fuelSummaryModel = new FuelSummaryModel();
  }
  /** ngOnInit life cycle hook of FuelSummaryComponent  * @memberof FuelSummaryComponent */
  ngOnInit() {
    this.fuelSummaryModel.fuelSummaryForm = FuelSummaryUtility.createFuelSummaryForm(this.formBuilder, this.fuelSummaryModel);
    this.getAffiliationLevel();
    this.getBusinessUnitServiceOffering();
    this.navigationSubscription();
    this.saveSubscription();
    this.getSharedAgreementDetails();
    this.valueChangesSubscription();
  }
  /** ngOnDestroy life cycle hook of FuelSummaryComponent * @memberof FuelSummaryComponent */
  ngOnDestroy() {
    this.fuelSummaryModel.isSubscribe = false;
  }
  /** function called when navigation changes and check whether the form field is touched * @memberof FuelSummaryComponent */
  navigationSubscription() {
    this.shared.on<RouterStateSnapshot>('navigationStarts').subscribe((value: RouterStateSnapshot) => {
      this.shared.broadcast('isChanged', this.fuelSummaryModel.fuelSummaryForm.dirty && this.fuelSummaryModel.fuelSummaryForm.touched);
      this.changeDetector.detectChanges();
    });
  }
  /** subcribing broadcast function to check the need to remain in same page or to route * @memberof FuelSummaryComponent */
  saveSubscription() {
    this.shared.on<boolean>('loseChanges').subscribe((value: boolean) => {
      FuelSummaryHelperUtility.saveSubscription(value, this.fuelSummaryModel);
    });
  }
  /** subscribing broadcasted agreementDetailsforFuel and patch default values to the date field * @memberof FuelSummaryComponent */
  getSharedAgreementDetails() {
    this.shared.on<AgreementDetails>('agreementDetailsforFuel').pipe(takeWhile(() => this.fuelSummaryModel.isSubscribe))
      .subscribe((agreementDetails: AgreementDetails) => {
        if (!utils.isEmpty(agreementDetails)) {
          FuelSummaryHelperUtility.patchDateValues(this.fuelSummaryModel, agreementDetails);
          this.onDateSelected(new Date(), 0);
          this.onDateSelected(new Date(agreementDetails.expirationDate.replace(/-/g, '\/').replace(/T.+/, '')), 1);
        }
        this.changeDetector.detectChanges();
      });
  }
  /** function called when date is selected using calendar * @param {Date} value
   * @param {number} key
   * @memberof FuelSummaryComponent */
  onDateSelected(value: Date, key: number) {
    FuelSummaryUtility.onDateSelect(value, key, this.fuelSummaryModel);
  }
  /***** @memberof FuelSummaryComponent*/
  checkDateValues() {
    if (FuelSummaryHelperUtility.checkValid(this.fuelSummaryModel) && this.fuelSummaryModel.fuelSummaryForm.get('affiliationLevel').value) {
      this.affilicationChange(this.fuelSummaryModel.fuelSummaryForm.controls['affiliationLevel'].value);
    } else {
      this.fuelSummaryModel.billToList = [];
      this.fuelSummaryModel.itemList = [];
    }
  }
  /** function called when user enters the date in date field
   * @param {Event} event
   * @param {string} fieldName
   * @memberof FuelSummaryComponent */
  onTypeDate(event, fieldName: string) {
    this.fuelSummaryModel.isNotValidDate = false;
    switch (fieldName) {
      case 'effective':
        if (this.fuelSummaryModel.fuelSummaryForm.controls['effectiveDate'].value) {
          FuelSummaryUtility.onTypeEffectiveDate(this.fuelSummaryModel);
        }
        break;
      case 'expiration':
        if (this.fuelSummaryModel.fuelSummaryForm.controls['expirationDate'].value) {
          FuelSummaryUtility.onTypeExpirationDate(this.fuelSummaryModel);
        }
        break;
      default: break;
    }
    FuelSummaryUtility.validateDateFormat(event, fieldName, this.fuelSummaryModel);
    FuelSummaryUtility.setFormErrors(this.fuelSummaryModel);
  }
  /** function to get the dropdown list for businessunit and service offering * @memberof FuelSummaryComponent */
  getBusinessUnitServiceOffering() {
    this.fuelLoaderEvent.emit(true);
    this.service.getBusinessUnitServiceOffering().pipe(takeWhile(() => this.fuelSummaryModel.isSubscribe))
      .subscribe((offeringList: RootObject) => {
        this.fuelLoaderEvent.emit(false);
        this.fuelSummaryModel.businessUnitServiceOfferingList = FuelSummaryUtility.getBusinessUnitServiceOfferingList(offeringList);
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.fuelLoaderEvent.emit(false);
        this.changeDetector.detectChanges();
      });
  }
  /** function called when businessunit field value changes * @memberof FuelSummaryComponent */
  onBusinessUnitChange() {
    this.onClearValues('businessUnit');
  }
  /** function to call elastic search to fetch carrier details based on entered value
   * @param {Event} event
   * @memberof FuelSummaryComponent */
  onSearchCarrier(event: Event) {
    const carrierList = [];
    let carrierListTemp = [];
    const carrierQuery = FuelSummaryQuery.getCarrierDetails(event['query']);
    this.service.getCarrierDetails(carrierQuery).pipe(takeWhile(() => this.fuelSummaryModel.isSubscribe))
      .subscribe((carrierDetails: CarrierRootObject) => {
        if (!utils.isEmpty(carrierDetails) && !utils.isEmpty(carrierDetails.hits) && !utils.isEmpty(carrierDetails.hits.hits)) {
          const data = carrierDetails.aggregations.unique.buckets;
          data.forEach(element => {
            carrierListTemp = FuelSummaryUtility.getCarrierList(element.Level.hits.hits);
            carrierList.push({
              legalName: carrierListTemp[0].legalName,
              carrierID: carrierListTemp[0].carrierID,
              carrierCode: carrierListTemp[0].carrierCode,
              carrierDisplayName: carrierListTemp[0].carrierDisplayName
            });
          });
        }
        this.fuelSummaryModel.carrierList = carrierList;
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.fuelSummaryModel.carrierList = [];
        this.changeDetector.detectChanges();
      });
  }
  /** function called when cancel button is clicked to go to previous page * @memberof FuelSummaryComponent */
  onCancel() {
    this.router.navigate(['/viewagreement'], { queryParams: { id: this.fuelSummaryModel.agreementDetails.customerAgreementID } });
  }
  /** function to save the fuel summary details when next button is clicked * @memberof FuelSummaryComponent */
  onNext() {
    if (this.fuelSummaryModel.fuelSummaryForm.touched && this.fuelSummaryModel.fuelSummaryForm.valid) {
      if (this.fuelSummaryModel.fuelSummaryForm.get('affiliationLevel').value === 'contract' &&
        utils.isEmpty(this.fuelSummaryModel.selectedItemList)) {
        FuelSummaryUtility.toastMessage(this.messageService, 'error', this.fuelSummaryModel.errorMessage, 'Select a contract');
      } else if (this.fuelSummaryModel.fuelSummaryForm.get('affiliationLevel').value === 'section' &&
        utils.isEmpty(this.fuelSummaryModel.selectedItemList)) {
        FuelSummaryUtility.toastMessage(this.messageService, 'error', this.fuelSummaryModel.errorMessage, 'Select a section');
      } else {
        FuelSummaryHelperUtility.formatRequest(this.fuelSummaryModel);
        const requestFormat = FuelSummaryUtility.createSaveRequest(this.fuelSummaryModel);
        this.fuelLoaderEvent.emit(true);
        this.service.fuelSummarySave(requestFormat).pipe(takeWhile(() => this.fuelSummaryModel.isSubscribe))
          .subscribe((data: HttpResponseBase) => {
            this.saveSuccess(data);
          }, (error: HttpErrorResponse) => {
            this.fuelLoaderEvent.emit(false);
            this.changeDetector.detectChanges();
          });
      }
    } else {
      FuelSummaryHelperUtility.onClickNext(this.fuelSummaryModel, this.messageService);
    }
  }
  /** function to handle success on saving of fuel summary
   * @param {HttpResponseBase} data
   * @memberof FuelSummaryComponent
   */
  saveSuccess(data: HttpResponseBase) {
    if (!utils.isEmpty(data) && data.status === 201) {
      this.fuelLoaderEvent.emit(false);
      FuelSummaryUtility.toastMessage(this.messageService, 'success', 'Success', 'You have successfully created Fuel Program Summary');
      this.changeDetector.detectChanges();
      this.shared.broadcast('fuelStepIndexChange', 'next');
      this.fuelSummaryModel.customerAgreementDetails['fuelProgramID'] = parseInt(data.headers.get('fuelProgramID'), 10);
      this.fuelSummaryModel.customerAgreementDetails['fuelProgramVersionID'] = parseInt(data.headers.get('fuelProgramVersionID'), 10);
      this.fuelSummaryModel.customerAgreementDetails['agreementID'] = this.fuelSummaryModel.agreementDetails['customerAgreementID'];
      this.shared.broadcast('agreementDetails', this.fuelSummaryModel.customerAgreementDetails);
    }
  }
  /** function to load the affiliation level values * @memberof FuelSummaryComponent */
  getAffiliationLevel() {
    this.service.getAffiliation().pipe(takeWhile(() => this.fuelSummaryModel.isSubscribe)).subscribe((affiliationList: string[]) => {
      if (!utils.isEmpty(affiliationList)) {
        FuelSummaryHelperUtility.getAffiliation(this.fuelSummaryModel, affiliationList);
        this.fuelSummaryModel.fuelSummaryForm.updateValueAndValidity();
        this.changeDetector.detectChanges();
        FuelSummaryUtility.checkSelectedData(this.fuelSummaryModel, 'agreement');
      }
    });
  }
  /**** * @param {Event} event * @memberof FuelSummaryComponent */
  affiliationChanged(event) {
    if (this.fuelSummaryModel.affiliationValue !== event['value']) {
      this.fuelSummaryModel.selectedOption = event['value'];
      FuelSummaryHelperUtility.clearFilterData(this.billtotable);
      this.fuelSummaryModel.noRecordMsgFlag = false;
      this.fuelSummaryModel.selectedAffiliationValue = event['value'];
      FuelSummaryUtility.checkSelectedData(this.fuelSummaryModel, event);
      if (this.fuelSummaryModel.selectedAffiliationValue === this.fuelSummaryModel.fuelSummaryForm.get('affiliationLevel').value) {
        this.affilicationChange(event['value']);
      }
    }
  }

  sectionLevelValidation() {
    let arrayValues = [];
    if (this.fuelSummaryModel.selectedOption === 'section') {
      this.fuelSummaryModel.selectedItemList.forEach(value => {
        arrayValues.push({
          'data': value['currencyCode']
        });
      });
      arrayValues = utils.uniqBy(arrayValues, 'data');
    }
    if (arrayValues.length > 1) {
      FuelSummaryUtility.toastMessage(this.messageService, 'error', 'Error',
        'Sections have conflicting currencies defined; please select sections where currency agrees');
    }
  }
  /***** @param {string} value  * @memberof FuelSummaryComponent */
  affilicationChange(value: string) {
    FuelSummaryUtility.resetShowFlags(this.fuelSummaryModel);
    switch (value) {
      case 'agreement':
        FuelSummaryHelperUtility.affiliationChangeAgreement(this.fuelSummaryModel);
        if (FuelSummaryHelperUtility.checkValid(this.fuelSummaryModel)) {
          this.getBillToList();
        }
        break;
      case 'contract':
        FuelSummaryHelperUtility.affiliationChangeContract(this.fuelSummaryModel);
        if (FuelSummaryHelperUtility.checkValid(this.fuelSummaryModel)) {
          this.getContractOrSectionListItem();
        }
        break;
      case 'section':
        FuelSummaryHelperUtility.affiliationChangeSection(this.fuelSummaryModel);
        if (FuelSummaryHelperUtility.checkValid(this.fuelSummaryModel)) {
          this.getContractOrSectionListItem();
        }
        break;
      default: break;
    }
  }
  /**** * @memberof FuelSummaryComponent */
  getBillToList(request?: object) {
    this.fuelSummaryModel.billToSearchInputValue = '';
    FuelSummaryHelperUtility.clearFilterData(this.billtotable);
    FuelSummaryHelperUtility.clearBeforeBillTo(this.fuelSummaryModel);
    const requestParam = FuelSummaryHelperUtility.getBillToParams(this.fuelSummaryModel);
    this.service.getBillToLists(this.fuelSummaryModel.agreementDetails.customerAgreementID,
      request ? request : requestParam).pipe(takeWhile(() => this.fuelSummaryModel.isSubscribe)).subscribe((data: BillToList[]) => {
        this.fuelSummaryModel.isTableDataLoading = false;
        this.fuelSummaryModel.billToList = FuelSummaryUtility.formatBillToList(data);
        this.fuelSummaryModel.noRecordMsgFlagBillTo = false;
        this.changeDetector.detectChanges();
      }, (error: HttpErrorResponse) => {
        this.fuelSummaryModel.isTableDataLoading = false;
        this.fuelSummaryModel.billToList = [];
        this.changeDetector.detectChanges();
      });
  }
  /***** @memberof FuelSummaryComponent*/
  popupCancel() {
    this.fuelSummaryModel.isShowPopup = false;
    this.fuelSummaryModel.selectedAffiliationValue = this.fuelSummaryModel.fuelSummaryForm.get('affiliationLevel').value;
  }
  /***** @param {*} event * @memberof FuelSummaryComponent*/
  isEmptyTable(event) {
    FuelSummaryHelperUtility.isEmptyTable(this.fuelSummaryModel, event);
  }
  /***** @param {*} event * @memberof FuelSummaryComponent*/
  isEmptyTableBillTo(event) {
    FuelSummaryHelperUtility.isEmptyTableBillTo(this.fuelSummaryModel, event);
  }
  /***** @memberof FuelSummaryComponent */
  removeDirty() {
    FuelSummaryHelperUtility.removeDirty(this.fuelSummaryModel);
  }
  /***** @memberof FuelSummaryComponent */
  affiliationChangeYes() {
    FuelSummaryHelperUtility.affiliationChangedYes(this.fuelSummaryModel);
    this.affilicationChange(this.fuelSummaryModel.selectedAffiliationValue);
  }
  /***** @memberof FuelSummaryComponent*/
  getContractBillToList() {
    this.fuelSummaryModel.isContractBillTo = false;
    this.fuelSummaryModel.isSectionBillTo = false;
    this.fuelSummaryModel.billToSearchInputValue = '';
    FuelSummaryHelperUtility.clearFilterData(this.billtotable);
    this.fuelSummaryModel.noRecordMsgFlag = false;
    if (this.fuelSummaryModel.selectedItemList.length && (this.fuelSummaryModel.fuelSummaryForm.controls['affiliationLevel'].
      value === 'contract' || this.fuelSummaryModel.fuelSummaryForm.controls['affiliationLevel'].value === 'section')) {
      this.fuelSummaryModel.isShowEmptyBillTo = false;
      const key = `${this.fuelSummaryModel.fuelSummaryForm.controls['affiliationLevel'].value}IDs`;
      const request = FuelSummaryHelperUtility.getBillToParams(this.fuelSummaryModel);
      request[key] = FuelSummaryHelperUtility.getContractBillToIds(this.fuelSummaryModel);
      this.getBillToList(request);
    } else {
      this.fuelSummaryModel.isShowEmptyBillTo = true;
      this.fuelSummaryModel.billToList = [];
    }
  }
  /**** * @memberof FuelSummaryComponent */
  getAgreementBillTo() {
    FuelSummaryHelperUtility.getAgreementBillTo(this.fuelSummaryModel);
  }
  /***** @memberof FuelSummaryComponent*/
  getContractOrSectionListItem() {
    const affiliation = this.fuelSummaryModel.fuelSummaryForm.get('affiliationLevel').value;
    FuelSummaryHelperUtility.clearList(this.fuelSummaryModel);
    const requestParam = {
      agreementId: this.fuelSummaryModel.agreementDetails.customerAgreementID,
      params: FuelSummaryHelperUtility.getBillToParams(this.fuelSummaryModel)
    };
    this.service.getContractSectionList(requestParam, affiliation).pipe(takeWhile(() => this.fuelSummaryModel.isSubscribe)).subscribe(
      (data: SaveResponse[]) => {
        FuelSummaryHelperUtility.formatList(this.fuelSummaryModel, data);
        this.changeDetector.detectChanges();
      },
      (error: HttpErrorResponse) => {
        this.fuelSummaryModel.isTableDataLoading = false;
        this.fuelSummaryModel.itemList = [];
        this.changeDetector.detectChanges();
      }
    );
  }
  /***** @param {*} event
   * @memberof FuelSummaryComponent */
  focusOn(event) {
    event.stopPropagation();
  }
  /***** @param {string} field
   * @memberof FuelSummaryComponent */
  onClearValues(field: string) {
    if (utils.isEmpty(this.fuelSummaryModel.fuelSummaryForm.get(field).value)) {
      this.fuelSummaryModel.fuelSummaryForm.get(field).reset();
    }
  }
  /***** @memberof FuelSummaryComponent */
  onMultiSelectBlur() {
    this.fuelSummaryModel.fuelSummaryForm.controls['businessUnit'].markAsTouched();
  }
  /****
   * * @memberof FuelSummaryComponent
   */
  valueChangesSubscription() {
    this.fuelSummaryModel.fuelSummaryForm.controls['effectiveDate'].valueChanges.pipe(debounceTime(500)).subscribe(val => {
      this.checkDateValues();
      this.changeDetector.detectChanges();
    });
    this.fuelSummaryModel.fuelSummaryForm.controls['expirationDate'].valueChanges.pipe(debounceTime(500)).subscribe(val => {
      this.checkDateValues();
      this.changeDetector.detectChanges();
    });
  }
}
