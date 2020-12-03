import { MenuItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { AgreementDetails, DetailList, Teams } from './view-agreement-details.interface';

export class ViewAgreementDetailsModel {
  agreementDetails: AgreementDetails;
  agreementId: number;
  agreementName: string;
  agreementStatus: string;
  breadCrumbList: MenuItem[];
  detailsList: DetailList[];
  detailType: string;
  isManageTeams: boolean;
  isPageLoaded: boolean;
  isShowPopup: boolean;
  isShowFuel: boolean;
  isShowContracts: boolean;
  isShowContractsList: boolean;
  isShowRatingRule: boolean;
  isShowAccessorialFlag: boolean;
  isChangesAvailable: boolean;
  accesorialType: string;
  isSubscribe: boolean;
  overflowMenuList: MenuItem[];
  showViewMileageFlag: boolean;
  showCargoFlag: boolean;
  manageTeams: Teams;
  routingUrl: string;
  showLineHaul: boolean;
  showSections: boolean;
  showAccessorial: boolean;
  accessTabIndex: number;
  showDocumentationTab: boolean;
  showAllTab: boolean;
  rateTabflag: boolean;
  accessorialTabLoading: boolean;
  changedEvent: string;
  dropdownForm: FormGroup;

  constructor() {
    this.initialValues();
  }

  initialValues() {
    this.changedEvent = '';
    this.isChangesAvailable = false;
    this.isShowPopup = false;
    this.routingUrl = '';
    this.isShowFuel = false;
    this.breadCrumbList = [{
      label: 'Pricing',
      routerLink: ['/dashboard']
    }, {
      label: 'Search Agreements',
      routerLink: ['/searchagreement']
    }, {
      label: 'Agreement Details',
    }];
    this.isSubscribe = true;
    this.overflowMenuList = [];
    this.agreementStatus = '';
    this.detailsList = [{
      'label': '',
      'value': ''
    }];
    this.detailType = '';
    this.isPageLoaded = false;
    this.isManageTeams = false;
    this.accesorialType = 'rates';
    this.accessTabIndex = 0;
    this.showDocumentationTab = false;
    this.showAllTab = false;
    this.rateTabflag = true;
  }
}
