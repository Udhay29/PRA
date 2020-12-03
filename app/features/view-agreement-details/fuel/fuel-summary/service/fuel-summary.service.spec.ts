import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from './../../../view-agreement-details.module';
import { FuelSummaryService } from './fuel-summary.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FuelSummaryService', () => {
  let service: FuelSummaryService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [FuelSummaryService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  beforeEach(() => {
    service = TestBed.get(FuelSummaryService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([FuelSummaryService], () => {
    expect(service).toBeTruthy();
  }));

  it('getBusinessUnitServiceOffering should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getBusinessUnitServiceOffering();
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getAffiliation should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getAffiliation();
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('fuelSummarySave should call post', () =>  {
    spyOn(http, 'post').and.returnValue('called post');
    service.fuelSummarySave({});
    expect(http.post).toHaveBeenCalledTimes(1);
  });
  it('getBillToLists should call post', () => {
    spyOn(http, 'post').and.returnValue('called post');
    service.getBillToLists(12, {});
    expect(http.post).toHaveBeenCalledTimes(1);
  });
});
