import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../../../../node_modules/@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../config/app.config';
import { ViewMileageQueryModel, QueryMock } from '../models/view-mileage.interface';
import { ElasticViewResponseModel } from '../models/view-mileage-elasticresponse.interface';

@Injectable({
  providedIn: 'root'
})
export class ViewMileageService {
  static esParam: any;
  endpoints: any;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  static setElasticparam(elasticParam: any) {
    this.esParam = elasticParam;
  }
  static getElasticparam(): any {
    return this.esParam;
  }

  public getMileagePreference(param: any): Observable<any> {
    const mileagePreferenceUrl = this.endpoints.mileage.getMileagePreferenceGridDetails;
    return this.http.post<any>(mileagePreferenceUrl, param);
  }
  downloadExcel(body: object, headers?: HttpHeaders | null, responseType?: 'blob'): Observable<any> {
    const url = this.endpoints['mileage'].exportExcelURL;
    return this.http.post(url, body, { headers, responseType: 'blob' });
  }
  getMockJson(): Observable<any> {
    return this.http.get<any>(this.endpoints.mileage.getMileageSourceData);
  }
  getMileageDetails(agreementID, mileageId): Observable<any> {
    const url = `${this.endpoints['mileage'].getMileageDetails}/${agreementID}/mileagepreferences/${mileageId}`;
    return this.http.get<any>(url);
  }

}
