import { QueryMock } from '../model/carrier-mileage.interface';
import * as moment from 'moment';
const sectionAssociation = 'sectionAssociations.sectionName.keyword';
const contractAssociation = 'contractAssociations.contractDisplayName.keyword';
export class ViewCarrierMileageQuery {
  static viewCarrierMileageGridQuery(sourceData: QueryMock, agreementID: string, from: number, size: number) {
    return {
      'from': from,
      'size': size,
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
                'default_field': 'carrierAgreementID',
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
                'should': [
                  {
                    'query_string': this.searchFiledQuery()
                  },
                  {
                    'nested': {
                      'path': 'billToAccountsAssociations',
                      'query': {
                        'query_string': {
                          'default_field': 'billToAccountsAssociations.billToAccountName.keyword',
                          'query': '*'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'carrierAssociations',
                      'query': {
                        'query_string': {
                          'fields': [
                            'carrierAssociations.carrierName.keyword'
                          ],
                          'query': '*'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'mileageSystemParameterAssociations',
                      'query': {
                        'query_string': {
                          'fields': [
                            'mileageSystemParameterAssociation.mileageSystemParameterName.keyword'
                          ],
                          'query': '*'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'sectionAssociations',
                      'query': {
                        'query_string': {
                          'fields': [
                            'sectionAssociations.sectionName.keyword'
                          ],
                          'query': '*'
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
      'sort': [
        {
          'carrierMileageProgramID': {
            'order': 'desc'
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
  static getDeletedRecords(): Object {
    return {
      'bool': {
        'must': [
          this.getQueryString('invalidIndicator', 'Y'),
          this.getQueryString('invalidReasonType', 'Deleted')
        ]
      }
    };
  }
  static searchFiledQuery(): Object {
    return {
      'fields': [
        'carrierSegmentTypeName.keyword',
        'carrierMileageProgramName',
        'financeBusinessUnitCode.keyword',
        'carrierMileageProgramName.keyword',
        'mileageSystemName.keyword',
        'mileageSystemVersionName.keyword',
        'distanceUnit.keyword',
        'geographyType.keyword',
        'routeType.keyword',
        'calculationType.keyword',
        'decimalPrecision.keyword',
        'borderMilesParameter.keyword',
        'effectiveDate.keyword',
        'expirationDate.keyword',
        'programNote.keyword',
        'originalEffectiveDate.keyword',
        'originalExpirationDate.keyword',
        'createdBy.keyword',
        'createdOn.keyword',
        'createdProgramName.keyword',
        'updatedBy.keyword',
        'updatedOn.keyword',
        'updatedProgramName.keyword',
        'copyIndicator.keyword',
        'status.keyword'
      ],
      'query': '*'
    };
  }
}
