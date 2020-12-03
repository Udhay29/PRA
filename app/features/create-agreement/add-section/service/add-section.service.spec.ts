import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { CreateAgreementModule } from './../../create-agreement.module';
import { AddSectionService } from './add-section.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddSectionService', () => {
  let service: AddSectionService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, CreateAgreementModule, HttpClientTestingModule],
      providers: [AddSectionService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  beforeEach(() => {
    service = TestBed.get(AddSectionService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([AddSectionService], () => {
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

  it('getCodes should call get', () => {
    const param = {
      agreementId: 1,
      contractId: 1,
      effectiveDate: '',
      expirationDate: '',
    };
    spyOn(http, 'get').and.returnValue('called get');
    service.getCodes(param);
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getContract should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.getContract(1);
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('sectionSave should call post', () => {
    const param = {
      agreementId: 1,
      contractId: 1,
      sectionId: null
    };
    spyOn(http, 'post').and.returnValue('called post');
    service.sectionSave({}, param);
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('sectionSave should call put', () => {
    const param = {
      agreementId: 1,
      contractId: 1,
      sectionId: 1
    };
    spyOn(http, 'put').and.returnValue('called put');
    service.sectionSave({}, param);
    expect(http.put).toHaveBeenCalledTimes(1);
  });

  it('getSectionList should call post', () => {
    spyOn(http, 'post').and.returnValue('called post');
    service.getSectionList({});
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('getAccountCode should call post', () => {
    spyOn(http, 'post').and.returnValue('called post');
    service.getAccountCode({});
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('editSection should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.editSection({});
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getDatesByRole should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.getDatesByRole('');
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getEditCodes should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.getEditCodes({});
    expect(http.get).toHaveBeenCalledTimes(1);
  });
});
