import { FormGroup } from '@angular/forms';
import {
    ChargeCodeInterface, RateDropDownInterface, ChargeCodeResponseInterface,
    EditAdditionalChargeResponse
} from './additional-charges-interface';

export class AdditionalChargesModel {
    subscribeFlag: boolean;
    selectedChargeType: ChargeCodeInterface;
    addChargesForm: FormGroup;
    rateTypes: RateDropDownInterface[];
    chargeType: ChargeCodeInterface[];
    chargeTypeSuggestions: ChargeCodeInterface[];
    showMinuIcon: boolean;
    showRemoveAllConfirmPop: boolean;
    invalidChargeType: boolean;
    invalidChargeTypeSummary: string;
    invalidChargeTypeDetail: string;
    buSoIds: Array<number>;
    rateTypesArray: Array<RateDropDownInterface[]>;
    rateTypeSuggestions: Array<RateDropDownInterface[]>;
    chargeCodeResponse: ChargeCodeResponseInterface[];
    rateAmountValues: Array<number>;
    rateTypeLoading: boolean;
    isAddchargesEditRateClicked: boolean;
    editAdditionalChargeResponse: EditAdditionalChargeResponse[];
    constructor() {
        this.subscribeFlag = true;
        this.showMinuIcon = false;
        this.invalidChargeType = false;
        this.showRemoveAllConfirmPop = false;
        this.invalidChargeTypeSummary = 'Warning';
        this.invalidChargeTypeDetail = 'Additional charge type not allowed as it matches the primary charge.';
        this.buSoIds = [];
        this.chargeCodeResponse = [];
        this.rateTypesArray = [[]];
        this.rateTypeSuggestions = [[]];
        this.rateAmountValues = [];
        this.rateTypeLoading = false;
    }
}
