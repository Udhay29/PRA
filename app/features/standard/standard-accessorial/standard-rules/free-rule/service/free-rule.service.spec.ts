import { StandardModule } from './../../../../standard.module';
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


import { FreeRuleService } from './free-rule.service';

describe('FreeRuleService', () => {
  let service: FreeRuleService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      providers: [FreeRuleService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(FreeRuleService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([FreeRuleService], () => {
    expect(service).toBeTruthy();
  }));
});
