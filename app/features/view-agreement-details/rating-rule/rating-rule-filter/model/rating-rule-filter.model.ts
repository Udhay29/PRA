export class RatingRuleFilterModel {
  ruleCriterias: object;
  hazmatChargeRules: Array<object>;
  congestionChargeRules: Array<object>;
  flatRateWithStopsRules: Array<object>;
  agreementDefaultList: Array<object>;
  statusList: Array<object>;
  effectiveDate: string;
  expirationDate: string;
  isPanelClosed: boolean;
  statusSelectedList: Array<object>;
  dateFormat: string;
  defaultEndDate: string;
  defaultStartDate: string;
  dateClearCheck: object;
  showRadiusFlag: boolean;
  radius: number;
  selectedCitySubstitution: string;
  status?: boolean;

  constructor() {
    this.isPanelClosed = true;
    this.hazmatChargeRules = [];
    this.congestionChargeRules = [];
    this.flatRateWithStopsRules = [];
    this.statusSelectedList = [];
    this.dateFormat = 'MM/DD/YYYY';
    this.defaultEndDate = '12/31/2099';
    this.defaultStartDate = '01/01/1995';
    this.showRadiusFlag = false;
    this.selectedCitySubstitution = '';
    this.agreementDefaultList = [
      { label: 'Agreement Default', value: 'Agreement Default' },
    ];
    this.dateClearCheck = {};
  }
}
