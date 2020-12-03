import { FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';

import { AgreementDetails, CodesResponse, CustomerAgreementContractsItem, TableFormat, Column, HitsItem,
SaveResponse } from './add-section.interface';

export class AddSectionModel {
  codesList: CodesResponse[];
  codesTableColumns: Column[];
  createAgreement: AgreementDetails;
  contractIdList: CustomerAgreementContractsItem[];
  currencyList: MenuItem[];
  changeText: string;
  disabledEffDatesList: Date[];
  disabledExpDatesList: Date[];
  editSectionResponse: SaveResponse;
  effectiveMaxDate: Date;
  effectiveMinDate: Date;
  expirationMaxDate: Date;
  expirationMinDate: Date;
  filteredCodesList: CodesResponse[];
  filteredSelectedList: CodesResponse[];
  isCheckboxClick: boolean;
  inCorrectEffDateFormat: boolean;
  inCorrectExpDateFormat: boolean;
  isDelete: boolean;
  isDetailsSaved: boolean;
  isSaveChanges: boolean;
  isSaved: boolean;
  isTableDataLoading: boolean;
  isNotValidDate: boolean;
  isSplitView: boolean;
  isBillToLoading: boolean;
  isSubscribe: boolean;
  maximumBackDate: number;
  maximumFutureDate: number;
  pageLoading: boolean;
  searchInputValue: string;
  sectionForm: FormGroup;
  searchUrl: string;
  sectionsList: TableFormat[];
  sectionTableData: HitsItem[];
  sectionTypeList: MenuItem[];
  selectedContractId: number;
  selectedCodesList: CodesResponse[];
  selectedEditSection: TableFormat[];
  selectedSectionsList: TableFormat[];
  routeUrl: string;
  tableColumns: Column[];
  saveEditFlag: boolean;
  effError: boolean;
  expError: boolean;

  constructor() {
    this.saveEditFlag = true;
    this.isSubscribe = true;
    this.isBillToLoading = false;
    this.filteredSelectedList = [];
    this.sectionTableData = [];
    this.inCorrectEffDateFormat = false;
    this.inCorrectExpDateFormat = false;
    this.isNotValidDate = false;
    this.isDelete = false;
    this.searchInputValue = '';
    this.isTableDataLoading = false;
    this.selectedEditSection = [];
    this.isDetailsSaved = false;
    this.isSaveChanges = false;
    this.isSplitView = false;
    this.codesList = [];
    this.searchUrl = '/searchagreement';
    this.changeText = '';
    this.filteredCodesList = [];
    this.selectedCodesList = [];
    this.sectionsList = [];
    this.contractIdList = [];
    this.selectedSectionsList = [];
    this.disabledExpDatesList = [];
    this.sectionTypeList = [];
    this.disabledEffDatesList = [];
    this.currencyList = [];
    this.pageLoading = false;
    this.effError = false;
    this.expError = false;
    this.codesTableColumns = [{ label: 'Codes', key: 'codes', tooltip: 'codes'}];
    this.tableColumns = [
    { label: 'Section Name', key: 'sectionName', tooltip: 'sectionName'},
    { label: 'Section Type', key: 'sectionType', tooltip: 'sectionType'},
    { label: 'Currency', key: 'currency', tooltip: 'currency'},
    { label: 'Contract', key: 'contract', tooltip: 'contract'},
    { label: 'Codes', key: 'selectedCode', tooltip: 'toolTipForBillTo'},
    { label: 'Effective Date', key: 'effectiveDate', tooltip: 'effeceffectiveDatetive'},
    { label: 'Expiration Date', key: 'expirationDate', tooltip: 'expirationDate'}];
  }
}
