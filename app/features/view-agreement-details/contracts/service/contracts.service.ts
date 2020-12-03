import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from '../../../../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  static elasticParam: object = {};
  constructor(private readonly http: HttpClient) { }
  appConfig: AppConfig = AppConfig.getConfig();
  baseUrl = this.appConfig['api'];
  static setElasticparam(elasticParam: object) {
    this.elasticParam = elasticParam;
  }
  static getElasticparam(): object {
    return this.elasticParam;
  }
}
