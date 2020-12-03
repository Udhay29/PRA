import { FormGroup } from '@angular/forms';
import { Breadcrumb } from '../../../../model/breadcrumb';
import { EditValue, RootObject, RuleCrietria } from './default-rating-rule.interface';

export class DefaultRatingRuleModel {
  dateFormat: string;
  breadCrumbList: Breadcrumb[];
  isSubscriberFlag: boolean;
  isPageLoading: boolean;
  populateData: RootObject;
  effectiveDate: string;
  expirationDate: string;
  citySubstitution: string;
  radiusValue: string;
  isEditFlag: boolean;
  effectiveDateChangedCheck: boolean;
  patchedValues: any;
  defaultRatingForm: FormGroup;
  effectiveMinDate: Date;
  effectiveMaxDate: Date;
  expirationMinDate: Date;
  expirationMaxDate: Date;
  isCheckBoxSelected: boolean;
  city: Array<string>;
  defaultRules: RuleCrietria[];
  editData: EditValue[];
  inCorrectEffDateFormat: boolean;
  isNotValidDate: boolean;
  requestParam: RootObject;
  isSaveChanges: boolean;
  routingUrl: string;
  isRadiusVaild: boolean;
  isChangesSaving: boolean;
  isPopupVisible: boolean;
  popupMessage: string;
  customerRatingRuleID: number;

  constructor() {
    this.dateFormat = 'MM/DD/YYYY';
    this.isSubscriberFlag = true;
    this.isPageLoading = false;
    this.isEditFlag = false;
    this.isRadiusVaild = true;
    this.effectiveDateChangedCheck = false;
    this.isChangesSaving = false;
    this.city = [];
    this.inCorrectEffDateFormat = false;
    this.isNotValidDate = false;
    this.breadCrumbList = [
        { label: 'Pricing', routerLink: ['/managereferences'] },
        { label: 'Settings', routerLink: ['/settings'] },
        { label: 'Default Rating Rule', routerLink: ['/settings/defaultratingrule'] }
    ];
    this.requestParam = {
      'citySubstitutionIndicator': '',
      'citySubstitutionRadiusValue': null,
      'radiusUnitOfLengthMeasurement': '',
      'effectiveDate': '',
      'expirationDate': '',
      'customerRatingRuleConfigurationInputDTOs': [],
      'effectiveDateChanged': null,
      'lastUpdatedTimestamp': null,
      'attributeChanged': false
    };
  }
}
