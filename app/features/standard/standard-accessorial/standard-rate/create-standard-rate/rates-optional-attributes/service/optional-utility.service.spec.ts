import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { OptionalAttributesModel } from './../models/optional-attributes.model';
import { OptionalUtilityService } from './optional-utility.service';
import { RatesOptionalAttributesComponent } from '../rates-optional-attributes.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from './../../../../../../../app.module';
import { configureTestSuite } from 'ng-bullet';

import { StandardModule } from './../../../../../standard.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
describe('OptionalUtilityService', () => {
  let service: OptionalUtilityService;
  let component: RatesOptionalAttributesComponent;
  let fixture: ComponentFixture<RatesOptionalAttributesComponent>;
  const optionalAttrModel = new OptionalAttributesModel;
  const optionalRateFormBuilder: FormBuilder = new FormBuilder();
  let optionalRateFormGroup: FormGroup;
  const event = new Event('');

  configureTestSuite(() => {
    const changeDetectorRefStub = { detectChanges: () => ({}) };
    TestBed.configureTestingModule({
        imports: [ RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule ],
      providers: [
        OptionalUtilityService, { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefStub }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesOptionalAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get(OptionalUtilityService);
    optionalRateFormGroup = optionalRateFormBuilder.group({
      businessUnit: ['ICS'],
      serviceLevel: ['', Validators.required],
      requestedService: ['', Validators.required],
      equipmentCategory: [''],
      equipmentType: [''],
      equipmentLength: [''],
      carriers: [[]],
      waived: [''],
      calculateRate: [''],
      passThrough: [''],
      rollUp: ['']
    });
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  it('should call onTypeChargeValue', () => {
    event['query'] = 'b';
    optionalAttrModel.chargeType = [{label: 'Bobtail', value: 1, description: 'Bobtail'}];
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    service.onTypeChargeValue(event, optionalAttrModel, changeDetectorRefStub);
  });

  it('should call onTypeBusinessUnit', () => {
    event['query'] = 'd';
    optionalAttrModel.businessUnitData = [{label: 'DCS', value: {}}];
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    service.onTypeBusinessUnit(event, optionalAttrModel, changeDetectorRefStub);
  });

  it('should call onTypeEquipmentCategory', () => {
    event['query'] = 'c';
    optionalAttrModel.equipmentCategory = [{label: 'Chassis', value: 'Chassis'}];
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    service.onTypeEquipmentCategory(event, optionalAttrModel, changeDetectorRefStub);
  });

  it('should call onTypeEquipmentType', () => {
    event['query'] = 'c';
    optionalAttrModel.equipmentType = [{label: 'Chassis', value: 'Chassis', id: 1}];
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    service.onTypeEquipmentType(event, optionalAttrModel, changeDetectorRefStub);
  });

  it('should call onTypeEquipmentLength', () => {
    event['query'] = 't';
    optionalAttrModel.equipmentLength = [{label: 'test', value: 'test', id: 1,
    specificationId: 1, code: 'test'}];
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    service.onTypeEquipmentLength(event, optionalAttrModel, changeDetectorRefStub);
  });

  it('should call onTypeCarrierValue', () => {
    event['query'] = 't';
    optionalAttrModel.carriersList = [{label: 'test', value: {code: 'test', id: 1, name: 'test'}}];
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    optionalAttrModel.optionalForm = optionalRateFormGroup;
    service.onTypeCarrierValue(event, optionalAttrModel, changeDetectorRefStub);
  });
});
