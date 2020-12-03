export interface BreadcrumbSearchOwo {
  label: string;
  routerLink: Array<string>;
}
export interface SetDefaultColumnsSearchOwo {
  property: string;
  name: string;
  isVisible: boolean;
}
export interface SearchData {
  favoriteSearches?: string;
  businessUnit?: string;
  equipmentNumber?: any;
  from?: number;
  size?: number;
}
export interface SearchResponse {
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
  hits: InnerHits[];
}

export interface InnerHits {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: SourceData;
}

export interface SourceData {
  AgreementType: string;
  AgreementTenantID: number;
  AgreementEffectiveDate: Date;
  AgreementID: number;
  AgreementName: string;
  UniqueDocID: number;
  AgreementStatus: string;
  AgreementExpirationDate: Date;
}
export interface HitsModel {
  sort: Array<string>;
  _id: string;
  _index: string;
  _score: number;
  _source: SourceModel;
  _type: string;
}
export interface SourceModel {
  AgreementExpirationDate: string;
  AgreementID: number;
  AgreementInvalidIndicator: string;
  AgreementName: string;
  AgreementStatus: string;
  AgreementType: string;
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
  aggregations: AggregationsModel;
}
export interface AggregationsModel {
  by_agreement: ByAgreementModel;
  count: CountModel;
}
export interface CountModel {
  value: number;
}
export interface ByAgreementModel {
  buckets: Array<BucketModel>;
  doc_count_error_upper_bound: number;
  sum_other_doc_count: number;
}
export interface BucketModel {
  doc_count: number;
  key: string;
  top_sales_hits: TopSalesHitsModel;
}
export interface TopSalesHitsModel {
  hits: RootHitsModel;
}
