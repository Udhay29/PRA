
export class FuelSummaryQuery {
    static getFuelSummaryQuery(params) {
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
                                'query': params['agreementID']
                            }
                        },
                        {
                            'nested': {
                                'path': 'FuelProgram',
                                'query': {
                                    'query_string': {
                                        'default_field': 'FuelProgram.FuelProgramID',
                                        'query': params['programID']
                                    }
                                }
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
                                    {
                                        'nested': {
                                            'path': 'FuelProgram',
                                            'query': {
                                                'query_string': {
                                                    'fields': FuelSummaryQuery.fuelProgram(),
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
                                                'query_string': {
                                                    'fields': FuelSummaryQuery.fuelCalcAndPriceBasisDetails(),
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
                                                'query_string': {
                                                    'fields': ['FuelProgram.FuelCalculationDetails.FuelFlat.FuelSurchargeAmount'],
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
                                                'query_string': {
                                                    'fields': FuelSummaryQuery.fuelFormula(),
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
                                                'query_string': {
                                                    'fields': FuelSummaryQuery.fuelQuantity(),
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
                                                'query_string': {
                                                    'fields': FuelSummaryQuery.fuelReefer(),
                                                    'query': '*',
                                                    'default_operator': 'AND'
                                                }
                                            }
                                        }
                                    },
                                    FuelSummaryQuery.regionAssociation(),
                                    FuelSummaryQuery.incrementalAssociation(),
                                    {
                                        'nested': {
                                            'path': 'FuelProgram',
                                            'query': {
                                                'query_string': {
                                                    'default_field': 'FuelProgram.CreatedDate.text',
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
                                                'query_string': {
                                                    'default_field': 'FuelProgram.LastUpdateDate.text',
                                                    'query': '*',
                                                    'default_operator': 'AND'
                                                }
                                            }
                                        }
                                    },
                                    {
                                        'query_string': {
                                            'default_field': 'EffectiveDate.text',
                                            'query': '*',
                                            'default_operator': 'AND'
                                        }
                                    },
                                    {
                                        'query_string': {
                                            'default_field': 'ExpirationDate.text',
                                            'query': '*',
                                            'default_operator': 'AND'
                                        }
                                    },
                                    {
                                        'query_string': {
                                            'default_field': 'AgreementDefaultIndicator',
                                            'query': '*',
                                            'default_operator': 'AND'
                                        }
                                    },
                                    FuelSummaryQuery.generateAssociationQuery('ContractAssociations', [
                                        'ContractAssociations.ContractName',
                                        'ContractAssociations.ContractNumber',
                                        'ContractAssociations.ContractType'
                                    ]),
                                    FuelSummaryQuery.generateAssociationQuery('SectionAssociations', [
                                        'SectionAssociations.SectionName'
                                    ]),
                                    FuelSummaryQuery.generateAssociationQuery('FinanceBusinessUnitServiceOfferingAssociations', [
                                        'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitCode',
                                        'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitServiceOfferingDisplayName',
                                        'FinanceBusinessUnitServiceOfferingAssociations.ServiceOfferingCode'
                                    ]),
                                    FuelSummaryQuery.generateAssociationQuery('BillToAccountAssociations', [
                                        'BillToAccountAssociations.BillingPartyCode',
                                        'BillToAccountAssociations.BillingPartyName'
                                    ]),
                                    FuelSummaryQuery.generateAssociationQuery('CarrierAssociations', [
                                        'CarrierAssociations.CarrierCode',
                                        'CarrierAssociations.CarrierName'
                                    ]),
                                ]
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
    static fuelProgram() {
        return [
            'FuelProgram.FuelProgramType.keyword',
            'FuelProgram.FuelProgramName.keyword',
            'FuelProgram.FuelProgramStatus.keyword',
            'FuelProgram.Conditions.raw',
            'FuelProgram.CreateUserID',
            'FuelProgram.CreateProgramName',
            'FuelProgram.LastUpdateUserID',
            'FuelProgram.LastUpdateProgramName'
        ];
    }
    static fuelCalcAndPriceBasisDetails() {
        return ['FuelProgram.FuelCalculationDetails.FuelCalculationDateTypeName',
            'FuelProgram.FuelCalculationDetails.ChargeTypeName',
            'FuelProgram.FuelCalculationDetails.FuelTypeName',
            'FuelProgram.FuelCalculationDetails.FuelCalculationTypeName',
            'FuelProgram.FuelCalculationDetails.ChargeTypeCode',
            'FuelProgram.FuelCalculationDetails.FuelDiscountTypeName',
            'FuelProgram.FuelCalculationDetails.CurrencyCode',
            'FuelProgram.FuelCalculationDetails.FuelCalculationMethodTypeName',
            'FuelProgram.FuelCalculationDetails.FuelRoundingDecimalNumber',
            'FuelProgram.FuelCalculationDetails.FuelRateTypeName',
            'FuelProgram.FuelCalculationDetails.FuelRollUpIndicator',
            'FuelProgram.FuelPriceBasis.FuelPriceSourceTypeName',
            'FuelProgram.FuelPriceBasis.FuelPriceChangeOccurenceTypeName',
            'FuelProgram.FuelPriceBasis.PriceChangeWeekDayName',
            'FuelProgram.FuelPriceBasis.PriceChangeMonthDayNumber',
            'FuelProgram.FuelPriceBasis.HolidayDelayIndicator',
            'FuelProgram.FuelPriceBasis.CustomFuelCalendar',
            'FuelProgram.FuelPriceBasis.FuelPriceFactorTypeName',
            'FuelProgram.FuelPriceBasis.AverageWeekQuantity',
            'FuelProgram.FuelPriceBasis.AverageMonthQuantity',
            'FuelProgram.FuelPriceBasis.UseDefinedRegionStates',
            'FuelProgram.FuelPriceBasis.AverageFuelFactorIndicator'];
    }
    static fuelFormula() {
        return ['FuelProgram.FuelCalculationDetails.FuelFormula.CapAmount',
            'FuelProgram.FuelCalculationDetails.FuelFormula.FuelSurchargeFactorAmount',
            'FuelProgram.FuelCalculationDetails.FuelFormula.IncrementChargeAmount',
            'FuelProgram.FuelCalculationDetails.FuelFormula.ImplementationAmount',
            'FuelProgram.FuelCalculationDetails.FuelFormula.IncrementIntervalAmount'];
    }

    static fuelQuantity() {
        return ['FuelProgram.FuelCalculationDetails.FuelQuantity.PricingUnitOfLengthMeasurementCode',
            'FuelProgram.FuelCalculationDetails.FuelQuantity.PricingUnitOfVolumeMeasurementCode',
            'FuelProgram.FuelCalculationDetails.FuelQuantity.DistancePerFuelQuantity',
            'FuelProgram.FuelCalculationDetails.FuelQuantity.AddonAmount'];
    }
    static fuelReefer() {
        return ['FuelProgram.FuelCalculationDetails.FuelReefer.DistancePerHourQuantity',
            'FuelProgram.FuelCalculationDetails.FuelReefer.TravelTimeHourRoundingTypeName',
            'FuelProgram.FuelCalculationDetails.FuelReefer.BurnRatePerHourQuantity',
            'FuelProgram.FuelCalculationDetails.FuelReefer.LoadUnloadHourQuantity',
            'FuelProgram.FuelCalculationDetails.FuelReefer.ServiceHourAddonQuantity',
            'FuelProgram.FuelCalculationDetails.FuelReefer.ServiceHourAddonDistanceQuantity',
            'FuelProgram.FuelCalculationDetails.FuelReefer.ServiceHourRoundingTypeName',
            'FuelProgram.FuelCalculationDetails.FuelReefer.PricingUnitOfLengthMeasurementCode',
            'FuelProgram.FuelCalculationDetails.FuelReefer.PricingUnitOfVolumeMeasurementCode'
        ];
    }
    static incrementalAssociation() {
        return {
            'nested': {
                'path': 'FuelProgram',
                'query': {
                    'nested': {
                        'path': 'FuelProgram.FuelCalculationDetails.IncrementalRateAssociations',
                        'query': {
                            'query_string': {
                                'fields': [
                                    'FuelProgram.FuelCalculationDetails.IncrementalRateAssociations.FuelBeginAmount'
                                ],
                                'query': '*',
                                'default_operator': 'AND'
                            }
                        }
                    }
                }
            }
        };
    }
    static generateAssociationQuery(path: string, fieldNames: string[]) {
        return {
            'nested': {
                'path': path,
                'query': {
                    'query_string': {
                        'fields': fieldNames,
                        'query': '*',
                        'default_operator': 'AND'
                    }
                }
            }
        };
    }
    static regionAssociation() {
        return {
            'nested': {
                'path': 'FuelProgram',
                'query': {
                    'nested': {
                        'path': 'FuelProgram.FuelPriceBasis.FuelPriceRegionAssociations',
                        'query': {
                            'query_string': {
                                'default_field': 'FuelProgram.FuelPriceBasis.FuelPriceRegionAssociations.DistrictName',
                                'query': '*',
                                'default_operator': 'AND'
                            }
                        }
                    }
                }
            }
        };
    }
}
