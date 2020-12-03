import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { configureTestSuite } from 'ng-bullet';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { JbhFiltersModule } from '../jbh-filters.module';
import { AppModule } from '../../../app.module';

import { DateFilterComponent } from './date-filter.component';

describe('DateFilterComponent', () => {
  let component: DateFilterComponent;
  let fixture: ComponentFixture<DateFilterComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, JbhFiltersModule, AppModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFilterComponent);
    component = fixture.componentInstance;
    component.filterModel = {
      filterName: 'Effective Date',
      dateRadioName: 'effDateRadio',
      effDateRadio: 'Date',
      isEffDateExactMatchFlag: false,
      isExpDateExactMatchFlag: false,
      isOriginalEffDateExactMatchFlag: false,
      isOriginalExpDateExactMatchFlag: false,
      isPanelClosed: true,
      isEffDateOnlyFlag: true,
      isExpDateOnlyFlag: true,
      isOriginalEffDateOnlyFlag: true,
      isOriginalExpDateOnlyFlag: true,
      isDisableMatchFlag: true,
      startDate: '',
      endDate: '',
      expStartDate: '',
      expEndDate: '',
      originEffectiveDate: '',
      originExpirationDate: '',
      originalEffectiveDate: '',
      originalExpirationDate: '',
      effDateExactMatch: '',
      defaultEndDate: '12/31/2099',
      defaultStartDate: '01/01/1995',
      dateShowHide: {},
      dateFormat: 'MM/DD/YYYY',
      effectiveExactMatchParameter: {
        dateName: 'effDateExactMatch',
        keyName: 'effectiveDate',
        keyNameOther: 'expirationDate',
        index: 19,
        pointer: 0,
        level: 'lte',
        exactMatch: 'isEffDateExactMatchFlag',
        dateOnly: 'isEffDateOnlyFlag'
      },
      effectiveParameter: {
        dateName: 'startDate',
        keyName: 'effectiveDate',
        keyNameOther: 'expirationDate',
        index: 19,
        pointer: 0,
        level: 'gte',
        exactMatch: 'isEffDateExactMatchFlag',
        dateOnly: 'isEffDateOnlyFlag'
      },
      effectiveAndParameter: {
        dateName: 'endDate',
        keyName: 'effectiveDate',
        keyNameOther: 'expirationDate',
        index: 19,
        pointer: 0,
        level: 'lte',
        exactMatch: 'isEffDateExactMatchFlag',
        dateOnly: 'isEffDateOnlyFlag'
      }
    };
    component.currentQuery = {
      'from': 0,
      'size': 25,
      '_source': [
      ],
      'script_fields': {
        'Status': {
          'script': {
            'lang': 'painless',
            'source': ''
          }
        }
      },
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'agreementID',
                'query': '168'
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
                            'query': 'N'
                          }
                        },
                        {
                          'query_string': {
                            'default_field': 'invalidReasonType',
                            'query': 'Active'
                          }
                        },
                        {
                          'range': {
                            'expirationDate': {
                              'gte': 'now/d'
                            }
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
                ]
              }
            },
            {
              'bool': {
                'must': [
                  {
                    'range': {
                      'effectiveDate': {
                        'lte': '08/14/2019',
                        'gte': '08/14/2019'
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

  it('should call ngOnInit', () => {
    component.ngOnInit();
  });
  it('should call onDateRangeBlur', () => {
    const dataparam = {
      dateName: 'effDateExactMatch',
      dateOnly: 'effDateOnlyFlag',
      exactMatch: 'effDateExactMatchFlag',
      index: 4,
      keyName: 'ContractRanges.ContractEffectiveDate',
      keyNameOther: 'ContractRanges.ContractExpirationDate',
      level: 'lte',
      pointer: 0
    };
    component.filterModel['effDateExactMatch'] = 'Mon Jun 17 2019 00:00:00 GMT+0530 (India Standard Time)';
    component.onDateRangeBlur(dataparam);
  });
  it('should call clearDate', () => {
    component.clearDate('expStartDate', 'expEndDate', 12, 'expDateExactMatch');
  });
  it('should call dateRadioToggle', () => {
    component.dateRadioToggle(true, 'expDateOnlyFlag', 'expStartDate', 'expEndDate', 'expDateExactMatch', 12);
  });
  it('should call matchExactDate', () => {
    const dataparam = {
      dateName: 'effDateExactMatch',
      keyName: 'effectiveDate',
      keyNameOther: 'expirationDate',
      index: 19,
      pointer: 0,
      level: 'lte',
      exactMatch: 'isEffDateExactMatchFlag',
      dateOnly: 'isEffDateOnlyFlag'
    };
    const eve: any = true;
    component.matchExactDate(eve, dataparam);
  });
  it('should call resetRadio', () => {
    component.resetRadio('expDateRdio', 'expDateOnlyFlag', 'expDate', 'expDateExactMatchFlag');
  });
  it('should call onDateRangeSelect', () => {
    const dataparam = {
      dateName: 'effDateExactMatch',
      keyName: 'effectiveDate',
      keyNameOther: 'expirationDate',
      index: 19,
      pointer: 0,
      level: 'lte',
      exactMatch: 'isEffDateExactMatchFlag',
      dateOnly: 'isEffDateOnlyFlag'
    };
    component.onDateRangeSelect(dataparam);
  });
  it('should call onClearNestedQueryFormation startDate', () => {
    this.query1 = [
      {
        'range': {
          'effectiveDate': {
            'gte': '2019-06-14'
          }
        }
      }
    ];
    const dataparam = {
      dateName: 'effDateExactMatch',
      keyName: 'effectiveDate',
      keyNameOther: 'expirationDate',
      index: 19,
      pointer: 0,
      level: 'lte',
      exactMatch: 'isEffDateExactMatchFlag',
      dateOnly: 'isEffDateOnlyFlag'
    };
    component.currentQuery['query']['bool']['must'][19]['bool']['must'] = {
      'must': this.query1
    };
    const boolList = component.currentQuery['query']['bool']['must'][19]['bool']['must'];
    component.filterModel.endDate = '07/07/2018';
    component.onClearNestedQueryFormation('startDate', boolList, dataparam);
  });
  it('should call onClearNestedQueryFormation endDate', () => {
    this.query1 = [
      {
        'range': {
          'effectiveDate': {
            'gte': '2019-06-14'
          }
        }
      }
    ];
    component.currentQuery['query']['bool']['must'][19]['bool']['must'] = {
      'must': this.query1
    };
    const dataparam = {
      dateName: 'effDateExactMatch',
      keyName: 'effectiveDate',
      keyNameOther: 'expirationDate',
      index: 19,
      pointer: 0,
      level: 'lte',
      exactMatch: 'isEffDateExactMatchFlag',
      dateOnly: 'isEffDateOnlyFlag'
    };
    const boolList = component.currentQuery['query']['bool']['must'][19]['bool']['must'];
    component.filterModel.endDate = '07/07/2018';
    component.onClearNestedQueryFormation('startDate', boolList, dataparam);
  });
  it('should call nestedQueryFormation startDate', () => {
    component.filterModel.endDate = '';
    component.currentQuery['query']['bool']['must'][19]['bool']['must'] = {
      'must': [{
        'range': {
          'effectiveDate': {
            'lte': '2019-06-14',
            'gte': '2019-06-18'
          }
        }
      },
      {
        'range': {
          'expirationDate': {
            'gte': '2019-06-19',
            'lte': '2019-06-20'
          }
        }
      }]
    };
    const dataparam = {
      dateName: 'effDateExactMatch',
      keyName: 'effectiveDate',
      keyNameOther: 'expirationDate',
      index: 19,
      pointer: 0,
      level: 'lte',
      exactMatch: 'isEffDateExactMatchFlag',
      dateOnly: 'isEffDateOnlyFlag'
    };
    const boolList = component.currentQuery['query']['bool']['must'][19]['bool']['must'];
    component.nestedQueryFormation('startDate', boolList, dataparam);
  });
  it('should call nestedQueryFormation endDate', () => {
    component.filterModel.startDate = '';
    component.currentQuery['query']['bool']['must'][19]['bool']['must'] = {
      'must': [{
        'range': {
          'effectiveDate': {
            'lte': '2019-06-14',
            'gte': '2019-06-18'
          }
        }
      },
      {
        'range': {
          'expirationDate': {
            'gte': '2019-06-19',
            'lte': '2019-06-20'
          }
        }
      }]
    };
    const dataparam = {
      dateName: 'effDateExactMatch',
      keyName: 'effectiveDate',
      keyNameOther: 'expirationDate',
      index: 19,
      pointer: 0,
      level: 'lte',
      exactMatch: 'isEffDateExactMatchFlag',
      dateOnly: 'isEffDateOnlyFlag'
    };
    const boolList = component.currentQuery['query']['bool']['must'][19]['bool']['must'];
    component.nestedQueryFormation('endDate', boolList, dataparam);
  });
});
