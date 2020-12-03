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
import { CreateLineHaulService } from './create-line-haul.service';

describe('CreateLineHaulService', () => {

  let service: CreateLineHaulService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [CreateLineHaulService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(CreateLineHaulService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([CreateLineHaulService], () => {
    expect(service).toBeTruthy();
  }));

  it('should be onSaveManualDetails', () => {
    service.onSaveManualDetails(12, '2019-06-03', '2019-06-03');
  });

  it('should be getSourceDetails', () => {
    service.getSourceDetails();
  });

  xit('should be lineHaulDraftSave', () => {
    const data = [1, 2, 3];
    service.lineHaulDraftSave(data);
  });

  it('should be deleteLineHaulRecords', () => {
    const data = [1, 2, 3];
    service.deleteLineHaulRecords(data);
  });

  it('should be getLineHaulOverView', () => {
    service.getLineHaulOverView(12, '2019-06-03');
  });
});
