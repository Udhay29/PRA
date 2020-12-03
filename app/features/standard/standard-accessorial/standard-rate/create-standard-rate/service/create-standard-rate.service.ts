import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../../config/app.config';
import { RateDocumentationInterface, BuSoAssociation, ChargeCodeResponseInterface,
   DateRangeInterface,
   GroupNameTypeValues} from './../model/create-standard-interface';

@Injectable({
  providedIn: 'root'
})
export class CreateStandardRateService {

  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getQuantityType() {
    const url = this.endpoints['accessorial'].quantityType;
    return this.http.get(url);
  }
  getChargeTypes(): Observable<ChargeCodeResponseInterface[]> {
    const url = `${this.endpoints['accessorial'].getRateChargeCodes}`;
    return this.http.get<ChargeCodeResponseInterface[]>(url);
  }
  getGroupNames(): Observable<GroupNameTypeValues> {
    const url = `${this.endpoints['accessorial'].getStandardGroupNames}`;
    return this.http.get<GroupNameTypeValues>(url);
  }
  getRatesDocumentation(params: Object, customeragreementId: string): Observable<RateDocumentationInterface[]> {
    const url = `${this.endpoints['accessorial'].getStandardRatesDocumentation}`;
    return this.http.post<RateDocumentationInterface[]>(url, params);
  }
  getBUbasedOnChargeType(chargeTypeId: number): Observable<BuSoAssociation[]> {
    const url = `${this.endpoints['accessorial'].getBUbasedOnChargeType}/${chargeTypeId}`;
    return this.http.get<BuSoAssociation[]>(url);
  }
  getCurrencyCodes(): Observable<object> {
    const url = this.endpoints['createAgreement'].getCurrency;
    return this.http.get<[string]>(url);
  }
  postRateData(params: Object) {
    const url = `${this.endpoints['accessorial'].postStandardRate}`;
    return this.http.post(url, params);
  }
  getSuperUserBackDate(): Observable<DateRangeInterface> {
    const url = `${this.endpoints['accessorial'].getSuperUserBackDateDays}`;
    return this.http.get<DateRangeInterface>(url);
  }
  getSuperFutureBackDate(): Observable<DateRangeInterface> {
    const url = `${this.endpoints['accessorial'].getSuperUserFutureDateDays}`;
    return this.http.get<DateRangeInterface>(url);
  }
  getCheckBoxData() {
    const url = `${this.endpoints['accessorial'].customerAccessorialRateCriteriaTypes}`;
    return this.http.get(url);
  }
}
