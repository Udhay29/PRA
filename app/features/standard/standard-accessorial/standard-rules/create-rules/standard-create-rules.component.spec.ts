import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';

import { NotifyWhenComponent } from './../../../../shared/accessorials/notification/notify-when/notify-when.component';
import { NotifyByComponent } from './../../../../shared/accessorials/notification/notify-by/notify-by.component';
import { CreateRuleStandardUtilsService } from './service/standard-create-rule-utils';
import { CreateStandardRulesComponent } from './standard-create-rules.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  CreateStandardDocumentationService
} from './../../standard-documentation/create-standard-documentation/service/create-standard-documentation.service';
import { of } from 'rxjs';
import { CreateRuleUtilityService } from './service/standard-create-rule-utility.service';
import { CreateRulesService } from './service/standard-create-rules.service';
import { By } from '@angular/platform-browser';
import { OptionalUtilityService } from '../shared/services/optional-utility.service';
import { FreeRuleComponent } from '../free-rule/free-rule.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CreateRuleModel } from './model/standard-create-rules.model';
import { invalid } from 'moment';
import { FreeEventTypeModel } from '../free-rule/free-event-type/model/free-event-type.model';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanDeactivateGuardService } from '../../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { StandardModule } from '../../../standard.module';
import { RatesOptionalAttributesComponent
} from '../../standard-rate/create-standard-rate/rates-optional-attributes/rates-optional-attributes.component';
import { AveragingRulesComponent } from './../../../../shared/accessorials/rule-shared/averaging-rules/averaging-rules.component';

describe('CreateStandardRulesComponent', () => {
  let component: CreateStandardRulesComponent;
  let fixture: ComponentFixture<CreateStandardRulesComponent>;
  let freeRuleComponent: FreeRuleComponent;
  let freeRuleFixture: ComponentFixture<FreeRuleComponent>;
  let averagingRuleComponent: AveragingRulesComponent;
  let ratesOptionalAttributesComponent: RatesOptionalAttributesComponent;
  let ratesOptionalAttributesFixture: ComponentFixture<RatesOptionalAttributesComponent>;
  let averagingRuleFixture: ComponentFixture<AveragingRulesComponent>;
  let notifyByComponent: NotifyByComponent;
  let notifyByFixture: ComponentFixture<NotifyByComponent>;
  let notifyWhenComponent: NotifyWhenComponent;
  let notifyWhenFixture: ComponentFixture<NotifyWhenComponent>;
  let createDocumentationService: CreateStandardDocumentationService;
  let createRuleUtilityService: CreateRuleUtilityService;
  let createRulesService: CreateRulesService;
  let optionalUtilityService: OptionalUtilityService;
  const freeRuleBuilder: FormBuilder = new FormBuilder();
  let freeRuleForm: FormGroup;
  let canDeactivateGuardService: CanDeactivateGuardService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [CreateStandardDocumentationService, CreateRuleUtilityService, CreateRulesService,
        OptionalUtilityService, CanDeactivateGuardService, { provide: APP_BASE_HREF, useValue: '/' },
        { provide: RouterStateSnapshot, useValue: CreateStandardRulesComponent },
        { provide: ActivatedRouteSnapshot, useValue: CreateStandardRulesComponent }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStandardRulesComponent);
    component = fixture.componentInstance;
    freeRuleFixture = TestBed.createComponent(FreeRuleComponent);
    freeRuleComponent = freeRuleFixture.componentInstance;
    averagingRuleFixture = TestBed.createComponent(AveragingRulesComponent);
    averagingRuleComponent = averagingRuleFixture.componentInstance;
    notifyByFixture = TestBed.createComponent(NotifyByComponent);
    notifyByComponent = notifyByFixture.componentInstance;
    notifyWhenFixture = TestBed.createComponent(NotifyWhenComponent);
    notifyWhenComponent = notifyWhenFixture.componentInstance;
    fixture.detectChanges();
    canDeactivateGuardService = TestBed.get(CanDeactivateGuardService);
    route = TestBed.get(ActivatedRouteSnapshot);
    state = TestBed.get(RouterStateSnapshot);
    nextState = TestBed.get(RouterStateSnapshot);
    createDocumentationService = fixture.debugElement.injector.get(CreateStandardDocumentationService);
    createRuleUtilityService = fixture.debugElement.injector.get(CreateRuleUtilityService);
    createRulesService = fixture.debugElement.injector.get(CreateRulesService);
    optionalUtilityService = fixture.debugElement.injector.get(OptionalUtilityService);
    component.averagingRules = averagingRuleComponent;
    component.freeRuleTab = freeRuleComponent;
    component.appNotifyBy = notifyByComponent;
    component.appNotifyWhen = notifyWhenComponent;
    ratesOptionalAttributesFixture = TestBed.createComponent(RatesOptionalAttributesComponent);
    ratesOptionalAttributesComponent = ratesOptionalAttributesFixture.componentInstance;
    freeRuleForm = freeRuleBuilder.group({
      freeRuleType: ['', Validators.required],
      requestedDeliveryDate: ['', Validators.required],
      distanceType: ['', Validators.required],
      timeType: ['', Validators.required],
      quantity: ['', Validators.required]
    });
    component.freeRuleTab.freeRuleModel.freeRulesForm = freeRuleForm;
    component.appNotifyBy.notifyByModel.CheckBoxData = [{
      value: 1,
      label: 'string'
    }];
    component.appNotifyWhen.notifyWhenModel.accessorialNotificationRequiredTypes = [{
      label: 'string',
      value: 1
    }];
    component.appNotifyWhen.notifyWhenModel.notifyWhenForm = new FormGroup({
      frequency: new FormControl('', [Validators.required]),
      eventOccuranceTime: new FormControl('', [Validators.required]),
      accessorialNotificationRequiredTypes: new FormControl('Notification Required'),
      eventName: new FormControl('', [Validators.required]),
      timeframe: new FormControl(''),
      batchTime: new FormControl(''),
      timeframeInput: new FormControl('')
    });
    component.averagingRules.averagingRulesModel.averagingForm = freeRuleBuilder.group({
      timeFrame: ['', Validators.required],
      dayOfWeek: [''],
      monthlyAveragingTypes: [''],
      specificDay: [''],
      monthlyDay: [''],
      frequency: ['']
    });
  });

  const aggrementDetails = {
    agreementType: 'string',
    businessUnits: 'string',
    cargoReleaseAmount: 1,
    currencyCode: 'string',
    customerAgreementID: 1,
    customerAgreementName: 'string',
    effectiveDate: 'string',
    expirationDate: 'string',
    invalidIndicator: 'string',
    invalidReasonTypeName: 'string',
    taskAssignmentIDs: 'string',
    teams: 'string',
    ultimateParentAccountID: 1
  };

  const dateResponse = {
    agreementID: 1,
    agreementDefaultAmount: 1,
    agreementEffectiveDate: '2038-01-19 03:14:07.999999',
    agreementExpirationDate: '2098-01-19 03:14:07.999999',
    customerContractDetailDTO: ['test'],
    customerSectionDetailDTO: ['test']
  };

  const ruleTypeResponse = {
    '_embedded': {
      'accessorialRuleTypes': [{
        '@id': 1,
        'accessorialRuleTypeID': 1,
        'accessorialRuleTypeName': 'Arrival Grace Period',
        'effectiveDate': '2019-05-24',
        'expirationDate': '2099-12-31',
        'lastUpdateTimestampString': '2019-05-24T14:08:57.509683',
        '_links': {}
      }],
    },
    '_links': {},
    'page': {
      'size': 50,
      'totalElements': 5,
      'totalPages': 1,
      'number': 0
    }
  };

  const chargeTypeResponse = [{
    'chargeTypeID': 64,
    'chargeTypeCode': 'ADMIN',
    'chargeTypeName': 'AdministrationFee',
    'chargeTypeDescription': 'Additional.',
    'chargeTypeBusinessUnitServiceOfferingAssociations': [{
      'chargeTypeBusinessUnitServiceOfferingAssociationID': 761,
      'chargeTypeID': null,
      'financeBusinessUnitServiceOfferingAssociation': {
        'financeBusinessUnitServiceOfferingAssociationID': 4,
        'financeBusinessUnitCode': 'DCS',
        'serviceOfferingCode': 'Backhaul'
      },
      'financeChargeUsageTypeID': 1,
      'effectiveDate': '2019-01-01',
      'expirationDate': '2099-12-31'
    }]
  }];

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onInit', () => {
    component.createRuleModel.agreementDetails = aggrementDetails;
    spyOn(createRulesService, 'getRuleType').and.returnValues(of(ruleTypeResponse));
    spyOn(createRuleUtilityService, 'populateRuleType').and.callThrough();
    spyOn(createDocumentationService, 'getChargeTypes').and.returnValues(of(chargeTypeResponse));
    spyOn(createRuleUtilityService, 'populateChargeType').and.callThrough();
    spyOn(createRulesService, 'getSuperFutureBackDate').and.returnValues(of({
      '_embedded': {
        'configurationParameterDetails': [{
          'configurationParameterDetailID': 404,
          'configurationParameterValue': '30',
          'configurationParameter': {
            'configurationParameterName': 'Super User Future Date Days',
            'configurationParameterID': 4,
            'configurationParameterValueType': 'Number',
            '_links': {}
          },
          'parameterSpecificationType': {
            'parameterSpecificationTypeID': 2,
            'parameterSpecificationTypeName': 'Max'
          },
          '_links': {}
        }]
      },
      '_links': {}
    }));
    spyOn(createRulesService, 'getSuperUserBackDate').and.returnValues(of({
      '_embedded': {
        'configurationParameterDetails': [{
          'configurationParameterDetailID': 403,
          'configurationParameterValue': '180',
          'configurationParameter': {
            'configurationParameterValueType': 'Number',
            'configurationParameterID': 2,
            'configurationParameterName': 'Super User Back Date Days',
            '_links': {}
          },
          'parameterSpecificationType': {
            'parameterSpecificationTypeID': 2,
            'parameterSpecificationTypeName': 'Max'
          },
          '_links': {}
        }]
      },
      '_links': {}
    }));
    component.ngOnInit();
  });

  it('should call createRulesForm', () => {
    component.createRulesForm();
  });

  it('should call onFormValueChange', () => {
    component.onFormValueChange();
  });

  it('should call onBusinessUnitShow', () => {
    component.onBusinessUnitShow(Event);
  });

  it('should call onSharedListChanges', () => {
    component.onSharedListChanges();
  });

  it('should call removeDocumentation', () => {
    component.documentation.viewDocumentationModel.docIsLegalText = true;
    component.removeDocumentation();
  });

  it('should call onDateSelected', () => {
    component.onDateSelected(new Date('2038-01-19'), 'effectivedate');
    component.onDateSelected(new Date('2088-01-19'), 'expirationdate');
  });

  it('should call typedDateValidate for if ', () => {
    const event1: any = {
      srcElement: {
        value: '06/01/1990'
      }
    };
    component.createRuleModel.rulesForm.controls['effectiveDate'].setValue(new Date('2038/01/19'));
    component.createRuleModel.rulesForm.controls['expirationDate'].setValue(new Date('2038/01/19'));
    component.typedDateValidate(event1, 'effectiveDate');
    component.typedDateValidate(event1, 'expirationDate');
  });

  it('should call typedDateValidate for else ', () => {
    const event1: any = {
      srcElement: {
        value: '06/01/1990'
      }
    };
    component.typedDateValidate(event1, 'effectiveDate');
    component.typedDateValidate(event1, 'expirationDate');
  });

  it('should call typedDateValidate for default', () => {
    const event1: any = {
      srcElement: {
        value: '06/01/1990'
      }
    };
    component.typedDateValidate(event1, 'effective');
  });

  it('should call getRuleTypeValues', () => {
    spyOn(CreateRulesService.prototype, 'getRuleType').and.returnValues(of(ruleTypeResponse));
    component.getRuleTypeValues();
  });

  it('should call onTypeRuleType', () => {
    component.createRuleModel.ruleType = [{
      label: 'string',
      value: 1
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="ruleType"]'));
    element.triggerEventHandler('completeMethod', { 'query': 's' });
  });

  it('should call onTypeGracePeriod', () => {
    component.createRuleModel.gracePeriod = [{
      label: 'string',
      value: 1
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="ruleType"]'));
    element.triggerEventHandler('completeMethod', { 'query': 's' });
  });

  it('should call getFilteredGracePeriod', () => {
    component.createRuleModel.gracePeriod = [{
      label: 'string',
      value: 1
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="ruleType"]'));
    element.triggerEventHandler('completeMethod', { 'query': 's' });
  });

  it('should call getFilteredRuleType', () => {
    component.createRuleModel.ruleType = [{
      label: 'string',
      value: 1
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="ruleType"]'));
    element.triggerEventHandler('completeMethod', { 'query': 's' });
  });
  it('should call getFilteredRuleType', () => {
    component.createRuleModel.ruleType = [{
      label: null,
      value: 1
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="ruleType"]'));
    element.triggerEventHandler('completeMethod', { 'query': 's' });
  });

  it('should call getChargeTypes', () => {
    spyOn(CreateStandardDocumentationService.prototype, 'getChargeTypes').and.returnValue(of(chargeTypeResponse));
    component.getChargeTypes();
  });

  it('should call onTypeChargeCode', () => {
    component.createRuleModel.chargeType = [{
      label: 'string',
      value: 1,
      description: 'string'
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('completeMethod', { 'query': 's' });
  });

  it('should call onSelectChargeCode', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('onSelect', { 'value': 'string' });
    element.triggerEventHandler('input', { 'target': { 'value': 'string' } });
  });

  it('should call getBUbasedOnChargeType', () => {
    const response = [{
      financeBusinessUnitServiceOfferingAssociationID: 1,
      serviceOfferingCode: 'string',
      serviceOfferingDescription: 'string',
      transitModeId: 1,
      transitModeCode: 'string',
      transitModeDescription: 'string',
      financeBusinessUnitCode: 'string',
      chargeTypeBusinessUnitServiceOfferingAssociationID: 1
    }];
    spyOn(createRulesService, 'getBUbasedOnChargeType').and.returnValues(of(response));
    component.getBUbasedOnChargeType(1);
  });

  it('should call onInputChargeType', () => {
    const event: any = { target: { value: false } };
    component.onInputChargeType(event);
  });

  it('should call onChangeRuleLevel', () => {
    const param = { label: 'string', value: 1 };
    component.onChangeRuleLevel(param);
  });
  it('should call onChangeRuleType for if ', () => {
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'string'
    };
    const param = { value: 2, label: 'test' };
    component.onChangeRuleType(param);
  });
  it('should call onChangeRuleType for else', () => {
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'string'
    };
    const param = { value: 1, label: 'test' };
    component.onChangeRuleType(param);
  });
  it('should call onChargeTypeBlur', () => {
    const event: any = {
      target: {
        value: false,
      }
    };
    component.createRuleModel.rulesForm.controls['chargeType'].setValue('abc');
    component.onChargeTypeBlur(event, 'chargeType');
  });
  it('should call onSaveAccessorialRule', () => {
    component.onSaveAccessorialRule();
  });

  it('should call onCancelAccessorialRule for if', () => {
    component.onCancelAccessorialRule();
  });

  it('should call onCancelAccessorialRule for else if', () => {
    component.onCancelAccessorialRule();
  });

  it('should call cancelCheck for else', () => {
    component.cancelCheck();
  });

  it('should call cancelCheck for if', () => {
    component.createRuleModel.contractChecked = true;
    component.cancelCheck();
  });

  it('should call onCancelPopupClose', () => {
    component.onCancelPopupClose();
  });

  it('should call onNavigate', () => {
    component.onNavigate();
  });
  it('should call validateFieldsForDocumentation', () => {
    spyOn(optionalUtilityService, 'setDocumentationValid').and.callThrough();
    component.validateFieldsForDocumentation(true);
  });
  it('should call displayReferenceGrid', () => {
    component.createRuleModel.isFreeRules = true;
    component.createRuleModel.isFreeRuleSaveAndClose = true;
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'free'
    };
    spyOn(createRuleUtilityService, 'createFreeFuleParam').and.callThrough();
    component.displayReferenceGrid(true);
  });
  it('should call createReferenceGridParams', () => {
    component.createRuleModel.isFreeRules = true;
    component.createRuleModel.selectedRuleType = {
      label: 'free',
      value: 1
    };
    component.createReferenceGridParams();
  });
  it('should call onValidateForm', () => {
    const rulesForm = freeRuleBuilder.group({
      effectiveDate: ['2019-01-01', Validators.required],
      expirationDate: ['2019-01-01', Validators.required],
      chargeType: ['abc', Validators.required],
      ruleType: ['abcd', Validators.required],
    });
    component.createRuleModel.rulesForm = rulesForm;
    component.createRuleModel.isArrival = true;
    spyOn(optionalUtilityService, 'validateOptionalFields').and.callThrough();
    spyOn(createRuleUtilityService, 'validateRuleForm').and.callThrough();
    component.onValidateForm(true);
  });
  it('should call formFieldsTouched', () => {
    spyOn(optionalUtilityService, 'isOptionalFormValid').and.callThrough();
    spyOn(createRuleUtilityService, 'isRuleFieldsValid').and.callThrough();
    spyOn(createRuleUtilityService, 'validateRuleForm').and.callThrough();
    component.validateDocumentation();
    component.formFieldsTouched();
  });
  it('should call validateRuleAndDocumentation for if', () => {
    const optionalForm = freeRuleBuilder.group({
      name: ['abc', Validators.required]
    });
    component.optionalFields.optionalAttributesModel.optionalForm = optionalForm;
    component.validateRuleAndDocumentation();
  });
  it('should call validateRuleAndDocumentation for else', () => {
    component.validateRuleAndDocumentation();
  });
  it('should call validateRuleTypes', () => {
    component.createRuleModel.selectedRuleType = { label: 'Averaging', value: 1 };
    component.validateRuleTypes();
  });
  it('should call arrivalFormValidate', () => {
    component.createRuleModel.rulesForm.addControl('arrivalGraceAmount', new FormControl(null, Validators.required));
    component.createRuleModel.rulesForm.addControl('arrivalGrace', new FormControl('abc', Validators.required));
    component.arrivalFormValidate();
  });
  it('should call validateFreeRuleForm for Quantity', () => {
    component.freeRuleTab.freeRuleModel.freeRulesForm.controls['freeRuleType'].setValue({ label: 'Quantity', value: 1 });
    component.validateFreeRuleForm();
  });
  it('should call validateFreeRuleForm for Event', () => {
    component.freeRuleTab.freeRuleModel.freeRulesForm.controls['freeRuleType'].setValue({ label: 'Event', value: 1 });
    component.validateFreeRuleForm();
  });
  it('should call validateFreeRuleForm for eles if', () => {
    component.freeRuleTab.freeRuleModel.freeRulesForm.controls['freeRuleType'].setValue({ label: '', value: 1 });
    component.validateFreeRuleForm();
  });
  it('should call quantityFormValidate', () => {
    component.freeRuleTab.freeRuleModel.freeRulesForm.controls['freeRuleType'].setErrors({ invalid: true });
    component.quantityFormValidate();
  });
  it('should call eventFormValidate', () => {
    component.freeRuleTab.freeRuleModel.freeRulesForm.controls['freeRuleType'].setErrors({ invalid: true });
    component.eventFormValidate();
  });
  it('should call ruleLevelValidate for Averaging', () => {
    component.createRuleModel.selectedRuleType = {
      label: 'Averaging',
      value: 1
    };
    component.ruleLevelValidate();
  });
  it('should call ruleLevelValidate for Free', () => {
    component.createRuleModel.selectedRuleType = {
      label: 'Free',
      value: 1
    };
    component.ruleLevelValidate();
  });
  it('should call ruleLevelValidate for Notification', () => {
    component.createRuleModel.selectedRuleType = {
      label: 'Notification',
      value: 1
    };
    component.ruleLevelValidate();
  });
  it('should call ruleLevelValidate for arrivalHeading', () => {
    component.createRuleModel.selectedRuleType = {
      label: 'Averaging',
      value: 1
    };
    component.createRuleModel.arrivalHeading = 'Averaging';
    component.ruleLevelValidate();
  });
  it('should call ruleLevelValidate for else', () => {
    component.createRuleModel.selectedRuleType = {
      label: 'abc',
      value: 1
    };
    component.createRuleModel.arrivalHeading = 'Averaging';
    component.ruleLevelValidate();
  });
  it('should call notifyFormValidate', () => {
    component.notifyFormValidate();
  });
  it('should call checkFieldNotifyValidity', () => {
    component.checkFieldNotifyValidity();
  });
  it('should call checkFieldNotifyValidityChecbox', () => {
    component.appNotifyBy.notifyByModel.notifyByForm.controls['selectionCheckbox'].setErrors({ invalid: true });
    component.checkFieldNotifyValidityChecbox();
  });
  it('should call averagingFieldValidate for isWeekly', () => {
    component.averagingRules.averagingRulesModel.isWeekly = true;
    component.averagingFieldValidate();
  });
  it('should call averagingFieldValidate for isEachDay', () => {
    component.averagingRules.averagingRulesModel.isEachDay = true;
    component.averagingFieldValidate();
  });
  it('should call averagingFieldValidate for isOnTheDay', () => {
    component.averagingRules.averagingRulesModel.isOnTheDay = true;
    component.averagingFieldValidate();
  });
  it('should call averagingFieldValidate for else', () => {
    component.averagingFieldValidate();
  });
  it('should call validateDocumentation for if', () => {
    component.documentation.viewDocumentationModel.docIsLegalText = false;
    component.validateDocumentation();
  });
  it('should call validateDocumentation for else', () => {
    component.documentation.viewDocumentationModel.docIsLegalText = true;
    component.validateDocumentation();
  });
  it('should call validateDocumentation for iff', () => {
    component.documentation.viewDocumentationModel.docIsInstructionalText = true;
    component.validateDocumentation();
  });
  it('should call validateDocumentation for iff else', () => {
    component.documentation.viewDocumentationModel.docIsInstructionalText = false;
    component.validateDocumentation();
  });
  it('should call ratesFieldReset', () => {
    component.createRuleModel.rulesForm.addControl('arrivalGrace', new FormControl('abc', Validators.required));
    component.ratesFieldReset();
  });
  it('should call saveAndCreateNewFreeRule', () => {
    component.freeRuleTab.freeRuleModel.freeRulesForm.controls['freeRuleType'].setValue('abc');
    spyOn(createRuleUtilityService, 'clearFreeRuleFormOnSaveAndCreateNew').and.callThrough();
    component.saveAndCreateNewFreeRule();
  });
  it('should call saveBasedonRuleTypes', () => {
    component.createRuleModel.arrivalHeading = 'test';
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'averaging'
    };
    spyOn(createRuleUtilityService, 'saveParamFramer').and.returnValues(of({}));
    spyOn(createRulesService, 'postRuleData').and.returnValues(of({}));
    spyOn(createRulesService, 'postRuleTypeData').and.callThrough();
    spyOn(createRulesService, 'postFreeRule').and.returnValues(of({}));
    component.saveBasedonRuleTypes();
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'free'
    };
    component.saveBasedonRuleTypes();
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'suspend invoicing'
    };
    component.saveBasedonRuleTypes();
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'notification'
    };
    component.saveBasedonRuleTypes();
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'notify'
    };
    component.saveBasedonRuleTypes();
  });
  it('should call saveNotification', () => {
    spyOn(CreateRulesService.prototype, 'postRuleTypeData').and.returnValue(of({}));
    component.saveNotification();
  });
  it('should call saveSuspendInvoicing', () => {
    spyOn(CreateRulesService.prototype, 'postRuleTypeData').and.returnValue(of({}));
    component.saveSuspendInvoicing();
  });
  it('should call saveRules', () => {
    spyOn(CreateRulesService.prototype, 'postRuleData').and.returnValue(of({}));
    component.saveRules();
  });
  it('should call saveFreeRules', () => {
    spyOn(CreateRulesService.prototype, 'postFreeRule').and.returnValue(of({}));
    component.saveFreeRules();
  });
  xit('should call processSaveFreeRuleResponse if', () => {
    const postResponse = {};
    component.createRuleModel.isFreeRuleSaveAndClose = false;
    component.processSaveFreeRuleResponse(postResponse);
  });
  it('should call processSaveFreeRuleResponse else', () => {
    const postResponse = {};
    component.createRuleModel.isFreeRuleSaveAndClose = true;
    component.processSaveFreeRuleResponse(postResponse);
  });
  it('should call processSaveRuleResponse ', () => {
    const postResponse = {};
    component.createRuleModel.isFreeRuleSaveAndClose = true;
    component.processSaveRuleResponse('Rule Saved', 'The rule has been successfully saved.');
  });
  it('should call savePopupCancel ', () => {
    component.savePopupCancel();
  });
  it('should call averagingRuleReset', () => {
    component.createRuleModel.isAveragingRules = true;
    component.averagingRuleReset();
  });
  it('should call averagingRuleReset', () => {
    component.createRuleModel.isAveragingRules = false;
    component.averagingRuleReset();
  });
  it('should call loadRuleAccordion', () => {
    component.createRuleModel.arrivalHeading = 'test';
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'averaging'
    };
    component.loadRuleAccordion();
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'free'
    };
    component.loadRuleAccordion();
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'suspend invoicing'
    };
    component.loadRuleAccordion();
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'notification'
    };
    component.loadRuleAccordion();
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'notify'
    };
    component.loadRuleAccordion();
  });
  it('should call addControlToForm', () => {
    component.addControlToForm('arrivalGrace', true);
  });
  it('should call onBlurRuleType', () => {
    const ruleEvent: any = {
      target: {
        value: false
      }
    };
    component.onBlurRuleType(ruleEvent);
  });
  it('should call navigationPopupCancel', () => {
    component.navigationPopupCancel();
  });
  it('should call onNavigationChange if', () => {
    component.createRuleModel.routingUrl = '/dashboard';
    component.agreementURL = '/dashboard';
    component.onNavigationChange();
  });
  it('should call onNavigationChange else', () => {
    component.createRuleModel.routingUrl = '/dashboard';
    component.agreementURL = '/Agreement';
    component.onNavigationChange();
  });
  it('should call canDeactivate if', () => {
    component.createRuleModel.contractChecked = true;
    component.createRuleModel.isDetailsSaved = false;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
  });
  it('should call canDeactivate else', () => {
    component.createRuleModel.contractChecked = true;
    component.createRuleModel.isDetailsSaved = true;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
  });
  it('should call createDocumentation ', () => {
    component.createDocumentation(true);
  });
  it('should call getGracePeriod ', () => {
    const response = {
      '_embedded': {
        'pricingUnitOfTimeMeasurementAssociations': [{
          '@id': 1,
          'pricingUnitOfTimeMeasurementAssociationId': 16,
          'effectiveTimestamp': '2019-05-24',
          'expirationTimestamp': '2099-12-31',
          'unitOfTimeMeasurementCode': 'Day',
          'pricingFunctionalAreaId': 6,
          'lastUpdateTimestampString': '2019-05-24T14:21:11.6623113',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/pricingUnitOfTimeMeasurementAssociations/16'
            },
            'pricingUnitOfTimeMeasurementAssociation': {
              'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/pricingUnitOfTimeMeasurementAssociations/16'
            }
          }
        }]
      }
    };
    spyOn(CreateRulesService.prototype, 'getGracePeriod').and.returnValue(of(response));
    component.getGracePeriod();
  });
  it('should call setSuperUserBackDateDays ', () => {
    const response = {
      '_embedded': {
        'configurationParameterDetails': [{
          'configurationParameterDetailID': 404,
          'configurationParameterValue': '30',
          'configurationParameter': {
            'configurationParameterName': 'Super User Future Date Days',
            'configurationParameterID': 4,
            'configurationParameterValueType': 'Number',
            '_links': {}
          },
          'parameterSpecificationType': {
            'parameterSpecificationTypeID': 2,
            'parameterSpecificationTypeName': 'Max'
          },
          '_links': {}
        }]
      },
      '_links': {}
    };
    spyOn(CreateRulesService.prototype, 'getSuperUserBackDate').and.returnValue(of(response));
    component.setSuperUserBackDateDays();
  });
  it('should call setSuperUserFutureDateDays ', () => {
    const response = {
      '_embedded': {
        'configurationParameterDetails': [{
          'configurationParameterDetailID': 404,
          'configurationParameterValue': '30',
          'configurationParameter': {
            'configurationParameterName': 'Super User Future Date Days',
            'configurationParameterID': 4,
            'configurationParameterValueType': 'Number',
            '_links': {}
          },
          'parameterSpecificationType': {
            'parameterSpecificationTypeID': 2,
            'parameterSpecificationTypeName': 'Max'
          },
          '_links': {}
        }]
      },
      '_links': {}
    };
    spyOn(CreateRulesService.prototype, 'getSuperFutureBackDate').and.returnValue(of(response));
    component.setSuperUserFutureDateDays();
  });
  it('should call onFormKeypress ', () => {
    const event: any = {
      target: {
        value: '7Eeva4',
      }
    };
    component.onFormKeypress(event, 'chargeType');
  });
  it('should call onBlurArrivalGrace ', () => {
    const event: any = {
      target: {
        value: '7Eeva4',
      }
    };
    component.onBlurArrivalGrace(event);
  });

  it('should cal ruleLevelValidation', () => {
    component.createRuleModel.arrivalHeading = 'test';
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'averaging'
    };
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'free'
    };
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'suspend invoicing'
    };
    component.createRuleModel.selectedRuleType = {
      value: 1,
      label: 'notification'
    };
    component.ruleLevelValidation();
  });
  it('should call uils ', () => {
    const value = {
      value: 1,
      label: 'averaging'
    };
    const rulesForm = freeRuleBuilder.group({
      ruleType: [value, Validators.required],
        chargeType: [value, Validators.required],
        effectiveDate: ['2019-01-01', Validators.required],
        expirationDate: ['2019-01-01', Validators.required],
        ruleLevel: [value, Validators.required],
        groupName: [value, Validators.required]
    });
    component.createRuleModel.rulesForm = rulesForm;
    ratesOptionalAttributesComponent.optionalAttributesForm();
    const optionalField = freeRuleBuilder.group({
      businessUnit: [ {
        'financeBusinessUnitServiceOfferingAssociationID': 4,
        'chargeTypeBusinessUnitServiceOfferingAssociationID': 640,
        'financeBusinessUnitCode': 'DCS',
        'serviceOfferingDescription': 'Backhaul',
        'financeBusinessUnitServiceOfferingDisplayName': 'DCS - Backhaul'
      },
      {
        'financeBusinessUnitServiceOfferingAssociationID': 5,
        'chargeTypeBusinessUnitServiceOfferingAssociationID': 641,
        'financeBusinessUnitCode': 'DCS',
        'serviceOfferingDescription': 'Dedicated',
        'financeBusinessUnitServiceOfferingDisplayName': 'DCS - Dedicated'
      }],
      serviceLevel: [{
        'label': 'Premium',
        'value': 8
      },
      {
        'label': 'Standard',
        'value': 1
      }],
      requestedService: [['data']],
      equipmentCategory: [value],
      equipmentType: [value],
      equipmentLength: [value],
      carriers: [[{
        'label': 'Test Carrier 1 (TCR1)',
        'value': {
          'code': 'TCR1',
          'id': '101',
          'name': 'Test Carrier 1'
        }
      },
      {
        'label': 'Test Carrier 11 (TCR11)',
        'value': {
          'code': 'TCR11',
          'id': '1011',
          'name': 'Test Carrier 11'
        }
      }]],
      waived: [''],
      calculateRate: [''],
      passThrough: [''],
      rollUp: ['']
    });
    ratesOptionalAttributesComponent.optionalAttributesModel.optionalForm = optionalField;
    CreateRuleStandardUtilsService.onRefreshRatePostFramer(component.createRuleModel,
      ratesOptionalAttributesComponent.optionalAttributesModel);
  });
  it('should call BUSO uils ', () => {
    const value = {
      value: 1,
      label: 'averaging'
    };
    ratesOptionalAttributesComponent.optionalAttributesModel.serviceLevelValues = [{label: 'USD', value: 'USD'}];
    ratesOptionalAttributesComponent.optionalAttributesModel.serviceLevelResponse = [
      {
        'financeBusinessUnitServiceOfferingAssociation': {
          'financeBusinessUnitServiceOfferingAssociationID': 1,
          'financeBusinessUnitCode': 'JBT',
          'serviceOfferingCode': 'OTR',
          'effectiveTimestamp': '2016-01-01T00:00',
          'expirationTimestamp': '2199-12-31T23:59:59',
          'lastUpdateTimestampString': '2017-11-20T08:24:31.8980803'
        },
        'serviceLevelBusinessUnitServiceOfferingAssociationID': '1',
        'lastUpdateTimestampString': null,
        'serviceLevel': {
          'serviceLevelCode': 'Standard',
          'serviceLevelDescription': 'Standard',
        },
        '_links': {
          'self': {
            'href': 'https://pricing-test.jbhunt.com/referencedataservices/serviceLevelBusinessUnitServiceOfferingAssociations/1'
          },
          'serviceLevelBusinessUnitServiceOfferingAssociation': {
            'href': 'https://pricing-test.jbhunt.com/',
            'templated': true
          },
          'financeBusinessUnitServiceOfferingAssociation': {
            'href': 'https://pricing-test.jbhunt.com/referencedataservices/serviceLevelBusinessUnitServiceOfferingAssociation'
          }
        }
      }
    ];

    ratesOptionalAttributesComponent.optionalAttributesForm();
    const optionalField = freeRuleBuilder.group({
      businessUnit: [ [{
        'financeBusinessUnitServiceOfferingAssociationID': 1,
        'chargeTypeBusinessUnitServiceOfferingAssociationID': 640,
        'financeBusinessUnitCode': 'DCS',
        'serviceOfferingDescription': 'Backhaul',
        'financeBusinessUnitServiceOfferingDisplayName': 'DCS - Backhaul'
      },
      {
        'financeBusinessUnitServiceOfferingAssociationID': 5,
        'chargeTypeBusinessUnitServiceOfferingAssociationID': 641,
        'financeBusinessUnitCode': 'DCS',
        'serviceOfferingDescription': 'Dedicated',
        'financeBusinessUnitServiceOfferingDisplayName': 'DCS - Dedicated'
      }]],
      serviceLevel: [[{
        'label': 'Premium',
        'value': 8
      },
      {
        'label': 'Standard',
        'value': 1
      }]],
      requestedService: [['data']],
      equipmentCategory: [value],
      equipmentType: [value],
      equipmentLength: [value],
      carriers: [[{
        'label': 'Test Carrier 1 (TCR1)',
        'value': {
          'code': 'TCR1',
          'id': '101',
          'name': 'Test Carrier 1'
        }
      },
      {
        'label': 'Test Carrier 11 (TCR11)',
        'value': {
          'code': 'TCR11',
          'id': '1011',
          'name': 'Test Carrier 11'
        }
      }]],
      waived: [''],
      calculateRate: [''],
      passThrough: [''],
      rollUp: ['']
    });
    ratesOptionalAttributesComponent.optionalAttributesModel.optionalForm = optionalField;
    CreateRuleStandardUtilsService.iterateBusinessUnitValues(
      ratesOptionalAttributesComponent.optionalAttributesModel);
  });
  it('should call iterateRequestedService uils ', () => {
    const value = {
      value: 1,
      label: 'averaging'
    };
    ratesOptionalAttributesComponent.optionalAttributesForm();
    const optionalField = freeRuleBuilder.group({
      businessUnit: [ [{
        'financeBusinessUnitServiceOfferingAssociationID': 1,
        'chargeTypeBusinessUnitServiceOfferingAssociationID': 640,
        'financeBusinessUnitCode': 'DCS',
        'serviceOfferingDescription': 'Backhaul',
        'financeBusinessUnitServiceOfferingDisplayName': 'DCS - Backhaul'
      },
      {
        'financeBusinessUnitServiceOfferingAssociationID': 5,
        'chargeTypeBusinessUnitServiceOfferingAssociationID': 641,
        'financeBusinessUnitCode': 'DCS',
        'serviceOfferingDescription': 'Dedicated',
        'financeBusinessUnitServiceOfferingDisplayName': 'DCS - Dedicated'
      }]],
      serviceLevel: [[{
        'label': 'Premium',
        'value': 8
      },
      {
        'label': 'Standard',
        'value': 1
      }]],
      requestedService: [['data']],
      equipmentCategory: [value],
      equipmentType: [value],
      equipmentLength: [value],
      carriers: [[{
        'label': 'Test Carrier 1 (TCR1)',
        'value': {
          'code': 'TCR1',
          'id': '101',
          'name': 'Test Carrier 1'
        }
      },
      {
        'label': 'Test Carrier 11 (TCR11)',
        'value': {
          'code': 'TCR11',
          'id': '1011',
          'name': 'Test Carrier 11'
        }
      }]],
      waived: [''],
      calculateRate: [''],
      passThrough: [''],
      rollUp: ['']
    });
    ratesOptionalAttributesComponent.optionalAttributesModel.optionalForm = optionalField;
    CreateRuleStandardUtilsService.iterateRequestedService(
      ratesOptionalAttributesComponent.optionalAttributesModel);
  });
  it('should call uils else', () => {
    const value = {
      value: 1,
      label: 'averaging'
    };
    const rulesForm = freeRuleBuilder.group({
      ruleType: ['', Validators.required],
        chargeType: ['', Validators.required],
        effectiveDate: ['2019-01-01', Validators.required],
        expirationDate: ['2019-01-01', Validators.required],
        ruleLevel: ['', Validators.required],
        groupName: ['', Validators.required]
    });
    component.createRuleModel.rulesForm = rulesForm;
    ratesOptionalAttributesComponent.optionalAttributesForm();
    const optionalField = freeRuleBuilder.group({
      businessUnit: [''],
      requestedService: [['']],
      equipmentCategory: [''],
      equipmentType: [''],
      equipmentLength: [''],
      carriers: [''],
      waived: [''],
      calculateRate: [''],
      passThrough: [''],
      rollUp: ['']
    });
    ratesOptionalAttributesComponent.optionalAttributesModel.optionalForm = optionalField;
    CreateRuleStandardUtilsService.onRefreshRatePostFramer(component.createRuleModel,
      ratesOptionalAttributesComponent.optionalAttributesModel);
  });
  it('should call getRuleTypeValues', () => {
    const groupNameResponse = {
      '_embedded': {
          'accessorialGroupTypes': [
              {
                  '@id': 1,
                  'createTimestamp': '2019-06-18T01:02:28.3632436',
                  'createProgramName': 'SSIS',
                  'lastUpdateProgramName': 'SSIS',
                  'createUserId': 'PIDNEXT',
                  'lastUpdateUserId': 'PIDNEXT',
                  'accessorialGroupTypeId': 1,
                  'accessorialGroupTypeName': 'Standard',
                  'defaultIndicator': 'Y',
                  'effectiveDate': '2019-06-18',
                  'expirationDate': '2099-12-31',
                  'lastUpdateTimestampString': '2019-06-18T01:02:28.3632436',
                  '_links': {
                      'self': {
                          'href': ''
                      },
                      'accessorialGroupType': {
                          'href': ''
                      }
                  }
              }
          ]
      },
      '_links': {
          'self': {
              'href': '',
              'templated': true
          },
          'profile': {
              'href': ''
          }
      },
      'page': {
          'size': 20,
          'totalElements': 3,
          'totalPages': 1,
          'number': 0
      }
  };
    spyOn(CreateRulesService.prototype, 'getGroupNames').and.returnValues(of(groupNameResponse));
    CreateRuleStandardUtilsService.getGroupNames(component);
  });
  it('should cal onDropdownClick', () => {
    const response = {
      query: 'O'
    };
    component.createRuleModel.groupNameValues = [{ label: 'On', value: 12 }];
    CreateRuleStandardUtilsService.onTypeGroupNameUtil(response, component);
  });
  it('should cal onDropdownClickElse', () => {
    const response = {
      query: 'O'
    };
    component.createRuleModel.groupNameValues = [{ label: '123', value: 12 }];
    CreateRuleStandardUtilsService.onTypeGroupNameUtil(response, component);
  });
  it('should cal onDropdownClickElseLast', () => {
    component.createRuleModel.groupNameValues = null;
    CreateRuleStandardUtilsService.onTypeGroupNameUtil(null, component);
  });
  it('should call saveNotification cover utils', () => {
    spyOn(CreateRulesService.prototype, 'postRuleTypeData').and.returnValue(of({}));
    const keyValuepair = {
      value: '1',
      label: 'averaging'
    };
    component.appNotifyWhen.notifyWhenModel.notifyWhenForm = new FormGroup({
      frequency: new FormControl(keyValuepair, [Validators.required]),
      eventOccuranceTime: new FormControl(keyValuepair, [Validators.required]),
      accessorialNotificationRequiredTypes: new FormControl('Notification Required'),
      eventName: new FormControl(keyValuepair, [Validators.required]),
      timeframe: new FormControl(keyValuepair),
      batchTime: new FormControl([keyValuepair]),
      timeframeInput: new FormControl(keyValuepair)
    });
    component.appNotifyBy.notifyByModel.notifyByForm = new FormGroup({
      notificationType: new FormControl(keyValuepair, [Validators.required]),
      notifyByControl: new FormControl(keyValuepair),
      selectionCheckbox: new FormControl([{label: 'Email', value: 'Email'}], [Validators.required]),
      websiteDesc: new FormControl(keyValuepair, []),
      emailNotificationType: new FormControl(keyValuepair)
    });
    component.documentation.viewDocumentationModel = {
      legalTextArea: 'data',
      instructionalTextArea: 'data',
      attachments: ['file1', 'file2']
    };
    component.saveNotification();
  });
});


