import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { configureTestSuite } from 'ng-bullet';

import { AppConfig } from '../../../../../config/app.config';
import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { SectionsService } from './sections.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SectionsService', () => {
  let service: SectionsService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [SectionsService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  beforeEach(() => {
    service = TestBed.get(SectionsService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([SectionsService], () => {
    expect(service).toBeTruthy();
  }));

  it('getSectionType should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.getSectionType();
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getCurrency should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.getCurrency();
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getContract should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.getContract(1);
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getCreateSectionBillTo should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    const billToParam = null;
    service.getCreateSectionBillTo(1, false, billToParam);
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('sectionSave should call post', () => {
    const param = {
      agreementId: 1,
      contractId: 1
    };
    spyOn(http, 'post').and.returnValue('called post');
    service.sectionSave({}, param, true);
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('getDatesByRole should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.getDatesByRole('');
    expect(http.get).toHaveBeenCalledTimes(1);
  });
});
