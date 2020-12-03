import { FormGroup } from '@angular/forms';

import { RateTypesInterface, GroupRateTypesInterface, RateDropDownInterface, CurrencyCodeInterface} from './rate.interface';

export class RateModel {
  rateForm: FormGroup;
  subscribeFlag: boolean;
  rateTypes: RateDropDownInterface[];
  groupRateTypes: RateDropDownInterface[];
  currencyCodes: CurrencyCodeInterface[];
  isMoreThanOneRate: boolean;
  isGroupRateTypeSum: boolean;
  selectedCurrency: string;
  rateTypeSuggestion: RateDropDownInterface[];
  currencySuggestion: CurrencyCodeInterface[];
  groupRateTypeSuggestion: RateDropDownInterface[];
  currecyCodeBasedOnSection: string;
  showMinusIcon: true;

  constructor() {
    this.subscribeFlag = true;
    this.isMoreThanOneRate = false;
    this.isGroupRateTypeSum = false;
  }
}
