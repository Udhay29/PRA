import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../config/app.config';

import { CargoDetailListItem, DeleteAgreement } from './../models/add-cargo-interface';


@Injectable({
  providedIn: 'root'
})
export class AddCargoService {

  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getCargoGrid(query: object): Observable<any> {
    const url = `${this.endpoints['cargoReleaseAgreement'].getCargoTableData}`;
    return this.http.post<any>(url, query);
  }
  createNewAgreement(agreementId: number): Observable<number> {
    const url = `${this.endpoints['cargoReleaseAgreement'].cargoReleaseService}/${agreementId}?status=Completed`;
    return this.http.patch<number>(url, {});
  }
  deleteGridData(payload, agreementId: number): Observable<Array<DeleteAgreement>> {
    const url = `${this.endpoints['cargoReleaseAgreement'].cargoReleaseService}/${agreementId}/cargoreleases/delete`;
    return this.http.put<Array<DeleteAgreement>>(url, payload);
  }
}
