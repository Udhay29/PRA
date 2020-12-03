import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs/index';
import { MessageService } from 'primeng/components/common/messageservice';
import { LineHaulDetailsModel } from './model/line-haul-details.model';
import { LineHaulDetailsService } from './services/line-haul-details.service';

import { LineHaulDetailsComponent } from './line-haul-details.component';

describe('LineHaulDetailsComponent', () => {
  let component: LineHaulDetailsComponent;
  let fixture: ComponentFixture<LineHaulDetailsComponent>;
  let messageService: MessageService;
  let lineHaulDetailsService: LineHaulDetailsService;
  let lanedetails;
  let hitsInterface;
  let cityState;
  let address;
  let stopValue;
  let zipCode;
  let stops;
  const err = {
    'traceid': '343481659c77ad99',
    'errors': [{
      'fieldErrorFlag': false,
      'errorMessage': 'Failed to convert undefined into java.lang.Integer!',
      'errorType': 'System Runtime Error',
      'fieldName': null,
      'code': 'ServerRuntimeError',
      'errorSeverity': 'ERROR'
    }]
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, MessageService, LineHaulDetailsService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineHaulDetailsComponent);
    messageService = TestBed.get(MessageService);
    lineHaulDetailsService = TestBed.get(LineHaulDetailsService);
    component = fixture.componentInstance;
    hitsInterface = {
      hits: {
        hits: [],
        max_score: null,
        total: 1,
      }
    };
    stops = [{
      stopSequenceNumber: 121,
      typeName: 'City State',
      stopTypeID: 121,
      stopCountry: 'USA',
      stopPoint: 'point',
      stopPointID: 121
    }, {
      stopSequenceNumber: 122,
      typeName: 'Address',
      stopTypeID: 122,
      stopCountry: 'USA',
      stopPoint: 'point',
      stopPointID: 122
    }, {
      stopSequenceNumber: 123,
      typeName: 'State',
      stopTypeID: 123,
      stopCountry: 'USA',
      stopPoint: 'point',
      stopPointID: 123
    }, {
      stopSequenceNumber: 124,
      typeName: '2-Zip',
      stopTypeID: 124,
      stopCountry: 'USA',
      stopPoint: 'point',
      stopPointID: 124
    }, {
      stopSequenceNumber: 125,
      typeName: '3-Zip',
      stopTypeID: 125,
      stopCountry: 'USA',
      stopPoint: 'point',
      stopPointID: 125
    }, {
      stopSequenceNumber: 126,
      typeName: '5-Zip',
      stopTypeID: 126,
      stopCountry: 'USA',
      stopPoint: 'point',
      stopPointID: 126
    }, {
      stopSequenceNumber: 127,
      typeName: '6-Zip',
      stopTypeID: 127,
      stopCountry: 'USA',
      stopPoint: 'point',
      stopPointID: 127
    }, {
      stopSequenceNumber: 128,
      typeName: '9-Zip',
      stopTypeID: 128,
      stopCountry: 'USA',
      stopPoint: 'point',
      stopPointID: 128
    }, {
      stopSequenceNumber: 129,
      typeName: 'Location',
      stopTypeID: 129,
      stopCountry: 'USA',
      stopPoint: 'point',
      stopPointID: 129
    }, {
      stopSequenceNumber: 130,
      typeName: 'Ramp',
      stopTypeID: 130,
      stopCountry: 'USA',
      stopPoint: 'point',
      stopPointID: 130
    }, {
      stopSequenceNumber: 131,
      typeName: 'Yard',
      stopTypeID: 131,
      stopCountry: 'USA',
      stopPoint: 'point',
      stopPointID: 131
    }, {
      stopSequenceNumber: 132,
      typeName: 'Country',
      stopTypeID: 132,
      stopCountry: 'USA',
      stopPoint: 'point',
      stopPointID: 132
    },
    {
      stopSequenceNumber: 132,
      typeName: 'default',
      stopTypeID: 132,
      stopCountry: 'USA',
      stopPoint: 'point',
      stopPointID: 132
    }];
    lanedetails = {
      lineHaulConfigurationID: 1814,
      laneID: 4488,
      lineHaulSourceTypeID: 4,
      lineHaulSourceTypeName: 'Manual ',
      originPoints: [{
        country: null,
        description: null,
        point: null,
        pointID: 1686067,
        type: 'Address',
        typeID: 3,
        vendorID: null
      }],
      destinationPoints: [{
        country: null,
        description: null,
        point: null,
        pointID: 90894,
        type: 'Address',
        typeID: 3,
        vendorID: null
      }],
      stops: [{
        stopSequenceNumber: 123,
        stopTypeName: 'aaa',
        stopTypeID: 123,
        stopCountry: 'USA',
        stopPoint: 'point',
        stopPointID: 123
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
        maximumAmount: 1,
        minimumAmount: 12,
        rateAmount: 12,
      }],
      groupRateType: null,
      groupRateItemIndicator: false,
      sourceID: null,
      sourceLineHaulID: null,
      overridenPriorityNumber: null,
      billTos: null,
      carriers: [{
        customerAccessorialCarrierId: null,
        CarrierCode: 'TCR16',
        LegalName: 'Test Carrier 16',
        CarrierID: 1016
      }],
      mileagePreference: {},
      mileagePreferenceMinRange: null,
      mileagePreferenceMaxRange: null,
      unitOfMeasurement: {
        code: 'Pounds',
        description: null,
        maxWeightRange: '350',
        minWeightRange: '250'
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
      destinationDescription: 'aa',
      destinationVendorID: 'dd',
      originDescription: 'ss',
      originVendorID: 'qq'
    };
    cityState = {
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
                State: { StateCode: 'NY' },
                PostalCode: '080371703'
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
    address = {
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
    stopValue = [{
      geographicPointUsageLevelTypeAssociationID: 43,
      stopCountry: 'USA',
      stopPoint: 'USA',
      stopPointID: 25578,
      stopSequenceNumber: 1,
      stopTypeID: 12,
      stopTypeName: '3-Zip'
    }];
    zipCode = {
      _id: '25578',
      _index: 'masterdata-geography-postalcode',
      _score: 1,
      _source: {
        CountryCode: 'USA',
        PostalCode: '100',
        City: [{
          'Country': {
            'CountryName': 'USA'
          }
        }]
      },
      _type: 'doc'
    };
    component.detailsModel.originDestinationDetails = [];
    component.detailsModel.stopList = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    component.stopFramer(lanedetails);
    component.processedStopDetails(lanedetails);
    component.processedLaneDetails(lanedetails);
    component.processedCarrierDetails(lanedetails);
    component.processedRateDetails(lanedetails);
    component.processedAdditionalDetails(lanedetails);
    component.processedMileageDetails(lanedetails);
    expect(component).toBeTruthy();
  });

  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });

  it('should call getCityState--', () => {
    hitsInterface.hits.hits[0] = {
      '_index': 'masterdata-geography-postalcode',
      '_type': 'doc',
      '_id': '47081',
      '_score': 1.0,
      'inner_hits': {
        'City': {
          'hits': {
            'total': 1,
            'max_score': 1.0,
            'hits': [
              {
                '_index': 'masterdata-geography-postalcode',
                '_type': 'doc',
                '_id': '47081',
                '_nested': {
                  'field': 'City',
                  'offset': 0
                },
                '_score': 1.0,
                '_source': {
                  'State': {
                    'StateCode': 'PA'
                  },
                  'Country': {
                    'CountryName': 'USA'
                  },
                  'CityName': 'Annville'
                }
              }
            ]
          }
        }
      }
    };
    spyOn(LineHaulDetailsService.prototype, 'getCityState').and.returnValue(of(hitsInterface));
    component.getCityState(lanedetails, 'Origin', lanedetails);
  });

  it('should call getCityState--', () => {
    hitsInterface.hits.hits = {};
    spyOn(LineHaulDetailsService.prototype, 'getCityState').and.returnValue(of([]));
    component.getCityState(lanedetails, 'Origin', lanedetails);
  });

  it('should call getAddress--', () => {
    hitsInterface.hits.hits[0] = {
      '_index': 'masterdata-location-details',
      '_type': 'location_info',
      '_id': '137289',
      '_score': 0.0,
      '_source': {
        'Address': {
          'AddressLine1': '7201 Aaron Aronov Dr Ste A',
          'CountryName': 'USA',
          'StateCode': 'AL',
          'PostalCode': '350641816',
          'CityName': 'Fairfield',
          'CountryCode': 'USA',
          'AddressID': 349719
        }
      }
    };
    spyOn(LineHaulDetailsService.prototype, 'getOriginPoint').and.returnValue(of(hitsInterface));
    component.getAddress(lanedetails, 'Origin', lanedetails);
  });

  it('should call getAddress--', () => {
    spyOn(LineHaulDetailsService.prototype, 'getOriginPoint').and.returnValue(of([]));
    component.getAddress(lanedetails, 'Origin', lanedetails);
  });

  it('should call getState--', () => {
    hitsInterface.hits.hits[0] = {
      '_index': 'masterdata-geography-postalcode',
      '_type': 'doc',
      '_id': '235215',
      '_score': 1.0,
      'inner_hits': {
        'City': {
          'hits': {
            'total': 1,
            'max_score': 1.0,
            'hits': [
              {
                '_index': 'masterdata-geography-postalcode',
                '_type': 'doc',
                '_id': '235215',
                '_nested': {
                  'field': 'City',
                  'offset': 0
                },
                '_score': 1.0,
                '_source': {
                  'State': {
                    'StateName': 'Arkansas'
                  },
                  'Country': {
                    'CountryName': 'USA'
                  }
                }
              }
            ]
          }
        }
      }
    };
    spyOn(LineHaulDetailsService.prototype, 'getCityState').and.returnValue(of(hitsInterface));
    component.getState(lanedetails, 'Origin', lanedetails);
  });

  it('should call getState--', () => {
    spyOn(LineHaulDetailsService.prototype, 'getCityState').and.returnValue(of([]));
    component.getState(lanedetails, 'Origin', lanedetails);
  });

  it('should call getPostalZip--', () => {
    hitsInterface.hits.hits[0] = {
      '_index': 'masterdata-geography-postalcode',
      '_type': 'doc',
      '_id': '26954',
      '_score': 1.0,
      '_source': {
        'PostalCode': '103',
        'CountryCode': 'USA',
        'City': [{
          'Country': {
            'CountryName': 'USA'
          }
        }]
      }
    };
    spyOn(LineHaulDetailsService.prototype, 'getCityState').and.returnValue(of(hitsInterface));
    component.getPostalZip(lanedetails, 'Origin', lanedetails);
  });

  it('should call getPostalZip--', () => {
    spyOn(LineHaulDetailsService.prototype, 'getCityState').and.returnValue(of([]));
    component.getPostalZip(lanedetails, 'Origin', lanedetails);
  });

  it('should call getLocationRampYard--', () => {
    hitsInterface.hits.hits[0] = {
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
    spyOn(LineHaulDetailsService.prototype, 'getOriginPoint').and.returnValue(of(hitsInterface));
    component.getLocationRampYard(lanedetails, 'Origin', lanedetails);
  });

  it('should call getLocationRampYard--', () => {
    spyOn(LineHaulDetailsService.prototype, 'getOriginPoint').and.returnValue(of([]));
    component.getLocationRampYard(lanedetails, 'Origin', lanedetails);
  });

  it('should call getPostalZipRange', () => {
    zipCode = {
      _id: '25578',
      _index: 'masterdata-geography-postalcode',
      _score: 1,
      _source: {
        CountryCode: 'USA',
        PostalCode: '100',
        City: [{
          'Country': {
            'CountryName': 'USA'
          }
        }]
      },
      _type: 'doc'
    };
    hitsInterface['hits']['hits'][0] = zipCode;
    hitsInterface['hits']['hits'][1] = zipCode;
    hitsInterface['hits']['hits'][1].postalcode = '101';
    spyOn(LineHaulDetailsService.prototype, 'getCityState').and.returnValue(of(hitsInterface));
    component.getPostalZipRange(lanedetails, 'Origin', lanedetails);
  });

  it('should call getPostalZipRange', () => {
    spyOn(LineHaulDetailsService.prototype, 'getCityState').and.returnValue(of([]));
    component.getPostalZipRange(lanedetails, 'Origin', lanedetails);
  });

  it('should call processedLaneDetails City State', () => {
    lanedetails.originPoints = null;
    component.processedLaneDetails(lanedetails);
  });

  it('should call processedLaneDetails City State', () => {
    lanedetails.originPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 1686067,
      subTypeName: 'City State',
      typeID: 3,
      vendorID: null
    };
    lanedetails.destinationPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 90894,
      subTypeName: 'Address',
      typeID: 3,
      vendorID: null
    };
    component.processedLaneDetails(lanedetails);
  });

  it('should call processedLaneDetails Address', () => {
    lanedetails.originPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 1686067,
      subTypeName: 'State',
      typeID: 3,
      vendorID: null
    };
    lanedetails.destinationPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 90894,
      subTypeName: '2-Zip',
      typeID: 3,
      vendorID: null
    };
    component.processedLaneDetails(lanedetails);
  });

  it('should call processedLaneDetails State', () => {
    lanedetails.originPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 1686067,
      subTypeName: '3-Zip',
      typeID: 3,
      vendorID: null
    };
    lanedetails.destinationPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 90894,
      subTypeName: '5-Zip',
      typeID: 3,
      vendorID: null
    };
    component.processedLaneDetails(lanedetails);
  });

  it('should call processedLaneDetails 2-Zip', () => {
    lanedetails.originPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 1686067,
      subTypeName: '6-Zip',
      typeID: 3,
      vendorID: null
    };
    lanedetails.destinationPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 90894,
      subTypeName: '9-Zip',
      typeID: 3,
      vendorID: null
    };
    component.processedLaneDetails(lanedetails);
  });

  it('should call processedLaneDetails 3-Zip', () => {
    lanedetails.originPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 1686067,
      subTypeName: 'Location',
      typeID: 3,
      vendorID: null
    };
    lanedetails.destinationPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 90894,
      subTypeName: 'Ramp',
      typeID: 3,
      vendorID: null
    };
    component.processedLaneDetails(lanedetails);
  });

  it('should call processedLaneDetails 5-Zip', () => {
    lanedetails.originPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 1686067,
      subTypeName: 'Yard',
      typeID: 3,
      vendorID: null
    };
    lanedetails.destinationPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 90894,
      subTypeName: '5-Zip Range',
      typeID: 3,
      vendorID: null
    };
    component.processedLaneDetails(lanedetails);
  });

  it('should call processedLaneDetails 6-Zip', () => {
    lanedetails.originPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 1686067,
      subTypeName: '3-Zip Range',
      typeID: 3,
      vendorID: null
    };
    lanedetails.destinationPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 90894,
      subTypeName: '6-Zip Range',
      typeID: 3,
      vendorID: null
    };
    component.processedLaneDetails(lanedetails);
  });

  it('should call processedLaneDetails 9-Zip', () => {
    lanedetails.originPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 1686067,
      subTypeName: '9-Zip Range',
      typeID: 3,
      vendorID: null
    };
    lanedetails.destinationPoints[0] = {
      country: null,
      description: null,
      point: null,
      pointID: 90894,
      subTypeName: 'default',
      typeID: 3,
      vendorID: null
    };
    component.processedLaneDetails(lanedetails);
  });

  it('should call processedCarrierDetails--', () => {
    hitsInterface.hits.hits[0] = {
      '_index': 'masterdata-location-details',
      '_type': 'location_info',
      '_id': '137289',
      '_score': 0.0,
      '_source': {}
    };
    hitsInterface['hits']['hits'][0]['_source']['CarrierCode'] = 'TCR16';
    hitsInterface['hits']['hits'][0]['_source']['LegalName'] = 'Test Carrier 16';
    hitsInterface['hits']['hits'][0]['_source']['CarrierID'] = 1016;
    spyOn(LineHaulDetailsService.prototype, 'getCarrierData').and.returnValue(of(hitsInterface));
    component.processedCarrierDetails(lanedetails);
  });

  it('should call processedCarrierDetails--', () => {
    hitsInterface = {};
    spyOn(LineHaulDetailsService.prototype, 'getCarrierData').and.returnValue(of(hitsInterface));
    component.processedCarrierDetails(lanedetails);
  });

  it('should call originDestinationCityStateValues', () => {
    hitsInterface['hits']['hits'][0] = cityState;
    lanedetails.originPoints.vendorID = 'abc';
    lanedetails.originPoints.description = 'abcd';
    component.detailsModel.cityStateText = 'abc';
    component.originDestinationCityStateValues(hitsInterface, lanedetails, 'Origin');
 });

  it('should call originDestinationStateValues', () => {
    hitsInterface['hits']['hits'][0] = cityState;
    lanedetails.originPoints.vendorID = 'abc';
    lanedetails.originPoints.description = 'abcd';
    component.originDestinationStateValues(hitsInterface, lanedetails, 'Origin', lanedetails);
  });

  it('should call originDestinationZipValues', () => {
    hitsInterface['hits']['hits'][0] = zipCode;
    lanedetails.originPoints.vendorID = 'abc';
    lanedetails.originPoints.description = 'abcd';
    component.originDestinationZipValues(hitsInterface, lanedetails, 'Origin', lanedetails);
  });

  it('should call originDestinationZipRangeValues', () => {
    zipCode = {
      _id: '25578',
      _index: 'masterdata-geography-postalcode',
      _score: 1,
      _source: {
        CountryCode: 'USA',
        PostalCode: '100',
        City: [{
          'Country': {
            'CountryName': 'USA'
          }
        }]
      },
      _type: 'doc'
    };
    hitsInterface['hits']['hits'][0] = zipCode;
    hitsInterface['hits']['hits'][1] = zipCode;
    hitsInterface['hits']['hits'][1].postalcode = '101';
    lanedetails.originPoints.vendorID = 'abc';
    lanedetails.originPoints.description = 'abcd';
    component.detailsModel.countryCode = 'abc';
    component.originDestinationZipRangeValues(hitsInterface, lanedetails, 'Origin', lanedetails);
  });

  it('should call postalCodeSplice', () => {
   const postalcode = '340';
    component.postalCodeSplice(postalcode);
  });

  it('should call postalCodeSplice', () => {
    const postalcode = '080371703';
    component.postalCodeSplice(postalcode);
  });

  it('should call postalCodeFramer', () => {
    const selectedPostalEdit = [{
      _source: {
      AddressID: 123,
      AddressLine1: 'string',
      CityName: 'string',
      CountryCode: 'string',
      CountryName: 'string',
      PostalCode: '123',
      StateCode: 'string'
      }
    },
    {
      _source: {
      AddressID: 123,
      AddressLine1: 'string',
      CityName: 'string',
      CountryCode: 'string',
      CountryName: 'string',
      PostalCode: '124',
      StateCode: 'string'
      }
    }];
    component.postalCodeFramer(selectedPostalEdit);
  });

  it('should call postalCodeFramer', () => {
    const selectedPostalEdit = [{
      _source: {
      AddressID: 123,
      AddressLine1: 'string',
      CityName: 'string',
      CountryCode: 'string',
      CountryName: 'string',
      PostalCode: '123',
      StateCode: 'string'
      }
    },
    {
      _source: {
      AddressID: 123,
      AddressLine1: 'string',
      CityName: 'string',
      CountryCode: 'string',
      CountryName: 'string',
      PostalCode: '122',
      StateCode: 'string'
      }
    }];
    component.postalCodeFramer(selectedPostalEdit);
  });

  it('should call originDestinationAddressValues', () => {
    hitsInterface['hits']['hits'][0] = address;
    lanedetails.originPoints.vendorID = 'abc';
    lanedetails.originPoints.description = 'abcd';
    component.originDestinationAddressValues(hitsInterface, lanedetails, 'Origin', lanedetails);
  });

  it('should call originDestinationAddressValues', () => {
    hitsInterface['hits']['hits'] = {};
    component.originDestinationAddressValues(hitsInterface, lanedetails, 'Origin', lanedetails);
  });

  it('should call originDestinationLocationValues', () => {
    hitsInterface.hits.hits[0] = {
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
    lanedetails.originPoints.vendorID = 'abc';
    lanedetails.originPoints.description = 'abcd';
    component.originDestinationLocationValues(hitsInterface, lanedetails, 'Origin', lanedetails);
  });

  it('should call originDestinationLocationValues', () => {
    hitsInterface['hits']['hits'] = {};
    component.originDestinationLocationValues(hitsInterface, lanedetails, 'Origin', lanedetails);
  });

  it('should call processedRateDetails', () => {
    component.processedRateDetails(lanedetails);
  });
  it('should call processedRateDetails else', () => {
    lanedetails = {};
    component.processedRateDetails(lanedetails);
  });
  it('should call processedRateDetails if else', () => {
    lanedetails.rates = [];
    component.processedRateDetails(lanedetails);
  });
  it('should call processedStopCity', () => {
    hitsInterface.hits.hits[0] = cityState;
    spyOn(LineHaulDetailsService.prototype, 'getCityState').and.returnValue(of(hitsInterface));
    component.processedStopCity(stopValue);
  });

  it('should call processedStopAddress', () => {
    const response = {
      total: 1,
      max_score: 1,
      hits: [{
        '_index': 'masterdata-location-details-1-2019.05.01',
        '_type': 'doc',
        '_id': '257056',
        '_score': 0.0,
        '_source': {
          'Address': {
            'CountryName': 'USA',
            'PostalCode': '229026172',
            'CityName': 'Charlottesville',
            'AddressLine1': '953 2nd St Se Ste 410',
            'PostalCodeID': 378386,
            'CountryCode': 'USA',
            'AddressID': 311276
          }
        }
      }]
    };
    const param = [{
      stopSequenceNumber: 1,
      typeName: 'string',
      stopTypeID: 1,
      stopCountry: 'string',
      point: 'string',
      stopLocationPointID: 1,
      vendorID: 'string'
    }];
    spyOn(LineHaulDetailsService.prototype, 'getOriginPoint').and.returnValue(of(response));
    component.processedStopAddress(param);
  });

  it('should call processedStopState', () => {
    hitsInterface.hits.hits[0] = cityState;
    spyOn(LineHaulDetailsService.prototype, 'getCityState').and.returnValue(of(hitsInterface));
    component.processedStopState(stopValue);
  });
  it('should call on processedStopState err', () => {
    spyOn(LineHaulDetailsService.prototype, 'getCityState').and.returnValue(throwError(err));
    component.processedStopState(stopValue);
  });
  it('should call processedStopZip', () => {
    hitsInterface.hits.hits[0] = zipCode;
    spyOn(LineHaulDetailsService.prototype, 'getCityState').and.returnValue(of(hitsInterface));
    component.processedStopZip(stopValue);
  });
  it('should call on processedStopZip err', () => {
    spyOn(LineHaulDetailsService.prototype, 'getCityState').and.returnValue(throwError(err));
    component.processedStopZip(stopValue);
  });

  it('should call processedStopLocation', () => {
    hitsInterface.hits.hits[0] = address;
    spyOn(LineHaulDetailsService.prototype, 'getOriginPoint').and.returnValue(of(hitsInterface[0]));
    component.processedStopLocation(stopValue);
  });
  it('should call on processedStopLocation err', () => {
    spyOn(LineHaulDetailsService.prototype, 'getCityState').and.returnValue(throwError(err));
    component.processedStopLocation(stopValue);
  });

  it('should call processedStopDetails--', () => {
    lanedetails.stops = stops;
    component.processedStopDetails(lanedetails);
  });
  it('should call stopFramer--', () => {
    lanedetails.stops = stops;
    component.stopFramer(lanedetails);
  });

  it('should call getStopCityState', () => {
    hitsInterface['hits']['hits'][0] = cityState;
    component.getStopCityState(hitsInterface, stopValue);
  });

  it('should call getStopCityState', () => {
    hitsInterface['hits']['hits'] = {};
    component.getStopCityState(hitsInterface, stopValue);
  });

  it('should call getStopState with data', () => {
    hitsInterface['hits']['hits'][0] = cityState;
    component.getStopState(hitsInterface, stopValue);
  });

  it('should call getStopState without data', () => {
    hitsInterface['hits']['hits'] = {};
    component.getStopState(hitsInterface, stopValue);
  });

  xit('should call getStopAddress', () => {
    hitsInterface['hits']['hits'][0] = address;
    component.getStopAddress(hitsInterface, stopValue);
  });

  it('should call getStopAddress hits empty', () => {
    hitsInterface['hits']['hits'] = {};
    component.getStopAddress(hitsInterface, stopValue);
  });

  it('should call getStopZipCode', () => {
    hitsInterface['hits']['hits'][0] = zipCode;
    component.getStopZipCode(hitsInterface, stopValue);
  });

  it('should call getStopZipCode', () => {
    hitsInterface['hits']['hits'] = {};
    component.getStopZipCode(hitsInterface, stopValue);
  });

  it('should call getLocationRampYardStop', () => {
    hitsInterface['hits']['hits'][0] = address;
    hitsInterface['hits']['hits'][0]._source.LocationCode = 123;
    hitsInterface['hits']['hits'][0]._source.LocationName = 'Location';
    component.getLocationRampYardStop(hitsInterface, stopValue);
  });

  it('should call getLocationRampYardStop', () => {
    hitsInterface['hits']['hits'] = {};
    component.getLocationRampYardStop(hitsInterface, stopValue);
  });

  it('should call getCountryStop', () => {
    stopValue.stopTypeName = 'country';
    component.getCountryStop(stopValue);
  });

  it('should call processedAdditionalDetails', () => {
    lanedetails['unitOfMeasurement']['minWeightRange'] = 12000;
    lanedetails['unitOfMeasurement']['maxWeightRange'] = 140000;
    component.processedAdditionalDetails(lanedetails);
  });

  it('should call processedAdditionalDetails else', () => {
    lanedetails['unitOfMeasurement'] = {};
    component.processedAdditionalDetails(lanedetails);
  });

  it('should call processedMileageDetails', () => {
    lanedetails['mileagePreference']['mileagePreferenceMinRange'] = 120000;
    lanedetails['mileagePreference']['mileagePreferenceMaxRange'] = 1400000;
    component.processedMileageDetails(lanedetails);
  });

  it('should call processedMileageDetails', () => {
    lanedetails['mileagePreference'] = {};
    component.processedMileageDetails(lanedetails);
  });
});
