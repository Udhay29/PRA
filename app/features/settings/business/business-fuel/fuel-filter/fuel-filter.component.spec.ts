import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '../../../../../app.module';
import { SettingsModule } from '../../../settings.module';
import { FuelFilterComponent } from './fuel-filter.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

describe('FuelFilterComponent', () => {
  let component: FuelFilterComponent;
  let fixture: ComponentFixture<FuelFilterComponent>;
  let dataValue;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    dataValue = [{
      'label': 'National',
      'value': 'National'
    }];
    fixture = TestBed.createComponent(FuelFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
  });
  it('should call afterPanelToggle', () => {
    component.afterPanelToggle(true, 'fuelPrice');
  });
  it('should call onListingItemsSelected', () => {
    component.onListingItemsSelected(dataValue, 'source');
  });
  it('should call onListingItemsSelected-else', () => {
    component.onListingItemsSelected([], 'source');
  });
  it('should call onClearAllFilters', () => {
    component.onClearAllFilters();
  });

  it('should call resetSource', () => {
    component.resetSource(true);
  });
  it('should call resetSource-else', () => {
    component.resetSource(false);
  });

  it('should call resetRegion', () => {
    component.resetRegion(true);
  });
  it('should call resetRegion-else', () => {
    component.resetRegion(false);
  });

  it('should call isSourceCollapsed', () => {
    component.isSourceCollapsed(true);
  });
  it('should call isSourceCollapsed-else', () => {
    component.isSourceCollapsed(false);
  });

  it('should call isRegionCollapsed', () => {
    component.isRegionCollapsed(true);
  });
  it('should call isRegionCollapsed-else', () => {
    component.isRegionCollapsed(false);
  });

  it('should call validateCurrency', () => {
    component.validateCurrency('4');
  });
  it('should call validateCurrency-else', () => {
    component.validateCurrency('');
  });

  it('should call amountValidator', () => {
    component.amountValidator('yes');
  });

  it('should call formatAmount', () => {
    component.formatAmount('test');
  });
  it('should call formatAmount-else if', () => {
    component.formatAmount('124.890');
  });

  it('should call clearAmount', () => {
    component.clearAmount();
  });
  it('should call onCreateDate-time', () => {
    component.filterModel.createdOnDate = '05-08-2019';
    component.filterModel.createdOnTime = '03:14:07.999999';
    component.onCreateDate();
  });
  it('should call onCreateDate', () => {
    component.filterModel.createdOnDate = '05-08-2019';
    component.filterModel.createdOnTime = '';
    component.onCreateDate();
  });
  it('should call onCreateDate-else', () => {
    component.filterModel.createdOnDate = '';
    component.filterModel.createdOnTime = '';
    component.onCreateDate();
  });

  it('should call onCreateTime', () => {
    component.filterModel.createdOnDate = '05-08-2019';
    component.filterModel.createdOnTime = '03:14:07.999999';
    component.onCreateTime();
  });

  it('should call onCreateTime-else', () => {
    component.filterModel.createdOnDate = '';
    component.filterModel.createdOnTime = '';
    component.onCreateTime();
  });

  it('should call onUpdateDate-time', () => {
    component.filterModel.updatedOnDate = '05-08-2019';
    component.filterModel.updatedOnTime = '03:14:07.999999';
    component.onUpdateDate();
  });
  it('should call onUpdateDate', () => {
    component.filterModel.updatedOnDate = '05-08-2019';
    component.filterModel.updatedOnTime = '';
    component.onUpdateDate();
  });
  it('should call onUpdateDate-else', () => {
    component.filterModel.updatedOnDate = '';
    component.filterModel.updatedOnTime = '';
    component.onUpdateDate();
  });

  it('should call onUpdateTime', () => {
    component.filterModel.updatedOnDate = '05-08-2019';
    component.filterModel.updatedOnTime = '03:14:07.999999';
    component.onUpdateTime();
  });
  it('should call onUpdateTime-else', () => {
    component.filterModel.updatedOnDate = '';
    component.filterModel.updatedOnTime = '';
    component.onUpdateTime();
  });

  it('should call clearDateValues', () => {
    component.clearDateValues('test1', 'test2', 'test3');
  });
  it('should call dateRadioToggle', () => {
    component.dateRadioToggle(true, 'test1', 'test2', 'test3', 'test4', 'test5', 'test6');
  });
  it('should call clearDate', () => {
    component.clearDate('effectiveEndDate', 'effectiveStartDate', 'effectiveDateValue', 'effectiveDate', 'defaultSelect',
      'effDateOnlyFlag', 'effectiveCheck');
  });

  it('should call matchExactDate', () => {
    component.matchExactDate(true);
  });
  it('should call matchExactDate-else', () => {
    component.matchExactDate(false);
  });

  it('should call effectiveKeyFinder', () => {
    component.effectiveKeyFinder();
  });

  it('should call expirationMatchExactDate', () => {
    component.expirationMatchExactDate(true);
  });
  it('should call expirationMatchExactDate-else', () => {
    component.expirationMatchExactDate(false);
  });

  it('should call onDateRangeSelect', () => {
    component.onDateRangeSelect('effectiveDateValue');
  });
  it('should call onDateRangeSelect', () => {
    component.onDateRangeSelect('effectiveStartDate');
  });
  it('should call onDateRangeSelect', () => {
    component.filterModel.effectiveType = 'range';
    component.onDateRangeSelect('date');
  });

  it('should call validateDateRange', () => {
    component.filterModel.effectiveStartDate = '08/05/2019';
    component.filterModel.effectiveEndDate = '';
    component.validateDateRange({}, 'effectiveStartDate', 'effectiveEndDate', 'effectiveDateRange');
  });
  it('should call validateDateRange-else-if', () => {
    component.filterModel.effectiveStartDate = '08/05/2019';
    component.filterModel.effectiveEndDate = '08/15/2019';
    component.validateDateRange({}, 'effectiveStartDate', 'effectiveEndDate', 'effectiveDateRange');
  });
  it('should call validateDateRange-else', () => {
    component.filterModel.effectiveStartDate = '';
    component.filterModel.effectiveEndDate = '08/15/2019';
    component.validateDateRange({}, 'effectiveStartDate', 'effectiveEndDate', 'effectiveDateRange');
  });
  it('should call expDateRadioToggle', () => {
    component.expDateRadioToggle(true, 'test1', 'test2', 'test3', 'test4', 'test5', 'test6');
  });
  it('should call expirationKeyFinder', () => {
    component.expirationKeyFinder();
  });

  it('should call onExpirationRangeSelect-StartDate', () => {
    component.onExpirationRangeSelect('expirationStartDate');
  });
  it('should call onExpirationRangeSelect-EndDate', () => {
    component.onExpirationRangeSelect('expirationEndDate');
  });
  it('should call onExpirationRangeSelect-else', () => {
    component.filterModel.expirationType = 'range';
    component.onExpirationRangeSelect('date');
  });

  it('should call sourceFramer', () => {
    const data = {
      'took': 27,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 561,
        'max_score': 1.0,
        'hits': [
          {
            '_index': 'pricing-fuelprice-1-2019.05.07',
            '_type': 'doc',
            '_id': '565',
            '_score': 1.0,
            '_source': {
              'fuelPriceSourceTypeName': 'Doe'
            }
          }
        ]
      }
    };
    component.sourceFramer(data);
  });
  it('should call regionFramer', () => {
    const data = {
      'took': 27,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 561,
        'max_score': 1.0,
        'hits': [
          {
            '_index': 'pricing-fuelprice-1-2019.05.07',
            '_type': 'doc',
            '_id': '565',
            '_score': 1.0,
            '_source': {
              'fuelRegionName': 'National'
            }
          }
        ]
      }
    };
    component.regionFramer(data);
  });
});
