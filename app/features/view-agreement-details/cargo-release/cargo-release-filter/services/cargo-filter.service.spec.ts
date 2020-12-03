import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Component, EventEmitter, OnInit, Input, Output, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';

import { CargoFilterService } from './cargo-filter.service';
import { CargoReleaseFilterComponent } from '../cargo-release-filter.component';

describe('CargoFilterService', () => {
  let service: CargoFilterService;
  let http: HttpClient;
  let cargoReleaseFilterComponent: CargoReleaseFilterComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [CargoFilterService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient, CargoReleaseFilterComponent,
        ChangeDetectorRef],
    });
  });

  beforeEach(() => {
    service = TestBed.get(CargoFilterService);
    http = TestBed.get(HttpClient);
    cargoReleaseFilterComponent = TestBed.get(CargoReleaseFilterComponent);
  });

  it('should be created', inject([CargoFilterService], () => {
    expect(service).toBeTruthy();
  }));

  it('it should call getFilterConfig', () => {
    service.getFilterConfig(cargoReleaseFilterComponent);
  });
});
