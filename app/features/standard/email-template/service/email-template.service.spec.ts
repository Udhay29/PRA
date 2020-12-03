import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '../../../../app.module';
import { StandardModule } from '../../standard.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EmailTemplateService } from './email-template.service';

describe('EmailTemplateService', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, AppModule, StandardModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  it('should be created', () => {
    const service: EmailTemplateService = TestBed.get(EmailTemplateService);
    expect(service).toBeTruthy();
  });

  it('should call saveEmailTemplate', () => {
    const service: EmailTemplateService = TestBed.get(EmailTemplateService);
    service.saveEmailTemplate({});
  });

  it('should call getDataElements', () => {
    const service: EmailTemplateService = TestBed.get(EmailTemplateService);
    service.getDataElements(1);
  });

});
