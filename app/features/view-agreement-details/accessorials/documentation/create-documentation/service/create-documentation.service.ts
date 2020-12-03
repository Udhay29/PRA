import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../../config/app.config';

import { DocumentationDate, DocumentationTypeValues, DateRangeInterface } from '../model/create-documentation.interface';
import { ChargeCodeResponseInterface } from '../../../rates/create-rates/model/create-rates.interface';

@Injectable({
  providedIn: 'root'
})
export class CreateDocumentationService {

  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getAgreementLevelDate(agreementId: string, agreementType: string): Observable<DocumentationDate> {
    const url =
      `${this.endpoints['accessorial'].getAgreementLevelDate}${agreementId}/type/${agreementType}`;
    return this.http.get<DocumentationDate>(url);
  }
  getDocumentationType(): Observable<DocumentationTypeValues> {
    const url = this.endpoints['accessorial'].getDocumentationType;
    return this.http.get<DocumentationTypeValues>(url);
  }
  postDocumentationData(params: Object, customeragreementId: string) {
    const url = `${this.endpoints['accessorial'].postDocumentation}${customeragreementId}/documentations`;
    return this.http.post(url, params);
  }
  postRateData(params: Object, customeragreementId: string) {
    const url = `${this.endpoints['accessorial'].postDocumentation}${customeragreementId}/rates`;
    return this.http.post(url, params);
  }
  patchRateData(params: Object, customeragreementId: string, rateConfigurationId: number) {
    const url = `${this.endpoints['accessorial'].postDocumentation}${customeragreementId}/rates/${rateConfigurationId}`;
    return this.http.put(url, params);
  }
  getAttachmentType() {
    const url = `${this.endpoints['accessorial'].getAttachmentType}/accessorialAttachmentTypes`;
    return this.http.get(url);
  }
  getChargeTypes(): Observable<ChargeCodeResponseInterface[]> {
    const url = `${this.endpoints['accessorial'].getChargeCodes}`;
    return this.http.get<ChargeCodeResponseInterface[]>(url);
  }
  getCurrencyCodes(): Observable<object> {
    const url = this.endpoints['createAgreement'].getCurrency;
    return this.http.get<[string]>(url);
  }
  postFileDetails(fileData, customeragreementId: string, params) {
    const url = `${this.endpoints['accessorial'].postFileDetails}documents?AGREEMENT_TYPE=${params.agreementType
      }&AGREEMENT_ID=${params.agreementId}&DocumentTitle=${params.documentTitle}&ecmObjectStore=${params.ecmObjectStore
      }&docClass=${params.docClass}&fileName=${params.fileName}&chargeCodeIds=${params.chargeCodeIds}`;
    return this.http.post(url, fileData);
  }
  deleteUploadedFiles(params: Object) {
    const url =
      `${this.endpoints['accessorial'].postFileDetails}documents`;
    return this.http.put(url, params);
  }
  getSuperUserBackDate(): Observable<DateRangeInterface> {
    const url = `${this.endpoints['accessorial'].getSuperUserBackDateDays}`;
    return this.http.get<DateRangeInterface>(url);
  }
  getSuperFutureBackDate(): Observable<DateRangeInterface> {
    const url = `${this.endpoints['accessorial'].getSuperUserFutureDateDays}`;
    return this.http.get<DateRangeInterface>(url);
  }
}
