import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { StopsComponent } from './stops.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

import { of } from 'rxjs/index';
import { StopsService } from './services/stops.service';
import { LaneCardService } from '../lane-card/services/lane-card.service';
import { ViewAgreementDetailsUtility } from './../../../service/view-agreement-details-utility';
import { MessageService } from 'primeng/components/common/messageservice';

describe('StopsComponent', () => {
  let component: StopsComponent;
  let fixture: ComponentFixture<StopsComponent>;
  let laneCardService: LaneCardService;
  let stopsService: StopsService;
  let messageService: MessageService;
  let utilityService: ViewAgreementDetailsUtility;
  const formBuilder: FormBuilder = new FormBuilder();
  const stateFrameResponse: any = {
    'took': 175,
    'timed_out': false,
    '_shards': {
      'total': 5,
      'successful': 5,
      'skipped': 0,
      'failed': 0
    },
    'hits': {
      'total': 1582,
      'max_score': 2,
      'hits': [
        {
          '_index': 'masterdata-geography-postalcode',
          '_type': 'doc',
          '_id': '110553',
          '_score': 2,
          'inner_hits': {
            'City': {
              'hits': {
                'total': 4,
                'max_score': 1,
                'hits': [
                  {
                    '_index': 'masterdata-geography-postalcode',
                    '_type': 'doc',
                    '_id': '110553',
                    '_nested': {
                      'field': 'City',
                      'offset': 3
                    },
                    '_score': 1,
                    '_source': {
                      'CityID': 7859,
                      'State': {
                        'StateName': 'Florida',
                        'StateCode': 'FL',
                        'StateID': 93
                      },
                      'Country': {
                        'CountryName': 'USA',
                        'CountryCode': 'USA'
                      },
                      'CityName': 'Treasure Is'
                    }
                  },
                  {
                    '_index': 'masterdata-geography-postalcode',
                    '_type': 'doc',
                    '_id': '110553',
                    '_nested': {
                      'field': 'City',
                      'offset': 2
                    },
                    '_score': 1,
                    '_source': {
                      'City': {
                        'CityID': 7528,
                        'State': {
                          'StateName': 'Florida',
                          'StateCode': 'FL',
                          'StateID': 93
                        },
                        'Country': {
                          'CountryName': 'USA',
                          'CountryCode': 'USA'
                        },
                        'CityName': 'North Bay Village'
                      }
                    }
                  },
                  {
                    '_index': 'masterdata-geography-postalcode',
                    '_type': 'doc',
                    '_id': '110553',
                    '_nested': {
                      'field': 'City',
                      'offset': 1
                    },
                    '_score': 1,
                    '_source': {
                      'City': {
                        'CityID': 7477,
                        'State': {
                          'StateName': 'Florida',
                          'StateCode': 'FL',
                          'StateID': 93
                        },
                        'Country': {
                          'CountryName': 'USA',
                          'CountryCode': 'USA'
                        },
                        'CityName': 'Miami'
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
  const postalCodeResponse: any = {
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
  const geographyValues = [{ 'label': '2-Zip', 'value': 17 }, { 'label': '2-Zip Range', 'value': 20 },
  { 'label': '3-Zip', 'value': 12 }, { 'label': '3-Zip Range', 'value': 18 }, { 'label': '3-Zip Region', 'value': 19 }, {
    'label': '5-Zip',
    'value': 2
  }, { 'label': '5-Zip Range', 'value': 13 }, { 'label': '5-Zip Region', 'value': 15 }, { 'label': '6-Zip', 'value': 9 },
  { 'label': '6-Zip Range', 'value': 14 }, { 'label': '9-Zip', 'value': 7 }, { 'label': '9-Zip Range', 'value': 10 }, {
    'label': '9-Zip Region', 'value': 11
  }, { 'label': 'Address', 'value': 3 }, { 'label': 'Address Region', 'value': 8 }, { 'label': 'City State', 'value': 1 }
    , { 'label': 'City State Region', 'value': 25 }, { 'label': 'Country', 'value': 23 }, { 'label': 'Location', 'value': 6 },
  { 'label': 'Ramp', 'value': 4 }, { 'label': 'Region', 'value': 24 }, { 'label': 'State', 'value': 22 }, {
    'label':
      'State Region', 'value': 27
  }, { 'label': 'Yard', 'value': 5 }];
  const locationResponse: any = {
    hits: {
      total: 1778,
      max_score: 0.0,
      hits: [
        {
          _index: 'masterdata-location-details',
          _type: 'location_info',
          _id: '333450',
          _score: 0.0,
          _source: {
            locationtypes: [
              {
                LocationSubTypeCode: 'NULL',
                LocationSubTypeDescription: 'NULL',
                LocationTypeDescription: 'Commercial',
                LocationTypeCode: 'Comm'
              }
            ],
            Address: {
              CountryName: 'Canada',
              StateName: 'Alberta',
              StateCode: 'AB',
              PostalCode: 'T2A2M3',
              CityName: 'Calgary',
              GPS: '51.0618,-113.997',
              CountyID: null,
              CountyName: null,
              AddressLine2: null,
              AddressLine1: '2626 10th Ave Ne',
              PostalCodeID: 341187,
              CityID: 73,
              CountryCode: 'CAN',
              AddressID: 1632534
            },
            LocationID: 333450,
            LocationCode: 'FECA2',
            LocationName: 'Federated Co-Op Ltd'
          }
        }]
    }
  };
  const selectedStop = {
    countryCode: 'CAN',
    label: '1225 Sumas Way, Abbotsford, BC V2S8H2, CAN',
    value: 123
  };
  const editLineHaulDetails: any = {
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
    stops: [{
      stopSequenceNumber: 123,
      stopTypeName: 'Country',
      stopTypeID: 123,
      stopCountry: 'USA',
      stopPoint: 'point',
      stopPointID: 123,
      vendorID: null
    }],
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
    sourceID: null,
    sourceLineHaulID: null,
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
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, LaneCardService, StopsService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StopsComponent);
    component = fixture.componentInstance;
    laneCardService = TestBed.get(LaneCardService);
    messageService = TestBed.get(MessageService);
    stopsService = TestBed.get(StopsService);
    utilityService = TestBed.get(ViewAgreementDetailsUtility);
    const stopGroup = formBuilder.group({
      type: ['aaa'],
      country: ['bbb'],
      point: ['ccc']
    });
    component.stopsModel.stopsForm = formBuilder.group({
      isStopChargeIncluded: [false],
      stops: formBuilder.array([stopGroup, stopGroup])
    });

    const stopsForm = (component.stopsModel.stopsForm.controls.stops as FormArray);
    stopsForm.at(0).setValue({
      'type': { 'label': 'Address', 'value': 3 }, 'point': {
        'label':
          `4220 Sanders Ave, Laredo, TX 78041, USA`, 'value': 1665025
      }, 'country': {
        'label': 'USA', 'value': { 'code': 'USA', 'id': 184 }
      }
    });
    stopsForm.at(1).setValue({
      'type': { 'label': 'Country', 'value': 23 }, 'point': {
        'label':
          `4220 Sanders Ave, Laredo, TX 78041, USA`, 'value': 1665025
      }, 'country': {
        'label': 'USA', 'value': { 'code': 'USA', 'id': 184 }
      }
    });
    fixture.detectChanges();
    component.stopsModel.geographyValues = geographyValues;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
  });
  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });

  it('should call createStopsForm', () => {
    component.createStopsForm();
  });

  it('should call actionAddStop', () => {
    component.actionAddStop();
  });

  it('should call getOriginTypes', () => {
    const response = [{ 'geographicPointTypeName': '2-Zip', 'geographicPointTypeID': 17 }, {
      'geographicPointTypeName':
        '2-Zip Range', 'geographicPointTypeID': 20
    },
    { 'geographicPointTypeName': '3-Zip', 'geographicPointTypeID': 12 }, {
      'geographicPointTypeName': '3-Zip Range',
      'geographicPointTypeID': 18
    }, { 'geographicPointTypeName': '3-Zip Region', 'geographicPointTypeID': 19 }, {
      'geographicPointTypeName': '5-Zip',
      'geographicPointTypeID': 2
    }, { 'geographicPointTypeName': '5-Zip Range', 'geographicPointTypeID': 13 }, {
      'geographicPointTypeName':
        '5-Zip Region', 'geographicPointTypeID': 15
    }, { 'geographicPointTypeName': '6-Zip', 'geographicPointTypeID': 9 },
    { 'geographicPointTypeName': '6-Zip Range', 'geographicPointTypeID': 14 }, {
      'geographicPointTypeName': '9-Zip',
      'geographicPointTypeID': 7
    }, { 'geographicPointTypeName': '9-Zip Range', 'geographicPointTypeID': 10 }, {
      'geographicPointTypeName': '9-Zip Region', 'geographicPointTypeID': 11
    }, { 'geographicPointTypeName': 'Address', 'geographicPointTypeID': 3 }, {
      'geographicPointTypeName': 'Address Region',
      'geographicPointTypeID': 8
    }, { 'geographicPointTypeName': 'City State', 'geographicPointTypeID': 1 }
      , { 'geographicPointTypeName': 'City State Region', 'geographicPointTypeID': 25 }, {
      'geographicPointTypeName':
        'Country', 'geographicPointTypeID': 23
    }, { 'geographicPointTypeName': 'Location', 'geographicPointTypeID': 6 },
    { 'geographicPointTypeName': 'Ramp', 'geographicPointTypeID': 4 }, {
      'geographicPointTypeName': 'Region',
      'geographicPointTypeID': 24
    }, { 'geographicPointTypeName': 'State', 'geographicPointTypeID': 22 }, {
      'geographicPointTypeName':
        'State Region', 'geographicPointTypeID': 27
    }, { 'geographicPointTypeName': 'Yard', 'geographicPointTypeID': 5 }];
    spyOn(stopsService, 'getGeographyTypes').and.returnValue(of(response));
    component.getOriginTypes();

  });

  it('should call onTypeOriginType', () => {
    const event: any = { 'originalEvent': { 'isTrusted': true }, 'query': 'state' };
    component.onTypeOriginType(event);
  });

  it('should call getCountries', () => {
    const data = {
      _embedded: {
        countryTypes: [{
          countryID: 31,
          countryName: 'Canada',
          countryCode: 'CAN',
        }]
      }
    };
    spyOn(laneCardService, 'getCountries').and.returnValue(of(data));
    component.getCountries();

  });

  it('should call onTypeCountries', () => {
    const event = new Event('myEvent');
    event['query'] = 'a';
    const countries: any = [{ 'label': 'Canada', 'value': { 'code': 'CAN', 'id': 31 } }, {
      'label': 'Mexico', 'value':
        { 'code': 'MEX', 'id': 112 }
    }, { 'label': 'USA', 'value': { 'code': 'USA', 'id': 184 } }];
    component.stopsModel.countries = countries;
    component.onTypeCountries(event);
  });
  it('should call addStop', () => {
    const position = 0;
    component.stopsModel.isConsecutive = true;
    component.addStop(position);
  });
  it('should call addStop-else', () => {
    const stopsForm = (component.stopsModel.stopsForm.controls.stops as FormArray);
    stopsForm.at(1).setValue({
      'type': '', 'point': '', 'country': ''
    });
    const position = 1;
    component.stopsModel.isConsecutive = false;
    component.addStop(position);
  });

  it('should call createStopItem', () => {
    component.createStopItem();
  });

  it('should call removeStop', () => {
    component.removeStop(1);
    component.removeStop(0);
  });

  it('should call toastMessage', () => {
    component.toastMessage(messageService, 'error', 'b', 'c');
  });

  it('should call consecutiveValidation', () => {
    component.stopsModel.invalidArray = [0];
    component.consecutiveValidation(0);
  });

  it('should call onStopPointChange', () => {
    component.onStopPointChange('Address', 0);
  });

  it('should call getStopPointSuggestion-Address', () => {
    const obj: any = { 'label': 'Address', 'value': 3 };
    component.getStopPointSuggestion(obj, 0, 'Address');
  });

  it('should call getStopPointSuggestion-City State', () => {
    const stopsForm = (component.stopsModel.stopsForm.controls.stops as FormArray);
    stopsForm.at(1).setValue({
      'type': { 'label': 'City State', 'value': 1 }, 'point': {
        'label':
          `4220 Sanders Ave, Laredo, TX 78041, USA`, 'value': 1665025
      }, 'country': {
        'label': 'USA', 'value': { 'code': 'USA', 'id': 184 }
      }
    });
    const obj: any = { 'label': 'City State', 'value': 1 };
    component.getStopPointSuggestion(obj, 1, 'City State');
  });

  it('should call getStopPointSuggestion- State', () => {
    const stopsForm = (component.stopsModel.stopsForm.controls.stops as FormArray);
    stopsForm.at(1).setValue({
      'type': { 'label': 'State', 'value': 22 }, 'point': {
        'label':
          `4220 Sanders Ave, Laredo, TX 78041, USA`, 'value': 1665025
      }, 'country': {
        'label': 'USA', 'value': { 'code': 'USA', 'id': 184 }
      }
    });
    const obj: any = { 'label': 'State', 'value': 22 };
    component.getStopPointSuggestion(obj, 1, 'State');
  });

  it('should call getStopPointSuggestion- Yard', () => {
    const stopsForm = (component.stopsModel.stopsForm.controls.stops as FormArray);
    stopsForm.at(1).setValue({
      'type': { 'label': 'Yard', 'value': 5 }, 'point': {
        'label':
          `4220 Sanders Ave, Laredo, TX 78041, USA`, 'value': 1665025
      }, 'country': {
        'label': 'USA', 'value': { 'code': 'USA', 'id': 184 }
      }
    });
    const obj: any = { 'label': 'Yard', 'value': 5 };
    component.getStopPointSuggestion(obj, 1, 'Yard');
  });

  it('should call getStopPointSuggestion- Ramp', () => {
    const stopsForm = (component.stopsModel.stopsForm.controls.stops as FormArray);
    stopsForm.at(1).setValue({
      'type': { 'label': 'Ramp', 'value': 4 }, 'point': {
        'label':
          `4220 Sanders Ave, Laredo, TX 78041, USA`, 'value': 1665025
      }, 'country': {
        'label': 'USA', 'value': { 'code': 'USA', 'id': 184 }
      }
    });
    const obj: any = { 'label': 'Ramp', 'value': 4 };
    component.getStopPointSuggestion(obj, 1, 'Ramp');
  });
  it('should call getStopPointSuggestion- Location', () => {
    const stopsForm = (component.stopsModel.stopsForm.controls.stops as FormArray);
    stopsForm.at(1).setValue({
      'type': { 'label': 'Location', 'value': 6 }, 'point': {
        'label':
          `4220 Sanders Ave, Laredo, TX 78041, USA`, 'value': 1665025
      }, 'country': {
        'label': 'USA', 'value': { 'code': 'USA', 'id': 184 }
      }
    });
    const obj: any = { 'label': 'Location', 'value': 6 };
    component.getStopPointSuggestion(obj, 1, 'Location');
  });
  it('should call getStopPointSuggestion- 2-Zip', () => {
    const stopsForm = (component.stopsModel.stopsForm.controls.stops as FormArray);
    stopsForm.at(1).setValue({
      'type': { 'label': '2-Zip', 'value': 17 }, 'point': {
        'label':
          `4220 Sanders Ave, Laredo, TX 78041, USA`, 'value': 1665025
      }, 'country': {
        'label': 'USA', 'value': { 'code': 'USA', 'id': 184 }
      }
    });
    const obj: any = { 'label': '2-Zip', 'value': 17 };
    component.getStopPointSuggestion(obj, 1, '2-Zip');
  });
  it('should call getStopPointSuggestion- 3-Zip', () => {
    const stopsForm = (component.stopsModel.stopsForm.controls.stops as FormArray);
    stopsForm.at(1).setValue({
      'type': { 'label': '3-Zip', 'value': 12 }, 'point': {
        'label':
          `4220 Sanders Ave, Laredo, TX 78041, USA`, 'value': 1665025
      }, 'country': {
        'label': 'USA', 'value': { 'code': 'USA', 'id': 184 }
      }
    });
    const obj: any = { 'label': '3-Zip', 'value': 12 };
    component.getStopPointSuggestion(obj, 1, '3-Zip');
  });
  it('should call getStopPointSuggestion- 5-Zip', () => {
    const stopsForm = (component.stopsModel.stopsForm.controls.stops as FormArray);
    stopsForm.at(1).setValue({
      'type': { 'label': '5-Zip', 'value': 2 }, 'point': {
        'label':
          `4220 Sanders Ave, Laredo, TX 78041, USA`, 'value': 1665025
      }, 'country': {
        'label': 'USA', 'value': { 'code': 'USA', 'id': 184 }
      }
    });
    const obj: any = { 'label': '5-Zip', 'value': 2 };
    component.getStopPointSuggestion(obj, 1, '5-Zip');
  });
  it('should call getStopPointSuggestion- 6-Zip', () => {
    const stopsForm = (component.stopsModel.stopsForm.controls.stops as FormArray);
    stopsForm.at(1).setValue({
      'type': { 'label': '6-Zip', 'value': 9 }, 'point': {
        'label':
          `4220 Sanders Ave, Laredo, TX 78041, USA`, 'value': 1665025
      }, 'country': {
        'label': 'USA', 'value': { 'code': 'USA', 'id': 184 }
      }
    });
    const obj: any = { 'label': '6-Zip', 'value': 9 };
    component.getStopPointSuggestion(obj, 1, '6-Zip');
  });
  it('should call getStopPointSuggestion- 9-Zip', () => {
    const stopsForm = (component.stopsModel.stopsForm.controls.stops as FormArray);
    stopsForm.at(1).setValue({
      'type': { 'label': '9-Zip', 'value': 7 }, 'point': {
        'label':
          `4220 Sanders Ave, Laredo, TX 78041, USA`, 'value': 1665025
      }, 'country': {
        'label': 'USA', 'value': { 'code': 'USA', 'id': 184 }
      }
    });
    const obj: any = { 'label': '9-Zip', 'value': 7 };
    component.getStopPointSuggestion(obj, 1, '9-Zip');
  });
  it('should call getCityState', () => {
    spyOn(laneCardService, 'getCityState').and.returnValue(of(stateFrameResponse));
    component.getCityState('treasure is', 'USA', 0);
  });

  it('should call getState', () => {
    spyOn(laneCardService, 'getCityState').and.returnValue(of(stateFrameResponse));
    component.getState('a', 'USA', 0);
  });

  xit('should call getRampYard', () => {
    spyOn(laneCardService, 'getOriginPoint').and.returnValue(of(locationResponse));
    component.getRampYard('a', 'Ramp', 'USA', 0);
  });

  it('should call getLocation', () => {
    spyOn(laneCardService, 'getOriginPoint').and.returnValue(of(locationResponse));
    component.getLocation('a', 'aa', 0);
  });

  it('should call getPostalCode', () => {
    spyOn(laneCardService, 'getCityState').and.returnValue(of(postalCodeResponse));
    component.getPostalCode('a', 1, 'aa', 0);
  });

  it('should call getAddressData', () => {
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
    spyOn(laneCardService, 'getOriginPoint').and.returnValue(of(addressResponse));
    component.getAddressData('Abc', 'USA', 0);

  });
  it('should call onCountryGeoChange', () => {
    component.onCountryGeoChange(1);
  });
  it('should call onCountryGeoChange-else', () => {
    const stopsForm = (component.stopsModel.stopsForm.controls.stops as FormArray);
    stopsForm.at(1).setValue({
      'type': { 'label': 'Address', 'value': 3 }, 'point': {
        'label':
          `4220 Sanders Ave, Laredo, TX 78041, USA`, 'value': 1665025
      }, 'country': {
        'label': 'USA', 'value': { 'code': 'USA', 'id': 184 }
      }
    });
    component.onCountryGeoChange(1);
  });

  it('should call getEditStopAddress', () => {
    component.getEditStopAddress(editLineHaulDetails);
  });


  it('should call setvalueforStopSection', () => {
    utilityService.editLineHaulData = {
      lineHaulDetails: 1760,
      isEditFlag: true
    };
    utilityService.setEditLineHaulData(utilityService.editLineHaulData);
    component.setvalueforStopSection();
  });

  it('should call setStopValues', () => {
    editLineHaulDetails.stops = [{
      stopSequenceNumber: 1,
      stopTypeName: 'Country',
      stopTypeID: 23,
      stopCountry: 'Canada',
      stopPoint: 'Canada',
      stopPointID: 31
    },
    {
      stopSequenceNumber: 123,
      stopTypeName: 'Address',
      stopTypeID: 123,
      stopCountry: 'USA',
      stopPoint: 'point',
      stopPointID: 123
    }];
    const selectedStopObj = {
      countryCode: 'CAN',
      label: '1225 Sumas Way, Abbotsford, BC V2S8H2, CAN',
      value: 31
    };
    component.setStopValues(selectedStopObj, editLineHaulDetails);
  });

  it('should call setCountryforStop', () => {
    const obj: any = {
      label: 'Canada',
      value: {
        code: 'CAN',
        id: 31
      }
    };
    component.stopsModel.countries = [obj];
    component.setCountryforStop(selectedStop);
  });

  it('should call groupStopPointData- Address', () => {
    component.groupStopPointData('Address', 123);
  });

  it('should call groupStopPointData- 2-Zip', () => {
    component.groupStopPointData('2-Zip', 123);
  });

  it('should call groupStopPointData- City State', () => {
    component.groupStopPointData('City State', 123);
  });

  it('should call groupStopPointData- Location', () => {
    component.groupStopPointData('Location', 123);
  });

  it('should call groupStopPointData- State', () => {
    component.groupStopPointData('State', 123);
  });

  it('should call groupStopPointData- Country', () => {
    component.groupStopPointData('Country', 123);
  });


  xit('should call editStopItem', () => {
    // component.editStopItem(type, country, selectedStop);
  });

  it('should call clearStopsFormArray', () => {
    const stopsForm = (component.stopsModel.stopsForm.controls.stops as FormArray);
    component.clearStopsFormArray(stopsForm);
  });

  it('should call getStopPointDetails', () => {
    const response = [{
      'took': 37,
      'timed_out': false,
      '_shards': {
        'total': 5,
        'successful': 5,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 2,
        'max_score': 0,
        'hits': [
          {
            '_index': 'masterdata-location-details',
            '_type': 'location_info',
            '_id': '148675',
            '_score': 0,
            '_source': {
              'Address': {
                'AddressLine1': '1811 Pleasant St',
                'CountryName': 'USA',
                'StateCode': 'IL',
                'PostalCode': '601152606',
                'CityName': 'Dekalb',
                'CountryCode': 'USA',
                'AddressID': 233107
              }
            }
          },
          {
            '_index': 'masterdata-location-details',
            '_type': 'location_info',
            '_id': '350150',
            '_score': 0,
            '_source': {
              'Address': {
                'AddressLine1': '6221 Yarrow Dr',
                'CountryName': 'USA',
                'StateCode': 'CA',
                'PostalCode': '92011',
                'CityName': 'Carlsbad',
                'CountryCode': 'USA',
                'AddressID': 1665327
              }
            }
          }
        ]
      }
    }
    ];
    spyOn(stopsService, 'getEditStopDetails').and.returnValue(of(response));
    component.getStopPointDetails([215481], [215481], [215481], [32187], [215481], [215481], editLineHaulDetails);
  });

  it('should call frameQuery Address', () => {
    component.frameQuery([215481], 'Address');
  });

  it('should call frameQuery Postalcode', () => {
    component.frameQuery([215481], 'Postalcode');
  });

  it('should call frameQuery CityState', () => {
    component.frameQuery([215481], 'CityState');
  });

  it('should call frameQuery Location', () => {
    component.frameQuery([215481], 'Location');
  });

  it('should call frameQuery State', () => {
    component.frameQuery([215481], 'State');
  });

  it('should call frameQuery Empty', () => {
    expect(component.frameQuery([], 'State')).toBe(null);
  });

  it('should call frameStopFormData - addresslist', () => {
    component.frameStopFormData([selectedStop], null, null, null, null, [], editLineHaulDetails);
  });
  it('should call frameStopFormData - postalList', () => {
    component.frameStopFormData(null, [selectedStop], null, null, null, [], editLineHaulDetails);
  });
  it('should call frameStopFormData - locationList', () => {
    component.frameStopFormData(null, null, [selectedStop], null, null, [], editLineHaulDetails);
  });
  it('should call frameStopFormData - cityList', () => {
    component.frameStopFormData(null, null, null, [selectedStop], null, [], editLineHaulDetails);
  });
  it('should call frameStopFormData - stateList', () => {
    component.frameStopFormData(null, null, null, null, [selectedStop], [], editLineHaulDetails);
  });
  it('should call frameStopFormData - countryList', () => {
    component.frameStopFormData(null, null, null, null, null, [selectedStop], editLineHaulDetails);
  });
  it('should call getCountryCode', () => {
    const countries: any = [{ 'label': 'Canada', 'value': { 'code': 'CAN', 'id': 31 } }, {
      'label': 'Mexico', 'value':
        { 'code': 'MEX', 'id': 112 }
    }, { 'label': 'USA', 'value': { 'code': 'USA', 'id': 184 } }];
    component.stopsModel.countries = countries;
    expect(component.getCountryCode(31)).toBe('CAN');
  });

  it('should call postalCodeSplice', () => {
    component.postalCodeSplice('abc');
  });
  it('should call postalCodeSplice- length', () => {
    component.postalCodeSplice('HomeDepot');
  });
  it('should call setCountryDisable', () => {
    component.setCountryDisable();
  });

});
