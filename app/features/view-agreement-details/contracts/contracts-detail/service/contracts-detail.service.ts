import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../../config/app.config';

import { ContractDetails, Contract } from '../../model/contracts.interface';

@Injectable({
  providedIn: 'root'
})
export class ContractsDetailService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getContractDetail(param: Contract, currdate: string): Observable<ContractDetails> {
    const url = `${this.endpoints['viewAgreement'].getAgreementDetails}${param.AgreementID}/contracts/${param
    .ContractID}/versions/${param.ContractVersionID}?currentDate=${currdate}`;
    return this.http.get<ContractDetails>(url);
  }
}
