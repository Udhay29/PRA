import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from './../../../../../../../config/app.config';
import { DocumentationReqParamInterface, AgreementDetailsInterface } from '../model/rules-detailed-view-interface';

@Injectable({
  providedIn: 'root'
})
export class RulesDetailedViewService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getAgreementDetails(agreementId: string): Observable<AgreementDetailsInterface> {
    return this.http.get<AgreementDetailsInterface>(`${this.endpoints['viewAgreement'].getAgreementDetails}${agreementId}`);
  }
  getRulesDetailedViewData(agreementId: string, configurationId: number): Observable<DocumentationReqParamInterface> {
    const url = `${this.endpoints['accessorial'].getRulesDetailedView}/${agreementId}/freerules/${configurationId}`;
    return this.http.get<DocumentationReqParamInterface>(url);
  }
  getRulesDocumentation(customeragreementId: string, params): Observable<any> {
    const url = `${this.endpoints['accessorial'].getRulesDocumentation}${customeragreementId}/documentationtext`;
    return this.http.post<any>(url, params);
  }
  viewAttachmentDetails(documentParam: object, headers?: HttpHeaders | null) {
    const docUrl = this.endpoints['accessorial'].getDoumentationAttachmentDetailedView;
    return this.http.post(docUrl, documentParam, { headers, responseType: 'blob' });
  }
}
