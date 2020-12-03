import { AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild
  , OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, RouterStateSnapshot } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';

import { takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import * as utils from 'lodash';
import { CreateRuleModel } from './model/create-rules.model';
import { CreateRulesService } from './service/create-rules.service';
import { OptionalUtilityService } from '../../shared/services/optional-utility.service';
import { RuleTypeInterface, RuleType, ChargeCodeResponseInterface, EditRuleAccesorialData } from './model/create-rules.interface';
import { FreeEventTypeModel } from './../free-rule/free-event-type/model/free-event-type.model';
import { BuSoAssociation } from '../../shared/models/optional-attributes.interface';
import { DocumentationDate, CanComponentDeactivate } from '../../documentation/create-documentation/model/create-documentation.interface';
import { CreateRuleUtilityService } from './service/create-rule-utility.service';
import { CreateRateUtilityService } from '../../rates/create-rates/service/create-rate-utility.service';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';
import { EditRuleUtility } from './service/edit-rules-utility';
import { CreateRateUtilsService } from '../../rates/create-rates/service/create-rate-utils.service';
import { LocalStorageService } from './../../../../../shared/jbh-app-services/local-storage.service';
import { CreateDocumentationService } from '../../documentation/create-documentation/service/create-documentation.service';

@Component({
  selector: 'app-create-rules',
  templateUrl: './create-rules.component.html',
  styleUrls: ['./create-rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRulesComponent implements OnInit, AfterViewInit, OnDestroy {
  createRuleModel: CreateRuleModel;
  agreementID: string;
  agreementURL: string;
  lineHaulUrl: string;
  items: MenuItem[];
  @ViewChild('optionalFields') optionalFields: any;
  @ViewChild('contract') contract: any;
  @ViewChild('billTo') billTo: any;
  @ViewChild('section') section: any;
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
    private readonly createRateUtilityService: CreateRateUtilityService,
    private readonly createRateUtilsService: CreateRateUtilsService,
    private readonly createRuleUtilityService: CreateRuleUtilityService,
    private readonly createDocumentationService: CreateDocumentationService,
    private readonly localStore: LocalStorageService,
    private readonly shared: BroadcasterService) {
    this.lineHaulUrl = '/viewagreement';
    this.route.queryParams.subscribe((params: Params) => {
      this.agreementID = String(params['id']);
      this.agreementURL = `/viewagreement?id=${this.agreementID}`;
      this.createRuleModel = new CreateRuleModel(this.agreementID);
    }, (error: Error) => {
      this.createRuleUtilityService.toastMessage(this.messageService, 'error', 'Error', error.message);
    });
  }

  ngOnInit() {
    this.createRuleModel.agreementDetails = this.localStore.getAgreementDetails();
    this.createRulesForm();
    this.getRuleTypeValues();
    this.getChargeTypes();
    this.subscribeToAccesorialRulesEdit();
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
    this.onFormValueChange();
  }
  ngOnDestroy() {
    this.createRuleModel.isSubscribeFlag = false;
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
      arrivalGraceAmount: ['', null],
      arrivalGrace: ['', null]
    });
    this.createRuleModel.rulesForm.controls['ruleLevel'].setValue('Agreement');
    this.createRuleModel.selectedRuleLevel = 'Agreement';
  }
  setAgreementLevelDate() {
    this.createRuleModel.loading = true;
    this.createDocumentationService.getAgreementLevelDate(this.agreementID, this.createRuleModel.selectedRuleLevel)
      .pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag))
      .subscribe((documentationDate: DocumentationDate) => {
        this.createRuleModel.loading = false;
        this.createRuleUtilityService.populateAgreementLevel(documentationDate, this.createRuleModel, this.changeDetector);
      }, (agreementLevelError: Error) => {
        this.createRuleModel.loading = false;
        this.createRuleUtilityService.toastMessage(this.messageService,
          'error', 'Error', agreementLevelError['error']['errors'][0]['errorMessage']);
      });
  }
  onFormValueChange() {
    const formFields = ['effectiveDate', 'expirationDate', 'chargeType'];
    const referenceGridFormFields = ['chargeType', 'ruleLevel'];
    formFields.forEach(fieldName => {
      this.createRuleModel.rulesForm.controls[fieldName].valueChanges.subscribe(val => {
        this.removeDocumentation();
        this.createRuleModel.inlineErrormessage = [];
      });
    });
    this.optionalFields.optionalAttributesModel.optionalForm.valueChanges.subscribe(val => {
      this.removeDocumentation();
      this.createRuleModel.inlineErrormessage = [];
      this.createRuleUtilityService.createReferenceGridParams(this);
    });
    referenceGridFormFields.forEach(fieldName => {
      this.createRuleModel.rulesForm.controls[fieldName].valueChanges.subscribe(val => {
        this.createRuleModel.inlineErrormessage = [];
        this.createRuleUtilityService.createReferenceGridParams(this);
      });
    });
  }
  onBusinessUnitShow($event) {
    this.createRuleModel.rulesForm.get('chargeType').markAsTouched();
  }
  onSharedListChanges() {
    this.createRuleUtilityService.createReferenceGridParams(this);
    this.removeDocumentation();
  }
  removeDocumentation() {
    this.documentation.removeDocument('legal');
    this.documentation.removeDocument('instructional');
    this.documentation.changeDetector.detectChanges();
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
      this.createRuleModel.effectiveMaxDate = new Date(selectedDate);
      const expDate = new Date(selectedDate);
      this.createRuleUtilityService.validateDate(expDate, selectedType, this.createRuleModel);
      this.createRuleModel.expirationDate = this.createRuleUtilityService.dateFormatter(selectedDate);
      this.createRuleUtilityService.setFormErrors(this, this.changeDetector);
      this.createRuleUtilityService.setValidation('effectiveDate', this.createRuleModel);
    }
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
    this.createDocumentationService.getChargeTypes().pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag))
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
    this.createRuleModel.isEditAccessorialRuleClicked = false;
    this.getBUbasedOnChargeType(selectedChargeCodes['value']);
  }
  getBUbasedOnChargeType(chargeTypeId: number) {
    this.createRulesService.getBUbasedOnChargeType(chargeTypeId).pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag))
      .subscribe((data: BuSoAssociation[]) => {
        this.createRuleModel.businessUnitBasedOnChargeType = data;
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
    this.createRuleModel.isEditAccessorialRuleClicked = false;
    this.contractSectionReset();
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
    if (this.contract) {
      this.contractListCheck();
    } else if (this.section) {
      this.sectionListCheck();
    }
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
    this.router.navigate([this.lineHaulUrl], { queryParams: { id: this.agreementID } });
  }
  checkContractSection(rateLevelChangeVal: string) {
    if (rateLevelChangeVal.toLowerCase() === 'contract') {
      this.contractListCheck();
    } else if (rateLevelChangeVal.toLowerCase() === 'section') {
      this.sectionListCheck();
    }
  }
  contractListCheck() {
    if (this.createRuleModel.selectedContractValue && this.createRuleModel.selectedContractValue.length) {
      this.createRuleModel.contractChecked = true;
    }
  }
  sectionListCheck() {
    if (this.createRuleModel.selectedSectionValue && this.createRuleModel.selectedSectionValue.length) {
      this.createRuleModel.sectionChecked = true;
    }
  }
  getContractDetails(contractValues) {
    this.createRuleModel.selectedContractValue = contractValues;
    this.changeDetector.detectChanges();
  }
  getsectionDetails(sectionValues) {
    this.createRuleModel.selectedSectionValue = sectionValues;
    this.changeDetector.detectChanges();
  }
  validateFieldsForDocumentation(validateFields: boolean) {
    this.createRuleModel.isRefreshClicked = true;
    if (validateFields) {
      this.createRuleModel.validFields = this.onValidateForm(true);
      const invalidSelection = this.invalidSelections();
      if (invalidSelection) {
        this.createRuleModel.validFields = false;
      }
      this.optionalUtilityService.setDocumentationValid(this.createRuleModel);
      this.changeDetector.detectChanges();
    }
  }
  displayReferenceGrid(isDisplay: boolean) {
    this.createRuleUtilityService.createReferenceGridParams(this);
  }
  onValidateForm(isRefresh): boolean {
    this.createRuleModel.errorMsg = false;
    const validOptionalFields = this.optionalUtilityService.
      validateOptionalFields(this.optionalFields.optionalAttributesModel, this.messageService);
    let validateFlag: boolean;
    if (isRefresh && this.createRuleUtilityService.validateRuleForm(this.createRuleModel) && validOptionalFields) {
      validateFlag = this.validateContractSection();
    } else {
      this.formFieldsTouched();
      validateFlag = false;
    }
    return validateFlag;
  }
  validateContractSection() {
    const rateLevel = this.createRuleModel.rulesForm.value.ruleLevel;
    if ((rateLevel === 'contract' &&
      !this.optionalUtilityService.isContractSelected(this.contract.contractListModel, this.messageService)) || (rateLevel === 'section' &&
        !this.optionalUtilityService.isSectionSelected(this.section.sectionsModel, this.messageService))) {
      return false;
    } else {
      return true;
    }
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
  checkContractValidity(parentComponent) {
    let inactiveContract;
    if (parentComponent) {
      inactiveContract = parentComponent.contractListModel.selectedContract.find(value =>
        (value['status'] === 'Inactive'));
      return inactiveContract;
    }
    return false;
  }
  checkSectionValidity(sectionComponent) {
    let inactiveSection;
    if (sectionComponent) {
      inactiveSection = sectionComponent.sectionsModel.dataSelected.find(value =>
        (value['status'] === 'Inactive'));
      return inactiveSection;
    }
    return false;
  }
  checkBillToValidity(billToComponent) {
    let inactiveBillTo;
    if (billToComponent.billTo) {
      inactiveBillTo = billToComponent.billToModel.dataSelected.find(value =>
        (value['status'] === 'Inactive'));
      return inactiveBillTo;
    }
    return false;
  }
  invalidSelections() {
    const inactiveContract = this.checkContractValidity(this.contract);
    const inactiveSection = this.checkSectionValidity(this.section);
    const inactiveBillTo = this.checkBillToValidity(this.billTo);
    if (inactiveContract || inactiveSection || inactiveBillTo) {
      this.createRuleUtilityService.toastMessage(this.messageService, 'error', 'Date Range Mismatch',
        inactiveBillTo ? 'Some of the Bill To Accounts selected are not valid for the specified date range. Please uncheck to proceed' :
          'Some of the Contracts(or Sections) selected are not valid for the specified date range. Please uncheck to proceed');
      return true;
    }
    return false;
  }
  ruleLevelValidation() {
    const invalidSelection = this.invalidSelections();
    if (invalidSelection) {
      return;
    }
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
        this.appNotifyBy.notifyByModel.notifyByForm.controls[name].markAsTouched();
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
  contractSectionReset() {
    if (this.contract) {
      this.contract.contractListModel.selectedContract = [];
      this.contract.changeDetector.detectChanges();
      this.createRuleModel.selectedContractValue = [];
    } else if (this.section) {
      this.section.sectionsModel.selectedSection = [];
      this.section.changeDetector.detectChanges();
      this.createRuleModel.selectedSectionValue = [];
    }
  }
  ruleSave() {
    this.createRuleModel.isShowSavePopup = false;
    this.saveBasedonRuleTypes();
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
    const framerObject = this.createRateUtilityService.onRefreshRatePostFramer(this.createRuleModel, this.createRuleModel.rulesForm,
      this.optionalFields['optionalAttributesModel'], this.billTo['billToModel'], this.agreementID);
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
    const params = this.createRateUtilityService.onRefreshRatePostFramer(this.createRuleModel, this.createRuleModel.rulesForm,
      this.optionalFields['optionalAttributesModel'], this.billTo['billToModel'], this.agreementID);
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
    const params = this.createRateUtilityService.onRefreshRatePostFramer(this.createRuleModel, this.createRuleModel.rulesForm,
      this.optionalFields['optionalAttributesModel'], this.billTo['billToModel'], this.agreementID);
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
    const framerObject = this.createRateUtilityService.onRefreshRatePostFramer(this.createRuleModel, this.createRuleModel.rulesForm,
      this.optionalFields['optionalAttributesModel'], this.billTo['billToModel'], this.agreementID);
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
    const framerObject = this.createRateUtilityService.onRefreshRatePostFramer(this.createRuleModel, this.createRuleModel.rulesForm,
      this.optionalFields['optionalAttributesModel'], this.billTo['billToModel'], this.agreementID);
    const freeEventTypeModel = this.freeRuleTab.freeTypeEventTab ?
      this.freeRuleTab.freeTypeEventTab.freeEventTypeModel : null;
    const freeCalendarModel = this.freeRuleTab.freeTypeCalendarTab ?
      this.freeRuleTab.freeTypeCalendarTab.freeCalendarModel : null;
    const params = this.createRuleUtilityService.saveParamFramerFree(this.createRuleModel, framerObject,
      this.freeRuleTab.freeRuleModel, freeEventTypeModel, freeCalendarModel,
      this.documentation.viewDocumentationModel, this.optionalFields['optionalAttributesModel']);
    if (!this.createRuleModel.isEditFlagEnabled) {
      this.createRulesService.postFreeRule(this.agreementID, params).
        pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag)).subscribe((postResponse: object) => {
          this.processSaveFreeRuleResponse(postResponse);
        }, (postResponeError: Error) => {
          this.createRuleModel.isFreeRuleSaveAndClose = true;
          this.createRuleUtilityService.postErrorHandling(postResponeError,
            this.createRuleModel, this.messageService, this.changeDetector, this.topElemRef);
        });
    } else {
      params['customerAccessorialFreeRuleConfigurationId'] =  this.createRuleModel['ruleConfigurationId'];
      this.createRulesService.patchFreeRule(this.agreementID, params).
        pipe(takeWhile(() => this.createRuleModel.isSubscribeFlag)).subscribe((postResponse: object) => {
          this.processSaveFreeRuleResponse(postResponse);
        }, (postEditErrorResponse: Error) => {
          this.createRuleModel.isFreeRuleSaveAndClose = true;
          this.createRuleUtilityService.postErrorHandling(postEditErrorResponse,
            this.createRuleModel, this.messageService, this.changeDetector, this.topElemRef);
        });
    }
  }
  processSaveFreeRuleResponse(postResponse) {
    if (!this.createRuleModel.isFreeRuleSaveAndClose) {
      this.referenceTable.referenceModel.savedFreeRuleConfigurationId = postResponse['customerAccessorialFreeRuleConfigurationId'];
      this.createRuleModel.showReferenceGrid = postResponse;
      this.createRuleUtilityService.saveAndCreateNewFreeRule(this);
    } else {
      this.localStore.setAccessorialTab('accessType', 'create', { id: 2, text: 'rules' });
      this.router.navigate([this.lineHaulUrl], { queryParams: { id: this.agreementID } });
    }
    this.createRateUtilityService.
      toastMessage(this.messageService, 'success', 'Rule Saved', 'The rule has been successfully saved.');
    this.changeDetector.detectChanges();
  }
  processSaveRuleResponse(title = 'Rule Saved', message = 'The rule has been successfully saved.') {
    this.localStore.setAccessorialTab('accessType', 'create', { id: 2, text: 'rules' });
    this.router.navigate([this.lineHaulUrl], { queryParams: { id: this.agreementID } });
    this.createRateUtilityService.
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
    if (this.createRuleModel.routingUrl === this.agreementURL) {
      this.router.navigate([this.lineHaulUrl], { queryParams: { id: this.agreementID } });
    } else {
      this.router.navigate([this.createRuleModel.routingUrl]);
    }
  }
  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.createRuleModel.routingUrl = nextState.url;
    if ((this.optionalFields['optionalAttributesModel']['optionalForm'].dirty || this.createRuleModel.contractChecked
      || this.createRuleModel.sectionChecked || this.createRuleModel.rulesForm.dirty || this.billTo['billToModel']['selectedBillTo'].length)
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
  subscribeToAccesorialRulesEdit() {
    this.shared.on<EditRuleAccesorialData>('editAccesorialRules').pipe(takeWhile(() =>
      this.createRuleModel.isSubscribeFlag))
      .subscribe((editResponse: EditRuleAccesorialData) => {
        if (editResponse.isAccessorialRuleEdit) {
          this.createRuleUtilityService.setAccessorialRuleValues(this, editResponse);
        } else {
          this.setAgreementLevelDate();
        }
        this.getChargeTypes();
      });
  }
  patchValuesToAccessorialRules(editRuleData: object) {
    EditRuleUtility.setValuesToAccessorialRuleForm(editRuleData, this.createRuleModel,
      this.optionalFields['optionalAttributesModel'], this.optionalFields, this, this.documentation);
      EditRuleUtility.checkRulesLevel(editRuleData, this.createRuleModel);
    this.changeDetector.detectChanges();
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
  setEditRuleFlagToFalse(editAccessorialStatus: boolean) {
    this.createRuleModel.isEditAccessorialRuleClicked = editAccessorialStatus;
  }
  onBlurArrivalGrace(event) {
    if (utils.isEmpty(event.target.value)) {
      this.createRuleModel.rulesForm.controls.arrivalGrace.setValue(null);
    }
  }
  selectedBuSoOnly(data) {
    this.createRuleModel.selectedBuSo = data;
  }
  busoselect(data) {
    if (!this.createRuleModel.rulesForm.controls['chargeType'].value) {
      this.createRuleModel.buSo = [];
    } else {
      this.createRuleModel.buSo = data;
    }
    this.changeDetector.markForCheck();
  }
}
