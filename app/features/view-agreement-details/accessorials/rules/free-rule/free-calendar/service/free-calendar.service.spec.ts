import { FreeCalendarService } from './free-calendar.service';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { ViewAgreementDetailsModule } from '../../../../../view-agreement-details.module';
import { AppModule } from '../../../../../../../app.module';

describe('FreeCalendarService', () => {
  let service: FreeCalendarService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [FreeCalendarService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(FreeCalendarService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([FreeCalendarService], () => {
    expect(service).toBeTruthy();
  }));
});
