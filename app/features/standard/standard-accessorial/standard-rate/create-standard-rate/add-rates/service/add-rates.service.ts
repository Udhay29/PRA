import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from './../../../../../../../../config/app.config';

import { RateTypeInterface, ResponseType } from '../model/add-rates.interface';

@Injectable({
  providedIn: 'root'
})
export class AddRatesService {

  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getRateTypes(buSoIds: Array<number>): Observable<RateTypeInterface[]> {
    const url = this.endpoints['accessorial'].getChargeAssociatedRateTypes + buSoIds;
    return this.http.get<RateTypeInterface[]>(url);
  }

  getGroupRateTypes(): Observable<ResponseType> {
    const url = this.endpoints['accessorial'].getGroupRateTypes;
    return this.http.get<ResponseType>(url);
  }

  getRoundingTypes(): Observable<ResponseType> {
    const url = this.endpoints['accessorial'].getRoudingTypes;
    return this.http.get<ResponseType>(url);
  }
}
