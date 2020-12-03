import { Injectable } from '@angular/core';
import * as utils from 'lodash';

import { ElasticRootObject } from '../model/fuel-filter.interface';
import { FuelFilterModel } from '../model/fuel-filter.model';
@Injectable({
  providedIn: 'root'
})
export class FilterUtilityService {
  constructor() {
  }
  static filterModel: FuelFilterModel;
  static dataFramer(key: string, data: ElasticRootObject) {
    let dataArray = [];
    if (data && data['hits']['hits']) {
      const dataValues = data['hits']['hits'];
      dataValues.forEach(element => {
        dataArray.push({
          label: element['_source'][key],
          value: element['_source'][key]
        });
      });
    }
    dataArray = utils.uniqBy(dataArray, 'value');
    return dataArray;
  }

  currencyFramer(data: ElasticRootObject) {
    return FilterUtilityService.dataFramer('currencyCode', data);
  }
  basisFramer(data: ElasticRootObject) {
    return FilterUtilityService.dataFramer('unitOfVolumeMeasurementCode', data);
  }
  countryFramer(data: ElasticRootObject) {
    return FilterUtilityService.dataFramer('pricingCountryCode', data);
  }
  fuelTypeFramer(data: ElasticRootObject) {
    return FilterUtilityService.dataFramer('fuelTypeName', data);
  }
  createdByFramer(data: ElasticRootObject) {
    return FilterUtilityService.dataFramer('createUserID', data);
  }
  createdProgramFramer(data: ElasticRootObject) {
    return FilterUtilityService.dataFramer('createProgramName', data);
  }
  updatedByFramer(data: ElasticRootObject) {
    return FilterUtilityService.dataFramer('lastUpdateUserID', data);
  }
  updatedProgramFramer(data: ElasticRootObject) {
    return FilterUtilityService.dataFramer('lastUpdateProgramName', data);
  }
}
