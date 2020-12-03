import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { AppModule } from './../../../../../app.module';
import { ContractItemService } from './contract-item.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContractItemService', () => {

  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
    providers: [ContractItemService, { provide: APP_BASE_HREF, useValue: '/' }],
  }));

  it('should be created', () => {
    const service: ContractItemService = TestBed.get(ContractItemService);
    expect(service).toBeTruthy();
  });
});
