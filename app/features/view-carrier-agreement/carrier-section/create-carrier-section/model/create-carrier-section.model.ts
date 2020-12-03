import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';

import { BillToItem, Column, CarrierDetails } from './create-carrier-section.interface';

export class CreateCarrierSectionModel {
  accountList: SelectItem[];
  agreementId: number;
  billToCount: number;
  buList: SelectItem[];
  buFilteredList: SelectItem[];
  carrierDetails: CarrierDetails;
  carrierSectionForm: FormGroup;
  carrierSegmentFilteredList: SelectItem[];
  carrierSegmentList: SelectItem[];
  codesTableColumns: Column[];
  effectiveMaxDate: Date;
  expirationMinDate: Date;
  filteredCodesList: BillToItem[];
  inCorrectEffDateFormat: boolean;
  inCorrectExpDateFormat: boolean;
  isBillToLoading: boolean;
  isNotValidDate: boolean;
  isShowPopup: boolean;
  isSubscribeFlag: boolean;
  searchInputValue: string;
  selectedCodesList: BillToItem[];

  constructor() {
    this.accountList = [];
    this.buList = [];
    this.buFilteredList = [];
    this.carrierSegmentFilteredList = [];
    this.carrierSegmentList = [];
    this.codesTableColumns = [{label: 'Select All', key: 'billToDisplay'},
    {label: 'Current Assignment', key: 'assignment'}];
    this.filteredCodesList = [];
    this.isBillToLoading = false;
    this.isShowPopup = false;
    this.isSubscribeFlag = true;
    this.searchInputValue = '';
    this.selectedCodesList = [];
  }
}
