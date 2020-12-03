import { TableColumnsInterface } from './standard-rate.interface';
export class StandardRateModel {
    tableColumns: Array<TableColumnsInterface>;
    serviceColumns: Array<TableColumnsInterface>;
    equipmentColumns: Array<TableColumnsInterface>;
    documentColumns: Array<TableColumnsInterface>;
    rateColumns: Array<TableColumnsInterface>;
    stepColumns: Array<TableColumnsInterface>;
    additionalCharges: Array<TableColumnsInterface>;
    alternateCharge: Array<TableColumnsInterface>;
    rateListValues: Array<object>;
    isSubscribeFlag: boolean;
    tableSize: number;
    pageStart: number;
    gridDataLength: number;
    sortColumns: object;
    loading: boolean;
    timeDelay: number;
    nestedColumns: object;
    dataFlag: boolean;
    rateName: string;
    nestedObject: object;
    rateTypeValue: string;
    roundingName: string;
    rateOperator: string;
    searchFlag: boolean;
    paginatorFlag: boolean;
    searchText: string;
    stairStepRateDtoText: string;

    constructor() {
        this.tableSize = 25;
        this.pageStart = 0;
        this.rateListValues = [];
        this.isSubscribeFlag = true;
        this.rateTypeValue = 'customerAccessorialRateCharges.accessorialRateTypeName.keyword';
        this.rateName = 'Rate Amount';
        this.roundingName = 'customerAccessorialRateCharges.accessorialRateRoundingTypeName.keyword';
        this.rateOperator = 'customerAccessorialRateCharges.rateOperator.keyword';
        this.stairStepRateDtoText = 'customerAccessorialRateStairStepCharge.customerAccessorialRateStairSteps';
        this.tableColumns = [
            { label: 'Group Name', field: 'accessorialGroupTypeName', isArray: false, isSubcolumn: false, isNotFirst: false },
            { label: 'Charge Type', field: 'chargeType', isArray: false, isSubcolumn: false, isNotFirst: false },
            { label: 'Business Unit and Service Offering', field: 'businessService', isArray: true, isSubcolumn: false, isNotFirst: false },
            { label: 'Carrier (Code)', field: 'carrier', isArray: true, isSubcolumn: false, isNotFirst: false },
            { label: 'Service Level', field: 'serviceLevel', isArray: true, isSubcolumn: true, isNotFirst: false },
            { label: 'Requested Service', field: 'requestedService', isSubcolumn: true, isNotFirst: true, isArray: true },
            { label: 'Equipment Category', field: 'equipmentCategory', isSubcolumn: true, isNotFirst: false, isArray: false },
            { label: 'Equipment Type', field: 'equipmentType', isSubcolumn: true, isNotFirst: true, isArray: false },
            { label: 'Equipment Length', field: 'equipmentLength', isSubcolumn: true, isNotFirst: true, isArray: false },
            { label: 'Customer\'s Charge Name', field: 'customerName', isSubcolumn: false, isNotFirst: false, isArray: false },
            { label: 'Currency', field: 'currency', isSubcolumn: false, isNotFirst: false, isArray: false },
            { label: 'Waived', field: 'waived', isSubcolumn: false, isNotFirst: false, isArray: false },
            { label: 'Calculate Rate Manually', field: 'calculateRate', isSubcolumn: false, isNotFirst: false, isArray: false },
            { label: 'Pass-Through', field: 'passThrough', isSubcolumn: false, isNotFirst: false, isArray: false },
            { label: 'Rate Setup Status', field: 'rateSetup', isSubcolumn: false, isNotFirst: false, isArray: false },
            { label: 'Effective Date', field: 'effectiveDate', isSubcolumn: false, isNotFirst: false, isArray: false },
            { label: 'Expiration Date', field: 'expirationDate', isSubcolumn: false, isNotFirst: false, isArray: false },
            { label: 'Creation Date', field: 'creationDate', isSubcolumn: false, isNotFirst: false, isArray: false },
            { label: 'Created By', field: 'createdBy', isSubcolumn: false, isNotFirst: false, isArray: false },
            { label: 'Last Updated Date', field: 'lastUpdatedDate', isSubcolumn: false, isNotFirst: false, isArray: false },
            { label: 'Last Updated By', field: 'lastUpdatedBy', isSubcolumn: false, isNotFirst: false, isArray: false },
            { label: 'Legal', field: 'legal', isSubcolumn: true, isNotFirst: false, isArray: false },
            { label: 'Instructional', field: 'instructional', isSubcolumn: true, isNotFirst: true, isArray: false },
            { label: 'Attachments', field: 'attachments', isSubcolumn: true, isNotFirst: true, isArray: true },
            { label: 'Has Attachment', field: 'hasAttachment', isSubcolumn: true, isNotFirst: true, isArray: false },
            { label: 'Rate Type', field: 'rateType', isSubcolumn: true, isNotFirst: false, isArray: true },
            { label: this.rateName, field: 'rateAmount', isSubcolumn: true, isNotFirst: true, isArray: true },
            { label: 'Rounding', field: 'rounding', isSubcolumn: true, isNotFirst: true, isArray: true },
            { label: 'Minimum Amount', field: 'minimumAmount', isSubcolumn: true, isNotFirst: true, isArray: true },
            { label: 'Maximum Amount', field: 'maximumAmount', isSubcolumn: true, isNotFirst: true, isArray: true },
            { label: 'Rate Operator', field: 'rateOperator', isSubcolumn: true, isNotFirst: true, isArray: true },
            { label: 'Has Itemized Rates', field: 'itemizedRates', isSubcolumn: true, isNotFirst: true, isArray: true },
            { label: 'Rate Type', field: 'stepRateType', isSubcolumn: true, isNotFirst: false, isArray: false },
            { label: this.rateName, field: 'stepRateAmount', isSubcolumn: true, isNotFirst: true, isArray: true },
            { label: 'From Quantity', field: 'fromQuantity', isSubcolumn: true, isNotFirst: true, isArray: true },
            { label: 'To Quantity', field: 'toQuantity', isSubcolumn: true, isNotFirst: true, isArray: true },
            { label: 'Rounding', field: 'stepRounding', isSubcolumn: true, isNotFirst: true, isArray: false },
            { label: 'Minimum Amount', field: 'stepMinimunAmount', isSubcolumn: true, isNotFirst: true, isArray: false },
            { label: 'Maximum Amount', field: 'stepMaximunAmount', isSubcolumn: true, isNotFirst: true, isArray: false },
            { label: 'Maximum Applied When', field: 'maximumApplied', isSubcolumn: true, isNotFirst: true, isArray: false },
            { label: 'Has Itemized Rates', field: 'stepItemizedRates', isSubcolumn: true, isNotFirst: true, isArray: false },
            { label: 'Charge Type', field: 'additionalCharge', isSubcolumn: true, isNotFirst: false, isArray: true },
            { label: 'Rate Type', field: 'additionalRateType', isSubcolumn: true, isNotFirst: true, isArray: true },
            { label: this.rateName, field: 'additionalRateAmount', isSubcolumn: true, isNotFirst: true, isArray: true },
            { label: 'Quantity', field: 'customerAlternateChargeThresholdQuantity', isSubcolumn: true, isNotFirst: false, isArray: true },
            {
                label: 'Quantity Type', field: 'accessorialRateAlternateChargeQuantityTypeName',
                isSubcolumn: true, isNotFirst: true, isArray: true
            },
            { label: 'Alternate Charge Type', field: 'alternateChargeTypeName', isSubcolumn: true, isNotFirst: true, isArray: true }
        ];
        this.nestedColumns = {
            'contract': 'customerAccessorialAccountDTOs',
            'section': 'customerAccessorialAccountDTOs',
            'businessService': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings',
            'carrier': 'customerAccessorialCarriers',
            'serviceLevel': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings',
            'requestedService': 'customerAccessorialRequestServices',
            'rateType': 'customerAccessorialRateCharges',
            'rateAmount': 'customerAccessorialRateCharges',
            'rounding': 'customerAccessorialRateCharges',
            'minimumAmount': 'customerAccessorialRateCharges',
            'maximumAmount': 'customerAccessorialRateCharges',
            'rateOperator': 'customerAccessorialRateCharges',
            'additionalCharge': 'customerAccessorialRateAdditionalCharges',
            'additionalRateType': 'customerAccessorialRateAdditionalCharges',
            'additionalRateAmount': 'customerAccessorialRateAdditionalCharges',
            'stepRateType': 'customerAccessorialRateStairStepCharge',
            'stepRounding': 'customerAccessorialRateStairStepCharge',
            'stepMinimunAmount': 'customerAccessorialRateStairStepCharge',
            'stepMaximunAmount': 'customerAccessorialRateStairStepCharge',
            'maximumApplied': 'customerAccessorialRateStairStepCharge',
            'fromQuantity': this.stairStepRateDtoText,
            'toQuantity': this.stairStepRateDtoText,
            'stepRateAmount': this.stairStepRateDtoText,
            'customerAlternateChargeThresholdQuantity': 'customerAccessorialRateAlternateCharge',
            'accessorialRateAlternateChargeQuantityTypeName': 'customerAccessorialRateAlternateCharge',
            'alternateChargeTypeName': 'customerAccessorialRateAlternateCharge',
            'billToAccounts': 'customerAccessorialAccountDTOs'
        };
        this.nestedObject = {
            'rateType': this.rateTypeValue,
            'rateAmount': 'customerAccessorialRateCharges.rateAmount.keyword',
            'rounding': this.roundingName,
            'minimumAmount': 'customerAccessorialRateCharges.minimumAmount.keyword',
            'maximumAmount': 'customerAccessorialRateCharges.maximumAmount.keyword',
            'rateOperator': this.rateOperator,
            'businessService': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnitDisplayName.keyword',
            'carrier': 'customerAccessorialCarriers.carrierDisplayName.keyword',
        };
        this.sortColumns = {
            'accessorialGroupTypeName': 'accessorialGroupTypeName.keyword',
            'chargeType': 'chargeTypeName.keyword',
            'contract': 'customerAccessorialAccountDTOs.customerAgreementContractName.raw',
            'section': 'customerAccessorialAccountDTOs.customerAgreementContractSectionName.raw',
            'businessService': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnitDisplayName.keyword',
            'carrier': 'customerAccessorialCarriers.carrierDisplayName.keyword',
            'customerName': 'customerChargeName.keyword',
            'currency': 'currencyCode.keyword',
            'serviceLevel': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings.serviceLevel.keyword',
            'requestedService': 'customerAccessorialRequestServices.requestedServiceTypeCode.keyword',
            'equipmentCategory': 'equipmentClassificationCode.keyword',
            'equipmentType': 'equipmentClassificationTypeAssociationCode.keyword',
            'equipmentLength': 'equipmentLengthDescription.keyword',
            'legal': 'documentLegalDescription.keyword',
            'instructional': 'documentInstructionalDescription.keyword',
            'attachments': 'documentFileNames.keyword',
            'hasAttachment': 'hasAttachment.keyword',
            'rateType': this.rateTypeValue,
            'rateAmount': 'customerAccessorialRateCharges.rateAmount',
            'rounding': this.roundingName,
            'minimumAmount': 'customerAccessorialRateCharges.minimumAmount',
            'maximumAmount': 'customerAccessorialRateCharges.maximumAmount',
            'rateOperator': this.rateOperator,
            'itemizedRates': 'rateItemizeIndicator.keyword',
            'stepRateType': 'customerAccessorialRateStairStepCharge.accessorialRateTypeName.keyword',
            'stepRounding': 'customerAccessorialRateStairStepCharge.accessorialRateRoundingTypeName.keyword',
            'maximumApplied': 'customerAccessorialRateStairStepCharge.accessorialMaximumRateApplyTypeName.keyword',
            'stepMinimunAmount': 'customerAccessorialRateStairStepCharge.minimumAmount',
            'stepMaximunAmount': 'customerAccessorialRateStairStepCharge.maximumAmount',
            'fromQuantity': 'customerAccessorialRateStairStepCharge.customerAccessorialRateStairSteps.fromQuantity',
            'toQuantity': 'customerAccessorialRateStairStepCharge.customerAccessorialRateStairSteps.toQuantity',
            'stepRateAmount': 'customerAccessorialRateStairStepCharge.customerAccessorialRateStairSteps.stairStepRateAmount',
            'stepItemizedRates': 'rateItemizeIndicator.keyword',
            'additionalCharge': 'customerAccessorialRateAdditionalCharges.additionalChargeTypeName.keyword',
            'additionalRateType': 'customerAccessorialRateAdditionalCharges.accessorialRateTypeName.keyword',
            'additionalRateAmount': 'customerAccessorialRateAdditionalCharges.additionalRateAmount',
            'customerAlternateChargeThresholdQuantity':
                'customerAccessorialRateAlternateCharge.customerAlternateChargeThresholdQuantity.keyword',
            'accessorialRateAlternateChargeQuantityTypeName':
                'customerAccessorialRateAlternateCharge.accessorialRateAlternateChargeQuantityTypeName.keyword',
            'alternateChargeTypeName': 'customerAccessorialRateAlternateCharge.alternateChargeTypeName.keyword',
            'billToAccounts': 'customerAccessorialAccountDTOs.customerAgreementContractSectionAccountName.keyword',
            'createdDate': 'createdDate',
            'createdBy': 'createdBy.keyword',
            'lastUpdatedDate': 'lastUpdatedDate',
            'lastUpdatedBy': 'lastUpdatedBy.keyword',
            'equipmentLengthDescription': 'equipmentLengthDescription.keyword',
            'effectiveDate': 'effectiveDate',
            'expirationDate': 'expirationDate',
            'waived': 'waived.keyword',
            'calculateRate': 'calculateRateManually.keyword',
            'passThrough': 'passThrough.keyword',
            'rateSetup': 'rateSetupStatus.keyword'
        };
    }
}
