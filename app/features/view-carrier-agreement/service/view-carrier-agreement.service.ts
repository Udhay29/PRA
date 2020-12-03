import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { AppConfig } from '../../../../config/app.config';
import { CarrierDetails } from '../model/view-carrier-agreeement.interface';

@Injectable({
  providedIn: 'root'
})
export class ViewCarrierAgreementService {
  endpoints: object;
  reqParam: string;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
   }

  getAgreementDetails(agreementId: number): Observable<CarrierDetails> {
    const date = moment(new Date()).format('YYYY-MM-DD');
    return this.http.get<CarrierDetails>(`${this.endpoints['viewCarrierAgreement'].getAgreementDetails}${agreementId}?currentDate=${date}`);
  }
  getDetailsList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.endpoints['viewCarrierAgreement'].getDetailList}?entityType=carrierAgreement`);
  }
}
