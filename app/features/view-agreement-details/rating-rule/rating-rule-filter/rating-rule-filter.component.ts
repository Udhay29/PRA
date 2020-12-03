import { Component, ChangeDetectorRef, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import * as utils from 'lodash';
import * as moment from 'moment';

import { RatingRuleFilterModel } from './model/rating-rule-filter.model';
import { RatingRuleFilterConfig } from './model/rating-rule-filter.config';
import { RatingRuleFilterService } from './service/rating-rule-filter.service';
import { RatingRuleService } from '../service/rating-rule.service';
import { RatingRuleQuery } from '../query/rating-rule.query';
import { RatingRuleFilterUtilityService } from './service/rating-rule-filter.utility.service';

@Component({
  selector: 'app-rating-rule-filter',
  templateUrl: './rating-rule-filter.component.html',
  styleUrls: ['./rating-rule-filter.component.scss'],
  providers: [RatingRuleFilterService]
})
export class RatingRuleFilterComponent implements OnInit {
  isCityAccordianOpened = false;
  isEffecRatingAccordianOpened = false;
  isExpAccordianOpened = false;
  @Output() loadDataGrid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() agreementID: number;
  @ViewChildren('filtercomp') filterComponents;
  statusFlag = true;
  filterModel: RatingRuleFilterModel;
  filterConfig: RatingRuleFilterConfig;
  constructor(private readonly changeDetector: ChangeDetectorRef,
    private readonly filterService: RatingRuleFilterService, private readonly filterUtility: RatingRuleFilterUtilityService) {
    this.filterModel = new RatingRuleFilterModel();
    this.filterConfig = new RatingRuleFilterConfig();
    this.isCityAccordianOpened = false;
    this.isEffecRatingAccordianOpened = false;
    this.isExpAccordianOpened = false;
  }

  ngOnInit() {
    this.getRatingRulesCriteria();
    this.filterModel.statusSelectedList = [{
      'label': 'Active',
      'value': 'Active'
    }];
  }
  getRatingRulesCriteria() {
    this.filterService.getRuleCriteria().subscribe((data: any) => {
      if (!utils.isEmpty(data)) {
        utils.forEach(data['_embedded']['ruleCriterias'], (ruleCriteria) => {
          this.ruleCriteriaFramer(ruleCriteria);
        });
        this.filterConfig = this.filterService.getFilterConfig(this.filterModel, this);
      }
    });
  }
  ruleCriteriaFramer(ruleCriteria: any) {
    switch (ruleCriteria['ruleCriteriaName']) {
      case 'Congestion Charge':
        this.ruleCriteriaFormation(ruleCriteria, 'congestionChargeRules');
        break;

      case 'Flat Rate With Stops':
        this.ruleCriteriaFormation(ruleCriteria, 'flatRateWithStopsRules');
        break;

      case 'Hazmat Charge Rules':
        this.ruleCriteriaFormation(ruleCriteria, 'hazmatChargeRules');
        break;
    }
  }
  ruleCriteriaFormation(ruleCriteria: any, criteriaArray: string) {
    utils.forEach(ruleCriteria['ruleCriteriaValues'], (criteria) => {
      this.filterModel[criteriaArray].push({
        label: criteria['ruleCriteriaValueName'],
        value: criteria['ruleCriteriaValueName']
      });
    });
  }
  onListingItemsSelected(event, keyName: string, index: number, isNested: boolean) {
    const currentQuery = RatingRuleService.getElasticparam();
    let filterValue = '*';
    let filterArray = [];
    switch (keyName) {
      case 'radius':
        filterValue = event['target']['value'];
        this.radiusQueryFormation(filterValue, isNested, currentQuery, index);
        break;
      case 'agreementDefault':
        filterValue = event['length'] ? 'Yes' : '*';
        this.queryFormation(filterValue, isNested, currentQuery, index);
        break;
      case 'section':
        this.sectionContractQueryFramer(event, currentQuery, index, isNested);
        break;
      case 'businessUnit':
        this.buQueryFrame(event, currentQuery, filterValue, index, isNested);
        break;
      case 'contract':
        this.sectionContractQueryFramer(event, currentQuery, index, isNested);
        break;
      case 'serviceOfferings':
        if (event['length'] === 1) {
          filterValue = `\"${event[0]['value']}\"`;
        } else if (event['length'] > 1) {
          filterArray = utils.map(event, (filter) => {
            return `\"${filter['value']}\"`;
          });
          filterValue = filterArray.join(' OR ');
        }
        this.queryFormation(filterValue, isNested, currentQuery, index);
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
    RatingRuleService.setElasticparam(currentQuery);
    this.loadDataGrid.emit(true);
  }

  sectionContractQueryFramer(event: Event, currentQuery: object, index: number, isNested: boolean) {
    let filterArray = [];
    let filterValue = '';

    if (event['length'] === 1) {
      filterValue = `${event[0]['label']}`;
      this.queryFormation(filterValue, isNested, currentQuery, index);
    } else if (event['length'] > 1) {
      filterArray = utils.map(event, (filter) => {
        return `(${filter['label']})`;
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
  buQueryFrame(event: Event, currentQuery: object, filterValue: string, index: number, isNested: boolean) {
    let filterArray = [];
    let value;

    if (event['length'] === 1) {
      value = event[0]['value'];
      this.queryFormation(value, isNested, currentQuery, index);
    } else if (event['length'] > 1) {
      filterArray = utils.map(event, (filter) => {
        return `(${filter['value']})`;
      });
      value = filterArray.join(' OR ');
      this.queryFormation(value, isNested, currentQuery, index);
    } else {
      currentQuery['query']['bool']['must'][3]['bool']['must'][index] = {
        'query_string': {
          'default_field': filterValue,
          'query': '*',
          'default_operator': 'AND'
        }
      };
    }
  }
  isDeletedSelected(currentQuery, index: number, selectedStatusString: string, selectedStatus) {
    if (selectedStatus.includes('deleted')) {
      const statusQuery = RatingRuleQuery.getDeletedStatus();
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['bool']['should'].push(statusQuery);
    }
  }
  setStatusQuery(currentQuery, index: number, selectedStatus) {
    let statusQuery;
    if (selectedStatus.includes('active')) {
      statusQuery = RatingRuleQuery.getStatusQuery('gte');
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['bool']['should'].push(statusQuery);
    }
    if (selectedStatus.includes('inactive')) {
      statusQuery = RatingRuleQuery.getStatusQuery('lt');
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['bool']['should'].push(statusQuery);
    }
  }
  queryFormation(filterValue: string, isNested: boolean, currentQuery: object, index: number) {
    if (isNested) {
      if (filterValue === '*') {
        currentQuery['query']['bool']['must'][3]['bool']['must'][index] = {
          'query_string': {
            'default_field': filterValue,
            'query': '*',
            'default_operator': 'AND'
          }
        };
      } else {
        currentQuery['query']['bool']['must'][3]['bool']['must'][index] = this.getContractSectionFilterQuery(index, filterValue);
      }
    } else {
      if (index === 9) {
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
  getContractSectionFilterQuery(index: number, filterValue: string): object {
    switch (index) {
      case 10:
      filterValue = filterValue.replace(/[^a-zA-Z0-9]/gi, '\\$&');
        return {
          'nested': {
            'path': 'contractAssociations',
            'query': {
              'query_string': {
                'default_field': 'contractAssociations.contractDisplayName.keyword',
                'query': filterValue,
                'default_operator': 'AND'
              }
            }
          }
        };

      case 11:
        return {
          'nested': {
            'path': 'sectionAssociations',
            'query': {
              'query_string': {
                'default_field': 'sectionAssociations.customerAgreementContractSectionName.keyword',
                'query': filterValue,
                'default_operator': 'AND'
              }
            }
          }
        };

      case 13:
        return {
          'nested': {
            'path': 'financeBusinessUnitServiceOfferingAssociations',
            'query': {
              'query_string': {
                'default_field': 'financeBusinessUnitServiceOfferingAssociations.financeBusinessUnitServiceOfferingDisplayName.keyword',
                'query': filterValue,
                'default_operator': 'AND'
              }
            }
          }
        };

      case 12:
        return {
          'nested': {
            'path': 'financeBusinessUnitServiceOfferingAssociations',
            'query': {
              'query_string': {
                'default_field': 'financeBusinessUnitServiceOfferingAssociations.financeBusinessUnitCode.keyword',
                'query': filterValue,
                'default_operator': 'AND'
              }
            }
          }
        };
      default:
        return {
          'query_string': {
            'default_field': '*',
            'query': '*',
            'default_operator': 'AND'
          }
        };
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
  radiusQueryFormation(filterValue: string, isNested: boolean, currentQuery: object, index: number) {
    if (filterValue) {
      currentQuery['query']['bool']['must'][3]['bool']['must']
      [index]['bool']['must'][0]['query_string']['query'] = `\"${filterValue}\ Miles Radius"`;
    } else {
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['bool']['must'][0]['query_string']['query'] = '*';
    }
  }
  onDateRangeBlur(dateName: string, keyName: string, index: number, level: string) {
    const currentQuery = RatingRuleService.getElasticparam();
    if (this.filterModel[dateName]) {
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['range'][`${keyName}`]['gte']
        = moment(this.filterModel[dateName]).format(this.filterModel.dateFormat);
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['range'][`${keyName}`]['lte']
        = moment(this.filterModel[dateName]).format(this.filterModel.dateFormat);
      this.filterModel.dateClearCheck[`${dateName}flag`] = true;
      RatingRuleService.setElasticparam(currentQuery);
      this.loadDataGrid.emit(true);
    } else if (this.filterModel.dateClearCheck[`${dateName}flag`]) {
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['range'][`${keyName}`]['gte']
        = this.filterModel.defaultStartDate;
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['range'][`${keyName}`]['lte']
        = this.filterModel.defaultEndDate;
      this.filterModel.dateClearCheck[`${dateName}flag`] = false;
      RatingRuleService.setElasticparam(currentQuery);
      this.loadDataGrid.emit(true);
    }
  }
  onDateRangeSelect(dateName: string, keyName: string, index: number, level: string) {
    this.onDateRangeBlur(dateName, keyName, index, level);
  }
  originDateClear(dateName: string, keyName: string, index: number) {
    this.filterModel[dateName] = '';
    const currentQuery = RatingRuleService.getElasticparam();
    currentQuery['query']['bool']['must'][3]['bool']['must'][index]['range'][`${keyName}`]['gte']
      = this.filterModel.defaultStartDate;
    currentQuery['query']['bool']['must'][3]['bool']['must'][index]['range'][`${keyName}`]['lte']
      = this.filterModel.defaultEndDate;
    RatingRuleService.setElasticparam(currentQuery);
    this.loadDataGrid.emit(true);
  }
  radiusToggle(event, index: number) {
    const currentQuery = RatingRuleService.getElasticparam();
    if (event === 'Yes') {
      this.filterModel.showRadiusFlag = true;
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['bool']['must'][0]['query_string']['query'] = '*';
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['bool']['must'][1] = RatingRuleQuery.getCitySubstitutionValue();
    } else if (event === 'No') {
      this.filterModel.showRadiusFlag = false;
      this.filterModel.radius = null;
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['bool']['must'][0]['query_string']['query'] = 'No';
      if (currentQuery['query']['bool']['must'][3]['bool']['must'][index]['bool']['must'][1]) {
        currentQuery['query']['bool']['must'][3]['bool']['must'][index]['bool']['must'].pop();
      }
    }
    RatingRuleService.setElasticparam(currentQuery);
    this.loadDataGrid.emit(true);
  }
  resetRadius(index: number) {
    this.filterModel.radius = null;
    this.filterModel.showRadiusFlag = false;
    const currentQuery = RatingRuleService.getElasticparam();
    currentQuery['query']['bool']['must'][3]['bool']['must'][index]['bool']['must'][0]['query_string']['query'] = '*';
    if (currentQuery['query']['bool']['must'][3]['bool']['must'][index]['bool']['must'][1]) {
      currentQuery['query']['bool']['must'][3]['bool']['must'][index]['bool']['must'].pop();
    }
    RatingRuleService.setElasticparam(currentQuery);
    const checkbox = document.getElementsByName('citySubstitution');
    checkbox[1]['checked'] = false;
    checkbox[3]['checked'] = false;
    this.loadDataGrid.emit(true);
  }
  resetEvent(resetFlag: boolean) {
    if (resetFlag) {
      this.filterConfig.status.expanded = true;
      this.resetStatus();
      const currentQuery = RatingRuleService.getElasticparam();
      currentQuery['from'] = 0;
      currentQuery['query']['bool']['must'][1]['bool']['should'] = [];
      this.statusActiveInactiveQuery(currentQuery, 'Active');
      RatingRuleService.setElasticparam(currentQuery);
      this.loadDataGrid.emit(true);
    }
  }
  resetStatus() {
    this.statusFlag = false;
    this.changeDetector.detectChanges();
    this.statusFlag = true;
    this.changeDetector.detectChanges();
  }
  isStatusCollapsed(event) {
    if (event) {
      this.filterConfig.status.expanded = false;
    } else {
      this.filterConfig.status.expanded = true;
    }
  }
  onClearAllFilters(): void {
    this.filterComponents.forEach(filterCompItem => {
      if (filterCompItem.filterConfig['title'] !== 'Status') {
        filterCompItem.onReset(false);
      }
    });
    this.filterModel.effectiveDate = '';
    this.filterModel.expirationDate = '';
    this.filterModel.radius = null;
    this.resetStatus();
    this.filterModel.showRadiusFlag = false;
    const checkbox = document.getElementsByName('citySubstitution');
    checkbox[1]['checked'] = false;
    checkbox[3]['checked'] = false;
    const currentQuery = RatingRuleService.getElasticparam();
    currentQuery['query']['bool']['must'][3]['bool'] = RatingRuleQuery.filterQuery();
    RatingRuleService.setElasticparam(currentQuery);
    this.loadDataGrid.emit(true);
  }
  statusFramer = (data) => {
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
  onInputDate(event, dateName: string, keyName: string, index: number, level: string) {
    const enteredValue = (event.target && event.target['value']) ? event.target['value'] : '';
    const datePat = /^(\d{1,2})(\/)(\d{1,2})\2(\d{4}|\d{4})$/;
    const matchArray = enteredValue.match(datePat);
    if ((matchArray !== null && Array.isArray(matchArray) && moment(enteredValue).isValid()) || !enteredValue) {
      this.onDateRangeBlur(dateName, keyName, index, level);
    }
  }
}
