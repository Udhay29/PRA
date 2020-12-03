import { StairStepModule } from './../../stair-step.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from './../../../../../../app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { AddStairStepService } from './add-stair-step.service';
import { configureTestSuite } from 'ng-bullet';

describe('AddStairStepService', () => {
  let service: AddStairStepService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StairStepModule, HttpClientTestingModule],
      providers: [AddStairStepService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(AddStairStepService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([AddStairStepService], () => {
    expect(service).toBeTruthy();
  }));
});
