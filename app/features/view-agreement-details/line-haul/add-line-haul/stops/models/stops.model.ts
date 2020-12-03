import { FormGroup } from '@angular/forms';

import { ListItemInterface, TableItemInterface } from './stops.interface';

export class StopsModel {
  geographyValues: ListItemInterface[];
  showAddStopBtn: boolean;
  subscribeFlag: boolean;
  rawData: any;
  stops: TableItemInterface[];
  isStopChargeIncluded: boolean;
  stopsForm: FormGroup;
  pointSuggestions: ListItemInterface[];
  countries: ListItemInterface[];
  geographyValuesTyped: ListItemInterface[];
  countryFiltered: ListItemInterface[];
  isConsecutive: boolean;
  invalidArray: Array<number>;
  addressStopList: Array<number>;
  locationStopList: Array<number>;
  postalStopList: Array<number>;
  cityStateStopList: Array<number>;
  totalStopList:  Array<number>;
  stateStopList: Array<number>;
  countryStopList: Array<number>;

  constructor() {
    this.geographyValues = [];
    this.showAddStopBtn = true;
    this.subscribeFlag = true;
    this.stops = [];
    this.isStopChargeIncluded = true;
    this.invalidArray = [];
    this.addressStopList = [];
    this.postalStopList = [];
    this.cityStateStopList = [];
    this.locationStopList = [];
    this.totalStopList = [];
    this.stateStopList = [];
    this.countryStopList = [];
  }
}
