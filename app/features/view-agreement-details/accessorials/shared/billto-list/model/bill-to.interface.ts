export interface BillToModelInterface {
    name: string;
    property: string;
}

export interface BillToValueInterface {
    customerAgreementID: number;
    customerAgreementName: string;
    effectiveDate: string;
    expirationDate: string;
    customerAgreementContractSectionAccountID: number;
    billingPartyID: number;
    customerAgreementContractSectionID: number;
    customerAgreementContractSectionName: string;
    customerAgreementContractID: number;
    customerContractName: string;
    billToDetailsDTO: BillToCodeDetails;
}
export interface BillToCodeDetails {
    billToID: number;
    billToCode: string;
    billToName: string;
}

export interface BillToParams {
    customerAgreementID: number;
    customerAgreementContractIds: Array<number>;
    customerAgreementContractSectionIds: Array<number>;
    effectiveDate: string;
    expirationDate: string;
}

export interface SectionData {
    sectionIds: number[];
    contractIds: number[];
}
