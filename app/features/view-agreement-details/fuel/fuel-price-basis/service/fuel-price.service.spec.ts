import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from './../../../view-agreement-details.module';

import { FuelPriceService } from './fuel-price.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FuelPriceService', () => {

  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
    providers: [FuelPriceService, { provide: APP_BASE_HREF, useValue: '/' }],
  }));

  it('should be created', () => {
    const service: FuelPriceService = TestBed.get(FuelPriceService);
    expect(service).toBeTruthy();
  });
});


