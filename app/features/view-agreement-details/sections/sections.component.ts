import { TimeZoneService } from './../../../shared/jbh-app-services/time-zone.service';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter,
  Input, OnInit, Output, OnDestroy, ViewChild
} from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment';
import { MessageService } from 'primeng/components/common/messageservice';
import { SectionsModel } from './model/sections.model';
import { SectionsService } from './service/sections.service';
import { SectionsFilterQuery } from './query/sections-list.query';
import { SectionListService } from './service/section-list.service';
import { Section, Hits, QueryMock, RootObject, AgreementDetails, VersionBillToList, TableColumnModel } from './model/sections.interface';
import { isArray } from 'util';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { SectionListUtility } from './service/section-list.utility';
@Component({
  selector: 'app-section-list',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionListComponent implements OnInit, OnDestroy {
  @Output() loaderEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('sectionItemRef') sectionItemRef;
  @ViewChild('sectionTable') sectionTable: any;
  @Input() agreementID: number;
  @Input() set agreementDetails(agreementDetails: AgreementDetails) {
    this.agreement = agreementDetails;
  }
  sectionsModel: SectionsModel;
  agreement: AgreementDetails;
  isSectionSearch: boolean;
  constructor(
    private readonly Service: SectionListService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly messageService: MessageService,
    private readonly shared: BroadcasterService,
    private readonly timeZoneService: TimeZoneService,
    private readonly sectionListUtility: SectionListUtility
  ) {
    this.sectionsModel = new SectionsModel();
    this.isSectionSearch = false;
  }
  ngOnInit() {
    this.getMockJson();
  }
  ngOnDestroy() {
    this.sectionsModel.isSubscriberFlag = false;
  }
  closeClick(event: Event) {
    this.sectionsModel.isSplitView = false;
  }
  getMockJson() {
    this.Service.getMockJson()
      .pipe(takeWhile(() => this.sectionsModel.isSubscriberFlag))
      .subscribe((data: QueryMock) => {
        this.sectionsModel.sourceData = data;
        this.sectionsModel.sourceData['agreementID'] = this.agreementID;
        SectionsService.setElasticparam(
          SectionsFilterQuery.getSectionsListQuery(
            this.sectionsModel.sourceData
          )
        );
        this.getSectionsListData();
      });
  }
  getGridValues(event: Event) {
    this.sectionsModel.noResultFoundFlag = this.sectionsModel.sectionList.length === 0;
    if (this.sectionsModel.isShowSectionsCreation) {
      if (!this.sectionItemRef.sectionsCreationModel.isShowPopup) {
        this.getGridValueCode(event);
      }
    } else {
      this.getGridValueCode(event);
    }
  }
  getGridValueCode(event) {
    this.isSectionSearch = true;
    const enteredValue = event.target && event.target['value'] ? event.target['value'] : '';
    const datePat = /^(\d{1,2})(\/)(\d{1,2})\2(\d{4}|\d{4})$/;
    const query = SectionsService.getElasticparam();

    const matchArray = enteredValue.match(datePat);
    const searchText = `*${enteredValue.replace(/[-!?:\\['^~=\//\\{}(),.&&||<>"+*\]]/g, '\\$&')}*`;
    const curretQuery = query['query']['bool']['must'][1]['bool']['should'][0]['nested']['query']['bool']['must'][1]['bool']['should'];
    curretQuery[0]['query_string']['query'] = searchText;
    if (curretQuery.length === 3 || curretQuery.length === 2) {
      curretQuery.splice(1, curretQuery.length - 1);
    }
    if (matchArray !== null && Array.isArray(matchArray) && moment(enteredValue).isValid()) {
      this.frameDateSearchQuery(enteredValue,
        curretQuery);
    }
    this.frameStatusSearchQuery(curretQuery, enteredValue);
    this.closeClick(event);
    this.getSectionsListData();
    if (this.sectionsModel.isShowSectionsCreation) {
      this.sectionItemRef.onClose();
    }
  }
  frameStatusSearchQuery(curretQuery, searchText) {
    searchText = searchText ? searchText.toLowerCase().trim() : '';
    if (searchText === 'active') {
      const activeStatusQuery = SectionsFilterQuery.getFilterActiveStatusQuery();
      curretQuery.push(activeStatusQuery);
    } else if (searchText === 'deleted') {
      const deletedStatusQuery = SectionsFilterQuery.getFilterDeletedStatusQuery();
      curretQuery.push(deletedStatusQuery);
    } else if (searchText === 'inactive') {
      const inactiveStatusQuery = SectionsFilterQuery.getFilterInActiveStatusQuery();
      curretQuery.push(inactiveStatusQuery);
    }
  }
  frameDateSearchQuery(enteredValue: string, query) {
    query[0]['query_string']['query'] = `${enteredValue}*`;
    const boolQuery = {
      'bool': {
        'should': [

        ]
      }
    };
    query.push(boolQuery);
    const dateRangeQuery = query[1]['bool']['should'];
    dateRangeQuery[0] = this.sectionsModel.effectiveDateRange;
    dateRangeQuery[0].range['SectionRanges.SectionEffectiveDate'].gte = enteredValue;
    dateRangeQuery[0].range['SectionRanges.SectionEffectiveDate'].lte = enteredValue;
    dateRangeQuery[1] = this.sectionsModel.expirationDateRange;
    dateRangeQuery[1].range['SectionRanges.SectionExpirationDate'].gte = enteredValue;
    dateRangeQuery[1].range['SectionRanges.SectionExpirationDate'].lte = enteredValue;

    dateRangeQuery[2] = this.sectionsModel.originalEffectiveDateRange;
    dateRangeQuery[2].range['SectionRanges.originalEffectiveDate.keyword'].gte = enteredValue;
    dateRangeQuery[2].range['SectionRanges.originalEffectiveDate.keyword'].lte = enteredValue;

    dateRangeQuery[3] = this.sectionsModel.originalExpirationDateRange;
    dateRangeQuery[3].range['SectionRanges.originalExpirationDate.keyword'].gte = enteredValue;
    dateRangeQuery[3].range['SectionRanges.originalExpirationDate.keyword'].lte = enteredValue;
  }
  checkSearch() {
    if (this.sectionsModel.isShowSectionsCreation &&
      (this.sectionItemRef.sectionsCreationModel.isShowPopup || this.sectionsModel.isShowPopup)) {
      return false;
    } else {
      return true;
    }
  }
  checkOnFocus(searchInpuFlag: boolean) {
    if (this.sectionsModel.isShowSectionsCreation && this.sectionItemRef.sectionsCreationModel.sectionForm.dirty) {
      this.sectionItemRef.onClose();
    }
    this.closeClick(event);
    if (this.sectionItemRef) {
      this.sectionItemRef.onClose();
    } else {
      if (!searchInpuFlag) {
        this.setFilterFlags();
      }
    }

  }
  setFilterFlags() {
    this.sectionsModel.filterFlag = !this.sectionsModel.filterFlag;
    this.sectionsModel.isSplitView = false;
    this.sectionsModel.isFilterEnabled = !this.sectionsModel.isFilterEnabled;
  }
  getSectionsListData() {
    this.sectionsModel.sectionList = [];
    const params = SectionsService.getElasticparam();
    this.sectionsModel.isShowLoader = true;
    this.sectionsModel.sectionsDataSubscription = this.Service.getSectionList(params)
      .pipe(takeWhile(() => this.sectionsModel.isSubscriberFlag))
      .subscribe(
        (data: RootObject) => {
          let resultset = [];
          this.sectionsModel.isShowLoader = false;
          if (!utils.isEmpty(data) && !utils.isEmpty(data['hits']) && isArray(data['hits']['hits'])) {
            this.sectionsModel.gridDataLength = data['hits']['total'];
            utils.forEach(data['hits']['hits'], (response: Hits) => {
              resultset = resultset.concat(this.sectionListUtility.getSectionRangesDetails(response));
            });
            this.sectionsModel.sectionList = resultset;
            this.sectionsModel.noResultFoundFlag = this.sectionsModel.sectionList.length === 0;
            this.changeDetector.detectChanges();
          }
        },
        (error: Error) => {
          this.sectionsModel.isShowLoader = false;
          this.sectionsModel.sectionList = [];
          this.sectionsModel.noResultFoundFlag = true;
          this.toastMessage('error', 'ES data is currently unavailable. Contact help desk');
          this.changeDetector.detectChanges();
        }
      );
  }
  loadGridData(event) {
    if (event && this.sectionsModel.sectionList && this.sectionsModel.sectionList.length) {
      const elasticQuery = SectionsService.getElasticparam();
      elasticQuery['size'] = this.sectionsModel.size;
      elasticQuery['from'] = this.sectionsModel.from;
      this.sectionsModel.tableSize = this.sectionsModel.size;
      this.sortGridData(elasticQuery, event);
      SectionsService.setElasticparam(elasticQuery);
      this.getSectionsListData();
    }
  }
  loadSectionsValuesLazy(event: Event) {
    this.sectionsModel.from = event['first'];
    this.sectionsModel.size = event['rows'];
    this.sectionsModel.sortOrder = (event['sortOrder'] === 1) ? 'asc' : 'desc';
    const sortProperty = event['sortField'];
    utils.forEach(this.sectionsModel.tableColumns, (response: TableColumnModel) => {
      if (sortProperty === response.property || sortProperty === response.name) {
        this.sectionsModel.name = response.name;
      }
    });
  }

  sortGridData(elasticQuery: object, event: Event) {
    const order = this.sectionsModel.sortOrder;
    const fieldPrefix = 'SectionRanges';
    if (!event['name']) {
      event['name'] = this.sectionsModel.name;
    }
    elasticQuery['sort'] = [];
    if (event && event['name'] && order) {
      if (event['name'] === 'Status') {
        elasticQuery['sort'][0] = SectionsFilterQuery.getStatusSortQuery(this.sectionsModel.sourceData.script['status'], order);
      } else {
        const field = this.sectionsModel.getFieldNames[event['name']];
        elasticQuery['sort'] = [];
        elasticQuery['sort'][0] = {};
        elasticQuery['sort'][0][`${fieldPrefix}.${field}`] = {};
        elasticQuery['sort'][0][`${fieldPrefix}.${field}`]['order'] = order;
      }
    }
  }
  onFilterClick() {
    this.sectionsModel.filterFlag = !this.sectionsModel.filterFlag;
    this.sectionsModel.isSplitView = false;
    this.sectionsModel.isFilterEnabled = !this.sectionsModel.isFilterEnabled;
    this.sectionsModel.isShowSectionsCreation = false;
  }
  onRowSelect(event: Event) {
    if (event.type === 'row' && !utils.isEmpty(event['data'])) {
      if (this.sectionsModel.isFilterEnabled) {
        this.onFilterClick();
      }
      this.sectionsModel.selectedRowEvent = event;
      this.checkCreateSections();
    }
  }
  checkCreateSections() {
    if (this.sectionsModel.isShowSectionsCreation) {
      this.shared.broadcast('navigationStarts', true);
      this.shared.on<boolean>('saved').pipe(takeWhile(() => this.sectionsModel.isSubscriberFlag))
        .subscribe((index: boolean) => {
          this.sectionsModel.isChangesAvailable = index;
        });
      this.sectionsModel.isShowPopup = this.sectionsModel.isChangesAvailable;
      if (!this.sectionsModel.isShowPopup) {
        this.popupYes();
      }
      this.changeDetector.detectChanges();
    } else {
      this.sectionsModel.isSplitView = true;
      this.sectionsModel.detailsValue = this.sectionsModel.selectedRowEvent['data'];
    }
    this.sectionsModel.showCreateSection = true;
  }
  popupCancel() {
    this.sectionsModel.isShowPopup = false;
  }
  popupYes() {
    this.sectionsModel.isShowPopup = false;
    this.sectionsModel.isShowSectionsCreation = false;
    this.sectionsModel.isSplitView = true;
    this.sectionsModel.detailsValue = this.sectionsModel.selectedRowEvent['data'];
  }
  loader(event: boolean) {
    this.loaderEvent.emit(event);
  }
  toastMessage(key: string, data: string) {
    const message = {
      severity: key,
      summary: key === 'error' ? 'Error' : 'Success',
      detail: data
    };
    this.messageService.clear();
    this.messageService.add(message);
  }
  filterGridData(event: Event) {
    if (this.sectionsModel.sectionsDataSubscription) {
      this.sectionsModel.sectionsDataSubscription.unsubscribe();
    }
    this.getSectionsListData();
  }
  onCreateSection() {
    this.sectionsModel.splitScreenData = {
      isCreate: true,
      titleText: 'Create',
      tableDeatils: this.sectionsModel.sectionList,
      agreementId: this.agreementID,
      agreementDeatils: this.agreement,
      sectionDetails: null,
    };
    this.sectionsModel.isShowSectionsCreation = true;
    this.sectionsModel.isFilterEnabled = false;
  }
  splitClose(event: boolean) {
    this.sectionsModel.isShowSectionsCreation = event;
    this.getSectionsListData();
  }
  sectionEdit(event: object) {
    this.sectionsModel.isSplitView = false;
    this.onEditSection(event);
  }
  onEditSection(sectionData) {
    this.sectionsModel.splitScreenData = {
      isCreate: false,
      titleText: 'Edit',
      tableDeatils: this.sectionsModel.sectionList,
      agreementId: this.agreementID,
      agreementDeatils: this.agreement,
      sectionDetails: sectionData
    };
    this.sectionsModel.isShowSectionsCreation = true;
  }
  setPaginator() {
    if (this.sectionsModel.gridDataLength) {
      return true;
    } else {
      return false;
    }
  }
}
