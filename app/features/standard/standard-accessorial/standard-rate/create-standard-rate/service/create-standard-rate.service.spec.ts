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
import { StandardModule } from './../../../../standard.module';
import { CreateStandardRateService } from './create-standard-rate.service';



describe('CreateDocumentationUtilsService', () => {
  let service: CreateStandardRateService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      providers: [CreateStandardRateService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(CreateStandardRateService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([CreateStandardRateService], () => {
    expect(service).toBeTruthy();
  }));
  it('getQuantityType should call get', () =>  {
    service.getQuantityType();
  });
  it('getRatesDocumentation should call get', () =>  {
    service.getRatesDocumentation({}, '1');
  });
  it('postRateData should call get', () =>  {
    service.postRateData({});
  });
});
