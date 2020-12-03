import { MenuItem } from 'primeng/api';
export class CreateAgreementModel {
  activeIndex: number;
  agreementName: string;
  agreementType: string;
  breadCrumbList: MenuItem[];
  isCarrierAgreement: boolean;
  isChangesSaving: boolean;
  isPopupVisible: boolean;
  clickedIndex: number;
  isShowAgreementDetails: boolean;
  isShowContract: boolean;
  isShowSection: boolean;
  isShowCargo: boolean;
  isSubscribe: boolean;
  formChanged: boolean;
  formChangedPopup: boolean;
  popupMessage: string;
  routingUrl: string;
  stepsList: MenuItem[];

  constructor() {
    this.agreementType = '';
    this.isSubscribe = true;
    this.isCarrierAgreement = false;
    this.activeIndex = 0;
    this.agreementName = '';
    this.isShowContract = false;
    this.formChanged = false;
    this.formChangedPopup = false;
    this.isShowCargo = false;
    this.isShowSection = false;
    this.isShowAgreementDetails = false;
    this.isPopupVisible = false;
    this.popupMessage = '';
    this.stepsList = [{
      label: 'Agreement Details'
    }, {
      label: 'Add Contracts'
    }, {
      label: 'Add Section'
    }, {
      label: 'Add Cargo Release'
    }];
    this.breadCrumbList = [{
      label: 'Pricing',
      routerLink: ['/dashboard']
    }, {
      label: 'Create Agreement'
    }];
  }
}
