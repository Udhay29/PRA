import { Breadcrumb } from '../../../model/breadcrumb';
import { MenuItem } from 'primeng/api';

export class ChargesModel {

    breadCrumbList: Breadcrumb[];
    items: MenuItem[];
    popupMessage: string;
    routingUrl: string;
    activeIndex: number;
    selectedIndex: number;
    lastSelectedIndex: number;
    isChangesSaving: boolean;
    isPopupVisible: boolean;
    isSubscribe: boolean;
    lastEditedFormFlag: boolean;

    constructor() {
        this.breadCrumbList = [
            { label: 'Pricing', routerLink: ['/managereferences'] },
            { label: 'Settings', routerLink: ['/settings'] },
            { label: 'Charges', routerLink: ['/settings/charges'] }
        ];
        this.activeIndex = 1;
        this.isSubscribe = true;
        this.selectedIndex = 0;
    }
}
