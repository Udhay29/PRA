import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { LaneCardService } from './lane-card.service';
import { AppModule } from '../../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../../view-agreement-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('LaneCardService', () => {
    let service: LaneCardService;
    let http: HttpClient;
    let lineHaulDetails;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
            providers: [LaneCardService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient]
        });
    });

    beforeEach(() => {
        service = TestBed.get(LaneCardService);
        http = TestBed.get(HttpClient);
        lineHaulDetails = {
            'laneDTO': {
                'originPointID': 30670,
                'originPoint': '1253 Commerce Ave, Woodland, CA, 957765902, USA',
                'originCountry': 'USA',
                'destinationPointID': 200583,
                'destinationPoint': 'Av. Industria # 2221, Linares, NL, 67735, MEX',
                'destinationCountry': 'Mexico',
                'originDescription': null,
                'destinationDescription': null,
                'originVendorID': null,
                'destinationVendorID': null,
                'originPointTypeID': 3,
                'destinationPointTypeID': 3,
                'originAddressLine1': '1253 Commerce Ave',
                'originCityName': 'Woodland',
                'originCountryCode': 'USA',
                'originCountryName': 'USA',
                'originPostalCode': '957765902',
                'originStateCode': 'CA',
                'destinationAddressLine1': 'Av. Industria # 2221',
                'destinationAddressLine2': null,
                'destinationCityName': 'Linares',
                'destinationCountryCode': 'MEX',
                'destinationCountryName': 'Mexico',
                'destinationPostalCode': '67735',
                'destinationStateCode': 'NL',
                'destinationStateName': 'Nuevo Leon'
            },
            'overViewDTO': {
                'customerAgreementContractSectionID': 9,
                'priorityLevelNumber': 65,
                'overriddenPriorityLevelNumber': null,
                'serviceOfferingID': 5,
                'transitModeID': 4,
                'serviceLevelID': null,
                'equipmentClassificationCode': 'Chassis',
                'equipmentTypeCode': 'Chassis',
                'equipmentLengthQuantity': null,
                'unitOfEquipmentLengthMeasurementCode': null,
                'customerLineHaulOperationalServiceID': null,
                'lineHaulAwardStatusTypeID': 2,
                'serviceTypeCodes': [

                ],
                'billToCode': null,
                'lineHaulAwardStatusTypeName': 'Routeguide'
            },
            'customerLineHaulStops': [
                {
                    'geographyPointTypeID': 1,
                    'stopLocationPointID': 37240,
                    'stopSequenceNumber': 1
                }
            ],
            'stopChargeIncludedIndicator': false,
            'lineHaulEffectiveDate': '2019-06-03',
            'lineHaulExpirationDate': '2019-06-03',
            'sourceID': null,
            'sourceLineHaulID': null,
            'groupRateTypeID': null,
            'groupRateTypeName': null,
            'groupRateItemizeIndicator': null,
            'lineHaulSourceTypeID': 4,
            'customerLineHaulRateDTOs': [
                {
                    'chargeUnitTypeName': 'Per Mile',
                    'lineHaulChargeUnitTypeID': 5,
                    'rateAmount': 12,
                    'minimumAmount': null,
                    'maximumAmount': null,
                    'currencyCode': 'USD'
                }
            ],
            'lineHaulSourceTypeName': 'Manual',
            'customerLineHaulConfigurationID': 408
        };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call getGeographyTypes', () => {
        service.getGeographyTypes('Line Haul');
    });

    it('should call getCountries', () => {
        service.getCountries();
    });

    it('should call lineHaulDraftSave', () => {
        const data = [1, 2, 3];
        service.lineHaulDraftSave(data);
    });

    it('should be getOriginPoint', () => {
        const data = {
            '_source': [
                'Address.AddressLine1',
                'Address.CityName',
                'Address.StateCode',
                'Address.CountryName',
                'Address.CountryCode',
                'Address.PostalCode',
                'Address.AddressID'
            ],
            'query': {
                'bool': {
                    'filter': {
                        'bool': {
                            'must': [
                                {
                                    'query_string': {
                                        'analyze_wildcard': 'true',
                                        'default_operator': 'and',
                                        'fields': [
                                            'Address.AddressID'
                                        ],
                                        'query': 87919
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            'size': 6
        };
        service.getOriginPoint(data);
    });

    it('should be getCityState', () => {
        const data = {
            '_source': false,
            'query': {
                'bool': {
                    'must': [
                        {
                            'nested': {
                                'path': 'City',
                                'query': {
                                    'query_string': {
                                        'fields': [
                                            'City.CityID'
                                        ],
                                        'query': 37307
                                    }
                                },
                                'inner_hits': {
                                    'size': 1,
                                    '_source': {
                                        'includes': [
                                            'City.CityName',
                                            'City.State.StateCode'
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        };
        service.getCityState(data);
    });

    it('should be postEditLaneCardData', () => {
        service.postEditLaneCardData(408, 'draft', lineHaulDetails);
    });

    it('should be postLaneCardData', () => {
        service.postLaneCardData(12, lineHaulDetails);
    });
});
