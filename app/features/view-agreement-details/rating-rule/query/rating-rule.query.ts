import * as moment from 'moment';
export class RatingRuleQuery {
  static CitySubstitutionKeyword = 'CitySubstitutionValue.keyword';
  static RatingRuleExpirationDateKeyword = 'RatingRuleExpirationDate.keyword';
  static RatingRuleInvalidReasonTypeKeyword = 'RatingRuleInvalidReasonType.keyword';
  static dateFormat = 'dd/MM/yyyy||yyyy';
  static agreementDefaultIndicator = 'agreementDefaultIndicator.keyword';
  static citySubstitutionDisplayName = 'citySubstitutionDisplayName.keyword';
  static hazmatChargeRulesType = 'hazmatChargeRulesType.keyword';
  static congestionChargeType = 'congestionChargeType.keyword';
  static flatRateWithStopsType = 'flatRateWithStopsType.keyword';
  static contractAssociations = 'contractAssociations.contractDisplayName.keyword';

  static getRatingRuleListQuery(agreementID: number): object {
    return {
      'from': 0,
      'size': 25,
      '_source': '*',
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'customerAgreementID',
                'query': agreementID,
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
                            'default_field': 'invalidReasonTypeName.keyword',
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
                'should': [
                  {
                    'query_string': {
                      'fields': [
                        this.agreementDefaultIndicator,
                        this.citySubstitutionDisplayName,
                        this.hazmatChargeRulesType,
                        this.congestionChargeType,
                        this.flatRateWithStopsType,
                        'effectiveDate.keyword',
                        'expirationDate.keyword'
                      ],
                      'query': '*',
                      'default_operator': 'AND'
                    }
                  },
                  {
                    'nested': {
                      'path': 'contractAssociations',
                      'query': {
                        'query_string': {
                          'default_field': this.contractAssociations,
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'financeBusinessUnitServiceOfferingAssociations',
                      'query': {
                        'query_string': {
                          'default_field':
                            'financeBusinessUnitServiceOfferingAssociations.financeBusinessUnitServiceOfferingDisplayName.keyword',
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'sectionAssociations',
                      'query': {
                        'query_string': {
                          'default_field': 'sectionAssociations.customerAgreementContractSectionName.keyword',
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
              'bool': RatingRuleQuery.filterQuery()
            }
          ]
        }
      },
      'sort': [
        {
          'ratingRuleType.keyword': {
            'order': 'asc'
          }
        },
        {
          [this.agreementDefaultIndicator]: {
            'order': 'asc'
          }
        },
        {
          [this.contractAssociations]: {
            'order': 'asc',
            'nested': {
              'path': 'contractAssociations'
            },
            'missing': '_first'
          }
        },
        {
          'sectionAssociations.customerAgreementContractSectionName.keyword': {
            'order': 'asc',
            'nested': {
              'path': 'sectionAssociations'
            },
            'missing': '_first'
          }
        },
        {
          'financeBusinessUnitServiceOfferingAssociations.financeBusinessUnitServiceOfferingDisplayName.keyword': {
            'order': 'asc',
            'nested': {
              'path': 'financeBusinessUnitServiceOfferingAssociations'
            },
            'missing': '_first'
          }
        },
        {
          [this.citySubstitutionDisplayName]: {
            'order': 'asc'
          }
        },
        {
          [this.hazmatChargeRulesType]: {
            'order': 'asc'
          }
        },
        {
          [this.congestionChargeType]: {
            'order': 'asc'
          }
        },
        {
          [this.flatRateWithStopsType]: {
            'order': 'asc'
          }
        },
        {
          'effectiveDate': {
            'order': 'asc'
          }
        },
        {
          'expirationDate': {
            'order': 'asc'
          }
        }
      ]
    };
  }
  static filterQuery() {
    return {
      'must': [
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
            'default_field': this.agreementDefaultIndicator,
            'query': '*',
            'default_operator': 'AND'
          }
        },
        {
          'bool': {
            'must': [
              {
                'query_string': {
                  'default_field': this.citySubstitutionDisplayName,
                  'query': '*',
                  'default_operator': 'AND'
                }
              }
            ]
          }
        },
        {
          'query_string': {
            'default_field': this.hazmatChargeRulesType,
            'query': '*',
            'default_operator': 'AND'
          }
        },
        {
          'query_string': {
            'default_field': this.congestionChargeType,
            'query': '*',
            'default_operator': 'AND'
          }
        },
        {
          'query_string': {
            'default_field': this.flatRateWithStopsType,
            'query': '*',
            'default_operator': 'AND'
          }
        },
        {
          'range': {
            'effectiveDate': {
              'gte': '01/01/1995',
              'lte': '12/31/2099'
            }
          }
        },
        {
          'range': {
            'expirationDate': {
              'gte': '01/01/1995',
              'lte': '12/31/2099'
            }
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
        }
      ]
    };
  }
  static getCurrentDate(): string {
    const date = new Date();
    return moment(date).format('YYYY-MM-DD');
  }
  static getStatusQuery(key: string) {
    return {
      'bool': {
        'must': [
          {
            'range': {
              [RatingRuleQuery.RatingRuleExpirationDateKeyword]: {
                [key]: this.getCurrentDate(),
                'format': RatingRuleQuery.dateFormat
              }
            }
          },
          {
            'bool': {
              'must_not': [
                {
                  'query_string': {
                    'default_field': RatingRuleQuery.RatingRuleInvalidReasonTypeKeyword,
                    'query': 'Deleted'
                  }
                }
              ]
            }
          }
        ]
      }
    };
  }
  static getDeletedStatus() {
    return {
      'query_string': {
        'default_field': RatingRuleQuery.RatingRuleInvalidReasonTypeKeyword,
        'query': 'Deleted'
      }
    };
  }
  static getCitySubstitutionValue() {
    return {
      'query_string': {
        'default_field': 'citySubstitutionRadiusValue',
        'query': '*'
      }
    };
  }
}
