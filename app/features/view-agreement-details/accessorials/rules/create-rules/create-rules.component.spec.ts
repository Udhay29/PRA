import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';

import { NotifyWhenComponent } from './../../../../shared/accessorials/notification/notify-when/notify-when.component';
import { NotifyByComponent } from './../../../../shared/accessorials/notification/notify-by/notify-by.component';
import { CreateRulesComponent } from './create-rules.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateDocumentationService } from '../../documentation/create-documentation/service/create-documentation.service';
import { of } from 'rxjs';
import { CreateRuleUtilityService } from './service/create-rule-utility.service';
import { CreateRulesService } from './service/create-rules.service';
import { By } from '@angular/platform-browser';
import { OptionalUtilityService } from '../../shared/services/optional-utility.service';
import { FreeRuleComponent } from '../free-rule/free-rule.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CreateRuleModel } from './model/create-rules.model';
import { invalid } from 'moment';
import { FreeEventTypeModel } from './../free-rule/free-event-type/model/free-event-type.model';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanDeactivateGuardService } from '../../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { EditRuleUtility } from './service/edit-rules-utility';
import { OptionalAttributesService } from '../../shared/services/optional-attributes.service';
import { AveragingRulesComponent } from './../../../../shared/accessorials/rule-shared/averaging-rules/averaging-rules.component';

describe('CreateRulesComponent', () => {
  let component: CreateRulesComponent;
  let fixture: ComponentFixture<CreateRulesComponent>;
  let freeRuleComponent: FreeRuleComponent;
  let freeRuleFixture: ComponentFixture<FreeRuleComponent>;
  let averagingRuleComponent: AveragingRulesComponent;
  let averagingRuleFixture: ComponentFixture<AveragingRulesComponent>;
  let notifyByComponent: NotifyByComponent;
  let editAccessorialNullResponse;
  let notifyByFixture: ComponentFixture<NotifyByComponent>;
  let notifyWhenComponent: NotifyWhenComponent;
  let notifyWhenFixture: ComponentFixture<NotifyWhenComponent>;
  let createDocumentationService: CreateDocumentationService;
  let createRuleUtilityService: CreateRuleUtilityService;
  let createRulesService: CreateRulesService;
  let optionalUtilityService: OptionalUtilityService;
  const freeRuleBuilder: FormBuilder = new FormBuilder();
  let freeRuleForm: FormGroup;
  let canDeactivateGuardService: CanDeactivateGuardService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;
  let agreemententDetailsResponse;
  let chargeTypeBasedBuResponse;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [CreateDocumentationService, CreateRuleUtilityService, CreateRulesService,
        OptionalUtilityService, CanDeactivateGuardService, { provide: APP_BASE_HREF, useValue: '/' },
        { provide: RouterStateSnapshot, useValue: CreateRulesComponent },
        { provide: ActivatedRouteSnapshot, useValue: CreateRulesComponent }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRulesComponent);
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
    createDocumentationService = fixture.debugElement.injector.get(CreateDocumentationService);
    createRuleUtilityService = fixture.debugElement.injector.get(CreateRuleUtilityService);
    createRulesService = fixture.debugElement.injector.get(CreateRulesService);
    optionalUtilityService = fixture.debugElement.injector.get(OptionalUtilityService);
    component.averagingRules = averagingRuleComponent;
    component.freeRuleTab = freeRuleComponent;
    component.appNotifyBy = notifyByComponent;
    component.appNotifyWhen = notifyWhenComponent;
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
    chargeTypeBasedBuResponse = [
      {
        'financeBusinessUnitServiceOfferingAssociationID': 7,
        'serviceOfferingCode': 'Brokerage',
        'serviceOfferingDescription': 'Brokerage',
        'transitModeId': null,
        'transitModeCode': null,
        'transitModeDescription': null,
        'financeBusinessUnitCode': 'ICS',
        'chargeTypeBusinessUnitServiceOfferingAssociationID': 708
      }
    ];
    component.createRuleModel.editAccessorialWholeResponse = {
      editRuleData: {
        'accessorialFreeRuleCalenderTypes': 'test',
        'accessorialFreeRuleEventTypes': 'test',
        'accessorialFreeRuleQuantityTypes': [{
          'accessorialFreeQuantity': 8888888,
          'accessorialFreeRuleQuantityTypeID': 2,
          'accessorialFreeRuleQuantityTypeName': 'Time',
          'customerAccessorialFreeRuleConfigurationID': 1153,
          'freeRuleQuantityDistanceTypeCode': null,
          'freeRuleQuantityDistanceTypeId': null,
          'freeRuleQuantityTimeTypeCode': 'Minute',
          'freeRuleQuantityTimeTypeId': 18,
          'requestedDeliveryDateIndicator': 'No'
        }],
        'accessorialFreeRuleTypeId': 3,
        'accessorialFreeRuleTypeName': 'Quantity',
        'billToAccounts': null,
        'carriers': [{
          'customerAccessorialCarrierId': null,
          'carrierId': 70,
          'carrierName': 'A A A COOPER TRANSPORTATION',
          'carrierCode': 'AAA0'
        }],
        'chargeTypeCode': 'CUSTOMSFEE',
        'chargeTypeId': 48,
        'chargeTypeName': 'Border Crossing Fee',
        'contracts': [{
          'contractTypeID': 1,
          'contractTypeName': 'Legal',
          'customerAgreementContractID': 86,
          'customerContractName': 'test',
          'customerContractNumber': '123rest',
          'effectiveDate': '2019-05-28',
          'expirationDate': '2099-12-31'
        }],
        'customerAccessorialFreeRuleConfigurationId': 584,
        'customerAccessorialText': {
          'customerAccessorialDocumentTextId': null,
          'text': null,
          'textName': null
        },
        'customerAgreementId': 11,
        'documentationType': 'legal',
        'documentationTypeId': null,
        'effectiveDate': '08/05/2019 00:00',
        'equipmentCategoryCode': null,
        'equipmentCategoryDescription': null,
        'equipmentLength': null,
        'equipmentLengthDescription': null,
        'equipmentLengthId': null,
        'equipmentType': null,
        'equipmentTypeId': null,
        'expirationDate': '12/31/2099 00:00',
        'lastUpdateProgramName': 'Poonam (jisapb0)',
        'lastUpdateTimestamp': '2019-08-05T09:45:47.029',
        'level': 'Section',
        'modifiedUsing': 'Process ID',
        'pricingAveragePeriodTypeId': 3,
        'pricingAveragePeriodTypeName': 'Free',
        'requestServices': null,
        'sections': [{
          'currencyCode': undefined,
          'customerAgreementContractSectionID': 87,
          'customerAgreementContractSectionName': 'etstts',
          'customerAgreementContractTypeName': null,
          'customerContractID': 86,
          'customerContractName': 'test',
          'customerContractNumber': '123rest',
          'effectiveDate': '06/16/2019',
          'expirationDate': '12/31/2099',
          'isChecked': false,
          'status': 'Active'
        }],
        'serviceLevelBusinessUnitServiceOfferings': null,
        'status': 'Active'
      }
    };

    editAccessorialNullResponse = {
      editRuleData: {
        'accessorialFreeRuleCalenderTypes': 'test',
        'accessorialFreeRuleEventTypes': 'test',
        'accessorialFreeRuleQuantityTypes': [{
          'accessorialFreeQuantity': 8888888,
          'accessorialFreeRuleQuantityTypeID': 2,
          'accessorialFreeRuleQuantityTypeName': 'Time',
          'customerAccessorialFreeRuleConfigurationID': 1153,
          'freeRuleQuantityDistanceTypeCode': null,
          'freeRuleQuantityDistanceTypeId': null,
          'freeRuleQuantityTimeTypeCode': 'Minute',
          'freeRuleQuantityTimeTypeId': 18,
          'requestedDeliveryDateIndicator': 'No'
        }],
        'accessorialFreeRuleTypeId': 3,
        'accessorialFreeRuleTypeName': 'Quantity',
        'billToAccounts': null,
        'carriers': [{
          'customerAccessorialCarrierId': null,
          'carrierId': 70,
          'carrierName': 'A A A COOPER TRANSPORTATION',
          'carrierCode': 'AAA0'
        }],
        'chargeTypeCode': 'CUSTOMSFEE',
        'chargeTypeId': 48,
        'chargeTypeName': 'Border Crossing Fee',
        'contracts': [{
          'contractTypeID': 1,
          'contractTypeName': 'Legal',
          'customerAgreementContractID': 86,
          'customerContractName': 'test',
          'customerContractNumber': '123rest',
          'effectiveDate': '2019-05-28',
          'expirationDate': '2099-12-31'
        }],
        'customerAccessorialFreeRuleConfigurationId': 584,
        'customerAccessorialText': {
          'customerAccessorialDocumentTextId': null,
          'text': null,
          'textName': null
        },
        'customerAgreementId': 11,
        'documentationType': 'legal',
        'documentationTypeId': null,
        'effectiveDate': '08/05/2019 00:00',
        'equipmentCategoryCode': null,
        'equipmentCategoryDescription': null,
        'equipmentLength': null,
        'equipmentLengthDescription': null,
        'equipmentLengthId': null,
        'equipmentType': null,
        'equipmentTypeId': null,
        'expirationDate': '12/31/2099 00:00',
        'lastUpdateProgramName': 'Poonam (jisapb0)',
        'lastUpdateTimestamp': '2019-08-05T09:45:47.029',
        'level': 'Section',
        'modifiedUsing': 'Process ID',
        'pricingAveragePeriodTypeId': 3,
        'pricingAveragePeriodTypeName': 'Free',
        'requestServices': null,
        'sections': [{
          'currencyCode': undefined,
          'customerAgreementContractSectionID': 87,
          'customerAgreementContractSectionName': 'etstts',
          'customerAgreementContractTypeName': null,
          'customerContractID': 86,
          'customerContractName': 'test',
          'customerContractNumber': '123rest',
          'effectiveDate': '06/16/2019',
          'expirationDate': '12/31/2099',
          'isChecked': false,
          'status': 'Active'
        }],
        'serviceLevelBusinessUnitServiceOfferings': null,
        'status': 'Active'
      }
    };
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
  agreemententDetailsResponse = {
    'agreementID': 48,
    'agreementDefaultAmount': 100000,
    'agreementEffectiveDate': '1995-01-01',
    'agreementExpirationDate': '2099-12-31',
    'customerContractDetailDTO': null,
    'customerSectionDetailDTO': null
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
  it('should call createRulesForm', () => {
    component.createRulesForm();
  });

  it('should call setAgreementLevelDate', () => {
    spyOn(CreateDocumentationService.prototype, 'getAgreementLevelDate').and.returnValue(of(dateResponse));
    component.setAgreementLevelDate();
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
    spyOn(CreateDocumentationService.prototype, 'getChargeTypes').and.returnValue(of(chargeTypeResponse));
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
    component.contract = ['abc'];
    component.onCancelAccessorialRule();
  });

  it('should call onCancelAccessorialRule for else if', () => {
    component.section = ['abc'];
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

  it('should call checkContractSection', () => {
    component.checkContractSection('contract');
    component.checkContractSection('section');
  });
  it('should call contractListCheck', () => {
    const contractValue = [{
      customerAgreementContractID: 1,
      customerContractName: 'string',
      customerContractNumber: 'string',
      contractTypeID: 1,
      contractTypeName: 'string',
      effectiveDate: 'string',
      expirationDate: 'string',
      isChecked: true
    }];
    const sectionValue = [{
      customerAgreementContractSectionID: 1,
      customerAgreementContractSectionName: 'string',
      customerAgreementContractID: 1,
      customerContractName: 'string',
      customerContractNumber: 'string',
      contractTypeName: 'string',
      effectiveDate: 'string',
      expirationDate: 'string',
      isChecked: true,
      currencyCode: 'string'
    }];
    component.createRuleModel.selectedContractValue = contractValue;
    component.createRuleModel.selectedSectionValue = sectionValue;
    component.contractListCheck();
    component.sectionListCheck();
    component.getContractDetails(contractValue);
    component.getsectionDetails(sectionValue);
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
  it('should call checkContractValidity', () => {
    component.createRuleModel.selectedRuleLevel = 'contract';
    const parentComponent = {
      contractListModel: {
        selectedContract: {
          value: 'contract'
        }
      }
    };
    component.checkContractValidity(false);
  });

  it('should call checkSectionValidity', () => {
    const sectionComponent = {
      sectionsModel: {
        dataSelected: {
          value: {
            status: 'Inactive'
          }
        }
      }
    };
    sectionComponent.sectionsModel.dataSelected.value.status = 'Inactive';
    component.checkSectionValidity(false);
  });
  it('should call checkBillToValidity', () => {
    const billToComponent = {
      billToModel: {
        dataSelected: {
          value: {
            status: 'Inactive'
          }
        }
      }
    };
    billToComponent.billToModel.dataSelected.value.status = 'Inactive';
    component.checkBillToValidity(false);
  });
  it('should call invalidSelections', () => {
    component.invalidSelections();
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
  it('it should call EditRuleUtility.setValuesToAccessorialRuleForm', () => {
    EditRuleUtility.setValuesToAccessorialRuleForm(component.createRuleModel.editAccessorialWholeResponse.editRuleData,
      component.createRuleModel,
      component.optionalFields['optionalAttributesModel'], component.optionalFields, component, component.documentation);
  });
  it('shoul call EditRuleUtility.dateFormatter', () => {
    expect(EditRuleUtility.dateFormatter('1995-01-01')).toBe('01/01/1995');
  });
  it('it should call EditRuleUtility.setAgreementLevelDate', () => {
    spyOn(CreateDocumentationService.prototype, 'getAgreementLevelDate').and.returnValues(of(agreemententDetailsResponse));
    EditRuleUtility.setAgreementLevelDate(component);
  });
  it('it should call EditRuleUtility.populateAgreementLevelData', () => {
    EditRuleUtility.populateAgreementLevelData(agreemententDetailsResponse, component);
    component.createRuleModel.agreementEffectiveDate =
      component.createRuleModel.effectiveDate;
    component.createRuleModel.agreementEndDate = component.createRuleModel.expirationDate;
  });
  it('it should call EditRuleUtility.populateAgreementLevelelse', () => {
    EditRuleUtility.populateAgreementLevelData(null, component);
  });
  it('it should call EditRuleUtility.getBUbasedOnChargeType', () => {
    spyOn(CreateRulesService.prototype, 'getBUbasedOnChargeType').and.returnValues(of(chargeTypeBasedBuResponse));
    EditRuleUtility.getBUbasedOnChargeType(2, component, component.createRuleModel.editAccessorialWholeResponse.editRuleData,
      component.optionalFields.optionalAttributesModel, component.optionalFields, component.documentation);
  });
  it('it should call EditRuleUtility.getBUbasedOnChargeType', () => {
    spyOn(CreateRulesService.prototype, 'getBUbasedOnChargeType').and.returnValues(of(chargeTypeBasedBuResponse));
    EditRuleUtility.getBUbasedOnChargeType(2, component, editAccessorialNullResponse.editRuleData,
      component.optionalFields.optionalAttributesModel, component.optionalFields, component.documentation);
  });

  it('should call validateContractSection optionalUtilityService.isContractSelected for else', () => {
    component.createRuleModel.rulesForm.get('ruleLevel').setValue('contract');
    component.createRuleModel.selectedRuleLevel = 'contract';
    fixture.detectChanges();
    component.validateContractSection();
  });

  it('should call validateContractSection optionalUtilityService.isContractSelected for if', () => {
    component.createRuleModel.rulesForm.get('ruleLevel').setValue('contract');
    component.createRuleModel.selectedRuleLevel = 'contract';
    fixture.detectChanges();
    component.contract.contractListModel.selectedContract = ['test'];
    component.validateContractSection();
  });

  it('should call validateContractSection optionalUtilityService.isSectionSelected for else', () => {
    component.createRuleModel.rulesForm.get('ruleLevel').setValue('section');
    component.createRuleModel.selectedRuleLevel = 'section';
    fixture.detectChanges();
    component.validateContractSection();
  });

  it('should call validateContractSection optionalUtilityService.isSectionSelected for if', () => {
    component.createRuleModel.rulesForm.get('ruleLevel').setValue('section');
    component.createRuleModel.selectedRuleLevel = 'section';
    fixture.detectChanges();
    component.section.sectionsModel.selectedSection = ['test'];
    component.validateContractSection();
  });

  it('should call optionalUtilityService.validateOptionalFields for if', () => {
    component.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.setErrors({ 'incorrect': true });
    fixture.detectChanges();
    component.onValidateForm(false);
  });

  it('it should call EditRuleUtility.setBusinessUnitServiceOfferingValues', () => {
    EditRuleUtility.setBusinessUnitServiceOfferingValues(chargeTypeBasedBuResponse,
      component.createRuleModel.editAccessorialWholeResponse.editRuleData, component.optionalFields, component);
  });
  it('it should call EditRuleUtility.setBusinessUnitServiceOfferingValueselse', () => {
    const editRule = {
      serviceLevelBusinessUnitServiceOfferings: null
    };
    EditRuleUtility.setBusinessUnitServiceOfferingValues(chargeTypeBasedBuResponse,
      editRule, component.optionalFields, component);
  });
  it('it should call EditRuleUtility.setBusinessUnitServiceOfferingValueselse', () => {
    const editRule = {
      serviceLevelBusinessUnitServiceOfferings: null
    };
    EditRuleUtility.setBusinessUnitServiceOfferingValues(chargeTypeBasedBuResponse,
      editRule, component.optionalFields, component);
  });
  it('it should call EditRuleUtility.setBusinessUnitServiceOfferingValues', () => {
    component.createRuleModel.editAccessorialWholeResponse = {
      'serviceLevelBusinessUnitServiceOfferings': null
    };
    EditRuleUtility.setBusinessUnitServiceOfferingValues(chargeTypeBasedBuResponse,
      component.createRuleModel.editAccessorialWholeResponse, component.optionalFields, component);
  });
  it('it should call EditRuleUtility.setValuesForEquipments', () => {
    const editRuleDataResponse = {
      editRuleData: {
        'equipmentCategoryCode': 'Chassis',
        'equipmentTypeDescription': 'x',
        'equipmentLengthId': 95,
        'equipmentLength': 44,
        'equipmentTypeId': null,
        'equipmentLengthDescription': 'Feet'
      }
    };
    EditRuleUtility.setValuesForEquipments(editRuleDataResponse.editRuleData,
      component.optionalFields.optionalAttributesModel, component.optionalFields);
  });

  it('it should call EditRuleUtility.checkRulesLevel', () => {
    component.createRuleModel.editAccessorialWholeResponse.editRuleData.level = 'Agreement';
    EditRuleUtility.checkRulesLevel(component.createRuleModel.editAccessorialWholeResponse.editRuleData, component.createRuleModel);
    component.createRuleModel.editAccessorialWholeResponse.editRuleData.level = 'Contract';
    EditRuleUtility.checkRulesLevel(component.createRuleModel.editAccessorialWholeResponse.editRuleData, component.createRuleModel);
    component.createRuleModel.editAccessorialWholeResponse.editRuleData.level = 'Section';
    component.createRuleModel.editAccessorialWholeResponse.editRuleData.section = ['abc', 'abc'];
    component.createRuleModel.editAccessorialWholeResponse.editRuleData.sectionAccounts = ['abc', 'abc'];
    EditRuleUtility.checkRulesLevel(component.createRuleModel.editAccessorialWholeResponse.editRuleData, component.createRuleModel);
  });
  it('it should call EditRuleUtility.setContractLevel', () => {
    component.createRuleModel.editAccessorialWholeResponse.editRuleData.level = 'Section';
    component.createRuleModel.editAccessorialWholeResponse.editRuleData.contracts = ['abc', 'abc'];
    component.createRuleModel.editAccessorialWholeResponse.editRuleData.sectionAccounts = ['abc', 'abc'];
    EditRuleUtility.setContractLevel(component.createRuleModel.editAccessorialWholeResponse.editRuleData, component.createRuleModel);
  });
  it('it should call EditRuleUtility.setServiceLevelDocumentValues', () => {
    const serviceLevelResponse = {
      '_embedded': {
        'serviceLevelBusinessUnitServiceOfferingAssociations': [{
          'financeBusinessUnitServiceOfferingAssociation': {
            'financeBusinessUnitServiceOfferingAssociationID': 9,
            'financeBusinessUnitCode': 'ICS',
            'serviceOfferingCode': 'Reefer',
            'effectiveTimestamp': '2016-01-01T00:00',
            'expirationTimestamp': '2199-12-31T23:59:59',
            'lastUpdateTimestampString': '2017-11-20T08:24:31.902075'
          },
          'serviceLevelBusinessUnitServiceOfferingAssociationID': 4,
          'serviceLevel': {
            'serviceLevelCode': 'Standard',
            'serviceLevelDescription': 'Standard',
            'lastUpdateTimestampString': '2017-11-20T08:24:32.0530913'
          }
        }]
      }
    };
    spyOn(OptionalAttributesService.prototype,
      'getServiceLevel').and.returnValues(of(serviceLevelResponse));
    EditRuleUtility.setServiceLevelDocumentValues(component, component.createRuleModel.editAccessorialWholeResponse.editRuleData,
      [2, 3, 4, 5], [], component.optionalFields);
  });

  it('should cal EditRuleUtility.setLegalDocValues', () => {
    component.createRuleModel.refreshDocumentResponse = [{
      'property': 'string'
    }, {
      'property': 'string'
    }];
    EditRuleUtility.setLegalDocValues(component);
  });

  it('should cal EditRuleUtility SetRuleType Quantity Form', () => {
    EditRuleUtility.setRuleTypeForm(component.createRuleModel.editAccessorialWholeResponse.editRuleData, component);
  });

  it('should cal EditRuleUtility SetRuleType Calendar Monthly Form', () => {
    component.createRuleModel.editAccessorialWholeResponse.editRuleData = {
      'customerAccessorialFreeRuleConfigurationId' : 1480,
      'pricingAveragePeriodTypeId' : 3,
      'pricingAveragePeriodTypeName' : 'Free',
      'accessorialFreeRuleTypeId' : 1,
      'accessorialFreeRuleTypeName' : 'Calendar',
      'accessorialFreeRuleQuantityTypes' : null,
      'accessorialFreeRuleEventTypes' : null,
      'accessorialFreeRuleCalenderTypes' : {
        'customerAccessorialFreeRuleConfigurationId' : 1480,
        'customerAccessorialFreeRuleCalendarId' : 525,
        'accessorialFreeRuleCalendarTypeName' : 'Relative',
        'accessorialFreeRuleCalendarTypeId' : 3,
        'accessorialFreeRuleCalendarApplyTypeName' : 'Always',
        'accessorialFreeRuleEventTypeName' : null,
        'accessorialFreeRuleEventTypeId' : null,
        'accessorialFreeRuleCalendarApplyTypeId' : 1,
        'pricingAveragePeriodTypeName' : 'Monthly',
        'calendarYear' : null,
        'calendarDayDescription' : null,
        'pricingAveragePeriodTypeId' : 2,
        'firstDayChargeableIndicator' : 'False',
        'firstDayChargeableIndicatorES' : null,
        'customerAccessorialFreeRuleCalendarWeekDay' : [ {
          'customerAccessorialFreeRuleCalendarWeekDayId' : 340,
          'customerAccessorialFreeRuleCalendarId' : null,
          'calendarWeekDay' : 'Sunday',
          'pricingAveragePeriodTypeId' : null,
          'pricingAveragePeriodTypeName' : null,
          'accessorialFreeRuleCalendarTypeId' : null,
          'accessorialFreeRuleCalendarTypeName' : null
        } ],
        'customerAccessorialFreeRuleCalendarMonth' : [ {
          'customerAccessorialFreeRuleCalendarMonthId' : 325,
          'customerAccessorialFreeRuleCalendardId' : null,
          'calendarMonth' : 'January',
          'customerAccessorialFreeRuleCalendarDay' : [ ],
          'pricingAveragePeriodTypeId' : null,
          'pricingAveragePeriodTypeName' : null,
          'accessorialFreeRuleCalendarTypeId' : null,
          'accessorialFreeRuleCalendarTypeName' : null
        } ],
        'customerAccessorialFreeRuleCalendarDayOccurrences' : [ {
          'accessorialFrequencyTypeId' : 1,
          'accessorialFrequencyTypeName' : 'First',
          'effectiveDate' : null,
          'expirationDate' : null,
          'pricingAveragePeriodTypeId' : null,
          'pricingAveragePeriodTypeName' : null,
          'accessorialFreeRuleCalendarTypeId' : null,
          'accessorialFreeRuleCalendarTypeName' : null
        } ]
      }
    };
    EditRuleUtility.setRuleTypeForm(component.createRuleModel.editAccessorialWholeResponse.editRuleData, component);
  });
  it('should cal EditRuleUtility SetRuleType Calendar Monthly Form', () => {
    component.createRuleModel.editAccessorialWholeResponse.editRuleData = {
      'customerAccessorialFreeRuleConfigurationId' : 1480,
      'pricingAveragePeriodTypeId' : 3,
      'pricingAveragePeriodTypeName' : 'Free',
      'accessorialFreeRuleTypeId' : 1,
      'accessorialFreeRuleTypeName' : 'Calendar',
      'accessorialFreeRuleQuantityTypes' : null,
      'accessorialFreeRuleEventTypes' : null,
      'accessorialFreeRuleCalenderTypes' : {
        'customerAccessorialFreeRuleConfigurationId' : 1480,
        'customerAccessorialFreeRuleCalendarId' : 525,
        'accessorialFreeRuleCalendarTypeName' : 'Relative',
        'accessorialFreeRuleCalendarTypeId' : 3,
        'accessorialFreeRuleCalendarApplyTypeName' : 'Always',
        'accessorialFreeRuleEventTypeName' : null,
        'accessorialFreeRuleEventTypeId' : null,
        'accessorialFreeRuleCalendarApplyTypeId' : 1,
        'pricingAveragePeriodTypeName' : 'Monthly',
        'calendarYear' : null,
        'calendarDayDescription' : null,
        'pricingAveragePeriodTypeId' : 2,
        'firstDayChargeableIndicator' : 'False',
        'firstDayChargeableIndicatorES' : null,
        'customerAccessorialFreeRuleCalendarWeekDay' : [ {
          'customerAccessorialFreeRuleCalendarWeekDayId' : 340,
          'customerAccessorialFreeRuleCalendarId' : null,
          'calendarWeekDay' : 'Sunday',
          'pricingAveragePeriodTypeId' : null,
          'pricingAveragePeriodTypeName' : null,
          'accessorialFreeRuleCalendarTypeId' : null,
          'accessorialFreeRuleCalendarTypeName' : null
        } ],
        'customerAccessorialFreeRuleCalendarMonth' : [ {
          'customerAccessorialFreeRuleCalendarMonthId' : 325,
          'customerAccessorialFreeRuleCalendardId' : null,
          'calendarMonth' : 'January',
          'customerAccessorialFreeRuleCalendarDay' : [ ],
          'pricingAveragePeriodTypeId' : null,
          'pricingAveragePeriodTypeName' : null,
          'accessorialFreeRuleCalendarTypeId' : null,
          'accessorialFreeRuleCalendarTypeName' : null
        } ],
        'customerAccessorialFreeRuleCalendarDayOccurrences' : [ {
          'accessorialFrequencyTypeId' : 1,
          'accessorialFrequencyTypeName' : 'First',
          'effectiveDate' : null,
          'expirationDate' : null,
          'pricingAveragePeriodTypeId' : null,
          'pricingAveragePeriodTypeName' : null,
          'accessorialFreeRuleCalendarTypeId' : null,
          'accessorialFreeRuleCalendarTypeName' : null
        } ]
      }
    };
    EditRuleUtility.setRuleTypeForm(component.createRuleModel.editAccessorialWholeResponse.editRuleData, component);
  });

  it('should cal EditRuleUtility SetRuleType Event  Form', () => {
    component.createRuleModel.editAccessorialWholeResponse.editRuleData = {
      'customerAccessorialFreeRuleConfigurationId' : 790,
      'pricingAveragePeriodTypeId' : 3,
      'pricingAveragePeriodTypeName' : 'Free',
      'accessorialFreeRuleTypeId' : 2,
      'accessorialFreeRuleTypeName' : 'Event',
      'accessorialFreeRuleQuantityTypes' : null,
      'accessorialFreeRuleEventTypes' : {
        'customerAccessorialFreeRuleConfigurationID' : 790,
        'accessorialFreeRuleEventTypeID' : 2,
        'accessorialFreeRuleTypeName' : 'Drop',
        'accessorialFreeRuleEventTimeframeTypeID' : 2,
        'accessorialFreeRuleEventTimeFrameTypeName' : 'Day of Event and Day After',
        'accessorialDayOfEventFreeRuleModifierId' : 2,
        'accessorialDayOfEventFreeRuleModifierName' : 'Day Free if Event Time After',
        'accessorialDayOfEventFreeRuleModifierTime' : '1970-01-01 06:49:57.0',
        'accessorialDayAfterEventFreeRuleModifierId' : 2,
        'accessorialDayAfterEventFreeRuleModifierName' : 'Day Free if Event Time After',
        'accessorialDayAfterEventFreeRuleModifierTime' : '1970-01-01 17:50:13.0'
      },
      'accessorialFreeRuleCalenderTypes' : null
    };
    EditRuleUtility.setRuleTypeForm(component.createRuleModel.editAccessorialWholeResponse.editRuleData, component);
  });
});
