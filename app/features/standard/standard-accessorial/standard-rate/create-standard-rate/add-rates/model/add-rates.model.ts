import { FormGroup } from '@angular/forms';

import { RateDropDownInterface } from '../model/add-rates.interface';
import { CheckBoxAttributesInterface } from '../../model/create-standard-interface';
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
    constructor() {
        this.subscribeFlag = true;
    }
}
