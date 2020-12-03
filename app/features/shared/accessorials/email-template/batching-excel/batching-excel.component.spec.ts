import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchingExcelComponent } from './batching-excel.component';
import { configureTestSuite } from 'ng-bullet';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../../../../../app.module';
import { StandardModule } from '../../../../standard/standard.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('BatchingExcelComponent', () => {
  let component: BatchingExcelComponent;
  let fixture: ComponentFixture<BatchingExcelComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchingExcelComponent);
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
      id: 1,
      name: {
        id: 1,
        name: 'test',
        association: 123
      },
      association: 123
  }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call filterBatchExcelData', () => {
    component.emailTemplateModel.batchingExcelValues = [ {
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
  } ];
  component.emailTemplateModel.batchingExcelSuggestions = [ {
    id: 1,
    name: 'string',
    association: 'string',
    invalid: true
  } ];
    const element = fixture.debugElement.query(By.css('[field="name"]'));
    element.triggerEventHandler('completeMethod', { query: 's' });
  });

  it('should call checkDuplicateBatch', () => {
    component.emailTemplateModel.batchingExcelValues = [ {
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
  } ];
    const element = fixture.debugElement.query(By.css('[field="name"]'));
    element.triggerEventHandler('onSelect', { value: '' });
  });

  it('should call addBatchExcelElement', () => {
    component.emailTemplateModel.batchingExcelValues = [ {
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
    } ];
    component.addBatchExcelElement();
  });

  it('should call addBatchExcelElement else', () => {
    component.emailTemplateModel.batchingExcelValues = [];
    component.addBatchExcelElement();
  });

  it('should call getErrorMessage', () => {
    component.emailTemplateModel.batchingExcelValues = [ {
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
    } ];
    component.getErrorMessage('');
  });

  it('should call getErrorMessage', () => {
    component.emailTemplateModel.batchingExcelValues = [ {
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

  it('should call setFromDefault', () => {
    component.setFromDefault([{
      id: 1,
      name: {
        id: 1,
        name: 'test',
        association: 123
      },
      association: 123
    }]);
  });

  it('should call submit', () => {
    component.emailTemplateModel.batchingExcelValues = [ {
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
    } ];
    component.submit();
  });

  it('should call removeBatchExcelElement', () => {
    component.emailTemplateModel.batchingExcelValues = [ {
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
    } ];
    component.removeBatchExcelElement(0);
  });
});
