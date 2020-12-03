import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { FuelPriceViewComponent } from './fuel-price-view.component';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../../../../../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { MessageService } from 'primeng/components/common/messageservice';
import { of } from 'rxjs/index';
import { FuelPriceViewService } from './service/fuel-price-view.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FuelPriceViewComponent', () => {
  let component: FuelPriceViewComponent;
  let fixture: ComponentFixture<FuelPriceViewComponent>;
  let responseData;
  let messageService: MessageService;
  let fpvs: FuelPriceViewService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, FuelPriceViewService , MessageService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelPriceViewComponent);
    messageService = TestBed.get(MessageService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fpvs = TestBed.get(FuelPriceViewService);
    responseData = {
      fuelPriceChangeOccurrenceTypeDTO: {
        fuelPriceChangeOccurrenceTypeID: 1,
        fuelPriceChangeOccurrenceTypeName: 'Weekly'
      },
      fuelProgramPriceBasisTypeDTO: {
        fuelProgramPriceBasisTypeID: 2,
        fuelProgramPriceBasisTypeName: 'Calendar'
      },
      fuelPriceFactorTypeDTO: {
        fuelPriceFactorTypeID: 1,
        fuelPriceFactorTypeName: 'Specified Fuel Day'
      },
      fuelPriceSourceTypeDTO: {
        fuelPriceSourceTypeID: 1,
        fuelPriceSourceTypeName: 'DOE'
      },
      holidayDelayIndicator: 'Y',
      fuelPriceBasisByWeekDTO: {
        weekToApplyDTO: {
          weekToApplyID: 2,
          weekToApplyName: 'Previous'
        },
        priceChangeWeekDayName: 'Wednesday',
        averageWeekQuantity: 10
      },
      fuelPriceBasisByMonthDTO: {
        averageMonthQuantity: 40,
        priceChangeMonthDayNumber: 23
      },
      fuelPriceBasisRegionSetDTO: {
        fuelPriceBasisRegionTypeDTO: {
          fuelPriceBasisRegionTypeID: 1,
          fuelPriceBasisRegionTypeName: 'Custom'
        },
        fuelPriceBasisRegionDTOs: [{
          fuelDistrictDTO: {
            fuelNationalDistrictID: 1,
            fuelNationalDistrictName: 'West Coast',
            fuelSubDistrictID: 1,
            fuelSubDistrictName: 'New England'
          },
          isDefinedRegionStates: 'Yes',
          associatedStates: 'Yes'
        },
        {
          fuelDistrictDTO: {
            fuelNationalDistrictID: 1,
            fuelNationalDistrictName: 'West Coast',
            fuelSubDistrictID: 2,
            fuelSubDistrictName: 'Central Atlantic'
          },
          isDefinedRegionStates: 'Yes',
          associatedStates: 'Yes'
        }],
        averageRegionIndicator: 'N'
      }
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('businessFormatter', () => {
    spyOn(FuelPriceViewService.prototype, 'getFuelPriceValues').and.returnValue(of(responseData));
    component.fuelPriceDetails();
  });
  it('should call toastMessage', () => {
    component.toastMessage(messageService, 'error', 'b', 'c');
    expect(component.toastMessage).toBeTruthy();
  });

});
