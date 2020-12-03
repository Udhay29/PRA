import { of } from 'rxjs/index';
import { APP_BASE_HREF } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { MessageService } from 'primeng/components/common/messageservice';

import { AppModule } from '../../../../app.module';

import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { MileageFilterComponent } from './mileage-filter.component';
import { MileageFilterModel } from './model/mileage-filter.model';
import { MileageFilterService } from './service/mileage-filter.service';
import { MileageFilterConfig } from './model/mileage-filter.config';
import { MileageFilterQuery } from './query/mileage-filter.query';
import { MileageFilterUtilityService } from './service/mileage-filter-utility.service';
import { ViewMileageService } from '../services/view-mileage.service';

describe('MileageFilterComponent', () => {
  let component: MileageFilterComponent;
  let fixture: ComponentFixture<MileageFilterComponent>;
  let viewMileageService: ViewMileageService;
  let messageService: MessageService;
  let debugElement: DebugElement;
  let mockESQuery;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
     declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, ViewMileageService, MileageFilterService,
       MileageFilterUtilityService, MessageService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MileageFilterComponent);
    debugElement = fixture.debugElement;
    viewMileageService = debugElement.injector.get(ViewMileageService);
    messageService = TestBed.get(MessageService);
    component = fixture.componentInstance;
    component.filterModel = new MileageFilterModel();
    mockESQuery = {
      'from': 0,
      'size': 25,
      '_source': [
      ],
      'script_fields': {
        'Status': {
          'script': {
            'lang': 'painless',
            'source': 'test'
          }
        }
      },
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'agreementID',
                'query': '92168'
              }
            },
            {
              'bool': {
                'should': [
                  {
                    'bool': {
                      'must': [
                        {
                          'query_string': {
                            'default_field': 'invalidIndicator',
                            'query': '*'
                          }
                        },
                        {
                          'query_string': {
                            'default_field': 'invalidReasonType',
                            'query': 'Active OR Inactive'
                          }
                        }
                      ]
                    }
                  },
                  {
                    'bool': {
                      'must': [
                        {
                          'query_string': {
                            'default_field': 'invalidIndicator',
                            'query': '*'
                          }
                        },
                        {
                          'query_string': {
                            'default_field': 'invalidReasonType',
                            'query': 'Deleted'
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              'bool': {
                'must': [
                ]
              }
            },
            {
              'bool': {
                'must': [
                ]
              }
            },
            {
              'bool': {
                'must': [
                  {
                    'nested': {
                      'path': 'customerMileageProgramContractAssociations',
                      'query': {
                        'query_string': {
                          'default_field': 'customerMileageProgramContractAssociations.customerContractDisplayName.keyword',
                          'query': '111\\ \\(legal\\ contract\\ 111\\)',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  }
                ]
              }
            },
            {
              'bool': {
                'must': [
                  {
                    'query_string': {
                      'default_field': 'agreementDefault',
                      'query': 'No',
                      'default_operator': 'AND'
                    }
                  }
                ]
              }
            },
            {
              'bool': {
                'must': [
                ]
              }
            },
            {
              'bool': {
                'should': [
                  {
                    'query_string': {
                      'fields': [
                        'mileageProgramName.keyword',
                        'agreementDefaultIndicator .keyword',
                        'mileageSystemName.keyword',
                        'mileageSystemVersionName.text',
                        'unitOfDistanceMeasurementCode.keyword',
                        'geographyType.keyword',
                        'mileageRouteTypeName.keyword',
                        'mileageCalculationTypeName.keyword',
                        'decimalPrecisionIndicator.keyword',
                        'mileageBorderMileParameterTypeName .keyword',
                        'effectiveDate.keyword',
                        'expirationDate.keyword',
                        'mileageProgramNoteText.keyword'
                      ],
                      'query': '*',
                      'default_operator': 'AND'
                    }
                  },
                  {
                    'nested': {
                      'path': 'customerMileageProgramContractAssociations',
                      'query': {
                        'query_string': {
                          'default_field': 'customerMileageProgramContractAssociations.customerContractDisplayName.keyword',
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      },
                      'inner_hits': {
                        'sort': {
                          'customerMileageProgramContractAssociations.customerContractDisplayName.keyword': {
                            'order': 'asc'
                          }
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'customerMileageProgramBusinessUnits',
                      'query': {
                        'query_string': {
                          'default_field': 'customerMileageProgramBusinessUnits.financeBusinessUnitCode.keyword',
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      },
                      'inner_hits': {
                        'sort': {
                          'customerMileageProgramBusinessUnits.financeBusinessUnitCode.keyword': {
                            'order': 'asc'
                          }
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'customerMileageProgramCarrierAssociations',
                      'query': {
                        'query_string': {
                          'default_field': 'customerMileageProgramCarrierAssociations.carrierDisplayName.keyword',
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      },
                      'inner_hits': {
                        'sort': {
                          'customerMileageProgramCarrierAssociations.carrierDisplayName.keyword': {
                            'order': 'asc'
                          }
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'mileageSystemParameters',
                      'query': {
                        'query_string': {
                          'default_field': 'mileageSystemParameters.mileageSystemParameterName.keyword',
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      },
                      'inner_hits': {
                        'sort': {
                          'mileageSystemParameters.mileageSystemParameterName.keyword': {
                            'order': 'asc'
                          }
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'customerMileageProgramSectionAssociations',
                      'query': {
                        'query_string': {
                          'default_field': 'customerMileageProgramSectionAssociations.customerAgreementContractSectionName.keyword',
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      },
                      'inner_hits': {
                        'sort': {
                          'customerMileageProgramSectionAssociations.customerAgreementContractSectionName.keyword': {
                            'order': 'asc'
                          }
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
          'mileageProgramType': {
            'order': 'asc'
          }
        }
      ]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    component.ngOnInit();
  });

  it('should call queryFormation', () => {
    component.queryFormation('yes', true, mockESQuery, 4, false);
  });

  it('should call queryFormationelse', () => {
    component.queryFormation('yes', false, mockESQuery, 5, false);
 });

  it('should call onListingItemsSelected for programName case', () => {
    const listEvent = [];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'programName', 4, false);
  });

  it('should call onListingItemsSelected for programName case', () => {
    const listEvent = [{
      label: 'Active Mileage', value: 'Active Mileage'
    }];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'programName', 4, false);
  });

  it('should call onListingItemsSelected for programName case', () => {
    const listEvent = [{
      label: 'Active Mileage', value: 'Active Mileage'},
      {label: 'Active Mileage', value: 'Active Mileage'
    }];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'programName', 4, false);
  });

  it('should call onListingItemsSelected for agreementDefault case', () => {
    const listEvent = [{
      label: 'Active Mileage', value: 'Active Mileage'
    }];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'agreementDefault', 5, false);
  });

  it('should call onListingItemsSelected for agreementDefault case', () => {
    const listEvent = [{
      label: 'Active Mileage', value: 'Active Mileage'},
      {label: 'Active Mileage', value: 'Active Mileage'
    }];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'agreementDefault', 5, false);
  });

  it('should call onListingItemsSelected for contract case', () => {
    const listEvent = [];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'contract', 6, true);
  });

  it('should call onListingItemsSelected for contract case', () => {
    const listEvent = [{
      label: 'Active Mileage', value: 'Active Mileage'
    }];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'contract', 6, true);
  });

  it('should call onListingItemsSelected for contract case', () => {
    const listEvent = [{
      label: 'Active Mileage', value: 'Active Mileage'},
      {label: 'Active Mileage', value: 'Active Mileage'
    }];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'contract', 6, true);
  });
  it('should call onListingItemsSelected for status case', () => {
    const listEvent = [];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'status', 3, true);
  });

  it('should call onListingItemsSelected for status case', () => {
    const listEvent = [{
      label: 'Active Mileage', value: 'Active Mileage'}];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'status', 3, true);
  });

  it('should call onListingItemsSelected for businessUnit case', () => {
    const listEvent = [{
      label: 'businessUnit', value: 'businessUnit'}];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'businessUnit', 3, false);
  });

  it('should call onListingItemsSelected for section case', () => {
    const listEvent = [{
      label: 'section', value: 'section'}];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'section', 3, true);
  });

  it('should call onListingItemsSelected for mileageSystemParameters case', () => {
    const listEvent = [{
      label: 'mileageSystemParameters', value: 'mileageSystemParameters'}];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'mileageSystemParameters', 3, true);
  });

  it('should call onListingItemsSelected for systemVersion case', () => {
    const listEvent = [{
      label: 'systemVersion', value: 'systemVersion'}];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'systemVersion', 3, true);
  });

  it('should call onListingItemsSelected for borderMilesParameter case', () => {
    const listEvent = [{
      label: 'borderMilesParameter', value: 'borderMilesParameter'}];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'borderMilesParameter', 3, true);
  });

  it('should call onListingItemsSelected for distanceUnit case', () => {
    const listEvent = [{
      label: 'distanceUnit', value: 'distanceUnit'}];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'distanceUnit', 3, true);
  });

  it('should call onListingItemsSelected for geographyType case', () => {
    const listEvent = [{
      label: 'geographyType', value: 'geographyType'}];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'geographyType', 3, true);
  });

  it('should call onListingItemsSelected for routeType case', () => {
    const listEvent = [{
      label: 'routeType', value: 'routeType'}];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'routeType', 3, true);
  });

  it('should call onListingItemsSelected for calculationType case', () => {
    const listEvent = [{
      label: 'calculationType', value: 'calculationType'}];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'calculationType', 3, true);
  });

  it('should call onListingItemsSelected for decimalPrecision case', () => {
    const listEvent = [{
      label: 'decimalPrecision', value: 'decimalPrecision'}];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'decimalPrecision', 3, true);
  });

  it('should call onListingItemsSelected for case status', () => {
    const listEvent = [];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'status', 3, true);
  });

  it('should call onListingItemsSelected for case status2', () => {
    const listEvent = [{
      label: 'status', value: 'status'}];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'status', 3, true);
  });

  it('should call onListingItemsSelected for case default', () => {
    const listEvent = [{
      label: 'decimalPrecision', value: 'decimalPrecision'}];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'decimalPrecision', 3, true);
  });

  it('should call onListingItemsSelected for case default lengthGreaterThan2', () => {
    const listEvent = [{
      label: 'decimalPrecision', value: 'decimalPrecision'},
      {
        label: 'decimalPrecision', value: 'decimalPrecision'}];
    ViewMileageService.setElasticparam(mockESQuery);
    component.onListingItemsSelected(listEvent, 'decimalPrecision', 3, true);
  });

  it('should call isDeletedSelected', () => {
    const listEvent = ['Inactive', 'Active'];
    ViewMileageService.setElasticparam(mockESQuery);
    component.isDeletedSelected(mockESQuery, 3, listEvent);
  });

  it('should call isDeletedSelected', () => {
    const listEvent = ['Deleted'];
    ViewMileageService.setElasticparam(mockESQuery);
    component.isDeletedSelected(mockESQuery, 3, listEvent);
  });

  it('should call isDeletedSelected', () => {
    const listEvent = ['Inactive'];
    ViewMileageService.setElasticparam(mockESQuery);
    component.isDeletedSelected(mockESQuery, 3, listEvent);
  });

  it('should call onClearAllFilters', () => {
    ViewMileageService.setElasticparam(mockESQuery);
    component.onClearAllFilters();
  });

  it('should call resetEvent', () => {
    ViewMileageService.setElasticparam(mockESQuery);
    component.resetEvent(true);
  });

  it('should call resetEvent', () => {
    ViewMileageService.setElasticparam(mockESQuery);
    component.resetEvent(false);
  });
  it('should call defaultStatusFetch', () => {
    component.defaultStatusFetch(mockESQuery);
  });
  it('should call defaultStatusFetch', () => {
    component.loadGrid(mockESQuery);
  });
  it('should call defaultStatusFetch', () => {
    component.currentQuery();
  });

});
