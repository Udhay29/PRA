import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from './../../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../../view-agreement-details.module';

import { DocumentationFilterService } from './documentation-filter.service';
import { DocumenationFilterUtilityService } from './documenation-filter-utility.service';
import { DocumentationFilterComponent } from '../documentation-filter.component';

  describe('DocumentationFilterService', () => {
    let service: DocumentationFilterService;
    let documentFilterComp: DocumentationFilterComponent;
    let documentFilterFixture: ComponentFixture<DocumentationFilterComponent>;
    let http: HttpClient;
    configureTestSuite(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, HttpClientModule, HttpClientTestingModule, AppModule, ViewAgreementDetailsModule],
        providers: [DocumentationFilterService, DocumenationFilterUtilityService, { provide: APP_BASE_HREF, useValue: '/' }],
      });
    });
  beforeEach(() => {
    service = TestBed.get(DocumentationFilterService);
    documentFilterFixture = TestBed.createComponent(DocumentationFilterComponent);
    documentFilterComp = documentFilterFixture.componentInstance;
    http = TestBed.get(HttpClient);
  });
  it('should be created', inject([DocumentationFilterService], () => {
    expect(service).toBeTruthy();
  }));
  it('should call getFilterConfig', () => {
    service.getFilterConfig(2, documentFilterComp);
  });
});
