import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../config/app.config';

import { ConfigurationDetail } from '../model/business.interface';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getConfigurationValues(): Observable<ConfigurationDetail> {
    return this.http.get<ConfigurationDetail>(this.endpoints['settings']['configurables']);
  }

  saveConfigurationValues(param: object): Observable<boolean> {
    return this.http.put<boolean>(this.endpoints['settings']['configurables'], param);
  }
}
