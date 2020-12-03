import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from '../../../../../../app.module';
import { configureTestSuite } from 'ng-bullet';

import { ViewAgreementDetailsModule } from './../../../../../view-agreement-details/view-agreement-details.module';

import { CreateDocumentationService } from './create-documentation.service';

describe('CreateDocumentationService', () => {
  let service: CreateDocumentationService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [CreateDocumentationService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(CreateDocumentationService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([CreateDocumentationService], () => {
    expect(service).toBeTruthy();
  }));

  it('postDocumentationData should call post', () =>  {
    spyOn(http, 'post').and.returnValue('called post');
    service.postDocumentationData({}, '169');
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('postRateData should call post', () =>  {
    spyOn(http, 'post').and.returnValue('called post');
    service.postRateData({}, '169');
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('getChargeTypes should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getChargeTypes();
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getCurrencyCodes should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getCurrencyCodes();
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('postFileDetails should call post', () =>  {
    spyOn(http, 'post').and.returnValue('called post');
    service.postFileDetails({}, '169', {});
  });
  it('patchRateData should call put', () =>  {
    spyOn(http, 'put').and.returnValue('called put');
    service.patchRateData({}, '169', 1);
  });
  it('deleteUploadedFiles should call put', () =>  {
    spyOn(http, 'put').and.returnValue('called put');
    service.deleteUploadedFiles({});
  });
  it('getSuperUserBack/FutureDate should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getSuperUserBackDate();
    service.getSuperFutureBackDate();
  });
});
