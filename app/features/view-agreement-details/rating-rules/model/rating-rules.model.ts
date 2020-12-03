import { FormGroup } from '@angular/forms';
import { MenuItem, SelectItem } from 'primeng/api';

import {
  RuleCriteriaValuesItem, AgreementDetails, ListItem, ContractTableFormat, SectionList, SectionTableFormat
} from './rating-rules.interface';

export class RatingRulesModel {
  affiliationList: SelectItem[];
  affiliationValue: string;
  agreementDetails: AgreementDetails;
  breadCrumbList: MenuItem[];
  businessUnitServiceOfferingList: ListItem[];
  congestionChargeList: RuleCriteriaValuesItem[];
  contractsList: ContractTableFormat[];
  effectiveMaxDate: Date;
  effectiveMinDate: Date;
  expirationMaxDate: Date;
  expirationMinDate: Date;
  flatRateList: RuleCriteriaValuesItem[];
  hazmatChargeList: RuleCriteriaValuesItem[];
  inCorrectEffDateFormat: boolean;
  inCorrectExpDateFormat: boolean;
  isAgreementDefault: boolean;
  isNotValidDate: boolean;
  isPageLoading: boolean;
  isRuleLoading: boolean;
  isShowOptional: boolean;
  isShowPopup: boolean;
  isShowAffliationMessage: boolean;
  isShowRadius: boolean;
  isShowContract: boolean;
  isShowSection: boolean;
  isSubscribe: boolean;
  ratingRulesForm: FormGroup;
  routerUrl: string;
  ruleCriteriaNameList: MenuItem[];
  searchInputValue: string;
  sectionList: SectionTableFormat[];
  sectionSelectedList: SectionTableFormat[];
  selectButtonList: MenuItem[];
  selectedAffiliationValue: string;
  selectedList: ContractTableFormat[];
  tableColumns: SelectItem[];
  tableSectionColumns: SelectItem[];
  ratingRuleEditFlag: boolean;
  createBreadCrumbValue: string;
  editAgreementBreadCrumbValue: string;
  editBreadCrumbValue: string;
  noContractFoundFlag: boolean;
  noSectionFoundFlag: boolean;
  constructor() {
    this.searchInputValue = '';
    this.selectedList = [];
    this.sectionSelectedList = [];
    this.contractsList = [];
    this.sectionList = [];
    this.selectedAffiliationValue = 'agreement';
    this.affiliationValue = 'agreement';
    this.isShowContract = false;
    this.isShowSection = false;
    this.isShowOptional = false;
    this.ratingRuleEditFlag = false;
    this.businessUnitServiceOfferingList = [];
    this.isAgreementDefault = true;
    this.routerUrl = '/viewagreement';
    this.isShowRadius = false;
    this.isShowPopup = false;
    this.isShowAffliationMessage = false;
    this.isSubscribe = true;
    this.createBreadCrumbValue = 'Create Agreement Rating Rule';
    this.editAgreementBreadCrumbValue = 'Edit Agreement Rating Rule';
    this.editBreadCrumbValue = 'Edit Rating Rule';
    this.noContractFoundFlag = false;
    this.noSectionFoundFlag = false;
    this.selectButtonList = [{
      label: 'Contract'
    }];
    this.ruleCriteriaNameList = [{
      label: 'Congestion Charge',
      title: 'congestionCharge'
    }, {
      label: 'Flat Rate With Stops',
      title: 'flatRate'
    }, {
      label: 'Hazmat Charge Rules',
      title: 'hazmatCharge'
    }];
    this.breadCrumbList = [{
      label: 'Pricing',
      routerLink: ['/dashboard'],
    }, {
      label: 'Search Agreements',
      routerLink: ['/searchagreement']
    }, {
      label: 'Agreement Details',
      routerLink: ['/viewagreement']
    }, {
      label: 'Create Agreement Rating Rule',
    }];
    this.affiliationList = [{
      label: 'Contract',
      value: 'contract'
    }, {
      label: 'Section',
      value: 'section'
    }, {
      label: 'None',
      value: 'agreement'
    }];
    this.tableColumns = [{
      label: 'Contract',
      value: 'display'
    }, {
      label: 'Original Effective Date',
      value: 'effectiveDate'
    }, {
      label: 'Latest Expiration Date',
      value: 'expirationDate'
    }];
    this.tableSectionColumns = [{
      label: 'Sections',
      value: 'sectionDetail'
    }, {
      label: 'Contract',
      value: 'contractDetail'
    }, {
      label: 'Original Effective Date',
      value: 'effectiveDate'
    }, {
      label: 'Latest Expiration Date',
      value: 'expirationDate'
    }];
  }
}
