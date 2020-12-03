import { MenuItem } from 'primeng/api';
import { ElasticResponseModel } from '../../model/elastic-response.interface';
import {
  SearchData, BreadcrumbSearchOwo, SetDefaultColumnsSearchOwo
} from './search-agreement.interface';

export class AgreementSearchModel {
  gridData: Object;
  isShowLoader: boolean;
  breadcrumbSearchOwo: Array<BreadcrumbSearchOwo>;
  items: Array<MenuItem>;
  searchGridData: Array<object>; // since it is an elastic search, type is Array<object>
  isResultsFound: boolean;
  searchGridDataLength: number;
  isDefaultText: boolean;
  isPaginatorFlag: boolean;
  isIconFlag: boolean;
  isSubscriberFlag: boolean;
  totalRecords: number;
  searchResultVal: ElasticResponseModel;
  breadCrumb: any;
  formValues: any;
  searchQueryParameter: SearchData;
  isFormValid: boolean;
  paginationValue: SearchData;
  searchQueryParam: SearchData;
  isDialogVisible: boolean;
  defaultColumnsSearchOwo: Array<SetDefaultColumnsSearchOwo>;
  allColumnsForSearchOwo: Array<SetDefaultColumnsSearchOwo>;
  totalSearchDataCount: number;
  isResetGrid: boolean;
  constructor() {
    this.paginationValue = {};
    this.isResultsFound = false;
    this.isFormValid = false;
    this.isShowLoader = false;
    this.breadcrumbSearchOwo = [
      { label: 'Pricing', routerLink: [''] },
      { label: 'Search Agreements', routerLink: ['/searchagreement'] }
    ];
  }
}
