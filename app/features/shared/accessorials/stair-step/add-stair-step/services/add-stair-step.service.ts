import { AppConfig } from './../../../../../../../config/app.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddStairStepService {

  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getRateTypes(buSodata) {
    let url;
    if (buSodata) {
      url = `${this.endpoints['accessorial'].getChargeAssociatedRateTypes}${buSodata}`;
    } else {
      url = this.endpoints['accessorial'].getChargeAssociatedRateTypes;
    }
    return this.http.get(url);
  }
  getRoundingTypes() {
    const url = this.endpoints['accessorial'].getRoudingTypes;
    return this.http.get(url);
  }
  getmaxApplidedWhen() {
    const url = this.endpoints['accessorial'].getmaxApplidedWhen;
    return this.http.get(url);
  }
}
