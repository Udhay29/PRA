import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { AppConfig } from '../../../../../../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class BilltoListService {
  endpoints: any;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  loadBillToData(params): Observable<Object> {
    const url = this.endpoints.accessorial.getBillTodetails;
    return this.http.post<Object>(url, params);
  }
}
