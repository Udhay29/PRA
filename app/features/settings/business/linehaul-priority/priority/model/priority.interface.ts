const LineHaulPriorityGroupNumberIntegerString = 'lineHaulPriorityGroupNumber.integer';
export interface PriorityQueryModel {
    from: number;
    size: number;
    _source: string[];
    query: Query;
    sort: Sort[];
}
export interface QueryString {
    fields: string[];
    query: string;
    default_operator: string;
}

export interface Should {
    query_string: QueryString;
}

export interface QueryString2 {
    default_field: string;
    query: string;
}

export interface Must2 {
    query_string: QueryString2;
}

export interface Bool2 {
    should: Should[];
    must: Must2[];
}

export interface Must {
    bool: Bool2;
}

export interface Bool {
    must: Must[];
}

export interface Query {
    bool: Bool;
}
export interface Sort {
    [LineHaulPriorityGroupNumberIntegerString]: LineHaulPriorityGroupNumberInteger;
}
export interface LineHaulPriorityGroupNumberInteger {
    order: string;
}
export interface Source {
    lineHaulPriorityGroupNumber: number;
    originPointPriorityGroupName: string;
    destinationPointPriorityGroupName: string;
}
export interface ElasticResponse {
    took: number;
    timed_out: boolean;
    _shards: Shards;
    hits: Hits;
}
export interface Shards {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
}
export interface Hits {
    total: number;
    max_score: null;
    hits: HitsItem[];
}
export interface HitsItem {
    _index: string;
    _type: string;
    _id: string;
    _score: null;
    _source: Source;
    sort: string[];
}
