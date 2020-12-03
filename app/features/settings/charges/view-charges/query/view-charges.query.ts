export class ViewChargesQuery {
  static BusinessUnitServiceOfferingName = 'BusinessUnitServiceOfferings.BusinessUnitServiceOfferingName';
  static BusinessOffering = 'BusinessUnitServiceOfferings.BusinessUnit';
  static ChargeUsageTypeName = 'ChargeUsageTypes.ChargeUsageTypeName';
  static RateTypeNameData = 'RateTypes.RateTypeName.keyword';
  static RateTypeNameChargeData = 'RateTypes.RateTypeName';
  static DateFormat = 'MM/dd/yyyy||yyyy';
  static ChargeApplicationTypeName = 'ApplicationLevel.ChargeApplicationLevelTypeName';
  static lteDate = '12/31/2099';
  static gteDate = '01/01/1992';
  static getViewChargesQuery() {
    return {
      '_source': [
        'ChargeTypeDescription',
        'QuantityRequiredIndicator',
        'AutoInvoiceIndicator',
        'EffectiveDate',
        'ExpirationDate',
        this.ChargeApplicationTypeName,
        'ChargeTypeIdentifier',
        'ChargeTypeName',
        this.ChargeUsageTypeName,
        this.RateTypeNameChargeData,
        this.BusinessUnitServiceOfferingName,
        this.BusinessOffering
      ],
      'sort': [{
        'ChargeTypeIdentifier.keyword': {
          'order': 'asc'
        }
      }],
      'size': 25,
      'from': 0,
      'query': {
        'bool': {
          'must': [{
              'bool': {
                'must': [{
                    'query_string': {
                      'default_field': 'ChargeTypeIdentifier',
                      'query': '*',
                      'default_operator': 'AND'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'AutoInvoiceIndicator',
                      'query': '*',
                      'default_operator': 'AND'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'QuantityRequiredIndicator',
                      'query': '*',
                      'default_operator': 'AND'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': this.ChargeApplicationTypeName,
                      'query': '*',
                      'default_operator': 'AND'
                    }
                  },
                  {
                    'range': {
                      'EffectiveDate': {
                        'gte': this.gteDate,
                        'lte': this.lteDate,
                        'format': this.DateFormat
                      }
                    }
                  },
                  {
                    'range': {
                      'ExpirationDate': {
                        'gte': this.gteDate,
                        'lte': this.lteDate,
                        'format': this.DateFormat
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'BusinessUnitServiceOfferings',
                      'query': {
                        'bool': {
                          'must': [{
                              'query_string': {
                                'default_field': this.BusinessOffering,
                                'query': '*',
                                'default_operator': 'AND'
                              }
                            },
                            {
                              'query_string': {
                                'default_field': this.BusinessUnitServiceOfferingName,
                                'query': '*',
                                'default_operator': 'AND'
                              }
                            }
                          ]
                        }
                      },
                      'inner_hits': {
                        'sort': {
                          'BusinessUnitServiceOfferings.BusinessUnitServiceOfferingName.keyword': {
                            'order': 'asc'
                          }
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'ChargeUsageTypes',
                      'query': {
                        'query_string': {
                          'default_field': this.ChargeUsageTypeName,
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'RateTypes',
                      'query': {
                        'query_string': {
                          'default_field': this.RateTypeNameChargeData,
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  },
                  {
                    'range': {
                      'ExpirationDate': {
                        'gte': 'now/d',
                        'lte': this.lteDate,
                        'format': this.DateFormat
                      }
                    }
                  }
                ]
              }
            },
            {
              'bool': {
                'should': ViewChargesQuery.getSearchChargesQuery()
              }
            }
          ]
        }
      },
      'aggs': {
        'nested_bu': {
          'nested': {
            'path': 'BusinessUnitServiceOfferings'
          },
          'aggs': {
            'bu': {
              'terms': {
                'field': 'BusinessUnitServiceOfferings.BusinessUnit.key',
                'size': 5
              },
              'aggs': {
                'SO': {
                  'terms': {
                    'field': 'BusinessUnitServiceOfferings.BusinessUnitServiceOfferingName.key',
                    'size': 10
                  }
                }
              }
            },
            'so': {
              'terms': {
                'field': 'BusinessUnitServiceOfferings.BusinessUnitServiceOfferingName.key',
                'size': 50
              }
            }
          }
        }
      }
    };
  }

  static getSearchChargesQuery() {
    return [{
        'query_string': {
          'fields': ['ChargeTypeIdentifier',
            'ChargeTypeDescription',
            'AutoInvoiceIndicator',
            'QuantityRequiredIndicator',
            'ApplicationLevel.wChargeApplicationLevelTypeName'
          ],
          'query': '*',
          'default_operator': 'AND'
        }
      },
      {
        'nested': {
          'path': 'BusinessUnitServiceOfferings',
          'query': {
            'bool': {
              'must': [{
                'query_string': {
                  'fields': [this.BusinessOffering,
                    this.BusinessUnitServiceOfferingName
                  ],
                  'query': '*',
                  'default_operator': 'AND'
                }
              }]
            }

          },
          'inner_hits': {
            'sort': {
              'BusinessUnitServiceOfferings.BusinessUnitServiceOfferingName.keyword': {
                'order': 'asc'
              }
            }
          }
        }
      },
      {
        'nested': {
          'path': 'ChargeUsageTypes',
          'query': {
            'query_string': {
              'default_field': this.ChargeUsageTypeName,
              'query': '*',
              'default_operator': 'AND'
            }
          },

          'inner_hits': {
            'sort': {
              'ChargeUsageTypes.ChargeUsageTypeName.keyword': {
                'order': 'asc'
              }
            }
          }
        }
      },
      {
        'nested': {
          'path': 'RateTypes',
          'query': {
            'query_string': {
              'default_field': this.RateTypeNameChargeData,
              'query': '*',
              'default_operator': 'AND'
            }
          },

          'inner_hits': {
            'sort': {
              [this.RateTypeNameData]: {
                'order': 'asc'
              }
            }
          }
        }
      },
      {
        'range': {
          'EffectiveDate': {
            'gte': '0',
            'lte': '0',
            'format': this.DateFormat
          }
        }
      },
      {
        'range': {
          'ExpirationDate': {
            'lte': '0',
            'gte': '0',
            'format': this.DateFormat
          }
        }
      },
      {
        'query_string': {
          'default_field': 'ChargeTypeIdentifier',
          'query': '*',
          'default_operator': 'AND'
        }
      },
    ];
  }
  static getFilterChargeTypeQuery() {
    return {
      '_source': [
        'ChargeTypeIdentifier'
      ],
      'query': {
        'bool': {
          'must': [{
            'query_string': {
              'default_field': 'ChargeTypeIdentifier.keyword',
              'query': '*search-query-text*',
              'default_operator': 'AND'
            }
          }]
        }
      }
    };
  }

  static getFilterRateTypeQuery() {
    return {
      '_source': [
        this.RateTypeNameData
      ],
      'query': {
        'nested': {
          'path': 'RateTypes',
          'query': {
            'query_string': {
              'default_field': this.RateTypeNameData,
              'query': '*search-query-text*',
              'default_operator': 'AND'
            }
          },
          'inner_hits': {
            'sort': {
              [this.RateTypeNameData]: {
                'order': 'asc'
              }
            }
          }
        }
      },
      'aggs': {
        'ratetypename': {
          'nested': {
            'path': 'RateTypes'
          },
          'aggs': {
            'ratetypename': {
              'terms': {
                'field': 'RateTypes.RateTypeName.aux',
                'size': 1000
              }
            }
          }
        }
      }
    };
  }

  static getFilterStatusQuery() {
    return {
      '_source': [
        'ChargeTypeDescription'
      ],
      'aggs': {
        'status': {
          'terms': {
            'field': 'Status.aux',
            'size': 10
          }
        },
      }
    };
  }
}
