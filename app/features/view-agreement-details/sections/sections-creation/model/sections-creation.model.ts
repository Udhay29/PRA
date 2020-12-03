import { FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Message } from 'primeng/components/common/message';

import { Column, CustomerAgreementContractsItem, SplitScreenDetails,
  TableDisplayFormat} from '../../model/sections.interface';

export class SectionsCreationModel {
  billToEffectiveMinDate: Date;
  billToEffectiveMaxDate: Date;
  billToExpirationMinDate: Date;
  billToExpirationMaxDate: Date;
  codesList: TableDisplayFormat[];
  codesTableColumns: Column[];
  contractEffDate: Date;
  contractExpDate: Date;
  contractIdList: CustomerAgreementContractsItem[];
  currencyList: MenuItem[];
  disabledEffDatesList: Date[];
  disabledExpDatesList: Date[];
  effectiveMaxDate: Date;
  effectiveMinDate: Date;
  expirationMaxDate: Date;
  expirationMinDate: Date;
  filteredCodesList: any;
  filteredContract: CustomerAgreementContractsItem[];
  filteredCurrency: MenuItem[];
  filteredSectionType: MenuItem[];
  inCorrectEffDateFormat: boolean;
  inCorrectExpDateFormat: boolean;
  isbillToAssignmentPopup: boolean;
  isBillToLoaded: boolean;
  isNotValidDate: boolean;
  isShowPopup: boolean;
  isSubscribe: boolean;
  maximumBackDate: number;
  maximumFutureDate: number;
  popupFormGroup: FormGroup;
  searchInputValue: string;
  sectionForm: FormGroup;
  sectionTypeList: MenuItem[];
  selectedCodesList: TableDisplayFormat[];
  selectedContract: CustomerAgreementContractsItem;
  splitViewDetails: SplitScreenDetails;
  selectedCodeListCopy: TableDisplayFormat[];
  editSelectedBillToList: TableDisplayFormat[];
  editBillToList: boolean;
  editContractDisable: boolean;
  createSectionPopupText: string;
  editSectionPopupText: string;
  popupText: string;
  isAssigned: boolean;
  isShowChildEntityPopup: boolean;
  countErrorMessage: Message[];
  countErrorData: Array<object>;
  sectionName: string;
  agreementName: string;
  billToLength: number;
  accessorialCount: number;
  constructor() {
    this.isBillToLoaded = true;
    this.isShowPopup = false;
    this.codesList = [];
    this.contractIdList = [];
    this.currencyList = [];
    this.filteredCodesList = [];
    this.filteredContract = [];
    this.filteredCurrency = [];
    this.filteredSectionType = [];
    this.isSubscribe = true;
    this.sectionTypeList = [];
    this.searchInputValue = '';
    this.selectedCodesList = [];
    this.isAssigned = false;
    this.codesTableColumns = [{
      label: 'Bill To Codes',
      key: 'billToCodes',
      tooltip: 'billToCodes'
    }, {
      label: 'Current Assignment',
      key: 'assignment',
      tooltip: 'assignment'
    }, {
      label: 'Assignment Dates',
      key: 'assignedDates',
      tooltip: 'assignedDates'
    }];
    this.selectedCodeListCopy = [];
    this.editSelectedBillToList = [];
    this.editBillToList = false;
    this.editContractDisable = false;
    this.createSectionPopupText = 'Please select an effective date and expiration date for your new selection of Bill To codes.';
    this.editSectionPopupText = 'Please select an effective date range for your new selection of Bill To codes.';
    this.isShowChildEntityPopup = false;
    this.countErrorData = [];
  }
}
