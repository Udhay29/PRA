import { Component, OnInit, ViewChildren, Output, Input, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { SectionsFilterModel } from './model/sections-filter.model';
import { SectionsFilterConfigModel } from './model/sections-filter-config';
import { SectionFilterUtility } from './services/sections-filter.utility';
import { SectionsFilterService } from './services/sections-filter.service';
import { SectionsService } from '../service/sections.service';
import { SectionsFilterQuery } from '../query/sections-list.query';
import { FormBuilder } from '@angular/forms';
import { TimeZoneService } from '../../../../shared/jbh-app-services/time-zone.service';
import * as lodashUtils from 'lodash';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-sections-filter',
  templateUrl: './sections-filter.component.html',
  styleUrls: ['./sections-filter.component.scss']
})
export class SectionsFilterComponent implements OnInit {
  isPanelClosed = false;
  isSectionAccordianOpened = false;
  isAuditAccordianOpened = false;
  isCreatedOnAuditAccordianOpened = false;
  isUpdatedOnAuditAccordianOpened = false;
  @ViewChildren('filtercomp') filterComponents;
  @Output() loadData: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() agreementID: number;
  @Input()
  set sourceData(data: object) {
    this.filterModel.sourceData = data;
  }
  filterModel: SectionsFilterModel;
  filterConfig: SectionsFilterConfigModel;
  effDate: string;
  expDate: string;
  originEffDate: string;
  originExpDate: string;
  constructor(private readonly filterService: SectionsFilterService, private readonly timeZoneService: TimeZoneService,
    private readonly changeDetector: ChangeDetectorRef, private readonly fb: FormBuilder) {
    this.filterModel = new SectionsFilterModel();
    this.filterConfig = new SectionsFilterConfigModel();
    SectionFilterUtility.filterModel = this.filterModel;
    this.isSectionAccordianOpened = false;
    this.isAuditAccordianOpened = false;
    this.isCreatedOnAuditAccordianOpened = false;
    this.isUpdatedOnAuditAccordianOpened = false;
    this.isPanelClosed = false;
  }

  ngOnInit() {
    this.filterModel.agreementID = this.agreementID;
    this.filterConfig = this.filterService.getFilterConfig(this);
  }
  onAfterPanelToggle(collapsed: boolean, dateFieldsKey: string) {
    this.filterModel[dateFieldsKey] = collapsed;
  }
  onClearAllFilters(): void {
    const currentQuery = SectionsService.getElasticparam();
    currentQuery['query']['bool']['must'][1]['bool']['should'][0]['nested']
    ['query']['bool']['must'][2]['bool']['must'] = [];
    const  timeStampFields  =  ['updatedOnDate',  'updatedOnTime' ,  'createdOnDate',  'createdOnTime'];
    timeStampFields.forEach((timestamp)  =>  {
      this.filterModel[timestamp]  =  '';
    });
    this.filterComponents.forEach(filterCompItem => {
      if (filterCompItem.filterConfig['title'] !== 'Status') {
        filterCompItem.onReset(false);
      }
    });
    this.onResetStatusFilter(true);
    SectionsService.setElasticparam(currentQuery);
    this.loadData.emit(true);
  }
  onCreateDate() {
    let createTimeStamp = '';
    let esDateTimeFormat = this.filterModel.esDateFormat;
    const createTimeStampDatekeyword = this.filterModel.createTimeStamp;
    if (this.filterModel.createdOnDate) {
      if (this.filterModel.createdOnTime) {
        const createOnDate = moment(this.filterModel.createdOnDate).format(this.filterModel.dateFormat);
        const createOnTime = moment(this.filterModel.createdOnTime).format('HH:mm');
        createTimeStamp = moment(`${createOnDate}T${createOnTime}`).format(this.filterModel.dateTimeFormat);
        createTimeStamp = this.timeZoneService.convertDateTimetoUTC(createTimeStamp);
        esDateTimeFormat = this.filterModel.esDateTimeFormat;
      } else {
        createTimeStamp = moment(this.filterModel.createdOnDate).format(this.filterModel.dateFormat);
        esDateTimeFormat = this.filterModel.esDateFormat;
      }
    }
    this.setTimeStampQuery(createTimeStamp, esDateTimeFormat, createTimeStampDatekeyword);
    this.loadData.emit(true);
  }
  onCreateTime() {
    let createTimeStamp = '';
    const esDateTimeFormat = this.filterModel.esDateTimeFormat;
    const createTimeKeyword = this.filterModel.createTimeStamp;
    if (this.filterModel.createdOnDate && this.filterModel.createdOnTime) {
      const createOnDate = moment(this.filterModel.createdOnDate).format(this.filterModel.dateFormat);
      const createOnTime = moment(this.filterModel.createdOnTime).format('HH:mm');
      createTimeStamp = moment(`${createOnDate}T${createOnTime}`).format(this.filterModel.dateTimeFormat);
      this.setTimeStampQuery(this.timeZoneService.convertDateTimetoUTC(createTimeStamp), esDateTimeFormat, createTimeKeyword);
      this.loadData.emit(true);
    } else {
      this.onCreateDate();
    }
  }
  onUpdateDate() {
    let updatedTimeStamp = '';
    let esDateTimeFormat = this.filterModel.esDateFormat;
    const updateTimeStampDatekeyword = this.filterModel.lastUpdateTimestamp;
    if (this.filterModel.updatedOnDate) {
      if (this.filterModel.updatedOnTime) {
        const updatedOnDate = moment(this.filterModel.updatedOnDate).format(this.filterModel.dateFormat);
        const updateOnTime = moment(this.filterModel.updatedOnTime).format('HH:mm');
        updatedTimeStamp = moment(`${updatedOnDate}T${updateOnTime}`).format(this.filterModel.dateTimeFormat);
        updatedTimeStamp = this.timeZoneService.convertDateTimetoUTC(updatedTimeStamp);
        esDateTimeFormat = this.filterModel.esDateTimeFormat;
      } else {
        updatedTimeStamp = moment(this.filterModel.updatedOnDate).format(this.filterModel.dateFormat);
        esDateTimeFormat = this.filterModel.esDateFormat;
      }
    }
    this.setTimeStampQuery(updatedTimeStamp, esDateTimeFormat, updateTimeStampDatekeyword);
    this.loadData.emit(true);
  }
  onUpdateTime() {
    const esDateTimeFormat = this.filterModel.esDateTimeFormat;
    const updateTimekeyword = this.filterModel.lastUpdateTimestamp;
    if (this.filterModel.updatedOnDate && this.filterModel.updatedOnTime) {
      const updatedOnDate = moment(this.filterModel.updatedOnDate).format(this.filterModel.dateFormat);
      const updateOnTime = moment(this.filterModel.updatedOnTime).format('HH:mm');
      const updatedTimeStamp = moment(`${updatedOnDate}T${updateOnTime}`).format(this.filterModel.dateTimeFormat);
      this.setTimeStampQuery(this.timeZoneService.convertDateTimetoUTC(updatedTimeStamp), esDateTimeFormat, updateTimekeyword);
      this.loadData.emit(true);
    } else {
      this.onUpdateDate();
    }
  }
  setTimeStampQuery(timestamp, dateTimeFormat, fieldName) {
    const currentQuery = SectionsService.getElasticparam();
    const filterQuery = currentQuery['query']['bool']['must'][1]['bool']['should'][0]['nested']
    ['query']['bool']['must'][2]['bool']['must'];
    lodashUtils.remove(filterQuery, (element) => {
      if (element['range']) {
        const keys = Object.keys(element['range']);
        return keys.indexOf(fieldName) !== -1;
      }
    });
    if (timestamp) {
      const startDate = timestamp;
      const endDate = timestamp;
      const timeFormat = dateTimeFormat ? dateTimeFormat : this.filterModel.esDateFormat;
      const fieldQuery = SectionsFilterQuery.getFilterFieldTimeStampQuery(fieldName, startDate, endDate, timeFormat);
      filterQuery.push(fieldQuery);
    }
    SectionsService.setElasticparam(currentQuery);
  }
  onClearDateValues(keyName1: string, keyName2: string, field: string) {
    const updateTimeStampkeyword = this.filterModel.lastUpdateTimestamp;
    const createTimeStampkeyword = this.filterModel.createTimeStamp;
    this.filterModel[keyName1] = '';
    this.filterModel[keyName2] = '';
    if (field === 'lastUpdateTimestamp') {
      this.setTimeStampQuery(null, null, updateTimeStampkeyword);
    } else if (field === 'createTimestamp') {
      this.setTimeStampQuery(null, null, createTimeStampkeyword);
    }
    this.loadData.emit();
    this.changeDetector.detectChanges();
  }
  onListingItemsSelected(selectedValues, fieldName: string) {
    const currentQuery = SectionsService.getElasticparam();
    const filterQuery = currentQuery['query']['bool']['must'][1]['bool']['should'][0]['nested']
    ['query']['bool']['must'][2]['bool']['must'];
    this.setFilterQuery(filterQuery, selectedValues, fieldName);
    SectionsService.setElasticparam(currentQuery);
    this.loadData.emit(true);
  }
  setFilterQuery(filterQuery, selectedValues, fieldName) {
    let queryString = '*', specialCharQuery = '';
    const defaultField = this.getFilterField(fieldName);
    lodashUtils.remove(filterQuery, (element) => {
      return element['query_string'] && element['query_string']['default_field'] === defaultField;
    });
    if (selectedValues && selectedValues.length) {
      lodashUtils.forEach(selectedValues, (element) => {
        if (element) {
          element = `${element['label'].replace(/[-!?:\\['^~=\//\\{}(),.&&|| <>"+*\]]/g, '\\$&')}`;
          specialCharQuery = `${specialCharQuery}${'('}${element}${')'}${'OR'}`;
          queryString = specialCharQuery.replace(/\w+?$/, '');
        }
      });
      const fieldQuery = SectionsFilterQuery.getFilterFieldQuery(defaultField, queryString);
      filterQuery.push(fieldQuery);
    }
  }
  getFilterField(fieldName) {
    const filterElement = lodashUtils.find(this.filterModel.filterDefaultFields, (element) => {
      return element['name'] === fieldName;
    });
    return filterElement['defaultField'];
  }
  statusFramer(data): Array<string> {
    const statusDataArray = [];
    if (data) {
      lodashUtils.forEach(data, (status: string) => {
        const obj = {
          label: status,
          value: status
        };
        if (status.toLowerCase() === 'active') {
          SectionFilterUtility.filterModel.statusSelectedList = [obj];
        }
        statusDataArray.push(obj);
      });
    }
    return statusDataArray;
  }
  onStatusSelected(selectedStatus) {
    const currentQuery = SectionsService.getElasticparam();
    const dateRangeQuery = currentQuery['query']['bool']['must'][1]['bool']['should'][0]['nested']['query']['bool']['must'][0]['bool'];
    const activeQuery = SectionsFilterQuery.getFilterActiveStatusQuery();
    const inActiveQuery = SectionsFilterQuery.getFilterInActiveStatusQuery();
    const deletedQuery = SectionsFilterQuery.getFilterDeletedStatusQuery();
    dateRangeQuery['should'] = [];
    if (selectedStatus && selectedStatus.length) {
      selectedStatus.forEach(status => {
        if (status['value'] === 'Active') {
          dateRangeQuery['should'].push(activeQuery);
        } else if (status['value'] === 'Inactive') {
          dateRangeQuery['should'].push(inActiveQuery);
        } else if (status['value'] === 'Deleted') {
          dateRangeQuery['should'].push(deletedQuery);
        }
      });
    } else {
      dateRangeQuery['should'].push(activeQuery);
      dateRangeQuery['should'].push(inActiveQuery);
      dateRangeQuery['should'].push(deletedQuery);
    }
    SectionsService.setElasticparam(currentQuery);
    this.loadData.emit();
  }
  onResetStatusFilter(resetFlag: boolean) {
    if (resetFlag) {
      const statusList = [ {
        label: 'Active',
        value: 'Active'
      }];
      this.filterConfig.status.expanded = true;
      this.resetStatus();
      this.onStatusSelected(statusList);
      this.loadData.emit(true);
    }
  }
  resetStatus() {
    this.filterModel.isStatusFilter = false;
    this.changeDetector.detectChanges();
    this.filterModel.isStatusFilter = true;
    this.changeDetector.detectChanges();
  }
  onStatusCollapsed(event: boolean) {
    if (event) {
      this.filterConfig.status.expanded = false;
    } else {
      this.filterConfig.status.expanded = true;
    }
  }
}
