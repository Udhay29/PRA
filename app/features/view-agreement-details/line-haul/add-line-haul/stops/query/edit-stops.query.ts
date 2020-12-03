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

export class EditStopQuery {

    static getOriginDestinationQuery(addresId: any) {
        return {
                '_source': [
                  'Address.AddressLine1',
                  'Address.CityName',
                  'Address.StateCode',
                  'Address.StateName',
                  'Address.CountryName',
                  'Address.CountryCode',
                  'Address.PostalCode',
                   AddressID
                ],
                'query': {
                  'bool': {
                    'filter': {
                      'bool': {
                        'must': [
                          {
                            'terms': {
                              [AddressID]: [...addresId]
              }
                          }
                        ]
                      }
                    }
                  }
                },
                'size': 1000
              };
      }

      static getCityQuery(cityId: any) {
        return {
            '_source': false,
            'size': 10000,
            'query': {
              'bool': {
                'must': [
                  {
                    'nested': {
                      'path': 'City',
                      'query': {
                        'terms': {
                          [CityID] : [...cityId]
                        }
                      },
                      'inner_hits': {
                        'size': 1,
                        '_source': {
                          'includes': [
                            'City.CityName',
                             CityID,
                            'City.State.StateName',
                             StateID,
                            'City.State.StateCode',
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
static getPostalZipQuery(postalID: any) {
    return {
            '_source': ['PostalCode', 'PostalCodeID', 'CountryCode', 'CountryName'],
            'size': 10000,
            'query': {
              'bool': {
                'must': [
                  {
                    'terms': {
                      'PostalCodeID' : [...postalID]
                     }
                  }
                ]
              }
            }
          };
      }

      static getRampYardQuery(locationID: any) {
        return {
          '_source': [
                  'LocationID',
                  'LocationName',
                  'LocationCode',
                  'Address',
                  'locationtypes'
          ],
          'size': 10000,
            'query': {
              'bool': {
                'filter': {
                  'bool': {
                    'must': [
                        {
                          'terms': {
            'LocationID': [...locationID]
            }
                        }
                      ]
                  }
                }
              }
            }
        };
      }

      static getStateQuery(stateId: any) {
        return {
          'from': 0,
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
                        [StateID] : [...stateId]
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

}
