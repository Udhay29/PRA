import { MenuItem } from 'primeng/api';
import { Hits, QueryMock, ReferenceDataDetails, TableColumnModel } from './referencedata.interface';
export class ReferenceModel {

    tableContent: Array<ReferenceDataDetails>;
    referenceDataList: ReferenceDataDetails;
    tableSize: number;
    isShowLoader: boolean;
    gridDataLength: number;
    dropdownValue: Array<any>;
    tableColumns: Array<TableColumnModel>;
    sourceData: QueryMock;
    getFieldNames: object;
    noResultFoundFlag: boolean;
    isSubscriberFlag: boolean;
    isTimeFrameFlag: boolean;
    savedFreeRuleConfigurationId: number;
    referenceGridRequest: Object;
    sortField: string;
    sortOrder: string;
    quantityDefaultSortField: string;
    eventDefaultSortField: string;
    eventNameColHeader = 'Event Name';
    eventTableColumns: Array<TableColumnModel>;
    quantityTableColumns: Array<TableColumnModel>;
    dateFormat: string;
    constructor() {
        this.isShowLoader = false;
        this.noResultFoundFlag = true;
        this.isSubscriberFlag = true;
        this.tableContent = [];

        this.referenceDataList = {
            accessorialFreeRuleQuantityTypeName: '',
            accessorialFreeQuantity: 1,
            accessorialFreeRuleQuantityTimeTypeName: '',
            requestedDeliveryDateIndicator: ''
        };
        this.quantityDefaultSortField = 'Quantity Type';
        this.eventDefaultSortField = this.eventNameColHeader;
        this.sortField = this.quantityDefaultSortField;
        this.sortOrder = '1';
        this.dateFormat = 'MM/DD/YYYY';
        this.eventTableColumns = [
            {
                'name': this.eventNameColHeader,
                'property': 'accessorialFreeRuleTypeName'
            },
            {
                'name': 'Free Time',
                'property': 'accessorialFreeRuleEventTimeFrameTypeName'
            },
            {
                'name': 'Day of Event: Free Amount',
                'property': 'accessorialDayOfEventFreeRuleModifierName'
            },
            {
                'name': 'Day of Event: Time',
                'property': 'dayOfEventFreeRuleModifierTime'
            },
            {
                'name': 'Day After Event: Free Amount',
                'property': 'accessorialDayAfterEventFreeRuleModifierName'
            },
            {
                'name': 'Day After Event: Time',
                'property': 'dayAfterEventFreeRuleModifierTime'
            },
            {
                'name': 'Effective Date',
                'property': 'effectiveDate'
            },
            {
                'name': 'Expiration Date',
                'property': 'expirationDate'
            }
        ];
        this.quantityTableColumns = [
            {
                'name': 'Quantity Type',
                'property': 'accessorialFreeRuleQuantityTypeName'
            },
            {
                'name': 'Quantity',
                'property': 'accessorialFreeQuantity'
            },
            {
                'name': 'Timeframe',
                'property': 'accessorialFreeRuleQuantityTimeTypeName'
            },
            {
                'name': 'Start Free Time On',
                'property': 'requestedDeliveryDateIndicator'
            },
            {
                'name': 'Effective Date',
                'property': 'effectiveDate'
            },
            {
                'name': 'Expiration Date',
                'property': 'expirationDate'
            }
        ];
        this.tableColumns = [
            ...this.eventTableColumns,
            ...this.quantityTableColumns
        ];
    }
}
