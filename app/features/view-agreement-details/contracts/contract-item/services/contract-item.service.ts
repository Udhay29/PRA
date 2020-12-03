import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class ContractItemService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
   }
  getContractType(): Observable<any> {
    return this.http.get<any>(this.endpoints['createAgreement'].getContractType);
  }
  getContractId(): Observable<number> {
    return this.http.get<number>(this.endpoints['createAgreement'].getContractId);
  }
  getAgreementDetails(agreementId: number): Observable<any> {
    return this.http.get<any>(`${this.endpoints['viewAgreement'].getAgreementDetails}${agreementId}`);
  }
  saveContracts(param: object, agreementId: number): Observable<any> {
    const url = `${this.endpoints['createAgreement'].customeragreements}/${agreementId}/contracts`;
    return this.http.post<any>(url, param);
  }
}
