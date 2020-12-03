import * as utils from 'lodash';

export class ContractsFilterQuery {

  static statuKeyword = 'AgreementStatus.keyword';

  /* query to fetch ContractID, ContractDescription & createdBy */
  static getContractNameQuery(keyVal: string, agreementID: number) {
    return {
      '_source': [
        `ContractRanges.${keyVal}`
      ],
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'AgreementID.keyword',
                'query': agreementID
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
                            `ContractRanges.${keyVal}`
                          ],
                          'query': 'search-query-text',
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
      'collapse': {
        'field': `ContractRanges.${keyVal}.keyword`
      },
      'from': 0,
      'size': 25,
    };
  }

  /* query to fetch lastUpdateProgram, updatedBy */
  static getListData(keyVal: string, agreementID: number) {
    return {
      '_source': [
        `ContractRanges.${keyVal}`
      ],
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'AgreementID.keyword',
                'query': agreementID
              }
            }
          ]
        }
      },
      'collapse': {
        'field': `ContractRanges.${keyVal}.keyword`
      },
      'from': 0,
      'size': 25,
    };
  }

  /* query to fetch selected list Items */
  static getFilterQuery(keyVal: string, value: string): object {
    return {
      'query_string': {
        'default_field': `ContractRanges.${keyVal}.keyword`,
        'query': `${value.replace(/[!?:\\["^~=\//\\{}&& ||<>()+*\]-]/g, '\\$&')}*`,
        'split_on_whitespace': 'false'
      }
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

  /* query to fetch effective & Expiration date */
  static getDateQuery(keyVal: string, value: string, criteriaVal: string, matchFlag, rangeFlag): object {
    const dateQuery = { 'range': {} };
    dateQuery['range'][keyVal] = {};
    if (!matchFlag && rangeFlag) {
      dateQuery['range'][keyVal][criteriaVal] = value;
      } else {
      dateQuery['range'][keyVal]['lte'] = value;
      dateQuery['range'][keyVal]['gte'] = value;
      }
    return dateQuery;
  }

  /* query to fetch lastupdated date */
  static getlastUpdatedDateOnly(dateValueStart: string, dateValueEnd?: string) {
    return [
      {
          'range': {
            'ContractRanges.LastUpdateTimestamp': {
              'gte': `${dateValueStart}`
            }
          }
        },
        {
          'range': {
            'ContractRanges.LastUpdateTimestamp': {
              'lte': (dateValueEnd) ? `${dateValueEnd}` : `${dateValueStart}`
            }
          }
        }
    ];
  }

 /* query to fetch lastupdated date & time*/
  static getLastUpdateTimestamp(dateValue: string) {
    return [
      {
          'range': {
            'ContractRanges.LastUpdateTimestamp': {
              'gte': dateValue
            }
          }
        },
        {
          'range': {
            'ContractRanges.LastUpdateTimestamp': {
              'lte': dateValue
            }
          }
        }
    ];
  }

  /* query to fetch created date */
  static getCreateTimestampDateOnly(dateValueStart: string, dateValueEnd?: string) {
    return [
      {
          'range': {
            'ContractRanges.CreateTimestamp': {
              'gte': `${dateValueStart}`
            }
          }
        },
        {
          'range': {
            'ContractRanges.CreateTimestamp': {
              'lte': (dateValueEnd) ? `${dateValueEnd}` : `${dateValueStart}`
            }
          }
        }
    ];
  }

  /* query to fetch created date & time */
  static getCreateTimestamp(dateValue: string) {
    return [
      {
          'range': {
            'ContractRanges.CreateTimestamp': {
              'gte': dateValue
            }
          }
        },
        {
          'range': {
            'ContractRanges.CreateTimestamp': {
              'lte': dateValue
            }
          }
        }
    ];
  }
}
