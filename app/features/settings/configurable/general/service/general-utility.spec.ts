import { TestBed, ComponentFixture } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { GeneralUtility } from './general-utility';
import { HttpClient } from '@angular/common/http';
import { GeneralComponent } from '../general.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsModule } from './../../../settings.module';
import { AppModule } from './../../../../../app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';

describe('GeneralUtility', () => {

  let service: GeneralUtility;
  let http: HttpClient;
  let component: GeneralComponent;
  let fixture: ComponentFixture<GeneralComponent>;
  const formBuilder = new FormBuilder();
  let formGroup: FormGroup;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [GeneralUtility, HttpClient, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });
  beforeEach(() => {
    service = TestBed.get(GeneralUtility);
    http = TestBed.get(HttpClient);
    fixture = TestBed.createComponent(GeneralComponent);
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call setValuesforEachField', () => {
    const res = {
      configurationParameterDetailID: 1,
      tenantID: 1,
      configurationParameterID: 1,
      configurationParameterName: 'string',
      parameterSpecificationTypeID: 1,
      parameterSpecificationTypeName: 'string',
      configurationParameterValue: 1,
      configurationParameterDetail: 'string'
    };
    GeneralUtility.validateData('cargoReleaseDefault', component, res, formGroup );
    GeneralUtility.validateData('', component, res, formGroup );
    GeneralUtility.validateData(null, component, res, formGroup );
   });
   it('should call populateData', () => {
     const param = [{
       configurationParameterDetailDTOs: {
        configurationParameterDetailID: 1,
        tenantID: 1,
        configurationParameterID: 1,
        configurationParameterName: 'string',
        parameterSpecificationTypeID: 1,
        parameterSpecificationTypeName: 'string',
        configurationParameterValue: 1,
        configurationParameterDetail: 'string'
      }
     }];
    GeneralUtility.populateData(formGroup, component, param);
   });
});
