import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { ViewAgreementDetailsUtility } from './../../../service/view-agreement-details-utility';
import { RateComponent } from './rate.component';
import { RateService } from './services/rate.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { of } from 'rxjs/index';
import { By } from '@angular/platform-browser';
import { FormBuilder, FormArray, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RateComponent', () => {
  let component: RateComponent;
  let fixture: ComponentFixture<RateComponent>;
  let rateService: RateService;
  const formBuilder: FormBuilder = new FormBuilder();
  let formGroup: FormGroup;
  let rateForm: FormGroup;
  let lineHauldetails;
  let amountPattern;
  let broadcasterService: BroadcasterService;
  let utilityService: ViewAgreementDetailsUtility;
  const lineHaulEditDetails: any = {
    'lineHaulConfigurationID': 3456,
    'laneID': 2397,
    'lineHaulSourceTypeID': 4,
    'lineHaulSourceTypeName': 'Manual ',
    'origin': {
      'type': 'Address',
      'typeID': 3,
      'country': null,
      'point': null,
      'pointID': 263074,
      'description': null,
      'vendorID': null,
      'addressLine1': null,
      'addressLine2': null,
      'cityName': null,
      'countryCode': null,
      'countryName': null,
      'postalCode': null,
      'stateCode': null,
      'stateName': null,
      'lowerBoundID': null,
      'lowerBound': null,
      'upperBoundID': null,
      'upperBound': null,
      'boundRange': null
    },
    'destination': {
      'type': 'Address',
      'typeID': 3,
      'country': null,
      'point': null,
      'pointID': 1673754,
      'description': null,
      'vendorID': null,
      'addressLine1': null,
      'addressLine2': null,
      'cityName': null,
      'countryCode': null,
      'countryName': null,
      'postalCode': null,
      'stateCode': null,
      'stateName': null,
      'lowerBoundID': null,
      'lowerBound': null,
      'upperBoundID': null,
      'upperBound': null,
      'boundRange': null
    },
    'stops': [
      {
        'stopSequenceNumber': 1,
        'stopTypeName': 'Address',
        'stopTypeID': 3,
        'stopCountry': null,
        'stopPoint': null,
        'stopPointID': 57886,
        'geographicPointUsageLevelTypeAssociationID': 32,
        'vendorID': null
      }
    ],
    'stopChargeIncludedIndicator': true,
    'status': 'Draft',
    'effectiveDate': '2019-07-22',
    'expirationDate': '2019-07-23',
    'agreementID': 134,
    'agreementName': 'The Home Depot Inc (HDAT)',
    'contractID': 263,
    'contractNumber': 'CONT0010',
    'contractName': 'Primary Home Depot Account',
    'sectionID': 1701,
    'sectionName': 'section6909994',
    'financeBusinessUnitServiceOfferingAssociationID': 1,
    'businessUnit': 'JBT',
    'serviceOffering': 'OTR',
    'serviceOfferingDescription': 'Over The Road',
    'serviceOfferingBusinessUnitTransitModeAssociationID': 1,
    'transitMode': 'Truck',
    'transitModeDescription': 'Transit By Truck',
    'serviceLevelBusinessUnitServiceOfferingAssociationID': 1,
    'serviceLevel': 'Standard',
    'serviceLevelDescription': 'Standard',
    'equipmentRequirementSpecificationAssociationID': 13141,
    'equipmentClassificationCode': 'Chassis',
    'equipmentClassificationCodeDescription': 'CHASSIS',
    'equipmentTypeCode': 'Dolly',
    'equipmentTypeCodeDescription': 'DOLLY',
    'equipmentLengthQuantity': 10,
    'unitOfEquipmentLengthMeasurementCode': 'Feet',
    'operationalServices': [
      {
        'serviceTypeCode': 'TrailWshOt',
        'serviceTypeDescription': 'Trailer Washout and Flush'
      }
    ],
    'priorityNumber': 65,
    'overriddenPriority': 5,
    'awardStatusID': 1,
    'awardStatus': 'Primary',
    'rates': [
      {
        'customerLineHaulRateID': 3939,
        'customerLineHaulConfigurationID': 3456,
        'chargeUnitType': 'Flat',
        'rateAmount': 10,
        'minimumAmount': null,
        'maximumAmount': null,
        'currencyCode': 'CAD'
      }
    ],
    'groupRateType': null,
    'groupRateItemIndicator': false,
    'sourceID': null,
    'sourceLineHaulID': null,
    'billTos': null,
    'carriers': [],
    'mileagePreference': {
      'mileagePreferenceID': null,
      'mileagePreferenceName': null,
      'mileagePreferenceMinRange': null,
      'mileagePreferenceMaxRange': null
    },
    'unitOfMeasurement': {
      'code': null,
      'description': null,
      'minWeightRange': null,
      'maxWeightRange': null
    },
    'hazmatIncludedIndicator': false,
    'fuelIncludedIndicator': false,
    'autoInvoiceIndicator': true,
    'createdUserId': 'rcon770',
    'lastUpdateUserId': 'rcon770',
    'recordStatus': 'active',
    'dbSyncUpdateTimestamp': null
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, RateService, MessageService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    broadcasterService = TestBed.get(BroadcasterService);
    utilityService = TestBed.get(ViewAgreementDetailsUtility);
    lineHauldetails = {
      lineHaulConfigurationID: 1814,
      laneID: 4488,
      lineHaulSourceTypeID: 4,
      lineHaulSourceTypeName: 'Manual ',
      origin: {
        country: null,
        description: null,
        point: null,
        pointID: 1686067,
        type: 'Address',
        typeID: 3,
        vendorID: null
      },
      destination: {
        country: null,
        description: null,
        point: null,
        pointID: 90894,
        type: 'Address',
        typeID: 3,
        vendorID: null
      },
      stops: [],
      stopChargeIncludedIndicator: false,
      status: 'Draft',
      effectiveDate: '2019-05-09',
      expirationDate: '2019-05-28',
      agreementID: 27,
      agreementName: 'Adams Cable Equipment (ADLE59)',
      contractID: 47,
      contractNumber: null,
      contractName: 'Adams Contract',
      sectionID: 44,
      sectionName: 'AdamSection1',
      financeBusinessUnitServiceOfferingAssociationID: 7,
      businessUnit: 'ICS',
      serviceOffering: 'Brokerage',
      serviceOfferingBusinessUnitTransitModeAssociationID: 7,
      transitMode: 'Truck',
      serviceLevelBusinessUnitServiceOfferingAssociationID: null,
      serviceLevel: null,
      equipment: null,
      operationalServices: [],
      priorityNumber: 65,
      overriddenPriority: null,
      awardStatusID: 4,
      awardStatus: 'Tertiary',
      rates: [{
        chargeUnitType: 'Per Kilometer',
        currencyCode: 'USD',
        customerLineHaulConfigurationID: 1814,
        customerLineHaulRateID: 1957,
        maximumAmount: null,
        minimumAmount: null,
        rateAmount: 12,
      }],
      groupRateType: null,
      groupRateItemIndicator: false,
      sourceID: 564567,
      sourceLineHaulID: 678678,
      overridenPriorityNumber: null,
      billTos: null,
      carriers: [],
      mileagePreference: {},
      mileagePreferenceMinRange: null,
      mileagePreferenceMaxRange: null,
      unitOfMeasurement: {
        code: null,
        description: null,
        maxWeightRange: null,
        minWeightRange: null
      },
      hazmatIncludedIndicator: false,
      fuelIncludedIndicator: false,
      autoInvoiceIndicator: true,
      equipmentRequirementSpecificationAssociationID: 492,
      equipmentClassificationCode: 'Chassis',
      equipmentClassificationCodeDescription: 'CHASSIS',
      equipmentTypeCode: 'Chassis',
      equipmentTypeCodeDescription: 'CHASSIS',
      equipmentLengthQuantity: 6,
      unitOfEquipmentLengthMeasurementCode: 'Feet',
    };
    amountPattern = '[-0-9., ]*';
    rateService = TestBed.get(RateService);
    formGroup = formBuilder.group({
      sourceIdentifier: new FormControl('1', Validators.pattern(amountPattern)),
      sourceLineHaulIdentifier: new FormControl('1', Validators.pattern(amountPattern)),
      rates: new FormArray([new FormGroup({
        type: new FormControl('Flat', Validators.required),
        amount: new FormControl('2', [Validators.required, Validators.pattern(amountPattern)]),
        minAmount: new FormControl('2', [Validators.pattern(amountPattern)]),
        maxAmount: new FormControl('3', [Validators.pattern(amountPattern)]),
        currency: new FormControl('USD', Validators.required)
      }),
      new FormGroup({
        type: new FormControl('Flatbed', Validators.required),
        amount: new FormControl('2', [Validators.required, Validators.pattern(amountPattern)]),
        minAmount: new FormControl('2', [Validators.pattern(amountPattern)]),
        maxAmount: new FormControl('3', [Validators.pattern(amountPattern)]),
        currency: new FormControl('USD', Validators.required)
      })
      ]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    rateForm = formBuilder.group({
      sourceIdentifier: new FormControl('', Validators.pattern(amountPattern)),
      sourceLineHaulIdentifier: new FormControl('', Validators.pattern(amountPattern)),
      rates: new FormControl([], Validators.pattern(amountPattern)),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    component.rateModel.rateForm = formGroup;
    (component.rateModel.rateForm.controls.rates as FormArray).at(0).get('type').setValue('true');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
  });

  it('should call createRatesForm', () => {
    component.createRatesForm();
  });

  it('should call addRate', () => {
    const rateFC = (component.rateModel.rateForm.get('rates') as FormArray).at(1);
    rateFC.markAsTouched();
    rateFC.get('type').setErrors({ invalid: true });
    rateFC.get('amount').markAsTouched();
    rateFC.get('currency').markAsTouched();
    component.addRate(1);
  });

  it('should call addRate', () => {
    component.addRate(0);
  });

  it('should call onautoCompleteBlur', () => {
    component.onautoCompleteBlur(event, 'type', 0);
  });
  it('should call onClearValue', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="type"]'));
    element.triggerEventHandler('onClear', { target: { value: '' } });
    fixture.detectChanges();
  });

  it('should call showHideRateGroup', () => {
    component.showHideRateGroup();
  });

  it('should call showHideRateGroup', () => {
    component.rateModel.rateForm = rateForm;
    component.showHideRateGroup();
  });

  it('should call validateAmount', () => {
    component.validateAmount('10000', 0, 'amount');
  });

  it('should call validateAmount', () => {
    component.validateAmount('abc', 0, 'amount');
  });

  it('should call amountFieldEntered', () => {
    component.amountFieldEntered();
  });

  it('should call validateAmountRange', () => {
    component.validateAmountRange(0, 'amount');
  });

  it('should call validateAmountRange', () => {
    component.validateAmountRange(0, 'minAmount');
  });

  it('should call validateAmountRange', () => {
    component.validateAmountRange(0, 'maxAmount');
  });

  it('should call checkMinMaxRange', () => {
    component.checkMinMaxRange(0);
  });

  it('should call checkMinMaxRange-else', () => {
    (component.rateModel.rateForm.controls.rates as FormArray).at(0).get('amount').setValue(12000);
    (component.rateModel.rateForm.controls.rates as FormArray).at(0).get('minAmount').setValue(150);
    (component.rateModel.rateForm.controls.rates as FormArray).at(0).get('maxAmount').setValue(100);
    component.checkMinMaxRange(0);
  });

  it('should call checkMinMaxRange-set', () => {
    (component.rateModel.rateForm.controls.rates as FormArray).at(0).get('amount').setErrors({ 'error': true });
    (component.rateModel.rateForm.controls.rates as FormArray).at(0).get('minAmount').setErrors({ 'error': true });
    (component.rateModel.rateForm.controls.rates as FormArray).at(0).get('maxAmount').setErrors({ 'error': true });
    fixture.detectChanges();
    component.checkMinMaxRange(0);
  });

  it('should call showError', () => {
    component.showError('The minimum amount cannot be greater than the maximum amount');
  });

  it('should call createRateItem', () => {
    component.createRateItem();
  });

  it('should call removeRate', () => {
    component.rateModel.selectedCurrency = 'USD';
    component.rateModel.currecyCodeBasedOnSection = 'USD';
    const ratesForm = (component.rateModel.rateForm.get('rates') as FormArray);
    ratesForm.removeAt(1);
    fixture.detectChanges();
    component.removeRate(0);
  });
  it('should call removeRate-else', () => {
    component.removeRate(0);
  });
  it('should call enableFirstCurrency', () => {
    component.enableFirstCurrency();
  });

  it('it should call getRateTypes', () => {
    const data = {
      '_embedded': {
        'lineHaulChargeUnitTypes': [{
          'lineHaulChargeUnitTypeID': 1,
          'chargeUnitTypeName': 'Cwt',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/1'
            },
            'lineHaulChargeUnitType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/1{?projection}',
              'templated': true
            }
          }
        }, {
          'lineHaulChargeUnitTypeID': 2,
          'chargeUnitTypeName': 'Flat',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/2'
            },
            'lineHaulChargeUnitType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/2{?projection}',
              'templated': true
            }
          }
        }, {
          'lineHaulChargeUnitTypeID': 3,
          'chargeUnitTypeName': 'Per Linear Foot',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/3'
            },
            'lineHaulChargeUnitType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/3{?projection}',
              'templated': true
            }
          }
        }, {
          'lineHaulChargeUnitTypeID': 4,
          'chargeUnitTypeName': 'Per Kilometer',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/4'
            },
            'lineHaulChargeUnitType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/4{?projection}',
              'templated': true
            }
          }
        }, {
          'lineHaulChargeUnitTypeID': 5,
          'chargeUnitTypeName': 'Per Mile',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/5'
            },
            'lineHaulChargeUnitType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/5{?projection}',
              'templated': true
            }
          }
        }, {
          'lineHaulChargeUnitTypeID': 6,
          'chargeUnitTypeName': 'Per Pallet',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/6'
            },
            'lineHaulChargeUnitType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/6{?projection}',
              'templated': true
            }
          }
        }, {
          'lineHaulChargeUnitTypeID': 7,
          'chargeUnitTypeName': 'Percent',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/7'
            },
            'lineHaulChargeUnitType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/7{?projection}',
              'templated': true
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes{?page,size,sort,projection}',
          'templated': true
        },
        'profile': {
          'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/profile/chargeunittypes'
        }
      },
      'page': {
        'size': 50,
        'totalElements': 7,
        'totalPages': 1,
        'number': 0
      }
    };
    spyOn(RateService.prototype, 'getRateTypes').and.returnValue(of(data));
    component.getRateTypes();
  });

  it('it should call getGroupRateTypes', () => {
    const data = ({
      page: {
        number: 0,
        size: 50,
        totalElements: 3,
        totalPages: 1
      },
      _embedded: {
        groupRateTypes: [{
          groupRateTypeID: 1,
          groupRateTypeName: 'Sum',
          _links: {
            groupRateType: {
              href: 'https://pricing-test.jbhunt.com/pricingconfigurationservices/groupratetypes/1{?projection}',
              templated: true
            }
          },
          self: {
            href: 'https://pricing-test.jbhunt.com/pricingconfigurationservices/groupratetypes/1'
          }
        }]
      },
      links: {
        profile: {
          href: 'https://pricing-test.jbhunt.com/pricingconfigurationservices/profile/groupratetypes'
        },
        self: {
          href: 'https://pricing-test.jbhunt.com/pricingconfigurationservices/groupratetypes{?page,size,sort,projection}',
          templated: true
        }
      },
    });
    spyOn(RateService.prototype, 'getGroupRateTypes').and.returnValue(of(data));
    component.getGroupRateTypes();
  });

  it('should call getCurrencyCode', () => {
    spyOn(RateService.prototype, 'getCurrencyCodes').and.returnValue(of(['USD', 'CAD']));
    component.getCurrencyCode();
  });
  it('should call onGroupTypeChange', () => {
    component.onGroupTypeChange(1);
  });
  it('should call onGroupTypeChange', () => {
    component.onGroupTypeChange(2);
  });
  it('should call onSourceIdenfiterBlur', () => {
    component.onSourceIdenfiterBlur('sourceIdentifier');
  });
  it('should call sourceLineHaulIdentifier', () => {
    component.rateModel.rateForm.controls.sourceLineHaulIdentifier.setValue('abc');
    component.onSourceLHIdenfiterBlur('abc');
  });
  it('should call onCurrencyChange', () => {
    component.onCurrencyChange('10000');
  });
  it('should call onTypeRateType', () => {
    const event: any = {
      'originalEvent': { isTrusted: true }, 'query': 'Per Pallet'
    };
    component.rateModel.rateTypeSuggestion = [];
    component.rateModel.rateTypeSuggestion = [{
      label: 'Per Pallet',
      value: 6
    }];
    component.rateModel.rateTypes = [];
    component.rateModel.rateTypes = [
      {
        label: 'cwt',
        value: 1
      },
      {
        label: 'Flat',
        value: 2
      },
      {
        label: 'Per Linear Foot',
        value: 3
      },
      {
        label: 'Per Kilometer',
        value: 4
      },
      {
        label: 'Per Mile',
        value: 5
      },
      {
        label: 'Per Pallet',
        value: 6
      },
      {
        label: 'Percent',
        value: 7
      }
    ];
    component.onTypeRateType(event);
  });
  it('should call onTypeCurrency', () => {
    component.rateModel.currencyCodes = [{ 'label': 'USD', 'value': 'USD' }, { 'label': 'CAD', 'value': 'CAD' }];
    const event: any = { originalEvent: 'InputEvent', query: 'a' };
    component.rateModel.currecyCodeBasedOnSection = 'USD';
    component.onTypeCurrency(event);
  });

  it('should call onTypeGroupRateType', () => {
    const event: any = {
      'originalEvent': { isTrusted: true }, 'query': 'Per Pallet'
    };
    component.rateModel.groupRateTypeSuggestion = [];
    component.rateModel.groupRateTypes = [{
      label: 'Per Pallet',
      value: 6
    }];
    component.rateModel.rateTypeSuggestion = [];
    component.rateModel.rateTypes = [{
      label: 'Per Pallet',
      value: 6
    }];
    component.onTypeGroupRateType(event);
  });

  it('it should call getCurrencyCodeBasedOnSection', () => {
    component.rateModel.selectedCurrency = 'USD';
    component.rateModel.currecyCodeBasedOnSection = 'USD';
    const sectresponse = {
      label: 'ID: 2034860',
      sectionId: 499,
      value: 'ID: 52067793298066'
    };
    const data = ['USD'];
    spyOn(RateService.prototype, 'getCurrencyCodeBasedOnSection').and.returnValue(of(data));
    component.getCurrencyCodeBasedOnSection(sectresponse);
  });

  it('should call setvalueforRateSection', () => {
    utilityService.editLineHaulData = {
      lineHaulDetails: 1760,
      isEditFlag: true
    };
    utilityService.setEditLineHaulData(utilityService.editLineHaulData);
    broadcasterService.broadcast('editlinehaulDetails', lineHaulEditDetails);
    component.setvalueforRateSection();
  });
  it('should call setvalueforRateSection-else', () => {
    utilityService.editLineHaulData = {
      lineHaulDetails: 1760,
      isEditFlag: true
    };
    utilityService.setEditLineHaulData(utilityService.editLineHaulData);
    const obj: any = {
      'customerLineHaulRateID': 3939,
      'customerLineHaulConfigurationID': 3456,
      'chargeUnitType': 'Per Mile',
      'rateAmount': 10,
      'minimumAmount': null,
      'maximumAmount': null,
      'currencyCode': 'CAD'
    };
    lineHaulEditDetails.rates.push(obj);
    broadcasterService.broadcast('editlinehaulDetails', lineHaulEditDetails);
    component.setvalueforRateSection();
  });

  it('should call createEditRateFormData', () => {
    component.createEditRateFormData(lineHauldetails);
  });

  it('should call setvalueForRateForm', () => {
    component.setvalueForRateForm(lineHauldetails);
  });

  it('should call getDistanceType', () => {
    component.rateModel.rateTypes = [
      {
        label: 'cwt',
        value: 1
      },
      {
        label: 'Flat',
        value: 2
      },
      {
        label: 'Per Linear Foot',
        value: 3
      },
      {
        label: 'Per Kilometer',
        value: 4
      },
      {
        label: 'Per Mile',
        value: 5
      },
      {
        label: 'Per Pallet',
        value: 6
      },
      {
        label: 'Percent',
        value: 7
      }
    ];
    component.getDistanceType(lineHauldetails.rates[0].chargeUnitType);
  });

  it('should call editRateItem', () => {
    const editCurrencyType = {
      'label': lineHauldetails.rates[0].currencyCode,
      'value': lineHauldetails.rates[0].currencyCode,
      'disabled': true
    };
    component.editRateItem(null, editCurrencyType, lineHauldetails.rates[0].rateAmount,
      lineHauldetails.rates[0].minimumAmount, lineHauldetails.rates[0].maximumAmount);
  });

  it('it should call getEditRateTypes', () => {
    const data = {
      '_embedded': {
        'lineHaulChargeUnitTypes': [{
          'lineHaulChargeUnitTypeID': 1,
          'chargeUnitTypeName': 'Cwt',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/1'
            },
            'lineHaulChargeUnitType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/1{?projection}',
              'templated': true
            }
          }
        }, {
          'lineHaulChargeUnitTypeID': 2,
          'chargeUnitTypeName': 'Flat',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/2'
            },
            'lineHaulChargeUnitType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/2{?projection}',
              'templated': true
            }
          }
        }, {
          'lineHaulChargeUnitTypeID': 3,
          'chargeUnitTypeName': 'Per Linear Foot',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/3'
            },
            'lineHaulChargeUnitType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/3{?projection}',
              'templated': true
            }
          }
        }, {
          'lineHaulChargeUnitTypeID': 4,
          'chargeUnitTypeName': 'Per Kilometer',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/4'
            },
            'lineHaulChargeUnitType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/4{?projection}',
              'templated': true
            }
          }
        }, {
          'lineHaulChargeUnitTypeID': 5,
          'chargeUnitTypeName': 'Per Mile',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/5'
            },
            'lineHaulChargeUnitType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/5{?projection}',
              'templated': true
            }
          }
        }, {
          'lineHaulChargeUnitTypeID': 6,
          'chargeUnitTypeName': 'Per Pallet',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/6'
            },
            'lineHaulChargeUnitType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/6{?projection}',
              'templated': true
            }
          }
        }, {
          'lineHaulChargeUnitTypeID': 7,
          'chargeUnitTypeName': 'Percent',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/7'
            },
            'lineHaulChargeUnitType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes/7{?projection}',
              'templated': true
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/chargeunittypes{?page,size,sort,projection}',
          'templated': true
        },
        'profile': {
          'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/profile/chargeunittypes'
        }
      },
      'page': {
        'size': 50,
        'totalElements': 7,
        'totalPages': 1,
        'number': 0
      }
    };
    spyOn(RateService.prototype, 'getRateTypes').and.returnValue(of(data));
    component.getEditRateTypes(lineHauldetails);
  });

  it('it should call getEditGroupRateTypes', () => {
    const data = ({
      page: {
        number: 0,
        size: 50,
        totalElements: 3,
        totalPages: 1
      },
      _embedded: {
        groupRateTypes: [{
          groupRateTypeID: 1,
          groupRateTypeName: 'Sum',
          _links: {
            groupRateType: {
              href: 'https://pricing-test.jbhunt.com/pricingconfigurationservices/groupratetypes/1{?projection}',
              templated: true
            }
          },
          self: {
            href: 'https://pricing-test.jbhunt.com/pricingconfigurationservices/groupratetypes/1'
          }
        }]
      },
      links: {
        profile: {
          href: 'https://pricing-test.jbhunt.com/pricingconfigurationservices/profile/groupratetypes'
        },
        self: {
          href: 'https://pricing-test.jbhunt.com/pricingconfigurationservices/groupratetypes{?page,size,sort,projection}',
          templated: true
        }
      },
    });
    spyOn(RateService.prototype, 'getGroupRateTypes').and.returnValue(of(data));
    component.getEditGroupRateTypes(lineHauldetails);
  });

  it('should call onClearGroupDownDropDown', () => {
    component.onClearGroupDownDropDown();
  });

});
