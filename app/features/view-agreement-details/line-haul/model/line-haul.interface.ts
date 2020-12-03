export interface TableColumnsInterface {
    label: string;
    field: string;
    isArray: boolean;
    colspan: number;
    rowspan: number;
    isSubcolumn: boolean;
    isNotFirst: boolean;
}

export interface Shared {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
}

export interface UnitOfMeasurement {
    weightRangeDisplayName: string;
    code: string;
    lineHaulWeightRangeMaxQuantity: number;
    lineHaulWeightRangeMinQuantity: number;
    description: string;
}

export interface BillTosItem {
    billingPartyDisplayName: string;
    billToID: number;
    billToName: string;
    billToCode: string;
}

export interface MileagePreference {
    lineHaulMileageRangeMaxQuantity: number;
    mileagePreferenceID: number;
    mileagePreferenceName: string;
    mileagePreferenceDisplayName: string;
    lineHaulMileageRangeMinQuantity: number;
}

export interface CarriersItem {
    carrierName: string;
    carrierCode: string;
    carrierDisplayName: string;
    carrierID: number;
}

export interface Origin {
    country: string;
    postalCode: string;
    description?: string;
    vendorID?: string;
    type: string;
    point: string;
    pointID: number;
    cityName: string;
    stateName: string;
    countryCode: string;
    addressLine1: string;
    typeID: number;
    addressLine2?: string;
    stateCode: string;
    countryName: string;
}

export interface Destination {
    country: string;
    postalCode: string;
    description?: string;
    vendorID?: string;
    type: string;
    point: string;
    pointID: number;
    cityName: string;
    stateName: string;
    countryCode: string;
    addressLine1: string;
    typeID: number;
    addressLine2?: string;
    stateCode: string;
    countryName: string;
}

export interface RatesItem {
    customerLineHaulRateID: number;
    chargeUnitTypeName: string;
    customerLineHaulConfigurationID: number;
    rateAmount: number;
    maximumAmount: number;
    minimumAmount: number;
    minDisplayAmount: string;
    maxDisplayAmount: string;
    rateDisplayAmount: string;
    currencyCode: string;
}
export interface StopsItem {
    customerLineHaulStopID: number;
    geographicPointUsageLevelTypeAssociationID?: number;
    stopCountry: string;
    stopLocationPointID?: number;
    stopPoint: string;
    stopSequenceNumber: number;
    stopTypeName: number;
    vendorID?: number;
}
export interface LineHaulDetailsItem {
    customerAgreementContractNumber: string;
    serviceOfferingBusinessUnitTransitModeAssociationID: number;
    autoInvoiceIndicator: string;
    lineHaulAwardStatusTypeID: number;
    groupRateItemizeIndicator: string;
    lineHaulAwardStatusTypeName: string;
    lineHaulSourceTypeName: string;
    transitModeDescription: string;
    equipmentTypeCode: string;
    unitOfMeasurement: null | UnitOfMeasurement;
    equipmentClassificationCodeDescription: string;
    billTos: BillTosItem[];
    mileagePreference: null | MileagePreference;
    priorityLevelNumber: number;
    customerAgreementContractSectionID: number;
    carriers: CarriersItem[];
    customerAgreementName: string;
    overiddenPriorityLevelNumber?: number;
    numberOfStops: number;
    transitMode: string;
    serviceOfferingDescription: string;
    customerAgreementID: number;
    stops: StopsItem[];
    equipmentLengthDisplayName: string;
    status: string;
    serviceOfferingCode: string;
    lineHaulSourceTypeID: number;
    serviceLevelDescription?: string;
    equipmentClassificationCode: string;
    unitOfEquipmentLengthMeasurementCode: string;
    equipmentRequirementSpecificationAssociationID: number;
    origin: Origin;
    destination: Destination;
    financeBusinessUnitName: string;
    financeBusinessUnitServiceOfferingAssociationID: number;
    customerAgreementContractDisplayName: string;
    serviceLevelBusinessUnitServiceOfferingAssociationID: number;
    operationalServices: OperationalServicesItem[];
    stopChargeIncludedIndicator: string;
    hazmatIncludedIndicator: string;
    laneID: number;
    customerAgreementContractName: string;
    dbSyncUpdateTimestamp: Date;
    sourceLineHaulID: number | string;
    customerAgreementContractID: number;
    groupRateType: string;
    equipmentLengthQuantity: number;
    expirationDate: string;
    sourceID: number | string;
    createdUserId: string;
    serviceLevelCode: number | string;
    lastUpdateUserId: string;
    rates: RatesItem[];
    customerAgreementContractSectionName: string;
    equipmentTypeCodeDescription?: string;
    recordStatus: string;
    fuelIncludedIndicator: boolean;
    customerLineHaulConfigurationID: number;
    effectiveDate: string;
}
export interface OperationalServicesItem {
    serviceTypeDescription: string;
}
export interface HitsItem {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: LineHaulDetailsItem;
}

export interface Hits {
    total: number;
    max_score: number;
    hits: HitsItem[];
}


export interface LineHaulGridDto {
    took: number;
    timed_out: boolean;
    _shards: Shared;
    hits: Hits;
}
export interface CustomerAgreementNameConfigurationID {
    customerAgreementName: string;
    customerLineHaulConfigurationID: number;
}

export interface EditLineHaulData {
    lineHaulDetails: any;
    isEditFlag: boolean;
}
export interface InactiveResponseDto {
    status: string;
    message: string;
    customerLineHaulConfigurationID: number;
}

