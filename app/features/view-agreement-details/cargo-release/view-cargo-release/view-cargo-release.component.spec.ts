import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';

import { ViewCargoReleaseComponent } from './view-cargo-release.component';
import { ViewCargoService } from './services/view-cargo.service';

describe('ViewCargoReleaseComponent', () => {
  let component: ViewCargoReleaseComponent;
  let fixture: ComponentFixture<ViewCargoReleaseComponent>;
  let viewCargoService: ViewCargoService;

  const tempObj = {
    'cargoType': 'Agreement', 'customerAgreementCargoIDs': [337], 'lastUpdateProgramName': 'Process ID',
    'agreementDefaultIndicator': 'Yes', 'uniqueDocID': 'A_521_337', 'sectionAssociation': null,
    'createTimestamp': '2019-05-10T15:58:37.314', 'lastUpdateTimestamp': '2019-05-10T15:58:37.314',
    'originalEffectiveDate': '1995-01-01', 'originalExpirationDate': '2099-12-31', 'invalidIndicator': 'N',
    'invalidReasonTypeName': 'Active', 'customerAgreementID': 521, 'cargoReleaseAmount': '$100,000.00', 'contractAssociation': null,
     'lastUpdateUserId': 'jcnt311', 'createUserId': 'jcnt311', 'effectiveDate': '01/01/1995', 'createProgramName':
      'Process ID', 'financeBusinessUnitAssociations': null, 'expirationDate': '12/31/2099', 'customerSectionName': '--',
      'customerContractName': '--', 'businessUnitData': ['--']
  };
  const response = {
    'cargoAmount': 100000, 'customerAgreementID': 521, 'customerAgreementCargoID': 337,
    'agreementDefault': 'Yes', 'customerContractID': null, 'customerContractNumber': null, 'customerContractName': null,
    'customerContractCargoID': null, 'customerSectionCargoID': null, 'customerSectionName': null, 'customerSectionID':
      null, 'customerAgreementBusinessUnitCargoList': null, 'customerContractBusinessUnitCargoList': null,
    'customerSectionBusinessUnitCargo': null, 'effectiveDate': '1995-01-01', 'expirationDate': '2099-12-31', 'status':
      'Active', 'originalEffectiveDate': '1995-01-01', 'originalExpirationDate': '2099-12-31', 'createdUser': 'jcnt311',
    'createdDate': '2019-05-10T15:58:37.314', 'createdProgram': 'Process ID', 'updatedUser': 'jcnt311', 'updatedDate':
      '2019-05-10T15:58:37.314', 'updatedProgram': 'Process ID'
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, ViewCargoService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCargoReleaseComponent);
    component = fixture.componentInstance;
    viewCargoService = TestBed.get(ViewCargoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    component.ngOnInit();
  });

  it('should destroy', () => {
    component.ngOnDestroy();
    expect(component.cargoReleaseModel.subscribeFlag).toBe(false);
  });

  it('should call onClose', () => {
    component.onClose();
  });

  it('should call getCargoDetails', () => {
    spyOn(viewCargoService, 'getViewScreenData').and.returnValue(response);
    component.getCargoDetails();
  });
  it('should call businessFormatter', () => {
    component.rowData = tempObj;
    component.businessFormatter(response);
  });
  it('should call businessFormatter-Section', () => {
    tempObj['cargoType'] = 'Section';
    component.rowData = tempObj;
    component.businessFormatter(response);
  });
  it('should call businessFormatter-Contract', () => {
    tempObj['cargoType'] = 'Contract';
    component.rowData = tempObj;
    component.businessFormatter(response);
  });
  it('should call businessFormatter - SectionBU', () => {

    tempObj['cargoType'] = 'SectionBU';
    response['customerSectionBusinessUnitCargo'] = [{
      'financeBusinessUnitCode': 'JBT', 'sectionBuEffectiveDate': '2019-05-10',
      'sectionBuExpirationDate': '2019-05-10', 'sectionBusinessUnitCargoAmount': 1234
    }];
    component.rowData = tempObj;
    component.businessFormatter(response);

  });

  it('should call businessFormatter - ContractBU', () => {

    tempObj['cargoType'] = 'ContractBU';
    response['customerContractBusinessUnitCargoList'] = [{
      'financeBusinessUnitCode': 'JBT', 'contractBuEffectiveDate': '2019-05-10',
      'contractBuExpirationDate': '2019-05-10', 'contractBusinessUnitCargoAmount': 1234
    }];
    component.rowData = tempObj;
    component.businessFormatter(response);
  });

  it('should call businessFormatter - AgreementBU', () => {

    tempObj['cargoType'] = 'AgreementBU';
    response['customerAgreementBusinessUnitCargoList'] = [{
      'financeBusinessUnitCode': 'JBT', 'agreementBuEffectiveDate': '2019-05-10',
      'agreementBuExpirationDate': '2019-05-10', 'agreementBusinessUnitCargoAmount': 1234
    }];
    component.rowData = tempObj;
    component.businessFormatter(response);
  });

  it('dateFormatter - should return true if date is in the future', () => {
    expect(component.dateFormatter('2099-12-31')).toBe('12/31/2099');
  });
  it('should call amountFormatter', () => {
    expect(component.amountFormatter('1234')).toBe('1234.00');
    expect(component.amountFormatter('1234.56')).toBe('1234.56');
  });
  it('should call dateValidator', () => {
    expect(component.dateValidator('2019-05-10T15:58:37.314')).toBe('05/10/2019');
  });
});
