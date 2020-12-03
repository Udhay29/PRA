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
export interface RateTypeInterface {
    rateTypeId: number;
    rateTypeName: string;
    effectiveDate: string;
    expirationDate: string;
    lastUpdateTimestampString: string;
}
export interface RateDropDownInterface {
    label: string;
    value: number;
}
export class ChargeCodeInterface {
    label: string;
    value: number;
    description: string;
}
export interface BuSoAssociation {
    financeBusinessUnitServiceOfferingAssociationID: number;
    serviceOfferingCode: string;
    serviceOfferingDescription: string;
    transitModeId: number;
    transitModeCode: string;
    transitModeDescription: string;
    financeBusinessUnitCode: string;
}

export interface EditAdditionalChargeResponse {
    customerAccessorialAdditionalChargeId: number;
    additionalChargeTypeId: number;
    additionalChargeTypeName: string;
    additionalChargeCodeName: string;
    accessorialRateTypeName: string;
    accessorialRateTypeId: number;
    rateAmount: number;
}
