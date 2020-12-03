import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { HttpClient } from '@angular/common/http';
import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { ViewMileageService } from './view-mileage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ViewMileageService', () => {
  let service: ViewMileageService;
    let http: HttpClient;

  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
    providers: [ViewMileageService, { provide: APP_BASE_HREF, useValue: '/' }]
  }));
  beforeEach(() => {
    service = TestBed.get(ViewMileageService);
    http = TestBed.get(HttpClient);
  });
  it('should be created', inject([ViewMileageService], () => {
    expect(service).toBeTruthy();
  }));

  it('it should call getMockJson', () => {
    service.getMockJson();
  });
  it('it should call downloadExcel', () => {
    service.downloadExcel({});
  });
});
