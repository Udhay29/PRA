import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from './../../../../../../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class DocumentationDetailedViewService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getDoumentaionDetails(agreementId: string, documentConfigurationId: number) {
    const docUrl = this.endpoints['accessorial'].getDoumentationDetailedView;
    const url = `${docUrl}/${agreementId}/documents/${documentConfigurationId}`;
    return this.http.get(url);
  }
  getAgreementDetails(agreementId: string): Observable<any> {
    return this.http.get<any>(`${this.endpoints['viewAgreement'].getAgreementDetails}${agreementId}`);
  }
  viewAttachmentDetails(documentParam: object, headers?: HttpHeaders | null) {
    const docUrl = this.endpoints['accessorial'].getDoumentationAttachmentDetailedView;
    return this.http.post(docUrl, documentParam, { headers, responseType: 'blob' });
  }
}
