import { TestBed, inject } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from './../../../../../../app.module';

import { DocumenationFilterUtilityService } from './documenation-filter-utility.service';

describe('DocumenationFilterUtilityService', () => {
    let service: DocumenationFilterUtilityService;
    let http: HttpClient;
    configureTestSuite(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, HttpClientModule, HttpClientTestingModule, AppModule],
        providers: [DocumenationFilterUtilityService, { provide: APP_BASE_HREF, useValue: '/' }],
      });
    });
  beforeEach(() => {
    service = TestBed.get(DocumenationFilterUtilityService);
    http = TestBed.get(HttpClient);
  });
  it('should be created', inject([DocumenationFilterUtilityService], () => {
    expect(service).toBeTruthy();
  }));
  it('should call on contractFramer', () => {
    const contractResponse = {
      'took': 15,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 14,
        'max_score': 0.0,
        'hits': [
        ]
      },
      'aggregations': {
        'nesting': {
          'doc_count': 112,
          'by_contractname': {
            'doc_count': 5,
            'contract': {
              'doc_count_error_upper_bound': 0,
              'sum_other_doc_count': 0,
              'buckets': [
                {
                  'key': '1979 (test data122334)',
                  'doc_count': 2,
                  'hits': {
                    'hits': {
                      'total': 2,
                      'max_score': 1.0,
                      'hits': [
                        {
                          '_index': 'pricing-accessorial-documentation-1-2019.08.12',
                          '_type': 'doc',
                          '_id': '6792',
                          '_nested': {
                            'field': 'customerAccessorialAccounts',
                            'offset': 1
                          },
                          '_score': 1.0,
                          '_source': {
                            'customerAgreementContractName': '1979 (test data122334)'
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      }
    };
    service.contractFramer(contractResponse);
  });
  it('should call on contractFramer', () => {
    service.contractFramer(null);
  });
  it('should call on sectionFramer', () => {
    const sectionResponse = {
      'took': 8,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 14,
        'max_score': 0.0,
        'hits': [
        ]
      },
      'aggregations': {
        'nesting': {
          'doc_count': 112,
          'by_contractname': {
            'doc_count': 2,
            'contract': {
              'doc_count_error_upper_bound': 0,
              'sum_other_doc_count': 0,
              'buckets': [
                {
                  'key': '00001s',
                  'doc_count': 1,
                  'hits': {
                    'hits': {
                      'total': 1,
                      'max_score': 1.0,
                      'hits': [
                        {
                          '_index': 'pricing-accessorial-documentation-1-2019.08.12',
                          '_type': 'doc',
                          '_id': '6088',
                          '_nested': {
                            'field': 'customerAccessorialAccounts',
                            'offset': 1
                          },
                          '_score': 1.0,
                          '_source': {
                            'customerAgreementContractSectionName': '00001s'
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      }
    };
    service.sectionFramer(sectionResponse);
  });
  it('should call on sectionFramer', () => {
    service.sectionFramer(null);
  });
  it('should call on BUFramer', () => {
    const BUResponse = {
      'took': 9,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 14,
        'max_score': 0.0,
        'hits': [
        ]
      },
      'aggregations': {
        'nesting': {
          'doc_count': 18,
          'by_BU': {
            'doc_count': 18,
            'BU': {
              'doc_count_error_upper_bound': 0,
              'sum_other_doc_count': 1,
              'buckets': [
                {
                  'key': 'dcs - backhaul',
                  'doc_count': 3,
                  'hits': {
                    'hits': {
                      'total': 3,
                      'max_score': 1.0,
                      'hits': [
                        {
                          '_index': 'pricing-accessorial-documentation-1-2019.08.12',
                          '_type': 'doc',
                          '_id': '7016',
                          '_nested': {
                            'field': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings',
                            'offset': 1
                          },
                          '_score': 1.0,
                          '_source': {
                            'businessUnitDisplayName': 'DCS - Backhaul'
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      }
    };
    service.buFramer(BUResponse);
  });
  it('should call on BUFramer', () => {
    service.buFramer(null);
  });
  it('should call on carrierFramer', () => {
    const carrierResponse = {
      'took': 7,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 14,
        'max_score': 0.0,
        'hits': [
        ]
      },
      'aggregations': {
        'nesting': {
          'doc_count': 1,
          'by_contractname': {
            'doc_count': 1,
            'contract': {
              'doc_count_error_upper_bound': 0,
              'sum_other_doc_count': 0,
              'buckets': [
                {
                  'key': 'test carrier 11 (tcr11)',
                  'doc_count': 1,
                  'hits': {
                    'hits': {
                      'total': 1,
                      'max_score': 1.0,
                      'hits': [
                        {
                          '_index': 'pricing-accessorial-documentation-1-2019.08.12',
                          '_type': 'doc',
                          '_id': '6790',
                          '_nested': {
                            'field': 'customerAccessorialCarriers',
                            'offset': 0
                          },
                          '_score': 1.0,
                          '_source': {
                            'carrierDisplayName': 'Test Carrier 11 (TCR11)'
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      }
    };
    service.carrierFramer(carrierResponse);
  });
  it('should call on carrierFramer', () => {
    service.carrierFramer(null);
  });
  it('should call on billToAccountFramer', () => {
    const billToAccountResponse = {
      'took': 10,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 14,
        'max_score': 0.0,
        'hits': [
        ]
      },
      'aggregations': {
        'nesting': {
          'doc_count': 112,
          'by_billtoacc': {
            'doc_count': 105,
            'bill_to_acc': {
              'doc_count_error_upper_bound': 0,
              'sum_other_doc_count': 57,
              'buckets': [
                {
                  'key': ' (fdche4)',
                  'doc_count': 6,
                  'hits': {
                    'hits': {
                      'total': 6,
                      'max_score': 1.0,
                      'hits': [
                        {
                          '_index': 'pricing-accessorial-documentation-1-2019.08.12',
                          '_type': 'doc',
                          '_id': '7016',
                          '_nested': {
                            'field': 'customerAccessorialAccounts',
                            'offset': 0
                          },
                          '_score': 1.0,
                          '_source': {
                            'customerAgreementContractSectionAccountName': ' (FDCHE4)'
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      }
    };
    service.billToAccountFramer(billToAccountResponse);
  });
  it('should call on billToAccountFramer', () => {
    service.billToAccountFramer(null);
  });
  it('should call on chargeTypeFramer', () => {
    const chargeTypeResponse = {
      'took': 28,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 14,
        'max_score': 0.0,
        'hits': [
        ]
      },
      'aggregations': {
        'nesting': {
          'doc_count': 12,
          'by_chargetype': {
            'doc_count': 2,
            'carriercode': {
              'doc_count_error_upper_bound': 0,
              'sum_other_doc_count': 0,
              'buckets': [
                {
                  'key': 'california compliance charge (cacompchg)',
                  'doc_count': 1,
                  'hits': {
                    'hits': {
                      'total': 1,
                      'max_score': 1.0,
                      'hits': [
                        {
                          '_index': 'pricing-accessorial-documentation-1-2019.08.12',
                          '_type': 'doc',
                          '_id': '6792',
                          '_nested': {
                            'field': 'customerAccessorialDocumentChargeTypes',
                            'offset': 0
                          },
                          '_score': 1.0,
                          '_source': {
                            'chargeTypeName': 'California Compliance Charge (CACOMPCHG)'
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      }
    };
    service.chargeTypeFramer(chargeTypeResponse);
  });
  it('should call on chargeTypeFramer', () => {
    service.chargeTypeFramer(null);
  });
});
