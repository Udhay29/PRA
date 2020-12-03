import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { HttpClient } from '@angular/common/http';

import { AppModule } from '../../../../../app.module';
import { SettingsModule } from './../../../settings.module';
import { CreateChargesService } from './create-charges.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateChargesService', () => {
  let service: CreateChargesService;
  let http: HttpClient;
  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
    providers: [CreateChargesService, { provide: APP_BASE_HREF, useValue: '/' }],
  }));
  beforeEach(() => {
    service = TestBed.get(CreateChargesService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([CreateChargesService], () => {
    expect(service).toBeTruthy();
  }));

  it('getBusinessUnit should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.getBusinessUnit();
    expect(http.get).toHaveBeenCalledTimes(1);
  });

});
