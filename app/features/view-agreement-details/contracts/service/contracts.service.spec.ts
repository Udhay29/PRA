import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { AppModule } from './../../../../app.module';
import { ContractsService } from './contracts.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContractsService', () => {

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [ContractsService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });
});
