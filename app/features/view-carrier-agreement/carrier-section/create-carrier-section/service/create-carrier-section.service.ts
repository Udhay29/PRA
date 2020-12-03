import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../../config/app.config';

import { BillToAccountItem, ESRootObject, RootObject } from '../model/create-carrier-section.interface';
@Injectable({
  providedIn: 'root'
})
export class CreateCarrierSectionService {
  endpoints: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getCarrierSegmentTypes(): Observable<RootObject> {
    return this.http.get<RootObject>(this.endpoints['viewCarrierAgreement'].getCarrierSegmentType);
  }

  getBusinessUnit(): Observable<RootObject> {
    return this.http.get<RootObject>(this.endpoints['cargoReleaseAgreement'].businessUnit);
  }

  getAccountName(params: object): Observable<ESRootObject> {
    return this.http.post<ESRootObject>(this.endpoints['createAgreement'].getAccountName, params);
  }

  getBillToAccounts(accountId: number, param: object): Observable<BillToAccountItem[]> {
    return this.http.post<BillToAccountItem[]>(`${this.endpoints['viewCarrierAgreement'].getBillToAccounts}/${accountId}`, param);
  }

  saveCarrierSection(param: object, agreementId: number): Observable<HttpResponseBase> {
    const url = `${this.endpoints['viewCarrierAgreement'].saveCarrierSection}/${agreementId}/carrierSection`;
    return this.http.post<HttpResponseBase>(url, param);
  }
}
