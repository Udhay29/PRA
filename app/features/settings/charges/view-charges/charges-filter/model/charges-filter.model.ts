import { EffectiveDateParameter, ExpirationDateParameter } from './charges-filter.interface';
export class ChargesFilterModel {
  sourceData: object;
  chargeTypeID: number;
  statusList: Array<object>;
  applicationLevel: Array<object>;
  quantityRequired: Array<object>;
  statusSelectedList: Array<object>;
  expirationActiveDateRange: object;
  expirationInactiveDateRange: object;
  effDateOnlyFlag: boolean;
  expDateOnlyFlag: boolean;
  effectiveDateValue: string;
  expirationDateValue: string;
  effectiveEndDate: string;
  effectiveStartDate: string;
  expirationEndDate: string;
  expirationStartDate: string;
  effSelectedType: string;
  expSelectedType: string;
  effectiveCheck: boolean;
  expirationCheck: boolean;
  effDateExactMatch: boolean;
  expDateExactMatch: boolean;
  effDateCheck: boolean;
  expDateCheck: boolean;
  dateFormat: string;
  expirationType: string;
  effectiveType: string;
  effectiveDateRange: string;
  expirationDateRange: string;
  isEffectivePanelClosed: boolean;
  isExpirationPanelClosed: boolean;
  effectiveDateParameter: EffectiveDateParameter;
  expirationDateParameter: ExpirationDateParameter;
  defaultEndDate: string;
  defaultStartDate: string;
  constructor() {
    this.statusSelectedList = [];
    this.effDateOnlyFlag = true;
    this.expDateOnlyFlag = true;
    this.isEffectivePanelClosed = true;
    this.isExpirationPanelClosed = true;
    this.effSelectedType = 'Date';
    this.expSelectedType = 'Date';
    this.effectiveType = 'date';
    this.expirationType = 'date';
    this.dateFormat = 'MM/DD/YYYY';
    this.defaultEndDate = '12/31/2099';
    this.defaultStartDate = '01/01/1992';
    this.effectiveDateParameter = {
      index: 4,
      queryField: 'EffectiveDate',
      lte: '',
      gte: '',
      unmatchExpirationDate: '',
      type: ''
    };
    this.expirationDateParameter = {
      index: 5,
      queryField: 'ExpirationDate',
      lte: '',
      gte: '',
      unmatchEffectiveDate: '',
      type: ''
    };
    this.statusList = [{
        'label': 'Active',
        'value': 'Active'
      },
      {
        'label': 'Inactive',
        'value': 'Inactive'
      }];

      this.applicationLevel =
      [{ 'label': 'Order', 'value': 1 },
      { 'label': 'Stop', 'value': 2 }];

      this.quantityRequired =
      [
        { label: 'Yes', value: 1 },
        { label: 'No', value: 2 }
      ];

      this.expirationActiveDateRange = {
        'range': {
          'ExpirationDate': {
            'gte': ''
          }
        }
      };
      this.expirationInactiveDateRange = {
        'range': {
          'ExpirationDate': {
            'lte': ''
          }
        }
      };
  }
}
