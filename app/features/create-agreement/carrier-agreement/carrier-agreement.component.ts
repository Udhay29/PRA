import { Router } from '@angular/router';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, Input, OnDestroy, Output, EventEmitter,
   ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import { takeWhile } from 'rxjs/operators';
import { timer } from 'rxjs';
import * as utils from 'lodash';
import * as moment from 'moment';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/components/common/messageservice';
import { SortEvent } from 'primeng/api';
import { AgreementDetailsModel } from '../agreement-details/model/agreement-details.model';
import { AgreementDetailsService } from '../agreement-details/service/agreement-details.service';
import { AgreementDetailsQuery } from '../agreement-details/query/agreement-details.query';
import { BucketsItem, CarrierDTO, RootObject, CarrierSaveRequest, CarrierSaveList
} from '../agreement-details/model/agreement-details.interface';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { AgreementDetailsUtility } from './../agreement-details/service/agreement-details-utility';

@Component({
  selector: 'app-carrier-agreement',
  templateUrl: './carrier-agreement.component.html',
  styleUrls: ['./carrier-agreement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarrierAgreementComponent implements OnInit, OnDestroy {
  @Input() agreementDetailsModel: AgreementDetailsModel;
  @Output() loaderEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private readonly formBuilder: FormBuilder, private readonly changeDetector: ChangeDetectorRef,
  private readonly service: AgreementDetailsService, private readonly messageService: MessageService,
  private readonly router: Router, private readonly shared: BroadcasterService, private readonly elref: ElementRef) {}

  ngOnInit() {
    this.agreementDetailsModel.inlineErrormessage = [];
    this.agreementDetailsModel.isCarrierSubscribe = true;
    this.addNewRow();
    this.agreementDetailsModel.effectiveMinDate = new Date('1995-01-01'.replace(/-/g, '\/').replace(/T.+/, ''));
    this.agreementDetailsModel.expirationMaxDate = new Date(this.agreementDetailsModel.expirationDate.
      replace(/-/g, '\/').replace(/T.+/, ''));
    this.saveCarrierSubscription();
  }
  ngOnDestroy() {
    this.agreementDetailsModel.isCarrierSubscribe = true;
  }
  /** function called when navigation happens to make all form field as pristine & untouched
   * @memberof CarrierAgreementComponent */
  saveCarrierSubscription() {
    this.shared.on<boolean>('carrierSave').pipe(takeWhile(() => this.agreementDetailsModel.isCarrierSubscribe))
    .subscribe((value: boolean) => {
      this.changeDetector.detectChanges();
      if  (!value) {
        this.agreementDetailsModel.carrierDetailsForm.markAsPristine();
        this.agreementDetailsModel.carrierDetailsForm.markAsUntouched();
      }
    });
  }
  /** function to add new row when add row is clicked
   * @memberof CarrierAgreementComponent */
  addNewRow(carrierRef?: Table) {
    const controlArray = this.agreementDetailsModel.carrierDetailsForm.controls['carrierAgreement'] as FormArray;
    if (controlArray.controls.length === 0 || controlArray.valid) {
      controlArray.push(this.formBuilder.group({
        carrier: [null, Validators.required],
        effectiveDate: [null, Validators.required],
        expirationDate: [null, Validators.required]
      }));
    } else {
      this.touchFormArrayFields(controlArray);
    }
    this.checkHeight(carrierRef);
    this.changeDetector.detectChanges();
  }
  /** function to touch all the form fields of a form array
   * @param {FormArray} controlArray
   * @memberof CarrierAgreementComponent */
  touchFormArrayFields(controlArray: FormArray) {
    utils.forEach(controlArray['controls'], (control: FormGroup) => {
      utils.forIn(control['controls'], (data: FormControl, controlname: string) => {
        control['controls'][controlname].markAsTouched();
      });
    });
  }
  /** function to make carrier service call based on the value typed in carrier field
   * @param {string} value
   * @memberof CarrierAgreementComponent */
  onCarrierSearch(value: string) {
    const carrierQuery = AgreementDetailsQuery.getCarrierQuery(value);
    this.service.getCarrierDetails(carrierQuery).pipe(takeWhile(() => this.agreementDetailsModel.isCarrierSubscribe))
    .subscribe((carrierDetails: RootObject) => {
      const resultList = [];
      if (!utils.isEmpty(carrierDetails) && !utils.isEmpty(carrierDetails.aggregations) &&
      !utils.isEmpty(carrierDetails.aggregations.unique)) {
        utils.forEach(carrierDetails.aggregations.unique.buckets, (bucket: BucketsItem) => {
          if (bucket.key && !utils.isEmpty(bucket.Level) && !utils.isEmpty(bucket.Level.hits) && !utils.isEmpty(bucket.Level.hits.hits)) {
            resultList.push(AgreementDetailsUtility.getCarrierSearchResults(bucket.Level.hits.hits));
          }
        });
      }
      this.agreementDetailsModel.carrierList = resultList;
      this.changeDetector.detectChanges();
    }, (error: HttpErrorResponse) => {
      this.changeDetector.detectChanges();
      this.agreementDetailsModel.carrierList = [];
    });
  }
  /** function to update form field based on value in carrier field
   * @param {CarrierDTO[]} value
   * @param {number} index
   * @memberof CarrierAgreementComponent */
  onClearCarrier(value: CarrierDTO[], index: number) {
    if (utils.isEmpty(value)) {
      const controlArray = this.agreementDetailsModel.carrierDetailsForm.controls['carrierAgreement'] as FormArray;
      controlArray.controls[index].patchValue({
        carrier: value, effectiveDate: null, expirationDate: null
      });
      this.checkEmptyFormArray();
      this.agreementDetailsModel.expirationMinDate[index] = null;
      this.agreementDetailsModel.effectiveMaxDate[index] = null;
      this.agreementDetailsModel.carrierDetailsForm.updateValueAndValidity();
    }
  }
  /** function called to remove selected rows when remove row is clicked
   * @memberof CarrierAgreementComponent */
  removeRow(carrierRef: Table) {
    const controlArray = this.agreementDetailsModel.carrierDetailsForm.controls['carrierAgreement'] as FormArray;
    utils.forEach(this.agreementDetailsModel.selectedItemList, (selectedData: FormGroup) => {
      const matchedIndex = utils.findIndex(controlArray.controls, selectedData);
      if (matchedIndex > -1) {
        controlArray.removeAt(matchedIndex);
        this.checkHeight(carrierRef);
      }
    });
    this.agreementDetailsModel.selectedItemList = [];
    this.checkEmptyFormArray();
    if (!controlArray.value.length) {
      this.addNewRow();
    }
  }
  /** function to set carrier agreement name based on the deleted rows
   * @memberof CarrierAgreementComponent */
  checkEmptyFormArray() {
    const controlArray = this.agreementDetailsModel.carrierDetailsForm.controls['carrierAgreement'] as FormArray;
    if ((utils.isEmpty(controlArray.controls) || utils.isEmpty(controlArray.at(0).get('carrier').value)) &&
    this.agreementDetailsModel.firstRowCarrier === this.agreementDetailsModel.carrierDetailsForm.get('carrierAgreementName').value) {
      this.agreementDetailsModel.carrierDetailsForm.get('carrierAgreementName').reset();
      this.agreementDetailsModel.firstRowCarrier = '';
    }
  }
  /** function called when carrier field value is selected
   * @param {CarrierDTO} event
   * @param {number} index
   * @memberof CarrierAgreementComponent */
  onCarrierSelect(event: CarrierDTO, index: number) {
    this.agreementDetailsModel.duplicateErrorFlag = false;
    this.agreementDetailsModel.inlineErrormessage = [];
    if (index === 0 && (!this.agreementDetailsModel.carrierDetailsForm.get('carrierAgreementName').value ||
    this.agreementDetailsModel.firstRowCarrier === this.agreementDetailsModel.carrierDetailsForm.get('carrierAgreementName').value)) {
      this.agreementDetailsModel.firstRowCarrier = utils.truncate(event.legalName, {length: 40});
      this.agreementDetailsModel.carrierDetailsForm.patchValue({
        carrierAgreementName: this.agreementDetailsModel.firstRowCarrier
      });
    }
    this.getEffectiveDate(event, index);
  }
  /** function to get the effectiveDate for the selected carrier
   * @param {CarrierDTO} event
   * @param {number} index
   * @memberof CarrierAgreementComponent */
  getEffectiveDate(event: CarrierDTO, index: number) {
    this.loaderEvent.emit(true);
    const controlArray = this.agreementDetailsModel.carrierDetailsForm.controls['carrierAgreement'] as FormArray;
    this.service.getCarrierEffectiveDate(event.carrierID).pipe(takeWhile(() =>  this.agreementDetailsModel.isCarrierSubscribe))
    .subscribe((data: string) => {
      this.loaderEvent.emit(false);
      const effDate = (utils.isNull(data)) ? data : new Date(data.replace(/-/g, '\/').replace(/T.+/, ''));
      controlArray.controls[index].patchValue({ effectiveDate: effDate });
      this.agreementDetailsModel.expirationMinDate[index] = effDate;
      const expDate = new Date(this.agreementDetailsModel.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''));
      controlArray.controls[index].patchValue({ expirationDate: expDate });
      this.agreementDetailsModel.effectiveMaxDate[index] = expDate;
      this.changeDetector.detectChanges();
    }, (error: HttpErrorResponse) => {
      this.loaderEvent.emit(false);
      controlArray.controls[index].patchValue({ effectiveDate: null });
      controlArray.controls[index].patchValue({ expirationDate: null });
      this.agreementDetailsModel.expirationMinDate[index] = null;
      this.agreementDetailsModel.effectiveMaxDate[index] = null;
      this.changeDetector.detectChanges();
    });
  }
  /** function called date is selected in effective or expiration field
   * @param {Date} value
   * @param {number} key
   * @param {number} index
   * @memberof CarrierAgreementComponent */
  onDateSelected(value: Date, key: number, index: number) {
    if (key === 0) {
      this.agreementDetailsModel.expirationMinDate[index] = new Date(value);
    } else {
      this.agreementDetailsModel.effectiveMaxDate[index] = new Date(value);
    }
    const fieldName = (key === 0) ? 'effective' : 'expiration';
    this.onTypeDate(moment(value).format('MM/DD/YYYY'), fieldName, index);
  }
  /** fuction called when date is typed in effective or expiration field
   * @param {string} event
   * @param {string} fieldName
   * @param {number} index
   * @memberof CarrierAgreementComponent */
  onTypeDate(event: string, fieldName: string, index: number) {
    const controlArray = this.agreementDetailsModel.carrierDetailsForm.controls['carrierAgreement'] as FormArray;
    if (!utils.isEmpty(event)) {
      switch (fieldName) {
        case 'effective':
          if (controlArray.controls[index]['controls']['effectiveDate'].value) {
            this.agreementDetailsModel.inCorrectEffDateFormat[index] = false;
            this.getValidDate(controlArray, index);
            this.agreementDetailsModel.expirationMinDate[index] = controlArray.controls[index]['controls']['effectiveDate'].value;
          }
          break;
        case 'expiration':
          if (controlArray.controls[index]['controls']['expirationDate'].value) {
            this.agreementDetailsModel.inCorrectExpDateFormat[index] = false;
            this.onSelectExpDate(controlArray, index);
            this.agreementDetailsModel.effectiveMaxDate[index] = controlArray.controls[index]['controls']['expirationDate'].value;
          }
          break;
        default: break;
      }
      AgreementDetailsUtility.validateDateFormat(event, fieldName, index, this.agreementDetailsModel);
      this.setFormErrors(controlArray, index);
    } else {
      const formField = `${fieldName}Date`;
      controlArray.controls[index]['controls'][formField].setErrors(null);
      controlArray.controls[index]['controls'][formField].setErrors({required: true});
    }
  }
  /** function to set invalid error for effective or expiration field
   * @param {FormArray} controlArray
   * @param {number} index
   * @memberof CarrierAgreementComponent */
  setFormErrors(controlArray: FormArray, index: number) {
    const effError = (this.agreementDetailsModel.inCorrectEffDateFormat[index] || this.agreementDetailsModel.isNotValidDate[index]);
    controlArray.controls[index]['controls']['effectiveDate'].setErrors(effError ? {invalid: true} : null);
    const expError = (this.agreementDetailsModel.inCorrectExpDateFormat[index] || this.agreementDetailsModel.isNotValidDate[index]);
    controlArray.controls[index]['controls']['expirationDate'].setErrors(expError ? {invalid: true} : null);
  }
  /** function to check effective & epiration date based on  min date & max date
   * @param {FormArray} controlArray
   * @param {number} index
   * @memberof CarrierAgreementComponent */
  getValidDate(controlArray: FormArray, index: number) {
    this.agreementDetailsModel.isNotValidDate[index] = false;
    const effDateValue = controlArray.controls[index]['controls']['effectiveDate'].value;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    this.agreementDetailsModel.inCorrectEffDateFormat[index] = (effDateValue.getTime() <
    this.agreementDetailsModel.effectiveMinDate.setHours(0, 0, 0, 0));
    if (todayDate.getDate() === effDateValue.getDate()) {
      effDateValue.setHours(0, 0, 0, 0);
    }
    if (effDateValue && controlArray.controls[index]['controls']['expirationDate'].value) {
      this.agreementDetailsModel.isNotValidDate[index] = (effDateValue.getTime() >
      controlArray.controls[index]['controls']['expirationDate'].value.setHours(0, 0, 0, 0) ||
      effDateValue.getTime() > this.agreementDetailsModel.expirationMaxDate.setHours(0, 0, 0, 0));
    }
  }
  /** function to check expiration date based on min date & max date
   * @param {FormArray} controlArray
   * @param {number} index
   * @memberof CarrierAgreementComponent */
  onSelectExpDate(controlArray: FormArray, index: number) {
    if (controlArray.controls[index]['controls']['effectiveDate'].value) {
      this.getValidDate(controlArray, index);
    }
    const expDateValue = controlArray.controls[index]['controls']['expirationDate'].value.setHours(0, 0, 0, 0);
    this.agreementDetailsModel.inCorrectExpDateFormat[index] = (expDateValue >
      this.agreementDetailsModel.expirationMaxDate.setHours(0, 0, 0, 0));
  }
  /** function called when cancel button is clicked
   * @memberof CarrierAgreementComponent */
  onCancel() {
    if (this.agreementDetailsModel.carrierDetailsForm.dirty && this.agreementDetailsModel.carrierDetailsForm.touched) {
      this.agreementDetailsModel.isSaveChanges = true;
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
  createsaveRequest(): CarrierSaveRequest {
    return {
      agreementName: this.agreementDetailsModel.carrierDetailsForm.get('carrierAgreementName').value,
      carriers: this.getcarriersList(),
      effectiveDate: new Date('1995-01-01'.replace(/-/g, '\/').replace(/T.+/, '')).toISOString().split('T')[0],
      expirationDate: new Date(this.agreementDetailsModel.expirationDate.replace(/-/g, '\/').replace(/T.+/, '')).toISOString().split('T')[0]
    };
  }
  getcarriersList(): CarrierSaveList[] {
    const carrierList = [];
    if (!utils.isEmpty(this.agreementDetailsModel.carrierDetailsForm.get('carrierAgreement').value)) {
      utils.forEach(this.agreementDetailsModel.carrierDetailsForm.get('carrierAgreement').value, (value, index: number) => {
        carrierList.push({
          carrierName: value.carrier.legalName, carrierCode: value.carrier.carrierCode,
          carrierStatus: 'A', carrierID: value.carrier.carrierID,
          effectiveDate: new Date(value.effectiveDate.toDateString()).toISOString().split('T')[0],
          expirationDate: new Date(value.expirationDate.toDateString()).toISOString().split('T')[0],
          carrierRowID: index + 1, carrierDisplayName: value.carrier.carrierDisplayName
        });
      });
    }
    return carrierList;
  }
  /** function called when create agreemnet button is clicked
   * @memberof CarrierAgreementComponent */
  onCreateCarrier() {
    this.agreementDetailsModel.duplicateErrorFlag = false;
    this.agreementDetailsModel.inlineErrormessage = [];
    if (this.agreementDetailsModel.carrierDetailsForm.valid) {
      this.loaderEvent.emit(true);
      const requestParam = this.createsaveRequest();
      this.service.saveCarrier(requestParam).pipe(takeWhile(() => this.agreementDetailsModel.isCarrierSubscribe))
      .subscribe((data: HttpResponseBase) => {
        this.changeDetector.detectChanges();
        this.agreementDetailsModel.carrierDetailsForm.markAsPristine();
        this.agreementDetailsModel.carrierDetailsForm.markAsUntouched();
        const message = `You have successfully created the agreement for ${this.agreementDetailsModel.
          carrierDetailsForm.get('carrierAgreementName').value}`;
        this.toastMessage('success', 'Agreement Created', message);
        this.loaderEvent.emit(false);
        this.router.navigate(['/viewcarrierdetails', data.headers.get('carrierAgreementID')]);
      }, (error: HttpErrorResponse) => {
        this.loaderEvent.emit(false);
        if (error && error.error && error.error.errors && error.error.errors.length) {
          AgreementDetailsUtility.handleError(error, this.agreementDetailsModel, this.messageService);
        }
        this.changeDetector.detectChanges();
      });
    } else {
      utils.forIn(this.agreementDetailsModel.carrierDetailsForm.controls, (value: FormControl, name: string) => {
        if (name !== 'carrierAgreement') {
          this.agreementDetailsModel.carrierDetailsForm.controls[name].markAsTouched();
        } else {
          const controlArray = this.agreementDetailsModel.carrierDetailsForm.controls['carrierAgreement'] as FormArray;
          this.touchFormArrayFields(controlArray);
        }
      });
      this.toastMessage('error', 'Missing Required Information',
      'Provide the required information in the highlighted fields and submit the form again');
      this.changeDetector.detectChanges();
    }
  }
  /** function to handle the success or error toast message
   * @param {string} type * @param {string} title * @param {string} message
   * @memberof CarrierAgreementComponent */
  toastMessage(type: string, title: string, message: string) {
    this.messageService.clear();
    this.messageService.add({
      severity: type, summary: title, detail: message
    });
  }
  /** function called when yes button of the popup is clicked
   * @memberof CarrierAgreementComponent */
  onClickYes() {
    this.agreementDetailsModel.isSaveChanges = false;
    this.agreementDetailsModel.carrierDetailsForm.markAsPristine();
    this.agreementDetailsModel.carrierDetailsForm.markAsUntouched();
    this.router.navigate(['/dashboard']);
  }
  /** function called when no button of the popup is clicked
   * @memberof CarrierAgreementComponent */
  onClickNo() {
    this.agreementDetailsModel.isSaveChanges = false;
  }
  /** function for sorting values in carrier table
   * @param {SortEvent} event
   * @memberof CarrierAgreementComponent */
  customSort(event: SortEvent) {
    event.data.sort((data1: FormGroup, data2: FormGroup) => {
      const value1 = (event.field === 'carrier') ? (data1.get(event.field).value ? data1.get(event.field)
      .value.carrierDisplayName : data1.get(event.field).value) : data1.get(event.field).value;
      const value2 = (event.field === 'carrier') ? (data2.get(event.field).value ? data2.get(event.field)
      .value.carrierDisplayName : data2.get(event.field).value) : data2.get(event.field).value;
      return (event.order * AgreementDetailsUtility.applySort(value1, value2));
    });
  }
  /** function to check height of the table
   * @memberof CarrierAgreementComponent */
  checkHeight(carrierRef: Table) {
    if (!utils.isUndefined(carrierRef)) {
      timer(5).subscribe((time: number) => {
        const height = carrierRef.el.nativeElement.querySelector('.ui-table-scrollable-body table').offsetHeight;
        const divHeight = carrierRef.el.nativeElement.querySelector('.ui-table-scrollable-body').offsetHeight;
        this.agreementDetailsModel.heightCheckFlag = (height > divHeight);
        this.changeDetector.detectChanges();
      });
    }
  }
}
