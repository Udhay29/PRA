import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from './../../../view-agreement-details.module';
import { CreateFuelProgramService } from './create-fuel-program.service';

describe('CreateFuelProgramService', () => {
  let service: CreateFuelProgramService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [CreateFuelProgramService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(CreateFuelProgramService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([CreateFuelProgramService], () => {
    expect(service).toBeTruthy();
  }));

  it('getAgreementDetails should call get', () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.getAgreementDetails(4);
    expect(http.get).toHaveBeenCalledTimes(1);
  });
});
