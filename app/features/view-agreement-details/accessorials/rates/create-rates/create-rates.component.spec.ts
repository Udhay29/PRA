import { By } from '@angular/platform-browser';
import { markDirty } from '@angular/core/src/render3';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  FormBuilder, FormArray, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl,
  AbstractControl
} from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

import { CreateRateUtilsService } from '../create-rates/service/create-rate-utils.service';
import { EditRateUtility } from '../create-rates/service/edit-rates-utility';
import { of } from 'rxjs';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';

import { CreateRatesComponent } from './create-rates.component';
import { DebugElement } from '@angular/core';
import { AddRatesComponent } from '../add-rates/add-rates.component';
import { AddStairStepComponent } from './../../../../shared/accessorials/stair-step/add-stair-step/add-stair-step.component';
import { CreateRateService } from './service/create-rate.service';
import { CreateDocumentationService } from '../../documentation/create-documentation/service/create-documentation.service';
import { CreateRateUtilityService } from '../create-rates/service/create-rate-utility.service';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';
import { OptionalAttributesService } from '../../shared/services/optional-attributes.service';
import { ViewDocumentationComponent } from '../../shared/view-documentation/view-documentation.component';

describe('CreateRatesComponent', () => {
  let component: CreateRatesComponent;
  let addStairStepRatesform;
  let addRatesFormGroup;
  const formBuilder: FormBuilder = new FormBuilder();
  let fixture: ComponentFixture<CreateRatesComponent>;
  let addComponent: AddRatesComponent;
  let addStairStepComponent: AddStairStepComponent;
  let viewDocumentationComponent: ViewDocumentationComponent;
  let addComponentFixture: ComponentFixture<AddRatesComponent>;
  let addStairStepComponentFixture: ComponentFixture<AddStairStepComponent>;
  let viewDocumentationComponentFixture: ComponentFixture<ViewDocumentationComponent>;
  let debugElement: DebugElement;
  let shared: BroadcasterService;
  let createRateUtilsService: CreateRateUtilsService;
  let chargeTypeBasedBuResponse;
  let agreemententDetailsResponse;
  let editAccessorialNullResponse;
  let buSOResponse;
  let editResponse;

  let sectionResponse, contractResponse;
  const agreementCurrencyResponse1 = [{ 'currencyCode': 'USD' }, { 'currencyCode': 'CAD' }, { 'currencyCode': null }];
  const agreementCurrencyResponse2 = [{ 'currencyCode': 'USD' }, { 'currencyCode': 'CAD' }];
  const agreementCurrencyResponse3 = [{ 'currencyCode': 'USD' }, { 'currencyCode': null }];
  const agreementCurrencyResponse4 = [{ 'currencyCode': 'USD' }];
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule,
        FormsModule, ReactiveFormsModule],
      declarations: [],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        CreateRateService, CreateDocumentationService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRatesComponent);
    component = fixture.componentInstance;
    addComponentFixture = TestBed.createComponent(AddRatesComponent);
    addStairStepComponentFixture = TestBed.createComponent(AddStairStepComponent);
    viewDocumentationComponentFixture = TestBed.createComponent(ViewDocumentationComponent);
    addComponent = addComponentFixture.componentInstance;
    createRateUtilsService = TestBed.get(CreateRateUtilsService);
    addStairStepComponent = addStairStepComponentFixture.componentInstance;
    viewDocumentationComponent = viewDocumentationComponentFixture.componentInstance;
    sectionResponse = [{
      'customerAgreementContractSectionID': 123,
      'customerAgreementContractSectionName': 'Section123',
      'customerAgreementContractID': 456,
      'customerContractName': 'COntract1',
      'customerContractNumber': 'C123',
      'contractTypeName': 'Legal123',
      'effectiveDate': '2018-12-28',
      'expirationDate': '2018-12-29',
      'isChecked': true,
      'currencyCode': 'USD',
      'status': 'Inactive',
      'dateMismatchFlag': true,
      'InvalidCurrecyFlag': true
    }];
    contractResponse = [{
      'customerAgreementContractID': 123,
      'customerContractName': 'COntract1',
      'customerContractNumber': 'C123',
      'contractTypeName': 'Legal123',
      'effectiveDate': '2018-12-28',
      'expirationDate': '2018-12-29',
      'isChecked': true,
      'currencyCode': 'USD',
      'status': 'Inactive',
      'dateMismatchFlag': true,
      'InvalidCurrecyFlag': true
    }];
    agreemententDetailsResponse = {
      'agreementID': 48,
      'agreementDefaultAmount': 100000,
      'agreementEffectiveDate': '1995-01-01',
      'agreementExpirationDate': '2099-12-31',
      'customerContractDetailDTO': null,
      'customerSectionDetailDTO': null
    };
    component.createRatesModel.editAccessorialWholeResponse = {
      editRateData: {
        'customerAccessorialRateConfigurationId': 584,
        'currencyCode': 'USD',
        'equipmentCategoryCode': 'Chassis',
        'equipmentTypeDescription': null,
        'equipmentLengthId': 95,
        'equipmentLength': 44,
        'equipmentTypeId': null,
        'rateItemizeIndicator': '1',
        'groupRateTypeId': null,
        'groupRateTypeName': null,
        'equipmentLengthDescription': 'Feet',
        'chargeTypeId': 48,
        'chargeTypeName': 'Border Crossing Fee',
        'chargeTypeCode': 'CUSTOMSFEE',
        'waived': true,
        'calculateRateManually': false,
        'passThrough': false,
        'rateSetupStatus': false,
        'documentLegalDescription': null,
        'documentInstructionalDescription': null,
        'documentFileNames': null,
        'hasAttachment': null,
        'status': 'Active',
        'effectiveDate': '2019-06-06',
        'expirationDate': '2099-12-31',
        'customerAgreementId': 48,
        'accessorialDocumentTypeId': null,
        'customerChargeName': 'Test',
        'businessUnitServiceOfferingDTOs': [{
          'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': null,
          'serviceLevelBusinessUnitServiceOfferingAssociationId': 11,
          'financeBusinessUnitServiceOfferingAssociationID': 4,
          'businessUnit': 'DCS',
          'serviceOffering': 'Backhaul',
          'serviceLevel': 'Standard'
        }],
        'requestServiceDTOs': [{
          'customerAccessorialRequestServiceId': 244,
          'requestedServiceTypeId': null,
          'requestedServiceTypeCode': 'Team'
        }],
        'carrierDTOs': [{
          'customerAccessorialCarrierId': null,
          'carrierId': 70,
          'carrierName': 'A A A COOPER TRANSPORTATION',
          'carrierCode': 'AAA0'
        }],
        'level': 'Agreement',
        'customerAccessorialStairRateDTO': {
          'customerAccessorialStairRateId': 58,
          'accessorialRateTypeId': 7,
          'accessorialRateTypeName': 'Cwt',
          'accessorialRateRoundingTypeId': 7,
          'accessorialRateRoundingTypeName': 'Down',
          'accessorialMaximumRateApplyTypeId': 3,
          'accessorialMaximumRateApplyTypeName': 'Steps Exceeded',
          'minimumAmount': 12.0000,
          'maximumAmount': 50.0000,
          'customerAccessorialStairStepRateDTOs': [{
            'customerAccessorialStairStepRateId': 96,
            'fromQuantity': 0.0000,
            'toQuantity': 1.0000,
            'stairStepRateAmount': 0.0000,
            'stepNumber': 0
          }, {
            'customerAccessorialStairStepRateId': 97,
            'fromQuantity': 2.0000,
            'toQuantity': 3.0000,
            'stairStepRateAmount': 1.0000,
            'stepNumber': 1
          }, {
            'customerAccessorialStairStepRateId': 98,
            'fromQuantity': 4.0000,
            'toQuantity': 5.0000,
            'stairStepRateAmount': 2.0000,
            'stepNumber': 2
          }]
        },
        'customerAccessorialRateChargeDTOs': [
          {
            'customerAccessorialRateChargeId': 154,
            'accessorialRateTypeId': 8,
            'accessorialRateTypeName': 'Flat',
            'accessorialRateRoundingTypeId': null,
            'accessorialRateRoundingTypeName': null,
            'rateAmount': 100.0000,
            'minimumAmount': null,
            'maximumAmount': null,
            'rateOperator': null
          }
        ],
        'customerAccessorialRateAdditionalChargeDTOs': [{
          'customerAccessorialRateAdditionalChargeId': 131,
          'accessorialRateTypeId': 8,
          'accessorialRateTypeName': 'Flat',
          'additionalChargeTypeId': 8,
          'additionalChargeTypeName': 'Discount',
          'additionalChargeCodeName': 'DISCOUNT',
          'rateAmount': 12.0000
        }, {
          'customerAccessorialRateAdditionalChargeId': 132,
          'accessorialRateTypeId': 9,
          'accessorialRateTypeName': 'Per Day',
          'additionalChargeTypeId': 2,
          'additionalChargeTypeName': 'Detention With Power',
          'additionalChargeCodeName': 'DETENTIONP',
          'rateAmount': 24.0000
        }],
        'customerAccessorialRateAlternateChargeViewDTO': null,
        'contracts': null,
        'sections': null,
        'sectionAccounts': null
      }
    };
    editAccessorialNullResponse = {
      editRateData: {
        'customerAccessorialRateConfigurationId': 584,
        'currencyCode': 'USD',
        'equipmentCategoryCode': null,
        'equipmentTypeDescription': null,
        'equipmentLengthId': null,
        'equipmentLength': null,
        'equipmentTypeId': null,
        'rateItemizeIndicator': '1',
        'groupRateTypeId': null,
        'groupRateTypeName': null,
        'equipmentLengthDescription': null,
        'chargeTypeId': 48,
        'chargeTypeName': 'Border Crossing Fee',
        'chargeTypeCode': 'CUSTOMSFEE',
        'waived': null,
        'calculateRateManually': null,
        'passThrough': null,
        'rateSetupStatus': null,
        'documentLegalDescription': null,
        'documentInstructionalDescription': null,
        'documentFileNames': null,
        'hasAttachment': null,
        'status': 'Active',
        'effectiveDate': '2019-06-06',
        'expirationDate': '2099-12-31',
        'customerAgreementId': 48,
        'accessorialDocumentTypeId': null,
        'customerChargeName': 'Test',
        'businessUnitServiceOfferingDTOs': null,
        'requestServiceDTOs': [{
          'customerAccessorialRequestServiceId': 244,
          'requestedServiceTypeId': null,
          'requestedServiceTypeCode': 'Team'
        }],
        'carrierDTOs': null,
        'level': 'Agreement',
        'customerAccessorialStairRateDTO': null,
        'customerAccessorialRateChargeDTOs': null,
        'customerAccessorialRateAdditionalChargeDTOs': null,
        'customerAccessorialRateAlternateChargeViewDTO': null,
        'contracts': null,
        'sections': null,
        'sectionAccounts': null
      }
    };
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
    const amountPattern = '[-0-9., ]*';
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
    addRatesFormGroup = formBuilder.group({
      rates: new FormArray([new FormGroup({
        rateType: new FormControl(''),
        rateAmount: new FormControl('1', [Validators.pattern(amountPattern)]),
        minAmount: new FormControl(2, [Validators.pattern(amountPattern)]),
        maxAmount: new FormControl('3', [Validators.pattern(amountPattern)]),
        rounding: new FormControl('Down', [])
      }),
      new FormGroup({
        rateType: new FormControl('hsg'),
        rateAmount: new FormControl('1', [Validators.pattern(amountPattern)]),
        minAmount: new FormControl(2, [Validators.pattern(amountPattern)]),
        maxAmount: new FormControl('3', [Validators.pattern(amountPattern)]),
        rounding: new FormControl('Down', [])
      })
      ]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });

    const result = {
      _embedded: {
        configurationParameterDetails: [
          {
            configurationParameterValue: 123
          }
        ]
      }
    };

    editResponse = {
      accessorialDocumentTypeId: null,
      businessUnitServiceOfferingDTOs: [{
        businessUnit: 'ICS',
        customerAccessorialServiceLevelBusinessUnitServiceOfferingId: null,
        financeBusinessUnitServiceOfferingAssociationID: 7,
        serviceLevel: 'Standard',
        serviceLevelBusinessUnitServiceOfferingAssociationId: 2,
        serviceOffering: 'Brokerage',
      }],
      calculateRateManually: false,
      carrierDTOs: null,
      chargeTypeCode: 'CORRBOL',
      chargeTypeId: 47,
      chargeTypeName: 'Corrected Bill of Lading Fee',
      contracts: [{
        contractTypeID: 1,
        contractTypeName: 'Legal',
        customerAgreementContractID: 86,
        customerContractName: 'test',
        customerContractNumber: '123rest',
        effectiveDate: '05/28/2013',
        expirationDate: '12/31/2099'
      }],
      currencyCode: 'USD',
      customerAccessorialRateAdditionalChargeDTOs: [{
        accessorialRateTypeId: 12,
        accessorialRateTypeName: 'Per Piece',
        additionalChargeCodeName: 'CUSTOMSFEE',
        additionalChargeTypeId: 48,
        additionalChargeTypeName: 'Border Crossing Fee',
        additionalChargeTypeNameWithCode: 'Border Crossing Fee (CUSTOMSFEE)',
        customerAccessorialRateAdditionalChargeId: 306,
        rateAmount: 8
      }],
      customerAccessorialRateAlternateChargeViewDTO: {
        accessorialRateAlternateChargeQuantityTypeId: 6,
        accessorialRateAlternateChargeQuantityTypeName: 'MILE',
        alternateChargeCode: 'BLOCKBRACE',
        alternateChargeTypeId: 59,
        alternateChargeTypeName: 'Blocking & Bracing Charge',
        customerAccessorialRateAlternateChargeId: 250,
        customerAlternateChargeThresholdQuantity: 45,
      },
      customerAccessorialRateChargeDTOs: [{
        accessorialRateRoundingTypeId: 10,
        accessorialRateRoundingTypeName: 'Half Down',
        accessorialRateTypeId: 8,
        accessorialRateTypeName: 'Flat',
        customerAccessorialRateChargeId: 1380,
        maximumAmount: 90,
        minimumAmount: 8,
        rateAmount: 62,
        rateOperator: null
      }],
      customerAccessorialRateConfigurationId: 1618,
      customerAccessorialStairRateDTO: {
        accessorialMaximumRateApplyTypeId: null,
        accessorialMaximumRateApplyTypeName: null,
        accessorialRateRoundingTypeId: 10,
        accessorialRateRoundingTypeName: 'Half Down',
        accessorialRateTypeId: 14,
        accessorialRateTypeName: 'Percent',
        customerAccessorialStairRateId: 223,
        customerAccessorialStairStepRateDTOs: [{
          customerAccessorialStairStepRateId: 382,
          fromQuantity: 0,
          stairStepRateAmount: 0,
          stepNumber: 0,
          toQuantity: 5
        }],
        maximumAmount: null,
        minimumAmount: null,
      },
      customerAgreementId: 48,
      customerChargeName: null,
      documentFileNames: null,
      documentInstructionalDescription: null,
      documentLegalDescription: null,
      effectiveDate: '06/18/2019',
      equipmentCategoryCode: 'Chassis',
      equipmentLength: null,
      equipmentLengthDescription: null,
      equipmentLengthId: null,
      equipmentTypeDescription: 'Dolly',
      equipmentTypeId: 32,
      expirationDate: '12/31/2099',
      groupRateTypeId: null,
      groupRateTypeName: null,
      hasAttachment: null,
      level: 'Section',
      passThrough: false,
      rateItemizeIndicator: '0',
      rateSetupStatus: false,
      requestServiceDTOs: [{
        customerAccessorialRequestServiceId: 632,
        requestedServiceTypeCode: 'Team',
        requestedServiceTypeId: null
      }],
      sectionAccounts: [{
        billToCode: 'MACLEJ',
        billToDetails: 'MALNOVE INCORPORATED OF UT (MACLEJ)',
        billToID: 147643,
        billToName: 'MALNOVE INCORPORATED OF UT',
        billingPartyID: 147643,
        contractNumber: '123rest',
        customerAgreementContractID: 86,
        customerAgreementContractSectionAccountID: 1147,
        customerAgreementContractSectionID: 883,
        customerAgreementContractSectionName: 'test 12332',
        customerAgreementID: 48,
        customerAgreementName: 'Malnove Incorporated Of Ut (MACLEJ)',
        customerContractName: '123rest (test)',
        effectiveDate: '01/01/1995',
        expirationDate: '12/31/2099',
        status: 'Active'
      }],
      sections: [{
        currencyCode: undefined,
        customerAgreementContractSectionID: 882,
        customerAgreementContractSectionName: 'test 12345',
        customerAgreementContractTypeName: null,
        customerContractID: 86,
        customerContractName: 'test',
        customerContractNumber: '123rest',
        effectiveDate: '06/12/2019',
        expirationDate: '12/31/2099',
        isChecked: false,
        status: 'Active'
      }],
      status: 'Active',
      waived: true
    };

    buSOResponse = [{
      financeBusinessUnitServiceOfferingAssociationID: 1,
      serviceOfferingCode: 'string',
      serviceOfferingDescription: 'string',
      transitModeId: 1,
      transitModeCode: 'string',
      transitModeDescription: 'string',
      financeBusinessUnitCode: 'string',
      chargeTypeBusinessUnitServiceOfferingAssociationID: 1
    }];
    spyOn(CreateRateService.prototype, 'getSuperUserBackDate').and.returnValue(of(result));
    spyOn(CreateRateService.prototype, 'getSuperFutureBackDate').and.returnValue(of(result));
    debugElement = fixture.debugElement;
    shared = debugElement.injector.get(BroadcasterService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should cal checkContractSection', () => {
    component.checkContractSection('');
    expect(component.checkContractSection).toBeTruthy();
    component.contractListCheck();
    component.sectionListCheck();
  });

  it('it should cal onPopupClose', () => {
    component.createRatesModel.isPopupYesClicked = true;
    expect(component.createRatesModel.isPopupYesClicked).toBe(true);
    component.onPopupClose();
    expect(component.onPopupClose).toBeTruthy();
  });

  it('it should cal function formCheck', () => {
    const rateLevelChange = 'contract';
    component.createRatesModel.isAddRateClicked = true;
    expect(component.createRatesModel.isAddRateClicked).toBeDefined();
    component.formCheck(rateLevelChange);
  });

  it('it should cal ratesforDirtyCheck', () => {
    component.ratesForDirtyCheck();
    expect(component.ratesForDirtyCheck).toBeTruthy();
  });

  it('it should cal dateCheck', () => {
    component.dateCheck();
    expect(component.dateCheck).toBeTruthy();
  });

  it('it should cal dateReset', () => {
    component.dateReset();
    expect(component.dateReset).toBeTruthy();
  });

  it('it should cal onFormValueChange', () => {
    component.onFormValueChange();
    expect(component.onFormValueChange).toBeTruthy();
  });

  it('it should cal removeDocumentation', () => {
    component.removeDocumentation();
    expect(component.removeDocumentation).toBeTruthy();
  });

  it('it should cal setValidation', () => {
    const fieldName = 'effectiveDate';
    component.createRatesModel.ratesForm.controls['effectiveDate'].setValue(new Date());
   component.setValidation(fieldName);
    expect(component.setValidation).toBeTruthy();
  });

  it('it should cal validateEffectiveDate', () => {
    component.validateEffectiveDate();
    expect(component.validateEffectiveDate).toBeTruthy();
  });

  it('it should cal onSaveRates', () => {
    component.onSaveRates();
    expect(component.onSaveRates).toBeTruthy();
  });

  it('it should cal setFormErrors', () => {
    component.setFormErrors();
    expect(component.setFormErrors).toBeTruthy();
  });

  it('getFormattedDate should return some date', () => {
    component.dateFormatter('');
    expect(component.dateFormatter).toBeTruthy();
  });

  it('it should cal onSaveRateSetUp', () => {
    component.onSaveRateSetUp();
    expect(component.onSaveRateSetUp).toBeTruthy();
  });

  it('it should cal isServieLevelMandatory', () => {
    component.isServieLevelMandatory();
    expect(component.isServieLevelMandatory).toBeTruthy();
  });

  it('it should cal getContractDetails', () => {
    component.getContractDetails(event);
    expect(component.getContractDetails).toBeTruthy();
  });

  it('it should cal getsectionDetails', () => {
    component.createRatesModel.selectedSectionValue = sectionResponse;
    const event = component.createRatesModel.selectedSectionValue;
    expect(event.length).toEqual(1);
    component.getsectionDetails(event);
    expect(component.getsectionDetails).toBeTruthy();
  });

  it('it should cal ratesFieldReset', () => {
    component.ratesFieldReset();
    expect(component.ratesFieldReset).toBeTruthy();
  });

  it('it should cal getAlternateChargeTypeValues', () => {
    component.createRatesModel.createRatesValidation.chargeType = [{
      'label': 'abc',
      'value': 2,
      'description': 'str'
    }];
    component.createRatesModel.ratesForm.controls['chargeType'].setValue(2);
    component.getAlternateChargeTypeValues();
    expect(component.getAlternateChargeTypeValues).toBeTruthy();
  });

  it('it should cal onQuantityBlur', () => {
    const value = 'quantityType';
    component.onQuantityBlur(value);
    expect(component.onQuantityBlur).toBeTruthy();
  });

  it('it should cal onselect alternativechargetype', () => {
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

  it('it should cal  onSelectQuantityType', () => {
    const event = {
      label: 'value',
      value: 2
    };
    component.onSelectQuantityType(event);
    expect(component.onSelectQuantityType).toBeTruthy();
    component.setFormValidators('quantity');
    expect(component.setFormValidators).toBeTruthy();
    component.setFormValidators('quantityType');
  });

  it('it should cal removecharges', () => {
    component.createRatesModel.isAlternateChargeChange = true;
    component.createRatesModel.ratesForm.controls.quantity.setValue('2');
    expect(component.createRatesModel.ratesForm.controls.quantity.value).toBeTruthy();
    expect(component.createRatesModel.isAlternateChargeChange).toBe(true);
    component.removeCharges();
  });

  it('it should retain charges', () => {
    component.createRatesModel.isAlternateChargeChange = false;
    expect(component.createRatesModel.isAlternateChargeChange).toBe(false);
    component.retainAlternateCharge();
  });

  it('it should removeAlternateCharge', () => {
    component.createRatesModel.alternateCharge = false;
    component.createRatesModel.isAlternateChargeChange = false;
    expect(component.createRatesModel.alternateCharge).toBe(false);
    expect(component.createRatesModel.isAlternateChargeChange).toBe(false);
    component.removeAlternateCharge();
  });

  it('it should cal for empty validatiors', async () => {
    component.emptyValidations('quantity');
    component.createRatesModel.ratesForm.controls['quantity'].setValidators(null);
    component.createRatesModel.ratesForm.controls['quantity'].setValue(null);
    component.createRatesModel.ratesForm.controls['quantity'].updateValueAndValidity();
    expect(component.createRatesModel.ratesForm.valid).toBeFalsy();
  });

  it('it should cal savePopupYes', () => {
    spyOn(component, 'saveRateSetUp');
    component.saveRateSetUp();
    expect(component.saveRateSetUp).toHaveBeenCalled();
    component.savePopupYes();
    expect(component.savePopupYes).toBeTruthy();
  });

  it('it should cal savePopupNo', () => {
    component.savePopupNo();
    expect(component.savePopupNo).toBeTruthy();
  });

  it('it should cal onHideCancelPop', () => {
    component.onHideCancelPop('');
    expect(component.onHideCancelPop).toBeTruthy();
  });

  it('it should cal onDontSave', () => {
    component.onDontSave();
    expect(component.onDontSave).toBeTruthy();
  });

  it('it should cal onRateCancel', () => {
    component.onRateCancel();
    expect(component.onRateCancel).toBeTruthy();
  });

  it('it should cal cancelCheck', () => {
    component.cancelCheck();
    expect(component.cancelCheck).toBeTruthy();
  });

  it('it should cal onAddRates', () => {
    component.onAddRates();
    expect(component.onAddRates).toBeTruthy();
  });

  it('it should cal onRemoveRates', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = new FormGroup({
      rates: new FormArray([component.addRates.createRateItem()]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    component.onRemoveRates();
  });

  it('it should cal removeDocumentation', () => {
    component.removeDocumentation();
   expect(component.removeDocumentation).toBeTruthy();
  });

  it('it should save rateSetup', () => {
    const TestResponse = {
      'effectiveDate': '2019-04-10',
      'expirationDate': '2099-12-31',
      'customerAgreementId': 37,
      'accessorialDocumentTypeId': 1,
      'chargeTypeId': 79,
      'chargeTypeName': 'Discounts Applied',
      'customerChargeName': null,
      'equipmentCategoryCode': null,
      'equipmentTypeCode': null,
      'equipmentLengthId': null,
      'equipmentTypeId': null,
      'customerAccessorialAccountDTOs': [],
      'businessUnitServiceOfferingDTOs': null,
      'requestServiceDTOs': null,
      'carrierDTOs': null,
      'level': 12,
      'customerAccessorialRateConfigurationId': 24,
      'currencyCode': 'USD',
      'rateItemizeIndicator': '0',
      'groupRateTypeId': 1,
      'equipmentLengthDescription': null,
      'chargeTypeCode': 'DISCOUNT',
      'createdDate': null,
      'createdBy': null,
      'lastUpdatedDate': null,
      'lastUpdatedBy': null,
      'waived': null,
      'calculateRateManually': null,
      'passThrough': null,
      'rateSetupStatus': null,
      'documentLegalDescription': 'Test',
      'documentInstructionalDescription': null,
      'documentFileNames': null,
      'hasAttachment': null,
      'customerAccessorialRateCriteriaDTOs': [{
        'customerAccessorialRateCriteriaId': null,
        'customerAccessorialRateCriteriaTypeId': 4,
        'customerAccessorialRateCriteriaName': null
      }],
      'customerAccessorialRateChargeDTOs': [{
        'customerAccessorialRateChargeId': null,
        'accessorialRateTypeId': 5,
        'accessorialRateTypeName': '% PTE',
        'accessorialRateRoundingTypeId': null,
        'accessorialRateRoundingTypeName': null,
        'rateAmount': 34,
        'minimumAmount': null,
        'maximumAmount': null,
        'rateOperator': 'Sum'
      }, {
        'customerAccessorialRateChargeId': null,
        'accessorialRateTypeId': 5,
        'accessorialRateTypeName': '% PTE',
        'accessorialRateRoundingTypeId': null,
        'accessorialRateRoundingTypeName': null,
        'rateAmount': 3,
        'minimumAmount': null,
        'maximumAmount': null,
        'rateOperator': 'Sum'
      }],
      'customerAccessorialRateAlternateChargeDTO': null,
      'customerAccessorialRateAdditionalChargeDTOs': null
    };
    spyOn(component, 'saveRateSetUp');
    component.saveRateSetUp();
    expect(component.saveRateSetUp).toHaveBeenCalled();
  });

  it('it should cal onChangeRateDocumentLevel', () => {
    const event = {
      option: {
        'label': 'Contract',
        'value': 'contract'
      }
    };
    const ratelevelchangevalue = event.option.value;
    component.createRatesModel.ratesForm.controls['documentationLevel'].setValue('contract');
    expect(ratelevelchangevalue).toEqual(component.createRatesModel.ratesForm.controls['documentationLevel'].value);
    component.onChangeRateDocumentLevel(event);
    expect(component.onChangeRateDocumentLevel).toBeTruthy();
  });

  it('it should cal onTypeChargeCode', () => {
    const event = { query: 'abc' };
    component.createRatesModel.createRatesValidation.chargeType = [{
      'label': 'abc',
      'value': 2,
      'description': 'str'
    }];
    expect(component.createRatesModel.createRatesValidation.chargeType).toBeDefined();
    component.onTypeChargeCode(event);
    expect(component.onTypeChargeCode).toBeTruthy();
  });

  it('it should cal onSelectChargeCode', () => {
    spyOn(CreateRateService.prototype, 'getBUbasedOnChargeType').and.returnValue(of(buSOResponse));
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('onSelect', { value: '' });
  });

  it('it should  cal onautoCompleteBlur', () => {
    const controlName = 'chargeType';
    const event = {
      target: {
        'value': ''
      }
    };
    expect(event.target.value).toBeDefined();
    component.optionalFields.optionalAttributesModel.serviceLevel = [];
    component.optionalFields.optionalAttributesModel.operationalService = [];
    expect(component.optionalFields.optionalAttributesModel.serviceLevel).toEqual([]);
    expect(component.optionalFields.optionalAttributesModel.operationalService).toEqual([]);
    component.onautoCompleteBlur(event, controlName);
    expect(component.onautoCompleteBlur).toBeTruthy();
  });

  it('it should cal onTypeCurrencyType', () => {
    const event = { query: 'abc' };
    component.createRatesModel.currencyCodes = [{
      'label': 'abc',
      'value': '2'
    }];
    expect(component.createRatesModel.currencyCodes).toBeDefined();
    component.onTypeCurrencyType(event);
    expect(component.onTypeCurrencyType).toBeTruthy();
  });

  it('it should cal onTypeQuantityType', () => {
    const event = { query: 'abc' };
    component.createRatesModel.alternateChargeQuantity = [{
      'label': 'abc',
      'value': 2
    }];
    expect(component.createRatesModel.alternateChargeQuantity).toBeDefined();
    component.onTypeQuantityType(event);
    expect(component.onTypeQuantityType).toBeTruthy();
  });

  it('it should cal onTypeAlternateChargeType', () => {
    const event = { query: 'abc' };
    component.createRatesModel.createRatesValidation.alternateChargeType = [{
      'label': 'abc',
      'value': 2,
      'description': 'scb'
    }];
    expect(component.createRatesModel.createRatesValidation.alternateChargeType).toBeDefined();
    component.onTypeAlternateChargeType(event);
    expect(component.onTypeAlternateChargeType).toBeTruthy();
  });

  it('it should cal on onCurrencyTypeBlur', () => {
    const event = {
      target: {
        'value': ''
      }
    };
    component.createRatesModel.ratesForm.controls['currency'].setValue('ab');
    event.target.value = null;
    expect(component.onCurrencyTypeBlur).toBeTruthy();
  });

  it('it should cal on typedDateValidate effectiveDate', () => {
    let fieldName;
    fieldName = 'effectiveDate';
    const event = {
      srcElement: {
        'value': '04/11/2016'
      }
    };
    component.typedDateValidate(event, fieldName);
    expect(component.typedDateValidate).toBeTruthy();
  });

  it('it should cal on typedDateValidate expirationDate', () => {
    let fieldName;
    fieldName = 'expirationDate';
    const event = {
      srcElement: {
        'value': '04/11/2016'
      }
    };
    component.typedDateValidate(event, fieldName);
    expect(component.typedDateValidate).toBeTruthy();
  });

  it('should cal showDuplicateRateError', () => {
    component.createRatesModel.inlineErrormessage = [];
    expect(component.createRatesModel.inlineErrormessage).toEqual([]);
    expect(component.showDuplicateRateError).toBeTruthy();
  });

  it('it should cal createDocumentation', () => {
    component.createDocumentation(true);
    component.createRatesModel.createRatesValidation.isDetailsSaved = true;
  });

  it('should call createRateUtilsService.setAlternateChargeTypesForEdit', () => {
    spyOn(CreateRateService.prototype, 'getChargeTypes').and.returnValue(of([]));
    component.getChargeTypes();
  });

  it('should call createRateUtilsService.setAlternateChargeTypesForEdit for if', () => {
    spyOn(CreateRateService.prototype, 'getChargeTypes').and.returnValue(of([]));
    component.createRatesModel.isEditFlagEnabled = true;
    component.getChargeTypes();
  });

  it('it should cal createRateUtilsService.alternateChargeTypeValidation', () => {
    spyOn(CreateRateService.prototype, 'getBUbasedOnChargeType').and.returnValue(of([]));
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    component.createRatesModel.ratesForm.controls['chargeType'].setValue({ label: 'test' });
    component.createRatesModel.ratesForm.controls['alternateChargeType'].setValue({ label: 'test' });
    fixture.detectChanges();
    element.triggerEventHandler('onSelect', { value: '' });
  });

  it('should call onAutoCompleteFiledsBlurred', () => {
    component.onAutoCompleteFiledsBlurred('test', 'chargeType');
  });

  it('should call createRateUtilsService.saveRateSetup', () => {
    spyOn(CreateRateUtilityService.prototype, 'ratePostFramer');
    spyOn(CreateDocumentationService.prototype, 'postRateData').and.returnValue(of({}));
    component.saveRateSetUp();
  });

 it('should call createRateUtilsService.saveRateSetup for else', () => {
    spyOn(CreateRateUtilityService.prototype, 'ratePostFramer');
    spyOn(CreateDocumentationService.prototype, 'patchRateData').and.returnValue(of({}));
    component.createRatesModel.isEditFlagEnabled = true;
    component.saveRateSetUp();
  });

  it('should call createRateUtilsService.setAccessorialRateValues', () => {
    spyOn(component, 'getChargeTypes');
    spyOn(component, 'patchValuesToAccessorialRates');
    shared.broadcast('editAccesorialRates', {
      editRateData: null,
      isAccessorialRateEdit: true,
      refreshDocumentResponse: null,
      rateConfigurationId: null
    });
  });

  it('should call getAgreementLevelCurrencyPart1', () => {
    spyOn(CreateRateService.prototype, 'getAgreementCurrency').and.returnValues(of(agreementCurrencyResponse1));
    component.createRateUtilsService.getAgreementLevelCurrency('1', component);
  });
  it('should call getAgreementLevelCurrencyPart2', () => {
    spyOn(CreateRateService.prototype, 'getAgreementCurrency').and.returnValues(of(agreementCurrencyResponse2));
    component.createRateUtilsService.getAgreementLevelCurrency('1', component);
  });
  it('should call getAgreementLevelCurrencyPart3', () => {
    spyOn(CreateRateService.prototype, 'getAgreementCurrency').and.returnValues(of(agreementCurrencyResponse3));
    component.createRateUtilsService.getAgreementLevelCurrency('1', component);
  });
  it('should call getAgreementLevelCurrencyPart4', () => {
    spyOn(CreateRateService.prototype, 'getAgreementCurrency').and.returnValues(of(agreementCurrencyResponse4));
    component.createRateUtilsService.getAgreementLevelCurrency('1', component);
  });
 it('should call isCurrencySelectionsValid', () => {
    component.createRatesModel.createRatesValidation.invalidAgreementCurrency = true;
    component.contract = { 'contractListModel': { 'selectedContract': contractResponse } };
    component.sectionListModel = { 'sectionsModel': { 'dataSelected': sectionResponse } };
    component.createRateUtilsService.isCurrencySelectionsValid(component);
  });

  it('should call createRateUtilityService.ratePostFramer', () => {
    component.createRatesModel.agreementDetails = {
      agreementType: 'string',
      businessUnits: 'string',
      cargoReleaseAmount: 123,
      currencyCode: 'string',
      customerAgreementID: 123,
      customerAgreementName: 'string',
      effectiveDate: 'string',
      expirationDate: 'string',
      invalidIndicator: 'string',
      invalidReasonTypeName: 'string',
      taskAssignmentIDs: 'string',
      teams: 'string',
      ultimateParentAccountID: 123
    };
    component.saveRateSetUp();
  });

  it('it should cal patchValuesToAccessorialRates', () => {
    const dateResponse = {
      agreementID: 1,
      agreementDefaultAmount: 1,
      agreementEffectiveDate: 'string',
      agreementExpirationDate: 'string',
      customerContractDetailDTO: ['a', 'b'],
      customerSectionDetailDTO: ['a']
    };
    const setviceLevelResponse = {
      '_embedded': {
        'serviceLevelBusinessUnitServiceOfferingAssociations': [{
          'serviceLevel': {
            'serviceLevelCode': 'Standard',
            'serviceLevelDescription': 'Standard'
          },
          'financeBusinessUnitServiceOfferingAssociation': {
            'financeBusinessUnitServiceOfferingAssociationID': 169,
            'financeBusinessUnitCode': 'test',
            'serviceOfferingCode': 'test',
            'effectiveTimestamp': '1995-01-01T06:00:00.000+0000',
            'expirationTimestamp': '2099-12-31T06:00:00.000+0000',
            'lastUpdateTimestampString': '2018-12-16T10:43:23.762'
          },
          'lastUpdateTimestampString': '2013-09-29T18:46:19Z',
          'serviceLevelBusinessUnitServiceOfferingAssociationID': '1',
          '_links': {}
        }]
      },
      '_links': {}
    };
    spyOn(CreateRateService.prototype, 'getBUbasedOnChargeType').and.returnValue(of(buSOResponse));
    spyOn(CreateDocumentationService.prototype, 'getAgreementLevelDate').and.returnValue(of(dateResponse));
    spyOn(OptionalAttributesService.prototype, 'getServiceLevel').and.returnValue(of(setviceLevelResponse));
    component.createRatesModel.editAccessorialWholeResponse = editResponse;
    component.patchValuesToAccessorialRates(editResponse);
  });
  it('it should cal patchValuesToAccessorialRates', () => {
    const editResponseElse = {
      accessorialDocumentTypeId: null,
      businessUnitServiceOfferingDTOs: [],
      calculateRateManually: false,
      carrierDTOs: null,
      chargeTypeCode: 'CORRBOL',
      chargeTypeId: 47,
      chargeTypeName: 'Corrected Bill of Lading Fee',
      contracts: [],
      currencyCode: 'USD',
      customerAccessorialRateAdditionalChargeDTOs: [],
      customerAccessorialRateAlternateChargeViewDTO: null,
      customerAccessorialRateChargeDTOs: [],
      customerAccessorialRateConfigurationId: 1618,
      customerAccessorialStairRateDTO: null,
      customerAgreementId: 48,
      customerChargeName: null,
      documentFileNames: null,
      documentInstructionalDescription: null,
      documentLegalDescription: null,
      effectiveDate: '06/18/2019',
      equipmentCategoryCode: 'Chassis',
      equipmentLength: null,
      equipmentLengthDescription: null,
      equipmentLengthId: null,
      equipmentTypeDescription: 'Dolly',
      equipmentTypeId: 32,
      expirationDate: '12/31/2099',
      groupRateTypeId: null,
      groupRateTypeName: null,
      hasAttachment: null,
      level: 'Section',
      passThrough: false,
      rateItemizeIndicator: '0',
      rateSetupStatus: false,
      requestServiceDTOs: [],
      sectionAccounts: [],
      sections: [],
      status: 'Active',
      waived: true
    };
    component.createRatesModel.createRatesValidation.isSubscribeFlag = false;
    spyOn(CreateRateService.prototype, 'getBUbasedOnChargeType').and.returnValue(of([]));
    spyOn(CreateDocumentationService.prototype, 'getAgreementLevelDate').and.returnValue(of([]));
    spyOn(OptionalAttributesService.prototype, 'getServiceLevel').and.returnValue(of([]));
    component.createRatesModel.editAccessorialWholeResponse = editResponseElse;
    component.patchValuesToAccessorialRates(editResponseElse);
  });

  it('should call onInputChargeType', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('input', { target: { value: null } });
  });

  it('should call onInputChargeType with value', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="chargeType"]'));
    element.triggerEventHandler('input', { target: { value: 'test' } });
  });

  // it('should call createRateUtilsService.setAccessorialRateValues', () => {
  //   createRateUtilsService.setAccessorialRateValues(component, component.createRatesModel.editAccessorialWholeResponse);
  // });
  // it('it should call patchValuesToAccessorialRates', () => {
  //   component.patchValuesToAccessorialRates(component.createRatesModel.editAccessorialWholeResponse.editRateData);
  // });

  it('it should call EditRateUtility.setValuesToAccessorialRateForm', () => {
    EditRateUtility.setValuesToAccessorialRateForm(component.createRatesModel.editAccessorialWholeResponse.editRateData,
      component.createRatesModel,
      component.optionalFields['optionalAttributesModel'], component.optionalFields, component, component.documentation);
  });
  it('shoul call EditRateUtility.dateFormatter', () => {
    expect(EditRateUtility.dateFormatter('1995-01-01')).toBe('01/01/1995');
  });
  it('it should call EditRateUtility.setValuesForDatesAndChargeTypes', () => {
    EditRateUtility.setValuesForDatesAndChargeTypes(component.createRatesModel.editAccessorialWholeResponse.editRateData,
      component.createRatesModel,
      component, component.optionalFields['optionalAttributesModel'], component.optionalFields, component.documentation);
  });
  it('it should call EditRateUtility.setAgreementLevelDate', () => {
    spyOn(CreateDocumentationService.prototype, 'getAgreementLevelDate').and.returnValues(of(agreemententDetailsResponse));
    EditRateUtility.setAgreementLevelDate(component);
  });
  it('it should call EditRateUtility.populateAgreementLevel', () => {
    EditRateUtility.populateAgreementLevel(agreemententDetailsResponse, component);
    component.createRatesModel.createRatesValidation.agreementEffectiveDate =
      component.createRatesModel.createRatesValidation.effectiveDate;
    component.createRatesModel.createRatesValidation.agreementEndDate = component.createRatesModel.createRatesValidation.expirationDate;
  });
  it('it should call EditRateUtility.populateAgreementLevelelse', () => {
    EditRateUtility.populateAgreementLevel(null, component);
  });
  it('it should call EditRateUtility.getBUbasedOnChargeType', () => {
    spyOn(CreateRateService.prototype, 'getBUbasedOnChargeType').and.returnValues(of(chargeTypeBasedBuResponse));
    EditRateUtility.getBUbasedOnChargeType(2, component, component.createRatesModel.editAccessorialWholeResponse.editRateData,
      component.optionalFields.optionalAttributesModel, component.optionalFields, component.documentation);
  });
  it('it should call EditRateUtility.getBUbasedOnChargeType', () => {
    spyOn(CreateRateService.prototype, 'getBUbasedOnChargeType').and.returnValues(of(chargeTypeBasedBuResponse));
    EditRateUtility.getBUbasedOnChargeType(2, component, editAccessorialNullResponse.editRateData,
      component.optionalFields.optionalAttributesModel, component.optionalFields, component.documentation);
  });
  it('it should call EditRateUtility.setServiceLevelDocumentValues', () => {
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
    EditRateUtility.setServiceLevelDocumentValues(component, component.createRatesModel.editAccessorialWholeResponse.editRateData,
      [2, 3, 4, 5], []);
  });
  it('it should call EditRateUtility.setBusinessUnitServiceOfferingValues', () => {
    EditRateUtility.setBusinessUnitServiceOfferingValues(chargeTypeBasedBuResponse,
      component.createRatesModel.editAccessorialWholeResponse.editRateData, component.optionalFields, component);
  });
  it('it should call EditRateUtility.setBusinessUnitServiceOfferingValueselse', () => {
    const editRate = {
      businessUnitServiceOfferingDTOs: null
    };
    EditRateUtility.setBusinessUnitServiceOfferingValues(chargeTypeBasedBuResponse,
      editRate, component.optionalFields, component);
  });
  it('it should call EditRateUtility.setBusinessUnitServiceOfferingValues', () => {
    component.createRatesModel.editAccessorialWholeResponse = {
      'businessUnitServiceOfferingDTOs': null
    };
    EditRateUtility.setBusinessUnitServiceOfferingValues(chargeTypeBasedBuResponse,
      component.createRatesModel.editAccessorialWholeResponse, component.optionalFields, component);
  });
  it('it should call EditRateUtility.setValuesForEquipments', () => {
    const editRateDataResponse = {
      editRateData: {
        'equipmentCategoryCode': 'Chassis',
        'equipmentTypeDescription': 'x',
        'equipmentLengthId': 95,
        'equipmentLength': 44,
        'equipmentTypeId': null,
        'equipmentLengthDescription': 'Feet'
      }
    };
    EditRateUtility.setValuesForEquipments(editRateDataResponse.editRateData,
      component.optionalFields.optionalAttributesModel, component.optionalFields);
  });
  it('it should call EditRateUtility.setCurrencyCode', () => {
    component.createRatesModel.editAccessorialWholeResponse.currencyCode = 'USD';
    spyOn(CreateDocumentationService.prototype, 'getCurrencyCodes').and.returnValue(of(['USD']));
    EditRateUtility.setCurrencyCode(component);
  });
  it('it should call EditRateUtility.setCheckBoxAttributes', () => {
    component.createRatesModel.editAccessorialWholeResponse.editRateData.waived = true;
    component.createRatesModel.editAccessorialWholeResponse.editRateData.calculateRateManually = false;
    component.createRatesModel.editAccessorialWholeResponse.editRateData.passThrough = false;
    component.createRatesModel.editAccessorialWholeResponse.editRateData.rateSetupStatus = false;
    EditRateUtility.setCheckBoxAttributes(component.createRatesModel.editAccessorialWholeResponse.editRateData, component);
  });
  it('it should call EditRateUtility.checkRatesLevel', () => {
    component.createRatesModel.editAccessorialWholeResponse.editRateData.level = 'Agreement';
    EditRateUtility.checkRatesLevel(component.createRatesModel.editAccessorialWholeResponse.editRateData, component.createRatesModel);
    component.createRatesModel.editAccessorialWholeResponse.editRateData.level = 'Contract';
    EditRateUtility.checkRatesLevel(component.createRatesModel.editAccessorialWholeResponse.editRateData, component.createRatesModel);
    component.createRatesModel.editAccessorialWholeResponse.editRateData.level = 'Section';
    component.createRatesModel.editAccessorialWholeResponse.editRateData.section = ['abc', 'abc'];
    component.createRatesModel.editAccessorialWholeResponse.editRateData.sectionAccounts = ['abc', 'abc'];
    EditRateUtility.checkRatesLevel(component.createRatesModel.editAccessorialWholeResponse.editRateData, component.createRatesModel);
  });
  it('it should call EditRateUtility.setContractLevel', () => {
    component.createRatesModel.editAccessorialWholeResponse.editRateData.level = 'Section';
    component.createRatesModel.editAccessorialWholeResponse.editRateData.contracts = ['abc', 'abc'];
    component.createRatesModel.editAccessorialWholeResponse.editRateData.sectionAccounts = ['abc', 'abc'];
    EditRateUtility.setContractLevel(component.createRatesModel.editAccessorialWholeResponse.editRateData, component.createRatesModel);
  });
  it('it should cal onSaveCloseClicked', () => {
    component.onSaveCloseClicked();
  });
  it('it should cal setEditRateFlagToFalse', () => {
    component.setEditRateFlagToFalse(true);
  });
  it('it should cal createDocumentationElse', () => {
    component.createDocumentation(false);
  });
  it('it should cal onDontSaveNavigate', () => {
    component.createRatesModel.createRatesValidation.routingUrl = '/viewagreement?id=4';
    component.agreementURL = '/viewagreement?id=4';
    component.lineHaulUrl = '/viewagreement';
    component.onDontSaveNavigate();
  });
  it('it should cal canDeactivate', () => {
    component.createRatesModel.contractChecked = true;
    component.createRatesModel.popUpCoseFlag = false;
    component.createRatesModel.isCancelClicked = false;
    const nextState = {
      'url': '/viewagreement',
      'root': null
    };
    component.canDeactivate(null, null, null, nextState);
  });
  it('it should cal canDeactivateElse', () => {
    component.createRatesModel.popUpCoseFlag = false;
    component.createRatesModel.isCancelClicked = false;
    const nextState = {
      'url': '/viewagreement',
      'root': null
    };
    component.canDeactivate(null, null, null, nextState);
  });
  it('it should cal onDontSaveNavigateElse', () => {
    component.createRatesModel.createRatesValidation.routingUrl = '/viewagreement?id=4';
    component.agreementURL = '';
    component.lineHaulUrl = '/viewagreement';
    component.onDontSaveNavigate();
  });
  it('should cal showDuplicateRateErrorFunction', () => {
    const ratesError = {
      'name': 'string',
      'message': 'string',
      'error': {
        'errors': [
          {
            'code': 'RATES_DUPLICATE_EXISTS'
          }
        ]
      }
    };
    component.showDuplicateRateError(ratesError);
  });
  it('should cal showDuplicateRateErrorFunctionElse', () => {
    const ratesError = {
      'name': 'string',
      'message': 'string',
      'error': {
        'errors': [
          {
            'code': 'RATES'
          }
        ]
      }
    };
    component.showDuplicateRateError(ratesError);
  });
  it('should cal removeDocumentation', () => {
    component.documentation = viewDocumentationComponent;
    component.documentation.viewDocumentationModel.docIsLegalText = true;
    component.removeDocumentation();
  });
  it('should cal onRemoveRates', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = new FormGroup({
      rates: new FormArray([component.addRates.createRateItem()]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    component.onRemoveRates();
  });
  it('should cal onRemoveStairStepRates', () => {
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    component.onRemoveStairStepRates();
  });
  it('should cal removeAllStairStepRates', () => {
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    component.removeAllStairStepRates();
  });
  it('should cal removeAllStairStepRatesElse', () => {
    component.addStairStepRates = addStairStepComponent;
    const addStairStepRatesformnull = new FormGroup({
      rateType: new FormControl('', [Validators.required]),
      minAmount: new FormControl(''),
      maxAmount: new FormControl(''),
      rounding: new FormControl('', []),
      maxApplidedWhen: new FormControl(''),
      itemizeRates: new FormControl(false),
      stepsArray: new FormArray([component.addStairStepRates.createStepsItem()])
    });
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesformnull;
    component.removeAllStairStepRates();
  });
  it('should cal removeAllRates', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = new FormGroup({
      rates: new FormArray([component.addRates.createRateItem()]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    component.addRates.addRatesModel.addRateForm.controls.rates['controls'][0]['controls']['rateType'].setValue('1');
    component.removeAllRates();
  });
  it('should cal removeAllRatesElse', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = new FormGroup({
      rates: new FormArray([component.addRates.createRateItem()]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    component.removeAllRates();
  });
  it('should cal onAddStairStepRates', () => {
    component.onAddStairStepRates();
  });
  it('should cal removeAllAdditionalCharges', () => {
    component.removeAllAdditionalCharges();
  });
  it('should cal onAdditonalChargesClicked', () => {
    component.onAdditonalChargesClicked();
  });
  it('should cal checkDirty', () => {
    component.checkDirty();
  });
  it('it should cal cancelCheck', () => {
    component.createRatesModel.sectionChecked = true;
    component.cancelCheck();
    expect(component.cancelCheck).toBeTruthy();
  });
  it('should cal onHidePop', () => {
    component.onHidePop('rateNavigateCancel');
  });
  it('should cal allowZeroInAddedFields', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = addRatesFormGroup;
    component.addRates.addRatesModel.addRateForm.controls.rates['controls'][0]['controls']['rateAmount'].setValue('0');
    component.allowZeroInAddedFields();
  });
  it('should cal restrictZeroInAddedFields', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = addRatesFormGroup;
    component.addRates.addRatesModel.addRateForm.controls.rates['controls'][0]['controls']['rateAmount'].setValue('0');
    component.restrictZeroInAddedFields();
  });
  it('should cal onRollUpChecked', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = addRatesFormGroup;
    component.createRatesModel.isAddRateClicked = true;
    component.onRollUpChecked(true);
  });
  it('should cal onRollUpCheckedElse', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = addRatesFormGroup;
    component.createRatesModel.isAddRateClicked = true;
    component.onRollUpChecked(false);
  });
  it('should cal onRollUpCheckedElse2', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = addRatesFormGroup;
    component.createRatesModel.isAddRateClicked = false;
    component.onRollUpChecked(false);
  });
  it('should cal onPassThroughChecked', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = addRatesFormGroup;
    component.createRatesModel.isAddRateClicked = true;
    component.createRatesModel.CheckBoxAttributes.rollUp = false;
    component.onPassThroughChecked(true);
  });
  it('should cal onPassThroughCheckedElse', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = addRatesFormGroup;
    component.createRatesModel.isAddRateClicked = true;
    component.createRatesModel.CheckBoxAttributes.rollUp = true;
    component.onPassThroughChecked(false);
  });
  it('should cal onPassThroughCheckedElse2', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = addRatesFormGroup;
    component.createRatesModel.isAddRateClicked = false;
    component.onPassThroughChecked(false);
  });
  it('should cal onCalulateRateManuallyChecked', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = addRatesFormGroup;
    component.createRatesModel.isAddRateClicked = true;
    component.createRatesModel.CheckBoxAttributes.rollUp = false;
    component.onCalulateRateManuallyChecked(false);
  });
  it('should cal onCalulateRateManuallyCheckedElse', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = addRatesFormGroup;
    component.createRatesModel.isAddRateClicked = false;
    component.createRatesModel.CheckBoxAttributes.rollUp = false;
    component.onCalulateRateManuallyChecked(false);
  });
  it('should cal onWaivedCheckboxSelect', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = addRatesFormGroup;
    component.createRatesModel.isAddRateClicked = true;
    component.createRatesModel.CheckBoxAttributes.rollUp = false;
    component.onWaivedCheckboxSelect(true);
  });
  it('should cal onWaivedCheckboxSelectElse', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = addRatesFormGroup;
    component.createRatesModel.isAddRateClicked = true;
    component.createRatesModel.CheckBoxAttributes.rollUp = false;
    component.onWaivedCheckboxSelect(false);
  });
  it('it should cal on onCurrencyTypeBlur', () => {
    const event = {
      target: {
        'value': ''
      }
    };
    component.createRatesModel.ratesForm.controls['currency'].setValue('ab');
    event.target.value = null;
    component.onCurrencyTypeBlur(event);
  });
  it('it should cal on onCurrencyTypeBlurElse', () => {
    const event = {
      target: {
        'value': 'happy'
      }
    };
    component.createRatesModel.ratesForm.controls['currency'].setValue('ab');
    event.target.value = null;
    component.onCurrencyTypeBlur(event);
  });
  it('it should cal on navigateToViewAgreementPage', () => {
    component.createRatesModel.isSaveCreateNewClicked = false;
    component.createRatesModel.isSaveCreateCopyClicked = false;
    component.navigateToViewAgreementPage('String');
  });
  it('it should cal on navigateToViewAgreementPageif2', () => {
    component.createRatesModel.isSaveCreateNewClicked = false;
    component.createRatesModel.isSaveCreateCopyClicked = true;
    component.navigateToViewAgreementPage('String');
  });
  it('it should cal on navigateToViewAgreementPageelse', () => {
    component.createRatesModel.isSaveCreateNewClicked = true;
    component.createRatesModel.isSaveCreateCopyClicked = false;
    component.navigateToViewAgreementPage('String');
  });
  it('it should cal on getQuantityTypeValues', () => {
    const quantityValue = {
      '_embedded': {
        'accessorialRateAlternateChargeQuantityTypes': [
          {
            '@id': 1,
            'createTimestamp': '2019-05-24T14:32:06.0908071',
            'createProgramName': 'SSIS',
            'lastUpdateProgramName': 'SSIS',
            'createUserId': 'PIDNEXT',
            'lastUpdateUserId': 'PIDNEXT',
            'accessorialRateAlternateChargeQuantityTypeId': 5,
            'accessorialRateChargeQuantityTypeName': 'HOUR',
            'effectiveDate': '2019-05-24',
            'expirationDate': '2099-12-31',
            'lastUpdateTimestampString': '2019-05-24T14:32:06.0908071',
            '_links': {
              'self': {
                'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/customeragreementsquantitytypes/5'
              },
              'accessorialRateAlternateChargeQuantityType': {
                'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/customeragreementsquantitytypes/5'
              }
            }
          }
        ]
      },
      '_links': {
        'self': {
          'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/customeragreementsquantitytypes{?page,size,sort}',
          'templated': true
        },
        'profile': {
          'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/profile/customeragreementsquantitytypes'
        }
      },
      'page': {
        'size': 50,
        'totalElements': 5,
        'totalPages': 1,
        'number': 0
      }
    };
    component.populateQuantityValues(quantityValue);
  });
  it('should call getNotificationType', () => {
    component.getQuantityTypeValues();
    spyOn(CreateRateService.prototype, 'getQuantityType').and.callThrough();
  });
  it('should call populateQuantityValuesElse', () => {
    component.populateQuantityValues(null);
  });
  it('should call checkForValidRateWithoutFree', () => {
    component.createRatesModel.isAddStairStepClicked = true;
    component.addStairStepRates = addStairStepComponent;
    const addStairStepRatesformValue = formBuilder.group({
      rateType: new FormControl('', [Validators.required]),
      minAmount: new FormControl('2'),
      maxAmount: new FormControl('4'),
      rounding: new FormControl('Down', []),
      maxApplidedWhen: new FormControl('Steps Are Exceeded'),
      itemizeRates: new FormControl(false),
      stepsArray: new FormArray([new FormGroup({
        step: new FormControl({
          label: 'Free',
          value: 0
        }, [Validators.required]),
        fromQuantity: new FormControl('2', [Validators.required]),
        toQuantity: new FormControl('4', [Validators.required]),
        rateAmount: new FormControl('2.00')
      })
      ])
    });
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesformValue;
    component.checkForValidRateWithoutFree();
  });
  it('should call checkForValidRateWithoutFreeElse', () => {
    component.createRatesModel.isAddStairStepClicked = false;
    component.checkForValidRateWithoutFree();
  });
  it('should call checkForValidRateWithoutFreeElse', () => {
    const chargeTypeValue = [
      {
        'chargeTypeID': 64,
        'chargeTypeCode': 'ADMIN',
        'chargeTypeName': 'Administration Fee',
        'chargeTypeDescription': 'Additional fees incurred for processing of charges.',
        'chargeTypeBusinessUnitServiceOfferingAssociations': [
          {
            'chargeTypeBusinessUnitServiceOfferingAssociationID': 640,
            'chargeTypeID': null,
            'financeBusinessUnitServiceOfferingAssociation': {
              'financeBusinessUnitServiceOfferingAssociationID': 4,
              'financeBusinessUnitCode': 'DCS',
              'serviceOfferingCode': 'Backhaul'
            },
            'financeChargeUsageTypeID': 1,
            'effectiveDate': '2019-01-01',
            'expirationDate': '2099-12-31'
          }
        ]
      }
    ];
    spyOn(CreateRateService.prototype, 'getChargeTypes').and.returnValue(of(chargeTypeValue));
    component.getChargeTypes();
  });
  it('should call checkForValidRateWithoutFreeElse', () => {
    const event = '';
    component.onBusinessUnitShow(event);
  });
  it('should call busoselect', () => {
    const event = '';
    component.createRatesModel.ratesForm.controls['chargeType'].setValue(null);
    component.busoselect(event);
  });
  it('should call busoselectElse', () => {
    const event = '';
    component.createRatesModel.ratesForm.controls['chargeType'].setValue('data');
    component.busoselect(event);
  });
  it('should call selectedBuSoOnly', () => {
    const event = '';
    component.selectedBuSoOnly(event);
  });
  it('should call getCurrencyCode', () => {
    const currencyValue = [
      'usd',
      'cad'
    ];
    spyOn(CreateRateService.prototype, 'getCurrencyCodes').and.returnValue(of(currencyValue));
    component.getCurrencyCode();
  });
  it('should call getCurrencyCodenull', () => {
    spyOn(CreateRateService.prototype, 'getCurrencyCodes').and.returnValue(of(null));
    component.getCurrencyCode();
  });
  it('should call setAgreementLevelDate', () => {
    const documentationate = {
      'agreementDefaultAmount': 100000,
      'agreementEffectiveDate': '1995-01-01',
      'agreementExpirationDate': '2099-12-31',
      'agreementID': 4,
      'customerContractDetailDTO': null,
      'customerSectionDetailDTO': null
    };
    spyOn(CreateDocumentationService.prototype, 'getAgreementLevelDate').and.returnValue(of(documentationate));
    component.setAgreementLevelDate();
    component.populateAgreementLevel(documentationate);
  });
  it('should call setAgreementLevelDate', () => {
    const checkBoxData = {
      '_embedded': {
        'customerAccessorialRateCriteriaTypes': [
          {
            '@id': 1,
            'createTimestamp': '2019-05-24T14:30:54.5899704',
            'createProgramName': 'SSIS',
            'lastUpdateProgramName': 'SSIS',
            'createUserId': 'PIDNEXT',
            'lastUpdateUserId': 'PIDNEXT',
            'customerAccessorialRateCriteriaTypeId': 5,
            'customerAccessorialRateCriteriaName': 'Waived',
            'effectiveDate': '2019-05-24',
            'expirationDate': '2099-12-31',
            'lastUpdateTimestampString': '2019-05-24T14:30:54.5899704',
            '_links': {
              'self': {
                'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/customerAccessorialRateCriteriaTypes/5'
              },
              'customerAccessorialRateCriteriaType': {
                'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/customerAccessorialRateCriteriaTypes/5'
              }
            }
          }
        ]
      },
      '_links': {
        'self': {
          'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/customerAccessorialRateCriteriaTypes{?page,size,sort}',
          'templated': true
        },
        'profile': {
          'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/profile/customerAccessorialRateCriteriaTypes'
        }
      },
      'page': {
        'size': 50,
        'totalElements': 4,
        'totalPages': 1,
        'number': 0
      }
    };
    spyOn(CreateRateService.prototype, 'getCheckBoxData').and.returnValue(of(checkBoxData));
    component.getCheckBoxData();
  });
  it('it should cal onClearDropDown', () => {
    component.onClearDropDown('chargeType');
  });
  it('it should cal onselect onSelectAlternateChargeTypeElse', () => {
    const event = {
      label: null,
      value: null,
      description: null
    };
    component.onSelectAlternateChargeType(event);
  });
  it('it should cal onQuantityBlurIF', () => {
    const value = 'quantityType';
    component.createRatesModel.ratesForm.controls.quantity.setValue('123.01');
    component.onQuantityBlur('123.01');
    expect(component.onQuantityBlur).toBeTruthy();
  });
  it('it should cal onQuantityBlurelse', () => {
    const value = 'quantityType';
    component.createRatesModel.ratesForm.controls.quantity.setValue('123.01');
    component.onQuantityBlur(value);
    expect(component.onQuantityBlur).toBeTruthy();
  });
  it('it should cal onQuantityBlurIFelse', () => {
    const value = 'quantityType';
    component.createRatesModel.ratesForm.controls.quantity.setValue('-1');
    component.onQuantityBlur(value);
    expect(component.onQuantityBlur).toBeTruthy();
  });
  it('it should cal on typedDateValidate expirationDate', () => {
    let fieldName;
    fieldName = 'expirationDate';
    const event = {
      srcElement: {
        'value': '04/11/2019'
      }
    };
    component.createRatesModel.ratesForm.controls['expirationDate'].setValue('04/11/2019');
    component.typedDateValidate(event, fieldName);
    expect(component.typedDateValidate).toBeTruthy();
  });
  it('it should cal on validateDate effectiveDate', () => {
    let fieldName;
    fieldName = 'effectiveDate';
    const date = new Date('04/11/2020');
    component.createRatesModel.createRatesValidation.agreementEffectiveDate = '04/11/2019';
    component.createRatesModel.createRatesValidation.agreementEndDate = '04/11/2019';
    component.createRatesModel.superUserBackDateDays = 0;
    component.createRatesModel.superUserFutureDateDays = 0;
    component.validateDate(date, fieldName);
    expect(component.typedDateValidate).toBeTruthy();
  });
  it('it should cal on validateDate effectiveDate', () => {
    let fieldName;
    fieldName = 'effectiveDate';
    const date = new Date('04/11/2018');
    component.createRatesModel.createRatesValidation.agreementEffectiveDate = '04/11/2017';
    component.createRatesModel.createRatesValidation.agreementEndDate = '04/11/2019';
    component.createRatesModel.superUserBackDateDays = 0;
    component.createRatesModel.superUserFutureDateDays = 0;
    component.validateDate(date, fieldName);
    expect(component.typedDateValidate).toBeTruthy();
  });
  it('it should cal on validateDate expirationDate', () => {
    let fieldName;
    fieldName = 'expirationDate';
    const date = new Date('04/11/2020');
    component.createRatesModel.createRatesValidation.agreementEffectiveDate = '04/11/2019';
    component.createRatesModel.createRatesValidation.agreementEndDate = '04/11/2019';
    component.createRatesModel.superUserBackDateDays = 0;
    component.createRatesModel.superUserFutureDateDays = 0;
    component.validateDate(date, fieldName);
    expect(component.typedDateValidate).toBeTruthy();
  });
  it('it should cal on validateDate expirationDate', () => {
    let fieldName;
    fieldName = 'expirationDate';
    const date = new Date('04/11/2020');
    component.createRatesModel.createRatesValidation.agreementEffectiveDate = '04/11/2017';
    component.createRatesModel.createRatesValidation.agreementEndDate = '04/11/2021';
    component.createRatesModel.superUserBackDateDays = 0;
    component.createRatesModel.superUserFutureDateDays = 0;
    component.validateDate(date, fieldName);
    expect(component.typedDateValidate).toBeTruthy();
  });

  it('should call optionalUtilityService.setDocumentationValid', () => {
    component.validateFieldsForDocumentation(true);
  });
  it('should call optionalUtilityService.setDocumentationValid', () => {
    component.effectiveandChargeTypeValidation();
  });

});
