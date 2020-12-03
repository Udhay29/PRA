import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../../config/app.config';

import { DocumentationTypeValues, DateRangeInterface, GroupNameTypeValues } from '../model/create-standard-documenation.interface';

@Injectable({
  providedIn: 'root'
})
export class CreateStandardDocumentationService {


  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getDocumentationType(): Observable<DocumentationTypeValues> {
    const url = this.endpoints['accessorial'].getDocumentationType;
    return this.http.get<DocumentationTypeValues>(url);
  }
  postDocumentationData(params: Object) {
    const url = `${this.endpoints['accessorial'].postStandardDocumentation}/documentations`;
    return this.http.post(url, params);
  }
  postRateData(params: Object) {
    const url = `${this.endpoints['accessorial'].postDocumentation}/rates`;
    return this.http.post(url, params);
  }
  getAttachmentType() {
    const url = `${this.endpoints['accessorial'].getAttachmentType}/accessorialAttachmentTypes`;
    return this.http.get(url);
  }
  getChargeTypes(): Observable<object> {
    const url = `${this.endpoints['accessorial'].getChargeCodes}`;
    return this.http.get<object>(url);
  }
  getGroupNames(): Observable<GroupNameTypeValues> {
    const url = `${this.endpoints['accessorial'].getStandardGroupNames}`;
    return this.http.get<GroupNameTypeValues>(url);
  }
  getCurrencyCodes(): Observable<object> {
    const url = this.endpoints['createAgreement'].getCurrency;
    return this.http.get<[string]>(url);
  }
  postFileDetails(fileData, params) {
    const url = `${this.endpoints['accessorial'].postFileDetails}documents?DocumentTitle=${
      params.documentTitle}&ecmObjectStore=${params.ecmObjectStore
      }&docClass=${params.docClass}&fileName=${params.fileName}&category=${params.category
      }&chargeCodeIds=${params.chargeCodeIds}&groupId=${params.groupId}`;
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
