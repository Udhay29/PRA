import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from './../../../../../../../app.module';
import { StandardModule } from './../../../../../standard.module';
import { AddRatesService } from './add-rates.service';


describe('CreateDocumentationUtilsService', () => {
  let service: AddRatesService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      providers: [AddRatesService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeAll(() => {
    service = TestBed.get(AddRatesService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([AddRatesService], () => {
    expect(service).toBeTruthy();
  }));
});
