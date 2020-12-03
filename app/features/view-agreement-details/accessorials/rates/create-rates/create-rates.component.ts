import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component,
  ElementRef, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { ActivatedRoute, Params, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { MessageService } from 'primeng/components/common/messageservice';

import * as moment from 'moment';
import * as utils from 'lodash';
import { takeWhile } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';

import { LocalStorageService } from './../../../../../shared/jbh-app-services/local-storage.service';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';

import { DateValidation } from './../../../../../shared/jbh-app-services/date-validation';
import {
  AdditionalChargesComponent
} from './../../../../shared/accessorials/additional-charges/additional-charges/additional-charges.component';
import { CreateRatesModel } from './model/create-rates.model';
import { CreateDocumentationService } from '../../documentation/create-documentation/service/create-documentation.service';
import {
  DocumentationDate, RateSetUpResponse,
  CanComponentDeactivate
} from '../../documentation/create-documentation/model/create-documentation.interface';
import {
  ChargeCodeResponseInterface, EditAccesorialData, QuantityType, AccessorialRateAlternateChargeQuantityTypesItem,
  AlternateChargeQuantityType, ChargeCodeInterface, RateDocumentationInterface, CheckBoxAttributesInterface
} from './model/create-rates.interface';
import { CreateRateUtilityService } from '../create-rates/service/create-rate-utility.service';
import { CreateRateUtilsService } from '../create-rates/service/create-rate-utils.service';
import { CreateRateService } from './service/create-rate.service';
import { OptionalUtilityService } from '../../shared/services/optional-utility.service';
import { BuSoAssociation } from '../../shared/models/optional-attributes.interface';
import { EditRateUtility } from './service/edit-rates-utility';

@Component({
  selector: 'app-create-rates',
  templateUrl: './create-rates.component.html',
  styleUrls: ['./create-rates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRatesComponent implements OnInit, AfterViewInit, OnDestroy {

  createRatesModel: CreateRatesModel;
  agreementID: string;
  agreementURL: string;
  lineHaulUrl: string;
  @ViewChild('optionalFields') optionalFields: any;
  @ViewChild('contract') contract: any;
  @ViewChild('billTo') billTo: any;
  @ViewChild('sectionListModel') sectionListModel: any;
  @ViewChild('addRates') addRates: any;
  @ViewChild('addStairStepRates') addStairStepRates: any;
  @ViewChild('documentation') documentation: any;
  @ViewChild('addCharges') addCharges: AdditionalChargesComponent;
  @ViewChild('top') topElemRef: ElementRef;
  @ViewChild('myDiv') myDiv;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly localStore: LocalStorageService,
    private readonly messageService: MessageService,
    private readonly createRateService: CreateRateService,
    private readonly createDocumentationService: CreateDocumentationService,
    private readonly createRateUtilityService: CreateRateUtilityService,
    readonly createRateUtilsService: CreateRateUtilsService,
    private readonly optionalUtilityService: OptionalUtilityService,
    private readonly currencyPipe: CurrencyPipe,
    private readonly shared: BroadcasterService) {
    this.lineHaulUrl = '/viewagreement';
    this.route.queryParams.subscribe((params: Params) => {
      this.agreementID = String(params['id']);
      this.agreementURL = `/viewagreement?id=${this.agreementID}`;
      this.createRatesModel = new CreateRatesModel(this.agreementID);
    }, (error: Error) => {
      this.createRateUtilityService.toastMessage(this.messageService, 'error', 'Error', error.message);
    });
  }
  ngOnInit() {
    this.createRatesModel.agreementDetails = this.localStore.getAgreementDetails();
    this.createRateUtilsService.createRatesForm(this.createRatesModel, this.formBuilder);
    this.onFormValueChange();
    this.getCheckBoxData();
    this.createRateUtilsService.setSuperUserBackDateDays(this.createRatesModel);
    this.createRateUtilsService.setSuperUserFutureDateDays(this.createRatesModel);
    this.subscribeToAccesorialRatesEdit();
    this.createRateUtilsService.setValuesForSaveCloseDropDown(this);
  }
  ngAfterViewInit() {
    if (this.topElemRef !== null) {
      this.topElemRef.nativeElement.scrollIntoView();
    }
  }
  ngOnDestroy() {
    this.createRatesModel.createRatesValidation.isSubscribeFlag = false;
  }
  subscribeToAccesorialRatesEdit() {
    this.shared.on<EditAccesorialData>('editAccesorialRates').pipe(takeWhile(() =>
      this.createRatesModel.createRatesValidation.isSubscribeFlag))
      .subscribe((editResponse: EditAccesorialData) => {
        if (editResponse.isAccessorialRateEdit) {
          this.createRateUtilsService.setAccessorialRateValues(this, editResponse);
        } else {
          this.setAgreementLevelDate();
          this.getCurrencyCode();
        }
        this.getChargeTypes();
      });
  }
  patchValuesToAccessorialRates(editRateData: object) {
    EditRateUtility.setValuesToAccessorialRateForm(editRateData, this.createRatesModel,
      this.optionalFields['optionalAttributesModel'], this.optionalFields, this, this.documentation);
    EditRateUtility.checkRatesLevel(editRateData, this.createRatesModel);
    this.changeDetector.detectChanges();
  }
  onChangeRateDocumentLevel(event) {
    this.createRatesModel.isPopupYesClicked = false;
    this.createRatesModel.createRatesValidation.isDateChanged = false;
    this.createRatesModel.isEditAccessorialRateClicked = false;
    this.createRatesModel.errorMsg = false;
    const rateLevelChangeVal = event['option']['value'];
    this.dateCheck();
    if (rateLevelChangeVal === this.createRatesModel.ratesForm.controls['documentationLevel'].value) {
      return;
    }
    this.checkContractSection(rateLevelChangeVal);
    this.contractSectionReset();
    this.changeDetector.detectChanges();
  }
  checkContractSection(rateLevelChangeVal: string) {
    if (this.contract) {
      this.contractListCheck();
    } else if (this.sectionListModel) {
      this.sectionListCheck();
    }
    this.formCheck(rateLevelChangeVal);
  }
  onPopupClose() {
    if (!this.createRatesModel.isPopupYesClicked) {
      this.onHidePop('documentationLevelChange');
    }
  }
  formCheck(rateLevelChangeVal: string) {
    this.removeDocumentation();
    this.createRatesModel.ratesDocumentLevel = rateLevelChangeVal;
  }
  ratesForDirtyCheck(): boolean {
    let ratesFormDirty = false;
    utils.forIn(this.createRatesModel.ratesForm.controls, (value, name: string) => {
      if (name !== 'customerName' && name !== 'effectiveDate' && name !== 'expirationDate' &&
        name !== 'documentationLevel' && value.touched) {
        ratesFormDirty = true;
      }
    });
    return ratesFormDirty;
  }
  contractListCheck() {
    if (this.createRatesModel.selectedContractValue &&
      this.createRatesModel.selectedContractValue.length) {
      this.createRatesModel.contractChecked = true;
    }
  }
  sectionListCheck() {
    if (this.createRatesModel.selectedSectionValue &&
      this.createRatesModel.selectedSectionValue.length) {
      this.createRatesModel.sectionChecked = true;
    }
  }
  setAgreementLevelDate() {
    this.createRatesModel.loading = true;
    this.createDocumentationService.getAgreementLevelDate(this.agreementID, this.createRatesModel.ratesDocumentLevel)
      .pipe(takeWhile(() => this.createRatesModel.createRatesValidation.isSubscribeFlag))
      .subscribe((documentationDate: DocumentationDate) => {
        this.createRatesModel.loading = false;
        this.populateAgreementLevel(documentationDate);
      }, (agreementLevelError: Error) => {
        this.createRatesModel.loading = false;
        this.createRateUtilityService.
          toastMessage(this.messageService, 'error', 'Error', agreementLevelError['error']['errors'][0]['errorMessage']);
      });
  }
  getCheckBoxData() {
    this.createRateService.getCheckBoxData().pipe(takeWhile(() => this.createRatesModel.createRatesValidation.isSubscribeFlag))
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
  populateAgreementLevel(documentationDate: DocumentationDate) {
    if (documentationDate) {
      this.createRatesModel.ratesForm.controls['expirationDate'].
        setValue(this.dateFormatter(documentationDate['agreementExpirationDate']));
      this.createRatesModel.ratesForm.controls['effectiveDate'].setValue(this.dateFormatter(new Date()));
      this.createRatesModel.createRatesValidation.expirationDate = this.dateFormatter(documentationDate['agreementExpirationDate']);
      this.createRatesModel.createRatesValidation.effectiveDate = this.dateFormatter(new Date());
      this.createRatesModel.createRatesValidation.agreementEffectiveDate = this.createRatesModel.createRatesValidation.effectiveDate;
      this.createRatesModel.createRatesValidation.agreementEndDate = this.createRatesModel.createRatesValidation.expirationDate;
      this.changeDetector.detectChanges();
    }
  }
  dateCheck() {
    if (this.createRatesModel.createRatesValidation.agreementEffectiveDate !== this.createRatesModel.createRatesValidation.effectiveDate ||
      this.createRatesModel.createRatesValidation.agreementEndDate !== this.createRatesModel.createRatesValidation.expirationDate) {
      this.createRatesModel.createRatesValidation.isDateChanged = true;
    }
  }
  onDateSelected(selectedDate: Date, selectedType: string) {
    this.createRatesModel.isCorrectEffDateFormat = false;
    this.createRatesModel.isCorrectExpDateFormat = false;
    if (selectedType.toLowerCase() === 'effectivedate') {
      this.validateEffectiveDate();
      this.createRatesModel.createRatesValidation.effectiveDate = this.dateFormatter(selectedDate);
      this.createRatesModel.createRatesValidation.expirationMinDate = new Date(selectedDate);
      this.createRatesModel.createRatesValidation.disabledExpirationDate = [new Date(selectedDate)];
      this.validateDate(this.createRatesModel.createRatesValidation.expirationMinDate, selectedType);
      this.setFormErrors();
      this.setValidation('expirationDate');
    } else if (selectedType.toLowerCase() === 'expirationdate') {
      this.validateEffectiveDate();
      this.createRatesModel.createRatesValidation.expirationDate = this.dateFormatter(selectedDate);
      this.createRatesModel.createRatesValidation.effectiveMaxDate = new Date(selectedDate);
      this.createRatesModel.createRatesValidation.disabledEffectiveDate = [new Date(selectedDate)];
      this.validateDate(this.createRatesModel.createRatesValidation.effectiveMaxDate, selectedType);
      this.setFormErrors();
      this.setValidation('effectiveDate');
    }
  }
  dateReset() {
    this.createRatesModel.ratesForm.controls['effectiveDate']
      .setValue(this.createRatesModel.createRatesValidation.agreementEffectiveDate);
    this.createRatesModel.ratesForm.controls['expirationDate'].setValue(this.createRatesModel.createRatesValidation.agreementEndDate);
    this.createRatesModel.createRatesValidation.effectiveDate = this.createRatesModel.createRatesValidation.agreementEffectiveDate;
    this.createRatesModel.createRatesValidation.expirationDate = this.createRatesModel.createRatesValidation.agreementEndDate;
  }
  onFormValueChange() {
    const formFields = ['effectiveDate', 'expirationDate', 'chargeType', 'currency'];
    formFields.forEach(fieldName => {
      this.createRatesModel.ratesForm.controls[fieldName].valueChanges.subscribe(val => {
        this.removeDocumentation();
      });
    });
    this.optionalFields.optionalAttributesModel.optionalForm.valueChanges.subscribe(val => {
      this.removeDocumentation();
    });
  }
  typedDateValidate(event, fieldName: string) {
    const regex = new RegExp('^(|(0[1-9])|(1[0-2]))\/((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1]))\/(([0-9]{4}))$');
    switch (fieldName) {
      case 'effectiveDate':
        if (event.srcElement['value'] && regex.test(event['srcElement']['value'].trim()) &&
          this.createRatesModel.ratesForm.controls['effectiveDate'].value) {
          this.createRatesModel.isCorrectEffDateFormat = false;
          const effDate = new Date(event.srcElement['value']);
          this.createRatesModel.ratesForm.controls['effectiveDate'].setValue(effDate);
          this.validateDate(effDate, fieldName);
          this.onDateSelected(event.srcElement['value'], 'effectiveDate');
          this.setFormErrors();
        } else {
          this.createRatesModel.isCorrectEffDateFormat = true;
        }
        break;
      case 'expirationDate':
        if (event.srcElement['value'] && regex.test(event.srcElement['value'].trim())
          && this.createRatesModel.ratesForm.controls['expirationDate'].value) {
          this.createRatesModel.isCorrectExpDateFormat = false;
          const expDate = new Date(event.srcElement['value']);
          this.createRatesModel.ratesForm.controls['expirationDate'].setValue(expDate);
          this.validateDate(expDate, fieldName);
          this.onDateSelected(event.srcElement['value'], 'expirationDate');
          this.setFormErrors();
        } else {
          this.createRatesModel.isCorrectExpDateFormat = true;
        }
        break;
      default: break;
    }
  }
  validateDate(date, fieldName: string) {
    const agreementEffectiveDate = this.createRatesModel.createRatesValidation.agreementEffectiveDate;
    const agreementEndDate = this.createRatesModel.createRatesValidation.agreementEndDate;
    switch (fieldName) {
      case 'effectiveDate':
        if (date > new Date(agreementEndDate) ||
          date < moment(agreementEffectiveDate).subtract(this.createRatesModel.superUserBackDateDays, 'days') ||
          date > moment(agreementEndDate).add(this.createRatesModel.superUserFutureDateDays, 'days')) {
          this.createRatesModel.createRatesValidation.inValidEffDate = true;
          break;
        } else {
          this.createRatesModel.createRatesValidation.inValidEffDate = false;
          break;
        }
      case 'expirationDate':
        if (date > new Date(agreementEndDate) ||
          date <= moment(new Date()).subtract(this.createRatesModel.superUserBackDateDays, 'days')) {
          this.createRatesModel.createRatesValidation.inValidExpDate = true;
          break;
        } else {
          this.createRatesModel.createRatesValidation.inValidExpDate = false;
          break;
        }
    }
  }
  setValidation(fieldName: string) {
    if (!this.createRatesModel.ratesForm.controls[fieldName].value) {
      this.createRatesModel.ratesForm.controls[fieldName].setErrors({
        'required': true
      });
    }
  }
  validateEffectiveDate() {
    if (this.createRatesModel.ratesForm.controls['effectiveDate'].value &&
      this.createRatesModel.ratesForm.controls['expirationDate'].value &&
      (new Date(this.createRatesModel.ratesForm.controls['effectiveDate'].value) >
        new Date(this.createRatesModel.ratesForm.controls['expirationDate'].value))) {
      this.createRatesModel.createRatesValidation.inValidDate = true;
    } else {
      this.createRatesModel.createRatesValidation.inValidDate = false;
    }
  }
  onSaveRates() {
    this.createRateUtilityService.onValidateForm(false, this);
  }
  setFormErrors() {
    const effError = (this.createRatesModel.createRatesValidation.inValidEffDate ||
      this.createRatesModel.createRatesValidation.inValidDate);
    const expError = (this.createRatesModel.createRatesValidation.inValidExpDate ||
      this.createRatesModel.createRatesValidation.inValidDate);
    this.createRatesModel.ratesForm.controls.effectiveDate.setErrors(
      DateValidation.setDateFieldError(this.createRatesModel.ratesForm.controls['effectiveDate'].errors,
      this.createRatesModel.ratesForm.controls['effectiveDate'].value,
      effError));
      this.createRatesModel.ratesForm.controls.expirationDate.setErrors(
      DateValidation.setDateFieldError(this.createRatesModel.ratesForm.controls['expirationDate'].errors,
      this.createRatesModel.ratesForm.controls['expirationDate'].value,
      expError));
  }
  dateFormatter(value: string | Date): string {
    return moment(value).format('MM/DD/YYYY');
  }
  onSaveRateSetUp() {
    if (this.createRateUtilityService.validateDocumentation(this)) {
      if (this.createRateUtilityService.onValidateForm(false, this)) {
        this.checkForValidRateWithoutFree();
      }
    } else {
      this.createRateUtilityService.onValidateForm(true, this);
    }
  }
  checkForValidRateWithoutFree() {
    if (this.createRatesModel.isAddStairStepClicked &&
      this.addStairStepRates.stairStepModel.addStairStepForm.controls.stepsArray['controls'].length === 1
      &&
      this.addStairStepRates.stairStepModel.addStairStepForm.controls.stepsArray['controls'][0]['controls']['step'].value.label
      === 'Free') {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error', summary: 'Missing Required Information',
        detail: 'Please specify a valid stair steps'
      });
    } else {
      this.createRatesModel.isShowSavePopup = true;
    }
  }
  isServieLevelMandatory(): boolean {
    const optionalForm = this.optionalFields['optionalAttributesModel']['optionalForm'];
    const businessUnit = optionalForm.get('businessUnit').value;
    const serviceLevel = optionalForm.get('serviceLevel');
    if (businessUnit && businessUnit.length) {
      if (!serviceLevel.value || !serviceLevel.value.length) {
        this.messageService.clear();
        this.messageService.add({
          severity: 'error', summary: this.createRatesModel.createRatesValidation.errorText,
          detail: 'Provide a Service Level'
        });
        serviceLevel.setValidators([Validators.required]);
        serviceLevel.updateValueAndValidity();
        serviceLevel.markAsTouched();
        return true;
      } else {
        serviceLevel.clearValidators();
        serviceLevel.updateValueAndValidity();
      }
    }
    return false;
  }
  saveRateSetUp() {
    const addRateModel = this.addRates ? this.addRates.addRatesModel : null;
    const stairStepRates = this.addStairStepRates ? this.addStairStepRates.stairStepModel : null;
    const addChargesModel = this.addCharges ? this.addCharges.addChargesModel : null;
    const params = this.createRateUtilityService.
      ratePostFramer(this.createRatesModel, this.optionalFields['optionalAttributesModel'],
        this.billTo['billToModel'], addRateModel, this.documentation.viewDocumentationModel, addChargesModel, stairStepRates);
    this.createRatesModel.loading = true;
    this.createRateUtilsService.saveRateSetup(this, params);
  }
  navigateToViewAgreementPage(toastMessageTobeDisplayed: string) {
    this.createRatesModel.loading = false;
    if (!this.createRatesModel.isSaveCreateNewClicked && !this.createRatesModel.isSaveCreateCopyClicked) {
      this.router.navigate(['/viewagreement'], { queryParams: { id: this.agreementID } });
    } else if (this.createRatesModel.isSaveCreateCopyClicked) {
      this.createRateUtilityService.
        toastMessage(this.messageService, 'success', 'Rate Setup Saved', toastMessageTobeDisplayed);
      return;
    } else {
      this.createRatesModel = new CreateRatesModel(this.agreementID);
      this.createRatesModel.agreementDetails = this.localStore.getAgreementDetails();
      this.createRateUtilsService.createRatesForm(this.createRatesModel, this.formBuilder);
      this.getCheckBoxData();
      this.createRateUtilsService.setSuperUserBackDateDays(this.createRatesModel);
      this.createRateUtilsService.setSuperUserFutureDateDays(this.createRatesModel);
      this.subscribeToAccesorialRatesEdit();
      this.createRateUtilsService.setValuesForSaveCloseDropDown(this);
      this.onFormValueChange();
      this.optionalFields.optionalAttributesModel.optionalForm.reset();
      this.optionalFields.optionalAttributesModel.businessUnitData = [];
      this.optionalFields.optionalAttributesModel.serviceLevel = [];
      this.optionalFields.optionalAttributesModel.operationalService = [];
    }
    this.createRateUtilityService.
      toastMessage(this.messageService, 'success', 'Rate Setup Saved', toastMessageTobeDisplayed);
  }
  accessorialRatesErrorScenario(rateError: Error) {
    if (rateError['error'] && rateError['error']['errors'][0] && rateError['error']['errors'][0]['errorType']) {
      this.createRatesModel.loading = false;
      this.createRatesModel.errorMsg = true;
      this.showDuplicateRateError(rateError);
      this.changeDetector.detectChanges();
    }
  }
  validateFieldsForDocumentation(validateFields: boolean) {
    this.createRatesModel.createRatesValidation.isRefreshClicked = true;
    if (validateFields) {
      this.createRatesModel.createRatesValidation.validFields = this.createRateUtilityService.onValidateForm(true, this);
      this.optionalUtilityService.setDocumentationValid(this.createRatesModel.createRatesValidation);
      this.changeDetector.markForCheck();
    }
  }
  getContractDetails(event) {
    this.createRatesModel.selectedContractValue = event;
    this.changeDetector.detectChanges();
  }
  getsectionDetails(event) {
    this.createRatesModel.selectedSectionValue = event;
    this.changeDetector.detectChanges();
  }
  contractSectionReset() {
    if (this.contract) {
      this.contract.contractListModel.selectedContract = [];
      this.contract.changeDetector.detectChanges();
      this.createRatesModel.selectedContractValue = [];
    } else if (this.sectionListModel) {
      this.sectionListModel.sectionsModel.selectedSection = [];
      this.sectionListModel.changeDetector.detectChanges();
      this.createRatesModel.selectedSectionValue = [];
    }
  }
  ratesFieldReset() {
    utils.forIn(this.createRatesModel.ratesForm.controls, (value, name: string) => {
      if (name !== 'currency' && name !== 'effectiveDate' && name !== 'expirationDate' &&
        name !== 'documentationLevel') {
        this.createRatesModel.ratesForm.controls[name].reset();
      }
    });
  }
  onBusinessUnitShow($event) {
    this.createRatesModel.ratesForm.get('chargeType').markAsTouched();
  }
  getChargeTypes() {
    this.createRatesModel.createRatesValidation.chargeTypeloading = true;
    this.createRateService.getChargeTypes().pipe(takeWhile(() => this.createRatesModel.createRatesValidation.isSubscribeFlag))
      .subscribe((response: ChargeCodeResponseInterface[]) => {
        this.createRatesModel.createRatesValidation.chargeCodeResponse = response;
        this.createRatesModel.createRatesValidation.chargeType =
          response.map((value: ChargeCodeResponseInterface) => {
            return {
              label: `${value['chargeTypeName']} (${value['chargeTypeCode']})`,
              value: value['chargeTypeID'],
              description: value['chargeTypeCode']
            };
          });
        this.createRatesModel.createRatesValidation.chargeTypeloading = false;
        this.createRateUtilsService.setAlternateChargeTypesForEdit(this);
        this.changeDetector.detectChanges();
      });
  }
  onTypeChargeCode(event) {
    this.createRatesModel.chargeTypeFiltered = [];
    if (this.createRatesModel.createRatesValidation.chargeType) {
      this.createRatesModel.createRatesValidation.chargeType.forEach(element => {
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
  onSelectChargeCode(event) {
    this.createRatesModel.ratesForm.controls.customerName.setValue(null);
    this.optionalFields.optionalAttributesModel.optionalForm.controls.businessUnit.setValue(null);
    this.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.reset();
    this.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.clearValidators();
    this.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.updateValueAndValidity();
    this.optionalFields.optionalAttributesModel.optionalForm.controls.requestedService.reset();
    this.optionalFields.optionalAttributesModel.serviceLevel = [];
    this.optionalFields.optionalAttributesModel.operationalService = [];
    this.createRateUtilsService.alternateChargeTypeValidation(this);
    this.createRatesModel.isEditAccessorialRateClicked = false;
    this.getAlternateChargeTypeValues();
    this.getBUbasedOnChargeType(event['value']);
  }
  getBUbasedOnChargeType(chargeTypeId: number) {
    this.createRateService.getBUbasedOnChargeType(chargeTypeId).pipe(takeWhile(() =>
      this.createRatesModel.createRatesValidation.isSubscribeFlag))
      .subscribe((data: BuSoAssociation[]) => {
        this.createRatesModel.buSoBasedOnChargeType = data;
        this.changeDetector.detectChanges();
      });
  }
  onautoCompleteBlur(event, controlName: string) {
    if (this.createRatesModel.ratesForm.controls[controlName].value &&
      !event.target['value']) {
      this.createRatesModel.ratesForm.controls[controlName].setValue('');
      this.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.reset();
      this.optionalFields.optionalAttributesModel.optionalForm.controls.requestedService.reset();
      this.optionalFields.optionalAttributesModel.optionalForm.controls.businessUnit.reset();
      this.optionalFields.optionalAttributesModel.serviceLevel = [];
      this.optionalFields.optionalAttributesModel.operationalService = [];
    }
  }
  onInputChargeType(event) {
    if (!event.target['value']) {
      this.createRateUtilsService.onClearChargeType(this);
    }
  }
  selectedBuSoOnly(data) {
    this.createRatesModel.selectedBuSo = data;
  }
  busoselect(data) {
    if (!this.createRatesModel.ratesForm.controls['chargeType'].value) {
      this.createRatesModel.buSo = [];
    } else {
      this.createRatesModel.buSo = data;
    }
    this.changeDetector.markForCheck();
  }
  getCurrencyCode() {
    this.createDocumentationService.getCurrencyCodes().pipe(takeWhile(() => this.createRatesModel.createRatesValidation.isSubscribeFlag))
      .subscribe((data: [string]) => {
        if (data) {
          this.createRatesModel.currencyCodes = data.map((currencyCode: string, index: number) => {
            return {
              label: currencyCode,
              value: currencyCode
            };
          });
          this.createRateUtilsService.getAgreementLevelCurrency(this.agreementID, this);
        }
      });
  }
  onTypeCurrencyType(event) {
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
  addAlternateCharge() {
    this.createRatesModel.alternateCharge = true;
    this.createRatesModel.ratesForm.controls.alternateChargeType.reset();
    this.createRatesModel.ratesForm.controls.quantity.reset();
    this.createRatesModel.ratesForm.controls.quantityType.reset();
    this.getQuantityTypeValues();
    this.getAlternateChargeTypeValues();
  }
  getQuantityTypeValues() {
    this.createRateService.getQuantityType().pipe(takeWhile(() => this.createRatesModel.createRatesValidation.isSubscribeFlag))
      .subscribe((quantity: QuantityType) => {
        this.populateQuantityValues(quantity);
      });
  }
  populateQuantityValues(quantity: QuantityType) {
    if (quantity) {
      this.createRatesModel.alternateChargeQuantity = [];
      quantity['_embedded']['accessorialRateAlternateChargeQuantityTypes'].
        forEach((quantityElement: AccessorialRateAlternateChargeQuantityTypesItem) => {
          this.createRatesModel.alternateChargeQuantity.push({
            label: quantityElement['accessorialRateChargeQuantityTypeName'],
            value: quantityElement['accessorialRateAlternateChargeQuantityTypeId']
          });
        });
      this.changeDetector.detectChanges();
    }
  }
  onTypeQuantityType(quantityTypedValue) {
    if (this.createRatesModel.alternateChargeQuantity) {
      this.createRatesModel.alternateChargeQuantityFiltered = [];
      this.createRatesModel.alternateChargeQuantity.forEach((quantityFilterElement: AlternateChargeQuantityType) => {
        if (quantityFilterElement.label && quantityFilterElement.label.toString().
          toLowerCase().indexOf(quantityTypedValue['query'].toLowerCase()) !== -1) {
          this.createRatesModel.alternateChargeQuantityFiltered.push({
            label: quantityFilterElement.label,
            value: quantityFilterElement.value
          });
        }
      });
      this.createRatesModel.alternateChargeQuantityFiltered =
        utils.sortBy(this.createRatesModel.alternateChargeQuantityFiltered, ['label']);
    }
    this.changeDetector.detectChanges();
  }
  getAlternateChargeTypeValues() {
    this.createRatesModel.createRatesValidation.alternateChargeType = this.createRatesModel.createRatesValidation.chargeType;
    this.changeDetector.detectChanges();
  }
  onTypeAlternateChargeType(alternateChargeTypedValue) {
    if (this.createRatesModel.createRatesValidation.alternateChargeType) {
      this.createRatesModel.alternateChargeTypeFiltered = [];
      this.createRatesModel.createRatesValidation.alternateChargeType.forEach((alternateChargeFilterElement: ChargeCodeInterface) => {
        if (alternateChargeFilterElement.label && alternateChargeFilterElement.label.toString().
          toLowerCase().indexOf(alternateChargeTypedValue['query'].toLowerCase()) !== -1) {
          this.createRatesModel.alternateChargeTypeFiltered.push({
            label: alternateChargeFilterElement.label,
            value: alternateChargeFilterElement.value,
            description: alternateChargeFilterElement.description
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  onQuantityBlur(value: string) {
    let quantityData;
    quantityData = this.createRatesModel.ratesForm.get('quantity');
    const formattedAmount = this.createRateUtilityService.formatAmount(value, this.currencyPipe);
    if (formattedAmount) {
      if (Number(formattedAmount) <= 0) {
        this.createRatesModel.ratesForm.controls['quantity'].setErrors({ error: true });
      } else {
        quantityData.setValue(formattedAmount);
        this.setFormValidators('quantityType');
        this.setFormValidators('alternateChargeType');
      }
    }
    this.changeDetector.detectChanges();
  }
  onSelectAlternateChargeType(event: ChargeCodeInterface) {
    if (event.value) {
      this.setFormValidators('quantity');
      this.setFormValidators('quantityType');
      this.createRateUtilsService.alternateChargeTypeValidation(this);
    }
  }
  setFormValidators(controlName: string) {
    if (!this.createRatesModel.ratesForm.controls[controlName].errors) {
      this.createRatesModel.ratesForm.controls[controlName].setValidators([Validators.required]);
      this.createRatesModel.ratesForm.controls[controlName].updateValueAndValidity();
    }
  }
  onSelectQuantityType(event: AlternateChargeQuantityType) {
    this.setFormValidators('quantity');
    this.setFormValidators('alternateChargeType');
  }
  removeCharges() {
    if (this.createRatesModel.ratesForm.controls.quantity.value ||
      this.createRatesModel.ratesForm.controls.quantityType.value || this.createRatesModel.ratesForm.controls.alternateChargeType.value) {
      this.createRatesModel.isAlternateChargeChange = true;
    } else {
      this.createRatesModel.alternateCharge = false;
    }
  }
  retainAlternateCharge() {
    this.createRatesModel.isAlternateChargeChange = false;
  }
  removeAlternateCharge() {
    this.createRatesModel.alternateCharge = false;
    this.createRatesModel.isAlternateChargeChange = false;
    this.emptyValidations('quantity');
    this.emptyValidations('quantityType');
    this.emptyValidations('alternateChargeType');
  }
  emptyValidations(controlName: string) {
    this.createRatesModel.ratesForm.controls[controlName].setValidators(null);
    this.createRatesModel.ratesForm.controls[controlName].setValue(null);
    this.createRatesModel.ratesForm.controls[controlName].updateValueAndValidity();
  }
  onCurrencyTypeBlur(event) {
    if (this.createRatesModel.ratesForm.controls['currency'].value &&
      !event.target['value']) {
      this.createRatesModel.ratesForm.controls['currency'].setValue(null);
    }
  }
  onWaivedCheckboxSelect(waivedCheckboxStatus: boolean) {
    if (waivedCheckboxStatus) {
      this.createRatesModel.waivedFlag = false;
      this.createRatesModel.ratesForm.controls['calculateRate'].setValue(null);
      this.createRatesModel.ratesForm.controls['passThrough'].setValue(null);
      this.createRatesModel.ratesForm.controls['rollUp'].setValue(null);
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
      this.allowZeroInAddedFields();
    }
  }
  onCalulateRateManuallyChecked(calculateRateCheckedStatus: boolean) {
    this.createRatesModel.CheckBoxAttributes = {
      waived: this.createRatesModel.CheckBoxAttributes.waived,
      calculateRate: calculateRateCheckedStatus,
      passThrough: this.createRatesModel.CheckBoxAttributes.passThrough,
      rollUp: this.createRatesModel.CheckBoxAttributes.rollUp
    };
    if (this.createRatesModel.isAddRateClicked && !this.createRatesModel.CheckBoxAttributes.rollUp) {
      this.allowZeroInAddedFields();
    }
  }
  onPassThroughChecked(passthroughCheckedStatus: boolean) {
    this.createRatesModel.CheckBoxAttributes = {
      waived: this.createRatesModel.CheckBoxAttributes.waived,
      calculateRate: this.createRatesModel.CheckBoxAttributes.calculateRate,
      passThrough: passthroughCheckedStatus,
      rollUp: this.createRatesModel.CheckBoxAttributes.rollUp
    };
    if (passthroughCheckedStatus && this.createRatesModel.isAddRateClicked && !this.createRatesModel.CheckBoxAttributes.rollUp) {
      this.allowZeroInAddedFields();
    } else if ((passthroughCheckedStatus && this.createRatesModel.isAddRateClicked && this.createRatesModel.CheckBoxAttributes.rollUp) ||
      (!passthroughCheckedStatus && this.createRatesModel.isAddRateClicked)) {
      this.restrictZeroInAddedFields();
    }
  }
  onRollUpChecked(rollUpCheckedStatus: boolean) {
    this.createRatesModel.CheckBoxAttributes = {
      waived: this.createRatesModel.CheckBoxAttributes.waived,
      calculateRate: this.createRatesModel.CheckBoxAttributes.calculateRate,
      passThrough: this.createRatesModel.CheckBoxAttributes.passThrough,
      rollUp: rollUpCheckedStatus
    };
    if (rollUpCheckedStatus && this.createRatesModel.isAddRateClicked) {
      this.restrictZeroInAddedFields();
    } else if (!rollUpCheckedStatus && this.createRatesModel.isAddRateClicked) {
      this.allowZeroInAddedFields();
    }
  }
  restrictZeroInAddedFields() {
    utils.forIn(this.addRates.addRatesModel.addRateForm.controls.rates.controls, (value, name: string) => {
      utils.forIn(value['controls'], (forArrayValue, forArrayName: string) => {
        if (forArrayName === 'rateAmount' && forArrayValue['value']) {
          const amount = this.createRateUtilityService.formatAmount(forArrayValue['value'], this.currencyPipe);
          if (Number(amount) === 0) {
            forArrayValue.setErrors({ error: true });
          }
        }
      });
    });
  }
  allowZeroInAddedFields() {
    utils.forIn(this.addRates.addRatesModel.addRateForm.controls.rates.controls, (value, name: string) => {
      utils.forIn(value['controls'], (forArrayValue, forArrayName: string) => {
        if (forArrayName === 'rateAmount' && forArrayValue['value']) {
          const amount = this.createRateUtilityService.formatAmount(forArrayValue['value'], this.currencyPipe);
          if (Number(amount) === 0) {
            forArrayValue.setErrors(null);
          }
        }
      });
    });
  }
  onHidePop(keyName: string) {
    this.createRatesModel.isPopupYesClicked = false;
    this.createRatesModel[keyName] = false;
    this.createRatesModel.ratesForm.controls['documentationLevel']
      .setValue(this.createRatesModel.ratesDocumentLevel);
  }
  savePopupYes() {
    this.createRatesModel.isShowSavePopup = false;
    this.saveRateSetUp();
  }
  savePopupNo() {
    this.createRatesModel.isShowSavePopup = false;
  }
  onHideCancelPop(keyName: string) {
    this.createRatesModel.isPopupYesClicked = false;
    this.createRatesModel.rateCancel = false;
  }
  onDontSave() {
    this.createRatesModel.isCancelClicked = true;
    this.localStore.setAccessorialTab('accessType', 'create', { id: 0, text: 'rates' });
    this.router.navigate(['/viewagreement'], { queryParams: { id: this.agreementID } });
  }
  onRateCancel() {
    if (this.contract) {
      this.contractListCheck();
    } else if (this.sectionListModel) {
      this.sectionListCheck();
    }
    this.cancelCheck();
  }
  cancelCheck() {
    if (this.optionalFields['optionalAttributesModel']['optionalForm'].dirty
      || this.createRatesModel.contractChecked || this.createRatesModel.sectionChecked || this.createRatesModel.ratesForm.dirty ||
      this.checkDirty()) {
      this.createRatesModel.rateCancel = true;
    } else {
      this.onDontSave();
    }
  }
  checkDirty() {
    return ((this.addStairStepRates && this.addStairStepRates.stairStepModel.addStairStepForm.dirty)
      ||
      (this.addRates && this.addRates.addRatesModel.addRateForm.dirty) ||
      (this.addCharges && this.addCharges.addChargesModel.addChargesForm.dirty));
  }
  onAddRates() {
    this.createRatesModel.isAddRateClicked = true;
  }
  onAdditonalChargesClicked() {
    this.createRatesModel.isAdditionalChargesClicked = true;
  }
  removeAllAdditionalCharges() {
    this.createRatesModel.isAdditionalChargesClicked = false;
    this.createRatesModel.isEditAccessorialRateClicked = false;
  }
  onAddStairStepRates() {
    this.createRatesModel.isAddStairStepClicked = true;
  }
  removeAllRates() {
    const amountFC = (this.addRates.addRatesModel.addRateForm.get('rates') as FormArray);
    const isAdditionalChargesEmpty = (this.addCharges) ? this.addCharges.isAdditionalChargesEmpty() : true;
    if (!isAdditionalChargesEmpty || !utils.isEmpty(amountFC && (amountFC.value[0].rateType || amountFC.value[0].maxAmount ||
      amountFC.value[0].minAmount || amountFC.value[0].rateAmount || amountFC.value[0].rounding))) {
      this.createRatesModel.addRateCancel = true;
    } else {
      this.createRatesModel.isAddRateClicked = false;
      this.removeAllAdditionalCharges();
    }
  }
  removeAllStairStepRates() {
    const amountFC1 = (this.addStairStepRates.stairStepModel.addStairStepForm.get('stepsArray') as FormArray);
    const amountFC = (this.addStairStepRates.stairStepModel.addStairStepForm.controls);
    if (this.stairStepValueCheck(amountFC1, amountFC)) {
      this.createRatesModel.addStairRateCancel = true;
    } else {
      this.createRatesModel.isAddStairStepClicked = false;
      this.removeAllAdditionalCharges();
    }
  }
  stairStepValueCheck(amountFC1, amountFC) {
    const isAdditionalChargesEmpty = (this.addCharges) ? this.addCharges.isAdditionalChargesEmpty() : true;
    return (!isAdditionalChargesEmpty || !utils.isEmpty(amountFC && (amountFC1.value[0].step
      || amountFC1.value[0].fromQuantity ||
      amountFC1.value[0].toQuantity || amountFC1.value[0].rateAmount ||
      amountFC.rounding.value || amountFC.minAmount.value ||
      amountFC.maxAmount.value || amountFC.rateType.value || amountFC.maxApplidedWhen.value)));
  }
  onRemoveStairStepRates() {
    this.addStairStepRates.stairStepModel.addStairStepForm.reset();
    this.createRatesModel.isAddStairStepClicked = false;
    this.removeAllAdditionalCharges();
    this.createRatesModel.addStairRateCancel = false;
  }
  onRemoveRates() {
    this.addRates.addRatesModel.addRateForm.reset();
    this.createRatesModel.isEditAccessorialRateClicked = false;
    this.createRatesModel.isAddRateClicked = false;
    this.createRatesModel.addRateCancel = false;
    this.removeAllAdditionalCharges();
  }
  removeDocumentation() {
    this.documentation.removeDocument('legal');
    this.documentation.removeDocument('instructional');
    this.documentation.changeDetector.detectChanges();
  }
  showDuplicateRateError(rateError: Error) {
    if (rateError['error'] && rateError['error']['errors'][0] && rateError['error']['errors'][0]['code'] === 'RATES_DUPLICATE_EXISTS') {
      this.createRatesModel.inlineErrormessage = [];
      this.messageService.clear();
      const identicalRatesMessage = 'The combination of options are identical to an existing rate.';
      const cancelRateMessage = 'Please cancel creating this rate or make changes to the existing fields';
      this.createRatesModel.inlineErrormessage.push({
        severity: 'error', summary: 'Rate Already Exists',
        detail: `${identicalRatesMessage}${cancelRateMessage}.`
      });
      this.topElemRef.nativeElement.scrollIntoView();
    } else {
      this.createRateUtilityService.toastMessage(this.messageService, 'error', 'Error', rateError['error']['errors'][0]['errorMessage']);
    }
  }
  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.createRatesModel.createRatesValidation.routingUrl = nextState.url;
    if ((this.optionalFields['optionalAttributesModel']['optionalForm'].dirty || this.createRatesModel.contractChecked
      || this.createRatesModel.sectionChecked || this.createRatesModel.ratesForm.controls['currency'].dirty
      || this.createRatesModel.ratesForm.controls['chargeType'].dirty || this.createRatesModel['ratesForm'].dirty || this.checkDirty())
      && !this.createRatesModel.popUpCoseFlag && !this.createRatesModel.isCancelClicked) {
      this.createRatesModel.createRatesValidation.isChangesSaving = false;
    } else {
      this.createRatesModel.createRatesValidation.isChangesSaving = true;
    }
    this.createRatesModel.rateNavigateCancel = !this.createRatesModel.createRatesValidation.isChangesSaving;
    this.changeDetector.detectChanges();
    return this.createRatesModel.createRatesValidation.isChangesSaving;
  }
  onDontSaveNavigate() {
    this.createRatesModel.popUpCoseFlag = true;
    this.createRatesModel.rateNavigateCancel = false;
    this.createRatesModel.createRatesValidation.isChangesSaving = true;
    if (this.createRatesModel.createRatesValidation.routingUrl === this.agreementURL) {
      this.router.navigate([this.lineHaulUrl], {
        queryParams:
          { id: this.agreementID }
      });
    } else {
      this.router.navigate([this.createRatesModel.createRatesValidation.routingUrl]);
    }
  }
  createDocumentation(iscreateDocumentation: boolean) {
    if (iscreateDocumentation) {
      this.createRatesModel.popUpCoseFlag = true;
    }
  }
  setEditRateFlagToFalse(editAccessorialStatus: boolean) {
    this.createRatesModel.isEditAccessorialRateClicked = editAccessorialStatus;
  }
  onSaveCloseClicked() {
    this.createRatesModel.isSaveCreateNewClicked = false;
    this.createRatesModel.isSaveCreateCopyClicked = false;
  }
  onAutoCompleteFiledsBlurred(typedValue: string, controlName: string) {
    this.createRateUtilsService.onAutoCompleteFiledsBlurred(typedValue, controlName, this);
  }
  onClearDropDown(formControlName: string) {
    this.createRatesModel.ratesForm.controls[formControlName].setValue('');
  }
  effectiveandChargeTypeValidation() {
    utils.forIn(this.createRatesModel.ratesForm.controls, (value, name: string) => {
      if (name !== 'customerName' && name !== 'waived' && name !== 'calculateRate' &&
        name !== 'passThrough' && name !== 'rollUp' && name !== 'legalTextArea' &&
        name !== 'instructionalTextArea' && !value['value'] && name !== 'quantity'
         && name !== 'quantityType' && name !== 'alternateChargeType') {
        this.createRatesModel.isSetUpFormValid = false;
      }
    if ((name === 'effectiveDate' || name === 'expirationDate') && (this.createRatesModel.ratesForm.controls[name].errors)) {
      this.createRatesModel.isSetUpFormValid = false;
    }
  });
  }
}
