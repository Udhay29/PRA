import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AppConfig } from '../../../../../../config/app.config';


import { FuelCalculationDropdown, ChargeType,
  ReeferDistanceMeasurement, ReeferVolumeMeasurement, UploadDataList } from './../models/fuel-calculation.interface';

@Injectable({
  providedIn: 'root'
})
export class FuelCalculationDetailsService {
  endpoints: any;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getFuelConfigurations(): Observable<FuelCalculationDropdown[]> {
    const fuelDropdownUrl = this.endpoints.fuelCalculation.getFuelConfigurations;
    return this.http.get<FuelCalculationDropdown[]>(fuelDropdownUrl);
}

getCurrencyList(programID: number): Observable<any[]> {
  const url = `/${programID}/fuelcalculations/currencytype`;
  const currencyUrl = `${this.endpoints.fuelCalculation.getFuelCurrency}${url}`;
  return this.http.get<any[]>(currencyUrl);
}

saveCalculationDetails(reqPayload, fuelProgramId: number): Observable<any> {
  const url = `/${fuelProgramId}/fuelcalculations`;
  const saveUrl = `${this.endpoints.fuelCalculation.saveFuelCalculationDetails}${url}`;
  return this.http.post<any>(saveUrl, reqPayload);
}

getChargeTypeList(searchData: string, page: number, pageSize: number): Observable<ChargeType[]> {
  const chargeTypeUrl = `${this.endpoints.fuelCalculation.getChargeType}`;
  return this.http.get<ChargeType[]>(chargeTypeUrl);
}

getLengthMeasurement(): Observable<ReeferDistanceMeasurement[]> {
  const url = `?pricingFunctionalAreaName=${'Fuel Program'}`;
  const lengthMeasurementUrl = `${this.endpoints.fuelCalculation.getLengthMeasurement}${url}`;
  return this.http.get<ReeferDistanceMeasurement[]>(lengthMeasurementUrl);
}

getVolumeMeasurement(): Observable<ReeferVolumeMeasurement[]> {
  const url = `?functionalArea=${'Fuel Program'}`;
  const lengthMeasurementUrl = `${this.endpoints.fuelCalculation.getVolumeMeasurement}${url}`;
  return this.http.get<ReeferVolumeMeasurement[]>(lengthMeasurementUrl);
}

getUploadDataTable(reqparam: object): Observable<UploadDataList[]> {
  const url = `${this.endpoints.fuelCalculation.getIncrementalFileDetail}`;
  return this.http.post<UploadDataList[]>(url, reqparam);
}

getCurrencyDetails(programID: number , fuelProgramVersionId: number): Observable<any[]> {
  const url = `/${programID}/versions/${fuelProgramVersionId}/currency`;
  const currencyUrl = `${this.endpoints.fuelCalculation.getFuelCurrency}${url}`;
  return this.http.get<any[]>(currencyUrl);
}

getCurrencyDropdown(): Observable<any[]> {
  const currencyDropdownUrl = `${this.endpoints.fuelCalculation.getFuelCurrencyDetails}`;
  return this.http.get<any[]>(currencyDropdownUrl);
}
}
