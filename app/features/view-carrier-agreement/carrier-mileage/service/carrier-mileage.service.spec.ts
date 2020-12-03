import { TestBed } from '@angular/core/testing';

import { CarrierMileageService } from './carrier-mileage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../../../../app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SettingsModule } from '../../../settings/settings.module';
import { ViewChargesService } from '../../../settings/charges/view-charges/services/view-charges.service';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { HttpClient } from '@angular/common/http';

describe('CarrierMileageService', () => {
  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
    providers: [ViewChargesService, HttpClient, CarrierMileageService, { provide: APP_BASE_HREF, useValue: '/' }],
  }));
  it('should be created', () => {
    const service: CarrierMileageService = TestBed.get(CarrierMileageService);
    expect(service).toBeTruthy();
  });
});
