import { TestBed } from '@angular/core/testing';
import { AppModule } from './../../../../../../app.module';
import { ViewAgreementDetailsModule } from './../../../../view-agreement-details.module';

import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { RatesFilterService } from './rates-filter.service';

import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RatesFilterService', () => {

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [RatesFilterService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
    it('should be created', () => {
      const service: RatesFilterService = TestBed.get(RatesFilterService);
      expect(service).toBeTruthy();
    });
  });
});
