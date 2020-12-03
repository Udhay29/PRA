import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { CreateAgreementModule } from './../../create-agreement.module';
import { AddContractsService } from './add-contracts.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddContractsService', () => {
  let service: AddContractsService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, CreateAgreementModule, HttpClientTestingModule],
      providers: [AddContractsService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  beforeEach(() => {
    service = TestBed.get(AddContractsService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([AddContractsService], () => {
    expect(service).toBeTruthy();
  }));

  it('getContractType should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getContractType();
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('contractSave should call post', () =>  {
    spyOn(http, 'post').and.returnValue('called post');
    service.contractSave({}, 1);
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('getContractId should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getContractId();
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getContractId should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getContractId();
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getContractList should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getContractList(1);
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('contractEditSave should call put', () =>  {
    spyOn(http, 'put').and.returnValue('called put');
    service.contractEditSave(1, 1, {});
    expect(http.put).toHaveBeenCalledTimes(1);
  });

  it('deleteContract should call delete', () =>  {
    spyOn(http, 'delete').and.returnValue('called delete');
    service.deleteContract(1, '');
    expect(http.delete).toHaveBeenCalledTimes(1);
  });
});
