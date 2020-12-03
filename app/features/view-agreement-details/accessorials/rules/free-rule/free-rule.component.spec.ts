import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { DebugElement } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';

import { FreeRuleComponent } from './free-rule.component';
import { CreateRuleUtilityService } from '../create-rules/service/create-rule-utility.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FreeRuleService } from './service/free-rule.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('FreeRuleComponent', () => {
  let component: FreeRuleComponent;
  let fixture: ComponentFixture<FreeRuleComponent>;
  let debugElement: DebugElement;
  let service: FreeRuleService;
  let createRuleUtilityService: CreateRuleUtilityService;
  const fb = new FormBuilder();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, FreeRuleService, CreateRuleUtilityService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeRuleComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    service = debugElement.injector.get(FreeRuleService);
    createRuleUtilityService = TestBed.get(CreateRuleUtilityService);
    fixture.detectChanges();
    component.freeRuleModel.freeRulesForm = fb.group({
      freeRuleType: ['', Validators.required],
      quantityType: ['', Validators.required],
      quantity: ['', Validators.required],
      timeType: ['', Validators.required],
      distanceType: ['', Validators.required],
      requestedDeliveryDate: ['', Validators.required]
    });
    component.freeRuleModel.isSubscribeFlag = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFreeTypes', () => {
    const param = {
      _embedded: {
        accessorialFreeRuleTypes: [
          { accessorialFreeRuleTypeName: 'name', accessorialFreeRuleTypeID: 123, _links: null }
        ]
      },
      _links: null,
      page: null
    };
    spyOn(service, 'getFreeTypes').and.returnValue(of(param));
    component.freeRuleModel.isSubscribeFlag = true;
    component.getFreeTypes();
  });

  it('should call getFreeTypes when null', () => {
    spyOn(service, 'getFreeTypes').and.returnValue(of(null));
    component.freeRuleModel.isSubscribeFlag = true;
    component.getFreeTypes();
  });

  it('should call onQuantityKeyPress', () => {
    component.freeRuleModel.isFreeRuleTypeQuantity = true;
    component.freeRuleModel.isFreeRuleTimeType = true;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.width_value'));
    element.triggerEventHandler('keypress', { target: { value: 'test', selectionStart: 12 }, key: 1 });
    fixture.detectChanges();
  });

  it('should call onTypeFreeType on completeMethod', () => {
    const element = fixture.debugElement.query(By.css('.free-type-jasmine'));
    element.triggerEventHandler('completeMethod', { query: 'test' });
    fixture.detectChanges();
  });

  it('should call onFreeTypeBlur on blur', () => {
    const element = fixture.debugElement.query(By.css('.free-type-jasmine'));
    element.triggerEventHandler('onBlur', { target: { value: '' } });
    fixture.detectChanges();
  });

  it('should call onSelectQuantityType on select', () => {
    component.freeRuleModel.isFreeRuleTypeQuantity = true;
    component.freeRuleModel.timeQuantityType['accessorialFreeRuleQuantityTypeId'] = 123;
    component.freeRuleModel.distanceQuantityType['accessorialFreeRuleQuantityTypeId'] = 123;
    fixture.detectChanges();
    component.freeRuleModel.isSubscribeFlag = true;
    spyOn(service, 'getfreeRuleTimeTypes').and.returnValue(of([{
      accessorialFreeRuleQuantityTimeTypeId: 123,
      accessorialFreeRuleQuantityTimeTypeName: 'string',
    }]));
    spyOn(service, 'getfreeRuleDistanceTypes').and.returnValue(of([{
      accessorialFreeRuleQuantityDistanceTypeId: 123,
      accessorialFreeRuleQuantityDistanceTypeName: 'string'
    }]));
    const element = fixture.debugElement.query(By.css('.quantity-type-jasmine'));
    element.triggerEventHandler('onSelect', { value: 123 });
    fixture.detectChanges();
  });

  it('should call onQuantityBlur', () => {
    component.freeRuleModel.isFreeRuleTypeQuantity = true;
    component.freeRuleModel.isFreeRuleTimeType = true;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.width_value'));
    element.triggerEventHandler('blur', 'value');
    fixture.detectChanges();
  });

  it('should call clearFreeRuleForm', () => {
    component.clearFreeRuleForm();
  });

  it('should call getQuantityTypes', () => {
    component.freeRuleModel.isSubscribeFlag = true;
    const params = {
      _embedded: {
        accessorialFreeRuleQuantityTypes: [
          { accessorialFreeRuleQuantityTypeName: 'name', accessorialFreeRuleQuantityTypeId: 123 }
        ]
      },
      _links: null,
      page: null
    };
    spyOn(service, 'getQuantityTypes').and.returnValue(of({
      _embedded: {
        accessorialFreeRuleQuantityTypes: [{
          accessorialFreeRuleQuantityTypeName: 'test', accessorialFreeRuleQuantityTypeId: 123
        }]
      }
    }));
    component.getQuantityTypes();
  });

  it('should call onTypeTimeType', () => {
    component.freeRuleModel.isFreeRuleTypeQuantity = true;
    component.freeRuleModel.isFreeRuleTimeType = true;
    component.freeRuleModel.timeTypes = [
      { label: 'test', value: 123 }
    ];
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.type-time-jasmine'));
    element.triggerEventHandler('completeMethod', { query: 't' });
    fixture.detectChanges();
  });

  it ('should call addQuantityTypeControl & set isFreeRuleTypeQuantity to true', () => {
      component.addQuantityTypeControl();
      expect(component.freeRuleModel.isFreeRuleTypeQuantity).toEqual(true);
  });
  it ('should call onQuantityBlur ', () => {
    const value = '500';
    component.onQuantityBlur(value);
    expect(component.freeRuleModel.freeRulesForm.get('quantity')).toBeDefined();
  });
  it ('should call onSelectFreeType ', () => {
    const event1: any = {label: 'Quantity', value: 1};
    const event2: any = {label: 'Quantity', value: 2};
    const event3: any = {label: 'Quantity', value: 3};
    component.freeRuleModel.freeRuleTypeQuantity['accessorialFreeRuleTypeID'] = 1;
    component.freeRuleModel.freeRuleTypeEvent['accessorialFreeRuleTypeID'] = 2;
    component.freeRuleModel.freeRuleTypeCalendar['accessorialFreeRuleTypeID'] = 3;
    spyOn(component, 'getQuantityTypes');
    component.onSelectFreeType(event1);
    expect(component.getQuantityTypes).toHaveBeenCalled();
    component.onSelectFreeType(event2);
    expect(component.freeRuleModel.isFreeRuleTypeEvent).toEqual(true);
    component.onSelectFreeType(event3);
    expect(component.freeRuleModel.isFreeRuleTypeCalendar ).toEqual(true);
  });
  it('should call populateTimeType', () => {
    const timeType = [
      { accessorialFreeRuleQuantityTimeTypeId: 16,
        accessorialFreeRuleQuantityTimeTypeName: 'Day'},
      {
        accessorialFreeRuleQuantityTimeTypeId: 17,
        accessorialFreeRuleQuantityTimeTypeName: 'Hour'
      },
      {
        accessorialFreeRuleQuantityTimeTypeId: 18,
        accessorialFreeRuleQuantityTimeTypeName: 'Minute'}
    ];
    component.populateTimeType(timeType);
    expect(component.freeRuleModel.timeTypes.length).toEqual(3);
  });
  it('should call populateDistanceTypes', () => {
    const distanceType = [{accessorialFreeRuleQuantityDistanceTypeId: 7,
      accessorialFreeRuleQuantityDistanceTypeName: 'Kilometers'},

      {accessorialFreeRuleQuantityDistanceTypeId: 8,
        accessorialFreeRuleQuantityDistanceTypeName: 'Miles'},

      {accessorialFreeRuleQuantityDistanceTypeId: 2,
        accessorialFreeRuleQuantityDistanceTypeName: 'Percentage'}];
    component.populateDistanceType(distanceType);
    expect(component.freeRuleModel.distanceTypes.length).toEqual(3);
  });
  it ('should call onTypeQuantityType', () => {
    const event: any  = {'originalEvent': 'MouseEvent', 'query': 'time'};
    const quantityType = [{'label': 'time', 'value': 1}, {'label': 'distance', 'value': 2}];
    component.freeRuleModel.quantityTypes = quantityType;
    component.onTypeQuantityType(event);
    expect(component.freeRuleModel.quantityTypesFiltered.length).toBeGreaterThan(0);
  });
  it ('should call onTypeDistanceType', () => {
    const event: any  = {'originalEvent': 'MouseEvent', 'query': 'miles'};
    const distanceType = [{'label': 'miles', 'value': 1}];
    component.freeRuleModel.distanceTypes = distanceType;
    component.onTypeDistanceType(event);
    expect(component.freeRuleModel.distanceTypesFiltered.length).toBeGreaterThan(0);
  });
  it ('should populate freeRuleTypesFiltered', () => {
    const event: any  = {'originalEvent': 'MouseEvent', 'query': 'free'};
    component.freeRuleModel.freeRuleTypes = [{'label': 'free', 'value': 1}];
    component.onTypeFreeType(event);
    expect(component.freeRuleModel.freeRuleTypesFiltered.length).toBeGreaterThan(0);
  });
});
