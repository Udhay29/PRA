export class FilterDataInterface {
  title: string;
  url: string;
  query: object;
  callback: any;
}
export class ListingFilterInterface {
  title: string;
  url: string;
  query: object;
  callback: any;
  inputFlag: boolean;
}
export class ListingStaticInterface {
  title: string;
  url: string;
  callback: any;
  inputFlag: boolean;
  expanded?: boolean;
  isStatus?: boolean;
}

export interface ListRadio {
  title: string;
  data: Array<object>;
}
export class SliderDataInterface {
  title: string;
  min: number;
  max: number;
  range: boolean;
  default: string;
}
export interface ListItem {
  value: string;
  label: string;
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
  AgreementID: number;
  ContractID: number;
  ContractRanges: Ranges[];
}
export interface Fields {
  Status: string;
  ContractRanges: string[];
}
export interface Ranges {
  ContractComment: string;
  ContractNumber: string;
  LastUpdateProgram: string;
  CreateUser: string;
  ContractExpirationDate: string;
  ContractInvalidReasonType: string;
  ContractVersionID: number;
  ContractInvalidIndicator: string;
  LastUpdateTimestamp: string;
  ContractName: string;
  LastUpdateUser: string;
  ContractEffectiveDate: string;
  ContractTypeName: string;
  CreateProgram: string;
  CreateTimestamp: string;
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
export interface ContractTypes {
  _embedded: Embedded;
  _links: Links;
}
export interface Embedded {
  contractTypes?: ContractTypesItem[];
}
export interface Links {
  self: string;
  contractType?: ContractType;
}
export interface ContractTypesItem {
  contractTypeName?: string;
  contractTypeID?: number;
  _links: Links;
}
export interface ContractType {
  href: string;
  templated: boolean;
}
export interface DateParameter {
  dateName: string;
  keyName: string;
  keyName1: string;
  index: number;
  pointer: number;
  level: string;
  exactMatch: string;
  dateOnly: string;
}
