import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AppConfig } from '../../../../../../../config/app.config';
import { FuelCalculationDetails } from '../model/fuel-calculation-detail.interface';

@Injectable({
  providedIn: 'root'
})
export class FuelCalculationViewService {
  endpoints: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getFuelCalculationDetails(params: number): Observable<FuelCalculationDetails> {
    const url = `${this.endpoints['fuel'].getFuelCalculationDetails}/${params}/fuelcalculations`;
    return this.http.get<FuelCalculationDetails>(url);
  }
}
