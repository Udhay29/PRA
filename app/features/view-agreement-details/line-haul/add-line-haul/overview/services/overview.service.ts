import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { AppConfig } from '../../../../../../../config/app.config';
import {
  BusinessUnit
} from './../../../../../create-agreement/add-cargo/models/add-cargo-interface';
import {
  ServiceLevel, EquipmentCategory, EquipmentType, EquipmentLength, OperationalService,
  AwardStatus, ServiceofferingInterface
} from '../model/overview.interface';
import { SaveResponseDto } from '../../../create-line-haul/model/create-line-haul.interface';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {

  endpoints: any;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getServiceLevel(params: string): Observable<ServiceLevel> {
    const url = `${this.endpoints.lineHaul.getServiceLevel}${params}`;
    return this.http.get<ServiceLevel>(url);
  }
  getEquipmentCategory(): Observable<EquipmentCategory> {
    const url = this.endpoints['lineHaul'].getEquipmentCategory;
    return this.http.get<EquipmentCategory>(url);
  }
  getEquipmentType(params: string): Observable<EquipmentType> {
    const url = `${this.endpoints.lineHaul.getEquipmentTypes}${params}`;
    return this.http.get<EquipmentType>(url);
  }
  getEquipmentLength(params: string): Observable<EquipmentLength> {
    const url = `${this.endpoints.lineHaul.getEquipmentLength}${params}`;
    return this.http.get<EquipmentLength>(url);
  }
  getOperationalServices(reqPayload): Observable<Array<OperationalService>> {
    const url = this.endpoints.lineHaul.getOperationalServices;
    const serviceOffering = `&serviceOffering=${reqPayload.serviceOffering}`;
    const serviceCategoryCode = `&serviceCategoryCode=${reqPayload.serviceCategoryCode}`;
    return this.http.get<Array<OperationalService>>
    (`${url}?businessUnit=${reqPayload.businessUnit}${serviceOffering}${serviceCategoryCode}`);
  }
  getAwardStatus(): Observable<AwardStatus> {
    const url = this.endpoints.lineHaul.getAwardStatus;
    return this.http.get<AwardStatus>(url);
  }
  getBusinesUnit(): Observable<BusinessUnit> {
    const url = this.endpoints['lineHaul'].business;
    return this.http.get<BusinessUnit>(url);
  }
  getServiceOffering(selectedBu: string): Observable<Array<ServiceofferingInterface>> {
    const serviceOffering = '/findserviceofferingassocationsbybusinessunit?financebusinessunitcode=';
    const url = this.endpoints['lineHaul'].serviceOfferingValues;
    return this.http.get<Array<ServiceofferingInterface>>(`${url}${serviceOffering}${selectedBu}`);
  }
  getPriorityNumber(param): Observable<number> {
    const url = `${this.endpoints['lineHaul'].getPriorityNumber}?origintypeid=${param[
      'originID']}&destinationtypeid=${param['destinationID']}`;
    return this.http.get<number>(url);
  }
  onSaveManualDetails(agreementId: number, startDate: string, endDate: string): Observable<Array<SaveResponseDto>> {
    const url =
      `${this.endpoints['lineHaul'].saveManualDetails}/${agreementId}/linehaul?effectiveDate=${startDate}&expirationDate=${endDate}`;
    return this.http.get<Array<SaveResponseDto>>(url);
  }
}

