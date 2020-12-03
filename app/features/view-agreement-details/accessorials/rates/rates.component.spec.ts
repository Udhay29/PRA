import { RateViewService } from './services/rate-view.service';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF, CurrencyPipe } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { MessageService } from 'primeng/components/common/messageservice';
import { Router } from '@angular/router';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';

import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';

import { RatesComponent } from './rates.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { of, throwError } from 'rxjs';
import { RateViewQuery } from './query/rate-view.query';

describe('RatesComponent', () => {
  let component: RatesComponent;
  let fixture: ComponentFixture<RatesComponent>;
  const router = {
    navigate: jasmine.createSpy('navigate')
  };
  let rateViewService: RateViewService;
  let shared: BroadcasterService;
  let debugElement: DebugElement;
  let currencyPipe: CurrencyPipe;
  const messageservice: MessageService = new MessageService();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, RateViewService, CurrencyPipe,
      { provide: Router, useValue: router }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    rateViewService = debugElement.injector.get(RateViewService);
    shared = TestBed.get(BroadcasterService);
    currencyPipe = TestBed.get(CurrencyPipe);
    fixture.detectChanges();
  });

  const query = {
    'from': 0,
    'size': 25,
    '_source': [],
    'query': {
      'bool': {
        'must': [
          {
            'query_string': {
              'default_field': 'customerAgreementId',
              'query': 134,
              'default_operator': 'AND'
            }
          },
          {
            'range': {
              'expirationDate': {
                'gte': 'now/d'
              }
            }
          },
          {
            'bool': {
              'must_not': [
                {
                  'query_string': {
                    'default_field': 'status',
                    'query': 'Deleted'
                  }
                }
              ]
            }
          },
          {
            'script': {}
          }
        ],
        'should': [
          {
            'nested': {
              'path': 'customerAccessorialRateChargeDTOs',
              'query': {
                'query_string': {
                  'default_field': 'customerAccessorialRateChargeDTOs.accessorialRateTypeName.raw',
                  'query': '*'
                }
              },
              'inner_hits': {
                'sort': [
                  {
                    'customerAccessorialRateChargeDTOs.accessorialRateTypeName.raw': {
                      'order': 'desc',
                      'missing': '_last'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    },
    'sort': [
      {
        'customerAccessorialRateChargeDTOs.accessorialRateTypeName.raw': {
          'order': 'desc',
          'missing': '_last',
          'nested': {
            'path': 'customerAccessorialRateChargeDTOs'
          },
          'mode': 'max'
        }
      }
    ]
  };
  const queryResponse = {
    'took': 169,
    'timed_out': false,
    '_shards': {
      'total': 3,
      'successful': 3,
      'skipped': 0,
      'failed': 0
    },
    'hits': {
      'total': 3,
      'max_score': null,
      'hits': [
        {
          '_index': 'pricing-accessorial-rate-1-2019.07.25',
          '_type': 'doc',
          '_id': '2097',
          '_score': null,
          '_source': {
            'chargeTypeId': 60,
            'chargeTypeName': 'Carbon Tax Surcharge',
            'accessorialGroupTypeId': null,
            'customerAccessorialAccounts': [
              {
                'customerAgreementContractNumber': null,
                'customerAgreementContractName': '1923 (Description: 295952)',
                'customerAccessorialAccountId': null,
                'customerAgreementContractSectionId': null,
                'customerAgreementContractSectionAccountId': null,
                'customerAgreementContractSectionName': 'HomeDepotCanadaCAD',
                'customerAgreementContractId': null,
                'customerAgreementContractSectionAccountName': 'Home Depot Supplier Cente (HOAT2)'
              }
            ],
            'customerAccessorialRateAlternateCharge': null,
            'rateItemizeIndicator': null,
            'waived': null,
            'hasAttachment': null,
            'documentFileNames': null,
            'equipmentLengthDescription': null,
            'customerAgreementId': 48,
            'customerAccessorialServiceLevelBusinessUnitServiceOfferings': [
              {
                'serviceOffering': 'Brokerage',
                'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': null,
                'businessUnit': 'ICS',
                'serviceLevelBusinessUnitServiceOfferingAssociationId': 2,
                'serviceLevel': 'Standard',
                'businessUnitDisplayName': 'ICS - Brokerage'
              }
            ],
            'equipmentTypeCode': null,
            'customerAccessorialRateAdditionalCharges': [
              {
                'additionalChargeCodeName': 'CHASISRENT',
                'rateAmountDisplayName': null,
                'rateAmount': 45.0,
                'accessorialRateTypeId': 8,
                'additionalChargeTypeId': 46,
                'additionalChargeTypeName': 'Chassis Rental Charge',
                'customerAccessorialRateAdditionalChargeId': null,
                'accessorialRateTypeName': 'Flat'
              }
            ],
            'expirationDate': '12/31/2099',
            'lastUpdatedBy': 'jcnt899',
            'equipmentLengthId': null,
            'rateSetupStatus': null,
            'level': 11,
            'accessorialDocumentTypeId': null,
            'documentLegalDescription': 'testing view text in Agreement level with charge type testing Admin',
            'equipmentCategoryCode': null,
            'customerAccessorialCarriers': null,
            'customerChargeName': null,
            'chargeTypeCode': 'CARBON',
            'customerAccessorialRateConfigurationId': 2097,
            'passThrough': true,
            'customerAccessorialRequestServices': [
              {
                'customerAccessorialRequestServiceId': null,
                'requestedServiceTypeCode': 'Blind Shipment',
                'requestedServiceTypeId': null
              }
            ],
            'lastUpdatedDate': '07/29/2019',
            'accessorialGroupTypeName': null,
            'equipmentTypeId': null,
            'createdDate': '07/29/2019',
            'customerAccessorialRateCharges': [
              {
                'minimumAmountDisplayName': null,
                'customerAccessorialRateChargeId': null,
                'rateAmountDisplayName': '$43.00',
                'maximumAmountDisplayName': null,
                'accessorialRateRoundingTypeId': 7,
                'rateAmount': 43.0,
                'maximumAmount': null,
                'minimumAmount': null,
                'accessorialRateTypeId': 14,
                'accessorialRateRoundingTypeName': 'Down',
                'rateOperator': null,
                'accessorialRateTypeName': 'Percent'
              }
            ],
            'groupRateTypeId': null,
            'createdBy': 'jcnt899',
            'invalidIndicator': 'N',
            'customerAccessorialRateCriterias': [
              {
                'customerAccessorialRateCriteriaId': null,
                'customerAccessorialRateCriteriaName': null,
                'customerAccessorialRateCriteriaTypeId': 7
              }
            ],
            'calculateRateManually': null,
            'documentInstructionalDescription': null,
            'currencyCode': 'USD',
            'effectiveDate': '07/29/2019',
            'customerAccessorialStairRate': null,
            'status': 'Active'
          },
          'sort': [
            'carbon tax surcharge',
            null
          ],
          'inner_hits': {
            'customerAccessorialRequestServices': {
              'hits': {
                'total': 1,
                'max_score': null,
                'hits': [
                  {
                    '_index': 'pricing-accessorial-rate-1-2019.07.25',
                    '_type': 'doc',
                    '_id': '2097',
                    '_nested': {
                      'field': 'customerAccessorialRequestServices',
                      'offset': 0
                    },
                    '_score': null,
                    '_source': {
                      'customerAccessorialRequestServiceId': null,
                      'requestedServiceTypeId': null,
                      'requestedServiceTypeCode': 'Blind Shipment'
                    },
                    'sort': [
                      'blind shipment'
                    ]
                  }
                ]
              }
            },
            'customerAccessorialRateCharges': {
              'hits': {
                'total': 0,
                'max_score': null,
                'hits': []
              }
            },
            'customerAccessorialAccounts': {
              'hits': {
                'total': 1,
                'max_score': null,
                'hits': [
                  {
                    '_index': 'pricing-accessorial-rate-1-2019.07.25',
                    '_type': 'doc',
                    '_id': '2097',
                    '_nested': {
                      'field': 'customerAccessorialAccounts',
                      'offset': 0
                    },
                    '_score': null,
                    '_source': {
                      'customerAccessorialAccountId': null,
                      'customerAgreementContractSectionId': null,
                      'customerAgreementContractSectionName': null,
                      'customerAgreementContractId': null,
                      'customerAgreementContractName': '1923 (Description: 295952)',
                      'customerAgreementContractNumber': null,
                      'customerAgreementContractSectionAccountId': null,
                      'customerAgreementContractSectionAccountName': null
                    },
                    'sort': [
                      '1923 (description: 295952)'
                    ]
                  }
                ]
              }
            },
            'customerAccessorialRateAlternateCharge': {
              'hits': {
                'total': 0,
                'max_score': null,
                'hits': []
              }
            },
            'customerAccessorialCarriers': {
              'hits': {
                'total': 0,
                'max_score': null,
                'hits': []
              }
            },
            'customerAccessorialServiceLevelBusinessUnitServiceOfferings': {
              'hits': {
                'total': 5,
                'max_score': null,
                'hits': [
                  {
                    '_index': 'pricing-accessorial-rate-1-2019.07.25',
                    '_type': 'doc',
                    '_id': '2097',
                    '_nested': {
                      'field': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings',
                      'offset': 0
                    },
                    '_score': null,
                    '_source': {
                      'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': null,
                      'serviceLevelBusinessUnitServiceOfferingAssociationId': 2,
                      'businessUnit': 'ICS',
                      'serviceOffering': 'Brokerage',
                      'serviceLevel': 'Standard',
                      'businessUnitDisplayName': 'ICS - Brokerage'
                    },
                    'sort': [
                      'ics - brokerage'
                    ]
                  }
                ]
              }
            },
            'customerAccessorialStairRate': {
              'hits': {
                'total': 0,
                'max_score': null,
                'hits': []
              }
            },
            'customerAccessorialStairRate.customerAccessorialStairStepRates': {
              'hits': {
                'total': 0,
                'max_score': null,
                'hits': []
              }
            },
            'customerAccessorialRateAdditionalCharges': {
              'hits': {
                'total': 0,
                'max_score': null,
                'hits': []
              }
            }
          }
        }
      ]
    }
  };

  const rateValues = {
    'customerChargeName': null,
    'customerAgreementId': '4',
    'accessorialDocumentTypeId': null,
    'equipmentLengthId': 20,
    'equipmentLengthDescription': '10 Feet in Length',
    'equipmentTypeId': 37,
    'customerAccessorialAccountDTOs': [
    ],
    'businessUnitServiceOfferingDTOs': [
      {
        'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': null,
        'serviceLevelBusinessUnitServiceOfferingAssociationId': 11,
        'businessUnit': 'DCS',
        'serviceOffering': 'Backhaul',
        'businessUnitDisplayName': 'DCS - Backhaul',
        'serviceLevel': 'Standard'
      }
    ],
    'requestServiceDTOs': [
      {
        'requestedServiceTypeCode': 'Team:Team Driving'
      }
    ],
    'carrierDTOs': [
      {
        'carrierId': 101,
        'carrierName': 'Test Carrier 1',
        'carrierCode': 'TCR1',
        'carrierDisplayName': 'Test Carrier 1 (TCR1)'
      }
    ],
    'effectiveDate': '2019-08-05',
    'expirationDate': '2099-12-31',
    'level': 9,
    'attributeLevel': 7,
    'chargeTypeId': 2,
    'chargeTypeName': 'Detention With Power',
    'currencyCode': 'USD',
    'equipmentCategoryCode': 'Chassis',
    'equipmentTypeCode': 'Dolly',
    'rateItemizeIndicator': 1,
    'groupRateTypeId': null,
    'customerAccessorialRateCriteriaDTOs': [
    ],
    'customerAccessorialRateAlternateChargeDTO': null,
    'customerAccessorialRateChargeDTOs': null,
    'chargeTypeCode': 'DETENTIONP',
    'documentLegalDescription': 'test',
    'documentInstructionalDescription': null,
    'customerAccessorialRateAdditionalChargeDTOs': [
      {
        'customerAccessorialRateAdditionalChargeId': null,
        'accessorialRateTypeId': 8,
        'accessorialRateTypeName': 'Flat',
        'additionalChargeTypeId': 9,
        'additionalChargeTypeName': 'Deadhead Miles',
        'additionalChargeCodeName': 'DEADHDMILE',
        'rateAmount': 10
      }
    ],
    'customerAccessorialStairRate': {
      'customerAccessorialStairRateId': null,
      'accessorialRateTypeName': 'Per Day',
      'accessorialRateTypeId': 9,
      'accessorialRateRoundingTypeId': 10,
      'accessorialRateRoundingTypeName': 'Half Down',
      'accessorialMaximumRateApplyTypeId': 4,
      'accessorialMaximumRateApplyTypeName': 'Calculated Maximum Exceeded',
      'minimumAmount': 0,
      'maximumAmount': 1,
      'customerAccessorialStairStepRates': [
        {
          'customerAccessorialStairStepRateId': null,
          'stepNumber': 1,
          'fromRateTypeQuantity': 0,
          'toRateTypeQuantity': 1,
          'stairStepRateAmount': 1
        },
        {
          'customerAccessorialStairStepRateId': null,
          'stepNumber': 2,
          'fromRateTypeQuantity': 2,
          'toRateTypeQuantity': 3,
          'stairStepRateAmount': 1
        }
      ]
    },
    'documentFileNames': [
      'testData.docx'
    ]
  };


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cal onCreateRateSetup', () => {
    shared.broadcast('editAccesorialRates', {
      editRateData: null,
      isAccessorialRateEdit: false,
      refreshDocumentResponse: null,
      rateConfigurationId: null
    });
    component.onCreateRateSetup();
  });

  it('should cal getGridValues', () => {
    spyOn(rateViewService, 'getRateData').and.returnValues(of(queryResponse));
    spyOn(component, 'sortClick');
    RateViewQuery.getRateGridQuery(query, 134);
    component.getGridValues(query, null);
  });
  it('should cal loadGridData', () => {
    component.rateModel.rateListValues.length = 4;
    const element = fixture.debugElement.query(By.css('[name="pTable"]'));
    element.triggerEventHandler('onLazyLoad', { 'rows': 25, 'first': 0 });
  });

  it('should cal dataFramer', () => {
    component.dataFramer(queryResponse, {});
  });

  it('should call toastMessage', () => {
    spyOn(messageservice, 'clear');
    spyOn(messageservice, 'add');
    component.toastMessage(messageservice, 'error', 'Error', 'message');
    expect(messageservice.clear).toHaveBeenCalled();
    expect(messageservice.add).toHaveBeenCalled();
  });
  it('should cal expirationDateFramerElse', () => {
    component.expirationDateFramer(null);
  });
  it('should cal expirationDateFramerif2', () => {
    const event = {
      'expirationDate': {
        'lte': '2019-07-25',
        'gte': '2019-07-25',
        'type': 'expirationNonMatch'
      }
    };
    component.expirationDateFramer(event);
  });
  it('should cal expirationDateFramerif1', () => {
    const event = {
      'expirationDate': {
        'lte': '2019-07-25',
        'gte': '2019-07-25',
        'type': 'expirationExactMatch'
      }
    };
    component.expirationDateFramer(event);
  });
  it('should cal expirationDateFramerifelse', () => {
    const event = {
      'expirationDate': {
        'lte': '2019-07-25',
        'gte': '2019-07-25',
        'type': 'else'
      }
    };
    component.expirationDateFramer(event);
  });
  it('should cal effectiveDateFramerElse', () => {
    component.effectiveDateFramer(null);
  });
  it('should cal effectiveDateFramerif2', () => {
    const event = {
      'effectiveDate': {
        'lte': '2019-07-25',
        'gte': '2019-07-25',
        'type': 'effectiveNonMatch'
      }
    };
    component.effectiveDateFramer(event);
  });
  it('should cal effectiveDateFramerif1', () => {
    const event = {
      'effectiveDate': {
        'lte': '2019-07-25',
        'gte': '2019-07-25',
        'type': 'effectiveExactMatch'
      }
    };
    component.effectiveDateFramer(event);
  });
  it('should cal effectiveDateFramerifelse ', () => {
    const event = {
      'effectiveDate': {
        'lte': '2019-07-25',
        'gte': '2019-07-25',
        'type': 'else'
      }
    };
    component.effectiveDateFramer(event);
  });

  it('should cal onRowSelect', () => {
    const element = fixture.debugElement.query(By.css('[name="pTable"]'));
    element.triggerEventHandler('onRowSelect', { data: { _source: {} } });
  });

  it('should cal onPage', () => {
    component.onPage();
  });

  it('should cal onSort', () => {
    component.onSort(event);
    const element = fixture.debugElement.query(By.css('[name="pTable"]'));
    element.triggerEventHandler('onSort', {});
  });

  it('should cal checkStringValue', () => {
    component.checkStringValue('value');
  });

  it('should cal checkIntegerValue', () => {
    component.checkIntegerValue('2');
  });

  it('should cal stairStepFramer', () => {
    const rateObj = [{
      'stepItemizedRates': ''
    }];
    component.stairStepFramer(rateValues, rateObj);
    component.commanStairStepFramer(rateValues, rateObj);
  });

  it('should call businessFramer', () => {
    component.businessFramer(queryResponse['customerAccessorialServiceLevelBusinessUnitServiceOfferings']);
  });

  it('should call getGridValues error condition', () => {
    const error = {
      error: {
        errors: [
          {errorMessage: 'error'}
        ]
      }
    };
    spyOn(rateViewService, 'getRateData').and.returnValues(throwError(error));
    spyOn(component, 'sortClick');
    RateViewQuery.getRateGridQuery(query, 134);
    component.getGridValues(query, null);
  });

  it('should call itemizeFramer', () => {
    component.itemizeFramer(1);
    component.itemizeFramer(0);
  });

  it('should call loadGridBasedOnFilter', () => {
    const event = {
      'effectiveDate': {
        'lte': '08/12/2019',
        'gte': '01/01/1995',
        'type': 'effectiveExactMatch'
      },
      'expirationDate': {
        'lte': '12/31/2099',
        'gte': '01/01/1995',
        'type': 'expirationDateRange'
      }
    };
    component.loadGridBasedOnFilter(event);
    const event1 = {
      'effectiveDate': {
        'lte': '08/12/2019',
        'gte': '01/01/1995',
        'type': 'effectiveNonMatch'
      },
      'expirationDate': {
        'lte': '12/31/2099',
        'gte': '01/01/1995',
        'type': 'expirationNonMatch'
      }
    };
    component.loadGridBasedOnFilter(event1);
  });

  it('should call sortCilckwithoutEvent', () => {
    component.rateModel.sortValuesort = {};
    component.rateModel.sortValueobj = {};
    component.sortCilckwithoutEvent(query);
  });

});
