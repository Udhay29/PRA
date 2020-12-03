import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../config/app.config';
import {
  BusinessUnit, ServiceLevel, OperationalService, BuSoAssociation,
  EquipmentCategory, EquipmentType, EquipmentLength, HitsInterface, ChargeType
} from '../models/optional-attributes.interface';

@ Injectable({
  providedIn: 'root'
})
export class OptionalAttributesService {

  endpoints: object;
  accessorialQuery: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getChargeTypes(): Observable<ChargeType[]> {
    const url = `${this.endpoints['accessorial'].getChargeCodes}`;
    return this.http.get<ChargeType[]>(url);
  }
  getBusinessUnitServiceOffering(): Observable<BusinessUnit> {
    const url = this.endpoints['accessorial'].business;
    return this.http.get<BusinessUnit>(url);
  }
  getBUbasedOnChargeType(param: string): Observable<BuSoAssociation[]> {
    const url = `${this.endpoints['accessorial'].getBUbasedOnChargeType}${param}`;
    return this.http.get<BuSoAssociation[]>(url);
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
    const url = this.endpoints['accessorial'].getEquipmentCategory;
    return this.http.get<EquipmentCategory>(url);
  }
  getEquipmentType(params: string): Observable<EquipmentType> {
    const url = `${this.endpoints['accessorial'].getEquipmentTypes}${params}`;
    return this.http.get<EquipmentType>(url);
  }
  getEquipmentLength(params: string): Observable<any> {
    const url = `${this.endpoints['accessorial'].getEquipmentLength}${params}`;
    return this.http.get<any>(url);
  }
  getCarrierData(query: object): Observable<HitsInterface[]> {
    const url = this.endpoints['mileage'].getCarrierList;
    return this.http.post<HitsInterface[]>(url, query);
  }
}
