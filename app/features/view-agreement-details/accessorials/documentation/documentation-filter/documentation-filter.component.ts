import { Component, ChangeDetectorRef, OnInit, Input, Output, EventEmitter, ViewChildren } from '@angular/core';
import * as utils from 'lodash';

import { DocumentationFilerModel } from './model/documentation-filter.model';
import { DocumenationFilterConfig } from './model/documentation-filter.config';
import { DocumenationFilterUtilityService } from './service/documenation-filter-utility.service';
import { DocumentationFilterService } from './service/documentation-filter.service';
import { DocumentationService } from '../service/documentation.service';
import { DoumentationFilterQuery } from './query/documentation-filter.query';

@Component({
  selector: 'app-documentation-filter',
  templateUrl: './documentation-filter.component.html',
  styleUrls: ['./documentation-filter.component.scss'],
  providers: [DocumentationFilterService, DocumenationFilterUtilityService]
})
export class DocumentationFilterComponent implements OnInit {
  isEffecDRAccordianOpened = false;
  @Input() agreementID;
  @Output() loadDataGrid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChildren('filtercomp') filterComponents;

  documentationFilerModel: DocumentationFilerModel;
  filterConfig: DocumenationFilterConfig;
  constructor(private readonly changeDetector: ChangeDetectorRef, private readonly filterService: DocumentationFilterService) {
    this.documentationFilerModel = new DocumentationFilerModel();
    this.filterConfig = new DocumenationFilterConfig();
    this.isEffecDRAccordianOpened = false;
  }

  ngOnInit() {
    this.filterConfig = this.filterService.getFilterConfig(this.agreementID, this);
  }
  afterPanelToggle(collapsed: boolean) {
    this.documentationFilerModel.isPanelClosed = collapsed;
  }
  onListingItemsSelected(event, keyName: string, index: number, isNested: boolean) {
    const currentQuery = DocumentationService.getElasticparam();
    const customerAccessorialAccounts = 'customerAccessorialAccounts';
    switch (keyName) {
      case 'chargeType':
        this.queryFramer(currentQuery, index, event, isNested,
          'customerAccessorialDocumentChargeTypes',
          'customerAccessorialDocumentChargeTypes.chargeTypeName.keyword');
        break;
      case 'status':
        let selectedStatus;
        currentQuery['query']['bool']['must'][1]['bool']['should'] = [];
        if (!event.length || event.length === 3) {
          currentQuery['query']['bool']['must'][1]['bool']['should'].push(DoumentationFilterQuery
            .getStatusQuery('*', this.documentationFilerModel.activeInactiveReasonType));
          currentQuery['query']['bool']['must'][1]['bool']['should'].push(DoumentationFilterQuery.getStatusQuery('*', 'Deleted'));
        } else {
          selectedStatus = utils.map(event, (filter) => {
            return `${filter['value']}`;
          });
          this.setStatusQuery(currentQuery, index, selectedStatus);
          this.isDeletedSelected(currentQuery, index, selectedStatus);
        }
        break;
      case 'documentationType':
        this.queryFramer(currentQuery, index, event, isNested,
          'accessorialDocumentType',
          'accessorialDocumentType.keyword');
        break;
      case 'contract':
        this.queryFramer(currentQuery, index, event, isNested,
          customerAccessorialAccounts,
          'customerAccessorialAccounts.customerAgreementContractName.keyword');
        break;
      case 'section':
        this.queryFramer(currentQuery, index, event, isNested,
          customerAccessorialAccounts,
          'customerAccessorialAccounts.customerAgreementContractSectionName.keyword');
        break;
      case 'businessUnitServiceoffering':
        this.queryFramer(currentQuery, index, event, isNested,
          'customerAccessorialServiceLevelBusinessUnitServiceOfferings',
          'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnitDisplayName.keyword');
        break;
      case 'carrier':
        this.queryFramer(currentQuery, index, event, isNested,
          'customerAccessorialCarriers',
          'customerAccessorialCarriers.carrierDisplayName.keyword');
        break;
      case 'billToAccount':
        this.queryFramer(currentQuery, index, event, isNested,
          'customerAccessorialAccounts',
          'customerAccessorialAccounts.customerAgreementContractSectionAccountName.keyword');
        break;
      default:
    }
    DocumentationService.setElasticparam(currentQuery);
    this.loadDataGrid.emit(true);
  }
  isDeletedSelected(currentQuery, index: number, selectedStatus) {
    if (selectedStatus.includes('Deleted')) {
      currentQuery['query']['bool']['must'][1]['bool']['should'].push(DoumentationFilterQuery.getStatusQuery('*', 'Deleted'));
    }
  }
  setStatusQuery(currentQuery, index: number, selectedStatus) {
    if (selectedStatus.includes('Active') && !selectedStatus.includes('Inactive')) {
      currentQuery['query']['bool']['must'][1]['bool']['should'].push(DoumentationFilterQuery.getStatusQuery('N', 'Active'));
      currentQuery['query']['bool']['must'][1]['bool']['should'][0]['bool']['must'].push(DoumentationFilterQuery.statusQuery('gte'));
    } else if (selectedStatus.includes('Inactive') && !selectedStatus.includes('Active')) {
      currentQuery['query']['bool']['must'][1]['bool']['should'].push(DoumentationFilterQuery
        .getStatusQuery('*', this.documentationFilerModel.activeInactiveReasonType));
      currentQuery['query']['bool']['must'][1]['bool']['should'][0]['bool']['must'].push(DoumentationFilterQuery.statusQuery('lt'));
    } else if (selectedStatus.includes('Active') && selectedStatus.includes('Inactive')) {
      currentQuery['query']['bool']['must'][1]['bool']['should'].push(DoumentationFilterQuery
        .getStatusQuery('*', this.documentationFilerModel.activeInactiveReasonType));
    }
  }
  private queryFramer(currentQuery: object, index: number, event, isNested: boolean, pathName: string,
    fieldName: string) {
    let filterValue = '*';
    let filterArray = [];
    currentQuery['query']['bool']['must'][index]['bool']['must'] = [];
    if (event['length']) {
      if (isNested) {
        currentQuery['query']['bool']['must'][index]['bool']['must'].push
          (DoumentationFilterQuery.getPrimaryAssociationFilterQuery(pathName, fieldName));
      } else {
        currentQuery['query']['bool']['must'][index]['bool']['must']
          .push(DoumentationFilterQuery.getPrimaryFilterQuery(fieldName));
      }
      filterArray = utils.map(event, (filter) => {
        return `(${filter['value'].replace(/[-!?:\\['^~=\//\\{}(),.&&|| <>"+*\]]/g, '\\$&')})`;
      });
      filterValue = filterArray.join(' OR ');
      this.queryFormation(filterValue, isNested, currentQuery, index);
    }
    return { filterValue, filterArray };
  }
  queryFormation(filterValue: string, isNested: boolean, currentQuery: object, index: number) {
    if (isNested) {
      currentQuery['query']['bool']['must'][index]['bool']['must'][0]['nested']['query']['query_string']['query'] = filterValue;
    } else {
      currentQuery['query']['bool']['must'][index]['bool']['must'][0]['query_string']['query'] = filterValue;
    }
  }
  onStatusCollapsed(event) {
    if (event) {
      this.filterConfig.status.expanded = false;
    } else {
      this.filterConfig.status.expanded = true;
    }
  }
  resetStatus() {
    this.documentationFilerModel.isStatusFlag = false;
    this.changeDetector.detectChanges();
    this.documentationFilerModel.isStatusFlag = true;
    this.changeDetector.detectChanges();
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
          this.documentationFilerModel.statusSelectedList = [obj];
        }
        statusDataArray.push(obj);
      });
    }
    return statusDataArray;
  }
  onResetEvent(resetFlag: boolean) {
    if (resetFlag) {
      this.filterConfig.status.expanded = true;
      this.resetStatus();
      const currentQuery = DocumentationService.getElasticparam();
      currentQuery['query']['bool']['must'][1]['bool']['should'] = [];
      this.defaultStatusFetch(currentQuery);
      DocumentationService.setElasticparam(currentQuery);
      this.loadDataGrid.emit(true);
      this.changeDetector.detectChanges();

    }
  }
  onClearAllFilters() {
    this.filterComponents.forEach(filterCompItem => {
      if (filterCompItem.filterConfig['title'] !== 'Status') {
        filterCompItem.onReset(false);
      }
    });
    this.resetStatus();
    this.documentationFilerModel.isPanelClosed = true;
    const currentQuery = DocumentationService.getElasticparam();
    currentQuery['query']['bool']['must'].forEach((element, index) => {
      if (index > 1 && index < 21) {
        element['bool']['must'] = [];
      }
    });
    currentQuery['query']['bool']['must'][1]['bool']['should'] = [];
    this.defaultStatusFetch(currentQuery);
    DocumentationService.setElasticparam(currentQuery);
    this.loadDataGrid.emit(true);
  }
  defaultStatusFetch(currentQuery) {
    currentQuery['query']['bool']['must'][1]['bool']['should'].push(DoumentationFilterQuery.getStatusQuery('N', 'Active'));
    currentQuery['query']['bool']['must'][1]['bool']['should'][0]['bool']['must'].push(DoumentationFilterQuery.statusQuery('gte'));
  }
}
