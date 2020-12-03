import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { SearchAgreementModule } from '../../search-agreement.module';
import { AdvanceSearchService } from './advance-search.service';
import { AppModule } from '../../../../app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdvanceSearchService', () => {
  let service: AdvanceSearchService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SearchAgreementModule, HttpClientTestingModule],
      providers: [AdvanceSearchService, { provide: APP_BASE_HREF, useValue: '/' }],
    });
  });

  beforeEach(() => {
    service = TestBed.get(AdvanceSearchService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([AdvanceSearchService], () => {
    expect(service).toBeTruthy();
  }));

  it('getAgreementType should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getAgreementType();
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getSearchResults should call post', () =>  {
    spyOn(http, 'post').and.returnValue('called post');
    service.getSearchResults({});
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('getCarrierSearchResults should call post', () =>  {
    spyOn(http, 'post').and.returnValue('called post');
    service.getCarrierSearchResults({});
    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('getCodeStatus should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getCodeStatus('customerAgreementSection');
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('getCarrierStatus should call get', () =>  {
    spyOn(http, 'get').and.returnValue('called get');
    service.getCarrierStatus('carrier');
    expect(http.get).toHaveBeenCalledTimes(1);
  });
});
