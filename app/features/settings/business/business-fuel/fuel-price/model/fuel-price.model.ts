import { MenuItem } from 'primeng/api';
import { FuelPriceTableColumn, FuelPriceTableRowItem, ELQueryMain, FilterRequest, SortInterface } from './fuel-price.interface';

export class FuelPriceModel {
    totalRecords: number;
    filterFlag: boolean;
    noResultFlag: boolean;
    loading: boolean;
    subscribeFlag: boolean;
    gridListValues: FuelPriceTableRowItem[];
    tableColumns: FuelPriceTableColumn[];
    fuelPriceQuery: ELQueryMain;
    filterDetails: FilterRequest;
    from: number;
    size: number;
    sortOrder: string;
    queryString: string;
    menuItemList: Array<MenuItem>;
    sortFlag: boolean;
    filterNoresultFlag: boolean;
    multiSortMeta: SortInterface[];
    constructor() {
        this.multiSortMeta = [];
        this.sortFlag = false;
        this.filterFlag = false;
        this.noResultFlag = true;
        this.loading = false;
        this.totalRecords = 0;
        this.from = 0;
        this.size = 25;
        this.queryString = '\"OR\"';
        this.sortOrder = 'asc';
        this.gridListValues = [];
        this.filterDetails = {
            'from': 0, 'size': 25, 'fuelPriceSourceTypeName': 'DOE',
            'fuelRegionName': 'National', 'fuelPriceAmount': '*', 'unitOfVolumeMeasurementCode': '*', 'currencyCode':
                '*', 'fuelTypeName': '*', 'effectiveDateStart': 'now-1y', 'effectiveDateEnd': 'now', 'expireDateStart':
                '1901-01-01', 'expireDateEnd': '2099-12-31', 'sordDetails': {
                    'field': 'effectiveDate',
                    'order': 'desc'
                }, 'createProgramName': '*', 'createTimestamp': '*', 'createUserID': '**',
            'lastUpdateProgramName': '**', 'lastUpdateTimestamp': '*', 'lastUpdateUserID': '*', 'effectiveType': '*', 'expirationType': '*',
            'effectiveNonMatchDate': '*', 'expirationNonMatchDate': '*', 'pricingCountryCode': '*'
        };
        this.tableColumns = [{
            'name': 'Source',
            'property': 'fuelPriceSourceTypeName',
            'isVisible': true,
            'columnWidth': 'width130'
        }, {
            'name': 'Region',
            'property': 'fuelRegionName',
            'isVisible': true,
            'columnWidth': 'width130'
        }, {
            'name': 'Effective Date',
            'property': 'effectiveDate',
            'isVisible': true,
            'columnWidth': 'width130'
        }, {
            'name': 'Expiration Date',
            'property': 'expirationDate',
            'isVisible': true,
            'columnWidth': 'width130'
        }, {
            'name': 'Price',
            'property': 'fuelPriceAmount',
            'isVisible': true,
            'columnWidth': 'width130'
        }, {
            'name': 'Basis',
            'property': 'unitOfVolumeMeasurementCode',
            'isVisible': true,
            'columnWidth': 'width130'
        },
        {
            'name': 'Currency',
            'property': 'currencyCode',
            'isVisible': true,
            'columnWidth': 'width130'
        }, {
            'name': 'Country',
            'property': 'pricingCountryCode',
            'isVisible': true,
            'columnWidth': 'width130'
        }, {
            'name': 'Fuel Type',
            'property': 'fuelTypeName',
            'isVisible': true,
            'columnWidth': 'width130'
        }, {
            'name': 'Created By',
            'property': 'createUserID',
            'isVisible': true,
            'columnWidth': 'width130'
        }, {
            'name': 'Created On',
            'property': 'createTimestamp',
            'isVisible': true,
            'columnWidth': 'width170'
        }, {
            'name': 'Create Program',
            'property': 'createProgramName',
            'isVisible': true,
            'columnWidth': 'width130'
        }, {
            'name': 'Updated By',
            'property': 'lastUpdateUserID',
            'isVisible': true,
            'columnWidth': 'width130'
        }, {
            'name': 'Updated On',
            'property': 'lastUpdateTimestamp',
            'isVisible': true,
            'columnWidth': 'width170'
        }, {
            'name': 'Updated Program',
            'property': 'lastUpdateProgramName',
            'isVisible': true,
            'columnWidth': 'width130'
        }
        ];
    }
}

