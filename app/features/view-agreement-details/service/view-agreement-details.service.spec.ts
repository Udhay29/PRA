import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../app.module';
import { ViewAgreementDetailsModule } from './../view-agreement-details.module';
import { ViewAgreementDetailsService } from './view-agreement-details.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ViewAgreementDetailsService', () => {
  let services: ViewAgreementDetailsService;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [ViewAgreementDetailsService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });
  beforeEach(() => {
    services = TestBed.get(ViewAgreementDetailsService);
 });
  it('should be created', inject([ViewAgreementDetailsService], (service: ViewAgreementDetailsService) => {
    expect(service).toBeTruthy();
  }));
  it('should call getAgreementDetails', () => {
    services.getAgreementDetails(12);
  });
  it('should call getDetailsList', () => {
    services.getDetailsList('customerAgreement');
  });
  it('should call getDocumentDetails', () => {
    services.getDocumentDetails(13);
  });
});
