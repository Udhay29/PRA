import {FuelPriceDetails, TableColumnList, FuelListDisplay} from './fuel-price-view.interface';

export class FuelPriceViewModel {
    tableColumns: Array<TableColumnList>;
    fuelListDisplay: FuelListDisplay[];
    fuelPriceItems: FuelPriceDetails[];
    subscriberFlag: boolean;
    responseData: Array<Object>;
    districtDataArray = [];
    constructor() {
      this.fuelListDisplay = [];
      this.fuelPriceItems = [];
      this.subscriberFlag = true;
        this.tableColumns = [{
            'name': 'Region',
            'property': 'region'
          },
          {
            'name': 'Region State Option',
            'property': 'regionStateOption'
          },
          {
            'name': 'Condition Name',
            'property': 'conditionName'
          },
          {
            'name': 'States',
            'property': 'states'
          },
        ];
    }
}
