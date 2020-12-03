import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { BilltoListComponent } from './billto-list.component';

import { BilltoListService } from './service/billto-list.service';
import { of } from 'rxjs/index';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('BilltoListComponent', () => {
  let component: BilltoListComponent;
  let fixture: ComponentFixture<BilltoListComponent>;
  let response;
  let contractRespone;
  let sectionResponse;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BilltoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    response = [{
      'customerAgreementID': 1234,
      'customerAgreementName': 'test',
      'effectiveDate': '2018-12-28',
      'expirationDate': '2018-12-29',
      'customerAgreementContractSectionAccountID': 123,
      'billingPartyID': 123,
      'customerAgreementContractSectionID': 546,
      'customerAgreementContractSectionName': 'Section 1',
      'customerAgreementContractID': 567,
      'customerContractName': 'Conytract 1',
      'billToDetailsDTO': {
        'billToID': 123,
        'billToCode': 'Bill 1',
        'billToName': 'Bill To 1'
      }
    }];
    contractRespone = [{
      'customerAgreementContractID': 123,
      'customerContractName': 'COntract1',
      'customerContractNumber': 'C123',
      'contractTypeName': 'Legal123',
      'effectiveDate': '2018-12-28',
      'expirationDate': '2018-12-29',
      'isChecked': true
    }];
    sectionResponse = [{
      'customerAgreementContractSectionID': 123,
      'customerAgreementContractSectionName': 'Section123',
      'customerAgreementContractID': 456,
      'customerContractName': 'COntract1',
      'customerContractNumber': 'C123',
      'contractTypeName': 'Legal123',
      'effectiveDate': '2018-12-28',
      'expirationDate': '2018-12-29',
      'isChecked': true,
      'currencyCode': 'USD',
    }];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get filter length', () => {
    const filterLength = 5;
    component.onFilter(filterLength);
    expect(component.onFilter).toBeTruthy();
  });
  it('should call the billto details function', () => {
    component.billToModel.selectedRateType = 'agreement';
    component.loadDetails();
  });
  it('should fetch billto details', () => {
    spyOn(BilltoListService.prototype, 'loadBillToData').and.returnValue(of(response));
    component.loadBillToDetails();
  });
  it('should display the bill to details grid', () => {
    component.loadBillToGrid(response);
  });
  it('should get contract details', () => {
    component.billToModel.selectedContractValue = contractRespone;
    component.iterateContractDetails();
  });
  it('should get section details', () => {
    component.billToModel.selectedSectionValue = sectionResponse;
    component.iterateSectionDetails();
  });
  it('should get agreement details', () => {
    component.billToModel.selectedRateType = 'agreement';
    component.billToParamsFramer();
  });
  it('should get contract details', () => {
    component.billToModel.selectedRateType = 'contract';
    component.billToModel.selectedContractValue = contractRespone;
    component.billToParamsFramer();
  });
  it('should get section details', () => {
    component.billToModel.selectedRateType = 'section';
    component.billToModel.selectedSectionValue = sectionResponse;
    component.billToParamsFramer();
  });
  it('should call rowunselect function', () => {
    const unselectResponse = {
      data: {
        'customerAgreementID': 1234,
        'customerAgreementName': 'test',
        'effectiveDate': '2018-12-28',
        'expirationDate': '2018-12-29',
        'customerAgreementContractSectionAccountID': 123,
        'billingPartyID': 123,
        'customerAgreementContractSectionID': 546,
        'customerAgreementContractSectionName': 'Section 1',
        'customerAgreementContractID': 567,
        'customerContractName': 'Conytract 1',
        'billToDetailsDTO': {
          'billToID': 123,
          'billToCode': 'Bill 1',
          'billToName': 'Bill To 1'
        }
      }
    };
    component.onRowSelect(unselectResponse);
  });
  it('should call rowunselect function', () => {
    const unselectResponse = {
      data: {
        'customerAgreementID': 1234,
        'customerAgreementName': 'test',
        'effectiveDate': '2018-12-28',
        'expirationDate': '2018-12-29',
        'customerAgreementContractSectionAccountID': 123,
        'billingPartyID': 123,
        'customerAgreementContractSectionID': 546,
        'customerAgreementContractSectionName': 'Section 1',
        'customerAgreementContractID': 567,
        'customerContractName': 'Conytract 1',
        'billToDetailsDTO': {
          'billToID': 123,
          'billToCode': 'Bill 1',
          'billToName': 'Bill To 1'
        }
      }
    };
    component.onRowUnselect(unselectResponse);
  });
  it('should set rateType', () => {
    component.rateType = 'agreement';
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
    component.onHeaderCheckboxToggle();
    expect(component.onHeaderCheckboxToggle).toBeTruthy();
  });

  it('it should cal forCheckDate', () => {
    const date = '05/22/2019';
    component.forCheckDate(date);
  });

  it('it should cal checkDate', () => {
    component.checkDate();
    expect(component.checkDate).toBeTruthy();
  });

  it('it should cal sectionparam', () => {
    component.sectionParamFramer();
  });


});
