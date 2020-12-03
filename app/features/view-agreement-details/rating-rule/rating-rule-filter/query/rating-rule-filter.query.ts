export class RatingRuleFilterQuery {
  /* query to fetch selected list Items */
  static getContractsQuery(agreementID: number): object {
    return {
      'size': 0,
      '_source': [
        'contractAssociations.contractDisplayName'
      ],
      'query': {
        'query_string': {
          'default_field': 'customerAgreementID',
          'query': agreementID
        }
      },
      'aggs': {
        'nesting': {
          'nested': {
            'path': 'contractAssociations'
          },
          'aggs': {
            'by_contract': {
              'filter': {
                'bool': {
                  'must': [
                    {
                      'query_string': {
                        'fields': ['contractAssociations.contractDisplayName.keyword'],
                        'query': '**',
                        'default_operator': 'AND'
                      }
                    }
                  ]
                }
              },
              'aggs': {
                'contract': {
                  'terms': {
                    'field': 'contractAssociations.contractDisplayName.keyword',
                    'size': 10,
                    'order': {
                      '_key': 'asc'
                    }
                  },
                  'aggs': {
                    'hits': {
                      'top_hits': {
                        'size': 1,
                        '_source': 'contractAssociations.contractDisplayName'
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

  /* query to fetch status */
  static getSectionsQuery(agreementID: number): object {
    const contractsQuery = this.getContractsQuery(agreementID);
    contractsQuery['_source'] = [
      'sectionAssociations.customerAgreementContractSectionName'
    ];
    contractsQuery['aggs'] = {
      'nesting': {
        'nested': {
          'path': 'sectionAssociations'
        },
        'aggs': {
          'by_sec': {
            'filter': {
              'bool': {
                'must': [
                  {
                    'query_string': {
                      'fields': ['sectionAssociations.customerAgreementContractSectionName.keyword'],
                      'query': '**',
                      'default_operator': 'AND'
                    }
                  }
                ]
              }
            },
            'aggs': {
              'section': {
                'terms': {
                  'field': 'sectionAssociations.customerAgreementContractSectionName.keyword',
                  'size': 10,
                  'order': {
                    '_key': 'asc'
                  }
                },
                'aggs': {
                  'hits': {
                    'top_hits': {
                      'size': 1,
                      '_source': 'sectionAssociations.customerAgreementContractSectionName'
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    return contractsQuery;
   }
}
