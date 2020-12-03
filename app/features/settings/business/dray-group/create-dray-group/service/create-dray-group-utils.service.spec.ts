import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ChangeDetectorRef, Component } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { CreateDrayGroupUtilsService } from './create-dray-group-utils.service';
import { AppModule } from '../../../../../../app.module';
import { SettingsModule } from '../../../../../../features/settings/settings.module';
import { HttpClient } from '@angular/common/http';
import { DrayGroupModel } from '../models/dray-group.model';
import { MessageService } from 'primeng/components/common/messageservice';
import { CreateDrayGroupComponent } from '../create-dray-group.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

describe('CreateDrayGroupUtilsService', () => {
  let component: CreateDrayGroupComponent;
  let fixture: ComponentFixture<CreateDrayGroupComponent>;
  let service: CreateDrayGroupUtilsService;
  let http: HttpClient;
  let messageService: MessageService;
  const model = new DrayGroupModel();
  let changeDetector: ChangeDetectorRef;
  let drayGroupForm: FormGroup;
  const formBuilder: FormBuilder = new FormBuilder();

  configureTestSuite(() => {
    const changeDetectorRefStub = { detectChanges: () => ({}) };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [
        CreateDrayGroupUtilsService, HttpClient, { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefStub }
      ]
    });
  });

  const error = {
    error: {
      errors: [{
        'fieldErrorFlag': false,
        'errorMessage':
          `Specified dray group name and dray code is already defined for the specified date period.
            Change dray group name, dray code or edit existing dray group.`,
        'errorType': 'Business Validation Error',
        'fieldName': null,
        'code': 'DRAY_GROUP_NAME_DUPLICATION_EXCEPTION',
        'errorSeverity': 'ERROR'
      }]
    }
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDrayGroupComponent);
    component = fixture.componentInstance;
    service = TestBed.get(CreateDrayGroupUtilsService);
    changeDetector = TestBed.get(ChangeDetectorRef);
    messageService = TestBed.get(MessageService);
    http = TestBed.get(HttpClient);

    drayGroupForm = formBuilder.group({
      drayGroupName: new FormControl('CREATE', [Validators.required]),
      drayGroupCode: new FormControl('CRTE', [Validators.required]),
      rateScopeTypeName: new FormControl('', [Validators.required]),
      effectiveDate: new FormControl('', [Validators.required]),
      expirationDate: new FormControl('', [Validators.required]),
      drayGroupCountries: new FormControl('', [Validators.required])
    });
    component.drayGroupModel.drayGroupForm = drayGroupForm;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should call toastMessage-error', () => {
    service.toastMessage(messageService, 'error', 'You have successfully created new dray group');
  });
  it('should call toastMessage-success', () => {
    service.toastMessage(messageService, 'success', 'You have successfully created new dray group');
  });

  it('should call fieldValidationMessage', () => {
    service.fieldValidationMessage(messageService, 'Missing Required Information', 'You have successfully created new dray group');
  });

  it('should call saveRequestDateFormatter', () => {
    service.saveRequestDateFormatter(new Date('10-08-2018'));
  });

  it('should call handleError', () => {
    service.handleError(error, model, messageService, changeDetector);
  });

  it('should call handleError', () => {
    error.error.errors[0].code = 'DRAY_GROUP_CODE_DUPLICATION_EXCEPTION';
    service.handleError(error, model, messageService, changeDetector);
  });

  it('should call handleError', () => {
    error.error.errors[0].code = 'DRAY_GROUP_NAME_AND_CODE_DUPLICATION_EXCEPTION';
    service.handleError(error, model, messageService, changeDetector);
  });

  it('should call drayGroupPostFramer', () => {
    component.drayGroupModel.drayGroupForm = drayGroupForm;
    component.drayGroupModel.drayGroupForm.controls['drayGroupName'].setValue(' CREATE');
    component.drayGroupModel.drayGroupForm.controls['drayGroupCode'].setValue('CRTE');
    component.drayGroupModel.drayGroupForm.controls['rateScopeTypeName'].setValue('One-Way');
    component.drayGroupModel.drayGroupForm.controls['effectiveDate'].setValue('10-08-2018');
    component.drayGroupModel.drayGroupForm.controls['expirationDate'].setValue('31-12-2099');
    component.drayGroupModel.drayGroupForm.controls['drayGroupCountries'].setValue({
      drayGroupCountryCode: 154,
      drayGroupCountryName: 'USA'
    });
    component.drayGroupModel.scopeObj = [{
      drayGroupCountryCode: 1,
      drayGroupCountryName: 'string'
    }];
    service.drayGroupPostFramer(component.drayGroupModel);
  });

});
