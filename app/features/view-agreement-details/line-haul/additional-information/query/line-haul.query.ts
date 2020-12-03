
const CountryCode = 'Address.CountryCode';
const CountryName = 'Address.CountryName';
const AddressLine1 = 'Address.AddressLine1';
const CityName = 'Address.CityName';
const StateCode = 'Address.StateCode';
const Cityname = 'City.CityName';
const CityID = 'City.CityID';
const stateName = 'City.State.StateName';
const StateID = 'City.State.StateID';
const Statecode = 'City.State.StateCode';
const PostalCode = 'Address.PostalCode';
const AddressID = 'Address.AddressID';

export class LineHaulQuery {
  static getOriginDestinationQuery(addresId: number) {
    return {
      '_source': [
        AddressLine1,
        CityName,
        StateCode,
        CountryName,
        CountryCode,
        PostalCode,
        AddressID
      ],
      'query': {
        'bool': {
          'filter': {
            'bool': {
              'must': [
                {
                  'query_string': {
                    'analyze_wildcard': 'true',
                    'default_operator': 'and',
                    'fields': [
                      AddressID
                    ],
                    'query': addresId
                  }
                }
              ]
            }
          }
        }
      },
      'size': 6
    };
  }
  static getCityQuery(cityId: number) {
    return {
      '_source': false,
      'query': {
        'bool': {
          'must': [
            {
              'nested': {
                'path': 'City',
                'query': {
                  'query_string': {
                    'fields': [
                      CityID,
                    ],
                    'query': cityId
                  }
                },
                'inner_hits': {
                  'size': 1,
                  '_source': {
                    'includes': [
                      Cityname,
                      Statecode
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    };
  }
  static getStateQuery(stateId: number) {
    return {
      '_source': false,
      'query': {
        'bool': {
          'must': [
            {
              'nested': {
                'path': 'City',
                'query': {
                  'query_string': {
                    'default_field': StateID,
                    'query': stateId
                  }
                },
                'inner_hits': {
                  'size': 1,
                  '_source': {
                    'includes': [
                      stateName
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    };
  }
  static getPostalZipQuery(postalID: number) {
    return {
      '_source': ['PostalCode'],
      'query': {
        'bool': {
          'must': [
            {
                'query_string': {
                  'default_field': 'PostalCodeID',
                  'query': postalID
                }
            }
          ]
        }
      }
    };
  }
  static getPostalZipRangeQuery(element, isMultiple?) {
    return {
      'size': 10000,
      '_source': [],
      'query': {
        'bool': {
          'must': [
            {
              'terms': {
                'PostalCodeID' : isMultiple ? element : [element.lowerBoundID, element.upperBoundID]
              }
          }
          ]
        }
      }
    };
  }
  static getCityStateRegionQuery(element) {
    return {
      'size': 10000,
        '_source': false,
        'query': {
          'bool': {
            'must': [
              {
                'nested': {
                  'path': 'City',
                  'query': {
                    'terms': {
                      'City.CityID': element
                    }
                  },
                  'inner_hits': {
                    'size': 1,
                    '_source': {
                      'includes': [
                        'City.CityName',
                        'City.State.StateCode'
                      ]
                    }
                  }
                }
              }
            ]
          }
        }
    };
  }
  static getRampYardQuery(locationID: number) {
    return {
      '_source': [
              'LocationID',
              'LocationName',
              'LocationCode',
              'Address'
      ],
        'query': {
          'bool': {
            'filter': {
              'bool': {
                'must': [
                  {
                    'query_string': {
                    'default_field': 'LocationID',
                    'query': locationID
                    }
                  }
                ]
              }
            }
          }
        }
    };
  }
}
