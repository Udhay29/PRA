import { AddStairStepComponent } from './../../../../shared/accessorials/stair-step/add-stair-step/add-stair-step.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from './../../../../../app.module';
import { StandardModule } from '../../../standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { CreateStandardRateComponent } from './create-standard-rate.component';
import { CreateStandardRateService } from './service/create-standard-rate.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

import { CreateStandardRateUtilityService } from './service/create-rate-utility.service';
import { RateSetupComponent } from './rate-setup/rate-setup.component';
import { AddRatesComponent } from './add-rates/add-rates.component';
import { RatesOptionalAttributesComponent } from './rates-optional-attributes/rates-optional-attributes.component';
import { CanDeactivateGuardService } from '../../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

describe('CreateStandardDocumentationComponent', () => {
  let component: CreateStandardRateComponent;
  let rateSetupComponent: RateSetupComponent;
  let addRateComponent: AddRatesComponent;
  let addStairStepComponent: AddStairStepComponent;
  let optionalAttribute: RatesOptionalAttributesComponent;
  let fixture: ComponentFixture<CreateStandardRateComponent>;
  let fixtureRateSetupComponent: ComponentFixture<RateSetupComponent>;
  let fixtureaddRateComponent: ComponentFixture<AddRatesComponent>;
  let fixtureaddStairStepComponent: ComponentFixture<AddStairStepComponent>;
  let fixtureOptionalRateComponent: ComponentFixture<RatesOptionalAttributesComponent>;
  let createRateService: CreateStandardRateService;
  let createStandardRateUtilityService: CreateStandardRateUtilityService;
  const formBuilder: FormBuilder = new FormBuilder();
  let rateFormGroup: FormGroup;
  const addRateFormBuilder: FormBuilder = new FormBuilder();
  let addRateFormGroup: FormGroup;
  let addStairStepRatesform: FormGroup;
  const optionalRateFormBuilder: FormBuilder = new FormBuilder();
  let optionalRateFormGroup: FormGroup;
  const rateSetUpFormBuilder: FormBuilder = new FormBuilder();
  let rateSetUpFormGroup: FormGroup;
  let canDeactivateGuardService: CanDeactivateGuardService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [CreateStandardRateService, CreateStandardRateUtilityService, { provide: APP_BASE_HREF, useValue: '/' },
       CanDeactivateGuardService,
        { provide: RouterStateSnapshot, useValue: CreateStandardRateComponent },
        { provide: ActivatedRouteSnapshot, useValue: CreateStandardRateComponent }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStandardRateComponent);
    component = fixture.componentInstance;
    fixtureRateSetupComponent = TestBed.createComponent(RateSetupComponent);
    rateSetupComponent = fixtureRateSetupComponent.componentInstance;
    fixtureaddRateComponent = TestBed.createComponent(AddRatesComponent);
    fixtureaddStairStepComponent = TestBed.createComponent(AddStairStepComponent);
    addRateComponent = fixtureaddRateComponent.componentInstance;
    addStairStepComponent = fixtureaddStairStepComponent.componentInstance;
    fixtureOptionalRateComponent = TestBed.createComponent(RatesOptionalAttributesComponent);
    optionalAttribute = fixtureOptionalRateComponent.componentInstance;
    canDeactivateGuardService = TestBed.get(CanDeactivateGuardService);
    route = TestBed.get(ActivatedRouteSnapshot);
    state = TestBed.get(RouterStateSnapshot);
    nextState = TestBed.get(RouterStateSnapshot);
    fixture.detectChanges();
    createRateService = TestBed.get(CreateStandardRateService);
    createStandardRateUtilityService = TestBed.get(CreateStandardRateUtilityService);
    const amountPattern = '[-0-9., ]*';
    rateFormGroup = formBuilder.group({
      quantity: ['5', [Validators.pattern(amountPattern)]],
      quantityType: ['Hour', Validators.required],
      alternateChargeType: ['BOBTAIL']
    });
    addRateFormGroup = addRateFormBuilder.group({
      rates: new FormArray([new FormGroup({
        rateType: new FormControl(''),
        rateAmount: new FormControl('1', [Validators.pattern(amountPattern)]),
        minAmount: new FormControl('2', [Validators.pattern(amountPattern)]),
        maxAmount: new FormControl('3', [Validators.pattern(amountPattern)]),
        rounding: new FormControl('Down', [])
      }), new FormGroup({
        rateType: new FormControl(''),
        rateAmount: new FormControl('1', [Validators.pattern(amountPattern)]),
        minAmount: new FormControl('2', [Validators.pattern(amountPattern)]),
        maxAmount: new FormControl('3', [Validators.pattern(amountPattern)]),
        rounding: new FormControl('Down', [])
      })
      ]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    addStairStepRatesform = formBuilder.group({
      rateType: new FormControl('', [Validators.required]),
      minAmount: new FormControl('2'),
      maxAmount: new FormControl('4'),
      rounding: new FormControl('Down', []),
      maxApplidedWhen: new FormControl('Steps Are Exceeded'),
      itemizeRates: new FormControl(false),
      stepsArray: new FormArray([new FormGroup({
        step: new FormControl('1', [Validators.required]),
        fromQuantity: new FormControl('2', [Validators.required]),
        toQuantity: new FormControl('4', [Validators.required]),
        rateAmount: new FormControl('2.00', [Validators.pattern(amountPattern)])
      }),
      new FormGroup({
        step: new FormControl('2', [Validators.required]),
        fromQuantity: new FormControl('5', [Validators.required]),
        toQuantity: new FormControl('7', [Validators.required]),
        rateAmount: new FormControl('5.00', [Validators.pattern(amountPattern)])
      })
      ])
    });
    optionalRateFormGroup = optionalRateFormBuilder.group({
      businessUnit: ['ICS'],
      serviceLevel: ['', Validators.required],
      requestedService: ['', Validators.required],
      equipmentCategory: [{ value: 'test' }],
      equipmentType: [{ value: 'test' }],
      equipmentLength: [{ value: 'test', id: 1 }],
      carriers: [[]],
      waived: [''],
      calculateRate: [''],
      passThrough: [''],
      rollUp: ['']
    });
    rateSetUpFormGroup = rateSetUpFormBuilder.group({
      effectiveDate: ['08/09/2019', Validators.required],
      expirationDate: ['08/09/2019', Validators.required],
      groupName: [{ label: 'test', value: 'test' }, Validators.required],
      chargeType: [{ label: 'test', value: 'test' }, Validators.required],
      customerName: ['ggg'],
      currency: [{ value: 'test' }, Validators.required],
      waived: ['true'],
      calculateRate: ['true'],
      passThrough: ['true'],
      rollUp: ['true']
    });
    component.createRatesModel.ratesForm = rateFormGroup;
    fixture.detectChanges();
  });
  const quantityResponse = {
    '_embedded': {
      'accessorialRateAlternateChargeQuantityTypes': [{
        '@id': 1,
        'createTimestamp': '2019-05-24T14:32:06.0908071',
        'createProgramName': 'SSIS',
        'lastUpdateProgramName': 'SSIS',
        'createUserId': 'PIDNEXT',
        'lastUpdateUserId': 'PIDNEXT',
        'accessorialRateChargeQuantityTypeName': 'HOUR',
        'effectiveDate': '2019-05-24',
        'expirationDate': '2099-12-31',
        'lastUpdateTimestampString': '2019-05-24T14:32:06.0908071',
        '_links': {}
      }]
    },
    '_links': {},
    'page': {
      'size': 50,
      'totalElements': 5,
      'totalPages': 1,
      'number': 0
    }
  };
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call busoselect', () => {
    component.rateSetup.createRatesModel.setUpForm = rateSetUpFormGroup;
    component.busoselect([1]);
    component.rateSetup.createRatesModel.setUpForm.controls['chargeType'].setValue('Bobtail');
    component.busoselect([1]);
  });
  it('should call getQuantityTypeValues', () => {
    spyOn(createRateService, 'getQuantityType').and.returnValues(of(quantityResponse));
    component.getQuantityTypeValues();
  });
  it('it should call onTypeQuantityType', () => {
    const event = { query: 'b' };
    component.createRatesModel.alternateChargeQuantity = [{
      label: 'BOBTAIL',
      value: 1
    }];
    expect(component.createRatesModel.alternateChargeQuantity).toBeDefined();
    component.onTypeQuantityType(event);
    expect(component.onTypeQuantityType).toBeTruthy();
  });
  it('it should call onTypeAlternateChargeType', () => {
    const event = { query: 'b' };
    component.createRatesModel.alternateChargeType = [{
      label: 'BOBTAIL',
      value: 1,
      description: 'BOBTAIL'
    }];
    expect(component.createRatesModel.alternateChargeType).toBeDefined();
    component.onTypeAlternateChargeType(event);
    expect(component.onTypeAlternateChargeType).toBeTruthy();
  });
  it('it should call onQuantityBlur', () => {
    component.createRatesModel.ratesForm = rateFormGroup;
    spyOn(createStandardRateUtilityService, 'formatAmount').and.returnValues(of('5'));
    component.onQuantityBlur('5');
    component.onQuantityBlur('');
  });
  it('it should call onQuantityBlur', () => {
    component.createRatesModel.ratesForm = rateFormGroup;
    spyOn(createStandardRateUtilityService, 'formatAmount').and.returnValues(of('5'));
    component.onQuantityBlur('5');
    component.onQuantityBlur('');
  });
  it('it should call onselect alternativechargetype', () => {
    const event = {
      label: 'quantity',
      value: 2,
      description: 'desc'
    };
    component.onSelectAlternateChargeType(event);
    expect(component.onSelectAlternateChargeType).toBeTruthy();
    component.setFormValidators('quantity');
    expect(component.setFormValidators).toBeTruthy();
    component.setFormValidators('quantityType');
  });
  it('it should call  onSelectQuantityType', () => {
    const event = {
      label: 'value',
      value: 2
    };
    component.onSelectQuantityType(event);
    expect(component.onSelectQuantityType).toBeTruthy();
  });
  it('it should call  savePopupYes', () => {
    const response = {
      customerAccessorialDocumentConfigurationId: 1,
      effectiveDate: '30/12/2019',
      expirationDate: '30/12/2099',
      customerAgreementId: 1,
      chargeTypeId: 1,
      chargeTypeName: 'Bobtail',
      currencyCode: 'USD',
      equipmentCategoryCode: 'Chassis',
      equipmentTypeCode: 'Chassis',
      equipmentLengthId: 1,
      equipmentTypeId: 1,
      customerAgreementContractSectionAccountsDTOs: [{
        customerAccessorialAccountId: null,
        customerAgreementContractSectionId: 1,
        customerAgreementContractSectionName: null,
        customerAgreementContractId: 1,
        customerAgreementContractName: null,
        customerAgreementContractSectionAccountId: 1,
        customerAgreementContractSectionAccountName: null
      }],
      businessUnitServiceOfferingDTOs: [{
        customerAccessorialServiceLevelBusinessUnitServiceOfferingId: null,
        serviceLevelBusinessUnitServiceOfferingAssociationId: 1,
        businessUnit: null,
        serviceOffering: null,
        serviceLevel: null
      }],
      requestServiceDTOs: [{
        customerAccessorialRequestServiceId: null,
        requestedServiceTypeId: 1,
        requestedServiceTypeCode: 'test'
      }],
      carrierDTOs: [{
        customerAccessorialCarrierId: null,
        carrierId: 1,
        carrierCode: 'test'
      }],
      groupRateItemizeIndicator: null,
      groupRateTypeId: null
    };
    spyOn(CreateStandardRateUtilityService.prototype, 'ratePostFramer');
    spyOn(CreateStandardRateService.prototype, 'postRateData').and.returnValue(of(response));
    component.savePopupYes();
  });
  it('it should call  refreshData', () => {
    const responseWith1If = [{
      customerAccessorialDocumentTextId: 1,
      textName: 'string',
      text: 'string',
      accessorialDocumentTypeName: 'Legal',
      level: 1,
      attachments: null
    }];
    component.refreshData(responseWith1If);
    const responseWith1IfWithAttachments = [{
      customerAccessorialDocumentTextId: 1,
      textName: 'string',
      text: 'string',
      accessorialDocumentTypeName: 'Legal',
      level: 1,
      attachments: [
        {
          'documentName': 'InactivateRates_Json.txt',
          'documentNumber': '{233B8CA6-F39E-41FC-8299-EC4B44419628}',
          'createTimestamp': '2019-07-22T11:43:47.011+0000',
          'createUserID': 'jisassi',
          'accessorialAttachmentTypeName': 'Special Instructions'
        }]
    }];
    component.refreshData(responseWith1IfWithAttachments);
    const responseWith1ElseWithAttachments = [{
      customerAccessorialDocumentTextId: 1,
      textName: 'string',
      text: 'string',
      accessorialDocumentTypeName: 'Instructional',
      level: 1,
      attachments: [
        {
          'documentName': 'InactivateRates_Json.txt',
          'documentNumber': '{233B8CA6-F39E-41FC-8299-EC4B44419628}',
          'createTimestamp': '2019-07-22T11:43:47.011+0000',
          'createUserID': 'jisassi',
          'accessorialAttachmentTypeName': 'Special Instructions'
        }]
    }];
    component.refreshData(responseWith1ElseWithAttachments);
    const responseWith2If = [{
      customerAccessorialDocumentTextId: 1,
      textName: 'string',
      text: 'string',
      accessorialDocumentTypeName: 'Legal',
      level: 1,
      attachments: null
    }, {
      customerAccessorialDocumentTextId: 1,
      textName: 'string',
      text: 'string',
      accessorialDocumentTypeName: 'Instructional',
      level: 1,
      attachments: null
    }];
    component.refreshData(responseWith2If);
    const responseWith2Else = [{
      customerAccessorialDocumentTextId: 1,
      textName: 'string',
      text: 'string',
      accessorialDocumentTypeName: 'Instructional',
      level: 1,
      attachments: [
        {
          'documentName': 'InactivateRates_Json.txt',
          'documentNumber': '{233B8CA6-F39E-41FC-8299-EC4B44419628}',
          'createTimestamp': '2019-07-22T11:43:47.011+0000',
          'createUserID': 'jisassi',
          'accessorialAttachmentTypeName': 'Special Instructions'
        }]
    }, {
      customerAccessorialDocumentTextId: 1,
      textName: 'string',
      text: 'string',
      accessorialDocumentTypeName: 'Legal',
      level: 1,
      attachments: [
        {
          'documentName': 'InactivateRates_Json.txt',
          'documentNumber': '{233B8CA6-F39E-41FC-8299-EC4B44419628}',
          'createTimestamp': '2019-07-22T11:43:47.011+0000',
          'createUserID': 'jisassi',
          'accessorialAttachmentTypeName': 'Special Instructions'
        }]
    }];
    component.refreshData(responseWith2Else);
    const responseElseElse = [];
    component.refreshData(responseElseElse);
  });
  it('it should call  legalOrInstructionalDocumentation for else', () => {
    const documentation = [{
      customerAccessorialDocumentTextId: 1,
      textName: 'illegal',
      text: 'illegal',
      accessorialDocumentTypeName: 'illegal',
      level: 1,
    }];
    component.legalOrInstructionalDocumentation(documentation);
  });
  it('it should call  onAddRates', () => {
    component.onAddRates();
    component.removeCharges();
    addRateComponent.addRatesModel.addRateForm = addRateFormGroup;
    component.addRates = addRateComponent;
    component.removeAllRates();
  });
  it('it should call  removeCharges for else', () => {
    const amountPattern = '[-0-9., ]*';
    rateFormGroup = formBuilder.group({
      quantity: ['', [Validators.pattern(amountPattern)]],
      quantityType: ['', Validators.required],
      alternateChargeType: ['']
    });
    component.createRatesModel.ratesForm = rateFormGroup;
    component.removeCharges();
  });
  it('it should call  validateRateForm', () => {
    component.rateSetup.createRatesModel.setUpForm = rateSetUpFormGroup;
    component.rateSetup.createRatesModel.CheckBoxAttributes = {
      'waived': true,
      'calculateRate': true,
      'passThrough': true,
      'rollUp': true
    };
    component.validateRateForm();
    component.rateSetup.createRatesModel.CheckBoxAttributes = {
      'rollUp': false
    };
    component.createRatesModel.isAddRateClicked = true;
    addRateComponent.addRatesModel.addRateForm = addRateFormGroup;
    component.addRates = addRateComponent;
    addRateComponent.addRatesModel.addRateForm.markAsDirty();
    component.validateRateForm();
  });
  it('it should call  validateRateForm for isAddRateClicked', () => {
    component.rateSetup.createRatesModel.CheckBoxAttributes = {
      'waived': true,
      'calculateRate': true,
      'passThrough': true,
      'rollUp': false
    };
    component.createRatesModel.isAddRateClicked = true;
    addRateComponent.addRatesModel.addRateForm = addRateFormGroup;
    component.addRates = addRateComponent;
    component.validateRateForm();
  });
  it('it should call  validateRateForm for isAddRateClicked', () => {
    component.rateSetup.createRatesModel.CheckBoxAttributes = {
      'waived': true,
      'calculateRate': true,
      'passThrough': true,
      'rollUp': false
    };
    component.createRatesModel.isAddRateClicked = true;
    addRateComponent.addRatesModel.addRateForm = addRateFormGroup;
    component.addRates = addRateComponent;
    addRateComponent.addRatesModel.addRateForm.markAsDirty();
    component.validateRateForm();
  });
  it('it should call  validateRateForm for else', () => {
    component.rateSetup.createRatesModel.CheckBoxAttributes = {
      'waived': true,
      'calculateRate': true,
      'passThrough': true,
      'rollUp': false
    };
    component.createRatesModel.isAddRateClicked = false;
    addRateComponent.addRatesModel.addRateForm = addRateFormGroup;
    component.addRates = addRateComponent;
    addRateComponent.addRatesModel.addRateForm.markAsDirty();
    component.validateRateForm();
  });
  it('it should call  formatAmount', () => {
    component.formatAmount('rateAmount');
    component.formatAmount('');
  });
  it('it should call  removeDocumentation', () => {
    component.createRatesModel.docIsLegalText = true;
    component.removeDocumentation();
    component.onFormValueChange();
  });
  it('it should call  checkRateFormValidity', () => {
    component.addRates = addRateComponent;
    component.addRates.addRatesModel.addRateForm = addRateFormGroup;
    component.checkRateFormValidity();
  });
  it('it should call  onDontSaveNavigate', () => {
    component.createRatesModel.routingUrl = '/';
    component.onDontSaveNavigate();
  });

  it('it should call  onRefresh', () => {
    const response = [{
      customerAccessorialDocumentTextId: 1,
      textName: 'string',
      text: 'string',
      accessorialDocumentTypeName: 'Legal',
      level: 1
    }];
    spyOn(CreateStandardRateUtilityService.prototype, 'onRefreshRatePostFramer');
    spyOn(CreateStandardRateService.prototype, 'getRatesDocumentation').and.returnValue(of(response));
    component.rateSetup.createRatesModel.CheckBoxAttributes = {
      waived: true,
      calculateRate: false,
      passThrough: true,
      rollUp: false
    };
    component.createRatesModel.isAddRateClicked = true;
    addRateComponent.addRatesModel.addRateForm = addRateFormGroup;
    component.rateSetup.createRatesModel.setUpForm = rateSetUpFormGroup;
    component.addRates = addRateComponent;
    component.optionalFields.optionalAttributesModel.optionalForm = optionalRateFormGroup;
    component.onRefresh();
  });

  it('it should call  onSaveRateSetUp', () => {
    component.optionalFields.optionalAttributesModel.optionalForm = optionalRateFormGroup;
    component.onSaveRateSetUp();
  });

  it('it should call  formFieldsTouched', () => {
    addRateComponent.addRatesModel.addRateForm = addRateFormGroup;
    component.addRates = addRateComponent;
    component.createRatesModel.isAddRateClicked = true;
    component.rateSetup.createRatesModel.CheckBoxAttributes = {
      'rollUp': true
    };
    component.formFieldsTouched();
    component.allowZeroInAddedFields();
  });

  it('it should call  isAddStairStepClickedValidate', () => {
    component.createRatesModel.isAddStairStepClicked = true;
    addStairStepComponent.stairStepModel.addStairStepForm = addStairStepRatesform;
    component.addStairStepRates = addStairStepComponent;
    component.isAddStairStepClickedValidate();
  });

  it('it should call  isAddStairStepClickedValidate for else', () => {
    component.createRatesModel.isAddStairStepClicked = true;
    addStairStepComponent.stairStepModel.addStairStepForm = addStairStepRatesform;
    component.addStairStepRates = addStairStepComponent;
    component.createRatesModel.isSetUpFormValid = true;
    component.isAddStairStepClickedValidate();
  });

  it('it should call  onWaivedChanged', () => {
    component.createRatesModel.isAddRateClicked = true;
    addRateComponent.addRatesModel.addRateForm = addRateFormGroup;
    component.addRates = addRateComponent;
    component.onWaivedChanged(true);
  });

  it('it should call  onWaivedChanged for else', () => {
    component.createRatesModel.isAddRateClicked = true;
    addRateComponent.addRatesModel.addRateForm = addRateFormGroup;
    component.addRates = addRateComponent;
    component.onWaivedChanged(false);
  });

  it('it should call  onRollUpChanged', () => {
    component.onRollUpChanged(true);
  });

  it('it should call  onRollUpChanged for else', () => {
    component.createRatesModel.isAddRateClicked = true;
    component.rateSetup.createRatesModel.CheckBoxAttributes = {
      'waived': true,
      'calculateRate': true,
      'passThrough': true,
      'rollUp': false
    };
    addRateComponent.addRatesModel.addRateForm = addRateFormGroup;
    component.addRates = addRateComponent;
    component.onRollUpChanged(true);
  });

  it('it should call  removeAlternateCharge', () => {
    component.removeAlternateCharge();
  });

  it('it should call  retainAlternateCharge', () => {
    component.retainAlternateCharge();
    component.noDocFoundPopupYes();
    component.onHidePop('alternateCharge');
  });

  it('it should call  onPassthroughChange', () => {
    component.createRatesModel.isAddRateClicked = true;
    component.rateSetup.createRatesModel.CheckBoxAttributes = {
      'waived': true,
      'calculateRate': true,
      'passThrough': true,
      'rollUp': true
    };
    addRateComponent.addRatesModel.addRateForm = addRateFormGroup;
    component.addRates = addRateComponent;
    component.onPassthroughChange(true);
  });

  it('it should call  onRateCancel', () => {
    component.onRateCancel();
  });
  it('it should call  populateQuantityValuesElse', () => {
    component.populateQuantityValues(null);
  });
  it('it should call  removestairStepFormMandatory', () => {
    addStairStepComponent.stairStepModel.addStairStepForm = addStairStepRatesform;
    component.addStairStepRates = addStairStepComponent;
    component.removestairStepFormMandatory();
  });
  it('it should call  stairStepFormMandatory', () => {
    addStairStepComponent.stairStepModel.addStairStepForm = addStairStepRatesform;
    component.addStairStepRates = addStairStepComponent;
    component.stairStepFormMandatory();
  });
  it('it should call  checkForValidRateWithoutFree', () => {
    const amountPattern = '[-0-9., ]*';
    addStairStepRatesform = formBuilder.group({
      rateType: new FormControl('', [Validators.required]),
      minAmount: new FormControl('2'),
      maxAmount: new FormControl('4'),
      rounding: new FormControl('Down', []),
      maxApplidedWhen: new FormControl('Steps Are Exceeded'),
      itemizeRates: new FormControl(false),
      stepsArray: new FormArray([new FormGroup({
        step: new FormControl({ label: 'Free', value: '0' }, [Validators.required]),
        fromQuantity: new FormControl('2', [Validators.required]),
        toQuantity: new FormControl('4', [Validators.required]),
        rateAmount: new FormControl('2.00', [Validators.pattern(amountPattern)])
      }),
      ])
    });
    addStairStepComponent.stairStepModel.addStairStepForm = addStairStepRatesform;
    component.addStairStepRates = addStairStepComponent;
    component.createRatesModel.isAddStairStepClicked = true;
    component.checkForValidRateWithoutFree();
  });
  it('it should call  checkForValidRateWithoutFree for else', () => {
    addStairStepRatesform['controls'].stepsArray['controls'][0]['controls']['step'].setValue({ label: 'Paid', value: '1' });
    addStairStepComponent.stairStepModel.addStairStepForm = addStairStepRatesform;
    component.addStairStepRates = addStairStepComponent;
    component.checkForValidRateWithoutFree();
  });
  it('it should call selectedBuSoOnly', () => {
    const data = [];
    spyOn(component, 'selectedBuSoOnly').and.callThrough();
    component.selectedBuSoOnly(data);
    expect(component.selectedBuSoOnly).toHaveBeenCalled();
  });
  it('should call validateStairStepRateForm', () => {
    component.rateSetup.createRatesModel.CheckBoxAttributes = {
      waived: true,
      calculateRate: true,
      passThrough: true,
      rollUp: true,
    };
    component.validateRateCheckBoxes(component.rateSetup.createRatesModel.CheckBoxAttributes);
    spyOn(component, 'validateStairStepRateForm').and.callThrough();
    component.validateStairStepRateForm();
    expect(component.validateStairStepRateForm).toHaveBeenCalled();
  });
  it('should call validateStairStepRateForm for else', () => {
    component.createRatesModel.isAddStairStepClicked = false;
    spyOn(component, 'validateStairStepRateForm').and.callThrough();
    component.validateStairStepRateForm();
    expect(component.validateStairStepRateForm).toHaveBeenCalled();
  });
  it('should call validateStairStepRateForm ', () => {
    component.createRatesModel.isAddStairStepClicked = true;
    component.rateSetup.createRatesModel.CheckBoxAttributes = {
      waived: true,
      calculateRate: true,
      passThrough: true,
      rollUp: false,
    };
    addStairStepComponent.stairStepModel.addStairStepForm = addStairStepRatesform;
    component.addStairStepRates = addStairStepComponent;
    spyOn(component, 'validateStairStepRateForm').and.callThrough();
    component.validateStairStepRateForm();
    expect(component.validateStairStepRateForm).toHaveBeenCalled();
  });
  it('should call validateStairStepRateForm ', () => {
    component.createRatesModel.isAddStairStepClicked = true;
    component.rateSetup.createRatesModel.CheckBoxAttributes = {
      waived: true,
      calculateRate: true,
      passThrough: true,
      rollUp: false,
    };
    addStairStepComponent.stairStepModel.addStairStepForm = addStairStepRatesform;
    component.addStairStepRates = addStairStepComponent;
    addStairStepComponent.stairStepModel.addStairStepForm.markAsDirty();
    spyOn(component, 'validateStairStepRateForm').and.callThrough();
    component.validateStairStepRateForm();
    expect(component.validateStairStepRateForm).toHaveBeenCalled();
  });
  it('should call validateStairStepRateForm for else', () => {
    component.createRatesModel.isAddStairStepClicked = false;
    component.rateSetup.createRatesModel.CheckBoxAttributes = {
      waived: true,
      calculateRate: true,
      passThrough: true,
      rollUp: false,
    };
    spyOn(component, 'validateStairStepRateForm').and.callThrough();
    component.validateStairStepRateForm();
    expect(component.validateStairStepRateForm).toHaveBeenCalled();
  });
  it('should call removeRateAndRateTypeMandatory', () => {
    component.addRates = addRateComponent;
    component.addRates.addRatesModel.addRateForm = addRateFormGroup;
    component.removeRateAndRateTypeMandatory();
  });
  it('should call savePopupNo', () => {
    spyOn(component, 'savePopupNo').and.callThrough();
    component.savePopupNo();
    expect(component.savePopupNo).toHaveBeenCalled();
  });
  it('should call onAddStairStepRates', () => {
    spyOn(component, 'onAddStairStepRates').and.callThrough();
    component.onAddStairStepRates();
    expect(component.onAddStairStepRates).toHaveBeenCalled();
  });
  it('should call onBusinessUnitShow', () => {
    component.onBusinessUnitShow(event);
  });
  it('should call onChargeTypeChange', () => {
    component.rateSetup.createRatesModel['chargeType'] = [
      {
        label: 'BOBTAIL',
        value: 1,
        description: 'BOBTAIL'
      }
    ];
    component.onChargeTypeChange(true);
    component.onChargeTypeChange(false);
  });
  it('should call isEffectiveDateAndChargeTypeValid', () => {
    component.isEffectiveDateAndChargeTypeValid();
  });
  it('it should call onTypeQuantityType else condition', () => {
    const event = { query: 'b' };
    component.createRatesModel.alternateChargeQuantity = null;
    component.onTypeQuantityType(event);
  });
  it('it should call getAlternateChargeTypeValues else condition', () => {
    component.rateSetup.createRatesModel['chargeType'] = [
      {
        label: 'BOBTAIL',
        value: 1,
        description: 'BOBTAIL'
      }
    ];
    component.rateSetup.createRatesModel['setUpForm']['controls']['chargeType'].setValue(null);
    component.getAlternateChargeTypeValues();
  });
  it('it should call onTypeAlternateChargeType else condition', () => {
    const event = { query: 'b' };
    component.createRatesModel.alternateChargeType = null;
    component.onTypeAlternateChargeType(event);
  });
  it('it should call  onRefresh else condition', () => {
    const response = [{
      customerAccessorialDocumentTextId: 1,
      textName: 'string',
      text: 'string',
      accessorialDocumentTypeName: 'Legal',
      level: 1
    }];
    component.rateSetup.createRatesModel.CheckBoxAttributes = {
      waived: true,
      calculateRate: false,
      passThrough: true,
      rollUp: false
    };
    component.createRatesModel.isAddRateClicked = true;
    component.addRates = addRateComponent;
    component.addRates.addRatesModel.addRateForm = addRateFormGroup;
    component.rateSetup.createRatesModel.setUpForm = rateSetUpFormGroup;
    component.optionalFields.optionalAttributesModel.optionalForm = optionalRateFormGroup;
    component.optionalFields.optionalAttributesModel.serviceLevelValues = null;
    spyOn(component, 'onValidateForm').and.returnValue(true);
    spyOn(CreateStandardRateUtilityService.prototype, 'onRefreshRatePostFramer').and.callThrough();
    spyOn(CreateStandardRateService.prototype, 'getRatesDocumentation').and.returnValue(of(response));
    component.onRefresh();
  });
  it('it should call  onSaveRateSetUp else condition', () => {
    component.optionalFields.optionalAttributesModel.optionalForm = optionalRateFormGroup;
    spyOn(component, 'validateDocumentation').and.returnValue(true);
    component.onSaveRateSetUp();
  });
  it('it should call  removeAllRates else condition', () => {
    component.addRates = addRateComponent;
    addRateComponent.addRatesModel.addRateForm = addRateFormBuilder.group({
      rates: new FormArray([new FormGroup({
        rateType: new FormControl(''),
        rateAmount: new FormControl('', Validators.required),
        minAmount: new FormControl('', Validators.required),
        maxAmount: new FormControl('', Validators.required),
        rounding: new FormControl('', [])
      })
      ]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    component.addCharges = null;
    component.removeAllRates();
  });

  it('should call canDeactivate for else', () => {
    component.createRatesModel.isDetailsSaved = true;
    component.optionalFields['optionalAttributesModel']['optionalForm'].markAsDirty();
    component.createRatesModel.isChangesSaving = true;
    component.createRatesModel.routingUrl = nextState.url;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });
  it('should call canDeactivate for if', () => {
    component.createRatesModel.isDetailsSaved = false;
    component.optionalFields['optionalAttributesModel']['optionalForm'].markAsDirty();
    component.createRatesModel.isChangesSaving = false;
    component.createRatesModel.routingUrl = nextState.url;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });
});
