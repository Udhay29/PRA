import * as utils from 'lodash';
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

export class EditLineHaulQuery {
  static getEditQuery(processedLane, value) {
    let query = {};
    switch (processedLane) {
      case 'cityState':
        query = this.getCityQuery(value.pointID);
        break;
      case 'Address':
        query = this.getOriginDestinationQuery(value.pointID);
        break;
      case 'state':
        query = this.getStateQuery(value.pointID);
        break;
      case 'Zip':
        query = this.getPostalZipQuery(value.pointID);
        break;
      case 'ZipRange':
        query = this.getPostalZipRangeQuery(value);
        break;
      case 'YardRampLoc':
        query = this.getRampYardQuery(value.pointID);
        break;
      case 'zipRegion':
        const postalCodeIDList = [];
        utils.forEach(value, (listValue) => {
          if (listValue.subTypeName === '3-Zip') {
            postalCodeIDList.push(listValue.pointID);
          } else {
            postalCodeIDList.push(listValue.lowerBoundID);
            postalCodeIDList.push(listValue.upperBoundID);
          }
        });
        query = this.getPostalZipRangeQuery(postalCodeIDList, true);
        break;
      case 'City State Region':
        const postalCodeList = [];
        utils.forEach(value, (listValue) => {
          postalCodeList.push(listValue.pointID);
        });
        query = this.getCityStateRegionQuery(postalCodeList);
        break;
    }
    return query;
  }
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
                      [CityID]: element
                    }
                  },
                  'inner_hits': {
                    'size': 1,
                    '_source': {
                      'includes': [
                        CityID,
                        'City.CityName',
                        'City.State.StateCode',
                        'City.State.StateName',
                        'City.Country.CountryCode',
                        'City.Country.CountryName'
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
                      Statecode,
                      CityCountryName,
                      CityID,
                      CityCountryCode
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
                      CityCountryName,
                      CityCountryCode,
                      stateName,
                      StateID,
                      Statecode,
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
      '_source': ['PostalCode', 'PostalCodeID', 'CountryCode', 'CountryName'],
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
  static getPostalZipRangeQuery(element, isMultiple?) {
    return {
      'size': 10000,
      '_source': ['PostalCode', 'PostalCodeID', 'CountryCode', 'CountryName'],
      'query': {
        'bool': {
          'must': [
            {
              'terms': {
                'PostalCodeID': isMultiple ? element : [element.lowerBoundID, element.upperBoundID]
              }
            }
          ]
        }
      }
    };
  }
}
