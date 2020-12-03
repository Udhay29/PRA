import { MenuItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import {
    ChargeCodeInterface, ChargeCodeResponseInterface, BuSoAssociation, CurrencyCodeInterface, AlternateChargeQuantityType,
    ErrorMessage, CheckBoxAttributesInterface
} from './create-standard-interface';
import {
    GroupNameInterface
} from '../../../standard-documentation/create-standard-documentation/model/create-standard-documenation.interface';

export class CreateStandardRatesModel {
    breadCrumbList: MenuItem[];
    ratesForm: FormGroup;
    setUpForm: FormGroup;
    setExpirationDate: string;
    inValidEffDate: boolean;
    inValidExpDate: boolean;
    isAddStairStepClicked: boolean;
    isAdditionalChargesClicked: boolean;
    addStairRateCancel: boolean;
    inValidDate: boolean;
    isCorrectEffDateFormat: boolean;
    isCorrectExpDateFormat: boolean;
    isSubscribeFlag: boolean;
    effectiveDate: string;
    expirationDate: string;
    effectiveMinDate: Date;
    expirationMinDate: Date;
    effectiveMaxDate: Date;
    expirationMaxDate: Date;
    disabledEffectiveDate: Date[];
    disabledExpirationDate: Date[];
    chargeTypeLoading: boolean;
    chargeType: ChargeCodeInterface[];
    alternateChargeType: ChargeCodeInterface[];
    alternateChargeTypeFiltered: ChargeCodeInterface[];
    chargeCodeBUCombination: ChargeCodeResponseInterface[];
    chargeTypeFiltered: ChargeCodeInterface[];
    buSoBasedOnChargeType: BuSoAssociation[];
    businessUnitAdded: boolean;
    serviceLevelAdded: boolean;
    operationalServiceAdded: boolean;
    currencyCodes: CurrencyCodeInterface[];
    currencyCodeFiltered: CurrencyCodeInterface[];
    alternateCharge: boolean;
    isAddRateClicked: boolean;
    isAlternateChargeChange: boolean;
    addRateCancel: boolean;
    alternateChargeQuantity: AlternateChargeQuantityType[];
    alternateChargeQuantityFiltered: AlternateChargeQuantityType[];
    noDocumentationFound: boolean;
    docIsLegalText: boolean;
    docIsInstructionalText: boolean;
    legalTextArea: string;
    instructionalTextArea: string;
    CheckBoxAttributes: CheckBoxAttributesInterface;
    isDetailsSaved: boolean;
    errorMsg: boolean;
    isShowSavePopup: boolean;
    waivedFlag: boolean;
    loading: boolean;
    inlineErrormessage: Array<ErrorMessage>;
    checkBoxSelected: boolean;
    rateCancel: boolean;
    missingInfo: string;
    routingUrl: string;
    isChangesSaving: boolean;
    rateNavigateCancel: boolean;
    superUserBackDateDays: number;
    superUserFutureDateDays: number;
    agreementEffectiveDate: string;
    agreementEndDate: string;
    buSo: number[];
    checkBoxValue: any;
    createRatesValidation: any;
    isSetUpFormValid: boolean;
    selectedBuSo: Array<number>;
    groupNameSuggestions: Array<GroupNameInterface>;
    groupNameValues: Array<GroupNameInterface>;
    dateFormatString: string;
    attachments: Array<object>;
    legalAttachments: Array<object>;
    instructionalAttachments: Array<object>;

    constructor() {
        this.dateFormatString = 'MM/DD/YYYY';
        this.checkBoxValue = [];
        this.selectedBuSo = [];
        this.isSetUpFormValid = false;
        this.isAddStairStepClicked = false;
        this.isAdditionalChargesClicked = false;
        this.setExpirationDate = '12-31-2099';
        this.isSubscribeFlag = true;
        this.alternateCharge = false;
        this.isAddRateClicked = false;
        this.noDocumentationFound = false;
        this.docIsLegalText = false;
        this.docIsInstructionalText = false;
        this.legalTextArea = '';
        this.instructionalTextArea = '';
        this.waivedFlag = true;
        this.loading = false;
        this.groupNameSuggestions = [];
        this.groupNameValues = [];
        this.checkBoxSelected = true;
        this.rateCancel = false;
        this.inlineErrormessage = [];
        this.attachments = [];
        this.legalAttachments = [];
        this.instructionalAttachments = [];
        this.missingInfo = 'Missing Required Information';
        this.buSo = [];
        this.CheckBoxAttributes = {
            waived: null,
            calculateRate: null,
            passThrough: null,
            rollUp: null
        };
        this.breadCrumbList = [{
            label: 'Pricing',
            routerLink: ['/dashboard']
        }, {
            label: 'Standards',
            routerLink: ['/standard']
        }, {
            label: 'Create Standard Accessorial Rate Setup'
        }];
    }
}
