import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AppConfig } from '../../../../../config/app.config';
import { LineHaulGridDto } from '../model/line-haul.interface';

@Injectable({
  providedIn: 'root'
})
export class LineHaulService {

  endpoints: object;
  lineHaulQuery: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getLineHaulData(query: object): Observable<LineHaulGridDto> {
    const url = `${this.endpoints['lineHaul'].getLineHaulDetails}`;
    return this.http.post<LineHaulGridDto>(url, query);
  }

  deleteLineHaulRecords(params: Array<number>) {
    const url = this.endpoints['lineHaul'].deleteLineHaulRecords;
    return this.http.put(url, params);
  }

  publishLineHaulRecords(params: Array<number>, status: string) {
    const url = `${this.endpoints['lineHaul'].saveLineHaulRecords}?status=${status}`;
    return this.http.patch(url, params);
  }
  inactivateLineHauls(linehaulIDs: string, expirationDate: string) {
    const url = `${this.endpoints['lineHaul'].inactivateLineHaulRecords}/${linehaulIDs}?expirationDate=${expirationDate}`;
    return this.http.patch(url, {});
  }
  setQueryParam(value) {
    if (value) {
      this.lineHaulQuery = value;
    }
  }
  getQueryParam() {
    return this.lineHaulQuery;
  }
  downloadExcel(body: object, headers?: HttpHeaders | null, responseType?: 'blob'): Observable<any> {
    const url = this.endpoints['lineHaul'].exportExcelURL;
    return this.http.post(url, body, { headers, responseType: 'blob' });
  }

}
