
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
const CityCountryCode = 'City.Country.CountryCode';
const CityCountryName = 'City.Country.CountryName';
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
          'must': [,
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
                      Statecode,
                      CityCountryName
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
                      stateName,
                      CityCountryName
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
  static getCarrierQuery(carrierId: number) {
    return {
      'query': {
        'bool': {
          'must': [
            {
              'match': {
                'CarrierStatus': 'A'
              }
            },
            {
              'match': {
                'CarrierID': carrierId
              }
            }
          ]
        }
      },
      'from': 0,
      'size': 100,
      '_source': [
        'LegalName',
        'CarrierCode',
        'CarrierID'
      ]
    };
  }
  static getPostalZipQuery(postalID: number) {
    return {
      '_source': ['PostalCode', 'CountryCode'],
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
  static getPostalZipRangeQuery(element) {
    return {
      '_source': ['PostalCode', 'PostalCodeID', 'CountryCode', 'CountryName'],
      'query': {
        'bool': {
          'must': [
            {
              'terms': {
                'PostalCodeID': [element.lowerBoundID, element.upperBoundID]
              }
            }
          ]
        }
      }
    };
  }
}
