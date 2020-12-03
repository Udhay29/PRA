import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '../../../../app.module';
import { StandardModule } from '../../standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { CreateTemplateComponent } from './create-template.component';
import { EmailTemplateService } from '../service/email-template.service';
import { DefaultExcelComponent } from '../../../shared/accessorials/email-template/default-excel/default-excel.component';
import { BatchingExcelComponent } from '../../../shared/accessorials/email-template/batching-excel/batching-excel.component';

describe('CreateTemplateComponent', () => {
  let component: CreateTemplateComponent;
  let fixture: ComponentFixture<CreateTemplateComponent>;
  let batchComponent: BatchingExcelComponent;
  let batchFixture: ComponentFixture<BatchingExcelComponent>;
  let defaultComponent: DefaultExcelComponent;
  let defaultFixture: ComponentFixture<DefaultExcelComponent>;
  const fb = new FormBuilder();
  let emailTemplateService: EmailTemplateService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, AppModule, StandardModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTemplateComponent);
    component = fixture.componentInstance;
    batchFixture = TestBed.createComponent(BatchingExcelComponent);
    batchComponent = batchFixture.componentInstance;
    defaultFixture = TestBed.createComponent(DefaultExcelComponent);
    defaultComponent = defaultFixture.componentInstance;
    component.templateModel.templateForm = fb.group({
      subjectText: [''],
      subjectDataElements: [''],
      introParagraph: fb.array([fb.group({text: ['', Validators.required]})]),
      bodyDataElements: [''],
      conclusionParagraph: fb.array([fb.group({text: ['']})]),
      signatureLine: fb.array([fb.group({text: ['']})])
    });
    emailTemplateService = fixture.debugElement.injector.get(EmailTemplateService);
    component.defaultComponent = defaultComponent;
    component.batchingComponent = batchComponent;
    fixture.detectChanges();
  });

  const masterResponse = {
    'emailTemplateConfigurationId' : 29,
    'emailTemplateReferenceNumber' : 'pricing_axs_master_notification',
    'emailTemplateType' : {
      'emailTemplateTypeId' : 1,
      'emailTemplateTypeName' : 'Master',
      'effectiveDate' : '2019-08-15',
      'expirationDate' : '2099-12-31'
    },
    'accessorialNotificationType' : null,
    'chargeTypeId' : null,
    'chargeTypeDisplayName' : null,
    'chargeTypeCode' : null,
    'effectiveTimestamp' : '2019-08-22T07:34:07.338Z',
    'expirationTimestamp' : '2100-01-01T00:00:00Z',
    'lastUpdateProgramName' : 'Silambarasan Paramasivam',
    'lastUpdateUserId' : 'jcnt005',
    'lastUpdateTimestamp' : '2019-08-22T07:34:07.439',
    'defaultAttachment' : null,
    'emailTemplateTexts' : [ {
      'emailTemplateTextId' : 147,
      'emailTemplateConfigurationId' : 29,
      'emailTemplatePartType' : {
        'emailTemplatePartTypeId' : 6,
        'emailTemplatePartTypeName' : 'Email Body Introduction',
        'effectiveDate' : '2019-08-15',
        'expirationDate' : '2099-12-31'
      },
      'emailTemplateText' : 'Sample',
      'emailTemplateTextSequenceNumber' : 1
    }, {
      'emailTemplateTextId' : 148,
      'emailTemplateConfigurationId' : 29,
      'emailTemplatePartType' : {
        'emailTemplatePartTypeId' : 7,
        'emailTemplatePartTypeName' : 'Email Body Conclusion',
        'effectiveDate' : '2019-08-15',
        'expirationDate' : '2099-12-31'
      },
      'emailTemplateText' : 'Sample',
      'emailTemplateTextSequenceNumber' : 1
    }, {
      'emailTemplateTextId' : 149,
      'emailTemplateConfigurationId' : 29,
      'emailTemplatePartType' : {
        'emailTemplatePartTypeId' : 5,
        'emailTemplatePartTypeName' : 'Signature',
        'effectiveDate' : '2019-08-15',
        'expirationDate' : '2099-12-31'
      },
      'emailTemplateText' : '',
      'emailTemplateTextSequenceNumber' : 1
    }, {
      'emailTemplateTextId' : 150,
      'emailTemplateConfigurationId' : 29,
      'emailTemplatePartType' : {
        'emailTemplatePartTypeId' : 1,
        'emailTemplatePartTypeName' : 'Subject',
        'effectiveDate' : '2019-08-15',
        'expirationDate' : '2099-12-31'
      },
      'emailTemplateText' : 'Sample',
      'emailTemplateTextSequenceNumber' : 1
    } ],
    'emailTemplatePartAttributes' : null
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getEmailTemplateTypes', () => {
    const response = {
      _embedded: {
        emailTemplateTypes: [{emailTemplateTypeId: 1, emailTemplateTypeName: 'Master'}]
      }
    };
    spyOn(emailTemplateService, 'getEmailTemplateTypes').and.returnValue(of(response));
    component.getEmailTemplateTypes();
  });

  it('should call getEmailTemplatePartTypes', () => {
    const response = {
      _embedded: {
        emailTemplatePartTypes: [{emailTemplatePartTypeId: 1, emailTemplatePartTypeName: 'Subject'},
        {emailTemplatePartTypeId: 2, emailTemplatePartTypeName: 'Signature'}]
      }
    };
    const dataElements = {
      _embedded: {
        emailTemplateAttributeAssociations: [{
          emailTemplateAttribute: {
            emailTemplateAttributeId: 123,
            emailTemplateAttributeName: 'test'
          }, emailTemplateAttributeAssociationId: 1
        }]
      }
    };
    spyOn(emailTemplateService, 'getEmailTemplatePartTypes').and.returnValue(of(response));
    spyOn(emailTemplateService, 'getDataElements').and.returnValue(of(dataElements));
    component.getEmailTemplatePartTypes();
  });

  it('should call saveTemplate when form invalid', () => {
    component.saveTemplate();
  });

  it('should call closePopup', () => {
    component.closePopup();
  });

  it('should call cancelTemplate when is not dirty', () => {
    component.cancelTemplate();
  });

  it('should call onProceed', () => {
    component.onProceed();
  });

  it('should call getMasterTemplateDetails', () => {
    spyOn(emailTemplateService, 'getMasterTemplateDetails').and.returnValue(of(masterResponse));
    component.getMasterTemplateDetails();
  });

  it('should call afterDefaultToggle/afterToggle', () => {
    component.afterDefaultToggle(true);
    component.afterToggle(true);
  });

  it('should call markAllFields', () => {
    component.markAllFields();
  });

  it('should call setDefaultElements/setBatchElements', () => {
    const param = [{
      id: 1,
      name: 'string',
      association: 'string'
    }];
    component.setDefaultElements(param);
    component.setBatchElements(param);
  });

  it('should call showPopUp', () => {
    component.showPopUp('remove');
  });

  it('should call isAttachmentsValid', () => {
    component.templateModel.activeRoute = 'default';
    component.templateModel.isDefaultExcel = true;
    component.defaultComponent = defaultComponent;
    component.batchingComponent = batchComponent;
    component.batchingComponent.emailTemplateModel.batchingExcelValues = [{
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
    }];
    component.defaultComponent.emailTemplateModel.defaultExcelValues = [{
      id: 1,
      name: 'string',
      association: 'string',
      invalid: true
    }];
    component.isAttachmentsValid();
  });

  it('should call isAttachmentsValid else', () => {
    component.templateModel.activeRoute = 'master';
    component.isAttachmentsValid();
  });

});
