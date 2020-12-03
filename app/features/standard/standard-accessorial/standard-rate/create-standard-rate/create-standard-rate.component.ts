import { Component, OnInit, ChangeDetectorRef, ViewChild, EventEmitter, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import * as utils from 'lodash';
import { Observable } from 'rxjs';
import { CreateStandardRateService } from './service/create-standard-rate.service';
import { CreateStandardRatesModel } from './model/create-standard-rate.model';
import {
  CreateRateUtilityService
} from './../../../../view-agreement-details/accessorials/rates/create-rates/service/create-rate-utility.service';
import { CreateStandardRateUtilityService } from './service/create-rate-utility.service';
import {
  AdditionalChargesComponent
} from './../../../../shared/accessorials/additional-charges/additional-charges/additional-charges.component';
import {
  RateSetUpResponse,
} from './../../standard-documentation/create-standard-documentation/model/create-standard-documenation.interface';
import {
  ChargeCodeResponseInterface, QuantityType, AccessorialRateAlternateChargeQuantityTypesItem,
  AlternateChargeQuantityType, ChargeCodeInterface, RateDocumentationInterface, CheckBoxAttributesInterface
} from './../create-standard-rate/model/create-standard-interface';
import { takeWhile } from 'rxjs/operators';
import { CurrencyPipe } from '@angular/common';
import { MessageService } from 'primeng/components/common/messageservice';
import {
  CanComponentDeactivate
} from './../../../standard-accessorial/standard-documentation/create-standard-documentation/model/create-standard-documenation.interface';
import { LocalStorageService } from './../../../../../shared/jbh-app-services/local-storage.service';
import { TimeZoneService } from '../../../../../shared/jbh-app-services/time-zone.service';

@Component({
  selector: 'app-create-standard-rate',
  templateUrl: './create-standard-rate.component.html',
  styleUrls: ['./create-standard-rate.component.scss']
})
export class CreateStandardRateComponent implements OnInit, AfterViewInit {
  @ViewChild('optionalFields') optionalFields: any;
  @ViewChild('addRates') addRates: any;
  @ViewChild('rateSetup') rateSetup: any;
  @ViewChild('top') topElemRef: ElementRef;
  @ViewChild('addStairStepRates') addStairStepRates: any;
  @ViewChild('addCharges') addCharges: AdditionalChargesComponent;
  @ViewChild('myDiv') myDiv;
  createRatesModel: CreateStandardRatesModel;
  resetCallEmiter = new EventEmitter<boolean>();

  constructor(private readonly router: Router, private readonly createRateService: CreateStandardRateService,
    private readonly formBuilder: FormBuilder, private readonly changeDetector: ChangeDetectorRef,
    private readonly localStore: LocalStorageService,
    private readonly createRateUtilityService: CreateRateUtilityService, private readonly messageService: MessageService,
    private readonly createStandardRateUtilityService: CreateStandardRateUtilityService, private readonly currencyPipe: CurrencyPipe,
    private readonly timeZone: TimeZoneService
  ) {
    this.createRatesModel = new CreateStandardRatesModel();
  }
  ngOnInit() {
    this.createStandardRateUtilityService.createRatesForm(this.createRatesModel, this.formBuilder);
  }
  ngAfterViewInit() {
    this.onFormValueChange();
  }
  busoselect(data: number[]) {
    if (!this.rateSetup.createRatesModel.setUpForm.controls['chargeType'].value) {
      this.createRatesModel.buSo = [];
    } else {
      this.createRatesModel.buSo = data;
    }
    this.changeDetector.markForCheck();
  }
  selectedBuSoOnly(data) {
    this.createRatesModel.selectedBuSo = data;
    if (!data.length) {
      this.optionalFields.optionalAttributesModel.businessUnitAdded = false;
      this.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.reset();
      this.optionalFields.optionalAttributesModel.optionalForm.controls.requestedService.reset();
      this.optionalFields.optionalAttributesModel.serviceLevelAdded = false;
      this.optionalFields.optionalAttributesModel.operationalServiceAdded = false;
    }
  }
  addAlternateCharge() {
    this.createRatesModel.alternateCharge = true;
    this.getQuantityTypeValues();
    this.getAlternateChargeTypeValues();
  }
  getQuantityTypeValues() {
    this.createRateService.getQuantityType().pipe(takeWhile(() => this.createRatesModel.isSubscribeFlag))
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
    this.createRatesModel.alternateChargeType = [];
    this.rateSetup.createRatesModel['chargeType'].forEach((chargeTypeElement: ChargeCodeInterface) => {
      if (this.rateSetup.createRatesModel['setUpForm']['controls']['chargeType']['value'] &&
        chargeTypeElement.value !== this.rateSetup.createRatesModel['setUpForm']['controls']['chargeType']['value'].value) {
        this.createRatesModel.alternateChargeType.push(chargeTypeElement);
      } else if (utils.isEmpty(this.rateSetup.createRatesModel['setUpForm']['controls']['chargeType']['value'])) {
        this.createRatesModel.alternateChargeType.push(chargeTypeElement);
      }
    });
    this.changeDetector.detectChanges();
  }
  onTypeAlternateChargeType(alternateChargeTypedValue) {
    if (this.createRatesModel.alternateChargeType) {
      this.createRatesModel.alternateChargeTypeFiltered = [];
      this.createRatesModel.alternateChargeType.forEach((alternateChargeFilterElement: ChargeCodeInterface) => {
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
    const quantityData = this.createRatesModel.ratesForm.get('quantity');
    const formattedAmount = this.createRateUtilityService.formatAmount(value, this.currencyPipe);
    if (formattedAmount) {
      if (Number(formattedAmount) <= 0) {
        this.createRatesModel.ratesForm.controls['quantity'].setErrors({ error: true });
      } else {
        quantityData.setValue(formattedAmount);
        this.setFormValidators('quantityType');
        this.setFormValidators('alternateChargeType');
      }
    } else {
      this.createRatesModel.ratesForm.controls['quantity'].setErrors({ error: true });
    }
    this.changeDetector.detectChanges();
  }
  onSelectAlternateChargeType(event: ChargeCodeInterface) {
    if (event.value) {
      this.setFormValidators('quantity');
      this.setFormValidators('quantityType');
    }
  }
  onSelectQuantityType(event: AlternateChargeQuantityType) {
    this.setFormValidators('quantity');
    this.setFormValidators('alternateChargeType');
  }
  setFormValidators(controlName: string) {
    this.createRatesModel.ratesForm.controls[controlName].setValidators([Validators.required]);
    this.createRatesModel.ratesForm.controls[controlName].updateValueAndValidity();
  }
  onRefresh() {
    if (this.onValidateForm(true)) {
      const params = this.createStandardRateUtilityService.
        onRefreshRatePostFramer(this.createRatesModel, this.optionalFields['optionalAttributesModel'],
          this.rateSetup['createRatesModel']);
      this.createRateService.getRatesDocumentation(params, null)
        .subscribe((res: RateDocumentationInterface[]) => {
          this.refreshData(res);
          this.changeDetector.detectChanges();
        });
    }
  }
  refreshData(res: RateDocumentationInterface[]) {
    if (res.length === 2) {
      this.legalInstructionalDocumentation(res);
    } else if (res.length === 1) {
      this.legalOrInstructionalDocumentation(res);
    } else {
      this.createRatesModel.noDocumentationFound = true;
    }
  }
  legalInstructionalDocumentation(documentation) {
    let legalRef = null;
    let instructionalRef = null;
    this.createRatesModel.attachments = [];
    if (documentation[0]['accessorialDocumentTypeName'] === 'Legal') {
      legalRef = documentation[0];
      instructionalRef = documentation[1];
    } else {
      legalRef = documentation[1];
      instructionalRef = documentation[0];
    }
    if (legalRef.attachments) {
      this.createRatesModel.legalAttachments = legalRef.attachments;
    }
    if (instructionalRef.attachments) {
      this.createRatesModel.instructionalAttachments = instructionalRef.attachments;
    }
    this.createRatesModel.attachments = this.createRatesModel.legalAttachments.concat(this.createRatesModel.instructionalAttachments);
    this.createRatesModel.docIsLegalText = true;
    this.createRatesModel.docIsInstructionalText = true;
    this.createRatesModel.legalTextArea = legalRef['text'];
    this.createRatesModel.instructionalTextArea = instructionalRef['text'];
    this.changeDetector.detectChanges();
  }
  legalOrInstructionalDocumentation(documentation) {
    let legalRef = null;
    let instructionalRef = null;
    this.createRatesModel.attachments = [];
    if (documentation[0]['accessorialDocumentTypeName'] === 'Legal') {
      legalRef = documentation[0];
      this.createRatesModel.legalTextArea = legalRef['text'];
      this.createRatesModel.docIsLegalText = true;
      if (legalRef.attachments) {
        this.createRatesModel.attachments = legalRef.attachments;
      }
    } else {
      instructionalRef = documentation[0];
      this.createRatesModel.instructionalTextArea = instructionalRef['text'];
      this.createRatesModel.noDocumentationFound = true;
      this.createRatesModel.docIsInstructionalText = true;
      if (instructionalRef.attachments) {
        this.createRatesModel.attachments = instructionalRef.attachments;
      }
    }
  }
  onAddRates() {
    this.createRatesModel.isAddRateClicked = true;
  }
  removeCharges() {
    if (this.createRatesModel.ratesForm.controls.quantity.value ||
      this.createRatesModel.ratesForm.controls.quantityType.value || this.createRatesModel.ratesForm.controls.alternateChargeType.value) {
      this.createRatesModel.isAlternateChargeChange = true;
    } else {
      this.createRatesModel.alternateCharge = false;
    }
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
  onSaveRateSetUp() {
    this.createRatesModel.isDetailsSaved = true;
    if (this.validateDocumentation()) {
      if (this.onValidateForm(false)) {
        this.checkForValidRateWithoutFree();
      }
    } else {
      this.onValidateForm(true);
    }
  }
  onValidateForm(isRefresh = false): boolean {
    this.createRatesModel.errorMsg = false;
    const serviceLevel = this.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel;
    const validAdditionalCharges = (this.addCharges && !isRefresh) ?
      this.createStandardRateUtilityService.validateAdditionalCharges(this) : true;
    if (((!isRefresh && (this.validateRateForm()
      && this.validateStairStepRateForm()) && validAdditionalCharges) || isRefresh) && this.createRatesModel.ratesForm.valid &&
      this.rateSetup.createRatesModel['setUpForm'].valid
      && (this.optionalFields.optionalAttributesModel.optionalForm.valid || serviceLevel.invalid)) {
      if (serviceLevel.invalid) {
        serviceLevel.markAsTouched();
        this.optionalFields.changeDetector.detectChanges();
        this.messageService.clear();
        this.messageService.add({
          severity: 'error', summary: this.createRatesModel.missingInfo,
          detail: 'Provide a Service Level'
        });
        return false;
      }
      return true;
    } else {
      this.formFieldsTouched();
      this.rateSetup.createRatesModel['setUpForm']['controls']['chargeType'].markAsTouched();
      return false;
    }
  }
  formFieldsTouched() {
    this.isEffectiveDateAndChargeTypeValid();
    this.isOptionalFormValid();
    const addRateValidate = this.isAddStairStepClickedValidate();
    const stariStepRateValidate = this.isAddRateClickedValidate();
    if (addRateValidate || stariStepRateValidate) {
      return;
    }
    this.errorMsgOnSave();
    this.changeDetector.detectChanges();
  }
  isAddStairStepClickedValidate(): boolean | undefined {
    if (this.createRatesModel.isAddStairStepClicked) {
      return this.addStairStepValidation();
    }
  }
  addStairStepValidation() {
    const addChargesRef: AdditionalChargesComponent = this.addCharges;
    const isAdditionalChargesValid: boolean = (addChargesRef) ? addChargesRef.addChargesModel.addChargesForm.valid : true;
    this.stairStepFormMandatory();
    if (this.addStairStepRates.stairStepModel.addStairStepForm.valid && this.createRatesModel.isSetUpFormValid &&
      this.validateDocumentation() && isAdditionalChargesValid) {
      this.checkForValidRateWithoutFree();
    } else if ((this.addStairStepRates.stairStepModel.addStairStepForm.valid
      && !this.createRatesModel.ratesForm.valid || !isAdditionalChargesValid)
      || !this.addStairStepRates.stairStepModel.addStairStepForm.valid) {
      this.errorMsgOnSave();
    } else {
      if (this.createRatesModel.isSetUpFormValid) {
        this.validateDocumentation();
      } else {
        this.errorMsgOnSave();
      }
    }
    return true;
  }
  checkForValidRateWithoutFree() {
    if (this.createRatesModel.isAddStairStepClicked &&
      this.addStairStepRates.stairStepModel.addStairStepForm.controls.stepsArray['controls'].length === 1 &&
      this.addStairStepRates.stairStepModel.addStairStepForm.controls.stepsArray['controls'][0]['controls']['step'].value.label
      === 'Free') {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error', summary: 'Missing Required Information',
        detail: 'Please specify a valid rate amount'
      });
    } else {
      this.createRatesModel.isShowSavePopup = true;
    }
  }

  onAdditonalChargesClicked() {
    this.createRatesModel.isAdditionalChargesClicked = true;
  }
  removeAllAdditionalCharges() {
    this.createRatesModel.isAdditionalChargesClicked = false;
  }

  isAddRateClickedValidate(): boolean | undefined {
    const addChargesRef: AdditionalChargesComponent = this.addCharges;
    const isAdditionalChargesValid: boolean = (addChargesRef) ? addChargesRef.addChargesModel.addChargesForm.valid : true;
    if (this.createRatesModel.isAddRateClicked) {
      this.setRateAndRateTypeMandatory();
      this.isGroupRateTypeMandatory();
      if (this.addRates.addRatesModel.addRateForm.valid && this.createRatesModel.isSetUpFormValid &&
        this.validateDocumentation() && isAdditionalChargesValid) {
        this.createRatesModel.isShowSavePopup = true;
        return true;
      } else if ((this.addRates.addRatesModel.addRateForm.valid && !this.createRatesModel.ratesForm.valid)
        || !this.addRates.addRatesModel.addRateForm.valid || !isAdditionalChargesValid) {
        this.errorMsgOnSave();
        return true;
      } else {
        if (this.createRatesModel.isSetUpFormValid) {
          this.validateDocumentation();
        } else {
          this.errorMsgOnSave();
        }
        return true;
      }
    }
  }
  validateStairStepRateForm(): boolean {
    let stairStepratesFormValid: boolean;
    const checkBoxValidity: boolean = this.validateRateCheckBoxes(this.rateSetup.createRatesModel.CheckBoxAttributes);
    this.createRatesModel.checkBoxSelected = checkBoxValidity;
    if (!checkBoxValidity) {
      this.checkStairStepRates();
    } else if (this.rateSetup.createRatesModel.CheckBoxAttributes.rollUp) {
      stairStepratesFormValid = false;
    } else if (!this.rateSetup.createRatesModel.CheckBoxAttributes.rollUp && this.createRatesModel.isAddStairStepClicked) {
      if (this.addStairStepRates.stairStepModel.addStairStepForm.dirty) {
        this.stairStepFormMandatory();
      } else {
        this.removestairStepFormMandatory();
      }
      stairStepratesFormValid = this.checkStairStepRateFormValidity();
    } else {
      stairStepratesFormValid = true;
    }
    return stairStepratesFormValid;
  }
  checkStairStepRates() {
    if (this.createRatesModel.isAddStairStepClicked) {
      this.stairStepFormMandatory();
    } else {
      if (!this.createRatesModel.isAddRateClicked) {
        this.errorMsgOnSave();
      }
    }
  }
  checkStairStepRateFormValidity(): boolean {
    return this.addStairStepRates.stairStepModel.addStairStepForm.valid;
  }
  removeRateAndRateTypeMandatory() {
    utils.forIn(this.addRates.addRatesModel.addRateForm.controls.rates.controls, (value, name: string) => {
      utils.forIn(value['controls'], (forArrayValue, forArrayName: string) => {
        if (forArrayName !== 'minAmount' && forArrayName !== 'maxAmount' && forArrayName !== 'rounding' && !forArrayValue['value']) {
          this.addRates.addRatesModel.addRateForm.controls.rates.controls[name]['controls'][forArrayName]
            .setValidators(null);
          this.addRates.addRatesModel.addRateForm.controls.rates.controls[name]['controls'][forArrayName].
            updateValueAndValidity();
          this.addRates.changeDetector.detectChanges();
        }
      });
    });
  }
  errorMsgOnSave() {
    if (!this.createRatesModel.isSetUpFormValid) {
      this.errormessage('Provide the required information in the highlighted fields and submit the form again');
    } else if (this.checkAddIsClicked()) {
      this.errormessage('Provide the required information in the highlighted fields and submit the form again. Rates are Mandatory');
    } else if (this.createStandardRateUtilityService.isInvalidChargeTypeError(this)) {
      this.errormessage(this.addCharges.addChargesModel.invalidChargeTypeDetail);
    } else {
      this.errormessage('Provide the required information in the highlighted fields and submit the form again');
    }
  }
  errormessage(detail: string) {
    this.messageService.clear();
    this.messageService.add({
      severity: 'error', summary: this.createRatesModel.missingInfo,
      detail
    });
  }
  isEffectiveDateAndChargeTypeValid() {
    this.createRatesModel.isSetUpFormValid = true;
    utils.forIn(this.rateSetup.createRatesModel.setUpForm.controls, (value, name: string) => {
      if (name !== 'customerName' && name !== 'waived' && name !== 'calculateRate' &&
        name !== 'passThrough' && name !== 'rollUp' && name !== 'legalTextArea' &&
        name !== 'instructionalTextArea' && !value['value']) {
        this.rateSetup.createRatesModel.setUpForm.controls[name].markAsTouched();
        this.createRatesModel.isSetUpFormValid = false;
      }
      if ((name === 'effectiveDate' || name === 'expirationDate') && (this.rateSetup.createRatesModel.setUpForm.controls[name].errors)) {
        this.createRatesModel.isSetUpFormValid = false;
      }
    });
  }
  isOptionalFormValid() {
    utils.forIn(this.optionalFields.optionalAttributesModel.optionalForm.controls, (value, name: string) => {
      this.optionalFields.optionalAttributesModel.optionalForm.controls[name].markAsTouched();
      this.optionalFields.changeDetector.detectChanges();
    });
  }
  isGroupRateTypeMandatory() {
    if (this.addRates.addRatesModel.addRateForm.controls.rates.controls.length > 1) {
      this.addRates.addRatesModel.addRateForm.controls['groupRateType'].setValidators(Validators.required);
      this.addRates.addRatesModel.addRateForm.controls['groupRateType'].updateValueAndValidity();
      this.addRates.addRatesModel.addRateForm.get('groupRateType').markAsTouched();
    }
  }
  setRateAndRateTypeMandatory() {
    utils.forIn(this.addRates.addRatesModel.addRateForm.controls.rates.controls, (value, name: string) => {
      utils.forIn(value['controls'], (forArrayValue, forArrayName: string) => {
        if (forArrayName !== 'minAmount' && forArrayName !== 'maxAmount' && forArrayName !== 'rounding' && !forArrayValue['value']) {
          this.addRates.addRatesModel.addRateForm.controls.rates.controls[name]['controls'][forArrayName].setValidators
            (Validators.required);
          this.addRates.addRatesModel.addRateForm.controls.rates.controls[name]['controls'][forArrayName].updateValueAndValidity();
          this.addRates.addRatesModel.addRateForm.controls.rates.controls[name]['controls'][forArrayName].markAsTouched();
        }
      });
    });
  }
  checkRateFormValidity(): boolean {
    let ratesFormValidity: boolean;
    if (this.addRates.addRatesModel.addRateForm.valid) {
      ratesFormValidity = true;
    } else {
      ratesFormValidity = false;
    }
    return ratesFormValidity;
  }
  validateDocumentation() {
    if (!this.createRatesModel.docIsLegalText) {
      if (this.createRatesModel.docIsInstructionalText) {
        this.createRatesModel.noDocumentationFound = true;
      } else {
        this.toastMessage(this.messageService, 'error', 'Error', 'Please Refresh the Documentation to Proceed');
      }
      return false;
    } else {
      return true;
    }
  }
  validateRateForm(): boolean {
    let ratesFormValid: boolean;
    const checkBoxValidity: boolean = this.validateRateCheckBoxes(this.rateSetup.createRatesModel.CheckBoxAttributes);
    this.createRatesModel.checkBoxSelected = checkBoxValidity;
    if (!checkBoxValidity) {
      this.checkRates();
    } else if (this.rateSetup.createRatesModel.CheckBoxAttributes.rollUp) {
      ratesFormValid = false;
    } else if (!this.rateSetup.createRatesModel.CheckBoxAttributes.rollUp && this.createRatesModel.isAddRateClicked) {
      if (this.addRates.addRatesModel.addRateForm.dirty) {
        this.setRateAndRateTypeMandatory();
        this.isGroupRateTypeMandatory();
      } else {
        this.removeRateAndRateTypeMandatory();
      }
      ratesFormValid = this.checkRateFormValidity();
    } else {
      ratesFormValid = true;
    }
    return ratesFormValid;
  }
  checkAddIsClicked() {
    return ((!this.createRatesModel.isAddRateClicked || !this.createRatesModel.isAddStairStepClicked) &&
      this.rateSetup.createRatesModel.CheckBoxAttributes.rollUp) || (!this.createRatesModel.isAddRateClicked
        && !this.createRatesModel.isAddStairStepClicked);
  }
  checkRates() {
    if (this.createRatesModel.isAddRateClicked) {
      this.restrictZeroInAddedFields();
      this.setRateAndRateTypeMandatory();
      this.isGroupRateTypeMandatory();
    } else {
      if (!this.createRatesModel.isAddStairStepClicked && !this.createRatesModel.isAddRateClicked) {
        this.errorMsgOnSave();
      }
    }
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
  savePopupYes() {
    this.createRatesModel.isShowSavePopup = false;
    this.saveRateSetUp();
  }
  savePopupNo() {
    this.createRatesModel.isShowSavePopup = false;
  }
  saveRateSetUp() {
    const addRateModel = this.addRates ? this.addRates.addRatesModel : null;
    const stairStepRates = this.addStairStepRates ? this.addStairStepRates.stairStepModel : null;
    const addChargesModel = this.addCharges ? this.addCharges.addChargesModel : null;
    const params = this.createStandardRateUtilityService.
      ratePostFramer(this.createRatesModel, this.optionalFields['optionalAttributesModel'], this.rateSetup['createRatesModel'],
        addRateModel, stairStepRates, addChargesModel);
    this.rateSave(params);
  }
  rateSave(params: Object) {
    this.createRatesModel.loading = true;
    this.createRateService.postRateData(params)
      .pipe(takeWhile(() => this.createRatesModel.isSubscribeFlag))
      .subscribe((rateSetUp: RateSetUpResponse) => {
        this.localStore.setAccessorialTab('accessType', 'create', { id: 0, text: 'rates' });
        this.createRatesModel.loading = false;
        this.router.navigate(['/standard']);
        this.toastMessage(this.messageService, 'success', 'Rate Setup Saved', 'The rate has been successfully saved.');
        this.changeDetector.detectChanges();
      }, (rateError: Error) => {
        this.createRatesModel.loading = false;
        if (rateError['error'] && rateError['error']['errors'][0] && rateError['error']['errors'][0]['errorType']) {
          this.createRatesModel.errorMsg = true;
          this.showDuplicateRateError(rateError);
          this.changeDetector.detectChanges();
        }
      });
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
  validateRateCheckBoxes(checkBoxAttributes: CheckBoxAttributesInterface): boolean {
    return checkBoxAttributes.waived || checkBoxAttributes.calculateRate || checkBoxAttributes.passThrough || checkBoxAttributes.rollUp;
  }

  onRollUpChanged(isChecked: boolean) {
    if (isChecked && this.createRatesModel.isAddRateClicked) {
      this.restrictZeroInAddedFields();
    } else if (!this.rateSetup.createRatesModel.CheckBoxAttributes.rollUp
      && this.createRatesModel.isAddRateClicked && this.rateSetup.createRatesModel.CheckBoxAttributes.passThrough) {
      this.allowZeroInAddedFields();
    }
  }
  onChargeTypeChange(isChecked: boolean) {
    if (isChecked) {
      this.optionalFields.optionalAttributesModel.businessUnitData = [];
      this.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.reset();
      this.optionalFields.optionalAttributesModel.optionalForm.controls.requestedService.reset();
      this.optionalFields.optionalAttributesModel.optionalForm.controls.businessUnit.reset();
      this.optionalFields.optionalAttributesModel.serviceLevel = [];
      this.optionalFields.optionalAttributesModel.operationalService = [];
      this.createRatesModel.ratesForm.controls.alternateChargeType.setValue(null);
      this.changeDetector.detectChanges();
      this.getAlternateChargeTypeValues();
    }
  }
  onRateCancel() {
    if (this.optionalFields['optionalAttributesModel']['optionalForm'].dirty
      || this.rateSetup.createRatesModel.setUpForm.dirty) {
      this.createRatesModel.rateCancel = true;
    } else {
      this.onDontSave();
    }
  }
  onDontSave() {
    this.createRatesModel.isDetailsSaved = true;
    this.createRatesModel.rateCancel = false;
    this.localStore.setAccessorialTab('accessType', 'create', { id: 0, text: 'rates' });
    this.router.navigateByUrl('/standard');
  }
  onHidePop(keyName: string) {
    this.createRatesModel[keyName] = false;
  }
  noDocFoundPopupYes() {
    this.createRatesModel.isDetailsSaved = true;
    this.router.navigate(['/standard/documentation']);
  }
  noDocFoundPopupNo() {
    this.createRatesModel.noDocumentationFound = false;
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
  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.createRatesModel.routingUrl = nextState.url;
    if ((this.optionalFields['optionalAttributesModel']['optionalForm'].dirty
      || this.rateSetup.createRatesModel.setUpForm.controls['currency'].dirty
      || this.rateSetup.createRatesModel.setUpForm.controls['chargeType'].dirty || this.rateSetup.createRatesModel['setUpForm'].dirty)
      && !this.createRatesModel.isDetailsSaved) {
      this.createRatesModel.isChangesSaving = false;
    } else {
      this.createRatesModel.isChangesSaving = true;
    }
    this.createRatesModel.rateNavigateCancel = !this.createRatesModel.isChangesSaving;
    this.changeDetector.detectChanges();
    return this.createRatesModel.isChangesSaving;
  }
  onDontSaveNavigate() {
    this.createRatesModel.isDetailsSaved = true;
    this.createRatesModel.rateNavigateCancel = false;
    this.createRatesModel.isChangesSaving = true;
    this.router.navigate([this.createRatesModel.routingUrl]);
  }
  onRemoveRates() {
    this.addRates.addRatesModel.addRateForm.reset();
    this.createRatesModel.isAddRateClicked = false;
    this.createRatesModel.addRateCancel = false;
    this.removeAllAdditionalCharges();
  }
  onFormValueChange() {
    const formFields = ['effectiveDate', 'expirationDate', 'groupName', 'chargeType'];
    formFields.forEach(fieldName => {
      this.rateSetup.createRatesModel.setUpForm.controls[fieldName].valueChanges.subscribe(val => {
        this.createRatesModel.inlineErrormessage = [];
        this.removeDocumentation();
      });
    });
    this.optionalFields.optionalAttributesModel.optionalForm.valueChanges.subscribe(val => {
      this.createRatesModel.inlineErrormessage = [];
      this.removeDocumentation();
    });
  }
  removeDocumentation() {
    if (this.createRatesModel.docIsLegalText || this.createRatesModel.docIsInstructionalText) {
      this.createRatesModel.docIsLegalText = false;
      this.createRatesModel.docIsInstructionalText = false;
      this.createRatesModel.legalTextArea = '';
      this.createRatesModel.instructionalTextArea = '';
      this.changeDetector.detectChanges();
    }
  }
  onWaivedChanged(isChecked: boolean) {
    if (isChecked && this.createRatesModel.isAddRateClicked) {
      this.allowZeroInAddedFields();
    }
  }
  onPassthroughChange(isChecked: boolean) {
    if (isChecked && this.createRatesModel.isAddRateClicked && !this.rateSetup.createRatesModel.CheckBoxAttributes.rollUp) {
      this.allowZeroInAddedFields();
    }
  }
  restrictZeroInAddedFields() {
    utils.forIn(this.addRates.addRatesModel.addRateForm.controls.rates.controls, (value, name: string) => {
      utils.forIn(value['controls'], (forArrayValue, forArrayName: string) => {
        if (forArrayName === 'rateAmount' && forArrayValue['value']) {
          const amount = this.formatAmount(forArrayValue['value']);
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
          const amount = this.formatAmount(forArrayValue['value']);
          if (Number(amount) === 0) {
            forArrayValue.setErrors(null);
          }
        }
      });
    });
  }
  stairStepValueCheck(amountFC1, amountFC) {
    const isAdditionalChargesEmpty = (this.addCharges) ? this.addCharges.isAdditionalChargesEmpty() : true;
    return (!isAdditionalChargesEmpty || !utils.isEmpty(amountFC && (amountFC1.value[0].step
      || amountFC1.value[0].fromQuantity ||
      amountFC1.value[0].toQuantity
      || amountFC1.value[0].rateAmount ||
      amountFC.rounding.value || amountFC.minAmount.value ||
      amountFC.maxAmount.value || amountFC.rateType.value || amountFC.maxApplidedWhen.value)));
  }
  onRemoveStairStepRates() {
    this.addStairStepRates.stairStepModel.addStairStepForm.reset();
    this.createRatesModel.isAddStairStepClicked = false;
    this.removeAllAdditionalCharges();
    this.createRatesModel.addStairRateCancel = false;
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
  onAddStairStepRates() {
    this.createRatesModel.isAddStairStepClicked = true;
  }
  formatAmount(value: string) {
    let formattedRateAmount;
    const enteredAmount = value ? value.replace(/[, ]/g, '').trim() : '';
    const wholeAmount = enteredAmount.split('.')[0].substring(0, 7);
    const decimalAmount = enteredAmount.split('.')[1] || '';
    const amount = +`${wholeAmount}.${decimalAmount}`;
    if (isNaN(amount)) {
      formattedRateAmount = '';
    } else {
      const modifiedAmount = amount.toString().replace(/[, ]/g, '').trim();
      formattedRateAmount = this.currencyPipe.transform(modifiedAmount, '', '', '1.2-4');
    }
    return formattedRateAmount;
  }
  stairStepFormMandatory() {
    this.addStairStepRates.stairStepModel.addStairStepForm.controls['maxApplidedWhen'].markAsTouched();
    this.addStairStepRates.stairStepModel.addStairStepForm.controls['maxAmount'].markAsTouched();
    utils.forIn(this.addStairStepRates.stairStepModel.addStairStepForm.controls, (value, name: string) => {
      if (name !== 'stepsArray' && name === 'rateType') {
        const error = this.addStairStepRates.stairStepModel.addStairStepForm.controls[name].errors;
        this.addStairStepRates.stairStepModel.addStairStepForm.controls[name].setValidators(Validators.required);
        this.addStairStepRates.stairStepModel.addStairStepForm.controls[name].markAsTouched();
        this.addStairStepRates.stairStepModel.addStairStepForm.controls[name].
          updateValueAndValidity();
        if (error) {
          this.addStairStepRates.stairStepModel.addStairStepForm.controls[name].setErrors(error);
        }
        this.addStairStepRates.changeDetector.detectChanges();
      }
      if (name === 'stepsArray') {
        utils.forIn(value['controls'], (forArrayValue, forArrayName: string) => {
          this.arrayIterateStairStep(forArrayValue);

        });
      }
    });
  }
  arrayIterateStairStep(forArrayValue) {
    utils.forIn(forArrayValue['controls'], (control, controlName: string) => {
      const error = control.errors;
      control.setValidators(Validators.required);
      control.markAsTouched();
      control.updateValueAndValidity();
      if (error) {
        control.setErrors(error);
      }
      this.addStairStepRates.changeDetector.detectChanges();
    });
  }
  removestairStepFormMandatory() {
    utils.forIn(this.addStairStepRates.stairStepModel.addStairStepForm.controls, (value, name: string) => {
      if (name !== 'stepsArray' && name === 'rateType') {
        this.addStairStepRates.stairStepModel.addStairStepForm.controls[name].setValidators(null);
        this.addStairStepRates.stairStepModel.addStairStepForm.controls[name].markAsTouched();
        this.addStairStepRates.stairStepModel.addStairStepForm.controls[name].
          updateValueAndValidity();
        this.addStairStepRates.changeDetector.detectChanges();
      }
      if (name === 'stepsArray') {
        utils.forIn(value['controls'], (forArrayValue, forArrayName: string) => {
          this.removearrayIterateStairStep(forArrayValue);

        });
      }
    });
  }
  removearrayIterateStairStep(forArrayValue) {
    utils.forIn(forArrayValue['controls'], (control, controlName: string) => {
      control.setValidators(null);
      control.markAsTouched();
      control.updateValueAndValidity();
      this.addStairStepRates.changeDetector.detectChanges();
    });
  }
  onAlternateChargeClear(event: Event) {
    this.createRatesModel.ratesForm.controls['alternateChargeType'].setValue('');
    this.setFormValidators('alternateChargeType');
  }
  onBusinessUnitShow($event) {
    this.rateSetup.createRatesModel.setUpForm.get('chargeType').markAsTouched();
  }
}
