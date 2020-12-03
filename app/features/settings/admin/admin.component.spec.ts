import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { AppModule } from '../../../app.module';
import { SettingsModule } from './../settings.module';
import { SettingsService } from '../service/settings.service';
import { AdminComponent } from './admin.component';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminService } from './service/admin.service';
import {
  FormsModule, ReactiveFormsModule,
  FormControl, Validators, FormBuilder, FormGroup, FormArray, AbstractControl
} from '@angular/forms';
import { AdminUtility } from './service/admin.utility';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  const formBuilder = new FormBuilder();
  let service: AdminService;
  let shared: BroadcasterService;
  let formGroup: FormGroup;
  let router: Router;
  let settingsService: SettingsService;


  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, AdminService, SettingsService]
    });
  });
  beforeEach(() => {
      fixture = TestBed.createComponent(AdminComponent);
      component = fixture.componentInstance;
      shared = TestBed.get(BroadcasterService);
      settingsService = TestBed.get(SettingsService);
      router = TestBed.get(Router);
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
      service = fixture.debugElement.injector.get(AdminService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onChanges', () => {
    component.onChanges();
  });
  it('should call submitForm', () => {
    component.submitForm();
  });
  it('should call setRequestData', () => {
    component.settingForm = formGroup;
    component.settingForm.markAsDirty();
    component.settingForm.markAsTouched();
    const res = {
      'agreementTypeDTOs': [
         {
            'agreementTypeID': 1,
            'agreementTypeName': 'Customer'
         }
      ],
      'contractTypeDTOs': [
         {
            'contractTypeID': 1,
            'contractTypeName': 'Legal'
         }
      ],
      'sectionTypeDTOs': [
         {
            'sectionTypeID': 1,
            'sectionTypeName': 'Standard'
         }
      ]
   };
   component.adminModel.adminRequestData = res;
   spyOn(service, 'saveITConfDtoService').and.returnValue(of(res));
   AdminUtility.getRequestBody(component.settingForm, component.adminModel);
    component.setRequestData();
  });
  it('should call navigationSubscription', () => {
    spyOn(shared, 'on').and.returnValue(of(true));
    component.navigationSubscription();
  });
  it('should call toastMessage', () => {
    component.toastMessage('info', 'Error Message', 'No changes available to save');
  });
  it('should call saveSubscription', () => {
    spyOn(shared, 'on').and.returnValue(of(true));
    component.saveSubscription();
  });
  it('should call onAdminFormKeyDown', () => {
    component.onAdminFormKeyDown('test', 'test');
  });
  it('should call onClickCharges', () => {
    router.navigate(['/settings/charges']);
    component.onClickCharges({
      label: 'test',
      routerLink: ['test']
    });
  });
  it('should call setValuesAfterRemove', () => {
    component.adminModel.componentValues = {'agreementTypeDTOs': [{
      'formName': 'agreementType',
      'value': 'agreementTypeName',
      'key': 'agreementTypeID'
  }]};
    component.setValuesAfterRemove('agreementTypeDTOs', 'test');
  });
  it('should call saveSubscription else condition', () => {
    spyOn(shared, 'on').and.returnValue(of(false));
    component.adminModel.routeUrl = '/';
    component.saveSubscription();
  });
  it('should call navigationSubscription else condition', () => {
    spyOn(shared, 'on').and.returnValue(of(false));
    component.navigationSubscription();
  });
  it('should call removeDrity', () => {
    component.removeDrity(formGroup);
  });
});
