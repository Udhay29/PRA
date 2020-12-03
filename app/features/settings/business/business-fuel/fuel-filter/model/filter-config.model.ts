import { ListingFilterInterface, AutoCompleteFilter } from './fuel-filter.interface';
export class FilterConfigModel {
    sourceData: ListingFilterInterface;
    regionData: ListingFilterInterface;
    basisData: ListingFilterInterface;
    currencyData: ListingFilterInterface;
    countryData: AutoCompleteFilter;
    fuelTypeData: ListingFilterInterface;
    createdByData: AutoCompleteFilter;
    createdProgramData: AutoCompleteFilter;
    updatedByData: AutoCompleteFilter;
    updatedProgramData: AutoCompleteFilter;
    constructor() {
    }
}
