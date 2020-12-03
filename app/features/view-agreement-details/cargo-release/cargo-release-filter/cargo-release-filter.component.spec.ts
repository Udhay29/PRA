import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';

import { CargoReleaseFilterComponent } from './cargo-release-filter.component';
import { CargoReleaseService } from '../services/cargo-release.service';
import { CargoFilterService } from './services/cargo-filter.service';
import { ListingFilterInterface } from './model/cargo-filter.interface';

describe('CargoReleaseFilterComponent', () => {
  let component: CargoReleaseFilterComponent;
  let fixture: ComponentFixture<CargoReleaseFilterComponent>;
  let cargoFilterService: CargoFilterService;
  let listingFilterInterface: ListingFilterInterface;
  const query: any = {
    'size': 25,
    'from': 0,
    '_source': '*',
    'query': {
      'bool': {
        'must': [
          {
            'query_string': {
              'default_field': 'customerAgreementID',
              'query': 4
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
                          'default_field': 'invalidIndicator',
                          'query': 'N'
                        }
                      },
                      {
                        'query_string': {
                          'default_field': 'invalidReasonTypeName',
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

              ]
            }
          },
          {
            'bool': {
              'must': [
                {
                  'query_string': {
                    'default_field': 'agreementDefaultIndicator.keyword',
                    'query': 'Yes'
                  }
                },
                {
                  'range': {
                    'cargoReleaseAmount': {
                      'gte': 100000,
                      'lte': 1000000
                    }
                  }
                },
                {
                  'query_string': {
                    'default_field': 'createProgramName.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'createTimestamp.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'createUserId.keyword',
                    'query': '**'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'invalidReasonTypeName.keyword',
                    'query': 'Active'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'lastUpdateProgramName.keyword',
                    'query': '**'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'lastUpdateTimestamp.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'lastUpdateUserId.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'contractAssociation.contractDisplayName.keyword',
                    'query': '*'
                  }
                },
                {
                  'nested': {
                    'path': 'financeBusinessUnitAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'financeBusinessUnitAssociations.financeBusinessUnitCode.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'query_string': {
                    'default_field': 'sectionAssociation.customerAgreementContractSectionName.keyword',
                    'query': '*'
                  }
                },
                {
                  'range': {
                    'effectiveDate': {
                      'gte': '1995-01-01'
                    }
                  }
                },
                {
                  'range': {
                    'expirationDate': {
                      'lte': '2099-12-31'
                    }
                  }
                },
                {
                  'range': {
                    'originalEffectiveDate': {
                      'gte': '1995-01-01'
                    }
                  }
                },
                {
                  'range': {
                    'originalExpirationDate': {
                      'lte': '2099-12-31'
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
        'cargoType.keyword': {
          'order': 'asc'
        }
      }
    ]
  };

  const newQuery = {
    'size': 25,
    'from': 0,
    '_source': '*',
    'script_fields': {
      'Status': {
        'script': {
          'lang': 'painless',
          'source': `def x = [];def sfn = new SimpleDateFormat('yyyy/ MM / dd');def today = new Date();def now =
                sfn.parse(sfn.format(today));def sf = new SimpleDateFormat('yyyy - MM - dd');def expire = sf.parse(
                    params['_source']['expirationDate']);if ((expire.after(now) || expire.equals(now)) &&
                    params['_source']['invalidIndicator'] == 'N' && params['_source']['invalidReasonTypeName'] == 'Active')
                     {x.add('Active')} else if ((expire.before(now) && params['_source']['invalidIndicator'] == 'Y' &&
                     params['_source']['invalidReasonTypeName'] == 'InActive')|| (expire.before(now) && params['_source']
                     ['invalidIndicator'] == 'N' && params['_source']['invalidReasonTypeName'] == 'InActive') ||
                     (expire.before(now) && params['_source']['invalidIndicator'] == 'N' && params['_source']
                     ['invalidReasonTypeName'] == 'Active')) { x.add('Inactive') } else if (params['_source']
                     ['invalidIndicator'] == 'Y' && params['_source']['invalidReasonTypeName'] == 'Deleted') { x.add('Deleted')} return x`
        }
      }
    },
    'query': {
      'bool': {
        'must': [
          {
            'query_string': {
              'default_field': 'customerAgreementID',
              'query': 134
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
                          'default_field': 'invalidIndicator',
                          'query': 'N'
                        }
                      },
                      {
                        'query_string': {
                          'default_field': 'invalidReasonTypeName',
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

              ]
            }
          },
          {
            'bool': {
              'must': [
                {
                  'query_string': {
                    'default_field': 'agreementDefaultIndicator.keyword',
                    'query': '*'
                  }
                },
                {
                  'range': {
                    'cargoReleaseAmount.integer': {
                      'gte': 100000,
                      'lte': 1000000
                    }
                  }
                },
                {
                  'query_string': {
                    'default_field': 'createProgramName.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'createTimestamp.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'createUserId.keyword',
                    'query': '**'
                  }
                },
                {
                  'bool': {
                    'should': [
                      {
                        'script': {
                          'script': `def sfn = new SimpleDateFormat('yyyy/ MM / dd');def today =
                                                new Date();def now = sfn.parse(sfn.format(today));def sf=new
                                                SimpleDateFormat('yyyy - MM - dd');def expire=sf.parse(
                                                    doc['expirationDate.keyword'].value); ((expire.after(now) ||
                                                    expire.equals(now)) && doc['invalidReasonTypeName.keyword'].value ==
                                                    'active' && doc['invalidIndicator.keyword'].value == 'n')`
                        }
                      }
                    ]
                  }
                },
                {
                  'query_string': {
                    'default_field': 'lastUpdateProgramName.keyword',
                    'query': '**'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'lastUpdateTimestamp.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'lastUpdateUserId.keyword',
                    'query': '*'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'contractAssociation.contractDisplayName.keyword',
                    'query': '*'
                  }
                },
                {
                  'nested': {
                    'path': 'financeBusinessUnitAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'financeBusinessUnitAssociations.financeBusinessUnitCode.keyword',
                        'query': '*'
                      }
                    }
                  }
                },
                {
                  'query_string': {
                    'default_field': 'sectionAssociation.customerAgreementContractSectionName.keyword',
                    'query': '*'
                  }
                },
                {
                  'range': {
                    'effectiveDate': {
                      'gte': '1995-01-01'
                    }
                  }
                },
                {
                  'range': {
                    'expirationDate': {
                      'lte': '2099-12-31'
                    }
                  }
                },
                {
                  'range': {
                    'originalEffectiveDate': {
                      'gte': '1995-01-01'
                    }
                  }
                },
                {
                  'range': {
                    'originalExpirationDate': {
                      'lte': '2099-12-31'
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
        'cargoType.keyword': {
          'order': 'asc'
        }
      }
    ]
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CargoFilterService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargoReleaseFilterComponent);
    component = fixture.componentInstance;
    cargoFilterService = TestBed.get(CargoFilterService);
    fixture.detectChanges();
    listingFilterInterface = new ListingFilterInterface;
    component.filterConfig.statusData = listingFilterInterface;
    component.filterModel.sourceData = {
      agreementID: 1091,
      script: {
        active: 'def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();',
        deleted: '(doc["ContractRanges.ContractInvalidIndicator.keyword"].value == "y") ',
        inactive: 'def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();',
        status: 'def x = [];def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();'
      }
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call - ngOnInit', () => {
    component.filterModel.statusSelectedList = [{
      'label': 'Active',
      'value': 'Active'
    }];

    component.ngOnInit();
  });
  it('should call - cargoMaxAmount', () => {
    const response: any = {
      'configurationParameterDetailDTOs': [
        {
          'configurationParameterDetailID': 1,
          'configurationParameterID': 1,
          'configurationParameterName': 'Cargo Release',
          'parameterSpecificationTypeID': 3,
          'parameterSpecificationTypeName': 'Default',
          'configurationParameterValue': '100000',
          'configurationParameterDetailName': 'cargo_release_default',
          'lastUpdatedTimestamp': '2019-05-24T13:40:14.7000752'
        },
        {
          'configurationParameterDetailID': 2,
          'configurationParameterID': 1,
          'configurationParameterName': 'Cargo Release',
          'parameterSpecificationTypeID': 2,
          'parameterSpecificationTypeName': 'Max',
          'configurationParameterValue': '1000000',
          'configurationParameterDetailName': 'cargo_release_max',
          'lastUpdatedTimestamp': '2019-05-24T13:40:14.7000752'
        },
        {
          'configurationParameterDetailID': 7,
          'configurationParameterID': 6,
          'configurationParameterName': 'Days After Entry to Modify With Same Effective Date',
          'parameterSpecificationTypeID': 2,
          'parameterSpecificationTypeName': 'Max',
          'configurationParameterValue': '0',
          'configurationParameterDetailName': 'days_after_entry_to_modify_with_same_effective_date_max',
          'lastUpdatedTimestamp': '2019-05-24T13:40:14.7156854'
        },
        {
          'configurationParameterDetailID': 8,
          'configurationParameterID': 7,
          'configurationParameterName': 'Days Before Contract Expiration Notification Point',
          'parameterSpecificationTypeID': 2,
          'parameterSpecificationTypeName': 'Max',
          'configurationParameterValue': '30',
          'configurationParameterDetailName': 'days_before_contract_expiration_notification_point_max',
          'lastUpdatedTimestamp': '2019-05-24T13:40:14.7156854'
        },
        {
          'configurationParameterDetailID': 9,
          'configurationParameterID': 8,
          'configurationParameterName': 'Months With No Pub Change Notification Point',
          'parameterSpecificationTypeID': 2,
          'parameterSpecificationTypeName': 'Max',
          'configurationParameterValue': '18',
          'configurationParameterDetailName': 'months_with_no_pub_change_notification_point_max',
          'lastUpdatedTimestamp': '2019-05-24T13:40:14.7313149'
        },
        {
          'configurationParameterDetailID': 69,
          'configurationParameterID': 12,
          'configurationParameterName': 'Currency',
          'parameterSpecificationTypeID': 2,
          'parameterSpecificationTypeName': 'Max',
          'configurationParameterValue': 'USD',
          'configurationParameterDetailName': 'currency_max',
          'lastUpdatedTimestamp': '2019-05-30T12:36:56.1496998'
        },
        {
          'configurationParameterDetailID': 74,
          'configurationParameterID': 11,
          'configurationParameterName': 'Optimistic Lock Threshold',
          'parameterSpecificationTypeID': 2,
          'parameterSpecificationTypeName': 'Max',
          'configurationParameterValue': '30',
          'configurationParameterDetailName': 'optimistic_lock_threshold_max',
          'lastUpdatedTimestamp': '2019-05-30T12:40:56.0412291'
        },
        {
          'configurationParameterDetailID': 278,
          'configurationParameterID': 11,
          'configurationParameterName': 'Optimistic Lock Threshold',
          'parameterSpecificationTypeID': 3,
          'parameterSpecificationTypeName': 'Default',
          'configurationParameterValue': 'USD',
          'configurationParameterDetailName': 'optimistic_lock_threshold_default',
          'lastUpdatedTimestamp': '2019-06-18T06:13:34.8573725'
        },
        {
          'configurationParameterDetailID': 483,
          'configurationParameterID': 3,
          'configurationParameterName': 'User Back Date Days',
          'parameterSpecificationTypeID': 2,
          'parameterSpecificationTypeName': 'Max',
          'configurationParameterValue': '15',
          'configurationParameterDetailName': 'user_back_date_days_max',
          'lastUpdatedTimestamp': '2019-07-09T12:33:50.323'
        },
        {
          'configurationParameterDetailID': 486,
          'configurationParameterID': 10,
          'configurationParameterName': 'User Update Days',
          'parameterSpecificationTypeID': 2,
          'parameterSpecificationTypeName': 'Max',
          'configurationParameterValue': '15',
          'configurationParameterDetailName': 'user_update_days_max',
          'lastUpdatedTimestamp': '2019-07-09T12:33:50.329'
        },
        {
          'configurationParameterDetailID': 488,
          'configurationParameterID': 5,
          'configurationParameterName': 'User Future Date Days',
          'parameterSpecificationTypeID': 2,
          'parameterSpecificationTypeName': 'Max',
          'configurationParameterValue': '20',
          'configurationParameterDetailName': 'user_future_date_days_max',
          'lastUpdatedTimestamp': '2019-07-09T12:34:34.618'
        },
        {
          'configurationParameterDetailID': 515,
          'configurationParameterID': 9,
          'configurationParameterName': 'Super User Update Days',
          'parameterSpecificationTypeID': 2,
          'parameterSpecificationTypeName': 'Max',
          'configurationParameterValue': '30',
          'configurationParameterDetailName': 'super_user_update_days_max',
          'lastUpdatedTimestamp': '2019-07-10T09:26:03.599'
        },
        {
          'configurationParameterDetailID': 524,
          'configurationParameterID': 2,
          'configurationParameterName': 'Super User Back Date Days',
          'parameterSpecificationTypeID': 2,
          'parameterSpecificationTypeName': 'Max',
          'configurationParameterValue': '180',
          'configurationParameterDetailName': 'super_user_back_date_days_max',
          'lastUpdatedTimestamp': '2019-07-10T13:16:24.4'
        }
      ]
    };
    spyOn(cargoFilterService, 'getBuConfDtoService').and.returnValue(of(response));
    component.cargoMaxAmount();
  });

  it('should call - onSlideValue-if', () => {
    CargoReleaseService.setElasticparam(query);
    component.filterModel.cargoAmount = 1231231;
    component.onSlideValue(123123);
  });
  it('should call - onSlideValue-else', () => {
    CargoReleaseService.setElasticparam(query);
    component.onSlideValue(undefined);
  });

  it('should call - resetEvent', () => {
    component.filterConfig.statusData.expanded = true;
    const query1 = {
      'size': 25,
      'from': 0,
      '_source': '*',
      'script_fields': {
        'Status': {
          'script': {
            'lang': 'painless',
            'source': `def x = [];def sfn = new SimpleDateFormat('yyyy/MM/dd');
            def today = new Date();def now = sfn.parse(sfn.format(today));
            def sf = new SimpleDateFormat('yyyy - MM - dd');
            def expire = sf.parse(params['_source']['expirationDate']);
            if ((expire.after(now) || expire.equals(now)) && params['_source']['invalidIndicator'] == 'N'
            && params['_source']['invalidReasonTypeName'] == 'Active') {x.add('Active')}
            else if ((expire.before(now) && params['_source']['invalidIndicator'] == 'Y'
            && params['_source']['invalidReasonTypeName'] == 'InActive')||
             (expire.before(now) && params['_source']['invalidIndicator'] == 'N' && params['_source']
             ['invalidReasonTypeName'] == 'InActive')
              || (expire.before(now) && params['_source']['invalidIndicator'] == 'N' && params['_source']
              ['invalidReasonTypeName'] == 'Active'))
            { x.add('Inactive') } else if (params['_source']['invalidIndicator'] == 'Y' &&
            params['_source']['invalidReasonTypeName'] == 'Deleted')  { x.add('Deleted')} return x`
          }
        }
      },
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'customerAgreementID',
                'query': 75
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
                            'default_field': 'invalidIndicator',
                            'query': 'N'
                          }
                        },
                        {
                          'query_string': {
                            'default_field': 'invalidReasonTypeName',
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

                ]
              }
            },
            {
              'bool': {
                'must': [
                  {
                    'query_string': {
                      'default_field': 'agreementDefaultIndicator.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'range': {
                      'cargoReleaseAmount.integer': {
                        'gte': 100000,
                        'lte': 1000000
                      }
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'createProgramName.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'createTimestamp.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'createUserId.keyword',
                      'query': '**'
                    }
                  },
                  {
                    'bool': {
                      'should': [
                        {
                          'script': {
                            'script': `def sfn = new SimpleDateFormat('yyyy/MM/dd');
                            def today = new Date();def now = sfn.parse(sfn.format(today));
                            def sf=new SimpleDateFormat('yyyy - MM - dd');
                            def expire=sf.parse(doc['expirationDate.keyword'].value);
                             ((expire.after(now) || expire.equals(now)) &&
                            doc['invalidReasonTypeName.keyword'].value == 'active' && doc['invalidIndicator.keyword'].value == 'n')`
                          }
                        }
                      ]
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'lastUpdateProgramName.keyword',
                      'query': '**'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'lastUpdateTimestamp.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'lastUpdateUserId.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'contractAssociation.contractDisplayName.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'nested': {
                      'path': 'financeBusinessUnitAssociations',
                      'query': {
                        'query_string': {
                          'default_field': 'financeBusinessUnitAssociations.financeBusinessUnitCode.keyword',
                          'query': '*'
                        }
                      }
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'sectionAssociation.customerAgreementContractSectionName.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'range': {
                      'effectiveDate': {
                        'gte': '1995-01-01'
                      }
                    }
                  },
                  {
                    'range': {
                      'expirationDate': {
                        'lte': '2099-12-31'
                      }
                    }
                  },
                  {
                    'range': {
                      'originalEffectiveDate': {
                        'gte': '1995-01-01'
                      }
                    }
                  },
                  {
                    'range': {
                      'originalExpirationDate': {
                        'lte': '2099-12-31'
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
          'cargoType.keyword': {
            'order': 'asc'
          }
        }
      ]
    };
    component.filterModel.sourceData = {
      agreementID: 132,
      script: {
        active: 'def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();',
        deleted: '(doc["ContractRanges.ContractInvalidIndicator.keyword"].value == "y") ',
        inactive: 'def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();',
        status: 'def x = [];def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();'
      }
    };
    CargoReleaseService.setElasticparam(query1);
    component.resetEvent(true);
  });
  it('should call isStatusCollapsed - true', () => {
    component.filterConfig.statusData.expanded = true;
    component.isStatusCollapsed(true);
  });
  it('should call isStatusCollapsed - false', () => {
    component.filterConfig.statusData.expanded = false;
    component.isStatusCollapsed(false);
  });
  it('should call - resetStatus', () => {
    component.resetStatus();
    fixture.detectChanges();
  });

  it('should call - statusDataFramer', () => {
    const data: any = ['Active', 'Inactive', 'Deleted'];
    component.statusDataFramer(data);
  });
  it('should call onListingItemsSelected-agreementRadio', () => {
    const obj: any = { 'label': 'Yes', 'value': 'Yes' };
    component.onListingItemsSelected(obj, 'agreementRadio', 0, false);
  });

  it('should call onListingItemsSelected-selectedContract-single', () => {
    const obj: any = [{ 'label': 'Yes', 'value': 'Yes' }];
    component.onListingItemsSelected(obj, 'selectedContract', 9, false);
  });
  it('should call onListingItemsSelected-selectedContract-multi', () => {
    const obj: any = [{ 'label': 'Deleted', 'value': 'Deleted' }, { 'label': 'Active', 'value': 'Active' }];
    component.onListingItemsSelected(obj, 'selectedContract', 9, false);
  });
  it('should call onListingItemsSelected-selectedSection', () => {
    const obj: any = [{ 'label': 'Yes', 'value': 'Yes' }];
    component.onListingItemsSelected(obj, 'selectedSection', 11, false);
  });
  it('should call onListingItemsSelected-selectedSection-multi', () => {
    const obj: any = [{ 'label': 'Deleted', 'value': 'Deleted' }, { 'label': 'Active', 'value': 'Active' }];
    component.onListingItemsSelected(obj, 'selectedSection', 11, false);
  });

  it('should call onListingItemsSelected-default', () => {
    const obj: any = [{ 'label': 'Yes', 'value': 'Yes' }];
    component.onListingItemsSelected(obj, 'default', 11, false);
  });
  it('should call onListingItemsSelected-default-Else', () => {
    const obj: any = [{ 'label': 'Deleted', 'value': 'Deleted' }, { 'label': 'Active', 'value': 'Active' }];
    component.onListingItemsSelected(obj, 'default', 11, false);
  });

  it('should call onClearAllFilters', () => {
    component.filterModel.sourceData = {
      agreementID: 1091,
      script: {
        active: 'def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();',
        deleted: '(doc["ContractRanges.ContractInvalidIndicator.keyword"].value == "y") ',
        inactive: 'def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();',
        status: 'def x = [];def sfn = new SimpleDateFormat("yyyy/MM/dd");def today = new Date();'
      }
    };
    CargoReleaseService.setElasticparam(query);
    component.filterComponents = [];
    component.onClearAllFilters();
  });

  it('should call onResetDateRange', () => {
    CargoReleaseService.setElasticparam(query);
    component.onResetDateRange('originalEffectiveDate', 'originalExpirationDate', 14, 15);
  });
  it('should call onResetTimeStamp', () => {
    CargoReleaseService.setElasticparam(query);
    component.onResetTimeStamp('createdDateValue', 'createdTimeValue', 3);
  });
  it('should call onResetTimeStamp', () => {
    CargoReleaseService.setElasticparam(query);
    component.onResetTimeStamp('effectiveDate', 'expirationDate', 3);
  });
  it('should call onDateRangeSelect', () => {
    CargoReleaseService.setElasticparam(query);
    component.onDateRangeSelect('originalEffectiveDate', 14, 'gte');
  });

  it('should call onDateRangeBlur', () => {
    CargoReleaseService.setElasticparam(newQuery);
    component.filterModel['effectiveDate'] = '2019-07-11T00:00:00.000Z';
    component.onDateRangeBlur('effectiveDate', 12, 'gte');
  });

  it('should call onDateRangeBlur-else', () => {
    CargoReleaseService.setElasticparam(newQuery);
    component.filterModel['dateClearCheck']['originalEffectiveDateflag'] = true;
    component.filterModel.defaultStartDate = '1995-01-01';
    component.filterModel.defaultEndDate = '2099-12-31';
    component.onDateRangeBlur('originalEffectiveDate', 14, 'gte');
  });

  it('should call timeStampQueryFramer', () => {
    CargoReleaseService.getElasticparam();
    CargoReleaseService.setElasticparam(query);
    component.timeStampQueryFramer('createdDateValue', 'createdTimeValue', 3);
  });

  it('should call timeDisable-createdDateValue', () => {
    CargoReleaseService.setElasticparam(newQuery);
    component.filterModel['createdDateValue'] = '07/01/2019';
    component.timeDisable('createdTimeValue', 'createdDateValue');
  });

  it('should call timeDisable-updatedDateValue', () => {
    CargoReleaseService.setElasticparam(newQuery);
    component.filterModel['updatedDateValue'] = '07/01/2019';
    component.timeDisable('updatedTimeValue', 'updatedDateValue');
  });
  it('should call timeDisable-updatedDateValue-else', () => {
    CargoReleaseService.setElasticparam(newQuery);
    component.filterModel['updatedDateValue'] = '17/01/2019';
    component.timeDisable('updatedTimeValue', 'updatedDateValue');
  });
  it('should call onDateSelected-Create-Else', () => {
    CargoReleaseService.setElasticparam(newQuery);
    component.filterModel['createdDateValue'] = '07/01/2019';
    component.filterModel['createdTimeValue'] = '07:01:00';
    component.onDateSelected(3, 'createdDateValue', 'createdTimeValue');
  });

  it('should call onDateSelected-Create-If', () => {
    CargoReleaseService.setElasticparam(newQuery);
    component.filterModel['createdDateValue'] = '07/01/2019';
    component.onDateSelected(3, 'createdDateValue', 'createdTimeValue');
  });

  it('should call onDateSelected-Else', () => {
    CargoReleaseService.setElasticparam(query);
    component.onDateSelected(3, null, null);
  });
  it('should call queryFormation-Else', () => {
    const squery: any = {
      'size': 25,
      'from': 0,
      '_source': '*',
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'customerAgreementID',
                'query': 132
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
                            'default_field': 'invalidIndicator',
                            'query': 'N'
                          }
                        },
                        {
                          'query_string': {
                            'default_field': 'invalidReasonTypeName',
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

                ]
              }
            },
            {
              'bool': {
                'must': [
                  {
                    'query_string': {
                      'default_field': 'agreementDefaultIndicator.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'range': {
                      'cargoReleaseAmount.integer': {
                        'gte': 100000,
                        'lte': 1000000
                      }
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'createProgramName.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'createTimestamp.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'createUserId.keyword',
                      'query': '**'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'invalidReasonTypeName.keyword',
                      'query': 'Active'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'lastUpdateProgramName.keyword',
                      'query': '**'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'lastUpdateTimestamp.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'lastUpdateUserId.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'contractAssociation.contractDisplayName.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'nested': {
                      'path': 'financeBusinessUnitAssociations',
                      'query': {
                        'query_string': {
                          'default_field': 'financeBusinessUnitAssociations.financeBusinessUnitCode.keyword',
                          'query': '*'
                        }
                      }
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'sectionAssociation.customerAgreementContractSectionName.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'range': {
                      'effectiveDate': {
                        'gte': '1995-01-01'
                      }
                    }
                  },
                  {
                    'range': {
                      'expirationDate': {
                        'lte': '2099-12-31'
                      }
                    }
                  },
                  {
                    'range': {
                      'originalEffectiveDate': {
                        'gte': '1995-01-01'
                      }
                    }
                  },
                  {
                    'range': {
                      'originalExpirationDate': {
                        'lte': '2099-12-31'
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
          'cargoType.keyword': {
            'order': 'asc'
          }
        }
      ]
    };
    component.queryFormation('(Active) OR (Deleted)', false, squery, 5);
  });
  it('should call queryFormation-If', () => {
    const dquery: any = {
      'size': 25,
      'from': 0,
      '_source': '*',
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'customerAgreementID',
                'query': 132
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
                            'default_field': 'invalidIndicator',
                            'query': 'N'
                          }
                        },
                        {
                          'query_string': {
                            'default_field': 'invalidReasonTypeName',
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

                ]
              }
            },
            {
              'bool': {
                'must': [
                  {
                    'query_string': {
                      'default_field': 'agreementDefaultIndicator.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'range': {
                      'cargoReleaseAmount.integer': {
                        'gte': 100000,
                        'lte': 1000000
                      }
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'createProgramName.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'createTimestamp.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'createUserId.keyword',
                      'query': '**'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'invalidReasonTypeName.keyword',
                      'query': 'Active'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'lastUpdateProgramName.keyword',
                      'query': '**'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'lastUpdateTimestamp.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'lastUpdateUserId.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'contractAssociation.contractDisplayName.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'nested': {
                      'path': 'financeBusinessUnitAssociations',
                      'query': {
                        'query_string': {
                          'default_field': 'financeBusinessUnitAssociations.financeBusinessUnitCode.keyword',
                          'query': '*'
                        }
                      }
                    }
                  },
                  {
                    'query_string': {
                      'default_field': 'sectionAssociation.customerAgreementContractSectionName.keyword',
                      'query': '*'
                    }
                  },
                  {
                    'range': {
                      'effectiveDate': {
                        'gte': '1995-01-01'
                      }
                    }
                  },
                  {
                    'range': {
                      'expirationDate': {
                        'lte': '2099-12-31'
                      }
                    }
                  },
                  {
                    'range': {
                      'originalEffectiveDate': {
                        'gte': '1995-01-01'
                      }
                    }
                  },
                  {
                    'range': {
                      'originalExpirationDate': {
                        'lte': '2099-12-31'
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
          'cargoType.keyword': {
            'order': 'asc'
          }
        }
      ]
    };
    component.queryFormation('Active', true, dquery, 10);
  });
});
