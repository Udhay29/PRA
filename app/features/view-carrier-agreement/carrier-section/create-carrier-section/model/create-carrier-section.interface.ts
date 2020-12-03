export interface CarrierSegmentTypesItem {
  carrierSegmentTypeID: string;
  carrierSegmentTypeName: string;
  defaultBusinessUnitCode: string;
  effectiveDate: string;
  expirationDate: string;
  defaultIndicator: string;
}
export interface RootObject {
  _embedded: Embedded;
  _links?: Links;
}
export interface ESRootObject {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits;
  aggregations?: Aggregations;
}
export interface Embedded {
  serviceOfferingBusinessUnitTransitModeAssociations?: ServiceOfferingBusinessUnit[];
  carrierSegmentTypes?: CarrierSegmentTypesItem[];
}
export interface ServiceOfferingBusinessUnit {
  financeBusinessUnitServiceOfferingAssociation: FinanceBusinessUnitServiceOfferingAssociation;
  transitMode: null;
  utilizationClassification: null;
  freightShippingType: null;
  lastUpdateTimestampString: null;
  _links: Links;
}
export interface FinanceBusinessUnitServiceOfferingAssociation {
  financeBusinessUnitServiceOfferingAssociationID: null;
  financeBusinessUnitCode: string;
  serviceOfferingCode: null;
  effectiveTimestamp: null;
  expirationTimestamp: null;
  lastUpdateTimestampString: null;
}
export interface Links {
  self: Self;
  serviceOfferingBusinessUnitTransitModeAssociation?: Self;
}
export interface Self {
  href: string;
  templated?: boolean;
}
export interface QueryRootObject {
  size: number;
  _source: string[];
  from?: number;
  query?: Query;
  aggs?: Aggs;
}
export interface Query {
  bool: Bool;
}
export interface Bool {
  must: MustItem[];
}
export interface MustItem {
  query_string: QueryString;
}
export interface QueryString {
  default_field?: string;
  query: string;
  split_on_whitespace?: boolean;
  fields?: string[];
  default_operator?: string;
  analyze_wildcard?: boolean;
}
export interface Aggs {
  unique?: ESAUnique;
  Level?: ESALevel;
}
export interface ESAUnique {
  terms: Terms;
  aggs: Aggs;
}
export interface Terms {
  field: string;
  size: number;
}
export interface ESALevel {
  top_hits: TopHits;
}
export interface TopHits {
  _source: ESASource;
  size: number;
}
export interface ESASource {
  includes: string[];
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
export interface Aggregations {
  unique: Unique;
}
export interface Unique {
  doc_count_error_upper_bound: number;
  sum_other_doc_count: number;
  buckets: BucketsItem[];
}
export interface BucketsItem {
  key: string;
  doc_count: number;
  Level: Level;
}
export interface Level {
  hits: Hits;
}
export interface HitsItem {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: Source;
}
export interface Source {
  OrganizationHierarchyID?: number;
  HierarchyID: number;
  Level: string;
  OrganizationID: number;
  OrganizationName: string;
  OrganizationAliasName: string;
  OrganizationCode: string;
}
export interface Column {
  label: string;
  key: string;
}
export interface BillToAccountItem {
  billingPartyID: string;
  billingPartyCode: string;
  billingPartyName: string;
  sectionID: null | string;
  sectionName: null | string;
}
export interface CarrierSectionSaveRequest {
  carrierAgreementID: string;
  carrierAgreementName: string;
  carrierAgreementSectionID: null | string;
  carrierAgreementSectionName: string;
  carrierAgreementSectionSegmentType: string;
  carrierAgreementSectionBusinessUnit: string;
  carrierAgreementSectionEffectiveDate: string;
  carrierAgreementSectionExpirationDate: string;
  carrierAgreementSectionAccounts: BillToAccountItem[];
  billToEndDate: boolean;
  impactSectionCount: null | string;
}
export interface BillToItem {
  billToDisplay: string;
  assignment: string;
  rowDetail: BillToAccountItem;
}
export interface BillToParam {
  carrierAgreementID: number;
  carrierSegmentTypeID: null | number;
  sectionEffectiveDate: null | string;
  sectionExpirationDate: null | string;
  currentDate: null | string;
  carrierSegmentTypeName: null | string;
  financeBusinessUnitCode: null | string;
}
export interface CarrierDetails {
  agreementName: string;
  agreementStatus: string;
  agreementType: string;
  carriers: Carrier[];
  agreementEffectiveDate: string;
  agreementExpirationDate: string;
}
export interface Carrier {
  carrierID: number;
  carrierName: string;
  carrierCode: string;
}
