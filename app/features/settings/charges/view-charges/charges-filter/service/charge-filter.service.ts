import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from '../../../../../../../config/app.config';
import { ChargesFilterConfigModel } from '../model/charges-filter-config';
import { ChargesFilterModel } from '../model/charges-filter.model';
import { ChargesFilterUtility } from './charges-filter.utility';
import { ViewChargesQueryService } from '../../services/view-charges-query.service';
import { ViewChargesQuery } from '../../query/view-charges.query';
@Injectable({
  providedIn: 'root'
})
export class ChargesFilterService {
  endpoints: any;
  constructor(private readonly http: HttpClient) {
    const appConfig: any = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getFilterConfig(filterModel: ChargesFilterModel, parentRef: any): ChargesFilterConfigModel {
    return {
      businessUnit: {
        title: 'Business Unit',
        url: this.endpoints['chargeCode'].viewChargeCodes,
        query: ViewChargesQueryService.getElasticparam(),
        callback: ChargesFilterUtility.businessUnitFramer,
        inputFlag: true
      },
      serviceOfferings: {
          title: 'Service Offering',
          url: this.endpoints['chargeCode'].viewChargeCodes,
          query: ViewChargesQueryService.getElasticparam(),
          callback: ChargesFilterUtility.serviceOfferingFramer,
          inputFlag: true
      },
      chargeType: {
        title: 'Charge Type',
        url: this.endpoints['chargeCode'].viewChargeCodes,
        query: ViewChargesQuery.getFilterChargeTypeQuery(),
        callback: ChargesFilterUtility.chargeTypeFramer,
        inputFlag: true
      },
      quantityRequired: {
        title: 'Quantity Required',
        data: filterModel['quantityRequired']
      },
      status: {
        title: 'Status',
        url: this.endpoints['chargeCode'].viewChargeCodes,
        query: ViewChargesQuery.getFilterStatusQuery(),
        callback: parentRef.statusFramer
      },
      usageType: {
        title: 'Usage',
        url: this.endpoints['chargeCode'].viewChargeCodes,
        query: ViewChargesQueryService.getElasticparam(),
        callback: ChargesFilterUtility.usageTypeFramer,
        inputFlag: false
    },
    applicationLevel: {
      title: 'Application Level',
      data: filterModel['applicationLevel']
      },
    rateType: {
      title: 'Rate Type',
      url: this.endpoints['chargeCode'].viewChargeCodes,
      query: ViewChargesQuery.getFilterRateTypeQuery(),
      callback: ChargesFilterUtility.rateTypeFramer,
      inputFlag: true
    }
    };
  }
}
