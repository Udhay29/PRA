import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ViewTemplateModel } from './model/template/view-template.model';
import { ViewTemplateQuery } from './query/view-template.query';
import { EmailTemplateService } from './service/email-template.service';
import { takeWhile, finalize } from 'rxjs/operators';
import { ElasticResponseModel, HitsModel, TemplateList } from './model/template/view-template.inteface';
import * as moment from 'moment-timezone';
import { TimeZoneService } from '../../../shared/jbh-app-services/time-zone.service';
import { Router } from '@angular/router';
import { EmailTemplateUtilsService } from './service/email-template-utils.service';
import { MessageService } from 'primeng/components/common/messageservice';
@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss']
})
export class EmailTemplateComponent implements OnInit {
  viewModel: ViewTemplateModel = new ViewTemplateModel();

  constructor(private readonly emailUtils: EmailTemplateUtilsService, private readonly messageService: MessageService,
    private readonly changeDetector: ChangeDetectorRef, private readonly router: Router,

    private readonly templateService: EmailTemplateService, private readonly timeZoneService: TimeZoneService
  ) { }

  ngOnInit() {
    this.viewModel.subscribeFlag = true;
    if (this.emailUtils.showGrowl) {
      this.emailUtils.showGrowl = false;
      this.messageService.clear();
      this.messageService.add({severity: 'success', summary: `${this.emailUtils.emailType} Template Saved`,
      detail: `The ${this.emailUtils.emailType.toLocaleLowerCase()} template has been successfully saved.`});
    }
    this.masterTemplateExist();

  }
  masterTemplateExist() {
    this.viewModel.loading = true;
    this.templateService.checkMasterTemplate().pipe(takeWhile(() =>
      this.viewModel.subscribeFlag), finalize(() => {
        this.changeDetector.detectChanges();
      })).subscribe((data: boolean) => {
        if (data) {
        this.viewModel.firstCheck = false;
        this.viewModel.isDefaultTemplateExist = true;
        this.getGridData(this.viewModel.searchText, this.viewModel.from, this.viewModel.size, this.viewModel.sortField,
          this.viewModel.sortOrder);
          this.changeDetector.detectChanges();
        } else {
        this.viewModel.searchFlag = 0;
        this.viewModel.firstCheck = true;
        this.viewModel.noResultFlag = true;
        this.viewModel.isDefaultTemplateExist = false;
        }
        this.viewModel.loading = false;
      }, (error: Error) => {
        this.viewModel.noResultFlag = true;
        this.viewModel.loading = false;
      });
  }
  getGridData(searchText: string, from: number, size: number, field: string, order: string) {
    this.viewModel.loading = true;
    this.viewModel.templateListQuery = ViewTemplateQuery.getTemplateQuery(searchText, from, size, field, order);
    this.templateService.getTemplateList(this.viewModel.templateListQuery).pipe(takeWhile(() =>
      this.viewModel.subscribeFlag), finalize(() => {
        this.changeDetector.detectChanges();
      })).subscribe((data: ElasticResponseModel) => {
        this.gridDataFramer(data);
      }, (error: Error) => {
        this.viewModel.noResultFlag = true;
        this.viewModel.loading = false;
      });
  }
  loadConfigValuesLazy(event: Event) {
    this.viewModel.from = event['first'];
    this.viewModel.size = event['rows'];
    this.viewModel.sortOrder = (event['sortOrder'] === 1) ? 'asc' : 'desc';
  }
  gridDataFramer(data: ElasticResponseModel) {
    const arr = [];
    this.viewModel.templateGridValues = [];
    if (data && data.hits && data.hits.hits) {
      this.viewModel.firstCheck = false;
      this.viewModel.loading = false;
      this.viewModel.totalRecords = data.hits['total'];
      data.hits.hits.forEach((dataObject: HitsModel) => {
        arr.push(this.gridDataValues(dataObject._source));
      });
      this.viewModel.loading = false;
      this.viewModel.templateGridValues = arr;
      this.viewModel.noResultFlag = (this.viewModel.templateGridValues.length === 0);
    }
  }
  gridDataValues(dataObject: TemplateList) {
    dataObject.chargeTypeDisplayName = dataObject.chargeTypeDisplayName ? dataObject.chargeTypeDisplayName : '--';
    dataObject.accessorialNotificationTypeName = dataObject.accessorialNotificationTypeName ?
      dataObject.accessorialNotificationTypeName : '--';
    dataObject.defaultAttachment = dataObject.defaultAttachment ? dataObject.defaultAttachment : '--';
    dataObject.lastUpdateTimestamp = dataObject.lastUpdateTimestamp ?
     this.timeZoneService.convertToLocalMilitaryUpdatedTime(dataObject.lastUpdateTimestamp)
      : '--';
    return dataObject;
  }
  onSearch(event: Event) {
    this.viewModel.searchFlag = 1;
    const from = 0;
    this.viewModel.templateGridValues = [];
    this.viewModel.searchText = event['target']['value'];
    const dateTimeRegex = new RegExp('^(1[0-2]|0?[1-9])/(3[01]|[12][0-9]|0?[1-9])/[0-9]{4} (0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$');
    const dateOnlyRegex = new RegExp('^(1[0-2]|0?[1-9])/(3[01]|[12][0-9]|0?[1-9])/[0-9]{4}$');
    if (dateTimeRegex.test(this.viewModel.searchText)) {
      const DateSearch: string = this.timeZoneService.convertUpdatedDateTimetoUTC(this.viewModel.searchText);
      this.viewModel.searchText = `${DateSearch.replace('T', ' ')}`;
      this.viewModel.searchText = `${this.viewModel.searchText.replace(/[[\]{}() *:\"~&/!?\\^$|]/g, '\\$&')}`;
      this.getGridData(this.viewModel.searchText, from, this.viewModel.size,
        this.viewModel.sortField, this.viewModel.sortOrder);
      this.changeDetector.detectChanges();
    } else if (dateOnlyRegex.test(this.viewModel.searchText)) {
      const DateSearch = this.timeZoneService.convertUpdatedDateOnlytoUTC(this.viewModel.searchText);
      this.viewModel.searchText = DateSearch.toString();
      this.viewModel.searchText = `${this.viewModel.searchText.replace(/[[\]{}() *:\"~&/!?\\^$|]/g, '\\$&')}`;
      this.viewModel.searchText = this.viewModel.searchText.replace(',', '\"OR\"');
      this.getGridData(this.viewModel.searchText, from, this.viewModel.size,
        this.viewModel.sortField, this.viewModel.sortOrder);
      this.changeDetector.detectChanges();
    } else {
      this.viewModel.searchText = `${this.viewModel.searchText.replace(/[[\]{}() *:\"~&/!?\\^$|]/g, '\\$&')}`;
      this.getGridData(this.viewModel.searchText, from, this.viewModel.size,
        this.viewModel.sortField, this.viewModel.sortOrder);
      this.changeDetector.detectChanges();
    }
  }
  onPage(event: Event) {
    this.viewModel.from = event['first'];
    this.viewModel.size = event['rows'];
    this.getGridData(this.viewModel.searchText, this.viewModel.from, this.viewModel.size,
      this.viewModel.sortField, this.viewModel.sortOrder);
  }
  onSortSelect(column: any) {
    this.viewModel.sortField = column.property;
    this.getGridData(this.viewModel.searchText, this.viewModel.from, this.viewModel.size,
      this.viewModel.sortField, this.viewModel.sortOrder);
  }
  onAddTemplate(type: string) {
    this.router.navigate(['/standard/create-template/'], {
      queryParams: {
        templateName: type
      }
    });
  }
  rowClick(event) {
    this.router.navigate(['/standard/view-list-template/'], {
      queryParams: {
        templateId: event.data.emailTemplateConfigurationId
      }
    });
  }
}
