import { Component, EventEmitter, OnInit, Input, Output, ViewChildren, ChangeDetectorRef } from '@angular/core';

import * as moment from 'moment';

import { CargoFilterModel } from './model/cargo-filter.model';
import { CargoFilterUtilsModel } from './model/cargo-filter-utils.model';
import { CargoFilterService } from './services/cargo-filter.service';
import { CargoReleaseService } from '../services/cargo-release.service';
import { CargoFilterQuery } from './query/cargo-filter.query';
import { TimeZoneService } from '../../../../shared/jbh-app-services/time-zone.service';
import * as utils from 'lodash';
import { CargoReleaseModel } from '../model/cargo-release.model';
import { takeWhile } from 'rxjs/operators';
import { GeneralType } from './model/cargo-filter.interface';

@Component({
  selector: 'app-cargo-release-filter',
  templateUrl: './cargo-release-filter.component.html',
  styleUrls: ['./cargo-release-filter.component.scss']
})
export class CargoReleaseFilterComponent implements OnInit {
  isEffecDRAccordianOpened = false;
  isUpdatedOnAccordianOpened = false;
  isCreatedOnAccordianOpened = false;
  isOriginalEffAccordianOpened = false;
  @ViewChildren('filtercomp') filterComponents;
  minValue: number;
  maxValue: number;
  createdTimeDisabled: boolean;
  updatedTimeDisabled: boolean;
  @Input()
  set defaultAmount(value) {
    this.filterModel.cargoAmount = value;
    this.filterModel.filterParams['defaultAmt'] = value;
  }
  statusFlag = true;
  @Input() agreementId: number;
  @Input()
  set sourceData(data: object) {
    this.filterModel.sourceData = data;
  }
  @Output() filtersSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() readonly filterKey: EventEmitter<any> = new EventEmitter();
  @Output() readonly clearAllFilters: EventEmitter<any> = new EventEmitter();
  filterConfig: CargoFilterModel;
  filterModel: CargoFilterUtilsModel;
  cargoReleaseModel: CargoReleaseModel;
  constructor(private readonly filterService: CargoFilterService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly timeZoneService: TimeZoneService) {
    this.filterConfig = new CargoFilterModel();
    this.filterModel = new CargoFilterUtilsModel();
    this.cargoReleaseModel = new CargoReleaseModel();
    this.createdTimeDisabled = true;
    this.updatedTimeDisabled = true;
    this.isEffecDRAccordianOpened = false;
    this.isUpdatedOnAccordianOpened = false;
    this.isCreatedOnAccordianOpened = false;
    this.isOriginalEffAccordianOpened = false;
  }

  ngOnInit() {
    this.cargoMaxAmount();
    this.filterModel.statusSelectedList = [{
      'label': 'Active',
      'value': 'Active'
    }];
  }
  cargoMaxAmount() {
    this.filterService.getBuConfDtoService()
      .pipe(takeWhile(() => this.cargoReleaseModel.subscribeFlag))
      .subscribe((response: Array<GeneralType>) => {
        utils.forEach(response['configurationParameterDetailDTOs'], (minMax) => {
          if (minMax.configurationParameterDetailName === 'cargo_release_max') {
            this.maxValue = parseInt(minMax.configurationParameterValue, 10);
          }
          if (minMax.configurationParameterDetailName === 'cargo_release_default') {
            this.minValue = parseInt(minMax.configurationParameterValue, 10);
          }
        });
        this.filterConfig = this.filterService.getFilterConfig(this);
      }, (error: Error) => {
        this.cargoReleaseModel.loading = false;
        this.cargoReleaseModel.noResultFoundFlag = true;
      });
  }
  onSlideValue(sliderValue): void {
    const currentQuery = CargoReleaseService.getElasticparam();
    currentQuery['from'] = 0;
    if ((sliderValue !== undefined)) {
      currentQuery['query']['bool']['must'][3]['bool']['must'][1]['range']['cargoReleaseAmount']['lte']
        = (sliderValue) ? `${sliderValue}` : this.filterModel.cargoAmount;
    } else {
      currentQuery['query']['bool']['must'][3]['bool']['must'][1]['range']['cargoReleaseAmount']['lte'] = 0;
    }
    this.filtersSelected.emit(true);
  }
  resetEvent(resetFlag: boolean) {
    if (resetFlag) {
      this.filterConfig.statusData.expanded = true;
      this.resetStatus();
      const currentQuery = CargoReleaseService.getElasticparam();
      currentQuery['from'] = 0;
      currentQuery['query']['bool']['must'][1]['bool']['should'] = [];
      this.statusActiveInactiveQuery(currentQuery, 'Active');
      CargoReleaseService.setElasticparam(currentQuery);
      this.filtersSelected.emit(true);
    }
  }
  isStatusCollapsed(event) {
    if (event) {
      this.filterConfig.statusData.expanded = false;
    } else {
      this.filterConfig.statusData.expanded = true;
    }
  }
  resetStatus() {
    this.statusFlag = false;
    this.changeDetector.detectChanges();
    this.statusFlag = true;
    this.changeDetector.detectChanges();
  }
  statusDataFramer = (data) => {
    const statusDataArray = [];
    if (data) {
      utils.forEach(data, (status: string) => {
        const obj = {
          label: status,
          value: status
        };
        if (status.toLowerCase() === 'active') {
          this.filterModel.statusSelectedList = [obj];
        }
        statusDataArray.push(obj);
      });
    }
    return statusDataArray;
  }
  onListingItemsSelected(event: Event, keyName: string, index: number, isNested: boolean) {
    const currentQuery = CargoReleaseService.getElasticparam();
    let filterValue = '*';
    let filterArray = [];
    switch (keyName) {
      case 'agreementRadio':
        filterValue = (event !== null) ? event['value'] : '*';
        this.queryFormation(filterValue, isNested, currentQuery, index);
        break;
      case 'selectedContract':
        this.contractQueryFrame(event, currentQuery, filterValue, index, isNested);
        break;
      case 'selectedSection':
        this.sectionQueryFrame(event, currentQuery, filterValue, index, isNested);
        break;
      case 'selectedBusinessUnit':
        this.buQueryFrame(event, currentQuery, filterValue, index, isNested);
        break;
      default:
        if (event['length'] === 1) {
          filterValue = event[0]['value'];
        } else if (event['length'] > 1) {
          filterArray = utils.map(event, (filter) => {
            return `(${filter['value']})`;
          });
          filterValue = filterArray.join(' OR ');
        }
        this.queryFormation(filterValue, isNested, currentQuery, index);
    }
    currentQuery['from'] = 0;
    CargoReleaseService.setElasticparam(currentQuery);
    this.filtersSelected.emit(true);
  }

  contractQueryFrame(event: Event, currentQuery: object, filterValue: string, index: number, isNested: boolean) {
    let filterArray = [];
    currentQuery['query']['bool']['must'][3]['bool']['must'][index]['query_string']['default_field'] =
      'contractAssociation.contractDisplayName.keyword';
    if (event['length'] === 1) {
      filterValue = `(${event[0]['label'].replace(/[!?:\\["'^~=\//\\{}&&|| <>()+*\]-]/g, '\\$&')})`;
    } else if (event['length'] > 1) {
      filterArray = utils.map(event, (filter) => {
        return `(${filter['label'].replace(/[!?:\\["'^~=\//\\{}&&|| <>()+*\]-]/g, '\\$&')})`;
      });
      filterValue = filterArray.join(' OR ');
    } else {
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['query_string']['default_field'] = '*';
    }
    this.queryFormation(filterValue, isNested, currentQuery, index);
  }

  sectionQueryFrame(event: Event, currentQuery: object, filterValue: string, index: number, isNested: boolean) {
    let filterArray = [];
    currentQuery['query']['bool']['must'][3]['bool']['must'][index]['query_string']['default_field'] =
      'sectionAssociation.customerAgreementContractSectionName';
    if (event['length'] === 1) {
      filterValue = `${event[0]['label']}`;
    } else if (event['length'] > 1) {
      filterArray = utils.map(event, (filter) => {
        return `(${filter['label']})`;
      });
      filterValue = filterArray.join(' OR ');
    } else {
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['query_string']['default_field'] = '*';
    }
    this.queryFormation(filterValue, isNested, currentQuery, index);
  }

  buQueryFrame(event: Event, currentQuery: object, filterValue: string, index: number, isNested: boolean) {
    let filterArray = [];
    currentQuery['query']['bool']['must'][3]['bool']['must'][index] = {
      'nested': {
        'path': 'financeBusinessUnitAssociations',
        'query': {
          'query_string': {
            'default_field': 'financeBusinessUnitAssociations.financeBusinessUnitCode.keyword',
            'query': filterValue,
            'default_operator': 'AND'
          }
        }
      }
    };
    if (event['length'] === 1) {
      filterValue = event[0]['value'];
      this.queryFormation(filterValue, isNested, currentQuery, index);
    } else if (event['length'] > 1) {
      filterArray = utils.map(event, (filter) => {
        return `(${filter['value']})`;
      });
      filterValue = filterArray.join(' OR ');
      this.queryFormation(filterValue, isNested, currentQuery, index);
    } else {
      currentQuery['query']['bool']['must'][3]['bool']['must'][index] = {
        'query_string': {
          'default_field': '*',
          'query': '*',
          'default_operator': 'AND'
        }
      };
    }
  }

  queryFormation(filterValue: string, isNested: boolean, currentQuery: object, index: number) {
    if (isNested) {
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['nested']['query']['query_string']['query'] = filterValue;
    } else {
      if (index === 5) {
        currentQuery['query']['bool']['must'][1]['bool']['should'] = [];
        if (filterValue === '*') {
          filterValue = 'Active OR Inactive OR Deleted';
        }
        this.statusActiveInactiveQuery(currentQuery, filterValue);
      } else {
        currentQuery['query']['bool']['must'][3]['bool']['must'][index]['query_string']['query'] = filterValue;
      }
    }
  }

  statusActiveInactiveQuery(currentQuery: object, filterValue: string) {
    if (filterValue.includes('Active')) {
      this.statusQuery(currentQuery, 'N', 'Active', 'gte');
    }
    if (filterValue.includes('Inactive')) {
      this.statusQuery(currentQuery, 'N OR Y', 'Active OR Inactive', 'lt');
    }
    if (filterValue.includes('Deleted')) {
      this.statusDeleteQuery(currentQuery, filterValue);
    }
  }

  statusQuery(currentQuery: object, invalidIndicator: string, invalidReasonTypeName: string, dateRange: string) {
    currentQuery['query']['bool']['must'][1]['bool']['should'].push(
      {
        'bool': {
          'must': [
            {
              'range': {
                'expirationDate': {
                  [dateRange]: 'now/d'
                }
              }
            },
            {
              'query_string': {
                'default_field': 'invalidIndicator',
                'query': invalidIndicator
              }
            },
            {
              'query_string': {
                'default_field': 'invalidReasonTypeName',
                'query': invalidReasonTypeName
              }
            }
          ]
        }
      });
  }

  statusInactiveQuery(currentQuery: object, filterValue: string) {
    if (filterValue.includes('Inactive') || filterValue === '*') {
      this.statusQuery(currentQuery, 'N OR Y', 'Active OR Inactive', 'lt');
    }
  }

  statusDeleteQuery(currentQuery: object, filterValue: string) {
    currentQuery['query']['bool']['must'][1]['bool']['should'].push({
      'bool': {
        'must': [
          {
            'query_string': {
              'default_field': 'invalidIndicator',
              'query': '*'
            }
          },
          {
            'query_string': {
              'default_field': 'invalidReasonTypeName',
              'query': 'Deleted'
            }
          }
        ]
      }
    });
  }
  onClearAllFilters(): void {
    this.filterComponents.forEach(filterCompItem => {
      if (filterCompItem.filterConfig['title'] !== 'Status' && filterCompItem.filterConfig['title'] !== 'Cargo Release') {
        filterCompItem.onReset(false);
      } else if (filterCompItem.filterConfig['title'] === 'Cargo Release') {
        filterCompItem.onReset(true);
        const event = {
          value: this.maxValue
        };
        filterCompItem.handleChange(event, true);
      }
    });
    this.resetStatus();
    this.resetEvent(true);
    this.filterModel.effectiveDate = '';
    this.filterModel.expirationDate = '';
    this.filterModel.originalEffectiveDate = '';
    this.filterModel.originalExpirationDate = '';
    this.filterModel.createdTimeValue = '';
    this.filterModel.createdDateValue = '';
    this.filterModel.updatedDateValue = '';
    this.filterModel.updatedTimeValue = '';
    this.filterModel.filterParams = [];
    this.filterModel.selectedKey = [];
    this.filterModel.selectedList = [];
    this.createdTimeDisabled = true;
    this.updatedTimeDisabled = true;
    const currentQuery = CargoReleaseService.getElasticparam();
    currentQuery['query']['bool']['must'][3]['bool'] = CargoFilterQuery.getFilterQuery(this.filterModel.sourceData);
    CargoReleaseService.setElasticparam(currentQuery);
    this.filtersSelected.emit(true);

  }
  onResetDateRange(startDate: string, endDate: string, startIndex: number, endIndex: number) {
    this.filterModel[startDate] = '';
    this.filterModel[endDate] = '';
    const currentQuery = CargoReleaseService.getElasticparam();
    currentQuery['from'] = 0;
    currentQuery['query']['bool']['must'][3]['bool']['must'][startIndex]['range'][`${startDate}`]['gte']
      = this.filterModel.defaultStartDate;
    currentQuery['query']['bool']['must'][3]['bool']['must'][endIndex]['range'][`${endDate}`]['lte']
      = this.filterModel.defaultEndDate;
    CargoReleaseService.setElasticparam(currentQuery);
    this.filtersSelected.emit(true);
  }
  onResetTimeStamp(date: string, time: string, index: number) {
    this.filterModel[date] = '';
    this.filterModel[time] = '';
    if (date === 'createdDateValue') {
      this.createdTimeDisabled = true;
    } else {
      this.updatedTimeDisabled = true;
    }
    const currentQuery = CargoReleaseService.getElasticparam();
    currentQuery['from'] = 0;
    currentQuery['query']['bool']['must'][3]['bool']['must'][index]['query_string']['query'] = '*';
    CargoReleaseService.setElasticparam(currentQuery);
    this.filtersSelected.emit(true);
  }
  onDateRangeSelect(dateName: string, index: number, level: string) {
    this.onDateRangeBlur(dateName, index, level);
  }
  onDateRangeBlur(dateName: string, index: number, level: string) {
    const currentQuery = CargoReleaseService.getElasticparam();
    currentQuery['from'] = 0;
    if (this.filterModel[dateName]) {
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['range'][`${dateName}`][`${level}`]
        = moment(this.filterModel[dateName]).format(this.filterModel.dateFormat);
      this.filterModel.dateClearCheck[`${dateName}flag`] = true;
      CargoReleaseService.setElasticparam(currentQuery);
      this.filtersSelected.emit(true);
    } else if (this.filterModel.dateClearCheck[`${dateName}flag`]) {
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['range'][`${dateName}`]['gte']
        = this.filterModel.defaultStartDate;
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['range'][`${dateName}`]['lte']
        = this.filterModel.defaultEndDate;
      this.filterModel.dateClearCheck[`${dateName}flag`] = false;
      CargoReleaseService.setElasticparam(currentQuery);
      this.filtersSelected.emit(true);
    }
  }
  timeStampQueryFramer(dateType: string, timeType: string, index: number) {
    const currentQuery = CargoReleaseService.getElasticparam();
    currentQuery['from'] = 0;
    const createOnDate = moment(this.filterModel[dateType]).format(this.filterModel.dateFormat);
    const createOnTime = moment(this.filterModel[timeType]).format(this.filterModel.timeFormat);
    const withDateTime: string = moment(`${createOnDate} ${createOnTime}`).format('MM/DD/YYYY HH:mm');
    currentQuery['query']['bool']['must'][3]['bool']['must'][index]['query_string']['query'] =
      `*${this.filterService.convertDateTimetoUTC(withDateTime).replace(/[:/ ]/g, '\\$&')}*`;
    return currentQuery;
  }
  timeDisable(timeType: string, dateType: string) {
    if (dateType === 'createdDateValue') {
      if (moment(this.filterModel[dateType], this.filterModel.dateFormat, true).isValid()) {
        this.createdTimeDisabled = false;
      } else {
        this.filterModel[timeType] = '';
        this.createdTimeDisabled = true;
      }
    }
    if (dateType === 'updatedDateValue') {
      if (moment(this.filterModel[dateType], this.filterModel.dateFormat, true).isValid()) {
        this.updatedTimeDisabled = false;
      } else {
        this.filterModel[timeType] = '';
        this.updatedTimeDisabled = true;
      }
    }
  }
  onDateSelected(index: number, dateType: string, timeType: string) {
    this.timeDisable(timeType, dateType);
    const currentQuery = CargoReleaseService.getElasticparam();
    currentQuery['from'] = 0;
    if (this.filterModel[dateType]) {
      if (this.filterModel[timeType]) {
        this.timeStampQueryFramer(dateType, timeType, index);
      } else {
        currentQuery['query']['bool']['must'][3]['bool']['must'][index]['query_string']['query'] =
          `*${moment(this.filterModel[dateType]).format(this.filterModel.dateFormat).replace(/[/]/g, '\\/')}*`;
      }
    } else {
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['query_string']['query'] = '*';
    }
    CargoReleaseService.setElasticparam(currentQuery);
    this.filtersSelected.emit(true);
  }
}
