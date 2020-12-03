import { Component, ChangeDetectorRef, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import * as utils from 'lodash';

import { MileageFilterModel } from './model/mileage-filter.model';
import { MileageFilterService } from './service/mileage-filter.service';
import { MileageFilterConfig } from './model/mileage-filter.config';
import { MileageFilterUtilityService } from './service/mileage-filter-utility.service';
import { ViewMileageService } from '../services/view-mileage.service';
import { RatingRuleQuery } from '../../rating-rule/query/rating-rule.query';
import { MileageFilterQuery } from './query/mileage-filter.query';


@Component({
  selector: 'app-mileage-filter',
  templateUrl: './mileage-filter.component.html',
  styleUrls: ['./mileage-filter.component.scss'],
  providers: [MileageFilterService, ViewMileageService],

})
export class MileageFilterComponent implements OnInit {

  @Output() loadDataGrid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() agreementID: number;
  @ViewChildren('filtercomp') filterComponents;
  statusFlag = true;

  filterConfig: MileageFilterConfig;
  filterModel: MileageFilterModel;
  activeInactiveReasonType = 'Active OR Inactive';

  constructor(private readonly changeDetector: ChangeDetectorRef,
    private readonly filterService: MileageFilterService, private readonly filterUtility: MileageFilterUtilityService,
    private readonly viewMileageService: ViewMileageService) {
    this.filterModel = new MileageFilterModel();
    this.filterConfig = new MileageFilterConfig();
  }

  ngOnInit() {
    this.filterConfig = this.filterService.getFilterConfig(this);
    this.filterModel.statusSelectedList = [{
      'label': 'Active',
      'value': 'Active'
    }];
  }

  onListingItemsSelected(event, keyName: string, index: number, isNested: boolean) {
    const currentQuery = ViewMileageService.getElasticparam();
    let filterValue = '*';
    let filterArray = [];
    switch (keyName) {
      case 'programName':
        this.queryFramer(currentQuery, index, event, isNested, '', 'mileageProgramName.keyword', false);
        break;
      case 'agreementDefaultIndicator':
        this.queryFramer(currentQuery, index, event, isNested, '',
          'agreementDefaultIndicator.keyword', false);
        break;
      case 'contract':
        this.queryFramer(currentQuery, index, event, isNested,
          'customerMileageProgramContractAssociations',
          'customerMileageProgramContractAssociations.customerContractDisplayName.keyword', false);
        break;
      case 'section':
        this.queryFramer(currentQuery, index, event, isNested, 'customerMileageProgramSectionAssociations',
          'customerMileageProgramSectionAssociations.customerAgreementContractSectionName.keyword', false);
        break;
      case 'businessUnit':
        this.queryFramer(currentQuery, index, event, isNested, 'customerMileageProgramBusinessUnits',
          'customerMileageProgramBusinessUnits.financeBusinessUnitCode.keyword', false);
        break;
      case 'status':
        let selectedStatus;
        currentQuery['query']['bool']['must'][1]['bool']['should'] = [];
        if (!event.length || event.length === 3) {
          currentQuery['query']['bool']['must'][1]['bool']['should'].push(MileageFilterQuery
            .getStatusQuery('*', this.activeInactiveReasonType));
          currentQuery['query']['bool']['must'][1]['bool']['should'].push(MileageFilterQuery.getStatusQuery('*', 'Deleted'));
        } else {
          selectedStatus = utils.map(event, (filter) => {
            return `${filter['value']}`;
          });
          this.setStatusQuery(currentQuery, index, selectedStatus);
          this.isDeletedSelected(currentQuery, index, selectedStatus);
        }
        break;
      case 'carrier':
        this.queryFramer(currentQuery, index, event, isNested, 'customerMileageProgramCarrierAssociations',
          'customerMileageProgramCarrierAssociations.carrierDisplayName.keyword', false);
        break;
      case 'mileageSystemName':
        this.queryFramer(currentQuery, index, event, isNested, '', 'mileageSystemName.keyword', false);
        break;
      case 'mileageSystemParameters':
        this.queryFramer(currentQuery, index, event, isNested,
          'mileageSystemParameters', 'mileageSystemParameters.mileageSystemParameterName.keyword', true);
        break;
      case 'systemVersion':
        this.queryFramer(currentQuery, index, event, isNested, '', 'mileageSystemVersionName.text', false);
        break;
      case 'borderMilesParameter':
        this.queryFramer(currentQuery, index, event, isNested, '',
          'mileageBorderMileParameterTypeName.keyword', false);
        break;
      case 'distanceUnit':
        this.queryFramer(currentQuery, index, event, isNested, '', 'unitOfDistanceMeasurementCode.keyword', false);
        break;
      case 'geographyType':
        this.queryFramer(currentQuery, index, event, isNested, '', 'geographyType.keyword', false);
        break;
      case 'routeType':
        this.queryFramer(currentQuery, index, event, isNested, '', 'mileageRouteTypeName.keyword', false);
        break;
      case 'calculationType':
        this.queryFramer(currentQuery, index, event, isNested, '', 'mileageCalculationTypeName.keyword', false);
        break;
      case 'decimalPrecision':
        this.queryFramer(currentQuery, index, event, isNested, '', 'decimalPrecisionIndicator.keyword', false);
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
        this.queryFormation(filterValue, isNested, currentQuery, index, false);
    }
    ViewMileageService.setElasticparam(currentQuery);
    this.loadDataGrid.emit(true);
  }
  private queryFramer(currentQuery: any, index: number, event: any, isNested: boolean, pathName: string,
    FiledName: string, isSystemParam: boolean) {
    let filterValue = '*';
    let filterArray = [];
    currentQuery['query']['bool']['must'][index]['bool']['must'] = [];
    if (event.length) {
      if (isNested && isSystemParam) {
        currentQuery['query']['bool']['must'][index]['bool']['must'].push
          (MileageFilterQuery.getSystemParameterFilterQuery(pathName, FiledName));
      } else if (isNested && !isSystemParam) {
        currentQuery['query']['bool']['must'][index]['bool']['must'].push(MileageFilterQuery.
          getPrimaryAssociationFilterQuery(pathName, FiledName));
      } else {
        currentQuery['query']['bool']['must'][index]['bool']['must']
          .push(MileageFilterQuery.getPrimaryFilterQuery(FiledName));
      }
      filterArray = utils.map(event, (filter) => {
        return `(${filter['value'].replace(/[-!?:\\['^~=\//\\{}(),.&&|| <>"+*\]]/g, '\\$&')})`;
      });
      filterValue = filterArray.join(' OR ');
      this.queryFormation(filterValue, isNested, currentQuery, index, isSystemParam);
    }
    return { filterValue, filterArray };
  }
  isDeletedSelected(currentQuery, index: number, selectedStatus) {
    if (selectedStatus.includes('Deleted')) {
      currentQuery['query']['bool']['must'][1]['bool']['should'].push(MileageFilterQuery.getStatusQuery('*', 'Deleted'));
    }
  }
  setStatusQuery(currentQuery, index: number, selectedStatus) {
    if (selectedStatus.includes('Active') && !selectedStatus.includes('Inactive')) {
      currentQuery['query']['bool']['must'][1]['bool']['should'].push(MileageFilterQuery.getStatusQuery('N', 'Active'));
      currentQuery['query']['bool']['must'][1]['bool']['should'][0]['bool']['must'].push(MileageFilterQuery.statusQuery('gte'));
    } else if (selectedStatus.includes('Inactive') && !selectedStatus.includes('Active')) {
      currentQuery['query']['bool']['must'][1]['bool']['should'].push(MileageFilterQuery
        .getStatusQuery('*', this.activeInactiveReasonType));
      currentQuery['query']['bool']['must'][1]['bool']['should'][0]['bool']['must'].push(MileageFilterQuery.statusQuery('lt'));
    } else if (selectedStatus.includes('Active') && selectedStatus.includes('Inactive')) {
      currentQuery['query']['bool']['must'][1]['bool']['should'].push(MileageFilterQuery
        .getStatusQuery('*', this.activeInactiveReasonType));
    }
  }
  queryFormation(filterValue: string, isNested: boolean, currentQuery: object, index: number, isSystemParam) {
    if (isNested && isSystemParam) {
      currentQuery['query']['bool']['must'][index]['bool']['must'][0]['nested']
      ['query']['bool']['must'][0]['query_string']['query'] = filterValue;
    } else if (isNested && !isSystemParam) {
      currentQuery['query']['bool']['must'][index]['bool']['must'][0]['nested']['query']['query_string']['query'] = filterValue;
    } else {
      currentQuery['query']['bool']['must'][index]['bool']['must'][0]['query_string']['query'] = filterValue;
    }
  }
  onClearAllFilters(): void {
    this.filterComponents.forEach(filterCompItem => {
      if (filterCompItem.filterConfig['title'] !== 'Status') {
        filterCompItem.onReset(false);
      }
    });
    this.resetStatus();
    this.resetDateFilter();
    const currentQuery = ViewMileageService.getElasticparam();
    currentQuery['query']['bool']['must'].forEach((element, index) => {
      if (index > 1 && index < 21) {
        element['bool']['must'] = [];
      }
    });
    currentQuery['query']['bool']['must'][1]['bool']['should'] = [];
    this.defaultStatusFetch(currentQuery);
    ViewMileageService.setElasticparam(currentQuery);
    this.loadDataGrid.emit(true);
  }
  resetEvent(resetFlag: boolean) {
    if (resetFlag) {
      this.filterConfig.status.expanded = true;
      this.resetStatus();
      const currentQuery = ViewMileageService.getElasticparam();
      currentQuery['query']['bool']['must'][1]['bool']['should'] = [];
      this.defaultStatusFetch(currentQuery);
      ViewMileageService.setElasticparam(currentQuery);
      this.loadDataGrid.emit(true);
      this.changeDetector.detectChanges();

    }
  }
  defaultStatusFetch(currentQuery) {
    currentQuery['query']['bool']['must'][1]['bool']['should'].push(MileageFilterQuery.getStatusQuery('N', 'Active'));
    currentQuery['query']['bool']['must'][1]['bool']['should'][0]['bool']['must'].push(MileageFilterQuery.statusQuery('gte'));
  }
  resetStatus() {
    this.statusFlag = false;
    this.changeDetector.detectChanges();
    this.statusFlag = true;
    this.changeDetector.detectChanges();
  }
  resetDateFilter() {
    this.filterModel.isDateResetFlag = false;
    this.changeDetector.detectChanges();
    this.filterModel.isDateResetFlag = true;
    this.changeDetector.detectChanges();
  }
  isStatusCollapsed(event) {
    if (event) {
      this.filterConfig.status.expanded = false;
    } else {
      this.filterConfig.status.expanded = true;
    }
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
  loadGrid(currentQuery) {
    ViewMileageService.setElasticparam(currentQuery);
    this.loadDataGrid.emit(true);
    this.changeDetector.detectChanges();
  }
  currentQuery() {
    return ViewMileageService.getElasticparam();

  }
}
