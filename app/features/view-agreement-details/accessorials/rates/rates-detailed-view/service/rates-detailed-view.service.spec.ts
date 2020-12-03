import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../app.module';
import { ViewAgreementDetailsModule } from './../../../../view-agreement-details.module';

import { RatesDetailedViewService } from './rates-detailed-view.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RatesDetailedViewService', () => {

  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
    providers: [RatesDetailedViewService, { provide: APP_BASE_HREF, useValue: '/' }],
  }));

  it('should be created', () => {
    const service: RatesDetailedViewService = TestBed.get(RatesDetailedViewService);
    expect(service).toBeTruthy();
  });
});
