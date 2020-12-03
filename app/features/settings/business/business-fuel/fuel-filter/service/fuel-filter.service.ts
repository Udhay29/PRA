import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../../../../config/app.config';
import { ElasticRootObject } from '../model/fuel-filter.interface';
import { FilterConfigModel } from '../model/filter-config.model';
import { FuelFilterQuery } from '../query/fuel-filter.query';
import { FilterUtilityService } from './filter-utility.service';

@Injectable({
  providedIn: 'root'
})
export class FuelFilterService {
  endpoints: object;

  constructor(private readonly http: HttpClient,
    private readonly utilityService: FilterUtilityService) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }
  getFilterValues(query: object): Observable<ElasticRootObject> {
    return this.http.post<ElasticRootObject>(this.endpoints['fuel']['getFuelFilterValues'], query);
  }
  getFilterConfig(parentRef): FilterConfigModel {
    return {
      sourceData: {
        title: 'Source',
        url: this.endpoints['fuel']['getFuelFilterValues'],
        query: FuelFilterQuery.getListingFilterFieldsQuery('fuelPriceSourceTypeName', true),
        callback: parentRef.sourceFramer,
        inputFlag: true
      },
      regionData: {
        title: 'Region',
        url: this.endpoints['fuel']['getFuelFilterValues'],
        query: FuelFilterQuery.getListingFilterFieldsQuery('fuelRegionName', true),
        callback: parentRef.regionFramer,
        inputFlag: true
      },
      basisData: {
        title: 'Basis',
        url: this.endpoints['fuel']['getFuelFilterValues'],
        query: FuelFilterQuery.getListingFilterFieldsQuery('unitOfVolumeMeasurementCode', true),
        callback: this.utilityService.basisFramer,
        inputFlag: true
      },
      currencyData: {
        title: 'Currency',
        url: this.endpoints['fuel']['getFuelFilterValues'],
        query: FuelFilterQuery.getListingFilterFieldsQuery('currencyCode', true),
        callback: this.utilityService.currencyFramer,
        inputFlag: true
      },
      countryData: {
        title: 'Country',
        url: this.endpoints['fuel']['getFuelFilterValues'],
        query: FuelFilterQuery.getListingFilterFieldsQuery('pricingCountryCode', false),
        callback: this.utilityService.countryFramer
      },
      fuelTypeData: {
        title: 'Fuel Type',
        url: this.endpoints['fuel']['getFuelFilterValues'],
        query: FuelFilterQuery.getListingFilterFieldsQuery('fuelTypeName', true),
        callback: this.utilityService.fuelTypeFramer,
        inputFlag: true
      },
      createdByData: {
        title: 'Created By',
        url: this.endpoints['fuel']['getFuelFilterValues'],
        query: FuelFilterQuery.getListingFilterFieldsQuery('createUserID', false),
        callback: this.utilityService.createdByFramer
      },
      createdProgramData: {
        title: 'Create Program',
        url: this.endpoints['fuel']['getFuelFilterValues'],
        query: FuelFilterQuery.getListingFilterFieldsQuery('createProgramName', false),
        callback: this.utilityService.createdProgramFramer
      },
      updatedByData: {
        title: 'Updated By',
        url: this.endpoints['fuel']['getFuelFilterValues'],
        query: FuelFilterQuery.getListingFilterFieldsQuery('lastUpdateUserID', false),
        callback: this.utilityService.updatedByFramer
      },
      updatedProgramData: {
        title: 'Updated Program',
        url: this.endpoints['fuel']['getFuelFilterValues'],
        query: FuelFilterQuery.getListingFilterFieldsQuery('lastUpdateProgramName', false),
        callback: this.utilityService.updatedProgramFramer
      }
    };
  }
}
