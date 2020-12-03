export class ContractsFilterQuery {
  static getContractsListQuery(sourceData: any) {
    const contractNameText = 'ContractRanges.ContractName.keyword';
    return {
      '_source': [
        'AgreementID',
        'ContractID',
        'ContractRanges'
      ],
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
                'default_field': 'AgreementID.keyword',
                'query': sourceData['agreementID']
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
                          'should': [
                          ]
                        }
                      },
                      {
                        'bool': {
                          'should': [
                          ]
                        }
                      },
                      {
                        'bool': {
                          'should': [
                          ]
                        }
                      },
                      {
                        'bool': {
                          'must': [
                          ]
                        }
                      },
                      {
                        'bool': {
                          'should': [
                            {
                              'script': {
                                'script': sourceData.script.active
                              }
                            }
                          ]
                        }
                      },
                      {
                        'bool': {
                          'should': [
                          ]
                        }
                      },
                      {
                        'bool': {
                          'must': [
                          ]
                        }
                      },
                      {
                        'bool': {
                          'should': [
                          ]
                        }
                      },
                      {
                        'bool': {
                          'should': [
                          ]
                        }
                      },
                      {
                        'bool': {
                          'must': [
                          ]
                        }
                      },
                      {
                        'bool': {
                          'should': [
                          ]
                        }
                      },
                      {
                        'bool': {
                          'must': [
                          ]
                        }
                      },
                      {
                        'bool': {
                          'must': [
                          ]
                        }
                      }
                    ]
                  }
                }
              }
            },
            {
              'bool': {
                'must': [
                ]
              }
            },
            {
              'bool': {
                'must': [
                ]
              }
            }
          ]
        }
      },
      'collapse': {
        'field': contractNameText
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
                'field': contractNameText
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
  }

  /* query to fetch status */
  static getStatusQuery(value: string): object {
    return {
      'script': {
        'script': value
      }
    };
  }
  /* query to fetch status */
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
