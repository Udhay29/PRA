import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../../config/app.config';

import { BillToList, CarrierRootObject, RootObject, SaveResponse } from '../model/fuel-summary.interface';

@Injectable({
  providedIn: 'root'
})
export class FuelSummaryService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  /** business unit and service offering service call
   * @returns {Observable<RootObject>}
   * @memberof FuelSummaryService
   */
  getBusinessUnitServiceOffering(): Observable<RootObject> {
    const requestParam = {params: {financeBusinessUnitCode: ['ICS', 'DCS', 'JBT', 'JBI'].join()}};
    return this.http.get<RootObject>(this.endpoints['ratingRules'].getBUServiceOffering, requestParam);
  }
  /** affiliation service call
   * @returns {Observable<string[]>}
   * @memberof FuelSummaryService
   */
  getAffiliation(): Observable<string[]> {
    return this.http.get<string[]>(this.endpoints['fuel'].getAffiliationList);
  }
  /** save call for fuel program summary
   * @param {object} param
   * @returns {Observable<HttpResponseBase>}
   * @memberof FuelSummaryService
   */
  fuelSummarySave(param: object): Observable<HttpResponseBase> {
    return this.http.post<HttpResponseBase>(this.endpoints['fuel'].fuelSummarySave, param, {observe: 'response'});
  }
  /** elastic search call to fetch carrier details
   * @param {object} param
   * @returns {Observable<CarrierRootObject>}
   * @memberof FuelSummaryService
   */
  getCarrierDetails(param: object): Observable<CarrierRootObject> {
    return this.http.post<CarrierRootObject>(this.endpoints['fuel'].carrierDetails, param);
  }
  getBillToLists(agreementId: number, requestParam: object): Observable<BillToList[]> {
    const url = `${this.endpoints['fuel'].getBillToList}/${agreementId}/billtocodes`;
    return this.http.post<BillToList[]>(url, requestParam);
  }
  getContractSectionList(requestParam: object, affiliation: string): Observable<SaveResponse[]> {
    const url = `${this.endpoints['viewAgreement'].getAgreementDetails}${requestParam['agreementId']}/${affiliation}s`;
    return this.http.get<SaveResponse[]>(url, {params: requestParam['params']});
  }
}
