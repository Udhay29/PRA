import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../../../../node_modules/@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../config/app.config';
import { ViewCarrierMileageQueryModel, QueryMock } from '../model/carrier-mileage.interface';
import { ElasticViewResponseModel } from '../model/carrier-mileage-elasticresponse.interface';

@Injectable()
export class CarrierMileageService {
  static esParam: object;
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  static setElasticparam(elasticParam: object) {
    this.esParam = elasticParam;
  }
  static getElasticparam(): object {
    return this.esParam;
  }

  public getMileagePreference(param: object): Observable<ElasticViewResponseModel> {
    const mileagePreferenceUrl = this.endpoints['mileage'].getCarrierMileagePreferenceGridDetails;
    return this.http.post<ElasticViewResponseModel>(mileagePreferenceUrl, param);
  }
  getMockJson(): Observable<Object> {
    return this.http.get(`${this.endpoints['mileage'].getCarrierMileageSourceData}`);
  }
}
