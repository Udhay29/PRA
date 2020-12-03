import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from '../../../../../../config/app.config';
import { CargoGridInterface } from './../../model/cargo-release.interface';

@Injectable({
  providedIn: 'root'
})
export class ViewCargoService {
  endpoints: any;

  constructor(private readonly http: HttpClient) {
    const appConfig: any = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getViewScreenData(agreementId: number, rowCargoId: Array<number>, cargoType: string): Observable<CargoGridInterface> {
    const urlEndpoint = this.endpoints['cargoReleaseAgreement'].cargoReleaseService;
    const url = `${urlEndpoint}/${agreementId}/cargoreleases/${cargoType}`;
    return this.http.post<CargoGridInterface>(url, rowCargoId);
  }

}
