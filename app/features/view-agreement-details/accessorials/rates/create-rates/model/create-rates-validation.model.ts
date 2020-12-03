import {
    ChargeCodeInterface, ChargeCodeResponseInterface
} from './create-rates.interface';

export class CreateRatesValidationModel {
    isSetUpFormValid: boolean;
    inValidEffDate: boolean;
    inValidExpDate: boolean;
    inValidDate: boolean;
    inCorrectEffDateFormat: boolean;
    inCorrectExpDateFormat: boolean;
    isSubscribeFlag: boolean;
    isDateChanged: boolean;
    validFields: boolean;
    isRefreshClicked: boolean;
    isDetailsSaved: boolean;
    isChangesSaving: boolean;
    checkBoxSelected: boolean;
    chargeTypeloading: boolean;
    agreementCurrency: string;
    invalidAgreementCurrency: boolean;
    routingUrl: string;
    effectiveDate: string;
    expirationDate: string;
    agreementEffectiveDate: string;
    agreementEndDate: string;
    errorText: string;
    effectiveMinDate: Date;
    expirationMinDate: Date;
    effectiveMaxDate: Date;
    expirationMaxDate: Date;
    disabledEffectiveDate: Date[];
    disabledExpirationDate: Date[];
    chargeType: ChargeCodeInterface[];
    chargeCodeResponse: ChargeCodeResponseInterface[];
    alternateChargeType: ChargeCodeInterface[];
    isCorrectEffDateFormat: boolean;
    isCorrectExpDateFormat: boolean;

    constructor() {
        this.chargeCodeResponse = [];
        this.invalidAgreementCurrency = false;
        this.agreementCurrency = '';
    }
}
