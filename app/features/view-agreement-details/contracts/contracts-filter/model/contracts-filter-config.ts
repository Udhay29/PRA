import { FilterDataInterface, ListRadio, ListingStaticInterface, ListingFilterInterface } from './contracts-filter.interface';
export class ContractsFilterConfigModel {
    contractType: ListingStaticInterface;
    contractIdentifier: FilterDataInterface;
    contractDescriptionData: FilterDataInterface;
    statusData: ListingStaticInterface;
    updatedBy: ListingFilterInterface;
    updateProgram: ListingFilterInterface;
    lastUpdateProgram: ListingFilterInterface;
    createdBy: ListingFilterInterface;
    constructor() {
    }
}
