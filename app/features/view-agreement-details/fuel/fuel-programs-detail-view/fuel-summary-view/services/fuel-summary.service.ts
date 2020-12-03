import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AppConfig } from '../../../../../../../config/app.config';
import { RootObject } from '../model/fuel-summary-view.interface';

@Injectable({
  providedIn: 'root'
})
export class FuelSummaryService {
  elasticParam: object = {};
  endpoints: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getFuelList(params: object): Observable<RootObject> {
    return this.http.post<RootObject>(this.endpoints['fuelCalculation'].getFuelProgram, params);
  }
  getFuelNotes(fuelId: number): Observable<object> {
    const url = `${this.endpoints['fuel'].getFuelNotes}${fuelId}`;
    return this.http.get<object>(url);
  }
}
