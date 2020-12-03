import { TestBed , inject, ComponentFixture} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { StandardModule } from '../../standard.module';
import { AppModule } from '../../../../app.module';
import { ChangeDetectorRef } from '@angular/core';
import { StandardOptionalUtilityService } from './standard-optional-utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StandardOptionalAttributesModel } from '../model/standard-optional-attributes.model';
// tslint:disable-next-line:max-line-length
import { StandardOptionalAttributesComponent } from '../standard-documentation/create-standard-documentation/standard-optional-attributes/standard-optional-attributes.component';
import { configureTestSuite } from 'ng-bullet';

describe('StandardOptionalUtilityService', () => {
  let service: StandardOptionalUtilityService;
  let http: HttpClient;
  let component: StandardOptionalAttributesComponent;
  let fixture: ComponentFixture<StandardOptionalAttributesComponent>;
  const optionalAttrModel = new StandardOptionalAttributesModel;
  const optionalRateFormBuilder: FormBuilder = new FormBuilder();
  let optionalRateFormGroup: FormGroup;
  const event = new Event('');

  configureTestSuite(() => {
    const changeDetectorRefStub = { detectChanges: () => ({}) };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      providers: [StandardOptionalUtilityService, { provide: APP_BASE_HREF, useValue: '/' },
      { provide: ChangeDetectorRef, useValue: changeDetectorRefStub } , HttpClient],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardOptionalAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get(StandardOptionalUtilityService);
    http = TestBed.get(HttpClient);
    optionalRateFormGroup = optionalRateFormBuilder.group({
      chargeType: [[]],
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

  it('should be created', inject([StandardOptionalUtilityService], () => {
    expect(service).toBeTruthy();
  }));
  it('should call onTypeChargeValue', () => {
    event['query'] = 'b';
    optionalAttrModel.optionalForm = optionalRateFormGroup;
    optionalAttrModel.optionalForm.controls['chargeType'].setValue([{label: 'Bobtail', value: 1, description: 'Bobtail'}]);
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
