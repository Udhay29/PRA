import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from '../../../../../../config/app.config';
import { SectionsFilterModel } from './../model/sections-filter.model';
import { SectionsFilterConfigModel } from './../model/sections-filter-config';
import { SectionFilterUtility } from './sections-filter.utility';
import { Observable } from 'rxjs';
import { SectionsService } from '../../service/sections.service';
import { SectionsFilterQuery } from '../query/sections-filter.query';
@Injectable()
export class SectionsFilterService {
  endpoints: object;
  constructor(private readonly http: HttpClient,
    private readonly sectionFilterUtility: SectionFilterUtility) {
    const appConfig: any = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getBUSOList(requestParam: object): Observable<object> {
    return this.http.post<object>(this.endpoints['advanceSearch'].getAgreementName, requestParam);
  }
  getFilterConfig(parentScope): SectionsFilterConfigModel {
    return {
      sectionNameType: {
        title: 'Section Name',
        url: this.endpoints['advanceSearch'].getAgreementName,
        query: SectionsFilterQuery.getSectionNameQuery(parentScope.filterModel.agreementID),
        callback: this.sectionFilterUtility.sectionDataFramer,
        inputFlag: true,
        expanded: true
      },
      currency: {
        title: 'Currency',
        url: this.endpoints['advanceSearch'].getAgreementName,
        query: SectionsFilterQuery.getCurrencyNameQuery(parentScope.filterModel.agreementID),
        callback: this.sectionFilterUtility.currencyFramer,
        inputFlag: true
      },
      contract: {
        title: 'Contract',
        url: this.endpoints['advanceSearch'].getAgreementName,
        query: SectionsFilterQuery.getContractNameQuery(parentScope.filterModel.agreementID),
        callback: this.sectionFilterUtility.contractFramer,
        inputFlag: true
      },
      billToCodes: {
        title: 'Bill to Codes',
        url: this.endpoints['advanceSearch'].getAgreementName,
        query: SectionsFilterQuery.getBillToCodesQuery(parentScope.filterModel.agreementID),
        callback: this.sectionFilterUtility.getBillToCodesFramer,
        inputFlag: true,
      },
      lastUpdateProgram: {
        title: 'Last Update Program',
        url: this.endpoints['advanceSearch'].getAgreementName,
        query: SectionsFilterQuery.getLastUpdatedProgram(parentScope.filterModel.agreementID),
        callback: this.sectionFilterUtility.getLastUpdatedProgramFramer,
        inputFlag: true,
        expanded: true
      },
      sectionType: {
        title: 'Section Type',
        url: this.endpoints['advanceSearch'].getAgreementName,
        query: SectionsFilterQuery.getSectionTypeQuery(parentScope.filterModel.agreementID),
        callback: this.sectionFilterUtility.sectionTypeFramer,
        inputFlag: false,
        expanded: true
      },
      createdProgram: {
        title: 'Created Program',
        url: this.endpoints['advanceSearch'].getAgreementName,
        query: SectionsFilterQuery.getCreatedProgram(parentScope.filterModel.agreementID),
        callback: this.sectionFilterUtility.getCreatedProgramFramer,
        inputFlag: true,
        expanded: true
      },
      createdBy: {
        title: 'Created By',
        url: this.endpoints['advanceSearch'].getAgreementName,
        query: SectionsFilterQuery.getCreatedUser(parentScope.filterModel.agreementID),
        callback: this.sectionFilterUtility.getCreatedUserFramer,
        inputFlag: true,
        expanded: true
      },
      lastUpdatedBy: {
        title: 'Updated By',
        url: this.endpoints['advanceSearch'].getAgreementName,
        query: SectionsFilterQuery.getLastUpdatedUser(parentScope.filterModel.agreementID),
        callback: this.sectionFilterUtility.getLastUpdatedUserFramer,
        inputFlag: true,
        expanded: true
      },
      status: {
        title: 'Status',
        url: `${this.endpoints['advanceSearch'].getStatus}?entityType=customerAgreementContract`,
        callback: parentScope.statusFramer,
        inputFlag: false,
        isStatus: true
      }
    };
  }
}
