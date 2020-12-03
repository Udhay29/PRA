import { ListingFilterInterface, StatusInterface } from './mileage-filter.interface';

export class MileageFilterConfig {

    programName: ListingFilterInterface;
    agreementDefault: ListingFilterInterface;
    contract: ListingFilterInterface;
    section: ListingFilterInterface;
    status: StatusInterface;
    carrier: ListingFilterInterface;
    system: ListingFilterInterface;
    systemParameters: ListingFilterInterface;
    systemVersion: ListingFilterInterface;
    borderMilesParameter: ListingFilterInterface;
    distanceUnit: ListingFilterInterface;
    routeType: ListingFilterInterface;
    calculationType: ListingFilterInterface;
    decimalPrecision: ListingFilterInterface;
    geographyType: ListingFilterInterface;
    businessUnit: ListingFilterInterface;

    constructor() {
    }
}
