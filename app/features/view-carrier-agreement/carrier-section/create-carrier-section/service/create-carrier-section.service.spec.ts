/* tslint:disable:no-unused-variable */
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppModule } from '../../../../../app.module';
import { ViewCarrierAgreementModule } from '../../../view-carrier-agreement.module';
import { CreateCarrierSectionService } from './create-carrier-section.service';

describe('Service: CreateCarrierSection', () => {
  let service: CreateCarrierSectionService;
  let http: HttpClient;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewCarrierAgreementModule, HttpClientTestingModule],
      providers: [CreateCarrierSectionService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });
  beforeEach(() => {
    service = TestBed.get(CreateCarrierSectionService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([CreateCarrierSectionService], () => {
    expect(service).toBeTruthy();
  }));
  it('getCarrierSegmentTypes should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.getCarrierSegmentTypes();
    expect(http.get).toHaveBeenCalledTimes(1);
  });
  it('getBusinessUnit should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.getBusinessUnit();
    expect(http.get).toHaveBeenCalledTimes(1);
  });
  it('getAccountName should call post', () => {
    spyOn(http, 'post').and.returnValue('called post');
    service.getAccountName({});
    expect(http.post).toHaveBeenCalledTimes(1);
  });
  it('getBillToAccounts should call post without date', () => {
    const param = {
      effectiveDate: null, expirationDate: null
    };
    spyOn(http, 'post').and.returnValue('called post');
    service.getBillToAccounts(1, param);
    expect(http.post).toHaveBeenCalledTimes(1);
  });
  it('getBillToAccounts should call post with date', () => {
    const param = {
      effectiveDate: new Date(), expirationDate: new Date()
    };
    spyOn(http, 'post').and.returnValue('called post');
    service.getBillToAccounts(1, param);
    expect(http.post).toHaveBeenCalledTimes(1);
  });
  it('saveCarrierSection should call post', () => {
    spyOn(http, 'post').and.returnValue('called post');
    service.saveCarrierSection({}, 1);
    expect(http.post).toHaveBeenCalledTimes(1);
  });
});
