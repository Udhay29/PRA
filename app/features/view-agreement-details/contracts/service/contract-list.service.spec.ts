import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { AppModule } from './../../../../app.module';
import { ContractListService } from './contract-list.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContractListService', () => {
  let service: ContractListService;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [ContractListService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });
  beforeEach(() => {
    service = TestBed.get(ContractListService);
  });
  it('should call getContractList', () => {
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
    service.getContractList(query);
  });
  it('should call getMockJson', () => {
    service.getMockJson();
  });
});
