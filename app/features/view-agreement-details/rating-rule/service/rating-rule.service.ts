import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../config/app.config';
import { RootObject, RatingRuleDetail, CheckRatingRuleParam } from '../model/rating.interface';

@Injectable({
  providedIn: 'root'
})
export class RatingRuleService {
  static esParam: object;
  endpoints: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  static setElasticparam(elasticParam: object) {
    this.esParam  = elasticParam;
  }
  static getElasticparam(): object {
    return this.esParam;
  }

  getRateList(params: object): Observable<RootObject> {
    return this.http.post<RootObject>(this.endpoints['ratingRules'].getRatingRules, params);
  }

  getRateDetails(agreementID: number, ratingRuleID: number): Observable<RatingRuleDetail> {
    const url = `${this.endpoints['ratingRules'].getRateDetails}/${agreementID}/ratingrules/${ratingRuleID}`;
     return this.http.get<RatingRuleDetail>(url);
  }

  checkRatingRule(param: CheckRatingRuleParam): Observable<boolean> {
    const url = `${this.endpoints['ratingRules'].checkRatingRules}?customerAgreementID=${param.customerAgreementID}`;
    return this.http.get<boolean>(url);
  }
  inactivateRatingRule(agreementID: number, param): Observable<any> {
    const url = `${this.endpoints['ratingRules'].getRateDetails}/${agreementID}/ratingrules`;
    return this.http.patch<any>(url, param);
  }
  downloadRatingRuleExcel(body: object, headers?: HttpHeaders | null, responseType?: 'blob'): Observable<any> {
    const url = this.endpoints['ratingRules'].getratingRuleExcel;
    return this.http.post(url, body, { headers, responseType: 'blob' });
  }
}
