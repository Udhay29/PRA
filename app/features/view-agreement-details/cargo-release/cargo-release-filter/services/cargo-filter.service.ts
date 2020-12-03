import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from '../../../../../../config/app.config';
import { CargoFilterModel } from './../model/cargo-filter.model';
import { CargoFilterQuery } from './../query/cargo-filter.query';
import {CargoFilterUtility} from './cargo-filter.utility';
import { GeneralType} from './../model/cargo-filter.interface';
import { Observable } from 'rxjs';
import * as moment from 'moment-timezone';
@Injectable({
  providedIn: 'root'
})
export class CargoFilterService {
  endpoints: any;
  constructor(private readonly http: HttpClient,
    private readonly cargoFilterUtility: CargoFilterUtility) {
    const appConfig: any = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getFilterConfig(componentInstance: any): CargoFilterModel {
    return {
      sliderData: {
        title: 'Cargo Release',
        min: componentInstance.minValue,
        max:  componentInstance.maxValue,
        range: false,
        hideRange: true,
        default: componentInstance.maxValue
      },
      agreementData: {
        title: 'Agreement Default',
        data: [
          { label: 'Yes', value: 'Yes' },
          { label: 'No', value: 'No' }
        ]
      },
      contractData: {
        title: 'Contract',
        url: this.endpoints.cargoReleaseAgreement.getCargoReleaseValues,
        query: CargoFilterQuery.getContractQuery(componentInstance.agreementId),
        callback: this.cargoFilterUtility.contractDataFramer
      },
      sectionData: {
        title: 'Section',
        url: this.endpoints.cargoReleaseAgreement.getCargoReleaseValues,
        query: CargoFilterQuery.getSectionQuery(componentInstance.agreementId),
        callback: this.cargoFilterUtility.sectionFramer,
        inputFlag: true
      },
      businessData: {
        title: 'Business Unit',
        url: this.endpoints.cargoReleaseAgreement.businessUnit,
        query: null,
        callback: this.cargoFilterUtility.businessUnitFramer,
        inputFlag: false,
      },
      statusData: {
        title: 'Status',
        url: `${this.endpoints['advanceSearch'].getStatus}?entityType=customerRatingRule`,
        query: null,
        callback: componentInstance.statusDataFramer,
        inputFlag: false,
        isStatus: true
      },
      updatedByData: {
        title: 'Updated By',
        url: this.endpoints.cargoReleaseAgreement.getCargoReleaseValues,
        query: CargoFilterQuery.getAuditQuery(componentInstance.agreementId, 'lastUpdateUserId'),
        callback: this.cargoFilterUtility.LastUpdateUserFramer,
        inputFlag: true
      },
      createdProgramData: {
        title: 'Created Program',
        url: this.endpoints.cargoReleaseAgreement.getCargoReleaseValues,
        query: CargoFilterQuery.getAuditQuery(componentInstance.agreementId, 'createProgramName'),
        callback: this.cargoFilterUtility.createdProgramFramer,
        inputFlag: false
      },
      lastUpdateProgramData: {
        title: 'Last Update Program',
        url: this.endpoints.cargoReleaseAgreement.getCargoReleaseValues,
        query: CargoFilterQuery.getAuditQuery(componentInstance.agreementId, 'lastUpdateProgramName'),
        callback: this.cargoFilterUtility.lastUpdateProgramFramer,
        inputFlag: false
      },
      createdByData: {
        title: 'Created By',
        url: this.endpoints.cargoReleaseAgreement.getCargoReleaseValues,
        query: CargoFilterQuery.getAuditQuery(componentInstance.agreementId, 'createUserId'),
        callback: this.cargoFilterUtility.createdUserFramer,
        inputFlag: true
      }
    };
  }
  getBuConfDtoService(): Observable<GeneralType[]> {
    const url = this.endpoints.settings.configurables;
    return this.http.get<GeneralType[]>(url);
  }

  convertDateTimetoUTC(date: string) {
    return moment.tz(date, 'MM/DD/YYYY HH:mm', moment.tz.guess()).utc().format('MM/DD/YYYY HH:mm');
  }
}
