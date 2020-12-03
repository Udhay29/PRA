import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, OnDestroy, OnInit, Input, ViewChild, ElementRef
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { timer } from 'rxjs';
import * as moment from 'moment';
import * as utils from 'lodash';
import { takeWhile } from 'rxjs/operators';

import { isArray } from 'util';

import { CargoReleaseModel } from './model/cargo-release.model';
import { CargoReleaseService } from './services/cargo-release.service';
import { CargoReleaseConstants } from './model/cargo-release.constants';
import { CargoFilterQuery } from './cargo-release-filter/query/cargo-filter.query';
import { QueryMock } from './model/cargo-release.interface';


@Component({
  selector: 'app-cargo-release',
  templateUrl: './cargo-release.component.html',
  styleUrls: ['./cargo-release.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CargoReleaseComponent implements OnInit, OnDestroy {
  @Input() agreementID: number;
  @ViewChild('cargoTable') cargoTable: any;
  cargoReleaseModel: CargoReleaseModel;
  cargoReleaseConstants: CargoReleaseConstants;
  scrollableBodyClass = ['.ui-table-scrollable-body'];
  constructor(
    private readonly cargoService: CargoReleaseService,
    private readonly changeDetector: ChangeDetectorRef,
    private currencyPipe: CurrencyPipe) {
    this.cargoReleaseModel = new CargoReleaseModel();
    this.cargoReleaseConstants = new CargoReleaseConstants();
  }
  ngOnInit() {
    this.getMockJson();
  }

  getMockJson() {
    this.cargoService.getMockJson().pipe(takeWhile(() => this.cargoReleaseModel.subscribeFlag)).subscribe((data: QueryMock) => {
      this.cargoReleaseModel.sourceData = data;
      this.cargoReleaseModel.sourceData['agreementID'] = (this.agreementID);
      CargoReleaseService.setElasticparam(CargoFilterQuery.getCargoDataQuery(this.agreementID, this.cargoReleaseModel.sourceData));
      this.getGridValues(null, 'initialFetch');
    });
  }
  ngOnDestroy() {
    this.cargoReleaseModel.subscribeFlag = false;
  }
  sortClick(sortEvent: Event): void {
    if (sortEvent && sortEvent['sortField'] && sortEvent['sortOrder']) {
      this.cargoReleaseModel.isSortClicked = true;
      const field = this.cargoReleaseModel.sortColumns[sortEvent['sortField']];
      const rootVal = this.cargoReleaseModel.nestedColumns[sortEvent['sortField']];
      this.cargoReleaseModel.gridQuery['sort'] = [];
      this.cargoReleaseModel.gridQuery['sort'][0] = {};
      this.cargoReleaseModel.gridQuery['sort'][0][field] = {};
      this.sortCargoColumns(sortEvent, field, rootVal);
    }
  }
  sortCargoColumns(sortEvent: Event, field: any, rootVal: any) {
    if (sortEvent['sortField'] === 'businessUnitData') {
      this.cargoReleaseModel.gridQuery['sort'][0] = {
        '_script': {
          'script': {
            'lang': 'painless',
            'source': `def x = [];
              for(def i = 0; i < params['_source']['financeBusinessUnitAssociations'].length; i++) {
              x.add(params['_source']['financeBusinessUnitAssociations'][i]['financeBusinessUnitCode'])}
              return String.join(' ', x);`
          },
          'order': 'asc',
          'type': 'string'
        }
      };
      this.cargoReleaseModel.gridQuery['sort'][0]['_script']['order'] = sortEvent['sortOrder'] === 1 ? 'asc' : 'desc';
    } else if (sortEvent['sortField'] === 'invalidReasonTypeName') {
      const order = sortEvent['sortOrder'] === 1 ? 'asc' : 'desc';
      this.cargoReleaseModel.gridQuery['sort'] =
        CargoFilterQuery.getStatusSortQuery(this.cargoReleaseModel.sourceData.script['status'], order);
    } else {
      this.cargoReleaseModel.gridQuery['sort'][0][field]['order'] = sortEvent['sortOrder'] === 1 ? 'asc' : 'desc';
      this.cargoReleaseModel.gridQuery['sort'][0][field]['missing'] = sortEvent['sortOrder'] === -1 ? '_first' : '_last';
      this.getNestedFieldSortQuery(rootVal, field, sortEvent);
    }
  }
  getNestedFieldSortQuery(rootVal: any, field: any, sortEvent: Event) {
    if (rootVal) {
      this.cargoReleaseModel.gridQuery['sort'][0][field]['nested_path'] = rootVal;
      this.cargoReleaseModel.gridQuery['sort'][0][field]['mode'] = sortEvent['sortOrder'] === 1 ? 'min' : 'max';
    }
  }


  frameSearchQuery(currentQuery: any, enteredValue: string) {
    enteredValue = enteredValue.replace(/[,]/g, '');
    enteredValue = enteredValue.replace(/[!?:\\["^~=\//\\{}&&||<>()+* \]-]/g, '\\$&');
    const enteredString = enteredValue.toLowerCase();
    const query = currentQuery['query']['bool']['must'][2]['bool']['should'];
    currentQuery['query']['bool']['must'][2]['bool']['should'] = [];
    currentQuery['query']['bool']['must'][2]['bool']['should'] = CargoFilterQuery.defaultSearchQuery();
    utils.forEach(currentQuery['query']['bool']['must'][2]['bool']['should'], (shouldQuery) => {
      if (shouldQuery['nested']) {
        shouldQuery['nested']['query']['query_string']['query'] = `*${enteredValue}*`;
      } else {
        shouldQuery['query_string']['query'] = `*${enteredValue}*`;
      }
    });
    if (enteredString !== 'active' && enteredString !== 'inactive' && enteredString !== 'deleted' && query.length === 5) {
      currentQuery['query']['bool']['must'][2]['bool']['should'].pop();
    }
    if (enteredString.trim() === 'active' || enteredString.trim() === 'inactive' || enteredString.trim() === 'deleted') {
      currentQuery['query']['bool']['must'][2]['bool']['should']
        .push(CargoFilterQuery.getStatusQuery(this.cargoReleaseModel.sourceData['script'][enteredString]));
    }
  }
  frameDateSearchQuery(currentQuery: any, enteredValue: string) {
    currentQuery['query']['bool']['must'][1]['bool']['should'] = [];
    currentQuery['query']['bool']['must'][1]['bool']['should'] = CargoFilterQuery.dateSearchQuery();
    utils.forEach(currentQuery['query']['bool']['must'][1]['bool']['should'], (shouldQuery) => {
      if (shouldQuery['range']['effectiveDate']) {
        shouldQuery['range']['effectiveDate']['gte'] = enteredValue;
        shouldQuery['range']['effectiveDate']['lte'] = enteredValue;
      }
      if (shouldQuery['range']['expirationDate']) {
        shouldQuery['range']['expirationDate']['gte'] = enteredValue;
        shouldQuery['range']['expirationDate']['lte'] = enteredValue;
      }
    });
  }
  getGridValues(typedVal, type, event?: Event): void {
    const currentQuery = CargoReleaseService.getElasticparam();
    if (typedVal !== null) {
      const enteredValue = (typedVal.srcElement && typedVal.srcElement['value']) ? typedVal.srcElement['value'] : '';
      if (type === 'searchBox') {
        this.SearchQueryFramer(enteredValue, currentQuery, typedVal, type);
        this.cargoReleaseModel.isSplitView = false;
      }
      if (type === 'initialFetch') {
        this.loadGridData(event);
      }
    } else {
      this.loadGridData(event);
    }
  }
  SearchQueryFramer(enteredValue, currentQuery, typedVal, type) {
    this.cargoReleaseModel.isSearchGrid = true;
    if (typedVal['currentTarget']['value'] !== '' && type === 'searchBox') {
      currentQuery['from'] = 0;
    }
    this.frameSearchQuery(currentQuery, enteredValue);
    CargoReleaseService.setElasticparam(currentQuery);
    this.cargoTable.reset();
  }
  loadGridData(event) {
    this.sortClick(event);
    const currentQuery = CargoReleaseService.getElasticparam();
    this.cargoService.getCargoGridValues(currentQuery)
      .pipe(takeWhile(() => this.cargoReleaseModel.subscribeFlag)).subscribe(data => {
        this.cargoReleaseModel.cargoList = [];
        if (data && data['hits'] && isArray(data['hits']['hits'])) {
          this.cargoReleaseModel.loading = false;
          this.cargoReleaseModel.gridDataLength = data['hits']['total'];
          const gridValues = [];
          data['hits']['hits'].forEach(cargoData => {
            cargoData['_source']['invalidReasonTypeName'] = cargoData['fields']['Status'][0];
            this.gridDataFramer(cargoData['_source']);
            this.sectionFramer(cargoData['_source']);
            this.contractFramer(cargoData['_source']);
            this.buFramer(cargoData['_source']);
            gridValues.push(cargoData['_source']);
          });
          this.cargoReleaseModel.cargoList = gridValues;
          this.cargoReleaseModel.noResultFoundFlag = (this.cargoReleaseModel.cargoList.length === 0);
        } else {
          this.cargoReleaseModel.loading = false;
          this.cargoReleaseModel.cargoList = [];
          this.cargoReleaseModel.noResultFoundFlag = true;
        }
        if (this.cargoReleaseModel.gridDataLength !== 0) {
          this.cargoReleaseModel.isPagination = true;
        } else {
          this.cargoReleaseModel.isPagination = false;
        }
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.cargoReleaseModel.cargoList = [];
        this.cargoReleaseModel.isSearchGrid = true;
        this.cargoReleaseModel.loading = false;
        this.cargoReleaseModel.noResultFoundFlag = true;
        this.changeDetector.detectChanges();
      });
  }
  gridDataFramer(cargoData) {
    cargoData['agreementDefaultIndicator'] = (cargoData['agreementDefaultIndicator'] === 'Yes') ? 'Yes' : 'No';
    cargoData['cargoReleaseAmount'] = this.currencyPipe.transform(cargoData['cargoReleaseAmount'], 'USD', 'symbol', '1.2-4');
    cargoData['effectiveDate'] = this.dateFormatter(cargoData['effectiveDate']);
    cargoData['expirationDate'] = this.dateFormatter(cargoData['expirationDate']);
    return cargoData;
  }
  contractFramer(contractData) {
    const contractDto = contractData['contractAssociation'];
    if (!utils.isEmpty(contractDto)) {
      contractData['customerContractName'] = `${contractDto['contractDisplayName']}`;
    } else {
      contractData['customerContractName'] = '--';
    }
    return contractData;
  }
  buFramer(businessUnitData) {
    businessUnitData['businessUnitData'] = [];
    if (!utils.isEmpty(businessUnitData['financeBusinessUnitAssociations'])) {
      businessUnitData['financeBusinessUnitAssociations'].forEach(businessUnitAssociatedData => {
        if (!utils.isEmpty(businessUnitAssociatedData['financeBusinessUnitCode'])) {
          businessUnitData['businessUnitData'].push(businessUnitAssociatedData['financeBusinessUnitCode']);
        } else {
          businessUnitData['businessUnitData'].push('--');
        }
      });
    } else {
      businessUnitData['businessUnitData'].push('--');
    }
    return businessUnitData;
  }
  sectionFramer(sectionData) {
    if (!utils.isEmpty(sectionData['sectionAssociation'])) {
      sectionData['customerSectionName'] = sectionData['sectionAssociation']['customerAgreementContractSectionName'];
    } else {
      sectionData['customerSectionName'] = '--';
    }
    return sectionData;
  }
  dateFormatter(value: string): string {
    return moment(value).format('MM/DD/YYYY');
  }
  amountFormatter(amount: string): string {
    let cargoAmountValue;
    if (amount) {
      const value = amount.toLocaleString();
      if (value.includes('.')) {
        cargoAmountValue = value;
      } else {
        const dataVal = `${value}${'.00'}`;
        cargoAmountValue = dataVal;
      }
    }
    return cargoAmountValue;
  }
  onFilterClick(): void {
    this.cargoReleaseModel.isSearchGrid = true;
    this.cargoReleaseModel.filterFlag = !this.cargoReleaseModel.filterFlag;
    this.cargoReleaseModel.isSplitView = false;
    this.cargoReleaseModel.filterEnabled = !this.cargoReleaseModel.filterEnabled;
  }
  onRowSelect(event: Event) {
    if (event.type === 'row' && !utils.isEmpty(event['data'])) {
      if (this.cargoReleaseModel.filterEnabled) {
        this.onFilterClick();
      }
      this.cargoReleaseModel.isSplitView = true;
      this.cargoReleaseModel.viewGridData = event['data'];
    }
  }
  closeClick(event: Event): void {
    this.cargoReleaseModel.isSplitView = false;
    this.cargoReleaseModel.editFlag = true;
  }
  onEditClick(event: boolean): void {
    this.cargoReleaseModel.editGridData = this.cargoReleaseModel.viewGridData;
    this.cargoReleaseModel.isSplitView = false;
  }
  closeSplitView(): void {
    this.cargoReleaseModel.editFlag = true;
  }
  lazyLoadCargoDetails(event: Event): void {
    if (this.cargoReleaseModel.sourceData) {
      this.cargoReleaseModel.lazyFlag = true;
      this.cargoReleaseModel.loading = true;
      this.cargoReleaseModel.gridQuery = CargoReleaseService.getElasticparam();
      this.cargoReleaseModel.gridQuery['size'] = event['rows'];
      this.cargoReleaseModel.gridQuery['from'] = event['first'];
      CargoReleaseService.setElasticparam(this.cargoReleaseModel.gridQuery);
      if (this.cargoReleaseModel.searchValue.length) {
        const typedVal = {
          'currentTarget': {}
        };
        typedVal['currentTarget']['value'] = this.cargoReleaseModel.searchValue;
        this.getGridValues(typedVal, 'searchBox', event);
      } else {
        this.getGridValues(null, 'initialFetch', event);
      }
      this.changeDetector.detectChanges();
    }
  }
  getFilterKey(event): void {
    this.cargoReleaseModel.filterKey = event;
  }
  loadGridBasedOnFilter(event): void {
    this.getGridValues(event, 'initialFetch');
  }
  clearFilters(): void {
    this.getGridValues(null, 'initialFetch');
  }
}
