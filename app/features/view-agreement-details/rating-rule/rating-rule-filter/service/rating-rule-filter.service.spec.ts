import { TestBed, inject } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { RatingRuleFilterService } from './rating-rule-filter.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { RatingRuleFilterModel } from '../model/rating-rule-filter.model';
import { Input } from '@angular/core';

describe('RatingRuleFilterService', () => {
  let service: RatingRuleFilterService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, HttpClientTestingModule],
      providers: [RatingRuleFilterService, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(RatingRuleFilterService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getRuleCriteria should call get', inject([RatingRuleFilterService], () => {
    spyOn(http, 'get').and.returnValue('called get');
    service.getRuleCriteria();
    expect(http.get).toHaveBeenCalledTimes(1);
  }));

});
