import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../app.module';
import { SettingsModule } from '../../../../settings.module';
import { FuelPriceService } from './fuel-price.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FuelPriceService', () => {
  let service: FuelPriceService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, FuelPriceService],
    });
  });

  beforeEach(() => {
    service = TestBed.get(FuelPriceService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be call getFuelPriceList', async () => {
    const query = {
      'from': 0, 'size': 25, 'query': {
        'bool': {
          'must': [{
            'query_string': {
              'default_field':
                'invalidIndicator.keyword', 'query': 'N'
            }
          }, {
            'query_string': {
              'default_field': 'fuelPriceSourceTypeName.keyword',
              'query': 'DOE'
            }
          }, { 'query_string': { 'default_field': 'fuelRegionName.keyword', 'query': 'National' } }, {
            'query_string': { 'default_field': 'fuelPriceAmount.keyword', 'query': '*' }
          }, {
            'query_string': {
              'default_field': 'unitOfVolumeMeasurementCode.keyword', 'query': '*'
            }
          }, { 'query_string': { 'default_field': 'currencyCode.keyword', 'query': '*' } }, {
            'query_string': {
              'default_field': 'fuelTypeName.keyword', 'query': '*'
            }
          }, {
            'range': {
              'effectiveDate': {
                'gte': 'now-1y',
                'lte': 'now'
              }
            }
          }, { 'range': { 'expirationDate': { 'gte': '1901-01-01', 'lte': '2099-12-31' } } }, {
            'query_string': { 'default_field': 'createProgramName.keyword', 'query': '*' }
          }, {
            'query_string': {
              'default_field': 'createTimestamp.keyword', 'query': '*'
            }
          }, { 'query_string': { 'default_field': 'createUserID.keyword', 'query': '**' } }, {
            'query_string': {
              'default_field': 'lastUpdateProgramName.keyword', 'query': '**'
            }
          }, {
            'query_string': {
              'default_field':
                'pricingCountryCode.keyword', 'query': '*'
            }
          }, { 'query_string': { 'default_field': 'lastUpdateTimestamp.keyword', 'query': '*' } }, {
            'query_string': {
              'default_field': 'lastUpdateUserID.keyword', 'query': '*'
            }
          }]
        }
      }, 'sort': { 'effectiveDate.keyword': { 'order': 'desc' } }
    };
    service.getFuelPriceList(query);
  });
});
