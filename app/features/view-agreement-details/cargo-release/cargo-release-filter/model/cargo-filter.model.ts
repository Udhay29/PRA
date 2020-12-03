import { FilterDataInterface, ListRadio, SliderDataInterface, ListingFilterInterface } from './cargo-filter.interface';
export class CargoFilterModel {
    sliderData: SliderDataInterface;
    agreementData: ListRadio;
    contractData: FilterDataInterface;
    businessData: ListingFilterInterface;
    sectionData: ListingFilterInterface;
    statusData: ListingFilterInterface;
    updatedByData: ListingFilterInterface;
    createdByData: ListingFilterInterface;
    createdProgramData: ListingFilterInterface;
    lastUpdateProgramData: ListingFilterInterface;
    constructor() {
    }
}
