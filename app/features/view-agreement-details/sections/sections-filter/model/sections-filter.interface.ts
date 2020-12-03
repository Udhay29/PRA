export class FilterConfig {
  title?: string;
  url?: string;
  query?: object;
  callback?: object;
  inputFlag?: boolean;
  expanded?: boolean;
  data?: object;
  isStatus?: boolean;
}

export interface RootObject {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits;
  aggregations?: Aggregations;
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
  _source?: Source;
  fields: Fields;
  sort: string[];
}
export interface Source {
  businessUnitServiceOffering: number;
}
export interface Fields {
  Status: string;
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
export interface EffectiveDateParameter {
  index: number;
  queryField: string;
  lte: string;
  gte: string;
  unmatchExpirationDate: string;
  type: string;
}
export interface ExpirationDateParameter {
  index: number;
  queryField: string;
  lte: string;
  gte: string;
  unmatchEffectiveDate: string;
  type: string;
}

