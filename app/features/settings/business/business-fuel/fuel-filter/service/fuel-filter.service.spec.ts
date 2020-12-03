import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../app.module';
import { SettingsModule } from '../../../../settings.module';
import { FuelFilterService } from './fuel-filter.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FuelFilterService', () => {

  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }, FuelFilterService],
  }));

  it('should be created', () => {
    const service: FuelFilterService = TestBed.get(FuelFilterService);
    expect(service).toBeTruthy();
  });
});
