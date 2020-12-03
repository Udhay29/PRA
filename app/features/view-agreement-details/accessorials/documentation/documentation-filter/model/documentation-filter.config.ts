import { ListingFilterInterface, StatusInterface } from './documenatation-filter.interface';

export class DocumenationFilterConfig {
    documentationType: ListingFilterInterface;
    chargeType: ListingFilterInterface;
    contract: ListingFilterInterface;
    section: ListingFilterInterface;
    businessUnit: ListingFilterInterface;
    carrier: ListingFilterInterface;
    billToAccount: ListingFilterInterface;
    status: StatusInterface;
    constructor() {
    }
}
