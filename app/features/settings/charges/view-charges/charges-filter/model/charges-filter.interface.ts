export interface Ranges {
  CreateTimestamp: string;
}
export class BusinessUnitFilterInterface {
  title: string;
  url: string;
  query: object;
  callback: any;
  inputFlag: boolean;
}

export class StatusInterface {
  title: string;
  data?: any;
  query: object;
  callback?: any;
  url?: string;
  expanded?: boolean;
}
export class ChargeTypeFilterInterface {
  title: string;
  url: string;
  query: object;
  callback: any;
  inputFlag: boolean;
}

export class RateTypeFilterInterface {
  title: string;
  url: string;
  query: object;
  callback: any;
  inputFlag: boolean;
}
export class UsageInterface {
  title: string;
  url: string;
  query: object;
  callback: any;
  inputFlag: boolean;
}

export class ApplicationLevel {
  title: string;
  data?: any;
  callback?: any;
  url?: string;
  expanded?: boolean;
}


export class QuantityRequiredInterface {
  title: string;
  data?: any;
  callback?: any;
  url?: string;
  expanded?: boolean;
}

export class ServiceOfferingInterface {
  title: string;
  url: string;
  query: object;
  callback: any;
  inputFlag: boolean;
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

