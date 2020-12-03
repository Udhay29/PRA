import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { CreateAgreementModule } from './../../create-agreement.module';
import { AgreementDetailsService } from './agreement-details.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AgreementDetailsService', () => {
  let service: AgreementDetailsService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, CreateAgreementModule, HttpClientTestingModule],
      providers: [AgreementDetailsService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(AgreementDetailsService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([AgreementDetailsService], () => {
    expect(service).toBeTruthy();
  }));

  it('getAgreementType should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.getAgreementType();
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getAccountName should call post', () => {
    spyOn(http, 'post').and.returnValue('called post');
    service.getAccountName({});
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('getTeams should call post', () => {
    spyOn(http, 'post').and.returnValue('called post');
    service.getTeams({});
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('agreementCheckSave should call post', () => {
    spyOn(http, 'post').and.returnValue('called post');
    service.agreementCheckSave({});
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('getCarrierDetails should call post', () => {
    spyOn(http, 'post').and.returnValue('called post');
    service.getCarrierDetails({});
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('saveCarrier should call post', () => {
    spyOn(http, 'post').and.returnValue('called post');
    service.saveCarrier({});
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('getCarrierEffectiveDate should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.getCarrierEffectiveDate(1);
    expect(http.get).toHaveBeenCalledTimes(1);
  });
});
