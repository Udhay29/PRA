import { Breadcrumb } from '../../../model/breadcrumb';

export class BusinessModel {
  pageLoading: boolean;
  systemTableValues: string[];
  breadCrumbList: Breadcrumb[];

  constructor() {
    this.pageLoading = false;
    this.systemTableValues = ['Dray Group', 'Documents, Default and Days', 'Default Rating Rule', 'Fuel', 'Precedence'];
    this.breadCrumbList = [
      { label: 'Pricing', routerLink: ['/managereferences'] },
      { label: 'Settings', routerLink: ['/settings'] },
      { label: 'Default Rating Rule', routerLink: ['/defaultratingrule'] },
      {label: 'Precedence', routerLink: ['/precedence']},
      {label: 'Dray Group', routerLink: ['/draygroup']}
    ];
  }
}
