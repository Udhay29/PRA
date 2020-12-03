import { Component, Input, Output, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { DateFilterModel } from '../date-filter/model/date-filter.model';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateFilterComponent implements OnInit, OnDestroy {
  isChildMileageAccordianOpened = false;
  @Input() config: any;

  @Output() updatedQuery: EventEmitter<any> = new EventEmitter();
  @Output() isCollapsed: EventEmitter<boolean> = new EventEmitter();


  @Input() set dateFilterModel(selctedVal: DateFilterModel) {
    this.filterModel = selctedVal;
  }

  @Input() set query(selctedVal: object) {
    this.currentQuery = selctedVal;
  }
  isPanelClosed = true;
  startValue: Date;
  endValue: Date;
  startTimeValue: Date;
  endTimeValue: Date;
  isStartTimeSelected = false;
  isEndTimeSelected = false;
  filterModel: DateFilterModel;
  currentQuery: object;


  constructor(private readonly cdr: ChangeDetectorRef) {
    this.isChildMileageAccordianOpened = false;
   }

  ngOnInit() {
    this.filterModel[this.filterModel['effectiveExactMatchParameter']['dateName']] = '';
    this.filterModel[this.filterModel['effectiveParameter']['dateName']] = '';
    this.filterModel[this.filterModel['effectiveAndParameter']['dateName']] = '';
    this.filterModel[this.filterModel['dateRadioName']] = 'Date';
  }
  ngOnDestroy(): void {
    this.filterModel[this.filterModel.effectiveParameter['dateOnly']] = true;
  }
  onDateRangeBlur(dateParam) {
    const curretQuery = this.currentQuery;
    const boolList = curretQuery['query']['bool']['must'][dateParam.index]['bool'];
    if (this.filterModel[dateParam.dateName]) {
      if (boolList['must'].length < 1) {
        boolList['must'] = [{}];
      }
      this.dateQueryFormation(dateParam, boolList);
      this.setQueryRange(dateParam, boolList);
      this.nestedQueryFormation(dateParam.dateName, boolList, dateParam);
      this.filterModel['dateShowHide'][`${dateParam.dateName}Flag`] = true;
      this.updatedQuery.emit(curretQuery);
    } else if (boolList['must'].length <= 2 && this.filterModel['dateShowHide'][`${dateParam.dateName}Flag`]) {
      this.onClearDateCheck(dateParam, boolList, curretQuery);
    }
  }
  getDateQuery(keyVal: string, value: string, criteriaVal: string, matchFlag, rangeFlag): object {
    const dateQuery = { 'range': {} };
    dateQuery['range'][keyVal] = {};
    if (!matchFlag && rangeFlag) {
      dateQuery['range'][keyVal][criteriaVal] = value;
    } else {
      dateQuery['range'][keyVal]['lte'] = value;
      dateQuery['range'][keyVal]['gte'] = value;
    }
    return dateQuery;
  }
  dateQueryFormation(dateParam, boolList) {
    if (boolList['must'][dateParam.pointer] && boolList['must'][dateParam.pointer]['range']
      && Object.keys(boolList['must'][dateParam.pointer]['range'][dateParam.keyName]).length === 2 &&
      !this.filterModel[dateParam.dateOnly]) {
      boolList['must'][dateParam.pointer]['range'][dateParam.keyName][dateParam.level] = moment(this.filterModel[dateParam.dateName])
        .format(this.filterModel['dateFormat']);
    } else if (boolList['must'][dateParam.pointer] && Object.keys(boolList['must'][dateParam.pointer]).length === 0
      || this.filterModel[dateParam.dateOnly]) {
      boolList['must'][dateParam.pointer] = this.getDateQuery(dateParam.keyName,
        moment(this.filterModel[dateParam.dateName]).format(this.filterModel['dateFormat']), dateParam.level,
        this.filterModel[dateParam.exactMatch], this.filterModel[dateParam.dateOnly]);
    }
  }
  setQueryRange(dateParam, boolList) {
    let level1 = 'gte';
    if (!this.filterModel[dateParam.exactMatch] && boolList['must'][dateParam.pointer] && boolList['must'][dateParam.pointer]['range']
      && Object.keys(boolList['must'][dateParam.pointer]['range'][dateParam.keyName]).length === 1) {
      if (dateParam.level === 'gte') {
        level1 = 'lte';
      }
      boolList['must'][1] = {};
      boolList['must'][1]['range'] = {};
      boolList['must'][1]['range'][dateParam.keyNameOther] = {};
      boolList['must'][1]['range'][dateParam.keyNameOther][level1] =
        moment(this.filterModel[dateParam.dateName]).format(this.filterModel['dateFormat']);
    }
  }
  onClearDateCheck(dateParam, boolList, curretQuery) {
    if (this.filterModel[dateParam.dateOnly]) {
      boolList['must'] = [];
    } else {
      this.onClearNestedQueryFormation(dateParam.dateName, boolList, dateParam);
    }
    this.updatedQuery.emit(curretQuery);
  }
  matchExactDate(event: Event, dateParam) {
    this.filterModel[dateParam.exactMatch] = event;
    this.onDateRangeBlur(dateParam);
  }
  nestedQueryFormation(dateName: string, boolList, dateParam) {
    switch (true) {
      case (dateName === this.filterModel['effectiveParameter'].dateName && (Object.keys(boolList['must'][0]['range']
      [dateParam.keyName]).length === 2 && (!this.filterModel[this.filterModel['effectiveAndParameter'].dateName]))):
        boolList['must'][0]['range'][dateParam.keyName]['lte'] = this.filterModel['defaultEndDate'];
        break;
      case (dateName === this.filterModel['effectiveAndParameter'].dateName && (Object.keys(boolList['must'][0]['range']
      [dateParam.keyName]).length === 2 && (!this.filterModel[this.filterModel['effectiveParameter'].dateName]))):
        boolList['must'][0]['range'][dateParam.keyName]['gte'] = this.filterModel['defaultStartDate'];
        break;
      default:
    }
  }
  onClearNestedQueryFormation(dateName: string, boolList, dateParam) {
    switch (true) {
      case (dateName === this.filterModel['effectiveParameter'].dateName && (Object.keys(boolList['must'][0]['range']
      [dateParam.keyName]).length === 2 && (!!this.filterModel[this.filterModel['effectiveAndParameter'].dateName]))):
        boolList['must'][0]['range'][dateParam.keyName]['gte'] = this.filterModel['defaultStartDate'];
        break;
      case (dateName === this.filterModel['effectiveAndParameter'].dateName && (Object.keys(boolList['must'][0]['range']
      [dateParam.keyName]).length === 2 && (!!this.filterModel[this.filterModel['effectiveParameter'].dateName]))):
        boolList['must'][0]['range'][dateParam.keyName]['lte'] = this.filterModel['defaultEndDate'];
        break;
      default:
        boolList['must'] = [];
    }
  }
  onDateRangeSelect(dateParam) {
    this.filterModel['dateShowHide'][`${dateParam['dateName']}Flag`] = true;
    this.onDateRangeBlur(dateParam);
  }
  dateRadioToggle(isActiveflag: boolean, key: string, keyNameOther: string, keyNamePrimary: string,
    keyNameSecondary: string, index: number) {
    this.filterModel[key] = isActiveflag;
    this.clearDate(keyNameOther, keyNamePrimary, index, keyNameSecondary);
  }
  clearDate(keyNameOther: string, keyNamePrimary: string, index: number, keyNameSecondary?: string) {
    this.filterModel[keyNameOther] = '';
    this.filterModel[keyNamePrimary] = '';
    if (keyNameSecondary) {
      this.filterModel[keyNameSecondary] = '';
    }
    this.currentQuery['query']['bool']['must'][index]['bool']['must'] = [];
    this.updatedQuery.emit(this.currentQuery);
    this.cdr.detectChanges();
  }
  resetRadio(key: string, flagName: string, checkboxname: string, matchFlag: string) {
    this.filterModel[key] = 'Date';
    this.filterModel[flagName] = true;
    this.filterModel[matchFlag] = false;
    this[checkboxname] = '';
    this.cdr.detectChanges();
  }
}
