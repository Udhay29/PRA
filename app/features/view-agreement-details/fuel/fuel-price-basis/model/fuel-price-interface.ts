import { SelectItem } from 'primeng/api';

export class DropdownObject {
  label: string;
  value: SelectItem;
}
export class DayOfWeek {
  weeksInAverage?: string[];
  priceChangeDayOfWeek?: string[];
  priceChangeDayOfMonth?: string[];
  monthsInAverage?: string[];
}
export class ResponseObject {
  _embedded: Embedded;
}
export class Embedded {
  fuelProgramPriceBasisTypes?: ProgramType[];
  weekToApplyTypes?: Week[];
  fuelPriceFactorTypes?: PriceFactor[];
  fuelPriceSourceTypes?: PriceSource[];
  _links: Links;
}
export class ProgramType {
  fuelProgramPriceBasisTypeID: number;
  fuelProgramPriceBasisTypeName: string;
  _links: Links;
}
export class Week {
  weekToApplyTypeID: number;
  weekToApplyTypeName: string;
  _links: Links;
}
export class PriceFactor {
  fuelPriceFactorTypeID: number;
  fuelPriceFactorTypeName: string;
  _links: Links;
}
export class PriceSource {
  fuelPriceSourceTypeID: number;
  fuelPriceSourceTypeName: string;
  _links: Links;
}
export class Links {
  self: Self;
  sectionType?: SectionType;
}
export class Self {
  href: string;
}
export class SectionType {
  href: string;
  templated: boolean;
}
export class Agreement {
  agreementID: number;
  fuelProgramID: number;
}
export interface SelectButtonEvent {
  originalEvent?: Event;
  value: RegionTypeEvent;
}
export interface RegionTypeEvent {
  fuelPriceBasisRegionTypeID: number;
  fuelPriceBasisRegionTypeName: string;
}
export interface RootObject {
  _embedded: Embedded;
}
export interface Embedded {
  fuelPriceBasisRegionTypes: FuelPriceBasisRegionTypesItem[];
  _links: Links;
}
export interface FuelPriceBasisRegionTypesItem {
  fuelPriceBasisRegionTypeID: number;
  fuelPriceBasisRegionTypeName: string;
  _links: Links;
}
export interface Links {
  self: Self;
  sectionType?: SectionType;
}
export interface Self {
  href: string;
}
export interface SectionType {
  href: string;
  templated: boolean;
}
export interface DistrictList {
  fuelNationalDistrictID: number | null;
  fuelNationalDistrictName: string | null;
  fuelSubDistrictID: null | number;
  fuelSubDistrictName: null | string;
}
export interface FuelPriceBasisRegionDTO {
  fuelDistrictDTO: DistrictList;
  isDefinedRegionStates: string | null;
  associatedStates: string | null;
}
export interface States {
  associatedStates: string;
}
