import { MenuItem } from 'primeng/api';
import {
    AgreementDetailsInterface, CustomerAccessorialRuleAdditionalChargeDTO,
    CustomerAccessorialRuleAlternateChargeViewDTO, CustomerAccessorialRuleChargeDTO, RefreshDataDTO, Documentation
} from './rules-detailed-view-interface';

export class RulesDetailedViewModel {

    breadCrumbList: MenuItem[];
    agreementDetails: AgreementDetailsInterface;
    overflowMenuList: MenuItem[];
    rulesDocumentLevel: string;
    rulesDetailedViewFlag: boolean;
    rulesDetailedViewResponse: any;
    subscriberFlag: boolean;
    rulesTableColumns: Array<object>;
    rulesTableData: CustomerAccessorialRuleChargeDTO[];
    additionalChargesColumns: Array<object>;
    additionalChargesTableData: CustomerAccessorialRuleAdditionalChargeDTO[];
    alternateChargesTableData: CustomerAccessorialRuleAlternateChargeViewDTO[];
    documentationTypeId: number;
    documentationType: string;
    businessUnitServiceOffering: string;
    carriers: string;
    serviceLevelList: string;
    reqService: string;
    buSoForDocument: any;
    ruleConfigurationId: number;
    isLoading: boolean;
    ruleEffectiveDate: string;
    ruleExpirationDate: string;
    legalText: string;
    instructionalText: string;
    refreshDocumentResponse;
    refreshDocumentResponseData: Documentation[];
    serviceDetails: Array<object>;
    editRequestedService: Array<object>;
    attachmentAddedOnDate: Array<string>;
    createTimestamp: Array<string>;
    documentConfigurationId: number;
    lastUpdateTimestamp: Array<string>;
    dateFormat: string;
    ruleDateFormat: string;
    attachments: Array<object>;
    documentation: Documentation;

    constructor(agreementID) {
        this.setInitialValues(agreementID);
        this.editRequestedService = [];
        this.documentation = {
            docIsLegalText: false,
            docIsInstructionalText: false,
            isRefreshClicked: false,
            isValidFormFields: false,
            noDocumentationFound: false,
            instructionalTextArea: '',
            legalTextArea: '',
            documentTypeID: 0,
            isEditRateClicked: false,
            legalAttachments: [],
            instructionalAttachments: [],
            attachments: [],
            legalStartDate: '',
            legalEndDate: '',
            instructionStartDate: '',
            instructionEndDate: ''
        };
        this.refreshDocumentResponseData = [];
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
            label: 'View Rule'
        }];
        this.overflowMenuList = [];
        this.rulesDocumentLevel = '';
        this.rulesDetailedViewFlag = true;
        this.subscriberFlag = true;
        this.isLoading = false;
        this.rulesTableColumns = [
            { 'name': 'Rate Type', 'property': 'accessorialRateTypeName' },
            { 'name': 'Rate Amount', 'property': 'rateAmount' },
            { 'name': 'Rounding', 'property': 'accessorialRateRoundingTypeName' },
            { 'name': 'Minimum Amount', 'property': 'minimumAmount' },
            { 'name': 'Maximum Amount', 'property': 'maximumAmount' },
        ];
        this.additionalChargesColumns = [
            { 'name': 'Charge Type', 'property': 'additionalChargeTypeNameWithCode' },
            { 'name': 'Rate Type', 'property': 'accessorialRateTypeName' },
            { 'name': 'Rate Amount', 'property': 'rateAmount' }
        ];
        this.rulesTableData = [];
        this.additionalChargesTableData = [];
        this.alternateChargesTableData = [];
        this.buSoForDocument = [];
        this.serviceDetails = [];
        this.carriers = '';
        this.rulesDetailedViewResponse = {
            'effectiveDate': null,
            'expirationDate': null,
            'customerAgreementId': null,
            'chargeTypeId': null,
            'chargeTypeName': null,
            'customerChargeName': null,
            'equipmentCategoryCode': null,
            'equipmentTypeCode': null,
            'equipmentLengthId': null,
            'equipmentTypeId': null,
            'level': null,
            'contracts': null,
            'customerAccessorialAccountDTOs': null,
            'businessUnitServiceOfferingDTOs': null,
            'requestServiceDTOs': null,
            'carrierDTOs': null,
            'customerAccessorialRateConfigurationId': null,
            'currencyCode': null,
            'groupRateItemizeIndicator': null,
            'groupRateTypeId': null,
            'equipmentLengthDescription': null,
            'chargeTypeCode': null,
            'createdDate': null,
            'createdBy': null,
            'lastUpdatedDate': null,
            'lastUpdatedBy': null,
            'customerAccessorialRateCriteriaDTOs': null,
            'customerAccessorialRuleChargeDTOs': null,
            'customerAccessorialRuleAlternateChargeViewDTO': null,
            'customerAccessorialRateStairStepChargeDTO': null,
            'customerAccessorialRuleAdditionalChargeDTOs': null,
            'createTimestamp': null,
            'lastUpdateTimestamp': null
        };
        this.dateFormat = 'MM/DD/YYYY';
        this.ruleDateFormat = 'MM/dd/yyyy HH:mm';
    }
}
