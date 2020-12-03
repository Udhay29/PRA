import { MenuItem } from 'primeng/api';

import {
    AgreementDetailsInterface, CustomerAccessorialRateAdditionalChargeDTO,
    CustomerAccessorialRateAlternateChargeViewDTO, CustomerAccessorialRateChargeDTO
} from './rates-detailed-view-interface';

export class RatesDetailedViewModel {
    breadCrumbList: MenuItem[];
    agreementDetails: AgreementDetailsInterface;
    overflowMenuList: MenuItem[];
    ratesDocumentLevel: string;
    ratesDetailedViewFlag: boolean;
    ratesDetailedViewResponse: any;
    subscriberFlag: boolean;
    ratesTableColumns: Array<object>;
    ratesTableData: CustomerAccessorialRateChargeDTO[];
    additionalChargesColumns: Array<object>;
    additionalChargesTableData: CustomerAccessorialRateAdditionalChargeDTO[];
    alternateChargesTableData: CustomerAccessorialRateAlternateChargeViewDTO[];
    businessUnitServiceOffering: string;
    carriers: string;
    serviceLevelList: string;
    reqService: string;
    buSoForDocument: any;
    rateConfigurationId: number;
    isLoading: boolean;
    rateEffectiveDate: string;
    rateExpirationDate: string;
    legalText: string;
    instructionalText: string;
    refreshDocumentResponse;
    serviceDetails: Array<object>;
    editRequestedService: Array<object>;
    attachments: Array<object>;

    constructor(agreementID) {
        this.setInitialValues(agreementID);
        this.attachments = [];
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
            label: 'View Rate Setup'
        }];
        this.overflowMenuList = [];
        this.ratesDocumentLevel = '';
        this.ratesDetailedViewFlag = true;
        this.subscriberFlag = true;
        this.isLoading = false;
        this.ratesTableColumns = [
            { 'name': 'Rate Type', 'property': 'accessorialRateTypeName' },
            { 'name': 'Rate Amount', 'property': 'rateAmount' },
            { 'name': 'Rounding', 'property': 'accessorialRateRoundingTypeName' },
            { 'name': 'Minimum Amount', 'property': 'minimumAmount' },
            { 'name': 'Maximum Amount', 'property': 'maximumAmount' },
        ];
        this.additionalChargesColumns = [
            { 'name': 'Charge Type', 'property': 'additionalChargeTypeNameWithCode' },
            { 'name': 'Rate Type', 'property': 'accessorialRateTypeName' },
            { 'name': 'Rate Amount', 'property': 'additionalRateAmount' }
        ];
        this.ratesTableData = [];
        this.additionalChargesTableData = [];
        this.alternateChargesTableData = [];
        this.buSoForDocument = [];
        this.serviceDetails = [];
        this.carriers = '';
        this.ratesDetailedViewResponse = {
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
            'customerAccessorialRateChargeDTOs': null,
            'customerAccessorialRateAlternateChargeViewDTO': null,
            'customerAccessorialRateStairStepChargeDTO': null,
            'customerAccessorialRateAdditionalChargeDTOs': null
        };
    }
}
