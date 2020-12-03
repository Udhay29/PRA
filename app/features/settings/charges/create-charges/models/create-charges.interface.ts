export interface Self {
    href: string;
    templated?: boolean;
}
export interface RateTypeLink {
    href: string;
    templated?: boolean;
}
export interface ChargeUsageTypeLink {
    href: string;
    templated?: boolean;
}
export interface ChargeApplicationLevelTypeLink {
    href: string;
    templated?: boolean;
}
export interface ProfileLink {
    href: string;
}
export interface ServiceOfferingBusinessUnitTransitModeAssociationLink {
    href: string;
    templated?: boolean;
}
export interface Links {
    self?: Self;
    rateType?: RateTypeLink;
    profile?: ProfileLink;
    chargeUsageType?: ChargeUsageTypeLink;
    chargeApplicationLevelType?: ChargeApplicationLevelTypeLink;
    serviceOfferingBusinessUnitTransitModeAssociation?: ServiceOfferingBusinessUnitTransitModeAssociationLink;
}
export interface Embedded {
    rateTypes?: RateType[];
    chargeUsageTypes?: ChargeUsageType[];
    chargeApplicationLevelTypes?: ChargeApplicationLevelType[];
    serviceOfferingBusinessUnitTransitModeAssociations?: ServiceOfferingBusinessUnitTransitModeAssociation[];
}
export interface Page {
    size?: number;
    totalElements?: number;
    totalPages?: number;
    number?: number;
}
export interface RateType {
    rateTypeId: number;
    rateTypeName: string;
    _links?: Links;
}
export interface RateTypeID {
    rateTypeId: number;
    rateTypeName: string;
}
export interface RateTypeList {
    _embedded: Embedded;
    _links: Links;
    page: Page;
}
export interface ChargeUsageType {
    chargeUsageTypeID: number;
    chargeUsageTypeName: string;
    _links?: Links;
}
export interface ChargeUsageTypeList {
    _embedded: Embedded;
    _links: Links;
}
export interface ChargeApplicationLevelType {
    chargeApplicationLevelTypeID: number;
    chargeApplicationLevelTypeName: string;
    _links?: Links;
}
export interface ChargeApplicationLevelTypeList {
    _embedded: Embedded;
    _links: Links;
}
export interface FinanceBusinessUnitServiceOfferingAssociation {
    financeBusinessUnitServiceOfferingAssociationID: number;
    financeBusinessUnitCode: string;
    serviceOfferingCode: string;
    effectiveTimestamp: string;
    expirationTimestamp: string;
    lastUpdateTimestampString: string;
}
export interface ServiceOfferingBusinessUnitTransitModeAssociation {
    financeBusinessUnitServiceOfferingAssociation: FinanceBusinessUnitServiceOfferingAssociation;
    transitMode: string;
    utilizationClassification: string;
    freightShippingType: string;
    lastUpdateTimestampString: string;
    _links: Links;
}
export interface BusinessUnitList {
    _embedded: Embedded;
    _links: Links;
}
export interface ServiceOfferingCode {
    serviceOfferingCode: string;
    serviceOfferingDescription: string;
    financeBusinessUnitCode: string;
    transitModeCode: string;
    transitModeDescription: string;
}
export interface PricingChargeType {
    chargeTypeCode: string;
    chargeTypeName: string;
    chargeTypeDescription: string;
}
export interface PayloadFinanceBusinessUnitServiceOfferingAssociation {
    financeBusinessUnitServiceOfferingAssociationID: number;
    financeBusinessUnitCode: string;
    serviceOfferingCode: string;
}
export interface SaveChargeCodeRequestPayload {
    chargeType: PricingChargeType;
    financeBusinessUnitServiceOfferingAssociations: PayloadFinanceBusinessUnitServiceOfferingAssociation[];
    rateTypes: RateTypeID[];
    chargeUsageType: ChargeUsageType;
    chargeApplicationLevelType: ChargeApplicationLevelType;
    quantityRequiredIndicator: string;
    autoInvoiceIndicator: string;
    effectiveDate: string;
    expirationDate: string;
}
export interface DropdownList {
    label: string;
    value: string;
}
export interface ServiceOfferingList {
    label: string;
    value: PayloadFinanceBusinessUnitServiceOfferingAssociation;
}
export interface UsageList {
    label: string;
    value: ChargeUsageType;
}
export interface RateTypeDropdown {
    label: string;
    value: RateTypeID;
}
export interface AutoCompleteList {
    label: number;
    value: string;
}
