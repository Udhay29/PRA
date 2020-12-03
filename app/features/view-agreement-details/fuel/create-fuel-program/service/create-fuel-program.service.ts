import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../../config/app.config';

import { AgreementDetails } from '../model/create-fuel-program.interface';

@Injectable({
  providedIn: 'root'
})
export class CreateFuelProgramService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  /** service call to get agreement details
   * @param {number} agreementId
   * @returns {Observable<AgreementDetails>}
   * @memberof CreateFuelProgramService
   */
  getAgreementDetails(agreementId: number): Observable<AgreementDetails> {
    return this.http.get<AgreementDetails>(`${this.endpoints['viewAgreement'].getAgreementDetails}${agreementId}`);
  }
}
