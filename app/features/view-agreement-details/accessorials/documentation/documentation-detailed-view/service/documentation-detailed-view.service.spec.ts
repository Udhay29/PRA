import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../app.module';
import { ViewAgreementDetailsModule } from './../../../../view-agreement-details.module';

import { DocumentationDetailedViewService } from './documentation-detailed-view.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DocumentationDetailedViewService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
    providers: [DocumentationDetailedViewService, { provide: APP_BASE_HREF, useValue: '/' }],
  }));

  it('should be created', () => {
    const service: DocumentationDetailedViewService = TestBed.get(DocumentationDetailedViewService);
    expect(service).toBeTruthy();
  });

  it('should call getAgreementDetails', () => {
    const service: DocumentationDetailedViewService = TestBed.get(DocumentationDetailedViewService);
    expect(service.getAgreementDetails('100')).toBeTruthy();
  });

  it('should call getDoumentaionDetails', () => {
    const service: DocumentationDetailedViewService = TestBed.get(DocumentationDetailedViewService);
    expect(service.getDoumentaionDetails('100', 1024)).toBeTruthy();
  });

});
