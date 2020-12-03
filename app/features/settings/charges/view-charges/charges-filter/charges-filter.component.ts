import { Component, OnInit, ViewChildren, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ChargesFilterModel } from './model/charges-filter.model';
import { ChargesFilterConfigModel } from './model/charges-filter-config';
import { ChargesFilterService } from './service/charge-filter.service';
import { ChargesFilterUtility } from './service/charges-filter.utility';
import { ViewChargesQueryService } from '../../view-charges/services/view-charges-query.service';
import * as utils from 'lodash';
import * as moment from 'moment-timezone';
@Component({
  selector: 'app-charges-filter',
  templateUrl: './charges-filter.component.html',
  styleUrls: ['./charges-filter.component.scss']
})

export class ChargesFilterComponent implements OnInit {
  ischargesFilterEffcDateAccordianOpened = false;
  ischargesFilterExpDateAccordianOpened = false;
  @ViewChildren('filtercomp') filterComponents;
  statusFlag = true;
  @Output() loadData: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() chargeTypeID: number;
  @Input()
  set sourceData(data: object) {
    this.filterModel.sourceData = data;
  }
  filterModel: ChargesFilterModel;
  filterConfig: ChargesFilterConfigModel;
  effDateRdio: string;
  expDateRdio: string;
  constructor(private readonly filterService: ChargesFilterService, private readonly changeDetector: ChangeDetectorRef) {
    this.filterModel = new ChargesFilterModel();
    this.filterConfig = new ChargesFilterConfigModel();
    ChargesFilterUtility.filterModel = this.filterModel;
    this.ischargesFilterEffcDateAccordianOpened = false;
    this.ischargesFilterExpDateAccordianOpened = false;
  }

  ngOnInit() {
    this.filterModel.chargeTypeID = this.chargeTypeID;
    this.filterConfig = this.filterService.getFilterConfig(this.filterModel, this);
    this.effDateRdio = 'Date';
    this.filterModel.statusSelectedList = [{
      'label': 'Active',
      'value': 'Active'
    }];
  }

  statusFramer = (data) => {
    const statusDataArray = [];
    if (data) {
      utils.forEach(data.aggregations.status.buckets, (status: string) => {
        const obj = {
          label: status['key'],
          value: status['key']
        };
        if (status['key'].toLowerCase() === 'active') {
          this.filterModel.statusSelectedList = [obj];
        }
        statusDataArray.push(obj);
      });
    }
    return statusDataArray;
  }

  resetStatus() {
    this.statusFlag = false;
    this.changeDetector.detectChanges();
    this.statusFlag = true;
    this.changeDetector.detectChanges();
  }
  resetEvent(resetFlag: boolean) {
    if (resetFlag) {
      this.getChargeCodesByStatus(true, false);
      this.resetStatus();
      this.loadData.emit(true);
    }
  }
  isStatusCollapsed(event) {
    if (event) {
      this.filterConfig.status.expanded = false;
    } else {
      this.filterConfig.status.expanded = true;
    }
  }

  onClearAllFilters(): void {
    const curretQuery = ViewChargesQueryService.getElasticparam();
    this.effDateRdio = 'Date';
    curretQuery['query']['bool']['must'][0]['bool']['must'][8]['nested']['query']['query_string']['query'] = '*';
    curretQuery['query']['bool']['must'][0]['bool']['must'][0]['query_string']['query'] = '*';
    curretQuery['query']['bool']['must'][0]['bool']['must'][6]['nested']['query']['bool']['must'][1]['query_string']['query'] = '*';
    curretQuery['query']['bool']['must'][0]['bool']['must'][6]['nested']['query']['bool']['must'][0]['query_string']['query'] = '*';
    curretQuery['query']['bool']['must'][0]['bool']['must'][2]['query_string']['query'] = '*';
    curretQuery['query']['bool']['must'][0]['bool']['must'][3]['query_string']['query'] = '*';
    curretQuery['query']['bool']['must'][0]['bool']['must'][7]['nested']['query']['query_string']['query'] = '*';
    this.filterComponents.forEach(filterCompItem => {
      if (filterCompItem.filterConfig['title'] !== 'Status') {
        filterCompItem.onReset(false);
      }
    });
    ViewChargesQueryService.setElasticparam(curretQuery);
    this.resetEffectiveDate(null);
    this.resetExpiryDate(null);
    this.getChargeCodesByStatus(true, false);
    this.resetStatus();
    this.loadData.emit(true);
  }

  onStatusItemsSelected(event: Event, keyName: string) {
    const queryUsage = '';
    let isActive = false;
    let isInactive = false;
    utils.forEach(event, (status) => {
      if (status['value'].toLowerCase() === 'active') {
        isActive = true;
      }
      if (status['value'].toLowerCase() === 'inactive') {
        isInactive = true;
      }
    });
    this.getChargeCodesByStatus(isActive, isInactive);
    this.loadData.emit(true);
  }
  getChargeCodesByStatus(isActive, isInactive) {
    const curretQuery = ViewChargesQueryService.getElasticparam();
    const statusRange = curretQuery['query']['bool']['must'][0]['bool']['must'][9];
    statusRange['range']['ExpirationDate']['gte'] = this.filterModel.defaultStartDate;
    statusRange['range']['ExpirationDate']['lte'] = this.filterModel.defaultEndDate;
    if (isActive && !isInactive) {
      statusRange['range']['ExpirationDate']['gte'] = 'now/d';
    } else if (!isActive && isInactive) {
      statusRange['range']['ExpirationDate']['lte'] = 'now-1d';
    }
    ViewChargesQueryService.setElasticparam(curretQuery);
  }
  onUsageSelected(event: Event, keyName: string) {
    const curretQuery = ViewChargesQueryService.getElasticparam();
    let queryUsage = '';
    let removequeryusage = '*';
    utils.forEach(event, (usage) => {
      if (usage) {
        queryUsage = `${queryUsage}${'('}${usage['label']}${')'}${'OR'}`;
        removequeryusage = queryUsage.replace(/\w+?$/, '');
      }
    });
    curretQuery['query']['bool']['must'][0]['bool']['must'][7]['nested']['query']['query_string']['query'] = removequeryusage;
    ViewChargesQueryService.setElasticparam(curretQuery);
    this.loadData.emit(true);
  }

  onApplicationLevelSelected(event: Event, keyName: string) {
    const curretQuery = ViewChargesQueryService.getElasticparam();
    let queryUsage = '';
    let removequeryusage = '*';
    utils.forEach(event, (applicationLevel) => {
      if (applicationLevel) {
        queryUsage = `${queryUsage}${'('}${applicationLevel['label']}${')'}${'OR'}`;
        removequeryusage = queryUsage.replace(/\w+?$/, '');
      }
    });
    curretQuery['query']['bool']['must'][0]['bool']['must'][3]['query_string']['query'] = removequeryusage;
    ViewChargesQueryService.setElasticparam(curretQuery);
    this.loadData.emit(true);
  }

  onListingItemsSelected(event: Event, keyName: string) {
    const curretQuery = ViewChargesQueryService.getElasticparam();
    let chargeTypeData = '*';
    let queryUsage = '';
    utils.forEach(event, (listingItem) => {
      if (listingItem) {
        queryUsage = `${queryUsage}${'('}${listingItem['label']}${')'}${'OR'}`;
        chargeTypeData = queryUsage.replace(/\w+?$/, '');
      }
    });
    curretQuery['query']['bool']['must'][0]['bool']['must'][2]['query_string']['query'] = chargeTypeData;
    ViewChargesQueryService.setElasticparam(curretQuery);
    this.loadData.emit(true);
  }

  onBUItemsSelected(event: Event, keyName: string) {
    const curretQuery = ViewChargesQueryService.getElasticparam();
    let queryBU = '';
    let removeBUData = '*';
    utils.forEach(event, (buItem) => {
      if (buItem) {
        queryBU = `${queryBU}${'('}${buItem['label']}${')'}${'OR'}`;
        removeBUData = queryBU.replace(/\w+?$/, '');
      }
    });
    curretQuery['query']['bool']['must'][0]['bool']['must'][6]['nested']['query']['bool']['must'][0]['query_string']['query']
      = removeBUData;
    ViewChargesQueryService.setElasticparam(curretQuery);
    this.loadData.emit(true);
  }

  onServiceOfferingItemsSelected(event: Event, keyName: string) {
    const curretQuery = ViewChargesQueryService.getElasticparam();
    let queryServiceOffering = '';
    let removeServiceOfferingData = '*';
    utils.forEach(event, (serviceOfferingItem) => {
      if (serviceOfferingItem) {
        queryServiceOffering = `${queryServiceOffering}${'('}${serviceOfferingItem['label']}${')'}${'OR'}`;
        removeServiceOfferingData = queryServiceOffering.replace(/\w+?$/, '');
      }
    });
    curretQuery['query']['bool']['must'][0]['bool']['must'][6]['nested']['query']['bool']['must'][1]['query_string']['query']
      = removeServiceOfferingData;
    ViewChargesQueryService.setElasticparam(curretQuery);
    this.loadData.emit(true);
  }

  onChargeTypeSelected(event, keyName: string) {
    const curretQuery = ViewChargesQueryService.getElasticparam();
    let chargeTypeData = '*';
    let queryChargeType = '';
    utils.forEach(event, (chargeTypeValue) => {
      if (chargeTypeValue) {
        chargeTypeValue = `*${chargeTypeValue['label'].replace(/[()]/g, '\\$&')}*`;
        queryChargeType = `${queryChargeType}${'('}${chargeTypeValue}${')'}${'OR'}`;
        chargeTypeData = queryChargeType.replace(/\w+?$/, '');
      }
    });
    curretQuery['query']['bool']['must'][0]['bool']['must'][0]['query_string']['query'] = chargeTypeData;
    ViewChargesQueryService.setElasticparam(curretQuery);
    this.loadData.emit(true);
  }

  onRateTypeSelected(event) {
    const curretQuery = ViewChargesQueryService.getElasticparam();
    let rateTypeData = '*';
    let queryRateTypeType = '';

    event.forEach( (rateType, index) => {
        if (index === 0) {
        queryRateTypeType = `${rateType['label']}`;
        rateTypeData = queryRateTypeType.replace(' ', '\\$&');
        } else {
          const rateTypeData1 = rateType['label'].replace(' ', '\\$&');
          rateTypeData = `${rateTypeData}${' OR '}${rateTypeData1}`;
        }
    });
    curretQuery['query']['bool']['must'][0]['bool']['must'][8]['nested']['query']['query_string']['query'] = rateTypeData;
    ViewChargesQueryService.setElasticparam(curretQuery);
    this.loadData.emit(true);
  }

  afterPanelToggle(collapsed: boolean, dateFieldsKey: string) {
    this.filterModel[dateFieldsKey] = collapsed;
  }
  effDateRadioToggle(flag: boolean, key: string, fieldType: string) {
    const effDateFields = ['effectiveDateValue', 'effectiveStartDate', 'effectiveEndDate'];
    this.filterModel[key] = flag;
    this.filterModel.effectiveType = fieldType;
    this.filterModel.effDateCheck = false;
    this.filterModel.effDateExactMatch = false;
    this.clearDateFields(effDateFields);
    this.createDateRangeParams();
    this.loadData.emit(true);
  }
  expDateRadioToggle(flag: boolean, key: string, fieldType: string) {
    const expDateFields = ['expirationDateValue', 'expirationStartDate', 'expirationEndDate'];
    this.filterModel[key] = flag;
    this.filterModel.expirationType = fieldType;
    this.filterModel.expDateCheck = false;
    this.filterModel.expDateExactMatch = false;
    this.clearDateFields(expDateFields);
    this.createDateRangeParams();
    this.loadData.emit(true);
  }
  clearDateFields(dateFields) {
    dateFields.forEach((fieldName) => {
      this.filterModel[fieldName] = '';
    });
  }
  onEffDateRangeSelect() {
    this.createDateRangeParams();
    this.loadData.emit(true);
  }
  onExpDateRangeSelect() {
    this.createDateRangeParams();
    this.loadData.emit(true);
  }
  matchExactDate(event, field: string) {
    if (event) {
      this.filterModel[field] = true;
    } else {
      this.filterModel[field] = false;
    }
    this.createDateRangeParams();
    this.loadData.emit(true);
  }
  setDateQuery(effectiveObj) {
    const curretQuery = ViewChargesQueryService.getElasticparam();
    const index = effectiveObj['index'];
    const fieldName = effectiveObj['queryField'];
    const dateRangeQuery = curretQuery['query']['bool']['must'][0]['bool']['must'][index]['range'][fieldName];
    dateRangeQuery['gte'] = effectiveObj['gte'];
    dateRangeQuery['lte'] = effectiveObj['lte'];
    ViewChargesQueryService.setElasticparam(curretQuery);
  }
  createDateRangeParams() {
    const expirationKey = this.expirationKeyFinder();
    const effectiveKey = this.effectiveKeyFinder();
    this.setEffectiveDateParams(effectiveKey);
    this.setExpirationDateParams(expirationKey);
    this.setUnmatchDateParams(effectiveKey, expirationKey);
    this.setDateQuery(this.filterModel.effectiveDateParameter);
    this.setDateQuery(this.filterModel.expirationDateParameter);
    this.resetDateParams();
  }
  setEffectiveDateParams(effectiveKey: string) {
    this.filterModel.effectiveDateParameter['lte'] = this.filterModel.defaultEndDate;
    this.filterModel.effectiveDateParameter['gte'] = this.filterModel.defaultStartDate;
    if (this.filterModel['effectiveDateValue'] || this.filterModel['effectiveStartDate']
      || this.filterModel['effectiveEndDate'] || effectiveKey === 'effectiveDateRange') {
      switch (effectiveKey) {
        case 'effectiveNonMatch':
          const effDateNonMatch = moment(this.filterModel['effectiveDateValue']).format(this.filterModel.dateFormat);
          this.filterModel.effectiveDateParameter['type'] = effectiveKey;
          this.filterModel.effectiveDateParameter['lte'] = effDateNonMatch;
          this.filterModel.effectiveDateParameter['unmatchExpirationDate'] = effDateNonMatch;
          break;
        case 'effectiveExactMatch':
          const effDateMatch = moment(this.filterModel['effectiveDateValue']).format(this.filterModel.dateFormat);
          this.filterModel.effectiveDateParameter['type'] = effectiveKey;
          this.filterModel.effectiveDateParameter['gte'] = effDateMatch;
          this.filterModel.effectiveDateParameter['lte'] = effDateMatch;
          break;
        case 'effectiveDateRange':
          this.validateDateRange(this.filterModel.effectiveDateParameter, 'effectiveStartDate', 'effectiveEndDate', effectiveKey);
          break;
        default:
          break;
      }
    }
  }
  setExpirationDateParams(expirationKey: string) {
    this.filterModel.expirationDateParameter['lte'] = this.filterModel.defaultEndDate;
    this.filterModel.expirationDateParameter['gte'] = this.filterModel.defaultStartDate;
    if (this.filterModel['expirationDateValue'] || this.filterModel['expirationStartDate']
      || this.filterModel['expirationEndDate'] || expirationKey === 'expirationDateRange') {
      switch (expirationKey) {
        case 'expirationNonMatch':
          const expDateUnMatch = moment(this.filterModel['expirationDateValue']).format(this.filterModel.dateFormat);
          this.filterModel.expirationDateParameter['type'] = expirationKey;
          this.filterModel.expirationDateParameter['gte'] = expDateUnMatch;
          this.filterModel.expirationDateParameter['unmatchEffectiveDate'] = expDateUnMatch;
          break;
        case 'expirationExactMatch':
          const expDateExactMatch = moment(this.filterModel['expirationDateValue']).format(this.filterModel.dateFormat);
          this.filterModel.expirationDateParameter['type'] = expirationKey;
          this.filterModel.expirationDateParameter['gte'] = expDateExactMatch;
          this.filterModel.expirationDateParameter['lte'] = expDateExactMatch;
          break;
        case 'expirationDateRange':
          this.validateDateRange(this.filterModel.expirationDateParameter, 'expirationStartDate', 'expirationEndDate', expirationKey);
          break;
        default:
          break;
      }
    }
  }
  setUnmatchDateParams(effectiveKey: string, expirationKey: string) {
    const expGteDate = this.filterModel.expirationDateParameter['gte'];
    const effLteDate = this.filterModel.effectiveDateParameter['lte'];
    const effUnmatchExpDate = this.filterModel.effectiveDateParameter['unmatchExpirationDate'];
    const expUnmatchEffDate = this.filterModel.expirationDateParameter['unmatchEffectiveDate'];
    if (expirationKey && expirationKey !== 'expirationExactMatch' && effUnmatchExpDate) {
      const isDateGreater = this.isGreaterDate(effUnmatchExpDate, expGteDate);
      this.filterModel.expirationDateParameter['gte'] = isDateGreater ? effUnmatchExpDate : expGteDate;
    }
    if (effectiveKey && effectiveKey !== 'effectiveExactMatch' && expUnmatchEffDate) {
      const isDateLess = this.isLessDate(expUnmatchEffDate, effLteDate);
      this.filterModel.effectiveDateParameter['lte'] = isDateLess ? expUnmatchEffDate : effLteDate;
    }
  }
  resetDateParams() {
    Object.keys(this.filterModel['effectiveDateParameter']).forEach(effKey => {
      if (effKey !== 'index' && effKey !== 'queryField') {
        this.filterModel['effectiveDateParameter'][effKey] = '';
      }
    });
    Object.keys(this.filterModel['expirationDateParameter']).forEach(expKey => {
      if (expKey !== 'index' && expKey !== 'queryField') {
        this.filterModel['expirationDateParameter'][expKey] = '';
      }
    });
  }
  validateDateRange(dataObj, startDate: string, endDate: string, key: string) {
    if (this.filterModel[startDate] && this.filterModel[endDate]) {
      dataObj['gte'] = moment(this.filterModel[startDate]).format(this.filterModel.dateFormat);
      dataObj['lte'] = moment(this.filterModel[endDate]).format(this.filterModel.dateFormat);
      dataObj['type'] = key;
    } else if (this.filterModel[startDate] && !this.filterModel[endDate]) {
      dataObj['gte'] = moment(this.filterModel[startDate]).format(this.filterModel.dateFormat);
      dataObj['lte'] = this.filterModel.defaultEndDate;
      dataObj['type'] = key;
    } else if (!this.filterModel[startDate] && this.filterModel[endDate]) {
      dataObj['gte'] = this.filterModel.defaultStartDate;
      dataObj['lte'] = moment(this.filterModel[endDate]).format(this.filterModel.dateFormat);
      dataObj['type'] = key;
    }
  }
  effectiveKeyFinder() {
    let key = '';
    if (this.filterModel.effectiveType === 'date') {
      if (this.filterModel.effDateExactMatch) {
        key = 'effectiveExactMatch';
      } else {
        key = 'effectiveNonMatch';
      }
    } else if (this.filterModel.effectiveType === 'dateRange') {
      key = 'effectiveDateRange';
    }
    return key;
  }
  expirationKeyFinder() {
    let key = '';
    if (this.filterModel.expirationType === 'date') {
      if (this.filterModel.expDateExactMatch) {
        key = 'expirationExactMatch';
      } else {
        key = 'expirationNonMatch';
      }
    } else if (this.filterModel.expirationType === 'dateRange') {
      key = 'expirationDateRange';
    }
    return key;
  }
  resetEffectiveDate(isResetButton) {
    const effDateFields = ['effectiveDateValue', 'effectiveStartDate', 'effectiveEndDate'];
    this.filterModel['effDateOnlyFlag'] = true;
    this.clearDateFields(effDateFields);
    this.filterModel.effSelectedType = 'Date';
    this.filterModel.effectiveType = 'date';
    this.filterModel.effDateCheck = false;
    this.filterModel.effDateExactMatch = false;
    this.createDateRangeParams();
    if (isResetButton) {
      this.loadData.emit(true);
    }
  }
  resetExpiryDate(isResetButton) {
    const expDateFields = ['expirationDateValue', 'expirationStartDate', 'expirationEndDate'];
    this.filterModel['expDateOnlyFlag'] = true;
    this.clearDateFields(expDateFields);
    this.filterModel.expSelectedType = 'Date';
    this.filterModel.expirationType = 'date';
    this.filterModel.expDateCheck = false;
    this.filterModel.expDateExactMatch = false;
    this.createDateRangeParams();
    if (isResetButton) {
      this.loadData.emit(true);
    }
  }
  isGreaterDate(date1: string, date2: string) {
    if (new Date(date1) > new Date(date2)) {
      return true;
    } else {
      return false;
    }
  }
  isLessDate(dateObj1: string, dateObj2: string) {
    if (new Date(dateObj1) < new Date(dateObj2)) {
      return true;
    } else {
      return false;
    }
  }
}
