import { MenuItem } from 'primeng/api';

import { CustomerAgreementNameConfigurationID } from '../../../model/view-agreement-details.interface';
export class AdditionalInformationModel {
    stepsList: MenuItem[];
    activeIndex: number;
    nameConfigurationDetails: CustomerAgreementNameConfigurationID;
    subscribeFlag: boolean;
    isBroadcastCallFlag?: boolean;
    constructor() {
        this.activeIndex = 1;
        this.stepsList = [{
            label: 'Line Haul Details',
            disabled: true
        }, {
            label: 'Additional Information',
            disabled: false
        }, {
            label: 'Review',
            disabled: true
        }];
        this.subscribeFlag = true;
    }
}
