import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../../config/app.config';
import { environment } from '../../../../../../../environments/environment';
import { FreeRuleType, QuantityType, DistanceType, TimeType } from '../model/free-rule.interface';

@Injectable({
  providedIn: 'root'
})

export class FreeRuleService {
  endpoints: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getFreeTypes() {
    const url = this.endpoints['accessorial'].getFreeRuleTypes;
    return this.http.get<FreeRuleType>(url);
  }
  getQuantityTypes() {
    const url = this.endpoints['accessorial'].getQuantityTypes;
    return this.http.get<QuantityType>(url);
  }
  getfreeRuleDistanceTypes() {
    const url = this.endpoints['accessorial'].getfreeRuleDistanceTypes;
    return this.http.get<DistanceType>(url);
  }
  getfreeRuleTimeTypes() {
    const url = this.endpoints['accessorial'].getfreeRuleTimeTypes;
    return this.http.get<TimeType>(url);
  }
}
