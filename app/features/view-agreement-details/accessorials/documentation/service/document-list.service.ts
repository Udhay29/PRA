import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../../config/app.config';
import { QueryMock } from '../model/doumentaion.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentListService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getDocumentList(params: object): Observable<any> {
    return this.http.post<any>(this.endpoints['accessorial'].getDocumentList, params);
  }
  getMockJson(): Observable<QueryMock> {
    return this.http.get<QueryMock>(this.endpoints['accessorial'].getDocumentationSourceData);
  }
}
