import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';

import { SectionsComponent } from './sections.component';
import { SectionsService } from './services/sections.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('SectionsComponent', () => {
  let component: SectionsComponent;
  let fixture: ComponentFixture<SectionsComponent>;
  let sectionResponse, sectionResponse2;
  let selectResponse;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.sectionsModel.isCurrencyValidationRequired = true;
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
      'status': 'Inactive',
      'dateMismatchFlag': true,
      'InvalidCurrecyFlag': true
    }];
    sectionResponse2 = [{
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
      'status': 'Active',
    }];
    selectResponse = {
      'data': {
        'contractTypeName': 'Legal',
        'currencyCode': 'USD',
        'customerAgreementContractID': 634,
        'customerAgreementContractSectionID': 123,
        'customerAgreementContractSectionName': 'sec1',
        'customerContractName': 'Legal_poilk',
        'customerContractNumber': '3423',
        'effectiveDate': '02/07/2019',
        'expirationDate': '12/31/2019',
        'isChecked': false,
        'status': 'Inactive',
        'dateMismatchFlag': true,
        'InvalidCurrecyFlag': true
      }
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get filter length', () => {
    component.onFilter(5);
  });

  it('should call getData', () => {
    spyOn(SectionsService.prototype, 'getSectionGridData').and.returnValue(of(sectionResponse));
    component.getData();
  });

  it('should call onRowselect function', () => {
    const element = fixture.debugElement.query(By.css('[name="ptable_section"]'));
    component.sectionsModel.selectedSection = selectResponse;
    element.triggerEventHandler('onRowSelect', { selectResponse });
    element.triggerEventHandler('onRowUnselect', { selectResponse });
    element.triggerEventHandler('onHeaderCheckboxToggle', {});
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
  it('it should call onRowSelect', () => {
    component.sectionsModel.selectedSection = sectionResponse;
    component.onRowSelect(selectResponse);
  });
  it('should call onRowUnselect', () => {
    component.sectionsModel.selectedSection = sectionResponse;
    component.onRowUnselect(selectResponse);
  });
  it('it should call onHeaderCheckbox', () => {
    component.sectionsModel.accessorialGridValue = sectionResponse;
    component.onHeaderCheckboxToggle();
    expect(component.onHeaderCheckboxToggle).toBeTruthy();
  });

  it('it should call forCheckDate', () => {
    const date = '05/22/2019';
    component.forCheckDate(date);
  });

  it('it should call checkDate', () => {
    component.effectiveDate = '2018-12-26';
    component.expirationDate = '2018-12-30';
    component.sectionsModel.selectedCurrency = 'CAD';
    component.sectionsModel.accessorialGridValue = sectionResponse;
    component.checkDateCurrency();
    expect(component.checkDateCurrency).toBeTruthy();
  });
  it('it should call checkDateElsePart', () => {
    component.effectiveDate = '2018-12-28';
    component.expirationDate = '2018-12-29';
    component.sectionsModel.selectedCurrency = 'USD';
    component.sectionsModel.accessorialGridValue = sectionResponse2;
    component.checkDateCurrency();
  });
  it('should call showInvalidSelectionErrMsg', () => {
    component.showInvalidSelectionErrMsg(['a'], ['a']);
  });
  it('should call resetInvalidFlags', () => {
    component.resetInvalidFlags(sectionResponse[0]);
  });

});
