import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { AppConfig } from '../../../../../../config/app.config';

import { LineHaulValues, HitsInterface } from '../model/line-haul-details.interface';

@Injectable({
  providedIn: 'root'
})
export class LineHaulDetailsService {

  endpoints: any;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getOriginPoint(query: object): Observable<HitsInterface[]> {
    const url = this.endpoints['lineHaul'].getOriginPoint;
    return this.http.post<HitsInterface[]>(url, query);
  }
  getCityState(query: object): Observable<HitsInterface[]> {
    const url = this.endpoints['lineHaul'].getCityState;
    return this.http.post<HitsInterface[]>(url, query);
  }
  getCarrierData(query: object): Observable<HitsInterface[]> {
    const url = this.endpoints['mileage'].getCarrierList;
    return this.http.post<HitsInterface[]>(url, query);
  }
}


