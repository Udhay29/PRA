import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit,
  Output, OnDestroy, ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment';
import { MessageService } from 'primeng/components/common/messageservice';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ContractsModel } from './model/contracts.model';
import { ContractsService } from './service/contracts.service';
import { ContractsFilterQuery } from './query/contracts-list.query';
import { ContractListService } from './service/contract-list.service';
import { Contract, Hits, QueryMock, RootObject, CanComponentDeactivate } from './model/contracts.interface';
import { isArray } from 'util';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractsComponent implements OnInit, OnDestroy {
  @Output() loaderEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('contractItemRef') contractItemRef;
  @ViewChild('contractSearchBox') contractSearchBox;
  @Input() agreementID: number;
  contractsModel: ContractsModel;
  constructor(private readonly Service: ContractListService, private readonly changeDetector: ChangeDetectorRef,
    private readonly messageService: MessageService) {
    this.contractsModel = new ContractsModel();
  }

  ngOnInit() {
    this.getMockJson();
  }

  ngOnDestroy() {
    this.contractsModel.isSubscriberFlag = false;
  }
  onClickCreateContract() {
    if (this.contractsModel.isFilterEnabled) {
      this.onFilterClick();
    }
    this.contractsModel.isSplitView = true;
    this.contractsModel.showCreateContracts = true;
  }
  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    this.contractItemRef.contractItemModel.routerUrl = nextState.url;
    if (this.contractItemRef.contractItemModel.contractForm.pristine) {
      return true;
    } else {
      this.contractItemRef.contractItemModel.isShowPopup = true;
      this.changeDetector.detectChanges();
      return false;
    }
  }

  closeClick(event: Event) {
    this.contractsModel.isSplitView = false;
    this.contractsModel.showCreateContracts = false;
    if (this.contractsModel.isCreateContractOpen && event['type'] !== 'keyup') {
      this.showRowData(this.contractsModel.rowDetail);
    }
  }
  closeClickOnCreate(event) {
    this.contractsModel.isSplitView = false;
    this.contractsModel.showCreateContracts = false;
    this.getContractsListData();
  }

  getMockJson() {
    this.Service.getMockJson().pipe(takeWhile(() => this.contractsModel.isSubscriberFlag)).subscribe((data: QueryMock) => {
      this.contractsModel.sourceData = data;
      this.contractsModel.sourceData['agreementID'] = (this.agreementID);
      ContractsService.setElasticparam(ContractsFilterQuery.getContractsListQuery(this.contractsModel.sourceData));
      this.getContractsListData();
    });
  }
  preventSearch(): boolean | undefined {
    if (this.contractsModel.popUpForFilterClick) {
    return false;
    }
  }
  getGridValues(event: Event) {
    if (!this.contractsModel.popUpForFilterClick) {
      const enteredValue = (event.target && event.target['value']) ? event.target['value'] : '';
      const datePat = /^(\d{1,2})(\/)(\d{1,2})\2(\d{4}|\d{4})$/;
      const matchArray = enteredValue.match(datePat);
      const curretQuery = ContractsService.getElasticparam();
      const query = curretQuery['query']['bool']['must'][1]['nested']['query']['bool']['must'][0]['bool']['should'];
      if (enteredValue.toLowerCase().trim() === 'active' || enteredValue.toLowerCase().trim() === 'inactive') {
        this.frameStatusSearchQuery(enteredValue, query);
      } else if (matchArray !== null && Array.isArray(matchArray)) {
        this.frameDateSearchQuery(enteredValue, query);
      } else {
        query[0]['query_string']['fields'] = [];
        query[0]['query_string']['fields'] = this.contractsModel.defaultSearchFields;
        query[0]['query_string']['query'] = `${enteredValue.replace(/[-!?:\\['^~=\//\\{} (),.&&||<>"+*\]]/g, '\\$&')}*`;
        query.splice(1, 2);
      }
      this.closeClick(event);
      this.getContractsListData();
    }
  }

  frameDateSearchQuery(enteredValue: string, query) {
    query[0]['query_string']['fields'] = [];
    query[0]['query_string']['fields'] = this.contractsModel.dateSearchQuery;
    query[0]['query_string']['query'] = `${enteredValue}*`;
    query[1] = this.contractsModel.effectiveDateRange;
    query[1].range['ContractRanges.ContractEffectiveDate'].gte = enteredValue;
    query[1].range['ContractRanges.ContractEffectiveDate'].lte = enteredValue;
    query[2] = this.contractsModel.expirationDateRange;
    query[2].range['ContractRanges.ContractExpirationDate'].gte = enteredValue;
    query[2].range['ContractRanges.ContractExpirationDate'].lte = enteredValue;
  }

  frameStatusSearchQuery(enteredValue: string, query) {
    query[0]['query_string']['fields'] = [];
    query[0]['query_string']['fields'] = this.contractsModel.defaultSearchFields;
    query[1] = ContractsFilterQuery.getStatusQuery(this.contractsModel.sourceData['script'][enteredValue.toLowerCase().trim()]);
    query.splice(2, 1);
  }

  getContractsListData() {
    this.contractsModel.contractList = [];
    const params = ContractsService.getElasticparam();
    this.Service.getContractList(params).pipe(takeWhile(() => this.contractsModel.isSubscriberFlag)).subscribe((data: RootObject) => {
      const resultset = [];
      if (!utils.isEmpty(data) && !utils.isEmpty(data['hits']) && isArray(data['hits']['hits'])) {
        this.contractsModel.gridDataLength = data['aggregations']['nesting']['count']['value'];
        utils.forEach(data['hits']['hits'], (response: Hits) => {
          response['_source']['ContractRanges'][0]['Status'] = response['fields']['Status'][0];
          let resultSetData = response['_source']['ContractRanges'][0];
          resultSetData = this.formatListData(resultSetData);
          resultSetData['AgreementID'] = response['_source']['AgreementID'];
          resultSetData['ContractID'] = response['_source']['ContractID'];
          resultset.push(resultSetData);
        });
        this.contractsModel.contractList = resultset;
        this.contractsModel.noResultFoundFlag = (this.contractsModel.contractList.length === 0);
        this.changeDetector.detectChanges();
      }
    }, (error: Error) => {
      this.contractsModel.contractList = [];
      this.contractsModel.noResultFoundFlag = true;
      this.toastMessage('error', error.message);
      this.changeDetector.detectChanges();
    });
  }

  formatListData(resultSetData: Contract): Contract {
    const keySets = Object.keys(resultSetData);
    utils.forEach(keySets, (key: string) => {
      resultSetData[key] = resultSetData[key] ? resultSetData[key] : '--';
    });
    resultSetData.ContractEffectiveDate = resultSetData.ContractEffectiveDate ? moment(resultSetData.
      ContractEffectiveDate).format('MM/DD/YYYY') : '--';
    resultSetData.ContractExpirationDate = resultSetData.ContractExpirationDate ?
      moment(resultSetData.ContractExpirationDate).format('MM/DD/YYYY') : '--';
    return resultSetData;
  }

  loadGridData(event: Event) {
    if (event && this.contractsModel.contractList && this.contractsModel.contractList.length) {
      const elasticQuery = ContractsService.getElasticparam();
      elasticQuery['size'] = this.contractsModel.tableSize;
      elasticQuery['from'] = event['first'];
      this.contractsModel.tableSize = event['rows'];
      this.sortGridData(elasticQuery, event);
      const paramQuery = {
        'query': elasticQuery,
        'event': event
      };
      ContractsService.setElasticparam(elasticQuery);
      this.getContractsListData();
    }
  }

  sortGridData(elasticQuery: object, event: Event) {
    if (event && event['sortField'] && event['sortOrder']) {
      const field = this.contractsModel.getFieldNames[event['sortField']];
      const sortVal = utils.find(this.contractsModel.tableColumns,
        ((tableColumns: object) => tableColumns['name'] === event['sortField']));
      elasticQuery['sort'] = [];
      elasticQuery['sort'][0] = {};
      elasticQuery['sort'][0][`ContractRanges.${field}`] = {};
      elasticQuery['sort'][0][`ContractRanges.${field}`]['order'] = event['sortOrder'] === 1 ? 'asc' : 'desc';
      elasticQuery['sort'][0][`ContractRanges.${field}`]['missing'] = event['sortOrder'] === 1 ? '_first' : '_last';
    }
    if (event['sortField'] === 'Status') {
      const order = event['sortOrder'] === 1 ? 'asc' : 'desc';
      elasticQuery['sort'] = ContractsFilterQuery.getStatusSortQuery(this.contractsModel.sourceData.script['status'], order);
    }
  }
  onFilterClick() {
    this.checkIfContractFormIsTouched(false);
  }
  onRowSelect(event: Event) {
    this.contractsModel.rowDetail = event;
    if (this.contractsModel.showCreateContracts && this.contractItemRef) {
      this.contractItemRef.contractItemModel.isCancelClicked = true;
      this.contractsModel.isCreateContractOpen = true;
      this.contractItemRef.onClose();
    } else {
      this.showRowData(event);
    }
  }
  showRowData(event: Event) {
    this.contractsModel.isCreateContractOpen = false;
    this.contractsModel.showCreateContracts = false;
    if (event && event.type === 'row' && !utils.isEmpty(event['data'])) {
      if (this.contractsModel.isFilterEnabled) {
        this.onFilterClick();
      }
      this.contractsModel.isSplitView = true;
      this.contractsModel.detailsValue = event['data'];
    }
  }

  loader(event: boolean) {
    this.loaderEvent.emit(event);
  }

  toastMessage(key: string, data: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? 'Error' : 'Success',
      detail: data
    };
    this.messageService.clear();
    this.messageService.add(message);
  }
  filterGridData() {
    this.getContractsListData();
  }
  checkIfContractFormIsTouched(searchInpuFlag: boolean) {
    if (this.contractItemRef && this.contractItemRef.contractItemModel.contractForm) {
      const contractForm = this.contractItemRef.contractItemModel.contractForm;
      this.checkContractFormValue(contractForm, searchInpuFlag);
    } else {
      if (!searchInpuFlag) {
        this.setFilterFlags();
      }
    }
  }
  private checkContractFormValue(contractForm: any, searchInpuFlag: boolean) {
    let checkContractFieldsValue = false;
    utils.forIn(contractForm.controls, (value: FormControl, name: string) => {
      if (contractForm.controls[name].value) {
        this.contractsModel.popUpForFilterClick = true;
        searchInpuFlag ? this.contractsModel.isSearchWithCreate = true : this.contractsModel.isSearchWithCreate = false;
        checkContractFieldsValue = true;
      }
    });
    if (!checkContractFieldsValue && !searchInpuFlag) {
      this.setFilterFlags();
    }
  }

  setFilterFlags() {
    this.contractsModel.filterFlag = !this.contractsModel.filterFlag;
    this.contractsModel.isSplitView = false;
    this.contractsModel.isFilterEnabled = !this.contractsModel.isFilterEnabled;
  }
  onClickPopupYes() {
    this.contractItemRef.contractItemModel.contractForm.reset();
    if (this.contractsModel.isSearchWithCreate) {
      this.contractsModel.isSplitView = false;
      this.contractSearchBox.nativeElement.focus();
      this.contractsModel.popUpForFilterClick = false;
    } else {
      this.contractsModel.filterFlag = true;
      this.contractsModel.isFilterEnabled = true;
      this.contractsModel.showCreateContracts = false;
      this.contractsModel.popUpForFilterClick = false;
      this.contractsModel.isSplitView = false;
    }
  }
  onClickPopupNo() {
    if (this.contractsModel.isSearchWithCreate) {
      this.contractSearchBox.nativeElement.blur();
    }
    this.contractsModel.popUpForFilterClick = false;
  }
}
