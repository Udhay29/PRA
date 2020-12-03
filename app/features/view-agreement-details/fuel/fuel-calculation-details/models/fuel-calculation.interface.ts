export interface FuelCalculationDateTypes {
    fuelCalculationDateTypeID: number;
    fuelCalculationDateTypeName: string;
}

export interface FuelCalculationDateTypesDropdown {
    label: string;
    value: FuelCalculationDateTypes;
}

export interface DropdownList {
    value: number;
    label: string;
}

export interface CurrencyDropdownList {
    value: string;
    label: string;
}

export interface ChargeType {
    chargeTypeName: string;
    chargeTypeCode: string;
    chargeTypeID: number;
}
export interface ChargeTypeDropdown {
    label: string;
    value: ChargeType;
}
export interface RoundingDigit {
    fuelRoundingDecimalID: number;
    fuelRoundingDecimalNumber: number;
}

export interface RoundDigitDropdown {
    label: string;
    value: RoundingDigit;
}

export interface CalculationType {
    fuelCalculationTypeID: number;
    fuelCalculationTypeName: string;
}

export interface FuelCalculationTypeDropdown {
    label: string;
    value: CalculationType;
}

export interface RateType {
    fuelRateTypeID: number;
    fuelRateTypeName: string;
}

export interface FuelRateTypeDropdown {
    label: string;
    value: RateType;
}

export interface FuelType {
    fuelTypeID: number;
    fuelTypeName: string;
}

export interface FuelTypeDropdown {
    label: string;
    value: FuelType;
}

export interface FuelDiscountTypes {
    fuelDiscountTypeID: number;
    fuelDiscountTypeName: string;
}

export interface FuelDiscountTypesDropdown {
    label: string;
    value: FuelDiscountTypes;
}
export interface Column {
    label: string;
    key: string;
}

export interface FuelCalculationMethodTypes {
    fuelCalculationMethodTypeID: number;
    fuelCalculationMethodTypeName: string;
}

export interface FlatConfigurationDetails {
    flatConfigurationID: number;
    fuelSurchargeAmount: number;
}

export interface FormulaConfigurationDetails {
    formulaConfigurationID: number;
    fuelSurchargeFactorAmount: number;
    incrementChargeAmount: number;
    incrementIntervalAmount: number;
    implementationAmount: number;
    capAmount: number;
}

export interface ReeferVolumeMeasurement {
    unitOfVolumeMeasurementCode: string;
    pricingFunctionalAreaID: number;

}

export interface ReeferVolumeDropdown {
    label: string;
    value: ReeferVolumeMeasurement;
}

export interface ReeferDistanceMeasurement {
    unitOfLengthMeasurementCode: string;
    pricingFunctionalAreaID: string;
}

export interface ReeferDistanceDropdown {
    label: string;
    value: ReeferDistanceMeasurement;
}

export interface DistanceHourRoundingType {
    fuelRoundingTypeID: number;
    fuelRoundingTypeName: string;
}

export interface DistanceHourRoundingDropdown {
    label: string;
    value: DistanceHourRoundingType;
}

export interface ReeferConfigurationDetails {
    reeferConfigurationID: number;
    implementationAmount: number;
    burnRatePerHourQuantity: number;
    unitOfVolumeMeasurement: ReeferVolumeMeasurement;
    distancePerHourQuantity: number;
    unitOfLengthMeasurement: ReeferDistanceMeasurement;
    travelTimeHourRoundingType: DistanceHourRoundingType;
    serviceHourAddonQuantity: number;
    serviceHourRoundingType: DistanceHourRoundingType;
    serviceHourAddonDistanceQuantity: number;
    loadUnloadHourQuantity: number;
}

export interface DistancePerFuelQuantityConfigurationDetails {
    distancePerFuelQuantityConfigurationID: number;
    unitOfVolumeMeasurement: ReeferVolumeMeasurement;
    unitOfLengthMeasurement: ReeferDistanceMeasurement;
    implementationAmount: number;
    distancePerFuelQuantity: number;
    addonAmount: number;
}

export interface ErrorMessage {
    severity: string;
    summary: string;
    detail: string;
}

export interface FuelCalculationDropdown {
    fuelCalculationTypes: CalculationType;
    fuelRateTypes: RateType;
    fuelCalculationDateTypes: FuelCalculationDateTypes;
    fuelRoundingDecimals: RoundingDigit;
    fuelTypes: FuelType;
    fuelDiscountTypes: FuelDiscountTypes;
    fuelCalculationMethodTypes: FuelCalculationMethodTypes;
    fuelRoundingTypes: DistanceHourRoundingType;

}
export interface ReqParam {
    fuelCalculationID: number;
    fuelCurrencyCode: string;
    chargeType: ChargeType;
    fuelCalculationType: CalculationType;
    fuelRateType: RateType;
    fuelCalculationDateType: FuelCalculationDateTypes;
    fuelRoundingDecimal: RoundingDigit;
    fuelType: FuelType;
    fuelDiscountType: FuelDiscountTypes;
    fuelCalculationMethodType: FuelCalculationMethodTypes;
    rollUpIndicator: string;
    flatConfiguration: FlatConfigurationDetails;
    formulaConfiguration: FormulaConfigurationDetails;
    reeferConfiguration: ReeferConfigurationDetails;
    distancePerFuelQuantityConfiguration: DistancePerFuelQuantityConfigurationDetails;
    fuelIncrementalPriceDTOs: null | Incrementaldetails[];

}
export interface Incrementaldetails {
    fuelIncrementCalculationMethodConfigurationSetID: number;
    fuelIncrementCalculationMethodConfigurationID: number;
    fuelBeginAmount: string;
    fuelEndAmount: string;
    fuelSurchargeAmount: string;
    isRemoved: boolean;
    isEdited: boolean;
}
export interface AgreementDetails {
    customerAgreementID: number;
    customerAgreementName: string;
    agreementType: string;
    ultimateParentAccountID: number;
    currencyCode: string;
    cargoReleaseAmount: number;
    businessUnits: string[];
    taskAssignmentIDs: number[];
    effectiveDate: string;
    expirationDate: string;
    invalidIndicator: string;
    invalidReasonTypeName: string;
}

  export interface CustomerAgreementDetail {
    agreementID: number;
    fuelProgramVersionID: number;
    fuelProgramID: number;
  }

  export interface UploadDataList {
    fuelIncrementCalculationMethodConfigurationSetID?: number;
    fuelIncrementCalculationMethodConfigurationID?: number;
    fuelBeginAmount?: string;
    fuelEndAmount?: string;
    fuelSurchargeAmount?: string;
    isRemoved?: boolean;
    isModified?: boolean;
    fuelBeginAmountErrorMessage?: string;
    fuelEndAmountErrorMessage?: string;
    fuelSurchargeAmountErrorMessage?: string;
    id?: number;
  }


export interface CustomToastMessage {
    data: string;
    customSummary: string;
}



