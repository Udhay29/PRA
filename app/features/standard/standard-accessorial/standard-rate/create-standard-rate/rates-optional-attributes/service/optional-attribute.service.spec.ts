import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from './../../../../../../../app.module';
import { StandardModule } from './../../../../../standard.module';
import { OptionalAttributeService } from './optional-attribute.service';

describe('CreateDocumentationUtilsService', () => {
  let service: OptionalAttributeService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      providers: [OptionalAttributeService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(OptionalAttributeService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([OptionalAttributeService], () => {
    expect(service).toBeTruthy();
  }));
  it('getEquipmentType should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getEquipmentType('169');
    expect(http.get).toHaveBeenCalledTimes(1);
  });
  it('getServiceLevel should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getServiceLevel('169');
    expect(http.get).toHaveBeenCalledTimes(1);
  });
  it('getChargeTypes should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getChargeTypes();
    expect(http.get).toHaveBeenCalledTimes(1);
  });
  it('getOperationalServices should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getOperationalServices();
    expect(http.get).toHaveBeenCalledTimes(1);
  });
});
