import {ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '../../../../../../app.module';

import { ViewAgreementDetailsModule } from './../../../../../view-agreement-details/view-agreement-details.module';
import { CreateRateUtilityService } from './create-rate-utility.service';
import { CreateRatesComponent } from '../create-rates.component';
import { AdditionalChargesModel
} from './../../../../../shared/accessorials/additional-charges/additional-charges/model/additional-charges-model';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { AddRatesModel } from '../../add-rates/model/add-rates.model';
import { AddRatesComponent } from '../../add-rates/add-rates.component';
import { ContractTypesItemInterface } from '../../../shared/contract-list/model/contract-list.interface';
import { ContractListComponent } from '../../../shared/contract-list/contract-list.component';
import { AddStairStepComponent } from './../../../../../shared/accessorials/stair-step/add-stair-step/add-stair-step.component';
import {
  AdditionalChargesComponent
} from './../../../../../shared/accessorials/additional-charges/additional-charges/additional-charges.component';

describe('CreateDocumentationUtilsService', () => {
  let component: CreateRatesComponent;
  let fixture: ComponentFixture<CreateRatesComponent>;
 let contractComponent: ContractListComponent;
  let contractFixture: ComponentFixture<ContractListComponent>;
  let service: CreateRateUtilityService;
  let http: HttpClient;
  let accessorialForm;
  let addRateFormGroup;
  let rateForm: FormGroup;
  const formBuilder: FormBuilder = new FormBuilder();
  let contractElement: ContractTypesItemInterface;
  let selectedBillTo;
  let contractValue;
  let sectionValue;
  let selectedElement;
  let businessUnitValues;
  const optionalRateFormBuilder: FormBuilder = new FormBuilder();
  let optionalRateFormGroup: FormGroup;
  let serviceLevel;
  let businessUnit;
  let addStairStepRatesform;
  let addChargesForm;
  let addStairStepComponent: AddStairStepComponent;
  let fixtureaddStairStepComponent: ComponentFixture<AddStairStepComponent>;
  let additionalChargesComponent: AdditionalChargesComponent;
  let fixtureadditionalChargesComponent: ComponentFixture<AdditionalChargesComponent>;
  let addComponent: AddRatesComponent;
  let addComponentFixture: ComponentFixture<AddRatesComponent>;
  let additionalChargesModel: AdditionalChargesModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [CreateRateUtilityService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRatesComponent);
    component = fixture.componentInstance;
    contractFixture = TestBed.createComponent(ContractListComponent);
    contractComponent = contractFixture.componentInstance;
    fixtureaddStairStepComponent = TestBed.createComponent(AddStairStepComponent);
    addStairStepComponent = fixtureaddStairStepComponent.componentInstance;
    fixtureadditionalChargesComponent = TestBed.createComponent(AdditionalChargesComponent);
    additionalChargesComponent = fixtureadditionalChargesComponent.componentInstance;
    addComponentFixture = TestBed.createComponent(AddRatesComponent);
    addComponent = addComponentFixture.componentInstance;
    service = TestBed.get(CreateRateUtilityService);
    http = TestBed.get(HttpClient);
    const formGroup = new FormGroup({
      chargeType: new FormControl('', [Validators.required]),
      rateType: new FormControl('', [Validators.required]),
      rateAmount: new FormControl('', [Validators.required, Validators.pattern('[-0-9., ]*')])
    });
    const amountPattern = '[-0-9., ]*';
    addRateFormGroup = formBuilder.group({
      rates: new FormArray([ new FormGroup({
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
    addChargesForm = new FormGroup({
      charges: new FormArray([formGroup])
    });
    accessorialForm = new FormGroup({
      customerName: new FormControl('abc', [Validators.required]),
      chargeType: new FormControl([{
            'label': 'Congestion Charge (CONGESTION)',
            'value': 62,
            'description': 'CONGESTION'
          }], [Validators.required]),
      effectiveDate: new FormControl(new Date('07/29/2019'), [Validators.required]),
      expirationDate: new FormControl(new Date('07/31/2019'), [Validators.required]),
      currency: new FormControl('USD', [Validators.required]),
    });
    contractElement = {
      customerAgreementContractID: 1,
      customerContractName: 'string',
      customerContractNumber: 'string',
      contractTypeID: 1,
      contractTypeName: 'string',
      effectiveDate: 'string',
      expirationDate: 'string',
      isChecked: true
    };
    additionalChargesModel = {
      subscribeFlag: true,
      selectedChargeType: {
        'label': 'Congestion Charge (CONGESTION)',
        'value': 62,
        'description': 'CONGESTION'
      },
      addChargesForm: new FormGroup({
        charges: new FormArray([formGroup])
      }),
      rateTypes: [{label: 'USD', value: 1}],
      chargeType: [{
        'label': 'Congestion Charge (CONGESTION)',
        'value': 62,
        'description': 'CONGESTION'
      },
      {
        'label': 'Deadhead Miles (DEADHDMILE)',
        'description': 'DEADHDMILE',
        'value': 78
      }],
      chargeTypeSuggestions: [{
        'label': 'Congestion Charge (CONGESTION)',
        'value': 62,
        'description': 'CONGESTION'
      },
      {
        'label': 'Deadhead Miles (DEADHDMILE)',
        'description': 'DEADHDMILE',
        'value': 78
      }],
      showMinuIcon: true,
      showRemoveAllConfirmPop: true,
      invalidChargeType: true,
      invalidChargeTypeSummary: 'string',
      invalidChargeTypeDetail: 'string',
      buSoIds: [201, 202],
      rateTypesArray: [],
      rateTypeSuggestions: [],
      chargeCodeResponse: [{
        'chargeTypeID': 42,
        'chargeTypeCode': 'BOBTAIL',
        'chargeTypeName': 'Bobtail',
        'chargeTypeDescription': null,
        'chargeTypeBusinessUnitServiceOfferingAssociations': [{
          'chargeTypeBusinessUnitServiceOfferingAssociationID': 536,
          'chargeTypeID': null,
          'financeBusinessUnitServiceOfferingAssociation': {
            'financeBusinessUnitServiceOfferingAssociationID': 4,
            'financeBusinessUnitCode': 'DCS',
            'serviceOfferingCode': 'Backhaul'
          },
          'financeChargeUsageTypeID': 1,
          'effectiveDate': '2018-12-01',
          'expirationDate': '2099-12-31'
        }, {
          'chargeTypeBusinessUnitServiceOfferingAssociationID': 542,
          'chargeTypeID': null,
          'financeBusinessUnitServiceOfferingAssociation': {
            'financeBusinessUnitServiceOfferingAssociationID': 1,
            'financeBusinessUnitCode': 'JBT',
            'serviceOfferingCode': 'OTR'
          },
          'financeChargeUsageTypeID': 1,
          'effectiveDate': '2018-12-01',
          'expirationDate': '2099-12-31'
        }]
      }],
     rateAmountValues: [1.1],
      rateTypeLoading: true,
      isAddchargesEditRateClicked: true,
      editAdditionalChargeResponse: [{
        customerAccessorialAdditionalChargeId: 1143,
        additionalChargeTypeId: 1,
        additionalChargeTypeName: 'Congestion Charge (CONGESTION)',
        additionalChargeCodeName: 'Congestion Charge (CONGESTION)',
        accessorialRateTypeName: 'string',
        accessorialRateTypeId: 4,
        rateAmount: 100,
      }]
    };
    rateForm = formBuilder.group({
      sourceIdentifier: new FormControl('', Validators.pattern(amountPattern)),
      sourceLineHaulIdentifier: new FormControl('', Validators.pattern(amountPattern)),
      rates: new FormControl([], Validators.pattern(amountPattern)),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    optionalRateFormGroup = optionalRateFormBuilder.group({
      businessUnit: ['ICS'],
      serviceLevel: ['abc', Validators.required],
     requestedService: ['abcd', Validators.required],
      equipmentCategory: [''],
      equipmentType: [''],
      equipmentLength: [''],
      carriers: [[]],
      waived: [{label: 'waived', value: 'waived'}],
      calculateRate: [{label: 'abc', value: 'abc'}],
      passThrough: [{label: 'abc', value: 'abc'}],
      rollUp: [{label: 'abc', value: 'abc'}]
    });
    component.createRatesModel.ratesForm = optionalRateFormGroup;
    selectedBillTo  = [{
      'customerAgreementID': 1234,
      'customerAgreementName': 'test',
      'effectiveDate': '2018-12-28',
      'expirationDate': '2018-12-29',
      'customerAgreementContractSectionAccountID': 123,
      'billingPartyID': 123,
      'customerAgreementContractSectionID': 546,
      'customerAgreementContractSectionName': 'Section 1',
      'customerAgreementContractID': 567,
      'customerContractName': 'Conytract 1',
      'billToDetailsDTO': {
        'billToID': 123,
        'billToCode': 'Bill 1',
        'billToName': 'Bill To 1'
      }
    }];
    contractValue = [{
      customerAgreementContractID: 1,
      customerContractName: 'string',
      customerContractNumber: 'string',
      contractTypeID: 1,
      contractTypeName: 'string',
      effectiveDate: 'string',
      expirationDate: 'string',
      isChecked: true
    }];
    sectionValue = [{
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
    selectedElement = [{
      'customerAccessorialAccountId': 1,
      'customerAgreementContractSectionId': 2,
      'customerAgreementContractSectionName': 'Documentation',
      'customerAgreementContractId': 2,
      'customerAgreementContractName': 'Document',
      'customerAgreementContractSectionAccountId': 1,
      'customerAgreementContractSectionAccountName': 'Sample'
    }];
    businessUnitValues = {
        financeBusinessUnitServiceOfferingAssociationID: 1,
        financeBusinessUnitCode: 'test',
        serviceOfferingCode: 'test',
        serviceOfferingDescription: 'test',
        effectiveTimestamp: 'test',
        expirationTimestamp: 'test',
        lastUpdateTimestampString: 'test'
    };
    serviceLevel = {
        'financeBusinessUnitServiceOfferingAssociation' : {
          financeBusinessUnitServiceOfferingAssociationID: 1,
          financeBusinessUnitCode: 'test',
          serviceOfferingCode: 'test',
          serviceOfferingDescription: 'test',
          effectiveTimestamp: 'test',
          expirationTimestamp: 'test',
          lastUpdateTimestampString: 'test'
        },
    };
    businessUnit = {
      serviceLevel: {
        serviceLevelCode: 'test',
        serviceLevelDescription: 'test'
      },
    };
  });

  it('should be created', inject([CreateRateUtilityService], () => {
    expect(service).toBeTruthy();
  }));
  it('should be getCurrencyValue for if', () => {
    service.getCurrencyValue(accessorialForm);
  });
  it('should be getAlternateChargeDetails', () => {
    component.createRatesModel.ratesForm = optionalRateFormGroup;
    component.createRatesModel.ratesForm.addControl('quantityType', new FormControl({label: 'Hour', value: 'Hour'}, Validators.required));
    component.createRatesModel.ratesForm.addControl('alternateChargeType', new
      FormControl([{label: 'BOBTAIL', value: 'BOBTAIL'}], Validators.required));
    component.createRatesModel.ratesForm.addControl('quantity', new FormControl({label: 'Hour', value: 1}, Validators.required));
    service.getAlternateChargeDetails(component.createRatesModel);
  });
  it('should be getAlternateChargeObject', () => {
    component.createRatesModel.ratesForm = optionalRateFormGroup;
    component.createRatesModel.ratesForm.addControl('quantityType', new FormControl({label: 'Hour', value: 'Hour'}, Validators.required));
    component.createRatesModel.ratesForm.addControl('alternateChargeType', new
      FormControl([{label: 'BOBTAIL', value: 'BOBTAIL'}], Validators.required));
    component.createRatesModel.ratesForm.addControl('quantity', new FormControl({label: 'Hour', value: 1}, Validators.required));
    const quantity = {label: 'Hour', value: 1};
    service.getAlternateChargeObject(component.createRatesModel, quantity);
  });
  it('should be getRateLevel for if ', () => {
    component.createRatesModel.selectedContractValue = contractValue;
    service.getRateLevel(component.createRatesModel);
  });
  it('should be getRateLevel for else if', () => {
    component.createRatesModel.selectedSectionValue = sectionValue;
    service.getRateLevel(component.createRatesModel);
  });
  it('should be getRateLevel for else', () => {
    contractValue = [];
    component.createRatesModel.selectedContractValue = contractValue;
    sectionValue = [];
    component.createRatesModel.selectedSectionValue = sectionValue;
    service.getRateLevel(component.createRatesModel);
  });
  it('should be iterateContractSection for if', () => {
    component.billTo['billToModel'].selectedBillTo = selectedBillTo;
    service.iterateContractSection(component.createRatesModel, component.billTo['billToModel']);
  });
  it('should be iterateContractSection for else', () => {
    selectedBillTo  = [];
    component.billTo['billToModel'].selectedBillTo = selectedBillTo;
    service.iterateContractSection(component.createRatesModel, component.billTo['billToModel']);
  });
  it('should be iterateBillTos for if', () => {
    contractValue = [];
    component.createRatesModel.selectedContractValue = contractValue;
    sectionValue = [];
    component.createRatesModel.selectedSectionValue = sectionValue;
    service.iterateBillTos(component.createRatesModel, component.billTo['billToModel']);
  });
  it('should be iterateBillTos for else if', () => {
    component.createRatesModel.selectedContractValue = contractValue;
    service.iterateBillTos(component.createRatesModel, component.billTo['billToModel']);
  });
  it('should be iterateBillTos for else else', () => {
    component.createRatesModel.selectedSectionValue = sectionValue;
    service.iterateBillTos(component.createRatesModel, component.billTo['billToModel']);
  });
  it('should be iterateBillToContract', () => {
    component.billTo['billToModel'].selectedBillTo = selectedBillTo;
    contractElement.customerAgreementContractID = 1234;
    component.createRatesModel.selectedContractValue = contractValue;
    service.iterateBillTos(component.createRatesModel, component.billTo['billToModel']);
  });
  it('should be iterateBillToSection', () => {
    component.billTo['billToModel'].selectedBillTo = selectedBillTo;
    contractElement.customerAgreementContractID = 1234;
    component.createRatesModel.selectedSectionValue = sectionValue;
    service.iterateBillTos(component.createRatesModel, component.billTo['billToModel']);
  });
  it('should be setAccountValue', () => {
    service.setAccountValue(contractElement);
  });
  it('should be iterateContractSectionBillTo for if', () => {
    component.createRatesModel.selectedContractValue = contractValue;
    service.iterateContractSectionBillTo(component.createRatesModel);
  });
  it('should be iterateContractSectionBillTo for else', () => {
    component.createRatesModel.selectedSectionValue = sectionValue;
    service.iterateContractSectionBillTo(component.createRatesModel);
  });
  it('should be iterateContractBillTo', () => {
    component.createRatesModel.selectedSectionValue = sectionValue;
    service.iterateContractBillTo(selectedElement);
  });
  it('should be iterateBusinessUnitValues', () => {
    component.optionalFields['optionalAttributesModel'].optionalForm = optionalRateFormGroup;
    service.iterateBusinessUnitValues(component.optionalFields['optionalAttributesModel']);
  });
  it('should be iterateRequestedService', () => {
    component.optionalFields['optionalAttributesModel'].optionalForm = optionalRateFormGroup;
    component.optionalFields['optionalAttributesModel'].optionalForm.controls['requestedService'].setValue(['abc', 'abc']);
    service.iterateRequestedService(component.optionalFields['optionalAttributesModel']);
  });
  it('should be iterateCarriers', () => {
    component.optionalFields['optionalAttributesModel'].optionalForm = optionalRateFormGroup;
    component.optionalFields['optionalAttributesModel'].optionalForm.controls['carriers']
      .setValue([{value: {id: '1', code: 'test', name: 'test'}, label: 'test'}]);
    service.iterateCarriers(component.optionalFields['optionalAttributesModel']);
  });
  it('should be postDateFormatter', () => {
    service.postDateFormatter(new Date('07/30/2019'));
  });
  it('should be postRateCriteriaFramer for waived', () => {
    component.createRatesModel.ratesForm = optionalRateFormGroup;
    component.createRatesModel.checkBoxValue = [
      {label: 'Waived', value: 'Waived'},
      {label: 'Calculate Rate Manually', value: 'Calculate Rate Manually'},
      {label: 'Pass Through', value: 'Pass Through'},
      {label: 'Roll Up', value: 'Roll Up'}];
    service.postRateCriteriaFramer(component.createRatesModel);
  });
  it('should be checkContractValidity', () => {
    component.contract = { 'contractListModel': { 'selectedContract': contractValue } };
    service.checkContractValidity(component);
  });
  it('should be checkSectionValidity', () => {
    component.sectionListModel = { 'sectionsModel': { 'dataSelected': sectionValue } };
    service.checkSectionValidity(component);
  });
  it('should be checkBillToValidity', () => {
    component.billTo = { 'billToModel': { 'dataSelected': selectedBillTo } };
    service.checkBillToValidity(component);
  });
  it('should be onValidateForm for 2nd if', () => {
    component.createRatesModel.ratesForm = optionalRateFormGroup;
    component.createRatesModel.ratesForm.addControl('documentationLevel', new FormControl('contract', Validators.required));
    component.contract = { 'contractListModel': { 'selectedContract': contractValue } };
    component.sectionListModel = { 'sectionsModel': { 'dataSelected': sectionValue } };
    service.onValidateForm(true, component);
  });
  it('should be validateAdditionalCharges', () => {
    component.addCharges = additionalChargesComponent;
    component.addCharges.addChargesModel.addChargesForm = addChargesForm;
    service.validateAdditionalCharges(component);
  });
  it('should be stairStepFormMandatory', () => {
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    service.stairStepFormMandatory(component);
  });
  it('should be removestairStepFormMandatory', () => {
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    service.removestairStepFormMandatory(component);
  });
  it('should be removearrayIterateStairStep', () => {
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    service.removearrayIterateStairStep(component.addStairStepRates.stairStepModel.addStairStepForm, component);
  });
  it('should be isEffectiveDateAndChargeTypeValid', () => {
    component.createRatesModel.ratesForm = optionalRateFormGroup;
    service.isEffectiveDateAndChargeTypeValid(component.createRatesModel, component);
  });
  it('should be isAddStairStepClickedValidate', () => {
    component.createRatesModel.isAddStairStepClicked = true;
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    service.isAddStairStepClickedValidate(component);
  });
  it('should be addStairStepValidation', () => {
    component.createRatesModel.isAddStairStepClicked = true;
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    component.addCharges = additionalChargesComponent;
    component.addCharges.addChargesModel.addChargesForm = addChargesForm;
    component.createRatesModel.ratesForm = optionalRateFormGroup;
    service.addStairStepValidation(component);
  });
  it('should be checkForValidRateWithoutFree', () => {
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    service.checkForValidRateWithoutFree(component);
  });
  it('should be isAddRateClickedValidate', () => {
    component.createRatesModel.isAddRateClicked = true;
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    component.addCharges = additionalChargesComponent;
    component.addCharges.addChargesModel.addChargesForm = addChargesForm;
    component.createRatesModel.ratesForm = optionalRateFormGroup;
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = new FormGroup({
      rates: new FormArray([component.addRates.createRateItem()]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    service.isAddRateClickedValidate(component);
  });
  it('should be validateRateForm', () => {
    component.createRatesModel.CheckBoxAttributes.rollUp = true;
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = new FormGroup({
      rates: new FormArray([component.addRates.createRateItem()]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    service.validateRateForm(component);
  });
  it('should be validateRateForm for 1else if ', () => {
    component.createRatesModel.CheckBoxAttributes.rollUp = true;
    component.createRatesModel.CheckBoxAttributes.calculateRate = true;
    component.createRatesModel.CheckBoxAttributes.passThrough = true;
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = new FormGroup({
      rates: new FormArray([component.addRates.createRateItem()]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    service.validateRateForm(component);
  });
  it('should be validateRateForm for 2else if', () => {
    component.createRatesModel.CheckBoxAttributes.rollUp = false;
    component.createRatesModel.CheckBoxAttributes.calculateRate = true;
    component.createRatesModel.CheckBoxAttributes.passThrough = true;
    component.createRatesModel.isAddRateClicked = true;
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = new FormGroup({
      rates: new FormArray([component.addRates.createRateItem()]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    service.validateRateForm(component);
  });
  it('should be validateRateForm for else', () => {
    component.createRatesModel.CheckBoxAttributes.rollUp = false;
    component.createRatesModel.CheckBoxAttributes.calculateRate = true;
    component.createRatesModel.CheckBoxAttributes.passThrough = true;
   component.createRatesModel.isAddRateClicked = false;
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = new FormGroup({
      rates: new FormArray([component.addRates.createRateItem()]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    service.validateRateForm(component);
  });
  it('should be validateStairStepRateForm', () => {
    component.createRatesModel.CheckBoxAttributes.rollUp = true;
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    service.validateStairStepRateForm(component);
  });
  it('should be validateStairStepRateForm 1 else if', () => {
    component.createRatesModel.CheckBoxAttributes.rollUp = true;
    component.createRatesModel.CheckBoxAttributes.calculateRate = true;
    component.createRatesModel.CheckBoxAttributes.passThrough = true;
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    service.validateStairStepRateForm(component);
  });
  it('should be validateStairStepRateForm for 2else if', () => {
    component.createRatesModel.CheckBoxAttributes.rollUp = false;
    component.createRatesModel.CheckBoxAttributes.calculateRate = true;
    component.createRatesModel.CheckBoxAttributes.passThrough = true;
    component.createRatesModel.isAddRateClicked = true;
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    service.validateStairStepRateForm(component);
  });
  it('should be validateStairStepRateForm for else', () => {
    component.createRatesModel.CheckBoxAttributes.rollUp = false;
    component.createRatesModel.CheckBoxAttributes.calculateRate = true;
    component.createRatesModel.CheckBoxAttributes.passThrough = true;
    component.createRatesModel.isAddRateClicked = false;
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    service.validateStairStepRateForm(component);
  });
  it('should be checkRates for else', () => {
    component.createRatesModel.isAddRateClicked = false;
    component.createRatesModel.isAddStairStepClicked = false;
    service.checkRates(component);
    component.createRatesModel.isAddStairStepClicked = true;
    service.checkRates(component);
  });
  it('should be checkRates for if', () => {
    component.createRatesModel.isAddRateClicked = true;
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = new FormGroup({
      rates: new FormArray([component.addRates.createRateItem()]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    service.checkRates(component);
  });
  it('should be checkStairStepRates for else', () => {
    component.createRatesModel.isAddStairStepClicked = false;
    component.createRatesModel.isAddRateClicked = false;
    service.checkStairStepRates(component);
    component.createRatesModel.isAddRateClicked = true;
    service.checkStairStepRates(component);
  });
  it('should be checkStairStepRates for if', () => {
    component.createRatesModel.isAddStairStepClicked = true;
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
   service.checkStairStepRates(component);
  });
  it('should be checkStairStepRateFormValidity', () => {
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    service.checkStairStepRates(component);
  });
  it('should be setRateAndRateTypeMandatory', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = new FormGroup({
      rates: new FormArray([component.addRates.createRateItem()]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    service.setRateAndRateTypeMandatory(component);
  });
  it('should be isGroupRateTypeMandatory', () => {
    component.addRates = addComponent;
    component.addRates.addRatesModel.addRateForm = new FormGroup({
      rates: new FormArray([component.addRates.createRateItem()]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    service.isGroupRateTypeMandatory(component);
  });
  it('should be errorMsgOnSave', () => {
    service.errorMsgOnSave(component);
  });
  it('should be isAddRateClickedValidate last else if', () => {
    component.createRatesModel.isAddRateClicked = true;
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    component.addCharges = additionalChargesComponent;
    component.addCharges.addChargesModel.addChargesForm = addChargesForm;
    component.createRatesModel.ratesForm = optionalRateFormGroup;
    component.addRates = addComponent;
     const formGroup = formBuilder.group({
      rates: new FormArray([new FormGroup({
        rateType: new FormControl('123'),
        rateAmount: new FormControl('1.1, 2.1'),
        minAmount: new FormControl(2),
        maxAmount: new FormControl('3'),
        rounding: new FormControl('Down', [])
      }),
      new FormGroup({
        rateType: new FormControl('hsg'),
        rateAmount: new FormControl('1.1, 2.1'),
        minAmount: new FormControl(2),
        maxAmount: new FormControl('3'),
        rounding: new FormControl('Down', [])
      })
      ]),
      groupRateType: new FormControl('123'),
      isGroupRateItemize: new FormControl(false)
    });
    component.addRates.addRatesModel.addRateForm = formGroup;
    component.addRates.addRatesModel.addRateForm.setErrors(null);
    component.addRates.addRatesModel.addRateForm.setValidators(null);
    component.addRates.addRatesModel.addRateForm.updateValueAndValidity();
    const formGroup1 = formBuilder.group({
      rates: new FormArray([new FormGroup({
        chargeType: new FormControl('data'),
        rateType: new FormControl('data'),
        rateAmount: new FormControl('data')
      })
      ])
    });
    component.addCharges.addChargesModel.addChargesForm = formGroup1;
    component.createRatesModel.isSetUpFormValid = true;
    service.isAddRateClickedValidate(component);
  });
  it('should be isAddRateClickedValidate last else', () => {
    component.createRatesModel.isAddRateClicked = true;
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = addStairStepRatesform;
    component.addCharges = additionalChargesComponent;
    component.addCharges.addChargesModel.addChargesForm = addChargesForm;
    component.createRatesModel.ratesForm = optionalRateFormGroup;
    component.addRates = addComponent;
     const formGroup = formBuilder.group({
      rates: new FormArray([new FormGroup({
        rateType: new FormControl('123'),
        rateAmount: new FormControl('1.1, 2.1'),
        minAmount: new FormControl(2),
        maxAmount: new FormControl('3'),
        rounding: new FormControl('Down', [])
      }),
      new FormGroup({
        rateType: new FormControl('hsg'),
        rateAmount: new FormControl('1.1, 2.1'),
        minAmount: new FormControl(2),
        maxAmount: new FormControl('3'),
        rounding: new FormControl('Down', [])
      })
      ]),
      groupRateType: new FormControl('123'),
      isGroupRateItemize: new FormControl(false)
    });
    component.addRates.addRatesModel.addRateForm = formGroup;
    component.addRates.addRatesModel.addRateForm.setErrors(null);
    component.addRates.addRatesModel.addRateForm.setValidators(null);
    component.addRates.addRatesModel.addRateForm.updateValueAndValidity();
    const formGroup1 = formBuilder.group({
      rates: new FormArray([new FormGroup({
        chargeType: new FormControl('data'),
        rateType: new FormControl('data'),
        rateAmount: new FormControl('data')
      })
      ])
    });
    component.addCharges.addChargesModel.addChargesForm = formGroup1;
    component.createRatesModel.isSetUpFormValid = false;
    service.isAddRateClickedValidate(component);
  });
  it('should be addStairStepValidation last else', () => {
    component.createRatesModel.isAddStairStepClicked = true;
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = formBuilder.group({
      rateType: new FormControl('123'),
      minAmount: new FormControl('2'),
      maxAmount: new FormControl('4'),
      rounding: new FormControl('Down', []),
      maxApplidedWhen: new FormControl('Steps Are Exceeded'),
      itemizeRates: new FormControl(false),
      stepsArray: new FormArray([new FormGroup({
        step: new FormControl('1'),
        fromQuantity: new FormControl('2'),
        toQuantity: new FormControl('4'),
        rateAmount: new FormControl('2.00')
      }),
      new FormGroup({
        step: new FormControl('2'),
        fromQuantity: new FormControl('5'),
        toQuantity: new FormControl('7'),
        rateAmount: new FormControl('5.00')
      })
      ])
    });
    component.addCharges = additionalChargesComponent;
    const formGroup1 = formBuilder.group({
      rates: new FormArray([new FormGroup({
        chargeType: new FormControl('data'),
        rateType: new FormControl('data'),
        rateAmount: new FormControl('data')
      })
      ])
    });
    component.addCharges.addChargesModel.addChargesForm = formGroup1;
    component.createRatesModel.ratesForm = optionalRateFormGroup;
    service.addStairStepValidation(component);
  });
  it('should be addStairStepValidation last else if', () => {
    component.createRatesModel.isAddStairStepClicked = true;
    component.addStairStepRates = addStairStepComponent;
    component.addStairStepRates.stairStepModel.addStairStepForm = formBuilder.group({
      rateType: new FormControl('123'),
      minAmount: new FormControl('2'),
      maxAmount: new FormControl('4'),
      rounding: new FormControl('Down', []),
      maxApplidedWhen: new FormControl('Steps Are Exceeded'),
      itemizeRates: new FormControl(false),
      stepsArray: new FormArray([new FormGroup({
        step: new FormControl('1'),
        fromQuantity: new FormControl('2'),
        toQuantity: new FormControl('4'),
        rateAmount: new FormControl('2.00')
      }),
      new FormGroup({
        step: new FormControl('2'),
        fromQuantity: new FormControl('5'),
        toQuantity: new FormControl('7'),
        rateAmount: new FormControl('5.00')
      })
      ])
    });
    component.addCharges = additionalChargesComponent;
    const formGroup1 = formBuilder.group({
      rates: new FormArray([new FormGroup({
        chargeType: new FormControl('data'),
        rateType: new FormControl('data'),
        rateAmount: new FormControl('data')
      })
      ])
    });
    component.addCharges.addChargesModel.addChargesForm = formGroup1;
    component.createRatesModel.ratesForm = optionalRateFormGroup;
    component.createRatesModel.isSetUpFormValid = true;
    service.addStairStepValidation(component);
  });
  it('should be errorMsgOnSave', () => {
    component.createRatesModel.isSetUpFormValid = false;
    service.errorMsgOnSave(component);
  });
});
