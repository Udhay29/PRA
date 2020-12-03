import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { AppConfig } from '../../../../../config/app.config';

import { CodesParam, CodesResponse, CustomerAgreementContractsItem,
   RootObject, SaveRequest, ESObject, SaveResponse } from '../model/add-section.interface';

@Injectable({
  providedIn: 'root'
})
export class AddSectionService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getSectionType(): Observable<RootObject> {
    return this.http.get<RootObject>(this.endpoints['createAgreement'].getSectionType);
  }

  getCurrency(): Observable<string[]> {
    return this.http.get<string[]>(this.endpoints['createAgreement'].getCurrency);
  }

  getCodes(param: CodesParam): Observable<CodesResponse[]> {
    let url = `${this.endpoints['createAgreement'].customeragreements}/${param.agreementId}/contracts/${param.contractId}/accounts`;
    url = `${url}?effectiveDate=${param.effectiveDate}&expirationDate=${param.expirationDate}`;
    return this.http.get<CodesResponse[]>(url);
  }
  getContract(customeragreementid: number): Observable<CustomerAgreementContractsItem[]> {
    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const url = `${this.endpoints['createAgreement']
    .getActiveContractsList}/${customeragreementid}/contracts?activeBy=${currentDate}&projection=customerAgreementContractLookup`;
    return this.http.get<CustomerAgreementContractsItem[]>(url);
  }
  sectionSave(param: object, idObject: CodesParam): Observable<SaveRequest> {
    const url = `${this.endpoints['createAgreement'].customeragreements}/${idObject.agreementId}/contracts/${idObject.contractId}/sections`;
    if (idObject['sectionId'] === null) {
      return this.http.post<SaveRequest>(url, param);
    } else {
      return this.http.put<SaveRequest>(`${url}/${idObject['sectionId']}/versions/${idObject['versionId']}`, param);
    }
  }
  getSectionList(param: object): Observable<ESObject> {
    return this.http.post<ESObject>(this.endpoints['searchAgreement'].getSearchData, param);
  }
  getAccountCode(param: object): Observable<RootObject> {
    return this.http.post<RootObject>(this.endpoints['createAgreement'].getCode, param);
  }
  editSection(param: object): Observable<SaveResponse> {
    const url = `${this.endpoints['createAgreement'].customeragreements}/${param['agreementId']}/contracts/${param
    ['contractId']}/sections/${param['sectionId']}/versions/${param['sectionVersionID']}`;
    return this.http.get<SaveResponse>(url);
  }
  getDatesByRole(param: string): Observable<RootObject> {
    return this.http.get<RootObject>(`${this.endpoints['createAgreement'].datesByRole}?configurationParameterNames=${param}`);
  }
  getEditCodes(param: object): Observable<CodesResponse[]> {
    const url = `${this.endpoints['createAgreement'].customeragreements}/${param['agreementId']}/contracts/${param
    ['contractId']}/sections/${param['sectionId']}/sectionsaccounts?effectiveDate=${param
    ['effectiveDate']}&expirationDate=${param['expirationDate']}`;
    return this.http.get<CodesResponse[]>(url);
  }
}
