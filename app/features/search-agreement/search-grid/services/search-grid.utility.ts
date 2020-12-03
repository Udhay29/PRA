import { Injectable } from '@angular/core';
import * as utils from 'lodash';

import { SearchGridModel } from '../model/search-grid.model';
import { ChangeDetectorRef } from '@angular/core';
import { isArray } from 'util';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SearchGridUtility {
  constructor() { }
  static populateData(searchGridModel: SearchGridModel, response: Object, changeDetector: ChangeDetectorRef) {
    searchGridModel.isPaginatorFlag =  false;
    (response && response['carrierFlag']) ? this.formatCarrierData(searchGridModel, response, changeDetector) :
     this.formatAgreementData(searchGridModel, response, changeDetector);
  }
  static formatAgreementData(searchGridModel: SearchGridModel, response: Object, changeDetector: ChangeDetectorRef) {
    if (response && response['aggregations'] && response['aggregations']['count'] &&
    response['hits'] && response['hits']['hits']) {
      searchGridModel.searchGridDataLength = response['aggregations']['count']['value'];
      response['hits']['hits'] = this.formatList(response);
      searchGridModel.gridData = response['hits']['hits'];
      searchGridModel.isPaginatorFlag =  (searchGridModel.searchGridDataLength > 0);
      searchGridModel.isResultsFound = !(searchGridModel.searchGridDataLength > 0);
      searchGridModel.isDefaultText = false;
      searchGridModel.isCarrierFlag = response['carrierFlag'];
      searchGridModel.advanceSearchFormValue = response['errorMsg'];
      changeDetector.detectChanges();
    }
  }
  static formatCarrierData(searchGridModel: SearchGridModel, response: Object, changeDetector: ChangeDetectorRef) {
    if (response && response['hits']['hits']) {
      searchGridModel.searchGridDataLength = response['hits']['total'];
      response['hits']['hits'] = this.formatList(response);
      searchGridModel.gridData = response['hits']['hits'];
      searchGridModel.isPaginatorFlag = (searchGridModel.searchGridDataLength > 0);
      searchGridModel.isResultsFound = !(searchGridModel.searchGridDataLength > 0);
      searchGridModel.isDefaultText = false;
      searchGridModel.advanceSearchFormValue = response['errorMsg'];
      searchGridModel.isCarrierFlag = response['carrierFlag'];
      changeDetector.detectChanges();
    }
  }
  static formatList(response: object): Array<object> {
    const elasticData = [];
    utils.forEach(response['hits']['hits'], (currentObj: Object) => {
      if (currentObj) {
      if (response['carrierFlag']) {
        currentObj['_source']['AgreementType'] = currentObj['_source']['agreementType'];
        currentObj['_source']['AgreementName'] = currentObj['_source']['carrierAgreementName'];
        currentObj['_source']['AgreementStatus'] = currentObj['fields']['Status'][0];
        elasticData.push(currentObj);
      } else {
        currentObj['_source']['AgreementStatus'] = (!this.isActive(currentObj['_source']['AgreementExpirationDate']) ||
        currentObj['_source']['AgreementInvalidIndicator'] === 'Y') ? 'InActive' : 'Active';
        elasticData.push(currentObj);
      }
      }
    });
    return elasticData;
  }
  static isActive(expirationDate: string): boolean {
    const currentDateValue = moment().format('YYYY-MM-DD');
    const expirationDateValue = moment(expirationDate).format('YYYY-MM-DD');
    if (currentDateValue <= expirationDateValue) {
      return true;
    }
    return false;
  }
}
