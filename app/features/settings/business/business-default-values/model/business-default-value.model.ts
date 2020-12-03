import { MenuItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { ConfigurationParameterDetailDTOsItem, ControlValueMatch } from '../../model/business.interface';
export class BusinessDefaultValueModel {
  breadCrumbList: MenuItem[];
  controlMatchList: ControlValueMatch[];
  defaultValuesForm: FormGroup;
  fetchedValues: ConfigurationParameterDetailDTOsItem[];
  isChangesSaving: boolean;
  isPageLoading: boolean;
  isPopupVisible: boolean;
  isSubscribe: boolean;
  patchedValues: object;
  routingUrl: string;

  constructor() {
    this.isSubscribe = true;
    this.isPageLoading = false;
    this.isPopupVisible = false;
    this.breadCrumbList = [{
      label: 'Pricing',
      routerLink: ['/dashboard']
    }, {
      label: 'Settings',
      routerLink: ['/settings']
    }, {
      label: 'Documentation, Default Values and Days',
    }];
    this.controlMatchList = [{
      fieldName: 'Super User Back Date Days',
      controlName: 'superUserBackDate'
    }, {
      fieldName: 'User Back Date Days',
      controlName: 'userBackDate'
    }, {
      fieldName: 'Super User Future Date Days',
      controlName: 'superUserFutureDate'
    }, {
      fieldName: 'User Future Date Days',
      controlName: 'userFutureDate'
    }, {
      fieldName: 'User Update Days',
      controlName: 'userDaysAllowed'
    }, {
      fieldName: 'Super User Update Days',
      controlName: 'superUserDaysAllowed'
    }];
  }
}
