import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../config/app.config';

import { RootObject, AgreementDetails, ContractsListItem, SectionList } from '../model/rating-rules.interface';

@Injectable({
  providedIn: 'root'
})
export class RatingRulesService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getRuleCriteria(): Observable<RootObject> {
    return this.http.get<RootObject>(this.endpoints['ratingRules'].getRuleCriteria);
  }

  saveRatingRule(param: object, agreementId: number): Observable<HttpResponseBase> {
    const url = `${this.endpoints['createAgreement'].customeragreements}/${agreementId}/ratingrules`;
    return this.http.post<HttpResponseBase>(url, param, { observe: 'response' });
  }

  editSaveRatingRule(param: object, agreementId: number, ratingRuleID: number): Observable<HttpResponseBase> {
    const url = `${this.endpoints['createAgreement'].customeragreements}/${agreementId}/ratingrules/${ratingRuleID}`;
    return this.http.put<HttpResponseBase>(url, param, { observe: 'response' });
  }

  getAgreementDetails(agreementId: number): Observable<AgreementDetails> {
    return this.http.get<AgreementDetails>(`${this.endpoints['viewAgreement'].getAgreementDetails}${agreementId}`);
  }

  getBusinessUnitServiceOffering(): Observable<RootObject> {
    const requestParam = { params: { financeBusinessUnitCode: ['ICS', 'DCS', 'JBT', 'JBI'].join() } };
    return this.http.get<RootObject>(this.endpoints['ratingRules'].getBUServiceOffering, requestParam);
  }

  getContractsList(requestParam: object): Observable<ContractsListItem[]> {
    const url = `${this.endpoints['viewAgreement'].getAgreementDetails}${requestParam['agreementId']}/contracts`;
    return this.http.get<ContractsListItem[]>(url, { params: requestParam['params'] });
  }
  getSectionList(requestParam: object): Observable<SectionList[]> {
    const url = `${this.endpoints['viewAgreement'].getAgreementDetails}${requestParam['agreementId']}/sections`;
    return this.http.get<SectionList[]>(url, { params: requestParam['params'] });
  }

  getRateDetails(agreementID: number, ratingRuleID: number) {
    const url = `${this.endpoints['ratingRules'].getRateDetails}/${agreementID}/ratingrules/${ratingRuleID}`;
    return this.http.get(url);
  }
}
