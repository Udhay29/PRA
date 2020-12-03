import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';

import { AccountDetails, ButtonItem, CarrierDTO, CreateSaveResponse, TeamsList } from './agreement-details.interface';

export class AgreementDetailsModel {
  accountNameList: AccountDetails[];
  agreementDetails: CreateSaveResponse;
  agreementDetailsForm: FormGroup;
  agreementTypeList: ButtonItem[];
  agreementType: string;
  carrierDetailsForm: FormGroup;
  carriersColumnList: SelectItem[];
  carrierList: CarrierDTO[];
  defaultText: string;
  effectiveMaxDate: Date[];
  effectiveMinDate: Date;
  expirationMaxDate: Date;
  expirationMinDate: Date[];
  filteredTeamList: TeamsList[];
  firstRowCarrier: string;
  inCorrectEffDateFormat: boolean[];
  inCorrectExpDateFormat: boolean[];
  isNotValidDate: boolean[];
  isCarrierAgreement: boolean;
  isCarrierSubscribe: boolean;
  isCustomerAgreement: boolean;
  isDetailsChanged: boolean;
  isDetailsSaved: boolean;
  isNeedToSave: boolean;
  isRailAgreement: boolean;
  isSaveChanges: boolean;
  isSaved: boolean;
  isShowPopup: boolean;
  isSubscribe: boolean;
  pageLoading: boolean;
  routeUrl: string;
  selectedItemList: FormGroup[];
  selectedAgreementType: string;
  teamList: TeamsList[];
  inlineErrormessage: Array<object>;
  duplicateErrorFlag: boolean;
  expirationDate: string;
  heightCheckFlag: boolean;

  constructor() {
    this.selectedAgreementType = '';
    this.agreementType = 'Customer';
    this.isShowPopup = false;
    this.isSaveChanges = false;
    this.isNotValidDate = [];
    this.inCorrectExpDateFormat = [];
    this.inCorrectEffDateFormat = [];
    this.expirationMinDate = [];
    this.effectiveMaxDate = [];
    this.firstRowCarrier = '';
    this.carrierList = [];
    this.selectedItemList = [];
    this.accountNameList = [];
    this.isCarrierAgreement = false;
    this.isRailAgreement = false;
    this.defaultText = 'customer';
    this.agreementTypeList = [];
    this.filteredTeamList = [];
    this.isNeedToSave = true;
    this.isCustomerAgreement = true;
    this.isDetailsSaved = false;
    this.isDetailsChanged = false;
    this.teamList = [];
    this.isSaved = false;
    this.isSubscribe = true;
    this.pageLoading = false;
    this.duplicateErrorFlag = false;
    this.expirationDate = '2099-12-31';
    this.carriersColumnList = [
      {label: 'Carrier Name (Code)', value: 'carrier', styleClass: 'first-column'},
      {label: 'Effective Date', value: 'effectiveDate', styleClass: ''},
      {label: 'Expiration Date', value: 'expirationDate', styleClass: ''}
    ];
  }
}

