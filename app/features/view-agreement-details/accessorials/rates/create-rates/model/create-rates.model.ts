import { FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import {
    AgreementDetailsInterface,
    DocumentationLevelInterface
} from '../../../documentation/create-documentation/model/create-documentation.interface';
import { ContractTypesItemInterface } from '../../../shared/contract-list/model/contract-list.interface';
import {
    EditAdditionalChargeResponse
} from './../../../../../shared/accessorials/additional-charges/additional-charges/model/additional-charges-interface';
import { SectionsGridResponseInterface } from '../../../shared/sections/model/sections-interface';
import {
    ChargeCodeInterface, ChargeCodeResponseInterface, CheckBoxAttributesInterface, CurrencyCodeInterface, AlternateChargeQuantityType,
    ErrorMessage, CreateDocumentationInterface, AddRateEditResponse, EditBillToValueInterface
} from './create-rates.interface';
import { BuSoAssociation } from '../../../shared/models/optional-attributes.interface';
import { CreateRatesValidationModel } from './create-rates-validation.model';


export class CreateRatesModel {
    createRatesValidation: CreateRatesValidationModel;
    loading: boolean;
    isSetUpFormValid: boolean;
    rateCancel: boolean;
    isShowSavePopup: boolean;
    contractChecked: boolean;
    sectionChecked: boolean;
    waivedFlag: boolean;
    alternateCharge: boolean;
    isAlternateChargeChange: boolean;
    removeDocumentation: boolean;
    isCancelClicked: boolean;
    agreementID: string;
    agreementURL: string;
    createDocumentationText: CreateDocumentationInterface;
    ratesDocumentLevel: string;
    agreementDetails: AgreementDetailsInterface;
    documentationLevel: DocumentationLevelInterface[];
    selectedContractValue: ContractTypesItemInterface[];
    selectedSectionValue: SectionsGridResponseInterface[];
    chargeTypeFiltered: ChargeCodeInterface[];
    alternateChargeTypeFiltered: ChargeCodeInterface[];
    currencyCodes: CurrencyCodeInterface[];
    currencyCodeFiltered: CurrencyCodeInterface[];
    alternateChargeQuantity: AlternateChargeQuantityType[];
    alternateChargeQuantityFiltered: AlternateChargeQuantityType[];
    breadCrumbList: MenuItem[];
    ratesForm: FormGroup;
    documentationForm: FormGroup;
    currencyValue: string;
    isPopupYesClicked: boolean;
    isAddRateClicked: boolean;
    isAdditionalChargesClicked: boolean;
    addRateCancel: boolean;
    isAddStairStepClicked: boolean;
    addStairRateCancel: boolean;
    inlineErrormessage: Array<ErrorMessage>;
    errorMsg: boolean;
    rateNavigateCancel: boolean;
    buSoBasedOnChargeType: BuSoAssociation[];
    CheckBoxAttributes: CheckBoxAttributesInterface;
    superUserBackDateDays: number;
    superUserFutureDateDays: number;
    buSo: number[];
    selectedBuSo: Array<number>;
    editContractValues: Array<ContractTypesItemInterface>;
    editSectionValues: SectionsGridResponseInterface[];
    editBillToValues: EditBillToValueInterface[];
    addRateEditResponse: AddRateEditResponse[];
    editAdditionalChargeResponse: EditAdditionalChargeResponse[];
    isEditAccessorialRateClicked: boolean;
    editAccessorialWholeResponse;
    refreshDocumentResponse;
    checkBoxValue: any;
    isStairStepsPresent: boolean;
    rateConfigurationId: number;
    isEditFlagEnabled: boolean;
    editRequestedServiceResponse: object[];
    currencyAdded: boolean;
    saveCloseDropDown: Array<MenuItem>;
    isSaveCreateNewClicked: boolean;
    isSaveCreateCopyClicked: boolean;
    addStairStepRateEditResponse;
    popUpCoseFlag: boolean;
    isCorrectEffDateFormat: boolean;
    isCorrectExpDateFormat: boolean;

    constructor(agreementID: string) {
        this.createRatesValidation = new CreateRatesValidationModel();
        this.waivedFlag = true;
        this.checkBoxValue = [];
        this.buSo = [];
        this.selectedBuSo = [];
        this.alternateChargeQuantity = [];
        this.alternateChargeQuantityFiltered = [];
        this.createRatesValidation.alternateChargeType = [];
        this.alternateChargeTypeFiltered = [];
        this.setInitialValues(agreementID);
        this.createRatesValidation.isSubscribeFlag = true;
        this.createRatesValidation.checkBoxSelected = true;
        this.createRatesValidation.errorText = 'Missing Required Information';
        this.isAdditionalChargesClicked = false;
        this.editSectionValues = [];
        this.createDocumentationText = {
            documentationContent:
                'No Documentation was found for the provided setup.Create the proper documentation before creating this rate setup.',
            documentationText: 'Exit the rate setup without saving and create documentation.',
            cancelText: 'Return to the rate setup and continue making changes.'
        };
        this.CheckBoxAttributes = {
            waived: null,
            calculateRate: null,
            passThrough: null,
            rollUp: null
        };
        this.documentationLevel = [{
            label: 'Agreement',
            value: 'Agreement'
        },
        {
            label: 'Contract',
            value: 'contract'
        },
        {
            label: 'Section',
            value: 'section'
        }];
        this.isAddRateClicked = false;
        this.isAddStairStepClicked = false;
        this.editContractValues = [];
        this.saveCloseDropDown = [];
    }
    setInitialValues(agreementID: string) {
        this.breadCrumbList = [{
            label: 'Pricing',
            routerLink: ['/dashboard']
        }, {
            label: 'Search Agreements',
            routerLink: ['/searchagreement']
        }, {
            label: 'Agreement Details',
            routerLink: ['/viewagreement'],
            queryParams: { id: agreementID }
        }, {
            label: 'Create Accessorial Rate Setup'
        }];
    }
}
