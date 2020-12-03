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
export interface ESALevel {
  top_hits: TopHits;
}
export interface Terms {
  field: string;
  size: number;
}
export interface TopHits {
  _source: ESASource;
  size: number;
}
export interface ESASource {
  includes: string[];
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
export interface TeamsList {
  teamName: string;
  teamID: number;
  teamAssignmentID: number;
}
export interface ResponseData {
  _embedded: Embedded;
  _links: object;
}
export interface Embedded {
  customerAgreementOwnerships: OwnershipDetails[];
}
export interface OwnershipDetails {
  customerAgreementOwnershipID?: number;
  effectiveDate?: string;
  customerAgreementID?: number;
  expirationDate?: string;
  taskAssignmentID?: number;
  isRemoved?: boolean;
  teamID?: number;
  teamName?: string;
}
export interface BillToOwnerDetails {
  billToName: string;
  currency: string;
  billToCode: string;
  salesPersonUid: string;
  salesPersonName: string;
  salesPersonPosId: string;
  prePdaUid: string;
  prePdaName: string;
  prePdaPosId: string;
  invoicingPdaUid: string;
  invoicingPdaName: string;
  invoicingPdaPosId: string;
  postPdaUid: string;
  postPdaName: string;
  postPdaPosId: string;
  pdmUid: string;
  pdmName: string;
  pdmPosId: string;
}
export interface ViewData {
  agreementName: string;
  parentId: number;
  agreementId: number;
  effectiveDate: string;
  expirationDate: string;

}
