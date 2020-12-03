import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../../config/app.config';
import { CountryInterface, HitsInterface, GeographicPointType } from './../model/lane-card.interface';


@Injectable({
  providedIn: 'root'
})
export class LaneCardService {

  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getGeographyTypes(levelType: string): Observable<GeographicPointType[]> {
    const geographyTypeUrl = `${this.endpoints['searchAgreement'].getGeographyPointType}?levelTypeName=${levelType}`;
    return this.http.get<GeographicPointType[]>(geographyTypeUrl);
  }
  getCountries(): Observable<CountryInterface[]> {
    const url = this.endpoints['lineHaul'].getCountries;
    return this.http.get<CountryInterface[]>(url);
  }
  getOriginPoint(query: object): Observable<HitsInterface[]> {
    const url = this.endpoints['lineHaul'].getOriginPoint;
    return this.http.post<HitsInterface[]>(url, query);
  }
  getCityState(query: object): Observable<HitsInterface[]> {
    const url = this.endpoints['lineHaul'].getCityState;
    return this.http.post<HitsInterface[]>(url, query);
  }
  postLaneCardData(id: number, payload: object): Observable<number> {
    const url = `${this.endpoints['lineHaul'].saveLineHaulRecords}?status=draft`;
    return this.http.post<number>(url, payload);
  }
  lineHaulDraftSave(lineHaulId: Array<number>): Observable<number> {
    const url = `${this.endpoints['lineHaul'].getLaneDetails}/customerlinehauls?status=draft`;
    return this.http.patch<number>(url, lineHaulId);
  }
  postEditLaneCardData(laneCardID: number, status: string, payload: object): Observable<any> {
    const url = `${this.endpoints['lineHaul'].editSaveLineHaulRecords}?status=${status}&linehaulconfigurationID=${laneCardID}`;
    return this.http.put<boolean>(url, payload);
  }
}
