import { MenuItem } from 'primeng/api';


export class StandardModel {
  breadCrumbList: MenuItem[];
  isPageLoaded: boolean;
  isShowAccessorialFlag: boolean;
  accesorialType: string;
  isSubscribe: boolean;
  overflowMenuList: MenuItem[];
  showAccessorial: boolean;
  accessTabIndex: number;
  detailType: string;
  detailsList: any;
  isShowAllTab: boolean;
  isShowDocumentationTab: boolean;
  rateTabflag: boolean;
  constructor() {
    this.initialValues();
  }

  initialValues() {
    this.breadCrumbList = [{
      label: 'Pricing',
      routerLink: ['/dashboard']
    }, {
      label: 'Standards'
    }];
    this.isSubscribe = true;
    this.isShowAllTab = false;
    this.overflowMenuList = [];
    this.isPageLoaded = false;
    this.accesorialType = 'rates';
    this.accessTabIndex = 0;
    this.detailType = 'Accessorial';
    this.isShowDocumentationTab = false;
    this.detailsList = [{
      'label': 'Accessorials',
      'value': 'Accessorials'
    }];
    this.rateTabflag = true;
  }
}
