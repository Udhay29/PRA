import { CreateRuleStandardUtilsService } from './service/standard-create-rule-utils';
import { AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, RouterStateSnapshot } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';

import { takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import * as utils from 'lodash';
import { CreateRuleModel } from './model/standard-create-rules.model';
import { FreeEventTypeModel } from '../free-rule/free-event-type/model/free-event-type.model';
import {
  RuleTypeInterface, RuleType, ChargeCodeResponseInterface, BuSoAssociation, DocumentationDate, CanComponentDeactivate
} from './model/standard-create-rules.interface';
import { CreateRulesService } from './service/standard-create-rules.service';
import { OptionalUtilityService } from '../shared/services/optional-utility.service';
import { CreateRuleUtilityService } from './service/standard-create-rule-utility.service';
import { LocalStorageService } from '../../../../../shared/jbh-app-services/local-storage.service';
import {
  CreateStandardDocumentationService
} from './../../standard-documentation/create-standard-documentation/service/create-standard-documentation.service';

@Component({
  selector: 'app-create-rules',
  templateUrl: './standard-create-rules.component.html',
  styleUrls: ['./standard-create-rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateStandardRulesComponent implements OnInit, AfterViewInit {
  createRuleModel: CreateRuleModel;
  agreementID: string;
  agreementURL: string;
  items: MenuItem[];
  @ViewChild('optionalFields') optionalFields: any;
  @ViewChild('documentation') documentation: any;
  @ViewChild('averagingRules') averagingRules: any;
  @ViewChild('top') topElemRef: ElementRef;
  @ViewChild('freeRuleTab') freeRuleTab: any;
  @ViewChild('freeTypeEventTab') freeTypeEventTab: any;
  @ViewChild('referenceTable') referenceTable: any;
  @ViewChild('appNotifyWhen') appNotifyWhen: any;
  @ViewChild('appNotifyBy') appNotifyBy: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly formBuilder: FormBuilder,
    private readonly createRulesService: CreateRulesService,
    private readonly optionalUtilityService: OptionalUtilityService,
    private readonly createRuleUtilityService: CreateRuleUtilityService,
    private readonly createStandardDocumentationService: CreateStandardDocumentationService,
    private readonly localStore: LocalStorageService) {
    this.createRuleModel = new CreateRuleModel();
  }

  ngOnInit() {
    this.createRulesForm();
    this.setDateValue();
    this.getRuleTypeValues();
    this.getChargeTypes();
    CreateRuleStandardUtilsService.getGroupNames(this);
    this.items = [
      {
        label: 'Save & Create New', command: () => {
          this.createRuleModel.isFreeRuleSaveAndClose = false;
          this.ruleSave();
        }
      },
      {
        label: 'Save & Create Copy', command: () => {
          this.createRuleModel.isFreeRuleSaveAndClose = false;
          this.ruleSave();
        }
      }
    ];
    this.setSuperUserBackDateDays();
    this.setSuperUserFutureDateDays();
  }
  ngAfterViewInit() {
    if (this.topElemRef !== null) {
      this.topElemRef.nativeElement.scrollIntoView();
    }
  }
  createRulesForm() {
    this.createRuleModel.rulesForm = this.formBuilder.group({
      ruleType: ['', Validators.required],
      chargeType: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      ruleLevel: ['', Validators.required],
      groupName: ['', Validators.required],
      arrivalGraceAmount: ['', null],
      arrivalGrace: ['', null]
    });
    this.createRuleModel.rulesForm.controls['ruleLevel'].setValue('Agreement');
    this.createRuleModel.selectedRuleLevel = 'Agreement';
    this.onFormValueChange();
  }
  setDateValue() {
    this.createRuleModel.rulesForm.controls['effectiveDate']
      .setValue(this.createRuleUtilityService.dateFormatter(new Date()));
    this.createRuleModel.rulesForm.controls['expirationDate']
      .setValue(this.createRuleUtilityService.dateFormatter(new Date(this.createRuleModel.setExpirationDate)));
    this.createRuleModel.agreementEffectiveDate =
      this.createRuleModel.rulesForm.controls['effectiveDate'].value;
    this.createRuleModel.agreementEndDate = this.createRuleModel.rulesForm.controls['expirationDate'].value;
  }
  onFormValueChange() {
    const formFields = ['effectiveDate', 'expirationDate', 'chargeType', 'groupName'];
    const referenceGridFormFields = ['chargeType', 'ruleLevel'];
    formFields.forEach(fieldName => {
      this.createRuleModel.rulesForm.controls[fieldName].valueChanges.subscribe(val => {
        this.removeDocumentation();
        this.createRuleModel.inlineErrormessage = [];
      });
    });
    this.optionalFields.optionalAttributesModel.optionalForm.valueChanges.subscribe(val => {
      this.removeDocumentation();
      this.createRuleModel.inlineErrormessage = [];
      this.createReferenceGridParams();
    });
    referenceGridFormFields.forEach(fieldName => {
      this.createRuleModel.rulesForm.controls[fieldName].valueChanges.subscribe(val => {
        this.createRuleModel.inlineErrormessage = [];
        this.createReferenceGridParams();
      });
    });
  }
  onBusinessUnitShow($event) {
    this.createRuleModel.rulesForm.get('chargeType').markAsTouched();
  }
  onSharedListChanges() {
    this.createReferenceGridParams();
    this.removeDocumentation();
  }
  removeDocumentation() {
    if (this.documentation.viewDocumentationModel.docIsLegalText || this.documentation.viewDocumentationModel.docIsInstructionalText) {
      this.documentation.viewDocumentationModel.docIsLegalText = false;
      this.documentation.viewDocumentationModel.docIsInstructionalText = false;
      this.documentation.viewDocumentationModel.legalTextArea = '';
      this.documentation.viewDocumentationModel.instructionalTextArea = '';
      this.documentation.changeDetector.detectChanges();
    }
  }
  onDateSelected(selectedDate: Date, selectedType: string) {
    this.createRuleModel.isCorrectEffDateFormat = false;
    this.createRuleModel.isCorrectExpDateFormat = false;
    if (selectedType.toLowerCase() === 'effectivedate') {
      this.createRuleUtilityService.validateEffectiveDate(this.createRuleModel);
      this.createRuleModel.effectiveDate = this.createRuleUtilityService.dateFormatter(selectedDate);
      const effDate = new Date(selectedDate);
      this.createRuleModel.expirationMinDate = new Date(selectedDate);
      this.createRuleUtilityService.validateDate(effDate, selectedType, this.createRuleModel);
      this.createRuleUtilityService.setFormErrors(this, this.changeDetector);
      this.createRuleUtilityService.setValidation('expirationDate', this.createRuleModel);
    } else if (selectedType.toLowerCase() === 'expirationdate') {
      this.createRuleUtilityService.validateEffectiveDate(this.createRuleModel);
      const expDate = new Date(selectedDate);
      this.createRuleModel.effectiveMaxDate = new Date(selectedDate);
      this.createRuleUtilityService.validateDate(expDate, selectedType, this.createRuleModel);
      this.createRuleModel.expirationDate = this.createRuleUtilityService.dateFormatter(selectedDate);
      this.createRuleUtilityService.setFormErrors(this, this.changeDetector);
      this.createRuleUtilityService.setValidation('effectiveDate', this.createRuleModel);
    }
    this.changeDetector.detectChanges();
  }
  typedDateValidate(typedValue: Event, fieldName: string) {
    const regex = new RegExp('^(|(0[1-9])|(1[0-2]))\/((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1]))\/(([0-9]{4}))$');
    switch (fieldName) {
      case 'effectiveDate':
        if (typedValue.srcElement['value'] && regex.test(typedValue['srcElement']['value'].trim())
          && this.createRuleModel.rulesForm.controls['effectiveDate'].value) {
          this.createRuleModel.isCorrectEffDateFormat = false;
          const effDate = new Date(typedValue.srcElement['value']);
          this.createRuleModel.rulesForm.controls['effectiveDate'].setValue(effDate);
          this.createRuleUtilityService.validateDate(effDate, fieldName, this.createRuleModel);
          this.onDateSelected(typedValue.srcElement['value'], 'effectiveDate');
          this.createRuleUtilityService.setFormErrors(this, this.changeDetector);
        } else {
          this.createRuleModel.isCorrectEffDateFormat = true;
        }
        break;
      case 'expirationDate':
        if (typedValue.srcElement['value'] && regex.test(typedValue.srcElement['value'].trim())
          && this.createRuleModel.rulesForm.controls['expirationDate'].value) {
          this.createRuleModel.isCorrectExpDateFormat = false;
          const expDate = new Date(typedValue.srcElement['value']);
          this.createRuleModel.rulesForm.controls['expirationDate'].setValue(expDate);
          this.createRuleUtilityService.validateDate(expDate, fieldName, this.createRuleModel);
          this.onDateSelected(typedValue.srcElement['value'], 'expirationDate');
          this.createRuleUtilityService.setFormErrors(this, this.changeDetector);
        } else {
          this.createRuleModel.isCorrectExpDateFormat = true;
        }
        break;
      default: break;
    }
  }
  getRuleTypeValues() {
    this.createRulesService.getRuleType().pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag)).subscribe((ruleType: RuleType) => {
      this.createRuleUtilityService.populateRuleType(ruleType, this.createRuleModel, this.changeDetector);
    }, (ruleTypeError: Error) => {
      this.createRuleUtilityService.toastMessage(this.messageService, 'error',
        'Error', ruleTypeError['error']['errors'][0]['errorMessage']);
    });
  }
  onTypeRuleType(typedRuleType: Event) {
    this.createRuleModel.ruleTypeFiltered = [];
    if (this.createRuleModel.ruleType) {
      this.getFilteredRuleType(typedRuleType);
    }
    this.createRuleModel.ruleTypeFiltered.sort((chargeTypefirstValue, chargeTypeSecondValue) => {
      return (chargeTypefirstValue.label.toLowerCase() > chargeTypeSecondValue.label.toLowerCase()) ? 1 : -1;
    });
    this.changeDetector.detectChanges();
  }
  onTypeGracePeriod(typedGracePeriod: Event) {
    this.createRuleModel.gracePeriodFiltered = [];
    if (this.createRuleModel.gracePeriod) {
      this.getFilteredGracePeriod(typedGracePeriod);
    }
    this.createRuleModel.gracePeriodFiltered.sort((gracePeriodfirstValue, gracePeriodSecondValue) => {
      return (gracePeriodfirstValue.label.toLowerCase() > gracePeriodSecondValue.label.toLowerCase()) ? 1 : -1;
    });
    this.changeDetector.detectChanges();
  }
  getFilteredGracePeriod(typedGracePeriod: Event) {
    this.createRuleModel.gracePeriod.forEach(element => {
      if (element.label && element.label.toString().toLowerCase().indexOf(typedGracePeriod['query'].toLowerCase()) !== -1) {
        this.createRuleModel.gracePeriodFiltered.push({
          label: element.label,
          value: element.value
        });
      }
    });
  }
  getFilteredRuleType(typedRuleType: Event) {
    this.createRuleModel.ruleType.forEach(element => {
      if (element.label && element.label.toString().toLowerCase().indexOf(typedRuleType['query'].toLowerCase()) !== -1) {
        this.createRuleModel.ruleTypeFiltered.push({
          label: element.label,
          value: element.value
        });
      }
    });
  }
  getChargeTypes() {
    this.createRuleModel.chargeTypeLoading = true;
    this.createStandardDocumentationService.getChargeTypes().pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag))
      .subscribe((chargeTypeResponse: ChargeCodeResponseInterface[]) => {
        this.createRuleUtilityService.populateChargeType(chargeTypeResponse, this.createRuleModel, this.changeDetector);
      }, (chargeTypeError: Error) => {
        this.createRuleModel.chargeTypeLoading = false;
        this.createRuleUtilityService.toastMessage(this.messageService, 'error',
          'Error', chargeTypeError['error']['errors'][0]['errorMessage']);
      });
  }
  onTypeChargeCode(chargeValue: Event) {
    this.createRuleModel.chargeTypeFiltered = [];
    if (this.createRuleModel.chargeType) {
      this.createRuleModel.chargeType.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(chargeValue['query'].toLowerCase()) !== -1) {
          this.createRuleModel.chargeTypeFiltered.push({
            label: element.label,
            value: element.value,
            description: element.description
          });
        }
      });
    }
    this.createRuleModel.chargeTypeFiltered.sort((chargeTypefirstValue, chargeTypeSecondValue) => {
      return (chargeTypefirstValue.label.toLowerCase() > chargeTypeSecondValue.label.toLowerCase()) ? 1 : -1;
    });
    this.changeDetector.detectChanges();
  }
  onSelectChargeCode(selectedChargeCodes: Event) {
    this.optionalFields.optionalAttributesModel.optionalForm.controls.businessUnit.setValue(null);
    this.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.reset();
    this.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.clearValidators();
    this.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.updateValueAndValidity();
    this.optionalFields.optionalAttributesModel.optionalForm.controls.requestedService.reset();
    this.optionalFields.optionalAttributesModel.serviceLevel = [];
    this.optionalFields.optionalAttributesModel.operationalService = [];
    this.getBUbasedOnChargeType(selectedChargeCodes['value']);
  }
  getBUbasedOnChargeType(chargeTypeId: number) {
    this.createRulesService.getBUbasedOnChargeType(chargeTypeId).pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag))
      .subscribe((data: BuSoAssociation[]) => {
        this.createRuleModel.businessUnitBasedOnChargeType = data;
        this.changeDetector.detectChanges();
      });
  }
  onInputChargeType(event) {
    if (!event.target['value']) {
      this.createRuleModel.rulesForm.controls['chargeType'].setValue(null);
      this.optionalFields.optionalAttributesModel.businessUnitData = [];
    }
  }
  onChangeRuleLevel(ruleLevelChangeValue) {
    const ruleLevelChangedValue = ruleLevelChangeValue['value'];
    this.createRuleModel.selectedRuleLevel = ruleLevelChangedValue;
    this.removeDocumentation();
  }
  onChangeRuleType(ruleTypeChangeValue: RuleTypeInterface) {
    if (utils.isEmpty(this.createRuleModel.selectedRuleType) || ruleTypeChangeValue.value !== this.createRuleModel.selectedRuleType.value) {
      this.createRuleModel.selectedRuleType = ruleTypeChangeValue;
      this.loadRuleAccordion();
    } else {
      this.createRuleModel.selectedRuleType = ruleTypeChangeValue;
    }
  }
  onChargeTypeBlur(chargeTypeValue: Event, controlName: string) {
    if (this.createRuleModel.rulesForm.controls[controlName].value &&
      !chargeTypeValue.target['value']) {
      this.createRuleModel.rulesForm.controls[controlName].setValue(null);
      this.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.reset();
      this.optionalFields.optionalAttributesModel.optionalForm.controls.requestedService.reset();
      this.optionalFields.optionalAttributesModel.optionalForm.controls.businessUnit.reset();
      this.optionalFields.optionalAttributesModel.serviceLevel = [];
      this.optionalFields.optionalAttributesModel.operationalService = [];
    }
  }
  onSaveAccessorialRule() {
    this.createRuleModel.isDetailsSaved = true;
    if (this.onValidateForm(false)) {
      this.createRuleModel.isShowSavePopup = true;
      this.changeDetector.detectChanges();
    }
  }
  onCancelAccessorialRule() {
    this.cancelCheck();
  }
  cancelCheck() {
    if (this.optionalFields['optionalAttributesModel']['optionalForm'].dirty
      || this.createRuleModel.contractChecked || this.createRuleModel.sectionChecked || this.createRuleModel.rulesForm.dirty) {
      this.createRuleModel.ruleCancel = true;
    } else {
      this.onNavigate();
    }
  }
  onCancelPopupClose() {
    this.createRuleModel.ruleCancel = false;
  }
  onNavigate() {
    this.createRuleModel.isDetailsSaved = true;
    this.localStore.setAccessorialTab('accessType', 'create', { id: 2, text: 'rules' });
    this.router.navigate(['/standard']);
  }
  validateFieldsForDocumentation(validateFields: boolean) {
    this.createRuleModel.isRefreshClicked = true;
    if (validateFields) {
      this.createRuleModel.validFields = this.onValidateForm(true);
      this.optionalUtilityService.setDocumentationValid(this.createRuleModel);
      this.changeDetector.detectChanges();
    }
  }
  displayReferenceGrid(isDisplay: boolean) {
    this.createReferenceGridParams();
  }
  createReferenceGridParams() {
    let referenceGridParams = {};
    let freeEventTypeModel = null, freeCalendarModel = null, freeRuleModel = null;
    const ruleTypeLabel = this.createRuleModel.rulesForm.controls.ruleType &&
      this.createRuleModel.rulesForm.controls.ruleType.value ?
      this.createRuleModel.rulesForm.controls.ruleType.value.label : null;
    const isEmptyFormFields = ['requestServiceDTOs', 'carrierDTOs', 'businessUnitServiceOfferingDTOs'];
    if (this.freeRuleTab) {
      freeEventTypeModel = this.freeRuleTab.freeTypeEventTab ? this.freeRuleTab.freeTypeEventTab.freeEventTypeModel : null;
      freeCalendarModel = this.freeRuleTab.freeTypeCalendarTab ? this.freeRuleTab.freeTypeCalendarTab.freeCalendarModel : null;
      freeRuleModel = this.freeRuleTab.freeRuleModel ? this.freeRuleTab.freeRuleModel : null;
    }
    if (ruleTypeLabel && ruleTypeLabel.toLowerCase() === 'free' && this.createRuleModel.isFreeRuleSaveAndClose) {
      referenceGridParams = CreateRuleStandardUtilsService.onRefreshRatePostFramer(this.createRuleModel,
        this.optionalFields['optionalAttributesModel']);
      isEmptyFormFields.forEach(field => {
        referenceGridParams[field] = referenceGridParams ?
          referenceGridParams[field] : [];
      });
      referenceGridParams['accessorialFreeRuleTypes'] = [];
      referenceGridParams = this.createRuleUtilityService.saveParamFramerFree(this.createRuleModel,
        referenceGridParams, freeRuleModel, freeEventTypeModel, freeCalendarModel,
        this.documentation.viewDocumentationModel, this.optionalFields['optionalAttributesModel']);
      this.referenceTable.referenceModel.referenceGridRequest = referenceGridParams;
      this.createRuleModel.showReferenceGrid = referenceGridParams;
    }
  }
  onValidateForm(isRefresh): boolean {
    this.createRuleModel.errorMsg = false;
    const validOptionalFields = this.optionalUtilityService.
      validateOptionalFields(this.optionalFields.optionalAttributesModel, this.messageService);
    let validateFlag: boolean;
    if (isRefresh && this.createRuleUtilityService.validateRuleForm(this.createRuleModel) && validOptionalFields) {
      validateFlag = true;
    } else {
      this.formFieldsTouched();
      validateFlag = false;
    }
    return validateFlag;
  }
  formFieldsTouched() {
    this.createRuleUtilityService.isRuleFieldsValid(this.createRuleModel);
    this.optionalUtilityService.isOptionalFormValid(this.optionalFields.optionalAttributesModel, this.changeDetector);
    if (this.createRuleUtilityService.validateRuleForm(this.createRuleModel) && this.validateDocumentation()) {
      this.ruleLevelValidation();
    } else {
      this.validateRuleAndDocumentation();
    }
  }
  ruleLevelValidation() {
    if (this.ruleLevelValidate() && this.optionalFields.optionalAttributesModel.optionalForm.valid) {
      this.createRuleModel.isShowSavePopup = true;
      this.changeDetector.detectChanges();
      return;
    }
  }
  validateRuleAndDocumentation() {
    const ruleValidation = this.createRuleUtilityService.validateRuleForm(this.createRuleModel);
    if (!ruleValidation || !this.optionalFields.optionalAttributesModel.optionalForm.valid) {
      this.createRuleUtilityService.errorMsgOnSave(this.messageService);
    } else if (!this.validateDocumentation()) {
      this.validateDocumentation();
    } else {
      this.validateRuleTypes();
    }
  }
  validateRuleTypes() {
    if (!this.ruleLevelValidate()) {
      this.createRuleUtilityService.errorMsgOnSave(this.messageService);
      return;
    }
  }
  arrivalFormValidate() {
    if (!this.createRuleModel.rulesForm.controls['arrivalGraceAmount'].valid ||
      !this.createRuleModel.rulesForm.controls['arrivalGrace'].valid) {
      const formFields = ['arrivalGraceAmount', 'arrivalGrace'];
      utils.forIn(formFields, (name: string) => {
        this.createRuleModel.rulesForm.controls[name].markAsTouched();
      });
      this.createRuleUtilityService.errorMsgOnSave(this.messageService);
      this.changeDetector.detectChanges();
      return false;
    } else {
      return true;
    }
  }
  freeRuleFormTouched() {
    if (this.createRuleModel.isFreeRules) {
      utils.forIn(this.freeRuleTab.freeRuleModel.freeRulesForm.controls, (value, name: string) => {
        this.freeRuleTab.freeRuleModel.freeRulesForm.controls[name].markAsTouched();
      });
      const freeTypeValue = this.freeRuleTab.freeRuleModel.freeRulesForm.controls['freeRuleType'].value;
      if (freeTypeValue && freeTypeValue.label === 'Event') {
        utils.forIn(this.freeRuleTab.freeTypeEventTab.freeEventTypeModel.freeEventTypeForm.controls, (value, name: string) => {
          this.freeRuleTab.freeTypeEventTab.freeEventTypeModel.freeEventTypeForm.controls[name].markAsTouched();
        });
      } else if (freeTypeValue && freeTypeValue.label === 'Calendar') {
        utils.forIn(this.freeRuleTab.freeTypeCalendarTab.freeCalendarModel.freeCalendarForm.controls, (value, name: string) => {
          this.freeRuleTab.freeTypeCalendarTab.freeCalendarModel.freeCalendarForm.controls[name].markAsTouched();
        });
      }
    }
  }
  validateFreeRuleForm(): boolean {
    const freeTypeValue = this.freeRuleTab.freeRuleModel.freeRulesForm.controls['freeRuleType'].value;
    this.freeRuleFormTouched();
    let validateFunction;
    if (freeTypeValue && freeTypeValue.label === 'Quantity') {
      validateFunction = this.quantityFormValidate();
    } else if (freeTypeValue && freeTypeValue.label === 'Event') {
      validateFunction = this.eventFormValidate();
    } else if (freeTypeValue && freeTypeValue.label === 'Calendar') {
      validateFunction = this.calendarFormValidate();
    } else if (!freeTypeValue) {
      this.createRuleUtilityService.errorMsgOnSave(this.messageService);
      this.freeRuleTab.changeDetector.detectChanges();
    }
    return validateFunction;
  }
  quantityFormValidate(): boolean {
    if (this.freeRuleTab.freeRuleModel.freeRulesForm.valid) {
      return true;
    }
    this.createRuleUtilityService.errorMsgOnSave(this.messageService);
    this.freeRuleTab.changeDetector.detectChanges();
    return false;
  }
  eventFormValidate(): boolean {
    if (this.freeRuleTab.freeRuleModel.freeRulesForm.valid
      && this.freeRuleTab.freeTypeEventTab.freeEventTypeModel.freeEventTypeForm.valid) {
      return true;
    }
    this.createRuleUtilityService.errorMsgOnSave(this.messageService);
    this.freeRuleTab.changeDetector.detectChanges();
    return false;
  }
  calendarFormValidate(): boolean {
    if (this.freeRuleTab.freeRuleModel.freeRulesForm.valid
      && this.freeRuleTab.freeTypeCalendarTab.freeCalendarModel.freeCalendarForm.valid) {
      return true;
    }
    this.createRuleUtilityService.errorMsgOnSave(this.messageService);
    this.freeRuleTab.freeTypeCalendarTab.changeDetector.detectChanges();
    return false;
  }
  ruleLevelValidate(): boolean {
    if (this.createRuleModel.selectedRuleType.label === 'Averaging') {
      return this.averagingFieldValidate();
    } else if (this.createRuleModel.selectedRuleType.label === 'Free') {
      return this.validateFreeRuleForm();
    } else if (this.createRuleModel.selectedRuleType.label.toLowerCase() === this.createRuleModel.arrivalHeading) {
      return this.arrivalFormValidate();
    } else if (this.createRuleModel.selectedRuleType.label === 'Notification') {
      return this.notifyFormValidate();
    } else {
      return true;
    }
  }
  notifyFormValidate() {
    if (this.checkFieldNotifyValidity() || this.checkFieldNotifyValidityChecbox()) {
      const formFields = ['frequency', 'eventOccuranceTime', 'timeframe', 'eventName', 'batchTime', 'timeframeInput'];
      utils.forIn(formFields, (name: string) => {
        this.appNotifyWhen.notifyWhenModel.notifyWhenForm.controls[name].markAsTouched();
      });
      const formFields1 = ['notificationType', 'selectionCheckbox', 'websiteDesc', 'emailNotificationType'];
      utils.forIn(formFields1, (name: string) => {
        if (!utils.isEmpty(this.appNotifyBy.notifyByModel.notifyByForm.controls[name].errors)) {
          this.appNotifyBy.notifyByModel.notifyByForm.controls[name].markAsTouched();
        }
      });
      if (this.checkFieldNotifyValidity()) {
        this.createRuleUtilityService.errorMsgOnSave(this.messageService);
      } else {
        this.createRuleUtilityService.toastMessage(this.messageService, 'error',
          'Missing Required Information', 'Notification Method is required.');
      }
      this.changeDetector.detectChanges();
      return false;
    } else {
      return true;
    }
  }
  checkFieldNotifyValidity() {
    return (!this.appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['frequency'].valid ||
      !this.appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['eventOccuranceTime'].valid ||
      !this.appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['timeframe'].valid ||
      !this.appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['eventName'].valid ||
      !this.appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['batchTime'].valid ||
      !this.appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['timeframeInput'].valid ||
      !this.appNotifyBy.notifyByModel.notifyByForm.controls['notificationType'].valid ||
      !this.appNotifyBy.notifyByModel.notifyByForm.controls['emailNotificationType'].valid ||
      !this.appNotifyBy.notifyByModel.notifyByForm.controls['websiteDesc'].valid);
  }
  checkFieldNotifyValidityChecbox() {
    return (!this.appNotifyBy.notifyByModel.notifyByForm.controls['selectionCheckbox'].valid);
  }
  averagingFieldValidate(): boolean {
    if (this.averagingRules.averagingRulesModel.averagingForm.valid) {
      return true;
    } else {
      if (this.averagingRules.averagingRulesModel.isWeekly) {
        this.averageFormFieldTouched('dayOfWeek');
      } else if (this.averagingRules.averagingRulesModel.isEachDay) {
        this.averageFormFieldTouched('specificDay');
      } else if (this.averagingRules.averagingRulesModel.isOnTheDay) {
        this.averageFormFieldTouched('frequency');
        this.averageFormFieldTouched('monthlyDay');
      } else {
        this.averageFormFieldTouched('timeFrame');
      }
      return false;
    }
  }
  averageFormFieldTouched(field: string) {
    this.averagingRules.averagingRulesModel.averagingForm.controls[field].markAsTouched();
    this.createRuleUtilityService.errorMsgOnSave(this.messageService);
    this.averagingRules.changeDetector.detectChanges();
  }
  validateDocumentation(): boolean {
    if (!this.documentation.viewDocumentationModel.docIsLegalText) {
      if (this.documentation.viewDocumentationModel.docIsInstructionalText) {
        this.documentation.viewDocumentationModel.noDocumentationFound = true;
        this.documentation.changeDetector.detectChanges();
      } else {
        this.createRuleUtilityService.toastMessage(this.messageService, 'error',
          'Error', 'Please Refresh the Documentation to Proceed');
        return false;
      }
      return false;
    } else {
      return true;
    }
  }
  ratesFieldReset() {
    utils.forIn(this.createRuleModel.rulesForm.controls, (value, name: string) => {
      if (name !== 'ruleType' && name !== 'effectiveDate' && name !== 'expirationDate' && name !== 'ruleLevel') {
        this.createRuleModel.rulesForm.controls[name].reset();
      }
    });
  }
  ruleSave() {
    this.createRuleModel.isShowSavePopup = false;
    this.saveBasedonRuleTypes();
  }
  saveAndCreateNewFreeRule() {
    this.createRuleModel.isShowSavePopup = false;
    this.createRuleModel.selectedFreeRuleType = null;
    const freeTypeValue = this.freeRuleTab.freeRuleModel.freeRulesForm.controls['freeRuleType'] &&
      this.freeRuleTab.freeRuleModel.freeRulesForm.controls['freeRuleType'].value ?
      this.freeRuleTab.freeRuleModel.freeRulesForm.controls['freeRuleType'].value : null;
    this.createRuleUtilityService.clearFreeRuleFormOnSaveAndCreateNew(this.freeRuleTab, freeTypeValue);
    this.optionalFields.optionalAttributesModel.optionalForm.controls.businessUnit.setValue(null);
    this.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.reset();
    this.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.clearValidators();
    this.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.updateValueAndValidity();
    this.optionalFields.optionalAttributesModel.optionalForm.controls.requestedService.reset();
    this.optionalFields.optionalAttributesModel.serviceLevel = [];
    this.optionalFields.optionalAttributesModel.operationalService = [];
    this.optionalFields['optionalAttributesModel']['optionalForm'].reset();
    this.createRuleModel.rulesForm.controls['ruleLevel'].setValue('Agreement');
    this.createRuleModel.selectedRuleLevel = 'Agreement';
    this.removeDocumentation();
    this.ratesFieldReset();
    this.createRuleModel.isFreeRuleSaveAndClose = true;
  }
  saveBasedonRuleTypes() {
    switch (this.createRuleModel.selectedRuleType.label.toLowerCase()) {
      case 'averaging':
        this.saveRules();
        break;
      case 'free':
        this.saveFreeRules();
        break;
      case 'suspend invoicing':
        this.saveSuspendInvoicing();
        break;
      case this.createRuleModel.arrivalHeading:
        this.saveGracePeriod();
        break;
      case 'notification':
        this.saveNotification();
        break;
      default:
        break;
    }
  }
  saveNotification() {
    const framerObject = CreateRuleStandardUtilsService.onRefreshRatePostFramer(this.createRuleModel,
      this.optionalFields['optionalAttributesModel']);
    const params = this.createRuleUtilityService.saveParamFramerNotification(framerObject,
      this.appNotifyWhen,
      this.appNotifyBy, this.documentation.viewDocumentationModel, this.optionalFields['optionalAttributesModel'], this);
    this.createRulesService.postRuleTypeData(this.agreementID, params, 'notifications').
      pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag)).subscribe((postRespone: object) => {
        this.processSaveRuleResponse('Notification Saved', 'Notification rule has been created successfully.');
      }, (postResponeError: Error) => {
        this.createRuleUtilityService.postErrorHandling(postResponeError,
          this.createRuleModel, this.messageService, this.changeDetector, this.topElemRef);
      });
  }
  saveGracePeriod() {
    const params = CreateRuleStandardUtilsService.onRefreshRatePostFramer(this.createRuleModel,
      this.optionalFields['optionalAttributesModel']);
    params['accessorialDocumentTypeId'] = 1;
    params['customerAccessorialGracePeriodConfigurationId'] = null;
    params['gracePeriodQuantity'] = +this.createRuleModel.rulesForm.controls['arrivalGraceAmount'].value;
    params['pricingUnitOfTimeMeasurementAssociationId'] = this.createRuleModel.rulesForm.controls['arrivalGrace'].value['value'];
    params['pricingUnitOfTimeMeasurementAssociationDesc'] = this.createRuleModel.rulesForm.controls['arrivalGrace'].value['label'];
    this.createRulesService.postRuleTypeData(this.agreementID, params, 'graceperiods').
      pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag)).subscribe((postRespone: object) => {
        this.processSaveRuleResponse();
      }, (postResponeError: Error) => {
        this.createRuleUtilityService.postErrorHandling(postResponeError,
          this.createRuleModel, this.messageService, this.changeDetector, this.topElemRef);
      });
  }
  saveSuspendInvoicing() {
    const params = CreateRuleStandardUtilsService.onRefreshRatePostFramer(this.createRuleModel,
      this.optionalFields['optionalAttributesModel']);
    params['accessorialDocumentTypeId'] = 1;
    params['customerAccessorialSuspendConfigurationId'] = null;
    this.createRulesService.postRuleTypeData(this.agreementID, params, 'suspendinvoices').
      pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag)).subscribe((postRespone: object) => {
        this.processSaveRuleResponse();
      }, (postResponeError: Error) => {
        this.createRuleUtilityService.postErrorHandling(postResponeError,
          this.createRuleModel, this.messageService, this.changeDetector, this.topElemRef);
      });
  }
  saveRules() {
    const framerObject = CreateRuleStandardUtilsService.onRefreshRatePostFramer(this.createRuleModel,
      this.optionalFields['optionalAttributesModel']);
    const params = this.createRuleUtilityService.saveParamFramer(this.createRuleModel, framerObject,
      this.averagingRules.averagingRulesModel, this.documentation.viewDocumentationModel);
    this.createRulesService.postRuleData(this.agreementID, params).
      pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag)).subscribe((postRespone: object) => {
        this.processSaveRuleResponse();
      }, (postResponeError: Error) => {
        this.createRuleUtilityService.postErrorHandling(postResponeError,
          this.createRuleModel, this.messageService, this.changeDetector, this.topElemRef);
      });
  }
  saveFreeRules() {
    const framerObject = CreateRuleStandardUtilsService.onRefreshRatePostFramer(this.createRuleModel,
      this.optionalFields['optionalAttributesModel']);
    const freeEventTypeModel = this.freeRuleTab.freeTypeEventTab ?
      this.freeRuleTab.freeTypeEventTab.freeEventTypeModel : null;
    const freeCalendarModel = this.freeRuleTab.freeTypeCalendarTab ?
      this.freeRuleTab.freeTypeCalendarTab.freeCalendarModel : null;
    const params = this.createRuleUtilityService.saveParamFramerFree(this.createRuleModel, framerObject,
      this.freeRuleTab.freeRuleModel, freeEventTypeModel, freeCalendarModel,
      this.documentation.viewDocumentationModel, this.optionalFields['optionalAttributesModel']);
    this.createRulesService.postFreeRule(this.agreementID, params).
      pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag)).subscribe((postResponse: object) => {
        this.processSaveFreeRuleResponse(postResponse);
      }, (postResponeError: Error) => {
        this.createRuleModel.isFreeRuleSaveAndClose = true;
        this.createRuleUtilityService.postErrorHandling(postResponeError,
          this.createRuleModel, this.messageService, this.changeDetector, this.topElemRef);
      });
  }
  processSaveFreeRuleResponse(postResponse) {
    if (!this.createRuleModel.isFreeRuleSaveAndClose) {
      this.referenceTable.referenceModel.savedFreeRuleConfigurationId = postResponse['customerAccessorialFreeRuleConfigurationId'];
      this.createRuleModel.showReferenceGrid = postResponse;
      this.saveAndCreateNewFreeRule();
    } else {
      this.localStore.setAccessorialTab('accessType', 'create', { id: 2, text: 'rules' });
      this.router.navigate(['/standard']);
    }
    this.createRuleUtilityService.
      toastMessage(this.messageService, 'success', 'Rule Saved', 'The rule has been successfully saved.');
    this.changeDetector.detectChanges();
  }
  processSaveRuleResponse(title = 'Rule Saved', message = 'The rule has been successfully saved.') {
    this.localStore.setAccessorialTab('accessType', 'create', { id: 2, text: 'rules' });
    this.router.navigate(['/standard']);
    this.createRuleUtilityService.
      toastMessage(this.messageService, 'success', title, message);
    this.changeDetector.detectChanges();
  }
  savePopupCancel() {
    this.createRuleModel.isDetailsSaved = false;
    this.createRuleModel.isShowSavePopup = false;
  }
  averagingRuleReset() {
    if (this.createRuleModel.isAveragingRules) {
      this.averagingRules.averagingRulesModel.averagingForm.reset();
      this.averagingRules.averagingRulesModel.isWeekly = false;
      this.averagingRules.averagingRulesModel.isMonthly = false;
      this.averagingRules.changeDetector.detectChanges();
    }
  }
  loadRuleAccordion(event?: Event) {
    this.createRuleModel.isAveragingRules = false;
    this.createRuleModel.isFreeRules = false;
    this.createRuleModel.isSuspend = false;
    this.createRuleModel.isArrival = false;
    this.createRuleModel.isNotification = false;
    this.createRuleModel.selectedFreeRuleType = null;
    this.addControlToForm('arrivalGrace', false);
    this.addControlToForm('arrivalGraceAmount', false);
    switch (this.createRuleModel.selectedRuleType.label.toLowerCase()) {
      case 'averaging':
        this.createRuleModel.isAveragingRules = true;
        break;
      case 'free':
        this.createRuleModel.isFreeRules = true;
        break;
      case 'suspend invoicing':
        this.createRuleModel.isSuspend = true;
        break;
      case 'notification':
        this.createRuleModel.isNotification = true;
        break;
      case this.createRuleModel.arrivalHeading:
        this.createRuleModel.isArrival = true;
        this.addControlToForm('arrivalGrace', true);
        this.addControlToForm('arrivalGraceAmount', true);
        this.getGracePeriod();
        break;
      default:
        break;
    }
  }
  addControlToForm(controlName, isRequired) {
    this.createRuleModel.rulesForm.controls[controlName].setValidators(isRequired ? Validators.required : null);
  }
  onBlurRuleType(ruleEvent: Event) {
    if (this.createRuleModel.rulesForm.controls['ruleType'].value && !ruleEvent.target['value']) {
      this.createRuleModel.isAveragingRules = false;
      this.createRuleModel.isFreeRules = false;
      this.createRuleModel.isSuspend = false;
      this.createRuleModel.isArrival = false;
      this.createRuleModel.rulesForm.controls['ruleType'].setValue(null);
      this.createRuleModel.selectedRuleType = {
        label: null,
        value: null
      };
    }
  }
  navigationPopupCancel() {
    this.createRuleModel.isNavigationChange = false;
  }
  onNavigationChange() {
    this.createRuleModel.isDetailsSaved = true;
    this.createRuleModel.isNavigationChange = false;
    this.createRuleModel.isChangesSaving = true;
    this.router.navigate(['/standard']);
  }
  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.createRuleModel.routingUrl = nextState.url;
    if ((this.optionalFields['optionalAttributesModel']['optionalForm'].dirty || this.createRuleModel.rulesForm.dirty)
      && !this.createRuleModel.isDetailsSaved) {
      this.createRuleModel.isChangesSaving = false;
    } else {
      this.createRuleModel.isChangesSaving = true;
    }
    this.createRuleModel.isNavigationChange = !this.createRuleModel.isChangesSaving;
    this.changeDetector.detectChanges();
    return this.createRuleModel.isChangesSaving;
  }
  createDocumentation(iscreateDocumentation: boolean) {
    if (iscreateDocumentation) {
      this.createRuleModel.isDetailsSaved = true;
    }
  }
  getGracePeriod() {
    this.createRulesService.getGracePeriod().pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag))
      .subscribe((GracePeriod) => {
        this.createRuleUtilityService.populateGracePeriod(GracePeriod, this.createRuleModel, this.changeDetector);
      });
  }
  setSuperUserBackDateDays() {
    this.createRulesService.getSuperUserBackDate()
      .pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag))
      .subscribe((backDateRes) => {
        this.createRuleModel.superUserBackDateDays =
          +backDateRes['_embedded']['configurationParameterDetails'][0]['configurationParameterValue'];
      });
  }
  setSuperUserFutureDateDays() {
    this.createRulesService.getSuperFutureBackDate()
      .pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag))
      .subscribe((backDateRes) => {
        this.createRuleModel.superUserFutureDateDays =
          +backDateRes['_embedded']['configurationParameterDetails'][0]['configurationParameterValue'];
      });
  }
  onBlurGracePeriod(value: string) {
    if (Number(value) <= 0) {
      this.createRuleModel.rulesForm.controls['arrivalGraceAmount'].setErrors({ required: true });
    } else {
      this.createRuleModel.rulesForm.controls['arrivalGraceAmount'].setValue(value);
    }
  }
  onfocusAmount(controlName: string) {
    this.createRuleModel[controlName] = this.createRuleModel[controlName] ? this.createRuleModel[controlName].replace(/,/g, '') : '';
    this.createRuleModel.rulesForm.controls[controlName].setValue(this.createRuleModel[controlName]);
  }
  onFormKeypress(event, keyname: string): boolean | undefined {
    const pattern = /^\-?\d{0,7}(\.\d{0,4})?$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = this.createRuleModel[keyname];
      this.createRuleModel.rulesForm.controls[keyname].setValue(this.createRuleModel[keyname]);
      return false;
    }
    this.createRuleModel[keyname] = event.target.value;
    this.createRuleModel.rulesForm.controls[keyname].setValue(this.createRuleModel[keyname]);
  }
  onBlurArrivalGrace(event) {
    if (utils.isEmpty(event.target.value)) {
      this.createRuleModel.rulesForm.controls.arrivalGrace.setValue(null);
    }
  }
  onautoCompleteBlur(event, controlName: string) {
    if (this.createRuleModel.rulesForm.controls[controlName].value &&
      !event.target['value']) {
      this.createRuleModel.rulesForm.controls[controlName].setValue(null);
    }
  }
  onTypeGroupName(event) {
    CreateRuleStandardUtilsService.onTypeGroupNameUtil(event, this);
  }
}
