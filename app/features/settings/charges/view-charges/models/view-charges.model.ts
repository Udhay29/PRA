import { TableColumnModel, ChargeCodesList } from './view-charges.interface';
import { FormGroup } from '@angular/forms';

export class ViewChargesModel {
    isSplitView: boolean;
    selectedChargeData: Array<ChargeCodesList>;
    frozenCols: any = [];
    subscriberFlag: boolean;
    tableColumns: Array<TableColumnModel>;
    tableContent: Array<ChargeCodesList>;
    chargeCodesDetails: ChargeCodesList;
    showCreateButton: boolean;
    isPaginatorFlag: boolean;
    totalRecords: number;
    pageSize: number;
    pageNumber: number;
    selectedPage: number;
    sortDirection: string;
    sortField: string;
    createChargesForm: FormGroup;
    isLoader: boolean;
    isTableShow: boolean;
    filterFlag: boolean;
    isFilterEnabled: boolean;
    getFieldNames: object;
    getNestedPathSort: object;
    effectiveDateSearchQuery: object;
    expirationDateSearchQuery: object;
    noResultFoundFlag: boolean;
    constructor() {
        this.pageSize = 25;
        this.pageNumber = 0;
        this.isPaginatorFlag = true;
        this.selectedPage = 0;
        this.sortDirection = 'asc';
        this.sortField = 'chargeIdentifier';
        this.showCreateButton = true;
        this.filterFlag = false;
        this.isFilterEnabled = false;
        this.isTableShow = true;
        this.noResultFoundFlag = false;
        this.isSplitView = false;
        this.chargeCodesDetails = {
            chargeIdentifier: '',
            chargeTypeDescription: '',
            chargeTypeBusinessUnitServiceOfferingAssociations: '',
            rateTypes: '',
            chargeUsageType: '',
            chargeApplicationLevelTypes: '',
            quantityRequiredIndicator: '',
            autoInvoiceIndicator: '',
            effectiveDate: '',
            expirationDate: '',
            tableToolTip: '',
            rateTypeToolTip: '',
            chargeUsageTypeToolTip: ''
        };
        this.subscriberFlag = true;
        this.isSplitView = false;
        this.frozenCols = [
            { 'name': 'Charge Type', 'property': 'chargeIdentifier' }
        ];
        this.tableContent = [];
        this.tableColumns = [
            { 'name': 'Description', 'property': 'chargeTypeDescription' },
            { 'name': 'Business Unit and Service Offering', 'property': 'chargeTypeBusinessUnitServiceOfferingAssociations' },
            { 'name': 'Quantity Required', 'property': 'quantityRequiredIndicator' },
            { 'name': 'Auto Invoice', 'property': 'autoInvoiceIndicator' },
            { 'name': 'Application Level', 'property': 'chargeApplicationLevelTypes' },
            { 'name': 'Usage', 'property': 'chargeUsageType' },
            { 'name': 'Effective Date', 'property': 'effectiveDate' },
            { 'name': 'Expiration Date', 'property': 'expirationDate' },
            { 'name': 'Rate Type', 'property': 'rateTypes' }
        ];
        this.getFieldNames = {
            'Description': 'ChargeTypeDescription.aux',
            'Business Unit and Service Offering': 'BusinessUnitServiceOfferings.BusinessUnitServiceOfferingName.keyword',
            'Quantity Required': 'QuantityRequiredIndicator.keyword',
            'Auto Invoice': 'AutoInvoiceIndicator.aux',
            'Application Level': 'ApplicationLevel.ChargeApplicationLevelTypeName.keyword',
            'Usage': 'ChargeUsageTypes.ChargeUsageTypeName.keyword',
            'Effective Date': 'EffectiveDate',
            'Expiration Date': 'ExpirationDate',
            'Rate Type': 'RateTypes.RateTypeName.keyword',
            'Charge Type': 'ChargeTypeIdentifier.keyword'
        };
        this.effectiveDateSearchQuery = {
            'range': {
                'EffectiveDate': {
                    'format': 'MM/dd/yyyy||epoch_millis'
                }
            }
        };
        this.expirationDateSearchQuery = {
            'range': {
                'ExpirationDate': {
                    'format': 'MM/dd/yyyy||epoch_millis'
                }
            }
        };
        this.selectedChargeData = [];
    }
}
