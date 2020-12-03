import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from './../../view-agreement-details.module';
import { RatingRulesService } from './rating-rules.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RatingRulesService', () => {
  let service: RatingRulesService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RatingRulesService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(RatingRulesService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([RatingRulesService], () => {
    expect(service).toBeTruthy();
  }));

  it('getRuleCriteria should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getRuleCriteria();
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('saveRatingRule should call post', () =>  {
    spyOn(http, 'post').and.returnValue('called post');
    service.saveRatingRule({}, 1);
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('getAgreementDetails should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getAgreementDetails(1);
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getBusinessUnitServiceOffering should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getBusinessUnitServiceOffering();
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getContractsList should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getContractsList({});
    expect(http.get).toHaveBeenCalledTimes(1);
  });
  it('getSectionList should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getSectionList({});
  });
  it('editSaveRatingRule should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.editSaveRatingRule({}, 123, 1234);
  });
  it('getRateDetails should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getRateDetails(123, 1234);
  });
});
