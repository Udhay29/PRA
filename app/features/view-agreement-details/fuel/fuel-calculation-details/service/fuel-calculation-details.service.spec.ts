import { TestBed, inject } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { FuelCalculationDetailsService } from './fuel-calculation-details.service';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FuelCalculationDetailsService', () => {
  let service: FuelCalculationDetailsService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [FuelCalculationDetailsService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  beforeEach(() => {
    service = TestBed.get(FuelCalculationDetailsService);
    http = TestBed.get(HttpClient);
  });

  it('should be getFuelConfigurations', () => {
    service.getFuelConfigurations();
  });

  it('should be getCurrencyList', () => {
    service.getCurrencyList(1234);
  });
  it('should be saveCalculationDetails', () => {
    service.saveCalculationDetails({}, 12);
  });
  it('should be getChargeTypeList', () => {
    service.getChargeTypeList('test', 1234, 1234);
  });

  it('should be getLengthMeasurement', () => {
    service.getLengthMeasurement();
  });

  it('should be getVolumeMeasurement', () => {
    service.getVolumeMeasurement();
  });

  it('should be getCurrencyDetails', () => {
    service.getCurrencyDetails(1234, 123);
  });

  it('should be getCurrencyDropdown', () => {
    service.getCurrencyDropdown();
  });
  it('should be getUploadDataTable', () => {
    const reqparam = {};
    service.getUploadDataTable(reqparam);
  });
  it('should be created', inject([FuelCalculationDetailsService], () => {
    expect(service).toBeTruthy();
  }));
});
