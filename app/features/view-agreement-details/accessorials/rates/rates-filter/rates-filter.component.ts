import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';

import * as utils from 'lodash';
import * as moment from 'moment-timezone';

import { RateFilterModel } from './model/rates-filter.model';

@Component({
  selector: 'app-rates-filter',
  templateUrl: './rates-filter.component.html',
  styleUrls: ['./rates-filter.component.scss']
})
export class RatesFilterComponent implements OnInit {
  @Output() readonly filterSelected: EventEmitter<any> = new EventEmitter();

  filterModel: RateFilterModel;
  effDateRdio: string;
  constructor(private readonly changeDetector: ChangeDetectorRef) {
    this.filterModel = new RateFilterModel();
  }

  ngOnInit() {
    this.effDateRdio = 'Date';
  }
  onClearAllFilters(): void {
    this.filterModel.effectiveDateValue = '';
    this.filterModel.expirationDateValue = '';
    this.filterModel.effectiveStartDate = '';
    this.filterModel.effectiveEndDate = '';
    this.filterModel.expirationEndDate = '';
    this.filterModel.expirationStartDate = '';
    this.resetDateValues();
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  resetDateValues() {
    this.filterModel.filterParams['effectiveDate'] = '*';
    this.filterModel.filterParams['expirationDate'] = '*';
    this.filterModel.effectiveType = 'Date';
    this.filterModel.expirationType = 'Date';
    this.filterModel.defaultSelect = 'Date';
    this.filterModel.effDateOnlyFlag = true;
    this.filterModel.effectiveCheck = false;
    this.filterModel.effectiveExactValue = false;
    this.filterModel.expDefaultSelect = 'Date';
    this.filterModel.expDateOnlyFlag = true;
    this.filterModel.expirationCheck = false;
    this.filterModel.expirationExactValue = false;
  }
  dateRadioToggle(flag: boolean, key: string, keyName1: string, keyName2: string, keyName3: string, field: string, type: string) {
    this.filterModel.effectiveCheck = false;
    this.filterModel.effectiveExactValue = false;
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
      this.checkboxReset(checkBox);
    }
    this.filterSelected.emit(this.filterModel.filterParams);
    this.changeDetector.detectChanges();
  }
  checkboxReset(checkBox: string) {
    if (checkBox === 'effectiveCheck') {
      this.filterModel.effectiveExactValue = false;
      this.filterModel.effectiveType = 'Date';
    } else if (checkBox === 'expirationCheck') {
      this.filterModel.expirationType = 'Date';
      this.filterModel.expirationExactValue = false;
    }
  }
  matchExactDate(event) {
    this.filterModel.effectiveExactValue = this.checkForEvent(event);
    this.onDateRangeSelect('effectiveDateValue');
  }
  effectiveKeyFinder() {
    let key = '';
    if (this.filterModel.effectiveType === 'Date') {
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
          this.validateDateRangeEffective(effectiveObj, 'effectiveStartDate', 'effectiveEndDate', key);
          break;
        default:
      }
    }
    this.filterModel.filterParams['effectiveDate'] = effectiveObj;
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  validateDateRangeEffective(dataObj, startDate: string, endDate: string, key: string) {
    const startingDate = moment(this.filterModel[startDate]).format(this.filterModel.dateFormat);
    const endingDate = moment(this.filterModel[endDate]).format(this.filterModel.dateFormat);
    let maxDate;
    let minDate;
    if (startingDate > endingDate) {
      maxDate = startingDate;
      minDate = endingDate;
    } else {
      maxDate = endingDate;
      minDate = startingDate;
    }
    if (this.filterModel[startDate] && this.filterModel[endDate]) {
      dataObj['gte'] = minDate;
      dataObj['lte'] = maxDate;
      dataObj['type'] = key;
    } else if (this.filterModel[startDate] && !this.filterModel[endDate]) {
      dataObj['gte'] = '01/01/1995';
      dataObj['lte'] = moment(this.filterModel[startDate]).format(this.filterModel.dateFormat);
      dataObj['type'] = key;
    } else if (!this.filterModel[startDate] && this.filterModel[endDate]) {
      dataObj['gte'] = '01/01/1995';
      dataObj['lte'] = moment(this.filterModel[endDate]).format(this.filterModel.dateFormat);
      dataObj['type'] = key;
    }
  }
  expDateRadioToggle(flag: boolean, key: string, keyName1: string, keyName2: string, keyName3: string, field: string, type: string) {
    this.filterModel.expirationCheck = false;
    this.filterModel.expirationExactValue = false;
    this.filterModel[key] = flag;
    this.clearDate(keyName1, keyName2, keyName3, field);
    this.filterModel.expirationType = type;
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
          this.validateDateRangeExpiration(expirationObj, 'expirationStartDate', 'expirationEndDate', key);
          break;
        default:
      }
    }
    this.filterModel.filterParams['expirationDate'] = expirationObj;
    this.filterSelected.emit(this.filterModel.filterParams);
  }
  validateDateRangeExpiration(dataObj, startDate: string, endDate: string, key: string) {
    const startingDate = moment(this.filterModel[startDate]).format(this.filterModel.dateFormat);
    const endingDate = moment(this.filterModel[endDate]).format(this.filterModel.dateFormat);
    let maxDate;
    let minDate;
    if (startingDate > endingDate) {
      maxDate = startingDate;
      minDate = endingDate;
    } else {
      maxDate = endingDate;
      minDate = startingDate;
    }
    if (this.filterModel[startDate] && this.filterModel[endDate]) {
      dataObj['gte'] = minDate;
      dataObj['lte'] = maxDate;
      dataObj['type'] = key;
    } else if (this.filterModel[startDate] && !this.filterModel[endDate]) {
      dataObj['gte'] = moment(this.filterModel[startDate]).format(this.filterModel.dateFormat);
      dataObj['lte'] = '12/31/2099';
      dataObj['type'] = key;
    } else if (!this.filterModel[startDate] && this.filterModel[endDate]) {
      dataObj['gte'] = moment(this.filterModel[endDate]).format(this.filterModel.dateFormat);
      dataObj['lte'] = '12/31/2099';
      dataObj['type'] = key;
    }
  }
  expirationKeyFinder() {
    let key = '';
    if (this.filterModel.expirationType === 'Date') {
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
  expirationMatchExactDate(event) {
    this.filterModel.expirationExactValue = this.checkForEvent(event);
    this.onExpirationRangeSelect('expirationDateValue');
  }
  checkForEvent(event) {
    if (event) {
      return true;
    } else {
      return false;
    }
  }
  onSegmentTabOpen(event) {
    this.filterModel.openedAccordions.push(event.index);
  }

  onSegmentTabClose(event) {
    this.filterModel.openedAccordions.splice(this.filterModel.openedAccordions.indexOf(event.index, 1));
  }
}
