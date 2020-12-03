import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';

import { FuelCalculationViewComponent } from './fuel-calculation-view.component';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '../../../../../app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/components/common/messageservice';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { FuelCalculationViewService } from '../fuel-calculation-view/service/fuel-calculation-view.service';
import { of } from 'rxjs/index';

describe('FuelCalculationViewComponent', () => {
  let component: FuelCalculationViewComponent;
  let fixture: ComponentFixture<FuelCalculationViewComponent>;
  let messageService: MessageService;
  let fuelCalculationViewService: FuelCalculationViewService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, MessageService, FuelCalculationViewService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelCalculationViewComponent);
    messageService = TestBed.get(MessageService);
    fuelCalculationViewService = TestBed.get(FuelCalculationViewService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFuelCalculationDetails', () => {
    const data = {
      fuelCalculationID: 2667,
      fuelCurrencyCode: 'USD',
      chargeType: {
        chargeTypeID: 368,
        chargeTypeName: 'Charge',
        chargeTypeCode: 'Charge'
      },
      fuelCalculationType: {
        fuelCalculationTypeID: 2,
        fuelCalculationTypeName: 'Internal'
      },
      fuelRateType: {
        fuelRateTypeID: 3,
        fuelRateTypeName: 'Per Distance'
      },
      fuelCalculationDateType: {
        fuelCalculationDateTypeID: 4,
        fuelCalculationDateTypeName: 'Order Creation'
      },
      fuelRoundingDecimal: {
        fuelRoundingDecimalID: 5,
        fuelRoundingDecimalNumber: 3
      },
      fuelType: {
        fuelTypeID: 2,
        fuelTypeName: 'Diesel'
      },
      fuelDiscountType: {
        fuelDiscountTypeID: '2',
        fuelDiscountTypeName: 'Origin'
      },
      fuelCalculationMethodType: {
        fuelCalculationMethodTypeID: 2,
        fuelCalculationMethodTypeName: ''
      },
      flatConfiguration: {
        flatConfigurationID: 2138,
        fuelSurchargeAmount: 2
      },
      formulaConfiguration: null,
      reeferConfiguration: null,
      distancePerFuelQuantityConfiguration: null,
      fuelIncrementalPriceDTOs: null,
      rollUpIndicator: 'N'
    };
    component.getFuelCalculationDetails();
    spyOn(FuelCalculationViewService.prototype, 'getFuelCalculationDetails').and.returnValue(of(data));
    expect(component.getFuelCalculationDetails).toBeTruthy();
  });

  it('should call toastMessage', () => {
    component.toastMessage(messageService, 'error', 'b', 'c');
    expect(component.toastMessage).toBeTruthy();
  });
});
