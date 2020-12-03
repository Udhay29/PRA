import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { DropdownObject, RegionTypeEvent } from './fuel-price-interface';

export class FuelPriceModel {
  isSubscribe: boolean;
  fuelPriceType: SelectItem[];
  fuelPriceForm: FormGroup;
  fuelPriceBasisTypes: SelectItem[];
  weekToApplyList: DropdownObject[];
  dayOfWeekList: DropdownObject[];
  priceFactorTypes: DropdownObject[];
  priceSource: DropdownObject[];
  delayForHoliday: DropdownObject[];
  weeksInAverage: DropdownObject[];
  selectedValue: number;
  selectedPriceFactor: string;
  isShowWeekAverage: boolean;
  isshowMonthAverage: boolean;
  agreementId: number;
  fuelProgramId: number;
  isPageLoading: boolean;
  regionType: SelectItem[];
  isAveraging: boolean;
  isShowPopup: boolean;
  isShowRegion: boolean;
  isShowRegionChange: boolean;
  regionvalue: RegionTypeEvent;
  selectedRegionType: RegionTypeEvent;
  regionalDistrictList: SelectItem[];
  regionalStateList: SelectItem[];
  regionTableColumnList: SelectItem[];
  regionTableList: string[];
  dayOfMonthList: DropdownObject[];
  monthsInAverageList: DropdownObject[];
  isSelectedWeekly: boolean;
  isSelectedMonthly: boolean;
  isSelectedLastDay: boolean;

  constructor() {
    this.isSubscribe = true;
    this.isPageLoading = false;
    this.isSelectedWeekly = true;
    this.isSelectedMonthly = false;
    this.fuelPriceBasisTypes = [
      {
        value: 1,
        label: 'Weekly'
      },
      {
        value: 2,
        label: 'Monthly'
      },
      {
        value: 3,
        label: 'Last Day of Month'
      }
    ];
    this.selectedValue = 1;
    this.weekToApplyList = [];
    this.dayOfWeekList = [];
    this.priceFactorTypes = [];
    this.priceSource = [];
    this.weeksInAverage = [];
    this.dayOfMonthList = [];
    this.monthsInAverageList = [];
    this.delayForHoliday = [
      {
        label: 'Yes',
        value: {
          label: 'Yes',
          value: 'Yes'
        }
      },
      {
        label: 'No',
        value: {
          label: 'No',
          value: 'No'
        }
      }
    ];
    this.isShowWeekAverage = false;
    this.isShowPopup = false;
    this.isShowRegionChange = false;
    this.isShowRegion = true;
    this.regionTableList = ['National'];
    this.regionTableColumnList = [];
    this.regionalDistrictList = [];
    this.regionalStateList = [{
      label: 'Defined Region States',
      value: 'Defined Region States'
    }];
    this.isshowMonthAverage = false;
    this.isSelectedLastDay = false;
  }
}
