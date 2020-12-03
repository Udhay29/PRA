export class AdvanceSearchQuery {
  static statuKeyword = 'AgreementStatus.keyword';
  static contracNameKeyword = 'ContractRanges.ContractName.key';
  static contracName = 'ContractRanges.ContractName';
  static contracNumberKeyword = 'ContractRanges.ContractNumber.key';
  static contracNumber = 'ContractRanges.ContractNumber';
  static displayName = 'ContractRanges.contractDisplayName';
  static displayNameKeyword = 'ContractRanges.contractDisplayName.key';
  static carrierAgreementName = 'carrierAgreementName.keyword';
  static getAgreementNameQuery(value: string) {
    return {
      'size': 6,
      '_source': [
        'AgreementName',
        'UltimateParentAccountCode'
      ],
      'query': {
        'bool': {
          'must': [
            {
              'multi_match': {
                'fields': [
                  'AgreementName'
                ],
                'query': `${value.replace(/[!?:\\["^~=\,.//\\{}&&||<>()+*\]]/g, '')}*`,
                'operator': 'and',
                'analyzer': 'standard'
              }
            },
            {
              'query_string': {
                'fields': [
                  this.statuKeyword
                ],
                'query': 'Completed'
              }
            }
          ]
        }
      },
      'aggs': {
        'group_by_description': {
          'terms': {
            'field': 'AgreementName.agg'
          }
        }
      }
    };
  }

  static getBillToQuery(value: string) {
    return {
      'size': 0,
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'fields': [
                  this.statuKeyword
                ],
                'query': 'Completed'
              }
            }
          ]
        }
      },
      'aggs': {
        'nesting': {
          'nested': {
            'path': 'SectionRanges.BillToCodes'
          },
          'aggs': {
            'by_BillingPartyCode': {
              'filter': {
                'bool': {
                  'must': [
                    {
                      'query_string': {
                        'fields': [
                          'SectionRanges.BillToCodes.billingPartyDisplayName.keyword'
                        ],
                        'query': `*${value.replace(/[!? :\\["^~=\,.//\\{}&&||<>()+*\]]/g, '\\$&')}*`,
                        'default_operator': 'and',
                        'use_dis_max': 'true'
                      }
                    }
                  ]
                }
              },
              'aggs': {
                'by_BillingPartyName': {
                  'terms': {
                    'field': 'SectionRanges.BillToCodes.BillingPartyName.key',
                    'size': 10
                  },
                  'aggs': {
                    'by_BillingPartyCode': {
                      'terms': {
                        'field': 'SectionRanges.BillToCodes.BillingPartyCode.key',
                        'size': 10
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

  static getTeamsQuery() {
    return {
      'size': 0,
      '_source': 'Teams.TeamName',
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'fields': [
                  this.statuKeyword
                ],
                'query': 'Completed'
              }
            },
            {
              'nested': {
                'path': 'Teams',
                'query': {
                  'bool': {
                    'must': [
                      {
                        'query_string': {
                          'default_field': 'Teams.TeamName',
                          'query': '*'
                        }
                      }
                    ]
                  }
                }
              }
            }]
        }
      },
      'aggs': {
        'nesting': {
          'nested': {
            'path': 'Teams'
          },
          'aggs': {
            'by_teamName': {
              'terms': {
                'field': 'Teams.TeamName.key',
                'size': 10
              }
            }
          }
        }
      }
    };
  }

  static getContractNameQuery(value: string) {
    return {
      'size': 0,
      '_source': 'ContractRanges.*',
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'fields': [
                  this.statuKeyword
                ],
                'query': 'Completed'
              }
            },
            {
              'nested': {
                'path': 'ContractRanges',
                'query': {
                  'bool': {
                    'should': [
                      {
                        'multi_match': {
                          'fields': [
                            this.contracName,
                            this.contracNumber,
                            this.displayName
                          ],
                          'query': `*${value.replace(/[!? :\\["^~=\,.//\\{}&&||<>()+*\]-]/g, '\\$&')}*`,
                          'operator': 'and',
                          'analyzer': 'standard'
                        }
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      },
      'aggs': {
        'nesting': {
          'nested': {
            'path': 'ContractRanges'
          },
          'aggs': {
            'by_contractName': {
              'terms': {
                'field': this.displayNameKeyword,
                'size': 10
              },
              'aggs': {
                'by_ContractNumber': {
                  'terms': {
                    'field': this.displayNameKeyword,
                    'size': 10
                  }
                }
              }
            }
          }
        }
      }
    };
  }

  static getContractNameWithHyphenQuery(contractNumber: string, contractName: string) {
    return {
      'size': 0,
      '_source': this.contracName,
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'fields': [
                  this.statuKeyword
                ],
                'query': 'Completed'
              }
            },
            {
              'bool': {
                'must': [
                  {
                    'nested': {
                      'path': 'ContractRanges',
                      'query': {
                        'query_string': {
                          'default_field': this.contracNameKeyword,
                          'query': `*${contractName.replace(/[!? :\\["^~=\,.//\\{}&&||<>()+*\]-]/g, '\\$&')}*`
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'ContractRanges',
                      'query': {
                        'query_string': {
                          'default_field': this.contracNumberKeyword,
                          'query': `*${contractNumber.replace(/[!? :\\["^~=\,.//\\{}&&||<>()+*\]-]/g, '\\$&')}*`
                        }
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      'aggs': {
        'nesting': {
          'nested': {
            'path': 'ContractRanges'
          },
          'aggs': {
            'by_contractName': {
              'terms': {
                'field': this.contracNameKeyword,
                'size': 10
              },
              'aggs': {
                'by_ContractNumber': {
                  'terms': {
                    'field': this.contracNumberKeyword,
                    'size': 10
                  }
                }
              }
            }
          }
        }
      }
    };
  }
  static getCarrierAgreementNameQuery(value: string) {
    return {
      'size': 25,
      '_source': [
        'carrierAgreementName'
      ],
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'agreementType.keyword',
                'query': 'Carrier',
                'default_operator': 'AND'
              }
            },
            {
              'query_string': {
                'default_field': AdvanceSearchQuery.carrierAgreementName,
                'query': `*${value.replace(/[!? :\\["^~=\,.//\\{}&&||<>()+*\]-]/g, '\\$&')}*`,
                'default_operator': 'AND'
              }
            },
            {
              'query_string': {
                'default_field': 'invalidIndicator',
                'query': '*'
              }
            },
            {
              'query_string': {
                'default_field': 'invalidReasonType.keyword',
                'query': '*'
              }
            }
          ]
        }
      },
      'sort': [
        {
          [AdvanceSearchQuery.carrierAgreementName]: {
            'order': 'asc'
          }
        }
      ]
    };
  }
 static getCarrierNameQuery(value: string) {
  return {
    'size': 0,
    '_source': [
      'carrierAgreementCarrierAssociation.carrierDisplayName'
    ],
    'aggs': {
      'nesting': {
        'nested': {
          'path': 'carrierAgreementCarrierAssociation'
        },
        'aggs': {
          'by_BillingPartyCode': {
            'filter': {
              'bool': {
                'must': [
                  {
                    'query_string': {
                      'fields': ['carrierAgreementCarrierAssociation.carrierDisplayName.keyword'],
                      'query': `*${value.replace(/[!? :\\["^~=\,.//\\{}&&||<>()+* \]-]/g, '\\$&')}*`,
                      'default_operator': 'and'
                    }
                  }
                ]
              }
            },
            'aggs': {
              'by_BillingPartyName': {
                'terms': {
                  'field': 'carrierAgreementCarrierAssociation.carrierDisplayName.keyword',
                  'size': 10,
                  'order': {
                    '_key': 'asc'
                  }
                },
                'aggs': {
                  'hits': {
                    'top_hits': {
                      'size': 1,
                      '_source': 'carrierAgreementCarrierAssociation.carrierDisplayName'
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
