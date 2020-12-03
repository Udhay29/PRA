import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { SettingsModule } from '../../../settings.module';
import { AppModule } from '../../../../../app.module';
import { ValuesService } from './values.service';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('ValuesService', () => {
  let service: ValuesService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [ValuesService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(ValuesService);
    http = TestBed.get(HttpClient);
  });
  it('should be created', inject([ValuesService], () => {
    expect(service).toBeTruthy();
  }));
  it('getChargeTypeValues should call get', () => {
    service.getChargeTypeValues();
  });
  it('getApplicationLevelTypes should call get', () => {
    const url = '${this.baseUrl.chargeCode.getApplicationLevelTypeValues}/chargeapplicationleveltypes?activeBy=${currentDate}';
    service.getApplicationLevelTypes();
  });
  it('saveChargeCodeConfigurables should call put', () => {
    const data = {
      'chargeUsageTypes': [{
        'chargeUsageTypeName': 'lhlh',
        'chargeUsageTypeID': 68,
        '_links': {
          'self': {
            'href': 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/chargeusagetypes/68'
          },
          'chargeUsageType': {
            'href': 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/chargeusagetypes/68{?projection}',
            'templated': true
          }
        }
      }],
      'chargeApplicationLevelTypes': [{
        'chargeApplicationLevelTypeName': 'Order',
        'chargeApplicationLevelTypeID': 1,
        '_links': {
          'self': {
            'href': 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/chargeapplicationleveltypes/1'
          },
          'chargeApplicationLevelType': {
            'href': 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/chargeapplicationleveltypes/1{?projection}',
            'templated': true
          }
        }
      }]
    };
    const url = service.baseUrl.chargeCode.saveChargeCodeConfigurables;
    service.saveChargeCodeConfigurables(data);
  });
});
