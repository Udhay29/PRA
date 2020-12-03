import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../config/app.config';

import {
  CargoReleaseDefaultAmount, SectionCargoAgreement,
  ContactCargoAgreement, BusinessUnit, CargoDetailListItem, GridRowData, DeleteAgreement
} from './../../models/add-cargo-interface';

@Injectable({
  providedIn: 'root'
})
export class CreateCargoService {

  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getAgreementTime(agreementId: number): Observable<CargoReleaseDefaultAmount> {
    const url = `${this.endpoints['cargoReleaseAgreement'].cargoReleaseService}/${agreementId}/type/Agreement`;
    return this.http.get<CargoReleaseDefaultAmount>(url);
  }
  getAgreementCargoDetails(agreementId: number, rowCargoId: Array<number>, cargoType: string): Observable<GridRowData> {
    const urlEndpoint = this.endpoints['cargoReleaseAgreement'].cargoReleaseService;
    const url = `${urlEndpoint}/${agreementId}/cargoreleases/${cargoType}`;
    return this.http.post<GridRowData>(url, rowCargoId);
  }
  getSectionCargo(agreementId: number): Observable<Array<SectionCargoAgreement>> {
    const url = `${this.endpoints['cargoReleaseAgreement'].cargoReleaseService}/${agreementId}/type/Section`;
    return this.http.get<Array<SectionCargoAgreement>>(url);
  }
  getContractCargo(agreementId: number): Observable<Array<ContactCargoAgreement>> {
    const url = `${this.endpoints['cargoReleaseAgreement'].cargoReleaseService}/${agreementId}/type/Contract`;
    return this.http.get<Array<ContactCargoAgreement>>(url);
  }
  getBusinessUnit(): Observable<Array<BusinessUnit>> {
    return this.http.get<Array<BusinessUnit>>(this.endpoints['cargoReleaseAgreement'].businessUnit);
  }
  saveCargo(url: string, query): Observable<CargoDetailListItem> {
    const saveUrl = `${this.endpoints['cargoReleaseAgreement'].cargoReleaseService}/${url}`;
    return this.http.post<CargoDetailListItem>(saveUrl, query);
  }
  updateCargo(url: string, query): Observable<CargoDetailListItem> {
    const saveUrl = `${this.endpoints['cargoReleaseAgreement'].cargoReleaseService}/${url}`;
    return this.http.put<CargoDetailListItem>(saveUrl, query);
  }
  deleteGridData(payload, agreementId): Observable<Array<DeleteAgreement>> {
    const url = `${this.endpoints['cargoReleaseAgreement'].cargoReleaseService}/${agreementId}/cargoreleases/delete`;
    return this.http.put<Array<DeleteAgreement>>(url, payload);
  }
}
