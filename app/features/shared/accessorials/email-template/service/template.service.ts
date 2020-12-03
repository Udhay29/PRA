import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  endpoints: object;

  constructor(private readonly http: HttpClient) {
    this.endpoints = AppConfig.getAccessorial();
  }

  getNotificationTypes(): Observable<any[]> {
    const url = `${this.endpoints['template'].getNotificationTypes}`;
    return this.http.get<any[]>(url);
  }

  getChargeTypes(): Observable<any[]> {
    const appConfig = AppConfig.getConfig();
    const endpoint = appConfig.api;
    const url = `${endpoint['accessorial'].getChargeCodes}`;
    return this.http.get<any[]>(url);
  }

  checkDefaultTemplateExists(notificationId: number, chargeTypeId: number ): Observable<any[]> {
    // tslint:disable-next-line:max-line-length
    const url = `${this.endpoints['template'].checkDefaultTemplateExists}?accessorialNotificationTypeId=${notificationId}&chargeTypeId=${chargeTypeId}`;
    return this.http.get<any[]>(url);
  }

}
