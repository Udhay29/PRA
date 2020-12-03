export interface AgreementDetailsInterface {
    agreementType: string;
    businessUnits: string[];
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
export interface DocumentationDetailedViewInterface {
    documentationTypeId: number;
    documentationType: string;
    level: string;
    effectiveDate: string;
    expirationDate: string;
    customerAgreementId: number;
    equipmentCategoryCode: string;
    equipmentCategoryDescription: string;
    equipmentTypeId: number;
    equipmentType: string;
    equipmentLengthId: number;
    equipmentLength: number;
    equipmentLengthDescription: string;
    chargeTypeId: number;
    chargeTypeName: string;
    chargeTypeCode: string;
    status: string;
    customerAccessorialText: CustomerAccessorialText;
    serviceLevelBusinessUnitServiceOfferings: ServiceLevelBusinessUnitServiceOfferings[];
    contracts: Contracts[];
    sections: Sections[];
    carriers: Carriers[];
    billToAccounts: BillToAccounts[];
    requestServices: RequestServices[];
    attachments: Attachments[];
}
export interface CustomerAccessorialText {
    customerAccessorialDocumentTextId: number;
    textName: string;
    text: string;
}
export interface ServiceLevelBusinessUnitServiceOfferings {
    customerAccessorialServiceLevelBusinessUnitServiceOfferingId: number;
    serviceLevelBusinessUnitServiceOfferingAssociationId: number;
    businessUnit: string;
    serviceOffering: string;
    serviceLevel: string;
}
export interface Contracts {
    customerAgreementContractID: number;
    customerContractName: string;
    customerContractNumber: number;
    contractTypeID: number;
    contractTypeName: string;
    effectiveDate: string;
    expirationDate: string;
}
export interface Sections {
    customerAgreementContractSectionID: number;
    customerAgreementContractSectionName: string;
    customerContractName: string;
    customerContractNumber: number;
    customerAgreementContractTypeName: string;
    effectiveDate: string;
    expirationDate: string;
}
export interface Carriers {
    customerAccessorialCarrierId: number;
    carrierId: number;
    carrierName: string;
    carrierCode: string;
}
export interface BillToAccounts {
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
    billToID: number;
    billToCode: string;
    billToName: string;
    contractNumber: string;
}
export interface RequestServices {
    customerAccessorialRequestServiceId: number;
    requestedServiceTypeId: number;
    requestedServiceTypeCode: string;
}
export interface Attachments {
    customerAccessorialAttachmentId: number;
    accessorialAttachmentTypeDTO: AccessorialAttachmentTypeDTO;
    documentNumber: string;
    documentName: string;
    addedOn: string;
    addedBy: string;
    fileType: string;
}
export interface AccessorialAttachmentTypeDTO {
    accessorialAttachmentTypeId: number;
    accessorialAttachmentTypeName: string;
}
