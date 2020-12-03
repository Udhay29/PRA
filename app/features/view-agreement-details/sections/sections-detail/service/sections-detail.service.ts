import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SectionDetails, Section } from '../../model/sections.interface';
import { AppConfig } from '../../../../../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class SectionsDetailService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getSectionDetail(param: Section): Observable<SectionDetails> {
    const url = `${this.endpoints['viewAgreement'].getAgreementDetails}${param.AgreementID}
    /contracts/${param.ContractID}/sections/${param.SectionID}/versions/${param['SectionVersionID']}`;
    return this.http.get<SectionDetails>(url);
  }
}
