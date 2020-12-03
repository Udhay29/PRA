import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as utils from 'lodash';
import { CurrencyPipe } from '@angular/common';
import * as moment from 'moment-timezone';

import { FuelFilterModel } from './model/fuel-filter.model';
import { FuelFilterService } from './service/fuel-filter.service';
import { FilterConfigModel } from './model/filter-config.model';
import { FuelFilterQuery } from './query/fuel-filter.query';
import { ElasticRootObject } from './model/fuel-filter.interface';
import { TimeZoneService } from '../../../../../shared/jbh-app-services/time-zone.service';
import { FilterUtilityService } from './service/filter-utility.service';
@Component({
  selector: 'app-fuel-filter',
  templateUrl: './fuel-filter.component.html',
  styleUrls: ['./fuel-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrencyPipe, FilterUtilityService]
})
export class FuelFilterComponent implements OnInit {
  isFuelAccordianOpened = false;
  isEffcDateAccordianOpened = false;
  isExpDateAccordianOpened = false;
  isCreatedOnAccordianOpened = false;
  isUpdatedOnAccordianOpened = false;
  @ViewChildren('filtercomp') filterComponents;
  @Output() readonly filterSelected: EventEmitter<any> = new EventEmitter();
  filterModel: FuelFilterModel;
  filterConfig: FilterConfigModel;
  resetSourceFlag = true;
  resetRegionFlag = true;
  constructor(private readonly formBuilder: FormBuilder,
    private readonly fuelFilterService: FuelFilterService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly currencyPipe: CurrencyPipe,
    private readonly timeZoneService: TimeZoneService) {
    this.filterModel = new FuelFilterModel();
    this.filterConfig = new FilterConfigModel();
    FilterUtilityService.filterModel = this.filterModel;
    this.isFuelAccordianOpened = false;
    this.isEffcDateAccordianOpened = false;
    this.isExpDateAccordianOpened = false;
    this.isCreatedOnAccordianOpened = false;
    this.isUpdatedOnAccordianOpened = false;
  }

  ngOnInit() {
    this.filterConfig = this.fuelFilterService.getFilterConfig(this);
  }
  afterPanelToggle(collapsed: boolean, dateFieldsKey: string) {
    this.filterModel[dateFieldsKey] = collapsed;
  }
  onListingItemsSelected(filterValue, filterType: string) {
    if (filterValue.length > 0 && filterType) {
      this.filterModel.filterParams[filterType] = filterValue.map(element => {
        return element.value;
      });
    } else {
      this.filterModel.filterParams[filterType] = '*';
    }
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  onClearAllFilters(): void {
    this.filterComponents.forEach(filterCompItem => {
      if (filterCompItem.filterConfig['title'] !== 'Source' && filterCompItem.filterConfig['title'] !== 'Region') {
        filterCompItem.onReset(false);
      }
    });
    this.filterModel.createdOnDate = '';
    this.filterModel.createdOnTime = '';
    this.filterModel.updatedOnDate = '';
    this.filterModel.updatedOnTime = '';
    this.filterModel.effectiveDateValue = '';
    this.filterModel.expirationDateValue = '';
    this.filterModel.effectiveStartDate = '';
    this.filterModel.effectiveEndDate = '';
    this.filterModel.expirationEndDate = '';
    this.filterModel.expirationStartDate = '';
    this.resetSource(false);
    this.resetRegion(false);
    this.clearAmount();
    this.resetDateValues();
    this.filterModel.filterParams = FuelFilterQuery.getInitialJson();
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  resetDateValues() {
    this.filterModel.defaultSelect = 'Date';
    this.filterModel.effDateOnlyFlag = true;
    this.filterModel.effectiveCheck = false;
    this.filterModel.expDefaultSelect = 'Date';
    this.filterModel.expDateOnlyFlag = true;
    this.filterModel.expirationCheck = false;
  }
  resetSource(resetFlag: boolean) {
    if (resetFlag) {
      this.filterConfig.sourceData.expanded = true;
    } else {
      this.filterConfig.sourceData.expanded = false;
    }
    this.resetSourceFlag = false;
    this.changeDetector.detectChanges();
    this.resetSourceFlag = true;
    this.changeDetector.detectChanges();
    this.filterModel.filterParams['fuelPriceSourceTypeName'] = 'DOE';
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  resetRegion(resetFlag: boolean) {
    if (resetFlag) {
      this.filterConfig.regionData.expanded = true;
    } else {
      this.filterConfig.regionData.expanded = false;
    }
    this.resetRegionFlag = false;
    this.changeDetector.detectChanges();
    this.resetRegionFlag = true;
    this.changeDetector.detectChanges();
    this.filterModel.filterParams['fuelRegionName'] = 'National';
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  isSourceCollapsed(event) {
    if (event) {
      this.filterConfig.sourceData.expanded = false;
    } else {
      this.filterConfig.sourceData.expanded = true;
    }
  }
  isRegionCollapsed(event) {
    if (event) {
      this.filterConfig.regionData.expanded = false;
    } else {
      this.filterConfig.regionData.expanded = true;
    }
  }
  validateCurrency(value) {
    this.filterModel.errorFlag = false;
    if (value) {
      this.amountValidator(value);
      this.filterModel.filterParams['fuelPriceAmount'] = value;
      this.filterModel.currencyValue = value.trim();
    } else {
      this.filterModel.filterParams['fuelPriceAmount'] = '*';
    }
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  amountValidator(value) {
    if (!isNaN(value)) {
      this.filterModel.currencyValue = value.trim();
      this.filterModel.errorFlag = false;
    } else {
      this.filterModel.errorFlag = true;
    }
  }
  formatAmount(value) {
    this.filterModel.errorFlag = false;
    let formattedRateAmount;
    if (isNaN(value)) {
      this.filterModel.errorFlag = true;
    } else {
      if (value.includes('.')) {
        let dataVal = value.toString();
        dataVal = dataVal.split('.');
        if (dataVal[1].length > 2) {
          formattedRateAmount = this.currencyPipe.transform(value, '', '', '1.2-4');
          this.filterModel.currencyValue = formattedRateAmount.replace(/,/g, '').trim();
        }
      }
      this.filterModel.errorFlag = false;
    }
    this.filterModel.filterParams['fuelPriceAmount'] = this.filterModel.currencyValue;
  }
  clearAmount() {
    this.filterModel.errorFlag = false;
    this.filterModel.currencyValue = null;
    this.changeDetector.detectChanges();
    this.filterModel.filterParams['fuelPriceAmount'] = '*';
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  onCreateDate() {
    if (this.filterModel.createdOnDate) {
      if (this.filterModel.createdOnTime) {
        const createOnDate = moment(this.filterModel.createdOnDate).format(this.filterModel.dateFormat);
        const createOnTime = moment(this.filterModel.createdOnTime).format('HH:mm');
        this.filterModel.filterParams['createTimestamp'] =
          moment(`${createOnDate}${'T'}${createOnTime}`).format(this.filterModel.dateTimeFormat);
      } else {
        this.filterModel.filterParams['createTimestamp'] = moment(this.filterModel.createdOnDate).format(this.filterModel.dateFormat);
      }
    } else {
      this.filterModel.filterParams['createTimestamp'] = '*';
    }
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  onCreateTime() {
    if (this.filterModel.createdOnDate && this.filterModel.createdOnTime) {
      const createOnDate = moment(this.filterModel.createdOnDate).format(this.filterModel.dateFormat);
      const createOnTime = moment(this.filterModel.createdOnTime).format('HH:mm');
      this.filterModel.filterParams['createTimestamp'] =
        moment(`${createOnDate}${'T'}${createOnTime}`).format(this.filterModel.dateTimeFormat);
    } else {
      this.onCreateDate();
    }
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  onUpdateDate() {
    if (this.filterModel.updatedOnDate) {
      if (this.filterModel.updatedOnTime) {
        const updatedOnDate = moment(this.filterModel.updatedOnDate).format(this.filterModel.dateFormat);
        const updateOnTime = moment(this.filterModel.updatedOnTime).format('HH:mm');
        this.filterModel.filterParams['lastUpdateTimestamp'] =
          moment(`${updatedOnDate}${'T'}${updateOnTime}`).format(this.filterModel.dateTimeFormat);
      } else {
        this.filterModel.filterParams['lastUpdateTimestamp'] = moment(this.filterModel.updatedOnDate).format(this.filterModel.dateFormat);
      }
    } else {
      this.filterModel.filterParams['lastUpdateTimestamp'] = '*';
    }
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  onUpdateTime() {
    if (this.filterModel.updatedOnDate && this.filterModel.updatedOnTime) {
      const updatedOnDate = moment(this.filterModel.updatedOnDate).format(this.filterModel.dateFormat);
      const updateOnTime = moment(this.filterModel.updatedOnTime).format('HH:mm');
      this.filterModel.filterParams['lastUpdateTimestamp'] =
        moment(`${updatedOnDate}${'T'}${updateOnTime}`).format(this.filterModel.dateTimeFormat);
    } else {
      this.onCreateDate();
    }
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  clearDateValues(keyName1: string, keyName2: string, field: string) {
    this.filterModel[keyName1] = '';
    this.filterModel[keyName2] = '';
    this.changeDetector.detectChanges();
    this.filterModel.filterParams[field] = '*';
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  dateRadioToggle(flag: boolean, key: string, keyName1: string, keyName2: string, keyName3: string, field: string, type: string) {
    this.filterModel[key] = flag;
    this.clearDate(keyName1, keyName2, keyName3, field);
    this.filterModel.effectiveType = type;
  }
  clearDate(keyName1: string, keyName2: string, keyName3: string, field: string,
    defaultCheck?: string, defaultValue?: string, checkBox?: string) {
    this.filterModel[keyName1] = '';
    this.filterModel[keyName2] = '';
    this.filterModel[keyName3] = '';
    this.filterModel.filterParams[field] = '*';
    if (defaultCheck) {
      this.filterModel[defaultCheck] = 'Date';
      this.filterModel[defaultValue] = true;
      this.filterModel[checkBox] = false;
    }
    this.filterSelected.emit(this.filterModel.filterParams);
    this.changeDetector.detectChanges();
  }
  matchExactDate(event) {
    if (event) {
      this.filterModel.effectiveExactValue = true;
    } else {
      this.filterModel.effectiveExactValue = false;
    }
    this.onDateRangeSelect('effectiveDateValue');
  }
  effectiveKeyFinder() {
    let key = '';
    if (this.filterModel.effectiveType === 'date') {
      if (this.filterModel.effectiveExactValue) {
        key = 'effectiveExactMatch';
      } else {
        key = 'effectiveNonMatch';
      }
    } else {
      key = 'effectiveDateRange';
    }
    return key;
  }
  expirationMatchExactDate(event) {
    if (event) {
      this.filterModel.expirationExactValue = true;
    } else {
      this.filterModel.expirationExactValue = false;
    }
    this.onExpirationRangeSelect('expirationDateValue');
  }
  onDateRangeSelect(field: string) {
    const key = this.effectiveKeyFinder();
    const effectiveObj = {};
    if (this.filterModel[field] || key === 'effectiveDateRange') {
      switch (key) {
        case 'effectiveNonMatch':
          effectiveObj['type'] = key;
          effectiveObj['lte'] = moment(this.filterModel[field]).format(this.filterModel.dateFormat);
          break;
        case 'effectiveExactMatch':
          effectiveObj['type'] = key;
          effectiveObj['gte'] = moment(this.filterModel[field]).format(this.filterModel.dateFormat);
          effectiveObj['lte'] = moment(this.filterModel[field]).format(this.filterModel.dateFormat);
          break;
        case 'effectiveDateRange':
          this.validateDateRange(effectiveObj, 'effectiveStartDate', 'effectiveEndDate', key);
          break;
        default:
          break;
      }
    }
    this.filterModel.filterParams['effectiveDate'] = effectiveObj;
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  validateDateRange(dataObj, startDate: string, endDate: string, key: string) {
    if (this.filterModel[startDate] && this.filterModel[endDate]) {
      dataObj['gte'] = moment(this.filterModel[startDate]).format(this.filterModel.dateFormat);
      dataObj['lte'] = moment(this.filterModel[endDate]).format(this.filterModel.dateFormat);
      dataObj['type'] = key;
    } else if (this.filterModel[startDate] && !this.filterModel[endDate]) {
      dataObj['gte'] = moment(this.filterModel[startDate]).format(this.filterModel.dateFormat);
      dataObj['lte'] = '2099-12-31';
      dataObj['type'] = key;
    } else if (!this.filterModel[startDate] && this.filterModel[endDate]) {
      dataObj['gte'] = '1995-01-01';
      dataObj['lte'] = moment(this.filterModel[endDate]).format(this.filterModel.dateFormat);
      dataObj['type'] = key;
    }
  }
  expDateRadioToggle(flag: boolean, key: string, keyName1: string, keyName2: string, keyName3: string, field: string, type: string) {
    this.filterModel[key] = flag;
    this.clearDate(keyName1, keyName2, keyName3, field);
    this.filterModel.expirationType = type;
  }
  expirationKeyFinder() {
    let key = '';
    if (this.filterModel.expirationType === 'date') {
      if (this.filterModel.expirationExactValue) {
        key = 'expirationExactMatch';
      } else {
        key = 'expirationNonMatch';
      }
    } else {
      key = 'expirationDateRange';
    }
    return key;
  }
  onExpirationRangeSelect(field: string) {
    const key = this.expirationKeyFinder();
    const expirationObj = {};
    if (this.filterModel[field] || key === 'expirationDateRange') {
      switch (key) {
        case 'expirationNonMatch':
          expirationObj['type'] = key;
          expirationObj['lte'] = moment(this.filterModel[field]).format(this.filterModel.dateFormat);
          break;
        case 'expirationExactMatch':
          expirationObj['type'] = key;
          expirationObj['gte'] = moment(this.filterModel[field]).format(this.filterModel.dateFormat);
          expirationObj['lte'] = moment(this.filterModel[field]).format(this.filterModel.dateFormat);
          break;
        case 'expirationDateRange':
          this.validateDateRange(expirationObj, 'expirationStartDate', 'expirationEndDate', key);
          break;
        default:
          break;
      }
    }
    this.filterModel.filterParams['expirationDate'] = expirationObj;
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  sourceFramer = (data) => {
    const temp = utils.uniqBy(data['hits']['hits'], '_source.fuelPriceSourceTypeName');
    const tempLen = temp.length;
    const dataArray = [];
    for (let i = 0; i < tempLen; i++) {
      const obj = {
        label: temp[i]['_source']['fuelPriceSourceTypeName'],
        value: temp[i]['_source']['fuelPriceSourceTypeName']
      };
      dataArray.push(obj);
      if (temp[i]['_source']['fuelPriceSourceTypeName'].toLowerCase() === 'doe') {
        this.filterModel.sourceTypeList = [obj];
      }
    }
    return dataArray;
  }
  regionFramer = (data) => {
    const temp = utils.uniqBy(data['hits']['hits'], '_source.fuelRegionName');
    const tempLen = temp.length;
    const dataArray = [];
    for (let i = 0; i < tempLen; i++) {
      const obj = {
        label: temp[i]['_source']['fuelRegionName'],
        value: temp[i]['_source']['fuelRegionName']
      };
      dataArray.push(obj);
      if (temp[i]['_source']['fuelRegionName'].toLowerCase() === 'national') {
        this.filterModel.regionList = [obj];
      }
    }
    return dataArray;
  }


}
