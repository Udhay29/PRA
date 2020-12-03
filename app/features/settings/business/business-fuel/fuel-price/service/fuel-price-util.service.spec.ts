import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF, CurrencyPipe } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { TimeZoneService } from '../../../../../../shared/jbh-app-services/time-zone.service';
import { AppModule } from '../../../../../../app.module';
import { SettingsModule } from '../../../../settings.module';
import { FuelPriceUtilService } from './fuel-price-util.service';
import { FuelPriceTableRowItem } from '../model/fuel-price.interface';

describe('FuelPriceUtilService', () => {
  let service: FuelPriceUtilService;
  let currencyPipe: CurrencyPipe;
  let timeZoneService: TimeZoneService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, FuelPriceUtilService, CurrencyPipe, TimeZoneService],
    });
  });

  beforeEach(() => {
    service = TestBed.get(FuelPriceUtilService);
    currencyPipe = TestBed.get(CurrencyPipe);
    timeZoneService = TestBed.get(TimeZoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  xit('should be call parsingGridData', () => {
    const esResponse: FuelPriceTableRowItem = {
      'currencyCode': 'USD',
      'effectiveDate': '2019-04-22',
      'expirationDate': '2019-04-22',
      'fuelRegionName': 'National',
      'fuelPriceAmount': '3.147',
      'fuelPriceSourceTypeName': 'DOE',
      'fuelSubDistrictName': '',
      'fuelTypeName': 'Diesel',
      'invalidIndicator': 'N',
      'invalidReasonTypeName': 'Active',
      'pricingCountryCode': 'USA',
      'unitOfVolumeMeasurementCode': 'Gallons',
      'uniqueDocID': '2135',
      'createTimestamp': '2019-04-22T15:00:21',
      'createUserID': 'RBT118',
      'createProgramName': 'RBT118',
      'lastUpdateTimestamp': '2019-04-22T15:00:21',
      'lastUpdateUserID': 'RBT118',
      'lastUpdateProgramName': 'RBT118'
    };
    const gridResponse: FuelPriceTableRowItem = {
      'currencyCode': 'USD',
      'effectiveDate': '04/22/2019',
      'expirationDate': '04/22/2019',
      'fuelRegionName': 'National',
      'fuelPriceAmount': '$3.147',
      'fuelPriceSourceTypeName': 'DOE',
      'fuelSubDistrictName': '',
      'fuelTypeName': 'Diesel',
      'invalidIndicator': 'N',
      'invalidReasonTypeName': 'Active',
      'pricingCountryCode': 'USA',
      'unitOfVolumeMeasurementCode': 'Gallons',
      'uniqueDocID': '2135',
      'createTimestamp': '04/22/2019 03:00 PM GMT',
      'createUserID': 'RBT118',
      'createProgramName': 'RBT118',
      'lastUpdateTimestamp': '04/22/2019 03:00 PM GMT',
      'lastUpdateUserID': 'RBT118',
      'lastUpdateProgramName': 'RBT118'
    };

    expect(timeZoneService.convertToLocal('2019-04-22T15:00:21')).toEqual('04/22/2019 03:00 PM GMT');
    expect(service.parsingGridData(esResponse, currencyPipe)).toEqual(gridResponse);
  });
  it('should be call dateFormatter', () => {
    expect(service.dateFormatter('2019-04-22')).toEqual('04/22/2019');
  });
  it('should be call currencyFormat', () => {
    expect(service.currencyFormat(currencyPipe, '34.567')).toEqual('$34.567');
  });
});
