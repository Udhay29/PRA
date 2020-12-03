export interface HitsModel {
    sort: Array<string>;
    _id: string;
    _index: string;
    _score: number;
    _source: any;
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
}
