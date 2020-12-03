export interface RateTypesInterface {
    chargeUnitTypeName: string;
    lineHaulChargeUnitTypeID: number;
}

export interface GroupRateTypesInterface {
    groupRateTypeName: string;
    groupRateTypeID: number;
}

export interface RateDropDownInterface {
    label: string;
    value: number;
}

export interface CurrencyCodeInterface {
    label: string;
    value: string;
}

export interface ResponseType {
    page: object;
    _embedded: object;
    _links: object;
}
