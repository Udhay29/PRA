import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../config/app.config';

import { AgreementDetails } from '../model/view-agreement-details.interface';

@Injectable({
  providedIn: 'root'
})
export class ViewAgreementDetailsService {
  endpoints: object;
  reqParam: string;
  /**
   *Creates an instance of ViewAgreementDetailsService.
   * @memberof ViewAgreementDetailsService
   */
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getAgreementDetails(agreementId: number): Observable<AgreementDetails> {
    return this.http.get<AgreementDetails>(`${this.endpoints['viewAgreement'].getAgreementDetails}${agreementId}`);
  }
  getDetailsList(params): Observable<string[]> {
    return this.http.get<string[]>(`${this.endpoints['viewAgreement'].getDetailsList}?entityType=${params}`);
  }
  getDocumentDetails(agreementId: number): Observable<Object> {
    return this.http.get<Object>(`${this.endpoints['accessorial'].getAgreementDetails}=${agreementId}`);
  }

}
