import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output,
  ViewChild, OnInit, OnDestroy
} from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment';
import { isArray } from 'util';
import { MessageService } from 'primeng/components/common/messageservice';
import { ReferencedataListService } from './service/referencedata-list.service';
import { TimeZoneService } from '../../../../../shared/jbh-app-services/time-zone.service';
import { Hits, QueryMock, RootObject } from './model/referencedata.interface';
import { FreeRuleModel } from '../free-rule/model/free-rule.model';
import { ReferenceModel } from './model/referencedata.model';
@Component({
  selector: 'app-referencedata-list',
  templateUrl: './referencedata-list.component.html',
  styleUrls: ['./referencedata-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferencedataListComponent implements OnInit, OnDestroy {
  @Output() loaderEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() agreementID: string;
  @Input() set showReferenceGrid(value: object) {
    if (value) {
      this.parseReferenceGridParams();
    }
  }
  referenceModel: ReferenceModel;
  freeRuleModel: FreeRuleModel;
  selectedFreeRuleTypeId: number;
  screenHeight: any;
  constructor(
    private readonly ReferenceService: ReferencedataListService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly messageService: MessageService,
    private readonly timeZoneService: TimeZoneService,
  ) {
    this.referenceModel = new ReferenceModel();
    this.freeRuleModel = new FreeRuleModel();
  }
  ngOnInit() {
    this.screenHeight = (window.innerHeight - 460) + 'px';
  }
  ngOnDestroy() {
    this.referenceModel.isSubscriberFlag = false;
    this.referenceModel.isTimeFrameFlag = false;
  }
  parseReferenceGridParams() {
    if (this.referenceModel.referenceGridRequest) {
      const freeRuleTypeId = this.referenceModel.referenceGridRequest['accessorialFreeRuleTypes'] &&
        this.referenceModel.referenceGridRequest['accessorialFreeRuleTypes'].length &&
        this.referenceModel.referenceGridRequest['accessorialFreeRuleTypes'][0]['accessorialFreeRuleTypeId'] ?
        this.referenceModel.referenceGridRequest['accessorialFreeRuleTypes'][0]['accessorialFreeRuleTypeId'] : null;
      if (freeRuleTypeId === this.freeRuleModel.freeRuleTypeQuantity['accessorialFreeRuleTypeID'] ||
        freeRuleTypeId === this.freeRuleModel.freeRuleTypeEvent['accessorialFreeRuleTypeID']) {
        this.selectedFreeRuleTypeId = freeRuleTypeId;
        this.getReferenceListData();
      } else {
        this.referenceModel.noResultFoundFlag = true;
        this.referenceModel.referenceGridRequest = null;
      }
    }
  }
  getReferenceListData() {
    this.referenceModel.tableContent = [];
    const tableValues = [];
    this.referenceModel.tableColumns = [];
    this.ReferenceService.loadReferenceData(this.agreementID,
      this.selectedFreeRuleTypeId, this.referenceModel.referenceGridRequest).pipe(takeWhile(() =>
        this.referenceModel.isSubscriberFlag))
      .subscribe((response: RootObject[]) => {
        if (response['accessorialFreeRuleTypeId'] === this.freeRuleModel.freeRuleTypeQuantity['accessorialFreeRuleTypeID']) {
          response['customerAccessorialFreeRuleQuantityLookUpDTOS'].forEach(rule => {
            if (!this.referenceModel.savedFreeRuleConfigurationId || this.referenceModel.savedFreeRuleConfigurationId ===
              rule['customerAccessorialFreeRuleConfigurationID']) {
              rule = this.parseFreeRuleQuantity(rule);
              rule['ruleTypeName'] = response['accessorialFreeRuleTypeName'];
              rule['effectiveDate'] = moment(rule['effectiveDate']).format(this.referenceModel.dateFormat);
              rule['expirationDate'] = moment(rule['expirationDate']).format(this.referenceModel.dateFormat);
              tableValues.push(rule);
            }
          }, this);
          this.referenceModel.tableColumns = this.referenceModel.quantityTableColumns;
          this.changeDetector.detectChanges();
          this.referenceModel.sortField = this.referenceModel.quantityDefaultSortField;
        } else if (response['accessorialFreeRuleTypeId'] === this.freeRuleModel.freeRuleTypeEvent['accessorialFreeRuleTypeID']) {
          response['customerAccessorialFreeRuleEventLookUpDTOS'].forEach(rule => {
            if (!this.referenceModel.savedFreeRuleConfigurationId || this.referenceModel.savedFreeRuleConfigurationId ===
              rule['customerAccessorialFreeRuleConfigurationID']) {
              rule = this.parseFreeRuleEvent(rule);
              rule['ruleTypeName'] = response['accessorialFreeRuleTypeName'];
              rule['effectiveDate'] = moment(rule['effectiveDate']).format(this.referenceModel.dateFormat);
              rule['expirationDate'] = moment(rule['expirationDate']).format(this.referenceModel.dateFormat);
              tableValues.push(rule);
            }
          }, this);
          this.referenceModel.tableColumns = this.referenceModel.eventTableColumns;
          this.changeDetector.detectChanges();
          this.referenceModel.sortField = this.referenceModel.eventDefaultSortField;
        }
        this.referenceModel.gridDataLength = tableValues.length;
        this.referenceModel.tableContent = tableValues;
        this.referenceModel.noResultFoundFlag = tableValues.length === 0;
        this.referenceModel.isShowLoader = false;
        this.referenceModel.savedFreeRuleConfigurationId = null;
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.referenceModel.isShowLoader = false;
        this.referenceModel.noResultFoundFlag = true;
        this.changeDetector.detectChanges();
      });
  }
  parseFreeRuleQuantity(quantityRule) {
    if (quantityRule['accessorialFreeRuleQuantityTypeID'] === 1) {
      quantityRule['accessorialFreeRuleQuantityTimeTypeName'] =
        quantityRule['freeRuleQuantityDistanceTypeCode'];
      this.referenceModel.isTimeFrameFlag = false;
    } else {
      quantityRule['accessorialFreeRuleQuantityTimeTypeName'] =
        quantityRule['freeRuleQuantityTimeTypeCode'];
      this.referenceModel.isTimeFrameFlag = true;
    }
    quantityRule['requestedDeliveryDateIndicator'] = quantityRule['requestedDeliveryDateIndicator'] === 'Y' ? 'Yes' : 'No';
    return quantityRule;
  }
  parseFreeRuleEvent(eventRule) {
    const timeZoneAbbr = ' ' + this.timeZoneService.getTimeZoneAbbrevation();
    eventRule['dayOfEventFreeRuleModifierTime'] = eventRule['dayOfEventFreeRuleModifierTime'] ?
      moment(eventRule['dayOfEventFreeRuleModifierTime']).format('HH:mm') + timeZoneAbbr : null;
    eventRule['dayAfterEventFreeRuleModifierTime'] = eventRule['dayAfterEventFreeRuleModifierTime'] ?
    moment(eventRule['dayAfterEventFreeRuleModifierTime']).format('HH:mm')  + timeZoneAbbr : null;
    return eventRule;
  }
  handleError(error: Error, key: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? 'Error' : 'Success',
      detail: error.message
    };
    this.messageService.clear();
    this.messageService.add(message);
  }
}
