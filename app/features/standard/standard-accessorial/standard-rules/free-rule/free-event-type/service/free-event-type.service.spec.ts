import { StandardModule } from './../../../../../standard.module';

import { FreeEventTypeService } from './free-event-type.service';
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

describe('FreeEventTypeService', () => {
  let service: FreeEventTypeService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      providers: [FreeEventTypeService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(FreeEventTypeService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([FreeEventTypeService], () => {
    expect(service).toBeTruthy();
  }));
});
