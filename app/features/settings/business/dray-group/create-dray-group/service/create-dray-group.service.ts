import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../../config/app.config';
import { DateRangeInterface, CountryInterface, RateScopeInterface } from '../models/dray-group.interface';

@Injectable()
export class CreateDrayGroupService {

  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }


  getSuperUserBackDate(): Observable<DateRangeInterface> {
    const url = `${this.endpoints['accessorial'].getSuperUserBackDateDays}`;
    return this.http.get<DateRangeInterface>(url);
  }
  getSuperFutureBackDate(): Observable<DateRangeInterface> {
    const url = `${this.endpoints['accessorial'].getSuperUserFutureDateDays}`;
    return this.http.get<DateRangeInterface>(url);
  }
  getCountries(): Observable<CountryInterface[]> {
    const url = `${this.endpoints['drayGroup'].getCountries}`;
    return this.http.get<CountryInterface[]>(url);
  }
  getRateScopeLabel(): Observable<RateScopeInterface> {
    const url = `${this.endpoints['drayGroup'].rateScope}`;
    return this.http.get<RateScopeInterface>(url);
  }
  postDrayGroup(params: Object) {
    const url = `${this.endpoints['drayGroup'].postDrayGroup}`;
    return this.http.post(url, params);
  }
}
