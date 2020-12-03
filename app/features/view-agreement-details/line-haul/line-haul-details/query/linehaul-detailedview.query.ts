
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

export class LineHaulDetailedViewQuery {
    static getOriginDestinationQuery(addresId: number[]) {
        let addressVal = addresId.join();
        addressVal = addressVal.replace(/,/g, ' OR ');
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
                                        'query': addressVal
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

    static getCityQuery(cityId: number[]) {
        let cityVal = cityId.join();
        cityVal = cityVal.replace(/,/g, ' OR ');
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
                                    'query_string': {
                                        'fields': [
                                            CityID,
                                        ],
                                        'query': cityVal
                                    }
                                },
                                'inner_hits': {
                                    'size': 1,
                                    '_source': {
                                        'includes': [
                                            Cityname,
                                            Statecode,
                                            CityCountryName,
                                            CityID
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
    static getStateQuery(stateId: number[]) {
        let stateVal = stateId.join();
        stateVal = stateVal.replace(/,/g, ' OR ');
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
                                    'query_string': {
                                        'default_field': StateID,
                                        'query': stateVal
                                    }
                                },
                                'inner_hits': {
                                    'size': 1,
                                    '_source': {
                                        'includes': [
                                            stateName,
                                            CityCountryName,
                                            StateID
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
    static getPostalZipQuery(postalID: number[]) {
        return {
            '_source': ['PostalCode', 'CountryCode', 'PostalCodeID', 'City.Country.CountryName'],
            'size': 10000,
            'query': {
                'bool': {
                    'must': [
                        {
                            'terms': {
                                'PostalCodeID': postalID
                            }
                        }
                    ]
                }
            }
        };
    }
    static getRampYardQuery(locationID: number[]) {
        let locationVal = locationID.join();
        locationVal = locationVal.replace(/,/g, ' OR ');
        return {
            '_source': [
                'LocationID',
                'LocationName',
                'LocationCode',
                'Address'
            ],
            'size': 10000,
            'query': {
                'bool': {
                    'filter': {
                        'bool': {
                            'must': [
                                {
                                    'query_string': {
                                        'default_field': 'LocationID',
                                        'query': locationVal
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
            'size': 10000,
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
