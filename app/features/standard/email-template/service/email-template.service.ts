import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase, HttpHeaders } from '@angular/common/http';

import { AppConfig } from '../../../../../config/app.config';
import { ElasticResponseModel } from './../model/template/view-template.inteface';

@Injectable({
  providedIn: 'root'
})
export class EmailTemplateService {

  endpoints: object;

  constructor(private readonly http: HttpClient) {
    this.endpoints = AppConfig.getAccessorial();
   }

   getEmailTemplateTypes(): Observable<any[]> {
    const url = `${this.endpoints['template'].getEmailTemplateTypes}`;
    return this.http.get<any[]>(url);
  }

  getEmailTemplatePartTypes(): Observable<any[]> {
    const url = `${this.endpoints['template'].getEmailTemplatePartTypes}`;
    return this.http.get<any[]>(url);
  }

  getDataElements(id: number): Observable<any[]> {
    const url = `${this.endpoints['template'].getDataElements}?emailTemplatePartTypeId=${id}`;
    return this.http.get<any[]>(url);
  }

  saveEmailTemplate(query: object): Observable<any[]> {
    const url = this.endpoints['template'].saveEmailTemplate;
    return this.http.post<any[]>(url, query);
  }

  getMasterTemplateDetails(): Observable<any[]> {
    const url = `${this.endpoints['template'].getMasterTemplateDetails}?emailTemplateTypeName=Master`;
    return this.http.get<any[]>(url);
  }

  downloadExcel(query: object): Observable<any> {
    const url = 'api/pricingfilestoreservices/excelheaders';
    return this.http.post(url, query, { responseType: 'blob' });
  }

  getTemplateList(requestParam: any): Observable<ElasticResponseModel> {
    return this.http.post<ElasticResponseModel>(this.endpoints['template'].templateGridData, requestParam);
  }
  checkMasterTemplate(): Observable<any> {
          // tslint:disable-next-line:max-line-length
    const url = `${this.endpoints['template'].checkMasterTemplate}/search/existsByEmailTemplateType_EmailTemplateTypeNameIgnoreCase?emailTemplateTypeName=Master`;
    return this.http.get<any[]>(url);
  }
}
