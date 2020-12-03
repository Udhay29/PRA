import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { of, throwError } from 'rxjs';
import { ContractsService } from './service/contracts.service';

import { ViewAgreementDetailsModule } from '../view-agreement-details.module';
import { AppModule } from './../../../app.module';
import { ContractsComponent } from './contracts.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContractListService } from './service/contract-list.service';

describe('ContractsComponent', () => {
  let component: ContractsComponent;
  let fixture: ComponentFixture<ContractsComponent>;
  let listservice: ContractListService;

  const query = {
    '_source': [
       'AgreementID',
       'ContractID',
       'ContractRanges'
    ],
    'script_fields': {
       'Status': {
          'script': {
             'lang': 'painless',
             'source': 'def x = [];def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();'
          }
       }
    },
    'query': {
       'bool': {
          'must': [
             {
                'query_string': {
                   'default_field': 'AgreementID.keyword',
                   'query': 61
                }
             },
             {
                'nested': {
                   'path': 'ContractRanges',
                   'query': {
                      'bool': {
                         'must': [
                            {
                               'bool': {
                                  'should': [
                                     {
                                        'query_string': {
                                           'fields': [
                                              'ContractRanges.ContractTypeName',
                                              'ContractRanges.ContractNumber',
                                              'ContractRanges.ContractName',
                                              'ContractRanges.ContractEffectiveDate.text',
                                              'ContractRanges.ContractExpirationDate.text',
                                              'ContractRanges.ContractComment'
                                           ],
                                           'query': 'a*',
                                           'default_operator': 'and'
                                        }
                                     }
                                  ]
                               }
                            },
                            {
                               'bool': {
                                  'should': []
                               }
                            },
                            {
                               'bool': {
                                  'should': []
                               }
                            },
                            {
                               'bool': {
                                  'should': []
                               }
                            },
                            {
                               'bool': {
                                  'must': []
                               }
                            },
                            {
                               'bool': {
                                  'should': [
                                     {
                                        'script': {
                                           'script': 'def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();'
                                        }
                                     }
                                  ]
                               }
                            },
                            {
                               'bool': {
                                  'should': []
                               }
                            },
                            {
                               'bool': {
                                  'must': []
                               }
                            },
                            {
                               'bool': {
                                  'should': []
                               }
                            },
                            {
                               'bool': {
                                  'should': []
                               }
                            }
                         ]
                      }
                   }
                }
             },
             {
                'bool': {
                   'must': []
                }
             },
             {
                'bool': {
                   'must': []
                }
             }
          ]
       }
    },
    'collapse': {
       'field': 'ContractRanges.ContractName.keyword'
    },
    'from': 0,
    'size': 25,
    'aggs': {
       'nesting': {
          'nested': {
             'path': 'ContractRanges'
          },
          'aggs': {
             'count': {
                'cardinality': {
                   'field': 'ContractRanges.ContractName.keyword'
                }
             }
          }
       }
    },
    'sort': [{
      '_script': {
        'script': {
          'lang': 'painless',
          'source': 'Legal'
        },
        'order': 'asc',
        'type': 'string'
      }
    }
    ]
 };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsComponent);
    listservice = TestBed.get(ContractListService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call onClickCreateContract', () => {
    component.contractsModel.isFilterEnabled = true;
    component.onClickCreateContract();
  });
  it('should call closeClick', () => {
    const eve: any = 'close';
    component.closeClick(eve);
  });
  it('should call closeClickOnCreate', () => {
    const eve: any = 'close';
    component.closeClickOnCreate(eve);
  });
  it('should call getMockJson', () => {
    const res = {
      'sourceData': 'def x = [];def sfn = new SimpleDateFormat("yyyy/MM/dd");',
      'script': {
        'active': 'def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();',
        'inactive': 'def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();',
        'deleted': '(doc["ContractRanges.ContractInvalidIndicator.keyword"].value == "y")',
        'status': 'def x = [];def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();'
      }
    };
    spyOn(listservice, 'getMockJson').and.returnValue(of(res));
    component.getMockJson();
  });
  it('should call getGridValues', () => {
    ContractsService.setElasticparam(query);
    const eve: any = {target: {value: 'a'}};
    component.getGridValues(eve);
  });
  it('should call getGridValues avtive', () => {
    ContractsService.setElasticparam(query);
    component.contractsModel.sourceData = {
      'sourceData': 'def x = [];def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();',
      'script': {
         'script1': 'def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();',
         'script2': 'def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();',
         'script3': '(doc["ContractRanges.ContractInvalidIndicator.keyword"].value == "y")'
      }
   };
    const eve: any = {target: {value: 'active'}};
    component.getGridValues(eve);
  });
  it('should call frameDateSearchQuery', () => {
    ContractsService.setElasticparam(query);
    const eve: any = [
      {
         'query_string': {
            'fields': [
               'ContractRanges.ContractTypeName',
               'ContractRanges.ContractNumber',
               'ContractRanges.ContractName',
               'ContractRanges.ContractEffectiveDate.text',
               'ContractRanges.ContractExpirationDate.text',
               'ContractRanges.ContractComment'
            ],
            'query': '03\\/07\\/2019*',
            'default_operator': 'and'
         }
      }
   ];
    component.frameDateSearchQuery('03/07/2019', eve);
  });
  it('should call getContractsListData', () => {
    ContractsService.setElasticparam(query);
    const res = {
      'took': 19,
      'timed_out': false,
      '_shards': {
         'total': 3,
         'successful': 3,
         'skipped': 0,
         'failed': 0
      },
      'hits': {
         'total': 43,
         'max_score': null,
         'hits': [
            {
               '_index': 'pricing-agreement-1-2019.07.01',
               '_type': 'doc',
               '_id': '48861020',
               '_score': null,
               '_source': {
                  'AgreementID': 48,
                  'ContractID': 86,
                  'ContractRanges': [
                     {
                        'ContractComment': null,
                        'ContractNumber': '123rest',
                        'contractDisplayName': '123rest (test)',
                        'LastUpdateProgram': 'Process ID',
                        'CreateUser': 'rcon951',
                        'ContractExpirationDate': '2099-12-31',
                        'ContractInvalidReasonType': 'Active',
                        'ContractVersionID': 86,
                        'ContractInvalidIndicator': 'N',
                        'LastUpdateTimestamp': '2019-05-28T11:52:05.698',
                        'ContractName': 'test',
                        'LastUpdateUser': 'rcon951',
                        'ContractEffectiveDate': '2019-05-28',
                        'ContractTypeName': 'Legal',
                        'CreateProgram': 'Process ID',
                        'CreateTimestamp': '2019-05-28T11:52:05.698'
                     }
                  ]
               },
               'fields': {
                  'Status': [
                     'Active'
                  ],
                  'ContractRanges.ContractName.keyword': [
                     'test'
                  ]
               },
               'sort': [
                  'legal',
                  '123rest',
                  'test'
               ]
            },
            {
               '_index': 'pricing-agreement-1-2019.07.01',
               '_type': 'doc',
               '_id': '486931023',
               '_score': null,
               '_source': {
                  'AgreementID': 48,
                  'ContractID': 693,
                  'ContractRanges': [
                     {
                        'ContractComment': '1094',
                        'ContractNumber': 'AutoContractCrct',
                        'contractDisplayName': 'AutoContractCrct (Testing)',
                        'LastUpdateProgram': 'Process ID',
                        'CreateUser': 'jisahi1',
                        'ContractExpirationDate': '2020-06-14',
                        'ContractInvalidReasonType': 'Active',
                        'ContractVersionID': 693,
                        'ContractInvalidIndicator': 'N',
                        'LastUpdateTimestamp': '2019-06-14T05:38:01.218',
                        'ContractName': 'Testing',
                        'LastUpdateUser': 'jisahi1',
                        'ContractEffectiveDate': '2019-06-14',
                        'ContractTypeName': 'Legal',
                        'CreateProgram': 'Process ID',
                        'CreateTimestamp': '2019-06-14T05:38:01.218'
                     }
                  ]
               },
               'fields': {
                  'Status': [
                     'Active'
                  ],
                  'ContractRanges.ContractName.keyword': [
                     'testing'
                  ]
               },
               'sort': [
                  'legal',
                  'autocontractcrct',
                  'testing'
               ]
            },
            {
               '_index': 'pricing-agreement-1-2019.07.01',
               '_type': 'doc',
               '_id': '48694',
               '_score': null,
               '_source': {
                  'AgreementID': 48,
                  'ContractID': 694,
                  'ContractRanges': [
                     {
                        'ContractComment': '94C',
                        'ContractNumber': 'LineHaulEditCrct',
                        'contractDisplayName': 'LineHaulEditCrct (Atest)',
                        'LastUpdateProgram': 'Process ID',
                        'CreateUser': 'jisahi1',
                        'ContractExpirationDate': '2019-08-14',
                        'ContractInvalidReasonType': 'Active',
                        'ContractVersionID': 694,
                        'ContractInvalidIndicator': 'N',
                        'LastUpdateTimestamp': '2019-06-14T05:50:03.513',
                        'ContractName': 'Atest',
                        'LastUpdateUser': 'jisahi1',
                        'ContractEffectiveDate': '2019-06-14',
                        'ContractTypeName': 'Legal',
                        'CreateProgram': 'Process ID',
                        'CreateTimestamp': '2019-06-14T05:50:03.513'
                     }
                  ]
               },
               'fields': {
                  'Status': [
                     'Active'
                  ],
                  'ContractRanges.ContractName.keyword': [
                     'atest'
                  ]
               },
               'sort': [
                  'legal',
                  'linehauleditcrct',
                  'atest'
               ]
            },
            {
               '_index': 'pricing-agreement-1-2019.07.01',
               '_type': 'doc',
               '_id': '481475',
               '_score': null,
               '_source': {
                  'AgreementID': 48,
                  'ContractID': 1475,
                  'ContractRanges': [
                     {
                        'ContractComment': 'test',
                        'ContractNumber': 'test9090',
                        'contractDisplayName': 'test9090 (test abc)',
                        'LastUpdateProgram': 'Process ID',
                        'CreateUser': 'jisapb0',
                        'ContractExpirationDate': '2019-07-15',
                        'ContractInvalidReasonType': 'Active',
                        'ContractVersionID': 1475,
                        'ContractInvalidIndicator': 'N',
                        'LastUpdateTimestamp': '2019-07-02T06:58:23.761',
                        'ContractName': 'test abc',
                        'LastUpdateUser': 'jisapb0',
                        'ContractEffectiveDate': '2019-07-14',
                        'ContractTypeName': 'Legal',
                        'CreateProgram': 'Process ID',
                        'CreateTimestamp': '2019-07-02T06:58:23.761'
                     }
                  ]
               },
               'fields': {
                  'Status': [
                     'Active'
                  ],
                  'ContractRanges.ContractName.keyword': [
                     'test abc'
                  ]
               },
               'sort': [
                  'legal',
                  'test9090',
                  'test abc'
               ]
            }
         ]
      },
      'aggregations': {
         'nesting': {
            'doc_count': 43,
            'count': {
               'value': 4
            }
         }
      }
   };
   spyOn(listservice, 'getContractList').and.returnValue(of(res));
    component.getContractsListData();
  });
  it('should call getContractsListData err', () => {
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
    spyOn(listservice, 'getContractList').and.returnValue(throwError(err));
    component.getContractsListData();
  });
  it('should call formatListData', () => {
    const resultSetData = {
      ContractComment: 'test',
      ContractNumber: 'test',
      LastUpdateProgram: 'test',
      CreateUser: 'test',
      ContractExpirationDate: '2018-08-09',
      ContractInvalidReasonType: 'test',
      ContractVersionID: 12,
      ContractInvalidIndicator: 'test',
      LastUpdateTimestamp: 'test',
      ContractName: 'test',
      LastUpdateUser: 'test',
      ContractEffectiveDate: '2018-08-09',
      ContractTypeName: 'test',
      CreateProgram: 'test',
      CreateTimestamp: 'test'
    };
    component.formatListData(resultSetData);
  });
  it('should call loadGridData', () => {
    const eve: any = {first: 0, rows: 25};
    component.contractsModel.contractList = [{
      fields: {
        Status: ['test'],
        ContractRanges: ['test']
      },
      sort: ['test']
    }];
    ContractsService.setElasticparam(query);
    component.loadGridData(eve);
  });
  it('should call sortGridData', () => {
    const eve: any = {first: 0, rows: 25, sortField: 'Contract', sortOrder: 1, sort: [
      {
         'ContractRanges.ContractTypeName.aux': {
            'order': 'asc',
            'missing': '_first',
            'nested_path': 'ContractRanges'
         }
      }]};
    ContractsService.setElasticparam(query);
    component.sortGridData(query, eve);
  });
  it('should call onFilterClick', () => {
    component.contractsModel.showCreateContracts = false;
    component.onFilterClick();
  });
  it('should call onRowSelect', () => {
    const eve: any = {
      data: {
        AgreementID: 48,
        ContractComment: '--',
        ContractEffectiveDate: '05/28/2019',
        ContractExpirationDate: '12/31/2099',
        ContractID: 86,
        ContractInvalidIndicator: 'N',
        ContractInvalidReasonType: 'Active',
        ContractName: 'test',
        ContractNumber: '123rest',
        ContractTypeName: 'Legal',
        ContractVersionID: 86,
        CreateProgram: 'Process ID',
        CreateTimestamp: '2019-05-28T11:52:05.698',
        CreateUser: 'rcon951',
        LastUpdateProgram: 'Process ID',
        LastUpdateTimestamp: '2019-05-28T11:52:05.698',
        LastUpdateUser: 'rcon951',
        Status: 'Active',
        contractDisplayName: '123rest (test)'
      },
      type: 'row'
  };
    component.onRowSelect(eve);
  });
  it('should call showRowData', () => {
    const eve: any = {
      data: {
        AgreementID: 48,
        ContractComment: '--',
        ContractEffectiveDate: '05/28/2019',
        ContractExpirationDate: '12/31/2099',
        ContractID: 86,
        ContractInvalidIndicator: 'N',
        ContractInvalidReasonType: 'Active',
        ContractName: 'test',
        ContractNumber: '123rest',
        ContractTypeName: 'Legal',
        ContractVersionID: 86,
        CreateProgram: 'Process ID',
        CreateTimestamp: '2019-05-28T11:52:05.698',
        CreateUser: 'rcon951',
        LastUpdateProgram: 'Process ID',
        LastUpdateTimestamp: '2019-05-28T11:52:05.698',
        LastUpdateUser: 'rcon951',
        Status: 'Active',
        contractDisplayName: '123rest (test)'
      },
      type: 'row'
  };
  component.showRowData(eve);
  });
  it('should call loader', () => {
    component.loader(true);
  });
  it('should call toastMessage', () => {
    component.toastMessage('error', 'error');
  });
  it('should call filterGridData', () => {
    component.filterGridData();
  });
  it('should call checkIfContractFormIsTouched', () => {
    component.checkIfContractFormIsTouched(false);
  });
  it('should call setFilterFlags', () => {
    component.setFilterFlags();
  });
  xit('should call onClickPopupYes', () => {
    const childForm = fixture.componentInstance.contractItemRef;  // get the form instance through the component.
    childForm.contractItemModel.contractForm.reset();
    component.contractsModel.isSearchWithCreate = true;
    component.onClickPopupYes();
  });
  xit('should call onClickPopupYes else', () => {
    const childForm = fixture.componentInstance.contractItemRef;  // get the form instance through the component.
    childForm.contractItemModel.contractForm.reset();
    component.contractsModel.isSearchWithCreate = false;
    component.onClickPopupYes();
  });
  it('should call onClickPopupNo', () => {
    component.onClickPopupNo();
  });
});
