import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { AppConfig } from '../../../../../config/app.config';
import { BillToList, CustomerAgreementContractsItem, InitialStructure, CodesParam,
  BillToCodesParam, EditCodeParam, ImpactCount } from '../model/sections.interface';
@Injectable({
  providedIn: 'root'
})
export class SectionsService {
  static elasticParam: object = {};
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  static setElasticparam(elasticParam: object) {
    this.elasticParam = elasticParam;
  }
  static getElasticparam(): object {
    return this.elasticParam;
  }

  getSectionType(): Observable<InitialStructure> {
    return this.http.get<InitialStructure>(this.endpoints['createAgreement'].getSectionType);
  }

  getCurrency(): Observable<string[]> {
    return this.http.get<string[]>(this.endpoints['createAgreement'].getCurrency);
  }

  getContract(customeragreementid: number): Observable<CustomerAgreementContractsItem[]> {
    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const url = `${this.endpoints['createAgreement']
    .getActiveContractsList}/${customeragreementid}/contracts?activeBy=${currentDate}&projection=customerAgreementContractLookup`;
    return this.http.get<CustomerAgreementContractsItem[]>(url);
  }

  getCreateSectionBillTo(customeragreementid: number, billToFlag: boolean, idObject: BillToCodesParam): Observable<BillToList[]> {
    let headers: HttpHeaders = new HttpHeaders();
    if (billToFlag) {
      headers =  headers.append('IS-EDITED', 'true');
      headers =  headers.append('SECTION-ID', idObject.sectionId);
      headers =  headers.append('SECTION-VERSION-ID', idObject.sectionVerId);
    } else {
      headers = headers.append('IS-EDITED', 'false');
    }
    const url = `${this.endpoints['createAgreement'].customeragreements}/${customeragreementid}/accounts`;
    return this.http.get<BillToList[]>(url, {headers});
  }

  sectionSave(param: object, idObject: CodesParam, isValidate: boolean) {
    const url = isValidate ?  `${this.endpoints['createAgreement'].customeragreements}/${idObject.
      agreementId}/contracts/${idObject.contractId}/sections/validate` : `${this.endpoints['createAgreement'].
      customeragreements}/${idObject.agreementId}/contracts/${idObject.contractId}/sections`;
    return this.http.post(url, param);
  }

  getDatesByRole(param: string): Observable<InitialStructure> {
    return this.http.get<InitialStructure>(`${this.endpoints['createAgreement'].datesByRole}?configurationParameterNames=${param}`);
  }

  sectionEditSave(param: object, idObject: EditCodeParam) {
    const url = `${this.endpoints['createAgreement'].customeragreements}/${idObject.agreementId}/contracts/${idObject.contractId}
    /sections/${idObject.sectionId}/versions/${idObject.versionId}`;
    return this.http.put(url, param);
  }

  getImpactCount(sectionId: number, expDate: string): Observable<ImpactCount> {
    const url = `${this.endpoints['createAgreement'].impactCount}${sectionId}/counts?expirationDate=${expDate}`;
    return this.http.get<ImpactCount>(url);
  }

}
