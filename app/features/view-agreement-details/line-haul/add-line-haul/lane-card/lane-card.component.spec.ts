import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { LaneCardComponent } from './lane-card.component';
import { LaneCardService } from './services/lane-card.service';
import { LaneCardUtility } from './services/lane-card-utility';
import { ViewAgreementDetailsUtility } from './../../../service/view-agreement-details-utility';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs/index';
import { By } from '@angular/platform-browser';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';

describe('LaneCardComponent', () => {
  let component: LaneCardComponent;
  let fixture: ComponentFixture<LaneCardComponent>;
  let laneCardService: LaneCardService;
  let lineHauldetails;
  let messageService: MessageService;
  let broadcasterService: BroadcasterService;
  let utilityService: ViewAgreementDetailsUtility;
  const formBuilder: FormBuilder = new FormBuilder();
  const addressResponse = {
    'took': 151,
    'timed_out': false,
    '_shards': {
      'total': 5,
      'successful': 5,
      'skipped': 0,
      'failed': 0
    },
    'hits': {
      'total': 14,
      'max_score': 0,
      'hits': [
        {
          '_index': 'masterdata-location-details',
          '_type': 'location_info',
          '_id': '359708',
          '_score': 0,
          '_source': {
            'Address': {
              'AddressLine2': 'Abc',
              'AddressLine1': 'Abc',
              'CountryName': 'USA',
              'StateName': 'Virginia',
              'StateCode': 'VA',
              'PostalCode': '24112',
              'CityName': 'Martinsville',
              'CountryCode': 'USA',
              'AddressID': 1683532
            }
          }
        }
      ]
    }
  };

  const cityStateResponse: any = {
    'took': 134,
    'timed_out': false,
    '_shards': {
      'total': 5,
      'successful': 5,
      'skipped': 0,
      'failed': 0
    },
    'hits': {
      'total': 442,
      'max_score': 4.7252855,
      'hits': [
        {
          '_index': 'masterdata-geography-postalcode',
          '_type': 'doc',
          '_id': '194217',
          '_score': 4.7252855,
          'inner_hits': {
            'City': {
              'hits': {
                'total': 1,
                'max_score': 3.7252855,
                'hits': [
                  {
                    '_index': 'masterdata-geography-postalcode',
                    '_type': 'doc',
                    '_id': '194217',
                    '_nested': {
                      'field': 'City',
                      'offset': 0
                    },
                    '_score': 3.7252855,
                    '_source': {
                      'CityID': 42261,
                      'State': {
                        'StateName': 'South Dakota',
                        'StateCode': 'SD',
                        'StateID': 130
                      },
                      'Country': {
                        'CountryName': 'USA',
                        'CountryCode': 'USA'
                      },
                      'CityName': 'Creighton'
                    }
                  }
                ]
              }
            }
          }
        }]
    }
  };
  const postalCodeResponse = {
    'took': 820,
    'timed_out': false,
    '_shards': {
      'total': 5,
      'successful': 5,
      'skipped': 0,
      'failed': 0
    },
    'hits': {
      'total': 162440,
      'max_score': 0,
      'hits': [
        {
          '_index': 'masterdata-location-details',
          '_type': 'location_info',
          '_id': '349975',
          '_score': 0,
          '_source': {
            'PostalCodeID': 349975,
            'PostalCode': 'QUMO2',
            'CountryCode': 'Quick Delivery Service Inc'
          }
        }
      ]
    }
  };
  const postalCodeEmptyResponse: any = {
    'took': 820,
    'timed_out': false,
    '_shards': {
      'total': 5,
      'successful': 5,
      'skipped': 0,
      'failed': 0
    },
    'hits': {
      'total': 162440,
      'max_score': 0,
      'hits': null
    }
  };
  const laneCardForm = formBuilder.group({
    originVendorID: null,
    destinationVendorID: null,
    originType: { 'label': 'Yard', 'value': '5' },
    originCountry: { 'label': 'USA', 'value': 'USA' },
    destinationType: { 'label': 'Yard', 'value': '5' },
    destinationPoint: { 'label': 'USA', 'value': 'USA' },
    originPoint: { 'label': 'USA', 'value': 'USA' },
    originPointFrom: { 'label': 'USA', 'value': 'USA' },
    originPointTo: { 'label': 'USA', 'value': 'USA' },
    destinationPointFrom: { 'label': 'USA', 'value': 'USA' },
    destinationPointTo: { 'label': 'USA', 'value': 'USA' },
    destinationCountry: { 'label': 'USA', 'value': 'USA' },
    originDescription: 'ab',
    destinationDescription: 'abc'
  });

  const zipRangeForm = formBuilder.group({
    rangeFrom: { 'label': 'USA', 'value': 'USA' },
    rangeTo: { 'label': 'USA', 'value': 'USA' }
  });

  const originType: any = [{ 'geographicPointTypeID': 1, 'geographicPointTypeName': 'City State' }, {
    'geographicPointTypeID':
      2, 'geographicPointTypeName': '5-Zip'
  }, { 'geographicPointTypeID': 3, 'geographicPointTypeName': 'Address' }, {
    'geographicPointTypeID': 4, 'geographicPointTypeName': 'Ramp'
  }, {
    'geographicPointTypeID': 5,
    'geographicPointTypeName': 'Yard'
  }, { 'geographicPointTypeID': 6, 'geographicPointTypeName': 'Location' }, {
    'geographicPointTypeID': 7, 'geographicPointTypeName': '9-Zip'
  }, {
    'geographicPointTypeID': 8,
    'geographicPointTypeName': 'Address Region'
  }, { 'geographicPointTypeID': 9, 'geographicPointTypeName': '6-Zip' }, {
    'geographicPointTypeID': 10, 'geographicPointTypeName': '9-Zip Range'
  }, {
    'geographicPointTypeID': 11,
    'geographicPointTypeName': '9-Zip Region'
  }, { 'geographicPointTypeID': 12, 'geographicPointTypeName': '3-Zip' },
  { 'geographicPointTypeID': 13, 'geographicPointTypeName': '5-Zip Range' }, {
    'geographicPointTypeID': 14,
    'geographicPointTypeName': '6-Zip Range'
  }, {
    'geographicPointTypeID': 15, 'geographicPointTypeName':
      '5-Zip Region'
  }, { 'geographicPointTypeID': 17, 'geographicPointTypeName': '2-Zip' }, {
    'geographicPointTypeID':
      18, 'geographicPointTypeName': '3-Zip Range'
  }, {
    'geographicPointTypeID': 19, 'geographicPointTypeName':
      '3-Zip Region'
  }, { 'geographicPointTypeID': 20, 'geographicPointTypeName': '2-Zip Range' }, {
    'geographicPointTypeID': 22, 'geographicPointTypeName': 'State'
  }, {
    'geographicPointTypeID': 23,
    'geographicPointTypeName': 'Country'
  }, { 'geographicPointTypeID': 24, 'geographicPointTypeName': 'Region' }, {
    'geographicPointTypeID': 25, 'geographicPointTypeName': 'City State Region'
  }, {
    'geographicPointTypeID': 27,
    'geographicPointTypeName': 'State Region'
  }];
  const originTypeDrop: any = [{ 'label': '2-Zip', 'value': 17 }, { 'label': '2-Zip Range', 'value': 20 }, {
    'label':
      '3-Zip', 'value': 12
  }, { 'label': '3-Zip Range', 'value': 18 }, { 'label': '3-Zip Region', 'value': 19 }, {
    'label':
      '5-Zip', 'value': 2
  }, { 'label': '5-Zip Range', 'value': 13 }, { 'label': '5-Zip Region', 'value': 15 }, {
    'label':
      '6-Zip', 'value': 9
  }, { 'label': '6-Zip Range', 'value': 14 }, { 'label': '9-Zip', 'value': 7 }, {
    'label':
      '9-Zip Range', 'value': 10
  }, { 'label': '9-Zip Region', 'value': 11 }, { 'label': 'Address', 'value': 3 }, {
    'label':
      'Address Region', 'value': 8
  }, { 'label': 'City State', 'value': 1 }, { 'label': 'City State Region', 'value': 25 }, {
    'label': 'Country', 'value': 23
  }, { 'label': 'Location', 'value': 6 }, { 'label': 'Ramp', 'value': 4 }, {
    'label':
      'Region', 'value': 24
  }, { 'label': 'State', 'value': 22 }, { 'label': 'State Region', 'value': 27 }, { 'label': 'Yard', 'value': 5 }];

  const lineHaulEditDetails: any = {
    customerLineHaulConfigurationID: 4809,
    laneID: 8806,
    lineHaulSourceTypeID: 4,
    lineHaulSourceTypeName: 'Manual ',
    originTypeID: 19,
    originType: '3-Zip Region',
    destinationTypeID: 19,
    destinationType: '3-Zip Region',
    originDescription: null,
    originVendorID: null,
    destinationDescription: null,
    destinationVendorID: null,
    originPoints: [
      {
        country: null,
        point: null,
        pointID: 30,
        addressLine1: null,
        addressLine2: null,
        cityName: null,
        countryCode: null,
        countryName: null,
        postalCode: null,
        stateCode: null,
        stateName: null,
        lowerBoundID: 26654,
        lowerBound: '101',
        upperBoundID: 26828,
        upperBound: '102',
        description: null,
        pointDisplayName: '101 - 102',
        subTypeID: 18,
        subTypeName: '3-Zip Range'
      },
      {
        country: null,
        point: '105',
        pointID: 27601,
        addressLine1: null,
        addressLine2: null,
        cityName: null,
        countryCode: null,
        countryName: null,
        postalCode: null,
        stateCode: null,
        stateName: null,
        lowerBoundID: null,
        lowerBound: null,
        upperBoundID: null,
        upperBound: null,
        description: null,
        pointDisplayName: '105',
        subTypeID: 18,
        subTypeName: '3-Zip'
      }
    ],
    destinationPoints: [
      {
        country: null,
        point: '105',
        pointID: 27601,
        addressLine1: null,
        addressLine2: null,
        cityName: null,
        countryCode: null,
        countryName: null,
        postalCode: null,
        stateCode: null,
        stateName: null,
        lowerBoundID: null,
        lowerBound: null,
        upperBoundID: null,
        upperBound: null,
        description: null,
        pointDisplayName: '105',
        subTypeID: 18,
        subTypeName: '3-Zip'
      },
      {
        country: null,
        point: null,
        pointID: 30,
        addressLine1: null,
        addressLine2: null,
        cityName: null,
        countryCode: null,
        countryName: null,
        postalCode: null,
        stateCode: null,
        stateName: null,
        lowerBoundID: 26654,
        lowerBound: '101',
        upperBoundID: 26828,
        upperBound: '102',
        description: null,
        pointDisplayName: '101 - 102',
        subTypeID: 18,
        subTypeName: '3-Zip Range'
      }
    ],
    stops: [],
    stopChargeIncludedIndicator: false,
    status: 'Draft',
    effectiveDate: '2019-08-19',
    expirationDate: '2019-08-25',
    customerAgreementID: 2249,
    customerAgreementName: 'Hgr Industrial Surplus, Inc (HGEU2)',
    customerAgreementContractID: 2450,
    customerAgreementContractNumber: 'HGEU2 - Legal',
    customerAgreementContractName: 'HGEU2 - Legal',
    customerAgreementContractSectionID: 2485,
    customerAgreementContractSectionName: 'rollback2',
    financeBusinessUnitServiceOfferingAssociationID: 2,
    financeBusinessUnitName: 'JBI',
    serviceOfferingCode: 'Intermodal',
    serviceOfferingDescription: 'Intermodal',
    serviceOfferingBusinessUnitTransitModeAssociationID: 2,
    transitMode: 'Rail',
    transitModeDescription: 'Transit By Rail',
    serviceLevelBusinessUnitServiceOfferingAssociationID: null,
    serviceLevelCode: null,
    serviceLevelDescription: null,
    equipmentRequirementSpecificationAssociationID: null,
    equipmentClassificationCode: 'Forklift',
    equipmentClassificationCodeDescription: 'FORKLIFT',
    equipmentTypeCode: null,
    equipmentTypeCodeDescription: null,
    equipmentLengthQuantity: null,
    unitOfEquipmentLengthMeasurementCode: null,
    operationalServices: [],
    priorityLevelNumber: 22,
    overiddenPriorityLevelNumber: null,
    lineHaulAwardStatusTypeID: 4,
    lineHaulAwardStatusTypeName: 'Tertiary',
    rates: [
      {
        customerLineHaulRateID: 4937,
        customerLineHaulConfigurationID: 4809,
        chargeUnitTypeName: 'Per Pallet',
        rateAmount: 12,
        minimumAmount: null,
        maximumAmount: null,
        currencyCode: 'USD',
        rateDisplayAmount: '$12.00',
        minDisplayAmount: null,
        maxDisplayAmount: null
      }
    ],
    groupRateType: null,
    groupRateItemizeIndicator: false,
    sourceID: null,
    sourceLineHaulID: null,
    billTos: null,
    carriers: [],
    mileagePreference: null,
    unitOfMeasurement: null,
    hazmatIncludedIndicator: false,
    fuelIncludedIndicator: false,
    autoInvoiceIndicator: true,
    createdUserId: 'rcon913',
    lastUpdateUserId: 'rcon913',
    recordStatus: 'active',
    dbSyncUpdateTimestamp: null,
    equipmentLengthDisplayName: '',
    customerAgreementContractDisplayName: 'HGEU2 - Legal (HGEU2 - Legal)',
    numberOfStops: 0
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, LaneCardService, BroadcasterService, MessageService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaneCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    laneCardService = TestBed.get(LaneCardService);
    broadcasterService = TestBed.get(BroadcasterService);
    utilityService = TestBed.get(ViewAgreementDetailsUtility);
    messageService = TestBed.get(MessageService);
    component.laneCardModel.laneCardForm = laneCardForm;
    component.laneCardModel.zipRangeForm = zipRangeForm;
    lineHauldetails = {
      customerLineHaulConfigurationID: 4809,
      laneID: 8806,
      lineHaulSourceTypeID: 4,
      lineHaulSourceTypeName: 'Manual ',
      originTypeID: 19,
      originType: '3-Zip Region',
      destinationTypeID: 19,
      destinationType: '3-Zip Region',
      originDescription: null,
      originVendorID: null,
      destinationDescription: null,
      destinationVendorID: null,
      originPoints: [
        {
          country: null,
          point: null,
          pointID: 30,
          addressLine1: null,
          addressLine2: null,
          cityName: null,
          countryCode: null,
          countryName: null,
          postalCode: null,
          stateCode: null,
          stateName: null,
          lowerBoundID: 26654,
          lowerBound: '101',
          upperBoundID: 26828,
          upperBound: '102',
          description: null,
          pointDisplayName: '101 - 102',
          subTypeID: 18,
          subTypeName: '3-Zip Range'
        },
        {
          country: null,
          point: '105',
          pointID: 27601,
          addressLine1: null,
          addressLine2: null,
          cityName: null,
          countryCode: null,
          countryName: null,
          postalCode: null,
          stateCode: null,
          stateName: null,
          lowerBoundID: null,
          lowerBound: null,
          upperBoundID: null,
          upperBound: null,
          description: null,
          pointDisplayName: '105',
          subTypeID: 18,
          subTypeName: '3-Zip'
        }
      ],
      destinationPoints: [
        {
          country: null,
          point: '105',
          pointID: 27601,
          addressLine1: null,
          addressLine2: null,
          cityName: null,
          countryCode: null,
          countryName: null,
          postalCode: null,
          stateCode: null,
          stateName: null,
          lowerBoundID: null,
          lowerBound: null,
          upperBoundID: null,
          upperBound: null,
          description: null,
          pointDisplayName: '105',
          subTypeID: 18,
          subTypeName: '3-Zip'
        },
        {
          country: null,
          point: null,
          pointID: 30,
          addressLine1: null,
          addressLine2: null,
          cityName: null,
          countryCode: null,
          countryName: null,
          postalCode: null,
          stateCode: null,
          stateName: null,
          lowerBoundID: 26654,
          lowerBound: '101',
          upperBoundID: 26828,
          upperBound: '102',
          description: null,
          pointDisplayName: '101 - 102',
          subTypeID: 18,
          subTypeName: '3-Zip Range'
        }
      ],
      stops: [],
      stopChargeIncludedIndicator: false,
      status: 'Draft',
      effectiveDate: '2019-08-19',
      expirationDate: '2019-08-25',
      customerAgreementID: 2249,
      customerAgreementName: 'Hgr Industrial Surplus, Inc (HGEU2)',
      customerAgreementContractID: 2450,
      customerAgreementContractNumber: 'HGEU2 - Legal',
      customerAgreementContractName: 'HGEU2 - Legal',
      customerAgreementContractSectionID: 2485,
      customerAgreementContractSectionName: 'rollback2',
      financeBusinessUnitServiceOfferingAssociationID: 2,
      financeBusinessUnitName: 'JBI',
      serviceOfferingCode: 'Intermodal',
      serviceOfferingDescription: 'Intermodal',
      serviceOfferingBusinessUnitTransitModeAssociationID: 2,
      transitMode: 'Rail',
      transitModeDescription: 'Transit By Rail',
      serviceLevelBusinessUnitServiceOfferingAssociationID: null,
      serviceLevelCode: null,
      serviceLevelDescription: null,
      equipmentRequirementSpecificationAssociationID: null,
      equipmentClassificationCode: 'Forklift',
      equipmentClassificationCodeDescription: 'FORKLIFT',
      equipmentTypeCode: null,
      equipmentTypeCodeDescription: null,
      equipmentLengthQuantity: null,
      unitOfEquipmentLengthMeasurementCode: null,
      operationalServices: [],
      priorityLevelNumber: 22,
      overiddenPriorityLevelNumber: null,
      lineHaulAwardStatusTypeID: 4,
      lineHaulAwardStatusTypeName: 'Tertiary',
      rates: [
        {
          customerLineHaulRateID: 4937,
          customerLineHaulConfigurationID: 4809,
          chargeUnitTypeName: 'Per Pallet',
          rateAmount: 12,
          minimumAmount: null,
          maximumAmount: null,
          currencyCode: 'USD',
          rateDisplayAmount: '$12.00',
          minDisplayAmount: null,
          maxDisplayAmount: null
        }
      ],
      groupRateType: null,
      groupRateItemizeIndicator: false,
      sourceID: null,
      sourceLineHaulID: null,
      billTos: null,
      carriers: [],
      mileagePreference: null,
      unitOfMeasurement: null,
      hazmatIncludedIndicator: false,
      fuelIncludedIndicator: false,
      autoInvoiceIndicator: true,
      createdUserId: 'rcon913',
      lastUpdateUserId: 'rcon913',
      recordStatus: 'active',
      dbSyncUpdateTimestamp: null,
      equipmentLengthDisplayName: '',
      customerAgreementContractDisplayName: 'HGEU2 - Legal (HGEU2 - Legal)',
      numberOfStops: 0
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });

  it('should call addLineHaulForm', () => {
    component.addLineHaulForm();
  });

  it('should call checkInSuggestion', () => {
    component.checkInSuggestion();
  });

  it('should call onautoCompleteBlur-originPoint', () => {
    component.laneCardModel.isOriginRangeSelected = false;
    component.laneCardModel.laneCardForm.controls['originPoint'].setValue('');
    const element = fixture.debugElement.query(By.css('[formControlName="originPoint"]'));
    element.triggerEventHandler('onBlur', { target: { value: '' } });
    fixture.detectChanges();
  });
  it('should call getOriginTypes', () => {
    spyOn(laneCardService, 'getGeographyTypes').and.returnValue(of(originType));
    component.getOriginTypes();
  });

  it('should call onOriginPointSelected', () => {
    const event = new Event('myEvent');
    event['dtoValues'] = {
      addressLine1: '612 Antrim Commons Dr',
      addressLine2: '',
      cityName: 'Greencastle',
      countryCode: 'USA',
      countryName: 'USA',
      postalCode: '172251617',
      stateCode: 'PA',
      stateName: 'Pennsylvania'
    };
    event['label'] = 'Ns Greencastle(G&), 612 Antrim Commons Dr, Greencastle, PA 172251617, USA';
    event['value'] = 216756;
    component.onOriginPointSelected(event);
  });

  it('should call checkValidRange', () => {
    const orgFrom = { 'label': '02916-100', 'value': 7432, 'dtoValues': '45246-565' };
    const orgTo = { 'label': '45246-565', 'value': 154185, 'dtoValues': '02916-100' };
    component.laneCardModel.laneCardForm.controls['originPointFrom'].setValue(orgFrom);
    component.laneCardModel.laneCardForm.controls['originPointTo'].setValue(orgTo);
    component.checkValidRange(event, 'originPointFrom', 'originPointFrom', 'originPointTo', 'isOriginRangeError');
  });
  it('should call checkValidRange-else', () => {
    component.laneCardModel.laneCardForm.controls['originPointFrom'].setValue(null);
    component.laneCardModel.laneCardForm.controls['originPointTo'].setValue(null);
    component.checkValidRange(event, 'originPointFrom', 'originPointFrom', 'originPointTo', 'isOriginRangeError');
  });

  it('should call onDestinationPointSelected', () => {
    const event = new Event('myEvent');
    event['dtoValues'] = {
      addressLine1: '612 Antrim Commons Dr',
      addressLine2: '',
      cityName: 'Greencastle',
      countryCode: 'USA',
      countryName: 'USA',
      postalCode: '172251617',
      stateCode: 'PA',
      stateName: 'Pennsylvania'
    };
    event['label'] = 'Ns Greencastle(G&), 612 Antrim Commons Dr, Greencastle, PA 172251617, USA';
    event['value'] = 216756;
    component.onDestinationPointSelected(event);
  });

  it('should call onTypeOriginType', () => {
    component.laneCardModel.geographyValues = originTypeDrop;
    const element = fixture.debugElement.query(By.css('[formControlName="originType"]'));
    element.triggerEventHandler('completeMethod', { 'query': 'a' });
    fixture.detectChanges();
  });

  it('should call getCountries', () => {
    const response = {
      '_embedded': {
        'countryTypes': [{
          'countryCode': 'CAN', 'countryID': 31, 'countryName': 'Canada',
          '_links': {
            'self': { 'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/countries/31' },
            'countryType': {
              'href':
                'https://pricing-test.jbhunt.com/pricingconfigurationservices/countries/31{?projection}', 'templated': true
            }
          }
        }, {
          'countryCode': 'MEX', 'countryID': 112, 'countryName': 'Mexico', '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/countries/112'
            }, 'countryType': {
              'href':
                'https://pricing-test.jbhunt.com/pricingconfigurationservices/countries/112{?projection}', 'templated': true
            }
          }
        }, {
          'countryCode': 'USA', 'countryID': 184, 'countryName': 'USA', '_links': {
            'self': {
              'href':
                'https://pricing-test.jbhunt.com/pricingconfigurationservices/countries/184'
            }, 'countryType': {
              'href':
                'https://pricing-test.jbhunt.com/pricingconfigurationservices/countries/184{?projection}', 'templated': true
            }
          }
        }]
      }, '_links': {
        'self': {
          'href':
            'https://pricing-test.jbhunt.com/pricingconfigurationservices/countries{?page,size,sort,projection}', 'templated':
            true
        }, 'profile': { 'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/profile/countries' }
      },
      'page': { 'size': 50, 'totalElements': 3, 'totalPages': 1, 'number': 0 }
    };
    spyOn(laneCardService, 'getCountries').and.returnValue(of(response));
    component.getCountries();
  });

  it('should call onTypeCountries', () => {
    component.laneCardModel.countries = [{ 'label': 'Canada', 'value': 'CAN' }, { 'label': 'Mexico', 'value': 'MEX' }, {
      'label': 'USA', 'value': 'USA'
    }];
    component.laneCardModel.geographyValues = originTypeDrop;
    const element = fixture.debugElement.query(By.css('[formControlName="originCountry"]'));
    element.triggerEventHandler('completeMethod', { 'query': 'a' });
    fixture.detectChanges();
  });

  it('should call onOriginTypeSelected City State', () => {
    const event = new Event('MyEvent');
    event['label'] = 'City State';
    event['value'] = 12;
    const field = 'originPoint';
    const key = 'originID';
    component.onOriginTypeSelected(event, field, key);
  });

  it('should call onOriginTypeSelected Address', () => {
    const event = new Event('MyEvent');
    event['label'] = 'Address';
    event['value'] = 12;
    const field = 'originPoint';
    const key = 'originID';
    component.onOriginTypeSelected(event, field, key);
  });
  it('should call onOriginTypeSelected Address', () => {
    const event = new Event('MyEvent');
    event['label'] = 'Address';
    event['value'] = 12;
    const field = 'destinationPoint';
    const key = 'destinationID';
    component.onOriginTypeSelected(event, field, key);
  });

  it('should call onOriginTypeSelected 9-Zip Range', () => {
    const event = new Event('MyEvent');
    event['label'] = '9-Zip Range';
    event['value'] = 10;
    const field = 'originPoint';
    const key = 'originID';
    component.onOriginTypeSelected(event, field, key);
  });
  it('should call onOriginTypeSelected 9-Zip Range', () => {
    const event = new Event('MyEvent');
    event['label'] = '9-Zip Range';
    event['value'] = 10;
    const field = 'destinationPoint';
    const key = 'destinationID';
    component.onOriginTypeSelected(event, field, key);
  });
  it('should call onOriginTypeSelected 3-Zip Range', () => {
    const event = new Event('MyEvent');
    event['label'] = '3-Zip Region';
    event['value'] = 19;
    const field = 'originPoint';
    const key = 'originID';
    component.onOriginTypeSelected(event, field, key);
  });
  it('should call onOriginTypeSelected 3-Zip Region', () => {
    const event = new Event('MyEvent');
    event['label'] = '3-Zip Region';
    event['value'] = 19;
    const field = 'destinationPoint';
    const key = 'destinationID';
    component.onOriginTypeSelected(event, field, key);
  });
  it('should call onCountrySelected', () => {
    component.laneCardModel.isOriginRangeSelected = true;
    component.laneCardModel.laneCardForm.controls['originPoint'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.laneCardModel.laneCardForm.controls['originPointTo'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onCountrySelected('originPoint', 'isOriginRangeSelected', 'originPointFrom', 'originPointTo');
  });

  it('should call onTypeOriginDestPoint-Address', () => {
    component.laneCardModel['originPoint'] = 'address';
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': 'Address', 'value': '3' });
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onTypeOriginDestPoint('abc', 'originType', 'originCountry', 'originPoint');
  });
  it('should call onTypeOriginDestPoint-cityState', () => {
    component.laneCardModel['originPoint'] = 'cityState';
    component.cityState = 'City State';
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': 'City State', 'value': '1' });
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onTypeOriginDestPoint('ab', 'originType', 'originCountry', 'originPoint');
  });
  it('should call onTypeOriginDestPoint-state', () => {
    component.laneCardModel['originPoint'] = 'state';
    component.cityState = 'State';
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': 'State', 'value': '22' });
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onTypeOriginDestPoint('ab', 'originType', 'originCountry', 'originPoint');
  });
  it('should call onTypeOriginDestPoint-Yard', () => {
    component.laneCardModel['originPoint'] = 'yard';
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': 'Yard', 'value': '5' });
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onTypeOriginDestPoint('a', 'originType', 'originCountry', 'originPoint');
  });
  it('should call onTypeOriginDestPoint-Ramp', () => {
    component.laneCardModel['originPoint'] = 'ramp';
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': 'Ramp', 'value': '4' });
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onTypeOriginDestPoint('a', 'originType', 'originCountry', 'originPoint');
  });
  it('should call onTypeOriginDestPoint-Location', () => {
    component.laneCardModel['originPoint'] = 'location';
    component.cityState = 'Location';
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': 'Location', 'value': '6' });
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onTypeOriginDestPoint('ab', 'originType', 'originCountry', 'originPoint');
  });
  it('should call onTypeOriginDestPoint-2-zip', () => {
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '2-Zip', 'value': '17' });
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.laneCardModel['originPoint'] = '2-zip';
    component.onTypeOriginDestPoint('34', 'originType', 'originCountry', 'originPoint');
  });

  it('should call onTypeOriginDestPoint-3-zip', () => {
    component.laneCardModel['originPoint'] = '3-zip';
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '3-Zip', 'value': '12' });
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onTypeOriginDestPoint('34', 'originType', 'originCountry', 'originPoint');
  });
  it('should call onTypeOriginDestPoint-5-zip', () => {
    component.laneCardModel['originPoint'] = '5-zip';
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '5-Zip', 'value': '2' });
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onTypeOriginDestPoint('34', 'originType', 'originCountry', 'originPoint');
  });
  it('should call onTypeOriginDestPoint-6-zip', () => {
    component.laneCardModel['originPoint'] = '6-zip';
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '6-Zip', 'value': '9' });
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onTypeOriginDestPoint('34', 'originType', 'originCountry', 'originPoint');
  });
  it('should call onTypeOriginDestPoint-9-zip', () => {
    component.laneCardModel['originPoint'] = '9-zip';
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '9-Zip', 'value': '9' });
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onTypeOriginDestPoint('34', 'originType', 'originCountry', 'originPoint');
  });
  it('should call onTypeOriginDestPoint-3-Zip Range', () => {
    component.laneCardModel['originPoint'] = '3-Zip Range';
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '3-Zip Range', 'value': '18' });
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onTypeOriginDestPoint('34', 'originType', 'originCountry', 'originPoint');
  });
  it('should call onTypeOriginDestPoint-5-Zip Range', () => {
    component.laneCardModel['originPoint'] = '5-Zip Range';
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '5-Zip Range', 'value': '14' });
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onTypeOriginDestPoint('34', 'originType', 'originCountry', 'originPoint');
  });
  it('should call onTypeOriginDestPoint-6-Zip Range', () => {
    component.laneCardModel['originPoint'] = '6-Zip Range';
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '6-Zip Range', 'value': '13' });
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onTypeOriginDestPoint('34', 'originType', 'originCountry', 'originPoint');
  });
  it('should call onTypeOriginDestPoint-9-Zip Range', () => {
    component.laneCardModel['originPoint'] = '9-Zip Range';
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': '9-Zip Range', 'value': '11' });
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onTypeOriginDestPoint('34', 'originType', 'originCountry', 'originPoint');
  });
  it('should call onTypeOriginDestPoint-Else', () => {
    component.laneCardModel['originPoint'] = '9-Zip Range';
    component.laneCardModel.laneCardForm.controls['originType'].setValue(null);
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue(null);
    component.onTypeOriginDestPoint('34', 'originType', 'originCountry', 'originPoint');
  });
  it('should call getAddressData', () => {
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    spyOn(laneCardService, 'getOriginPoint').and.returnValue(of(addressResponse));
    component.getAddressData('abc', 'originCountry', 'originType', 'originPoint');
  });

  it('should call getCityState', () => {
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    const query = 'aaa';
    const type = 'originType';
    const fieldName = 'originCountry';
    const controlName = 'originPoint';
    spyOn(laneCardService, 'getCityState').and.returnValue(of(cityStateResponse));
    component.getCityState(query, fieldName, 'cityState', type, controlName);
  });

  it('should call getCityState- state', () => {
    const query = 'aaa';
    const type = 'originType';
    const fieldName = 'originCountry';
    const controlName = 'originPoint';
    spyOn(laneCardService, 'getCityState').and.returnValue(of(cityStateResponse));
    component.getCityState(query, fieldName, 'state', type, controlName);
  });

  it('should call getRampYard', () => {
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.laneCardModel.laneCardForm.controls['originType'].setValue({ 'label': 'Ramp', 'value': 4 });
    const query = 'aaa';
    const type = 'originType';
    const fieldName = 'originCountry';
    const originTypex = 'originPoint';
    const data = {
      hits: {
        hits: [{
          _id: 118910,
          _index: 'masterdata-location-details',
          _score: 0,
          _source: {
            Address: {
              AddressID: 84776,
              AddressLine1: '2401 5Th Ave N',
              AddressLine2: '',
              CityID: 690,
              CityName: 'Bessemer',
              CountryCode: 'USA',
              CountryName: 'USA',
              CountyID: 1412,
              CountyName: 'Jefferson',
              GPS: '33.4094,-86.9509',
              PostalCode: '350204165',
              PostalCodeID: 411438,
              StateCode: 'AL',
              StateName: 'Alabama'
            },
            LocationCode: '+T',
            LocationID: 118910,
            LocationName: '',
            locationtypes: [{
              LocationSubTypeCode: 'Ramp',
              LocationSubTypeDescription: 'Ramp',
              LocationTypeCode: 'Asset',
              LocationTypeDescription: 'Asset/Company Owned'
            }],
          },
          _type: 'location_info'
        }],
        total: 1,
        max_score: 0,
      }
    };
    spyOn(LaneCardService.prototype, 'getOriginPoint').and.returnValue(of(data));
    component.getRampYard(query, fieldName, 'yard', type, originTypex);
  });

  it('should call getLocation', () => {
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    const query = 'aaa';
    const type = 'originType';
    const fieldName = 'originCountry';
    const originTypex = 'originPoint';
    const response = {
      'took': 820,
      'timed_out': false,
      '_shards': {
        'total': 5,
        'successful': 5,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 162440,
        'max_score': 0,
        'hits': [
          {
            '_index': 'masterdata-location-details',
            '_type': 'location_info',
            '_id': '349975',
            '_score': 0,
            '_source': {
              'locationtypes': [
                {
                  'LocationSubTypeCode': 'NULL',
                  'LocationSubTypeDescription': 'NULL',
                  'LocationTypeDescription': 'Commercial',
                  'LocationTypeCode': 'Comm'
                }
              ],
              'Address': {
                'CountryName': 'USA',
                'StateName': 'Alabama',
                'StateCode': 'AL',
                'PostalCode': '36607',
                'CityName': 'Mobile',
                'GPS': '30.7083,-88.1166',
                'CountyID': 1979,
                'CountyName': 'Mobile',
                'AddressLine2': null,
                'AddressLine1': '3161 Crichon St',
                'PostalCodeID': 123582,
                'CityID': 1266,
                'CountryCode': 'USA',
                'AddressID': 1664995
              },
              'LocationID': 349975,
              'LocationCode': 'QUMO2',
              'LocationName': 'Quick Delivery Service Inc'
            }
          }
        ]
      }
    };
    spyOn(laneCardService, 'getOriginPoint').and.returnValue(of(response));
    component.getLocation(query, fieldName, 'location', type, originTypex);
  });

  it('should call getPostalCode- origin', () => {
    const query = 'aaa';
    const type = 'originCountry';
    const fieldName = 'originType';
    const originTypex = 'originPoint';
    spyOn(laneCardService, 'getCityState').and.returnValue(of(postalCodeEmptyResponse));
    component.getPostalCode(query, type, '3', fieldName, originTypex);
  });

  it('should call getPostalCode- originPointFrom', () => {
    const query = 'aaa';
    const type = 'originCountry';
    const fieldName = 'originType';
    const originTypex = 'originPointFrom';
    spyOn(laneCardService, 'getCityState').and.returnValue(of(postalCodeEmptyResponse));
    component.getPostalCode(query, type, '3', fieldName, originTypex);
  });

  it('should call getPostalCode- destination', () => {
    const query = 'aaa';
    const type = 'destinationCountry';
    const fieldName = 'destinationType';
    const originTypex = 'destinationPointFrom';
    spyOn(laneCardService, 'getCityState').and.returnValue(of(postalCodeEmptyResponse));
    component.getPostalCode(query, type, '3', fieldName, originTypex);
  });

  it('should call AddressDtoFromer', () => {
    const list = {
      AddressID: 175870,
      AddressLine1: '7764 Colerain Ave',
      AddressLine2: '',
      CityName: 'Cincinnati',
      CountryCode: 'USA',
      CountryName: 'USA',
      PostalCode: '452394504',
      StateCode: 'OH',
      StateName: 'Ohio'
    };
    component.AddressDtoFromer(list);
  });

  it('should call cityDtoFromer', () => {
    const list = {
      CityID: 18525,
      CityName: 'Ady',
      Country: {
        CountryCode: 'USA',
        CountryName: 'USA'
      },
      State: {
        StateCode: 'MD',
        StateID: 106,
        StateName: 'Maryland'
      }
    };
    component.cityDtoFromer(list, 'city');
  });

  it('should call setFormErrors', () => {
    const controlName = 'originPoint';
    component.setFormErrors(controlName);
  });

  it('should call setvalueforLaneCard', () => {
    utilityService.editLineHaulData = {
      lineHaulDetails: 1760,
      isEditFlag: true
    };
    utilityService.setEditLineHaulData(utilityService.editLineHaulData);
    component.laneCardModel.geographyValues = originTypeDrop;
    broadcasterService.broadcast('editlinehaulDetails', lineHaulEditDetails);
    component.setvalueforLaneCard();
  });

  it('should call processedLaneDetails Address', () => {
    lineHauldetails.originType = 'Address';
    component.processedLaneDetails(lineHauldetails, 'originPoints', 'originType');
  });

  it('should call processedLaneDetails State', () => {
    lineHauldetails.originType = 'State';
    component.processedLaneDetails(lineHauldetails, 'originPoints', 'originType');
  });

  it('should call processedLaneDetails City State', () => {
    lineHauldetails.originType = 'City State';
    component.processedLaneDetails(lineHauldetails, 'originPoints', 'originType');
  });

  it('should call processedLaneDetails 2-Zip', () => {
    lineHauldetails.originType = '2-Zip';
    component.processedLaneDetails(lineHauldetails, 'originPoints', 'originType');
  });

  it('should call processedLaneDetails 5-Zip', () => {
    lineHauldetails.originType = '5-Zip';
    component.processedLaneDetails(lineHauldetails, 'originPoints', 'originType');
  });

  it('should call processedLaneDetails 3-Zip', () => {
    lineHauldetails.originType = '3-Zip';
    component.processedLaneDetails(lineHauldetails, 'originPoints', 'originType');
  });

  it('should call processedLaneDetails 9-Zip', () => {
    lineHauldetails.originType = '9-Zip';
    component.processedLaneDetails(lineHauldetails, 'originPoints', 'originType');
  });
  it('should call processedLaneDetails 6-Zip', () => {
    lineHauldetails.originType = '6-Zip';
    component.processedLaneDetails(lineHauldetails, 'originPoints', 'originType');
  });
  it('should call processedLaneDetails Yard', () => {
    lineHauldetails.originType = 'Yard';
    component.processedLaneDetails(lineHauldetails, 'originPoints', 'originType');
  });

  it('should call processedLaneDetails Ramp', () => {
    lineHauldetails.originType = 'Ramp';
    component.processedLaneDetails(lineHauldetails, 'originPoints', 'originType');
  });

  it('should call processedLaneDetails Location', () => {
    lineHauldetails.originType = 'Location';
    component.processedLaneDetails(lineHauldetails, 'originPoints', 'originType');
  });
  it('should call processedLaneDetails 3-Zip Region', () => {
    lineHauldetails.originType = '3-Zip Region';
    component.processedLaneDetails(lineHauldetails, 'originPoints', 'originType');
  });

  it('should call getEditData - Address', () => {
    spyOn(laneCardService, 'getOriginPoint').and.returnValue(of(addressResponse));
    component.getEditData('Address', lineHauldetails, 'originPoints');
  });

  it('should call getEditData - YardRampLoc', () => {
    spyOn(laneCardService, 'getOriginPoint').and.returnValue(of(addressResponse));
    component.getEditData('YardRampLoc', lineHauldetails, 'originPoints');
  });

  it('should call getEditData - Zip', () => {
    spyOn(laneCardService, 'getCityState').and.returnValue(of(postalCodeResponse));
    component.getEditData('Zip', lineHauldetails, 'originPoints');
  });

  it('should call getEditData - CityState', () => {
    spyOn(laneCardService, 'getCityState').and.returnValue(of(cityStateResponse));
    component.getEditData('cityState', lineHauldetails, 'originPoints');
  });

  it('should call getEditData - State', () => {
    spyOn(laneCardService, 'getCityState').and.returnValue(of(cityStateResponse));
    component.getEditData('state', lineHauldetails, 'originPoints');
  });
  it('should call getEditOriginandDestinationType City State', () => {
    component.getEditOriginandDestinationType('City State', 'originPoint', 'originId');
  });

  it('should call getEditOriginandDestinationType State', () => {
    component.getEditOriginandDestinationType('State', 'originPoint', 'originId');
  });

  it('should call getEditOriginandDestinationType Yard', () => {
    component.getEditOriginandDestinationType('Yard', 'originPoint', 'originId');
  });

  it('should call getEditOriginandDestinationType Ramp', () => {
    component.getEditOriginandDestinationType('Ramp', 'originPoint', 'originId');
  });

  it('should call getEditOriginandDestinationType Location', () => {
    component.getEditOriginandDestinationType('Location', 'originPoint', 'originId');
  });

  it('should call getEditOriginandDestinationType 2-Zip', () => {
    component.getEditOriginandDestinationType('2-Zip', 'originPoint', 'originId');
  });

  it('should call getEditOriginandDestinationType 3-Zip', () => {
    component.getEditOriginandDestinationType('3-Zip', 'originPoint', 'originId');
  });

  it('should call getEditOriginandDestinationType 5-Zip', () => {
    component.getEditOriginandDestinationType('5-Zip', 'originPoint', 'originId');
  });

  it('should call getEditOriginandDestinationType 6-Zip', () => {
    component.getEditOriginandDestinationType('6-Zip', 'originPoint', 'originId');
  });

  it('should call getEditOriginandDestinationType 9-Zip', () => {
    component.getEditOriginandDestinationType('9-Zip', 'originPoint', 'originId');
  });
  it('should call getEditOriginandDestinationType 3-Zip Range', () => {
    component.getEditOriginandDestinationType('3-Zip Range', 'originPoint', 'originId');
  });
  it('should call getEditOriginandDestinationType 5-Zip Range', () => {
    component.getEditOriginandDestinationType('5-Zip Range', 'originPoint', 'originId');
  });

  it('should call setCountryForEdit', () => {
    component.laneCardModel.countries = [{ 'label': 'Canada', 'value': 'CAN' }, { 'label': 'Mexico', 'value': 'MEX' }, {
      'label': 'USA', 'value': 'USA'
    }];
    component.setCountryForEdit('CAN', 'origin');
  });
  it('should call setCountryForEdit-destination', () => {
    component.laneCardModel.countries = [{ 'label': 'Canada', 'value': 'CAN' }, { 'label': 'Mexico', 'value': 'MEX' }, {
      'label': 'USA', 'value': 'USA'
    }];
    component.setCountryForEdit('CAN', 'destination');
  });
  it('should call postalCodeSplice', () => {
    const location = {
      'PostalCodeID': 115945,
      'PostalCode': '340123456'
    };
    component.postalCodeSplice(location);
  });
  it('should call postalCodeSplice-else', () => {
    const location = {
      'PostalCodeID': 115945,
      'PostalCode': '340'
    };
    component.postalCodeSplice(location);
  });
  it('should call addZipRange for if condition', () => {
    component.laneCardModel.laneCardForm.controls['originPoint'].setErrors(null);
    component.addZipRange('origin');
  });
  it('should call addZipRange for else condition', () => {
    component.laneCardModel.laneCardForm.controls['originPoint'].setErrors({invalid: true});
    component.addZipRange('origin');
  });
  it('should call onSearchZip', () => {
    component.laneCardModel.selectedPoint = 'origin';
    component.laneCardModel.laneCardForm.controls['originCountry'].setValue({ 'label': 'USA', 'value': 'USA' });
    component.onSearchZip('100', 'rangeFrom');
  });
  it('should call autoCompleteBlur', () => {
    component.laneCardModel.isShowAddRangePopup = true;
    component.laneCardModel.zipRangeForm.controls['rangeFrom'].setValue('');
    const element = fixture.debugElement.query(By.css('[formControlName="rangeFrom"]'));
    element.triggerEventHandler('onBlur', { target: { value: '' } });
    fixture.detectChanges();
  });
  it('should call hidePopup', () => {
    component.hidePopup();
  });
  it('should call addRangeValue', () => {
    component.laneCardModel.laneCardForm.patchValue({
      originPoint: []
    });
    component.laneCardModel.selectedPoint = 'origin';
    component.laneCardModel.zipRangeForm.controls['rangeFrom'].setValue({ 'label': '101', 'value': 26654 });
    component.laneCardModel.zipRangeForm.controls['rangeTo'].setValue({ 'label': '102', 'value': 26828 });
    component.addRangeValue();
  });
  it('should call addRangeValue for undefined value', () => {
    component.laneCardModel.laneCardForm.patchValue({
      originPoint: []
    });
    component.laneCardModel.selectedPoint = 'origin';
    component.laneCardModel.zipRangeForm.controls['rangeFrom'].setValue('101');
    component.laneCardModel.zipRangeForm.controls['rangeTo'].setValue('102');
    component.addRangeValue();
  });
  it('should call onSelectValue', () => {
    component.laneCardModel.laneCardForm.controls['originPoint']
    .setValue([{label: '101', value: 26654, dtoValues: '101', country: undefined},
    {label: '102', value: 26828, dtoValues: '102', country: undefined}]);
    component.laneCardModel.isShowAddRangePopup = true;
    component.laneCardModel.selectedPoint = 'origin';
    const event = {label: '101', value: 26654, dtoValues: '101', country: undefined};
    component.onSelectValue(event, 'rangeFrom', 'zipRangeForm');
  });
  it('should call setVariables', () => {
    LaneCardUtility.setVariables(component.laneCardModel, 'originPoint', 'originPoint');
  });
  it('should call checkInvalidField for else', () => {
    component.laneCardModel.zipRangeForm = zipRangeForm;
    component.laneCardModel.zipRangeForm.controls['rangeFrom'].setValue({label: ''});
    component.laneCardModel.zipRangeForm.controls['rangeTo'].setValue({label: ''});
    LaneCardUtility.checkInvalidField(component.laneCardModel, messageService);
  });
  it('should call onFieldBlur for else', () => {
    const event: any = {
      target : {
        value: true
      }
    };
    component.laneCardModel.zipRangeForm.controls['rangeFrom'].setValue({dtoValues: 4});
    component.laneCardModel.zipRangeForm.controls['rangeTo'].setValue({dtoValues: 2});
    LaneCardUtility.onFieldBlur(event, 'rangeFrom', component.laneCardModel);
  });
  it('should call onFieldBlur for else', () => {
    const event: any = {
      target : {
        value: true
      }
    };
    component.laneCardModel.zipRangeForm.controls['rangeFrom'].setValue({label: ''});
    component.laneCardModel.zipRangeForm.controls['rangeTo'].setValue({label: ''});
    LaneCardUtility.onFieldBlur(event, 'rangeFrom', component.laneCardModel);
  });
  it('should call getCountry ', () => {
    component.laneCardModel.laneCardForm = laneCardForm;
    component.laneCardModel.laneCardForm.controls['originType'].setValue([{
      dtoValues: {
        countryCode: 'USA'
      }
    }]);
    LaneCardUtility.getCountry('originType', component.laneCardModel);
  });
  it('should call frameValueDto ', () => {
    const postalCodeResponse1 = [
          {
            '_index': 'masterdata-location-details',
            '_type': 'location_info',
            '_id': '349975',
            '_score': 0,
            '_source': {
              'PostalCodeID': 349975,
              'PostalCode': 'QUMO2',
              'CountryCode': 'Quick Delivery Service Inc'
            }
          }
        ];
    LaneCardUtility.frameValueDto(postalCodeResponse1);
  });
  it('should call frameValueDto for else', () => {
    const postalCodeResponse1 = [];
    LaneCardUtility.frameValueDto(postalCodeResponse1);
  });
});
