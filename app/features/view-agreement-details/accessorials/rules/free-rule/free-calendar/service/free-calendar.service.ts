import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../../../../../config/app.config';
import {
  CalendarTypes, TimeFrames, DayOfWeekResponse, ApplyIfResponse,
  EventTypesResponse, AppliesToOccurenceResponse, MonthsResponse
} from '../model/free-calendar.interface';
@Injectable({
  providedIn: 'root'
})
export class FreeCalendarService {
  endpoints: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getCalendarTypes() {
    const url = this.endpoints['freeRuleCalendar'].getFreeRuleCalendarType;
    return this.http.get<CalendarTypes>(url);
  }
  getTimeFrames() {
    const url = this.endpoints['freeRuleCalendar'].getFreeRuleCalendarTimeFrames;
    return this.http.get<TimeFrames>(url);
  }
  getDayOfWeek() {
    const url = this.endpoints['freeRuleCalendar'].getFreeRuleCalendarDayOfWeek;
    return this.http.get<DayOfWeekResponse[]>(url);
  }
  getApplyIf() {
    const url = this.endpoints['freeRuleCalendar'].getFreeRuleCalendarApplyIf;
    return this.http.get<ApplyIfResponse>(url);
  }
  getEvent() {
    const url = this.endpoints['accessorial'].getEventNameTypes;
    return this.http.get<EventTypesResponse>(url);
  }
  getAppliesToOccurence() {
    const url = this.endpoints['freeRuleCalendar'].getFreeRuleCalendarAppliesToOccurrence;
    return this.http.get<AppliesToOccurenceResponse>(url);
  }
  getFreeRuleCalendarMonth() {
    const url = this.endpoints['freeRuleCalendar'].getFreeRuleCalendarMonth;
    return this.http.get<MonthsResponse[]>(url);
  }
  getDayOfMonth(monthId) {
    const url = `${this.endpoints['freeRuleCalendar'].getFreeRuleCalendarDayOfMonth}/${monthId}`;
    return this.http.get<MonthsResponse[]>(url);
  }

}
