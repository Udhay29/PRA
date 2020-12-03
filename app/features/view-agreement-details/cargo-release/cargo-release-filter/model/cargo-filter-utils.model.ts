import { ListItem } from './cargo-filter.interface';
export class CargoFilterUtilsModel {
  isPanelClosed: boolean;
  panelFlag: boolean;
  lazyFlag: boolean;
  filterParams: object;
  cargoAmount: number;
  statusList: Array<ListItem>;
  selectedList: Array<ListItem>;
  lastUpdateProgramList: Array<ListItem>;
  createdProgramList: Array<ListItem>;
  statusSelectedList: Array<object>;
  selectedKey: Array<any>;
  createdTimeValue: string;
  createdDateValue: string;
  updatedDateValue: string;
  updatedTimeValue: string;
  subscriberFlag: boolean;
  dateFormat: string;
  timeFormat: string;
  dateTimeFormat: string;
  effectiveDate: string;
  expirationDate: string;
  originalEffectiveDate: string;
  originalExpirationDate: string;
  defaultEndDate: string;
  defaultStartDate: string;
  defaultTimestamp: string;
  dateClearCheck: object;
  sourceData: object;
  constructor() {
    this.isPanelClosed = true;
    this.panelFlag = true;
    this.selectedList = [];
    this.statusSelectedList = [];
    this.selectedKey = [];
    this.lazyFlag = true;
    this.dateFormat = 'MM/DD/YYYY';
    this.timeFormat = 'HH:mm';
    this.dateTimeFormat = 'YYYY-DD-MMTHH:mm';
    this.filterParams = {};
    this.subscriberFlag = true;
    this.defaultEndDate = '12/31/2099';
    this.defaultStartDate = '01/01/1995';
    this.defaultTimestamp = '01/01/1995T00:00';
    this.dateClearCheck = {};
  }
}
