import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../config/app.config';
@Injectable()
export class DrayGroupService {

  endpoints: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getDrayGroup(params: object): Observable<any> {
    const url = `${this.endpoints['drayGroup'].getDrayGroupView}`;
    return this.http.post<any>(url, params);
  }


}
