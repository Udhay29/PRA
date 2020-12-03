import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../config/app.config';

import { AgreementTypesResponse, CreateSaveResponse, RootObject } from '../model/agreement-details.interface';

@Injectable({
  providedIn: 'root'
})
export class AgreementDetailsService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getAgreementType(): Observable<AgreementTypesResponse> {
    return this.http.get<AgreementTypesResponse>(this.endpoints['createAgreement'].getAgreementTypes);
  }

  getAccountName(params: object): Observable<RootObject> {
    return this.http.post<RootObject>(this.endpoints['createAgreement'].getAccountName, params);
  }

  getTeams(params: object): Observable<RootObject> {
    return this.http.post<RootObject>(this.endpoints['createAgreement'].getTeams, params);
  }

  agreementCheckSave(param: object): Observable<CreateSaveResponse> {
    return this.http.post<CreateSaveResponse>(this.endpoints['createAgreement'].customeragreements, param);
  }

  getCarrierDetails(param: object): Observable<RootObject> {
    return this.http.post<RootObject>(this.endpoints['fuel'].carrierDetails, param);
  }

  saveCarrier(param: object): Observable<HttpResponseBase> {
    return this.http.post<HttpResponseBase>(this.endpoints['createAgreement'].saveCarrierAgreement, param,
    {observe: 'response'});
  }

  getCarrierEffectiveDate(param: number): Observable<string> {
    return this.http.get<string>(`${this.endpoints['createAgreement'].saveCarrierAgreement}?carrierID=${param}`);
  }
}
