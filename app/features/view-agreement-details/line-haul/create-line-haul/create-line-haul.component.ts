import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter,
  OnDestroy, OnInit, ViewChild, Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { TimeZoneService } from '../../../../shared/jbh-app-services/time-zone.service';

import * as utils from 'lodash';
import * as moment from 'moment';
import { Observable, timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { MessageService } from 'primeng/components/common/messageservice';

import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';

import { LocalStorageService } from './../../../../shared/jbh-app-services/local-storage.service';
import { CreateLineHaulModel } from './model/create-line-haul.model';
import { CreateLineHaulService } from './services/create-line-haul.service';
import { SaveResponseDto, SourceDetails } from './model/create-line-haul.interface';
import { ViewAgreementDetailsUtility } from './../../service/view-agreement-details-utility';
import { LineHaulValues } from '../additional-information/line-haul-overview/model/line-haul-overview.interface';
import { AdditionalInfoService } from '../add-line-haul/additional-info/services/additional-info.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-create-line-haul',
  templateUrl: './create-line-haul.component.html',
  styleUrls: ['./create-line-haul.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateLineHaulComponent implements OnInit, OnDestroy {

  @ViewChild('linehaulForm') lineHaulElement: any;
  @Output() confirmationSave: EventEmitter<boolean> = new EventEmitter<boolean>();
  createLineHaulModel: CreateLineHaulModel;
  agreementID: string;
  agreementURL: string;
  lineHaulUrl: string;
  reviewUrl: string;
  editlineHaulDetails: LineHaulValues;
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly localStore: LocalStorageService,
    private readonly messageService: MessageService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly createLineHaulService: CreateLineHaulService,
    private readonly router: Router,
    private readonly utilityService: ViewAgreementDetailsUtility,
    private readonly shared: BroadcasterService,
    private readonly dateShared: TimeZoneService,
    private readonly additionalInfoService: AdditionalInfoService
  ) {
    this.lineHaulUrl = '/viewagreement';
    this.reviewUrl = '/viewagreement/review';
    this.route.queryParams.subscribe((params: Params) => {
      this.agreementID = String(params['id']);
      this.agreementURL = `/viewagreement?id=${this.agreementID}`;
      this.createLineHaulModel = new CreateLineHaulModel(this.agreementID);
    }, (error: Error) => {
      this.toastMessage(this.messageService, 'error', 'Error', error.message);
    });
    this.createLineHaulModel.agreementDetails = this.localStore.getAgreementDetails();
    this.createLineHaulForm();
  }

  ngOnInit() {
    this.getSourceTypes();
    this.getEditLineHaulDetails();
  }
  ngOnDestroy() {
    this.createLineHaulModel.isSubscribeFlag = false;
  }
  createLineHaulForm() {
    this.hideDateErrors();
    this.createLineHaulModel.lineHaulForm = this.formBuilder.group({
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      lineHaulSourceType: ['']
    });
  }
  getSourceTypes() {
    const dataArray = [];
    this.createLineHaulService.getSourceDetails().pipe(takeWhile(() => this.createLineHaulModel.isSubscribeFlag))
      .subscribe((data: Array<SourceDetails>) => {
        const dataValues = data['_embedded']['lineHaulSourceTypes'];
        dataValues.map(value => {
          const obj = {};
          obj['label'] = value['lineHaulSourceTypeName'].trim();
          obj['value'] = value['lineHaulSourceTypeID'];
          if (obj['label'] !== 'Manual') {
            obj['styleClass'] = 'disabled';
          }
          dataArray.push(obj);
        });
        this.createLineHaulModel.lineHaulSourceType = dataArray;
        const defaultID = utils.find(this.createLineHaulModel.lineHaulSourceType, utils.matchesProperty('label', 'Manual')).value;
        this.createLineHaulModel.lineHaulForm.controls['lineHaulSourceType'].setValue(defaultID);
        this.createLineHaulModel.sourceValue = utils.find(this.createLineHaulModel.lineHaulSourceType, utils.matchesProperty('value', 4));
        this.changeDetector.detectChanges();
      }, (fetchError: Error) => {
        if (fetchError) {
          this.toastMessage(this.messageService, 'error', 'Error', fetchError['error']['errors'][0]['errorMessage']);
        }
      });
  }
  onButtonSelected(value: number) {
    this.createLineHaulModel.sourceValue =
      utils.find(this.createLineHaulModel.lineHaulSourceType, utils.matchesProperty('value', value));
  }
  onDateSelected(selectedDate: Date, selectedType: string) {
    if (selectedType === 'effectiveDate') {
      this.validateEffectiveDate();
      this.createLineHaulModel.effectiveDate = this.dateFormatter(selectedDate);
      this.createLineHaulModel.expirationMinDate = new Date(selectedDate);
      this.createLineHaulModel.expirationMinDate.setDate(this.createLineHaulModel.expirationMinDate.getDate());
      this.validateDate(this.createLineHaulModel.expirationMinDate, selectedType);
      this.setFormErrors();
      this.setValidation('expirationDate');
    } else if (selectedType === 'expirationDate') {
      this.validateExpirationDate();
      this.createLineHaulModel.expirationDate = this.dateFormatter(selectedDate);
      this.createLineHaulModel.effectiveMaxDate = new Date(selectedDate);
      this.validateDate(this.createLineHaulModel.effectiveMaxDate, selectedType);
      this.setFormErrors();
      this.setValidation('effectiveDate');
    }
  }
  setValidation(fieldName: string) {
    if (!this.createLineHaulModel.lineHaulForm.controls[fieldName].value) {
      this.createLineHaulModel.lineHaulForm.controls[fieldName].setErrors({
        'required': true
      });
    }
  }
  dateFormatter(value: Date) {
    return moment(value).format('YYYY-MM-DD');
  }
  onDateRangeContinue() {
    this.createLineHaulModel.errorMsg = false;
    if (this.createLineHaulModel.lineHaulForm.valid) {
      this.lineHaulDetailsSave();
    } else if (!this.createLineHaulModel.lineHaulForm.valid) {
      this.formFieldsTouched();
    }
  }
  lineHaulDetailsSave() {
    this.createLineHaulModel.dateRangeValues.effectiveDate =
      this.dateFormatter(this.createLineHaulModel.lineHaulForm.controls.effectiveDate.value);
    this.createLineHaulModel.dateRangeValues.expirationDate =
      this.dateFormatter(this.createLineHaulModel.lineHaulForm.controls.expirationDate.value);
    this.utilityService.setLineHaulDates(this.createLineHaulModel.dateRangeValues);
    if (this.createLineHaulModel.isSaveDraft) {
      this.saveLineHaulDraft();
    } else {
      this.onSaveLineHaul();
    }
  }
  onClickBackLane() {
    this.createLineHaulModel.laneCardFlag = false;
  }
  onSaveLineHaul() {
    this.createLineHaulService.
      onSaveManualDetails(this.createLineHaulModel.agreementDetails.customerAgreementID,
        this.createLineHaulModel.effectiveDate, this.createLineHaulModel.expirationDate)
      .pipe(takeWhile(() => this.createLineHaulModel.isSubscribeFlag)).subscribe((data: Array<SaveResponseDto>) => {
        if (data) {
          this.saveLineHaulData(data);
        }
      }, (saveError: Error) => {
        if (saveError) {
          this.toastMessage(this.messageService, 'error', 'Error', saveError['error']['errors'][0]['errorMessage']);
        }
      });
  }
  saveLineHaulDraft() {
    const lineHaulDetailsData = this.utilityService.getEditLineHaulData();
    if (lineHaulDetailsData !== undefined && lineHaulDetailsData.isEditFlag) {
      this.router.navigate([this.lineHaulUrl],
        { queryParams: { id: this.createLineHaulModel.agreementDetails.customerAgreementID } });
    } else {
      this.createLineHaulModel.isCancel = false;
      const status = this.utilityService.getreviewCancelStatus();
      if (status) {
        this.router.navigate([this.reviewUrl],
          { queryParams: { id: this.createLineHaulModel.agreementDetails.customerAgreementID } });
      } else {
        this.router.navigate([this.lineHaulUrl],
          { queryParams: { id: this.createLineHaulModel.agreementDetails.customerAgreementID } });
      }
    }
  }
  saveLineHaulData(data: Array<SaveResponseDto>) {
    if (!utils.isEmpty(data)) {
      this.createLineHaulModel.isDetailsSaved = true;
      this.createLineHaulModel.sectionData = data;
      const lineHaulDetailsData = this.utilityService.getEditLineHaulData();
      if (lineHaulDetailsData !== undefined) {
        this.getEditLineHaulDetails();
      } else {
        this.createLineHaulModel.laneCardFlag = true;
      }
    } else {
      this.showError();
    }
    this.changeDetector.detectChanges();
  }
  onClickConfirmationCancel() {
    this.createLineHaulModel.confirmationFlag = false;
  }
  onDateRangeCancel() {
    const cancelreviewStatus = this.utilityService.getreviewCancelStatus();
    if (this.createLineHaulModel.lineHaulForm.dirty) {
      this.createLineHaulModel.isCancel = true;
      const lineHaulDetailsData = this.utilityService.getEditLineHaulData();
      if (lineHaulDetailsData !== undefined && lineHaulDetailsData.isEditFlag) {
        this.messageService.clear();
        this.messageService.add({
          severity: 'warn', summary: 'Warning',
          detail: 'Your data will not be saved when you click on SaveAs Draft'
        });
      }
      this.createLineHaulModel.routingUrl = cancelreviewStatus ? this.reviewUrl : this.agreementURL;
    } else {
      if (!cancelreviewStatus) {
        this.router.navigate([this.lineHaulUrl],
          { queryParams: { id: this.createLineHaulModel.agreementDetails.customerAgreementID } });
        this.changeDetector.detectChanges();
      } else {
        this.router.navigate([this.reviewUrl],
          { queryParams: { id: this.createLineHaulModel.agreementDetails.customerAgreementID } });
        this.changeDetector.detectChanges();
      }
    }
  }
  onDateRangeCancellation() {
    this.createLineHaulModel.isCancel = false;
    this.createLineHaulModel.isDetailsSaved = true;
    this.createLineHaulModel.isChangesSaving = true;
    this.createLineHaulModel.confirmationFlag = false;
    this.lineHaulNavigationOnCancel();

  }

  lineHaulNavigationOnCancel() {
    if (this.createLineHaulModel.routingUrl === this.agreementURL) {
      this.router.navigate([this.lineHaulUrl],
        { queryParams: { id: this.createLineHaulModel.agreementDetails.customerAgreementID } });
    } else if (this.createLineHaulModel.routingUrl === this.reviewUrl) {
      this.router.navigate([this.reviewUrl],
        { queryParams: { id: this.createLineHaulModel.agreementDetails.customerAgreementID } });
    } else {
      const cancelreviewStatus = this.utilityService.getreviewCancelStatus();
      if (cancelreviewStatus) {
        this.additionalInfoService.saveDraftInfo('draft')
          .pipe(takeWhile(() => this.createLineHaulModel.isSubscribeFlag))
          .subscribe((response: any) => {
            this.router.navigate([this.createLineHaulModel.routingUrl]);
          }, (error: HttpErrorResponse) => {

          });
      } else {
        this.router.navigate([this.createLineHaulModel.routingUrl]);
      }

    }
  }
  onDateRangeSave() {
    this.createLineHaulModel.isSaveDraft = true;
    if (!utils.isEmpty(this.lineHaulElement)) {
      this.createLineHaulModel.isCancel = false;
      this.createLineHaulModel.isContinue = true;
    } else {
      this.onDateRangeContinue();
      this.createLineHaulModel.isCancel = false;
    }
    this.changeDetector.detectChanges();
  }
  formFieldsTouched() {
    utils.forIn(this.createLineHaulModel.lineHaulForm.controls, (value, name: string) => {
      if (!value['value']) {
        this.createLineHaulModel.lineHaulForm.controls[name].markAsTouched();
      }
    });
    this.messageService.clear();
    this.messageService.add({
      severity: 'error', summary: 'Missing Required Information',
      detail: 'Provide the required information in the highlighted fields and submit the form again'
    });
    this.changeDetector.detectChanges();
  }
  toastMessage(messageService: MessageService, key: string, type: string, data: string) {
    const message = {
      severity: key,
      summary: type,
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
  showError() {
    this.createLineHaulModel.inlineErrormessage = [];
    this.createLineHaulModel.errorMsg = true;
    this.createLineHaulModel.inlineErrormessage.push({
      severity: 'error', summary: '',
      detail: 'There is no Section that matches the date range. Please provide a valid date range'
    });
  }
  canDeactivate(component: CanDeactivateGuardService, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.createLineHaulModel.routingUrl = nextState.url;
    if ((this.createLineHaulModel.lineHaulForm.dirty && !this.createLineHaulModel.isDetailsSaved &&
      !this.createLineHaulModel.isSaveDraft) ||
      (this.createLineHaulModel.confirmationFlag && this.lineHaulElement &&
        ((this.lineHaulElement.laneCard.laneCardModel.laneCardForm.dirty ||
          this.lineHaulElement.overview.overviewModel.overviewForm.dirty ||
          this.lineHaulElement.stops.stopsModel.stopsForm.dirty ||
          this.lineHaulElement.rate.rateModel.rateForm.dirty) && (!this.lineHaulElement.addLineHaulModel.isSaveDraft)))) {
      this.createLineHaulModel.isChangesSaving = false;
    } else {
      this.createLineHaulModel.isChangesSaving = true;
    }
    this.createLineHaulModel.isCancel = !this.createLineHaulModel.isChangesSaving;
    this.changeDetector.detectChanges();
    return this.createLineHaulModel.isChangesSaving;
  }
  typedDateValidate(event: Event, fieldName: string) {
    const regex = new RegExp('^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/[0-9]{4}$');
    switch (fieldName) {
      case 'effectiveDate':
        if (event.srcElement['value'] && regex.test(event['srcElement']['value'].trim())) {
          this.createLineHaulModel.inCorrectEffDateFormat = false;
          const effDate = new Date(event.srcElement['value']);
          this.createLineHaulModel.lineHaulForm.controls['effectiveDate'].setValue(effDate);
          this.validateDate(effDate, fieldName);
          this.onDateSelected(event.srcElement['value'], 'effectiveDate');
        } else {
          this.createLineHaulModel.lineHaulForm.controls['effectiveDate'].setValidators([Validators.required]);
        }
        break;
      case 'expirationDate':
        if (event.srcElement['value'] && regex.test(event.srcElement['value'].trim())) {
          this.createLineHaulModel.inCorrectExpDateFormat = false;
          const expDate = new Date(event.srcElement['value']);
          this.createLineHaulModel.lineHaulForm.controls['expirationDate'].setValue(expDate);
          this.validateDate(expDate, fieldName);
          this.onDateSelected(event.srcElement['value'], 'expirationDate');
        } else {
          this.createLineHaulModel.lineHaulForm.controls['expirationDate'].setValidators([Validators.required]);
        }
        break;
      default: break;
    }
  }
  validateDate(date, fieldName: string) {
    switch (fieldName) {
      case 'effectiveDate':
        if (date > new Date('12/31/2099')) {
          this.createLineHaulModel.inValidEffDate = true;
          break;
        } else {
          this.createLineHaulModel.inValidEffDate = false;
          break;
        }
      case 'expirationDate':
        if (date > new Date('12/31/2099')) {
          this.createLineHaulModel.inValidExpDate = true;
          break;
        } else {
          this.createLineHaulModel.inValidExpDate = false;
          break;
        }
    }
  }
  validateExpirationDate() {
    if (this.createLineHaulModel.lineHaulForm.controls['effectiveDate'].value &&
      this.createLineHaulModel.lineHaulForm.controls['expirationDate'].value &&
      (this.createLineHaulModel.lineHaulForm.controls['effectiveDate'].value >
        this.createLineHaulModel.lineHaulForm.controls['expirationDate'].value)) {
      this.createLineHaulModel.inValidDate = true;
    } else {
      this.createLineHaulModel.inValidDate = false;
    }
  }
  validateEffectiveDate() {
    if (this.createLineHaulModel.lineHaulForm.controls['effectiveDate'].value &&
      this.createLineHaulModel.lineHaulForm.controls['expirationDate'].value &&
      (this.createLineHaulModel.lineHaulForm.controls['effectiveDate'].value >
        this.createLineHaulModel.lineHaulForm.controls['expirationDate'].value)) {
      this.createLineHaulModel.inValidDate = true;
    } else {
      this.createLineHaulModel.inValidDate = false;
    }
  }
  hideDateErrors() {
    this.createLineHaulModel.inValidEffDate = false;
    this.createLineHaulModel.inValidExpDate = false;
    this.createLineHaulModel.inValidDate = false;
  }
  setFormErrors() {
    const effError = (this.createLineHaulModel.inValidEffDate || this.createLineHaulModel.inValidDate);
    const expError = (this.createLineHaulModel.inValidExpDate || this.createLineHaulModel.inValidDate);
    this.createLineHaulModel.lineHaulForm.controls.effectiveDate.setErrors(effError ? { invalid: true } : null);
    this.createLineHaulModel.lineHaulForm.controls.expirationDate.setErrors(expError ? { invalid: true } : null);
    this.changeDetector.detectChanges();
  }

  getEditLineHaulDetails() {
    const lineHaulDetailsData = this.utilityService.getEditLineHaulData();
    if (lineHaulDetailsData !== undefined) {
      if (lineHaulDetailsData.isEditFlag) {
        const currentDate = this.dateShared.getCurrentDate();
        this.createLineHaulModel.laneCardFlag = true;
        this.createLineHaulService.getLineHaulOverView(lineHaulDetailsData.lineHaulDetails,
          currentDate).pipe(takeWhile(() => this.createLineHaulModel.isSubscribeFlag)).subscribe((response: LineHaulValues) => {
            this.editlineHaulDetails = response;
            this.shared.broadcast('editlinehaulDetails', this.editlineHaulDetails);
            this.changeDetector.detectChanges();
          }, (error: Error) => {
          });
      } else {
        this.createLineHaulModel.laneCardFlag = true;
      }
    } else {
      this.createLineHaulModel.laneCardFlag = false;
    }
  }

  getSectionDate(dateObj) {
    if (!utils.isEmpty(dateObj)) {
      const effDate = new Date(moment(dateObj.effectiveDate).format());
      const expDate = new Date(moment(dateObj.expirationDate).format());
      this.createLineHaulModel.lineHaulForm.controls['effectiveDate'].setValue(effDate);
      this.createLineHaulModel.lineHaulForm.controls['expirationDate'].setValue(expDate);
      this.createLineHaulModel.lineHaulForm.markAsPristine();
      this.changeDetector.detectChanges();
    }
  }
}
