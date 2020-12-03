import { MenuItem } from 'primeng/api';

export class FuelDetailViewModel {
    breadCrumbList: MenuItem[];
    fuelProgramID: number;
    isPageLoading: boolean;
    constructor(agreementID) {
        this.breadCrumbList = [{
            label: 'Pricing',
            routerLink: ['/dashboard']
        }, {
            label: 'Search Agreements',
            routerLink: ['/searchagreement']
        }, {
            label: 'Agreement Detail',
            routerLink: ['/viewagreement'],
            queryParams: { id: agreementID }

        }, {
            label: 'Fuel Program Detail'
        }];
        this.fuelProgramID = 0;
        this.isPageLoading = false;
    }
}
