import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { FuelIncrementalViewComponent } from './fuel-incremental-view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '../../../../../app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { CurrencyPipe } from '@angular/common';

describe('FuelIncrementalViewComponent', () => {
  let component: FuelIncrementalViewComponent;
  let fixture: ComponentFixture<FuelIncrementalViewComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, HttpClientTestingModule, ViewAgreementDetailsModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CurrencyPipe]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelIncrementalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call currencyFormat', () => {
    component.currencyFormat();
    expect(component.currencyFormat).toBeTruthy();
  });

  it('should call removeCurrencySymbol', () => {
    const roundDigit = '1.2-4';
    component.removeCurrencySymbol(roundDigit, 12.213);
    expect(component.removeCurrencySymbol).toBeTruthy();
  });

  it('should call customSort', () => {
    const event = new Event('myEvent');
    event['data'] = [{
      fuelBeginAmount: '9.001',
      fuelEndAmount: '11.012',
      fuelSurchargeAmount: '4.236'
    },
    {
      fuelBeginAmount: '1.000',
      fuelEndAmount: '2.000',
      fuelSurchargeAmount: '1.000'
    }];
    component.customSort(event);
    expect(component.customSort).toBeTruthy();
  });

  it('should call applySort', () => {
    component.applySort('123', '124');
    expect(component.applySort).toBeTruthy();
  });
});
