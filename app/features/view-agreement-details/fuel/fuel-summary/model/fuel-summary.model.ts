import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';

import { AgreementDetails, BillToFormat, BillToSelectedList, ListItem, CarrierDTO, SaveResponse,
  Column, ContractListDisplay, SectionListDisplay, CustomerAgreementDetail} from './fuel-summary.interface';
export class FuelSummaryModel {
  affiliationLevel: SelectItem[];
  agreementDetails: AgreementDetails;
  businessUnitServiceOfferingList: ListItem[];
  billToSearchInputValue: string;
  carrierList: CarrierDTO[];
  effectiveMaxDate: Date;
  effectiveMinDate: Date;
  expirationMaxDate: Date;
  expirationMinDate: Date;
  fuelProgramType: SelectItem[];
  fuelSummaryForm: FormGroup;
  inCorrectEffDateFormat: boolean;
  inCorrectExpDateFormat: boolean;
  isNotValidDate: boolean;
  isSubscribe: boolean;
  selectedAffiliationValue: string;
  affiliationValue: string;
  isShowPopup: boolean;
  isShowAgreementBillTO: boolean;
  isShowContract: boolean;
  isShowSection: boolean;
  billToList: BillToFormat[];
  tableColumns: object;
  selectedList: BillToFormat[];
  agreementId: number;
  billTorequestData: BillToSelectedList[];
  searchInputValue: string;
  isTableDataLoading: boolean;
  itemList: SaveResponse[];
  selectedItemList: SaveResponse[];
  contractColumns: Column[];
  sectionColumns: Column[];
  searchContractColumns: string[];
  searchSectionColumns: string[];
  tableLabel: string;
  tableColumnsList: Column[];
  searchColumns: string[];
  isContractBillTo: boolean;
  isSectionBillTo: boolean;
  contractListData: ContractListDisplay[];
  selectedBilltoContract: BillToSelectedList[];
  selectedBillToSection: any[];
  sectionListData: SectionListDisplay[];
  noRecordMsgFlag: boolean;
  noRecordMsgFlagBillTo: boolean;
  isShowEmptyBillTo: boolean;
  customerAgreementDetails: CustomerAgreementDetail[];
  dateFormat: string;
  errorMessage: string;
  selectedOption: string;

  constructor() {
    this.carrierList = [];
    this.billToList = [];
    this.isSubscribe = true;
    this.billToSearchInputValue = '';
    this.noRecordMsgFlag = false;
    this.noRecordMsgFlagBillTo = false;
    this.isShowEmptyBillTo = false;
    this.fuelProgramType = [{
      label: 'Create',
      value: 'create'
    }, {
      label: 'Copy',
      value: 'copy',
      styleClass: 'disabled'
    }, {
      label: 'Default',
      value: 'default',
      styleClass: 'disabled'
    }];
    this.isShowPopup = false;
    this.isContractBillTo = false;
    this.isSectionBillTo = false;
    this.isShowAgreementBillTO = true;
    this.isShowContract = false;
    this.searchInputValue = '';
    this.isShowSection = false;
    this.selectedList = [];
    this.dateFormat = 'MM/DD/YYYY';
    this.errorMessage = 'Missing Required Information';
    this.tableColumns = [
      { label: 'Bill To Accounts', value: 'display', key: 'display'},
      { label: 'Sections', value: 'section', key: 'section'},
      { label: 'Contract', value: 'contract', key: 'contract'}];
    this.isTableDataLoading = false;
    this.itemList = [];
    this.contractColumns = [
      { label: 'Contracts', key: 'combineNameNumber' },
      { label: 'Effective Date', key: 'effectiveDate' },
      { label: 'Expiration Date', key: 'expirationDate' }
    ];
    this.sectionColumns = [
      { label: 'Sections', key: 'customerAgreementContractSectionName'},
      { label: 'Contract', key: 'combineNameNumber' },
      { label: 'Effective Date', key: 'effectiveDate' },
      { label: 'Expiration Date', key: 'expirationDate' }
   ];
    this.searchContractColumns = ['combineNameNumber', 'effectiveDate', 'expirationDate'];
    this.searchSectionColumns = ['customerAgreementContractSectionName', 'combineNameNumber', 'effectiveDate', 'expirationDate'];
    this.tableLabel = '';
    this.contractListData = [];
    this.selectedBilltoContract = [];
    this.selectedBillToSection = [];
    this.sectionListData = [];
    this.customerAgreementDetails = [];
    }
  }
