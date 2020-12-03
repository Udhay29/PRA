import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from '../../../../../../config/app.config';
import { ContractsFilterModel } from './../model/contracts-filter.model';
import { ContractsFilterQuery } from '../query/contracts-filter.query';
import { ContractsFilterConfigModel } from './../model/contracts-filter-config';
import { ContractFilterUtility } from '../services/contracts-filter.utility';

@Injectable({
  providedIn: 'root'
})
export class ContractsFilterService {
  endpoints: any;
  constructor(private readonly http: HttpClient) {
    const appConfig: any = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getFilterConfig(filterModel: ContractsFilterModel, parentRef: any): ContractsFilterConfigModel {
    return {
      contractType: {
        title: 'Contract Type',
        url: this.endpoints['createAgreement'].getContractType,
        callback: ContractFilterUtility.contractTypeDataFramer,
        inputFlag: false
      },
      contractIdentifier: {
        title: 'Contract Identifier',
        url: this.endpoints['searchAgreement'].getSearchData,
        query: ContractsFilterQuery.getContractNameQuery('ContractNumber', filterModel.agreementID),
        callback: ContractFilterUtility.contractIdDataFramer
      },
      contractDescriptionData: {
        title: 'Contract Description',
        url: this.endpoints['searchAgreement'].getSearchData,
        query: ContractsFilterQuery.getContractNameQuery('ContractName', filterModel.agreementID),
        callback: ContractFilterUtility.contractDataFramer
      },
      statusData: {
        title: 'Status',
        url: `${this.endpoints['advanceSearch'].getStatus}?entityType=customerAgreementContract`,
        callback: parentRef.statusFramer,
        inputFlag: false,
        isStatus: true
      },
      updatedBy: {
        title: 'Updated By',
        url: this.endpoints['searchAgreement'].getSearchData,
        query: ContractsFilterQuery.getListData('LastUpdateUser', filterModel.agreementID),
        callback: ContractFilterUtility.LastUpdateUserFramer,
        inputFlag: true
      },
      updateProgram: {
        title: 'Created Program',
        url: this.endpoints['searchAgreement'].getSearchData,
        query: ContractsFilterQuery.getListData('CreateProgram', filterModel.agreementID),
        callback: ContractFilterUtility.createdProgramFramer,
        inputFlag: false
      },
      lastUpdateProgram: {
        title: 'Last Update Program',
        url: this.endpoints['searchAgreement'].getSearchData,
        query: ContractsFilterQuery.getListData('LastUpdateProgram', filterModel.agreementID),
        callback: ContractFilterUtility.lastUpdateProgramFramer,
        inputFlag: false
      },
      createdBy: {
        title: 'Created By',
        url: this.endpoints['searchAgreement'].getSearchData,
        query: ContractsFilterQuery.getListData('CreateUser', filterModel.agreementID),
        callback: ContractFilterUtility.createdUserFramer,
        inputFlag: true
      }
    };
  }
}
