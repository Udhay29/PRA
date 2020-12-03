export class FuelFilterQuery {

    static getListingFilterFieldsQuery(fieldName: string, flag: boolean) {
        return {
            'from': 0,
            'size': 2000,
            '_source': fieldName,
            'query': {
                'query_string': {
                    'default_field': `${fieldName}${'.keyword'}`,
                    'query': flag ? '*' : '*search-query-text*',
                }
            }
        };
    }
    static getInitialJson() {
        return {
            'fuelPriceSourceTypeName': 'DOE',
            'fuelRegionName': 'National',
            'fuelPriceAmount': '*',
            'unitOfVolumeMeasurementCode': '*',
            'currencyCode': '*',
            'pricingCountryCode': '*',
            'fuelTypeName': '*',
            'createUserID': '*',
            'createTimestamp': '*',
            'createProgramName': '*',
            'lastUpdateUserID': '*',
            'lastUpdateTimestamp': '*',
            'updatedProgramData': '*',
            'lastUpdateProgramName': '*'
        };
    }
}
