import { AppConfig } from './../../../../../../../config/app.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotifyWhenService {

  endpoints: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getFrequency() {
    const url = this.endpoints['accessorial'].getFrequency;
    return this.http.get(url);
  }
  getAccessorialNotificationRequiredTypes() {
    const url = this.endpoints['accessorial'].getAccessorialNotificationRequiredTypes;
    return this.http.get(url);
  }
  getEventOccurrenceTime() {
    const url = this.endpoints['accessorial'].getEventOccurrenceTime;
    return this.http.get(url);
  }
  getEventName() {
    const url = this.endpoints['accessorial'].getEventName;
    return this.http.get(url);
  }
  getTimeFrame() {
    const url = `${this.endpoints['accessorial'].gracePeriod}`;
    return this.http.get(url);
  }
}
