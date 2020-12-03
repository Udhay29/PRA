import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from './../../../../../app.module';
import { configureTestSuite } from 'ng-bullet';
import { APP_BASE_HREF } from '@angular/common';
import { DebugElement } from '@angular/core';

import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { RatesFilterComponent } from './rates-filter.component';

describe('RatesFilterComponent', () => {
  let component: RatesFilterComponent;
  let fixture: ComponentFixture<RatesFilterComponent>;
  let debugElement: DebugElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, HttpClientTestingModule, ViewAgreementDetailsModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesFilterComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should cal onClearAllFilters', () => {
    component.onClearAllFilters();
  });
  it('should cal resetDateValues', () => {
    component.resetDateValues();
  });
  it('should cal dateRadioToggle', () => {
    component.dateRadioToggle(false, 'effDateOnlyFlag',
      'effectiveDateValue', 'effectiveEndDate', 'effectiveStartDate', 'effectiveDate', 'dateRange');
  });
  it('should cal clearDate', () => {
    component.clearDate('expirationStartDate', 'expirationEndDate',
      'expirationDateValue', 'expirationDate', 'expDefaultSelect', 'expDateOnlyFlag', 'expirationCheck');
  });
  it('should cal matchExactDate', () => {
    const event = true;
    component.matchExactDate(event);
  });
  it('should cal effectiveKeyFinderIfPass', () => {
    component.filterModel.effectiveType = 'Date';
    component.filterModel.effectiveExactValue = true;
    component.effectiveKeyFinder();
  });
  it('should cal effectiveKeyFinderIf2fail', () => {
    component.filterModel.effectiveType = 'Date';
    component.filterModel.effectiveExactValue = false;
    component.effectiveKeyFinder();
  });
  it('should cal effectiveKeyFinderElse', () => {
    component.filterModel.effectiveType = 'Dates';
    component.effectiveKeyFinder();
  });
  it('should cal onDateRangeSelectSwtichCase1', () => {
    component.filterModel.effectiveType = 'Date';
    component.filterModel.effectiveExactValue = false;
    component.filterModel.effectiveStartDate = new Date().toString();
    component.onDateRangeSelect('effectiveStartDate');
    component.effectiveKeyFinder();
  });
  it('should cal onDateRangeSelectSwtichCase2', () => {
    component.filterModel.effectiveType = 'Date';
    component.filterModel.effectiveExactValue = true;
    component.filterModel.effectiveStartDate = new Date().toString();
    component.onDateRangeSelect('effectiveStartDate');
  });
  it('should cal onDateRangeSelectSwtichCase3', () => {
    component.filterModel.effectiveType = 'Dates';
    component.filterModel.effectiveStartDate = new Date().toString();
    component.onDateRangeSelect('effectiveStartDate');
  });
  it('should cal onDateRangeSelectElse', () => {
    component.filterModel.effectiveType = 'Date';
    component.filterModel.effectiveExactValue = true;
    component.filterModel.effectiveStartDate = null;
    component.onDateRangeSelect('effectiveStartDate');
  });
  it('should cal onDateRangeSelectElse', () => {
    const effectiveObj = {};
    const key = 'effectiveDateRange';
    component.filterModel.effectiveStartDate = new Date().toString();
    component.filterModel.effectiveEndDate = new Date().toString();
    component.validateDateRangeEffective(effectiveObj, 'effectiveStartDate', 'effectiveEndDate', key);
  });
  it('should cal onDateRangeSelectElse', () => {
    const effectiveObj = {};
    const key = 'effectiveDateRange';
    component.filterModel.effectiveStartDate = new Date(2018, 10, 20).toString();
    component.filterModel.effectiveEndDate = new Date(2017, 10, 20).toString();
    component.validateDateRangeEffective(effectiveObj, 'effectiveStartDate', 'effectiveEndDate', key);
  });
  it('should cal onDateRangeSelectElseif2', () => {
    const effectiveObj = {};
    const key = 'effectiveDateRange';
    component.filterModel.effectiveEndDate = new Date(2017, 10, 20).toString();
    component.validateDateRangeEffective(effectiveObj, 'effectiveStartDate', 'effectiveEndDate', key);
  });
  it('should cal onDateRangeSelectElseifElse', () => {
    const effectiveObj = {};
    const key = 'effectiveDateRange';
    component.validateDateRangeEffective(effectiveObj, 'effectiveStartDate', 'effectiveEndDate', key);
  });
  it('should cal dateRadioToggle', () => {
    component.expDateRadioToggle(false, 'effDateOnlyFlag',
      'effectiveDateValue', 'effectiveEndDate', 'effectiveStartDate', 'effectiveDate', 'dateRange');
  });
  //
  it('should cal onExpirationRangeSelectSwtichCase1', () => {
    component.filterModel.expirationType = 'Date';
    component.filterModel.expirationExactValue = false;
    component.filterModel.expirationDateValue = new Date().toString();
    component.onExpirationRangeSelect('expirationDateValue');
    component.effectiveKeyFinder();
  });
  it('should cal onExpirationRangeSelectSwtichCase2', () => {
    component.filterModel.expirationType = 'Date';
    component.filterModel.expirationExactValue = true;
    component.filterModel.expirationDateValue = new Date().toString();
    component.onExpirationRangeSelect('expirationDateValue');
  });
  it('should cal onExpirationRangeSelectSwtichCase3', () => {
    component.filterModel.expirationType = 'Dates';
    component.filterModel.expirationDateValue = new Date().toString();
    component.onExpirationRangeSelect('expirationDateValue');
  });
  it('should cal onExpirationRangeSelectElse', () => {
    component.filterModel.expirationType = 'Date';
    component.filterModel.expirationExactValue = true;
    component.filterModel.expirationDateValue = null;
    component.onExpirationRangeSelect('expirationDateValue');
  });
  it('should cal onExpirationRangeSelectElse', () => {
    const expirationObj = {};
    const key = 'effectiveDateRange';
    component.filterModel.expirationStartDate = new Date().toString();
    component.filterModel.expirationEndDate = new Date().toString();
    component.validateDateRangeExpiration(expirationObj, 'expirationStartDate', 'expirationEndDate', key);
  });
  it('should cal onExpirationRangeSelectElse', () => {
    const expirationObj = {};
    const key = 'effectiveDateRange';
    component.filterModel.expirationStartDate = new Date(2018, 10, 20).toString();
    component.filterModel.expirationEndDate = new Date(2017, 10, 20).toString();
    component.validateDateRangeExpiration(expirationObj, 'expirationStartDate', 'expirationEndDate', key);
  });
  it('should cal onExpirationRangeSelectElseif2', () => {
    const expirationObj = {};
    const key = 'effectiveDateRange';
    component.filterModel.expirationEndDate = new Date(2017, 10, 20).toString();
    component.validateDateRangeExpiration(expirationObj, 'expirationStartDate', 'expirationEndDate', key);
  });
  it('should cal onExpirationRangeSelectElseif2', () => {
    const expirationObj = {};
    const key = 'effectiveDateRange';
    component.filterModel.expirationStartDate = new Date(2017, 10, 20).toString();
    component.filterModel.expirationEndDate = null;
    component.validateDateRangeExpiration(expirationObj, 'expirationStartDate', 'expirationEndDate', key);
  });
  it('should cal onExpirationRangeSelectElseifElse', () => {
    const expirationObj = {};
    const key = 'effectiveDateRange';
    component.validateDateRangeExpiration(expirationObj, 'expirationStartDate', 'expirationEndDate', key);
  });
  it('should cal expDateRadioToggle', () => {
    component.expDateRadioToggle(false, 'effDateOnlyFlag',
      'effectiveDateValue', 'effectiveEndDate', 'effectiveStartDate', 'effectiveDate', 'dateRange');
  });
  it('should cal expirationMatchExactDate', () => {
    const event = true;
    component.expirationMatchExactDate(event);
  });
  it('should cal onSegmentTabOpen', () => {
    const event = {
      index: 1
    };
    component.onSegmentTabOpen(event);
  });
  it('should cal onSegmentTabClose', () => {
    component.filterModel.openedAccordions = [1, 2, 3];
    const event = {
      index: 1
    };
    component.onSegmentTabClose(event);
  });
});

