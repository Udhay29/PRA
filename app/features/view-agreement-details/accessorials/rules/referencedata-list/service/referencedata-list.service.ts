import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { AppConfig } from '../../../../../../../config/app.config';
@Injectable({
  providedIn: 'root'
})
export class ReferencedataListService {
  endpoints: any;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  loadReferenceData(agreementId: string, freeRuleTypeId: number, params): Observable<Object> {
    const url = `${this.endpoints['accessorial'].getReferenceDataValues}${agreementId}/freerules/${freeRuleTypeId}`;
   return this.http.post<Object>(url, params);
  }
}
