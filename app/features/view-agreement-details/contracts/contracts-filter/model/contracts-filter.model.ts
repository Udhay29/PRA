import { FormGroup } from '@angular/forms';

import { DateParameter } from './contracts-filter.interface';

const ContractRangeEffDate = 'ContractRanges.ContractEffectiveDate';
const ContractRangeExpDate = 'ContractRanges.ContractExpirationDate';
export class ContractsFilterModel {
      filterForm: FormGroup;
      dateTimeFormat: string;
      isPanelClosed: boolean;
      effectiveData: boolean;
      updateOn: boolean;
      createdOn: boolean;
      originalData: boolean;
      lazyFlag: boolean;
      filterParams: object;
      cargoAmount: number;
      statusList: Array<object>;
      selectedList: Array<object>;
      selectedKey: Array<any>;
      statusSelectedList: Array<object>;
      startDate: string;
      endDate: string;
      expStartDate: string;
      expEndDate: string;
      updatedOnDate: string;
      updatedOnTime: string;
      OriginEffectiveDate: string;
      OriginExpirationDate: string;
      OriginalEffectiveDate: string;
      OriginalExpirationDate: string;
      createdOnDate: string;
      createdOnTime: string;
      sourceData: object;
      agreementID: number;
      dateFormat: string;
      timeFormat: string;
      dateShowHide: object;
      effDateOnlyFlag: boolean;
      effDateRangeOnlyFlag: boolean;
      expDateOnlyFlag: boolean;
      originalEffDateOnlyFlag: boolean;
      originalExpDateOnlyFlag: boolean;
      effDateExactMatch: string;
      effDateExactMatchFlag: boolean;
      expDateExactMatch: string;
      expDateExactMatchFlag: boolean;
      originalEffDateExactMatchFlag: boolean;
      originalEffDateExactMatch: string;
      originalExpDateExactMatchFlag: boolean;
      originalExpDateExactMatch: string;
      disableMatchFlag: boolean;
      defaultEndDate: string;
      defaultStartDate: string;
      effectiveParameter: DateParameter;
      effectiveAndParameter: DateParameter;
      expirationParameter: DateParameter;
      expirationAndParameter: DateParameter;
      originalEffectiveParameter: DateParameter;
      originalEffectiveAndParameter: DateParameter;
      originalExpirationParameter: DateParameter;
      originalExpirationAndParameter: DateParameter;
      effectiveExactMatchParameter: DateParameter;
      expirationExactMatchParameter: DateParameter;
      originalEffectiveExactMatchParameter: DateParameter;
      originalExpirationExactMatchParameter: DateParameter;

      constructor() {
            this.dateTimeFormat = 'YYYY-MM-DDTHH:mm';
            this.defaultEndDate = '2099-12-31';
            this.defaultStartDate = '1995-01-01';
            this.effDateExactMatchFlag = false;
            this.expDateExactMatchFlag = false;
            this.originalEffDateExactMatchFlag = false;
            this.originalExpDateExactMatchFlag = false;
            this.effDateOnlyFlag = true;
            this.expDateOnlyFlag = true;
            this.originalEffDateOnlyFlag = true;
            this.originalExpDateOnlyFlag = true;
            this.disableMatchFlag = true;
            this.isPanelClosed = true;
            this.effectiveData = true;
            this.updateOn = true;
            this.createdOn = true;
            this.originalData = true;
            this.selectedList = [];
            this.selectedKey = [];
            this.lazyFlag = true;
            this.filterParams = {};
            this.dateShowHide = {};
            this.dateFormat = 'YYYY-MM-DD';
            this.timeFormat = 'HH:mm';
            this.statusList = [{
                  'label': 'Active',
                  'value': 'Active'
            },
            {
                  'label': 'Inactive',
                  'value': 'Inactive'
            },
            {
                  'label': 'Deleted',
                  'value': 'Deleted'
            }];
            this.effectiveParameter = {
                  dateName: 'startDate',
                  keyName: ContractRangeEffDate,
                  keyName1: ContractRangeExpDate,
                  index: 4,
                  pointer: 0,
                  level: 'gte',
                  exactMatch: 'effDateExactMatchFlag',
                  dateOnly: 'effDateOnlyFlag'
            };
            this.effectiveAndParameter = {
                  dateName: 'endDate',
                  keyName: ContractRangeEffDate,
                  keyName1: ContractRangeExpDate,
                  index: 4,
                  pointer: 0,
                  level: 'lte',
                  exactMatch: 'effDateExactMatchFlag',
                  dateOnly: 'effDateOnlyFlag'
            };
            this.expirationParameter = {
                  dateName: 'expStartDate',
                  keyName: ContractRangeExpDate,
                  keyName1: ContractRangeEffDate,
                  index: 12,
                  pointer: 0,
                  level: 'gte',
                  exactMatch: 'expDateExactMatchFlag',
                  dateOnly: 'expDateOnlyFlag'
            };
            this.expirationAndParameter = {
                  dateName: 'expEndDate',
                  keyName: ContractRangeExpDate,
                  keyName1: ContractRangeEffDate,
                  index: 12,
                  pointer: 0,
                  level: 'lte',
                  exactMatch: 'expDateExactMatchFlag',
                  dateOnly: 'expDateOnlyFlag'
            };
            this.expirationExactMatchParameter = {
                  dateName: 'expDateExactMatch',
                  keyName: ContractRangeExpDate,
                  keyName1: ContractRangeEffDate,
                  index: 12,
                  pointer: 0,
                  level: 'gte',
                  exactMatch: 'expDateExactMatchFlag',
                  dateOnly: 'expDateOnlyFlag'
            };
            this.originalEffectiveParameter = {
                  dateName: 'OriginEffectiveDate',
                  keyName: 'ContractOriginalEffectiveDate',
                  keyName1: 'ContractOriginalExpirationDate',
                  index: 2,
                  pointer: 0,
                  level: 'gte',
                  exactMatch: 'originalEffDateExactMatchFlag',
                  dateOnly: 'originalEffDateOnlyFlag'
            };
            this.originalEffectiveAndParameter = {
                  dateName: 'OriginExpirationDate',
                  keyName: 'ContractOriginalEffectiveDate',
                  keyName1: 'ContractOriginalExpirationDate',
                  index: 2,
                  pointer: 0,
                  level: 'lte',
                  exactMatch: 'originalEffDateExactMatchFlag',
                  dateOnly: 'originalEffDateOnlyFlag'
            };
            this.originalEffectiveExactMatchParameter = {
                  dateName: 'originalEffDateExactMatch',
                  keyName: 'ContractOriginalEffectiveDate',
                  keyName1: 'ContractOriginalExpirationDate',
                  index: 2,
                  pointer: 0,
                  level: 'lte',
                  exactMatch: 'originalEffDateExactMatchFlag',
                  dateOnly: 'originalEffDateOnlyFlag'
            };
            this.originalExpirationParameter = {
                  dateName: 'OriginalEffectiveDate',
                  keyName: 'ContractOriginalExpirationDate',
                  keyName1: 'ContractOriginalEffectiveDate',
                  index: 3,
                  pointer: 0,
                  level: 'gte',
                  exactMatch: 'originalExpDateExactMatchFlag',
                  dateOnly: 'originalExpDateOnlyFlag'
            };
            this.originalExpirationAndParameter = {
                  dateName: 'OriginalExpirationDate',
                  keyName: 'ContractOriginalExpirationDate',
                  keyName1: 'ContractOriginalEffectiveDate',
                  index: 3,
                  pointer: 0,
                  level: 'lte',
                  exactMatch: 'originalExpDateExactMatchFlag',
                  dateOnly: 'originalExpDateOnlyFlag'
            };
            this.originalExpirationExactMatchParameter = {
                  dateName: 'originalExpDateExactMatch',
                  keyName: 'ContractOriginalExpirationDate',
                  keyName1: 'ContractOriginalEffectiveDate',
                  index: 3,
                  pointer: 0,
                  level: 'gte',
                  exactMatch: 'originalExpDateExactMatchFlag',
                  dateOnly: 'originalExpDateOnlyFlag'
            };
            this.effectiveExactMatchParameter = {
                  dateName: 'effDateExactMatch',
                  keyName: ContractRangeEffDate,
                  keyName1: ContractRangeExpDate,
                  index: 4,
                  pointer: 0,
                  level: 'lte',
                  exactMatch: 'effDateExactMatchFlag',
                  dateOnly: 'effDateOnlyFlag'
            };
      }
}
