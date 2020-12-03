import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../../../../../src/config/app.config';
import { ElasticResponse } from '../model/priority.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {
  endpoints: object;
  elasticParam: object = {};
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  setElasticparam(elasticParam: object) {
    this.elasticParam = elasticParam;
  }
  getElasticparam(): object {
    return this.elasticParam;
  }
  getPriorityDetails(params: object): Observable<ElasticResponse> {
    return this.http.post<ElasticResponse>(this.endpoints['lineHaul'].getPriorityDetails, params);
  }
}
