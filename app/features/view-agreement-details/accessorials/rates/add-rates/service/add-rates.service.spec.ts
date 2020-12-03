import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { AppModule } from '../../../../../../app.module';
import { configureTestSuite } from 'ng-bullet';

import { ViewAgreementDetailsModule } from './../../../../../view-agreement-details/view-agreement-details.module';
import { AddRatesService } from './add-rates.service';


describe('CreateDocumentationUtilsService', () => {
  let service: AddRatesService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [AddRatesService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(AddRatesService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([AddRatesService], () => {
    expect(service).toBeTruthy();
  }));
});
