import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';

import { ViewAgreementDetailsModule } from './../../../../view-agreement-details/view-agreement-details.module';

import { LineHaulDetailsService } from './line-haul-details.service';

describe('LineHaulDetailsService', () => {

  let service: LineHaulDetailsService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [LineHaulDetailsService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(LineHaulDetailsService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([LineHaulDetailsService], () => {
    expect(service).toBeTruthy();
  }));

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

  it('should be getCityState', () => {
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

  it('should be getCarrierData', () => {
    const data = {
      'query': {
        'bool': {
          'must': [
            {
              'match': {
                'CarrierStatus': 'A'
              }
            }
          ]
        }
      },
      'from': 0,
      'size': 100,
      '_source': [
        'LegalName',
        'CarrierCode',
        'CarrierID'
      ]
    };
    service.getCarrierData(data);
  });
});
