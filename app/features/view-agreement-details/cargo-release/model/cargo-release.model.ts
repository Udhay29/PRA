import { MenuItem } from 'primeng/api';
import { CargoGridInterface, TableColumnsInterface, ViewGridInterface, QueryMock } from './cargo-release.interface';

export class CargoReleaseModel {
    isSplitView: boolean;
    noResultFoundFlag: boolean;
    subscribeFlag: boolean;
    cargoList: CargoGridInterface[];
    paginationData: CargoGridInterface[];
    tableColumns: TableColumnsInterface[];
    filterFlag: boolean;
    viewFlag: boolean;
    items: Array<MenuItem>;
    viewGridData: CargoGridInterface[];
    editGridData: CargoGridInterface[];
    viewData: ViewGridInterface;
    inactivateFlag: boolean;
    createCargoFlag: boolean;
    isDefault: boolean;
    editFlag: boolean;
    loading: boolean;
    totalRecords: number;
    lazyFlag: boolean;
    filterEnabled: boolean;
    isPagination: boolean;
    isSearchGrid: boolean;
    buttonItems: Array<MenuItem>;
    pageStart: number;
    pageSize: number;
    agreementId: number;
    cargoAmount: number;
    gridDataLength: number;
    gridQuery: Object;
    sortColumns: object;
    nestedColumns: object;
    filterKey: Array<any>;
    dataFlag: boolean;
    isSortClicked: boolean;
    searchValue: string;
    sourceData: QueryMock;

    constructor() {
        this.filterKey = [];
        this.isSplitView = false;
        this.inactivateFlag = false;
        this.filterFlag = false;
        this.filterEnabled = false;
        this.items = [];
        this.pageStart = 0;
        this.pageSize = 25;
        this.buttonItems = [];
        this.lazyFlag = true;
        this.viewGridData = [];
        this.viewFlag = false;
        this.cargoList = [];
        this.paginationData = [];
        this.loading = true;
        this.subscribeFlag = true;
        this.createCargoFlag = false;
        this.isDefault = false;
        this.editFlag = true;
        this.isPagination = true;
        this.editGridData = [];
        this.searchValue = '';
        this.tableColumns = [
            { label: 'Cargo Release', field: 'cargoReleaseAmount', isArray: false },
            { label: 'Agreement Default', field: 'agreementDefaultIndicator', isArray: false },
            { label: 'Contract', field: 'customerContractName', isArray: false },
            { label: 'Business Unit', field: 'businessUnitData', isArray: true },
            { label: 'Section', field: 'customerSectionName', isArray: false },
            { label: 'Effective Date', field: 'effectiveDate', isArray: false },
            { label: 'Expiration Date', field: 'expirationDate', isArray: false },
            { label: 'Status', field: 'invalidReasonTypeName', isArray: false }];
        this.sortColumns = {
            'cargoReleaseAmount': 'cargoReleaseAmount',
            'agreementDefaultIndicator': 'agreementDefaultIndicator.keyword',
            'customerContractName': 'contractAssociation.contractDisplayName.keyword',
            'businessUnitData': 'financeBusinessUnitAssociations.financeBusinessUnitCode.keyword',
            'customerSectionName': 'sectionAssociation.customerAgreementContractSectionName.keyword',
            'effectiveDate': 'effectiveDate',
            'expirationDate': 'expirationDate',
            'invalidReasonTypeName': 'invalidReasonTypeName'
        };
        this.nestedColumns = {
            'businessUnitData': 'financeBusinessUnitAssociations'
        };
    }
}
