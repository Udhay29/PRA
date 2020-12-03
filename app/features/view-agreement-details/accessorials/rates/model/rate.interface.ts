export interface TableColumnsInterface {
  label: string;
  field: string;
  isArray: boolean;
  isSubcolumn: boolean;
  isNotFirst: boolean;
}
export interface HitsItem {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: object;
}
export interface RateGridDto {
  took: number;
  timed_out: boolean;
  _shards: Shared;
  hits: Hits;
}
export interface Shared {
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
