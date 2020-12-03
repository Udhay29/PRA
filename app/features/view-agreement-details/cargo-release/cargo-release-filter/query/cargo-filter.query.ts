const sectionKeyword = 'sectionAssociation.customerAgreementContractSectionName.keyword';
const contractKeyword = 'contractAssociation.contractDisplayName.keyword';
export class CargoFilterQuery {
  static invalidReasonTypeKeyword = 'invalidReasonTypeName.keyword';
  static getCargoDataQuery(id, sourceData?) {
    return {
      'size': 25,
      'from': 0,
      '_source': '*',
      'script_fields': {
        'Status': {
          'script': {
            'lang': 'painless',
            'source': sourceData.sourceData
          }
        }
      },
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'customerAgreementID',
                'query': id,
                'default_operator': 'AND'
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
                            'expirationDate': {
                              'gte': 'now/d'
                            }
                          }
                        },
                        {
                          'query_string': {
                            'default_field': 'invalidIndicator',
                            'query': 'N'
                          }
                        },
                        {
                          'query_string': {
                            'default_field': 'invalidReasonTypeName',
                            'query': 'Active'
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
                'should': []
              }
            },
            {
              'bool': CargoFilterQuery.getFilterQuery(sourceData)
            }
          ]
        }
      },
      'sort': [
        {
          'cargoType.keyword': {
            'order': 'asc'
          }
        }
      ]
    };
  }
  static defaultSearchQuery() {
    return [{
      'query_string': {
        'fields': ['cargoReleaseAmount.keyword', 'agreementDefaultIndicator.keyword', 'effectiveDate.keyword', 'expirationDate.keyword'],
        'query': '*',
        'default_operator': 'AND'
      }
    },
    {
      'query_string': {
        'default_field': sectionKeyword,
        'query': '*',
        'default_operator': 'AND'
      }
    },
    {
      'query_string': {
        'default_field': contractKeyword,
        'query': '*',
        'default_operator': 'AND'
      }
    },
    {
      'nested': {
        'path': 'financeBusinessUnitAssociations',
        'query': {
          'query_string': {
            'default_field': 'financeBusinessUnitAssociations.financeBusinessUnitCode.keyword',
            'query': '*',
            'default_operator': 'AND'
          }
        }
      }
    }
    ];
  }
  static dateSearchQuery() {
    return [
      {
        'range': {
          'effectiveDate': {
            'gte': '',
            'lte': '',
            'format': 'MM/dd/yyyy||yyyy'
          }
        }
      },
      {
        'range': {
          'expirationDate': {
            'gte': '',
            'lte': '',
            'format': 'MM/dd/yyyy||yyyy'
          }
        }
      }
    ];
  }
  static getStatusQuery(value: string): object {
    return {
      'script': {
        'script': value
      }
    };
  }

  static getFilterQuery(sourceData) {
    return {
      'must': [
        {
          'query_string': {
            'default_field': 'agreementDefaultIndicator',
            'query': '*',
            'default_operator': 'AND'
          }
        },
        {
          'range': {
            'cargoReleaseAmount': {
              'gte': 100000,
              'lte': 1000000
            }
          }
        },
        {
          'query_string': {
            'default_field': 'createProgramName.keyword',
            'query': '*',
            'default_operator': 'AND'
          }
        },
        {
          'query_string': {
            'default_field': 'createTimestamp.keyword',
            'query': '*',
            'default_operator': 'AND'
          }
        },
        {
          'query_string': {
            'default_field': 'createUserId.keyword',
            'query': '*',
            'default_operator': 'AND'
          }
        },
        {
          'bool': {
            'should': []
          }
        },
        {
          'query_string': {
            'default_field': 'lastUpdateProgramName.keyword',
            'query': '*',
            'default_operator': 'AND'
          }
        },
        {
          'query_string': {
            'default_field': 'lastUpdateTimestamp.keyword',
            'query': '*',
            'default_operator': 'AND'
          }
        },
        {
          'query_string': {
            'default_field': 'lastUpdateUserId.keyword',
            'query': '*',
            'default_operator': 'AND'
          }
        },
        {
          'query_string': {
            'default_field': '*',
            'query': '*',
            'default_operator': 'AND'
          }
        },
        {
          'query_string': {
            'default_field': '*',
            'query': '*',
            'default_operator': 'AND'
          }
        },
        {
          'query_string': {
            'default_field': '*',
            'query': '*',
            'default_operator': 'AND'
          }
        },
        {
          'range': {
            'effectiveDate': {
              'gte': '01/01/1995'
            }
          }
        },
        {
          'range': {
            'expirationDate': {
              'lte': '12/31/2099'
            }
          }
        },
        {
          'range': {
            'originalEffectiveDate': {
              'gte': '01/01/1995'
            }
          }
        },
        {
          'range': {
            'originalExpirationDate': {
              'lte': '12/31/2099'
            }
          }
        }
      ]
    };
  }
  static getContractQuery(id: number) {
    return {
      '_source': 'contractAssociation.contractDisplayName',
      'size': 2000,
      'collapse': {
        'field': contractKeyword
      },
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': contractKeyword,
                'query': '*search-query-text*'
              }
            },
            {
              'query_string': {
                'default_field': 'customerAgreementID',
                'query': id,
                'default_operator': 'AND'
              }
            }
          ]
        }
      },
      'sort': [
        {
          'contractAssociation.contractDisplayName.keyword': {
            'order': 'asc'
          }
        }
      ]
    };
  }
  static getSectionQuery(id: number) {
    return {
      '_source': 'sectionAssociation.customerAgreementContractSectionName',
      'size': 2000,
      'collapse': {
        'field': sectionKeyword
      },
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': sectionKeyword,
                'query': '*'
              }
            },
            {
              'query_string': {
                'default_field': 'customerAgreementID',
                'query': id,
                'default_operator': 'AND'
              }
            }
          ]
        }
      },
      'sort': [
        {
          'sectionAssociation.customerAgreementContractSectionName.keyword': {
            'order': 'asc'
          }
        }
      ]
    };
  }
  static getAuditQuery(id: number, param: string) {
    const paramKey = `${param}.keyword`;
    return {
      '_source': `${param}`,
      'size': 2000,
      'collapse': {
        'field': paramKey
      },
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': paramKey,
                'query': '*'
              }
            },
            {
              'query_string': {
                'default_field': 'customerAgreementID',
                'query': id,
                'default_operator': 'AND'
              }
            }
          ]
        }
      }
    };
  }

  static getStatusSortQuery(value: string, order: string): object {
    return {
      '_script': {
        'script': {
          'lang': 'painless',
          'source': value
        },
        'order': order,
        'type': 'string'
      }
    };
  }
}
