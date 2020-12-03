import { ElementRef, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Data } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import { AppConfig } from '../../../../config/app.config';

import { AgreementSearchModel } from '../model/search-agreement.model';
import { ElasticResponseModel } from '../model/search-agreement.interface';

@Injectable()
export class SearchService {
  static elasticParam: object = {};
  gridReset: boolean;
  sharingData: BehaviorSubject<boolean> = new BehaviorSubject(true);
  constructor(private readonly http: HttpClient) {
  }
  appConfig: AppConfig = AppConfig.getConfig();
  baseUrl = this.appConfig['api'];
  static setElasticparam(elasticParam: object) {
    this.elasticParam = elasticParam;
  }
  static getElasticparam(): object {
    return this.elasticParam;
  }
  getResetGrid() {
    return this.sharingData.asObservable();
  }
  setResetGrid(event: any): void {
    this.gridReset = event;
    this.sharingData.next(event);
  }
  getSearchData(query: object): Observable<ElasticResponseModel> {
    return this.http.post<ElasticResponseModel>(this.baseUrl['searchAgreement'].getSearchData, query);
  }
  getCarrierSearchData(query: object): Observable<ElasticResponseModel> {
    return this.http.post<ElasticResponseModel>(this.baseUrl['advanceSearch'].getCarrierAgreementName, query);
  }
  getElasticData(query: object, searchModel: AgreementSearchModel) {
    searchModel.isShowLoader = true;
    query['carrierFlag'] ? this.getCarrierResults(query, searchModel) : this.getAgreementResults(query, searchModel);
  }
  getAgreementResults(query: object, searchModel: AgreementSearchModel) {
    this.getSearchData(query['query']).subscribe((response: ElasticResponseModel) => {
      this.responseFormat(response, searchModel, query);
    }, (error: Error) => {
      searchModel.isShowLoader = false;
    });
  }
  getCarrierResults(query: object, searchModel: AgreementSearchModel) {
    this.getCarrierSearchData(query['query']).subscribe((response: ElasticResponseModel) => {
      this.responseFormat(response, searchModel, query);
    }, (error: Error) => {
      searchModel.isShowLoader = false;
    });
  }
   responseFormat(response: ElasticResponseModel, searchModel: AgreementSearchModel, query: object) {
    response['errorMsg'] = query['errorMsg'];
      response['carrierFlag'] = query['carrierFlag'];
      searchModel.gridData = response;
      searchModel.isShowLoader = false;
  }
}
