import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class StandardService {

  endpoints: object;
  reqParam: string;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getDocumentationConfiguration(): Observable<object> {
    const url = this.endpoints['accessorial']['getDocumentationConfiguration'];
    return this.http.get<Object>(url);
  }
}
