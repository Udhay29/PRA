export class StandardRateViewQuery {
  static chargeType = 'chargeTypeName.keyword';
  static equipmentCategory = 'equipmentClassificationCode.keyword';
  static equipmentType = 'equipmentClassificationTypeAssociationCode.keyword';
  static stairRateArray = [
    'customerAccessorialRateStairStepCharge.customerAccessorialRateStairSteps.stairStepRateAmountDisplayName',
    'customerAccessorialRateStairStepCharge.customerAccessorialRateStairSteps.fromQuantity.keyword',
    'customerAccessorialRateStairStepCharge.customerAccessorialRateStairSteps.toQuantity.keyword'
  ];
  static getRateGridQuery(rateQuery: object, searchText: string) {
    searchText = (searchText && searchText.toLowerCase() === 'yes') ? 'true' : searchText;
    searchText = (searchText && searchText.toLowerCase() === 'no') ? 'false' : searchText;
    searchText = searchText ? searchText.trim() : searchText;
    searchText = searchText ? searchText.replace(/[$]/g, '') : searchText;
    searchText = (searchText) ?
      `${'*'}${searchText.replace(/[!"?:\\['^~=\//\\{}, -.&&||<>()+*\] ]/g, '\\$&')}*` : '*';
    return {
      'from': rateQuery ? rateQuery['from'] : 0,
      'size': rateQuery ? rateQuery['size'] : 25,
      '_source': [
        '*'
      ],
      'query': {
        'bool': {
          'must_not': [
            {
              'exists': {
                'field': 'customerAgreementId'
              }
            }
          ],
          'must': [
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
                            'default_field': 'status.keyword',
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
                'should': this.initialStandardRate(searchText)
              }
            }
          ],
          'should': []
        }
      },
      sort: this.getInitialSortFields()
    };
  }
  static initialStandardRate(searchText: string) {
    const carrierDisplayName = 'customerAccessorialCarriers.carrierDisplayName.keyword';
    const requestedService = 'customerAccessorialRequestServices.requestedServiceTypeCode.keyword';
    const buSO = 'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnitDisplayName.keyword';
    return [
      {
        'query_string': {
          'fields': this.initialFields(),
          'query': searchText,
          'default_operator': 'AND'
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialAccounts',
          'query': {
            'query_string': {
              'fields': ['customerAccessorialAccounts.customerAgreementContractName.keyword',
                'customerAccessorialAccounts.customerAgreementContractSectionName.keyword',
                'customerAccessorialAccounts.customerAgreementContractSectionAccountName.keyword'],
              'query': searchText,
              'default_operator': 'AND'
            }
          },
          'inner_hits': {
            'sort': {
              'customerAccessorialAccounts.customerAgreementContractName.keyword': {
                'order': 'asc'
              }
            }
          }
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings',
          'query': {
            'query_string': {
              'fields': [
                buSO,
                'customerAccessorialServiceLevelBusinessUnitServiceOfferings.serviceLevel.keyword'
              ],
              'query': searchText,
              'default_operator': 'AND'
            }
          },
          'inner_hits': {
            'sort': {
              [buSO]: {
                'order': 'asc'
              }
            }
          }
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialRequestServices',
          'query': {
            'query_string': {
              'fields': [
                requestedService
              ],
              'query': searchText,
              'default_operator': 'AND'
            }
          },
          'inner_hits': {
            'sort': {
              [requestedService]: {
                'order': 'asc'
              }
            }
          }
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialCarriers',
          'query': {
            'query_string': {
              'fields':
                [carrierDisplayName],
              'query': searchText,
              'default_operator': 'AND'
            }
          },
          'inner_hits': {
            'sort': {
              [carrierDisplayName]: {
                'order': 'asc'
              }
            }
          }
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialRateCharges',
          'query': {
            'query_string': {
              'fields': this.rateValues(),
              'query': searchText,
              'default_operator': 'AND'
            }
          },
          'inner_hits': {
            'sort': {
              'customerAccessorialRateCharges.accessorialRateTypeName.keyword': {
                'order': 'asc'
              }
            }
          }
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialRateStairStepCharge',
          'query': {
            'query_string': {
              'fields': this.stairRate(),
              'query': searchText,
              'default_operator': 'AND'
            }
          },
          'inner_hits': {
            'sort': {
              'customerAccessorialRateStairStepCharge.accessorialRateTypeName.keyword': {
                'order': 'asc'
              }
            }
          }
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialRateStairStepCharge.customerAccessorialRateStairSteps',
          'query': {
            'query_string': {
              'fields': this.stairRateAmount(),
              'query': searchText,
              'default_operator': 'AND'
            }
          },
          'inner_hits': {
            'sort': {
              'customerAccessorialRateStairStepCharge.customerAccessorialRateStairSteps.stairStepRateAmount': {
                'order': 'asc'
              }
            }
          }
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialRateAdditionalCharges',
          'query': {
            'query_string': {
              'fields': [
                'customerAccessorialRateAdditionalCharges.accessorialRateTypeName.keyword',
                'customerAccessorialRateAdditionalCharges.additionalChargeTypeDisplayName.keyword',
                'customerAccessorialRateAdditionalCharges.additionalRateAmount.keyword'
              ],
              'query': searchText,
              'default_operator': 'AND'
            }
          },
          'inner_hits': {
            'sort': {
              'customerAccessorialRateAdditionalCharges.accessorialRateTypeName.keyword': {
                'order': 'asc'
              }
            }
          }
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialRateAlternateCharge',
          'query': {
            'query_string': {
              'fields': this.alternateCharge(),
              'query': searchText,
              'default_operator': 'AND'
            }
          },
          'inner_hits': {
            'sort': {
              'customerAccessorialRateAlternateCharge.accessorialRateAlternateChargeQuantityTypeName.keyword': {
                'order': 'asc'
              }
            }
          }
        }
      }
    ];
  }
  static alternateCharge() {
    return [
      'customerAccessorialRateAlternateCharge.accessorialRateAlternateChargeQuantityTypeName.keyword',
      'customerAccessorialRateAlternateCharge.alternateChargeTypeName.keyword',
      'customerAccessorialRateAlternateCharge.customerAlternateChargeThresholdQuantity.keyword'
    ];
  }
  static getInitialSortFields() {
    const carrierDisplayName = 'customerAccessorialCarriers.carrierDisplayName.keyword';
    const requestedService = 'customerAccessorialRequestServices.requestedServiceTypeCode.keyword';
    const buSO = 'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnitDisplayName.keyword';

    return [
      {
        [this.chargeType]: {
          'order': 'asc'
        },
        [buSO]: {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings'
          }
        },
        [carrierDisplayName]: {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialCarriers'
          }
        },
        'customerAccessorialServiceLevelBusinessUnitServiceOfferings.serviceLevel.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings'
          }
        },
        [requestedService]: {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialRequestServices'
          }
        },
        [this.equipmentCategory]: {
          'order': 'asc',
          'missing': '_first'
        },
        [this.equipmentType]: {
          'order': 'asc',
          'missing': '_first'
        },
        'equipmentRequirementSpecificationAssociationId': {
          'order': 'asc',
          'missing': '_first'
        },
        'currencyCode.keyword': {
          'order': 'asc',
          'missing': '_first'
        }
      }
    ];
  }
  static getRootFields() {
    return [
      'effectiveDate.text',
      'expirationDate.text',
      'invalidIndicator',
       this.chargeType,
      'chargeTypeCode.keyword',
      'customerChargeName.keyword',
      'currencyCode',
       this.equipmentCategory,
       this.equipmentType,
      'rateItemizeIndicator',
      'documentLegalDescription.keyword',
      'documentInstructionalDescription.keyword',
      'documentFileNames',
      'hasAttachment',
      'createdDate.text',
      'createdBy',
      'lastUpdatedDate.text',
      'lastUpdatedBy',
      'equipmentLengthDescription',
      'waived',
      'calculateRateManually',
      'passThrough',
      'rateSetupStatus',
      'accessorialGroupTypeName'];
  }
  static stairRate() {
    return [
      'customerAccessorialRateStairStepCharge.accessorialRateTypeName.keyword',
      'customerAccessorialRateStairStepCharge.accessorialRateRoundingTypeName.keyword',
      'customerAccessorialRateStairStepCharge.maximumAmountDisplayName',
      'customerAccessorialRateStairStepCharge.minimumAmountDisplayName',
      'customerAccessorialRateStairStepCharge.accessorialMaximumRateApplyTypeName.keyword'
    ];
  }
  static stairRateAmount() {
    return this.stairRateArray;
  }
  static initialFields() {
    return [
      this.chargeType, this.equipmentCategory, this.equipmentType, 'equipmentLengthDescription.keyword', 'waived.keyword',
      'currencyCode.keyword', 'calculateRateManually.keyword', 'passThrough.keyword', 'rateSetupStatus.keyword',
      'effectiveDate.keyword', 'expirationDate.keyword', 'createdDate.keyword', 'createdBy.keyword',
      'lastUpdatedDate.keyword', 'lastUpdatedBy.keyword', 'documentLegalDescription.keyword',
      'documentInstructionalDescription.keyword', 'hasAttachment.keyword', 'rateItemizeIndicator.keyword',
      'chargeTypeCode.keyword', 'customerChargeName.keyword', 'documentFileNames.keyword',
      'accessorialGroupTypeName.keyword'
    ];
  }
  static rateValues() {
    return [
      'customerAccessorialRateCharges.accessorialRateTypeName.keyword',
      'customerAccessorialRateCharges.accessorialRateRoundingTypeName.keyword',
      'customerAccessorialRateCharges.rateAmount.keyword',
      'customerAccessorialRateCharges.rateOperator.keyword',
      'customerAccessorialRateCharges.minimumAmount.keyword',
      'customerAccessorialRateCharges.maximumAmount.keyword'
    ];
  }
}
