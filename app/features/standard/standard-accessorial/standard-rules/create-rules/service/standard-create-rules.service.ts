import { GroupNameTypeValues } from './../../../standard-rate/create-standard-rate/model/create-standard-interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../../config/app.config';

import {
  RuleType, AveragingTimeFrame, DayOfWeekResponse, GracePeriod, BuSoAssociation, DateRangeInterface
 } from '../model/standard-create-rules.interface';

@Injectable({
  providedIn: 'root'
})
export class CreateRulesService {

  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getRuleType(): Observable<RuleType> {
    const url = this.endpoints['accessorial'].getRuleType;
    return this.http.get<RuleType>(url);
  }

  getGroupNames(): Observable<GroupNameTypeValues> {
    const url = `${this.endpoints['accessorial'].getStandardGroupNames}`;
    return this.http.get<GroupNameTypeValues>(url);
  }

  getBUbasedOnChargeType(chargeTypeId: number): Observable<BuSoAssociation[]> {
    const url = `${this.endpoints['accessorial'].getBUbasedOnChargeType}/${chargeTypeId}`;
    return this.http.get<BuSoAssociation[]>(url);
  }

  postRuleData(agreementId: string, ruleValues: object): Observable<object> {
    const url = `${this.endpoints['accessorial'].postDocumentation}${agreementId}/rules/averaging`;
    return this.http.post<object>(url, ruleValues);
  }

  getAverageTimeFrame(): Observable<AveragingTimeFrame> {
    const url = `${this.endpoints['accessorial'].getAveragingTimeFrame}`;
    return this.http.get<AveragingTimeFrame>(url);
  }

  getDayOfWeek(): Observable<DayOfWeekResponse> {
    const url = `${this.endpoints['accessorial'].getDayOfWeek}`;
    return this.http.get<DayOfWeekResponse>(url);
  }

  getFrequencyValues(): Observable<any> {
    const url = `${this.endpoints['accessorial'].getFrequencyTypes}`;
    return this.http.get(url);
  }

  getFrequencySubTypeValues(): Observable<any> {
    const url = `${this.endpoints['accessorial'].getFrquencySubTypes}`;
    return this.http.get(url);
  }
  postRuleTypeData(agreementId: string, ruleValues: object, ruleType: string): Observable<object> {
    const url = `${this.endpoints['accessorial'].postNotification}/${ruleType}`;
    return this.http.post<object>(url, ruleValues);
  }
  postFreeRule( agreementId: string, ruleValues: object): Observable<object> {
    const url = `${this.endpoints['accessorial'].postDocumentation}${agreementId}/freerules`;
    return this.http.post<object>(url, ruleValues);
  }
  getGracePeriod(): Observable<GracePeriod> {
    const url = `${this.endpoints['accessorial'].gracePeriod}`;
    return this.http.get<GracePeriod>(url);
  }

  getSuperUserBackDate(): Observable<DateRangeInterface> {
    const url = `${this.endpoints['accessorial'].getSuperUserBackDateDays}`;
    return this.http.get<DateRangeInterface>(url);
  }

  getSuperFutureBackDate(): Observable<DateRangeInterface> {
    const url = `${this.endpoints['accessorial'].getSuperUserFutureDateDays}`;
    return this.http.get<DateRangeInterface>(url);
  }
}
