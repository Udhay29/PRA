import { FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';

import { AgreementDetails, Column, SaveResponse } from './add-contracts.interface';

export class AddContractsModel {
  contractForm: FormGroup;
  contractsList: SaveResponse[];
  contractTypeList: MenuItem[];
  createAgreement: AgreementDetails;
  selectedRowContract: SaveResponse[];
  effectiveMinDate: Date;
  effectiveMaxDate: Date;
  expirationMinDate: Date;
  expirationMaxDate: Date;
  isContractTypeDisabled: boolean;
  isDelete: boolean;
  isCheckboxClick: boolean;
  isTransactional: boolean;
  isSaveChanges: boolean;
  isTableDataLoading: boolean;
  isSaved: boolean;
  inCorrectEffDateFormat: boolean;
  inCorrectExpDateFormat: boolean;
  isNotValidDate: boolean;
  isSplitView: boolean;
  isSubscribe: boolean;
  nextStep: string;
  routeUrl: string;
  isDetailsSaved: boolean;
  selectedContractsList: SaveResponse[];
  searchUrl: string;
  tariffContractId: string;
  tableColumns: Column[];
  totalRecords: number;
  pageLoading: boolean;

  constructor() {
    this.tariffContractId = '';
    this.selectedRowContract = [];
    this.isSubscribe = true;
    this.nextStep = '';
    this.inCorrectEffDateFormat = false;
    this.isNotValidDate = false;
    this.inCorrectExpDateFormat = false;
    this.isSaveChanges = false;
    this.contractsList = [];
    this.isDetailsSaved = false;
    this.contractTypeList = [];
    this.isTableDataLoading = false;
    this.searchUrl = '/searchagreement';
    this.isDelete = false;
    this.isSaved = false;
    this.isContractTypeDisabled = false;
    this.isTransactional = false;
    this.isSplitView = false;
    this.selectedContractsList = [];
    this.pageLoading = false;
    this.tableColumns = [
    { label: 'Contract Type', key: 'customerAgreementContractTypeName'},
    { label: 'Contract Identifier', key: 'customerContractNumber'},
    { label: 'Description', key: 'customerContractName'},
    { label: 'Effective Date', key: 'effectiveDate'},
    { label: 'Expiration Date', key: 'expirationDate'}];
    this.totalRecords = 0;
  }
}
