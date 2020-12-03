import { Column, QueryMock } from './carrier-mileage.interface';
import { MenuItem } from 'primeng/api';
import { Source } from './carrier-mileage-elasticresponse.interface';
export class ViewCarrierMileageModel {
    isSplitView: boolean;
    isFilterEnabled: boolean;
    splitViewTitle: string;
    isFilterView: boolean;
    isFilterFlag: boolean;
    tableColumns: Column[];
    from: number;
    size: number;
    sortOrder: string;
    gridSize: number;
    isSubscriberFlag: boolean;
    gridRows: Source[];
    isPageLoading: boolean;
    menuItemList: Array<MenuItem>;
    gridDataLength: number;
    sourceData: QueryMock;
    defaultEndDate: string;
    defaultStartDate: string;
    effectiveDateRange: object;
    expirationDateRange: object;
    defaultSearchFields: object;
    mileageFieldNames: object;
    mileageNestedRootVal: object;
    isAllowPagination: boolean;
    tableSize: number;
    noResultFoundFlag: boolean;
    isSearchGrid: boolean;
    isEmptySearch: boolean;
    systemParameter: string;
    businessUnit: string;
    mileageDetails: object;
    UniqueDocID: number;
    agreementID: number;
    pageStart: number;
    updatedByName: string[];
    createdByName: string[];
    billToAccount: string;
    constructor() {
        this.isSubscriberFlag = true;
        this.isSplitView = false;
        this.isFilterView = false;
        this.isFilterFlag = false;
        this.isFilterEnabled = false;
        this.gridSize = 50;
        this.isPageLoading = false;
        this.gridRows = [];
        this.splitViewTitle = 'Program Detail';
        this.mileageDetails = {};
        this.from = 0;
        this.gridSize = 25;
        this.systemParameter = 'System Parameters';
        this.businessUnit = 'Business Unit';
        this.billToAccount = 'Bill To Accounts';
        this.pageStart = 0;
        this.isAllowPagination = true;
        this.tableColumns = [
            { label: 'Carrier Segment', field: 'carrierSegment', isArray: false },
            { label: this.businessUnit, field: 'businessUnit', isArray: false },
            { label: 'Program Name', field: 'mileageName', isArray: false },
            { label: 'Sections', field: 'sections', isArray: true },
            { label: this.billToAccount, field: 'billToAccounts', isArray: true },
            { label: 'Carriers', field: 'carriers', isArray: true },
            { label: 'System', field: 'system', isArray: false },
            { label: 'System Version', field: 'systemVersion', isArray: false },
            { label: this.systemParameter, field: 'systemParameters', isArray: true },
            { label: 'Distance Unit', field: 'distanceUnit', isArray: false },
            { label: 'Geography Type', field: 'geographyType', isArray: false },
            { label: 'Route Type', field: 'routeType', isArray: false },
            { label: 'Calculation Type', field: 'calculationType', isArray: false },
            { label: 'Decimal Precision', field: 'decimalPrecision', isArray: false },
            { label: 'Border Miles Parameter', field: 'borderMilesParameter', isArray: false },
            { label: 'Effective Date', field: 'effectiveDate', isArray: false },
            { label: 'Expiration Date', field: 'expirationDate', isArray: false },
            { label: 'Status', field: 'status', isArray: false },
            { label: 'Notes', field: 'notes', isArray: false },
            { label: 'Original Effective Date', field: 'originalEffectiveDate', isArray: false },
            { label: 'Original Expiration Date', field: 'originalExpirationDate', isArray: false },
            { label: 'Created By', field: 'createdBy', isArray: false },
            { label: 'Created On', field: 'createdOn', isArray: false },
            { label: 'Create Program', field: 'createdProgrameName', isArray: false },
            { label: 'Updated By', field: 'updatedBy', isArray: false },
            { label: 'Updated On', field: 'updatedOn', isArray: false },
            { label: 'Update Program', field: 'updatedProgrameName', isArray: false },
            { label: 'Copied', field: 'copied', isArray: false }
        ];
        this.mileageFieldNames = {
            'Carrier Segment': 'carrierSegmentTypeName.keyword',
            [this.businessUnit]: 'financeBusinessUnitCode.keyword',
            'Program Name': 'carrierMileageProgramName.keyword',
            'Sections': 'sectionAssociations.sectionName.keyword',
            [this.billToAccount]: 'billToAccountsAssociations.billToAccountName.keyword',
            'Carriers': 'carrierAssociations.carrierName.keyword',
            'System': 'mileageSystemName.keyword',
            'System Version': 'mileageSystemVersionName.keyword',
            [this.systemParameter]: 'mileageSystemParameterAssociations.mileageSystemParameterName.keyword',
            'Distance Unit': 'distanceUnit.keyword',
            'Geography Type': 'geographyType.keyword',
            'Route Type': 'routeType.keyword',
            'Calculation Type': 'calculationType.keyword',
            'Decimal Precision': 'decimalPrecision.keyword',
            'Border Miles Parameter': 'borderMilesParameter.keyword',
            'Effective Date': 'effectiveDate',
            'Expiration Date': 'expirationDate',
            'Status': 'status.keyword',
            'Notes': 'programNote.keyword',
            'Original Effective Date': 'originalEffectiveDate.keyword',
            'Original Expiration Date': 'originalExpirationDate.keyword',
            'Created By': 'createdBy.keyword',
            'Created On': 'createdOn',
            'Create Program': 'createdProgramName.keyword',
            'Updated By': 'updatedBy.keyword',
            'Updated On': 'updatedOn',
            'Update Program': 'updatedProgramName.keyword',
            'Copied': 'copyIndicator.keyword'
        };
        this.mileageNestedRootVal = {
            [this.billToAccount]: 'billToAccountsAssociations',
            'Sections': 'sectionAssociations',
            'Carriers': 'carrierAssociations',
            [this.systemParameter]: 'mileageSystemParameterAssociations'
        };
    }
}
