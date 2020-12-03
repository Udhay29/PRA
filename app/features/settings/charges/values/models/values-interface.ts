export interface Self {
    href: string;
}

export interface Link {
    href: string;
    templated: boolean;
}

export interface Links {
    self: Self;
    link: Link;
}

export interface ChargeUsageType {
    chargeUsageTypeName: string;
    chargeUsageTypeID: number;
    _links?: Links;
}

export interface EmbeddedChargeTypes {
    chargeUsageTypes: ChargeUsageType[];
}

export interface ChargeTypes {
    _embedded: EmbeddedChargeTypes;
}

export interface ApplicationLevelType {
    chargeApplicationLevelTypeName: string;
    chargeApplicationLevelTypeID: number;
    _links?: Links;
}

export interface EmbeddedApplicationLevelTypes {
    chargeApplicationLevelTypes: ApplicationLevelType[];
}

export interface ApplicationTypes {
    _embedded: EmbeddedApplicationLevelTypes;
}

export interface ChargeUsageTypeRequest {
    chargeUsageTypeName: string;
    chargeUsageTypeID: number;
}

export interface ChargeApplicationLevelTypeRequest {
    chargeApplicationLevelTypeID: number;
    chargeApplicationLevelTypeName: string;
}

export interface ChargeCodeConfigurables {
    chargeUsageTypes: ChargeUsageTypeRequest[];
    chargeApplicationLevelTypes: ChargeApplicationLevelTypeRequest[];
}
