import { AppModule } from './../../../../../app.module';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { HttpClient } from '@angular/common/http';
import { SectionsFilterService } from './sections-filter.service';

describe('SectionsFilterService', () => {
  let service: SectionsFilterService;
  let http: HttpClient;

  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, HttpClientTestingModule],
    providers: [HttpClient, { provide: APP_BASE_HREF, useValue: '/' }, SectionsFilterService],
  }));

  beforeEach(() => {
    service = TestBed.get(SectionsFilterService);
    http = TestBed.get(HttpClient);
  });
});

