// interface for all columns
export interface Columns {
  label: string;
  field: string;
  arrayBased: boolean;
}
export interface SectionColumn {
  label: string;
  field: string;
}
// interface for grid rows
export interface CargoDetailListItem {
  cargoReleaseType: string;
  cargoAmount: string;
  customerAgreementID: number;
  customerAgreementCargoID: number;
  agreementDefault: string;
  customerContractID: number;
  customerContractNumber: string;
  customerContractName: string;
  customerContractCargoID: number;
  customerSectionCargoID: number;
  customerSectionName: string;
  customerSectionID: number;
  effectiveDate: string;
  expirationDate: string;
  status: string;
  customerAgreementBusinessUnitCargoList: Array<AgreementBUList>;
  customerContractBusinessUnitCargoList: Array<ContractBUList>;
  customerSectionBusinessUnitCargo: Array<SectionBUList>;
}

// view data of row
export interface GridRowData {
  cargoAmount: number;
  customerAgreementID: number;
  customerAgreementCargoID: number;
  agreementDefault: string;
  customerContractID: number;
  customerContractNumber: string;
  customerContractName: string;
  customerContractCargoID: number;
  customerSectionCargoID: number;
  customerSectionName: string;
  customerSectionID: number;
  customerAgreementBusinessUnitCargoList: Array<AgreementBUList>;
  customerContractBusinessUnitCargoList: Array<ContractBUList>;
  customerSectionBusinessUnitCargo: Array<SectionBUList>;
  effectiveDate: string;
  expirationDate: string;
  status: string;
  originalEffectiveDate: string;
  originalExpirationDate: string;
  createdUser: string;
  createdDate: string;
  createdProgram: string;
  updatedUser: string;
  updatedDate: string;
  updatedProgram: string;
}
export interface AgreementBUList {
  customerAgreementID: number;
  customerAgreementBusinessUnitCargoID: number;
  action: string;
  financeBusinessUnitCode: string;
  agreementBusinessUnitCargoAmount: number;
  agreementBuEffectiveDate: string;
  agreementBuExpirationDate: string;
  agreementDefaultCargoAmount: number;
  currencyCode: string;
}

export interface ContractBUList {
  contractID: number;
  customerContractBusinessUnitCargoID: number;
  action: string;
  financeBusinessUnitCode: string;
  contractBusinessUnitCargoAmount: number;
  currencyCode: string;
  contractBuEffectiveDate: string;
  contractBuExpirationDate: string;
  agreementDefaultCargoAmount: number;
}
export interface SectionBUList {
  sectionID: number;
  customerSectionBusinessUnitCargoID: number;
  action: string;
  financeBusinessUnitCode: string;
  sectionBusinessUnitCargoAmount: number;
  currencyCode: string;
  sectionBuEffectiveDate: string;
  sectionBuExpirationDate: string;
  agreementDefaultCargoAmount: number;
}
// save default agreement
export interface CustomerAgreementDto {
  cargoReleaseType: string;
  customerAgreementCargoDTO: CustomerAgreementCargoDTO;
}
export interface CustomerAgreementCargoDTO {
  customerAgreementCargoID: number;
  agreementCargoAmount: string;
  agreementEffectiveDate: string;
  agreementExpirationDate: string;
  existingESDocID: string;
}

export interface SectionBusinessUnitCargo {
  customerAgreementContractSectionBusinessUnitCargoID: number;
  businessUnitCode: string;
  effectiveDate: string;
  expirationDate: string;
}
// interface for fetching default amount of cargo release
export interface CargoReleaseDefaultAmount {
  agreementID: number;
  effectiveDate: string;
  expirationDate: string;
  agreementDefaultAmount: number;
  customerAgreementContractDTO: string;
  customerAgreementContractSectionDTO: string;
}
// interface for different agreement types
export interface AgreementType {
  label: string;
  value: string;
}
// interface for section starts here
export interface SectionCargoAgreement {
  agreementID: number;
  agreementDefaultAmount: number;
  agreementEffectiveDate: string;
  agreementExpirationDate: string;
  customerContractDetailDTO: string;
  customerAgreementContractSectionDTO: Array<SectionRowData>;
}
export interface SectionRowData {
  customerSectionID: number;
  customerSectionName: string;
  customerContractID: number;
  customerContractName: string;
  sectionEffectiveDate: string;
  sectionExpirationDate: string;
  customerAgreementID: number;
  customerAgreementName: string;
  customerContractNumber: string;
}


// interface for contract
export interface ContactCargoAgreement {
  agreementID: number;
  effectiveDate: string;
  expirationDate: string;
  customerAgreementContractDTO: Array<ContactCargoDto>;
  customerAgreementContractSectionDTO: string;
}
export interface ContactCargoDto {
  customerContractID: number;
  customerContractNumber: string;
  customerContractName: string;
  contractEffectiveDate: string;
  contractExpirationDate: string;
  customerContractType: string;
}
// interface for contract dropdown
export interface ContractDropDown {
  label: ContactCargoDto;
  value: string;
}
// interface for bu dropdowm
export interface BusinessUnitDropDown {
  label: string;
  value: string;
}
// interface for bu
export interface BusinessUnitAssociation {
  financeBusinessUnitServiceOfferingAssociationID: number;
  financeBusinessUnitCode: string;
  serviceOfferingCode: string;
  effectiveTimestamp: string;
  expirationTimestamp: string;
  lastUpdateTimestampString: string;
}
export interface SoBuAssociation {
  financeBusinessUnitServiceOfferingAssociation: BusinessUnitAssociation;
  transitMode: string;
  utilizationClassification: string;
  freightShippingType: string;
  lastUpdateTimestampString: string;
  _links: object;
}
export interface BusinessUnitEmbedded {
  serviceOfferingBusinessUnitTransitModeAssociations: Array<SoBuAssociation>;
}
export interface BusinessUnit {
  _embedded: BusinessUnitEmbedded;
  _links: object;
}
export interface RowData {
  data: CargoDetailListItem;
  index: number;
  originalEvent: Event;
  type: string;
}
export interface CreateAgreement {
  agreementType: string;
  businessUnits: null;
  cargoReleaseAmount: null;
  customerAgreementID: number;
  customerAgreementName: string;
  effectiveDate: string;
  expirationDate: string;
  taskAssignmentIDs: null;
  teams: null;
  ultimateParentAccountID: number;
}
export interface DeleteAgreement {
  cargoReleaseType: string;
  cargoId: number;
}

// interface for agreementBu save request
export interface AgreementBURequestDto {
  cargoReleaseType: string;
  customerAgreementBusinessUnitCargoList: Array<AgreementBURequestListDto>;
}
export interface AgreementBURequestListDto {
  customerAgreementID: number;
  customerAgreementBusinessUnitCargoID: number;
  action: string;
  financeBusinessUnitCode: string;
  agreementBusinessUnitCargoAmount: string;
  agreementBuEffectiveDate: string;
  agreementBuExpirationDate: string;
  agreementDefaultCargoAmount: string;
  existingESDocID: string;
  isCreateFlow: boolean;
}

// interface for contract save request
export interface ContractRequestDto {
  cargoReleaseType: string;
  customerContractCargoDTO: ContractCargoRequestDto;
}
export interface ContractCargoRequestDto {
  contractID: number;
  customerContractCargoID: number;
  contractCargoAmount: string;
  contractEffectiveDate: string;
  contractExpirationDate: string;
  agreementDefaultCargoAmount: string;
  contractDisplayName: string;
  contractName: string;
  contractNumber: string;
  contractType: string;
  existingESDocID: string;
}

// interface for section save request
export interface SectionRequestDto {
  cargoReleaseType: string;
  customerSectionCargoDTO: SectionCargoRequestDto;
}

export interface SectionCargoRequestDto {
  sectionID: number;
  customerContractSectionCargoID: number;
  sectionCargoAmount: string;
  sectionEffectiveDate: string;
  sectionExpirationDate: string;
  agreementDefaultCargoAmount: string;
  sectionName: string;
  existingESDocID: string;
  customerAgreementID: number;
}

// interface for contractBu save request
export interface ContractBuRequestDto {
  cargoReleaseType: string;
  customerContractBusinessUnitCargoList: Array<ContractBuRequestList>;
}

export interface ContractBuRequestList {
  contractID: number;
  customerContractBusinessUnitCargoID: number;
  financeBusinessUnitCode: string;
  contractBusinessUnitCargoAmount: string;
  contractBuEffectiveDate: string;
  contractBuExpirationDate: string;
  agreementDefaultCargoAmount: string;
  action: string;
  contractDisplayName: string;
  contractName: string;
  contractNumber: string;
  contractType: string;
  customerAgreementID: number;
  isCreateFlow: boolean;
  existingESDocID: string;
}

// interface for sectionBu save request
export interface SectionBuRequestDto {
  cargoReleaseType: string;
  customerSectionBusinessUnitCargoList: Array<SectionBuRequestList>;
}
export interface SectionBuRequestList {
  sectionID: number;
  customerSectionBusinessUnitCargoID: number;
  financeBusinessUnitCode: string;
  sectionBusinessUnitCargoAmount: string;
  sectionBuEffectiveDate: string;
  sectionBuExpirationDate: string;
  sectionName: string;
  customerAgreementID: number;
}


// interface for Agreement Id
export interface AgreementDetails {
  agreementType: string;
  businessUnits: string;
  cargoReleaseAmount: number;
  currencyCode: string;
  customerAgreementID: number;
  customerAgreementName: string;
  effectiveDate: string;
  expirationDate: string;
  invalidIndicator: string;
  invalidReasonTypeName: string;
  taskAssignmentIDs: string;
  teams: string;
  ultimateParentAccountID: number;
}
