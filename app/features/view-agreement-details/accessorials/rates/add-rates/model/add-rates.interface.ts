export interface RateTypesInterface {
    chargeUnitTypeName: string;
    lineHaulChargeUnitTypeID: number;
}
export interface RateTypeInterface {
    rateTypeId: number;
    rateTypeName: string;
    effectiveDate: string;
    expirationDate: string;
    lastUpdateTimestampString: string;
}
export interface GroupRateTypesInterface {
    groupRateTypeName: string;
    groupRateTypeID: number;
}

export interface RateDropDownInterface {
    label: string;
    value: number;
}

export interface ResponseType {
    page: object;
    _embedded: RoudingTypes;
    _links: object;
}
export interface RoudingTypes {
    accessorialRateRoundingTypes: Array<RoudingTypeValues>;
}
export interface RoudingTypeValues {
    id: number;
    createTimestamp: string;
    createProgramName: string;
    lastUpdateProgramName: string;
    createUserId: string;
    lastUpdateUserId: string;
    accessorialRateRoundingTypeName: string;
    effectiveDate: string;
    expirationDate: string;
    lastUpdateTimestampString: string;
    _links: object;
    accessorialRateRoundingTypeId: number;
}
