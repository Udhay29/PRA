
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from '../../../../../../app.module';
import { StandardModule } from '../../../../standard.module';
import { CreateStandardDocumentationService } from './create-standard-documentation.service';
import { configureTestSuite } from 'ng-bullet';


describe('CreateStandardDocumentationService', () => {
  let service: CreateStandardDocumentationService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      providers: [CreateStandardDocumentationService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(CreateStandardDocumentationService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([CreateStandardDocumentationService], () => {
    expect(service).toBeTruthy();
  }));
  it('getQuantityType should call get', () =>  {
    service.getDocumentationType();
  });
  it('getQuantityType should call post', () =>  {
    service.postDocumentationData({});
  });
  it('getQuantityType should call post', () =>  {
    service.postRateData({});
  });
  it('getQuantityType should call get', () =>  {
    service.getAttachmentType();
  });
  it('getQuantityType should call get', () =>  {
    service.getChargeTypes();
  });
  it('getQuantityType should call get', () =>  {
    service.getCurrencyCodes();
  });
  it('getQuantityType should call delete', () =>  {
    service.deleteUploadedFiles({});
  });
  it('getQuantityType should call post', () =>  {
    service.postFileDetails({}, {});
  });
});
