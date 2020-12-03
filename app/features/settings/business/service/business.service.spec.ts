import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { SettingsModule} from '../../settings.module';
import { BusinessService } from './business.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BusinessService', () => {
  let service: BusinessService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [BusinessService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  beforeEach(() => {
    service = TestBed.get(BusinessService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([BusinessService], () => {
    expect(service).toBeTruthy();
  }));
  it('getConfigurationValues should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.getConfigurationValues();
    expect(http.get).toHaveBeenCalledTimes(1);
  });
  it('saveConfigurationValues should call put', () => {
    spyOn(http, 'put').and.returnValue('called put');
    service.saveConfigurationValues({});
    expect(http.put).toHaveBeenCalledTimes(1);
  });
});
