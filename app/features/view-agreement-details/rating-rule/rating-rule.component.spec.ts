import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { RatingRuleService } from './service/rating-rule.service';
import { ViewAgreementDetailsModule } from '../view-agreement-details.module';
import { AppModule } from './../../../app.module';
import { RatingRuleComponent } from './rating-rule.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RatingRuleComponent', () => {
  let component: RatingRuleComponent;
  let fixture: ComponentFixture<RatingRuleComponent>;
  let service: RatingRuleService;
  const query = {
    'from': 0,
    'size': 25,
    '_source': '*',
    'query': {
      'bool': {
        'must': [
          {
            'query_string': {
              'default_field': 'AgreementID',
              'query': '48'
            }
          },
          {
            'bool': {
              'should': [
                {
                  'query_string': {
                    'fields': [
                      'AgreementDefaultIndicator',
                      'CitySubstitutionDisplayName',
                      'HazmatChargeRulesType',
                      'CongestionChargeType',
                      'FlatRateWithStopsType',
                      'RatingRuleInvalidIndicator'
                    ],
                    'query': '*',
                    'default_operator': 'AND'
                  }
                },
                {
                  'nested': {
                    'path': 'ContractAssociations',
                    'query': {
                      'query_string': {
                        'fields': [
                          'ContractAssociations.ContractDisplayName'
                        ],
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'SectionAssociations',
                    'query': {
                      'query_string': {
                        'fields': [
                          'SectionAssociations.SectionName'
                        ],
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'FinanceBusinessUnitServiceOfferingAssociations',
                    'query': {
                      'query_string': {
                        'fields': [
                          'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitServiceOfferingDisplayName',
                          'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitCode',
                          'FinanceBusinessUnitServiceOfferingAssociations.ServiceOfferingCode'
                        ],
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'range': {
                    'RatingRuleEffectiveDate': {
                        'gte': '2019-06-14',
                        'lte': '2019-06-18',
                        'format': 'MM/dd/yyyy||yyyy'
                    }
                  }
              },
              {
                  'range': {
                    'RatingRuleExpirationDate': {
                        'gte': '2019-06-19',
                        'lte': '2019-06-20',
                        'format': 'MM/dd/yyyy||yyyy'
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
                    'path': 'SectionAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'SectionAssociations.SectionName.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'ContractAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'ContractAssociations.ContractDisplayName.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'ContractAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'ContractAssociations.ContractType.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'ContractAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'ContractAssociations.ContractName.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'FinanceBusinessUnitServiceOfferingAssociations',
                    'query': {
                      'query_string': {
                        'default_field':
                        'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitServiceOfferingDisplayName.keyword',
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'FinanceBusinessUnitServiceOfferingAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitCode.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'query_string': {
                    'default_field': 'AgreementDefaultIndicator.keyword',
                    'query': '*'
                  }
                },
                {
                  'bool': {
                    'must': [
                      {
                        'query_string': {
                          'default_field': 'CitySubstitutionDisplayName.keyword',
                          'query': '*'
                        }
                      }
                    ]
                  }
                },
                {
                  'query_string': {
                    'default_field': 'HazmatChargeRulesType.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'CongestionChargeType.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'FlatRateWithStopsType.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'RatingRuleInvalidIndicator.keyword',
                    'query': '*'
                  }
                },
                {
                  'range': {
                    'RatingRuleEffectiveDate.keyword': {
                      'gte': '1995-01-01',
                      'lte': '2099-12-31',
                      'format': 'dd/MM/yyyy||yyyy'
                    }
                  }
                },
                {
                  'range': {
                    'RatingRuleExpirationDate.keyword': {
                      'gte': '1995-01-01',
                      'lte': '2099-12-31',
                      'format': 'dd/MM/yyyy||yyyy'
                    }
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
                                'RatingRuleExpirationDate.keyword': {
                                  'gte': '2019-07-26',
                                  'format': 'dd/MM/yyyy||yyyy'
                                }
                              }
                            },
                            {
                              'bool': {
                                'must_not': [
                                  {
                                    'query_string': {
                                      'default_field': 'RatingRuleInvalidReasonType.keyword',
                                      'query': 'Deleted'
                                    }
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
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
        'RatingRuleType.keyword': {
          'order': 'asc'
        }
      },
      {
        'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitServiceOfferingDisplayName.keyword': {
          'order': 'asc',
          'nested': {
            'path': 'FinanceBusinessUnitServiceOfferingAssociations'
          },
          'mode': 'min'
        }
      },
      {
        'ContractAssociations.ContractDisplayName.keyword': {
          'order': 'asc',
          'nested': {
            'path': 'ContractAssociations'
          },
          'mode': 'min'
        }
      },
      {
        'SectionAssociations.SectionName.keyword': {
          'order': 'asc',
          'nested': {
            'path': 'SectionAssociations'
          },
          'mode': 'min'
        }
      }
    ]
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingRuleComponent);
    component = fixture.componentInstance;
    service = TestBed.get(RatingRuleService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getOverflowList', () => {
    component.getOverflowList();
  });

  it('should call exportToExcel', () => {
    component.exportToExcel();
  });
  it('should call exportToExcel Error', () => {
    const err = {
      'traceid' : '343481659c77ad99',
      'status'  : 409,
      'errors' : [ {
        'fieldErrorFlag' : false,
        'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
        'errorType' : 'System Runtime Error',
        'fieldName' : null,
        'code' : 'ServerRuntimeError',
        'errorSeverity' : 'ERROR'
      } ]
    };
    spyOn(service, 'downloadRatingRuleExcel').and.returnValue(throwError(err));
    component.exportToExcel();
  });
  it('should call exportToExcelToastMessage', () => {
    component.exportToExcelToastMessage('error', 'error', 'error');
  });
  it('should call closeOnInactivate', () => {
    const eve: any = {};
    component.closeOnInactivate(eve);
  });
  it('should call checkRatingRule', () => {
    spyOn(service, 'checkRatingRule').and.returnValue(of(true));
    component.checkRatingRule();
  });
  it('should call createRatingRule', () => {
    component.createRatingRule(true, true);
  });
  it('should call closeClick', () => {
    const eve: any = {};
    component.closeClick(eve);
  });
  it('should call onRowSelect', () => {
    const eve = {
      data: {
        UniqueDocID: '532'
      },
      type: 'row'
    };
    component.onRowSelect(eve);
  });
  it('should call toastMessage', () => {
    component.toastMessage('error', 'error');
  });
  xit('should call downloadFiles', () => {
    const arg = {
      size: 4752,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    const arg2 = {
      nativeElement: {
        download: '',
        href: ''
      }
    };
    component.downloadFiles(arg, arg2);
  });
  it('should call getMergedList', () => {
    const ass = [{
      ContractID: 1,
      ContractName: 'test',
      ContractType: 'test',
      ContractNumber: '123',
      ContractDisplayName: 'test (test)',
      FinanceBusinessUnitServiceOfferingAssociationID: 23,
      FinanceBusinessUnitCode: 'test',
      ServiceOfferingCode: 'test',
      FinanceBusinessUnitServiceOfferingDisplayName: 'test',
      SectionID: 45,
      SectionName: 'test'
    }];
    component.getMergedList(ass, 'source');
  });
  it('should call sortGridData', () => {
    const arg: any = {
      filters: {},
      first: 0,
      globalFilter: null,
      multiSortMeta: undefined,
      rows: 25,
      sortField: 'ContractType',
      sortOrder: 1
    };
    component.sortGridData(query, arg);
  });
  it('should call onFilterClick', () => {
    component.onFilterClick();
  });
  it('should call onLoadFilter', () => {
    component.onLoadFilter(true);
  });
  it('should call getGridValues', () => {
    const eve: any = {
      target: {
        value: 'a'
      }
    };
    RatingRuleService.setElasticparam(query);
    component.getGridValues(eve);
  });
  it('should call getGridValues if check', () => {
    const eve: any = {
      target: {
        value: '07/07/2018'
      }
    };
    RatingRuleService.setElasticparam(query);
    component.getGridValues(eve);
  });
  it('should call Loadgriddata', () => {
    const arg: any = {
      filters: {},
      first: 0,
      globalFilter: null,
      multiSortMeta: undefined,
      rows: 25,
      sortField: undefined,
      sortOrder: 1
    };
    component.ratingsModel.allowPagination = true;
    component.loadGridData(arg);
  });
  it('should call setPaginator', () => {
    component.ratingsModel.gridDataLength = 2;
    component.setPaginator();
  });
  it('should call setDateRange', () => {
    const matcharray = [ '07/07/2018', '07', '/', '07', '2018'];
    const datequery = {
      range: {
        RatingRuleEffectiveDate: {
          format: 'MM/dd/yyyy||yyyy',
          gte: '07/07/2018',
          lte: '7/07/2018'
        }
      }
    };
    component.setDateRange('RatingRuleEffectiveDate', '07/07/2018', datequery, matcharray);
  });
  it('should call setPaginator else', () => {
    component.ratingsModel.gridDataLength = 0;
    component.setPaginator();
  });
  it('should call frameDateSearchQuery', () => {
    RatingRuleService.setElasticparam(query);
    const frame: any = [
      {
        'query_string': {
          'fields': [
            'AgreementDefaultIndicator',
            'CitySubstitutionDisplayName',
            'HazmatChargeRulesType',
            'CongestionChargeType',
            'FlatRateWithStopsType',
            'RatingRuleInvalidIndicator'
          ],
          'query': '*07\\/07\\/2018*',
          'default_operator': 'AND'
        }
      },
      {
        'nested': {
          'path': 'ContractAssociations',
          'query': {
            'query_string': {
              'fields': [
                'ContractAssociations.ContractDisplayName'
              ],
              'query': '*07\\/07\\/2018*',
              'default_operator': 'AND'
            }
          }
        }
      },
      {
        'nested': {
          'path': 'SectionAssociations',
          'query': {
            'query_string': {
              'fields': [
                'SectionAssociations.SectionName'
              ],
              'query': '*07\\/07\\/2018*',
              'default_operator': 'AND'
            }
          }
        }
      },
      {
        'nested': {
          'path': 'FinanceBusinessUnitServiceOfferingAssociations',
          'query': {
            'query_string': {
              'fields': [
                'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitServiceOfferingDisplayName',
                'FinanceBusinessUnitServiceOfferingAssociations.FinanceBusinessUnitCode',
                'FinanceBusinessUnitServiceOfferingAssociations.ServiceOfferingCode'
              ],
              'query': '*07\\/07\\/2018*',
              'default_operator': 'AND'
            }
          }
        }
      }
    ];
    component.frameDateSearchQuery('07/07/2018', frame);
  });
  it('should call getRateRuleListData', () => {
    const response = {
      took: 1234,
      timed_out: true,
      _shards: {
        total: 1234,
        successful: 1234,
        skipped: 1234,
        failed: 1234
      },
      hits: {
        total: 1234,
        max_score: 1234,
        hits: [{
          index: 'test',
          _type: 'test',
          _id: 'test',
          _score: 'test',
          _source: {
            UniqueDocID: 1234,
            AgreementID: 1234,
            AgreementDefaultIndicator: 'test',
            CitySubstitutionValue: 1234,
            CitySubstitutionMesurementUnit: 'test',
            CongestionChargeType: 'test',
            FlatRateWithStopsType: 'test',
            HazmatChargeRulesType: 'test',
            Contract: 'test',
            FinanceBusinessUnitServiceOfferingAssociations: {
              ContractID: 123,
              ContractName: 'test',
              ContractType: 'test',
              ContractNumber: 'test',
              ContractDisplayName: 'test',
              FinanceBusinessUnitServiceOfferingAssociationID: 123,
              FinanceBusinessUnitCode: 'test',
              ServiceOfferingCode: 'test',
              FinanceBusinessUnitServiceOfferingDisplayName: 'test',
              SectionID: 123,
              SectionName: 'test',
            },
            ContractAssociations: {
              ContractID: 123,
              ContractName: 'test',
              ContractType: 'test',
              ContractNumber: 'test',
              ContractDisplayName: 'test',
              FinanceBusinessUnitServiceOfferingAssociationID: 123,
              FinanceBusinessUnitCode: 'test',
              ServiceOfferingCode: 'test',
              FinanceBusinessUnitServiceOfferingDisplayName: 'test',
              SectionID: 123,
              SectionName: 'test',
            },
            SectionAssociations: {
              ContractID: 123,
              ContractName: 'test',
              ContractType: 'test',
              ContractNumber: 'test',
              ContractDisplayName: 'test',
              FinanceBusinessUnitServiceOfferingAssociationID: 123,
              FinanceBusinessUnitCode: 'test',
              ServiceOfferingCode: 'test',
              FinanceBusinessUnitServiceOfferingDisplayName: 'test',
              SectionID: 123,
              SectionName: 'test',
            },
            RatingRuleInvalidIndicator: 'test',
            RatingRuleInvalidReasonType: 'test',
            RatingRuleEffectiveDate: 'test',
            RatingRuleExpirationDate: 'test',
            RatingRuleType: 'test'
          },
          sort: ['asc']
        }]
      }
    };
    spyOn(RatingRuleService.prototype, 'getRateList').and.returnValue(of(response));
    component.getRateRuleListData();
  });

  it('should call getRateRuleListData', () => {
    spyOn(RatingRuleService.prototype, 'getRateList').and.returnValue(throwError('error'));
    component.getRateRuleListData();
  });

});
