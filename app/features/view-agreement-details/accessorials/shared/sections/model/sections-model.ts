import { SectionsGridColumnsObjInterface, SectionsGridResponseInterface } from './sections-interface';

export class SectionsModel {

    accessorialGridColumns: Array<SectionsGridColumnsObjInterface>;
    accessorialGridValue: Array<SectionsGridResponseInterface>;
    selectedRowValue: Array<SectionsGridResponseInterface>;
    filteredValuesLength: number;
    isSubscriberFlag: boolean;
    loading: boolean;
    selectedSection: SectionsGridResponseInterface[];
    isAllSectionSelected: boolean;
    errorText: string;
    dataSelected: SectionsGridResponseInterface[];
    selectedSectionInEdit: SectionsGridResponseInterface[];
    isEditRateClicked: boolean;
    isEditRuleClicked: boolean;
    selectedCurrency: string;
    isCurrencyValidationRequired: boolean;
    constructor() {
        this.accessorialGridValue = [];
        this.accessorialGridColumns = [
            { name: 'Section', property: 'customerAgreementContractSectionName' },
            { name: 'Contract', property: 'customerContractName' },
            { name: 'Effective Date', property: 'effectiveDate' },
            { name: 'Expiration Date', property: 'expirationDate' }
        ];
        this.selectedRowValue = [];
        this.filteredValuesLength = 0;
        this.isSubscriberFlag = true;
        this.isAllSectionSelected = false;
        this.dataSelected = [];
        this.selectedCurrency = '';
        this.errorText = 'Missing Required Information';
        this.selectedSectionInEdit = [];
        this.isCurrencyValidationRequired = false;
    }
}
