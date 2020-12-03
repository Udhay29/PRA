import { Component, OnInit, Input, AfterViewInit, } from '@angular/core';
import * as moment from 'moment';
import * as utils from 'lodash';
import {
  CustomerAccessorialFreeRuleEvent, AccessorialFreeRuleQuantityType, AccessorialFreeRuleCalendarType
} from './model//free-rule-detailed-view-interface';
import { FreeRuleDetailModel } from './model/free-rule-detailed-view-model';
import { TimeZoneService } from '../../../../../../shared/jbh-app-services/time-zone.service';
import { RulesDetailedViewService } from '../service/rules-detailed-view.service';


@Component({
  selector: 'app-free-rules-detailed-view',
  templateUrl: './free-rules-detailed-view.component.html',
  styleUrls: ['./free-rules-detailed-view.component.scss']
})
export class FreeRulesDetailedViewComponent implements OnInit {
  @Input() detailedViewResponse;
  freeRuleDetailModel: FreeRuleDetailModel;
  CustomerAccessorialFreeRuleEvent: CustomerAccessorialFreeRuleEvent;
  constructor(private readonly rulesDetailedViewService: RulesDetailedViewService,
    private readonly timeZoneService: TimeZoneService) {
    this.freeRuleDetailModel = new FreeRuleDetailModel();
  }

  ngOnInit() {
    this.CheckFreeRule();

  }
  CheckFreeRule() {

    if (this.detailedViewResponse.accessorialFreeRuleTypeName.toUpperCase() === 'EVENT') {
      this.getFreeRuleEvent(this.detailedViewResponse);
    } else if (this.detailedViewResponse.accessorialFreeRuleTypeName.toUpperCase() === 'QUANTITY') {
      this.getFreeRuleQuantity(this.detailedViewResponse);
    } else {
      this.getFreeRuleCalendar(this.detailedViewResponse);
    }
  }
  getFreeRuleEvent(data: CustomerAccessorialFreeRuleEvent) {
  const dayOfEventTime = data['accessorialFreeRuleEventTypes']['accessorialDayOfEventFreeRuleModifierTime'];
  const dayAfterEventTime = data['accessorialFreeRuleEventTypes']['accessorialDayAfterEventFreeRuleModifierTime'];
  this.freeRuleDetailModel.freeruleValues = {
      'accessorialFreeRuleTypeId': data['accessorialFreeRuleTypeId'],
      'accessorialFreeRuleTypeName': data['accessorialFreeRuleTypeName'],
      'accessorialFreeRuleEventTypeID': data['accessorialFreeRuleEventTypes']['accessorialFreeRuleEventTypeID'],
      'accessorialFreeRuleEventTypeName': data['accessorialFreeRuleEventTypes']['accessorialFreeRuleTypeName'],
      'accessorialFreeRuleEventTimeframeTypeID': data['accessorialFreeRuleEventTypes']['accessorialFreeRuleEventTimeframeTypeID'],
      'accessorialFreeRuleEventTimeFrameTypeName': data['accessorialFreeRuleEventTypes']['accessorialFreeRuleEventTimeFrameTypeName'],
      'accessorialDayOfEventFreeRuleModifierName': data['accessorialFreeRuleEventTypes']['accessorialDayOfEventFreeRuleModifierName'],
      'accessorialDayOfEventFreeRuleModifierId': data['accessorialFreeRuleEventTypes']['accessorialDayOfEventFreeRuleModifierId'],
      'accessorialDayOfEventFreeRuleModifierTime': dayOfEventTime ? this.getHourMinute(dayOfEventTime) : null,
      'accessorialDayAfterEventFreeRuleModifierName': data['accessorialFreeRuleEventTypes']['accessorialDayAfterEventFreeRuleModifierName'],
      'accessorialDayAfterEventFreeRuleModifierId': data['accessorialFreeRuleEventTypes']['accessorialDayAfterEventFreeRuleModifierId'],
      'accessorialDayAfterEventFreeRuleModifierTime': dayAfterEventTime ? this.getHourMinute(dayAfterEventTime) : null
    };
  }
  getFreeRuleQuantity(data: AccessorialFreeRuleQuantityType) {
    this.freeRuleDetailModel.freeruleValues = {
      'accessorialFreeRuleTypeId': data['accessorialFreeRuleTypeId'],
      'accessorialFreeRuleTypeName': data['accessorialFreeRuleTypeName'],
      'accessorialFreeRuleQuantityTypeId': data['accessorialFreeRuleQuantityTypes']['accessorialFreeRuleQuantityTypeId'],
      'accessorialFreeRuleQuantityTypeName': data['accessorialFreeRuleQuantityTypes']['accessorialFreeRuleQuantityTypeName'],
      'freeRuleQuantityDistanceTypeId': data['accessorialFreeRuleQuantityTypes']['freeRuleQuantityDistanceTypeId'],
      'freeRuleQuantityDistanceTypeCode': data['accessorialFreeRuleQuantityTypes']['freeRuleQuantityDistanceTypeCode'],
      'freeRuleQuantityTimeTypeId': data['accessorialFreeRuleQuantityTypes']['freeRuleQuantityTimeTypeId'],
      'freeRuleQuantityTimeTypeCode': data['accessorialFreeRuleQuantityTypes']['freeRuleQuantityTimeTypeCode'],
      'accessorialFreeQuantity': data['accessorialFreeRuleQuantityTypes']['accessorialFreeQuantity'],
      'requestedDeliveryDateIndicator': data['accessorialFreeRuleQuantityTypes']['requestedDeliveryDateIndicator']

    };
  }
  getFreeRuleCalendar(data: AccessorialFreeRuleCalendarType) {
    this.freeRuleDetailModel.freeruleValues = {
      'accessorialFreeRuleTypeName': data['accessorialFreeRuleTypeName'],
      'accessorialFreeRuleCalendarTypeName': data['accessorialFreeRuleCalenderTypes']['accessorialFreeRuleCalendarTypeName'],
      'accessorialFreeRulecalendarNameofDay': data['accessorialFreeRuleCalenderTypes']['calendarDayDescription'],
      'calendarYear': data['accessorialFreeRuleCalenderTypes']['calendarYear'],
      'accessorialFreeRuleCalendarApplyIfTypeName': data['accessorialFreeRuleCalenderTypes']['accessorialFreeRuleCalendarApplyTypeName'],
      'accessorialFreeRuleCalendarApplyIfTypeEventName': data['accessorialFreeRuleCalenderTypes']
      ['accessorialFreeRuleEventTypeName'],
      'firstDayChargeableIndicator': data['accessorialFreeRuleCalenderTypes']['firstDayChargeableIndicator'],
      'calendarTimeframe': data['accessorialFreeRuleCalenderTypes']['pricingAveragePeriodTypeName'],
      'AppliesToOccurence': this.getOcuurenceLIst(data),
      'calendarMonth': this.getcalendarMonth(data),
      'calendarDayOfMonth': this.getcalendarDayofMonth(data),
      'calendarDayofWeek': this.getcalendarDayofWeek(data)
    };
  }
  getOcuurenceLIst(data: AccessorialFreeRuleCalendarType): boolean | undefined {
    let OcuurenceLIst = null;
    const OcuurenceLIstObj = [];
    if (data['accessorialFreeRuleCalenderTypes']['customerAccessorialFreeRuleCalendarDayOccurrences']) {
      utils.forEach(data['accessorialFreeRuleCalenderTypes']['customerAccessorialFreeRuleCalendarDayOccurrences'],
        (month) => {

          OcuurenceLIstObj.push(month['accessorialFrequencyTypeName']);
        });
      OcuurenceLIst = (OcuurenceLIstObj.length) ? OcuurenceLIstObj : null;
    }
    return OcuurenceLIst;
  }

  getcalendarDayofMonth(data: AccessorialFreeRuleCalendarType): boolean | undefined {
    let DayofMonth = null;
    const monthObj = [];
    if (data['accessorialFreeRuleCalenderTypes']['customerAccessorialFreeRuleCalendarMonth']) {
      utils.forEach(data['accessorialFreeRuleCalenderTypes']['customerAccessorialFreeRuleCalendarMonth'],
        (month) => {

          monthObj.push(month['customerAccessorialFreeRuleCalendarDay']);
        });
      DayofMonth = (monthObj.length) ? monthObj : null;
    }
    return DayofMonth;
  }

  getcalendarMonth(data: AccessorialFreeRuleCalendarType): boolean | undefined {
    let month1 = null;
    const monthObj = [];
    if (data['accessorialFreeRuleCalenderTypes']['customerAccessorialFreeRuleCalendarMonth']) {
      utils.forEach(data['accessorialFreeRuleCalenderTypes']['customerAccessorialFreeRuleCalendarMonth'],
        (month) => {

          monthObj.push(month['calendarMonth']);
        });
      month1 = (monthObj.length) ? monthObj : null;
    }
    return month1;
  }

  getcalendarDayofWeek(data: AccessorialFreeRuleCalendarType): boolean | undefined {
    let DayofWeek1 = null;
    const DayofWeek1obj = [];
    if (data['accessorialFreeRuleCalenderTypes']['customerAccessorialFreeRuleCalendarWeekDay']) {
      utils.forEach(data['accessorialFreeRuleCalenderTypes']['customerAccessorialFreeRuleCalendarWeekDay'],
        (month) => {

          DayofWeek1obj.push(month['calendarWeekDay']);
        });
      DayofWeek1 = (DayofWeek1obj.length) ? DayofWeek1obj : null;
    }
    return DayofWeek1;
  }
  getHourMinute(dateValue) {
    return this.timeZoneService.formatTimeOnlyToLocalMilitaryTime(dateValue);
  }
}
