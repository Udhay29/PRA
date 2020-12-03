import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { PriorityModel } from './model/priority.model';
import { PriorityQuery } from './query/priority.query';
import { PriorityService } from './service/priority.service';
import { takeWhile } from 'rxjs/operators';
import { ElasticResponse, HitsItem } from './model/priority.interface';
import * as utils from 'lodash';
import { isArray } from 'util';
import { LinehaulPriorityModel } from '../model/linehaul-priority.model';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.scss']
})
export class PriorityComponent implements OnInit, OnDestroy {
  @Input() linehaulPrioritymodel: LinehaulPriorityModel;
  @ViewChild('priorityTable') priorityTable: any;
  priorityModel: PriorityModel;
  constructor(private readonly priorityService: PriorityService,
    private readonly messageService: MessageService,
    private readonly changeDetector: ChangeDetectorRef) {
    this.priorityModel = new PriorityModel();
  }

  ngOnInit() {
    this.linehaulPrioritymodel.groupEditFlag = false;
    const currentQuery = PriorityQuery.viewPriorityData();
    this.priorityService.setElasticparam(currentQuery);
    this.fetchPriorityDetails();
  }

  ngOnDestroy() {
    this.priorityModel.isSubscribe = false;
  }

  fetchPriorityDetails() {
    this.priorityModel.loading = true;
    const reqParam = this.priorityService.getElasticparam();
    this.fetchPriorityDetailsFromElastic(reqParam);
  }
  getGridValues(event: Event) {
    const enteredValue = (event.target && event.target['value']) ? event.target['value'] : '';
    const currentQuery = this.priorityService.getElasticparam();
    utils.forEach(currentQuery['query']['bool']['must'][0]['bool']['should'], (query) => {
      query['query_string']['query'] = `${enteredValue.replace(/[!?:\\['^~=\//\\{},.&&||<>()+*\]-]/g, '\\$&')}*`;
    });
    if (enteredValue !== '') {
      currentQuery['from'] = 0;
    }
    this.priorityService.setElasticparam(currentQuery);
    currentQuery['sort'] = [];
    currentQuery['sort'][0] = {};
    currentQuery['sort'][0]['lineHaulPriorityGroupNumber.integer'] = {};
    currentQuery['sort'][0]['lineHaulPriorityGroupNumber.integer']['order'] = 'desc';
    this.priorityTable.reset();
    this.priorityModel.loading = true;
  }
  fetchPriorityDetailsFromElastic(reqParam: object) {
    this.priorityModel.gridRows = [];
    this.priorityService.getPriorityDetails(reqParam).pipe(takeWhile(() => this.priorityModel.isSubscribe))
      .subscribe((data: ElasticResponse) => {
        const tableValues = [];
        if (!utils.isEmpty(data) && !utils.isEmpty(data['hits']) && isArray(data['hits']['hits'])) {
          this.priorityModel.gridDataLength = data['hits']['total'];
          utils.forEach(data['hits']['hits'], (response: HitsItem) => {
            tableValues.push(response['_source']);
          });
          this.priorityModel.gridRows = tableValues;
          this.priorityModel.isEmptyFlag = tableValues.length === 0;
          this.priorityModel.loading = false;
          this.changeDetector.detectChanges();
        }
      }, (error: Error) => {
        this.priorityModel.loading = false;
        this.priorityModel.isEmptyFlag = true;
        this.priorityModel.gridDataLength = 0;
        this.toastMessage('error', error.message);
        this.changeDetector.detectChanges();
      });
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

  loadGridData(event: Event) {
    const elasticQuery = this.priorityService.getElasticparam();
    if (event && this.priorityModel.gridRows && this.priorityModel.gridRows.length) {
      elasticQuery['size'] = event['rows'];
      elasticQuery['from'] = event['first'];
      this.priorityModel.tableSize = event['rows'];
      this.sortGridData(elasticQuery, event);
      this.priorityModel.loading = true;
      this.priorityService.setElasticparam(elasticQuery);
    }
    this.fetchPriorityDetailsFromElastic(elasticQuery);
  }

  sortGridData(elasticQuery: object, event: Event) {
    if (event && event['sortField'] && event['sortOrder']) {
      const field = this.priorityModel.getFieldNames[event['sortField']];
      elasticQuery['sort'] = [];
      elasticQuery['sort'][0] = {};
      elasticQuery['sort'][0][field] = {};
      elasticQuery['sort'][0][field]['order'] = event['sortOrder'] === 1 ? 'asc' : 'desc';
      this.changeDetector.detectChanges();
    }
  }
}
