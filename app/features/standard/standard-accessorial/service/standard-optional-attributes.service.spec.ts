import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from '../../../../app.module';
import { StandardModule } from '../../standard.module';
import { StandardOptionalAttributesService } from './standard-optional-attributes.service';
import { configureTestSuite } from 'ng-bullet';

describe('CreateStandardDocumentationService', () => {
  let service: StandardOptionalAttributesService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      providers: [StandardOptionalAttributesService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(StandardOptionalAttributesService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([StandardOptionalAttributesService], () => {
    expect(service).toBeTruthy();
  }));
  it('getQuantityType should call get', () =>  {
    service.getChargeTypes();
  });
  it('getQuantityType should call get', () =>  {
    service.getBusinessUnitServiceOffering();
  });
  it('getQuantityType should call get', () =>  {
    service.getBUbasedOnChargeType('1');
  });
  it('getQuantityType should call get', () =>  {
    service.getServiceLevel('test');
  });
  it('getQuantityType should call get', () =>  {
    service.getOperationalServices();
  });
  it('getQuantityType should call get', () =>  {
    service.getEquipmentCategory();
  });
  it('getQuantityType should call get', () =>  {
    service.getEquipmentType('test');
  });
});
