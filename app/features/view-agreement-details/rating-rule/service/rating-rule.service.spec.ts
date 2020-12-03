import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { AppModule } from './../../../../app.module';
import { RatingRuleService } from './rating-rule.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RatingRuleService', () => {
  let service: RatingRuleService;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [RatingRuleService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });
  beforeEach(() => {
    service = TestBed.get(RatingRuleService);
 });
 it('should be created', () => {
  expect(service).toBeTruthy();
});
it('should call getRateList', () => {
  const query = {
    'from': 0,
    'size': 25,
    '_source': '*',
    'query': {
      'bool': {
        'must': [
          {
            'query_string': {
              'default_field': 'AgreementID',
              'query': '48'
            }
          },
          {
            'bool': {
              'should': [
                {
                  'query_string': {
                    'fields': [
                      'AgreementDefaultIndicator',
                      'CitySubstitutionDisplayName',
                      'HazmatChargeRulesType',
                      'CongestionChargeType',
                      'FlatRateWithStopsType',
                      'RatingRuleInvalidIndicator'
                    ],
                    'query': '*',
                    'default_operator': 'AND'
                  }
                },
                {
                  'nested': {
                    'path': 'ContractAssociations',
                    'query': {
                      'query_string': {
                        'fields': [
                          'ContractAssociations.ContractDisplayName'
                        ],
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'SectionAssociations',
                    'query': {
                      'query_string': {
                        'fields': [
                          'SectionAssociations.SectionName'
                        ],
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'FinanceBusinessUnitServiceOfferingAssociations',
                    'query': {
                      'query_string': {
                        'fields': [
                          'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitServiceOfferingDisplayName',
                          'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitCode',
                          'FinanceBusinessUnitServiceOfferingAssociations.ServiceOfferingCode'
                        ],
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'range': {
                    'RatingRuleEffectiveDate': {
                        'gte': '2019-06-14',
                        'lte': '2019-06-18',
                        'format': 'MM/dd/yyyy||yyyy'
                    }
                  }
              },
              {
                  'range': {
                    'RatingRuleExpirationDate': {
                        'gte': '2019-06-19',
                        'lte': '2019-06-20',
                        'format': 'MM/dd/yyyy||yyyy'
                    }
                  }
              }
              ]
            }
          },
          {
            'bool': {
              'must': [
                {
                  'nested': {
                    'path': 'SectionAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'SectionAssociations.SectionName.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'ContractAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'ContractAssociations.ContractDisplayName.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'ContractAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'ContractAssociations.ContractType.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'ContractAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'ContractAssociations.ContractName.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'FinanceBusinessUnitServiceOfferingAssociations',
                    'query': {
                      'query_string': {
                        'default_field':
                        'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitServiceOfferingDisplayName.keyword',
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'FinanceBusinessUnitServiceOfferingAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitCode.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'query_string': {
                    'default_field': 'AgreementDefaultIndicator.keyword',
                    'query': '*'
                  }
                },
                {
                  'bool': {
                    'must': [
                      {
                        'query_string': {
                          'default_field': 'CitySubstitutionDisplayName.keyword',
                          'query': '*'
                        }
                      }
                    ]
                  }
                },
                {
                  'query_string': {
                    'default_field': 'HazmatChargeRulesType.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'CongestionChargeType.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'FlatRateWithStopsType.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'RatingRuleInvalidIndicator.keyword',
                    'query': '*'
                  }
                },
                {
                  'range': {
                    'RatingRuleEffectiveDate.keyword': {
                      'gte': '1995-01-01',
                      'lte': '2099-12-31',
                      'format': 'dd/MM/yyyy||yyyy'
                    }
                  }
                },
                {
                  'range': {
                    'RatingRuleExpirationDate.keyword': {
                      'gte': '1995-01-01',
                      'lte': '2099-12-31',
                      'format': 'dd/MM/yyyy||yyyy'
                    }
                  }
                },
                {
                  'bool': {
                    'should': [
                      {
                        'bool': {
                          'must': [
                            {
                              'range': {
                                'RatingRuleExpirationDate.keyword': {
                                  'gte': '2019-07-26',
                                  'format': 'dd/MM/yyyy||yyyy'
                                }
                              }
                            },
                            {
                              'bool': {
                                'must_not': [
                                  {
                                    'query_string': {
                                      'default_field': 'RatingRuleInvalidReasonType.keyword',
                                      'query': 'Deleted'
                                    }
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    },
    'sort': [
      {
        'RatingRuleType.keyword': {
          'order': 'asc'
        }
      },
      {
        'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitServiceOfferingDisplayName.keyword': {
          'order': 'asc',
          'nested': {
            'path': 'FinanceBusinessUnitServiceOfferingAssociations'
          },
          'mode': 'min'
        }
      },
      {
        'ContractAssociations.ContractDisplayName.keyword': {
          'order': 'asc',
          'nested': {
            'path': 'ContractAssociations'
          },
          'mode': 'min'
        }
      },
      {
        'SectionAssociations.SectionName.keyword': {
          'order': 'asc',
          'nested': {
            'path': 'SectionAssociations'
          },
          'mode': 'min'
        }
      }
    ]
  };
  service.getRateList(query);
});
it('should call getRateDetails', () => {
  service.getRateDetails(48, 12);
});
it('should call checkRatingRule', () => {
  const arg = { customerAgreementID: 12 };
  service.checkRatingRule(arg);
});
it('should call inactivateRatingRule', () => {
  const arg = { customerAgreementID: 12 };
  service.inactivateRatingRule(12, arg);
});
it('should call downloadRatingRuleExcel', () => {
  const arg = {
    'from': 0,
    'size': 7,
    '_source': '*',
    'query': {
      'bool': {
        'must': [
          {
            'query_string': {
              'default_field': 'AgreementID',
              'query': '48'
            }
          },
          {
            'bool': {
              'should': [
                {
                  'query_string': {
                    'fields': [
                      'AgreementDefaultIndicator',
                      'CitySubstitutionDisplayName',
                      'HazmatChargeRulesType',
                      'CongestionChargeType',
                      'FlatRateWithStopsType',
                      'RatingRuleInvalidIndicator'
                    ],
                    'query': '*',
                    'default_operator': 'AND'
                  }
                },
                {
                  'nested': {
                    'path': 'ContractAssociations',
                    'query': {
                      'query_string': {
                        'fields': [
                          'ContractAssociations.ContractDisplayName'
                        ],
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'SectionAssociations',
                    'query': {
                      'query_string': {
                        'fields': [
                          'SectionAssociations.SectionName'
                        ],
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'FinanceBusinessUnitServiceOfferingAssociations',
                    'query': {
                      'query_string': {
                        'fields': [
                          'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitServiceOfferingDisplayName',
                          'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitCode',
                          'FinanceBusinessUnitServiceOfferingAssociations.ServiceOfferingCode'
                        ],
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                }
              ]
            }
          },
          {
            'bool': {
              'must': [
                {
                  'nested': {
                    'path': 'SectionAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'SectionAssociations.SectionName.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'ContractAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'ContractAssociations.ContractDisplayName.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'ContractAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'ContractAssociations.ContractType.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'ContractAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'ContractAssociations.ContractName.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'FinanceBusinessUnitServiceOfferingAssociations',
                    'query': {
                      'query_string': {
                        'default_field':
                         'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitServiceOfferingDisplayName.keyword',
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'FinanceBusinessUnitServiceOfferingAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitCode.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'query_string': {
                    'default_field': 'AgreementDefaultIndicator.keyword',
                    'query': '*'
                  }
                },
                {
                  'bool': {
                    'must': [
                      {
                        'query_string': {
                          'default_field': 'CitySubstitutionDisplayName.keyword',
                          'query': '*'
                        }
                      }
                    ]
                  }
                },
                {
                  'query_string': {
                    'default_field': 'HazmatChargeRulesType.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'CongestionChargeType.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'FlatRateWithStopsType.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'RatingRuleInvalidIndicator.keyword',
                    'query': '*'
                  }
                },
                {
                  'range': {
                    'RatingRuleEffectiveDate.keyword': {
                      'gte': '1995-01-01',
                      'lte': '2099-12-31',
                      'format': 'dd/MM/yyyy||yyyy'
                    }
                  }
                },
                {
                  'range': {
                    'RatingRuleExpirationDate.keyword': {
                      'gte': '1995-01-01',
                      'lte': '2099-12-31',
                      'format': 'dd/MM/yyyy||yyyy'
                    }
                  }
                },
                {
                  'bool': {
                    'should': [
                      {
                        'bool': {
                          'must': [
                            {
                              'range': {
                                'RatingRuleExpirationDate.keyword': {
                                  'gte': '2019-07-29',
                                  'format': 'dd/MM/yyyy||yyyy'
                                }
                              }
                            },
                            {
                              'bool': {
                                'must_not': [
                                  {
                                    'query_string': {
                                      'default_field': 'RatingRuleInvalidReasonType.keyword',
                                      'query': 'Deleted'
                                    }
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    },
    'sort': [
      {
        'RatingRuleType.keyword': {
          'order': 'asc'
        }
      },
      {
        'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitServiceOfferingDisplayName.keyword': {
          'order': 'asc',
          'nested': {
            'path': 'FinanceBusinessUnitServiceOfferingAssociations'
          },
          'mode': 'min'
        }
      },
      {
        'ContractAssociations.ContractDisplayName.keyword': {
          'order': 'asc',
          'nested': {
            'path': 'ContractAssociations'
          },
          'mode': 'min'
        }
      },
      {
        'SectionAssociations.SectionName.keyword': {
          'order': 'asc',
          'nested': {
            'path': 'SectionAssociations'
          },
          'mode': 'min'
        }
      }
    ]
  };
  service.downloadRatingRuleExcel(arg);
});

});
