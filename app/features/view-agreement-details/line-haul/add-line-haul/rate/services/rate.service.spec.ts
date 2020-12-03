import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../../../view-agreement-details/view-agreement-details.module';
import { RateService } from './rate.service';

describe('RateService', () => {
  let service: RateService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [RateService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(RateService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([RateService], () => {
    expect(service).toBeTruthy();
  }));

  it('should be getRateTypes', () => {
    service.getRateTypes();
  });

  it('should be getGroupRateTypes', () => {
    service.getGroupRateTypes();
  });

  it('should be getCurrencyCodes', () => {
    service.getCurrencyCodes();
  });

  it('should be getCurrencyCodeBasedOnSection', () => {
    service.getCurrencyCodeBasedOnSection(12);
  });

  it('should be thousandSeperator', () => {
    service.thousandSeperator('12,000');
  });
});
