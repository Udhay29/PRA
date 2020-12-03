import { MenuItem } from 'primeng/api';
import { TableColumnModel, TableDataModel, SearchData, SearchQuery } from './search-grid.interface';

export class SearchGridModel {
  isSubscriberFlag: boolean;
  isSearchFlag: boolean;
  isIconFlag: boolean;
  tableSize: number;
  pageStart: number;
  tableColumns: Array<TableColumnModel>;
  gridData: Array<object>;
  isPaginatorFlag: boolean;
  dropdownValue: Array<MenuItem>;
  searchGridDataLength: number;
  isDefaultText: boolean;
  isResultsFound: boolean;
  isShowLoader: boolean;
  searchInputData: SearchData;
  searchQueryData: SearchQuery;
  isDialogVisible: boolean;
  advanceSearchFormValue: string;
  isCarrierFlag: boolean;

  constructor() {
    this.isSubscriberFlag = true;
    this.isSearchFlag = true;
    this.isIconFlag = true;
    this.pageStart = 0;
    this.tableSize = 25;
    this.isShowLoader = false;
    this.isResultsFound = false;
    this.isDefaultText = true;
    this.isPaginatorFlag = false;
    this.isCarrierFlag = false;

    this.tableColumns = [
      { 'name': 'Agreement Type', 'property': 'AgreementType', 'keyword': 'AgreementType.keyword', 'isVisible': true },
      { 'name': 'Agreement Name (Code)', 'property': 'AgreementName', 'keyword': 'AgreementName.aux', 'isVisible': true },
      { 'name': 'Agreement Status', 'property': 'AgreementStatus', 'keyword': 'AgreementExpirationDate', 'isVisible': true }
    ];
  }
}
