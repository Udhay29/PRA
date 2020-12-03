import { Component, ChangeDetectorRef, EventEmitter, Input, OnInit, Output, ViewChildren, ComponentRef, ElementRef } from '@angular/core';
import * as utils from 'lodash';
import * as moment from 'moment-timezone';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ContractsFilterModel } from './model/contracts-filter.model';
import { ContractsFilterConfigModel } from './model/contracts-filter-config';
import { ContractsFilterService } from './services/contracts-filter.service';
import { ContractsService } from '../service/contracts.service';
import { ContractFilterUtility } from './services/contracts-filter.utility';
import { ContractsFilterQuery } from './query/contracts-filter.query';
import { TimeZoneService } from '../../../../shared/jbh-app-services/time-zone.service';
import { DateParameter } from './model/contracts-filter.interface';

@Component({
  selector: 'app-contracts-filter',
  templateUrl: './contracts-filter.component.html',
  styleUrls: ['./contracts-filter.component.scss'],
  providers: [ContractsFilterService, ContractFilterUtility, ContractsService]
})

export class ContractsFilterComponent implements OnInit {
  isEffecAccordianOpened = false;
  isExpirAccordianOpened = false;
  isUpdatedOnAccordianOpened = false;
  isCreatedAccordianOpened = false;
  isOriginalEffAccordianOpened = false;
  isOriginalExpAccordianOpened = false;
  @ViewChildren('filtercomp') filterComponents;
  @Output() loadData: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() agreementID: number;
  @Input()
  set sourceData(data: object) {
    this.filterModel.sourceData = data;
  }
  filterModel: ContractsFilterModel;
  filterConfig: ContractsFilterConfigModel;
  statusFlag = true;
  effDateRdio: string;
  expDateRdio: string;
  originEffDateRdio: string;
  originExpDateRdio: string;
  effDate: string;
  expDate: string;
  originEffDate: string;
  originExpDate: string;
  constructor(private readonly filterService: ContractsFilterService, private readonly timeZoneService: TimeZoneService,
    private readonly changeDetector: ChangeDetectorRef, private readonly fb: FormBuilder) {
    this.filterModel = new ContractsFilterModel();
    this.filterConfig = new ContractsFilterConfigModel();
    ContractFilterUtility.filterModel = this.filterModel;
    this.isEffecAccordianOpened = false;
    this.isExpirAccordianOpened = false;
    this.isUpdatedOnAccordianOpened = false;
    this.isCreatedAccordianOpened = false;
    this.isOriginalEffAccordianOpened = false;
    this.isOriginalEffAccordianOpened = false;
    this.isOriginalExpAccordianOpened = false;
  }

  ngOnInit() {
    this.filterModel.agreementID = this.agreementID;
    this.effDateRdio = 'Date';
    this.expDateRdio = 'Date';
    this.originEffDateRdio = 'Date';
    this.originExpDateRdio = 'Date';
    this.filterConfig = this.filterService.getFilterConfig(this.filterModel, this);
  }

  afterPanelToggle(collapsed: boolean, dateFieldsKey: string) {
    this.filterModel[dateFieldsKey] = collapsed;
  }

  onListingItemsSelected(event: Event, keyName: string, index: number) {
    const curretQuery = ContractsService.getElasticparam();
    const filterConditionsList = [];
    utils.forEach(event, (value) => {
      if (value && keyName === 'status') {
        filterConditionsList.push(ContractsFilterQuery.getStatusQuery(
          this.filterModel.sourceData['script'][value['label'].toLowerCase()]));
      } else {
        filterConditionsList.push(ContractsFilterQuery.getFilterQuery(keyName, value['label']));
      }
    });
    curretQuery['query']['bool']['must'][1]['nested']['query']['bool']['must'][index]['bool']['should'] =
      filterConditionsList;
    ContractsService.setElasticparam(curretQuery);
    this.loadData.emit(true);
  }
  onDateRangeBlur(dateParam: DateParameter) {
    const curretQuery = ContractsService.getElasticparam();
    let boolList = curretQuery['query']['bool']['must'][1]['nested']['query']['bool']['must'][dateParam.index]['bool'];
    if (dateParam.dateName === 'OriginExpirationDate' || dateParam.dateName === 'OriginEffectiveDate' ||
      dateParam.dateName === 'originalEffDateExactMatch' ||
      dateParam.dateName === 'OriginalEffectiveDate' || dateParam.dateName === 'OriginalExpirationDate' ||
      dateParam.dateName === 'originalExpDateExactMatch') {
      boolList = curretQuery['query']['bool']['must'][dateParam.index]['bool'];
    }
    if (this.filterModel[dateParam.dateName]) {
      if (boolList['must'].length < 1) {
        boolList['must'] = [{}];
      }
      this.dateQueryFormation(dateParam, boolList);
      this.setQueryRange(dateParam, boolList);
      this.nestedQueryFormation(dateParam.dateName, boolList);
      ContractsService.setElasticparam(curretQuery);
      this.filterModel.dateShowHide[`${dateParam.dateName}Flag`] = true;
      this.loadData.emit(true);
    } else if (boolList['must'].length <= 2 && this.filterModel.dateShowHide[`${dateParam.dateName}Flag`]) {
      this.onClearDateCheck(dateParam, boolList, curretQuery);
    }
  }
  dateQueryFormation(dateParam: DateParameter, boolList) {
    if (boolList['must'][dateParam.pointer] && boolList['must'][dateParam.pointer]['range']
      && Object.keys(boolList['must'][dateParam.pointer]['range'][dateParam.keyName]).length === 2 &&
      !this.filterModel[dateParam.dateOnly]) {
      boolList['must'][dateParam.pointer]['range'][dateParam.keyName][dateParam.level] = moment(this.filterModel[dateParam.dateName])
        .format(this.filterModel.dateFormat);
    } else if (boolList['must'][dateParam.pointer] && Object.keys(boolList['must'][dateParam.pointer]).length === 0
      || this.filterModel[dateParam.dateOnly]) {
      boolList['must'][dateParam.pointer] = ContractsFilterQuery.getDateQuery(dateParam.keyName,
        moment(this.filterModel[dateParam.dateName]).format(this.filterModel.dateFormat), dateParam.level,
        this.filterModel[dateParam.exactMatch], this.filterModel[dateParam.dateOnly]);
    }
  }
  setQueryRange(dateParam: DateParameter, boolList) {
    let level1 = 'gte';
    if (!this.filterModel[dateParam.exactMatch] && boolList['must'][dateParam.pointer] && boolList['must'][dateParam.pointer]['range']
      && Object.keys(boolList['must'][dateParam.pointer]['range'][dateParam.keyName]).length === 1) {
      if (dateParam.level === 'gte') {
        level1 = 'lte';
      }
      boolList['must'][1] = {};
      boolList['must'][1]['range'] = {};
      boolList['must'][1]['range'][dateParam.keyName1] = {};
      boolList['must'][1]['range'][dateParam.keyName1][level1] =
        moment(this.filterModel[dateParam.dateName]).format(this.filterModel.dateFormat);
    }
  }
  onClearDateCheck(dateParam: DateParameter, boolList, curretQuery) {
    if (this.filterModel[dateParam.dateOnly]) {
      boolList['must'] = [];
    } else {
      this.onClearNestedQueryFormation(dateParam.dateName, boolList);
    }
    ContractsService.setElasticparam(curretQuery);
    this.filterModel.dateShowHide[`${dateParam.dateName}Flag`] = false;
    this.loadData.emit(true);
  }
  matchExactDate(event: Event, dateParam: DateParameter) {
    if (event) {
      const curretQuery = ContractsService.getElasticparam();
      const boolList = curretQuery['query']['bool']['must'][1]['nested']['query']['bool']['must'][dateParam.index]['bool'];
      if (dateParam.dateName === 'originalEffDateExactMatch' || dateParam.dateName === 'originalExpDateExactMatch') {
        const originBoolList = curretQuery['query']['bool']['must'][dateParam.index]['bool'];
        originBoolList['must'] = [];
      } else if (boolList['must'][1] && boolList['must'][1]['range']
        && Object.keys(boolList['must'][1]['range'][dateParam.keyName1]).length === 1) {
        boolList['must'] = [];
      }
      ContractsService.setElasticparam(curretQuery);
    }
    this.filterModel[dateParam.exactMatch] = event;
    this.onDateRangeBlur(dateParam);
  }
  nestedQueryFormation(dateName: string, boolList) {
    const contractRangeEffectiveDate = 'ContractRanges.ContractEffectiveDate';
    const contractRangeExpirationDate = 'ContractRanges.ContractExpirationDate';
    switch (true) {
      case (dateName === 'startDate' && (Object.keys(boolList['must'][0]['range']
      [contractRangeEffectiveDate]).length === 2 && (!this.filterModel['endDate']))):
        boolList['must'][0]['range'][contractRangeEffectiveDate]['lte'] = this.filterModel.defaultEndDate;
        break;
      case (dateName === 'endDate' && (Object.keys(boolList['must'][0]['range']
      [contractRangeEffectiveDate]).length === 2 && (!this.filterModel['startDate']))):
        boolList['must'][0]['range'][contractRangeEffectiveDate]['gte'] = this.filterModel.defaultStartDate;
        break;
      case (dateName === 'OriginEffectiveDate' && (Object.keys(boolList['must'][0]['range']
      ['ContractOriginalEffectiveDate']).length === 2 && (!this.filterModel['OriginExpirationDate']))):
        boolList['must'][0]['range']['ContractOriginalEffectiveDate']['lte'] = this.filterModel.defaultEndDate;
        break;
      case (dateName === 'OriginExpirationDate' && (Object.keys(boolList['must'][0]['range']
      ['ContractOriginalEffectiveDate']).length === 2 &&
        (!this.filterModel['OriginEffectiveDate']))):
        boolList['must'][0]['range']['ContractOriginalEffectiveDate']['gte'] = this.filterModel.defaultStartDate;
        break;
      case (dateName === 'expStartDate' && (Object.keys(boolList['must'][0]['range']
      [contractRangeExpirationDate]).length === 2 && (!this.filterModel['expEndDate']))):
        boolList['must'][0]['range'][contractRangeExpirationDate]['lte'] = this.filterModel.defaultEndDate;
        break;
      case (dateName === 'expEndDate' && (Object.keys(boolList['must'][0]['range']
      [contractRangeExpirationDate]).length === 2 && (!this.filterModel['expStartDate']))):
        boolList['must'][0]['range'][contractRangeExpirationDate]['gte'] = this.filterModel.defaultStartDate;
        break;
      case (dateName === 'OriginalEffectiveDate' && (Object.keys(boolList['must'][0]['range']
      ['ContractOriginalExpirationDate']).length === 2 &&
        (!this.filterModel['OriginalExpirationDate']))):
        boolList['must'][0]['range']['ContractOriginalExpirationDate']['lte'] = this.filterModel.defaultEndDate;
        break;
      case (dateName === 'OriginalExpirationDate' && (Object.keys(boolList['must'][0]['range']
      ['ContractOriginalExpirationDate']).length === 2 &&
        (!this.filterModel['OriginalEffectiveDate']))):
        boolList['must'][0]['range']['ContractOriginalExpirationDate']['gte'] = this.filterModel.defaultStartDate;
        break;
    }
  }

  onClearNestedQueryFormation(dateName: string, boolList) {
    const contractRangeEffectiveDate = 'ContractRanges.ContractEffectiveDate';
    const contractRangeExpirationDate = 'ContractRanges.ContractExpirationDate';
    switch (true) {
      case (dateName === 'startDate' && (Object.keys(boolList['must'][0]['range']
      [contractRangeEffectiveDate]).length === 2 && (!!this.filterModel['endDate']))):
        boolList['must'][0]['range'][contractRangeEffectiveDate]['gte'] = this.filterModel.defaultStartDate;
        break;
      case (dateName === 'endDate' && (Object.keys(boolList['must'][0]['range']
      [contractRangeEffectiveDate]).length === 2 && (!!this.filterModel['startDate']))):
        boolList['must'][0]['range'][contractRangeEffectiveDate]['lte'] = this.filterModel.defaultEndDate;
        break;
      case (dateName === 'OriginEffectiveDate' && (Object.keys(boolList['must'][0]['range']
      ['ContractOriginalEffectiveDate']).length === 2 && (!!this.filterModel['OriginExpirationDate']))):
        boolList['must'][0]['range']['ContractOriginalEffectiveDate']['gte'] = this.filterModel.defaultStartDate;
        break;
      case (dateName === 'OriginExpirationDate' && (Object.keys(boolList['must'][0]['range']
      ['ContractOriginalEffectiveDate']).length === 2 &&
        (!!this.filterModel['OriginEffectiveDate']))):
        boolList['must'][0]['range']['ContractOriginalEffectiveDate']['lte'] = this.filterModel.defaultEndDate;
        break;
      case (dateName === 'expStartDate' && (Object.keys(boolList['must'][0]['range']
      [contractRangeExpirationDate]).length === 2 && (!!this.filterModel['expEndDate']))):
        boolList['must'][0]['range'][contractRangeExpirationDate]['gte'] = this.filterModel.defaultStartDate;
        break;
      case (dateName === 'expEndDate' && (Object.keys(boolList['must'][0]['range']
      [contractRangeExpirationDate]).length === 2 && (!!this.filterModel['expStartDate']))):
        boolList['must'][0]['range'][contractRangeExpirationDate]['lte'] = this.filterModel.defaultEndDate;
        break;
      case (dateName === 'OriginalEffectiveDate' && (Object.keys(boolList['must'][0]['range']
      ['ContractOriginalExpirationDate']).length === 2 &&
        (!!this.filterModel['OriginalExpirationDate']))):
        boolList['must'][0]['range']['ContractOriginalExpirationDate']['gte'] = this.filterModel.defaultStartDate;
        break;
      case (dateName === 'OriginalExpirationDate' && (Object.keys(boolList['must'][0]['range']
      ['ContractOriginalExpirationDate']).length === 2 && !!this.filterModel['OriginalEffectiveDate'])):
        boolList['must'][0]['range']['ContractOriginalExpirationDate']['lte'] = this.filterModel.defaultEndDate;
        break;
      default:
        boolList['must'] = [];
    }
  }

  originDateClear(keyName1: string, keyName2: string, keyName3: string, index: number) {
    this.filterModel[keyName1] = '';
    this.filterModel[keyName2] = '';
    this.filterModel[keyName3] = '';
    const curretQuery = ContractsService.getElasticparam();
    curretQuery['query']['bool']['must'][index]['bool']['must'] = [];
    ContractsService.setElasticparam(curretQuery);
    this.loadData.emit(true);
  }
  onDateRangeSelect(dateParam) {
    this.filterModel.dateShowHide[`${dateParam.dateName}Flag`] = true;
    this.onDateRangeBlur(dateParam);
  }
  onCreateDate(index: number) {
    const curretQuery = ContractsService.getElasticparam();
    const boolList = curretQuery['query']['bool']['must'][1]['nested']['query']['bool']['must'][index]['bool'];
    if (this.filterModel.createdOnDate) {
      if (this.filterModel.createdOnTime) {
        const createOnDate = moment(this.filterModel.createdOnDate).format(this.filterModel.dateFormat);
        const createOnTime = moment(this.filterModel.createdOnTime).format('HH:mm');
        const withDateTime: string = moment(createOnDate + 'T' + createOnTime).format('YYYY-MM-DDTHH:mm');
        boolList['must'] = ContractsFilterQuery.getCreateTimestamp(this.timeZoneService.convertDateTimetoUTC(withDateTime));
      } else {
        boolList['must'] = ContractsFilterQuery.getCreateTimestampDateOnly(
          this.timeZoneService.convertDateOnlytoUTC(this.filterModel.createdOnDate)[0],
          this.timeZoneService.convertDateOnlytoUTC(this.filterModel.createdOnDate)[1]);
      }
      ContractsService.setElasticparam(curretQuery);
      this.loadData.emit(true);
    } else {
      boolList['must'] = [];
      ContractsService.setElasticparam(curretQuery);
      this.loadData.emit(true);
    }
  }
  onCreateTime(index: number) {
    const curretQuery = ContractsService.getElasticparam();
    const boolList = curretQuery['query']['bool']['must'][1]['nested']['query']['bool']['must'][index]['bool'];
    if (this.filterModel.createdOnDate && this.filterModel.createdOnTime) {
      const createOnDate = moment(this.filterModel.createdOnDate).format(this.filterModel.dateFormat);
      const createOnTime = moment(this.filterModel.createdOnTime).format('HH:mm');
      const withDateTime: string = moment(createOnDate + 'T' + createOnTime).format('YYYY-MM-DDTHH:mm');
      boolList['must'] = ContractsFilterQuery.getCreateTimestamp(this.timeZoneService.convertDateTimetoUTC(withDateTime));
      ContractsService.setElasticparam(curretQuery);
      this.loadData.emit(true);
    } else {
      this.onCreateDate(index);
    }
  }
  onLastUpdateDate(index: number) {
    const curretQuery = ContractsService.getElasticparam();
    const boolList = curretQuery['query']['bool']['must'][1]['nested']['query']['bool']['must'][index]['bool'];
    if (this.filterModel.updatedOnDate) {
      if (this.filterModel.updatedOnTime) {
        const updateOnDate = moment(this.filterModel.updatedOnDate).format(this.filterModel.dateFormat);
        const updateOnTime = moment(this.filterModel.updatedOnTime).format('HH:mm');
        const withDateTimeUpdate: string = moment(updateOnDate + 'T' + updateOnTime).format('YYYY-MM-DDTHH:mm');
        boolList['must'] = ContractsFilterQuery.getLastUpdateTimestamp(this.timeZoneService.convertDateTimetoUTC(withDateTimeUpdate));
      } else {
        boolList['must'] = ContractsFilterQuery.getlastUpdatedDateOnly(
          this.timeZoneService.convertDateOnlytoUTC(this.filterModel.updatedOnDate)[0],
          this.timeZoneService.convertDateOnlytoUTC(this.filterModel.updatedOnDate)[1]);
      }
      ContractsService.setElasticparam(curretQuery);
      this.loadData.emit(true);
    } else {
      boolList['must'] = [];
      ContractsService.setElasticparam(curretQuery);
      this.loadData.emit(true);
    }
  }
  onLastUpdateTime(index: number) {
    const curretQuery = ContractsService.getElasticparam();
    const boolList = curretQuery['query']['bool']['must'][1]['nested']['query']['bool']['must'][index]['bool'];
    if (this.filterModel.updatedOnDate && this.filterModel.updatedOnTime) {
      const updateOnDate = moment(this.filterModel.updatedOnDate).format(this.filterModel.dateFormat);
      const updateOnTime = moment(this.filterModel.updatedOnTime).format('HH:mm');
      const withDateTimeUpdate: string = moment(updateOnDate + 'T' + updateOnTime).format('YYYY-MM-DDTHH:mm');
      boolList['must'] = ContractsFilterQuery.getLastUpdateTimestamp(this.timeZoneService.convertDateTimetoUTC(withDateTimeUpdate));
      ContractsService.setElasticparam(curretQuery);
      this.loadData.emit(true);
    } else {
      this.onLastUpdateDate(index);
    }
  }
  onSelectDate(methodName: string, index: number) {
    this[methodName](index);
  }
  resetRadio(key: string, flagName: string, checkboxname: string, matchFlag: string) {
    this[key] = 'Date';
    this.filterModel[flagName] = true;
    this.filterModel[matchFlag] = false;
    this[checkboxname] = '';
  }
  onClearAllFilters(): void {
    const curretQuery = ContractsService.getElasticparam();
    this.filterComponents.forEach(filterCompItem => {
      if (filterCompItem.filterConfig['title'] !== 'Status') {
        filterCompItem.onReset(false);
      }
    });
    this.effDateRdio = 'Date';
    this.expDateRdio = 'Date';
    this.originEffDateRdio = 'Date';
    this.originExpDateRdio = 'Date';
    this.effDate = '';
    this.expDate = '';
    this.originEffDate = '';
    this.originExpDate = '';
    this.filterModel.effDateOnlyFlag = true;
    this.filterModel.expDateOnlyFlag = true;
    this.filterModel.originalEffDateOnlyFlag = true;
    this.filterModel.originalExpDateOnlyFlag = true;
    this.filterModel.startDate = '';
    this.filterModel.endDate = '';
    this.filterModel.expStartDate = '';
    this.filterModel.expEndDate = '';
    this.filterModel.effDateExactMatch = '';
    this.filterModel.expDateExactMatch = '';
    this.filterModel.originalEffDateExactMatch = '';
    this.filterModel.originalExpDateExactMatch = '';
    this.filterModel.updatedOnDate = '';
    this.filterModel.updatedOnTime = '';
    this.filterModel.OriginEffectiveDate = '';
    this.filterModel.OriginExpirationDate = '';
    this.filterModel.OriginalEffectiveDate = '';
    this.filterModel.OriginalExpirationDate = '';
    this.filterModel.createdOnDate = '';
    this.filterModel.createdOnTime = '';
    this.filterModel.filterParams = [];
    this.filterModel.selectedList = [];
    this.filterModel.selectedKey = [];
    this.filterModel.disableMatchFlag = false;
    curretQuery['query']['bool']['must'][2]['bool']['must'] = [];
    curretQuery['query']['bool']['must'][3]['bool']['must'] = [];
    const currentQueryList = curretQuery['query']['bool']['must'][1]['nested']['query']['bool']['must'];
    for (let i = 1; i <= 12; i++) {
      if (currentQueryList[i]['bool']['should']) {
        currentQueryList[i]['bool']['should'] = [];
      } else {
        currentQueryList[i]['bool']['must'] = [];
      }
    }
    curretQuery['query']['bool']['must'][1]['nested']['query']['bool']['must'][5]['bool']['should'] =
      ContractsFilterQuery.getStatusQuery(this.filterModel.sourceData['script']['active']);
    this.resetStatus();
    ContractsService.setElasticparam(curretQuery);
    this.loadData.emit(true);
  }
  resetEvent(resetFlag: boolean) {
    if (resetFlag) {
      this.filterConfig.statusData.expanded = true;
      this.resetStatus();
      const currentQuery = ContractsService.getElasticparam();
      currentQuery['query']['bool']['must'][1]['nested']['query']['bool']['must'][5]['bool']['should'] =
        ContractsFilterQuery.getStatusQuery(this.filterModel.sourceData['script']['active']);
      ContractsService.setElasticparam(currentQuery);
      this.loadData.emit(true);
    }
  }
  resetStatus() {
    this.statusFlag = false;
    this.changeDetector.detectChanges();
    this.statusFlag = true;
    this.changeDetector.detectChanges();
  }
  isStatusCollapsed(event: boolean) {
    if (event) {
      this.filterConfig.statusData.expanded = false;
    } else {
      this.filterConfig.statusData.expanded = true;
    }
  }
  clearDate(keyName1: string, keyName2: string, index: number, keyName3?: string) {
    this.filterModel[keyName1] = '';
    this.filterModel[keyName2] = '';
    if (keyName3) {
      this.filterModel[keyName3] = '';
    }
    const curretQuery = ContractsService.getElasticparam();
    curretQuery['query']['bool']['must'][1]['nested']['query']['bool']['must'][index]['bool']['must'] = [];
    ContractsService.setElasticparam(curretQuery);
    this.loadData.emit(true);
  }

  statusFramer(data): Array<string> {
    const statusDataArray = [];
    if (data) {
      utils.forEach(data, (status: string) => {
        const obj = {
          label: status,
          value: status
        };
        if (status.toLowerCase() === 'active') {
          ContractFilterUtility.filterModel.statusSelectedList = [obj];
        }
        statusDataArray.push(obj);
      });
    }
    return statusDataArray;
  }
  dateRadioToggle(flag: boolean, key: string, keyName1: string, keyName2: string, keyName3: string, index: number) {
    this.filterModel[key] = flag;
    if (key === 'originalExpDateOnlyFlag' || key === 'originalEffDateOnlyFlag') {
      this.originDateClear(keyName1, keyName2, keyName3, index);
    } else {
      this.clearDate(keyName1, keyName2, index, keyName3);
    }
  }
}
