import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../../../../config/app.config';
import { RateTypeInterface, BuSoAssociation } from '../model/additional-charges-interface';


@Injectable({
  providedIn: 'root'
})
export class AdditionalChargesService {
  endpoints: object;

  constructor(private readonly http: HttpClient) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getRateTypes(buSoIds: Array<number>): Observable<RateTypeInterface[]> {
    const url = this.endpoints['accessorial'].getChargeAssociatedRateTypes;
    return this.http.get<RateTypeInterface[]>(url + buSoIds);
  }

  getBUbasedOnChargeType(chargeTypeId: number): Observable<BuSoAssociation[]> {
    const url = `${this.endpoints['accessorial'].getBUbasedOnChargeType}/${chargeTypeId}`;
    return this.http.get<BuSoAssociation[]>(url);
  }
}
