import { FormGroup } from '@angular/forms';
import { DrayGroupValidationModel } from './dray-group-validation.model';
import { CountryInterface, RateScopeInterface } from './dray-group.interface';

export class DrayGroupModel {
    drayGroupValidation: DrayGroupValidationModel;
    drayGroupForm: FormGroup;
    isPageLoading: boolean;
    isShowPopup: boolean;
    superUserBackDateDays: number;
    superUserFutureDateDays: number;
    countries: CountryInterface[];
    isSubscribe: boolean;
    countryFiltered: CountryInterface[];
    defaultExpirationDate: string;
    rateScope: RateScopeInterface[];
    scopeObj: CountryInterface[];
    saveSuccessMessage: string;
    mandatoryFieldsMsg: string;


    constructor() {
        this.drayGroupValidation = new DrayGroupValidationModel();
        this.isPageLoading = false;
        this.isShowPopup = false;
        this.drayGroupValidation.isSubscribeFlag = true;
        this.isSubscribe = true;
        this.defaultExpirationDate = '12/31/2099';
        this.saveSuccessMessage = 'You have successfully created new dray group';
        this.mandatoryFieldsMsg = 'Provide the required information in the highlighted fields and submit the form again';
    }
}
