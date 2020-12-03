export interface ESObject {
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
  hits: HitsItem[];
}
export interface HitsItem {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: Source;
}
export interface Source {
  UniqueDocID: string;
  AgreementID: number;
  AgreementTenantID: number;
  AgreementType: string;
  AgreementName: string;
  AgreementEffectiveDate: string;
  AgreementExpirationDate: string;
  AgreementStatus: string;
  AgreementInvalidIndicator: string;
  AgreementInvalidReasonType: string;
  UltimateAccountParentID: number;
  UltimateParentAccountName: string;
  UltimateParentAccountCode: string;
  ContractID: number;
  ContractOriginalEffectiveDate: string;
  ContractOriginalExpirationDate: string;
  ContractRanges: ContractRangesItem[];
  SectionID: number;
  SectionOriginalEffectiveDate: string;
  SectionOriginalExpirationDate: string;
  SectionRanges: SectionRangesItem[];
  Teams: TeamsItem[];
}
export interface ContractRangesItem {
  ContractVersionID: number;
  ContractTypeName: string;
  ContractName: string;
  ContractNumber: null | string;
  ContractComment: string;
  ContractEffectiveDate: string;
  ContractExpirationDate: string;
  ContractInvalidIndicator: string;
  ContractInvalidReasonType: string;
  CreateUser: null | string;
  CreateProgram: string;
  CreateTimestamp: string;
  LastUpdateUser: null | string;
  LastUpdateProgram: string;
  LastUpdateTimestamp: string;
}
export interface SectionRangesItem {
  SectionVersionID: number;
  SectionName: string;
  SectionTypeName: string;
  SectionCurrencyCode: string;
  SectionEffectiveDate: string;
  SectionExpirationDate: string;
  SectionInvalidIndicator: string;
  SectionInvalidReasonType: string;
  CreateUser: null | string;
  CreateProgram: string;
  CreateTimestamp: string;
  LastUpdateUser: null | string;
  LastUpdateProgram: string;
  LastUpdateTimestamp: string;
  BillToCodes: BillToCodesItem[];
}
export interface TeamsItem {
  TaskAssignmentID: number;
  TeamID: null | number;
  TeamName: null | string;
  TeamEffectiveDate: string;
  TeamExpirationDate: string;
}
export interface BillToCodesItem {
  ContractSectionAccountID: number;
  BillingPartyID: number;
  BillingPartyName: string;
  BillingPartyCode: string;
  BillToEffectiveDate: string;
  BillToExpirationDate: string;
}
export interface BillToDetails {
  billingpartyCode: string;
  billingpartyDescription: string;
}
export interface RootObject {
  _embedded: Embedded;
  _links: Links;
}
export interface Embedded {
  sectionTypes?: SectionTypesItem[];
  customerAgreementContractVersions?: CustomerAgreementContractsItem[];
  customerAgreementContractSections?: CustomerAgreementContractSection[];
  configurationParameterDetails?: ConfigurationParameterDetailsItem[];
}
export interface ConfigurationParameterDetailsItem {
  configurationParameterDetailID: number;
  configurationParameterValue: string;
  parameterSpecificationType: SpecificationType;
  parameterSpecificationTypeName: string;
  configurationParameter: Parameter;
  _links: Links;
}
export interface Parameter {
  configurationParameterID: number;
  configurationParameterName: string;
  configurationParameterValueType: string;
}
export interface SpecificationType {
  parameterSpecificationTypeName: string;
  parameterSpecificationTypeID: number;
}
export interface SectionTypesItem {
  sectionTypeName: string;
  sectionTypeID: number;
  _links: Links;
}
export interface CustomerAgreementContractSection {
  currencyCode: string;
  customerAgreementContractSectionTypeName: string;
  customerAgreementContractSectionAccounts: CustomerAgreementContractSectionAccountsItem[];
  customerAgreementContractSectionID: number;
  customerAgreementContractSectionName: string;
  customerAgreementContractTypeID: string;
  customerAgreementContractSectionTypeID: number;
  customerAgreementContractTypeName: string;
  customerContractName: string;
  customerContractNumber: null | string;
  effectiveDate: string;
  expirationDate: string;
  customerAgreementContractSectionVersionID: number;
  _links: Links;
}
export interface CustomerAgreementContractSectionAccountsItem {
  billingPartyID: number;
}
export interface CustomerAgreementContractsItem {
  label?: string;
  value?: string;
  effectiveDate: string;
  expirationDate: string;
  customerAgreementContractID: number;
  customerAgreementID?: number;
  customerContractName: string;
  customerAgreementContractTypeName?: string;
  contractTypeID?: string;
  contractTypeName: string;
  customerContractNumber: string;
  customerAgreementContractVersionID?: number;
  customerAgreementContractTypeID?: string;
  _links?: Links;
}
export interface Links {
  self: Self;
  customerAgreementContractVersion?: Self;
  customerAgreementContractSection?: Self;
  customerAgreementContractSectionVersions?: Self;
  sectionType?: Self;
  configurationParameterDetail?: Self;
}
export interface Self {
  href: string;
  templated?: boolean;
}
export interface CodesResponse {
  billingPartyID: number;
  effectiveDate: string | null;
  expirationDate: string | null;
  billingPartyName: string;
  billingPartyCode: string;
  codes?: string;
  isRemoved?: boolean;
  customerAgreementContractSectionAccountID?: number | null;
}
export interface DateFormat {
  date: DateObject;
}
export interface DateObject {
  year: number;
  month: number;
  day: number;
}
export interface AgreementDetails {
  customerAgreementID: number;
  agreementType?: string;
  effectiveDate: string;
  expirationDate: string;
  accountDTO?: AccountDTO;
  teams?: TeamsItem[];
}
export interface AccountDTO {
  accountName: string;
  accountCode: string;
  partyID: number;
  codes?: string;
  effectiveDate?: string;
  expirationDate?: string;
}
export interface TeamsItem {
  teamAssignmentID: string;
  teamID: string;
  teamName: string;
}
export interface Column {
  label: string;
  key: string;
  tooltip: string;
}
export interface TableFormat {
  sectionName: string;
  sectionType: string;
  currency: string;
  contract: string;
  effectiveDate: string;
  expirationDate: string;
  toolTipForBillTo: string;
  selectedCode: string;
  sectionId: number;
  agreementId: number;
  contractId: number;
  sectionVersionID: number;
}
export interface CodesParam {
  agreementId: number;
  contractId: number;
  effectiveDate?: string;
  expirationDate?: string;
}
export interface SaveRequest {
  customerAgreementContractSectionID: number;
  customerAgreementContractSectionVersionID: number;
  customerAgreementContractSectionName: string;
  customerAgreementContractSectionTypeID: number;
  customerAgreementContractSectionTypeName: string;
  currencyCode: string;
  customerAgreementContractDTO: CustomerAgreementContractsItem;
  customerAgreementContractSectionAccountDTOs: CodesResponse[];
  effectiveDate: string;
  expirationDate: string;
  customerAgreementOwnershipUpdateDTOs?: TeamsItem[];
  isContractChanged: boolean;
  isCreateAgreementFlow: boolean;
}
export interface SaveResponse {
  customerAgreementContractSectionID: number;
  customerAgreementContractSectionVersionID: number;
  customerAgreementContractSectionName: string;
  customerAgreementContractSectionTypeID: number;
  customerAgreementContractSectionTypeName: string;
  currencyCode: string;
  customerAgreementContractTypeID: number;
  customerAgreementContractTypeName: string;
  customerContractNumber: string | null;
  customerContractName: string;
  customerAgreementContractSectionAccountDTOs: CodesResponse[];
  effectiveDate: string;
  expirationDate: string;
  status?: string;
  createUserID?: string;
  lastUpdateUserID?: string;
  lastUpdateProgramName?: string;
  createProgramName?: string;
  createTimestamp?: string;
  lastUpdateTimestamp?: string;
  originalEffectiveDate?: string;
  originalExpirationDate?: string;
}
export interface RowEvent {
  data: TableFormat;
  index?: number;
  originalEvent?: MouseEvent;
  type: string;
}
