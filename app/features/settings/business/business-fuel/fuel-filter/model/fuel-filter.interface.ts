export interface ElasticRootObject {
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
    max_score: number;
    hits: HitsItem[];
}
export interface HitsItem {
    _index?: string;
    _type?: string;
    _id?: string;
    _score?: number;
    _source?: object;
    fields: object;
    sort: string[];
}
export interface Aggregations {
    nesting?: Nesting;
}
export interface Nesting {
    doc_count: number;
    count: Count;
}
export interface Count {
    value: number;
}
export interface DropdowmInterface {
    label: string;
    value: string;
}
export class ListingFilterInterface {
    title: string;
    url: string;
    query: object;
    callback: any;
    inputFlag: boolean;
    expanded?: boolean;
}
export class AutoCompleteFilter {
    title: string;
    url: string;
    query: object;
    callback: any;
}

