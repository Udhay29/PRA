import { FormGroup } from '@angular/forms';

import { RateDropDownInterface } from '../model/add-rates.interface';
import { CheckBoxAttributesInterface, AddRateEditResponse } from '../../create-rates/model/create-rates.interface';

export class AddRatesModel {
    subscribeFlag: boolean;
    addRateForm: FormGroup;
    rateTypes: RateDropDownInterface[];
    rateTypeSuggestion: RateDropDownInterface[];
    groupRateTypes: RateDropDownInterface[];
    groupRateTypeSuggestion: RateDropDownInterface[];
    isMoreThanOneRate: boolean;
    roundingTypes: RateDropDownInterface[];
    roundingTypeSuggestion: RateDropDownInterface[];
    showMinuIcon: boolean;
    CheckBoxAttributes: CheckBoxAttributesInterface;
    rateAmountValues: Array<number>;
    addRateEditResponse: AddRateEditResponse[];
    editAccessorialWholeResponse;
    maxAmount: string;
    minAmount: string;
    constructor() {
        this.subscribeFlag = true;
        this.rateAmountValues = [];
    }
}
