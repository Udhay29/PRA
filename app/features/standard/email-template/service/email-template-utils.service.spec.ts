import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '../../../../app.module';
import { StandardModule } from '../../standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EmailTemplateUtilsService } from './email-template-utils.service';
import { TemplateModel } from '../model/template/template-model.model';
import { FormBuilder, Validators } from '@angular/forms';

describe('EmailTemplateUtilsService', () => {
  const fb = new FormBuilder();
  const templateModel = new TemplateModel();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, AppModule, StandardModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  it('should be created', () => {
    const service: EmailTemplateUtilsService = TestBed.get(EmailTemplateUtilsService);
    expect(service).toBeTruthy();
  });

  it('should call getEmailTemplateDataElements', () => {
    const service: EmailTemplateUtilsService = TestBed.get(EmailTemplateUtilsService);
    templateModel.dataElements = ['bodyDataElements'];
    templateModel.templatePartTypes = [{
      id: 1,
      name: 'string',
      association: 'string'
    }];
    templateModel.partTypes = {bodyDataElements: 'string'};
      templateModel.templateForm = fb.group({
        subjectText: ['string'],
        subjectDataElements: ['string'],
        introParagraph: fb.array([fb.group({text: ['string', Validators.required]})]),
        bodyDataElements: [[{id: 1, name: 'string'}]],
        conclusionParagraph: fb.array([fb.group({text: ['string']})]),
        signatureLine: fb.array([fb.group({text: [{id: 1, name: 'string'}]})])
      });
    service.getEmailTemplateDataElements(templateModel);
  });

  it('should call getEmailTemplateTexts', () => {
    const service: EmailTemplateUtilsService = TestBed.get(EmailTemplateUtilsService);
    templateModel.partsToMark = ['introParagraph'];
    templateModel.templatePartTypes = [{
      id: 1,
      name: 'string',
      association: 'string'
    }];
    templateModel.partTypes = {introParagraph: 'string', subjectText: 'string'};
      templateModel.templateForm = fb.group({
        subjectText: ['string'],
        subjectDataElements: ['string'],
        introParagraph: fb.array([fb.group({text: ['string', Validators.required]})]),
        bodyDataElements: [[{id: 1, name: 'string'}]],
        conclusionParagraph: fb.array([fb.group({text: ['string']})]),
        signatureLine: fb.array([fb.group({text: [{id: 1, name: 'string'}]})])
      });
    service.getEmailTemplateTexts(templateModel);
  });

});
