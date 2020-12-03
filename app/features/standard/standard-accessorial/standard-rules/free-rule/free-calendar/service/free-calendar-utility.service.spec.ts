import { StandardModule } from './../../../../../standard.module';

import { FreeCalendarUtilityService } from './free-calendar-utility.service';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../../app.module';

describe('FreeCalendarUtilityService', () => {
  let service: FreeCalendarUtilityService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      providers: [FreeCalendarUtilityService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(FreeCalendarUtilityService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([FreeCalendarUtilityService], () => {
    expect(service).toBeTruthy();
  }));
});

