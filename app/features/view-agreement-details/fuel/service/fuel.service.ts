import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AppConfig } from '../../../../../config/app.config';
import { RootObject, QueryMock } from '../model/fuel.interface';

@Injectable({
  providedIn: 'root'
})
export class FuelService {
  elasticParam: object = {};
  endpoints: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getFuelList(params: object): Observable<RootObject> {
    return this.http.post<RootObject>(this.endpoints['fuelCalculation'].getFuelProgram, params);
  }
  setElasticparam(elasticParam: object) {
    this.elasticParam = elasticParam;
  }
  getElasticparam(): object {
    return this.elasticParam;
  }
  getMockJson(): Observable<QueryMock> {
    return this.http.get<QueryMock>(this.endpoints['fuelCalculation'].getFuelSourceData);
  }
}
