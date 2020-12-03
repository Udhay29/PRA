import { Injectable, ChangeDetectorRef } from '@angular/core';
import * as utils from 'lodash';
import { isArray } from 'util';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ChargesFilterModel } from '../model/charges-filter.model';
import { RootObject, HitsItem } from '../model/charges-filter.interface';
@Injectable({
  providedIn: 'root'
})
export class ChargesFilterUtility {
  static filterModel: ChargesFilterModel;

  static businessUnitFramer(data: RootObject): Array<MenuItem> {
    const businessUnitDataArray = [];
    if (data && data['aggregations'] && data['aggregations']['nested_bu']) {
        utils.forEach(data['aggregations']['nested_bu']['bu']['buckets'], (serviceOffering: HitsItem) => {
          businessUnitDataArray.push({
            label: serviceOffering['key'],
            value: serviceOffering['key']
          });
      });
    }
    return businessUnitDataArray;
  }

  static serviceOfferingFramer(data: RootObject): Array<MenuItem> {
    const serviceOfferingDataArray = [];
    if (data && data['aggregations'] && data['aggregations']['nested_bu']) {
        utils.forEach(data['aggregations']['nested_bu']['so']['buckets'], (serviceOffering: HitsItem) => {
          serviceOfferingDataArray.push({
            label: serviceOffering['key'],
            value: serviceOffering['key']
          });
      });
    }
    return serviceOfferingDataArray;
  }

  static chargeTypeFramer(data: RootObject): Array<MenuItem> {
    const chargeTypeDataArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      utils.forEach(data['hits']['hits'], (chargeType: HitsItem) => {
        chargeTypeDataArray.push({
          label: chargeType['_source']['ChargeTypeIdentifier'],
          value: chargeType['_source']['ChargeTypeIdentifier']
        });
    });
  }
  return chargeTypeDataArray;
  }
  static rateTypeFramer(data: RootObject): Array<MenuItem> {
    const rateTypeDataArray = [];
    if (data && data['aggregations'] && data['aggregations']['ratetypename']) {
    data['hits']['hits'].forEach(function(hits) {
      hits['inner_hits']['RateTypes']['hits']['hits'].forEach(function(innerHits) {
        if (!rateTypeDataArray.find(x => x.label === innerHits['sort']['0'])) {
          rateTypeDataArray.push({
            label: innerHits['sort']['0'],
            value: innerHits['sort']['0']
          });
        }
      });
    });

  }
  return rateTypeDataArray;
  }

  static quantityRequiredFramer(data: RootObject): Array<MenuItem> {
    const quantityRequiredDataArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      utils.forEach(data['hits']['hits'], (quantityRequired: HitsItem) => {
        quantityRequiredDataArray.push({
          label: quantityRequired['_source']['QuantityRequiredIndicator'],
          value: quantityRequired['_source']['QuantityRequiredIndicator']
        });
    });
  }
  return quantityRequiredDataArray;
  }
  static usageTypeFramer(data: RootObject): Array<MenuItem> {
    const chargeTypeDataArray = [];
    if (data && data['hits'] && data['hits']['hits']) {
      utils.forEach(data['hits']['hits'][0]['_source']['ChargeUsageTypes'], (usageType) => {
        chargeTypeDataArray.push({
          label: usageType.ChargeUsageTypeName,
          value: usageType.ChargeUsageTypeName
        });

      });
    }
    return chargeTypeDataArray;
  }
}
