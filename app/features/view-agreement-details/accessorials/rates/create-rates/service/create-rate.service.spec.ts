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

import { ViewAgreementDetailsModule } from './../../../../../view-agreement-details/view-agreement-details.module';
import { CreateRateService } from './create-rate.service';



describe('CreateDocumentationUtilsService', () => {
  let service: CreateRateService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [CreateRateService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(CreateRateService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([CreateRateService], () => {
    expect(service).toBeTruthy();
  }));

  it('should cal getQuantityType', () => {
    service.getQuantityType();
  });

  it('should cal getRatesDocumentation', () => {
    service.getRatesDocumentation({}, '');
  });

  it('should cal getBUbasedOnChargeType', () => {
    service.getBUbasedOnChargeType(1);
  });

  it('should cal getCurrencyCodes', () => {
    service.getCurrencyCodes();
  });

  it('should cal getChargeTypes', () => {
    service.getChargeTypes();
  });

  it('should cal getAgreementCurrency', () => {
    service.getAgreementCurrency('');
  });

  it('should cal getSuperUserBackDate', () => {
    service.getSuperUserBackDate();
  });

  it('should cal getSuperFutureBackDate', () => {
    service.getSuperFutureBackDate();
  });

  it('should cal getCheckBoxData', () => {
    service.getCheckBoxData();
  });
});
