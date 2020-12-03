import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { HttpClient } from '@angular/common/http';
import { SectionFilterUtility } from './sections-filter.utility';
import { AppModule } from './../../../../../app.module';
import { SectionsFilterQuery } from '../query/sections-filter.query';
import { SectionsFilterService } from '../services/sections-filter.service';
import { of } from 'rxjs';
describe('SectionFilterUtility', () => {
  let service: SectionFilterUtility;
  let http: HttpClient;
  const rootObjectMock = {
    took: 123456,
    timed_out: true,
    _shards: {
        total: 123456,
        successful: 123456,
        skipped: 123456,
        failed: 123456
    },
    hits: {
        total: 123456,
        max_score: 123456,
        hits: [{
            _index: '01',
            _type: '01',
            _id: '01',
            _score: 12345,
            _source:  {
              businessUnitServiceOffering: 123,
            },
            fields: {
                Status: '01',
                ContractRanges: ['01', '02']
            },
            sort: ['01', '02']
        }]
    },
    aggregations: {
        nesting: {
            doc_count: 123456,
            count: {
                value: 123456
            },
            by_contractname: {
              doc_count: 0,
              contractname: {
                  doc_count_error_upper_bound: 0,
                  sum_other_doc_count: 0,
                  buckets: []
              }
          }
      }
        }

};

  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, HttpClientTestingModule],
    providers: [HttpClient, { provide: APP_BASE_HREF, useValue: '/' }, SectionFilterUtility],
  }));

  beforeEach(() => {
    service = TestBed.get(SectionFilterUtility);
    http = TestBed.get(HttpClient);
  });

  it('should call sectionDataFramer', () => {
    service.sectionDataFramer(rootObjectMock);
});
it('should call sectionTypeFramer', () => {
  service.sectionTypeFramer(rootObjectMock);
});
it('should call currencyFramer', () => {
  const data = [
    {
      title: 'Currency',
        url: 'api/pricing-charge/_search',
        query: SectionsFilterQuery.getCurrencyNameQuery(48),
        callback: service.currencyFramer,
      inputFlag: true
    }];

    spyOn(SectionsFilterService.prototype, 'getFilterConfig').and.returnValues(of(data));
    service.currencyFramer(rootObjectMock);
});
it('should call getBillToCodesFramer', () => {
  const data = [
    {
      title: 'Bill To Code',
        url: 'api/pricing-charge/_search',
        query: SectionsFilterQuery.getCurrencyNameQuery(48),
        callback: service.getBillToCodesFramer,
      inputFlag: true
    }];

    spyOn(SectionsFilterService.prototype, 'getFilterConfig').and.returnValues(of(data));
    service.getBillToCodesFramer(rootObjectMock);
});
it('should call contractFramer', () => {
  const data = [
    {
      title: 'Contract',
        url: 'api/pricing-charge/_search',
        query: SectionsFilterQuery.getCurrencyNameQuery(48),
        callback: service.contractFramer,
      inputFlag: true
    }];

    spyOn(SectionsFilterService.prototype, 'getFilterConfig').and.returnValues(of(data));
    service.contractFramer(rootObjectMock);
});

it('should call getLastUpdatedProgramFramer', () => {
  const data = [
    {
      title: 'Last Update Program',
        url: 'api/pricing-charge/_search',
        query: SectionsFilterQuery.getCurrencyNameQuery(48),
        callback: service.getLastUpdatedProgramFramer,
      inputFlag: true
    }];

    spyOn(SectionsFilterService.prototype, 'getFilterConfig').and.returnValues(of(data));
  service.getLastUpdatedProgramFramer(rootObjectMock);
});
it('should call getCreatedProgramFramer', () => {
  const data = [
    {
      title: 'Create Program',
        url: 'api/pricing-charge/_search',
        query: SectionsFilterQuery.getCurrencyNameQuery(48),
        callback: service.getCreatedProgramFramer,
      inputFlag: true
    }];

    spyOn(SectionsFilterService.prototype, 'getFilterConfig').and.returnValues(of(data));
  service.getCreatedProgramFramer(rootObjectMock);
});
it('should call getCreatedUserFramer', () => {
  service.getCreatedUserFramer(rootObjectMock);
});
it('should call getLastUpdatedUserFramer', () => {
  service.getLastUpdatedUserFramer(rootObjectMock);
});
});
