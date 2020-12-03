import { MessageService } from 'primeng/components/common/messageservice';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateStandardRulesComponent } from './../../create-rules/standard-create-rules.component';
import { AppModule } from './../../../../../../app.module';
import { StandardModule } from './../../../../standard.module';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { ChangeDetectorRef, DebugElement } from '@angular/core';

import { OptionalUtilityService } from './optional-utility.service';

describe('OptionalUtilityService', () => {
  let service: OptionalUtilityService;
  let serviceRef: OptionalUtilityService;
  let http: HttpClient;
  let messageService: MessageService;
  let component: CreateStandardRulesComponent;
  let fixture: ComponentFixture<CreateStandardRulesComponent>;
  const freeRuleBuilder: FormBuilder = new FormBuilder();


  configureTestSuite(() => {
    const changeDetectorRefStub = { detectChanges: () => ({}) };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      providers: [OptionalUtilityService, { provide: APP_BASE_HREF, useValue: '/' },
      { provide: ChangeDetectorRef, useValue: changeDetectorRefStub }, HttpClient],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStandardRulesComponent);
    component = fixture.componentInstance;
    serviceRef = new OptionalUtilityService();
    service = TestBed.get(OptionalUtilityService);
    messageService = TestBed.get(MessageService);
    http = TestBed.get(HttpClient);
    fixture.detectChanges();
  });

  it('should be created', inject([OptionalUtilityService], () => {
    expect(service).toBeTruthy();
  }));
  it('validateOptionalFieldsElse', () => {
    const optionalForm = freeRuleBuilder.group({
      name: ['abc', Validators.required],
      serviceLevel: ['abc', Validators.required]
    });
    component.optionalFields.optionalAttributesModel.optionalForm = optionalForm;
    serviceRef.validateOptionalFields(component.optionalFields.optionalAttributesModel, messageService);
  });
  it('validateOptionalFields', () => {
    const optionalForm = freeRuleBuilder.group({
      name: ['abc', Validators.required],
      serviceLevel: [null, Validators.required]
    });
    component.optionalFields.optionalAttributesModel.optionalForm = optionalForm;
    serviceRef.validateOptionalFields(component.optionalFields.optionalAttributesModel, messageService);
  });
  it('isOptionalFormValid', () => {
    const optionalForm = freeRuleBuilder.group({
      name: ['abc', Validators.required],
      serviceLevel: [null, Validators.required]
    });
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    component.optionalFields.optionalAttributesModel.optionalForm = optionalForm;
    serviceRef.isOptionalFormValid(component.optionalFields.optionalAttributesModel, changeDetectorRefStub);
  });
  it('setDocumentationValid', () => {
    const ratesmodel = {
      isRefreshClicked: true,
      validFields: true
    };
    serviceRef.setDocumentationValid(ratesmodel);
    serviceRef.getDocumentationValid();
  });
});




