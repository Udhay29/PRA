import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { MessageService } from 'primeng/components/common/messageservice';

import { AppModule } from '../../../../../app.module';
import { SettingsModule } from '../../../settings.module';
import { FuelPriceQuery } from './query/fuel-price-query';
import { FuelPriceComponent } from './fuel-price.component';
import { FuelPriceService } from './service/fuel-price.service';
import { FuelPriceUtilService } from './service/fuel-price-util.service';

describe('FuelPriceComponent', () => {
  let component: FuelPriceComponent;
  let fixture: ComponentFixture<FuelPriceComponent>;
  let fuelPriceService: FuelPriceService;
  let fuelPriceQuery: FuelPriceQuery;
  let messageService: MessageService;

  const filterDetails = {
    'from': 0, 'size': 25, 'fuelPriceSourceTypeName': 'DOE',
    'fuelRegionName': 'National', 'fuelPriceAmount': '*', 'unitOfVolumeMeasurementCode': '*', 'currencyCode':
      '*', 'fuelTypeName': '*', 'effectiveDateStart': 'now-1y', 'effectiveDateEnd': 'now', 'expireDateStart':
      '1901-01-01', 'expireDateEnd': '2099-12-31', 'sordDetails': {
        'field': 'effectiveDate',
        'order': 'desc'
      }, 'createProgramName': '*', 'createTimestamp': '*', 'createUserID': '**',
    'lastUpdateProgramName': '**', 'lastUpdateTimestamp': '*', 'lastUpdateUserID': '*', 'effectiveType': '*', 'expirationType': '*',
    'effectiveNonMatchDate': '*', 'expirationNonMatchDate': '*', 'pricingCountryCode': '*'
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, FuelPriceService, FuelPriceUtilService, FuelPriceQuery, MessageService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelPriceComponent);
    component = fixture.componentInstance;
    fuelPriceService = TestBed.get(FuelPriceService);
    fuelPriceQuery = TestBed.get(FuelPriceQuery);
    messageService = TestBed.get(MessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    component.fuelPriceModel.totalRecords = 0;
    component.ngOnInit();
  });
  it('should call getOverflowList', () => {
    component.getOverflowList();
  });
  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });
  it('should call loadGrid', async () => {
    const response = {
      'took': 21,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 50,
        'max_score': null,
        'hits': [{
          '_index': 'pricing-fuelprice',
          '_type': 'doc',
          '_id': '2135',
          '_score': null,
          '_source': {
            'uniqueDocID': '2135',
            'fuelPriceSourceTypeName': 'DOE',
            'pricingCountryCode': 'USA',
            'fuelRegionName': 'National',
            'fuelNationalDistrictName': 'National',
            'fuelSubDistrictName': null,
            'fuelPriceAmount': 3.147,
            'invalidIndicator': 'N',
            'invalidReasonTypeName': 'Active',
            'effectiveDate': '2019-04-22',
            'expirationDate': '2099-12-31',
            'fuelTypeName': 'Diesel',
            'currencyCode': 'USD',
            'unitOfVolumeMeasurementCode': 'Gallons',
            'createTimestamp': '2019-04-22T15:00:21',
            'createUserID': 'RBT118',
            'createProgramName': 'RBT118',
            'lastUpdateTimestamp': '2019-04-22T15:00:21',
            'lastUpdateUserID': 'RBT118',
            'lastUpdateProgramName': 'RBT118'
          },
          'sort': ['2019-04-22']
        }]
      }
    };
    component.fuelPriceModel.filterDetails = filterDetails;
    spyOn(fuelPriceService, 'getFuelPriceList').and.returnValue(of(response));
    component.loadGrid();
  });
  it('should call loadConfigValuesLazy', () => {
    component.fuelPriceModel.filterDetails = filterDetails;
    const eve: any = {
      'filters': {}, 'first': 0, 'globalFilter': null, 'multiSortMeta': [{
        field: 'effectiveDate',
        order: 1
      }], 'rows': 25, 'sortField': undefined,
      'sortOrder': 1
    };
    component.loadConfigValuesLazy(eve);
  });
  it('shoul call onPage', () => {
    component.onPage();
  });
  it('shoul call onSortSelect', () => {
    component.fuelPriceModel.filterDetails = filterDetails;
    const column = { 'name': 'currencyCode', 'property': 'currencyCode', 'isVisible': true };
    component.onSortSelect(column);
  });
  it('shoul call onFilterClick', () => {
    component.onFilterClick();
  });
  it('should call loadGridBasedOnFilter', () => {
    const dist = [];
    dist.push('National');
    const event = {
      'createProgramName': '*',
      'createTimestamp': '*',
      'createUserID': '*',
      'currencyCode': '*',
      'effectiveDate': '*',
      'expirationDate': '*',
      'fuelRegionName': dist,
      'fuelPriceAmount': '5689',
      'fuelPriceSourceTypeName': 'DOE',
      'fuelTypeName': '*',
      'lastUpdateProgramName': '*',
      'lastUpdateTimestamp': '*',
      'lastUpdateUserID': '*',
      'pricingCountryCode': '*',
      'unitOfVolumeMeasurementCode': '*'
    };
    component.loadGridBasedOnFilter(event);
  });
  it('should call fuelAmountFormator-zero', () => {
    component.fuelAmountFormator('1234.5');
  });
  it('should call fuelAmountFormator-two', () => {
    component.fuelAmountFormator('123.45');
  });
  it('should call fuelAmountFormator-three', () => {
    component.fuelAmountFormator('123.456');
  });
  it('should call fuelAmountFormator-four', () => {
    component.fuelAmountFormator('123.4567');
  });
  it('should call effectiveDateFramer - effectiveDateRange type', () => {
    const event = { 'effectiveDate': { 'type': 'effectiveDateRange', 'gte': '2019-05-14', 'lte': '2019-05-15' } };
    component.effectiveDateFramer(event);
  });
  it('should call effectiveDateFramer - effectiveExactMatch type', () => {
    const event = { 'effectiveDate': { 'type': 'effectiveExactMatch', 'gte': '2019-05-15', 'lte': '2019-05-15' } };
    component.effectiveDateFramer(event);
  });
  it('should call effectiveDateFramer - effectiveNonMatch type', () => {
    const event = { 'effectiveDate': { 'type': 'effectiveNonMatch', 'gte': '', 'lte': '2019-05-15' } };
    component.effectiveDateFramer(event);
  });
  it('should call effectiveDateFramer - default type', () => {
    const event = { 'effectiveDate': { 'type': 'effectiveNonMatchx', 'gte': '', 'lte': '2019-05-15' } };
    component.effectiveDateFramer(event);
  });
  it('should call effectiveDateFramer- else', () => {
    const event = { 'effectiveDate': { 'type': '' } };
    component.effectiveDateFramer(event);
  });

  it('should call expirationDateFramer expirationExactMatch type', () => {
    const event = { 'expirationDate': { 'type': 'expirationExactMatch', 'gte': '2019-05-15', 'lte': '2019-05-15' } };
    component.expirationDateFramer(event);
  });

  it('should call expirationDateFramer expirationDateRange type', () => {
    const event = { 'expirationDate': { 'type': 'expirationDateRange', 'gte': '2019-05-14', 'lte': '2019-05-15' } };
    component.expirationDateFramer(event);
  });

  it('should call expirationDateFramer expirationNonMatch type', () => {
    const event = { 'expirationDate': { 'type': 'expirationNonMatch', 'gte': '', 'lte': '2019-05-15' } };
    component.expirationDateFramer(event);
  });

  it('should call expirationDateFramer-else', () => {
    const event = { 'expirationDate': { 'type': '', 'gte': '', 'lte': '' } };
    component.expirationDateFramer(event);
  });

  it('should call queryDataFramer', () => {
    expect(component.queryDataFramer('DOE')).toEqual('DOE');
  });

  it('should call exportToExcel', () => {
    const query: any = {
      'from': 0,
      'size': 40,
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'invalidIndicator.keyword',
                'query': 'N'
              }
            },
            {
              'query_string': {
                'default_field': 'fuelPriceSourceTypeName.keyword',
                'query': 'DOE'
              }
            },
            {
              'query_string': {
                'default_field': 'fuelRegionName.keyword',
                'query': 'National'
              }
            },
            {
              'range': {
                'fuelPriceAmount': {

                }
              }
            },
            {
              'query_string': {
                'default_field': 'unitOfVolumeMeasurementCode.keyword',
                'query': '*'
              }
            },
            {
              'query_string': {
                'default_field': 'currencyCode.keyword',
                'query': '*'
              }
            },
            {
              'query_string': {
                'default_field': 'fuelTypeName.keyword',
                'query': '*'
              }
            },
            {
              'range': {
                'effectiveDate': {
                  'gte': 'now-1y',
                  'lte': 'now'
                }
              }
            },
            {
              'range': {
                'expirationDate': {
                  'gte': '1901-01-01',
                  'lte': '2099-12-31'
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
                'default_field': 'createUserID.keyword',
                'query': '**'
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
                'default_field': 'pricingCountryCode.keyword',
                'query': '*'
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
                'default_field': 'lastUpdateUserID.keyword',
                'query': '*'
              }
            }
          ]
        }
      },
      'sort': [
        {
          'fuelPriceSourceTypeName.keyword': {
            'order': 'asc'
          },
          'effectiveDate.keyword': {
            'order': 'desc'
          },
          'fuelRegionName.keyword': {
            'order': 'asc'
          }
        }
      ]
    };
    component.fuelPriceModel.fuelPriceQuery = query;
    component.fuelPriceModel.sortFlag = false;
    const blob = new Blob();
    spyOn(fuelPriceService, 'downloadExcel').and.returnValue(of(blob));
    component.exportToExcel();
  });

  it('should call toastMessage', () => {
    component.toastMessage(messageService, 'error', 'Error', 'input msg');
  });
});
