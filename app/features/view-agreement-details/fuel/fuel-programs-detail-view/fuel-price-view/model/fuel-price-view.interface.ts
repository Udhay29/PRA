export interface FuelListDisplay {
  region?: string;
  regionStateOption?: string;
  conditionName?: string;
  states?: string;
}

export interface TableColumnList {
    name: string;
    property: string;
  }
 export interface FuelPriceChangeOccurrenceTypeDTO {
    fuelPriceChangeOccurrenceTypeID: number;
    fuelPriceChangeOccurrenceTypeName: string;
}

export interface FuelProgramPriceBasisTypeDTO {
    fuelProgramPriceBasisTypeID: number;
    fuelProgramPriceBasisTypeName: string;
}

export interface FuelPriceFactorTypeDTO {
    fuelPriceFactorTypeID: number;
    fuelPriceFactorTypeName: string;
}

export interface FuelPriceSourceTypeDTO {
    fuelPriceSourceTypeID: number;
    fuelPriceSourceTypeName: string;
}

export interface WeekToApplyDTO {
    weekToApplyID: number;
    weekToApplyName: string;
}

export interface FuelPriceBasisByWeekDTO {
    weekToApplyDTO: WeekToApplyDTO;
    priceChangeWeekDayName: string;
    averageWeekQuantity: number;
}

export interface FuelPriceBasisByMonthDTO {
    averageMonthQuantity: number;
    priceChangeMonthDayNumber: number;
}

export interface FuelPriceBasisRegionTypeDTO {
    fuelPriceBasisRegionTypeID: number;
    fuelPriceBasisRegionTypeName: string;
}

export interface FuelDistrictDTO {
    fuelNationalDistrictID: number;
    fuelNationalDistrictName: string;
    fuelSubDistrictID: number;
    fuelSubDistrictName: string;
}

export interface FuelPriceBasisRegionDTO {
    fuelDistrictDTO: FuelDistrictDTO;
    isDefinedRegionStates: string;
    associatedStates: string;
}

export interface FuelPriceBasisRegionSetDTO {
    fuelPriceBasisRegionTypeDTO: FuelPriceBasisRegionTypeDTO;
    fuelPriceBasisRegionDTO: FuelPriceBasisRegionDTO[];
    averageRegionIndicator: string;
}

export interface FuelPriceDetails {
    fuelPriceChangeOccurrenceTypeDTO?: FuelPriceChangeOccurrenceTypeDTO;
    fuelProgramPriceBasisTypeDTO?: FuelProgramPriceBasisTypeDTO;
    fuelPriceFactorTypeDTO?: FuelPriceFactorTypeDTO;
    fuelPriceSourceTypeDTO?: FuelPriceSourceTypeDTO;
    holidayDelayIndicator?: string;
    fuelPriceBasisByWeekDTO?: FuelPriceBasisByWeekDTO;
    fuelPriceBasisByMonthDTO?: FuelPriceBasisByMonthDTO;
    fuelPriceBasisRegionSetDTO?: FuelPriceBasisRegionSetDTO;
}
