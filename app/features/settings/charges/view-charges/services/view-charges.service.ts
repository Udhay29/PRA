import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../../../config/app.config';
import { ChargeCodes, RootObject } from '../models/view-charges.interface';
import { ViewChargesModel } from '../models/view-charges.model';

@Injectable({
  providedIn: 'root'
})
export class ViewChargesService {
  endpoints: any;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getViewChargeCodes(params: object): Observable<RootObject> {
    return this.http.post<RootObject>(
      this.endpoints['chargeCode'].viewChargeCodes,
      params
    );
  }

}
