import { Injectable } from '@angular/core';
import * as utils from 'lodash';
import { MenuItem } from 'primeng/api';
import { SectionsFilterModel } from '../model/sections-filter.model';
import { HitsItem, RootObject } from '../model/sections-filter.interface';

@Injectable()
export class SectionFilterUtility {
  constructor() { }
  static filterModel: SectionsFilterModel;
  static dataFramer(key: string, data: RootObject) {
    const dataArray = [];
    if (data && data['aggregations'] && data['aggregations']['nesting']['by_contractname']['contractname']) {
      utils.forEach(data['aggregations']['nesting']['by_contractname']['contractname']['buckets'], (element: HitsItem) => {
        const hitValue = element['hits']['hits']['hits'][0]['_source'][key];
        dataArray.push({
          label: hitValue,
          value: hitValue
        });
      });
    }
    return dataArray;
  }
  sectionDataFramer(data: RootObject): Array<MenuItem> {
    return SectionFilterUtility.dataFramer('SectionName', data);
  }
   sectionTypeFramer(data: RootObject): Array<MenuItem> {
    return SectionFilterUtility.dataFramer('SectionTypeName', data);
  }
   currencyFramer(data: RootObject): Array<MenuItem> {
    return SectionFilterUtility.dataFramer('SectionCurrencyCode', data);
  }
   contractFramer(data): Array<MenuItem> {
    return SectionFilterUtility.dataFramer('contractDisplayName', data);
  }
   getLastUpdatedProgramFramer(data: RootObject): Array<MenuItem> {
    return SectionFilterUtility.dataFramer('LastUpdateProgram', data);
  }
   getCreatedProgramFramer(data: RootObject): Array<MenuItem> {
    return SectionFilterUtility.dataFramer('CreateProgram', data);
  }
   getCreatedUserFramer(data: RootObject): Array<MenuItem> {
    return SectionFilterUtility.dataFramer('CreateUser', data);
  }
  getLastUpdatedUserFramer(data: RootObject): Array<MenuItem> {
    return SectionFilterUtility.dataFramer('LastUpdateUser', data);
  }
  getBillToCodesFramer(data: RootObject): Array<MenuItem> {
    const billToCodeArray = [];
    if (data && data['aggregations'] && data['aggregations']['nesting']['by_contractname']['contractname']) {
      utils.forEach(data['aggregations']['nesting']['by_contractname']['contractname']['buckets'], (billtocodeHit: HitsItem) => {
        billToCodeArray.push({
          label: billtocodeHit['key'],
          value: billtocodeHit['key']
        });
      });
    }
    return billToCodeArray;
  }
}
