import { QueryMock } from '../models/view-mileage.interface';
import * as moment from 'moment';
const sectionAssociation = 'customerMileageProgramSectionAssociations.customerAgreementContractSectionName.keyword';
const contractAssociation = 'customerMileageProgramContractAssociations.customerContractDisplayName.keyword';
export class ViewMileageQuery {
  static viewMileageGridQuery(sourceData: QueryMock, agreementID: string, from: number, size: number) {
    return {
      'from': from,
      'size': size,
      '_source': [],
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
                'default_field': 'agreementID',
                'query': `${agreementID}`
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
                            'default_field': 'invalidReasonType',
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
                'must': [
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
            },
            {
              'bool': this.getMileageSearchQuery()
            },
            {
              'bool': {
                'must': [
                ]
              }
            }, {
              'bool': {
                'must': [
                ]
              }
            }, {
              'bool': {
                'must': [
                ]
              }
            }, {
              'bool': {
                'must': [
                ]
              }
            }, {
              'bool': {
                'must': [
                ]
              }
            }, {
              'bool': {
                'must': [
                ]
              }
            }, {
              'bool': {
                'must': [
                ]
              }
            }, {
              'bool': {
                'must': [
                ]
              }
            }, {
              'bool': {
                'must': [
                ]
              }
            }, {
              'bool': {
                'must': [
                ]
              }
            }, {
              'bool': {
                'must': [
                ]
              }
            }, {
              'bool': {
                'must': [
                ]
              }
            }, {
              'bool': {
                'must': [
                ]
              }
            }, {
              'bool': {
                'must': [
                ]
              }
            }, {
              'bool': {
                'must': [
                ]
              }
            }, {
              'bool': {
                'must': [
                ]
              }
            }
          ]
        }
      },
      'sort': [
        {
          'mileageProgramType': {
            'order': 'asc'
          }
        }
      ]
    };
  }
  static getMileageSearchQuery(): object {
    return {
      'should': [
        {
          'query_string': this.searchFiledQuery()
        },
        {
          'nested': {
            'path': 'customerMileageProgramContractAssociations',
            'query': {
              'query_string': {
                'default_field': contractAssociation,
                'query': '*',
                'default_operator': 'AND'
              }
            },
            'inner_hits': {
              'sort': {
                [contractAssociation]: {
                  'order': 'asc'
                }
              }
            }
          }
        },
        {
          'nested': {
            'path': 'customerMileageProgramBusinessUnits',
            'query': {
              'query_string': {
                'default_field': 'customerMileageProgramBusinessUnits.financeBusinessUnitCode.keyword',
                'query': '*',
                'default_operator': 'AND'
              }
            },
            'inner_hits': {
              'sort': {
                'customerMileageProgramBusinessUnits.financeBusinessUnitCode.keyword': {
                  'order': 'asc'
                }
              }
            }
          }
        },
        {
          'nested': {
            'path': 'customerMileageProgramCarrierAssociations',
            'query': {
              'query_string': {
                'default_field': 'customerMileageProgramCarrierAssociations.carrierDisplayName.keyword',
                'query': '*',
                'default_operator': 'AND'
              }
            },
            'inner_hits': {
              'sort': {
                'customerMileageProgramCarrierAssociations.carrierDisplayName.keyword': {
                  'order': 'asc'
                }
              }
            }
          }
        },
        {
          'nested': {
            'path': 'mileageSystemParameters',
            'query': {
              'bool': {
                'should': [
                  {
              'query_string': {
                'default_field': 'mileageSystemParameters.mileageSystemParameterName.keyword',
                'query': '*',
                'default_operator': 'AND'
              }
                  }
                ],
                'must_not': [
                  {
              'query_string': {
                'default_field': 'mileageSystemParameters.mileageParameterSelectIndicator',
                'query': 'N',
                'default_operator': 'AND'
              }
                  }
                ]
              }
            },
            'inner_hits': {
              'sort': {
                'mileageSystemParameters.mileageSystemParameterName.keyword': {
                  'order': 'asc'
                }
              }
            }
          }
        },
        {
          'nested': {
            'path': 'customerMileageProgramSectionAssociations',
            'query': {
              'query_string': {
                'default_field': sectionAssociation,
                'query': '*',
                'default_operator': 'AND'
              }
            },
            'inner_hits': {
              'sort': {
                [sectionAssociation]: {
                  'order': 'asc'
                }
              }
            }
          }
        }
      ]
    };
  }
  static getCurrentDate(): string {
    const date = new Date();
    return moment(date).format('MM/DD/YYYY');
  }
  static getStatusQuery(range, invalidIndicatorVlaue, invalidReasonTypeValue): Object {
    return {
      'bool': {
        'must': [
          this.getExpirationDateRange(range),
          this.getQueryString('invalidIndicator', invalidIndicatorVlaue),
          this.getQueryString('invalidReasonType', invalidReasonTypeValue)
        ]
      }
    };
  }
  static getQueryString(defaultFieldName: string, query: string) {
    return {
      'query_string': {
        'default_field': `${defaultFieldName}`,
        'query': `${query}`
      }
    };
  }
  static getExpirationDateRange(key: string) {
    return {
      'range': {
        'expirationDate': {
          [key]: this.getCurrentDate()
        }
      }
    };
  }
  static getDeletedRecords(invalidIndicator, reasonType): Object {
    return {
      'bool': {
        'must': [
          this.getQueryString('invalidIndicator', invalidIndicator),
          this.getQueryString('invalidReasonType', reasonType)
        ]
      }
    };
  }
  static searchFiledQuery(): Object {
    return {
      'fields': [
        'mileageProgramName.keyword',
        'agreementDefaultIndicator.keyword',
        'mileageSystemName.keyword',
        'mileageSystemVersionName.text',
        'unitOfDistanceMeasurementCode.keyword',
        'geographyType.keyword',
        'mileageRouteTypeName.keyword',
        'mileageCalculationTypeName.keyword',
        'decimalPrecisionIndicator.keyword',
        'mileageBorderMileParameterTypeName.keyword',
        'effectiveDate.keyword',
        'expirationDate.keyword',
        'mileageProgramNoteText.keyword'
      ],
      'query': '*',
      'default_operator': 'AND'
    };
  }
  static statusSortQuery(sourceData): Object {
    return {
      '_script': {
        'script': {
          'lang': 'painless',
          'source': sourceData.statusSourceData
        },
        'order': 'asc',
        'type': 'string'
      }
    };
  }
  static systemParameterNestedQuery() {
    return {
      'path' : 'mileageSystemParameters',
      'filter': {
        'term' : { 'mileageSystemParameters.mileageParameterSelectIndicator' : 'Y' }
      }
    };
  }
}
