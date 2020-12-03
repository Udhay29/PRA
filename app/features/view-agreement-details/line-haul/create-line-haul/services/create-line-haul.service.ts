import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../config/app.config';
import { SaveResponseDto, SourceDetails } from '../model/create-line-haul.interface';
import { LineHaulValues } from '../../additional-information/line-haul-overview/model/line-haul-overview.interface';

@Injectable({
  providedIn: 'root'
})
export class CreateLineHaulService {

  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  onSaveManualDetails(agreementId: number, startDate: string, endDate: string): Observable<Array<SaveResponseDto>> {
    const url =
      `${this.endpoints['lineHaul'].saveManualDetails}/${agreementId}/linehaul?effectiveDate=${startDate}&expirationDate=${endDate}`;
    return this.http.get<Array<SaveResponseDto>>(url);
  }
  getSourceDetails(): Observable<Array<SourceDetails>> {
    const url = this.endpoints['lineHaul'].getSourceDetails;
    return this.http.get<Array<SourceDetails>>(url);
  }
  lineHaulDraftSave(lineHaulId: Array<number>): Observable<number> {
    const url = `${this.endpoints['lineHaul'].getLaneDetails}/customerlinehauls?status=draft`;
    return this.http.patch<number>(url, lineHaulId);
  }
  deleteLineHaulRecords(params: Array<number>) {
    const url = this.endpoints['lineHaul'].deleteLineHaulRecords;
    return this.http.put(url, params);
  }

  getLineHaulOverView(lineHaulConfigurationId: number, currentDate: string): Observable<LineHaulValues> {
    const url = `${this.endpoints['lineHaul'].lineHaulDetails}/${lineHaulConfigurationId}?currentDate=${currentDate}`;
    return this.http.get<LineHaulValues>(url);
  }
}
