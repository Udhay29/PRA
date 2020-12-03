export interface QueryMock {
  sourceData: string;
  script: Scripts;
}
export interface Scripts {
  script1: string;
  script2: string;
  script3: string;
}
export interface RootObject {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits[];
  aggregations?: Aggregations;
}
export interface Aggregations {
  nesting: Nesting;
}
export interface Nesting {
  doc_count: number;
  count: Count;
}
export interface Count {
  value: number;
}
export interface Shards {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}
export interface Hits {
  _index?: string;
  _type?: string;
  _id?: string;
  _score?: number;
  _source?: Source;
  fields: Fields;
  sort: string[];
}
export interface Source {
  SectionRanges: Section;
}
export interface Section {
  SectionComment?: string;
  SectionNumber?: string;
  LastUpdateProgram?: string;
  CreateUser?: string;
  SectionInvalidReasonType?: string;
  SectionVersionID?: number;
  SectionInvalidIndicator?: string;
  LastUpdateTimestamp?: string;
  LastUpdateUser?: string;
  CreateProgram?: string;
  CreateTimestamp?: string;
  SectionName?: string;
  SectionTypeName?: string;
  SectionCurrencyCode?: string;
  ContractName?: string;
  BillingPartyCode?: string[];
  Status?: string;
  SectionEffectiveDate?: string;
  SectionExpirationDate?: string;
  SectionOriginalEffectiveDate?: string;
  SectionOriginalExpirationDate?: string;
  OriginalExpirationDate?: string;
  AgreementID?: number;
  SectionID?: number;
  ContractID?: number;
  ContractNumber?: number;
  ContractTypeDisplay?: string;
  toolTipForBillTo?: string;
}

export interface Fields {
  Status: string[];
  SectionRanges: string[];
}
export interface TableColumnModel {
  name: string;
  property: string;
  keyword: string;
}

export interface SectionDetails {
  customerAgreementContractSectionID: number;
  customerAgreementContractSectionVersionID: number;
  customerAgreementContractSectionName: string;
  customerAgreementContractSectionTypeID: number;
  customerAgreementContractSectionTypeName: string;
  currencyCode: string;
  customerAgreementContractTypeID: number;
  customerAgreementContractTypeName: string;
  customerContractNumber: string;
  customerContractName: string;
  customerAgreementContractSectionAccountDTOs: CustomerAgreementContractSectionAccountDTO[];
  effectiveDate: string;
  expirationDate: string;
  status: string;
  createUserID: string;
  lastUpdateUserID: string;
  lastUpdateProgramName: string;
  createProgramName: string;
  createTimestamp: string;
  lastUpdateTimestamp: string;
  originalEffectiveDate?: string;
  originalExpirationDate?: string;
  displayEffectiveDate?: Date;
  displayExpirationDate?: Date;
  displayCreatedOn?: string;
  displayUpdatedOn?: string;
  displayOriginalEffectiveDate?: Date;
  displayOriginalExpirationDate?: Date;
  associatedCodesLength?: number;
}

export interface CustomerAgreementContractSectionAccountDTO {
  customerAgreementContractSectionAccountID?: number;
  billingPartyID: number;
  effectiveDate: string;
  expirationDate: string;
  billingPartyName: string;
  billingPartyCode: string;
  isRemoved?: boolean;
  assignedDateRange?: string;
  billToCodes?: string;
}



export interface AgreementDetails {
  customerAgreementID: number;
  customerAgreementName: string;
  agreementType: string;
  ultimateParentAccountID: number;
  currencyCode: string;
  cargoReleaseAmount: number | string;
  businessUnits: string[];
  taskAssignmentIDs: number[];
  effectiveDate: string;
  expirationDate: string;
  invalidIndicator: string;
  invalidReasonTypeName: string;
}
export interface SplitScreenDetails {
  isCreate: boolean;
  titleText: string;
  tableDeatils: Section[];
  agreementId: number;
  agreementDeatils: AgreementDetails;
  sectionDetails: SectionDetails;
}
export interface InitialStructure {
  _embedded: Embedded;
  _links: Links;
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
export interface Embedded {
  sectionTypes?: SectionTypesItem[];
  customerAgreementContractVersions?: CustomerAgreementContractsItem[];
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
  _links?: Links;
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
  contractTypeID?: number;
  contractTypeName?: string;
  customerContractNumber: string;
  customerAgreementContractVersionID?: number;
  customerAgreementContractTypeID?: number;
  _links?: Links;
}
export interface Column {
  label: string;
  key: string;
  tooltip: string;
}
export interface BillToList {
  customerAgreementContractSectionAccountID: number | null;
  billingPartyID: number;
  effectiveDate: string | null;
  expirationDate: string | null;
  billingPartyName: string;
  billingPartyCode: string;
  isRemoved: boolean | null;
  customerAgreementContractSectionID: number | null;
  customerAgreementContractSectionName: string | null;
}

export interface TableDisplayFormat {
  billToCodes: string;
  assignment: string;
  assignedDates: string;
  rowDetail: BillToList;
}
export interface CodesParam {
  agreementId: number;
  contractId: number;
}
export interface SaveRequest {
  customerAgreementContractSectionID: null;
  customerAgreementContractSectionVersionID: null;
  customerAgreementContractSectionName: string;
  customerAgreementContractSectionTypeID: number;
  customerAgreementContractSectionTypeName: string;
  currencyCode: string;
  customerAgreementContractDTO: CustomerAgreementContractsItem;
  customerAgreementContractSectionAccountDTOs: BillToList[];
  effectiveDate: string;
  expirationDate: string;
  isContractChanged: boolean;
  isCreateAgreementFlow: boolean;
  customerAgreementOwnershipUpdateDTOs: null;
}
export interface VersionBillToList {
  ContractSectionAccountID: number;
  BillingPartyID: number;
  BillingPartyName: string;
  BillingPartyCode: string;
  BillToEffectiveDate: string;
  BillToExpirationDate: string;
  billingPartyDisplayName: string;
}

export interface EditRequest {
  customerAgreementContractSectionID: number;
  customerAgreementContractSectionVersionID: number;
  customerAgreementContractSectionName: string;
  customerAgreementContractSectionTypeID: number;
  customerAgreementContractSectionTypeName: string;
  currencyCode: string;
  customerAgreementContractDTO: CustomerAgreementContractsItem;
  customerAgreementContractSectionAccountDTOs: BillToList[];
  effectiveDate: string;
  expirationDate: string;
  isContractChanged: boolean;
  isCreateAgreementFlow: boolean;
  customerAgreementOwnershipUpdateDTOs: null;
  lastUpdateTimestamp: string;
}

export interface BillToCodesParam {
  sectionId: string;
  sectionVerId: string;
}

export interface EditCodeParam {
  agreementId: number;
  contractId: number;
  sectionId: number;
  versionId: number;
}

export interface ImpactCount {
  cargos: number;
  fuels: number;
  linehauls: number;
  mileages: number;
  ratingRules: number;
  documents: number;
  rates: number;
  gracePeriods: number;
  freeRules: number;
  suspends: number;
  averages: number;
  notifications: number;
}

