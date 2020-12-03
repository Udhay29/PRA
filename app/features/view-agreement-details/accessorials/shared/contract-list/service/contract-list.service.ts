import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../../../config/app.config';
@Injectable({
  providedIn: 'root'
})
export class ContractListService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getContactDetails(agreementId: string): Observable<Object> {
    const url = `${agreementId}/allcontracts`;
    return this.http.get(`${this.endpoints['createAgreement'].getActiveContractsList}${url}`);
  }

}
