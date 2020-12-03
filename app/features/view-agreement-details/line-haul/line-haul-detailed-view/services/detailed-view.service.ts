import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { AppConfig } from '../../../../../../config/app.config';
import { LineHaulValues, EquipmentTypeInterface } from '../model/detailed-view.interface';


@Injectable({
  providedIn: 'root'
})
export class DetailedViewService {
  endpoints: any;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getLineHaulOverView(lineHaulConfigurationId: number, currentDate: string): Observable<LineHaulValues> {
    const url = `${this.endpoints.lineHaul.lineHaulDetails}/${lineHaulConfigurationId}?currentDate=${currentDate}`;
    return this.http.get<LineHaulValues>(url);
  }
  getLaneDetailsInformation(): Observable<LineHaulValues> {
    const url = `${this.endpoints.lineHaul.lineHaulDetailsInfo}`;
    return this.http.get<LineHaulValues>(url);
  }
  inactivateLineHauls(linehaulIDs: string, expirationDate: string) {
    const url = `${this.endpoints['lineHaul'].inactivateLineHaulRecords}/${linehaulIDs}?expirationDate=${expirationDate}`;
    return this.http.patch(url, {});
  }
}
