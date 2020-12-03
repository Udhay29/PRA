export interface LineHaulValues {
    customerLineHaulConfigurationID: number;
    laneID: number;
    lineHaulSourceTypeID: number;
    lineHaulSourceTypeName: string;
    originType: string;
    destinationType: string;
    originPoints: Array<OriginDestinationValues>;
    destinationPoints: Array<OriginDestinationValues>;
    stops: Array<StopValues>;
    stopChargeIncludedIndicator: string;
    status: string;
    effectiveDate: string;
    expirationDate: string;
    customerAgreementID: number;
    customerAgreementName: string;
    customerAgreementContractID: number;
    customerAgreementContractNumber: string;
    customerAgreementContractName: string;
    customerAgreementContractSectionID: number;
    customerAgreementContractSectionName: string;
    financeBusinessUnitServiceOfferingAssociationID: number;
    financeBusinessUnitName: string;
    serviceOfferingCode: string;
    serviceOfferingBusinessUnitTransitModeAssociationID: number;
    transitMode: string;
    serviceLevelBusinessUnitServiceOfferingAssociationID: number;
    serviceLevelCode: string;
    equipment: any;
    operationalServices: Array<OperationalServiceValues>;
    priorityLevelNumber: number;
    overriddenPriority: string;
    lineHaulAwardStatusTypeID: number;
    lineHaulAwardStatusTypeName: string;
    rates: Array<RateValues>;
    groupRateType: string;
    groupRateItemizeIndicator: boolean;
    sourceID: number;
    sourceLineHaulID: number;
    overiddenPriorityLevelNumber: number;
    billTos: Array<object>;
    carriers: Array<object>;
    mileagePreference: object;
    lineHaulMileageRangeMinQuantity: number;
    lineHaulMileageRangeMaxQuantity: number;
    unitOfMeasurement: object;
    hazmatIncludedIndicator: string;
    fuelIncludedIndicator: string;
    autoInvoiceIndicator: string;
    equipmentRequirementSpecificationAssociationID: number;
    equipmentClassificationCode: string;
    equipmentClassificationCodeDescription: string;
    equipmentTypeCode: string;
    equipmentClassificationDescription: string;
    equipmentTypeCodeDescription: string;
    equipmentLengthQuantity: number;
    unitOfEquipmentLengthMeasurementCode: number | string;
}
export interface OriginDestinationValues {
    country: string;
    point: string;
    pointID: number;
    addressLine1: string;
    addressLine2: string;
    cityName: string;
    countryCode: string;
    countryName: string;
    postalCode: string;
    stateCode: string;
    stateName: string;
    lowerBoundID: number;
    lowerBound: string;
    upperBoundID: number;
    upperBound: string;
    description: string;
    pointDisplayName: string;
    subTypeID: number;
    subTypeName: string;
}
export interface StopValues {
    stopSequenceNumber: number;
    typeName: string;
    stopTypeID: number;
    stopCountry: string;
    point: string;
    pointID: number;
}
export interface EquipmentValues {
    equipmentRequirementSpecificationAssociationID: number;
    equipmentClassificationCode: string;
    equipmentTypeCode: string;
    equipmentLengthQuantity: number;
}
export interface OperationalServiceValues {
    serviceTypeCode: string;
}
export interface RateValues {
    customerLineHaulRateID: number;
    customerLineHaulConfigurationID: number;
    chargeUnitTypeName: string;
    rateAmount: number;
    minimumAmount: number;
    maximumAmount: number;
    currencyCode: string;
}
export interface RateInterface {
    chargeUnitTypeName: string;
    rateAmount: number;
    currencyCode: string;
}
export interface HitsInterface {
    total: number;
    max_score: number;
    hits: HitsItem[];
}
export interface HitsItem {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: SourceObject;
}
export interface SourceObject {
    Address: AddressInterface;
}
export interface AddressInterface {
    AddressID: number;
    AddressLine1: string;
    CityName: string;
    CountryCode: string;
    CountryName: string;
    PostalCode: number;
    StateCode: string;
}
export interface CityInterface {
    hits: CityHits;
    max_score: number;
    total: number;
}
export interface CityHits {
    hits: CityHitsItem[];
}
export interface CityHitsItem {
    _id: number;
    _index: string;
    _nested: object;
    _score: number;
    _source: SourceInterface;
    _type: string;
}
export interface SourceInterface {
    city: CityInnerHitsFace;
}
export interface CityInnerHitsFace {
    CityName: string;
    State: StateCodeInterface;
}
export interface StateCodeInterface {
    StateCode: string;
}
export interface StopAddressDetailsInterface {
    AddressLine1: string;
    CityName: string;
    StateCode: string;
    PostalCode: number;
    CountryCode: string;
    State: string;
    type: string;
}
export interface StopCityStateDetailsInterface {
    AddressLine1?: string;
    CityName?: string;
    StateCode?: string;
    PostalCode?: number;
    CountryCode?: string;
    State?: string;
    stopTye?: string;
    index?: number;
    LocationCode?: string;
    LocationName?: string;
}
export interface EquipmentTypeInterface {
    equipmentTypeCode: string;
    equipmentTypeDescription: string;
    equipmentClassificationTypeAssociations: Array<object>;
    effectiveTimestamp: string;
    expirationTimestamp: string;
    lastUpdateTimestampString: string;
    _links: object;
}
