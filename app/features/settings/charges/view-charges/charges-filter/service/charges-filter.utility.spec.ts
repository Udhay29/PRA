import { RootObject } from './../../../../../search-agreement/advance-search/model/advance-search-interface';
import { ChargesFilterUtility } from './charges-filter.utility';
import { ViewChargesQueryService } from '../../services/view-charges-query.service';
import { ViewChargesQuery } from '../../query/view-charges.query';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ChargesFilterService } from '../service/charge-filter.service';
import { ChargesFilterComponent } from '../charges-filter.component';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

describe('ChargesFilterUtility', () => {
  let component: ChargesFilterComponent;
  let fixture: ComponentFixture<ChargesFilterComponent>;
  let service: ChargesFilterUtility;

  configureTestSuite(() => {
    const changeDetectorRefStub = {};
    const chargesFilterServiceStub = { getFilterConfig: (arg1, arg2) => ({}) };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ChargesFilterComponent],
      providers: [
        { provide: ChangeDetectorRef, useValue: changeDetectorRefStub },
        { provide: ChargesFilterService, ViewChargesQueryService, useValue: chargesFilterServiceStub },
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(ChargesFilterUtility);
    fixture = TestBed.createComponent(ChargesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const serviceOfferingresponse = {
    'took': 29,
    'timed_out': false,
    '_shards': {
      'total': 3,
      'successful': 3,
      'skipped': 0,
      'failed': 0
    },
    'hits': {
      'total': 8,
      'max_score': 6.0,
      'hits': [
        {
          '_index': 'pricing-charge',
          '_type': 'doc',
          '_id': '4',
          '_score': 6.0,
          '_source': {
            'businessUnitServiceOffering': 1
          },
          'fields': {
            'Status': 'active'

          },
          'sort': [
            'dcs-backhaul'
          ]
        }
      ]
    },
    'aggregations': {
      'nesting': {
        'doc_count': 1,
        'count': {
          'value': 1
        }
      }

    }
  };

  it('should call ChargesFilterService', () => {
    expect(service).toBeTruthy();
  });

  it('should call businessUnitFramer', () => {
    const data = [
      {
        title: 'Business Unit',
        url: 'api/pricing-charge/_search',
        query: ViewChargesQueryService.getElasticparam(),
        callback: ChargesFilterUtility.businessUnitFramer,
        inputFlag: true
      }];

    const response = {
      'took': 29,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 8,
        'max_score': 6.0,
        'hits': [
          {
            '_index': 'pricing-charge',
            '_type': 'doc',
            '_id': '4',
            '_score': 6.0,
            '_source': {
              'businessUnitServiceOffering': 1
            },
            'fields': {
              'Status': 'active'

            },
            'sort': [
              'dcs-backhaul'
            ]
          }
        ]
      },
      'aggregations': {
        'nesting': {
          'doc_count': 1,
          'count': {
            'value': 1
          }
        }

      }
    };
    spyOn(ChargesFilterService.prototype, 'getFilterConfig').and.returnValues(of(data));
    ChargesFilterUtility.businessUnitFramer(response);
  });
  it('should call serviceOfferingFramer', () => {
    const data = [
      {
        title: 'Business Unit',
        url: 'api/pricing-charge/_search',
        query: ViewChargesQueryService.getElasticparam(),
        callback: ChargesFilterUtility.serviceOfferingFramer,
        inputFlag: true
      }];

    const serviceOfferingresponse1 = {
      'took': 29,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 8,
        'max_score': 6.0,
        'hits': [
          {
            '_index': 'pricing-charge',
            '_type': 'doc',
            '_id': '4',
            '_score': 6.0,
            '_source': {
              'businessUnitServiceOffering': 1
            },
            'fields': {
              'Status': 'active'

            },
            'sort': [
              'dcs-backhaul'
            ]
          }
        ]
      },
      'aggregations': {
        'nesting': {
          'doc_count': 1,
          'count': {
            'value': 1
          }
        }

      }
    };
    spyOn(ChargesFilterService.prototype, 'getFilterConfig').and.returnValues(of(data));
    ChargesFilterUtility.serviceOfferingFramer(serviceOfferingresponse1);
  });

  it('should call chargeTypeFramer', () => {
    const data = [
      {
        title: 'Business Unit',
        url: 'api/pricing-charge/_search',
        query: ViewChargesQueryService.getElasticparam(),
        callback: ChargesFilterUtility.serviceOfferingFramer,
        inputFlag: true
      }];

    spyOn(ChargesFilterService.prototype, 'getFilterConfig').and.returnValues(of(data));
    ChargesFilterUtility.chargeTypeFramer(serviceOfferingresponse);
  });

  it('should call rateTypeFramer', () => {
    const data = [
      {
        title: 'Business Unit',
        url: 'api/pricing-charge/_search',
        query: ViewChargesQueryService.getElasticparam(),
        callback: ChargesFilterUtility.serviceOfferingFramer,
        inputFlag: true
      }];

    spyOn(ChargesFilterService.prototype, 'getFilterConfig').and.returnValues(of(data));
    ChargesFilterUtility.rateTypeFramer(serviceOfferingresponse);
  });

  it('should call quantityRequiredFramer', () => {
    const data = [
      {
        title: 'Business Unit',
        url: 'api/pricing-charge/_search',
        query: ViewChargesQueryService.getElasticparam(),
        callback: ChargesFilterUtility.serviceOfferingFramer,
        inputFlag: true
      }];

    spyOn(ChargesFilterService.prototype, 'getFilterConfig').and.returnValues(of(data));
    ChargesFilterUtility.quantityRequiredFramer(serviceOfferingresponse);
  });

  it('should call usageTypeFramer', () => {
    const data = [
      {
        title: 'Business Unit',
        url: 'api/pricing-charge/_search',
        query: ViewChargesQueryService.getElasticparam(),
        callback: ChargesFilterUtility.serviceOfferingFramer,
        inputFlag: true
      }];

    spyOn(ChargesFilterService.prototype, 'getFilterConfig').and.returnValues(of(data));
    ChargesFilterUtility.usageTypeFramer(serviceOfferingresponse);
  });


});
