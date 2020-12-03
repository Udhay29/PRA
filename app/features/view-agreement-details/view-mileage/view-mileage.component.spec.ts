import { of } from 'rxjs/index';
import { APP_BASE_HREF } from '@angular/common';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { MessageService } from 'primeng/components/common/messageservice';

import { AppModule } from '../../../app.module';
import { LocalStorageService } from '../../../shared/jbh-app-services/local-storage.service';

import { ViewMileageComponent } from './view-mileage.component';
import { ViewAgreementDetailsModule } from '../view-agreement-details.module';
import { ViewMileageService } from './services/view-mileage.service';
import { ViewMileageModel } from './models/view-mileage.model';
import { ViewMileageQuery } from './query/view-mileage.query';

describe('ViewMileageComponent', () => {
  let component: ViewMileageComponent;
  let fixture: ComponentFixture<ViewMileageComponent>;
  let debugElement: DebugElement;
  let viewMileageService: ViewMileageService;
  let localStore: LocalStorageService;
  let messageService: MessageService;
  let router: Router;
  let agreementID;
  let sortEvent;
  let mockESQuery;

  const viewMilageMockResponse = {
    'took': 18,
    'timed_out': false,
    '_shards': {
      'total': 3,
      'successful': 3,
      'skipped': 0,
      'failed': 0
    },
    'hits': {
      'total': 1,
      'max_score': null,
      'hits': [
        {
          '_index': 'pricing-agreement-mileage-new',
          '_type': 'doc',
          '_id': '30',
          '_score': null,
          '_source': {
            'uniqueDocID': '30',
            'agreementDefaultIndicator': 'Y',
            'agreementID': 344,
            'agreementName': 'Alliance Logistics Inc (ARMI92)',
            'mileageBorderMileParameterTypeID': 1,
            'mileageBorderMileParameterTypeName': 'Miles to border',
            'mileageCalculationTypeName': 'Construct',
            'customerMileageProgramBusinessUnits': null,
            'customerMileageProgramCarrierAssociations': [
            ],
            'customerMileageProgramContractAssociations': null,
            'customerMileageProgramSectionAssociations': null,
            'mileageSystemParameters': [
            ],
            'createUserID': null,
            'createTimestamp': '07/23/2019 20:30 CST',
            'createProgramName': 'Swedha Ravi',
            'decimalPrecisionIndicator': 'N',
            'unitOfDistanceMeasurementCode': 'Miles',
            'effectiveDate': '07/24/2019',
            'expirationDate': '07/25/2019',
            'geographyType': 'City State',
            'inactivateLevelID': null,
            'invalidIndicator': 'N',
            'invalidReasonType': 'Active',
            'customerMileageProgramID': null,
            'mileageProgramName': 'TestMileageVersion1',
            'customerMileageProgramVersionID': 30,
            'mileageProgramSystemDefaultIndicator': null,
            'mileageProgramType': null,
            'customerMileageProgramNoteID': null,
            'mileageProgramNoteText': null,
            'originalEffectiveDate': '07/24/2019',
            'originalExpirationDate': '07/25/2019',
            'mileageRouteTypeName': 'Shortest',
            'mileageSystemName': 'Rand Mcnally',
            'mileageSystemVersionName': '18',
            'lastUpdateUserID': null,
            'lastUpdateTimestamp': '07/23/2019 20:30 CST',
            'lastUpdateProgramName': 'Swedha Ravi'
          },
          'fields': {
            'Status': [
              'Active'
            ]
          },
          'sort': [
            null
          ],
          'inner_hits': {
            'customerMileageProgramCarrierAssociations': {
              'hits': {
                'total': 0,
                'max_score': null,
                'hits': [
                ]
              }
            },
            'customerMileageProgramSectionAssociations': {
              'hits': {
                'total': 0,
                'max_score': null,
                'hits': [
                ]
              }
            },
            'mileageSystemParameters': {
              'hits': {
                'total': 0,
                'max_score': null,
                'hits': [
                ]
              }
            },
            'customerMileageProgramBusinessUnits': {
              'hits': {
                'total': 0,
                'max_score': null,
                'hits': [
                ]
              }
            },
            'customerMileageProgramContractAssociations': {
              'hits': {
                'total': 0,
                'max_score': null,
                'hits': [
                ]
              }
            }
          }
        }
      ]
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, ViewMileageService, LocalStorageService, MessageService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMileageComponent);
    debugElement = fixture.debugElement;
    viewMileageService = debugElement.injector.get(ViewMileageService);
    localStore = debugElement.injector.get(LocalStorageService);
    messageService = TestBed.get(MessageService);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.viewMileageModel = new ViewMileageModel();
    agreementID = 2;
    component.viewMileageModel.sourceData = {
      'sourceData': 'sourceMock'
    };
    sortEvent = {
      'first': 0, 'rows': 25, 'from': 0, 'size': 25, 'sortField':
        'Implementation Price', 'sortOrder': 1, 'filters': {}, 'globalFilter': null,
      'multiSortMeta': undefined
    };
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
                'query': '1560'
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
                          'query': '2928\\ \\(BBOK33\\ 111\\)',
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
                    'nested': {
                      'path': 'customerMileageProgramSectionAssociations',
                      'query': {
                        'query_string': {
                          'default_field': 'customerMileageProgramSectionAssociations.customerAgreementContractSectionName.keyword',
                          'query': '(BBOK33) OR (B\\ \\&\\ B\\ 1)',
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
                        'mileageBorderMileParameterTypeName.keyword',
                        'effectiveDate.keyword',
                        'expirationDate.keyword',
                        'mileageProgramNoteText.keyword'
                      ],
                      'query': '**',
                      'default_operator': 'AND'
                    }
                  },
                  {
                    'nested': {
                      'path': 'customerMileageProgramContractAssociations',
                      'query': {
                        'query_string': {
                          'default_field': 'customerMileageProgramContractAssociations.customerContractDisplayName.keyword',
                          'query': '**',
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
                          'query': '**',
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
                          'query': '**',
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
                        'bool': {
                          'should': [
                            {
                              'query_string': {
                                'default_field': 'mileageSystemParameters.mileageSystemParameterName.keyword',
                                'query': '**',
                                'default_operator': 'AND'
                              }
                            }
                          ],
                          'must_not': [
                            {
                              'query_string': {
                                'default_field': 'mileageSystemParameters.mileageParameterSelectIndicator',
                                'query': 'N',
                                'default_operator': 'AND'
                              }
                            }
                          ]
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
                          'query': '**',
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
    component.viewMileageModel.gridSize = 3;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
  });
  it('should call getMockJson', () => {
    spyOn(ViewMileageService.prototype, 'getMockJson').and.returnValues(of(component.viewMileageModel.sourceData));
    component.getMockJson();
  });
  it('should call getMockJsonelse', () => {
    spyOn(ViewMileageService.prototype, 'getMockJson').and.returnValues(of(null));
    component.getMockJson();
  });
  it('should call fetchMilleagePreferenceFromElastic', () => {
    spyOn(ViewMileageService.prototype, 'getMileagePreference').and.returnValues(of(viewMilageMockResponse));
    component.fetchMilleagePreferenceFromElastic();
  });
  it('should call fetchMilleagePreferenceFromElasticelse', () => {
    spyOn(ViewMileageService.prototype, 'getMileagePreference').and.returnValues(of(null));
    component.fetchMilleagePreferenceFromElastic();
  });
  it('should call handleErrorMessageForViewMileageGrid', () => {
    component.handleErrorMessageForViewMileageGrid('message');
  });
  it('should call contractFramerElse', () => {
    component.contractFramer(null);
  });
  it('should call sectionFramerElse', () => {
    component.sectionFramer(null);
  });
  it('should call businessUnitFramerElse', () => {
    component.businessUnitFramer(null);
  });
  it('should call carrierFramerElse', () => {
    component.carrierFramer(null);
  });
  it('should call systemParameterFramerElse', () => {
    component.systemParameterFramer(null);
  });
  it('should call onClickCreateMileage', () => {
    component.onClickCreateMileage();
  });
  it('should call on frameSearchQuery', () => {
    component.frameSearchQuery(mockESQuery, 'Active');
  });
  it('should call on frameSearchQuery', () => {
    component.frameSearchQuery(mockESQuery, 'Inactive');
  });
  it('should call on frameSearchQuery', () => {
    component.frameSearchQuery(mockESQuery, 'Deleted');
  });
  it('should call exportToExcel', () => {
    component.exportToExcel();
    spyOn(ViewMileageService.prototype, 'downloadExcel').and.returnValues(of({}));
  });
  it('should call viewMileageExcelDownloadError', () => {
    const err = {
      error: {
        'traceid': '343481659c77ad99',
        'errors': [{
          'fieldErrorFlag': false,
          'errorMessage': 'Failed to convert undefined into java.lang.Integer!',
          'errorType': 'System Runtime Error',
          'fieldName': null,
          'code': 'ServerRuntimeError',
          'errorSeverity': 'ERROR'
        }]
      }
    };
    component.viewMileageExcelDownloadError(err);
  });
  it('should call toastMessage-error', () => {
    component.toastMessage(messageService, 'error', 'You need to have atleast Agreement Cargo Release for Agreement to be created',
      'message');
  });
  it('should call toastMessage-success', () => {
    component.toastMessage(messageService, 'success', 'You need to have atleast Agreement Cargo Release for Agreement to be created',
      'message');
  });

  it('should call loadGridData', () => {
    ViewMileageService.setElasticparam(mockESQuery);
    component.viewMileageModel.allowPagination = true;
    component.loadGridData(sortEvent);
  });
  it('should call loadGridData', () => {
    ViewMileageService.setElasticparam(mockESQuery);
    component.viewMileageModel.allowPagination = false;
    component.loadGridData(null);
  });
  it('should call on getGridValues', () => {
    ViewMileageService.setElasticparam(mockESQuery);
    component.getGridValues(sortEvent);
  });

  it('should call sortGridData', () => {
    const sortEventFor = {
      'first': 0, 'rows': 25, 'from': 0, 'size': 25, 'sortField':
        'Status', 'sortOrder': 1, 'filters': {}, 'globalFilter': null,
      'multiSortMeta': undefined
    };
    component.sortGridData(mockESQuery, sortEventFor);
  });
  it('should create General Date format', () => {
    const date = '03/20/2019';
    component.formatDate(date);
    expect(component.formatDate).toBeTruthy();
  });
  it('should call on setPaginator', () => {
    component.viewMileageModel.gridDataLength = 5;
    component.setPaginator();
  });
  it('should call on setPaginator', () => {
    component.viewMileageModel.gridDataLength = 0;
    component.setPaginator();
  });
  it('should call on ViewMileageQuery.viewMileageGridQuery', () => {
    const queryMock = {
      sourceData: 'test'
    };
    ViewMileageQuery.viewMileageGridQuery(queryMock, '3', 4, 5);
  });
});
