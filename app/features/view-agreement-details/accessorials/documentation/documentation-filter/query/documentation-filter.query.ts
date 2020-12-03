
export class DoumentationFilterQuery {
  static frameListingQuery(filedName: string, agreementID: number): object {
    return {
      '_source': 'accessorialDocumentType',
      'size': 2000,
      'collapse': {
        'field': filedName
      },
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'customerAgreementId',
                'query': `${agreementID}`,
                'default_operator': 'AND'
              }
            },
            {
              'query_string': {
                'default_field': filedName,
                'query': '*'
              }
            }
          ]
        }
      },
      'sort': [
        {
          [filedName]: {
            'order': 'asc'
          }
        }
      ]
    };
  }

  static frameNestedListingQuery(agreementID: number, path: string, source: string,
    field: string, byCode: string, aggsCode: string, isAutocompleteFilter = false): object {
    return {
      'size': 0,
      '_source': [
        source
      ],
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'customerAgreementId',
                'query': `${agreementID}`,
                'default_operator': 'AND'
              }
            }
          ]
        }
      },
      'aggs': {
        'nesting': {
          'nested': {
            'path': path
          },
          'aggs': {
            [byCode]: {
              'filter': {
                'bool': {
                  'must': [
                    {
                      'query_string': {
                        'fields': [field],
                        'query': isAutocompleteFilter ? 'search-query-text' : '**',
                        'default_operator': 'and'
                      }
                    }
                  ]
                }
              },
              'aggs': {
                [aggsCode]: {
                  'terms': {
                    'field': field,
                    'size': 10,
                    'order': {
                      '_key': 'asc'
                    }
                  },
                  'aggs': {
                    'hits': {
                      'top_hits': {
                        'size': 1,
                        '_source': source
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  }
  static getPrimaryFilterQuery(fieldName): object {
    return {
      'query_string': {
        'default_field': fieldName,
        'query': '*',
        'default_operator': 'AND'
      }
    };
  }
  static getPrimaryAssociationFilterQuery(fieldName, keyName: string): object {
    return {
      'nested': {
        'path': fieldName,
        'query': {
          'query_string': {
            'default_field': keyName,
            'query': '*',
            'default_operator': 'AND'
          }
        }
      }
    };
  }
  static statusQuery(key): object {
    return {
      'range': {
        'expirationDate': {
          [key]: 'now/d'
        }
      }
    };
  }
  static activeInactiveRange(): object {
    return {
      'range': {
        'expirationDate': {
          'gte': 'now/d',
          'lt': 'now/d'
        }
      }
    };
  }
  static getStatusQuery(invalidIndicator, invalidReasonType) {
    return {
      'bool': {
        'must': [
          {
            'query_string': {
              'default_field': 'invalidIndicator',
              'query': invalidIndicator
            }
          },
          {
            'query_string': {
              'default_field': 'invalidReasonType',
              'query': invalidReasonType
            }
          }
        ]
      }
    };
  }
  static aggsFilterQuery(field: string, isSystemParam: boolean): object[] {
    let aggsFilterQuery;
    if (isSystemParam) {
      aggsFilterQuery = [
        {
          'query_string': {
            'fields': [field],
            'query': '**',
            'default_operator': 'and'
          }
        },
        {
          'query_string': {
            'fields': [
              'mileageSystemParameters.mileageParameterSelectIndicator'
            ],
            'query': 'Y',
            'default_operator': 'and'
          }
        }
      ];
    } else {
      aggsFilterQuery = [
        {
          'query_string': {
            'fields': [field],
            'query': 'search-query-text',
            'default_operator': 'and'
          }
        }
      ];
    }
    return aggsFilterQuery;
  }
  static businessUnitListingQuery(): object {
    return {
      'size': 0,
      '_source': [
        'customerMileageProgramBusinessUnits.financeBusinessUnitCode'
      ],
      'aggs': {
        'nesting': {
          'nested': {
            'path': 'customerMileageProgramBusinessUnits'
          },
          'aggs': {
            'by_businessunit': {
              'filter': {
                'bool': {
                  'must': [
                    {
                      'query_string': {
                        'fields': ['customerMileageProgramBusinessUnits.financeBusinessUnitCode.keyword'],
                        'query': '**',
                        'default_operator': 'and'
                      }
                    }
                  ]
                }
              },
              'aggs': {
                'bu': {
                  'terms': {
                    'field': 'customerMileageProgramBusinessUnits.financeBusinessUnitCode.keyword',
                    'size': 10,
                    'order': {
                      '_key': 'asc'
                    }
                  },
                  'aggs': {
                    'hits': {
                      'top_hits': {
                        'size': 1,
                        '_source': 'customerMileageProgramBusinessUnits.financeBusinessUnitCode'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  }
}

