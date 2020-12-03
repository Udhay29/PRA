export class SearchGridQuery {
  static agreementName = 'AgreementName.aux';
  static sectionRangesBillToCodes = 'SectionRanges.BillToCodes';
  searchQuery: object;
  queryStructure: object;
  findKeyString: object;
  findkeyCarrierString: object;
  constructor() {
    this.searchQuery = {
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

            }]
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
      'size': 25

    };
    this.findKeyString = {
      'agreementType': 'value',
      'agreement': 'AgreementName',
      'contract': 'ContractName',
      'billTo': 'PartyCode',
      'codeStatus': 'value',
      'operationalTeam': 'value',
      'agreementStatus': 'value'
    };
    this.findkeyCarrierString = {
      'agreementType': 'value',
      'carrierStatus': 'value',
      'carrierAgreement': 'CarrierAgreementName',
      'carrier': 'CarrierName',
      'CarrierAgreementStatus': 'value'
    };
  }
  static getQueryStructure(formName: string, value: string, range?: string) {
    const queryStructure = {
      'agreementType': {
        'bool': {
          'should': [
            {
              'query_string': {
                'default_field': 'AgreementType.keyword',
                'query': value
              }
            }
          ]
        }
      },
      'agreement': {
        'bool': {
          'should': [
            {
              'query_string': {
                'default_field': SearchGridQuery.agreementName,
                'query': `${value.replace(/[!?:\\['^~=\//\\{},.&&||<>()+*\]\-]/g, '\\$&')}`,
                'split_on_whitespace': 'false'
              }
            }
          ]
        }
      },
      'contract': {
        'nested': {
          'path': 'ContractRanges',
          'query': {
            'bool': {
              'must': [
              ]
            }
          }
        }
      },
      'billTo': {
        'nested': {
          'path': SearchGridQuery.sectionRangesBillToCodes,
          'query': {
            'bool': {
              'should': [
                {
                  'query_string': {
                    'default_field': 'SectionRanges.BillToCodes.BillingPartyCode.keyword',
                    'query': `${value.replace(/[!?:\\['^~=\//\\{},.&&||<>()+*\]]/g, '\\$&')}`,
                    'split_on_whitespace': 'false'
                  }
                }
              ]
            }
          }
        }
      },
      'codeStatus': {
        'active': {
          'nested': {
            'path': SearchGridQuery.sectionRangesBillToCodes,
            'query': {
              'bool': {
                'should': [
                  {
                    'range': {
                      'SectionRanges.BillToCodes.BillToExpirationDate': {
                        'gte': value
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        'inactive': {
          'nested': {
            'path': SearchGridQuery.sectionRangesBillToCodes,
            'score_mode': 'max',
            'query': {
              'bool': {
                'should': [
                  {
                    'range': {
                      'SectionRanges.BillToCodes.BillToExpirationDate': {
                        'lt': value
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        'all': {
          'nested': {
            'path': SearchGridQuery.sectionRangesBillToCodes,
            'score_mode': 'max',
            'query': {
              'bool': {
              }
            }
          }
        },
      },
      'operationalTeam': {
        'nested': {
          'path': 'Teams',
          'score_mode': 'max',
          'query': {
            'bool': {
              'should': [
                {
                  'query_string': {
                    'default_field': 'Teams.TeamName.keyword',
                    'query': `${value.replace(/[!?:\\['^~=\//\\{},.&&||<>()+*\]]/g, '\\$&')}`,
                    'split_on_whitespace': 'false'
                  }
                }
              ]
            }
          }
        }
      },
      'agreementStatus': {
        'active': {
          'bool': {
            'should': [
              {
                'range': {
                  'AgreementExpirationDate': {
                    'gte': value
                  }
                }
              }
            ]
          }
        },
        'inactive': {
          'bool': {
            'should': [
              {
                'range': {
                  'AgreementExpirationDate': {
                    'lt': value
                  }
                }
              }
            ]
          }
        },
        'all': {
          'bool': {}
        },
      }
    };

    if (range) {
      return queryStructure[formName][range];
    }
    return queryStructure[formName];
  }
  static getCarrierSearchQuery() {
    return {
      'size': 25,
      '_source': [
        'agreementType',
        'carrierAgreementName',
        'carrierAgreementID',
        'carrierAgreementCarrierAssociation.*'
      ],
      'collapse': {
        'field': 'carrierAgreementName.keyword'
      },
      'script_fields': {
        'Status': {
          'script': {
            'lang': 'painless',
            'source': `def x = [];def sfn = new SimpleDateFormat('yyyy/MM/dd');\n
            def today = new Date();def todayDate = sfn.parse(sfn.format(today));\n
            def sf=new SimpleDateFormat('MM/dd/yyyy');def expire=sf.parse(doc['expirationDate.keyword'].value);\n
            if((expire.after(todayDate) || expire.equals(todayDate)) && doc['invalidIndicator'].value == 'N' &&\n
             doc['invalidReasonType.keyword'].value == 'Active'){x.add('Active')}else if((expire.before(todayDate) &&\n
              doc['invalidIndicator'].value == 'Y' && doc['invalidReasonType.keyword'].value == 'InActive') ||\n
               (expire.before(todayDate) && doc['invalidIndicator'].value == 'N' &&\n
                doc['invalidReasonType.keyword'].value == 'InActive') ||\n
                 (expire.before(todayDate) && doc['invalidIndicator'].value == 'N' &&\n
                  doc['invalidReasonType.keyword'].value == 'Active'))\n
                  {x.add('Inactive')}else if(doc['invalidIndicator'].value == 'Y' &&\n
                   doc['invalidReasonType.keyword'].value == 'Deleted'){x.add('Deleted')}return x`
          }
        }
      },
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
                'default_field': 'carrierAgreementName.keyword',
                'query': '**',
                'default_operator': 'AND'
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
                'default_field': 'invalidReasonType.keyword',
                'query': 'Active'
              }
            },
            {
              'nested': {
                'path': 'carrierAgreementCarrierAssociation',
                'query': {
                  'bool': {
                    'must': [
                      {
                        'query_string': {
                          'fields': [
                            'carrierAgreementCarrierAssociation.carrierDisplayName.keyword'
                          ],
                          'query': '**',
                          'default_operator': 'AND'
                        }
                      },
                      {
                        'query_string': {
                          'default_field': 'carrierAgreementCarrierAssociation.invalidIndicator',
                          'query': 'N'
                        }
                      },
                      {
                        'query_string': {
                          'default_field': 'carrierAgreementCarrierAssociation.invalidReasonType.keyword',
                          'query': 'Active'
                        }
                      }
                    ]
                  }
                },
                'inner_hits': {
                }
              }
            }
          ]
        }
      },
      'sort': [
      ]
    };
  }
}
