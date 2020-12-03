import { TestBed, inject } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from './../../../../../app.module';
import { MileageFilterUtilityService } from './mileage-filter-utility.service';

describe('MileageFilterUtilityService', () => {
  let service: MileageFilterUtilityService;
  let http: HttpClient;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, HttpClientTestingModule, AppModule],
      providers: [MileageFilterUtilityService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  beforeEach(() => {
    service = TestBed.get(MileageFilterUtilityService);
    http = TestBed.get(HttpClient);
  });
  it('should be created', inject([MileageFilterUtilityService], () => {
    expect(service).toBeTruthy();
  }));
  it('should call on programNamesFramer', () => {
    const programNameResponse = {
      'took': 18,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 46,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-agreement-mileage-2-2019.07.10',
            '_type': 'doc',
            '_id': '500',
            '_score': null,
            '_source': {
              'mileageName': 'Active Mileage'
            },
            'fields': {
              'mileageName.keyword': [
                'active mileage'
              ]
            },
            'sort': [
              'active mileage'
            ]
          }
        ]
      }
    };
    service.programNamesFramer(programNameResponse);
  });
  it('should call on programNamesFramer', () => {
    service.programNamesFramer(null);
  });
  it('should call on agreementDefaultFramer', () => {
    const agreementDefaultResponse = {
      'took': 20,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 276,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-agreement-mileage-2-2019.07.10',
            '_type': 'doc',
            '_id': '340',
            '_score': null,
            '_source': {
              'agreementDefault': 'Yes'
            },
            'fields': {
              'agreementDefault': [
                'Yes'
              ]
            },
            'sort': [
              'Yes'
            ]
          }
        ]
      }
    };
    service.agreementDefaultFramer(agreementDefaultResponse);
  });
  it('should call on agreementDefaultFramer', () => {
    service.agreementDefaultFramer(null);
  });
  it('should call on contractsFramer', () => {
    const contractsRespone = {
      'took': 9,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 46,
        'max_score': 0.0,
        'hits': [
        ]
      },
      'aggregations': {
        'nesting': {
          'doc_count': 13,
          'by_BillingPartyCode': {
            'doc_count': 13,
            'by_BillingPartyName': {
              'doc_count_error_upper_bound': 0,
              'sum_other_doc_count': 0,
              'buckets': [
                {
                  'key': 'legal contract 111 (111)',
                  'doc_count': 9,
                  'displayname': {
                    'hits': {
                      'total': 1,
                      'max_score': 1.0,
                      'hits': [
                        {
                          '_index': 'pricing-agreement-mileage-1-2019.07.12',
                          '_type': 'doc',
                          '_id': '509',
                          '_nested': {
                            'field': 'contractAssociations',
                            'offset': 0
                          },
                          '_score': 1.0,
                          '_source': {
                            'contractDisplayName': '111 (Legal Contract 111)'
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
    service.contractsFramer(contractsRespone);
  });
  it('should call on contractsFramer', () => {
    service.contractsFramer(null);
  });
  it('should call on sectionsFramer', () => {
    const sectionsResponse = {
      'took': 10,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 46,
        'max_score': 0.0,
        'hits': [
        ]
      },
      'aggregations': {
        'nesting': {
          'doc_count': 4,
          'by_BillingPartyCode': {
            'doc_count': 4,
            'by_BillingPartyName': {
              'doc_count_error_upper_bound': 0,
              'sum_other_doc_count': 0,
              'buckets': [
                {
                  'key': 'test section 1',
                  'doc_count': 4,
                  'displayname': {
                    'hits': {
                      'total': 4,
                      'max_score': 1.0,
                      'hits': [
                        {
                          '_index': 'pricing-agreement-mileage-1-2019.07.12',
                          '_type': 'doc',
                          '_id': '380',
                          '_nested': {
                            'field': 'sectionAssociations',
                            'offset': 0
                          },
                          '_score': 1.0,
                          '_source': {
                            'sectionName': 'Test Section 1'
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
    service.sectionsFramer(sectionsResponse);
  });

  it('should call on sectionsFramer', () => {
    service.sectionsFramer(null);
  });
  it('should call on carrierFramer', () => {
    const carrierMockResponse = {
      'took': 14,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 17,
        'max_score': 0.0,
        'hits': [
        ]
      },
      'aggregations': {
        'nesting': {
          'doc_count': 12,
          'by_carriercode': {
            'doc_count': 12,
            'carriercode': {
              'doc_count_error_upper_bound': 0,
              'sum_other_doc_count': 0,
              'buckets': [
                {
                  'key': 'test carrier 1 (tcr1)',
                  'doc_count': 2,
                  'hits': {
                    'hits': {
                      'total': 2,
                      'max_score': 1.0,
                      'hits': [
                        {
                          '_index': 'pricing-agreement-mileage-5-2019.07.24',
                          '_type': 'doc',
                          '_id': '321',
                          '_nested': {
                            'field': 'customerMileageProgramCarrierAssociations',
                            'offset': 0
                          },
                          '_score': 1.0,
                          '_source': {
                            'carrierDisplayName': 'Test Carrier 1 (TCR1)'
                          }
                        }
                      ]
                    }
                  }
                },
              ]
            }
          }
        }
      }
    };
    service.carrierFramer(carrierMockResponse);
  });
  it('should call on carrierFramer', () => {
    service.carrierFramer(null);
  });
  it('should call on systemFramer', () => {
    const systemMock = {
      'took': 98,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 17,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-agreement-mileage-5-2019.07.24',
            '_type': 'doc',
            '_id': '245',
            '_score': null,
            '_source': {
              'mileageSystemName': 'PC Miller'
            },
            'fields': {
              'mileageSystemName.keyword': [
                'pc miller'
              ]
            },
            'sort': [
              'pc miller'
            ]
          }
        ]
      }
    };
    service.systemFramer(systemMock);
  });
  it('should call on systemFramer', () => {
    service.systemFramer(null);
  });
  it('should call on systemVersionFramer', () => {
    const systemVersionMock = {
      'took': 45,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 17,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-agreement-mileage-5-2019.07.24',
            '_type': 'doc',
            '_id': '34',
            '_score': null,
            '_source': {
              'mileageSystemVersionName': '16'
            },
            'fields': {
              'mileageSystemVersionName.text': [
                '16'
              ]
            },
            'sort': [
              '16'
            ]
          },
          {
            '_index': 'pricing-agreement-mileage-5-2019.07.24',
            '_type': 'doc',
            '_id': '312',
            '_score': null,
            '_source': {
              'mileageSystemVersionName': '18'
            },
            'fields': {
              'mileageSystemVersionName.text': [
                '18'
              ]
            },
            'sort': [
              '18'
            ]
          }
        ]
      }
    };
    service.systemVersionFramer(systemVersionMock);
  });
  it('should call on systemVersionFramer', () => {
    service.systemVersionFramer(null);
  });
  it('should call on systemParametersFramer', () => {
    const systemParameterMock = {
      'took': 12,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 17,
        'max_score': 0.0,
        'hits': [
        ]
      },
      'aggregations': {
        'nesting': {
          'doc_count': 98,
          'by_parametername': {
            'doc_count': 6,
            'carriercode': {
              'doc_count_error_upper_bound': 0,
              'sum_other_doc_count': 0,
              'buckets': [
                {
                  'key': 'mixed geography',
                  'doc_count': 1,
                  'hits': {
                    'hits': {
                      'total': 1,
                      'max_score': 1.0,
                      'hits': [
                        {
                          '_index': 'pricing-agreement-mileage-5-2019.07.24',
                          '_type': 'doc',
                          '_id': '319',
                          '_nested': {
                            'field': 'mileageSystemParameters',
                            'offset': 1
                          },
                          '_score': 1.0,
                          '_source': {
                            'mileageSystemParameterName': 'Mixed Geography'
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
    service.systemParametersFramer(systemParameterMock);
  });
  it('should call on systemParametersFramer', () => {
    service.systemParametersFramer(null);
  });
  it('should call on borderMilesParameterFramer', () => {
    const bordermilesMock = {
      'took': 18,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 17,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-agreement-mileage-5-2019.07.24',
            '_type': 'doc',
            '_id': '321',
            '_score': null,
            '_source': {
              'mileageBorderMileParameterTypeName': 'Miles include border crossing'
            },
            'fields': {
              'mileageBorderMileParameterTypeName.keyword': [
                'miles include border crossing'
              ]
            },
            'sort': [
              'miles include border crossing'
            ]
          }
        ]
      }
    };
    service.borderMilesParameterFramer(bordermilesMock);
  });
  it('should call on borderMilesParameterFramer', () => {
    service.borderMilesParameterFramer(null);
  });
  it('should call on distanceUnitFramer', () => {
    const distanceUnitMOck = {
      'took': 57,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 17,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-agreement-mileage-5-2019.07.24',
            '_type': 'doc',
            '_id': '322',
            '_score': null,
            '_source': {
              'unitOfDistanceMeasurementCode': 'Kilometers'
            },
            'fields': {
              'unitOfDistanceMeasurementCode.keyword': [
                'kilometers'
              ]
            },
            'sort': [
              'kilometers'
            ]
          }
        ]
      }
    };
    service.distanceUnitFramer(distanceUnitMOck);
  });
  it('should call on distanceUnitFramer', () => {
    service.distanceUnitFramer(null);
  });
  it('should call on routeTypeFramer', () => {
    const routeType = {
      'took': 18,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 17,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-agreement-mileage-5-2019.07.24',
            '_type': 'doc',
            '_id': '334',
            '_score': null,
            '_source': {
              'mileageRouteTypeName': 'Practical'
            },
            'fields': {
              'mileageRouteTypeName.keyword': [
                'practical'
              ]
            },
            'sort': [
              'practical'
            ]
          }
        ]
      }
    };
    service.routeTypeFramer(routeType);
  });
  it('should call on routeTypeFramer', () => {
    service.routeTypeFramer(null);
  });
  it('should call on geographyTypeFramer', () => {
    const getographyType = {
      'took': 37,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 17,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-agreement-mileage-5-2019.07.24',
            '_type': 'doc',
            '_id': '323',
            '_score': null,
            '_source': {
              'geographyType': '5-Zip'
            },
            'fields': {
              'geographyType.keyword': [
                '5-zip'
              ]
            },
            'sort': [
              '5-zip'
            ]
          }
        ]
      }
    };
    service.geographyTypeFramer(getographyType);
  });
  it('should call on geographyTypeFramer', () => {
    service.geographyTypeFramer(null);
  });
  it('should call on calculationTypeFramer', () => {
    const calculationType = {
      'took': 14,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 17,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-agreement-mileage-5-2019.07.24',
            '_type': 'doc',
            '_id': '321',
            '_score': null,
            '_source': {
              'mileageCalculationTypeName': 'Construct'
            },
            'fields': {
              'mileageCalculationTypeName.keyword': [
                'construct'
              ]
            },
            'sort': [
              'construct'
            ]
          }
        ]
      }
    };
    service.calculationTypeFramer(calculationType);
  });
  it('should call on calculationTypeFramer', () => {
    service.calculationTypeFramer(null);
  });
  it('should call on decimalPrecisionFramer', () => {
    const decimalPrecision = {
      'took': 24,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 17,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-agreement-mileage-5-2019.07.24',
            '_type': 'doc',
            '_id': '321',
            '_score': null,
            '_source': {
              'decimalPrecisionIndicator': 'No'
            },
            'fields': {
              'decimalPrecisionIndicator.keyword': [
                'no'
              ]
            },
            'sort': [
              'no'
            ]
          }
        ]
      }
    };
    service.decimalPrecisionFramer(decimalPrecision);
  });
    it('should call on decimalPrecisionFramer', () => {
    service.decimalPrecisionFramer(null);
  });
  it('should call on businessUnitFramer', () => {
    const BuMock = {
      'took': 11,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 398,
        'max_score': 0.0,
        'hits': [
        ]
      },
      'aggregations': {
        'nesting': {
          'doc_count': 229,
          'by_businessunit': {
            'doc_count': 229,
            'bu': {
              'doc_count_error_upper_bound': 0,
              'sum_other_doc_count': 0,
              'buckets': [
                {
                  'key': 'dcs',
                  'doc_count': 99,
                  'hits': {
                    'hits': {
                      'total': 99,
                      'max_score': 1.0,
                      'hits': [
                        {
                          '_index': 'pricing-agreement-mileage-5-2019.07.24',
                          '_type': 'doc',
                          '_id': '95',
                          '_nested': {
                            'field': 'customerMileageProgramBusinessUnits',
                            'offset': 0
                          },
                          '_score': 1.0,
                          '_source': {
                            'financeBusinessUnitCode': 'DCS'
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
    service.businessUnitFramer(BuMock);
  });
  it('should call on businessUnitFramer', () => {
    service.businessUnitFramer(null);
  });
});
