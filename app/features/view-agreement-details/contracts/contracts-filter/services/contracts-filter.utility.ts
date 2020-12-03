import { Injectable } from '@angular/core';
import * as utils from 'lodash';

import { ChangeDetectorRef } from '@angular/core';
import { isArray } from 'util';
import { MenuItem } from 'primeng/api';
import { ContractsFilterModel } from '../model/contracts-filter.model';
import { Menu } from 'primeng/menu';
import { HitsItem, RootObject, ContractTypes, ContractTypesItem } from '../model/contracts-filter.interface';

@Injectable({
  providedIn: 'root'
})
export class ContractFilterUtility {
  constructor() { }
  static filterModel: ContractsFilterModel;
  static contractDataFramer(data: RootObject): Array<MenuItem> {
    const contactDataArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      utils.forEach(data['hits']['hits'], (contractData: HitsItem) => {
        if (contractData && contractData['_source'] && contractData['_source']['ContractRanges']
          && contractData['_source']['ContractRanges'][0]) {
          contactDataArray.push({
            label: contractData['_source']['ContractRanges'][0]['ContractName'],
            value: contractData['_source']['ContractRanges'][0]['ContractName']
          });
        }
      });
    }
    return contactDataArray;
  }
  static contractTypeDataFramer(data: ContractTypes): Array<MenuItem> {
    const contractList = [];
    if (data && data['_embedded'] && data['_embedded']['contractTypes']) {
      utils.forEach(data['_embedded']['contractTypes'], (value: ContractTypesItem) => {
        contractList.push({
          label: value['contractTypeName'],
          value: value['contractTypeName']
        });
      });
    }
    return contractList;
  }
  static contractIdDataFramer(data: RootObject): Array<MenuItem> {
    const contactIdDataArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      utils.forEach(data['hits']['hits'], (contractId: HitsItem) => {
        if (contractId && contractId['_source'] && contractId['_source']['ContractRanges']
          && contractId['_source']['ContractRanges'][0]) {
          contactIdDataArray.push({
            label: contractId['_source']['ContractRanges'][0]['ContractNumber'],
            value: contractId['_source']['ContractRanges'][0]['ContractNumber']
          });
        }
      });
    }
    return contactIdDataArray;
  }
  static createdProgramFramer(data: RootObject): Array<MenuItem> {
    const lastUpdateDataArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      utils.forEach(data['hits']['hits'], (lastUpdate: HitsItem) => {
        if (lastUpdate && lastUpdate['_source'] && lastUpdate['_source']['ContractRanges']
          && lastUpdate['_source']['ContractRanges'][0]) {
          lastUpdateDataArray.push({
            label: lastUpdate['_source']['ContractRanges'][0]['CreateProgram'],
            value: lastUpdate['_source']['ContractRanges'][0]['CreateProgram']
          });
        }
      });
    }
    return lastUpdateDataArray;
  }
  static lastUpdateProgramFramer(data: RootObject): Array<MenuItem> {
    const lastUpdateDataArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      utils.forEach(data['hits']['hits'], (lastUpdate: HitsItem) => {
        if (lastUpdate && lastUpdate['_source'] && lastUpdate['_source']['ContractRanges']
          && lastUpdate['_source']['ContractRanges'][0]) {
          lastUpdateDataArray.push({
            label: lastUpdate['_source']['ContractRanges'][0]['LastUpdateProgram'],
            value: lastUpdate['_source']['ContractRanges'][0]['LastUpdateProgram']
          });
        }
      });
    }
    return lastUpdateDataArray;
  }
  static LastUpdateUserFramer(data: RootObject): Array<MenuItem> {
    const lastUpdateDataArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      utils.forEach(data['hits']['hits'], (lastUpdate: HitsItem) => {
        if (lastUpdate && lastUpdate['_source'] && lastUpdate['_source']['ContractRanges']
          && lastUpdate['_source']['ContractRanges'][0]) {
          lastUpdateDataArray.push({
            label: lastUpdate['_source']['ContractRanges'][0]['LastUpdateUser'],
            value: lastUpdate['_source']['ContractRanges'][0]['LastUpdateUser']
          });
        }
      });
    }
    return lastUpdateDataArray;
  }
  static createdUserFramer(data: RootObject): Array<MenuItem> {
    const lastUpdateDataArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      utils.forEach(data['hits']['hits'], (lastUpdate: HitsItem) => {
        if (lastUpdate && lastUpdate['_source'] && lastUpdate['_source']['ContractRanges']
          && lastUpdate['_source']['ContractRanges'][0]) {
          lastUpdateDataArray.push({
            label: lastUpdate['_source']['ContractRanges'][0]['CreateUser'],
            value: lastUpdate['_source']['ContractRanges'][0]['CreateUser']
          });
        }
      });
    }
    return lastUpdateDataArray;
  }
  static createProgramFramer(data: RootObject): Array<MenuItem> {
    const createdDataArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      utils.forEach(data['hits']['hits'], (createdBy: HitsItem) => {
        if (createdBy && createdBy['_source'] && createdBy['_source']['ContractRanges']
          && createdBy['_source']['ContractRanges'][0]) {
          createdDataArray.push({
            label: createdBy['_source']['ContractRanges'][0]['CreateProgram'],
            value: createdBy['_source']['ContractRanges'][0]['CreateProgram']
          });
        }
      });
    }
    return createdDataArray;
  }
  static LastUpdateFramer(data: RootObject): Array<MenuItem> {
    const LastUpdateUserDataArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      utils.forEach(data['hits']['hits'], (lastUpdate: HitsItem) => {
        if (lastUpdate && lastUpdate['_source'] && lastUpdate['_source']['ContractRanges']
          && lastUpdate['_source']['ContractRanges'][0]) {
          LastUpdateUserDataArray.push({
            label: lastUpdate['_source']['ContractRanges'][0]['LastUpdateUser'],
            value: lastUpdate['_source']['ContractRanges'][0]['LastUpdateUser']
          });
        }
      });
    }
    return LastUpdateUserDataArray;
  }
}
