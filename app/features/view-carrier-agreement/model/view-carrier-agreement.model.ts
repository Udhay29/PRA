import { MenuItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { CarrierDetails, DetailList } from './view-carrier-agreeement.interface';

export class ViewCarrierAgreementModel {
  dropdownForm: FormGroup;
  agreementId: number;
  breadCrumbList: MenuItem[];
  isSubscribe: boolean;
  isPageLoaded: boolean;
  agreementDetails: CarrierDetails;
  overlayData: string[];
  showOverlayFlag: boolean;
  detailsList: DetailList[];
  changedEvent: string;
  isShowLineHaul: boolean;
  isShowSections: boolean;
  isShowPopup: boolean;
  isChangesAvailable: boolean;
  routingUrl: string;
  isShowViewMileageFlag: boolean;
  defaultSetValue: string;

  constructor() {
    this.routingUrl = '';
    this.isChangesAvailable = false;
    this.changedEvent = '';
    this.isShowPopup = false;
    this.isShowLineHaul = false;
    this.isShowSections = false;
    this.isSubscribe = true;
    this.isPageLoaded = false;
    this.showOverlayFlag = true;
    this.overlayData = [];
    this.isShowViewMileageFlag = false;
    this.defaultSetValue = 'Line Haul';
    this.breadCrumbList = [{
      label: 'Pricing',
      routerLink: ['/dashboard']
    }, {
      label: 'Search Agreements',
      routerLink: ['/searchagreement']
    }, {
      label: 'Agreement Details',
    }];
  }

}
