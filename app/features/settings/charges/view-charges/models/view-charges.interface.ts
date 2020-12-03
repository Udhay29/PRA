export interface ChargeCodes {
    chargeTypeID: number;
    chargeTypeCode: string;
    chargeTypeName: string;
    chargeTypeDescription: string;
    chargeTypeBusinessUnitServiceOfferingAssociations: ChargeTypeBusinessUnitServiceOfferingAssociation[];
    rateTypes: RateType[];
    chargeUsageType: ChargeUsageType;
    chargeApplicationLevelTypes: ChargeApplicationLevelTypes;
    quantityRequiredIndicator: string;
    autoInvoiceIndicator: string;
    effectiveDate: string;
    expirationDate: string;
}

export interface ChargeCodesList {
    chargeIdentifier: string;
    chargeTypeDescription: string;
    chargeTypeBusinessUnitServiceOfferingAssociations: string;
    rateTypes: string;
    chargeUsageType: string;
    chargeApplicationLevelTypes: string;
    quantityRequiredIndicator: string;
    autoInvoiceIndicator: string;
    effectiveDate: string;
    expirationDate: string;
    tableToolTip: string;
    rateTypeToolTip: string;
    chargeUsageTypeToolTip: string;
}

export interface TableColumnModel {
    property: string;
    name: string;
  }

export interface ChargeUsageType {
    chargeUsageTypeID: number;
    chargeUsageTypeName: string;
}

export interface ChargeApplicationLevelTypes {
    chargeApplicationLevelTypeID: number;
    chargeApplicationLevelTypeName: string;
}

export interface RateType {
    rateTypeID: number;
    rateTypeName: string;
}

export interface ChargeTypeBusinessUnitServiceOfferingAssociation {
    chargeTypeBusinessUnitServiceOfferingAssociationID: number;
    chargeType: ChargeType;
    financeBusinessUnitServiceOfferingAssociation:  FinanceBusinessUnitServiceOfferingAssociation;
    financeChargeUsageType: FinanceChargeUsageType;
    effectiveDate: string;
    expirationDate: string;
}

export interface ChargeType {
    chargeTypeID: number;
    chargeTypeCode: string;
    chargeTypeName: string;
    chargeTypeDesc: string;
}

export interface FinanceBusinessUnitServiceOfferingAssociation {
    financeBusinessUnitServiceOfferingAssociationID: number;
    financeBusinessUnitCode: string;
    serviceOfferingCode: string;
}

export interface FinanceChargeUsageType {
    financeChargeUsageTypeID: number;
}
/// ES Search Request Object
export interface RootObject {
    took: number;
    timed_out: boolean;
    _shards: Shards;
    hits: Hits;
}
export interface Shards {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
}
export interface ChargeUsageType {
    ChargeUsageTypeName: string;
}
export interface ApplicationLevel {
    ChargeApplicationLevelTypeName: string;
}
export interface BusinessUnitServiceOffering {
    BusinessUnitServiceOfferingName: string;
}

export interface RateType {
    RateTypeName: string;
}
export interface Source {
    ChargeUsageTypes: ChargeUsageType[];
    ChargeTypeName: string;
    ChargeTypeDescription: string;
    ExpirationDate: string;
    ChargeTypeIdentifier: string;
    ApplicationLevel: ApplicationLevel;
    AutoInvoiceIndicator: string;
    BusinessUnitServiceOfferings: BusinessUnitServiceOffering[];
    RateTypes: RateType[];
    QuantityRequiredIndicator: string;
    EffectiveDate: string;
}
export interface Hit {
    _index: string;
    _type: string;
    _id: string;
    _score?: any;
    _source: Source;
    sort: string[];
}
export interface Hits {
    total: number;
    max_score?: any;
    hits: Hit[];
}
