import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultExcelComponent } from './default-excel.component';
import { configureTestSuite } from 'ng-bullet';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../../../../../app.module';
import { StandardModule } from '../../../../standard/standard.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('DefaultExcelComponent', () => {
  let component: DefaultExcelComponent;
  let fixture: ComponentFixture<DefaultExcelComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultExcelComponent);
    component = fixture.componentInstance;
    component.submitStatus = {
      status: true,
      introParagraph: true,
      conclusionParagraph: true,
      signatureLine: true,
      batchingExcel: true,
      defaultExcel: true
    };
    component.dataElements = [{
      emailTemplateAttribute: {
        emailTemplateAttributeId: 1,
        emailTemplateAttributeName: 'string'
    },
      emailTemplateAttributeAssociationId: 1
  }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call filterDefaultExcelData', () => {
    component.emailTemplateModel.defaultExcelValues = [ {
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
  } ];
  component.emailTemplateModel.defaultExcelSuggestions = [ {
    id: 1,
    name: 'string',
    association: 'string',
    invalid: true
  } ];
    const element = fixture.debugElement.query(By.css('[field="name"]'));
    element.triggerEventHandler('completeMethod', { query: 's' });
  });

  it('should call checkDuplicateDefault', () => {
    component.emailTemplateModel.defaultExcelValues = [ {
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
  } ];
    const element = fixture.debugElement.query(By.css('[field="name"]'));
    element.triggerEventHandler('onSelect', { value: '' });
  });

  it('should call addDefaultExcelElement', () => {
    component.emailTemplateModel.defaultExcelValues = [ {
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
    } ];
    component.addDefaultExcelElement();
  });

  it('should call addDefaultExcelElement else', () => {
    component.emailTemplateModel.defaultExcelValues = [];
    component.addDefaultExcelElement();
  });

  it('should call getErrorMessage', () => {
    component.emailTemplateModel.defaultExcelValues = [ {
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
    } ];
    component.getErrorMessage('');
  });

  it('should call getErrorMessage', () => {
    component.emailTemplateModel.defaultExcelValues = [ {
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
    } ];
    component.submitStatus = {
      status: false,
      introParagraph: true,
      conclusionParagraph: true,
      signatureLine: true,
      batchingExcel: true,
      defaultExcel: true
    };
    component.getErrorMessage('');
  });

  it('should call onBatchValueChange', () => {
    const element = fixture.debugElement.query(By.css('[field="name"]'));
    element.triggerEventHandler('onBlur', { target: {value: ''} });
  });

  it('should call submit', () => {
    component.emailTemplateModel.defaultExcelValues = [ {
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
    } ];
    component.submit();
  });

  it('should call removeDefaultExcelElement', () => {
    component.emailTemplateModel.defaultExcelValues = [ {
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
    } ];
    component.removeDefaultExcelElement(0);
  });

  it('should call removeDefaultExcelAttachment', () => {
    component.removeDefaultExcelAttachment();
  });
});
