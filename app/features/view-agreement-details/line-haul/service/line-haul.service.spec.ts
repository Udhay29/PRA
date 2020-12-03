import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';

import { ViewAgreementDetailsModule } from './../../../view-agreement-details/view-agreement-details.module';

import { LineHaulService } from './line-haul.service';

describe('LineHaulService', () => {

  let service: LineHaulService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [LineHaulService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(LineHaulService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([LineHaulService], () => {
    expect(service).toBeTruthy();
  }));

  it('should be getLineHaulData', () => {
    const data = {
      '_source': '*',
      'query': {
        'bool': {
          'must': [
            {
              'term': {
                'agreementID.keyword': 4
              }
            },
            {
              'query_string': {
                'default_field': 'status',
                'query': 'pending'
              }
            },
            {
              'range': {
                'expirationDate': {
                  'gte': '2019-06-03'
                }
              }
            },
            {
              'query_string': {
                'default_field': 'recordStatus',
                'query': '*'
              }
            },
            {
              'query_string': {
                'default_field': 'createdUserId',
                'query': 'jcnt565'
              }
            },
            {
              'bool': {
                'should': [
                  {
                    'query_string': {
                      'fields': [
                        'contractName',
                        'contractNumber',
                        'sectionName',
                        'groupRateType',
                        'groupRateItemIndicator',
                        'businessUnit',
                        'serviceOfferingDescription',
                        'transitMode',
                        'serviceLevel',
                        'equipmentClassificationCode',
                        'equipmentTypeCodeDescription',
                        'equipmentLengthQuantity',
                        'unitOfEquipmentLengthMeasurementCode',
                        'awardStatus',
                        'overriddenPriority',
                        'priorityNumber',
                        'stopChargeIncludedIndicator',
                        'origin.description',
                        'hazmatIncludedIndicator',
                        'fuelIncludedIndicator',
                        'autoInvoiceIndicator',
                        'sourceLineHaulID',
                        'sourceID',
                        'lineHaulSourceTypeName',
                        'effectiveDate',
                        'expirationDate',
                        'mileagePreference.mileagePreferenceName',
                        'mileagePreference.mileagePreferenceMinRange',
                        'mileagePreference.mileagePreferenceMaxRange'
                      ],
                      'query': '*',
                      'default_operator': 'AND',
                      'split_on_whitespace': false
                    }
                  },
                  {
                    'nested': {
                      'path': 'destination',
                      'query': {
                        'query_string': {
                          'fields': [
                            'destination.point',
                            'destination.description',
                            'destination.vendorID'
                          ],
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'rates',
                      'query': {
                        'query_string': {
                          'fields': [
                            'rates.*'
                          ],
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'stops',
                      'query': {
                        'query_string': {
                          'fields': [
                            'stops.*'
                          ],
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'mileagePreference',
                      'query': {
                        'query_string': {
                          'fields': [
                            'mileagePreference.mileagePreferenceName',
                            'mileagePreference.mileagePreferenceMinRange',
                            'mileagePreference.mileagePreferenceMaxRange'
                          ],
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'origin',
                      'query': {
                        'query_string': {
                          'fields': [
                            'origin.point',
                            'origin.vendorID'
                          ],
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'unitOfMeasurement',
                      'query': {
                        'query_string': {
                          'fields': [
                            'unitOfMeasurement.description',
                            'unitOfMeasurement.maxWeightRange'
                          ],
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'operationalServices',
                      'query': {
                        'query_string': {
                          'fields': [
                            'operationalServices.serviceTypeDescription'
                          ],
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'billTos',
                      'query': {
                        'query_string': {
                          'fields': [
                            'billTos.billToCode'
                          ],
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'billTos',
                      'query': {
                        'query_string': {
                          'fields': [
                            'carriers.carrierCode'
                          ],
                          'query': '**',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      'sort': [
        {
          'sectionName.keyword': {
            'order': 'asc'
          }
        },
        {
          'effectiveDate': {
            'order': 'asc'
          }
        }
      ],
      'size': 25,
      'from': 0
    };
    service.getLineHaulData(data);
  });

  xit('should be deleteLineHaulRecords', () => {
    service.deleteLineHaulRecords([1]);
  });

  it('should be publishLineHaulRecords', () => {
    service.publishLineHaulRecords([1], 'draft');
  });

  it('should be inactivateLineHauls', () => {
    service.inactivateLineHauls('12', '03/06/2019');
  });

  it('should be setQueryParam', () => {
    service.setQueryParam(12);
  });

  it('should be getQueryParam', () => {
    service.getQueryParam();
  });
});
