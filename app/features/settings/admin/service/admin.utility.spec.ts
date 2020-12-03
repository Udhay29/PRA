import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { SettingsModule } from '../../settings.module';
import { AppModule } from '../../../../app.module';
import { AdminUtility } from './admin.utility';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminComponent } from '../admin.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminModel } from '../model/admin-model';

describe('AdminUtility', () => {
  let services: AdminUtility;
  let http: HttpClient;
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  const formBuilder = new FormBuilder();
  let formGroup: FormGroup;
  const adminModel = new AdminModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [AdminUtility, HttpClient, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });
  beforeEach(() => {
    services = TestBed.get(AdminUtility);
    http = TestBed.get(HttpClient);
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    formGroup = formBuilder.group({
        agreementType: ['test', Validators.required],
        contractType: ['test', Validators.required],
        adminSectionTypes: ['test', Validators.required],
        supportedLocTypes: ['test'],
        supportedRateTypes: ['test'],
        rateCycle: ['test'],
        awardStatus: ['test'],
        rateStatus: ['test'],
        mileageProgaram: ['test'],
        randMcNallyMileageVersion: ['test'],
        randMcNallyPreferenceGroup: ['test'],
        pcMilerMileageVersion: ['test'],
        pcMilerPreferenceGroup: ['test'],
        mileageType: ['test'],
        Calculation: ['test'],
        fuelPriceSources: ['test'],
        fuelRegions: ['test'],
        supportedTaxTypes: ['test'],
        freeTimeOperationalEvent: ['test'],
        accessorialRateType: ['test'],
        mileageCalculation: ['test']
      });
      fixture.detectChanges();
  });
  const res = {
    'agreementTypeDTOs': {
      agreementTypeID: 1,
      agreementTypeName: 'string',
      tenantID: 1
    },
    'contractTypeDTOs': {
      contractTypeID: 1,
      contractTypeName: 'string',
      tenantID: 1
    },
    'sectionTypeDTOs': {
      sectionTypeID: 1,
      sectionTypeName: 'string',
      tenantID: 1
    }
  };

  it('should be created', inject([AdminUtility], (service: AdminUtility) => {
    expect(service).toBeTruthy();
  }));
  it('should call setValuesforEachField', () => {
   AdminUtility.setValuesforEachField(component, res, formGroup );
  });
  it('should call getRequestBody', () => {
    adminModel.adminRequestData = res;
   AdminUtility.getRequestBody(formGroup, adminModel);
  });
  it('should call requestBodyFrammer', () => {
    const response = {
      'agreementTypeDTOs': 'agreementTypeDTOs',
      'contractTypeDTOs': 'contractTypeDTOs',
      'sectionTypeDTOs': 'sectionTypeDTOs'
    };
    const res1 = {
      'agreementTypeDTOs': [{
        key: 1,
        value: 'string',
        tenantID: 1,
        isRemoved: true
      }],
      'contractTypeDTOs': [{
        key: 1,
        value: 'string',
        tenantID: 1,
        isRemoved: true
      }],
      'sectionTypeDTOs': [{
        key: 1,
        value: 'string',
        tenantID: 1,
        isRemoved: true
      }]
    };
    adminModel.adminRequestData = response;
    adminModel.componentValues = res1;
    adminModel.adminPopulate = res1;
   AdminUtility.requestBodyFrammer(adminModel, response, 'agreementTypeDTOs');
  });
});
