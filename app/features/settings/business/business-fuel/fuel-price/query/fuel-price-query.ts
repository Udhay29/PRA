export class FuelPriceQuery {

    static getFuelPriceQuery(filterDetails): any {
        const str = {
            'from': filterDetails['from'],
            'size': filterDetails['size'],
            'query': {
                'bool': {
                    'must': [
                        {
                            'query_string': {
                                'default_field': 'invalidIndicator.keyword',
                                'query': 'N'
                            }
                        },
                        {
                            'query_string': {
                                'default_field': 'fuelPriceSourceTypeName.keyword',
                                'query': filterDetails['fuelPriceSourceTypeName']
                            }
                        },
                        {
                            'query_string': {
                                'default_field': 'fuelRegionName.keyword',
                                'query': filterDetails['fuelRegionName']
                            }
                        },
                        {
                            'range': {
                                'fuelPriceAmount': {
                                    'gte': filterDetails['fuelPriceAmount'] ? filterDetails['fuelPriceAmount']['minAmt'] : null,
                                    'lte': filterDetails['fuelPriceAmount'] ? filterDetails['fuelPriceAmount']['maxAmt'] : null
                                }
                            }
                        },
                        {
                            'query_string': {
                                'default_field': 'unitOfVolumeMeasurementCode.keyword',
                                'query': filterDetails['unitOfVolumeMeasurementCode']
                            }
                        },
                        {
                            'query_string': {
                                'default_field': 'currencyCode.keyword',
                                'query': filterDetails['currencyCode']
                            }
                        },
                        {
                            'query_string': {
                                'default_field': 'fuelTypeName.keyword',
                                'query': filterDetails['fuelTypeName']
                            }
                        },
                        {
                            'range': {
                                'effectiveDate': {
                                    'gte': filterDetails['effectiveDateStart'],
                                    'lte': filterDetails['effectiveDateEnd']
                                }
                            }
                        },
                        {
                            'range': {
                                'expirationDate': {
                                    'gte': filterDetails['expireDateStart'],
                                    'lte': filterDetails['expireDateEnd']
                                }
                            }
                        },
                        {
                            'query_string': {
                                'default_field': 'createProgramName.keyword',
                                'query': filterDetails['createProgramName']
                            }
                        },
                        {
                            'query_string': {
                                'default_field': 'createTimestamp.keyword',
                                'query': filterDetails['createTimestamp'] ? filterDetails['createTimestamp'].replace(/:/g, '\\$&') : '*'
                            }
                        },
                        {
                            'query_string': {
                                'default_field': 'createUserID.keyword',
                                'query': filterDetails['createUserID']
                            }
                        },
                        {
                            'query_string': {
                                'default_field': 'lastUpdateProgramName.keyword',
                                'query': filterDetails['lastUpdateProgramName']
                            }
                        },
                        {
                            'query_string': {
                                'default_field': 'pricingCountryCode.keyword',
                                'query': filterDetails['pricingCountryCode']
                            }
                        },
                        {
                            'query_string': {
                                'default_field': 'lastUpdateTimestamp.keyword',
                                'query': filterDetails['lastUpdateTimestamp'] ?
                                    filterDetails['lastUpdateTimestamp'].replace(/:/g, '\\$&') : '*'
                            }
                        },
                        {
                            'query_string': {
                                'default_field': 'lastUpdateUserID.keyword',
                                'query': filterDetails['lastUpdateUserID']
                            }
                        },
                        {
                            'script': {
                                'script': {
                                    'source': `def sf = new SimpleDateFormat('yyyy-MM-dd'); def date = params.querydate;(
                                    (sf.parse(doc['expirationDate.keyword'].value)).after(sf.parse(date)) || (sf.parse(doc
                                        ['expirationDate.keyword'].value)).equals(sf.parse(date))) && ((sf.parse(doc
                                            ['effectiveDate.keyword'].value)).before(sf.parse(date)) || (sf.parse(doc
                                                ['effectiveDate.keyword'].value)).equals(sf.parse(date)))`,
                                    'lang': 'painless',
                                    'params': {
                                        'querydate':
                                            filterDetails['effectiveNonMatchDate']
                                    }
                                }
                            }
                        },
                        {
                            'script': {
                                'script': {
                                    'source': `def sf = new SimpleDateFormat('yyyy-MM-dd'); def date = params.querydate;(
                                    (sf.parse(doc['expirationDate.keyword'].value)).after(sf.parse(date)) || (sf.parse(doc
                                        ['expirationDate.keyword'].value)).equals(sf.parse(date))) && ((sf.parse(doc
                                            ['effectiveDate.keyword'].value)).before(sf.parse(date)) || (sf.parse(doc
                                                ['effectiveDate.keyword'].value)).equals(sf.parse(date)))`,
                                    'lang': 'painless',
                                    'params': {
                                        'querydate':
                                            filterDetails['expirationNonMatchDate']
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        };
        this.queryValidator(filterDetails, str);
        if (filterDetails['sordDetails']['field']) {
            const sort = filterDetails['sordDetails'];
            const sortObj = {};
            if (sort['field'].toLowerCase() === 'fuelpriceamount') {
                sortObj[`${sort.field}`] = {
                    order: `${sort.order}`
                };
            } else {
                sortObj[`${sort.field}.keyword`] = {
                    order: `${sort.order}`
                };
            }
            str['sort'] = sortObj;
        }
        return str;
    }
    static queryValidator(filterDetails, str) {
        if (filterDetails['effectiveType'] === 'effectiveNonMatch' && filterDetails['expirationType'] !== 'expirationNonMatch') {
            str['query']['bool']['must'].splice(str['query']['bool']['must'].length - 1, 1);
        } else if (filterDetails['effectiveType'] !== 'effectiveNonMatch' && filterDetails['expirationType'] === 'expirationNonMatch') {
            str['query']['bool']['must'].splice(str['query']['bool']['must'].length - 2, 1);
        } else if ((filterDetails['effectiveType'] === 'effectiveNonMatch' && filterDetails['expirationType'] === 'expirationNonMatch')) {
            filterDetails['expirationType'] = 'expirationNonMatch';
        } else {
            str['query']['bool']['must'].splice(str['query']['bool']['must'].length - 1, 1);
            str['query']['bool']['must'].splice(str['query']['bool']['must'].length - 1, 1);
        }
    }
    static defaultSort() {
        return [
            {
                'fuelPriceSourceTypeName.keyword': {
                    'order': 'asc'
                },
                'effectiveDate.keyword': {
                    'order': 'desc'
                },
                'fuelRegionName.keyword': {
                    'order': 'asc'
                }
            }];
    }
}
