import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from './../../../../../app.module';
import { StandardModule } from './../../../../standard/standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TemplateSignatureComponent } from './template-signature.component';
import { FormBuilder } from '@angular/forms';

describe('TemplateSignatureComponent', () => {
  let component: TemplateSignatureComponent;
  let fixture: ComponentFixture<TemplateSignatureComponent>;
  const fb = new FormBuilder();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateSignatureComponent);
    component = fixture.componentInstance;
    component.signatureForm = fb.group({
      subjectText: [''],
      subjectDataElements: [''],
      introParagraph: fb.array([fb.group({text: ['']})]),
      bodyDataElements: [''],
      conclusionParagraph: fb.array([fb.group({text: ['']})]),
      signatureLine: fb.array([fb.group({text: ['']})])
    });
    component.masterData = {
      'signatureLine': [{
        value: 'test'
      }]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call removeControl', () => {
    component.removeControl(0, 'signatureLine', 'signatureSave');
  });

  it('should call getSignatureError', () => {
    component.submitStatus = {
      status: true,
      introParagraph: false,
      conclusionParagraph: false,
      signatureLine: false
    };
    component.getSignatureError('signatureLine', 'signatureSave');
  });

  it('should call onCancel', () => {
    component.onCancel();
  });

  it('should call addControl to skip', () => {
    component.submitStatus = {
      status: true,
      introParagraph: false,
      conclusionParagraph: false,
      signatureLine: false
    };
    component.addControl('signatureLine', 'signatureSave');
  });

  it('should call addControl to add', () => {
    component.submitStatus = {
      status: true,
      introParagraph: false,
      conclusionParagraph: false,
      signatureLine: false
    };
    component.signatureForm.controls.signatureLine['controls'][0]['controls']['text'].setValue('test');
    component.addControl('signatureLine', 'signatureSave');
  });

  it('should call onProceed', () => {
    component.submitStatus = {
      status: true,
      introParagraph: false,
      conclusionParagraph: false,
      signatureLine: false
    };
    component.emailTemplateModel.indexToRemove = 0;
    component.emailTemplateModel.controlNameToRemove = 'signatureLine';
    component.onProceed();
  });

});
