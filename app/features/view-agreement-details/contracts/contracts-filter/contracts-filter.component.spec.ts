import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { AppModule } from './../../../../app.module';

import { ContractsService } from '../service/contracts.service';
import { ContractsFilterComponent } from './contracts-filter.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContractsFilterService } from './services/contracts-filter.service';

describe('ContractsFilterComponent', () => {
  let component: ContractsFilterComponent;
  let fixture: ComponentFixture<ContractsFilterComponent>;
  let service: ContractsFilterService;

  const query1 = [
    {
      'range': {
        'ContractRanges.ContractEffectiveDate': {
            'lte': '2019-06-14',
            'gte': '2019-06-18'
        }
      }
  },
  {
      'range': {
        'ContractRanges.ContractExpirationDate': {
            'gte': '2019-06-19',
            'lte': '2019-06-20'
        }
      }
  }
];
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
             'source': 'def x = [];def sfn = new SimpleDateFormat(\'yyyy/MM/dd\');def today = new Date();'
          }
       }
    },
    'query': {
       'bool': {
          'must': [
             {
                'query_string': {
                   'default_field': 'AgreementID.keyword',
                   'query': 1091
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
                                           'query': '*',
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
                                  'must': query1
                               }
                            },
                            {
                               'bool': {
                                  'should': [
                                     {
                                        'script': {
                                           'script': 'def sfn = new SimpleDateFormat(\'yyyy/MM/dd\');def today = new Date();'
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
    'sort': [
       {
          'ContractRanges.ContractTypeName.aux': {
             'order': 'asc',
             'missing': '_first',
             'nested_path': 'ContractRanges'
          }
       },
       {
          'ContractRanges.ContractNumber.aux': {
             'order': 'asc',
             'missing': '_first',
             'nested_path': 'ContractRanges'
          }
       },
       {
          'ContractRanges.ContractName.aux': {
             'order': 'asc',
             'missing': '_first',
             'nested_path': 'ContractRanges'
          }
       }
    ]
 };


  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, ContractsService, ContractsFilterService]
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsFilterComponent);
    service = TestBed.get(ContractsFilterService);
    component = fixture.componentInstance;
    ContractsService.getElasticparam();
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call dateQueryFormation', () => {
    const dataparam = {
      dateName: 'effDateExactMatch',
      dateOnly: 'effDateOnlyFlag',
      exactMatch: 'effDateExactMatchFlag',
      index: 4,
      keyName: 'ContractRanges.ContractEffectiveDate',
      keyName1: 'ContractRanges.ContractExpirationDate',
      level: 'lte',
      pointer: 0
    };
    const boolList = query['query']['bool']['must'][1]['nested']['query']['bool']['must'][4]['bool'];
    component.dateQueryFormation(dataparam, boolList);
  });
  it('should call setQueryRange', () => {
    const dataparam = {
      dateName: 'effDateExactMatch',
      dateOnly: 'effDateOnlyFlag',
      exactMatch: 'effDateExactMatchFlag',
      index: 4,
      keyName: 'ContractRanges.ContractEffectiveDate',
      keyName1: 'ContractRanges.ContractExpirationDate',
      level: 'lte',
      pointer: 0
    };
    const boolList = query['query']['bool']['must'][1]['nested']['query']['bool']['must'][4]['bool'];
    component.setQueryRange(dataparam, boolList);
  });
  it('should call originDateClear', () => {
    ContractsService.setElasticparam(query);
    component.originDateClear('OriginalEffectiveDate', 'OriginalExpirationDate', 'originalExpDateExactMatch', 3);
  });
  it('should call onCreateDate', () => {
    ContractsService.setElasticparam(query);
    component.onCreateDate(3);
  });
  it('should call onCreateDate if', () => {
    ContractsService.setElasticparam(query);
    component.filterModel.createdOnDate = 'Wed Jul 24 2019 00:00:00 GMT+0530 (India Standard Time)';
    component.filterModel.createdOnTime = 'Wed Jul 24 2019 04:30:00 GMT+0530 (India Standard Time)';
    component.onCreateDate(3);
  });
  it('should call onCreateTime', () => {
    ContractsService.setElasticparam(query);
    component.onCreateTime(3);
  });
  it('should call onCreateTime if', () => {
    ContractsService.setElasticparam(query);
    component.filterModel.createdOnDate = 'Wed Jul 24 2019 00:00:00 GMT+0530 (India Standard Time)';
    component.filterModel.createdOnTime = 'Wed Jul 24 2019 04:30:00 GMT+0530 (India Standard Time)';
    component.onCreateTime(3);
  });
  it('should call onLastUpdateDate', () => {
    ContractsService.setElasticparam(query);
    component.onLastUpdateDate(3);
  });
  it('should call onLastUpdateDate if', () => {
    ContractsService.setElasticparam(query);
    component.filterModel.updatedOnDate = 'Wed Jul 24 2019 00:00:00 GMT+0530 (India Standard Time)';
    component.filterModel.updatedOnTime = 'Wed Jul 24 2019 04:30:00 GMT+0530 (India Standard Time)';
    component.onLastUpdateDate(3);
  });
  it('should call onLastUpdateTime', () => {
    ContractsService.setElasticparam(query);
    component.onLastUpdateTime(3);
  });
  it('should call onLastUpdateTime if', () => {
    ContractsService.setElasticparam(query);
    component.filterModel.updatedOnDate = 'Wed Jul 24 2019 00:00:00 GMT+0530 (India Standard Time)';
    component.filterModel.updatedOnTime = 'Wed Jul 24 2019 04:30:00 GMT+0530 (India Standard Time)';
    component.onLastUpdateTime(3);
  });
  it('should call onSelectDate', () => {
    ContractsService.setElasticparam(query);
    component.onSelectDate('onCreateDate', 10);
  });
  it('should call resetRadio', () => {
    component.resetRadio('expDateRdio', 'expDateOnlyFlag', 'expDate', 'expDateExactMatchFlag');
  });
  it('should call onClearAllFilters', () => {
    component.filterModel.sourceData = {
      agreementID: 1091,
      script: {
        active: 'def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();',
        deleted: '(doc["ContractRanges.ContractInvalidIndicator.keyword"].value == "y") ',
        inactive: 'def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();',
        status: 'def x = [];def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();'
      }
    };
    ContractsService.setElasticparam(query);
    component.onClearAllFilters();
  });
  it('should call resetEvent', () => {
    component.filterModel.sourceData = {
      agreementID: 1091,
      script: {
        active: 'def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();',
        deleted: '(doc["ContractRanges.ContractInvalidIndicator.keyword"].value == "y") ',
        inactive: 'def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();',
        status: 'def x = [];def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();'
      }
    };
    ContractsService.setElasticparam(query);
    component.resetEvent(true);
  });
  it('should call resetEvent else', () => {
    ContractsService.setElasticparam(query);
    component.resetEvent(false);
  });
  it('should call resetStatus', () => {
    component.resetStatus();
  });
  it('should call isStatusCollapsed', () => {
    component.isStatusCollapsed(true);
  });
  it('should call isStatusCollapsed else', () => {
    component.isStatusCollapsed(false);
  });
  it('should call clearDate', () => {
    ContractsService.setElasticparam(query);
    component.clearDate('expStartDate', 'expEndDate', 12, 'expDateExactMatch');
  });
  it('should call statusFramer', () => {
    const arr = ['test', 'test'];
    component.statusFramer(arr);
  });
  it('should call dateRadioToggle', () => {
    ContractsService.setElasticparam(query);
    component.dateRadioToggle(true, 'expDateOnlyFlag', 'expStartDate', 'expEndDate', 'expDateExactMatch', 12);
  });
  it('should call afterPanelToggle', () => {
    component.afterPanelToggle(true, 'Effective');
  });
  it('should call onDateRangeBlur', () => {
    const dataparam = {
      dateName: 'effDateExactMatch',
      dateOnly: 'effDateOnlyFlag',
      exactMatch: 'effDateExactMatchFlag',
      index: 4,
      keyName: 'ContractRanges.ContractEffectiveDate',
      keyName1: 'ContractRanges.ContractExpirationDate',
      level: 'lte',
      pointer: 0
    };
    component.filterModel.effDateExactMatch = 'Mon Jun 17 2019 00:00:00 GMT+0530 (India Standard Time)';
    ContractsService.setElasticparam(query);
    component.onDateRangeBlur(dataparam);
  });
  it('should call onClearDateCheck', () => {
    const dataparam = {
      dateName: 'OriginExpirationDate',
      dateOnly: 'effDateOnlyFlag',
      exactMatch: 'effDateExactMatchFlag',
      index: 4,
      keyName: 'ContractRanges.ContractEffectiveDate',
      keyName1: 'ContractRanges.ContractExpirationDate',
      level: 'lte',
      pointer: 0
    };
    component.filterModel.originalEffDateExactMatchFlag = false;
    ContractsService.setElasticparam(query);
    const boolList = query['query']['bool']['must'][1]['nested']['query']['bool']['must'][4]['bool'];
    component.onClearDateCheck(dataparam, boolList, query);
  });
  it('should call matchExactDate', () => {
    const dataparam = {
      dateName: 'effDateExactMatch',
      dateOnly: 'effDateOnlyFlag',
      exactMatch: 'effDateExactMatchFlag',
      index: 4,
      keyName: 'ContractRanges.ContractEffectiveDate',
      keyName1: 'ContractRanges.ContractExpirationDate',
      level: 'lte',
      pointer: 0
    };
    const eve: any = true;
    ContractsService.setElasticparam(query);
    component.matchExactDate(eve, dataparam);
  });
  it('should call nestedQueryFormation startDate', () => {
    ContractsService.setElasticparam(query);
    component.filterModel.endDate = '';
    query['query']['bool']['must'][1]['nested']['query']['bool']['must'][4]['bool'] = {
      'must': [{
        'range': {
          'ContractRanges.ContractEffectiveDate': {
              'lte': '2019-06-14',
              'gte': '2019-06-18'
          }
        }
    },
    {
        'range': {
          'ContractRanges.ContractExpirationDate': {
              'gte': '2019-06-19',
              'lte': '2019-06-20'
          }
        }
    }]
    };
    const boolList = query['query']['bool']['must'][1]['nested']['query']['bool']['must'][4]['bool'];
    component.nestedQueryFormation('startDate', boolList);
  });
  it('should call nestedQueryFormation endDate', () => {
    ContractsService.setElasticparam(query);
    component.filterModel.startDate = '';
    query['query']['bool']['must'][1]['nested']['query']['bool']['must'][4]['bool'] = {
      'must': [{
        'range': {
          'ContractRanges.ContractEffectiveDate': {
              'lte': '2019-06-14',
              'gte': '2019-06-18'
          }
        }
    },
    {
        'range': {
          'ContractRanges.ContractExpirationDate': {
              'gte': '2019-06-19',
              'lte': '2019-06-20'
          }
        }
    }]
    };
    const boolList = query['query']['bool']['must'][1]['nested']['query']['bool']['must'][4]['bool'];
    component.nestedQueryFormation('endDate', boolList);
  });
  it('should call onClearNestedQueryFormation startDate', () => {
    ContractsService.setElasticparam(query);
    this.query1 = [
      {
        'range': {
            'ContractRanges.ContractEffectiveDate': {
              'gte': '2019-06-14'
            }
        }
      }
    ];
    query['query']['bool']['must'][1]['nested']['query']['bool']['must'][4]['bool'] = {
      'must': this.query1
    };
    const boolList = query['query']['bool']['must'][1]['nested']['query']['bool']['must'][4]['bool'];
    component.filterModel.endDate = '07/07/2018';
    component.onClearNestedQueryFormation('startDate', boolList);
  });
  it('should call onClearNestedQueryFormation endDate', () => {
    ContractsService.setElasticparam(query);
    this.query1 = [
      {
        'range': {
            'ContractRanges.ContractEffectiveDate': {
              'gte': '2019-06-14'
            }
        }
      }
    ];
    query['query']['bool']['must'][1]['nested']['query']['bool']['must'][4]['bool'] = {
      'must': this.query1
    };
    const boolList = query['query']['bool']['must'][1]['nested']['query']['bool']['must'][4]['bool'];
    component.filterModel.endDate = '07/07/2018';
    component.onClearNestedQueryFormation('startDate', boolList);
  });
  it('should call onDateRangeSelect', () => {
    const dataparam = {
      dateName: 'effDateExactMatch',
      dateOnly: 'effDateOnlyFlag',
      exactMatch: 'effDateExactMatchFlag',
      index: 4,
      keyName: 'ContractRanges.ContractEffectiveDate',
      keyName1: 'ContractRanges.ContractExpirationDate',
      level: 'lte',
      pointer: 0
    };
    component.onDateRangeSelect(dataparam);
  });
  xit('should call onListingItemsSelected', () => {
    ContractsService.setElasticparam(query);
    const eve: any = {
      label: 'test',
      value: 'test'
    };
    component.filterModel.sourceData = {
      script: {
        label: 'test',
        value: 'test'
      }
    };
    component.filterModel.sourceData['script']['label'].toLowerCase();
    query['query']['bool']['must'][1]['nested']['query']['bool']['must'][5]['bool']['should'] = eve;
    component.onListingItemsSelected(eve, 'status', 5);
  });
});
