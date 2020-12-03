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
import { HitsItem } from './model/carrier-mileage-elasticresponse.interface';
import { CarrierMileageComponent } from './carrier-mileage.component';
import { ViewCarrierAgreementModule } from '../view-carrier-agreement.module';
import { CarrierMileageService } from './service/carrier-mileage.service';
import { ViewCarrierMileageModel } from './model/carrier-mileage.model';
import { CarrierMileageUtility } from './service/carrier-mileage-utility';

describe('CarrierMileageComponent', () => {
  let component: CarrierMileageComponent;
  let fixture: ComponentFixture<CarrierMileageComponent>;
  let debugElement: DebugElement;
  let carrierMileageService: CarrierMileageService;
  let localStore: LocalStorageService;
  let messageService: MessageService;
  let router: Router;
  let agreementID;
  let sortEvent;
  let mockESQuery;

  const carrierMilageMockResponse = {
    'took': 16,
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
          '_index': 'pricing-carrier-mileage',
          '_type': 'doc',
          '_id': '67',
          '_score': null,
          '_source': {
            'calculationType': 'Construct',
            'distanceUnit': 'Miles',
            'notes': 'dsdsdsd',
            'geographyType': 'City State',
            'copied': 'No',
            'lineHaulOverrideIndicator': 'No',
            'agreementDefaultIndicator': 'Y',
            'createdOn': '08/16/2019 09:11',
            'mileageCalculationTypeID': 1,
            'financeBusinessUnitCode': 'JBI',
            'createdProgramName': 'Shrikar Tare',
            'carrierAssociations': [
              {
                'carrierName': 'willacarr 1 (1)',
                'carrierCode': 111,
                'carrierID': 1
              },
              {
                'carrierName': 'willacarr 2 (2)',
                'carrierCode': 222,
                'carrierID': 2
              }
            ],
            'carrierMileageProgramNoteID': 75,
            'originalEffectiveDate': '08/31/2019',
            'invalidReasonType': 'Active',
            'billToAccountsAssociations': [],
            'carrierSegmentTypeID': 1,
            'routeType': 'Shortest',
            'geographicPointTypeID': 1,
            'carrierSegmentTypeName': 'Dray',
            'expirationDate': '12/30/2019',
            'mileageBorderMileParameterTypeID': 1,
            'borderMilesParameter': 'Miles to border',
            'carrierMileageProgramName': 'test carrier',
            'unitOfDistanceMeasurementCode': 'Miles',
            'sectionAssociations': [],
            'updatedBy': 'Shrikar Tare (jisast6)',
            'agreementTypeName': 'Carrier',
            'carrierAgreementVersionID': null,
            'mileageSystemVersionID': 1,
            'updatedProgramName': 'Shrikar Tare',
            'agreementTypeID': null,
            'updatedOn': '08/16/2019 09:11',
            'mileageSystemID': 2,
            'decimalPrecision': 'N',
            'carrierMileageProgramVersionID': 67,
            'carrierAgreementID': 150,
            'carrierMileageProgramID': 1086,
            'mileageSystemParameterAssociations': [
              {
                'mileageSystemParameterName': 'Border Open',
                'mileageSystemParameterID': 2
              },
              {
                'mileageSystemParameterName': 'Mixed Geography',
                'mileageSystemParameterID': 1
              }
            ],
            'originalExpirationDate': '12/30/2019',
            'invalidIndicator': 'N',
            'createdBy': 'Shrikar Tare (jisast6)',
            'mileageSystemName': 'PC Miller',
            'carrierAgreementName': 'Bear & Cub Shipping LLC',
            'mileageRouteTypeID': 2,
            'mileageSystemVersionName': '13',
            'borderCrossingFlag': null,
            'effectiveDate': '08/31/2019'
          },
          'fields': {
            'Status': [
              'Active'
            ]
          },
          'sort': [
            'test carrier'
          ]
        }
      ]
    }
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [RouterTestingModule, AppModule, ViewCarrierAgreementModule, HttpClientTestingModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CarrierMileageService, LocalStorageService, MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierMileageComponent);
    debugElement = fixture.debugElement;
    carrierMileageService = debugElement.injector.get(CarrierMileageService);
    localStore = debugElement.injector.get(LocalStorageService);
    messageService = TestBed.get(MessageService);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.viewCarrierMileageModel = new ViewCarrierMileageModel();
    agreementID = 2;
    component.viewCarrierMileageModel.sourceData = {
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
      '_source': '*',
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
                'default_field': 'carrierAgreementID',
                'query': 150
              }
            },
            {
              'bool': {
                'should': [
                  {
                    'bool': {
                      'must': [
                        {
                          'range': {
                            'expirationDate': {
                              'gte': 'now/d'
                            }
                          }
                        },
                        {
                          'query_string': {
                            'default_field': 'invalidIndicator.keyword',
                            'query': 'N'
                          }
                        },
                        {
                          'query_string': {
                            'default_field': 'invalidReasonType.keyword',
                            'query': 'Active'
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
                'should': [
                  {
                    'query_string': {
                      'fields': [
                        'carrierSegmentTypeName.keyword',
                        'carrierMileageProgramName',
                        'financeBusinessUnitCode.keyword',
                        'carrierMileageProgramName.keyword',
                        'mileageSystemName.keyword',
                        'mileageSystemVersionName.keyword',
                        'distanceUnit.keyword',
                        'geographyType.keyword',
                        'routeType.keyword',
                        'calculationType.keyword',
                        'decimalPrecision.keyword',
                        'borderMilesParameter.keyword',
                        'effectiveDate.keyword',
                        'expirationDate.keyword',
                        'notes.keyword',
                        'originalEffectiveDate.keyword',
                        'originalExpirationDate.keyword',
                        'createdBy.keyword',
                        'createdOn.keyword',
                        'createdProgramName.keyword',
                        'updatedBy.keyword',
                        'updatedOn.keyword',
                        'updatedProgramName.keyword',
                        'copied.keyword',
                        'status.keyword'
                      ],
                      'query': '*'
                    }
                  },
                  {
                    'nested': {
                      'path': 'billToAccountsAssociations',
                      'query': {
                        'query_string': {
                          'default_field': 'billToAccountsAssociations.billToAccountName.keyword',
                          'query': '*'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'carrierAssociations',
                      'query': {
                        'query_string': {
                          'fields': [
                            'carrierAssociations.carrierName.keyword'
                          ],
                          'query': '*'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'mileageSystemParameterAssociations',
                      'query': {
                        'query_string': {
                          'fields': [
                            'mileageSystemParameterAssociation.mileageSystemParameterName.keyword'
                          ],
                          'query': '*'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'sectionAssociations',
                      'query': {
                        'query_string': {
                          'fields': [
                            'sectionAssociations.sectionName.keyword'
                          ],
                          'query': '*'
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
          'carrierMileageProgramName.keyword': {
            'order': 'asc'
          }
        }
      ]
    };
    component.viewCarrierMileageModel.gridSize = 3;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
  });
  it('should call getMockJson', () => {
    spyOn(CarrierMileageService.prototype, 'getMockJson').and.returnValues(of(component.viewCarrierMileageModel.sourceData));
    component.getMockJson();
  });
  it('should call getMockJsonelse', () => {
    spyOn(CarrierMileageService.prototype, 'getMockJson').and.returnValues(of(null));
    component.getMockJson();
  });
  it('should call fetchMilleagePreferenceFromElastic', () => {
    spyOn(CarrierMileageService.prototype, 'getMileagePreference').and.returnValues(of(carrierMilageMockResponse));
    component.fetchMilleagePreferenceFromElastic();
  });
  it('should call fetchMilleagePreferenceFromElasticelse', () => {
    spyOn(CarrierMileageService.prototype, 'getMileagePreference').and.returnValues(of(null));
    component.fetchMilleagePreferenceFromElastic();
  });
  it('should call handleErrorMessageForViewMileageGrid', () => {
    component.handleErrorMessageForViewMileageGrid('message');
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
  it('should call toastMessage-error', () => {
    component.toastMessage(messageService, 'error', 'You need to have atleast Agreement Cargo Release for Agreement to be created',
      'message');
  });
  it('should call toastMessage-success', () => {
    component.toastMessage(messageService, 'success', 'You need to have atleast Agreement Cargo Release for Agreement to be created',
      'message');
  });

  it('should call loadGridData', () => {
    CarrierMileageService.setElasticparam(mockESQuery);
    component.viewCarrierMileageModel.isAllowPagination = true;
    component.loadGridData(sortEvent);
  });
  it('should call loadGridData', () => {
    CarrierMileageService.setElasticparam(mockESQuery);
    component.viewCarrierMileageModel.isAllowPagination = false;
    component.loadGridData(null);
  });

  it('should create General Date format', () => {
    const date = '03/20/2019';
    component.formatDate(date);
    expect(component.formatDate).toBeTruthy();
  });
  it('should call on setPaginator', () => {
    component.viewCarrierMileageModel.gridDataLength = 5;
    component.setPaginator();
  });
  it('should call on setPaginator', () => {
    component.viewCarrierMileageModel.gridDataLength = 0;
    component.setPaginator();
  });
  it('shoul call CarrierMileageUtility.toastMessage', () => {
    CarrierMileageUtility.toastMessage(messageService, 'Success', 'Get Carrier');
  });
  it('should call loadMileageValuesLazy', () => {
    const eve: any = {
      'filters': {}, 'first': 0, 'globalFilter': null, 'multiSortMeta': undefined, 'rows': 25, 'sortField': 'Section Name',
      'sortOrder': 1
    };
    component.loadMileageValuesLazy(eve);
  });
});
