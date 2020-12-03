import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { AppConfig } from '../../../../../../../config/app.config';
import { LineHaulValues, EquipmentTypeInterface, HitsInterface } from '../model/line-haul-overview.interface';


@Injectable({
  providedIn: 'root'
})
export class LineHaulOverviewService {

  endpoints: any;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getLineHaulOverView(lineHaulConfigurationId?: number, currentDate?: string): Observable<LineHaulValues> {
    const url = `${this.endpoints.lineHaul.lineHaulDetails}/${lineHaulConfigurationId}?currentDate=${currentDate}`;
    return this.http.get<LineHaulValues>(url);
  }
  getOriginPoint(query: object): Observable<HitsInterface[]> {
    const url = this.endpoints['lineHaul'].getOriginPoint;
    return this.http.post<HitsInterface[]>(url, query);
  }
  getCityState(query: object): Observable<HitsInterface[]> {
    const url = this.endpoints['lineHaul'].getCityState;
    return this.http.post<HitsInterface[]>(url, query);
  }
}


