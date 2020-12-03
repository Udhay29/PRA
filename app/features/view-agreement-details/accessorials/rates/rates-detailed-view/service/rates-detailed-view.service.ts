import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from './../../../../../../../config/app.config';
import { DocumentationReqParamInterface } from './../model/rates-detailed-view-interface';

@Injectable({
  providedIn: 'root'
})
export class RatesDetailedViewService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getRatesDetailedViewData(agreementId: string, configurationId: number): any {
    const url = `${this.endpoints['accessorial'].getRatesDetailedView}/${agreementId}/rates/${configurationId}`;
    return this.http.get<any>(url);
  }
  getRatesDocumentation(customeragreementId: string, params: DocumentationReqParamInterface): Observable<any> {
    const url = `${this.endpoints['accessorial'].getRatesDocumentation}${customeragreementId}/documentationtext`;
    return this.http.post<any>(url, params);
  }
  getAllServiceTypesData(): any {
    const url = `${this.endpoints['accessorial'].getAllServiceTypes}`;
    return this.http.get<any>(url);
  }
}
