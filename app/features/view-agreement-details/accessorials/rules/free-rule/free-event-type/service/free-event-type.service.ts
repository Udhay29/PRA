import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../../../config/app.config';
import { FreeEventType, EventFreeTime, EventFreeAmount } from '../model/free-event-type.interface';


@Injectable({
  providedIn: 'root'
})
export class FreeEventTypeService {

  endpoints: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getEventNameTypes() {
    const url = this.endpoints['accessorial'].getEventNameTypes;
    return this.http.get<FreeEventType>(url);
  }
  getEventFreeTime() {
    const url = this.endpoints['accessorial'].getEventFreeTime;
    return this.http.get<EventFreeTime>(url);
  }
  getEventFreeAmount() {
    const url = this.endpoints['accessorial'].getEventFreeAmount;
    return this.http.get<EventFreeAmount>(url);
  }
}
