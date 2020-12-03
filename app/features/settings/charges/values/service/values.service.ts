import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

import { AppConfig } from '../../../../../../config/app.config';
import { Observable } from '../../../../../../../node_modules/rxjs';
import { ChargeTypes, ApplicationTypes, ChargeCodeConfigurables } from '../models/values-interface';
import { ValuesUtility } from './values.utility';

@Injectable({
  providedIn: 'root'
})
export class ValuesService {

  appConfig: AppConfig = AppConfig.getConfig();
  baseUrl = this.appConfig['api'];

  constructor(private readonly http: HttpClient) { }

  getChargeTypeValues(): Observable<ChargeTypes> {
    const url = `${this.baseUrl.chargeCode.getChargeUsageTypeValues}?activeBy=${ValuesUtility.getCurrentDate()}`;
    return this.http.get<ChargeTypes>(url);
  }

  getApplicationLevelTypes(): Observable<ApplicationTypes> {
    const currentDate = ValuesUtility.getCurrentDate();
    console.log(this.baseUrl.chargeCode);
    const url = `${this.baseUrl.chargeCode.getApplicationLevelTypeValues}/chargeapplicationleveltypes?activeBy=${currentDate}`;
    return this.http.get<ApplicationTypes>(url);
  }

  saveChargeCodeConfigurables(chargeConfigurables: ChargeCodeConfigurables): Observable<Boolean> {
    const url = this.baseUrl.chargeCode.saveChargeConfigurables;
    return this.http.put<Boolean>(url, chargeConfigurables);
  }
}
