export interface CustomerAccessorialAccountDTO {
    customerAccessorialAccountId: number;
    customerAgreementContractSectionId: number;
    customerAgreementContractSectionName: string;
    customerAgreementContractId: number;
    customerAgreementContractName: string;
    customerAgreementContractSectionAccountId: number;
    customerAgreementContractSectionAccountName: string;
}
export interface BusinessUnitServiceOfferingDTO {
    customerAccessorialServiceLevelBusinessUnitServiceOfferingId: number;
    serviceLevelBusinessUnitServiceOfferingAssociationId: number;
    businessUnit: string;
    serviceLevel: string;
}
export interface RequestServiceDTO {
    customerAccessorialRequestServiceId: number;
    requestedServiceTypeId: number;
    requestedServiceTypeCode: string;
}
export interface AgreementDetailsInterface {
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
export interface CustomerAccessorialRateAlternateChargeViewDTO {
    customerAccessorialRateAlternateChargeId: number;
    accessorialRateAlternateChargeQuantityTypeId: number;
    accessorialRateAlternateChargeQuantityTypeName: string;
    alternateChargeTypeId: number;
    customerAlternateChargeThresholdQuantity: number;
    alternateChargeTypeName: string;
    alternateChargeCode: string;
}
export interface CustomerAccessorialRateChargeDTO {
    customerAccessorialRateChargeId: number;
    accessorialRateTypeId: number;
    accessorialRateTypeName: string;
    accessorialRateRoundingTypeId: number;
    accessorialRateRoundinTypeName: string;
    rateAmount: number;
    minimumAmount: number;
    maximumAmount: number;
    rateOperator: string;
}
export interface CustomerAccessorialRateAdditionalChargeDTO {
    customerAccessorialRateAdditionalChargeId: number;
    accessorialRateTypeId: number;
    accessorialRateTypeName: string;
    additionalChargeTypeId: number;
    additionalChargeTypeName: string;
    additionalChargeCodeName: string;
    rateAmount: number;
}
export interface DocumentationReqParamInterface {
    effectiveDate: string;
    expirationDate: string;
    customerChargeName: string;
    customerAgreementId: number;
    level: number;
    accessorialDocumentTypeId: number;
    chargeTypeId: number;
    chargeTypeName: string;
    currencyCode: string;
    equipmentCategoryCode: string;
    equipmentTypeCode: string;
    equipmentLengthId: number;
    equipmentTypeId: number;
    customerAccessorialAccountDTOs: object[];
    businessUnitServiceOfferingDTOs: object[];
    requestServiceDTOs: object[];
    carrierDTOs: object[];
}

