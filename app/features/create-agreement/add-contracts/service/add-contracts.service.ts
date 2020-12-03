import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../config/app.config';

import { RootObject, SaveResponse } from '../model/add-contracts.interface';

@Injectable({
  providedIn: 'root'
})
export class AddContractsService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getContractType(): Observable<RootObject> {
    return this.http.get<RootObject>(this.endpoints['createAgreement'].getContractType);
  }

  contractSave(param: object, customeragreementid: number): Observable<SaveResponse> {
    const url = `${this.endpoints['createAgreement'].customeragreements}/${customeragreementid}/contracts`;
    return this.http.post<SaveResponse>(url, param);
  }

  getContractId(): Observable<number> {
    return this.http.get<number>(this.endpoints['createAgreement'].getContractId);
  }

  getContractList(customeragreementid: number): Observable<RootObject> {
    const url = `${this.endpoints['createAgreement']
    .getContractList}?customerAgreementID=${customeragreementid}&projection=customerAgreementContractLookup`;
    return this.http.get<RootObject>(url);
  }

  contractEditSave(customeragreementid: number, contractid: number, param: object): Observable<SaveResponse> {
    const url = `${this.endpoints['createAgreement'].customeragreements}/${customeragreementid}/contracts/${contractid}`;
    return this.http.put<SaveResponse>(url, param);
  }

  deleteContract(customeragreementid: number, contractid: string): Observable<HttpResponseBase> {
    const url = `${this.endpoints['createAgreement'].customeragreements}/${customeragreementid}/contracts?contractIds=${contractid}`;
    return this.http.delete<HttpResponseBase>(url, {observe: 'response'});
  }
}
