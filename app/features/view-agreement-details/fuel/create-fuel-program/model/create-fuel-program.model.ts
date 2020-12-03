import { MenuItem } from 'primeng/api';
export class CreateFuelProgramModel {
  activeIndex: number;
  agreementId: number;
  agreementName: string;
  isChangesAvailable: boolean;
  isPageLoading: boolean;
  isSaveChanges: boolean;
  isShowFuelSummary: boolean;
  isShowFuelCalculationDetails: boolean;
  isShowFuelPriceBasis: boolean;
  isSubscribe: boolean;
  routingUrl: string;
  stepsList: MenuItem[];

  constructor() {
    this.isSaveChanges = false;
    this.isPageLoading = false;
    this.isSubscribe = true;
    this.isShowFuelSummary = false;
    this.isShowFuelCalculationDetails = false;
    this.isShowFuelPriceBasis = false;
    this.activeIndex = 0;
    this.agreementName = '';
    this.stepsList = [{
      label: 'Fuel Program Summary'
    }, {
      label: 'Fuel Calculation Details'
    }, {
      label: 'Fuel Price Basis'
    }];
  }
}
