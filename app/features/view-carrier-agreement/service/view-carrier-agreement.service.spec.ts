import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../app.module';
import { ViewCarrierAgreementModule } from './../view-carrier-agreement.module';
import { ViewCarrierAgreementService } from './view-carrier-agreement.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ViewAgreementDetailsService', () => {
  let service: ViewCarrierAgreementService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewCarrierAgreementModule, HttpClientTestingModule],
      providers: [ViewCarrierAgreementService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  beforeEach(() => {
    service = TestBed.get(ViewCarrierAgreementService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([ViewCarrierAgreementService], () => {
    expect(service).toBeTruthy();
  }));

  it('getAgreementDetails should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getAgreementDetails(1);
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getDetailsList should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getDetailsList();
    expect(http.get).toHaveBeenCalledTimes(1);
  });
});

