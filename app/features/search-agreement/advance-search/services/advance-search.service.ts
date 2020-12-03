import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../../config/app.config';

import { AgreementTypesResponse, RootObject } from '../model/advance-search-interface';

@Injectable()
export class AdvanceSearchService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
   }

  getAgreementType(): Observable<AgreementTypesResponse> {
    return this.http.get<AgreementTypesResponse>(this.endpoints['createAgreement'].getAgreementTypes);
  }
  getSearchResults(params: object): Observable<RootObject> {
    return this.http.post<RootObject>(this.endpoints['advanceSearch'].getAgreementName, params);
  }
  getCarrierSearchResults(params: object): any {
    return this.http.post<any>(this.endpoints['advanceSearch'].getCarrierAgreementName, params);
  }
  getCodeStatus(params): Observable<string[]> {
    return this.http.get<string[]>(`${this.endpoints['advanceSearch'].getStatus}?entityType=${params}`);
  }
  getCarrierStatus(params): Observable<string[]> {
    return this.http.get<string[]>(`${this.endpoints['advanceSearch'].getCarrierStatus}?entityType=${params}`);
  }
}
