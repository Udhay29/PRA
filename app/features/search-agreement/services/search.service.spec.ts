import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { SearchAgreementModule } from '../search-agreement.module';
import { SearchService } from './search.service';
import { AppModule } from '../../../app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SearchAgreementComponent } from '../search-agreement.component';

describe('SearchService', () => {
  let service: SearchService;
  let component: SearchAgreementComponent;
  let fixture: ComponentFixture<SearchAgreementComponent>;
  const inp = {
    'query': {
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
                      'query': '*'
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
                      'query': 'The Home Depot Inc \\(HDAT\\)',
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
            'field': 'AgreementName.agg'
          }
        }
      },
      'sort': {
        'AgreementName.aux': 'asc'
      },
      'size': 25,
      'from': 0
    },
    'errorMsg': 'Agreement Type: All, Agreement: The Home Depot Inc (HDAT)',
    'carrierFlag': false
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SearchAgreementModule, HttpClientTestingModule],
      providers: [SearchService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAgreementComponent);
    component = fixture.componentInstance;
    service = TestBed.get(SearchService);
 });

  it('should be created', inject([SearchService], (services: SearchService) => {
    expect(services).toBeTruthy();
  }));
  it('should call getResetGrid', () => {
    service.getResetGrid();
  });
  it('should call setResetGrid', () => {
    service.setResetGrid(true);
  });
  it('should call getSearchData', () => {
    service.getSearchData(inp);
  });
  it('should call getCarrierSearchData', () => {
    service.getCarrierSearchData(inp);
  });
  it('should call getElasticData', () => {
    service.getElasticData(inp, component.agreementSearchModel);
  });
  it('should call getCarrierResults', () => {
    const inp1 = {
      'query': {
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
                        'query': '*'
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
                        'query': 'The Home Depot Inc \\(HDAT\\)',
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
              'field': 'AgreementName.agg'
            }
          }
        },
        'sort': {
          'AgreementName.aux': 'asc'
        },
        'size': 25,
        'from': 0
      },
      'errorMsg': 'Agreement Type: All, Agreement: The Home Depot Inc (HDAT)',
      'carrierFlag': true
    };
    service.getCarrierResults(inp1, component.agreementSearchModel);
  });
  it('should call getAgreementResults', () => {
    service.getAgreementResults(inp, component.agreementSearchModel);
  });
  it('should call responseFormat', () => {
    const input = {
      hits: {
        hits: [{
          sort: ['test'],
          _id: '12',
          _index: '2',
          _score: 20,
          _source: {
            AgreementExpirationDate: '07/07/2099',
            AgreementID: 12,
            AgreementInvalidIndicator: 'active',
            AgreementName: 'test',
            AgreementStatus: 'string',
            AgreementType: 'string'
          },
          _type: 'test'
        }],
        max_score: 100,
        total: 100
      },
      timed_out: true,
      took: 12,
      _shards: {
        total: 15,
        successful: 15,
        skipped: 15,
        failed: 15
      },
      aggregations: {
        by_agreement: {
          buckets: [{
            doc_count: 1,
            key: 'string',
            top_sales_hits: {
              hits:  {
                hits: [{
                  sort: ['test'],
                  _id: '12',
                  _index: '2',
                  _score: 20,
                  _source: {
                    AgreementExpirationDate: '07/07/2099',
                    AgreementID: 12,
                    AgreementInvalidIndicator: 'active',
                    AgreementName: 'test',
                    AgreementStatus: 'string',
                    AgreementType: 'string'
                  },
                  _type: 'test'
                }],
                max_score: 100,
                total: 100
              }
            }
          }],
          doc_count_error_upper_bound: 12,
          sum_other_doc_count: 12
        },
        count: {
          value: 10
        }
      }
    };
    service.responseFormat(input, component.agreementSearchModel, inp);
  });
});
