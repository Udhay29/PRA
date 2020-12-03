import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import * as utils from 'lodash';
import * as moment from 'moment';
import { configureTestSuite } from 'ng-bullet';


import { AppModule } from '../../../../app.module';
import { SettingsModule } from './../../settings.module';
import { ViewChargesComponent } from './view-charges.component';
import { ViewChargesService } from './services/view-charges.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ViewChargesQueryService } from './services/view-charges-query.service';
import { of } from 'rxjs';


describe('ViewChargesComponent', () => {
  let component: ViewChargesComponent;
  let fixture: ComponentFixture<ViewChargesComponent>;
  let service: ViewChargesService;
  let tomessage: MessageService;
  let debugElement: DebugElement;
  let chargeQueryService: ViewChargesQueryService;
  const response = {
    'took': 6,
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
          '_index': 'pricing-charge-1-2019.05.17',
          '_type': 'doc',
          '_id': '45',
          '_score': null,
          '_source': {
            'ChargeUsageTypes': [
              {
                'ChargeUsageTypeName': 'Customer'
              }
            ],
            'ChargeTypeDescription': '',
            'ExpirationDate': '2019-06-05',
            'ChargeTypeIdentifier': 'qwerty123',
            'ChargeTypeName': 'qwerty',
            'ApplicationLevel': {
              'ChargeApplicationLevelTypeName': 'Order'
            },
            'AutoInvoiceIndicator': 'Allowed',
            'BusinessUnitServiceOfferings': [
              {
                'BusinessUnitServiceOfferingName': 'DCS-Backhaul',
                'BusinessUnit': 'DCS'
              },
              {
                'BusinessUnitServiceOfferingName': 'DCS-Dedicated',
                'BusinessUnit': 'DCS'
              }
            ],
            'RateTypes': [
              {
                'RateTypeName': 'Cwt'
              }
            ],
            'QuantityRequiredIndicator': 'No',
            'EffectiveDate': '2019-05-27'
          },
          'sort': [
            'qwerty123'
          ],
          'inner_hits': {
            'ChargeUsageTypes': {
              'hits': {
                'total': 1,
                'max_score': null,
                'hits': [
                  {
                    '_index': 'pricing-charge-1-2019.05.17',
                    '_type': 'doc',
                    '_id': '45',
                    '_nested': {
                      'field': 'ChargeUsageTypes',
                      'offset': 0
                    },
                    '_score': null,
                    '_source': {
                      'ChargeUsageTypeID': 1,
                      'ChargeUsageTypeName': 'Customer'
                    },
                    'sort': [
                      'customer'
                    ]
                  }
                ]
              }
            },
            'BusinessUnitServiceOfferings': {
              'hits': {
                'total': 2,
                'max_score': null,
                'hits': [
                  {
                    '_index': 'pricing-charge-1-2019.05.17',
                    '_type': 'doc',
                    '_id': '45',
                    '_nested': {
                      'field': 'BusinessUnitServiceOfferings',
                      'offset': 0
                    },
                    '_score': null,
                    '_source': {
                      'BusinessUnitServiceOfferingID': 4,
                      'BusinessUnitServiceOfferingName': 'DCS-Backhaul',
                      'BusinessUnit': 'DCS'
                    },
                    'sort': [
                      'dcs-backhaul'
                    ]
                  },
                  {
                    '_index': 'pricing-charge-1-2019.05.17',
                    '_type': 'doc',
                    '_id': '45',
                    '_nested': {
                      'field': 'BusinessUnitServiceOfferings',
                      'offset': 1
                    },
                    '_score': null,
                    '_source': {
                      'BusinessUnitServiceOfferingID': 5,
                      'BusinessUnitServiceOfferingName': 'DCS-Dedicated',
                      'BusinessUnit': 'DCS'
                    },
                    'sort': [
                      'dcs-dedicated'
                    ]
                  }
                ]
              }
            },
            'RateTypes': {
              'hits': {
                'total': 1,
                'max_score': null,
                'hits': [
                  {
                    '_index': 'pricing-charge-1-2019.05.17',
                    '_type': 'doc',
                    '_id': '45',
                    '_nested': {
                      'field': 'RateTypes',
                      'offset': 0
                    },
                    '_score': null,
                    '_source': {
                      'RateTypeID': 7,
                      'RateTypeName': 'Cwt'
                    },
                    'sort': [
                      'cwt'
                    ]
                  }
                ]
              }
            }
          }
        }
      ]
    },
    'aggregations': {
      'nested_bu': {
        'doc_count': 2,
        'bu': {
          'doc_count_error_upper_bound': 0,
          'sum_other_doc_count': 0,
          'buckets': [
            {
              'key': 'dcs',
              'doc_count': 2,
              'so': {
                'doc_count_error_upper_bound': 0,
                'sum_other_doc_count': 0,
                'buckets': [
                  {
                    'key': 'dcs-backhaul',
                    'doc_count': 1
                  },
                  {
                    'key': 'dcs-dedicated',
                    'doc_count': 1
                  }
                ]
              }
            }
          ]
        }
      }
    }
  };
  const err = {
    'error': {
      'traceid': '343481659c77ad99',
      'errors': [{
        'name': 'error',
        'fieldErrorFlag': false,
        'errorMessage': 'Failed to convert undefined into java.lang.Integer!',
        'errorType': 'System Runtime Error',
        'fieldName': null,
        'code': 'ServerRuntimeError',
        'errorSeverity': 'ERROR'
      }]
    }
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    chargeQueryService = TestBed.get(ViewChargesQueryService);
    service = TestBed.get(ViewChargesService);
    tomessage = TestBed.get(MessageService);
    fixture = TestBed.createComponent(ViewChargesComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
    service = debugElement.injector.get(ViewChargesService);
    chargeQueryService = debugElement.injector.get(ViewChargesQueryService);
  });
  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('should call fetchChargeCodes', () => {
    spyOn(service, 'getViewChargeCodes').and.returnValues(of(response));
    component.viewChargesModel.chargeCodesDetails.effectiveDate = '05/27/2019';
    component.viewChargesModel.chargeCodesDetails.expirationDate = '05/27/2019';
    component.fetchChargeCodes();
    expect(component.fetchChargeCodes).toBeTruthy();
  });
  it('should call fetchChargeCodes', () => {
    spyOn(service, 'getViewChargeCodes').and.returnValues(of(response));
    component.viewChargesModel.chargeCodesDetails.effectiveDate = '--';
    component.viewChargesModel.chargeCodesDetails.expirationDate = '--';
    component.fetchChargeCodes();
    expect(component.fetchChargeCodes).toBeTruthy();
  });
  it('should call onResize', () => {
    component.onResize();
    expect(component.onResize).toBeTruthy();
  });
  it('should call ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(component.ngAfterViewInit).toBeTruthy();
  });
  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(component.ngOnDestroy).toBeTruthy();
  });
  it('should call onClickCreateCharge for if', () => {
    component.viewChargesModel.isFilterEnabled = true;
    component.onClickCreateCharge();
  });
  it('should call onClickCreateCharge for else', () => {
    component.viewChargesModel.isFilterEnabled = false;
    component.onClickCreateCharge();
  });
  it('should call closeSplitView for if', () => {
    const event = new MessageEvent(
      'newMessage',
      {
        bubbles: true,
        cancelable: true
      }
    );
    component.closeSplitView(event);
  });
  it('should call closeSplitView for else', () => {
    component.closeSplitView(event);
  });
  it('should call displayCodes for if', () => {
    const value = 'Customer';
    component.displayCodes(value);
  });
  it('should call displayCodes for else', () => {
    const value = 'Cwt';
    component.displayCodes(value);
  });
  it('should call loadGridData for if', () => {
    const event = {
      rows: 10,
      first: 1,
      sortField: 'Service Offering',
      sortOrder: 'asc',
      target: {
        value: 'asd'
      }
    };
    component.viewChargesModel.tableContent = [{
      chargeIdentifier: 'string',
    chargeTypeDescription: 'string',
    chargeTypeBusinessUnitServiceOfferingAssociations: 'string',
    rateTypes: 'string',
    chargeUsageType: 'string',
    chargeApplicationLevelTypes: 'string',
    quantityRequiredIndicator: 'string',
    autoInvoiceIndicator: 'string',
    effectiveDate: 'string',
    expirationDate: 'string',
    tableToolTip: 'string',
    rateTypeToolTip: 'string',
    chargeUsageTypeToolTip: 'string'
    }];
    spyOn(ViewChargesQueryService, 'getElasticparam').and.returnValues(of(event));
    component.loadGridData(event);
  });
  it('should call loadGridData for else', () => {
    const event = {
      rows: 10,
      first: 1,
      sortField: 'Service Offering',
      sortOrder: 'asc',
      target: {
        value: 'asd'
      }
    };
    component.viewChargesModel.tableContent = [];
    spyOn(ViewChargesQueryService, 'getElasticparam').and.returnValues(of(event));
    component.loadGridData(event);
  });
  it('should call sortGridData for if', () => {
    const event = {
      rows: 10,
      first: 1,
      sortField: 'Service Offering',
      sortOrder: 'asc',
      target: {
        value: 'asd'
      }
    };
    const elasticQuery = {};
    spyOn(ViewChargesQueryService, 'getElasticparam').and.returnValues(of(event));
    component.sortGridData(elasticQuery, event);
    expect(component.sortGridData).toBeTruthy();
  });
  it('should call sortGridData for if -if ', () => {
    const event = {
      rows: 10,
      first: 1,
      sortField: 'abcd',
      sortOrder: 'asc',
      target: {
        value: 'asd'
      }
    };
    const elasticQuery = {};
    spyOn(ViewChargesQueryService, 'getElasticparam').and.returnValues(of(event));
    component.sortGridData(elasticQuery, event);
    expect(component.sortGridData).toBeTruthy();
  });
  it('should call sortGridData for else', () => {
    const event = {
      };
    const elasticQuery = {};
    spyOn(ViewChargesQueryService, 'getElasticparam').and.returnValues(of(event));
    component.sortGridData(elasticQuery, event);
    expect(component.sortGridData).toBeTruthy();
  });
  it('should call onSearch', () => {
    const event = new MessageEvent(
      'newMessage',
      {
        bubbles: true,
        cancelable: true
      }
    );
    spyOn(ViewChargesQueryService, 'getElasticparam').and.callThrough();
    component.onSearch(event, 'abc');
  });
  it('should call filterGridData for if', () => {
    const event = new MessageEvent(
      'newMessage',
      {
        bubbles: true,
        cancelable: true
      }
    );
    spyOn(ViewChargesQueryService, 'getElasticparam').and.callThrough();
    spyOn(ViewChargesQueryService, 'setElasticparam').and.callThrough();
    component.chargeCodeSubscription.closed = false;
    component.filterGridData(event);
  });
  it('should call filterGridData for else', () => {
    const event = new MessageEvent(
      'newMessage',
      {
        bubbles: true,
        cancelable: true
      }
    );
    spyOn(ViewChargesQueryService, 'getElasticparam').and.callThrough();
    spyOn(ViewChargesQueryService, 'setElasticparam').and.callThrough();
    component.chargeCodeSubscription.closed = true;
    component.filterGridData(event);
  });
  it('should call getServiceOfferingList for if', () => {
    const data = {'BusinessUnitServiceOfferings': [{
      'hits': {
        'total': 2,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-charge-1-2019.05.17',
            '_type': 'doc',
            '_id': '45',
            '_nested': {
              'field': 'BusinessUnitServiceOfferings',
              'offset': 0
            },
            '_score': null,
            '_source': {
              'BusinessUnitServiceOfferingID': 4,
              'BusinessUnitServiceOfferingName': 'DCS-Backhaul',
              'BusinessUnit': 'DCS'
            },
            'sort': [
              'dcs-backhaul'
            ]
          },
          {
            '_index': 'pricing-charge-1-2019.05.17',
            '_type': 'doc',
            '_id': '45',
            '_nested': {
              'field': 'BusinessUnitServiceOfferings',
              'offset': 1
            },
            '_score': null,
            '_source': {
              'BusinessUnitServiceOfferingID': 5,
              'BusinessUnitServiceOfferingName': 'DCS-Dedicated',
              'BusinessUnit': 'DCS'
            },
            'sort': [
              'dcs-dedicated'
            ]
          }
        ]
      }
    }]};
    component.getServiceOfferingList(data);
  });
  it('should call getServiceOfferingList for else', () => {
    const data = {'BusinessUnitServiceOfferings': [
    ]};
    component.getServiceOfferingList(data);
  });
  it('should call getRateTypes for if', () => {
    const data = {  '_embedded' : {
      'rateTypes' : [ {
        'rateTypeId' : 1,
        'rateTypeName' : 'Percent Entered',
        '_links' : {
          'self' : {
            'href' : 'https://pricing-test.jbhunt.com/api/pricingconfigurationservices/ratetypes/1'
          },
          'rateType' : {
            'href' : 'https://pricing-test.jbhunt.com/api/pricingconfigurationservices/ratetypes/1{?projection}',
            'templated' : true
          }
        }
      }]}};
    component.getRateTypes(data);
  });
  it('should call getRateTypes for else', () => {
    const data = {  '_embedded' : {
      'rateTypes' : []}};
    component.getRateTypes(data);
  });
  it('should call getUsageTypeList for if', () => {
    const data = {
      '_embedded' : {
        'chargeUsageTypes' : [ {
          'chargeUsageTypeName' : 'Customer',
          'chargeUsageTypeID' : 1,
          '_links' : {
            'self' : {
              'href' : 'https://pricing-test.jbhunt.com/api/pricingconfigurationservices/chargeusagetypes/1'
            },
            'chargeUsageType' : {
              'href' : 'https://pricing-test.jbhunt.com/api/pricingconfigurationservices/chargeusagetypes/1{?projection}',
              'templated' : true
            }
          }
        }]}};
    component.getUsageTypeList(data);
  });
  it('should call getUsageTypeList for else', () => {
    const data = {
      '_embedded' : {
        'chargeUsageTypes' : []}};
    component.getUsageTypeList(data);
  });
  it('should call handleError', () => {
    component.handleError({ message: 'Error', name: '' }, '');
  });
});
