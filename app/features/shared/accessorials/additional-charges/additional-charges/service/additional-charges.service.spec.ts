import { ViewAgreementDetailsModule } from './../../../../../view-agreement-details/view-agreement-details.module';
import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { AdditionalChargesService } from './additional-charges.service';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from './../../../../../../app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdditionalChargesService', () => {

  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }, AdditionalChargesService],
  }));

  it('should be created', () => {
    const service: AdditionalChargesService = TestBed.get(AdditionalChargesService);
    expect(service).toBeTruthy();
  });
});

