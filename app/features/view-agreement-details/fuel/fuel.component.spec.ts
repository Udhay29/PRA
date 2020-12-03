import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../app.module';
import { ViewAgreementDetailsModule } from './../view-agreement-details.module';
import { FuelComponent } from './fuel.component';
import { FuelService } from './service/fuel.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/components/common/messageservice';

import { of, throwError } from 'rxjs';
describe('FuelComponent', () => {
  let component: FuelComponent;
  let fixture: ComponentFixture<FuelComponent>;
  let agreementId: number;
  let service: FuelService;
  let msgservice: MessageService;
  let rootobject;
  let rootobject1;
  let sortEvent;
  let elasticQuery;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelComponent);
    component = fixture.componentInstance;
    agreementId = 123;
    component.fuelModel.sourceData = {
      'sortDistanceBasis': 'string',
      'sortQuantityBasis': 'string',
      'sortImplementationAmount': 'string',
      'sortDistancePerHourQuantity': 'string',
      'sortServiceHourAddonDistanceQuantity': 'string'
    };
    service = fixture.debugElement.injector.get(FuelService);
    msgservice = fixture.debugElement.injector.get(MessageService);
    component.fuelModel.isSubscribe = true;
    fixture.detectChanges();
  });
  sortEvent = {
    'first': 0, 'rows': 25, 'sortField': 'Implementation Price', 'sortOrder': 1, 'filters': {}, 'globalFilter': null,
    'multiSortMeta': undefined
  };
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
  rootobject = {
    'took': 5,
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
          '_index': 'pricing-fuel-1-2019.05.21',
          '_type': 'doc',
          '_id': '2',
          '_score': 1,
          '_source': {
            'AgreementID': 4,
            'AgreementName': 'Schnitzer Southeast (SNGA1)',
            'BillToAccountAssociations': [
              {
                'BillingPartyID': 138833,
                'BillingPartyName': 'Schnitzer Southeast',
                'BillingPartyCode': 'SCBI3'
              },
              {
                'BillingPartyID': 39687,
                'BillingPartyName': 'Regional Recycling Llc',
                'BillingPartyCode': 'REAT16'
              },
              {
                'BillingPartyID': 23039,
                'BillingPartyName': 'Schnitzer Southeast Llc',
                'BillingPartyCode': 'SCATAL'
              }
            ],
            'ExpirationDate': '2099-12-31',
            'CarrierAssociations': [
              {
                'CarrierID': 63,
                'CarrierName': 'ANTHONY TRUCKING 1 LLC (00QM)',
                'CarrierCode': '00QM'
              }
            ],
            'ContractAssociations': [
              {
                'ContractNumber': null,
                'ContractDisplayName': null,
                'ContractType': null,
                'ContractID': null,
                'ContractName': null
              }
            ],
            'uniqueDocID': '2',
            'FuelProgram': {
              'LastUpdateUserID': 'jisasj2',
              'FuelProgramID': 2,
              'FuelProgramStatus': 'Completed',
              'CreateUserID': 'jisasj2',
              'FuelProgramType': 'Agreement-BillTo',
              'Conditions': null,
              'CreateProgramName': 'Process ID',
              'FuelPriceBasis': {
                'PriceChangeWeekDayName': 'Saturday',
                'AverageMonthQuantity': null,
                'FuelPriceChangeOccurenceTypeName': 'Weekly',
                'FuelPriceSourceTypeName': 'OPIS',
                'CustomFuelCalendar': null,
                'FuelPriceFactorTypeName': 'Specified Fuel Day',
                'AverageWeekQuantity': null,
                'HolidayDelayIndicator': 'Y',
                'PriceChangeMonthDayNumber': null,
                'AverageFuelFactorIndicator': 'N',
                'FuelPriceBasisRegionTypeName': 'National',
                'FuelPriceRegionAssociations': [
                  {
                    'DistrictName': null,
                    'DistrictID': null
                  }
                ],
                'UseDefinedRegionStates': 'No'
              },
              'CreatedDate': '2019-05-27',
              'FuelProgramVersionID': 2,
              'FuelCalculationDetails': {
                'FuelFormula': {
                  'IncrementIntervalAmount': 1.8,
                  'FuelSurchargeFactorAmount': 0.321,
                  'ImplementationAmount': 1.0215,
                  'IncrementChargeAmount': 2.3,
                  'CapAmount': 5.2
                },
                'FuelTypeName': 'Diesel',
                'FuelCalculationConfigurationID': 2,
                'FuelCalculationMethodTypeName': 'Formula',
                'ChargeTypeCode': 'DEADHDMILE',
                'FuelCalculationTypeName': 'Breakthrough Fuel',
                'FuelReefer': {
                  'LoadUnloadHourQuantity': null,
                  'DistancePerHourQuantity': null,
                  'ServiceHourAddonQuantity': null,
                  'PricingUnitOfVolumeMeasurementCode': null,
                  'PricingUnitOfLengthMeasurementCode': null,
                  'ServiceHourRoundingTypeName': null,
                  'TravelTimeHourRoundingTypeName': null,
                  'BurnRatePerHourQuantity': null,
                  'ImplementationAmount': null,
                  'ServiceHourAddonDistanceQuantity': null
                },
                'FuelRoundingDecimalNumber': '3',
                'FuelRollUpIndicator': 'Y',
                'CurrencyCode': 'USD',
                'FuelCalculationDateTypeName': 'EDI Received',
                'FuelRateTypeName': 'Flat',
                'FuelQuantity': {
                  'AddonAmount': null,
                  'PricingUnitOfVolumeMeasurementCode': null,
                  'DistancePerFuelQuantity': null,
                  'PricingUnitOfLengthMeasurementCode': null,
                  'ImplementationAmount': null
                },
                'FuelFlat': {
                  'FuelSurchargeAmount': null
                },
                'ChargeTypeName': 'Deadhead Miles',
                'FuelDiscountTypeName': null,
                'IncrementalRateAssociations': null
              },
              'FuelProgramName': 'SNGA1-1',
              'LastUpdateProgramName': 'Process ID',
              'LastUpdateDate': '2019-05-27'
            },
            'SectionAssociations': [
              {
                'SectionName': null,
                'SectionID': null
              }
            ],
            'FinanceBusinessUnitServiceOfferingAssociations': [
              {
                'FinanceBusinessUnitCode': 'DCS',
                'ServiceOfferingCode': 'Backhaul',
                'FinanceBusinessUnitServiceOfferingAssociationID': 4,
                'FinanceBusinessUnitServiceOfferingDisplayName': 'DCS - Backhaul'
              },
              {
                'FinanceBusinessUnitCode': 'DCS',
                'ServiceOfferingCode': 'Dedicated',
                'FinanceBusinessUnitServiceOfferingAssociationID': 5,
                'FinanceBusinessUnitServiceOfferingDisplayName': 'DCS - Dedicated'
              },
              {
                'FinanceBusinessUnitCode': 'DCS',
                'ServiceOfferingCode': 'FinalMile',
                'FinanceBusinessUnitServiceOfferingAssociationID': 6,
                'FinanceBusinessUnitServiceOfferingDisplayName': 'DCS - FinalMile'
              },
              {
                'FinanceBusinessUnitCode': 'ICS',
                'ServiceOfferingCode': 'Flatbed',
                'FinanceBusinessUnitServiceOfferingAssociationID': 10,
                'FinanceBusinessUnitServiceOfferingDisplayName': 'ICS - Flatbed'
              }
            ],
            'AgreementDefaultIndicator': 'Yes',
            'EffectiveDate': '2019-05-27'
          }
        }
      ]
    }
  };
  rootobject1 = {
    'took': 5,
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
          '_index': 'pricing-fuel-1-2019.05.21',
          '_type': 'doc',
          '_id': '2',
          '_score': 1,
          '_source': {
            'AgreementID': 4,
            'AgreementName': 'Schnitzer Southeast (SNGA1)',
            'BillToAccountAssociations': [
              {
                'BillingPartyID': 138833,
                'BillingPartyName': 'Schnitzer Southeast',
                'BillingPartyCode': 'SCBI3'
              },
              {
                'BillingPartyID': 39687,
                'BillingPartyName': 'Regional Recycling Llc',
                'BillingPartyCode': 'REAT16'
              },
              {
                'BillingPartyID': 23039,
                'BillingPartyName': 'Schnitzer Southeast Llc',
                'BillingPartyCode': 'SCATAL'
              }
            ],
            'ExpirationDate': '2099-12-31',
            'CarrierAssociations': [
              {
                'CarrierID': 63,
                'CarrierName': 'ANTHONY TRUCKING 1 LLC (00QM)',
                'CarrierCode': '00QM'
              }
            ],
            'ContractAssociations': [
              {
                'ContractNumber': null,
                'ContractDisplayName': null,
                'ContractType': null,
                'ContractID': null,
                'ContractName': null
              }
            ],
            'uniqueDocID': '2',
            'FuelProgram': {
              'LastUpdateUserID': 'jisasj2',
              'FuelProgramID': 2,
              'FuelProgramStatus': 'Completed',
              'CreateUserID': 'jisasj2',
              'FuelProgramType': 'Agreement-BillTo',
              'Conditions': null,
              'CreateProgramName': 'Process ID',
              'FuelPriceBasis': {
                'PriceChangeWeekDayName': 'Saturday',
                'AverageMonthQuantity': null,
                'FuelPriceChangeOccurenceTypeName': 'Weekly',
                'FuelPriceSourceTypeName': 'OPIS',
                'CustomFuelCalendar': null,
                'FuelPriceFactorTypeName': 'Specified Fuel Day',
                'AverageWeekQuantity': null,
                'HolidayDelayIndicator': 'Y',
                'PriceChangeMonthDayNumber': null,
                'AverageFuelFactorIndicator': 'N',
                'FuelPriceBasisRegionTypeName': 'National',
                'FuelPriceRegionAssociations': [
                  {
                    'DistrictName': null,
                    'DistrictID': null
                  }
                ],
                'UseDefinedRegionStates': 'No'
              },
              'CreatedDate': '2019-05-27',
              'FuelProgramVersionID': 2,
              'FuelCalculationDetails': {
                'FuelFormula': {
                  'IncrementIntervalAmount': null,
                  'FuelSurchargeFactorAmount': null,
                  'ImplementationAmount': null,
                  'IncrementChargeAmount': null,
                  'CapAmount': null
                },
                'FuelTypeName': 'Diesel',
                'FuelCalculationConfigurationID': 2,
                'FuelCalculationMethodTypeName': 'Formula',
                'ChargeTypeCode': 'DEADHDMILE',
                'FuelCalculationTypeName': 'Breakthrough Fuel',
                'FuelReefer': {
                  'LoadUnloadHourQuantity': 2,
                  'DistancePerHourQuantity': '1',
                  'ServiceHourAddonQuantity': 2,
                  'PricingUnitOfVolumeMeasurementCode': 3,
                  'PricingUnitOfLengthMeasurementCode': 4,
                  'ServiceHourRoundingTypeName': 'string',
                  'TravelTimeHourRoundingTypeName': 'string',
                  'BurnRatePerHourQuantity': '7',
                  'ImplementationAmount': '1.0215',
                  'ServiceHourAddonDistanceQuantity': '7'
                },
                'FuelRoundingDecimalNumber': '3',
                'FuelRollUpIndicator': 'Y',
                'CurrencyCode': 'USD',
                'FuelCalculationDateTypeName': 'EDI Received',
                'FuelRateTypeName': 'Flat',
                'FuelQuantity': {
                  'AddonAmount': null,
                  'PricingUnitOfVolumeMeasurementCode': null,
                  'DistancePerFuelQuantity': null,
                  'PricingUnitOfLengthMeasurementCode': null,
                  'ImplementationAmount': null
                },
                'FuelFlat': {
                  'FuelSurchargeAmount': null
                },
                'ChargeTypeName': 'Deadhead Miles',
                'FuelDiscountTypeName': null,
                'IncrementalRateAssociations': null
              },
              'FuelProgramName': 'SNGA1-1',
              'LastUpdateProgramName': 'Process ID',
              'LastUpdateDate': '2019-05-27'
            },
            'SectionAssociations': [
              {
                'SectionName': null,
                'SectionID': null
              }
            ],
            'FinanceBusinessUnitServiceOfferingAssociations': [
              {
                'FinanceBusinessUnitCode': 'DCS',
                'ServiceOfferingCode': 'Backhaul',
                'FinanceBusinessUnitServiceOfferingAssociationID': 4,
                'FinanceBusinessUnitServiceOfferingDisplayName': 'DCS - Backhaul'
              },
              {
                'FinanceBusinessUnitCode': 'DCS',
                'ServiceOfferingCode': 'Dedicated',
                'FinanceBusinessUnitServiceOfferingAssociationID': 5,
                'FinanceBusinessUnitServiceOfferingDisplayName': 'DCS - Dedicated'
              },
              {
                'FinanceBusinessUnitCode': 'DCS',
                'ServiceOfferingCode': 'FinalMile',
                'FinanceBusinessUnitServiceOfferingAssociationID': 6,
                'FinanceBusinessUnitServiceOfferingDisplayName': 'DCS - FinalMile'
              },
              {
                'FinanceBusinessUnitCode': 'ICS',
                'ServiceOfferingCode': 'Flatbed',
                'FinanceBusinessUnitServiceOfferingAssociationID': 10,
                'FinanceBusinessUnitServiceOfferingDisplayName': 'ICS - Flatbed'
              }
            ],
            'AgreementDefaultIndicator': 'Yes',
            'EffectiveDate': '2019-05-27'
          }
        }
      ]
    }
  };
  elasticQuery = {
    'from': 0,
    'size': 25,
    '_source': '*',
    'query': {
      'bool': {
        'must': [
          {
            'query_string': {
              'default_field': 'AgreementID',
              'query': '1'
            }
          },
          {
            'nested': {
              'path': 'FuelProgram',
              'query': {
                'query_string': {
                  'default_field': 'FuelProgram.FuelProgramStatus',
                  'query': 'Completed'
                }
              }
            }
          },
          {
            'bool': {
              'should': []
            }
          }
        ]
      }
    },
    'sort': [
      {
        'FuelProgram.FuelProgramName.keyword': {
          'order': 'asc',
          'nested': {
            'path': 'FuelProgram'
          }
        }
      }
    ]
  };
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });

  it('should call on init', () => {
    spyOn(service, 'setElasticparam').and.callThrough();
    component.fuelModel.agreementId = agreementId;
    spyOn(service, 'getMockJson').and.callThrough();
    component.ngOnInit();
  });
  it('should call onCreateFuel', () => {
    component.fuelModel.agreementId = agreementId;
    component.onCreateFuel();
  });

  it('should call on loading records', () => {
    component.fuelModel.agreementId = agreementId;
    component.fuelModel.noResultFoundFlag = true;
    component.fuelModel.fuelList = [];
    component.fuelModel.isPaginatorFlag = true;
    const response = {
      'took': 7,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 29,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-fuel-2-2019.06.04',
            '_type': 'doc',
            '_id': '172',
            '_score': null,
            '_source': {
              'AgreementID': 48,
              'AgreementName': 'Malnove Incorporated Of Ut (MACLEJ)',
              'BillToAccountAssociations': [
                {
                  'BillingPartyID': null,
                  'BillingPartyName': null,
                  'BillingPartyCode': null
                }
              ],
              'ExpirationDate': '2099-12-31',
              'CarrierAssociations': [
                {
                  'CarrierID': null,
                  'CarrierName': null,
                  'CarrierCode': null
                }
              ],
              'ContractAssociations': [
                {
                  'ContractNumber': 'ID: 4258034',
                  'ContractDisplayName': 'ID: 4258034 (Description: 4518887)',
                  'ContractType': 'Legal',
                  'ContractID': 118,
                  'ContractName': 'Description: 4518887'
                },
                {
                  'ContractNumber': 'ID: 6051954',
                  'ContractDisplayName': 'ID: 6051954 (Description: 2542008)',
                  'ContractType': 'Legal',
                  'ContractID': 121,
                  'ContractName': 'Description: 2542008'
                }
              ],
              'uniqueDocID': '172',
              'FuelProgram': {
                'LastUpdateUserID': 'jcnt588',
                'FuelProgramID': 172,
                'FuelProgramStatus': 'Completed',
                'CreateUserID': 'jcnt588',
                'FuelProgramType': 'Contract',
                'Conditions': null,
                'CreateProgramName': 'Process ID',
                'FuelPriceBasis': {
                  'PriceChangeWeekDayName': 'Monday',
                  'AverageMonthQuantity': null,
                  'FuelPriceChangeOccurenceTypeName': 'Weekly',
                  'FuelPriceSourceTypeName': 'DOE',
                  'CustomFuelCalendar': null,
                  'FuelPriceFactorTypeName': 'Specified Fuel Day',
                  'AverageWeekQuantity': null,
                  'HolidayDelayIndicator': 'N',
                  'PriceChangeMonthDayNumber': null,
                  'AverageFuelFactorIndicator': 'N',
                  'FuelPriceBasisRegionTypeName': 'National',
                  'FuelPriceRegionAssociations': [
                    {
                      'DistrictName': null,
                      'DistrictID': null
                    }
                  ],
                  'UseDefinedRegionStates': 'No'
                },
                'CreatedDate': '2019-05-30',
                'FuelProgramVersionID': 172,
                'FuelCalculationDetails': {
                  'FuelFormula': {
                    'IncrementIntervalAmount': 35,
                    'FuelSurchargeFactorAmount': 69,
                    'ImplementationAmount': 32,
                    'IncrementChargeAmount': 69,
                    'CapAmount': 86
                  },
                  'FuelTypeName': 'Diesel',
                  'FuelCalculationConfigurationID': 115,
                  'FuelCalculationMethodTypeName': 'Flat',
                  'ChargeTypeCode': 'SUPINC',
                  'FuelCalculationTypeName': 'Internal',
                  'FuelReefer': {
                    'LoadUnloadHourQuantity': null,
                    'DistancePerHourQuantity': null,
                    'ServiceHourAddonQuantity': null,
                    'PricingUnitOfVolumeMeasurementCode': null,
                    'PricingUnitOfLengthMeasurementCode': null,
                    'ServiceHourRoundingTypeName': null,
                    'TravelTimeHourRoundingTypeName': null,
                    'BurnRatePerHourQuantity': null,
                    'ImplementationAmount': null,
                    'ServiceHourAddonDistanceQuantity': null
                  },
                  'FuelRoundingDecimalNumber': '3',
                  'FuelRollUpIndicator': 'N',
                  'CurrencyCode': 'USD',
                  'FuelCalculationDateTypeName': 'Order Creation',
                  'FuelRateTypeName': 'Per Distance',
                  'FuelQuantity': {
                    'AddonAmount': 56,
                    'PricingUnitOfVolumeMeasurementCode': 'null',
                    'DistancePerFuelQuantity': 'null',
                    'PricingUnitOfLengthMeasurementCode': 'null',
                    'ImplementationAmount': 45
                  },
                  'FuelFlat': {
                    'FuelSurchargeAmount': '97854'
                  },
                  'ChargeTypeName': 'Fuel Surcharge',
                  'FuelDiscountTypeName': null,
                  'IncrementalRateAssociations': null
                },
                'FuelProgramName': '+1 Contracts',
                'LastUpdateProgramName': 'Process ID',
                'LastUpdateDate': '2019-05-30'
              },
              'SectionAssociations': [
                {
                  'SectionName': null,
                  'SectionID': null
                }
              ],
              'FinanceBusinessUnitServiceOfferingAssociations': [
                {
                  'FinanceBusinessUnitCode': 'DCS',
                  'ServiceOfferingCode': 'Backhaul',
                  'FinanceBusinessUnitServiceOfferingAssociationID': 4,
                  'FinanceBusinessUnitServiceOfferingDisplayName': 'DCS - Backhaul'
                },
                {
                  'FinanceBusinessUnitCode': 'DCS',
                  'ServiceOfferingCode': 'Dedicated',
                  'FinanceBusinessUnitServiceOfferingAssociationID': 5,
                  'FinanceBusinessUnitServiceOfferingDisplayName': 'DCS - Dedicated'
                }
              ],
              'AgreementDefaultIndicator': 'No',
              'EffectiveDate': '2019-05-30'
            },
            'sort': [
              '+1 contracts'
            ]
          }
        ]
      }
    };
    spyOn(service, 'getElasticparam').and.callThrough();
    spyOn(service, 'getFuelList').and.returnValues(of(response));
    component.loadFuelProgramRecords();
  });
  it('should call on loadFuelProgramRecords err', () => {
    spyOn(service, 'getFuelList').and.returnValues(throwError(err));
    component.loadFuelProgramRecords();
  });
  it('should call on getFuelList', () => {
    component.fuelModel.gridDataLength = 10;
    component.fuelModel.fuelList = [];
    component.loadGridFields(rootobject['hits']['hits'][0]._source);
  });
  it('should call on getFuelList1', () => {
    component.fuelModel.gridDataLength = 10;
    component.fuelModel.fuelList = [];
    component.loadGridFields(rootobject1['hits']['hits'][0]._source);
  });
  it('should call on search', () => {
    component.frameSearchQuery(elasticQuery, 'string');
  });
  it('should call on search of date', () => {
    component.frameDateSearchQuery(elasticQuery, 'string');
  });
  it('should call on sortGridData', () => {
    component.sortGridData(elasticQuery, sortEvent);
  });
  it('should call on sortQueryFramer', () => {
    component.sortQueryFramer(elasticQuery, 'field', sortEvent, 'rootval');
  });
  it('should call on distance quantity Fuel Quantity Basis sort', () => {
    sortEvent = {
      'first': 0, 'rows': 25, 'sortField': 'Fuel Quantity Basis', 'sortOrder': 1, 'filters': {}, 'globalFilter': null,
      'multiSortMeta': undefined
    };
    component.distanceQuantityBasisSort(elasticQuery, sortEvent);
  });
  it('should call on distance quantity Distance Basis sort', () => {
    sortEvent = {
      'first': 0, 'rows': 25, 'sortField': 'Distance Basis', 'sortOrder': 1, 'filters': {}, 'globalFilter': null,
      'multiSortMeta': undefined
    };
    component.distanceQuantityBasisSort(elasticQuery, sortEvent);
  });
  it('should call on distance quantity Bill to Account sort', () => {
    sortEvent = {
      'first': 0, 'rows': 25, 'sortField': 'Bill to Account', 'sortOrder': 1, 'filters': {}, 'globalFilter': null,
      'multiSortMeta': undefined
    };
    component.distanceQuantityBasisSort(elasticQuery, sortEvent);
  });
  it('should call on distance quantity Charge Type sort', () => {

    sortEvent = {
      'first': 0, 'rows': 25, 'sortField': 'Charge Type', 'sortOrder': 1, 'filters': {}, 'globalFilter': null,
      'multiSortMeta': undefined
    };
    component.distanceQuantityBasisSort(elasticQuery, sortEvent);
  });
  it('should call on distance quantity Implementation Price sort', () => {
    sortEvent = {
      'first': 0, 'rows': 25, 'sortField': 'Implementation Price', 'sortOrder': 1, 'filters': {}, 'globalFilter': null,
      'multiSortMeta': undefined
    };
    component.distanceQuantityBasisSort(elasticQuery, sortEvent);
  });
  it('should call on distance quantity Created By sort', () => {
    sortEvent = {
      'first': 0, 'rows': 25, 'sortField': 'Created By', 'sortOrder': 1, 'filters': {}, 'globalFilter': null,
      'multiSortMeta': undefined
    };
    component.distanceQuantityBasisSort(elasticQuery, sortEvent);
  });
  it('should call on distance quantity Updated By sort', () => {
    sortEvent = {
      'first': 0, 'rows': 25, 'sortField': 'Updated By', 'sortOrder': 1, 'filters': {}, 'globalFilter': null,
      'multiSortMeta': undefined
    };
    component.distanceQuantityBasisSort(elasticQuery, sortEvent);
  });
  it('should call on distance quantity Distance Per Hour sort', () => {
    sortEvent = {
      'first': 0, 'rows': 25, 'sortField': 'Distance Per Hour', 'sortOrder': 1, 'filters': {}, 'globalFilter': null,
      'multiSortMeta': undefined
    };
    component.distanceQuantityBasisSort(elasticQuery, sortEvent);
  });
  it('should call on distance quantity Add Hour After Distance sort', () => {
    sortEvent = {
      'first': 0, 'rows': 25, 'sortField': 'Add Hour After Distance', 'sortOrder': 1, 'filters': {}, 'globalFilter': null,
      'multiSortMeta': undefined
    };
    component.distanceQuantityBasisSort(elasticQuery, sortEvent);
  });
  it('should call on distance quantity default sort', () => {
    sortEvent = {
      'first': 0, 'rows': 25, 'sortField': 'default', 'sortOrder': 1, 'filters': {}, 'globalFilter': null,
      'multiSortMeta': undefined
    };
    component.distanceQuantityBasisSort(elasticQuery, sortEvent);
  });
  it('should call on loading Grid Data', () => {
    component.fuelModel.fuelList = rootobject['hits']['hits'];
    spyOn(service, 'getElasticparam').and.callThrough();
    spyOn(service, 'setElasticparam').and.callThrough();
    component.loadGridData(sortEvent);
  });
  it('should call on sortGridData', () => {
    spyOn(service, 'getElasticparam').and.callThrough();
    spyOn(service, 'setElasticparam').and.callThrough();
    component.getGridValues(sortEvent);
  });
  it('should call on message service', () => {
    spyOn(msgservice, 'add').and.callThrough();
    component.toastMessage('string', 'string');
  });
  it('should call on onRowSelect', () => {
    const event = {
      'data': {
        'FuelProgram': {
          'FuelProgramID': 123
        }
      }
    };
    component.onRowSelect(event);
  });
});
