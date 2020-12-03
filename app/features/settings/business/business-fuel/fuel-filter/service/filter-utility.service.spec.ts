import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';

import { AppModule } from '../../../../../../app.module';
import { SettingsModule } from '../../../../settings.module';
import { FilterUtilityService } from './filter-utility.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { HttpClient } from '@angular/common/http';

describe('FilterUtilityService', () => {
  let service: FilterUtilityService;
  let http: HttpClient;

  configureTestSuite(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
    providers: [HttpClient, { provide: APP_BASE_HREF, useValue: '/' }, FilterUtilityService],
  }));

  beforeEach(() => {
    service = TestBed.get(FilterUtilityService);
    http = TestBed.get(HttpClient);
  });

  const response = {
    'took': 9,
    'timed_out': false,
    '_shards': {
      'total': 3,
      'successful': 3,
      'skipped': 0,
      'failed': 0
    },
    'hits': {
      'total': 561,
      'max_score': 1.0,
      'hits': [
        {
          '_index': 'pricing-fuelprice-1-2019.05.07',
          '_type': 'doc',
          '_id': '2',
          '_score': 1.0,
          '_source': {
            'unitOfVolumeMeasurementCode': 'Gallons'
          },
          'fields': {},
          'sort': ['abc']
        }
      ]
    }
  };

  it('should be created', inject([FilterUtilityService], () => {
    expect(service).toBeTruthy();
  }));

  it('should call currencyFramer', () => {
    service.currencyFramer(response);
  });

  it('should call basisFramer', () => {
    service.basisFramer(response);
  });

  it('should call countryFramer', () => {
    service.countryFramer(response);
  });

  it('should call fuelTypeFramer', () => {
    service.fuelTypeFramer(response);
  });

  it('should call createdByFramer', () => {
    service.createdByFramer(response);
  });

  it('should call createdProgramFramer', () => {
    service.createdProgramFramer(response);
  });

  it('should call updatedByFramer', () => {
    service.updatedByFramer(response);
  });

  it('should call updatedProgramFramer', () => {
    service.updatedProgramFramer(response);
  });
});
