export interface SectionsGridResponseInterface {
    customerAgreementContractSectionID?: number;
    customerAgreementContractSectionName?: string;
    customerAgreementContractID?: number;
    customerContractName?: string;
    customerContractNumber?: string;
    contractTypeName?: string;
    effectiveDate?: string;
    expirationDate?: string;
    isChecked: boolean;
    currencyCode: string;
}

export interface SectionsGridColumnsObjInterface {
    name: string;
    property: string;
}

