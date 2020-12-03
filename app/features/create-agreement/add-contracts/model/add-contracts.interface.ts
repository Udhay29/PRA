export interface RootObject {
  _embedded: Embedded;
  _links: Links;
}
export interface Embedded {
  contractTypes?: ContractTypesItem[];
  customerAgreementContracts?: ContractTypesItem[];
}
export interface ContractTypesItem {
  tenantID?: number;
  contractTypeName?: string;
  contractTypeID?: number;
  _links: Links;
  customerAgreementContractID?: number;
  customerContractName?: string;
  expirationDate?: string;
  contractType?: string;
  customerContractNumber?: string;
  effectiveDate?: string;
}
export interface Links {
  self: Self;
  contractType?: ContractType;
  customerAgreementContract?: ContractType;
}
export interface Self {
  href: string;
}
export interface ContractType {
  href: string;
  templated: boolean;
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
}
export interface TeamsItem {
  teamAssignmentID: string;
  teamID: string;
  teamName: string;
}
export interface SaveResponse {
  customerAgreementContractID: number;
  customerAgreementContractVersionID: number;
  customerAgreementID: number;
  customerAgreementContractTypeID: number;
  customerAgreementContractTypeName: string;
  customerContractName: string;
  customerContractNumber: string;
  effectiveDate: string;
  expirationDate: string;
  customerContractComment: string;
  createAgreementFlow?: boolean;
  isElasticSync?: boolean;
}
export interface Column {
  label: string;
  key: string;
}
export interface RowEvent {
  data: SaveResponse;
  index?: number;
  originalEvent?: MouseEvent;
  type: string;
}
export interface DateFormat {
  date: DateObject;
}
export interface DateObject {
  year: number;
  month: number;
  day: number;
}
