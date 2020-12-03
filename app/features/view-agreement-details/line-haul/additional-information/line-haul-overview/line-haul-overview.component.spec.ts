import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { LineHaulOverviewService } from './services/line-haul-overview.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LineHaulOverViewModel } from './model/line-haul-overview.model';

import { LineHaulOverviewComponent } from './line-haul-overview.component';
import { ViewAgreementDetailsUtility } from './../../../service/view-agreement-details-utility';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';
import { of } from 'rxjs';
import { OverviewService } from '../../add-line-haul/overview/services/overview.service';

describe('LineHaulOverviewComponent', () => {
  let component: LineHaulOverviewComponent;
  let fixture: ComponentFixture<LineHaulOverviewComponent>;
  let utilityService: ViewAgreementDetailsUtility;
  let broadcastService: BroadcasterService;
  let lhos: LineHaulOverviewService;
  let cityStateData;
  let lineHauldetails;
  let linehauldata;
  let linehaulcitydata;
  let hitsInterface;
  let addressData;
  let zipCode;
  let os: OverviewService;

  const lineHaulEditDetails: any = {
    'customerLineHaulConfigurationID': 6627,
    'laneID': 7887,
    'lineHaulSourceTypeID': 4,
    'lineHaulSourceTypeName': 'Manual ',
    'originTypeID' : 19,
    'originType' : 'string',
    'destinationTypeID' : 19,
    'destinationType' : 'string',
    'originDescription' : null,
    'originVendorID' : null,
    'destinationDescription' : null,
    'destinationVendorID' : null,
    'originPoints': [
      {
        'country': 'string',
        'point': 'string',
        'pointID': 123,
        'addressLine1': 'string',
        'addressLine2': 'string',
        'cityName': 'string',
        'countryCode': 'string',
        'countryName': 'string',
        'postalCode': 'string',
        'stateCode': 'string',
        'stateName': 'string',
        'lowerBoundID': 123,
        'lowerBound': 'string',
        'upperBoundID': 123,
        'upperBound': 'string',
        'description': 'string',
        'pointDisplayName': 'string',
        'subTypeID': 123,
        'subTypeName': 'string'
    }],
    'destinationPoints': [
      {
        'country': 'string',
        'point': 'string',
        'pointID': 123,
        'addressLine1': 'string',
        'addressLine2': 'string',
        'cityName': 'string',
        'countryCode': 'string',
        'countryName': 'string',
        'postalCode': 'string',
        'stateCode': 'string',
        'stateName': 'string',
        'lowerBoundID': 123,
        'lowerBound': 'string',
        'upperBoundID': 123,
        'upperBound': 'string',
        'description': 'string',
        'pointDisplayName': 'string',
        'subTypeID': 123,
        'subTypeName': 'string'
    }],
    'stops': [{
      'stopSequenceNumber': 1,
      'typeName': 'Address',
      'customerLineHaulStopID': 3,
      'stopCountry': null,
      'stopPoint': null,
      'stopLocationPointID': 1696697,
      'geographicPointUsageLevelTypeAssociationID': 32,
      'vendorID': null
    },
    {
      'stopSequenceNumber': 2,
      'typeName': 'City State',
      'customerLineHaulStopID': 1,
      'stopCountry': null,
      'stopPoint': null,
      'stopLocationPointID': 47306,
      'geographicPointUsageLevelTypeAssociationID': 40,
      'vendorID': null
    },
    {
      'stopSequenceNumber': 3,
      'typeName': 'State',
      'customerLineHaulStopID': 22,
      'stopCountry': null,
      'stopPoint': null,
      'stopLocationPointID': 93,
      'geographicPointUsageLevelTypeAssociationID': 50,
      'vendorID': null
    },
    {
      'stopSequenceNumber': 4,
      'typeName': 'Country',
      'customerLineHaulStopID': 23,
      'stopCountry': null,
      'stopPoint': null,
      'stopLocationPointID': 184,
      'geographicPointUsageLevelTypeAssociationID': 29,
      'vendorID': null
    },
    {
      'stopSequenceNumber': 5,
      'typeName': 'Location',
      'customerLineHaulStopID': 6,
      'stopCountry': null,
      'stopPoint': null,
      'stopLocationPointID': 26958,
      'geographicPointUsageLevelTypeAssociationID': 26,
      'vendorID': null
    },
    {
      'stopSequenceNumber': 6,
      'typeName': '9-Zip',
      'customerLineHaulStopID': 7,
      'stopCountry': null,
      'stopPoint': null,
      'stopLocationPointID': 339170,
      'geographicPointUsageLevelTypeAssociationID': 36,
      'vendorID': null
    },
    {
      'stopSequenceNumber': 7,
      'typeName': '6-Zip',
      'customerLineHaulStopID': 7,
      'stopCountry': null,
      'stopPoint': null,
      'stopLocationPointID': 339170,
      'geographicPointUsageLevelTypeAssociationID': 36,
      'vendorID': null
    },
    {
      'stopSequenceNumber': 8,
      'typeName': '5-Zip',
      'customerLineHaulStopID': 7,
      'stopCountry': null,
      'stopPoint': null,
      'stopLocationPointID': 339170,
      'geographicPointUsageLevelTypeAssociationID': 36,
      'vendorID': null
    },
    {
      'stopSequenceNumber': 9,
      'typeName': '3-Zip',
      'customerLineHaulStopID': 7,
      'stopCountry': null,
      'stopPoint': null,
      'stopLocationPointID': 339170,
      'geographicPointUsageLevelTypeAssociationID': 36,
      'vendorID': null
   },
    {
      'stopSequenceNumber': 10,
      'typeName': '2-Zip',
      'customerLineHaulStopID': 7,
      'stopCountry': null,
      'stopPoint': null,
      'stopLocationPointID': 339170,
      'geographicPointUsageLevelTypeAssociationID': 36,
      'vendorID': null
    },
    {
      'stopSequenceNumber': 7,
      'typeName': 'Ramp',
      'customerLineHaulStopID': 4,
      'stopCountry': null,
      'stopPoint': null,
      'stopLocationPointID': 160229,
      'geographicPointUsageLevelTypeAssociationID': 35,
      'vendorID': null
    },
    {
      'stopSequenceNumber': 8,
      'typeName': 'Yard',
      'customerLineHaulStopID': 5,
      'stopCountry': null,
      'stopPoint': null,
      'stopLocationPointID': 26169,
      'geographicPointUsageLevelTypeAssociationID': 25,
      'vendorID': null
    },
    {
      'stopSequenceNumber': 8,
      'typeName': 'default',
      'customerLineHaulStopID': 5,
      'stopCountry': null,
      'stopPoint': null,
      'stopLocationPointID': 26169,
      'geographicPointUsageLevelTypeAssociationID': 25,
      'vendorID': null
    }
    ],
    'stopChargeIncludedIndicator': false,
    'status': 'Draft',
    'effectiveDate': '2019-08-20',
    'expirationDate': '2019-08-29',
    'customerAgreementID': 48,
    'customerAgreementName': 'Malnove Incorporated Of Ut (MACLEJ)',
    'customerAgreementContractID': 86,
    'customerAgreementContractNumber': '123rest',
    'customerAgreementContractName': 'test',
    'customerAgreementContractSectionID': 830,
    'customerAgreementContractSectionName': 'mac 14',
    'financeBusinessUnitServiceOfferingAssociationID': 5,
    'financeBusinessUnitName': 'DCS',
    'serviceOfferingCode': 'Dedicated',
    'serviceOfferingDescription': 'Dedicated',
    'serviceOfferingBusinessUnitTransitModeAssociationID': 4,
    'transitMode': 'Truck',
    'transitModeDescription': 'Transit By Truck',
    'serviceLevelBusinessUnitServiceOfferingAssociationID': null,
    'serviceLevelCode': null,
    'serviceLevelDescription': null,
    'equipmentRequirementSpecificationAssociationID': null,
    'equipmentClassificationCode': 'Hopper',
    'equipmentClassificationCodeDescription': 'HOPPER',
    'equipmentTypeCode': null,
    'equipmentTypeCodeDescription': null,
    'equipmentLengthQuantity': null,
    'unitOfEquipmentLengthMeasurementCode': null,
    'operationalServices': [

    ],
    'priorityLevelNumber': 57,
    'overiddenPriorityLevelNumber': null,
    'lineHaulAwardStatusTypeID': 3,
    'lineHaulAwardStatusTypeName': 'Secondary',
    'rates': [
      {
        'customerLineHaulRateID': 7241,
        'customerLineHaulConfigurationID': 6627,
        'chargeUnitTypeName': 'Per Mile',
        'rateAmount': 12.0000,
        'minimumAmount': null,
        'maximumAmount': null,
        'currencyCode': 'USD',
        'rateDisplayAmount': '$12.00',
        'minDisplayAmount': null,
        'maxDisplayAmount': null
      }
    ],
    'groupRateType': null,
    'groupRateItemizeIndicator': false,
    'sourceID': null,
    'sourceLineHaulID': null,
    'billTos': null,
    'carriers': [

    ],
    'mileagePreference': null,
    'unitOfMeasurement': null,
    'hazmatIncludedIndicator': false,
    'fuelIncludedIndicator': false,
    'autoInvoiceIndicator': true,
    'createdUserId': 'jcnt253',
    'lastUpdateUserId': 'jcnt253',
    'recordStatus': 'active',
    'dbSyncUpdateTimestamp': null,
    'equipmentLengthDisplayName': '',
    'customerAgreementContractDisplayName': '123rest (test)',
    'numberOfStops': 0
  };

  const stateIdCity: any = {
    'took': 19,
    'timed_out': false,
    '_shards': {
      'total': 3,
      'successful': 3,
      'skipped': 0,
      'failed': 0
    },
    'hits': {
      'total': 1,
      'max_score': 1,
      'hits': [
        {
          '_index': 'masterdata-geography-postalcode-1-2019.04.30',
          '_type': 'doc',
          '_id': '61947',
          '_score': 1,
          'inner_hits': {
            'City': {
              'hits': {
                'total': 1,
                'max_score': 1,
                'hits': [
                  {
                    '_index': 'masterdata-geography-postalcode-1-2019.04.30',
                    '_type': 'doc',
                    '_id': '61947',
                    '_nested': {
                      'field': 'City',
                      'offset': 0
                    },
                    '_score': 1,
                    '_source': {
                      'State': {
                        'StateCode': 'MD'
                      },
                      'CityName': 'Alpha'
                    }
                  }
                ]
              }
            }
          }
        }
      ]
    }
  };
 const stateIdAddress: any = {
    'took': 14,
    'timed_out': false,
    '_shards': {
      'total': 3,
      'successful': 3,
      'skipped': 0,
      'failed': 0
    },
    'hits': {
      'total': 1,
      'max_score': 0,
      'hits': [
        {
          '_index': 'masterdata-location-details-1-2019.05.01',
          '_type': 'doc',
          '_id': '822',
          '_score': 0,
          '_source': {
            'Address': {
              'AddressLine1': '3571 Us Highway 283 N',
              'CountryName': 'USA',
              'StateCode': 'TX',
              'PostalCode': '763807110',
              'CityName': 'Seymour',
              'CountryCode': 'USA',
              'AddressID': 263074
            }
          }
        }
      ]
    }
  };
  const stateIdState: any = {
    'took': 66,
    'timed_out': false,
    '_shards': {
      'total': 3,
      'successful': 3,
      'skipped': 0,
      'failed': 0
    },
    'hits': {
      'total': 1586,
      'max_score': 1,
      'hits': [
        {
          '_index': 'masterdata-geography-postalcode-1-2019.04.30',
          '_type': 'doc',
          '_id': '327589',
          '_score': 1,
          'inner_hits': {
            'City': {
              'hits': {
                'total': 1,
                'max_score': 1,
                'hits': [
                  {
                    '_index': 'masterdata-geography-postalcode-1-2019.04.30',
                    '_type': 'doc',
                    '_id': '327589',
                    '_nested': {
                      'field': 'City',
                      'offset': 1
                    },
                    '_score': 1,
                    '_source': {
                      'State': {
                        'StateName': 'Florida'
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      ]
    }
  };
  const stateIdZip: any = {
    'took': 63,
    'timed_out': false,
    '_shards': {
      'total': 3,
      'successful': 3,
      'skipped': 0,
      'failed': 0
    },
    'hits': {
      'total': 1,
      'max_score': 1,
      'hits': [
        {
          '_index': 'masterdata-geography-postalcode-1-2019.04.30',
          '_type': 'doc',
          '_id': '339170',
          '_score': 1,
          '_source': {
            'PostalCode': 'MILWAUKEE'
          }
        }
      ]
    }
  };
  hitsInterface = {
    'took': 15,
    'timed_out': false,
    '_shards': {
      'total': 3,
      'successful': 3,
      'skipped': 0,
      'failed': 0
    },
    hits: {
      total: 1,
      max_score: null,
      hits: [],
    }
  };
  const stateIdLocationRampYard: any = {
    '_index': 'masterdata-location-details',
    '_type': 'location_info',
    '_id': '94099',
    '_score': 0.0,
    '_source': {
      'Address': {
        'CountryName': 'USA',
        'StateName': 'California',
        'StateCode': 'CA',
        'PostalCode': '948061101',
        'CityName': 'Richmond',
        'GPS': '37.9949,-122.343',
        'CountyID': 640,
        'CountyName': 'Contra Costa',
        'AddressLine2': null,
        'AddressLine1': '1601 Atlas Rd',
        'PostalCodeID': 497716,
        'CityID': 5055,
        'CountryCode': 'USA',
        'AddressID': 207104
      },
      'LocationID': 94099,
      'LocationCode': '&R',
      'LocationName': 'Bnsf Northbay Facility'
    }
  };
  const originDestCity: any = {
    'took': 15,
    'timed_out': false,
    '_shards': {
      'total': 3,
      'successful': 3,
      'skipped': 0,
      'failed': 0
    },
    'hits': {
      'total': 3,
      'max_score': 1,
      'hits': [
        {
          '_index': 'masterdata-geography-postalcode-1-2019.04.30',
          '_type': 'doc',
          '_id': '6803',
          '_score': 1,
          'inner_hits': {
            'City': {
              'hits': {
                'total': 1,
                'max_score': 1,
                'hits': [
                  {
                    '_index': 'masterdata-geography-postalcode-1-2019.04.30',
                    '_type': 'doc',
                    '_id': '6803',
                    '_nested': {
                      'field': 'City',
                      'offset': 1
                    },
                    '_score': 1,
                    '_source': {
                      'State': {
                        'StateCode': 'RI'
                      },
                      'CityName': 'West Greenwich'
                    }
                  }
                ]
              }
            }
          }
       }
      ]
    }
  };
  cityStateData = {
    inner_hits: {
      City: {
        hits: {
          hits: [{
            _id: '35598',
            _index: 'masterdata-geography-postalcode',
            _nested: {
              field: 'City',
              offset: 0
            },
            _score: 1,
            _source: {
              CityName: 'Cato',
              Country: {
                CountryName: 'USA'
              },
              State: { StateCode: 'NY' }
            },
            _type: 'doc'
          }],
          max_score: 1,
          total: 1
        }
      }
    },
    _index: 'masterdata-geography-postalcode',
    _type: 'doc',
    _id: '115945',
    _score: null,
  };
  const originDestZipRange: any = {
    'took': 16,
    'timed_out': false,
    '_shards': {
      'total': 3,
      'successful': 3,
      'skipped': 0,
      'failed': 0
    },
    'hits': {
      'total': 2,
      'max_score': 1,
      'hits': [
        {
          '_index': 'masterdata-geography-postalcode-1-2019.04.30',
          '_type': 'doc',
          '_id': '27164',
          '_score': 1,
          '_source': {
            'PostalCode': '104'
          }
        },
        {
          '_index': 'masterdata-geography-postalcode-1-2019.04.30',
          '_type': 'doc',
          '_id': '59197',
          '_score': 1,
          '_source': {
            'PostalCode': '204'
          }
        }
      ]
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, ViewAgreementDetailsUtility, BroadcasterService, LineHaulOverviewService,
        OverviewService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineHaulOverviewComponent);
    component = fixture.componentInstance;
    utilityService = TestBed.get(ViewAgreementDetailsUtility);
    broadcastService = TestBed.get(BroadcasterService);
    lhos = TestBed.get(LineHaulOverviewService);
    os = TestBed.get(OverviewService);
    component.overViewModel = new LineHaulOverViewModel();

    lineHauldetails = {
      customerLineHaulConfigurationID: 123,
      laneID: 12,
      lineHaulSourceTypeID: 12,
      lineHaulSourceTypeName: 'string',
      originPoints: {
        type: 'string',
        typeID: 123,
        country: 'string',
        point: 'string',
        pointID: 123,
        description: 'string',
        vendorID: 'string'
      },
      destinationPoints: null,
      stops: [],
      stopChargeIncludedIndicator: true,
      status: 'string',
      effectiveDate: new Date('05/05/1995'),
      expirationDate: new Date('05/05/1995'),
      customerAgreementID: 123,
      customerAgreementName: 'string',
      customerAgreementContractID: 123,
      customerAgreementContractNumber: 'string',
      customerAgreementContractName: 'string',
      customerAgreementContractSectionID: 123,
      customerAgreementContractSectionName: 'string',
      financeBusinessUnitServiceOfferingAssociationID: 123,
      financeBusinessUnitName: 'string',
      serviceOfferingCode: 'string',
      serviceOfferingBusinessUnitTransitModeAssociationID: 123,
      transitMode: 'string',
      serviceLevelBusinessUnitServiceOfferingAssociationID: 123,
      serviceLevelCode: 'string',
      equipment: '',
      operationalServices: [],
      priorityLevelNumber: 123,
      overriddenPriority: 'string',
      lineHaulAwardStatusTypeID: 123,
      lineHaulAwardStatusTypeName: 'string',
      rates: [],
      groupRateType: 'string',
      groupRateItemizeIndicator: true,
      sourceID: 123,
      sourceLineHaulID: 123,
      overiddenPriorityLevelNumber: 123,
     lineHaulMileageRangeMinQuantity: 123,
      lineHaulMileageRangeMaxQuantity: 123,
      billTos: [{
        billToID: 123
      }],
      carriers: [{
        carrierID: 123
      }],
      mileagePreference: {
        range: 'abc',
        mileagePreferenceID: 12,
        mileagePreferenceName: 'abc'
      },
      unitOfMeasurement: {
        code: 'abc',
        lineHaulWeightRangeMinQuantity: '123',
        lineHaulWeightRangeMaxQuantity: '1,000'
      },
      hazmatIncludedIndicator: true,
      fuelIncludedIndicator: true,
      autoInvoiceIndicator: true,
      equipmentRequirementSpecificationAssociationID: 123,
      equipmentClassificationCode: 'string',
      equipmentClassificationCodeDescription: 'string',
      equipmentTypeCode: 'string',
      equipmentClassificationDescription: 'string',
      equipmentTypeCodeDescription: 'string',
      equipmentLengthQuantity: 123,
      unitOfEquipmentLengthMeasurementCode: 'string'
    };

    linehauldata = {
      hits: {
        max_score: null,
        total: 1,
        hits: [{
          _index: 'masterdata-geography-postalcode',
          _type: 'doc',
          _id: '115945',
          _score: null,
          _source: [{
            Address: {
              AddressID: 123,
              AddressLine1: 'string',
              CityName: 'string',
              CountryCode: 'string',
              CountryName: 'string',
              PostalCode: 224,
              StateCode: 'string'
            }
          }]
        }]
      }
    };

    addressData = {
      _id: '226430',
      _index: 'masterdata-location-details',
      _score: 0,
      _source: {
        Address: {
          AddressID: 282912,
          AddressLine1: '514 N 3Rd St',
          CityName: 'Hammonton',
          CountryCode: 'USA',
          CountryName: 'USA',
          PostalCode: '080371703',
          StateCode: 'NJ',
        }
      },
      _type: 'location_info'
    };

    linehaulcitydata = {
      hits: {
        max_score: null,
        total: 1,
        hits: [{
          _index: 'masterdata-geography-postalcode',
          _type: 'doc',
          _id: '115945',
          _score: null,
          _source: [{
            city: {
              CityName: 'string',
              State: {
                StateCode: 'string'
              }
            }
          }]
        }]
      }
    };
    zipCode = {
      _index: 'masterdata-geography-postalcode',
      _type: 'doc',
      _id: '92465',
      _score: 1,
      _source: {
        PostalCode: '100',
        PostalCodeId: 25578
      }
    };
    component.overViewModel.stopDetails = [];
    broadcastService = fixture.debugElement.injector.get(BroadcasterService);
    const nameConfigurationDetails = {
      customerAgreementName: 'Family Dollar 12166 (FAFR8)',
      customerLineHaulConfigurationID: 1814
    };
    utilityService.setConfigurationID(nameConfigurationDetails);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getLineHaulConfigurationID', () => {
    component.getLineHaulConfigurationID();
  });

  it('should call getLineHaulOverview', () => {
    broadcastService.broadcast('linehaulOverView', lineHaulEditDetails);
    component.getLineHaulOverview();
  });

  it('should call stateIdCity', () => {
    const responsenow: any = {
      'stopSequenceNumber': 454,
      'stopTypeName': 'string',
      'customerLineHaulStopID': 43,
      'stopCountry': 'string',
      'stopPoint': 'string',
      'stopLocationPointID': 123
    };
    const cityvalueindex = 1;
    spyOn(LineHaulOverviewService.prototype, 'getCityState').and.returnValues(of(stateIdCity));
    component.stateIdCity(responsenow, cityvalueindex);
  });
  it('should call stateIdCity else', () => {
    const responsenow: any = {
      'stopSequenceNumber': 454,
      'stopTypeName': 'string',
      'customerLineHaulStopID': 43,
      'stopCountry': 'string',
      'stopPoint': 'string',
      'stopLocationPointID': 123
    };
    const cityvalueindex = 1;
    spyOn(LineHaulOverviewService.prototype, 'getCityState').and.returnValues(of([]));
    component.stateIdCity(responsenow, cityvalueindex);
  });

  it('should call stateIdAddress', () => {
    const responsenow: any = {
      'stopSequenceNumber': 454,
      'stopTypeName': 'string',
      'customerLineHaulStopID': 43,
      'stopCountry': 'string',
      'stopPoint': '1',
      'stopLocationPointID': 123
    };
    const cityvalueindex = 1;
    spyOn(LineHaulOverviewService.prototype, 'getOriginPoint').and.returnValues(of(stateIdAddress));
    component.stateIdAddress(responsenow, cityvalueindex);
  });

  it('should call stateIdAddress else', () => {
    const responsenow: any = {
      'stopSequenceNumber': 454,
      'stopTypeName': 'string',
      'customerLineHaulStopID': 43,
      'stopCountry': 'string',
      'stopPoint': '1',
      'stopLocationPointID': 123
    };
    const cityvalueindex = 1;
    spyOn(LineHaulOverviewService.prototype, 'getOriginPoint').and.returnValues(of([]));
    component.stateIdAddress(responsenow, cityvalueindex);
  });

  it('should call stateIdState', () => {
    const responsenow: any = {
      'stopSequenceNumber': 454,
      'stopTypeName': 'string',
      'customerLineHaulStopID': 43,
      'stopCountry': 'string',
      'stopPoint': 'string',
      'stopLocationPointID': 123
    };
    const cityvalueindex = 1;
    spyOn(LineHaulOverviewService.prototype, 'getCityState').and.returnValue(of(stateIdState));
    component.stateIdState(responsenow, cityvalueindex);
  });

  it('should call stateIdState else', () => {
    const responsenow: any = {
      'stopSequenceNumber': 454,
      'stopTypeName': 'string',
      'customerLineHaulStopID': 43,
      'stopCountry': 'string',
      'stopPoint': 'string',
      'stopLocationPointID': 123
    };
    const cityvalueindex = 1;
    spyOn(LineHaulOverviewService.prototype, 'getCityState').and.returnValue(of([]));
    component.stateIdState(responsenow, cityvalueindex);
  });

  it('should call stateIdZip', () => {
    const responsenow: any = {
      stopSequenceNumber: 1,
      stopTypeName: 'Country',
      customerLineHaulStopID: 23,
      stopCountry: 'Canada',
      stopPoint: 'Canada',
      stopLocationPointID: 31
    };
    const cityvalueindex = 1;
    spyOn(LineHaulOverviewService.prototype, 'getCityState').and.returnValue(of(stateIdZip));
    component.stateIdZip(responsenow, cityvalueindex);
  });

  it('should call stateIdZip else', () => {
    const responsenow: any = {
      stopSequenceNumber: 1,
      stopTypeName: 'Country',
      customerLineHaulStopID: 23,
      stopCountry: 'Canada',
      stopPoint: 'Canada',
      stopLocationPointID: 31
    };
    const cityvalueindex = 1;
    spyOn(LineHaulOverviewService.prototype, 'getCityState').and.returnValue(of([]));
    component.stateIdZip(responsenow, cityvalueindex);
  });

  it('should call stateIdLocationRampYard', () => {
    const responsenow: any = {
      'stopSequenceNumber': 454,
      'stopTypeName': 'string',
      'customerLineHaulStopID': 43,
      'stopCountry': 'string',
      'stopPoint': 'string',
      'stopLocationPointID': 123
    };
    const cityvalueindex = 1;
    hitsInterface.hits.hits[0] = stateIdLocationRampYard;
    spyOn(LineHaulOverviewService.prototype, 'getOriginPoint').and.returnValues(of(hitsInterface));
    component.stateIdLocationRampYard(responsenow, cityvalueindex);
  });

  it('should call stateIdLocationRampYard else', () => {
    const responsenow: any = {
      'stopSequenceNumber': 454,
      'stopTypeName': 'string',
      'customerLineHaulStopID': 43,
      'stopCountry': 'string',
      'stopPoint': 'string',
      'stopLocationPointID': 123
    };
    const cityvalueindex = 1;
    hitsInterface.hits.hits[0] = stateIdLocationRampYard;
    spyOn(LineHaulOverviewService.prototype, 'getOriginPoint').and.returnValues(of([]));
    component.stateIdLocationRampYard(responsenow, cityvalueindex);
  });

  it('should call getStateIds-default', () => {
    const obj: any = {
      'stopSequenceNumber': 1,
      'stopTypeName': 'default',
      'customerLineHaulStopID': 3,
      'stopCountry': null,
      'stopPoint': null,
      'stopPointID': 300521,
      'geographicPointUsageLevelTypeAssociationID': 32,
      'vendorID': null
    };
    component.getStateIds(lineHaulEditDetails);
  });

  it('should call originDestCity', () => {
    const origininfo = 'originPoints';
    component.overViewModel['originPoints'] = [];
    spyOn(LineHaulOverviewService.prototype, 'getCityState').and.returnValues(of(originDestCity));
    component.originDestCity(lineHauldetails, origininfo);
  });

  it('should call originDestCity else', () => {
    const origininfo = 'originPoints';
    component.overViewModel['originPoints'] = [];
    spyOn(LineHaulOverviewService.prototype, 'getCityState').and.returnValues(of([]));
    component.originDestCity(lineHauldetails, origininfo);
  });

  it('should call originDestAddress', () => {
    const originaddressinfo = 'originPoints';
    component.overViewModel['originPoints'] = [];
    hitsInterface.hits.hits[0] = addressData;
    spyOn(LineHaulOverviewService.prototype, 'getOriginPoint').and.returnValues(of(hitsInterface));
    component.originDestAddress(lineHauldetails, originaddressinfo);
  });

  it('should call originDestAddress else', () => {
    const originaddressinfo = 'originPoints';
    component.overViewModel['originPoints'] = [];
    hitsInterface.hits.hits[0] = addressData;
    spyOn(LineHaulOverviewService.prototype, 'getOriginPoint').and.returnValues(of([]));
    component.originDestAddress(lineHauldetails, originaddressinfo);
  });

  it('should call originDestState', () => {
    const originstateinfo = 'originPoints';
    component.overViewModel['originPoints'] = [];
    hitsInterface.hits.hits[0] = cityStateData;
    spyOn(LineHaulOverviewService.prototype, 'getCityState').and.returnValues(of(hitsInterface));
    component.originDestState(lineHauldetails, originstateinfo);
  });

  it('should call originDestState', () => {
    const originstateinfo = 'originPoints';
    component.overViewModel['originPoints'] = [];
    hitsInterface.hits.hits[0] = cityStateData;
    spyOn(LineHaulOverviewService.prototype, 'getCityState').and.returnValues(of({hits: {hits: []}}));
    component.originDestState(lineHauldetails, originstateinfo);
  });

  it('should call originDestZip', () => {
    const origininfo = 'originPoints';
    component.overViewModel['originPoints'] = [];
    hitsInterface.hits.hits[0] = zipCode;
    spyOn(LineHaulOverviewService.prototype, 'getCityState').and.returnValues(of(hitsInterface));
    component.originDestZip(lineHauldetails, origininfo);
  });

  it('should call originDestZip else', () => {
    const origininfo = 'originPoints';
    component.overViewModel['originPoints'] = [];
    hitsInterface.hits.hits[0] = zipCode;
    spyOn(LineHaulOverviewService.prototype, 'getCityState').and.returnValues(of({hits: {hits: []}}));
    component.originDestZip(lineHauldetails, origininfo);
  });

  it('should call originDestZipRange', () => {
    const origininfo = 'originPoints';
    component.overViewModel['originPoints'] = [];
    component.overViewModel['destinationPoints'] = [];
    spyOn(LineHaulOverviewService.prototype, 'getCityState').and.returnValues(of(originDestZipRange));
    component.originDestZipRange(lineHaulEditDetails, origininfo);
    fixture.detectChanges();
  });

  it('should call originDestZipRange else', () => {
    const origininfo = 'originPoints';
    component.overViewModel['originPoints'] = [];
    component.overViewModel['destinationPoints'] = [];
    spyOn(LineHaulOverviewService.prototype, 'getCityState').and.returnValues(of({hits: {hits: []}}));
    component.originDestZipRange(lineHaulEditDetails, origininfo);
    fixture.detectChanges();
  });

  it('should call postalCodeSplice', () => {
    const postalinfo = 'S7V';
    component.postalCodeSplice(postalinfo);
  });

  it('should call postalCodeSplice else', () => {
    const postalinfo = '080371703';
    component.postalCodeSplice(postalinfo);
  });

  it('should call originDestLocation', () => {
    const origininfo = 'originPoints';
    component.overViewModel['originPoints'] = [];
    component.overViewModel['destinationPoints'] = [];
    hitsInterface.hits.hits[0] = stateIdLocationRampYard;
    spyOn(LineHaulOverviewService.prototype, 'getOriginPoint').and.returnValues(of(hitsInterface));
    component.originDestLocation(lineHauldetails, origininfo);
  });

  it('should call getOriginDestinationValues State 2-Zip', () => {
    component.overViewModel['originPoints'] = [];
    component.overViewModel['destinationPoints'] = [];
    lineHaulEditDetails.originPoints[0]['subTypeName'] = 'State';
    lineHaulEditDetails.originPoints[0]['typeID'] = 22;
    lineHaulEditDetails.originPoints[0]['pointID'] = 122;
    lineHaulEditDetails.destinationPoints[0]['subTypeName'] = '2-Zip';
    lineHaulEditDetails.destinationType = '2-Zip';
    lineHaulEditDetails.originType = 'State';
    lineHaulEditDetails.destinationPoints[0]['typeID'] = 3;
    lineHaulEditDetails.destinationPoints[0]['pointID'] = 1686067;
    component.getOriginDestinationValues(lineHaulEditDetails);
  });

  it('should call getOriginDestinationValues 3-Zip 5-Zip', () => {
    component.overViewModel['originPoints'] = [];
    component.overViewModel['destinationPoints'] = [];
    lineHaulEditDetails.originPoints[0]['typeID'] = 3;
    lineHaulEditDetails.originPoints[0]['subTypeName'] = '3-Zip';
    lineHaulEditDetails.originPoints[0]['pointID'] = 1686067;
    lineHaulEditDetails.destinationPoints[0]['subTypeName'] = '5-Zip';
    lineHaulEditDetails.destinationPoints[0]['typeID'] = 3;
   lineHaulEditDetails.destinationPoints[0]['pointID'] = 1686067;
    lineHaulEditDetails.destinationType = '2-Zip';
    lineHaulEditDetails.originType = 'State';
    component.getOriginDestinationValues(lineHaulEditDetails);
  });

  it('should call getOriginDestinationValues 6-Zip 9-Zip', () => {
    component.overViewModel['originPoints'] = [];
    component.overViewModel['destinationPoints'] = [];
    lineHaulEditDetails.originPoints[0]['subTypeName'] = '6-Zip';
    lineHaulEditDetails.originPoints[0]['typeID'] = 3;
    lineHaulEditDetails.originPoints[0]['pointID'] = 90894;
    lineHaulEditDetails.destinationPoints[0]['subTypeName'] = '9-Zip';
    lineHaulEditDetails.destinationPoints[0]['typeID'] = 3;
    lineHaulEditDetails.destinationType = '2-Zip';
    lineHaulEditDetails.originType = 'State';
    lineHaulEditDetails.destinationPoints[0]['pointID'] = 1686067;
    component.getOriginDestinationValues(lineHaulEditDetails);
  });

  it('should call getOriginDestinationValues Location Ramp', () => {
    component.overViewModel['originPoints'] = [];
    component.overViewModel['destinationPoints'] = [];
    lineHaulEditDetails.originPoints[0]['subTypeName'] = 'Location';
    lineHaulEditDetails.originPoints[0]['typeID'] = 3;
    lineHaulEditDetails.originPoints[0]['pointID'] = 90894;
    lineHaulEditDetails.destinationPoints[0]['subTypeName'] = 'Ramp';
    lineHaulEditDetails.destinationPoints[0]['typeID'] = 3;
    lineHaulEditDetails.destinationPoints[0]['pointID'] = 1686067;
    component.getOriginDestinationValues(lineHaulEditDetails);
  });

  it('should call getOriginDestinationValues Yard Address', () => {
    component.overViewModel['originPoints'] = [];
    component.overViewModel['destinationPoints'] = [];
    lineHaulEditDetails.originPoints[0]['subTypeName'] = 'Yard';
    lineHaulEditDetails.originPoints[0]['typeID'] = 3;
    lineHaulEditDetails.originPoints[0]['pointID'] = 90894;
    lineHaulEditDetails.destinationPoints[0]['subTypeName'] = 'Address';
    lineHaulEditDetails.destinationPoints[0]['typeID'] = 3;
    lineHaulEditDetails.destinationPoints[0]['pointID'] = 1686067;
    component.getOriginDestinationValues(lineHaulEditDetails);
  });

  it('should call getOriginDestinationValues 3-Zip Range 5-Zip Range', () => {
    component.overViewModel['originPoints'] = [];
    component.overViewModel['destinationPoints'] = [];
    lineHaulEditDetails.originPoints['subTypeName'] = '3-Zip Range';
    lineHaulEditDetails.originPoints['typeID'] = 3;
    lineHaulEditDetails.originPoints['pointID'] = 90894;
    lineHaulEditDetails.destinationPoints['subTypeName'] = '5-Zip Range';
    lineHaulEditDetails.destinationPoints['typeID'] = 3;
    lineHaulEditDetails.destinationPoints['pointID'] = 1686067;
    component.getOriginDestinationValues(lineHaulEditDetails);
  });

  it('should call getOriginDestinationValues 6-Zip Range and 9-Zip Range', () => {
    component.overViewModel['originPoints'] = [];
    component.overViewModel['destinationPoints'] = [];
    lineHaulEditDetails.originPoints[0]['subTypeName'] = '6-Zip Range';
    lineHaulEditDetails.originPoints[0]['typeID'] = 3;
    lineHaulEditDetails.originPoints[0]['pointID'] = 90894;
    lineHaulEditDetails.destinationPoints[0]['subTypeName'] = '9-Zip Range';
    lineHaulEditDetails.destinationPoints[0]['typeID'] = 3;
    lineHaulEditDetails.destinationPoints[0]['pointID'] = 1686067;
    component.getOriginDestinationValues(lineHaulEditDetails);
  });
  it('should call getOriginDestinationValues City State', () => {
    component.overViewModel['originPoints'] = [];
    component.overViewModel['destinationPoints'] = [];
    lineHaulEditDetails.originPoints[0]['subTypeName'] = 'City State';
    lineHaulEditDetails.originPoints[0]['typeID'] = 3;
    lineHaulEditDetails.originPoints[0]['pointID'] = 90894;
    lineHaulEditDetails.destinationPoints[0]['subTypeName'] = '9-Zip Range';
    lineHaulEditDetails.destinationPoints[0]['typeID'] = 3;
    lineHaulEditDetails.destinationPoints[0]['pointID'] = 1686067;
    component.getOriginDestinationValues(lineHaulEditDetails);
  });
  it('should call getOriginDestinationValues City State Region 3-zip Region', () => {
    component.overViewModel['originPoints'] = [];
    component.overViewModel['destinationPoints'] = [];
    lineHaulEditDetails.originPoints[0]['subTypeName'] = 'City State Region';
    lineHaulEditDetails.originPoints[0]['typeID'] = 3;
    lineHaulEditDetails.originPoints[0]['pointID'] = 90894;
    lineHaulEditDetails.destinationPoints[0]['subTypeName'] = '3-Zip Region';
    lineHaulEditDetails.destinationPoints[0]['typeID'] = 3;
    lineHaulEditDetails.destinationPoints[0]['pointID'] = 1686067;
    lineHaulEditDetails.destinationType = '3-Zip Region';
    lineHaulEditDetails.originType = 'City State Region';
    component.getOriginDestinationValues(lineHaulEditDetails);
  });
  it('should call getOriginDestinationValues default', () => {
    lineHaulEditDetails.originPoints[0]['subTypeName'] = '6-Zip Range';
    component.getOriginDestinationValues(lineHaulEditDetails);
  });
  it('should call frameZipRegion if', () => {
    component.overViewModel.lineHaulOverview = lineHaulEditDetails;
    lineHaulEditDetails.originPoints[0]['subTypeName'] = '6-Zip Range';
    const element = {point: 'originPoints', type: 'originType'};
    component.overViewModel[element.point] = [];
    component.overViewModel.lineHaulOverview[element.point]['subTypeName'] = '3-Zip';
    const hitData = [{
      PostalCode: 123,
      PostalCodeID: 123
    }];
    component.frameZipRegion(hitData, element);
  });
  it('should call frameZipRegion else', () => {
    component.overViewModel.lineHaulOverview = lineHaulEditDetails;
    lineHaulEditDetails.originPoints[0]['subTypeName'] = '6-Zip Range';
    const element = {point: 'originPoints', type: 'originType'};
    component.overViewModel[element.point] = [];
    component.overViewModel.lineHaulOverview[element.point]['subTypeName'] = '5-Zip';
    const hitData = [{
      PostalCode: 123,
      PostalCodeID: 123
    }];
    component.frameZipRegion(hitData, element);
  });
  it('should call getOriginDestinationValues else', () => {
    lineHaulEditDetails.originPoints[0]['subTypeName'] = '6-Zip Range';
    lineHaulEditDetails.originPoints = [];
    lineHaulEditDetails.destinationPoints = [];
    component.getOriginDestinationValues(lineHaulEditDetails);
  });
  it('should call setRateValues if', () => {
    component.overViewModel.lineHaulOverview = lineHaulEditDetails;
    component.overViewModel.rateValues = [];
    component.setRateValues();
  });
  it('should call setRateValues else', () => {
    component.overViewModel.lineHaulOverview = lineHaulEditDetails;
    component.overViewModel.lineHaulOverview.rates = [];
    component.setRateValues();
  });
  it('should call frameCityStateRegion if', () => {
    component.overViewModel['originPoints'] = [];
    component.overViewModel.lineHaulOverview = lineHaulEditDetails;
    const data = [{
      inner_hits: {
        City: {
          hits: {
            hits: [
              {
                _source: {
                  CityName: 'abcd',
                  State: {
                    StateCode: 123
                  }
                }
              }
            ]
          }
        }
      }
    }];
    component.frameCityStateRegion(data, {point: 'originPoints', type: 'originType'});
  });
  it('should call frameCityStateRegion else', () => {
    component.overViewModel['originPoints'] = [];
    component.overViewModel.lineHaulOverview = lineHaulEditDetails;
    component.frameCityStateRegion([], {point: 'originPoints', type: 'originType'});
  });
  it('should call originDestCitStateRegion', () => {
    component.overViewModel['originPoints'] = [];
    const data = {
      hits: {
        hits: [{
          inner_hits: {
            City: {
              hits: {
                hits: [
                  {
                    _source: {
                      CityName: 'abcd',
                      State: {
                        StateCode: 123
                      }
                    }
                  }
                ]
              }
            }
          }
        }]
      }
    };
    component.originDestCitStateRegion(data, {point: 'originPoints', type: 'originType'});
  });

 it('should call setServiceOffering', () => {
    const serviceOffering: any = [
      {
        'financeBusinessUnitServiceOfferingAssociationID': 1,
        'serviceOfferingCode': 'OTR',
        'serviceOfferingDescription': 'Over The Road',
        'transitModeId': 1,
        'transitModeCode': 'Truck',
        'transitModeDescription': 'Transit By Truck',
        'financeBusinessUnitCode': 'JBT',
        'chargeTypeBusinessUnitServiceOfferingAssociationID': null
      }
    ];
    spyOn(OverviewService.prototype, 'getServiceOffering').and.returnValue(of(serviceOffering));
    component.setServiceOffering(lineHaulEditDetails);
  });

  it('setOperationalSerivces', () => {
    const operationalResponse: any = [
      {
        'serviceTypeCode': 'Team',
        'serviceCategoryCode': 'ReqServ',
        'chargeCode': 123,
        'serviceTypeDescription': 'Team Driving',
        'effectiveTimestamp': '2016-01-01T00:00',
        'expirationTimestamp': '2199-12-31T23:59:59',
        'lastUpdateTimestampString': '2018-06-11T13:46:04.514808900'
      },
      {
        'serviceTypeCode': 'TrailWshOt',
        'serviceCategoryCode': 'ReqServ',
        'chargeCode': null,
        'serviceTypeDescription': 'Trailer Washout and Flush',
        'effectiveTimestamp': '2016-01-01T00:00',
        'expirationTimestamp': '2199-12-31T23:59:59',
        'lastUpdateTimestampString': '2018-06-11T13:46:04.548754900'
      }
    ];
    lineHaulEditDetails.operationalServices = [{
      'serviceTypeCode': 'TrailWshOt',
      'serviceCategoryCode': 'ReqServ',
      'chargeCode': null,
      'serviceTypeDescription': 'Trailer Washout and Flush',
      'effectiveTimestamp': '2016-01-01T00:00',
      'expirationTimestamp': '2199-12-31T23:59:59',
      'lastUpdateTimestampString': '2018-06-11T13:46:04.548754900'
    }];
    spyOn(OverviewService.prototype, 'getOperationalServices').and.returnValues(of(operationalResponse));
    component.setOperationalSerivces(lineHaulEditDetails);
  });  it('setOperationalSerivces else', () => {
    const operationalResponse: any = [];
    spyOn(OverviewService.prototype, 'getOperationalServices').and.returnValues(of(operationalResponse));
    component.setOperationalSerivces(lineHaulEditDetails);
  });

});
