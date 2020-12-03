export interface ChargeType {
    chargeTypeID: number;
    chargeTypeName: string;
    chargeTypeCode: string;
}

export interface FuelCalculationType {
    fuelCalculationTypeID: number;
    fuelCalculationTypeName: string;
}

export interface FuelRateType {
    fuelRateTypeID: number;
    fuelRateTypeName: string;
}

export interface FuelCalculationDateType {
    fuelCalculationDateTypeID: number;
    fuelCalculationDateTypeName: string;
}

export interface FuelRoundingDecimal {
    fuelRoundingDecimalID: number;
    fuelRoundingDecimalNumber: number;
}

export interface FuelType {
    fuelTypeID: number;
    fuelTypeName: string;
}

export interface FuelDiscountType {
    fuelDiscountTypeID: string;
    fuelDiscountTypeName: string;
}

export interface FuelCalculationMethodType {
    fuelCalculationMethodTypeID: number;
    fuelCalculationMethodTypeName: string;
}

export interface FlatConfiguration {
    flatConfigurationID: number;
    fuelSurchargeAmount: number | string;
}

export interface FormulaConfiguration {
    formulaConfigurationID: number;
    fuelSurchargeFactorAmount: number | string;
    incrementChargeAmount: number | string;
    incrementIntervalAmount: number | string;
    implementationAmount: number | string;
    capAmount: number | string;
}

export interface UnitOfLengthMeasurement {
    unitOfLengthMeasurementCode: string;
    unitOfLengthMeasurementDescription: string;
}

export interface UnitOfVolumeMeasurement {
    unitOfVolumeMeasurementCode: string;
    unitOfVolumeMeasurementDescription: string;
}

export interface TravelTimeHourRoundingType {
    fuelRoundingTypeID: string;
    fuelRoundingTypeName: string;
}

export interface ServiceHourRoundingType {
    fuelRoundingTypeID: string;
    fuelRoundingTypeName: string;
}

export interface ReeferConfiguration {
    reeferConfigurationID: string | number;
    implementationAmount: string | number;
    burnRatePerHourQuantity: string | number;
    distancePerHourQuantity: string;
    unitOfLengthMeasurement: UnitOfLengthMeasurement;
    unitOfVolumeMeasurement: UnitOfVolumeMeasurement;
    serviceHourAddonQuantity?: string | number;
    serviceHourAddonDistanceQuantity?: string;
    loadUnloadHourQuantity?: string;
    travelTimeHourRoundingType: TravelTimeHourRoundingType;
    serviceHourRoundingType?: ServiceHourRoundingType;
}
export interface DistancePerFuelQuantityConfiguration {
    distancePerFuelQuantityConfigurationID: number | string;
    unitOfVolumeMeasurement: UnitOfVolumeMeasurement;
    unitOfLengthMeasurement: UnitOfLengthMeasurement;
    implementationAmount: number | string;
    distancePerFuelQuantity: number | string;
    addonAmount?: number | string;
}
export interface FuelIncrementalPriceDTO {
    fuelIncrementCalculationMethodConfigurationSetID: number;
    fuelIncrementCalculationMethodConfigurationID: number;
    fuelBeginAmount: number;
    fuelEndAmount: number;
    fuelSurchargeAmount: number;
    fuelBeginAmountErrorMessage: string;
    fuelEndAmountErrorMessage: string;
    fuelSurchargeAmountErrorMessage: string;
}

export interface FuelCalculationDetails {
    fuelCalculationID: number;
    fuelCurrencyCode: string;
    chargeType?: ChargeType;
    fuelCalculationType: FuelCalculationType;
    fuelRateType: FuelRateType;
    fuelCalculationDateType: FuelCalculationDateType;
    fuelRoundingDecimal: FuelRoundingDecimal;
    fuelType: FuelType;
    fuelDiscountType?: FuelDiscountType;
    fuelCalculationMethodType: FuelCalculationMethodType;
    flatConfiguration?: FlatConfiguration;
    formulaConfiguration?: FormulaConfiguration;
    reeferConfiguration?: ReeferConfiguration;
    distancePerFuelQuantityConfiguration?: DistancePerFuelQuantityConfiguration;
    fuelIncrementalPriceDTOs?: FuelIncrementalPriceDTO[];
    rollUpIndicator: string;
}

export interface IncrementalData {
    fuelBeginAmount: string;
    fuelEndAmount: string;
    fuelSurchargeAmount: string;
}
