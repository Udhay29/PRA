import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { RatingRuleFilterComponent } from './rating-rule-filter.component';
import { RatingRuleFilterService } from './service/rating-rule-filter.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RatingRuleFilterUtilityService } from './service/rating-rule-filter.utility.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RatingRuleService } from '../service/rating-rule.service';
import { RatingRuleFilterQuery } from './query/rating-rule-filter.query';
import { RatingRuleQuery } from '../query/rating-rule.query';

xdescribe('RatingRuleFilterComponent', () => {
 let component: RatingRuleFilterComponent;
  let fixture: ComponentFixture<RatingRuleFilterComponent>;
  let service: RatingRuleFilterService;
  let ratingRuleFilterUtility: RatingRuleFilterUtilityService;
  const ruleCriteriaDefault = [{
    'ruleCriteriaID': 1,
    'ruleCriteriaName': 'Congestion Charge',
    'ruleCriteriaValues': [{
      'ruleCriteriaValueName': 'On intermediate stops',
      'ruleCriteriaValueID': 1
    }, {
      'ruleCriteriaValueName': 'On intermediate stops and destination',
      'ruleCriteriaValueID': 2
    }],
    '_links': {
      'self': {
        'href': 'https://pricing-test.jbhunt.com/pricingagreementservices/rulecriterias/1'
      },
      'ruleCriteria': {
        'href': 'https://pricing-test.jbhunt.com/pricingagreementservices/rulecriterias/1{?projection}',
        'templated': true
      }
    }
  }, {
    'ruleCriteriaID': 2,
    'ruleCriteriaName': 'Flat Rate With Stops',
    'ruleCriteriaValues': [{
      'ruleCriteriaValueName': 'Use published flat rate',
      'ruleCriteriaValueID': 3
    }, {
      'ruleCriteriaValueName': 'Use distance to recalculate flat rate',
      'ruleCriteriaValueID': 4
    }],
    '_links': {
      'self': {
        'href': 'https://pricing-test.jbhunt.com/pricingagreementservices/rulecriterias/2'
      },
      'ruleCriteria': {
        'href': 'https://pricing-test.jbhunt.com/pricingagreementservices/rulecriterias/2{?projection}',
        'templated': true
      }
    }
  }, {
    'ruleCriteriaID': 3,
    'ruleCriteriaName': 'Hazmat Charge Rules',
    'ruleCriteriaValues': [{
      'ruleCriteriaValueName': 'Placards not required to charge',
      'ruleCriteriaValueID': 5
    }, {
      'ruleCriteriaValueName': 'Placards required to charge',
      'ruleCriteriaValueID': 6
    }],
    '_links': {
      'self': {
        'href': 'https://pricing-test.jbhunt.com/pricingagreementservices/rulecriterias/3'
      },
      'ruleCriteria': {
        'href': 'https://pricing-test.jbhunt.com/pricingagreementservices/rulecriterias/3{?projection}',
        'templated': true
      }
    }
  }];

  const query = {
    'from': 0,
    'size': 25,
    '_source': '*',
    'query': {
      'bool': {
        'must': [
          {
            'query_string': {
              'default_field': 'customerAgreementID',
              'query': 123,
              'default_operator': 'AND'
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
                          'default_field': 'invalidReasonTypeName.keyword',
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
                      'agreementDefaultIndicator.keyword',
                      'citySubstitutionDisplayName.keyword',
                      'hazmatChargeRulesType.keyword',
                      'congestionChargeType.keyword',
                      'flatRateWithStopsType.keyword',
                      'effectiveDate.keyword',
                      'expirationDate.keyword'
                    ],
                    'query': '*',
                    'default_operator': 'AND'
                  }
                },
                {
                  'nested': {
                    'path': 'contractAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'contractAssociations.contractDisplayName.keyword',
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'financeBusinessUnitServiceOfferingAssociations',
                    'query': {
                      'query_string': {
                        'default_field':
                          'financeBusinessUnitServiceOfferingAssociations.financeBusinessUnitServiceOfferingDisplayName.keyword',
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'sectionAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'sectionAssociations.customerAgreementContractSectionName.keyword',
                        'query': '*',
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
                    'path': 'sectionAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'sectionAssociations.customerAgreementContractSectionName.keyword',
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'contractAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'contractAssociations.contractDisplayName.keyword',
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'financeBusinessUnitServiceOfferingAssociations',
                    'query': {
                      'query_string': {
                        'default_field':
                          'financeBusinessUnitServiceOfferingAssociations.financeBusinessUnitServiceOfferingDisplayName.keyword',
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'nested': {
                    'path': 'financeBusinessUnitServiceOfferingAssociations',
                    'query': {
                      'query_string': {
                        'default_field': 'financeBusinessUnitServiceOfferingAssociations.financeBusinessUnitCode.keyword',
                        'query': '*',
                        'default_operator': 'AND'
                      }
                    }
                  }
                },
                {
                  'query_string': {
                    'default_field': '*',
                    'query': '*',
                    'default_operator': 'AND'
                  }
                },
                {
                  'query_string': {
                    'default_field': '*',
                    'query': '*',
                    'default_operator': 'AND'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'agreementDefaultIndicator.keyword',
                    'query': '*',
                    'default_operator': 'AND'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'citySubstitutionDisplayName.keyword',
                    'query': '*',
                    'default_operator': 'AND'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'hazmatChargeRulesType.keyword',
                    'query': '*',
                    'default_operator': 'AND'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'congestionChargeType.keyword',
                    'query': '*',
                    'default_operator': 'AND'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'flatRateWithStopsType.keyword',
                    'query': '*',
                    'default_operator': 'AND'
                  }
                },
                {
                  'range': {
                    'effectiveDate': {
                      'gte': '01/01/1995',
                      'lte': '12/31/2099'
                    }
                  }
                },
                {
                  'range': {
                    'expirationDate': {
                      'gte': '01/01/1995',
                      'lte': '12/31/2099'
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
        'ratingRuleType.keyword': {
          'order': 'asc'
        }
      },
      {
        'agreementDefaultIndicator.keyword': {
          'order': 'asc'
        }
      },
      {
        'contractAssociations.contractDisplayName.keyword': {
          'order': 'asc',
          'nested': {
            'path': 'contractAssociations'
          },
          'missing': '_first'
        }
      },
      {
        'sectionAssociations.customerAgreementContractSectionName.keyword': {
          'order': 'asc',
          'nested': {
            'path': 'sectionAssociations'
          },
          'missing': '_first'
        }
      },
      {
        'financeBusinessUnitServiceOfferingAssociations.financeBusinessUnitServiceOfferingDisplayName.keyword': {
          'order': 'asc',
          'nested': {
            'path': 'financeBusinessUnitServiceOfferingAssociations'
          },
          'missing': '_first'
        }
      },
      {
        'citySubstitutionDisplayName.keyword': {
          'order': 'asc'
        }
      },
      {
        'hazmatChargeRulesType.keyword': {
          'order': 'asc'
        }
      },
      {
        'congestionChargeType.keyword': {
          'order': 'asc'
        }
      },
      {
        'flatRateWithStopsType.keyword': {
          'order': 'asc'
        }
      },
      {
        'effectiveDate': {
          'order': 'asc'
        }
      },
      {
        'expirationDate': {
          'order': 'asc'
        }
      }
    ]
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [RatingRuleFilterComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, RatingRuleFilterService,
        RatingRuleFilterUtilityService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingRuleFilterComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(RatingRuleFilterService);
    ratingRuleFilterUtility = fixture.debugElement.injector.get(RatingRuleFilterUtilityService);
    fixture.detectChanges();
    RatingRuleService.getElasticparam();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getRatingRulesCriteria', () => {
    const response = {
      '_embedded': {
        'ruleCriterias': [{
          'ruleCriteriaID': 1,
          'ruleCriteriaName': 'Congestion Charge',
          'ruleCriteriaValues': [{
            'ruleCriteriaValueName': 'On intermediate stops',
            'ruleCriteriaValueID': 1
          }, {
            'ruleCriteriaValueName': 'On intermediate stops and destination',
            'ruleCriteriaValueID': 2
          }],
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingagreementservices/rulecriterias/1'
            },
            'ruleCriteria': {
              'href': 'https://pricing-test.jbhunt.com/pricingagreementservices/rulecriterias/1{?projection}',
              'templated': true
            }
          }
        }, {
          'ruleCriteriaID': 2,
          'ruleCriteriaName': 'Flat Rate With Stops',
          'ruleCriteriaValues': [{
            'ruleCriteriaValueName': 'Use published flat rate',
            'ruleCriteriaValueID': 3
          }, {
            'ruleCriteriaValueName': 'Use distance to recalculate flat rate',
            'ruleCriteriaValueID': 4
          }],
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingagreementservices/rulecriterias/2'
            },
            'ruleCriteria': {
              'href': 'https://pricing-test.jbhunt.com/pricingagreementservices/rulecriterias/2{?projection}',
              'templated': true
            }
          }
        }, {
          'ruleCriteriaID': 3,
          'ruleCriteriaName': 'Hazmat Charge Rules',
          'ruleCriteriaValues': [{
            'ruleCriteriaValueName': 'Placards not required to charge',
            'ruleCriteriaValueID': 5
          }, {
            'ruleCriteriaValueName': 'Placards required to charge',
            'ruleCriteriaValueID': 6
          }],
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingagreementservices/rulecriterias/3'
            },
            'ruleCriteria': {
              'href': 'https://pricing-test.jbhunt.com/pricingagreementservices/rulecriterias/3{?projection}',
              'templated': true
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': 'https://pricing-test.jbhunt.com/pricingagreementservices/rulecriterias{?page,size,sort,projection}',
          'templated': true
        },
        'profile': {
          'href': 'https://pricing-test.jbhunt.com/pricingagreementservices/profile/rulecriterias'
        }
      },
      'page': {
        'size': 50,
        'totalElements': 3,
        'totalPages': 1,
        'number': 0
      }
    };
    spyOn(service, 'getRuleCriteria').and.returnValue(of(response));
    spyOn(service, 'getFilterConfig').and.callThrough();
    component.getRatingRulesCriteria();
  });

  it('should call ngOnInit', () => {
    component.ngOnInit();
  });

  it('should call ruleCriteriaFramer', () => {
    component.ruleCriteriaFramer('abc');
    component.ruleCriteriaFramer('123');
    component.ruleCriteriaFramer('Hazmat Charge Rules');
    component.ruleCriteriaFramer('Flat Rate With Stops');
    component.ruleCriteriaFramer('Congestion Charge');
  });

  it('should call ruleCriteriaFormation', () => {
    component.ruleCriteriaFormation('abc', 'dfg');
    component.ruleCriteriaFormation('123', 'abc');
  });

  it('should call ruleCriteriaFormation', () => {
    const criteriaArrayName = 'flatRateWithStopsRules';
    const ruleCriteria = { ruleCriteriaValues: [{ ruleCriteriaValueName: 'abc' }] };
    component.ruleCriteriaFormation(ruleCriteria, criteriaArrayName);
    expect(component.filterModel[criteriaArrayName].length).toBeGreaterThan(0);
  });

  it('should call ruleCriteriaFramer case Congestion Charge', () => {
    const criteriaArrayName = 'congestionChargeRules';
    const ruleCriteria = {
      ruleCriteriaName: 'Congestion Charge',
      ruleCriteriaValues: [{ ruleCriteriaValueName: 'abc' }]
    };
    component.ruleCriteriaFramer(ruleCriteria);
    expect(component.filterModel[criteriaArrayName].length).toBeGreaterThan(0);
  });

  it('should call ruleCriteriaFramer case Flat Rate With Stops', () => {
    const criteriaArrayName = 'flatRateWithStopsRules';
    const ruleCriteria = {
      ruleCriteriaName: 'Flat Rate With Stops',
      ruleCriteriaValues: [{ ruleCriteriaValueName: 'abc' }]
    };
    component.ruleCriteriaFramer(ruleCriteria);
    expect(component.filterModel[criteriaArrayName].length).toBeGreaterThan(0);
  });

  it('should call ruleCriteriaFramer case Hazmat Charge Rules', () => {
    const criteriaArrayName = 'hazmatChargeRules';
    const ruleCriteria = {
      ruleCriteriaName: 'Hazmat Charge Rules',
      ruleCriteriaValues: [{ ruleCriteriaValueName: 'abc' }]
    };
    component.ruleCriteriaFramer(ruleCriteria);
    expect(component.filterModel[criteriaArrayName].length).toBeGreaterThan(0);
  });

  it('should call ruleCriteriaFramer', () => {
    component.ruleCriteriaFramer(ruleCriteriaDefault);
  });

  it('should call ruleCriteriaFormation', () => {
    const criteriaArrayName = 'hazmatChargeRules';
    const ruleCriteria = { ruleCriteriaValues: [{ ruleCriteriaValueName: 'abc' }] };
    component.ruleCriteriaFormation(ruleCriteria, criteriaArrayName);
    expect(component.filterModel[criteriaArrayName].length).toBeGreaterThan(0);
  });

  it('should call onListingItemsSelected', () => {
    const event = { target: { value: '3' } };
    RatingRuleService.setElasticparam(query);
    component.onListingItemsSelected(event, 'radius', 7, false);
  });

  it('should call onListingItemsSelected', () => {
    const event = [{
      label: 'Agreement Default',
      value: 'Agreement Default'
    }];
    RatingRuleService.setElasticparam(query);
    component.onListingItemsSelected(event, 'agreementDefault', 6, false);
  });

  it('should call onListingItemsSelected', () => {
    const event = [{
      label: '1234 (schniTest)',
      value: '1234 (schniTest)'
    }];
    RatingRuleService.setElasticparam(query);
    component.onListingItemsSelected(event, 'contract', 1, true);
  });

  it('should call onListingItemsSelected', () => {
    const event = [{ label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }];
    RatingRuleService.setElasticparam(query);
    component.onListingItemsSelected(event, 'status', 14, false);
  });

  it('should call onListingItemsSelected', () => {
    const event = [];
    RatingRuleService.setElasticparam(query);
    component.onListingItemsSelected(event, 'status', 14, false);
  });

  it('should call onListingItemsSelected', () => {
    const event = [{ label: 'Active', value: 'Active' }];
    RatingRuleService.setElasticparam(query);
    component.onListingItemsSelected(event, 'status', 14, false);
  });

  it('should call onListingItemsSelected', () => {
    const event = [{ label: 'Inactive', value: 'Inactive' }];
    RatingRuleService.setElasticparam(query);
    component.onListingItemsSelected(event, 'status', 14, false);
  });

  it('should call onListingItemsSelected', () => {
    const event = [{ label: 'Deleted', value: 'Deleted' }];
    RatingRuleService.setElasticparam(query);
    component.onListingItemsSelected(event, 'status', 14, false);
  });

  it('should call onListingItemsSelected', () => {
    const event = [{ label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Deleted', value: 'Deleted' }];
    RatingRuleService.setElasticparam(query);
    component.onListingItemsSelected(event, 'status', 14, false);
  });

  it('should call onListingItemsSelected', () => {
    const event = [{ label: 'schnitSec1', value: 'schnitSec1' }];
    RatingRuleService.setElasticparam(query);
    component.onListingItemsSelected(event, 'section', 0, true);
  });

  it('should call onListingItemsSelected', () => {
    const event = [{ label: 'Placards not required to charge', value: 'Placards not required to charge' },
    { label: 'Placards required to charge', value: 'Placards required to charge' }];
    RatingRuleService.setElasticparam(query);
    component.onListingItemsSelected(event, 'hazmatChargeRule', 8, false);
  });
  it('should call onListingItemsSelected', () => {
    const event = [{ label: 'schnitSec1', value: 'schnitSec1' }];
    RatingRuleService.setElasticparam(query);
    component.onListingItemsSelected(event, 'serviceOfferings', 4, true);
  });
  it('should call onListingItemsSelected', () => {
    const event = [{ label: 'schnitSec1', value: 'schnitSec1' }, { label: 'schnitSec1', value: 'schnitSec1' }];
    RatingRuleService.setElasticparam(query);
    component.onListingItemsSelected(event, 'serviceOfferings', 4, true);
  });
  it('should call onListingItemsSelected', () => {
    const event = [{ label: 'schnitSec1', value: 'schnitSec1' }];
    RatingRuleService.setElasticparam(query);
    component.onListingItemsSelected(event, 'test', 4, true);
  });
  it('should call onListingItemsSelected', () => {
    const event = [{ label: 'schnitSec1', value: 'schnitSec1' }, { label: 'schnitSec1', value: 'schnitSec1' }];
    RatingRuleService.setElasticparam(query);
    component.onListingItemsSelected(event, 'test1', 4, true);
  });

  it('should call isDeletedSelected', () => {
    const selectedstatus = ['active', 'deleted'];
    component.isDeletedSelected(query, 14, 'active_deleted', selectedstatus);
  });

  it('should call isDeletedSelected', () => {
    const selectedstatus = ['inactive', 'deleted'];
    component.isDeletedSelected(query, 14, 'inactive_deleted', selectedstatus);
  });

  it('should call isDeletedSelected', () => {
    const selectedstatus = ['deleted'];
    component.isDeletedSelected(query, 14, '_deleted', selectedstatus);
  });

  it('should call isDeletedSelected', () => {
    const selectedstatus = [];
    component.isDeletedSelected(query, 14, '', selectedstatus);
  });

  it('should call setStatusQuery', () => {
    const selectedstatus = ['active', 'deleted'];
    component.setStatusQuery(query, 14, selectedstatus);
  });

  it('should call setStatusQuery', () => {
    const selectedstatus = ['inactive', 'deleted'];
    component.setStatusQuery(query, 14, selectedstatus);
  });

  it('should call setStatusQuery', () => {
    const selectedstatus = ['active'];
    component.setStatusQuery(query, 14, selectedstatus);
  });

  it('should call setStatusQuery', () => {
    const selectedstatus = ['inactive'];
    component.setStatusQuery(query, 14, selectedstatus);
  });

  it('should call setStatusQuery', () => {
    const selectedstatus = [];
    component.setStatusQuery(query, 14, selectedstatus);
  });

  it('should call queryFormation', () => {
    component.queryFormation('Placards not required to charge', false, query, 8);
  });

  it('should call queryFormation', () => {
    component.queryFormation('(Placards not required to charge) OR (Placards required to charge)', false, query, 8);
  });

  it('should call queryFormation', () => {
    component.queryFormation('Placards required to charge', false, query, 8);
  });

  it('should call queryFormation', () => {
    component.queryFormation('*', false, query, 8);
  });

  it('should call radiusQueryFormation', () => {
    component.radiusQueryFormation('3', false, query, 7);
  });

  it('should call radiusQueryFormation', () => {
    component.radiusQueryFormation('', false, query, 7);
  });

  it('should call radiusQueryFormation', () => {
    component.radiusQueryFormation('8', false, query, 7);
  });

  it('should call onDateRangeBlur', () => {
    RatingRuleService.setElasticparam(query);
    component.onDateRangeBlur('effectiveDate', 'RatingRuleEffectiveDate', 12, 'gte');
  });

  it('should call onDateRangeBlur', () => {
    RatingRuleService.setElasticparam(query);
    component.onDateRangeBlur('expirationDate', 'RatingRuleExpirationDate', 13, 'lte');
  });

  it('should call onDateRangeBlur', () => {
    RatingRuleService.setElasticparam(query);
    component.onDateRangeBlur('', 'RatingRuleExpirationDate', 13, 'lte');
  });

  it('should call onDateRangeBlur', () => {
    RatingRuleService.setElasticparam(query);
    component.onDateRangeBlur('', 'RatingRuleEffectiveDate', 12, 'gte');
  });

  it('should call onDateRangeSelect', () => {
    component.onDateRangeSelect('expirationDate', 'RatingRuleExpirationDate', 13, 'lte');
  });

  it('should call onDateRangeSelect', () => {
    component.onDateRangeSelect('effectiveDate', 'RatingRuleEffectiveDate', 12, 'gte');
  });

  it('should call onDateRangeSelect', () => {
    component.onDateRangeSelect('', 'RatingRuleEffectiveDate', 12, 'gte');
  });

  it('should call onDateRangeSelect', () => {
    component.onDateRangeSelect('', 'RatingRuleExpirationDate', 13, 'lte');
  });

  it('should call originDateClear', () => {
    RatingRuleService.setElasticparam(query);
    component.originDateClear('effectiveDate', 'RatingRuleEffectiveDate', 12);
  });

  it('should call originDateClear', () => {
    RatingRuleService.setElasticparam(query);
    component.originDateClear('expirationDate', 'RatingRuleExpirationDate', 13);
  });

  it('should call originDateClear', () => {
    RatingRuleService.setElasticparam(query);
    component.originDateClear('', 'RatingRuleEffectiveDate', 12);
  });

  it('should call originDateClear', () => {
    RatingRuleService.setElasticparam(query);
    component.originDateClear('', 'RatingRuleExpirationDate', 13);
  });

  it('should call radiusToggle', () => {
    RatingRuleService.setElasticparam(query);
    component.radiusToggle('Yes', 7);
  });

  it('should call radiusToggle', () => {
    RatingRuleService.setElasticparam(query);
    component.radiusToggle('No', 7);
  });

  it('should call radiusToggle', () => {
    RatingRuleService.setElasticparam(query);
    component.radiusToggle('', 7);
  });

  it('should call radiusToggle', () => {
    RatingRuleService.setElasticparam(query);
    component.radiusToggle('', 15);
  });

  it('should call resetStatus', () => {
    component.statusFlag = true;
    component.resetStatus();
  });
  it('should call resetEvent', () => {
    component.filterConfig.status = {
      'title': 'string test',
      'data': {},
      'callback': {},
      'url': 'string',
      'expanded': true
    };
    RatingRuleService.setElasticparam(query);
    component.resetEvent(true);
  });
  it('should call resetEvent', () => {
    component.filterConfig.status = {
      'title': 'string test',
      'data': {},
      'callback': {},
      'url': 'string',
      'expanded': true
    };
    RatingRuleService.setElasticparam(query);
    component.resetEvent(false);
  });
  it('should call isStatusCollapsed', () => {
    component.filterConfig.status = {
      'title': 'string test',
      'data': {},
      'callback': {},
      'url': 'string',
      'expanded': true
    };
    component.isStatusCollapsed(true);
  });
  it('should call isStatusCollapsed', () => {
    component.filterConfig.status = {
      'title': 'string test',
      'data': {},
      'callback': {},
      'url': 'string',
      'expanded': false
    };
    component.isStatusCollapsed(false);
  });
  it('should call statusFramer', () => {
    const data = ['Active', 'Inactive', 'Deleted'];
    component.statusFramer (data);
  });
  it('should call onInputDate', () => {
    const event = {
      'target': {
        'value': '12/28/2019'
      }
    };
    component.onInputDate (event, 'expirationDate', 'RatingRuleExpirationDate', 13, 'lte');
  });
  xit('should call onClearAllFilters', () => {
    RatingRuleService.setElasticparam(query);
    component.filterComponents = [];
    const checkbox = [
      {
        'tagName': 'P-RADIOBUTTON'
      },
      {
        'checked': true
      },
      {
        'tagName': 'P-RADIOBUTTON'
      },
      {
        'checked': false
      }
    ];
    checkbox[1]['checked'] = false;
    checkbox[3]['checked'] = false;
    component.onClearAllFilters();
  });

  it('contains  an Array', () => {
    const data = ['Active', 'Inactive', 'Deleted'];
    const status = component.statusFramer(data);
    expect(status.length).toBeGreaterThan(0);
  });
});
