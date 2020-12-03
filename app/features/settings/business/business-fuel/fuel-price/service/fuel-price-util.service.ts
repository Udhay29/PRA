import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { CurrencyPipe } from '@angular/common';
import { TimeZoneService } from '../../../../../../shared/jbh-app-services/time-zone.service';
import { FuelPriceTableRowItem } from '../model/fuel-price.interface';
@Injectable({
  providedIn: 'root'
})
export class FuelPriceUtilService {
  constructor(private readonly timeZoneService: TimeZoneService) {
  }
  parsingGridData(hitsObj: FuelPriceTableRowItem, currencyPipe: CurrencyPipe) {
    hitsObj['effectiveDate'] = this.dateFormatter(hitsObj['effectiveDate']);
    hitsObj['expirationDate'] = this.dateFormatter(hitsObj['expirationDate']);
    hitsObj['createTimestamp'] = this.timeZoneService.convertToLocal(hitsObj['createTimestamp']);
    hitsObj['lastUpdateTimestamp'] = this.timeZoneService.convertToLocal(hitsObj['lastUpdateTimestamp']);
    hitsObj['fuelPriceAmount'] = this.currencyFormat(currencyPipe, hitsObj['fuelPriceAmount']);
    return hitsObj;
  }
  dateFormatter(dateStr: string): string {
    return moment(dateStr).format('MM/DD/YYYY');
  }
  currencyFormat(cpipe: CurrencyPipe, amount: string) {
    return cpipe.transform(amount, 'USD', 'symbol', '1.2-4');
  }
}
