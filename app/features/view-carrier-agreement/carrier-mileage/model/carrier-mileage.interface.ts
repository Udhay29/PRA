export interface Column {
    label: string;
    field: string;
    isArray: boolean;
}
export interface QueryMock {
    sourceData: string;
}
export interface ViewCarrierMileageQueryModel {
    size: number;
    from: number;
    _source: string[];
    query: Query;
    sort: any[];
}
export interface Query {
    bool: Bool;
}
export interface Bool {
    must: MustItem[];
}
export interface MustItem {
    query_string?: QueryString;
    range?: Range;
}
export interface Range {
    expirationDate: ExpirationDate;
}
export interface ExpirationDate {
    gte: string;
}
export interface QueryString {
    default_field: string;
    query: string;
}


