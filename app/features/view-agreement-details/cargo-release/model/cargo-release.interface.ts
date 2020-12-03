export interface CargoGridInterface {
    cargoReleaseAmount: string;
    isAgreementFlag: string;
    contractContractName: string;
    customerAgreementBusinessUnitCargoList: Array<AgreementBUList>;
    customerContractBusinessUnitCargoList: Array<ContractBUList>;
    customerSectionBusinessUnitCargo: Array<SectionBUList>;
    customerAgreementContractSectionName: string;
    effectiveDate: string;
    expirationDate: string;
}
export class TableColumnsInterface {
    label: string;
    field: string;
    isArray: boolean;
}
export class ThreeDotsInterface {
    label: string;
    command: string;
}
export class ViewGridInterface {
  cargoAmount: number;
  customerAgreementID: number;
  customerAgreementCargoID: number;
  agreementDefault: string;
  customerContractID: number;
  customerContractNumber: number;
  customerContractName: number;
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
  originalEffectiveDate: string;
  originalExpirationDate: string;
  createdUser: string;
  createdDate: string;
  createdProgram: string;
  updatedUser: string;
  updatedDate: string;
  updatedProgram: string;
  businessUnitData: Array<object>;
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
export interface QueryMock {
  sourceData: string;
  script: Scripts;
}
export interface Scripts {
  script1: string;
  script2: string;
  script3: string;
}

