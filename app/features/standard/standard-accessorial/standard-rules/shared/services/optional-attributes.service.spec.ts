import { StandardModule } from './../../../../standard.module';
import { AppModule } from './../../../../../../app.module';
import { TestBed, inject  } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';


import { OptionalAttributesService } from './optional-attributes.service';

describe('OptionalAttributesService', () => {
  let service: OptionalAttributesService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      providers: [OptionalAttributesService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(OptionalAttributesService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([OptionalAttributesService], () => {
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
  it('getBusinessUnitServiceOffering should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getBusinessUnitServiceOffering();
    expect(http.get).toHaveBeenCalledTimes(1);
  });
  it('getBUbasedOnChargeType should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getBUbasedOnChargeType('data');
    expect(http.get).toHaveBeenCalledTimes(1);
  });
  it('getEquipmentCategory should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getEquipmentCategory();
    expect(http.get).toHaveBeenCalledTimes(1);
  });
  it('getEquipmentLength should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getEquipmentLength('data');
    expect(http.get).toHaveBeenCalledTimes(1);
  });
});
