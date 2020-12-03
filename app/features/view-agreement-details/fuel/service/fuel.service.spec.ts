import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';

import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';

import { FuelService } from './fuel.service';

describe('FuelService', () => {

  let service: FuelService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [FuelService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(FuelService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([FuelService], () => {
    expect(service).toBeTruthy();
  }));
  it('Fuel list should call post', () =>  {
    spyOn(http, 'post').and.returnValue('called post');
    service.getFuelList({});
    expect(http.post).toHaveBeenCalledTimes(1);
  });
  it('Fuel list should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getMockJson();
    expect(http.get).toHaveBeenCalledTimes(1);
  });
  it('should call set Elastic query', () => {
    service.setElasticparam({});
  });
  it('should call get Elastice query', () => {
    service.getElasticparam();
  });

});
