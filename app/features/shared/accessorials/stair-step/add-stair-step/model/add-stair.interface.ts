
export interface RateDropDownInterface {
    label: string;
    value: string;
}
export interface StepValueDownInterface {
    label: string;
    value: number;
}
export interface EditAccessorialWholeResponse {
    customerAccessorialRateConfigurationId?: number;
    currencyCode?: string;
    equipmentCategoryCode?: string;
    equipmentTypeDescription?: string;
    equipmentLengthId?: number;
    equipmentLength?: number;
    equipmentTypeId?: number;
    rateItemizeIndicator?: string;
    groupRateTypeId?: null;
    groupRateTypeName?: null;
    equipmentLengthDescription?: string;
    chargeTypeId?: number;
    chargeTypeName?: string;
    chargeTypeCode?: string;
    waived?: null;
    calculateRateManually?: null;
    passThrough?: null;
    rateSetupStatus?: null;
    documentLegalDescription?: null;
    documentInstructionalDescription?: null;
    documentFileNames?: null;
    hasAttachment?: null;
    status?: string;
    effectiveDate?: string;
    expirationDate?: string;
    customerAgreementId?: number;
    accessorialDocumentTypeId?: null;
    customerChargeName?: null;
    businessUnitServiceOfferingDTOs?: BusinessUnitServiceOfferingDTOsItem[];
    requestServiceDTOs?: RequestServiceDTOsItem[];
    carrierDTOs?: null;
    level?: string;
    customerAccessorialStairRateDTO?: CustomerAccessorialStairRateDTO;
    customerAccessorialRateChargeDTOs?: null;
    customerAccessorialRateAdditionalChargeDTOs?: CustomerAccessorialRateAdditionalChargeDTOsItem[];
    customerAccessorialRateAlternateChargeViewDTO?: null;
    contracts?: null;
    sections?: null;
    sectionAccounts?: null;
}
export interface BusinessUnitServiceOfferingDTOsItem {
    customerAccessorialServiceLevelBusinessUnitServiceOfferingId: null;
    serviceLevelBusinessUnitServiceOfferingAssociationId: number;
    financeBusinessUnitServiceOfferingAssociationID: number;
    businessUnit: string;
    serviceOffering: string;
    serviceLevel: string;
}
export interface RequestServiceDTOsItem {
    customerAccessorialRequestServiceId: number;
    requestedServiceTypeId: null;
    requestedServiceTypeCode: string;
}
export interface CustomerAccessorialStairRateDTO {
    customerAccessorialStairRateId: number;
    accessorialRateTypeId: number;
    accessorialRateTypeName: string;
    accessorialRateRoundingTypeId: number;
    accessorialRateRoundingTypeName: string;
    accessorialMaximumRateApplyTypeId: number;
    accessorialMaximumRateApplyTypeName: string;
    minimumAmount: number;
    maximumAmount: number;
    customerAccessorialStairStepRateDTOs: CustomerAccessorialStairStepRateDTOsItem[];
}
export interface CustomerAccessorialStairStepRateDTOsItem {
    customerAccessorialStairStepRateId: number;
    fromRateTypeQuantity: number;
    toRateTypeQuantity: number;
    stairStepRateAmount: number;
    stepNumber: number;
}
export interface CustomerAccessorialRateAdditionalChargeDTOsItem {
    customerAccessorialRateAdditionalChargeId: number;
    accessorialRateTypeId: number;
    accessorialRateTypeName: string;
    additionalChargeTypeId: number;
    additionalChargeTypeName: string;
    additionalChargeCodeName: string;
    rateAmount: number;
    additionalChargeTypeNameWithCode: string;
}

export interface AddStairStepRateEditResponse {
    customerAccessorialStairRateId?: number;
    accessorialRateTypeId?: number;
    accessorialRateTypeName?: string;
    accessorialRateRoundingTypeId?: number;
    accessorialRateRoundingTypeName?: string;
    accessorialMaximumRateApplyTypeId?: number;
    accessorialMaximumRateApplyTypeName?: string;
    minimumAmount?: number;
    maximumAmount?: number;
    customerAccessorialStairStepRateDTOs?: CustomerAccessorialStairStepRateDTOsItems[];
}
export interface CustomerAccessorialStairStepRateDTOsItems {
    customerAccessorialStairStepRateId: number;
    fromRateTypeQuantity: number;
    toRateTypeQuantity: number;
    stairStepRateAmount: number;
    stepNumber: number;
}
