import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { AppConfig } from '../../../../../../config/app.config';
import { DayOfWeek, ResponseObject, RootObject, DistrictList, States } from './../model/fuel-price-interface';

@Injectable({
  providedIn: 'root'
})
export class FuelPriceService {
  endpoints: object;
  currentDate: string;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
    this.currentDate = moment(new Date()).format('YYYY-MM-DD');
  }

  getFuelPriceBasisType(): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.endpoints['fuel'].getFuelPriceBasisType}?activeBy=${this.currentDate}`);
  }
  getWeekToApply(): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.endpoints['fuel'].weekToApplyTypes}?activeBy=${this.currentDate}`);
  }
  getDayOfWeek(): Observable<DayOfWeek> {
    return this.http.get<DayOfWeek>(this.endpoints['fuel'].getDayOfWeek);
  }
  getDayOfMonth(): Observable<DayOfWeek> {
    return this.http.get<DayOfWeek>(this.endpoints['fuel'].getMonth);
  }
  getPriceFactors(): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.endpoints['fuel'].getPriceFactor}?activeBy=${this.currentDate}`);
  }
  getPriceSource(): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(`${this.endpoints['fuel'].getPriceSource}?activeBy=${this.currentDate}`);
  }
  fuelPriceSave(param: object, fuelId: number): Observable<HttpResponseBase> {
    const url = `${this.endpoints['fuel'].fuelPriceSave}/${fuelId}/fuelpricebasis`;
    return this.http.post<HttpResponseBase>(url, param, { observe: 'response' });
  }
  getRegionType(): Observable<RootObject> {
    return this.http.get<RootObject>(this.endpoints['fuel'].getRegionType);
  }
  getNationalDistrict(): Observable<DistrictList[]> {
    return this.http.get<DistrictList[]>(this.endpoints['fuel'].getNationalDistrict);
  }
  getStates(param: DistrictList): Observable<States> {
    const params = {
      params: {
        nationalDistrictID: param.fuelNationalDistrictID.toString(),
        subDistrictID: param.fuelSubDistrictID !== null ? param.fuelSubDistrictID.toString() : ''
      }
    };
    return this.http.get<States>(this.endpoints['fuel'].getStates, params);
  }
}

