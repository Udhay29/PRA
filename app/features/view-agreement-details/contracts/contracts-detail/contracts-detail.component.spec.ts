import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { of, throwError } from 'rxjs';

import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { AppModule } from './../../../../app.module';
import { ContractsDetailComponent } from './contracts-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContractsDetailService } from './service/contracts-detail.service';

describe('ContractsComponent', () => {
  let component: ContractsDetailComponent;
  let fixture: ComponentFixture<ContractsDetailComponent>;
  let service: ContractsDetailService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsDetailComponent);
    component = fixture.componentInstance;
    service = TestBed.get(ContractsDetailService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getContractDetails', () => {
    const res = {
      customerAgreementContractID: 12,
      customerAgreementID: 61,
      customerAgreementContractVersionID: 12,
      customerAgreementContractTypeID: 12,
      customerAgreementContractTypeName: 'Legal',
      customerContractName: 'test',
      customerContractNumber: '12',
      effectiveDate: '07/07/2019',
      expirationDate: '07/07/2019',
      customerContractComment: 'test',
      status: 'test',
      createUserId: 'test',
      lastUpdateUserID: 'test',
      lastUpdateProgramName: 'test',
      createProgramName: 'test',
      createTimestamp: 'test',
      lastUpdateTimestamp: 'test',
      originalEffectiveDate: '07/07/2019',
      originalExpirationDate: '07/07/2019'
    };
    spyOn(service, 'getContractDetail').and.returnValue(of(res));
    component.getContractDetails();
  });
  it('should call getContractDetails err', () => {
    const err = {
      'traceid' : '343481659c77ad99',
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    };
    spyOn(service, 'getContractDetail').and.returnValue(throwError(err));
    component.getContractDetails();
  });
  it('should call constructViewDetail', () => {
    const res = {
      customerAgreementContractID: 12,
      customerAgreementID: 61,
      customerAgreementContractVersionID: 12,
      customerAgreementContractTypeID: 12,
      customerAgreementContractTypeName: 'Legal',
      customerContractName: 'test',
      customerContractNumber: '12',
      effectiveDate: '07/07/2019',
      expirationDate: '07/07/2019',
      customerContractComment: 'test',
      status: 'test',
      createUserId: 'test',
      lastUpdateUserID: 'test',
      lastUpdateProgramName: 'test',
      createProgramName: 'test',
      createTimestamp: 'test',
      lastUpdateTimestamp: 'test',
      originalEffectiveDate: '07/07/2019',
      originalExpirationDate: '07/07/2019'
    };
    component.constructViewDetail(res);
  });
  it('should call getButtonMenu', () => {
    const res = {
      customerAgreementContractID: 12,
      customerAgreementID: 61,
      customerAgreementContractVersionID: 12,
      customerAgreementContractTypeID: 12,
      customerAgreementContractTypeName: 'Legal',
      customerContractName: 'test',
      customerContractNumber: '12',
      effectiveDate: '07/07/2019',
      expirationDate: '07/07/2019',
      customerContractComment: 'test',
      status: 'test',
      createUserId: 'test',
      lastUpdateUserID: 'test',
      lastUpdateProgramName: 'test',
      createProgramName: 'test',
      createTimestamp: 'test',
      lastUpdateTimestamp: 'test',
      originalEffectiveDate: '07/07/2019',
      originalExpirationDate: '07/07/2019'
    };
    component.getButtonMenu(res);
  });
  it('should call onClose', () => {
    component.onClose();
  });
  it('should call hasAccess', () => {
    component.hasAccess('test/test');
  });
});
