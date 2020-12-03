import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { AppConfig } from '../../../../../../config/app.config';
import { environment } from '../../../../../../environments/environment';
import { RatingRuleFilterModel } from './../model/rating-rule-filter.model';
import { RatingRuleFilterConfig } from './../model/rating-rule-filter.config';
import { RatingRuleFilterUtilityService } from './rating-rule-filter.utility.service';
import { RatingRuleFilterQuery } from './../query/rating-rule-filter.query';


@Injectable({
  providedIn: 'root'
})
export class RatingRuleFilterService {
  endpoints: any;
  constructor(private readonly http: HttpClient, private readonly ratingRuleFilterUtility: RatingRuleFilterUtilityService) {
    const appConfig: any = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getRuleCriteria(): Observable<any> {
    return this.http.get<any>(this.endpoints['ratingRules'].getRuleCriteria);
  }
  getFilterConfig(filterModel: RatingRuleFilterModel, parentRef: any): RatingRuleFilterConfig {
    return {
      agreementDefault: {
        title: 'Agreement Default',
        data: filterModel['agreementDefaultList']
      },
      contract: {
        title: 'Contract',
        url: this.endpoints.ratingRules.getRatingRules,
        query: RatingRuleFilterQuery.getContractsQuery(parentRef['agreementID']),
        callback: this.ratingRuleFilterUtility.contractsFramer,
        inputFlag: true
      },
      section: {
        title: 'Section',
        url: this.endpoints.ratingRules.getRatingRules,
        query: RatingRuleFilterQuery.getSectionsQuery(parentRef['agreementID']),
        callback: this.ratingRuleFilterUtility.sectionsFramer,
        inputFlag: true
      },
      businessUnit: {
        title: 'Business Unit',
        url: this.endpoints.ratingRules.businessUnit,
        query: null,
        callback: this.ratingRuleFilterUtility.businessUnitFramer
      },
      serviceOfferings: {
        title: 'Service Offerings',
        url: this.endpoints.ratingRules.businessUnit,
        query: null,
        callback: this.ratingRuleFilterUtility.serviceOfferingFramer,
        inputFlag: true

      },
      hazmatChargeRule: {
        title: 'Hazmat Charge Rule',
        data: filterModel['hazmatChargeRules']
      },
      congestionCharge: {
        title: 'Congestion Charge',
        data: filterModel['congestionChargeRules']
      },
      flatRateWithStops: {
        title: 'Flat Rate With Stops',
        data: filterModel['flatRateWithStopsRules']
      },
      status: {
        title: 'Status',
        url: `${this.endpoints['ratingRules'].getStatus}?entityType=customerRatingRule`,
        callback: parentRef.statusFramer,
        isStatus: true
      }
    };
  }
}
