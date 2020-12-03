import { Breadcrumb } from '../../../../model/breadcrumb';
export class BusinessFuelModel {
    breadCrumbList: Breadcrumb[];
    selectedIndex: number;
    constructor() {
        this.breadCrumbList = [
            { label: 'Pricing', routerLink: ['/managereferences'] },
            { label: 'Settings', routerLink: ['/settings'] },
            { label: 'Fuel', routerLink: ['/settings/business-fuel'] }
        ];
        this.selectedIndex = 1;
    }
}
