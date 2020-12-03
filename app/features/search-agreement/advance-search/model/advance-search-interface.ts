import { Observable } from 'rxjs';

export interface Self {
  href: string;
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
  fields?: object;
  sort?: Array<string>;
}
export interface Source {
  AgreementName?: string;
  UltimateParentAccountCode?: string;
  carrierAgreementName?: string;
}
export interface Aggregations {
  group_by_description?: GroupByDesc;
  nesting?: Nesting;
}
export interface Nesting {
  doc_count?: number;
  by_contractName?: ByContractName;
  by_BillingPartyCode?: ByPartyName;
  by_teamName?: ByContractName;
}

export interface ByPartyName {
  doc_count?: number;
  by_BillingPartyName?: ByContractName;
}
export interface ByContractName {
  doc_count_error_upper_bound?: number;
  sum_other_doc_count?: number;
  buckets?: Buckets[];
}
export interface GroupByDesc {
  doc_count_error_upper_bound: number;
  sum_other_doc_count: number;
  buckets: Buckets[];
}
export interface Buckets {
  key?: string;
  doc_count?: number;
  buckets?: string;
  by_ContractNumber?: ByContractName;
  by_BillingPartyCode?: ByBillingPartyCode;
}
export interface ByBillingPartyCode {
  doc_count_error_upper_bound: number;
  sum_other_doc_count: number;
  buckets: Buckets[];
}
export interface AgreementTypesResponse {
  _embedded: Embedded;
  _links: Links;
}
export interface Embedded {
  agreementTypes: AgreementTypesItem[];
}
export interface AgreementTypesItem {
  tenantID?: number;
  agreementTypeName: string;
  agreementTypeID: number;
  _links: Links;
}
export interface Links {
  self: Self;
  agreementType?: AgreementType;
}
export interface Self {
  href: string;
}
export interface AgreementType {
  href: string;
  templated: boolean;
}
export interface ContractResultList {
  Contract: string;
  ContractName: string;
  contractId: string;
}
export interface AgreementResultList {
  AgreementName: string;
}
export interface CarrierNameList {
  CarrierName?: string;
  CarrierAgreementName?: string;
}
export interface BillToResultList {
  BillToCode: string;
  PartyName: string;
  PartyCode: string;
}
