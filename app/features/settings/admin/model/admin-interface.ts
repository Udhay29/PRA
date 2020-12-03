export interface AdminType {
    agreementTypeDTOs: AgreementType;
    contractTypeDTOs: ContractType;
    sectionTypeDTOs: SectionType;
}
export interface AgreementType {
    agreementTypeID: number;
    agreementTypeName: string;
    tenantID: number;
}
export interface ContractType {
    contractTypeID: number;
    contractTypeName: string;
    tenantID: number;
}
export interface SectionType {
    sectionTypeID: number;
    sectionTypeName: string;
    tenantID: number;
}
