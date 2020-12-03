import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from './../../../../../app.module';
import { configureTestSuite } from 'ng-bullet';

import { ViewAgreementDetailsModule } from './../../../../view-agreement-details/view-agreement-details.module';
import { DocumentationService } from './documentation.service';

describe('DocumentationService', () => {
  let service: DocumentationService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [DocumentationService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(DocumentationService);
    http = TestBed.get(HttpClient);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('getDocumentList should call post', () =>  {
    DocumentationService.setElasticparam({});
  });
  it('getDocumentList should call post', () =>  {
    DocumentationService.getElasticparam();
  });
});
