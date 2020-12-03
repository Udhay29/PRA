import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from './../../../../../app.module';
import { StandardModule } from './../../../../standard/standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { FormBuilder, FormArray } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TemplateBodyComponent } from './template-body.component';
import { By } from '@angular/platform-browser';

describe('TemplateBodyComponent', () => {
  let component: TemplateBodyComponent;
  let fixture: ComponentFixture<TemplateBodyComponent>;
  const fb = new FormBuilder();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateBodyComponent);
    component = fixture.componentInstance;
    component.bodyForm = fb.group({
      subjectText: [''],
      subjectDataElements: [''],
      introParagraph: fb.array([fb.group({text: ['']})]),
      bodyDataElements: [''],
      conclusionParagraph: fb.array([fb.group({text: ['']})]),
      signatureLine: fb.array([fb.group({text: ['']})])
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call removeControl', () => {
    component.removeControl(0, 'introParagraph', 'introSave');
  });

  it('shoul call getIntroError', () => {
    component.submitStatus = {
      status: true,
      introParagraph: false,
      conclusionParagraph: false,
      signatureLine: false
    };
    component.getIntroError('introParagraph', 'introSave');
  });

  it('should call onCancel', () => {
    component.onCancel();
  });

  it('should call addControl', () => {
    component.submitStatus = {
      status: true,
      introParagraph: false,
      conclusionParagraph: false,
      signatureLine: false
    };
    component.addControl('introParagraph', 'introSave');
  });

  it('should call addControl to add', () => {
    component.submitStatus = {
      status: true,
      introParagraph: false,
      conclusionParagraph: false,
      signatureLine: false
    };
    component.bodyForm.controls.introParagraph['controls'][0]['controls']['text'].setValue('test');
    component.addControl('introParagraph', 'introSave');
  });
  it('should call filterSubjectData', () => {
    component.dataElements = [{
      id: 1,
      name: 'string',
      association: 'string'
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="bodyDataElements"]'));
    element.triggerEventHandler('completeMethod', {'query': 's'});
  });

});
