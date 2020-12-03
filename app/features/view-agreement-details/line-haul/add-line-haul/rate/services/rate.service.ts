import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class RateService {

  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getRateTypes(): Observable<object> {
    const url = this.endpoints['lineHaul'].getRateTypes;
    return this.http.get<object>(url);
  }

  getGroupRateTypes(): Observable<object> {
    const url = this.endpoints['lineHaul'].getGroupRateTypes;
    return this.http.get<object>(url);
  }

  getCurrencyCodes(): Observable<object> {
    const url = this.endpoints['createAgreement'].getCurrency;
    return this.http.get<[string]>(url);
  }
  getCurrencyCodeBasedOnSection(sectionId: number): Observable<string[]> {
    const url = `${this.endpoints['lineHaul'].currencycodeBasedOnSection}/${sectionId}/currencycode`;
    return this.http.get<string[]>(url);
  }

  thousandSeperator(value: string): string {
    const amount = value.split('.');
    const commaSeperatedWholeNumber = amount[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${commaSeperatedWholeNumber}.${amount[1]}`;
  }

}
