import { AppConfig } from './../../../../../../../config/app.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotifyByService {

  endpoints: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getNotificationType() {
    const url = this.endpoints['accessorial'].getNotificationType;
    return this.http.get(url);
  }
  getTemplateType() {
    const url = this.endpoints['accessorial'].getTemplateType;
    return this.http.get(url);
  }
  getCheckBoxData() {
    const url = this.endpoints['accessorial'].getCheckBoxData;
    return this.http.get(url);
  }
}
