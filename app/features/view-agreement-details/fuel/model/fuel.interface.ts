

export interface FuelFlat {
    FuelSurchargeAmount?: string;
}

export interface FuelFormula {
    FuelSurchargeFactorAmount: string;
    IncrementChargeAmount: string;
    ImplementationAmount: string;
    IncrementIntervalAmount: string;
    CapAmount: string;
}

export interface FuelQuantity {
    ImplementationAmount: string;
    PricingUnitOfLengthMeasurementCode: number;
    PricingUnitOfVolumeMeasurementCode: number;
    DistancePerFuelQuantity: string;
    AddonAmount: string;
}

export interface FuelReefer {
    ImplementationAmount: string;
    DistancePerHourQuantity: string;
    TravelTimeHourRoundingTypeName: string;
    BurnRatePerHourQuantity: string;
    LoadUnloadHourQuantity: number;
    ServiceHourAddonQuantity: number;
    ServiceHourAddonDistanceQuantity: string;
    ServiceHourRoundingTypeName: string;
    PricingUnitOfLengthMeasurementCode: number;
    PricingUnitOfVolumeMeasurementCode: number;
}

export interface FuelCalculationDetails {
    FuelProgramVersionID?: number;
    FuelCalculationConfigurationID: number;
    FuelCalculationDateTypeName: string;
    FuelTypeName: string;
    FuelRoundingDecimalNumber: string;
    ChargeTypeName: string;
    ChargeTypeCode: string;
    FuelRateTypeName: string;
    FuelDiscountTypeName: string;
    CurrencyCode: string;
    FuelCalculationTypeName: string;
    FuelCalculationMethodTypeName: string;
    FuelRollUpIndicator: string;
    FuelFlat: FuelFlat;
    FuelFormula: FuelFormula;
    FuelQuantity: FuelQuantity;
    FuelReefer: FuelReefer;
}

export interface FuelPriceRegionAssociations {
    DistrictID?: number;
    DistrictName?: string;
}

export interface FuelPriceBasis {
    FuelPriceSourceTypeName?: string;
    FuelPriceChangeOccurenceTypeName?: string;
    PriceChangeWeekDayName?: string;
    PriceChangeMonthDayNumber?: number;
    HolidayDelayIndicator?: string;
    CustomFuelCalendar?: string;
    FuelPriceFactorTypeName?: string;
    AverageWeekQuantity?: number;
    AverageMonthQuantity?: number;
    FuelPriceBasisRegionTypeName?: string;
    UseDefinedRegionStates?: string;
    AverageFuelFactorIndicator?: string;
    FuelPriceRegionAssociations: FuelPriceRegionAssociations[];
}

export interface FuelProgram {
    FuelProgramID: number;
    FuelProgramVersionID: number;
    FuelProgramType: string;
    FuelProgramName: string;
    FuelProgramStatus?: string;
    Conditions?: string;
    FuelCalculationDetails: FuelCalculationDetails;
    FuelPriceBasis: FuelPriceBasis;
    CreateUserID: string;
    CreateProgramName: string;
    CreatedDate: string;
    LastUpdateUserID: string;
    LastUpdateProgramName: string;
    LastUpdateDate: string;
}

export interface ContractAssociation {
    ContractDisplayName?: string;
    ContractID?: number;
    ContractName?: string;
    ContractNumber?: number;
    ContractType?: string;
}

export interface SectionAssociation {
    SectionID?: number;
    SectionName?: string;
}

export interface FinanceBusinessUnitServiceOfferingAssociation {
    FinanceBusinessUnitCode: string;
    FinanceBusinessUnitServiceOfferingAssociationID: number;
    FinanceBusinessUnitServiceOfferingDisplayName: string;
    ServiceOfferingCode: string;
}

export interface BillToAccountAssociation {
    BillingPartyCode: string;
    BillingPartyID: number;
    BillingPartyName: string;
}

export interface CarrierAssociation {
    CarrierCode: string;
    CarrierID: number;
    CarrierName: string;
}

export interface Source {
    FuelProgram: FuelProgram;
    uniqueDocID: string;
    AgreementID: number;
    AgreementName?: string;
    AgreementDefaultIndicator?: string;
    ContractAssociations: ContractAssociation[];
    SectionAssociations: SectionAssociation[];
    FinanceBusinessUnitServiceOfferingAssociations: FinanceBusinessUnitServiceOfferingAssociation[];
    BillToAccountAssociations: BillToAccountAssociation[];
    CarrierAssociations: CarrierAssociation[];
    EffectiveDate: string;
    ExpirationDate: string;
}

export interface Hits {
    _index: string;
    _type: string;
    _id: string;
    _version: number;
    found: boolean;
    _source: Source;
}
export interface RootObject {
    took: number;
    timed_out: boolean;
    _shards: Shards;
    hits: Hits[];
}
export interface Shards {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
}
export interface TableColumnModel {
    name: string;
    property: string;
}

export interface QueryMock {
     sortDistanceBasis: string;
    sortQuantityBasis: string;
    sortImplementationAmount: string;
    sortDistancePerHourQuantity: string;
    sortServiceHourAddonDistanceQuantity: string;
}
