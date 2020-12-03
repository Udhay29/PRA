export interface AgreementDetails {
  customerAgreementID: number;
  customerAgreementName: string;
  agreementType: string;
  ultimateParentAccountID: number;
  currencyCode: string;
  cargoReleaseAmount: number;
  businessUnits: string[];
  taskAssignmentIDs: number[];
  effectiveDate: string;
  expirationDate: string;
  invalidIndicator: string;
  invalidReasonTypeName: string;
}
export interface RootObject {
  _embedded: Embedded;
  _links: Links;
}
export interface Embedded {
  serviceOfferingBusinessUnitTransitModeAssociations: ServiceOfferingBusinessUnitTransitModeAssociationsItem[];
}
export interface ServiceOfferingBusinessUnitTransitModeAssociationsItem {
  financeBusinessUnitServiceOfferingAssociation: FinanceBusinessUnitServiceOfferingAssociation;
  transitMode: TransitMode;
  utilizationClassification: UtilizationClassification;
  freightShippingType: FreightShippingType;
  lastUpdateTimestampString: string;
  _links: Links;
}
export interface FinanceBusinessUnitServiceOfferingAssociation {
  financeBusinessUnitServiceOfferingAssociationID: number;
  financeBusinessUnitCode: string;
  serviceOfferingCode: string;
  effectiveTimestamp: string;
  expirationTimestamp: string;
  lastUpdateTimestampString: string;
}
export interface TransitMode {
  transitModeCode: string;
  transitModeDescription: string;
  lastUpdateTimestampString: string;
}
export interface UtilizationClassification {
  utilizationClassificationCode: string;
  utilizationClassificationDescription: string;
  lastUpdateTimestampString: string;
}
export interface FreightShippingType {
  freightShippingTypeCode: string;
  freightShippingTypeDescription: string;
  lastUpdateTimestampString: string;
}
export interface Links {
  self: Self;
  serviceOfferingBusinessUnitTransitModeAssociation?: Self;
}
export interface Self {
  href: string;
  templated?: boolean;
}
export interface ListItem {
  label: string;
  value: ListValue;
}
export interface ListValue {
  financeBusinessUnitServiceOfferingAssociationID: number;
  financeBusinessUnitCode: string;
  serviceOfferingCode: string;
  financeBusinessUnitServiceOfferingDisplayName: string;
}
export interface CarrierRootObject {
  aggregations: Aggregations;
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits;
}
export interface Aggregations {
  unique: Unique;
}
export interface Unique {
  doc_count_error_upper_bound: number;
  sum_other_doc_count: number;
  buckets: Bucket[];
}
export interface Bucket {
  key: string;
  doc_count: number;
  Level: Level;
}
export interface Level {
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
  LegalName: string;
  CarrierID: number;
  CarrierCode: string;
}
export interface FuelSummarySaveRequest {
  customerAgreementID: number;
  customerAgreementName: string;
  fuelProgramName: string;
  effectiveDate: string;
  expirationDate: string;
  agreementEffectiveDate: string;
  agreementExpirationDate: string;
  fuelProgramCarrierDTOs: CarrierDTO[] | null;
  fuelProgramServiceOfferingDTOs: ListValue[];
  fuelProgramAccountBillToCodeDTOs: BillToSelectedList[] | null;
  fuelProgramAccountContractDTOs: ContractListDisplay[] | null;
  fuelProgramAccountSectionDTOs: SectionListDisplay[] | null;
  fuelProgramComment: string | null;
  fuelProgramType: string;
  fuelProgramAccountContractBillToCodeDTOs: BillToSelectedList[] | null;
  fuelProgramAccountSectionBillToCodeDTOs: BillToSelectedList[] | null;
}
export interface CarrierDTO {
  legalName: string;
  carrierID: number;
  carrierCode: string;
  carrierDisplayName: string;
}
export interface BillToList {
  sectionAccountID: number;
  billingPartyID: number;
  billingPartyName: string;
  billingPartyCode: string;
  sectionID: number;
  sectionName: string;
  contractID: number;
  contractName: string;
  contractNumber: string;
  contractType: string;
  saveContractBillTo: BillToSelectedList;
}
export interface BillToFormat {
  display: string;
  section: string;
  contract: string;
  saveData: BillToList;
  saveContractBillTo: BillToSelectedList;
  saveSectionBillTo: BillToSelectedList;
}
export interface BillToSelectedList {
  billingPartyID?: number;
  billingPartyCode?: string;
  billingPartyName?: string;
  billingPartyDisplayName: string;
  sectionAccountID?: number;
  customerAgreementContractID?: number;
  customerContractNumber?: string;
  customerContractName?: string;
  customerContractType?: string;
  customerContractDisplayName?: string;
  customerAgreementSectionID?: number;
  customerAgreementSectionName?: string;
}
export interface SaveResponse {
  customerAgreementContractID?: number;
  customerAgreementContractTypeID?: number;
  customerContractName?: string;
  contractTypeName?: string;
  customerContractNumber?: string | null;
  effectiveDate?: string;
  expirationDate?: string;
  combineNameNumber?: string;
  customerAgreementContractSectionID?: number;
  customerAgreementContractSectionName?: string;
}
export interface Column {
  label: string;
  key: string;
}
export interface ContractListDisplay {
  customerAgreementContractID: number;
  customerContractNumber: number;
  customerContractName: string;
  customerContractType: string;
  customerContractDisplayName: string;
}
export interface SectionListDisplay {
  customerAgreementSectionID: number;
  customerAgreementSectionName: string;
}

export interface CustomerAgreementDetail {
  fuelProgramID: number;
  fuelProgramVersionID: number;
  agreementID: number;
}

