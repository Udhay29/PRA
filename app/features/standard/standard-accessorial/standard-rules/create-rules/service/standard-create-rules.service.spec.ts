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

import { CreateRulesService } from './standard-create-rules.service';

describe('CreateRulesService', () => {
  let service: CreateRulesService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [CreateRulesService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(CreateRulesService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([CreateRulesService], () => {
    expect(service).toBeTruthy();
  }));

  it('should cal getruletype', () => {
    service.getRuleType();
  });

  it('should cal getBUbasedOnChargeType', () => {
    service.getBUbasedOnChargeType(1);
  });

  it('should cal postRuleData', () => {
    service.postRuleData('', {});
  });

  it('should cal getAverageTimeFrame', () => {
    service.getAverageTimeFrame();
  });

  it('should cal getDayOfWeek', () => {
    service.getDayOfWeek();
  });

  it('should cal getFrequencyValues', () => {
    service.getFrequencyValues();
  });

  it('should cal getFrequencySubTypeValues', () => {
    service.getFrequencySubTypeValues();
  });

  it('should cal postRuleTypeData', () => {
    service.postRuleTypeData('', {}, '');
  });

  it('should cal postFreeRule', () => {
    service.postFreeRule('', {});
  });

  it('should cal getGracePeriod', () => {
    service.getGracePeriod();
  });

  it('should cal getSuperUserBackDate', () => {
    service.getSuperUserBackDate();
  });

  it('should cal getSuperFutureBackDate', () => {
    service.getSuperFutureBackDate();
  });
});
