import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../config/app.config';
import { QueryMock, RootObject } from '../model/sections.interface';

@Injectable({
  providedIn: 'root'
})
export class SectionListService {
  endpoints: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getSectionList(params: object): Observable<RootObject> {
    return this.http.post<RootObject>(
      this.endpoints['advanceSearch'].getAgreementName,
      params
    );
  }
  getMockJson(): Observable<QueryMock> {
    return this.http.get<QueryMock>(
      this.endpoints['viewAgreement'].getSectionSourceData
    );
  }
}
