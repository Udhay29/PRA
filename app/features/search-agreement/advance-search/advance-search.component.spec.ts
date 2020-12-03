import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { of, throwError } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { AppModule } from '../../../app.module';
import { AdvanceSearchComponent } from './advance-search.component';
import { AdvanceSearchService } from './services/advance-search.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { SearchAgreementModule } from '../search-agreement.module';
import { AdvanceSearchUtilityService } from './services/advance-search-utility.service';
import { HttpHeaders, HttpResponseBase } from '@angular/common/http';
import {
  FormsModule, ReactiveFormsModule,
  FormControl, Validators, FormBuilder, FormGroup, FormArray, AbstractControl
} from '@angular/forms';
import { AgreementTypesResponse, Buckets, HitsItem, RootObject} from './model/advance-search-interface';
import { ErrorsModule } from '../../../shared/errors';
import { AddContractsUtility } from '../../create-agreement/add-contracts/service/add-contracts-utility';

describe('AdvanceSearchComponent', () => {
  let component: AdvanceSearchComponent;
  let fixture: ComponentFixture<AdvanceSearchComponent>;
  let service: AdvanceSearchService;
  let shared: BroadcasterService;
  let msg: MessageService;
  let codeStatus: string[];
  let agreementType: AgreementTypesResponse;
  let agreementDetails: RootObject;
  let resultSet: Buckets;
  let contractDetails: RootObject;
  let carrierAgreementName: RootObject;
  let carrierAgreementResultSet: HitsItem;
  let carrierName: any;
  let carrierNameResultSet: any;
  let contractResultset: Array<object>;
  let billToDetails: RootObject;
  let billToResultSet: Buckets[];
  let teamsDetail: RootObject;
  let teamsResultSet: Buckets;
  const formBuilder = new FormBuilder();
  let formGroup: FormGroup;

  const zzz = {
    '_source': [
       'AgreementID',
       'AgreementType',
       'AgreementStatus',
       'AgreementInvalidIndicator',
       'AgreementExpirationDate',
       'AgreementName'
    ],
    'query': {
       'bool': {
          'must': [
             {
                'query_string': {
                   'fields': [
                      'AgreementStatus.keyword'
                   ],
                   'query': 'Completed'
                }
             },
             {
                'bool': {
                   'should': [
                      {
                         'query_string': {
                            'default_field': 'AgreementType.keyword',
                            'query': 'Customer'
                         }
                      }
                   ]
                }
             },
             {
                'bool': {
                   'should': [
                      {
                         'query_string': {
                            'default_field': 'AgreementName.aux',
                            'query': 'Tpc Inc \\(TRLOAE\\)',
                            'split_on_whitespace': 'false'
                         }
                      }
                   ]
                }
             }
          ]
       }
    },
    'collapse': {
       'field': 'AgreementID.keyword'
    },
    'aggs': {
       'count': {
          'cardinality': {
             'field': 'AgreementName.aux'
          }
       }
    },
    'sort': {
       'AgreementName.keyword': 'asc'
    },
    'size': 25,
    'from': 0
 };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, AppModule, SearchAgreementModule],
      providers: [AdvanceSearchService, AdvanceSearchUtilityService, BroadcasterService,
         MessageService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    service = TestBed.get(AdvanceSearchService);
    shared = TestBed.get(BroadcasterService);
    msg = TestBed.get(MessageService);
    fixture = TestBed.createComponent(AdvanceSearchComponent);
    component = fixture.componentInstance;
    formGroup = formBuilder.group({
      favoriteSearches: ['test'],
      agreementType: ['test', Validators.required],
      agreement: ['test'],
      contract: ['test'],
      billTo: ['test'],
      carrierCode: ['test'],
      codeStatus: ['test'],
      operationalTeam: ['test'],
      agreementStatus: ['test'],
      carrierStatus: ['test'],
      carrierAgreement: ['test'],
      carrier: ['test'],
      CarrierAgreementStatus: ['test']
    });
    fixture.detectChanges();
    codeStatus = ['Active', 'Inactive', 'All'];

    agreementType = {
      '_embedded': {
        'agreementTypes': [
          {
            'agreementTypeName': 'Customer',
            'agreementTypeID': 1,
            '_links': {
              'self': {
                'href': 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/agreementtypes/1'
              },
              'agreementType': {
                'href': 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/agreementtypes/1{?projection}',
                'templated': true
              }
            }
          },
          {
            'agreementTypeName': 'Carrier',
            'agreementTypeID': 2,
            '_links': {
              'self': {
                'href': 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/agreementtypes/2'
              },
              'agreementType': {
                'href': 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/agreementtypes/2{?projection}',
                'templated': true
              }
            }
          },
          {
            'agreementTypeName': 'Rail',
            'agreementTypeID': 3,
            '_links': {
              'self': {
                'href': 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/agreementtypes/3'
              },
              'agreementType': {
                'href': 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/agreementtypes/3{?projection}',
                'templated': true
              }
            }
          }
        ]
      },
      '_links': {
        'self': {
          'href': 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/agreementtypes/search/agreementtypes?activeBy=2019-05-20'
        }
      }
    };
    carrierName = {
      'took': 16,
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
            '_index': 'pricing-carrier-agreement',
            '_type': 'doc',
            '_id': '107',
            '_score': null,
            '_source': {
              'carrierAgreementCarrierAssociation': [
                {
                  'carrierDisplayName': 'CACODE'
                },
                {
                  'carrierDisplayName': 'CACODE2'
                }
              ]
            },
            'sort': [
              1562716800000
            ],
            'inner_hits': {
              'carrierAgreementCarrierAssociation': {
                'hits': {
                  'total': 1,
                  'max_score': 2.210721,
                  'hits': [
                    {
                      '_index': 'pricing-carrier-agreement',
                      '_type': 'doc',
                      '_id': '107',
                      '_nested': {
                        'field': 'carrierAgreementCarrierAssociation',
                        'offset': 1
                      },
                      '_score': 2.210721,
                      '_source': {
                        'carrierStatus': 'A',
                        'carrierName': 'carrier305',
                        'invalidIndicator': 'N',
                        'invalidReasonType': 'Active',
                        'carrierCode': 'CACODE2',
                        'carrierDisplayName': 'CACODE2',
                        'carrierID': 305,
                        'effectiveDate': '07/10/2019',
                        'expirationDate': '07/20/2019'
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
    carrierNameResultSet = {
      '_index': 'pricing-carrier-agreement',
      '_type': 'doc',
      '_id': '107',
      '_nested': {
        'field': 'carrierAgreementCarrierAssociation',
        'offset': 1
      },
      '_score': 2.210721,
      '_source': {
        'carrierStatus': 'A',
        'carrierName': 'carrier305',
        'invalidIndicator': 'N',
        'invalidReasonType': 'Active',
        'carrierCode': 'CACODE2',
        'carrierDisplayName': 'CACODE2',
        'carrierID': 305,
        'effectiveDate': '07/10/2019',
        'expirationDate': '07/20/2019'
      }
    };
    agreementDetails = {
      'took': 26,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 1,
        'max_score': 5.5819497,
        'hits': [
          {
            '_index': 'pricing-agreement',
            '_type': 'doc',
            '_id': '227324771779',
            '_score': 5.5819497,
            '_source': {
              'AgreementName': 'Zebra Outlet (ZECH23)',
              'UltimateParentAccountCode': 'ZECH23'
            }
          }
        ]
      },
      'aggregations': {
        'group_by_description': {
          'doc_count_error_upper_bound': 0,
          'sum_other_doc_count': 0,
          'buckets': [
            {
              'key': 'courier express jacksonville (cojaez)',
              'doc_count': 1
            }
          ]
        }
      }
    };
    resultSet = {
      'key': 'abbyland foods, inc. (abab79)',
      'doc_count': 7
    };
    contractDetails = {
      'took': 10,
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
        'hits': []
      },
      'aggregations': {
        'nesting': {
          'doc_count': 1,
          'by_contractName': {
            'doc_count_error_upper_bound': 0,
            'sum_other_doc_count': 0,
            'buckets': [
              {
                'key': 'fghdfhdzs',
                'doc_count': 1,
                'by_ContractNumber': {
                  'doc_count_error_upper_bound': 0,
                  'sum_other_doc_count': 0,
                  'buckets': [
                    {
                      'key': '494',
                      'doc_count': 1
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    };
    carrierAgreementName = {
      'took': 16,
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
            '_index': 'pricing-carrier-agreement',
            '_type': 'doc',
            '_id': '104',
            '_score': null,
            '_source': {
              'carrierAgreementName': 'CarrierAgreement200'
            },
            'fields': {
              'carrierAgreementName.keyword': [
                'carrieragreement200'
              ]
            },
            'sort': [
              'carrieragreement200'
            ]
          }
        ]
      }
    };
    carrierAgreementResultSet = {
      '_index': 'pricing-carrier-agreement',
      '_type': 'doc',
      '_id': '104',
      '_score': null,
      '_source': {
        'carrierAgreementName': 'CarrierAgreement200'
      },
      'fields': {
        'carrierAgreementName.keyword': [
          'carrieragreement200'
        ]
      },
      'sort': [
        'carrieragreement200'
      ]
    };
    contractResultset = [
      {
        'key': 'fghdfhdzs',
        'doc_count': 1,
        'by_ContractNumber': {
          'doc_count_error_upper_bound': 0,
          'sum_other_doc_count': 0,
          'buckets': [
            {
              'key': '494',
              'doc_count': 1
            }
          ]
        }
      }
    ];
    billToDetails = {
      'took': 11,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 57,
        'max_score': 0,
        'hits': []
      },
      'aggregations': {
        'nesting': {
          'doc_count': 63,
          'by_BillingPartyCode': {
            'doc_count': 1,
            'by_BillingPartyName': {
              'doc_count_error_upper_bound': 0,
              'sum_other_doc_count': 0,
              'buckets': [
                {
                  'key': 'zebco holdings, inc.',
                  'doc_count': 1,
                  'by_BillingPartyCode': {
                    'doc_count_error_upper_bound': 0,
                    'sum_other_doc_count': 0,
                    'buckets': [
                      {
                        'key': 'zetu13',
                        'doc_count': 1
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    };
    billToResultSet = [
      {
        'key': 'zebco holdings, inc.',
        'doc_count': 1,
        'by_BillingPartyCode': {
          'doc_count_error_upper_bound': 0,
          'sum_other_doc_count': 0,
          'buckets': [
            {
              'key': 'zetu13',
              'doc_count': 1
            }
          ]
        }
      }
    ];
    teamsDetail = {
      'took': 9,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 5,
        'max_score': 0,
        'hits': []
      },
      'aggregations': {
        'nesting': {
          'doc_count': 5,
          'by_teamName': {
            'doc_count_error_upper_bound': 0,
            'sum_other_doc_count': 0,
            'buckets': [
              {
                'key': 'pricing team 1',
                'doc_count': 3
              }
            ]
          }
        }
      }
    };
    teamsResultSet = {
      'key': 'pricing team 1',
      'doc_count': 3
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });
  it('should call onClearSearch', () => {
    component.advanceSearchModel.advanceSearchForm = formGroup;
    component.onClearSearch();
  });
  it('should call onSearchTeamsRemove', () => {
    component.onSearchTeamsRemove('search', 'codeStatus');
  });
  it('should call onSearchTeamsRemove if', () => {
    component.advanceSearchModel.advanceSearchForm = formGroup;
    component.onSearchTeamsRemove('', 'contract');
  });
  it('should call onSearchTeamsRemove else', () => {
    component.advanceSearchModel.advanceSearchForm = formGroup;
    component.onSearchTeamsRemove('status', 'codeStatus');
  });
  it('should call onClickSearch', () => {
    component.onClickSearch();
  });
  it('should call searchAgreement', () => {
    component.advanceSearchModel.isCarrierFlag = false;
    AdvanceSearchUtilityService.createQuery(component.advanceSearchModel.advanceSearchForm,
    component.searchGridQuery.searchQuery, component.searchGridQuery.findKeyString, component.advanceSearchModel);
    component.searchAgreement();
  });
  it('should call searchAgreement', () => {
    component.advanceSearchModel.isCarrierFlag = true;
    AdvanceSearchUtilityService.createQuery(component.advanceSearchModel.advanceSearchForm,
    component.searchGridQuery.searchQuery, component.searchGridQuery.findKeyString, component.advanceSearchModel);
    component.searchAgreement();
  });
  it('should call searchAgreements', () => {
    const fieldkey = {
      agreement: 'AgreementName',
      agreementStatus: 'value',
      agreementType: 'value',
      billTo: 'PartyCode',
      codeStatus: 'value',
      Contract: 'ContractName',
      operationalTeam: 'value'
    };
    const label = {
      label: 'All',
      value: 'All'
    };
    AdvanceSearchUtilityService.createQuery(component.advanceSearchModel.advanceSearchForm,
    component.searchGridQuery.searchQuery, component.searchGridQuery.findKeyString, component.advanceSearchModel);
    component.searchAgreement();
    });
  it('should call searchAgreement if', () => {
    component.advanceSearchModel.isCarrierFlag = false;
    component.searchAgreement();
  });
  it('should call onSearchAgreementType', () => {
    component.onSearchAgreementType('customer');
  });
  it('should call onSearchCodeStatus', () => {
    component.onSearchCodeStatus('active');
  });
  xit('should call onSearchTeams', () => {
    component.advanceSearchModel.teamsList = [{
    expanded: true,
    disabled: true,
    visible: true,
    target: 'test',
    separator: true,
    badge: 'badge',
    id: '12'
  }
    ];
    AdvanceSearchUtilityService.searchTeams('pricing', component.advanceSearchModel);
    component.onSearchTeams('pricing');
  });
  it('should call onSearchAgreementStatus', () => {
    component.onSearchAgreementStatus('active');
  });
  it('should call onSearchCarrierStatus', () => {
    component.onSearchCarrierStatus('active', 'carrierStatus');
  });
  it('should call getCodeStatusList', () => {
    spyOn(service, 'getCodeStatus').and.returnValue(of(codeStatus));
    component.getCodeStatusList();
  });
  it('should call getCodeStatusList error', () => {
    const err = {
      'traceid' : '343481659c77ad99',
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    };
    spyOn(service, 'getCodeStatus').and.returnValue(of(err));
    component.getCodeStatusList();
  });
  it('should call getAgreementStatusList', () => {
    spyOn(service, 'getCodeStatus').and.returnValue(of(codeStatus));
    component.getAgreementStatusList();
  });
  it('should call getAgreementStatusList error', () => {
    const err = {
      'traceid' : '343481659c77ad99',
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    };
    spyOn(service, 'getCodeStatus').and.returnValue(of(ErrorsModule));
    component.getAgreementStatusList();
  });
  it('should call getCarrierStatusList', () => {
    spyOn(service, 'getCarrierStatus').and.returnValue(of(codeStatus));
    component.getCarrierStatusList('carrier');
  });
  it('should call getCarrierStatusList error', () => {
    const err = {
      'traceid' : '343481659c77ad99',
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    };
    spyOn(service, 'getCodeStatus').and.returnValue(of(ErrorsModule));
    component.getCarrierStatusList('carrier');
  });
  it('should call getAgreementTypeList', () => {
    spyOn(service, 'getAgreementType').and.returnValue(of(agreementType));
    component.getAgreementTypeList();
  });
  it('should call getAgreementTypeList error', () => {
    const err = {
      'error': {
      'traceid' : '343481659c77ad99',
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    },
    'status': 500
    };
    spyOn(service, 'getAgreementType').and.returnValue(throwError(err));
    component.getAgreementTypeList();
  });
  it('should call onChangeSearchFields', () => {
    component.onChangeSearchFields();
  });
  it('should call onClearValue', () => {
    component.onClearValue('', 'agreement');
  });
  it('should call onClearAgreementType', () => {
    component.onClearAgreementType('');
  });
  it('should call onSearchAgreementName', () => {
    spyOn(shared, 'on').and.returnValue(of(agreementDetails));
    component.onSearchAgreementName('The Home Depot Inc (HDAT)');
  });
  it('should call formatAgreementName', () => {
    component.formatAgreementName(resultSet);
  });
  it('should call onSearchContract', () => {
    spyOn(service, 'getSearchResults').and.returnValue(of(contractDetails));
    component.onSearchContract('contract');
  });
  it('should call onSearchContract', () => {
    spyOn(service, 'getSearchResults').and.returnValue(of(contractDetails));
    component.onSearchContract('contract-list');
  });
  it('should call formatContract', () => {
    component.formatContract(contractResultset);
  });
  it('should call onSearchBillTo', () => {
    spyOn(service, 'getSearchResults').and.returnValue(of(billToDetails));
    component.onSearchBillTo('billto');
  });
  it('should call formatBillTo', () => {
    component.formatBillTo(billToResultSet);
  });
  it('should call onSearchTeamsList', () => {
    spyOn(service, 'getSearchResults').and.returnValue(of(teamsDetail));
    component.onSearchTeamsList();
  });
  it('should call formatTeams', () => {
    component.formatTeams(teamsResultSet);
  });
  it('should call fieldValidation', () => {
    AdvanceSearchUtilityService.getAbstractControl('', component.advanceSearchModel);
    AdvanceSearchUtilityService.checkValidation('agreementType', component.advanceSearchModel, false, true);
    component.fieldValidation('agreementType', true);
  });
  it('should call fieldValidation else', () => {
    AdvanceSearchUtilityService.validateForm('agreementType', component.advanceSearchModel, true);
    AdvanceSearchUtilityService.getAbstractControl('agreementType', component.advanceSearchModel);
    AdvanceSearchUtilityService.checkValidation('agreementType', component.advanceSearchModel, false, true);
    component.fieldValidation('agreementType', false);
  });
  xit('should call onChangeAgreementType', () => {
    component.onChangeAgreementType('carrier');
  });
  it('should call onSearchCarrierAgreementName', () => {
    spyOn(service, 'getCarrierSearchResults').and.returnValue(of(carrierAgreementName));
    component.onSearchCarrierAgreementName('carrierAgreement');
  });
  it('should call formatCarrierAgreementName', () => {
    component.formatCarrierAgreementName(carrierAgreementResultSet);
  });
  it('should call onSearchCarrier', () => {
    spyOn(service, 'getCarrierSearchResults').and.returnValue(of(carrierName));
    component.onSearchCarrier('carrier');
  });
  it('should call formatCarrierName', () => {
    component.formatCarrierName(carrierNameResultSet);
  });
  it('should call onSelectCarrier', () => {
    component.onSelectCarrier('carrier');
  });
  it('should call resetMandatoryFields', () => {
    component.resetMandatoryFields();
  });
});
