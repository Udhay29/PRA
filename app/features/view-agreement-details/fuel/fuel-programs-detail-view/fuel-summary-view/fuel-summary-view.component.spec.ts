import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from './../../../view-agreement-details.module';

import { FuelSummaryViewComponent } from './fuel-summary-view.component';
import { FuelSummaryQuery } from './query/fuel-summary.query';
import { FuelSummaryService } from './services/fuel-summary.service';
import { AgreementDetails } from './model/fuel-summary-view.interface';
import { LocalStorageService } from './../../../../../shared/jbh-app-services/local-storage.service';

describe('FuelSummaryViewComponent', () => {
  let component: FuelSummaryViewComponent;
  let fixture: ComponentFixture<FuelSummaryViewComponent>;
  let framerData: Array<object>;
  let fuelNote: string;
  let http: HttpClient;
  let elasticResponse = {};
  let localStorageService: LocalStorageService;
  const agreementData = {
    'customerAgreementID': 27,
    'customerAgreementName': 'Adams Cable Equipment (ADLE59)',
    'agreementType': 'Customer',
    'ultimateParentAccountID': 45667,
    'currencyCode': 'USD',
    'cargoReleaseAmount': '$100,000',
    'businessUnits': [
      'JBI',
      'JBT',
      'ICS',
      'DCS'
    ],
    'taskAssignmentIDs': null,
    'effectiveDate': '1995-01-01',
    'expirationDate': '2099-12-31',
    'invalidIndicator': 'N',
    'invalidReasonTypeName': 'Active'
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, LocalStorageService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelSummaryViewComponent);
    http = TestBed.get(HttpClient);
    localStorageService = TestBed.get(LocalStorageService);
    component = fixture.componentInstance;
    fuelNote = 'fuel';
    framerData = [
      {
        'FinanceBusinessUnitCode': 'ICS',
        'ServiceOfferingCode': 'Flatbed',
        'FinanceBusinessUnitServiceOfferingAssociationID': 10,
        'FinanceBusinessUnitServiceOfferingDisplayName': 'ICS - Flatbed'
      }
    ];
    elasticResponse = {
      'took': 18,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 1,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-fuel-1-2019.05.21',
            '_type': 'doc',
            '_id': '2209',
            '_score': null,
            '_source': {
              'AgreementID': 27,
              'AgreementName': 'Adams Cable Equipment (ADLE59)',
              'BillToAccountAssociations': [
                {
                  'BillingPartyID': 25089,
                  'BillingPartyName': 'Adams Cable Equipment',
                  'BillingPartyCode': 'ADLE68'
                },
                {
                  'BillingPartyID': 36922,
                  'BillingPartyName': 'Adams Cable Equipment',
                  'BillingPartyCode': 'ADLE63'
                },
                {
                  'BillingPartyID': 45667,
                  'BillingPartyName': 'Adams Cable Equipment',
                  'BillingPartyCode': 'ADLE59'
                }
              ],
              'ExpirationDate': '2099-12-31',
              'CarrierAssociations': [
                {
                  'CarrierID': 69,
                  'CarrierName': 'J AND A TRANSPORT (0D0Z)',
                  'CarrierCode': '0D0Z'
                },
                {
                  'CarrierID': 68,
                  'CarrierName': 'CL ALLEN TRUCKING LLC (0CSD)',
                  'CarrierCode': '0CSD'
                },
                {
                  'CarrierID': 64,
                  'CarrierName': 'FATH TRANSPORT LTD (02FC)',
                  'CarrierCode': '02FC'
                }
              ],
              'ContractAssociations': [
                {
                  'ContractNumber': 12312,
                  'ContractDisplayName': 'contract',
                  'ContractType': 'contract',
                  'ContractID': 23423423,
                  'ContractName': 'contract'
                }
              ],
              'uniqueDocID': '2209',
              'FuelProgram': {
                'LastUpdateUserID': 'rcon958',
                'FuelProgramID': 2228,
                'FuelProgramStatus': 'Completed',
                'CreateUserID': 'rcon958',
                'FuelProgramType': 'Agreement-BillTo',
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
                'CreatedDate': '2019-05-23',
                'FuelProgramVersionID': 2209,
                'FuelCalculationDetails': {
                  'FuelFormula': {
                    'IncrementIntervalAmount': 12,
                    'FuelSurchargeFactorAmount': 12,
                    'ImplementationAmount': 23,
                    'IncrementChargeAmount': 12,
                    'CapAmount': 44
                  },
                  'FuelTypeName': 'Diesel',
                  'FuelCalculationConfigurationID': 1038,
                  'FuelCalculationMethodTypeName': 'Formula',
                  'ChargeTypeCode': 'SORTNSEG',
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
                    'AddonAmount': null,
                    'PricingUnitOfVolumeMeasurementCode': null,
                    'DistancePerFuelQuantity': null,
                    'PricingUnitOfLengthMeasurementCode': null,
                    'ImplementationAmount': null
                  },
                  'FuelFlat': {
                    'FuelSurchargeAmount': null
                  },
                  'ChargeTypeName': 'Sort and Segregate for LTL',
                  'FuelDiscountTypeName': null,
                  'IncrementalRateAssociations': null
                },
                'FuelProgramName': 'testdataq234234',
                'LastUpdateProgramName': 'Process ID',
                'LastUpdateDate': '2019-05-23'
              },
              'SectionAssociations': [
                {
                  'SectionName': null,
                  'SectionID': null
                }
              ],
              'FinanceBusinessUnitServiceOfferingAssociations': [
                {
                  'FinanceBusinessUnitCode': 'ICS',
                  'ServiceOfferingCode': 'Flatbed',
                  'FinanceBusinessUnitServiceOfferingAssociationID': 10,
                  'FinanceBusinessUnitServiceOfferingDisplayName': 'ICS - Flatbed'
                },
                {
                  'FinanceBusinessUnitCode': 'ICS',
                  'ServiceOfferingCode': 'LTL',
                  'FinanceBusinessUnitServiceOfferingAssociationID': 8,
                  'FinanceBusinessUnitServiceOfferingDisplayName': 'ICS - LTL'
                }
              ],
              'AgreementDefaultIndicator': 'Yes',
              'EffectiveDate': '2019-05-23'
            },
            'sort': [
              'testdataq234234'
            ]
          }
        ]
      }
    };
    component.summaryModel.agreementData = agreementData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    spyOn(FuelSummaryService.prototype, 'getFuelList').and.returnValues(of(elasticResponse));
    spyOn(FuelSummaryService.prototype, 'getFuelNotes').and.returnValues(of(fuelNote));
    component.ngOnInit();
  });
  it('should call summaryDataFramer', () => {
    component.summaryDataFramer(elasticResponse);
  });
  it('should call businessUnitFramer', () => {
    component.businessUnitFramer(framerData);
  });
  it('should call dataFramer', () => {
    component.dataFramer(framerData, 'carrier');
  });
  it('should call responseFramer', () => {
    component.responseFramer(framerData, [], 'carrier');
  });
  it('should call billtoFramer', () => {
    component.billtoFramer(framerData);
  });
  it('should call billToDataFormater', () => {
    const obj = {
      'BillingPartyID': 39687,
      'BillingPartyName': 'Regional Recycling Llc',
      'BillingPartyCode': 'REAT16'
    };
    component.billToDataFormater(obj, []);
  });
  it('should call fuelPriceNavigate', () => {
    component.fuelPriceNavigate();
  });
  it('should call summaryResponseFramer', () => {
    component.summaryModel.summaryData = elasticResponse['hits']['hits'][0]['_source'];
    component.summaryResponseFramer();
  });
  it('should call noteFramer', () => {
    component.summaryModel.summaryData = elasticResponse['hits']['hits'][0]['_source'];
    component.summaryModel.summaryData['FuelProgram']['CreatedDate'] = '2109/12/12';
    component.summaryModel.summaryData['FuelProgram']['LastUpdateDate'] = '2109/12/12';
    const obj = {
      'createTimestamp': '2019-05-27T12:36:24.124',
      'lastUpdateTimestamp': '2019-05-27T12:38:15.698',
      'fuelProgramNotes': 'test notes'
    };
    component.noteFramer(obj);
  });

});
