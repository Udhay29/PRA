import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { SettingsModule } from '../../settings.module';

import { BusinessDefaultValuesComponent } from './business-default-values.component';
import { BusinessService } from './../service/business.service';
import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';


describe('BusinessDefaultValuesComponent', () => {
  let component: BusinessDefaultValuesComponent;
  let fixture: ComponentFixture<BusinessDefaultValuesComponent>;
  let service: BusinessService;
  let canDeactivateGuardService: CanDeactivateGuardService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CanDeactivateGuardService,
      { provide: RouterStateSnapshot, useValue: BusinessDefaultValuesComponent },
      { provide: ActivatedRouteSnapshot, useValue: BusinessDefaultValuesComponent }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessDefaultValuesComponent);
    component = fixture.componentInstance;
    service = TestBed.get(BusinessService);
    canDeactivateGuardService = TestBed.get(CanDeactivateGuardService);
    route = TestBed.get(ActivatedRouteSnapshot);
    state = TestBed.get(RouterStateSnapshot);
    nextState = TestBed.get(RouterStateSnapshot);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call createForm', () => {
    component.createForm();
  });
  it('should call getDefaultValues', () => {
    const configurablesResponse = {
      'configurationParameterDetailDTOs': [
        {
          'configurationParameterDetailID': 292,
          'configurationParameterID': 5,
          'configurationParameterName': 'User Future Date Days',
          'parameterSpecificationTypeID': 2,
          'parameterSpecificationTypeName': 'Max',
          'configurationParameterValue': '5',
          'configurationParameterDetailName': 'user_future_date_days_max'
        }
      ]
    };
    spyOn(service, 'getConfigurationValues').and.returnValue(of(configurablesResponse));
    component.getDefaultValues();
  });
  it('should call findValues', () => {
    const configurationValue = [{
      'configurationParameterDetailID': 292,
      'configurationParameterID': 5,
      'configurationParameterName': 'User Future Date Days',
      'parameterSpecificationTypeID': 2,
      'parameterSpecificationTypeName': 'Max',
      'configurationParameterValue': '5',
      'configurationParameterDetailName': 'user_future_date_days_max'
    }];
    component.findValues(configurationValue);
  });
  it('should call onCancel', () => {
    component.onCancel();
  });
  it('should call onSave for if condition', () => {
    component.defaultValueModel.patchedValues = {
      superUserBackDate: '30',
      superUserDaysAllowed: '30',
      superUserFutureDate: '100',
      userBackDate: '180',
      userDaysAllowed: '30',
      userFutureDate: '100'
    };
    component.defaultValueModel.defaultValuesForm.patchValue({
      superUserBackDate: '35',
      superUserDaysAllowed: '30',
      superUserFutureDate: '100',
      userBackDate: '180',
      userDaysAllowed: '30',
      userFutureDate: '100'
    });
    component.defaultValueModel.defaultValuesForm.markAsDirty();
    component.onSave();
  });
  it('should call onSave for else condition', () => {
    component.defaultValueModel.patchedValues = {
      superUserBackDate: '30',
      superUserDaysAllowed: '30',
      superUserFutureDate: '100',
      userBackDate: '180',
      userDaysAllowed: '30',
      userFutureDate: '100'
    };
    component.defaultValueModel.defaultValuesForm.patchValue({
      superUserBackDate: '30',
      superUserDaysAllowed: '30',
      superUserFutureDate: '100',
      userBackDate: '180',
      userDaysAllowed: '30',
      userFutureDate: '100'
    });
    component.defaultValueModel.defaultValuesForm.markAsPristine();
    component.onSave();
  });
  it('should call checkValidFields for if condition', () => {
    component.defaultValueModel.defaultValuesForm.patchValue({
      superUserBackDate: '30',
      superUserDaysAllowed: '30',
      superUserFutureDate: '100',
      userBackDate: '180',
      userDaysAllowed: '30',
      userFutureDate: '100'
    });
    component.checkValidFields();
  });
  it('should call checkValidFields for else condition', () => {
    component.defaultValueModel.defaultValuesForm.patchValue({
      superUserBackDate: '',
      superUserDaysAllowed: '30',
      superUserFutureDate: '100',
      userBackDate: '',
      userDaysAllowed: '30',
      userFutureDate: '100'
    });
    component.checkValidFields();
  });
  it('should call saveChanges', () => {
    component.saveChanges();
  });
  it('should call saveChanges error', () => {
    const param = {
      'traceid': 'c79945c8fb1d41ba',
      'errors': [
        {
          'fieldErrorFlag': true,
          'errorMessage': 'Field Validation Error',
          'errorType': 'ConfigurationParameterDetailDTO is mandatory',
          'fieldName': 'configurationParameterDetailDTOs',
          'code': 'CONCURRENCY_UPDATE_EXCEPTION',
          'errorSeverity': 'ERROR'
        }
      ]
    };
    spyOn(service, 'saveConfigurationValues').and.returnValue(of(param));
    component.saveChanges();
  });
  it('should call createRequestParam', () => {
    component.createRequestParam();
  });
  it('should call toastMessage', () => {
    component.toastMessage('success', 'Business Settings Edited', 'You have edited business settings successfully');
  });
  it('should call onPopupCancel', () => {
    component.onPopupCancel();
  });
  it('should call onPopupProceed', () => {
    component.defaultValueModel.routingUrl = '/dashboard';
    component.onPopupProceed();
  });

  it('should call canDeactivate for if', () => {
    component.defaultValueModel.defaultValuesForm.markAsDirty();
    component.defaultValueModel.isPopupVisible = true;
    component.defaultValueModel.routingUrl = nextState.url;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });

  it('should call canDeactivate for else', () => {
    component.defaultValueModel.isChangesSaving = true;
    component.defaultValueModel.routingUrl = nextState.url;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });
});
