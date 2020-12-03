import { Injectable } from '@angular/core';
import { AppConfig } from './../../../../../../../config/app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SectionsService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getSectionGridData(agreeementID: number): Observable<Object> {
    const fetchURL = `${this.endpoints['createAgreement'].getActiveContractsList}/${
      agreeementID}/allsections`;
    return this.http.get(fetchURL);
  }
}
