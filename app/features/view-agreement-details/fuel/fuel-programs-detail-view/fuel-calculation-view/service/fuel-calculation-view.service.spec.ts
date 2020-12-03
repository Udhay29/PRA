import { TestBed } from '@angular/core/testing';

import { FuelCalculationViewService } from './fuel-calculation-view.service';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../../../view-agreement-details/view-agreement-details.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FuelCalculationViewService', () => {
  let service: FuelCalculationViewService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [FuelCalculationViewService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    service = TestBed.get(FuelCalculationViewService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', () => {
    const fuelCalculationViewService: FuelCalculationViewService = TestBed.get(FuelCalculationViewService);
    expect(service).toBeTruthy();
  });
});
