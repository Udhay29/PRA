import { Component, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment';
import { CreateStandardRatesModel } from './../model/create-standard-rate.model';
import { CreateStandardRateService } from './../service/create-standard-rate.service';
import {
  BuSoAssociation, ChargeCodeResponseInterface, GroupNameTypeValues, GroupNamesTypesItem
} from './../model/create-standard-interface';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import {
  CreateRateUtilityService
} from './../../../../../view-agreement-details/accessorials/rates/create-rates/service/create-rate-utility.service';
import { DateValidation } from './../../../../../../shared/jbh-app-services/date-validation';

@Component({
  selector: 'app-rate-setup',
  templateUrl: './rate-setup.component.html',
  styleUrls: ['./rate-setup.component.scss']
})
export class RateSetupComponent implements OnInit {
  @Output() rollupChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() chargeTypeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() waivedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() passthroughChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() calculateManuallyChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectedBuSo: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  createRatesModel: CreateStandardRatesModel;
  @ViewChild('optionalFields') optionalFields: any;
  constructor(private readonly createRateService: CreateStandardRateService, private readonly changeDetector: ChangeDetectorRef,
    private readonly formBuilder: FormBuilder, private readonly messageService: MessageService,
    private readonly createRateUtiltiyService: CreateRateUtilityService) {
    this.createRatesModel = new CreateStandardRatesModel();
  }
  ngOnInit() {
    this.setUpForm();
    this.getChargeTypes();
    this.setDateValue();
    this.getGroupNames();
    this.getCurrencyCode();
    this.setSuperUserBackDateDays();
    this.setSuperUserFutureDateDays();
    this.getCheckBoxData();
  }
  setUpForm() {
    this.createRatesModel.setUpForm = this.formBuilder.group({
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      groupName: ['', Validators.required],
      chargeType: ['', Validators.required],
      customerName: [''],
      currency: ['', Validators.required],
      waived: [''],
      calculateRate: [''],
      passThrough: [''],
      rollUp: [''],
    });
  }
  getChargeTypes() {
    this.createRatesModel.chargeTypeLoading = true;
    this.createRateService.getChargeTypes().pipe(takeWhile(() => this.createRatesModel.isSubscribeFlag))
      .subscribe((response: ChargeCodeResponseInterface[]) => {
        if (!utils.isEmpty(response)) {
          this.createRatesModel.chargeCodeBUCombination = response;
          this.createRatesModel.chargeType =
            this.createRatesModel.chargeCodeBUCombination.map(value => {
              return {
                label: `${value['chargeTypeName']} (${value['chargeTypeCode']})`,
                value: value['chargeTypeID'],
                description: value['chargeTypeDescription']
              };
            });
          this.createRatesModel.chargeTypeLoading = false;
        }
      });
      this.changeDetector.detectChanges();
  }

  onTypeChargeCode(event: Event) {
    this.createRatesModel.chargeTypeFiltered = [];
    if (this.createRatesModel.chargeType) {
      this.createRatesModel.chargeType.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.createRatesModel.chargeTypeFiltered.push({
            label: element.label,
            value: element.value,
            description: element.description
          });
        }
      });
    }
    this.createRatesModel.chargeTypeFiltered.sort((chargeTypefirstValue, chargeTypeSecondValue) => {
      return (chargeTypefirstValue.label.toLowerCase() > chargeTypeSecondValue.label.toLowerCase()) ? 1 : -1;
    });
    this.changeDetector.detectChanges();
  }
  onSelectChargeCode(event: Event) {
    this.createRatesModel.businessUnitAdded = false;
    this.createRatesModel.serviceLevelAdded = false;
    this.createRatesModel.operationalServiceAdded = false;
    this.createRatesModel.setUpForm.controls.customerName.setValue(null);
    this.getBUbasedOnChargeType(event['value']);
    this.chargeTypeChange.emit(true);
  }
  getBUbasedOnChargeType(chargeTypeId: number) {
    this.createRateService.getBUbasedOnChargeType(chargeTypeId).pipe(takeWhile(() => this.createRatesModel.isSubscribeFlag))
      .subscribe((data: BuSoAssociation[]) => {
        this.createRatesModel.buSoBasedOnChargeType = data;
        this.changeDetector.detectChanges();
      });
  }
  getGroupNames() {
    this.createRatesModel.loading = true;
    this.createRateService.getGroupNames().pipe(takeWhile(() => this.createRatesModel.isSubscribeFlag))
    .subscribe((res: GroupNameTypeValues) => {
      this.createRatesModel.loading = false;
      this.createRatesModel.groupNameValues = res._embedded.accessorialGroupTypes.map((value: GroupNamesTypesItem) => {
        return {
          label : value.accessorialGroupTypeName,
          value : value.accessorialGroupTypeId
        };
      });
      this.populateGroupName();
    }, (groupNameError: Error) => {
      this.createRatesModel.loading = false;
      this.createRateUtiltiyService.
      toastMessage(this.messageService, 'error', 'Error', groupNameError['error']['errors']['errorMessage']);
    });
  }
  populateGroupName() {
    if (this.createRatesModel.groupNameValues) {
      this.createRatesModel.setUpForm.controls['groupName'].
      setValue(this.createRatesModel.groupNameValues[0]);
      this.changeDetector.detectChanges();
    }
  }
  onTypeGroupName(event) {
    this.createRatesModel.groupNameSuggestions = [];
    if (this.createRatesModel.groupNameValues) {
      this.createRatesModel.groupNameValues.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.createRatesModel.groupNameSuggestions.push({
            label: element.label,
            value: element.value
          });
        }
      });
      this.createRatesModel.groupNameSuggestions =  utils.sortBy(this.createRatesModel.groupNameSuggestions, ['label']);
    }
  }
  onautoCompleteBlur(event, controlName: string) {
    if (this.createRatesModel.setUpForm.controls[controlName].value &&
      !event.target['value']) {
      this.createRatesModel.setUpForm.controls[controlName].setValue(null);
    }
  }
  getCurrencyCode() {
    this.createRateService.getCurrencyCodes().pipe(takeWhile(() => this.createRatesModel.isSubscribeFlag))
      .subscribe((data: [string]) => {
        if (data) {
          this.createRatesModel.currencyCodes = data.map((currencyCode: string, index: number) => {
            return {
              label: currencyCode,
              value: currencyCode
            };
          });
          this.createRatesModel.setUpForm.controls['currency'].setValue({
            label: 'USD',
            value: 'USD'
          });
          this.changeDetector.detectChanges();
        }
      });
  }
  onTypeCurrencyType(event: Event) {
    this.createRatesModel.currencyCodeFiltered = [];
    if (this.createRatesModel.currencyCodes) {
      this.createRatesModel.currencyCodes.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.createRatesModel.currencyCodeFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  onCurrencyTypeBlur(event: Event) {
    if (this.createRatesModel.setUpForm.controls['currency'].value &&
      !event.target['value']) {
      this.createRatesModel.setUpForm.controls['currency'].setValue(null);
    }
  }
  setDateValue() {
    this.createRatesModel.setUpForm.controls['effectiveDate'].setValue(this.dateFormatter(new Date()));
    this.createRatesModel.setUpForm.controls['expirationDate']
      .setValue(this.dateFormatter(new Date(this.createRatesModel.setExpirationDate)));
      this.createRatesModel.agreementEffectiveDate = this.createRatesModel.setUpForm.controls['effectiveDate'].value;
      this.createRatesModel.agreementEndDate = this.createRatesModel.setUpForm.controls['expirationDate'].value;

  }
  dateFormatter(value: string | Date): string {
    return moment(value).format(this.createRatesModel.dateFormatString);
  }
  typedDateValidate(event, fieldName: string) {
    const regex = new RegExp('^(|(0[1-9])|(1[0-2]))\/((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1]))\/(([0-9]{4}))$');
    switch (fieldName) {
      case 'effectiveDate':
        this.effectiveDateType(event, fieldName, regex);
        break;
      case 'expirationDate':
        this.expirationDateType(event, fieldName, regex);
        break;
      default: break;
    }
    this.changeDetector.detectChanges();
  }
  effectiveDateType(event, fieldName: string, regex: RegExp) {
    if (event.srcElement['value'] && regex.test(event['srcElement']['value'].trim()) &&
    this.createRatesModel.setUpForm.controls['effectiveDate'].value) {
      this.createRatesModel.isCorrectEffDateFormat = false;
      const effDate = new Date(event.srcElement['value']);
      this.createRatesModel.setUpForm.controls['effectiveDate'].setValue(effDate);
      this.validateDate(effDate, fieldName);
      this.onDateSelected(event.srcElement['value'], 'effectiveDate');
      this.setFormErrors();
    } else {
      this.createRatesModel.isCorrectEffDateFormat = true;
    }
  }
  expirationDateType(event, fieldName: string, regex: RegExp) {
    if (event.srcElement['value'] && regex.test(event.srcElement['value'].trim()) &&
    this.createRatesModel.setUpForm.controls['expirationDate'].value) {
      this.createRatesModel.isCorrectExpDateFormat = false;
      const expDate = new Date(event.srcElement['value']);
      this.createRatesModel.setUpForm.controls['expirationDate'].setValue(expDate);
      this.validateDate(expDate, fieldName);
      this.onDateSelected(event.srcElement['value'], 'expirationDate');
      this.setFormErrors();
    } else {
      this.createRatesModel.isCorrectExpDateFormat = true;
    }
  }

   validateDate(date, fieldName: string) {
    const agreementEffectiveDate = this.createRatesModel.agreementEffectiveDate;
    const agreementEndDate = this.createRatesModel.agreementEndDate;
    switch (fieldName) {
      case 'effectiveDate':
        if (date > new Date(agreementEndDate) ||
          date < moment(agreementEffectiveDate).subtract(this.createRatesModel.superUserBackDateDays, 'days') ||
          date > moment(agreementEndDate).add(this.createRatesModel.superUserFutureDateDays, 'days')) {
          this.createRatesModel.inValidEffDate = true;
          break;
        } else {
          this.createRatesModel.inValidEffDate = false;
          break;
        }
      case 'expirationDate':
        if (date > new Date(agreementEndDate) ||
          date <= moment(new Date()).subtract(this.createRatesModel.superUserBackDateDays, 'days')) {
          this.createRatesModel.inValidExpDate = true;
          break;
        } else {
          this.createRatesModel.inValidExpDate = false;
          break;
        }
    }
  }
  onDateSelected(selectedDate: Date, selectedType: string) {
    this.createRatesModel.isCorrectEffDateFormat = false;
    this.createRatesModel.isCorrectExpDateFormat = false;
    if (selectedType.toLowerCase() === 'effectivedate') {
      this.validateEffectiveDate();
      this.createRatesModel.effectiveDate = this.dateFormatter(selectedDate);
      this.createRatesModel.expirationMinDate = new Date(selectedDate);
      this.createRatesModel.disabledExpirationDate = [new Date(selectedDate)];
      this.validateDate(this.createRatesModel.expirationMinDate, selectedType);
      this.setFormErrors();
      this.setValidation('expirationDate');
    } else if (selectedType.toLowerCase() === 'expirationdate') {
      this.validateEffectiveDate();
      this.createRatesModel.expirationDate = this.dateFormatter(selectedDate);
      this.createRatesModel.effectiveMaxDate = new Date(selectedDate);
      this.createRatesModel.disabledEffectiveDate = [new Date(selectedDate)];
      this.validateDate(this.createRatesModel.effectiveMaxDate, selectedType);
      this.setFormErrors();
      this.setValidation('effectiveDate');
    }
    this.changeDetector.detectChanges();
  }
  setValidation(fieldName: string) {
    if (!this.createRatesModel.setUpForm.controls[fieldName].value) {
      this.createRatesModel.setUpForm.controls[fieldName].setErrors({
        'required': true
      });
    }
  }
  validateEffectiveDate() {
    if (this.createRatesModel.setUpForm.controls['effectiveDate'].value &&
      this.createRatesModel.setUpForm.controls['expirationDate'].value &&
      (new Date(this.createRatesModel.setUpForm.controls['effectiveDate'].value) >
        new Date(this.createRatesModel.setUpForm.controls['expirationDate'].value))) {
      this.createRatesModel.inValidDate = true;
    } else {
      this.createRatesModel.inValidDate = false;
    }
  }
  setFormErrors() {
    const effError = (this.createRatesModel.inValidEffDate || this.createRatesModel.inValidDate);
    const expError = (this.createRatesModel.inValidExpDate || this.createRatesModel.inValidDate);
    this.createRatesModel.setUpForm.controls.effectiveDate.setErrors(
      DateValidation.setDateFieldError(this.createRatesModel.setUpForm.controls['effectiveDate'].errors,
      this.createRatesModel.setUpForm.controls['effectiveDate'].value,
      effError));
      this.createRatesModel.setUpForm.controls.expirationDate.setErrors(
      DateValidation.setDateFieldError(this.createRatesModel.setUpForm.controls['expirationDate'].errors,
      this.createRatesModel.setUpForm.controls['expirationDate'].value,
      expError));
    this.changeDetector.detectChanges();
  }
  onWaivedCheckboxSelect(waivedCheckboxStatus: boolean) {
    if (waivedCheckboxStatus) {
      this.createRatesModel.waivedFlag = false;
      this.createRatesModel.setUpForm.controls['calculateRate'].setValue(null);
      this.createRatesModel.setUpForm.controls['passThrough'].setValue(null);
      this.createRatesModel.setUpForm.controls['rollUp'].setValue(null);
    } else {
      this.createRatesModel.waivedFlag = true;
    }
    this.createRatesModel.CheckBoxAttributes = {
      waived: waivedCheckboxStatus,
      calculateRate: false,
      passThrough: false,
      rollUp: false
    };
    if (waivedCheckboxStatus && this.createRatesModel.isAddRateClicked) {
      this.waivedChange.emit(true);
    }
  }
  onCalulateRateManuallyChecked(calculateRateCheckedStatus: boolean) {
    this.createRatesModel.CheckBoxAttributes.waived = false;
    this.createRatesModel.CheckBoxAttributes.calculateRate = calculateRateCheckedStatus;
    if (calculateRateCheckedStatus) {
      this.calculateManuallyChange.emit(true);
    }
  }
  onPassThroughChecked(passthroughCheckedStatus: boolean) {
    this.createRatesModel.CheckBoxAttributes.waived = false;
    this.createRatesModel.CheckBoxAttributes.passThrough = passthroughCheckedStatus;
    if (passthroughCheckedStatus) {
      this.passthroughChange.emit(true);
    }
  }
  onRollUpChecked(rollUpCheckedStatus: boolean) {
    this.createRatesModel.CheckBoxAttributes.waived = false;
    this.createRatesModel.CheckBoxAttributes.rollUp = rollUpCheckedStatus;

      this.rollupChange.emit(rollUpCheckedStatus);
  }
  setSuperUserBackDateDays() {
    this.createRateService.getSuperUserBackDate()
    .pipe(takeWhile(() => this.createRatesModel.isSubscribeFlag))
    .subscribe((backDateRes) => {
      this.createRatesModel.superUserBackDateDays =
        +backDateRes['_embedded']['configurationParameterDetails'][0]['configurationParameterValue'];
    });
  }
  onInputChargeType(event: Event) {
    if (!event.target['value'] ) {
      this.createRatesModel.setUpForm.controls['chargeType'].setValue('');
      this.createRatesModel.buSoBasedOnChargeType = [];
      this.selectedBuSo.emit([]);
      this.changeDetector.markForCheck();
      this.chargeTypeChange.emit(true);
    }
  }
  setSuperUserFutureDateDays() {
    this.createRateService.getSuperFutureBackDate()
    .pipe(takeWhile(() => this.createRatesModel.isSubscribeFlag))
    .subscribe((backDateRes) => {
      this.createRatesModel.superUserFutureDateDays =
        +backDateRes['_embedded']['configurationParameterDetails'][0]['configurationParameterValue'];
    });
  }
  getCheckBoxData() {
    this.createRateService.getCheckBoxData().pipe(takeWhile(() => this.createRatesModel.isSubscribeFlag))
      .subscribe((response: any) => {
        this.createRatesModel.checkBoxValue =
          response['_embedded']['customerAccessorialRateCriteriaTypes'].map((value) => {
            return {
              label: value['customerAccessorialRateCriteriaName'],
              value: value['customerAccessorialRateCriteriaTypeId']
            };
          });
        this.changeDetector.detectChanges();
      });
  }
}
