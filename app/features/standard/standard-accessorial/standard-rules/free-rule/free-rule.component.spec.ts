import { StandardModule } from './../../../standard.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { DebugElement } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { AppModule } from '../../../../../app.module';

import { FreeRuleComponent } from './free-rule.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FreeRuleService } from './service/free-rule.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('FreeRuleComponent', () => {
  let component: FreeRuleComponent;
  let fixture: ComponentFixture<FreeRuleComponent>;
  let debugElement: DebugElement;
  let service: FreeRuleService;
  const fb = new FormBuilder();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, FreeRuleService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeRuleComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    service = debugElement.injector.get(FreeRuleService);
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
  it('should call onQuantityKeyPress2', () => {
    component.freeRuleModel.isFreeRuleTypeQuantity = true;
    component.freeRuleModel.isFreeRuleTimeType = true;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.width_value'));
    element.triggerEventHandler('keypress', { target: { value: '', selectionStart: 12 }, key: 1 });
  });
  it('should call onQuantityKeyPress3', () => {
    component.freeRuleModel.isFreeRuleTypeQuantity = true;
    component.freeRuleModel.isFreeRuleTimeType = true;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.width_value'));
    element.triggerEventHandler('keypress', { target: { value: 'test', selectionStart: 12 }, key: 'Backspace' });
  });
  it('should call onTypeFreeType on completeMethod', () => {
    const element = fixture.debugElement.query(By.css('.free-type-jasmine'));
    component.freeRuleModel.freeRuleTypes = [{label: '', value: 1}];
    element.triggerEventHandler('completeMethod', { query: 'test' });
    fixture.detectChanges();
  });

  it('should call onTypeFreeType on completeMethod', () => {
    const element = fixture.debugElement.query(By.css('.free-type-jasmine'));
    component.freeRuleModel.freeRuleTypes = null;
    element.triggerEventHandler('completeMethod', { query: 'test' });
    fixture.detectChanges();
  });

  it('should call onFreeTypeBlur on blur', () => {
    component.onFreeTypeBlur( event, 'freeRuleType');
  });

  it('should call onSelectFreeType on select', () => {
    const element = fixture.debugElement.query(By.css('.free-type-jasmine'));
    component.freeRuleModel.freeRuleTypeQuantity['accessorialFreeRuleTypeID'] = 1;
    element.triggerEventHandler('onSelect', { value: 1 });
    fixture.detectChanges();
  });

  it('should call onSelectFreeType on select2', () => {
    const element = fixture.debugElement.query(By.css('.free-type-jasmine'));
    component.freeRuleModel.freeRuleTypeQuantity['accessorialFreeRuleTypeID'] = 0;
    component.freeRuleModel.freeRuleTypeEvent['accessorialFreeRuleTypeID'] = 1;
    element.triggerEventHandler('onSelect', { value: 1 });
    fixture.detectChanges();
  });

  it('should call onSelectFreeType on select3', () => {
    const element = fixture.debugElement.query(By.css('.free-type-jasmine'));
    component.freeRuleModel.freeRuleTypeQuantity['accessorialFreeRuleTypeID'] = 0;
    component.freeRuleModel.freeRuleTypeEvent['accessorialFreeRuleTypeID'] = 0;
    component.freeRuleModel.freeRuleTypeCalendar['accessorialFreeRuleTypeID'] = 1;
    element.triggerEventHandler('onSelect', { value: 1 });
    fixture.detectChanges();
  });

  it('should call onSelectFreeType on select4', () => {
    const element = fixture.debugElement.query(By.css('.free-type-jasmine'));
    component.freeRuleModel.freeRuleTypeQuantity['accessorialFreeRuleTypeID'] = 0;
    component.freeRuleModel.freeRuleTypeEvent['accessorialFreeRuleTypeID'] = 0;
    component.freeRuleModel.freeRuleTypeCalendar['accessorialFreeRuleTypeID'] = 0;
    element.triggerEventHandler('onSelect', { value: 1 });
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

  it('should call onSelectQuantityType on select2', () => {
    component.freeRuleModel.isFreeRuleTypeQuantity = true;
    component.freeRuleModel.timeQuantityType['accessorialFreeRuleQuantityTypeId'] = 123;
    component.freeRuleModel.distanceQuantityType['accessorialFreeRuleQuantityTypeId'] = 123;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.quantity-type-jasmine'));
    element.triggerEventHandler('onSelect', { value: 1 });
  });

  it('should call onQuantityBlur', () => {
    component.freeRuleModel.isFreeRuleTypeQuantity = true;
    component.freeRuleModel.isFreeRuleTimeType = true;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.width_value'));
    element.triggerEventHandler('blur', '1.0');
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
  it('should call onTypeQuantityType', () => {
    component.freeRuleModel.isFreeRuleTypeQuantity = true;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.quantity-type-jasmine'));
    component.freeRuleModel.quantityTypes = [{label: '1', value: 1}, {label: '11', value: 11}];
    element.triggerEventHandler('completeMethod', { query: '1' });
    fixture.detectChanges();
  });
  it('should call onTypeDistanceType', () => {
    component.freeRuleModel.isFreeRuleTypeQuantity = true;
    component.freeRuleModel.isFreeRuleDistanceType = true;
    fixture.detectChanges();
    component.freeRuleModel.distanceTypes = [{label: '1', value: 1}, {label: '11', value: 11}];
    const element = fixture.debugElement.query(By.css('[formControlName="distanceType"]'));
    element.triggerEventHandler('completeMethod', { query: '1' });
  });

});
