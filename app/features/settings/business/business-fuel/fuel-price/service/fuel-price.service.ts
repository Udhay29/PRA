import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../../../../config/app.config';
import { ElasticResponseModel } from '../model/fuel-price.interface';
@Injectable({
  providedIn: 'root'
})
export class FuelPriceService {
  endpoints: any;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getFuelPriceList(param: object): Observable<ElasticResponseModel> {
    return this.http.post<ElasticResponseModel>(this.endpoints.businessSettingsFuelPrice.getFuelPriceList, param);
  }
  downloadExcel(body: object, headers?: HttpHeaders | null, responseType?: 'blob'): Observable<any> {
    const url = this.endpoints['fuel'].getFuelExportToExcel;
    return this.http.post(url, body, { headers, responseType: 'blob' });
  }
}
