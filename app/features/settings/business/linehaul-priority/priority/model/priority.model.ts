
import { Source } from './priority.interface';

export class PriorityModel {
  isPaginatorFlag: boolean;
  isSplitView: boolean;
  loading: boolean;
  tableColumns: Array<object>;
  gridRows: Source[];
  pageStart: number;
  tableSize: number;
  gridDataLength: number;
  isSubscribe: boolean;
  isEmptyFlag: boolean;
  getFieldNames: object;

  constructor() {
    this.isSubscribe = true;
    this.isSplitView = false;
    this.isPaginatorFlag = true;
    this.pageStart = 0;
    this.tableSize = 25;
    this.gridRows = [];
    this.isEmptyFlag = false;
    this.tableColumns = [
      { label: 'Origin Point Type', property: 'originPointPriorityGroupName' },
      { label: 'Destination Point Type', property: 'destinationPointPriorityGroupName' },
      { label: 'Priority', property: 'lineHaulPriorityGroupNumber' }
    ];
    this.getFieldNames = {
      'Origin Point Type': 'originPointPriorityGroupName.keyword',
      'Destination Point Type': 'destinationPointPriorityGroupName.keyword',
      'Priority': 'lineHaulPriorityGroupNumber.integer'
    };
  }

}
