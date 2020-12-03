import { TestBed, inject } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '../../../../../app.module';
import { SettingsModule } from './../../../settings.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';


import { ViewChargesQueryService } from './view-charges-query.service';

xdescribe('ViewChargesQueryService', () => {
  let service: ViewChargesQueryService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [ViewChargesQueryService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  beforeEach(() => {
    service = TestBed.get(ViewChargesQueryService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([ViewChargesQueryService], () => {
    expect(service).toBeTruthy();
  }));
});
