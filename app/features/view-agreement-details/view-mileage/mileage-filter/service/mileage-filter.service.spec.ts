import { TestBed, inject } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from './../../../../../app.module';
import { MileageFilterService } from './mileage-filter.service';

describe('MileageFilterService', () => {
  let service: MileageFilterService;
  let http: HttpClient;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, HttpClientTestingModule, AppModule],
      providers: [MileageFilterService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  beforeEach(() => {
    service = TestBed.get(MileageFilterService);
    http = TestBed.get(HttpClient);
  });
  it('should be created', inject([MileageFilterService], () => {
    expect(service).toBeTruthy();
  }));

});
