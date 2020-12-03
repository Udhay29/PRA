import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  endpoints: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getRules(params: object): Observable<any> {
    const url = `${this.endpoints['accessorial'].getAccessorialRules}`;
    return this.http.post<any>(url, params);
  }
}
