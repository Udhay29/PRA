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

import { ViewAgreementDetailsModule } from '../../../../view-agreement-details.module';

import { FuelSummaryService } from './fuel-summary.service';

describe('FuelSummaryService', () => {

  let service: FuelSummaryService;
  let http: FuelSummaryService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [FuelSummaryService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(FuelSummaryService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([FuelSummaryService], () => {
    expect(service).toBeTruthy();
  }));
});
