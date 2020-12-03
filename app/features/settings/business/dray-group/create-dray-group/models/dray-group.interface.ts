export interface DateRangeInterface {
    _embedded: {
        configurationParameterDetails: [{
            configurationParameter: object,
            configurationParameterDetailID: number,
            configurationParameterValue: string
        }]
    };
    _links: {
        configurationParameterDetail: {
            href: string,
            templated: boolean
        }
    };
}

export interface CountryInterface {
    drayGroupCountryCode: number;
    drayGroupCountryName: string;
}

export interface RateScopeInterface {
    rateScopeTypeName: string;
    rateScopeTypeID: number;
    defaultIndicator: string;
}

export interface DragGroupSaveResponse {
    drayGroupName: string;
    drayGroupCode: string;
    rateScopeTypeName: string;
    rateScopeTypeID: number;
    effectiveDate: Date;
    expirationDate: Date;
    drayGroupCountries: Array<CountryInterface>;
}
