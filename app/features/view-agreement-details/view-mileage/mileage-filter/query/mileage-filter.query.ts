
const agreementDefaultIndicator = 'agreementDefaultIndicator.keyword';
export class MileageFilterQuery {
  // Query to get agreementDefaultIndicator
  static getAgreementDefaultQuery(): object {
    return {
      '_source': 'agreementDefaultIndicator',
      'size': 2000,
      'collapse': {
        'field': agreementDefaultIndicator
      },
      'query': {
        'query_string': {
          'default_field': agreementDefaultIndicator,
          'query': '*'
        }
      },
      'sort': [
        {
          [agreementDefaultIndicator]: {
            'order': 'desc'
          }
        }
      ]
    };
  }
  // Query to fetch Contract and Section list
  static getContractSectionQuery(agreementID: number, path: string, source: string, field: string): object {
    return {
      'size': 0,
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'agreementID',
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
            'by_BillingPartyCode': {
              'filter': {
                'bool': {
                  'must': [
                    {
                      'query_string': {
                        'fields': [
                          field
                        ],
                        'query': '**',
                        'default_operator': 'and'
                      }
                    }
                  ]
                }
              },
              'aggs': {
                'by_BillingPartyName': {
                  'terms': {
                    'field': field,
                    'size': 10,
                    'order': {
                      '_key': 'asc'
                    }
                  },
                  'aggs': {
                    'displayname': {
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
  static getSystemParameterFilterQuery(fieldName, keyName: string): object {
    return {
      'nested': {
        'path': fieldName,
        'query': {
          'bool': {
            'must': [
              {
                'query_string': {
                  'default_field': keyName,
                  'default_operator': 'AND',
                  'query': 'Tolls'
                }
              },
              {
                'query_string': {
                  'default_field': 'mileageSystemParameters.mileageParameterSelectIndicator',
                  'default_operator': 'AND',
                  'query': 'Y'
                }
              }
            ]
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
  static getCarrierSystemParameterQuery(agreementID: number, path: string, source: string,
  field: string, byCode: string, isSystemParam: boolean): object {
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
              'default_field': 'agreementID',
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
                'must': this.aggsFilterQuery(field, isSystemParam)
              }
            },
            'aggs': {
              'carriercode': {
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
  static frameListingQuery(agreementID: number, filedName: string, fieldNameWithKeyWord: string): object {
  return {
    '_source': filedName,
    'size': 2000,
    'collapse': {
      'field': fieldNameWithKeyWord
    },
    'query': {
      'bool': {
        'must': [
          {
            'query_string': {
              'default_field': 'agreementID',
              'query': `${agreementID}`,
              'default_operator': 'AND'
            }
          },
          {
            'query_string': {
              'default_field': fieldNameWithKeyWord,
              'query': '*',
              'default_operator': 'AND'
            }
          }
        ]
      }
    },
    'sort': [
      {
        [fieldNameWithKeyWord]: {
          'order': 'asc'
        }
      }
    ]
  };
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

