const dateFormat = 'MM/dd/yyyy||yyyy';
export class FuelProgramQuery {
  static getFuelProgramQuery(params) {
    return {
      'from': 0,
      'size': 25,
      '_source': '*',
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'AgreementID',
                'query': params
              }
            },
            {
              'nested': {
                'path': 'FuelProgram',
                'query': {
                  'query_string': {
                    'default_field': 'FuelProgram.FuelProgramStatus',
                    'query': 'Completed'
                  }
                }
              }
            },
            {
              'bool': {
                'should': [

                ]
              }
            },
            {
              'range': {
                'ExpirationDate': {
                  'gte': 'now-1d'
                }
              }
            }
          ]
        }
      },
      'sort': [
        {
          'FuelProgram.FuelProgramName.keyword': {
            'order': 'asc',
            'nested': {
              'path': 'FuelProgram'
            }
          }
        }
      ]
    };
  }
  static defaultSearchQuery() {
    return [
      {
        'nested': {
          'path': 'FuelProgram',
          'query': {
            'query_string': {
              'fields': [
                'FuelProgram.FuelProgramName.keyword',
                'FuelProgram.Conditions.keyword',
                'FuelProgram.CreateUserID.keyword',
                'FuelProgram.CreateProgramName.keyword',
                'FuelProgram.LastUpdateUserID.keyword',
                'FuelProgram.LastUpdateProgramName.keyword',
                'FuelProgram.FuelCalculationDetails.FuelCalculationDateTypeName.keyword',
                'FuelProgram.FuelCalculationDetails.ChargeTypeName.keyword',
                'FuelProgram.FuelCalculationDetails.FuelTypeName.keyword',
                'FuelProgram.FuelCalculationDetails.FuelCalculationTypeName.keyword',
                'FuelProgram.FuelCalculationDetails.ChargeTypeCode.keyword',
                'FuelProgram.FuelCalculationDetails.FuelDiscountTypeName.keyword',
                'FuelProgram.FuelCalculationDetails.CurrencyCode.keyword',
                'FuelProgram.FuelCalculationDetails.FuelCalculationMethodTypeName.keyword',
                'FuelProgram.FuelCalculationDetails.FuelRoundingDecimalNumber.keyword',
                'FuelProgram.FuelCalculationDetails.FuelRateTypeName.keyword',
                'FuelProgram.FuelCalculationDetails.FuelRollUpIndicator.keyword',
                'FuelProgram.FuelPriceBasis.FuelPriceSourceTypeName.keyword',
                'FuelProgram.FuelPriceBasis.FuelPriceChangeOccurenceTypeName.keyword',
                'FuelProgram.FuelPriceBasis.PriceChangeWeekDayName.keyword',
                'FuelProgram.FuelPriceBasis.PriceChangeMonthDayNumber.keyword',
                'FuelProgram.FuelPriceBasis.HolidayDelayIndicator.keyword',
                'FuelProgram.FuelPriceBasis.CustomFuelCalendar.keyword',
                'FuelProgram.FuelPriceBasis.FuelPriceFactorTypeName.keyword',
                'FuelProgram.FuelPriceBasis.AverageWeekQuantity.keyword',
                'FuelProgram.FuelPriceBasis.AverageMonthQuantity.keyword',
                'FuelProgram.FuelPriceBasis.UseDefinedRegionStates.keyword',
                'FuelProgram.FuelPriceBasis.AverageFuelFactorIndicator.keyword',
                'FuelProgram.FuelCalculationDetails.FuelFlat.FuelSurchargeAmount.keyword',
                'FuelProgram.FuelCalculationDetails.FuelFormula.CapAmount.keyword',
                'FuelProgram.FuelCalculationDetails.FuelFormula.FuelSurchargeFactorAmount.keyword',
                'FuelProgram.FuelCalculationDetails.FuelFormula.IncrementChargeAmount.keyword',
                'FuelProgram.FuelCalculationDetails.FuelFormula.ImplementationAmount.keyword',
                'FuelProgram.FuelCalculationDetails.FuelFormula.IncrementIntervalAmount.keyword',
                'FuelProgram.FuelCalculationDetails.FuelQuantity.PricingUnitOfLengthMeasurementCode.keyword',
                'FuelProgram.FuelCalculationDetails.FuelQuantity.PricingUnitOfVolumeMeasurementCode.keyword',
                'FuelProgram.FuelCalculationDetails.FuelQuantity.DistancePerFuelQuantity.keyword',
                'FuelProgram.FuelCalculationDetails.FuelQuantity.ImplementationAmount.keyword',
                'FuelProgram.FuelCalculationDetails.FuelQuantity.AddonAmount.keyword',
                'FuelProgram.FuelCalculationDetails.FuelReefer.DistancePerHourQuantity.keyword',
                'FuelProgram.FuelCalculationDetails.FuelReefer.ImplementationAmount.keyword',
                'FuelProgram.FuelCalculationDetails.FuelReefer.TravelTimeHourRoundingTypeName.keyword',
                'FuelProgram.FuelCalculationDetails.FuelReefer.BurnRatePerHourQuantity.keyword',
                'FuelProgram.FuelCalculationDetails.FuelReefer.LoadUnloadHourQuantity.keyword',
                'FuelProgram.FuelCalculationDetails.FuelReefer.ServiceHourAddonQuantity.keyword',
                'FuelProgram.FuelCalculationDetails.FuelReefer.ServiceHourAddonDistanceQuantity.keyword',
                'FuelProgram.FuelCalculationDetails.FuelReefer.ServiceHourRoundingTypeName.keyword',
                'FuelProgram.FuelCalculationDetails.FuelReefer.PricingUnitOfLengthMeasurementCode.keyword',
                'FuelProgram.FuelCalculationDetails.FuelReefer.PricingUnitOfVolumeMeasurementCode.keyword'
              ],
              'query': '*',
              'default_operator': 'AND'
            }
          }
        }
      },
      {
        'nested': {
          'path': 'FuelProgram',
          'query': {
            'nested': {
              'path': 'FuelProgram.FuelPriceBasis.FuelPriceRegionAssociations',
              'query': {
                'query_string': {
                  'default_field': 'FuelProgram.FuelPriceBasis.FuelPriceRegionAssociations.DistrictName.keyword',
                  'query': '*',
                  'default_operator': 'AND'
                }
              }
            }
          }
        }
      },
      {
        'nested': {
          'path': 'FuelProgram',
          'query': {
            'nested': {
              'path': 'FuelProgram.FuelCalculationDetails.IncrementalRateAssociations',
              'query': {
                'query_string': {
                  'fields': [
                    'FuelProgram.FuelCalculationDetails.IncrementalRateAssociations.FuelBeginAmount.keyword'
                  ],
                  'query': '*',
                  'default_operator': 'AND'
                }
              }
            }
          }
        }
      },
      {
        'query_string': {
          'default_field': 'AgreementDefaultIndicator.keyword',
          'query': '*',
          'default_operator': 'AND'
        }
      },
      {
        'nested': {
          'path': 'ContractAssociations',
          'query': {
            'query_string': {
              'fields': [
                'ContractAssociations.ContractName.keyword',
                'ContractAssociations.ContractNumber.keyword',
                'ContractAssociations.ContractType.keyword'
              ],
              'query': '*',
              'default_operator': 'AND'
            }
          }
        }
      },
      {
        'nested': {
          'path': 'SectionAssociations',
          'query': {
            'query_string': {
              'fields': [
                'SectionAssociations.SectionName.keyword'
              ],
              'query': '*',
              'default_operator': 'AND'
            }
          }
        }
      },
      {
        'nested': {
          'path': 'FinanceBusinessUnitServiceOfferingAssociations',
          'query': {
            'query_string': {
              'fields': [
                'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitCode.keyword',
                'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitServiceOfferingDisplayName.keyword',
                'FinanceBusinessUnitServiceOfferingAssociations.ServiceOfferingCode.keyword'
              ],
              'query': '*',
              'default_operator': 'AND'
            }
          }
        }
      },
      {
        'nested': {
          'path': 'BillToAccountAssociations',
          'query': {
            'query_string': {
              'fields': [
                'BillToAccountAssociations.BillingPartyCode.keyword',
                'BillToAccountAssociations.BillingPartyName.keyword'
              ],
              'query': '*',
              'default_operator': 'AND'
            }
          }
        }
      },
      {
        'nested': {
          'path': 'CarrierAssociations',
          'query': {
            'query_string': {
              'fields': [
                'CarrierAssociations.CarrierCode.keyword',
                'CarrierAssociations.CarrierName.keyword'
              ],
              'query': '*',
              'default_operator': 'AND'
            }
          }
        }
      }
    ];
  }
  static dateSearchQuery() {
    return [
      {
        'range': {
          'EffectiveDate': {
            'gte': '',
            'lte': '',
            'format': dateFormat
          }
        }
      },
      {
        'range': {
          'ExpirationDate': {
            'gte': '',
            'lte': '',
            'format': dateFormat
          }
        }
      },
      {
        'nested': {
          'path': 'FuelProgram',
          'query': {
            'range': {
              'FuelProgram.CreatedDate': {
                'gte': '',
                'lte': '',
                'format': dateFormat
              }
            }
          }
        }
      },
      {
        'nested': {
          'path': 'FuelProgram',
          'query': {
            'range': {
              'FuelProgram.LastUpdateDate': {
                'gte': '',
                'lte': '',
                'format': dateFormat
              }
            }
          }
        }
      }
    ];
  }
}
