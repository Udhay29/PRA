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
import { StopsService } from './stops.service';

describe('StopsService', () => {
  let service: StopsService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [StopsService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(StopsService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([StopsService], () => {
    expect(service).toBeTruthy();
  }));

  it('should be getGeographyTypes', () => {
    service.getGeographyTypes('stop');
  });

  xit('should be getEditStopDetails', () => {
    const addressPoint = {
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
                  'terms': {
                    'Address.AddressID': [
                      74459
                    ]
                  }
                }
              ]
            }
          }
        }
      },
      'size': 6
    };
    const locationPoint = {
      '_source': [
        'LocationID',
        'LocationName',
        'LocationCode',
        'Address',
        'locationtypes'
      ],
      'query': {
        'bool': {
          'filter': {
            'bool': {
              'must': [
                {
                  'terms': {
                    'LocationID': [
                      226186
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    };
    service.getEditStopDetails(addressPoint, null, locationPoint, null, null);
  });
});
