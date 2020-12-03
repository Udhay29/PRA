import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../../config/app.config';
import { BusinessUnitList, ChargeApplicationLevelTypeList,
  ChargeUsageTypeList, RateTypeList, SaveChargeCodeRequestPayload, ServiceOfferingCode } from '../models/create-charges.interface';

@Injectable({
  providedIn: 'root'
})
export class CreateChargesService {

  endpoints: any;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
   }

  getBusinessUnit(): Observable<BusinessUnitList> {
    const url = '/search/fetchBusinessUnitCode';
    const businessUnitUrl = this.endpoints.mileage.getBusinessUnitList + url;
    return this.http.get<BusinessUnitList>(businessUnitUrl);
  }
  getServiceOffering(param): Observable<ServiceOfferingCode[]> {
    const bu = `?financebusinessunitcode=${param}`;
    const serviceOfferingUrl = this.endpoints.chargeCode.getServiceOfferingList + bu;
    return this.http.get<ServiceOfferingCode[]>(serviceOfferingUrl);
  }
  getUsage(currentDate): Observable<ChargeUsageTypeList> {
    const url = `${this.endpoints.chargeCode.getChargeUsageTypeValues}?activeBy=${currentDate}`;
    return this.http.get<ChargeUsageTypeList>(url);
  }
  getApplicationLevelTypes(currentDate): Observable<ChargeApplicationLevelTypeList> {
    const url = `${this.endpoints.chargeCode.getApplicationLevelTypeValues}/chargeapplicationleveltypes?activeBy=${currentDate}`;
    return this.http.get<ChargeApplicationLevelTypeList>(url);
  }
  getRateTypes(): Observable<RateTypeList> {
    const url = this.endpoints.chargeCode.getRateTypes;
    return this.http.get<RateTypeList>(url);
  }
  postChargeCode(param: SaveChargeCodeRequestPayload): Observable<any> {
    const url = this.endpoints.chargeCode.saveChargeCode;
    return this.http.post<any>(url, param);
  }
}
