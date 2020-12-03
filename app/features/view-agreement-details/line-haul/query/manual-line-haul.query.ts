export class ManualLineHaulQuery {
  static getLineHaulQuery(agreementId: number, status: string, isReview: boolean,
    size: number, value?: string, createdUser?: string): object {
    value = (value && value.toLowerCase() === 'yes') ? 'true' : value;
    value = (value && value.toLowerCase() === 'no') ? 'false' : value;
    value = (value) ?
      `*${value.replace(/[!?:\\[''"^~=\//\\{},.&&||<>()+*\] ]/g, '\\$&')}*` : '*';
    const defaultQuery: object = {
      '_source': '*',
      'query': {
        'bool':
        {
          'must': [
            {
              'term': {
                'customerAgreementID': agreementId
              }
            },
            {
              'query_string': {
                'default_field': 'status',
                'query': status
              }
            },
            {
              'query_string': {
                'default_field': 'createdUserId',
                'query': (createdUser) ? createdUser : '*'
              }
            },
            {
              'bool': {
                'should': [{
                  'query_string': {
                    'fields': ManualLineHaulQuery.searchFields(),
                    'query': value,
                    'default_operator': 'AND'
                  }
                },
                {
                  'nested': {
                    'path': 'destination',
                    'query': {
                      'query_string': {
                        'fields': [
                          'destination.description.keyword',
                          'destination.vendorID.keyword'
                        ],
                        'query': value,
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'destination.points',
                    'query': {
                      'query_string': {
                        'fields': [
                          'destination.points.pointDisplayName.keyword'
                        ],
                        'query': value,
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'rates',
                    'query': {
                      'query_string': {
                        'fields': ['rates.rateDisplayAmount',
                          'rates.minDisplayAmount',
                          'rates.maxDisplayAmount',
                          'rates.chargeUnitTypeName.keyword',
                          'rates.currencyCode.keyword'],
                        'query': value,
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'stops',
                    'query': {
                      'query_string': {
                        'fields': ['stops.*'],
                        'query': value,
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'mileagePreference',
                    'query': {
                      'query_string': {
                        'fields': ['mileagePreference.mileagePreferenceName',
                          'mileagePreference.mileagePreferenceDisplayName'],
                        'query': value,
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'origin',
                    'query': {
                      'query_string': {
                        'fields': [
                          'origin.description.keyword',
                          'origin.vendorID.keyword'
                        ],
                        'query': value,
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'origin.points',
                    'query': {
                      'query_string': {
                        'fields': [
                          'origin.points.pointDisplayName.keyword'
                        ],
                        'query': value,
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'unitOfMeasurement',
                    'query': {
                      'query_string': {
                        'fields': ['unitOfMeasurement.description',
                          'unitOfMeasurement.weightRangeDisplayName'],
                        'query': value,
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'operationalServices',
                    'query': {
                      'query_string': {
                        'fields': ['operationalServices.serviceTypeDescription.keyword'],
                        'query': value,
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'billTos',
                    'query': {
                      'query_string': {
                        'fields': ['billTos.billingPartyDisplayName.keyword'],
                        'query': value,
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'carriers',
                    'query': {
                      'query_string': {
                        'fields': ['carriers.carrierDisplayName.keyword'],
                        'query': (value) ? `${value}*` : '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                }]
              }
            }
          ]
        }
      },
      'sort': this.getDefaultSortQuery(),
      'size': size,
      'from': 0
    };
    ManualLineHaulQuery.activeRecFetch(isReview, defaultQuery);
    return defaultQuery;
  }
  static getDefaultSortQuery() {
   return [{
      'customerAgreementContractSectionName.keyword': {
        'order': 'asc'
      }
    },
    {
      'effectiveDate': {
        'order': 'asc'
      }
    }];
  }
  static activeRecFetch(isReview: boolean, defaultQuery: object) {
    if (!isReview) {
      defaultQuery['query']['bool']['must'].push({
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
                      'default_field': 'recordStatus',
                      'query': 'active'
                    }
                  }
                ]
              }
            }
          ]
        }
      });
    }
  }
  static searchFields() {
    return ['customerAgreementContractDisplayName.keyword',
      'customerAgreementContractSectionName.keyword',
      'groupRateType.keyword',
      'groupRateItemizeIndicator.keyword',
      'financeBusinessUnitName.keyword',
      'serviceOfferingDescription.keyword',
      'transitMode.keyword',
      'serviceLevelCode.keyword',
      'equipmentClassificationCodeDescription.keyword',
      'equipmentTypeCodeDescription',
      'equipmentLengthDisplayName.keyword',
      'lineHaulAwardStatusTypeName.keyword',
      'priorityLevelNumber.keyword',
      'overiddenPriorityLevelNumber.keyword',
      'stopChargeIncludedIndicator.keyword',
      'hazmatIncludedIndicator.keyword',
      'fuelIncludedIndicator.keyword',
      'autoInvoiceIndicator.keyword',
      'lineHaulSourceTypeName.keyword',
      'sourceID.keyword',
      'sourceLineHaulID.keyword',
      'effectiveDate.keyword',
      'expirationDate.keyword',
      'stopChargeIncludedIndicator.keyword',
      'numberOfStops.keyword'];
  }

}
