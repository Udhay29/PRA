import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from '../../../../../config/app.config';
import { CargoGridInterface, QueryMock} from './../model/cargo-release.interface';

@Injectable({
  providedIn: 'root'
})
export class CargoReleaseService {
  static esParam: object = {};
  endpoints: any;

  constructor(private readonly http: HttpClient) {
    const appConfig: any = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  static setElasticparam(elasticParam: object) {
    this.esParam  = elasticParam;
  }
  static getElasticparam(): object {
    return this.esParam;
  }

  getCargoGridValues(param: object): Observable<CargoGridInterface[]> {
    return this.http.post<CargoGridInterface[]>(this.endpoints.cargoReleaseAgreement.getCargoReleaseValues, param);
  }
  getMockJson(): Observable<QueryMock> {
   return this.http.get<QueryMock>(this.endpoints.viewAgreement.getCargoSourceData);
  }

}
