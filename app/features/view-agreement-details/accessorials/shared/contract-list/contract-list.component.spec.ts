import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { ContractListComponent } from './contract-list.component';
import { ContractListService } from '../contract-list/service/contract-list.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('ContractListComponent', () => {
  let component: ContractListComponent;
  let fixture: ComponentFixture<ContractListComponent>;
  let contractRespone, contractResponse2;
  let dataWithID;
  let dataSelected;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.contractListModel.isCurrencyValidationRequired = true;
    contractRespone = [{
      'customerAgreementContractID': 123,
      'customerContractName': 'COntract1',
      'customerContractNumber': 'C123',
      'contractTypeName': 'Legal123',
      'effectiveDate': '2018-12-28',
      'expirationDate': '2018-12-29',
      'isChecked': true,
      'currencyCode': 'USD',
      'status': 'Inactive',
      'dateMismatchFlag': true,
      'InvalidCurrecyFlag': true
    }];
    contractResponse2 = [{
      'customerAgreementContractID': 123,
      'customerContractName': 'COntract1',
      'customerContractNumber': 'C123',
      'contractTypeName': 'Legal123',
      'effectiveDate': '2018-12-28',
      'expirationDate': '2018-12-29',
      'isChecked': true,
      'currencyCode': 'USD',
      'status': 'Active',
    }];

    dataWithID = [{
      'customerAgreementContractID': 352,
      'customerContractName': '3t362',
      'customerContractNumber': null,
      'contractTypeID': 3,
      'contractTypeName': 'Transactional',
      'effectiveDate': '2019-01-01',
      'expirationDate': '2099-12-31',
      'status': 'Active',
      'InvalidCurrecyFlag': true,
      'currencyCode': 'USD',
    },
    {
      'customerAgreementContractID': 353,
      'customerContractName': '3t362',
      'customerContractNumber': null,
      'contractTypeID': 5,
      'contractTypeName': 'Transactional',
      'effectiveDate': '2019-01-01',
      'expirationDate': '2099-12-31',
      'status': 'Active',
      'dateMismatchFlag': true,
      'InvalidCurrecyFlag': true,
      'currencyCode': 'USD'
    },
    {
      'customerAgreementContractID': 354,
      'customerContractName': '3t362',
      'customerContractNumber': null,
      'contractTypeID': 4,
      'contractTypeName': 'Transactional',
      'effectiveDate': '2019-01-01',
      'expirationDate': '2099-12-31',
      'status': 'Active',
      'currencyCode': 'USD',
    }
    ];

    dataSelected = [{
      'customerAgreementContractID': 354,
      'customerContractName': '3t362',
      'customerContractNumber': null,
      'contractTypeID': 4,
      'contractTypeName': 'Transactional',
      'effectiveDate': '2019-01-01',
      'expirationDate': '2099-12-31',
      'status': 'Active'
    }];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create Contract Date format', () => {
    const date = '03/20/2019';
    component.contractDateFormatter(date);
    expect(component.contractDateFormatter).toBeTruthy();
  });
  it('should create General Date format', () => {
    const date = '03/20/2019';
    component.dateFormatter(date);
    expect(component.dateFormatter).toBeTruthy();
  });
  it('should get filter length', () => {
    const response = 5;
    component.onFilter(response);
    expect(component.onFilter).toBeTruthy();
  });
  it('should call rowunselect function', () => {
    const unselectResponse = {
      data: {
        'customerAgreementContractID': 123,
        'customerContractName': 'COntract1',
        'customerContractNumber': 'C123',
        'contractTypeName': 'Legal123',
        'effectiveDate': '2018-12-28',
        'expirationDate': '2018-12-29',
        'isChecked': true,
        'status': 'Inactive',
        'dateMismatchFlag': true,
        'InvalidCurrecyFlag': true
      }
    };
    component.onRowSelect(unselectResponse);
  });
  it('should call rowunselect function', () => {
    const unselectResponse = {
      data: {
        'customerAgreementContractID': 123,
        'customerContractName': 'COntract1',
        'customerContractNumber': 'C123',
        'contractTypeName': 'Legal123',
        'effectiveDate': '2018-12-28',
        'expirationDate': '2018-12-29',
        'isChecked': true,
        'status': 'Inactive',
        'dateMismatchFlag': true,
        'InvalidCurrecyFlag': true
      }
    };
    component.onRowUnselect(unselectResponse);
  });
  it('should load contract list', () => {
    component.loadContractList(contractRespone);
  });
  it('should fetch contract list details', () => {
    spyOn(ContractListService.prototype, 'getContactDetails').and.returnValue(of(contractRespone));
    component.getContractsListData();
  });
  it('should set effective date', () => {
    component.effectiveDate = '03/21/2019';
  });
  xit('should set expiration date', () => {
    component.expirationDate = '03/21/2019';
  });

  it('sould cal selectionGrowlMsg', () => {
    component.selectionGrowlMSg();
  });

  it('should cal onSort method', () => {
    const event = {
      multisortmeta: [{
        field: status,
        order: 1
      }]
    };
    component.onSort(event);
  });

  it('it should cal onHeaderCheckbox', () => {
    component.contractListModel.contractList = contractRespone;
    component.onHeaderCheckboxToggle();
    expect(component.onHeaderCheckboxToggle).toBeTruthy();
  });

  it('it should cal forCheckDate', () => {
    const date = '05/22/2019';
    component.forCheckDate(date);
  });

  it('it should call checkDate', () => {
    component.effectiveDate = '2018-12-26';
    component.expirationDate = '2018-12-30';
    component.contractListModel.selectedCurrency = 'CAD';
    component.contractListModel.contractList = contractRespone;
    component.checkDateCurrency();
    expect(component.checkDateCurrency).toBeTruthy();
  });
  it('it should call checkDate', () => {
    component.effectiveDate = '2018-12-28';
    component.expirationDate = '2018-12-29';
    component.contractListModel.selectedCurrency = 'USD';
    component.contractListModel.contractList = contractResponse2;
    component.checkDateCurrency();
  });
  it('should call showInvalidSelectionErrMsg', () => {
    component.showInvalidSelectionErrMsg(['a'], ['a']);
  });
  it('should call resetInvalidFlags', () => {
    component.resetInvalidFlags(contractRespone[0]);
  });
});
