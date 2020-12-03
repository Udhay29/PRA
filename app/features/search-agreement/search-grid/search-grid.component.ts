import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, OnDestroy, Input,
   Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as lodashutils from 'lodash';

import { SearchGridModel } from './model/search-grid.model';
import { SearchGridUtility } from './services/search-grid.utility';
import { SearchService } from './../services/search.service';
import * as utils from 'lodash';
import { ElasticResponseModel } from '../model/search-agreement.interface';
import { LocalStorageService } from './../../../shared/jbh-app-services/local-storage.service';

@Component({
  selector: 'app-search-grid',
  templateUrl: './search-grid.component.html',
  styleUrls: ['./search-grid.component.scss'],
  providers: [LocalStorageService]
})
export class SearchGridComponent implements OnInit, OnDestroy {
  searchGridModel: SearchGridModel;
  @Input()
  set dataList(dataValue: ElasticResponseModel) {
    SearchGridUtility.populateData(this.searchGridModel, dataValue, this.changeDetector);
  }
  @Input()
  set loader(showLoad: boolean) {
    this.searchGridModel.isShowLoader = showLoad;
  }
  @Input()
  set isResetGrid(showLoad: boolean) {
    if (showLoad) {
      this.resetGridData();
    }
  }
  @Output() pageLoad: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() asideToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() cancelFlag: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('searchTable') searchTable: any;

  constructor(private readonly changeDetector: ChangeDetectorRef,
    private readonly router: Router, private readonly localStore: LocalStorageService, private readonly searchService: SearchService) {
    this.searchGridModel = new SearchGridModel();
  }

  ngOnInit() {
    this.resetGrid();
  }
  ngOnDestroy() {
    SearchService.setElasticparam({});
  }
  onSearchClicked() {
    this.searchGridModel.isSearchFlag = !this.searchGridModel.isSearchFlag;
    this.searchGridModel.isIconFlag = !this.searchGridModel.isIconFlag;
    this.asideToggle.emit(this.searchGridModel.isSearchFlag);
  }
  resetGrid() {
    this.searchService.getResetGrid().subscribe((resetData: any) => {
      if (resetData) {
        this.resetGridData();
      }
    });
  }
  resetGridData() {
    this.searchGridModel.gridData = [];
    this.searchGridModel.isPaginatorFlag = false;
    this.searchGridModel.isResultsFound = true;
    this.searchGridModel.isDefaultText = true;
    this.searchTable.reset();
  }
  loadGridData(event) {
    if (event && this.searchGridModel.gridData && this.searchGridModel.gridData.length) {
      const elasticQuery = SearchService.getElasticparam();
      this.searchGridModel.isCarrierFlag ? this.loadCarrierrGrid(elasticQuery, event) : this.loadGrid(elasticQuery, event);
    }
  }
  loadGrid(elasticQuery: object, event) {
    elasticQuery['size'] = event['rows'];
      elasticQuery['from'] = event['first'];
      this.searchGridModel.pageStart = event['first'];
      this.searchGridModel.tableSize = event['rows'];
      this.sortGridData(elasticQuery, event);
     this.fetchSortResults(elasticQuery, event);
  }
  fetchSortResults(elasticQuery: object, event) {
     const paramQuery = {
        'query': elasticQuery,
        'event': event,
        'carrierFlag': this.searchGridModel.isCarrierFlag
      };
      SearchService.setElasticparam(elasticQuery);
      this.pageLoad.emit(paramQuery);
  }
  loadCarrierrGrid(elasticQuery: object, event) {
    elasticQuery['size'] = event['rows'];
      elasticQuery['from'] = event['first'];
      this.searchGridModel.tableSize = event['rows'];
    this.sortCarrierGridData(elasticQuery, event);
    this.fetchSortResults(elasticQuery, event);
  }
  sortGridData(elasticQuery: object, event) {
    if (event && event['sortField'] === 'Agreement Name (Code)') {
      const sortVal = utils.find(this.searchGridModel.tableColumns,
        ((tableColumns: object) => tableColumns['name'] === event['sortField'] ));
      const keyVal = (event['sortField'] && sortVal) ? sortVal['keyword'] : 'AgreementName.aux';
      elasticQuery['sort'] = {};
      elasticQuery['sort'][keyVal] = (event['sortOrder'] === 1) ? 'desc' : 'asc';
    }
  }
  sortCarrierGridData(elasticQuery: object, event) {
    event['carrierFlag'] = this.searchGridModel.isCarrierFlag;
    const sortorderValue = (event['sortOrder'] === 1) ? 'asc' : 'desc';
    if (event && event['sortField']) {
      elasticQuery['sort'] = [];
      switch (event['sortField']) {
        case 'Agreement Type':
            elasticQuery['sort'].push({
              'agreementType.keyword': {
                'order': sortorderValue
              }
            });
            break;
        case 'Agreement Name (Code)':
            elasticQuery['sort'].push({
              'carrierAgreementName.keyword': {
              'order': sortorderValue
              }
            });
            break;
        case 'Agreement Status':
            elasticQuery['sort'].push(
              {
                '_script': {
                  'script': {
                    'lang': 'painless',
                    'source': `def x = [];def sfn = new SimpleDateFormat(\'yyyy/MM/dd\');\n
                    def today = new Date();def todayDate = sfn.parse(sfn.format(today));\n
                    def sf=new SimpleDateFormat('MM/dd/yyyy');def expire=sf.parse(doc['expirationDate.keyword'].value);\n
                    if((expire.after(todayDate) || expire.equals(todayDate)) && doc['invalidIndicator'].value == 'N' &&\n
                     doc['invalidReasonType.keyword'].value == 'Active'){x.add('Active')}else if((expire.before(todayDate)\n
                      && doc['invalidIndicator'].value == 'Y' && doc['invalidReasonType.keyword'].value == 'InActive')\n
                       || (expire.before(todayDate) && doc['invalidIndicator'].value == 'N'\n
                        && doc['invalidReasonType.keyword'].value == 'InActive') || (expire.before(todayDate)\n
                         && doc['invalidIndicator'].value == 'N' && doc['invalidReasonType.keyword'].value == 'Active'))\n
                         {x.add('Inactive')}else if(doc['invalidIndicator'].value == 'Y'\n
                          && doc['invalidReasonType.keyword'].value == 'Deleted'){x.add('Deleted')}return x`
                  },
                  'order': sortorderValue,
                  'type': 'string'
                }
              }
            );
      }
    }
  }
  onRowSelect(event) {
    if (event && event.data && event.data._source && event.data._source.AgreementType) {
      event.data._source.AgreementType.toLowerCase() === 'customer' ? this.viewCustomerAgreement(event) : this.viewCarrierAgreement(event);
    }
  }
  viewCustomerAgreement(event) {
    if (event.data._source.AgreementID) {
      const agreementId = event.data._source.AgreementID;
      this.localStore.clearAllItems();
      this.router.navigate(['/viewagreement'], { queryParams: { id: agreementId } });
    }
  }
  viewCarrierAgreement(event) {
    if (event.data._source.carrierAgreementID) {
      const agreementId = event.data._source.carrierAgreementID;
      this.localStore.clearAllItems();
      this.router.navigate(['/viewcarrierdetails', agreementId]);
  }
  }
}
