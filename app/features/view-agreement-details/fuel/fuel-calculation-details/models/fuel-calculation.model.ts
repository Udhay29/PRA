import { FormGroup } from '@angular/forms';
import { Message } from 'primeng/components/common/message';
import {
    DropdownList,
    RoundDigitDropdown, ReqParam, FuelCalculationDateTypesDropdown,
    ChargeTypeDropdown, FuelCalculationTypeDropdown, FuelRateTypeDropdown, FuelTypeDropdown,
    FuelDiscountTypesDropdown, CurrencyDropdownList, Column,
    FlatConfigurationDetails, FormulaConfigurationDetails,
    DistanceHourRoundingDropdown, FuelCalculationDropdown, ReeferVolumeDropdown, UploadDataList,
    ReeferDistanceDropdown, ReeferConfigurationDetails,
    DistancePerFuelQuantityConfigurationDetails, CustomerAgreementDetail, Incrementaldetails, ErrorMessage
} from './fuel-calculation.interface';

export class FuelCalculationModel {
    FuelCalculationForm: FormGroup;
    FlatDetailsForm: FormGroup;
    FormulaDetailsForm: FormGroup;
    ReferDetailsForm: FormGroup;
    DistanceDetailsForm: FormGroup;
    formValidateName: FormGroup;
    enteredValue: string;

    fuelcalculationmethodList: DropdownList[];
    fuelmethodSelectButton: CurrencyDropdownList[];
    showConfirmationPopup: boolean;
    selectedFuelCalculationType: string;
    numericCheck: boolean;
    subscriberFlag: boolean;
    borderFlag: boolean;
    fuelProgramId: number;
    isPageLoading: boolean;
    chargeTypeLoading: boolean;
    chargeList: ChargeTypeDropdown[];
    chargeTypeList: ChargeTypeDropdown[];
    fuelCalculationList: FuelCalculationDateTypesDropdown[];
    roundingdigitList: RoundDigitDropdown[];
    calculatetypeList: FuelCalculationTypeDropdown[];
    ratetypeList: FuelRateTypeDropdown[];
    fueltypeList: FuelTypeDropdown[];
    draydiscountList: FuelDiscountTypesDropdown[];
    currencyCodeList: CurrencyDropdownList[];
    flatCalculationData: FlatConfigurationDetails;
    formulaCalculationData: FormulaConfigurationDetails;
    reeferCalculationData: ReeferConfigurationDetails;
    distanceQtyCalculationData: DistancePerFuelQuantityConfigurationDetails;
    referDistanceList: ReeferDistanceDropdown[];
    referFuelUnitList: ReeferVolumeDropdown[];
    fuelcalculationDropdownList: FuelCalculationDropdown[];
    referDistanceRoundingList: DistanceHourRoundingDropdown[];
    referServiceHourRoundingList: DistanceHourRoundingDropdown[];
    selectedFormName: string;
    capValidationFlag: boolean;
    fuelCalculationMandatoryFields: string[];
    formulaDetailsMandatoryFields: string[];
    referDetailsMandatoryFields: string[];
    distanceDetailsMandatoryFields: string[];
    buttonNavigate: string;
    showDontSavePopup: boolean;
    fuelCalculationDetailsReqParam: ReqParam;
    defaultFieldValues: object;
    defaultValue: object;
    uploadFlag: boolean;
    loaderFlag: boolean;
    tableFlag: boolean;
    uploadPopup: boolean;
    decimals: number;
    gap: number[];
    defaultFields: string[];
    referDistanceOptionalText: string;
    referFuelOptionalText: string;
    mpgDistanceOptionalText: string;
    agreementId: number;
    flatFuelName: string;
    formulaFuelName: string;
    refrigeratedFuelName: string;
    distanceFuelName: string;
    fileName: string;
    fileExt: string;
    uploadForm: string;
    allowedAttahcmentFormat: string[];
    byteArray: Uint8Array;
    uploadTablearray: UploadDataList[];
    selectedItemList: UploadDataList[];
    editTableColumns: Column[];
    customerAgreementDetails: CustomerAgreementDetail[];
    overlaps: number[];
    duplicateCharges: number[];
    incrementalErrorMsg: Message[];
    uploadreqParam: Incrementaldetails[];
    inlineError: boolean;
    isReplace: boolean;
    subscriberUploadFlag: boolean;
    gaps: number[];
    invalidRanges: number[];
    invalidCharges: number[];
    emptyBeginAmount: number[];
    emptyEndAmount: number[];
    emptyChargeAmount: number[];
    inlineErrormessage: Array<ErrorMessage>;
    validationFlag: boolean;
    heightCheckFlag: boolean;
    selectedRowIndex: number[];
    checkMinArray: number[];
    minArrayVal: number;
    capvalueFlag: boolean;
    fuelProgramVersionId: number;
    sectionValidFlag: boolean;
    currencyFetchFlag: boolean;
    ischargeTypeChange: boolean;
    errFlag: boolean;
    populateFlag: boolean;
    headerCheck: number;
    isShowRollUp: boolean;
    editValue: any;

    constructor() {
        this.showConfirmationPopup = false;
        this.validationFlag = true;
        this.sectionValidFlag = false;
        this.heightCheckFlag = false;
        this.currencyFetchFlag = true;
        this.populateFlag = true;
        this.inlineErrormessage = [];
        this.selectedFuelCalculationType = 'Formula';
        this.selectedFormName = 'Formula';
        this.fileName = '';
        this.fileExt = '';
        this.numericCheck = false;
        this.showDontSavePopup = false;
        this.loaderFlag = false;
        this.borderFlag = false;
        this.tableFlag = false;
        this.subscriberFlag = true;
        this.subscriberUploadFlag = true;
        this.uploadFlag = true;
        this.fuelProgramId = null;
        this.isPageLoading = false;
        this.chargeTypeLoading = false;
        this.capValidationFlag = false;
        this.uploadPopup = false;
        this.errFlag = false;
        this.currencyCodeList = [];
        this.referDistanceOptionalText = 'Miles';
        this.referFuelOptionalText = 'Gallons';
        this.mpgDistanceOptionalText = 'Miles';
        this.ischargeTypeChange = false;
        this.fuelCalculationMandatoryFields = ['fuelcalculationdatetype', 'chargetype', 'roundingdigit', 'calculationtype',
            'ratetype', 'fueltype', 'currency', 'rollup'];

        this.formulaDetailsMandatoryFields = ['fuelsurcharge', 'incrementalcharge', 'implementationprice', 'incrementalinterval', 'cap'];
        this.referDetailsMandatoryFields = ['distanceunit', 'fuelqtyunit', 'implementprice', 'burnrate',
            'distancehour', 'distancerounding'];
        this.distanceDetailsMandatoryFields = ['distance', 'fuelqty', 'distanceper', 'incrementalprice'];
        this.flatFuelName = 'Flat';
        this.formulaFuelName = 'Formula';
        this.refrigeratedFuelName = 'Refrigerated';
        this.distanceFuelName = 'Distance Per Fuel Quantity';
        this.uploadForm = 'Increment';
        this.allowedAttahcmentFormat = ['xls', 'xlsx', 'csv'];
        this.editTableColumns = [
            { label: 'Begin Fuel Surcharge Amount', key: 'fuelBeginAmount' },
            { label: 'End Fuel Surcharge Amount', key: 'fuelEndAmount' },
            { label: 'Charge Amount', key: 'fuelSurchargeAmount' }];

        this.fuelCalculationList = [];
        this.chargeList = [];
        this.chargeTypeList = [];
        this.roundingdigitList = [];
        this.calculatetypeList = [];
        this.ratetypeList = [];
        this.fueltypeList = [];
        this.selectedRowIndex = [];
        this.draydiscountList = [];
        this.fuelcalculationmethodList = [];
        this.fuelmethodSelectButton = [];
        this.referDistanceRoundingList = [];
        this.referServiceHourRoundingList = [];
        this.referDistanceList = [];
        this.referFuelUnitList = [];
        this.selectedItemList = [];
        this.uploadTablearray = [];
        this.uploadreqParam = [];
        this.customerAgreementDetails = [];
        this.flatCalculationData = {
            'flatConfigurationID': null,
            'fuelSurchargeAmount': null
        };
        this.formulaCalculationData = {
            'formulaConfigurationID': null,
            'fuelSurchargeFactorAmount': null,
            'implementationAmount': null,
            'capAmount': null,
            'incrementChargeAmount': null,
            'incrementIntervalAmount': null
        };
        this.reeferCalculationData = {
            'reeferConfigurationID': null,
            'implementationAmount': null,
            'burnRatePerHourQuantity': null,
            'unitOfVolumeMeasurement': null,
            'distancePerHourQuantity': null,
            'unitOfLengthMeasurement': null,
            'travelTimeHourRoundingType': null,
            'serviceHourAddonQuantity': null,
            'serviceHourRoundingType': null,
            'serviceHourAddonDistanceQuantity': null,
            'loadUnloadHourQuantity': null
        };

        this.distanceQtyCalculationData = {
            'distancePerFuelQuantityConfigurationID': null,
            'implementationAmount': null,
            'distancePerFuelQuantity': null,
            'unitOfLengthMeasurement': null,
            'unitOfVolumeMeasurement': null,
            'addonAmount': null
        };
        this.fuelCalculationDetailsReqParam = {
            fuelCalculationID: null,
            fuelCurrencyCode: null,
            chargeType: null,
            fuelCalculationType: null,
            fuelRateType: null,
            fuelCalculationDateType: null,
            fuelRoundingDecimal: null,
            fuelType: null,
            fuelDiscountType: null,
            fuelCalculationMethodType: null,
            rollUpIndicator: '',
            flatConfiguration: null,
            formulaConfiguration: null,
            reeferConfiguration: null,
            fuelIncrementalPriceDTOs: null,
            distancePerFuelQuantityConfiguration: null,
        };

        this.defaultFields = ['chargetype'];
        this.defaultFieldValues = {
            'chargetype': {
                'label': 'Suppl INC (SUPINC)',
                'value': {
                    'chargeTypeName': 'Suppl INC',
                    'chargeTypeCode': 'SUPINC',
                    'chargeTypeID': 730
                },
            },

        };
        this.overlaps = [];
        this.duplicateCharges = [];
        this.incrementalErrorMsg = [];
        this.inlineError = false;
        this.isReplace = false;
        this.gaps = [];
        this.invalidRanges = [];
        this.invalidCharges = [];
        this.emptyBeginAmount = [];
        this.emptyEndAmount = [];
        this.emptyChargeAmount = [];
        this.checkMinArray = [];
    }
}
