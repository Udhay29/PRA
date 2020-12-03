import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../config/app.config';
import { RateGridDto } from '../model/rate.interface';


@Injectable({
  providedIn: 'root'
})
export class RateViewService {

  endpoints: object;
  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getRateData(params: object): Observable<RateGridDto> {
    const url = `${this.endpoints['accessorial'].getRateValues}`;
    return this.http.post<RateGridDto>(url, params);
  }
}
