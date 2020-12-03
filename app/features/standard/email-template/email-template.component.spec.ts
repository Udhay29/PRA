import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '../../../app.module';
import { StandardModule } from '../standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EmailTemplateComponent } from './email-template.component';
import { EmailTemplateService } from './service/email-template.service';
import { of } from 'rxjs';
import { ViewTemplateModel } from './model/template/view-template.model';
import { By } from '@angular/platform-browser';

describe('EmailTemplateComponent', () => {
  let component: EmailTemplateComponent;
  let fixture: ComponentFixture<EmailTemplateComponent>;
  let templateService: EmailTemplateService;
  const viewModel = new ViewTemplateModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, AppModule, StandardModule],
      declarations: [],
      providers: [EmailTemplateService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    templateService = TestBed.get(EmailTemplateService);
  });

  const response = {
    'took' : 20,
    'timed_out' : false,
    '_shards' : {
      'total' : 3,
      'successful' : 3,
      'skipped' : 0,
      'failed' : 0
    },
    'hits' : {
      'total' : 21,
      'max_score' : 1.0,
      'hits' : [
        {
          '_index' : 'pricing-accessorial-emailtemplate',
          '_type' : 'doc',
          '_id' : '4',
          '_score' : 1.0,
          '_source' : {
            'emailTemplateTypeName' : 'Master',
            'chargeTypeDisplayName' : null,
            'accessorialNotificationTypeName' : null,
            'emailTemplateReferenceNumber' : 'pricing_axs_master_notification',
            'defaultAttachment' : null,
            'emailTemplateConfigurationId' : 4,
            'lastUpdateProgramName' : 'jcnt005',
            'lastUpdateTimestamp' : '08/16/2019 05:57',
            'effectiveTimestamp' : '08/16/2019 05:57:24',
            'expirationTimestamp' : '12/31/2099 23:59:59',
            'accessorialNotificationTypeId' : null,
            'emailTemplateTypeId' : 1,
            'chargeTypeId' : null
          }
        }
      ]
    }
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call masterTemplateExist', () => {
    spyOn(templateService, 'checkMasterTemplate').and.returnValues(of(true));
    component.masterTemplateExist();
  });

  it('should call masterTemplateExist else', () => {
    spyOn(templateService, 'checkMasterTemplate').and.returnValues(of(false));
    component.masterTemplateExist();
  });

  it('should call getGridData', () => {
    spyOn(templateService, 'getTemplateList').and.returnValues(of(response));
    component.getGridData('s', 0, 25, 'templateType', 'asc');
  });

  it('should call loadConfigValuesLazy', () => {
    const element = fixture.debugElement.query(By.css('[name="pTable"]'));
    element.triggerEventHandler('onLazyLoad', {'first': 0, 'row': 25, 'sortOrder': 1});
  });

  it('should call onPage', () => {
    const element = fixture.debugElement.query(By.css('[name="pTable"]'));
    element.triggerEventHandler('onPage', {'first': 0, 'row': 25, 'sortOrder': 1});
  });

  it('should call onSearch', () => {
    const element = fixture.debugElement.query(By.css('[id="fpListSearchText"]'));
    element.triggerEventHandler('keyup', {target: {value: 's'}});
  });

  it('should call onAddTemplate', () => {
    component.onAddTemplate('test');
  });
});
