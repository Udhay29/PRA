import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../app.module';
import { ViewAgreementDetailsModule } from './../../../../view-agreement-details.module';

import { ContractListService } from './contract-list.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContractListService', () => {

  configureTestSuite(() => TestBed.configureTestingModule({ imports: [
    RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
    providers: [ContractListService, { provide: APP_BASE_HREF, useValue: '/' }], }));

  it('should be created', () => {
    const service: ContractListService = TestBed.get(ContractListService);
    expect(service).toBeTruthy();
  });
});
