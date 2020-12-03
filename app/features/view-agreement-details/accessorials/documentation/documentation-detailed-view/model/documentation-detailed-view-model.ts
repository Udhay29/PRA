import { MenuItem } from 'primeng/api';

import {
    AgreementDetailsInterface,
    DocumentationDetailedViewInterface
} from './documentation-detailed-view-interface';

export class DocumentationDetailedViewModel {
    breadCrumbList: MenuItem[];
    agreementDetails: AgreementDetailsInterface;
    overflowMenuList: MenuItem[];
    DocumentLevel: string;
    documentationDetailedViewFlag: boolean;
    documentationDetailedViewResponse: DocumentationDetailedViewInterface;
    subscriberFlag: boolean;
    businessUnitServiceOffering: string;
    carriers: string;
    serviceLevelList: string;
    reqService: string;
    buSoForDocument: any;
    documentConfigurationId: number;
    isLoading: boolean;
    effectiveDate: string;
    expirationDate: string;
    legalText: string;
    instructionalText: string;
    refreshDocumentResponse;
    serviceDetails: Array<object>;
    attachmentAddedOnDate: Array<string>;
    documentNumber: string;
    dateFormat: string;
    attachmentDateFormat: string;
    chargeTypes: string;

    constructor(agreementID) {
        this.setInitialValues(agreementID);
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
            label: 'View Documentation'
        }];
        this.overflowMenuList = [];
        this.DocumentLevel = '';
        this.documentationDetailedViewFlag = true;
        this.subscriberFlag = true;
        this.isLoading = false;
        this.buSoForDocument = [];
        this.serviceDetails = [];
        this.businessUnitServiceOffering = '';
        this.carriers = '';
        this.dateFormat = 'MM/DD/YYYY';
        this.attachmentDateFormat = 'MM/DD/YYYY HH:mm A';
        this.legalText = '';
        this.instructionalText = '';
        this.chargeTypes = '';
    }
}
