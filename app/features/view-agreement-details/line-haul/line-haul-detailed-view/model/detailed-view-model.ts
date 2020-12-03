import {
  LineHaulValues, AgreementDetails
} from '../model/detailed-view.interface';
import { MenuItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';

export class DetailedViewModel {
  lineHaulOverview: LineHaulValues;
  operationalServices: string[];
  subscriberFlag: boolean;
  agreementDetails: AgreementDetails;
  breadCrumbList: Array<MenuItem>;
  pageLoading: boolean;
  inactivateForm: FormGroup;
  serviceOffering: string;
  inactivatePopup: boolean;
  showPopupForPriorEffDate: boolean;
  expDate: Date;
  maxDate: Date;
  overflowMenuList: MenuItem[];
  dateFormatString: string;
  constructor(agreementId: string) {
    this.initialValues(agreementId);
    this.subscriberFlag = true;
    this.dateFormatString = 'YYYY-MM-DD';
  }
  initialValues(agreementId: string) {
    this.breadCrumbList = [{
      label: 'Pricing',
      routerLink: ['/dashboard']
    }, {
      label: 'Search Agreements',
      routerLink: ['/searchagreement']
    }, {
      label: 'Agreement Details',
      routerLink: ['/viewagreement'],
      queryParams: { id: agreementId }
    }, {
      label: 'Line Haul Detail'
    }];
    this.overflowMenuList = [];
  }
}
