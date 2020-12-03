import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';

import { ViewAgreementDetailsModule } from './../../../../view-agreement-details/view-agreement-details.module';

import { DetailedViewService } from './detailed-view.service';

describe('DetailedViewService', () => {

  let service: DetailedViewService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [DetailedViewService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(DetailedViewService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([DetailedViewService], () => {
    expect(service).toBeTruthy();
  }));

  it('should be getLineHaulOverView', () => {
    service.getLineHaulOverView(12, '2019-06-03');
  });

  it('should be getLaneDetailsInformation', () => {
    service.getLaneDetailsInformation();
  });

  it('should be inactivateLineHauls', () => {
    service.inactivateLineHauls('12', '2019-06-03');
  });
});
