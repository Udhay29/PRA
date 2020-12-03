import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../../../view-agreement-details/view-agreement-details.module';
import { LineHaulOverviewService } from './line-haul-overview.service';

describe('LineHaulOverviewService', () => {
  let service: LineHaulOverviewService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [LineHaulOverviewService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(LineHaulOverviewService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([LineHaulOverviewService], () => {
    expect(service).toBeTruthy();
  }));

  xit('should be getLineHaulOverView', () => {
    service.getLineHaulOverView(1, '2019-03-06');
  });

  it('should be getOriginPoint', () => {
    const data = {
      '_source': [
        'Address.AddressLine1',
        'Address.CityName',
        'Address.StateCode',
        'Address.CountryName',
        'Address.CountryCode',
        'Address.PostalCode',
        'Address.AddressID'
      ],
      'query': {
        'bool': {
          'filter': {
            'bool': {
              'must': [
                {
                  'query_string': {
                    'analyze_wildcard': 'true',
                    'default_operator': 'and',
                    'fields': [
                      'Address.AddressID'
                    ],
                    'query': 87919
                  }
                }
              ]
            }
          }
        }
      },
      'size': 6
    };
    service.getOriginPoint(data);
  });

  xit('should be getCityState', () => {
    const data = {
      '_source': false,
      'query': {
        'bool': {
          'must': [
            {
              'nested': {
                'path': 'City',
                'query': {
                  'query_string': {
                    'fields': [
                      'City.CityID'
                    ],
                    'query': 37307
                  }
                },
                'inner_hits': {
                  'size': 1,
                  '_source': {
                    'includes': [
                      'City.CityName',
                      'City.State.StateCode'
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    };
    service.getCityState(data);
  });
});
