import { MenuItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { HitItems, RatingRuleDetail, Source } from './rating.interface';

export class RatingsModel {
  isSubscriberFlag: boolean;
  isSplitView: boolean;
  ratingList: HitItems[];
  isPaginatorFlag: boolean;
  tableSize: number;
  isShowLoader: boolean;
  pageStart: number;
  gridDataLength: number;
  allowPagination: boolean;
  dropdownValue: Array<MenuItem>;
  tableColumns: Array<object>;
  filterFlag: boolean;
  noResultFoundFlag: boolean;
  getFieldNames: object;
  onLoadindicator: boolean;
  agreementID: number;
  getNestedRootVal: object;
  isPageLoading: boolean;
  splitViewTitle: string;
  ratingRulesDetail: RatingRuleDetail;
  uniqueDocID: number;
  defaultRatingRulesDetail: RatingRuleDetail;
  viewRatingRuleSubscriberFlag: boolean;
  ratingRuleInactivateForm: FormGroup;
  showInactivatePopUp: boolean;
  showReactivateButton: boolean;
  expDate: Date;
  maxDate: Date;
  minDate: Date;
  effectiveDateRange: object;
  expirationDateRange: object;
  defaultSearchFields: object;
  defaultEndDate: string;
  defaultStartDate: string;

  constructor() {
    this.splitViewTitle = 'Rating Rule Detail';
    const contractComment = 'ContractComment.keyword';
    const businessUnitTest = 'Business Unit and Service Offerings';
    this.isSubscriberFlag = true;
    this.viewRatingRuleSubscriberFlag = true;
    this.isSplitView = false;
    this.isPaginatorFlag = true;
    this.tableSize = 25;
    this.isShowLoader = false;
    this.onLoadindicator = true;
    this.pageStart = 0;
    this.allowPagination = false;
    this.filterFlag = false;
    this.noResultFoundFlag = false;
    this.dropdownValue = [];
    this.ratingList = [];
    this.isPageLoading = false;
    this.defaultEndDate = '12/31/2099';
    this.defaultStartDate = '01/01/1995';

    this.tableColumns = [
      { 'name': 'Agreement Default', 'property': 'agreementDefaultIndicator', 'keyword': 'ContractTypeName.keyword' },
      { 'name': 'Contract', 'property': 'Contract', 'keyword': 'contractAssociations' },
      {
        'name': businessUnitTest,
        'property': 'BusinessUnitServiceOffering', 'keyword': 'financeBusinessUnitServiceOfferingAssociations'
      },
      { 'name': 'Section', 'property': 'SectionName', 'keyword': 'sectionAssociations' },
      { 'name': 'City Substitution', 'property': 'citySubstitutionMesurementUnit' },
      { 'name': 'Hazmat Charge Rules', 'property': 'hazmatChargeRulesType' },
      { 'name': 'Congestion Charge', 'property': 'congestionChargeType', 'keyword': contractComment },
      { 'name': 'Flat Rate With Stops', 'property': 'flatRateWithStopsType', 'keyword': contractComment },
      { 'name': 'Effective Date', 'property': 'RatingRuleEffectiveDate', 'keyword': contractComment },
      { 'name': 'Expiration Date', 'property': 'RatingRuleExpirationDate', 'keyword': contractComment },
    ];
    this.getFieldNames = {
      'Agreement Default': 'agreementDefaultIndicator.keyword',
      'Contract': 'contractAssociations.contractDisplayName.keyword',
      'Business Unit and Service Offerings':
        'financeBusinessUnitServiceOfferingAssociations.financeBusinessUnitServiceOfferingDisplayName.keyword',
      'Section': 'sectionAssociations.customerAgreementContractSectionName.keyword',
      'City Substitution': 'citySubstitutionRadiusValue',
      'Hazmat Charge Rules': 'hazmatChargeRulesType.keyword',
      'Congestion Charge': 'congestionChargeType.keyword',
      'Flat Rate With Stops': 'flatRateWithStopsType.keyword',
      'Effective Date': 'effectiveDate.keyword',
      'Expiration Date': 'expirationDate.keyword'
    };
    this.getNestedRootVal = {
      'Business Unit and Service Offerings': 'financeBusinessUnitServiceOfferingAssociations',
      'Section': 'sectionAssociations',
      'Contract': 'contractAssociations'
    };
    this.ratingRulesDetail = {
      status: null,
      customerRatingRuleID: null,
      citySubstitutionIndicator: null,
      citySubstitutionRadiusValue: null,
      citySubstitutionUnitofLengthMesurement: null,
      effectiveDate: null,
      expirationDate: null,
      customerRatingRuleConfigurationViewDTOs: null,
      agreementDefaultFlag: null,
      businessUnitServiceOfferingViewDTOs: null,
      customerAgreementContractAssociationViewDTOs: null,
      customerAgreementContractSectionAssociationViewDTOs: null
    };
    this.effectiveDateRange  = {
      'range': {
        'RatingRuleEffectiveDate':  {
          'gte': '',
          'lte': '',
          'format':  'MM/dd/yyyy||yyyy'
        }
      }
    };
    this.expirationDateRange  =  {
      'range':  {
        'RatingRuleExpirationDate':  {
          'gte':  '',
          'lte':  '',
          'format':  'MM/dd/yyyy||yyyy'
        }
      }
    };
    this.defaultSearchFields  =  [
      'agreementDefaultIndicator.keyword',
      'citySubstitutionDisplayName.keyword',
      'hazmatChargeRulesType.keyword',
      'congestionChargeType.keyword',
      'flatRateWithStopsType.keyword',
      'effectiveDate.keyword',
      'expirationDate.keyword'
    ];
  }
}
