import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../app.module';
import { ViewAgreementDetailsModule } from './../../../../view-agreement-details.module';
import { FuelPriceViewService } from './fuel-price-view.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FuelPriceViewService', () => {

  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
    providers: [FuelPriceViewService, { provide: APP_BASE_HREF, useValue: '/' }],
  }));

  it('should be created', () => {
    const service: FuelPriceViewService = TestBed.get(FuelPriceViewService);
    expect(service).toBeTruthy();
  });
});
