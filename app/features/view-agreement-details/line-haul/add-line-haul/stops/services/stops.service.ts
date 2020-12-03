import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { AppConfig } from '../../../../../../../config/app.config';
import { GeographicPointType } from '../models/stops.interface';
import { LaneCardService } from '../../lane-card/services/lane-card.service';

@Injectable({
  providedIn: 'root'
})

export class StopsService {

  endpoints: object;
  constructor(private readonly http: HttpClient, private readonly laneCardService: LaneCardService) {
    const appConfig = AppConfig.getConfig();
    this.endpoints = appConfig.api;
  }

  getGeographyTypes(levelType: string): Observable<GeographicPointType[]> {
    const geographyTypeUrl = `${this.endpoints['searchAgreement'].getGeographyPointType}?levelTypeName=${levelType}`;
    return this.http.get<GeographicPointType[]>(geographyTypeUrl);
  }

  getEditStopDetails(addressQuery: any, postalQuery: any, locationQuery: any, cityQuery: any, stateQuery: any): Observable<any[]> {
    const inputs = [];
    const addressPoint = addressQuery ? this.laneCardService.getOriginPoint(addressQuery) : of([]);
    const postalCodePoint = postalQuery ? this.laneCardService.getCityState(postalQuery) : of([]);
    const locationPoint = locationQuery ? this.laneCardService.getOriginPoint(locationQuery) : of([]);
    const citystatePoint = cityQuery ? this.laneCardService.getCityState(cityQuery) : of([]);
    const statePoint = stateQuery ? this.laneCardService.getCityState(stateQuery) : of([]);


    inputs.push(addressPoint);
    inputs.push(postalCodePoint);
    inputs.push(locationPoint);
    inputs.push(citystatePoint);
    inputs.push(statePoint);

    return forkJoin(inputs);
  }
}
