export interface FuelPriceTableColumn {
    name: string;
    property: string;
    isVisible: boolean;
    columnWidth?: string;
}
export interface FuelPriceTableRowItem {
    currencyCode: string;
    effectiveDate: string;
    expirationDate: string;
    fuelRegionName: string;
    fuelPriceAmount: string;
    fuelPriceSourceTypeName: string;
    fuelSubDistrictName: any;
    fuelTypeName: string;
    invalidIndicator: string;
    invalidReasonTypeName: string;
    pricingCountryCode: string;
    unitOfVolumeMeasurementCode: string;
    uniqueDocID: string;
    createTimestamp: string;
    createUserID: string;
    createProgramName: string;
    lastUpdateTimestamp: string;
    lastUpdateUserID: string;
    lastUpdateProgramName: string;
}
export interface HitsModel {
    _id: string;
    _index: string;
    _score: number;
    _source: FuelPriceTableRowItem;
    _type: string;
}

export interface ShardsModel {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
}

export interface RootHitsModel {
    hits: Array<HitsModel>;
    max_score: number;
    total: number;
}

export interface ElasticResponseModel {
    hits: RootHitsModel;
    timed_out: boolean;
    took: number;
    _shards: ShardsModel;
    aggregations?: any;
}
export interface ELQueryStringField {
    default_field: string;
    query: string;
}
export interface ELQueryString {
    query_string: ELQueryStringField;
}
export interface ELQueryRootMust {
    must: Array<ELQueryString>;
}
export interface ELQueryRoot {
    bool: number;
}
export interface ELQueryMain {
    from: number;
    size: number;
    query: ELQueryRoot;
}

export interface SordDetails {
    field: string;
    order: string;
}
export interface FilterRequest {
    from: number;
    size: number;
    pricingCountryCode: string;
    fuelPriceSourceTypeName: string;
    fuelRegionName: string;
    fuelPriceAmount: string | object;
    unitOfVolumeMeasurementCode: string;
    currencyCode: string;
    fuelTypeName: string;
    effectiveDateStart: string;
    effectiveDateEnd: string;
    expireDateStart: string;
    expireDateEnd: string;
    sordDetails: SordDetails;
    createProgramName: string;
    createTimestamp: string;
    createUserID: string;
    lastUpdateProgramName: string;
    lastUpdateTimestamp: string;
    lastUpdateUserID: string;
    effectiveType?: string;
    expirationType?: string;
    effectiveNonMatchDate?: string;
    expirationNonMatchDate?: string;
}
export class SortInterface {
    field: string;
    order: number;
}
