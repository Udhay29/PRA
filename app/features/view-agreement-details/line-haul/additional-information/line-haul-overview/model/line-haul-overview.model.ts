import {
    LineHaulValues, RateInterface, StopAddressDetailsInterface, StopCityStateDetailsInterface,
    StopValues
} from './line-haul-overview.interface';
import { CustomerAgreementNameConfigurationID } from '../../../../model/view-agreement-details.interface';
export class LineHaulOverViewModel {
    lineHaulOverview: LineHaulValues;
    subscriberFlag: boolean;
    isCallCheckFlag: boolean;
    rateValues: RateInterface[];
    operationalServices: string[];
    originPoints: StopAddressDetailsInterface[];
    destinationPoints: StopAddressDetailsInterface[];
    originRange: any;
    originRangeDisplay: any;
    destinationRange: any;
    destinationRangeDisplay: any;
    stopDetails: StopCityStateDetailsInterface[];
    postalCode: any;
    nameConfigurationDetails: CustomerAgreementNameConfigurationID;
    serviceOffering: string;
    constructor() {
        this.subscriberFlag = true;
        this.isCallCheckFlag = true;
        this.originRange = [];
        this.destinationRange = [];
    }
}
