import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from './../../../../../../../../config/app.config';
import {
  BusinessUnit, ServiceLevel, OperationalService,
  EquipmentCategory, EquipmentType, EquipmentLength, HitsInterface
} from '../models/optional-attributes.interface';

@Injectable({
  providedIn: 'root'
})
export class OptionalAttributeService {
  endpoints: object;
  accessorialQuery: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getChargeTypes(): Observable<object> {
    const url = `${this.endpoints['accessorial'].getChargeCodes}`;
    return this.http.get<object>(url);
  }
  getBusinessUnitServiceOffering(): Observable<BusinessUnit> {
    const url = this.endpoints['accessorial'].business;
    return this.http.get<BusinessUnit>(url);
  }
  getServiceLevel(params: string): Observable<ServiceLevel> {
    const url = `${this.endpoints['accessorial'].getServiceLevel}${params}`;
    return this.http.get<ServiceLevel>(url);
  }
  getOperationalServices(): Observable<Array<OperationalService>> {
    const url = this.endpoints['accessorial'].getOperationalServices;
    return this.http.get<Array<OperationalService>>(url);
  }
  getEquipmentCategory(): Observable<EquipmentCategory> {
    const url = this.endpoints['accessorial'].getStandardEquipmentCategory;
    return this.http.get<EquipmentCategory>(url);
  }
  getEquipmentType(params: string): Observable<EquipmentType> {
    const url = `${this.endpoints['accessorial'].getStandardEquipmentTypes}${params}`;
    return this.http.get<EquipmentType>(url);
  }
  getEquipmentLength(params: string): Observable<EquipmentLength> {
    const url = `${this.endpoints['accessorial'].getStandardEquipmentLength}${params}`;
    return this.http.get<EquipmentLength>(url);
  }
  getCarrierData(query: object): Observable<HitsInterface[]> {
    const url = this.endpoints['mileage'].getCarrierList;
    return this.http.post<HitsInterface[]>(url, query);
  }
}
