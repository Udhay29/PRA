
import { SectionListComponent } from './sections.component';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { ViewAgreementDetailsModule } from '../view-agreement-details.module';
import { AppModule } from '../../../app.module';
import { SectionListService } from './service/section-list.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { of, throwError } from 'rxjs';
import { SectionsModel } from './model/sections.model';
import { SectionsService } from './service/sections.service';
describe('SectionListComponent', () => {
  let component: SectionListComponent;
  let fixture: ComponentFixture<SectionListComponent>;
  let service: SectionListService;
  let shared: BroadcasterService;
  let http: HttpClient;
  let toastMessage: MessageService;
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
  const query = {

    'from': 0,
    'size': 2500,
    '_source': [
      '*',
      'SectionRanges.SectionName',
      'SectionRanges.SectionTypeName',
      'SectionRanges.SectionCurrencyCode',
      'SectionRanges.SectionEffectiveDate',
      'SectionRanges.SectionExpirationDate',
      'SectionRanges.BillToCodes',
      'AgreementID',
      'ContractRanges.ContractNumber',
      'SectionRanges.*',
      'SectionID',
      'ContractID',
      'ContractRanges.ContractName',
      'ContractRanges.ContractTypeName',
      'ContractRanges.contractDisplayName'
    ],
    'sort': [
      {
        'SectionRanges.SectionName.aux': {
          'order': 'asc',
          'nested': {
            'path': 'SectionRanges'
          },
          'mode': 'min'
        }
      },
      {
        'ContractRanges.contractDisplayName.key': {
          'order': 'asc',
          'nested': {
            'path': 'ContractRanges'
          },
          'mode': 'min'
        }
      }
    ],
    'query': {
      'bool': {
        'must': [
          {
            'query_string': {
              'default_field': 'AgreementID.keyword',
              'query': 46,
              'default_operator': 'AND'
            }
          },
          {
            'bool': {
              'should': [
                {
                  'nested': {
                    'path': 'SectionRanges',
                    'query': {
                      'bool': {
                        'must': [
                          {
                            'bool': {
                              'should': [
                                {
                                  'bool': {
                                    'must': [
                                      {
                                        'query_string': {
                                          'default_field': 'SectionRanges.SectionInvalidReasonType',
                                          'query': 'Active'
                                        }
                                      },
                                      {
                                        'query_string': {
                                          'default_field': 'SectionRanges.SectionInvalidIndicator',
                                          'query': 'N'
                                        }
                                      },
                                      {
                                        'range': {
                                          'SectionRanges.SectionExpirationDate': {
                                            'gte': 'now/d'
                                          }
                                        }
                                      }
                                    ]
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
                                    'fields': [
                                      'SectionRanges.SectionName',
                                      'SectionRanges.SectionTypeName',
                                      'SectionRanges.SectionCurrencyCode',
                                      'SectionRanges.contractDisplayName',
                                      'SectionRanges.BillToCodes.billingPartyDisplayName',
                                      'SectionRanges.CreateProgram',
                                      'SectionRanges.LastUpdateProgram',
                                      'SectionRanges.CreateUser',
                                      'SectionRanges.LastUpdateUser',
                                      'SectionRanges.originalEffectiveDate.keyword',
                                      'SectionRanges.originalExpirationDate.keyword',
                                      'SectionRanges.LastUpdateTimestamp.keyword',
                                      'SectionRanges.CreateTimestamp.keyword'
                                    ],
                                    'query': '*',
                                    'default_operator': 'AND'
                                  }
                                }
                              ]
                            }
                          },
                          {
                            'query_string': {
                              'default_field': 'SectionRanges.SectionName.keyword',
                              'query': '*'
                            }
                          },
                          {
                            'query_string': {
                              'default_field': 'SectionRanges.SectionTypeName.keyword',
                              'query': '*'
                            }
                          },
                          {
                            'query_string': {
                              'default_field': 'SectionRanges.SectionCurrencyCode.keyword',
                              'query': '*'
                            }
                          },
                          {
                            'query_string': {
                              'default_field': 'SectionRanges.contractDisplayName.keyword',
                              'query': '*'
                            }
                          },
                          {
                            'query_string': {
                              'default_field': 'SectionRanges.BillToCodes.billingPartyDisplayName.keyword',
                              'query': '*'
                            }
                          },
                          {
                            'range': {
                              'SectionRanges.SectionExpirationDate': {
                                'gte': '01/01/1995',
                                'lte': '12/31/2099',
                                'format': 'MM/dd/yyyy||yyyy'
                              }
                            }
                          },
                          {
                            'range': {
                              'SectionRanges.SectionEffectiveDate': {
                                'gte': '01/01/1995',
                                'lte': '12/31/2099',
                                'format': 'MM/dd/yyyy||yyyy'
                              }
                            }
                          },
                          {
                            'query_string': {
                              'default_field': 'SectionRanges.LastUpdateUser.keyword',
                              'query': '*'
                            }
                          },
                          {
                            'range': {
                              'SectionRanges.LastUpdateTimestamp': {
                                'lte': '12/31/2099',
                                'gte': '01/01/1995',
                                'format': 'MM/dd/yyyy||yyyy'
                              }
                            }
                          },
                          {
                            'query_string': {
                              'default_field': 'SectionRanges.LastUpdateProgram.keyword',
                              'query': '*'
                            }
                          },
                          {
                            'query_string': {
                              'default_field': 'SectionRanges.CreateUser.keyword',
                              'query': '*'
                            }
                          },
                          {
                            'range': {
                              'SectionRanges.CreateTimestamp': {
                                'lte': '12/31/2099',
                                'gte': '01/01/1995',
                                'format': 'MM/dd/yyyy||yyyy'
                              }
                            }
                          },
                          {
                            'query_string': {
                              'default_field': 'SectionRanges.CreateProgram.keyword',
                              'query': '*'
                            }
                          },
                          {
                            'range': {
                              'SectionRanges.originalExpirationDate': {
                                'lte': '12/31/2099',
                                'gte': '01/01/1995',
                                'format': 'MM/dd/yyyy||yyyy'
                              }
                            }
                          },
                          {
                            'range': {
                              'SectionRanges.originalEffectiveDate': {
                                'lte': '12/31/2099',
                                'gte': '01/01/1995',
                                'format': 'MM/dd/yyyy||yyyy'
                              }
                            }
                          }
                        ]
                      }
                    },
                    'inner_hits': {
                      'sort': {
                        'SectionRanges.SectionName.keyword': {
                          'order': 'asc'
                        }
                      }
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    },
    'script_fields': {
      'Status': {
        'script': {
          'lang': 'painless',
          'source': `def x = [];def now=new Date();
          def sf = new SimpleDateFormat('yyyy-MM-dd');\n\n
          def equateNow=sf.format(now);for(def i = 0;\n\n
            i < params['_source']['SectionRanges'].length; i++)\n
            {def expire=params['_source']['SectionRanges'][i]['SectionExpirationDate'];\n\n
            if((sf.parse(expire).after(now)\n\n  | expire == equateNow)\n\n
             && params['_source']['SectionRanges'][i]['SectionInvalidIndicator']\n\n
              == 'N' && params['_source']['SectionRanges'][i]['SectionInvalidReasonType']\n\n
               == 'Active'){x.add('Active')}else if((sf.parse(expire).before(now)\n\n
                && params['_source']['SectionRanges'][i]['SectionInvalidIndicator'] == 'Y'\n\n
                  && params['_source']['SectionRanges'][i]\n\n
                   ['SectionInvalidReasonType'] == 'InActive')\n\n
                    || (sf.parse(expire).before(now) && params['_source']['SectionRanges'][i]\n\n
                  ['SectionInvalidIndicator'] == 'N'\n\n
                   && params['_source']['SectionRanges'][i]\n\n
                     ['SectionInvalidReasonType'] == 'InActive')\n\n
                      || (sf.parse(expire).before(now) &&\n\n
                      params['_source']['SectionRanges'][i]['SectionInvalidIndicator']\n\n
                        == 'N' && params['_source']['SectionRanges'][i]['SectionInvalidReasonType'] == 'Active'))\n\n
                     {x.add('Inactive')}else if(params['_source']['SectionRanges'][i]\n\n
                     ['SectionInvalidIndicator'] == 'Y' &&\n\n
                      params['_source']['SectionRanges'][i]['SectionInvalidReasonType'] == 'Deleted'){x.add('Deleted')}}return x\n`
        }
      }
    }
  };


  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [SectionListComponent, ChangeDetectorRef, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient, BroadcasterService],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionListComponent);
    service = TestBed.get(SectionListService);
    shared = TestBed.get(BroadcasterService);
    component = fixture.componentInstance;
    http = TestBed.get(HttpClient);
    toastMessage = TestBed.get(MessageService);
    component.sectionsModel = new SectionsModel();
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be created', inject([SectionListComponent], () => {
    expect(service).toBeTruthy();
  }));
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
    spyOn(service, 'getMockJson').and.returnValue(of(res));
    component.getMockJson();
  });

  it('should call closeClick', () => {
    const eve: any = 'close';
    component.closeClick(eve);
  });
  it('should call onCreateSection', () => {
    component.onCreateSection();
  });
  it('should call getGridValues', () => {
    SectionsService.setElasticparam(query);
    const eve: any = { target: { value: 'a' } };
    component.sectionsModel.sectionList = [{
      AgreementID: 1,
      SectionID: 2
    }];
    component.getGridValues(eve);
  });
  it('should call getGridValues date', () => {
    SectionsService.setElasticparam(query);
    const eve: any = { target: { value: '04/04/2019' } };
    component.sectionsModel.sectionList = [{
      AgreementID: 1,
      SectionID: 2
    }];
    component.getGridValues(eve);
  });

  it('should call frameDateSearchQuery', () => {
    SectionsService.setElasticparam(query);
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
  it('should call getSectionsListData', () => {
    SectionsService.setElasticparam(query);
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
            '_index': 'pricing-agreement-1-2019.08.12',
            '_type': 'doc',
            '_id': '1543032036',
            '_score': null,
            '_source': {
              'AgreementType': 'Customer',
              'UltimateParentAccountName': 'Whirlpool Corp Pension Tr',
              'AgreementEffectiveDate': '1995-01-01',
              'AgreementID': 154,
              'SectionOriginalEffectiveDate': '2019-07-05',
              'UltimateParentAccountCode': 'WHBE3',
              'ContractID': 303,
              'ContractOriginalExpirationDate': '2019-07-31',
              'AgreementInvalidIndicator': 'N',
              'AgreementTenantID': 1,
              'UltimateAccountParentID': 142384,
              'SectionOriginalExpirationDate': '2019-07-31',
              'AgreementName': 'Whirlpool Corp Pension Tr (WHBE3)',
              'SectionRanges': [
                {
                  'SectionInvalidReasonType': 'Active',
                  'LastUpdateProgram': 'Swedha Ravi',
                  'SectionVersionID': 2601,
                  'BillToCodes': [
                  ],
                  'SectionTypeName': 'Standard',
                  'SectionExpirationDate': '2019-07-31',
                  'CreateUser': 'jcnt253',
                  'LastUpdateTimestamp': '2019-07-05T05:48:04.133',
                  'LastUpdateUser': 'jcnt253',
                  'SectionEffectiveDate': '2019-07-05',
                  'SectionInvalidIndicator': 'N',
                  'SectionCurrencyCode': 'USD',
                  'SectionName': 'align bill to 1',
                  'CreateProgram': 'Swedha Ravi',
                  'CreateTimestamp': '2019-07-05T05:48:04.133'
                }
              ],
              'ContractOriginalEffectiveDate': '2019-07-01',
              'Teams': [
                {
                  'TeamExpirationDate': '2099-12-31',
                  'TaskAssignmentID': 868,
                  'TeamName': null,
                  'TeamID': null,
                  'TeamEffectiveDate': '2019-07-12'
                },
                {
                  'TeamExpirationDate': '2099-12-31',
                  'TaskAssignmentID': 697,
                  'TeamName': null,
                  'TeamID': null,
                  'TeamEffectiveDate': '2019-07-12'
                }
              ],
              'UniqueDocID': '1543032036',
              'AgreementStatus': 'Completed',
              'ContractRanges': [
                {
                  'ContractComment': null,
                  'ContractNumber': '1982',
                  'contractDisplayName': '1982 (Des1)',
                  'LastUpdateProgram': 'Process ID',
                  'CreateUser': 'jisadk5',
                  'ContractExpirationDate': '2019-07-31',
                  'ContractInvalidReasonType': 'Active',
                  'ContractVersionID': 303,
                  'ContractInvalidIndicator': 'N',
                  'LastUpdateTimestamp': '2019-06-01T09:45:21.102',
                  'ContractName': 'Des1',
                  'LastUpdateUser': 'jisadk5',
                  'ContractEffectiveDate': '2019-07-01',
                  'ContractTypeName': 'Tariff',
                  'CreateProgram': 'Process ID',
                  'CreateTimestamp': '2019-06-01T09:45:21.102'
                }
              ],
              'AgreementExpirationDate': '2099-12-31',
              'SectionID': 2036,
              'AgreementInvalidReasonType': 'Active'
            },
            'fields': {
              'Status': [
                'Inactive'
              ]
            },
            'sort': [
              'align bill to 1',
              '1982 (Des1)'
            ],
            'inner_hits': {
              'SectionRanges': {
                'hits': {
                  'total': 0,
                  'max_score': null,
                  'hits': [
                    {
                      '_index': 'pricing-agreement',
                      '_type': 'doc',
                      '_id': '3402671920',
                      '_nested': {
                        'field': 'SectionRanges',
                        'offset': 0
                      },
                      '_score': null,
                      '_source': {
                        'SectionInvalidReasonType': 'Active',
                        'contractDisplayName': 'Transactional (dhrt7)',
                        'LastUpdateProgram': 'Aarthi Pandian',
                        'SectionVersionID': 1915,
                        'BillToCodes': [
                          {
                            'ContractSectionAccountID': 2516,
                            'BillToExpirationDate': '2019-05-31',
                            'billingPartyDisplayName': 'Sjl Co, Inc (SJPH8)',
                            'BillingPartyID': 25728,
                            'BillToEffectiveDate': '2019-06-01',
                            'BillingPartyName': 'Sjl Co, Inc',
                            'BillingPartyCode': 'SJPH8'
                          }
                        ],
                        'SectionTypeName': 'Standard',
                        'SectionExpirationDate': '2099-01-01',
                        'CreateUser': 'rcon816',
                        'LastUpdateTimestamp': '2019-05-23T14:29:24.863',
                        'LastUpdateUser': 'rcon816',
                        'SectionEffectiveDate': '2019-01-01',
                        'SectionInvalidIndicator': 'N',
                        'SectionCurrencyCode': 'USD',
                        'SectionName': 'sectionName127',
                        'CreateProgram': 'Aarthi Pandian',
                        'CreateTimestamp': '2019-05-23T14:29:24.863'
                      },
                      'sort': [
                        'sectionname127'
                      ]
                    }

                  ]
                }
              },
              'SectionRanges.BillToCodes': {
                'hits': {
                  'total': 0,
                  'max_score': null,
                  'hits': [
                  ]
                }
              },
              'ContractRanges': {
                'hits': {
                  'total': 1,
                  'max_score': null,
                  'hits': [
                    {
                      '_index': 'pricing-agreement-1-2019.08.12',
                      '_type': 'doc',
                      '_id': '1543032036',
                      '_nested': {
                        'field': 'ContractRanges',
                        'offset': 0
                      },
                      '_score': null,
                      '_source': {
                        'ContractVersionID': 303,
                        'ContractTypeName': 'Tariff',
                        'ContractName': 'Des1',
                        'ContractNumber': '1982',
                        'ContractComment': null,
                        'ContractEffectiveDate': '2019-07-01',
                        'ContractExpirationDate': '2019-07-31',
                        'ContractInvalidIndicator': 'N',
                        'ContractInvalidReasonType': 'Active',
                        'CreateUser': 'jisadk5',
                        'CreateProgram': 'Process ID',
                        'CreateTimestamp': '2019-06-01T09:45:21.102',
                        'LastUpdateUser': 'jisadk5',
                        'LastUpdateProgram': 'Process ID',
                        'LastUpdateTimestamp': '2019-06-01T09:45:21.102',
                        'contractDisplayName': '1982 (Des1)'
                      },
                      'sort': [
                        '1982 (des1)'
                      ]
                    }
                  ]
                }
              }
            }
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
    spyOn(SectionListService.prototype, 'getSectionList').and.returnValue(of(res));
    component.getSectionsListData();
  });
  it('should call getSectionsListData err', () => {
    spyOn(SectionListService.prototype, 'getSectionList').and.returnValues(throwError(err));
    component.getSectionsListData();
  });
  it('should call loader', () => {
    component.loader(true);
  });
  it('should call checkOnFocus', () => {
    component.checkOnFocus(true);
  });
  it('should call ToastMessage', () => {
    component.toastMessage('Success', 'You have succefully saved the changes');
  });

  it('should call toastMessage', () => {
    component.toastMessage('error', 'error');
  });
  it('should call checkSearch', () => {
    component.checkSearch();
  });
  it('should call checkOnFocus', () => {
    component.checkOnFocus(true);
  });
  it('should call onFilterClick', () => {
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
  it('should call checkCreateSections', () => {
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
      }
    };
    component.sectionsModel.isShowSectionsCreation = true;
    shared.broadcast('saved', true);
    component.sectionsModel.selectedRowEvent = eve;
    component.checkCreateSections();
  });
  it('should call popupCancel', () => {
    component.popupCancel();
  });
  it('should call splitClose', () => {
    component.splitClose(true);
  });
  it('should call sectionEdit', () => {
    component.sectionEdit(event);
  });
  it('should call  onEditSection(sectionData)', () => {
    const sectionData = {
      'SectionComment': 'test',
      'SectionNumber': 'test',
      'LastUpdateProgram': 'test',
      'CreateUser': 'test',
      'SectionInvalidReasonType': 'test',
      'SectionVersionID': 1,
      'SectionInvalidIndicator': 'test',
      'LastUpdateTimestamp': 'test',
      'LastUpdateUser': 'test',
      'CreateProgram': 'test',
      'CreateTimestamp': 'test',
      'SectionName': 'test',
      'SectionTypeName': 'test',
      'SectionCurrencyCode': 'test',
      'ContractName': 'test',
      'BillingPartyCode': ['test', 'ttt'],
      'Status': 'test',
      'SectionEffectiveDate': '04/04/2019',
      'SectionExpirationDate': '08/04/2019',
      'AgreementID': 3,
      'SectionID': 1,
      'ContractID': 1,
      'ContractNumber': 1,
      'ContractTypeDisplay': 'test',
      'toolTipForBillTo': 'test'
    };
    component.onEditSection(sectionData);
  });
  it('should call loadGridData', () => {
    const eve: any = { first: 0, rows: 25 };
    SectionsService.setElasticparam(query);
    component.loadGridData(eve);
  });
  it('should call sortGridData', () => {
    const eve: any = {
      first: 0, rows: 25, sortField: 'Section', sortOrder: 1, sort: [
        {
          'ContractRanges.ContractTypeName.aux': {
            'order': 'asc',
            'missing': '_first',
            'nested_path': 'ContractRanges'
          }
        }]
    };
    SectionsService.setElasticparam(query);
    component.sortGridData(query, eve);
  });
  it('should call getGridValues active search', () => {
    SectionsService.setElasticparam(query);
    component.sectionsModel.sectionList = [{
      AgreementID: 1,
      SectionID: 2
    }];
    const eve: any = { target: { value: 'active' } };
    component.getGridValues(eve);
  });
  it('should call getGridValues inactive search', () => {
    SectionsService.setElasticparam(query);
    const eve: any = { target: { value: 'inactive' } };
    component.sectionsModel.sectionList = [{
      AgreementID: 1,
      SectionID: 2
    }];
    component.getGridValues(eve);
  });
  it('should call getGridValues deleted search', () => {
    SectionsService.setElasticparam(query);
    const eve: any = { target: { value: 'deleted' } };
    component.sectionsModel.sectionList = [{
      AgreementID: 1,
      SectionID: 2
    }];
    component.getGridValues(eve);
  });

  it('should call loadSectionsValuesLazy', () => {
    const eve: any = {
      'filters': {}, 'first': 0, 'globalFilter': null, 'multiSortMeta': undefined, 'rows': 25, 'sortField': 'Section Name',
      'sortOrder': 1
    };
    component.loadSectionsValuesLazy(eve);
  });
  it('should call loadSectionsValuesLazy if block', () => {
    const eve: any = {
      'filters': {}, 'first': 0, 'globalFilter': null, 'multiSortMeta': undefined, 'rows': 25, 'sortField': '',
      'sortOrder': 1
    };
    component.loadSectionsValuesLazy(eve);
  });

});
