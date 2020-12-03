import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../../../config/app.config';

import { RootObject, RuleCriteriaObject } from './../model/default-rating-rule.interface';
@Injectable({
  providedIn: 'root'
})
export class DefaultRatingRuleService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getPopulateData(): Observable<RootObject> {
    return this.http.get<RootObject>(this.endpoints['businessSettings'].getDefaultRatingRule);
  }
  getRules(): Observable<RuleCriteriaObject> {
    return  this.http.get<RuleCriteriaObject>(this.endpoints['businessSettings'].getRuleCriterias);
  }
  saveRules(params, ratingRuleId): Observable<any> {
    return this.http.put<any>(`${this.endpoints['businessSettings'].getDefaultRatingRules}/${ratingRuleId}`, params);
  }
}
