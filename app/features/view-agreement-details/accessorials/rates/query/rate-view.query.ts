export class RateViewQuery {
  static stairStepRateArray = [
    'customerAccessorialRateStairStepCharge.customerAccessorialRateStairSteps.stairStepRateAmountDisplayName',
    'customerAccessorialRateStairStepCharge.customerAccessorialRateStairSteps.fromQuantity.keyword',
    'customerAccessorialRateStairStepCharge.customerAccessorialRateStairSteps.toQuantity.keyword'
  ];
  static additionalChargeArray = [
    'customerAccessorialRateAdditionalCharges.accessorialRateTypeName.keyword',
    'customerAccessorialRateAdditionalCharges.additionalChargeTypeDisplayName.keyword',
    'customerAccessorialRateAdditionalCharges.additionalRateAmount.keyword'
  ];
  static alternateChargeArray = [
    'customerAccessorialRateAlternateCharge.accessorialRateAlternateChargeQuantityTypeName.keyword',
    'customerAccessorialRateAlternateCharge.alternateChargeTypeName.keyword',
    'customerAccessorialRateAlternateCharge.customerAlternateChargeThresholdQuantity.keyword'
  ];
  static getRateGridQuery(rateQuery: object, agreementId: number) {
    return {
      'from': rateQuery ? rateQuery['from'] : 0,
      'size': rateQuery ? rateQuery['size'] : 25,
      '_source': [
        '*'
      ],
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'customerAgreementId',
                'query': agreementId,
                'default_operator': 'AND'
              }
            },
            {
              'bool': {
                'should': this.initialRateCondition(rateQuery)
              }
            },
            {
              'bool': {
                'should': this.initialRateArray()
              }
            }
          ],
          'should': []
        }
      },
      'sort': this.initialSort()
    };
  }

  static rateArray() {
    return [
      'customerAccessorialRateCharges.accessorialRateTypeName.keyword',
      'customerAccessorialRateCharges.accessorialRateRoundingTypeName.keyword',
      'customerAccessorialRateCharges.rateAmount.keyword',
      'customerAccessorialRateCharges.rateOperator.keyword',
      'customerAccessorialRateCharges.minimumAmount.keyword',
      'customerAccessorialRateCharges.maximumAmount.keyword'
    ];
  }
  static initialRateArray() {
    return [
      {
        'query_string': {
          'fields': this.intitalFields(),
          'query': '*',
          'default_operator': 'AND'
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialAccounts',
          'query': {
            'query_string': {
              'fields': this.contractSectionArray(),
              'query': '*',
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
              'fields': this.buSO(),
              'query': '*',
              'default_operator': 'AND'
            }
          },
          'inner_hits': {
            'sort': {
              'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnitDisplayName.keyword': {
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
              'fields': ['customerAccessorialRequestServices.requestedServiceTypeCode.keyword'],
              'query': '*',
              'default_operator': 'AND'
            }
          },
          'inner_hits': {
            'sort': {
              'customerAccessorialRequestServices.requestedServiceTypeCode.keyword': {
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
              'fields': ['customerAccessorialCarriers.carrierDisplayName.keyword'],
              'query': '*',
              'default_operator': 'AND'
            }
          },
          'inner_hits': {
            'sort': {
              'customerAccessorialCarriers.carrierDisplayName.keyword': {
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
              'fields': this.rateArray(),
              'query': '*',
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
              'fields': this.stairRateArray(),
              'query': '*',
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
              'fields': this.stairStepRate(),
              'query': '*',
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
              'fields': this.rateAdditionalCharge(),
              'query': '*',
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
              'fields': this.rateAlternateCharge(),
              'query': '*',
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
  static initialSort() {
    return [
      {
        'chargeTypeName.keyword': {
          'order': 'asc'
        },
        'customerAccessorialAccounts.customerAgreementContractSectionName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialAccounts'
          }
        }
      }
    ];
  }
  static intitalFields() {
    return [
      'chargeTypeName.keyword', 'equipmentClassificationCode.keyword', 'equipmentClassificationTypeAssociationCode.keyword',
      'passThrough.keyword', 'accessorialGroupTypeName.keyword',
      'equipmentLengthDescription.keyword', 'currencyCode.keyword', 'waived.keyword', 'createdBy.keyword',
      'calculateRateManually.keyword', 'rateSetupStatus.keyword', 'effectiveDate.keyword', 'expirationDate.keyword',
      'createdDate.keyword', 'lastUpdatedDate.keyword', 'lastUpdatedBy.keyword', 'chargeTypeCode.keyword',
      'documentLegalDescription.keyword', 'hasAttachment.keyword', 'rateItemizeIndicator.keyword',
      'documentInstructionalDescription.keyword', 'customerChargeName.keyword', 'documentFileNames.keyword',
    ];
  }
  static stairRateArray() {
    return [
      'customerAccessorialRateStairStepCharge.accessorialRateTypeName.keyword',
      'customerAccessorialRateStairStepCharge.accessorialRateRoundingTypeName.keyword',
      'customerAccessorialRateStairStepCharge.maximumAmountDisplayName',
      'customerAccessorialRateStairStepCharge.minimumAmountDisplayName',
      'customerAccessorialRateStairStepCharge.accessorialMaximumRateApplyTypeName.keyword'
    ];
  }
  static contractSectionArray() {
    return [
      'customerAccessorialAccounts.customerAgreementContractName.keyword',
      'customerAccessorialAccounts.customerAgreementContractSectionName.keyword',
      'customerAccessorialAccounts.customerAgreementContractSectionAccountName.keyword'
    ];
  }
  static initialRateCondition(rateQuery) {
    return [
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
              'bool': {
                'must': [
                  {
                    'range': {
                      'effectiveDate': {
                        'lte': rateQuery ? rateQuery['effectiveDateStart'] : '12/31/2099',
                        'gte': rateQuery ? rateQuery['effectiveDateEnd'] : '01/01/1995'
                      }
                    }
                  },
                  {
                    'range': {
                      'expirationDate': {
                        'lte': rateQuery ? rateQuery['expireDateStart'] : '12/31/2099',
                        'gte': rateQuery ? rateQuery['expireDateEnd'] : '01/01/1995'
                      }
                    }
                  }
                ]
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
    ];
  }
  static stairStepRate() {
    return this.stairStepRateArray;
  }
  static rateAdditionalCharge() {
    return this.additionalChargeArray;
  }
  static rateAlternateCharge() {
    return this.alternateChargeArray;
  }
  static buSO() {
    return [
      'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnitDisplayName.keyword',
      'customerAccessorialServiceLevelBusinessUnitServiceOfferings.serviceLevel.keyword'
    ];
  }
}

