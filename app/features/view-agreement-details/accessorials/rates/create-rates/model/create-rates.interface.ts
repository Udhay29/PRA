export class ChargeCodeInterface {
    label: string;
    value: number;
    description: string;
}

export interface CurrencyCodeInterface {
    label: string;
    value: string;
}
export interface AlternateChargeQuantityType {
    label: string;
    value: number;
}
export interface QuantityType {
    _embedded: EmbeddedQuantity;
    _links: object;
    page: Page;
}

export interface EmbeddedQuantity {
    accessorialRateAlternateChargeQuantityTypes: AccessorialRateAlternateChargeQuantityTypesItem[];
}

export interface AccessorialRateAlternateChargeQuantityTypesItem {
    '@id': number;
    accessorialRateAlternateChargeQuantityTypeId: number;
    createTimestamp: string;
    createProgramName: string;
    lastUpdateProgramName: string;
    createUserId: string;
    lastUpdateUserId: string;
    accessorialRateChargeQuantityTypeName: string;
    effectiveDate: string;
    expirationDate: string;
    lastUpdateTimestampString: string;
    _links: object;
}

export interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export interface RateDocumentationInterface {
    customerAccessorialDocumentTextId: number;
    textName: string;
    text: string;
    accessorialDocumentTypeName: string;
    level: number;
}
export interface AgreementCurrencyInterface {
    currencyCode: string;
}
export interface ErrorMessage {
    severity: string;
    summary: string;
    detail: string;
}

export interface RefreshDocumentation {
    effectiveDate: string;
    expirationDate: string;
    customerChargeName: string;
    customerAgreementId: number;
    level: string;
    accessorialDocumentTypeId: number;
    chargeTypeId: number;
    chargeTypeName: string;
    currencyCode: string;
    equipmentCategoryCode: string;
    equipmentTypeCode: string | number;
    equipmentLengthId: string | number;
    equipmentTypeId: string | number;
    customerAccessorialAccountDTOs: BillToInterface;
    businessUnitServiceOfferingDTOs: BusinessUnitInterface[];
    requestServiceDTOs: RequestedServiceResponse[];
    carrierDTOs: CarrierCodeResponse[];
}

export interface BillToInterface {
    customerAccessorialAccountId: null;
    customerAgreementContractSectionId: number;
    customerAgreementContractSectionName: string;
    customerAgreementContractId: number;
    customerAgreementContractName: string;
    customerAgreementContractSectionAccountId: number;
    customerAgreementContractSectionAccountName: string;
}

export interface BusinessUnitInterface {
    customerAccessorialServiceLevelBusinessUnitServiceOfferingId: number;
    serviceLevelBusinessUnitServiceOfferingAssociationId: number;
    businessUnit: string;
    serviceOffering: string;
    serviceLevel: string;
}
export interface RequestedServiceResponse {
    requestedServiceTypeCode: string;
}

export interface CarrierCodeResponse {
    carrierId: number;
    carrierName: string;
    carrierCode: string | number;
}

export interface RateCriteriaResponse {
    customerAccessorialRateCriteriaTypeId: number;
}
export interface CheckBoxAttributesInterface {
    waived: boolean;
    calculateRate: boolean;
    passThrough: boolean;
    rollUp: boolean;
}

export interface CreateDocumentationInterface {
    documentationContent: string;
    documentationText: string;
    cancelText: string;
}

export interface ChargeCodeResponseInterface {
    chargeTypeID: number;
    chargeTypeCode: string;
    chargeTypeName: string;
    chargeTypeDescription: string;
    chargeTypeBusinessUnitServiceOfferingAssociations: ChargeTypeBusinessUnitServiceOfferingAssociationsItem[];
}
export interface ChargeTypeBusinessUnitServiceOfferingAssociationsItem {
    chargeTypeBusinessUnitServiceOfferingAssociationID: number;
    chargeTypeID: null;
    financeBusinessUnitServiceOfferingAssociation: FinanceBusinessUnitServiceOfferingAssociation;
    financeChargeUsageTypeID: number;
    effectiveDate: string;
    expirationDate: string;
}
export interface FinanceBusinessUnitServiceOfferingAssociation {
    financeBusinessUnitServiceOfferingAssociationID: number;
    financeBusinessUnitCode: string;
    serviceOfferingCode: string;
}

export interface DateRangeInterface {
    _embedded: {
        configurationParameterDetails: [{
            configurationParameter: object,
            configurationParameterDetailID: number,
            configurationParameterValue: string
        }]
    };
    _links: {
        configurationParameterDetail: {
            href: string,
            templated: boolean
        }
    };
}
export interface EditAccesorialData {
    editRateData: object;
    isAccessorialRateEdit: boolean;
    refreshDocumentResponse: object;
    rateConfigurationId: number;
}
export interface EditRequestedServiceResponse    {
    customerAccessorialRequestServiceId: number;
   requestedServiceTypeId: number;
   requestedServiceTypeCode: string;
   requestedServiceTypeDescription: string;
  }

  export interface EditBillToValueInterface {
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

export interface EditAlternateChargeResponse {
    customerAccessorialRateAlternateChargeId: number;
    accessorialRateAlternateChargeQuantityTypeId: number;
    accessorialRateAlternateChargeQuantityTypeName: string;
    alternateChargeTypeId: number;
    alternateChargeTypeName: string;
    alternateChargeCode: string;
    customerAlternateChargeThresholdQuantity: number;
}

export interface AddRateEditResponse {
    customerAccessorialRateChargeId: number;
    accessorialRateTypeId: number;
    accessorialRateTypeName: string;
    accessorialRateRoundingTypeId: number;
    accessorialRateRoundingTypeName: string;
    rateAmount: number;
    minimumAmount: number;
    maximumAmount: number;
}
