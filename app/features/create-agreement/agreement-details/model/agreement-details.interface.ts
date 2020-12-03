import { SelectItem } from 'primeng/api';
export interface AgreementTypesResponse {
  _embedded: Embedded;
  _links: Links;
}
export interface Embedded {
  agreementTypes: AgreementTypesItem[];
}
export interface AgreementTypesItem {
  tenantID: number;
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
  OrganizationName?: string;
  OrganizationCode?: string;
  Level?: string;
  OrganizationID?: number;
  OrganizationAliasName?: string;
  taskAssignmentID?: number;
  orderOwnershipID?: number;
  taskAssignmentName?: string;
  taskGroupID?: number;
  taskGroupName?: string;
  teamMemberTaskAssignmentRoleAssociationDTOs?: TaskAssignment[];
  LegalName?: string;
  CarrierID?: number;
  CarrierCode?: string;
}
export interface TaskAssignment {
  teamMemberTaskAssignmentRoleAssociationID: number;
  alternateRoleIndicator: string;
  taskAssignmentID: number;
  teamID: number;
  teamName: string;
  teamMemberTeamAssignmentID: number;
  teamMemberID: string;
  teamMemberName: string;
  taskGroupRoleTypeAssociationID: number;
  roleTypeCode: string;
  roleTypeName: string;
  teamTeamMemberId: string;
  effectiveTimestamp: string;
  expirationTimestamp: string;
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
  order?: Order;
}
export interface Order {
_key: string;
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
export interface AccountDetails {
  OrganizationName: string;
  accountName: string;
  accountCode: string;
  partyId: number;
}
export interface TeamsList {
  teamName: string;
  teamID: number;
  teamAssignmentID: number;
}
export interface ButtonItem {
  label: string;
  value: string;
}
export interface CreateSaveResponse {
  customerAgreementID: number;
  customerAgreementName: string;
  agreementType: null;
  cargoReleaseAmount: null;
  businessUnits: null;
  taskAssignmentIDs: null;
  effectiveDate: string;
  expirationDate: string;
  ultimateParentAccountID: number;
  accountName?: AccountDetails;
  teams?: TeamsList[];
}
export interface CarrierDTO {
  legalName: string;
  carrierID: number;
  carrierCode: string;
  carrierDisplayName: string;
}
export interface AgreementEvent {
  originalEvent?: MouseEvent;
  value: string;
}
export interface CarrierSaveRequest {
  agreementName: string;
  carriers: CarrierSaveList[];
  effectiveDate: string;
  expirationDate: string;
}
export interface CarrierSaveList {
  carrierName: string;
  carrierCode: string;
  carrierStatus: string;
  carrierID: number;
  effectiveDate: string;
  expirationDate: string;
  carrierDisplayName: string;
  carrierRowID: number;
}
