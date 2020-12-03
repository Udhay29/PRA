import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FuelIncrementalPriceDTO, IncrementalData } from '../fuel-calculation-view/model/fuel-calculation-detail.interface';
import { FuelCalculationDetailModel } from '../fuel-calculation-view/model/fuel-calculation-detail.model';
import { CurrencyPipe } from '@angular/common';
import { timer } from 'rxjs';

@Component({
  selector: 'app-fuel-incremental-view',
  templateUrl: './fuel-incremental-view.component.html',
  styleUrls: ['./fuel-incremental-view.component.scss'],
  providers: [CurrencyPipe]
})
export class FuelIncrementalViewComponent implements OnInit {
  @Input() incrementalDetails: FuelIncrementalPriceDTO[] = [];
  @Input() roundingDigit: number;
  fuelCalculationDetailModel: FuelCalculationDetailModel;
  constructor(private readonly currencyPipe: CurrencyPipe,
    private readonly changeDetector: ChangeDetectorRef) {
    this.fuelCalculationDetailModel = new FuelCalculationDetailModel();
  }

  ngOnInit() {
    this.currencyFormat();
  }

  currencyFormat() {
    const roundDigit = `1.${this.roundingDigit}-4`;
    const timerValue = timer(10);
    timerValue.subscribe((timerData) => {
        this.incrementalDetails.forEach(data => {
        const beginAmount = this.removeCurrencySymbol(roundDigit, data['fuelBeginAmount']);
        const endAmount = this.removeCurrencySymbol(roundDigit, data['fuelEndAmount']);
        const surchargeAmount = this.removeCurrencySymbol(roundDigit, data['fuelSurchargeAmount']);
        this.fuelCalculationDetailModel.incrementalDetails.push({
          fuelBeginAmount: beginAmount,
          fuelEndAmount: endAmount,
          fuelSurchargeAmount: surchargeAmount
        });
      });
    });
    this.changeDetector.detectChanges();
  }

  removeCurrencySymbol(roundDigit: string, data: number): string {
    return this.currencyPipe.transform(data, 'USD', 'symbol', roundDigit).replace(/\$|,/g, '');
  }

  customSort(event) {
    event.data.sort((data1, data2) => {
      return (event.order * this.applySort(data1[event.field], data2[event.field]));
    });
  }

  applySort(data1: string, data2: string): number {
    let result = 0;
    const value1 = data1 === undefined ? 0 : Number(data1);
    const value2 = data2 === undefined ? 0 : Number(data2);
    if (Number.isNaN(value1) || Number.isNaN(value2)) {
      result = 0;
    } else {
      result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
    }
    return result;
  }

}
