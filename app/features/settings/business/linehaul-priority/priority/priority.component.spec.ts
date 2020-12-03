import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { PriorityService } from './service/priority.service';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { of } from 'rxjs';
import { SettingsModule } from '../../../settings.module';
import { PriorityComponent } from './priority.component';
import { LinehaulPriorityModel } from '../model/linehaul-priority.model';

describe('PriorityComponent', () => {
  let component: PriorityComponent;
  let fixture: ComponentFixture<PriorityComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityComponent);
    component = fixture.componentInstance;
    component.linehaulPrioritymodel = new LinehaulPriorityModel();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call toastMessage', () => {
      component.toastMessage('error', 'c');
  });

  it('fetchPriorityDetails', () => {
    component.fetchPriorityDetails();
  });
  it('loadGridData', () => {
    const event = new Event('abc');
      event['filters'] = {},
      event['first'] = 0,
      event['globalFilter'] = null,
      event['multiSortMeta'] = undefined,
      event['rows'] = 25,
      event['sortField'] = undefined,
      event['sortOrder'] = 1,
      component.priorityModel.gridRows = [{
        lineHaulPriorityGroupNumber: 12,
        originPointPriorityGroupName: 'string',
        destinationPointPriorityGroupName: 'string'
      }];
      component.priorityModel.gridDataLength = 10;
    component.loadGridData(event);
  });

  it('getGridValues', () => {
    const event: any = {
      originalEvent: {
        bubbles: false,
        cancelBubble: false,
        cancelable: false,
        composed: true,
        currentTarget: { value: 'a'},
        data: 'a',
        dataTransfer: null,
        defaultPrevented: false,
        detail: 0,
        eventPhase: 0,
        inputType: 'insertText',
        isComposing: false,
        isTrusted: true,
        path: [],
        returnValue: true,
        sourceCapabilities: null,
        srcElement: {},
        target: {},
        timeStamp: 22881320.635,
        type: 'input',
        view: null,
        which: 0
      },
      query: 'a'
    };
  component.getGridValues(event);
});

it('sortGridData', () => {
  const event = new Event('abc');
      event['filters'] = {},
      event['first'] = 0,
      event['globalFilter'] = null,
      event['multiSortMeta'] = undefined,
      event['rows'] = 25,
      event['sortField'] = 12,
      event['sortOrder'] = 1;
const elasticresp = {
    from: 0,
    size: 25,
    _source: [
      'lineHaulPriorityGroupNumber',
      'originPointPriorityGroupName',
      'destinationPointPriorityGroupName'
    ],
    query: {
      bool: {
        must: [
          {
            bool: {
              should: [
                {
                  query_string: {
                    fields: [
                      'lineHaulPriorityGroupNumber',
                      'originPointPriorityGroupName',
                      'destinationPointPriorityGroupName'
                    ],
                    query: '*',
                    default_operator: 'AND'
                  }
                }
              ]
            }
          },
          {
            bool: {
              must: [
                {
                  query_string: {
                    default_field: 'destinationPointPriorityGroupName.keyword',
                    query: '*'
                  }
                },
                {
                  query_string: {
                    default_field: 'lineHaulPriorityGroupNumber.keyword',
                    query: '*'
                  }
                },
                {
                  query_string: {
                    default_field: 'originPointPriorityGroupName.keyword',
                    query: '*'
                  }
                }
              ]
            }
          }
        ]
      }
    },
    sort: [
      {
        'lineHaulPriorityGroupNumber.integer': {
          order: 'desc'
        }
      }
    ]
  };
  component.sortGridData(elasticresp, event);
});

it('fetchPriorityDetailsFromElastic', () => {
const elasticresp = {
  from: 0,
  size: 25,
  _source: [
    'lineHaulPriorityGroupNumber',
    'originPointPriorityGroupName',
    'destinationPointPriorityGroupName'
  ],
  query: {
    bool: {
      must: [
        {
          bool: {
            should: [
              {
                query_string: {
                  fields: [
                    'lineHaulPriorityGroupNumber',
                    'originPointPriorityGroupName',
                    'destinationPointPriorityGroupName'
                  ],
                  query: '*',
                  default_operator: 'AND'
                }
              }
            ]
          }
        },
        {
          bool: {
            must: [
              {
                query_string: {
                  default_field: 'destinationPointPriorityGroupName.keyword',
                  query: '*'
                }
              },
              {
                query_string: {
                  default_field: 'lineHaulPriorityGroupNumber.keyword',
                  query: '*'
                }
              },
              {
                query_string: {
                  default_field: 'originPointPriorityGroupName.keyword',
                  query: '*'
                }
              }
            ]
          }
        }
      ]
    }
  },
  sort: [
    {
      'lineHaulPriorityGroupNumber.integer': {
        order: 'desc'
      }
    }
  ]
};
component.fetchPriorityDetailsFromElastic(elasticresp);
});

it('fetchPriorityDetailsFromElastic', () => {
  const priorityService: PriorityService = fixture.debugElement.injector.get(
    PriorityService
  );
const responsenow = {
  took: 17,
  timed_out: false,
  _shards: {
    total: 3,
    successful: 3,
    skipped: 0,
    failed: 0
  },
  hits: {
    total: 32,
    max_score: null,
    hits: [
      {
        _index: 'pricing-linehaul-priority',
        _type: 'doc',
        _id: 94,
        _score: null,
        _source: {
          lineHaulPriorityGroupNumber: 35,
          originPointPriorityGroupName: 'Address, Ramp, Yard, Location',
          destinationPointPriorityGroupName: '2-Zip Range, Region, State'
        },
        sort: [
          '2-zip range, region, state'
        ]
      }
    ]
  }
};

const elasticresp = {
  from: 0,
  size: 25,
  _source: [
    'lineHaulPriorityGroupNumber',
    'originPointPriorityGroupName',
    'destinationPointPriorityGroupName'
  ],
  query: {
    bool: {
      must: [
        {
          bool: {
            should: [
              {
                query_string: {
                  fields: [
                    'lineHaulPriorityGroupNumber',
                    'originPointPriorityGroupName',
                    'destinationPointPriorityGroupName'
                  ],
                  query: '*',
                  default_operator: 'AND'
                }
              }
            ]
          }
        },
        {
          bool: {
            must: [
              {
                query_string: {
                  default_field: 'destinationPointPriorityGroupName.keyword',
                  query: '*'
                }
              },
              {
                query_string: {
                  default_field: 'lineHaulPriorityGroupNumber.keyword',
                  query: '*'
                }
              },
              {
                query_string: {
                  default_field: 'originPointPriorityGroupName.keyword',
                  query: '*'
                }
              }
            ]
          }
        }
      ]
    }
  },
  sort: [
    {
      'lineHaulPriorityGroupNumber.integer': {
        order: 'desc'
      }
    }
  ]
};
spyOn(priorityService, 'getPriorityDetails').and.returnValues(of(responsenow));
component.fetchPriorityDetailsFromElastic(elasticresp);
});
});
