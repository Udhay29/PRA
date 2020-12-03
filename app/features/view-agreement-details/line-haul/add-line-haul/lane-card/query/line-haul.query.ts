
const CountryCode = 'Address.CountryCode';
const CountryName = 'Address.CountryName';
const AddressLine1 = 'Address.AddressLine1';
const AddressLine2 = 'Address.AddressLine2';
const CityName = 'Address.CityName';
const StateCode = 'Address.StateCode';
const Cityname = 'City.CityName';
const CityID = 'City.CityID';
const stateName = 'City.State.StateName';
const StateID = 'City.State.StateID';
const Statecode = 'City.State.StateCode';
const Countryname = 'City.Country.CountryName';
const CountryCodeKey = 'CountryCode.keyword';
const PostalCode = 'Address.PostalCode';
const CountryNameCity = 'City.Country.CountryCode';

export class LineHaulQuery {
  static getOriginDestinationQuery(value, country: string) {
    return {
      '_source': [
        AddressLine1,
        AddressLine2,
        CityName,
        StateCode,
        CountryName,
        CountryCode,
        PostalCode,
        'Address.AddressID',
        'Address.StateName'
      ],
      'query': {
        'bool': {
          'filter': {
            'bool': {
              'must': [
                {
                  'query_string': {
                    'default_operator': 'and',
                    'fields': [
                      'Address.CountryCode'
                    ],
                    'query': `${country}*`
                  }
                },
                {
                  'query_string': {
                    'analyze_wildcard': 'true',
                    'default_operator': 'and',
                    'fields': [
                      AddressLine1,
                      AddressLine2,
                      CityName,
                      StateCode,
                      CountryName,
                      CountryCode,
                      PostalCode,
                    ],
                    'query': `${value.replace(/[!?:\\['^~=\//\\{},.&&||<>()"+*\]@]/g, '\\$&')}*`
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

  static getCityQuery(value, country: string) {
    return {
      '_source': false,
      'size': 10000,
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': CountryCodeKey,
                'query': `${country}*`
              }
            },
            {
              'nested': {
                'path': 'City',
                'query': {
                  'query_string': {
                    'analyze_wildcard': 'true',
                    'default_operator': 'and',
                    'fields': [
                      Cityname,
                      Statecode
                    ],
                    'query': `${value.replace(/[!?:\\['^~=\//\\{},.&&||<>()"+*\]@]/g, '\\$&')}*`
                  }
                },
                'inner_hits': {
                  'size': 1,
                  '_source': {
                    'includes': [
                      Cityname,
                      CityID,
                      stateName,
                      StateID,
                      Statecode,
                      Countryname,
                      CountryNameCity
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
  static getStateQuery(value, country: string) {
    return {
      '_source': false,
      'size': 10000,
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': CountryCodeKey,
                'query': `${country}*`
              }
            },
            {
              'nested': {
                'path': 'City',
                'query': {
                  'query_string': {
                    'analyze_wildcard': 'true',
                    'default_operator': 'and',
                    'default_field': stateName,
                    'query': `${value.replace(/[!?:\\['^~=\//\\{},.&&||<>()"+*\]@]/g, '\\$&')}*`
                  }
                },
                'inner_hits': {
                  '_source': {
                    'includes': [
                      Cityname,
                      CityID,
                      stateName,
                      StateID,
                      Statecode,
                      Countryname,
                      CountryNameCity
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
  static getRampYardQuery(value, field: string, country: string) {
    return {
      '_source': [
        'LocationID',
        'LocationName',
        'LocationCode',
        'Address',
        'locationtypes'
      ],
      'query': {
        'bool': {
          'filter': {
            'bool': {
              'must': [
                {
                  'query_string': {
                    'fields': [
                      'Address.CountryCode'
                    ],
                    'query': `${country}*`,
                    'default_operator': 'AND'
                  }
                },
                {
                  'nested': {
                    'path': 'locationtypes',
                    'query': {
                      'query_string': {
                        'fields': [
                          'locationtypes.LocationSubTypeCode',
                          'locationtypes.LocationSubTypeDescription'
                        ],
                        'query': `${field}*`,
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'query_string': {
                    'fields': [
                      'LocationName^20',
                      'LocationCode^10',
                      'LocationCode.whitespace^6',
                      'LocationCode',
                      'Address.AddressLine1^6',
                      'Address.CityName',
                      'Address.StateCode',
                      'Address.PostalCode',
                      'Address.CountryCode'
                    ],
                    'query': `${value.replace(/[!?:\\['^~=\//\\{},.&&||<>()"#+*\]@-]/g, '\\$&')}*`,
                    'default_operator': 'AND'
                  }
                }
              ]
            }
          }
        }
      },
      'size': 10000
    };
  }
  static getPostalZipQuery(value, type, countryCode) {
    return {
      '_source': ['PostalCode', 'PostalCodeID', 'CountryCode'],
      'query': {
        'bool': {
          'must': [
            {
              'exists': { 'field': 'PostalCode' }
            },
            {
              'bool': {
                'filter': {
                  'script': {
                    'script': {
                      'source': `doc['PostalCode.keyword'].value.length() == params.input`,
                      'params': { 'input': type }
                    }
                  }
                }
              }
            },
            {
              'query_string': {
                'default_field': 'PostalCode',
                'query': `*${value.replace(/[ !?:\\['^~=\//\\{},.&&||<>()"+*\]@-]/g, '\\$&').trim()}*`
              }
            },
            {
              'query_string': {
                'default_field': CountryCodeKey,
                'query': countryCode
              }
          }
          ]
        }
      },
      'sort': [
        {
          'PostalCode.keyword': {
            'order': 'asc'
          }
        }
      ],
      'size': 10000
    };
  }
  static getCityStateRegionQuery(value: string, country: string) {
    return {
      'size': 10000,
      '_source': false,
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'CountryCode.keyword',
                'query': `${country}*`
              }
            },
            {
              'nested': {
                'path': 'City',
                'query': {
                  'query_string': {
                    'analyze_wildcard': 'true',
                    'default_operator': 'and',
                    'fields': [
                      Cityname,
                      Statecode
                    ],
                    'query': `${value.replace(/[ !?:\\['^~=\//\\{},.&&||<>()"+*\]@-]/g, '\\$&').trim()}*`
                  }
                },
                'inner_hits': {
                  'size': 1,
                  '_source': {
                    'includes': [
                      Cityname,
                      'City.CityID',
                      'City.State.StateName',
                      'City.State.StateID',
                      Statecode,
                      'City.Country.CountryName',
                      'City.Country.CountryCode'
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
}
