import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import * as moment from 'moment-timezone';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { ContractsDetailService } from './contracts-detail.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContractsDetailService', () => {
  let service: ContractsDetailService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [ContractsDetailService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  beforeEach(() => {
    service = TestBed.get(ContractsDetailService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([ContractsDetailService], () => {
    expect(service).toBeTruthy();
  }));

  it('getContractDetail should call get', () =>  {
    const testData = {
      ContractComment: 'test',
      ContractNumber: 'test',
      LastUpdateProgram: 'test',
      CreateUser: 'test',
      ContractExpirationDate: 'test',
      ContractInvalidReasonType: 'test',
      ContractVersionID: 1,
      ContractInvalidIndicator: 'test',
      LastUpdateTimestamp: 'test',
      ContractName: 'test',
      LastUpdateUser: 'test',
      ContractEffectiveDate: 'test',
      ContractTypeName: 'test',
      CreateProgram: 'test',
      CreateTimestamp: 'test',
      AgreementID: 1,
      ContractID: 1,
    };
    const currdate = moment().format('YYYY-MM-DD');
    spyOn(http, 'get').and.returnValue('called get');
    service.getContractDetail(testData, currdate);
    expect(http.get).toHaveBeenCalledTimes(1);
  });
});

