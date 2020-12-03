import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../app.module';

import { ViewAgreementDetailsModule } from './../../../../../view-agreement-details/view-agreement-details.module';

import { OverviewService } from './overview.service';

describe('OverviewService', () => {
  let service: OverviewService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [OverviewService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(OverviewService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([OverviewService], () => {
    expect(service).toBeTruthy();
  }));

  it('should be getServiceLevel', () => {
    service.getServiceLevel('url');
  });

  it('should be getEquipmentCategory', () => {
    service.getEquipmentCategory();
  });

  xit('should be getEquipmentType', () => {
    service.getEquipmentType('url');
  });

  it('should be getEquipmentLength', () => {
    service.getEquipmentLength('url');
  });

  it('should be getAwardStatus', () => {
    service.getAwardStatus();
  });

  it('should be getBusinesUnit', () => {
    service.getBusinesUnit();
  });

  xit('should be getServiceOffering', () => {
    service.getServiceOffering('BU');
  });

  it('should be getPriorityNumber', () => {
    const data = {
      originID: 3,
      destinationID: 4
    };
    service.getPriorityNumber(data);
  });

  it('should be onSaveManualDetails', () => {
    service.onSaveManualDetails(12, '2019-06-03', '2019-06-03');
  });

  it('should be getOperationalServices', () => {
    const data = 'businessUnit=DCS&serviceOffering=Dedicated&serviceCategoryCode=ReqServ';
    service.getOperationalServices(data);
  });
});
