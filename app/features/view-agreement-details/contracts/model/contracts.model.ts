import {  MenuItem } from 'primeng/api';
import {  ContractDetails, Hits, QueryMock, RootObject, TableColumnModel } from './contracts.interface';
export class ContractsModel {
  isSubscriberFlag: boolean;
  detailsValue: any;
  isFilterEnabled: boolean;
  isSplitView: boolean;
  contractList: Hits[];
  isPaginatorFlag: boolean;
  tableSize: number;
  isShowLoader: boolean;
  pageStart: number;
  gridDataLength: number;
  isIconFlag: boolean;
  dropdownValue: Array<any>;
  tableColumns: Array<object>;
  filterFlag: boolean;
  sourceData: QueryMock;
  getFieldNames: object;
  splitButtonMenu: MenuItem[];
  splitViewAction: string;
  splitViewTitle: string;
  contractViewDetails: ContractDetails;
  noResultFoundFlag: Boolean;
  dateSearchQuery: Array<string>;
  effectiveDateRange: object;
  expirationDateRange: object;
  defaultSearchFields: Array<string>;
  showCreateContracts: boolean;
  isCreateContractOpen: boolean;
  rowDetail: any;
  popUpForFilterClick: boolean;
  isSearchWithCreate: boolean;

  constructor() {
    this.isSubscriberFlag = true;
    this.isSplitView = false;
    this.isPaginatorFlag = true;
    this.tableSize = 25;
    this.isShowLoader = false;
    this.pageStart = 0;
    this.isIconFlag = false;
    this.filterFlag = false;
    this.isFilterEnabled = false;
    this.noResultFoundFlag = false;
    this.dropdownValue = [];
    this.splitViewAction = 'View';
    this.splitViewTitle = 'Contract Details';
    this.splitButtonMenu = [];
    this.dateSearchQuery = [
      'ContractRanges.ContractTypeName.aux',
      'ContractRanges.ContractNumber.aux',
      'ContractRanges.ContractName.aux',
      'ContractRanges.ContractComment'
    ];
    this.defaultSearchFields = [
      'ContractRanges.ContractTypeName.aux',
      'ContractRanges.ContractNumber.aux',
      'ContractRanges.ContractName.aux',
      'ContractRanges.ContractEffectiveDate.text',
      'ContractRanges.ContractExpirationDate.text',
      'ContractRanges.ContractComment'
    ];
    this.tableColumns = [
      { 'name': 'Contract Type', 'property': 'ContractTypeName', 'keyword': 'ContractTypeName.keyword'},
      { 'name': 'Contract Identifier', 'property': 'ContractNumber', 'keyword': 'ContractNumber.keyword'},
      { 'name': 'Contract Description', 'property': 'ContractName', 'keyword': 'ContractName.keyword'},
      { 'name': 'Status', 'property': 'Status', 'keyword': 'Status.keyword'},
      { 'name': 'Effective Date', 'property': 'ContractEffectiveDate'},
      { 'name': 'Expiration Date', 'property': 'ContractExpirationDate'},
      { 'name': 'Notes', 'property': 'ContractComment', 'keyword': 'ContractComment.keyword'},
    ];
    this.getFieldNames = {
      'Contract Type' : 'ContractTypeName.aux',
      'Contract Identifier': 'ContractNumber.aux',
      'Contract Description': 'ContractName.aux',
      'Status': 'ContractExpirationDate.aux',
      'Effective Date' : 'ContractEffectiveDate',
      'Expiration Date': 'ContractExpirationDate',
      'Notes': 'ContractComment.aux'
    };
    this.effectiveDateRange = {
      'range': {
        'ContractRanges.ContractEffectiveDate': {
          'gte': '',
          'lte': '',
          'format': 'MM/dd/yyyy||yyyy'
        }
      }
    };
    this.expirationDateRange = {
      'range': {
        'ContractRanges.ContractExpirationDate': {
          'gte': '',
          'lte': '',
          'format': 'MM/dd/yyyy||yyyy'
        }
      }
    };

  }
}
