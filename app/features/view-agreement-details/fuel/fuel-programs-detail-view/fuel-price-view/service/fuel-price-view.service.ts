import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FuelCalculationDetails } from '../../fuel-calculation-view/model/fuel-calculation-detail.interface';

import { AppConfig } from '../../../../../../../config/app.config';
@Injectable({
  providedIn: 'root'
})
export class FuelPriceViewService {
  endpoints: any;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getFuelPriceValues(programID: number): Observable<any[]> {
    const url = `/${programID}/fuelpricebasis`;
    const PriceValuesUrl = `${this.endpoints.fuel.getFuelPriceDetails}${url}`;
    return this.http.get<any[]>(PriceValuesUrl);
  }
}
