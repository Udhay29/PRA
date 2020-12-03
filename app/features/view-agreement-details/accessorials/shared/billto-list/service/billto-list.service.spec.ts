import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../app.module';
import { ViewAgreementDetailsModule } from './../../../../view-agreement-details.module';


import { BilltoListService } from './billto-list.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BilltoListService', () => {

  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
    providers: [BilltoListService, { provide: APP_BASE_HREF, useValue: '/' }],
  }));

  it('should be created', () => {
    const service: BilltoListService = TestBed.get(BilltoListService);
    expect(service).toBeTruthy();
  });
});
