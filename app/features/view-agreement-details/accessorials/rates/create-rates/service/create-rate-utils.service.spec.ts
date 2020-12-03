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
import { CreateRateUtilsService } from './create-rate-utils.service';


describe('CreateRateUtilsService', () => {
  let service: CreateRateUtilsService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [CreateRateUtilsService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(CreateRateUtilsService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([CreateRateUtilsService], () => {
    expect(service).toBeTruthy();
  }));
});
