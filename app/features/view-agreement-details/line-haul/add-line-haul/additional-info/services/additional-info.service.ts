import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../../../config/app.config';
import { BillToCodeList } from './../models/additional-info.interface';

@Injectable({
  providedIn: 'root'
})
export class AdditionalInfoService {
  endpoints: any;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getBillToCodes(sectionId: string, effectiveDate: string, expirationDate: string): Observable<BillToCodeList[]> {
    const url = `/${sectionId}/billtocodes?effectiveDate=${effectiveDate}&expirationDate=${expirationDate}`;
    const billToUrl = `${this.endpoints.additionalInformation.getBillToCode}${url}`;
    return this.http.get<BillToCodeList[]>(billToUrl);
  }
  getCarriers(reqParam: any): Observable<any> {
    const carrierDetailsUrl = this.endpoints.mileage.getCarrierList;
    return this.http.post<any>(carrierDetailsUrl, reqParam);
  }
  getMileagePreferences(customerAgreementId: string): Observable<any> {
    const url = `/${customerAgreementId}/mileagepreferences`;
    const mileageUrl = `${this.endpoints.additionalInformation.getMileagePreferences}${url}`;
    return this.http.get<any>(mileageUrl);
  }
  getWeightUnits(): Observable<any> {
    const weightUnitUrl = this.endpoints.additionalInformation.getWeightUnit;
    return this.http.get<any>(weightUnitUrl);
  }
  getPriorityNumber(lineHaulId: number): Observable<any> {
    const url = `/priority?linehaulID=${lineHaulId}`;
    const priorityUrl = `${this.endpoints.additionalInformation.getPriorityNumber}${url}`;
    return this.http.get<any>(priorityUrl);
  }
  saveAdditionalInfo(reqPayload, lineHaulId: number, duplicateCheck: string, draftCheck: string): Observable<any> {
    const url = `/${lineHaulId}/additionalinfo?isDuplicateCheck=${duplicateCheck}&isDraft=${draftCheck}`;
    const saveUrl = `${this.endpoints.additionalInformation.saveInformation}${url}`;
    return this.http.put<any>(saveUrl, reqPayload);
  }
  saveDraftInfo(draft: string): Observable<string> {
    const url = `?status=${draft}`;
    const saveUrl = `${this.endpoints.additionalInformation.saveDraftInformation}${url}`;
    return this.http.patch<string>(saveUrl, {});
  }
}
