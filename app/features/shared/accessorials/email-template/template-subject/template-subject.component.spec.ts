import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from './../../../../../app.module';
import { StandardModule } from './../../../../standard/standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { TemplateSubjectComponent } from './template-subject.component';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TemplateSubjectComponent', () => {
  let component: TemplateSubjectComponent;
  let fixture: ComponentFixture<TemplateSubjectComponent>;
  const fb = new FormBuilder();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateSubjectComponent);
    component = fixture.componentInstance;
    component.subjectForm = fb.group({
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
});
