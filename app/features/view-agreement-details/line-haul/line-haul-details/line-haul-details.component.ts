import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Input,
   OnDestroy} from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';

import { LineHaulDetailsModel } from './model/line-haul-details.model';
import { LineHaulDetailsService } from './services/line-haul-details.service';
import {
  LineHaulValues, StopValues, CityInterface, HitsInterface, HitsItem, RateInterface,
  RateValuesInterface, CarrierInterface
} from './model/line-haul-details.interface';
import { LineHaulDetailedViewQuery } from './query/linehaul-detailedview.query';

@Component({
  selector: 'app-line-haul-details',
  templateUrl: './line-haul-details.component.html',
  styleUrls: ['./line-haul-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineHaulDetailsComponent implements OnDestroy {
  @Input() set lineHaulValues(lineHaulValues: LineHaulValues) {
    if (lineHaulValues) {
      this.detailsModel.stopDataList = {
        'Address': [],
        'State': [],
        'zipValues': [],
        'locationValues': [],
        'Country': [],
        [this.detailsModel.cityStateText]: []
      };
      this.detailsModel.lineHaulValues = lineHaulValues;
      this.stopFramer(lineHaulValues);
      this.processedStopDetails(lineHaulValues);
      this.processedLaneDetails(lineHaulValues);
      this.processedCarrierDetails(lineHaulValues);
      this.detailsModel.rateValues = this.processedRateDetails(lineHaulValues);
      this.processedAdditionalDetails(lineHaulValues);
      this.processedMileageDetails(lineHaulValues);
    }
  }
  detailsModel: LineHaulDetailsModel;

  constructor(private readonly lineHaulDetailsService: LineHaulDetailsService,
    private readonly changeDetector: ChangeDetectorRef) {
    this.detailsModel = new LineHaulDetailsModel();
  }

  ngOnDestroy() {
    this.detailsModel.subscriberFlag = false;
  }
  getCityState(lanedetails, element: string, lanealldetails: LineHaulValues) {
    const cityStateQuery = LineHaulDetailedViewQuery.getCityQuery([lanedetails.pointID]);
    this.lineHaulDetailsService.getCityState(cityStateQuery).pipe(takeWhile(() => this.detailsModel.subscriberFlag)).
      subscribe((CityStateData: HitsInterface[]) => {
        if (!utils.isEmpty(CityStateData)) {
          this.originDestinationCityStateValues(CityStateData, element, lanealldetails);
        }
        this.changeDetector.markForCheck();
      }, (error: Error) => {
      });
  }
  getAddress(lanedetails, element: string, lanealldetails: LineHaulValues) {
    const addressQuery = LineHaulDetailedViewQuery.getOriginDestinationQuery([lanedetails.pointID]);
    this.lineHaulDetailsService.getOriginPoint(addressQuery).pipe(takeWhile(() => this.detailsModel.subscriberFlag)).
      subscribe((AddressData: HitsInterface[]) => {
        if (!utils.isEmpty(AddressData)) {
          this.originDestinationAddressValues(AddressData, lanedetails, element, lanealldetails);
        }
        this.changeDetector.markForCheck();
      }, (error: Error) => {
      });
  }
  getState(lanedetails, element: string, lanealldetails: LineHaulValues) {
    const stateQuery = LineHaulDetailedViewQuery.getStateQuery([lanedetails.pointID]);
    this.lineHaulDetailsService.getCityState(stateQuery).pipe(takeWhile(() => this.detailsModel.subscriberFlag)).
      subscribe((stateData: HitsInterface[]) => {
        if (!utils.isEmpty(stateData)) {
          this.originDestinationStateValues(stateData, lanedetails, element, lanealldetails);
        }
        this.changeDetector.markForCheck();
      }, (error: Error) => {
      });
  }
  getPostalZip(lanedetails, element: string, lanealldetails: LineHaulValues) {
    const zipQuery = LineHaulDetailedViewQuery.getPostalZipQuery([lanedetails.pointID]);
    this.lineHaulDetailsService.getCityState(zipQuery).pipe(takeWhile(() => this.detailsModel.subscriberFlag)).
      subscribe((stateData: HitsInterface[]) => {
        if (!utils.isEmpty(stateData)) {
          this.originDestinationZipValues(stateData, lanedetails, element, lanealldetails);
        }
        this.changeDetector.markForCheck();
      }, (error: Error) => {
      });
  }
  getLocationRampYard(lanedetails, element: string, lanealldetails: LineHaulValues) {
    const locationQuery = LineHaulDetailedViewQuery.getRampYardQuery([lanedetails.pointID]);
    this.lineHaulDetailsService.getOriginPoint(locationQuery).pipe(takeWhile(() => this.detailsModel.subscriberFlag)).
      subscribe((stateData: HitsInterface[]) => {
        if (!utils.isEmpty(stateData)) {
          this.originDestinationLocationValues(stateData, lanedetails, element, lanealldetails);
        }
        this.changeDetector.markForCheck();
      }, (error: Error) => {
      });
  }
  getPostalZipRange(lanedetails, element: string, lanealldetails: LineHaulValues) {
    const zipQuery = LineHaulDetailedViewQuery.getPostalZipRangeQuery(lanedetails);
    this.lineHaulDetailsService.getCityState(zipQuery).pipe(takeWhile(() => this.detailsModel.subscriberFlag)).
      subscribe((zipData: HitsInterface[]) => {
        if (!utils.isEmpty(zipData)) {
          this.originDestinationZipRangeValues(zipData, lanedetails, element, lanealldetails);
        }
        this.changeDetector.markForCheck();
      }, (error: Error) => {
      });
  }
  processedLaneDetails(lanedetails: LineHaulValues) {
    this.detailsModel.originDestinationDetails = [];
    if (lanedetails && lanedetails.originPoints && lanedetails.destinationPoints) {
      const originDestinationArray = ['originPoints', 'destinationPoints'];
      originDestinationArray.forEach((element) => {
        lanedetails[element].forEach((dataValue) => {
          this.originDesinationTypeFinder(dataValue, element, lanedetails);
        });
      });
    }
  }
  originDesinationTypeFinder(lanedetails, element: string, lanealldetails: LineHaulValues) {
    switch (lanedetails.subTypeName) {
      case this.detailsModel.cityStateText:
        this.getCityState(lanedetails, element, lanealldetails);
        break;
      case 'Address':
        this.getAddress(lanedetails, element, lanealldetails);
        break;
      case 'State':
        this.getState(lanedetails, element, lanealldetails);
        break;
      case '2-Zip':
      case '3-Zip':
      case '5-Zip':
      case '6-Zip':
      case '9-Zip':
        this.getPostalZip(lanedetails, element, lanealldetails);
        break;
      case 'Location':
      case 'Ramp':
      case 'Yard':
        this.getLocationRampYard(lanedetails, element, lanealldetails);
        break;
      case '3-Zip Range':
      case '5-Zip Range':
      case '6-Zip Range':
      case '9-Zip Range':
        this.getPostalZipRange(lanedetails, element, lanealldetails);
        break;
      default:
        break;
    }
  }
  processedCarrierDetails(lineHaulValues: LineHaulValues) {
    this.detailsModel.carriersData = [];
    for (const list of lineHaulValues['carriers']) {
      const carrierQuery = LineHaulDetailedViewQuery.getCarrierQuery(list['carrierID']);
      this.lineHaulDetailsService.getCarrierData(carrierQuery).pipe(takeWhile(() => this.detailsModel.subscriberFlag)).
        subscribe((carrierData: HitsInterface[]) => {
          if (!utils.isEmpty(carrierData)) {
            const data = carrierData['hits']['hits'][0]['_source'];
            this.detailsModel.carriersData.push({
              'CarrierCode': data['CarrierCode'],
              'LegalName': data['LegalName'],
              'CarrierID': data['CarrierID']
            });
          }
          this.changeDetector.markForCheck();
        }, (error: Error) => {
        });

    }
  }
  originDestinationCityStateValues(CityStateData: HitsInterface[], element: string, lanedetails) {
    if (!utils.isEmpty(CityStateData['hits']['hits'])) {
      const EachCity: CityInterface = CityStateData['hits']['hits'][0]['inner_hits']['City']['hits'];
      this.detailsModel.originDestinationDetails.push({
        city: EachCity.hits[0]._source.CityName,
        state: EachCity.hits[0]._source.State.StateCode,
        country: EachCity.hits[0]._source.Country.CountryName,
        vendor: this.laneDescCheck(element, lanedetails, 'VendorID'),
        description: this.laneDescCheck(element, lanedetails, 'Description'),
        type: this.detailsModel.cityStateText,
        addressLine1: '',
        postalCode: EachCity.hits[0]._source.PostalCode,
        origindestination: element === 'originPoints' ? 'Origin' : 'Destination',
        pointToolTip: `${EachCity.hits[0]._source.CityName} ,${EachCity.hits[0]._source.State.StateCode}`
      });
    }
    this.detailsModel.originDestinationDetails =
        utils.orderBy(this.detailsModel.originDestinationDetails, ['origindestination'], ['desc']);
  }
  laneDescCheck(element: string, lanedetails, type: string) {
    if (element === 'originPoints') {
      return lanedetails[`origin${type}`] ? lanedetails[`origin${type}`] : '- -';
    } else {
      return lanedetails[`destination${type}`] ? lanedetails[`destination${type}`] : '- -';
    }
  }
  originDestinationStateValues(CityStateData: HitsInterface[], lanedetails, element: string, lanealldetails: LineHaulValues) {
    if (!utils.isEmpty(CityStateData['hits']['hits'])) {
      const EachCity: CityInterface = CityStateData['hits']['hits'][0]['inner_hits']['City']['hits'];
      this.detailsModel.originDestinationDetails.push({
        city: EachCity.hits[0]._source.CityName,
        state: EachCity.hits[0]._source.State.StateName,
        country: EachCity.hits[0]._source.Country.CountryName,
        vendor: this.laneDescCheck(element, lanealldetails, 'VendorID'),
        description: this.laneDescCheck(element, lanealldetails, 'Description'),
        type: 'State',
        addressLine1: '',
        postalCode: EachCity.hits[0]._source.PostalCode,
        origindestination: element === 'originPoints' ? 'Origin' : 'Destination',
        pointToolTip: `${EachCity.hits[0]._source.State.StateName}`
      });
      this.detailsModel.originDestinationDetails =
        utils.orderBy(this.detailsModel.originDestinationDetails, ['origindestination'], ['desc']);
    }
  }
  originDestinationZipValues(CityStateData: HitsInterface[], lanedetails, element: string, lanealldetails: LineHaulValues) {
    if (!utils.isEmpty(CityStateData['hits']['hits'])) {
      this.detailsModel.originDestinationDetails.push({
        type: lanedetails.subTypeName,
        postalCode: this.postalCodeSplice(CityStateData['hits']['hits'][0]._source.PostalCode),
        country: CityStateData['hits']['hits'][0]._source.City[0].Country.CountryName,
        vendor: this.laneDescCheck(element, lanealldetails, 'VendorID'),
        description: this.laneDescCheck(element, lanealldetails, 'Description'),
        origindestination: element === 'originPoints' ? 'Origin' : 'Destination',
        pointToolTip: `${this.postalCodeSplice(CityStateData['hits']['hits'][0]._source.PostalCode)}`
      });
      this.detailsModel.originDestinationDetails =
        utils.orderBy(this.detailsModel.originDestinationDetails, ['origindestination'], ['desc']);
    }
  }
  originDestinationZipRangeValues(selectedPostalEdit: HitsInterface[], lanedetails,
    element: string, lanealldetails: LineHaulValues) {
    if (!utils.isEmpty(selectedPostalEdit['hits']['hits'])) {
      this.detailsModel.originDestinationDetails.push({
        type: lanedetails.subTypeName,
        postalCode: this.postalCodeFramer(selectedPostalEdit['hits']['hits']),
        country: this.detailsModel.countryCode,
        vendor: this.laneDescCheck(element, lanealldetails, 'VendorID'),
        description: this.laneDescCheck(element, lanealldetails, 'Description'),
        origindestination: element === 'originPoints' ? 'Origin' : 'Destination',
        pointToolTip: this.postalCodeFramer(selectedPostalEdit['hits']['hits'])
      });
      this.detailsModel.originDestinationDetails =
        utils.orderBy(this.detailsModel.originDestinationDetails, ['origindestination'], ['desc']);
    }
  }
  postalCodeFramer(selectedPostalEdit) {
    const lowerCode = this.postalCodeSplice(selectedPostalEdit[0]['_source']['PostalCode'] > selectedPostalEdit[1]
    ['_source']['PostalCode'] ? selectedPostalEdit[1]['_source']['PostalCode'] : selectedPostalEdit[0]['_source']['PostalCode']);
    const upperCode = this.postalCodeSplice(selectedPostalEdit[0]['_source']['PostalCode'] > selectedPostalEdit[1]['_source']
    ['PostalCode'] ? selectedPostalEdit[0]['_source']['PostalCode'] : selectedPostalEdit[1]['_source']['PostalCode']);
    this.detailsModel.countryCode = selectedPostalEdit[0]['_source']['CountryCode'];
    return `${lowerCode}${'-'}${upperCode}`;
  }
  postalCodeSplice(postalCode: any) {
    if (postalCode.length === 9 && !postalCode.includes('-')) {
      return `${postalCode.substring(0, 5)}-${postalCode.substring(5, 9)}`;
    } else {
      return postalCode;
    }
  }
  originDestinationAddressValues(AddressData: HitsInterface[], lanedetails, element: string, lanealldetails: LineHaulValues) {
    if (!utils.isEmpty(AddressData['hits']['hits'])) {
      const EachAddress: CityInterface = AddressData['hits']['hits'][0];
      this.detailsModel.originDestinationDetails.push({
        addressLine1: EachAddress['_source']['Address']['AddressLine1'],
        city: EachAddress['_source']['Address']['CityName'],
        state: EachAddress['_source']['Address']['StateCode'],
        postalCode: EachAddress['_source']['Address']['PostalCode'],
        country: EachAddress['_source']['Address']['CountryName'],
        vendor: this.laneDescCheck(element, lanealldetails, 'VendorID'),
        description: this.laneDescCheck(element, lanealldetails, 'Description'),
        type: 'Address',
        origindestination: element === 'originPoints' ? 'Origin' : 'Destination',
        pointToolTip: `${EachAddress['_source']['Address']['AddressLine1']}, ${EachAddress['_source']['Address']['CityName']},
        ${EachAddress['_source']['Address']['StateCode']}, ${EachAddress['_source']['Address']['PostalCode']},
        ${EachAddress['_source']['Address']['CountryName']}`
      });
      this.detailsModel.originDestinationDetails =
        utils.orderBy(this.detailsModel.originDestinationDetails, ['origindestination'], ['desc']);
    }
  }
  originDestinationLocationValues(locationData: HitsInterface[], lanedetails, element: string, lanealldetails: LineHaulValues) {
    if (!utils.isEmpty(locationData['hits']['hits'])) {
      this.detailsModel.originDestinationDetails.push({
        type: lanedetails.subTypeName,
        locationCode: locationData['hits']['hits'][0]._source.LocationCode,
        locationName: locationData['hits']['hits'][0]._source.LocationName,
        addressLine1: locationData['hits']['hits'][0]._source.Address.AddressLine1,
        city: locationData['hits']['hits'][0]._source.Address.CityName,
        state: locationData['hits']['hits'][0]._source.Address.StateCode,
        postalCode: locationData['hits']['hits'][0]._source.Address.PostalCode,
        country: locationData['hits']['hits'][0]._source.Address.CountryCode,
        vendor: this.laneDescCheck(element, lanealldetails, 'VendorID'),
        description: this.laneDescCheck(element, lanealldetails, 'Description'),
        origindestination: element === 'originPoints' ? 'Origin' : 'Destination',
        pointToolTip: `${locationData['hits']['hits'][0]._source.LocationName} (${locationData['hits']['hits'][0]._source.LocationCode}),
        ${locationData['hits']['hits'][0]._source.Address.AddressLine1}, ${locationData['hits']['hits'][0]._source.Address.CityName},
        ${locationData['hits']['hits'][0]._source.Address.StateCode}, ${locationData['hits']['hits'][0]._source.Address.PostalCode},
        ${locationData['hits']['hits'][0]._source.Address.CountryCode}`
      });
      this.detailsModel.originDestinationDetails =
        utils.orderBy(this.detailsModel.originDestinationDetails, ['origindestination'], ['desc']);
    }
  }
  processedRateDetails(rateDetails: LineHaulValues): RateValuesInterface[] {
    let rateList = [];
    if (rateDetails && rateDetails.rates) {
      const rateDataList = rateDetails.rates;
      if (rateDataList && rateDataList.length > 0) {
        rateList = rateDataList.map((rateeDataArg: RateInterface): RateValuesInterface => {
          return {
            'chargeUnitTypeName': rateeDataArg.chargeUnitTypeName,
            'amount': rateeDataArg.rateAmount,
            'minimumamount': rateeDataArg.minimumAmount,
            'maximumamount': rateeDataArg.maximumAmount,
            'currencyCode': rateeDataArg.currencyCode
          };
        });
      }
    }
    return rateList;
  }
  processedStopCity(stopArgument: StopValues[]) {
    const pointList = [];
    for (const list of stopArgument) {
      pointList.push(list['pointID']);
    }
    const cityStateQuery = LineHaulDetailedViewQuery.getCityQuery(pointList);
    this.lineHaulDetailsService.getCityState(cityStateQuery).pipe(takeWhile(() => this.detailsModel.subscriberFlag)).
      subscribe((CityStateData: HitsInterface[]) => {
        if (!utils.isEmpty(CityStateData)) {
          this.getStopCityState(CityStateData, stopArgument);
        }
        this.changeDetector.markForCheck();
      }, (error: Error) => {
      });
  }
  processedStopAddress(stopArgument: StopValues[]) {
    const pointList = [];
    for (const list of stopArgument) {
      pointList.push(list['pointID']);
    }
    const addressQuery = LineHaulDetailedViewQuery.getOriginDestinationQuery(pointList);
    this.lineHaulDetailsService.getOriginPoint(addressQuery).pipe(takeWhile(() => this.detailsModel.subscriberFlag)).
      subscribe((AddressData: HitsInterface[]) => {
        if (!utils.isEmpty(AddressData)) {
          this.getStopAddress(AddressData, stopArgument);
        }
        this.changeDetector.markForCheck();
      }, (error: Error) => {
      });
  }
  processedStopState(stopArgument: StopValues[]) {
    const pointList = [];
    for (const list of stopArgument) {
      pointList.push(list['pointID']);
    }
    const stateQuery = LineHaulDetailedViewQuery.getStateQuery(pointList);
    this.lineHaulDetailsService.getCityState(stateQuery).pipe(takeWhile(() => this.detailsModel.subscriberFlag)).
      subscribe((CityStateData: HitsInterface[]) => {
        if (!utils.isEmpty(CityStateData)) {
          this.getStopState(CityStateData, stopArgument);
        }
        this.changeDetector.markForCheck();
      }, (error: Error) => {
      });
  }
  processedStopZip(stopArgument: StopValues[]) {
    const pointList = [];
    for (const list of stopArgument) {
      pointList.push(list['pointID']);
    }
    const zipQuery = LineHaulDetailedViewQuery.getPostalZipQuery(pointList);
    this.lineHaulDetailsService.getCityState(zipQuery).pipe(takeWhile(() => this.detailsModel.subscriberFlag)).
      subscribe((zipCodeData: HitsInterface[]) => {
        if (!utils.isEmpty(zipCodeData)) {
          this.getStopZipCode(zipCodeData, stopArgument);
        }
        this.changeDetector.markForCheck();
      }, (error: Error) => {
      });
  }
  processedStopLocation(stopArgument: StopValues[]) {
    const pointList = [];
    for (const list of stopArgument) {
      pointList.push(list['pointID']);
    }
    const locationQuery = LineHaulDetailedViewQuery.getRampYardQuery(pointList);
    this.lineHaulDetailsService.getOriginPoint(locationQuery).pipe(takeWhile(() => this.detailsModel.subscriberFlag)).
      subscribe((locationData: HitsInterface[]) => {
        if (!utils.isEmpty(locationData)) {
          this.getLocationRampYardStop(locationData, stopArgument);
        }
        this.changeDetector.markForCheck();
      }, (error: Error) => {
      });
  }
  stopFramer(stopDataList: LineHaulValues) {
    if (stopDataList && (!utils.isEmpty(stopDataList.stops))) {
      stopDataList.stops.forEach((eachStop) => {
        switch (eachStop['typeName']) {
          case this.detailsModel.cityStateText:
            this.detailsModel.stopDataList[this.detailsModel.cityStateText].push(eachStop);
            break;
          case 'State':
          case 'Address':
            this.detailsModel.stopDataList[eachStop['typeName']].push(eachStop);
            break;
          case '2-Zip':
          case '3-Zip':
          case '5-Zip':
          case '6-Zip':
          case '9-Zip':
            this.detailsModel.stopDataList['zipValues'].push(eachStop);
            break;
          case 'Location':
          case 'Ramp':
          case 'Yard':
            this.detailsModel.stopDataList['locationValues'].push(eachStop);
            break;
          case 'Country':
            this.detailsModel.stopDataList['Country'].push(eachStop);
            break;
        }
      });

    }
  }
  processedStopDetails(stopDetails: LineHaulValues) {
    this.detailsModel.stopChargeIndicator = stopDetails.stopChargeIncludedIndicator;
    this.detailsModel.stopList = [];
    if (stopDetails && (!utils.isEmpty(stopDetails.stops))) {
      this.detailsModel.stopTypes.forEach((type: string) => {
        if (!utils.isEmpty(this.detailsModel.stopDataList[type])) {
          switch (type) {
            case this.detailsModel.cityStateText:
              this.processedStopCity(this.detailsModel.stopDataList[type]);
              break;
            case 'Address':
              this.processedStopAddress(this.detailsModel.stopDataList[type]);
              break;
            case 'State':
              this.processedStopState(this.detailsModel.stopDataList[type]);
              break;
            case 'zipValues':
              this.processedStopZip(this.detailsModel.stopDataList[type]);
              break;
            case 'locationValues':
              this.processedStopLocation(this.detailsModel.stopDataList[type]);
              break;
            case 'Country':
              this.getCountryStop(this.detailsModel.stopDataList[type]);
              break;
            default:
              break;
          }
        }
      });
    }
  }
  getStopCityState(CityStateData: HitsInterface[], stopValue: StopValues[]) {
    let EachCity = [];
    if (!utils.isEmpty(CityStateData['hits']['hits'])) {
      stopValue.forEach((element) => {
        for (const data of CityStateData['hits']['hits']) {
          if (element['pointID'] === data['inner_hits']
          ['City']['hits']['hits'][0]['_source']['CityID']) {
            EachCity = data['inner_hits']['City']['hits']['hits'][0]['_source'];
          }
        }
        this.detailsModel.stopList.push({
          'type': element.typeName,
          'stop': element.stopSequenceNumber,
          'city': EachCity['CityName'],
          'state': EachCity['State']['StateCode'],
          'country': EachCity['Country']['CountryName'],
          'addressLine1': '',
          'postalCode': EachCity['PostalCode'],
          'stopType': this.detailsModel.cityStateText,
          'pointToolTip': `${EachCity['CityName']}, ${EachCity['State']['StateCode']}`,
          'vendor': element.vendorID === null ? '- -' : element.vendorID
        });
      });
    }
    this.detailsModel.stopList = utils.sortBy(this.detailsModel.stopList, 'stop');
  }
  getStopState(CityStateData: HitsInterface[], stopValue: StopValues[]) {
    let eachState = [];
    if (!utils.isEmpty(CityStateData['hits']['hits'])) {
      const stateData = utils.uniqBy(CityStateData['hits']['hits'],
        'inner_hits.City.hits.hits[0]._source.State.StateID');
      stopValue.forEach((element) => {
        for (const data of stateData) {
          if (element['pointID'] === data['inner_hits']
          ['City']['hits']['hits'][0]['_source']['State']['StateID']) {
            eachState = data['inner_hits']['City']['hits']['hits'][0]['_source'];
          }
        }
        this.detailsModel.stopList.push({
          'type': element.typeName,
          'stop': element.stopSequenceNumber,
          'city': eachState['CityName'],
          'state': eachState['State']['StateName'],
          'country': eachState['Country']['CountryName'],
          'addressLine1': '',
          'postalCode': eachState['PostalCode'],
          'stopType': 'State',
          'pointToolTip': `${eachState['State']['StateName']}`,
          'vendor': element.vendorID === null ? '- -' : element.vendorID
        });
      });
    }
    this.detailsModel.stopList = utils.sortBy(this.detailsModel.stopList, 'stop');
  }
  getStopAddress(AddressData: HitsInterface[], stopValue: StopValues[]) {
    let eachAddress;
    if (!utils.isEmpty(AddressData['hits']['hits'])) {
      const addressData = utils.uniqBy(AddressData['hits']['hits'],
        '_source.Address.AddressID');
      stopValue.forEach((element) => {
        for (const data of addressData) {
          if (element['pointID'] === data['_source']['Address']['AddressID']) {
            eachAddress = data;
          }
        }
        this.detailsModel.stopList.push({
          'type': element.typeName,
          'stop': element.stopSequenceNumber,
          'addressLine1': eachAddress['_source']['Address']['AddressLine1'],
          'city': eachAddress['_source']['Address']['CityName'],
          'state': eachAddress['_source']['Address']['StateCode'],
          'postalCode': eachAddress['_source']['Address']['PostalCode'],
          'country': eachAddress['_source']['Address']['CountryName'],
          'stopType': 'Address',
          'pointToolTip': `${eachAddress['_source']['Address']['AddressLine1']}, ${eachAddress['_source']['Address']['CityName']},
        ${eachAddress['_source']['Address']['StateCode']}, ${eachAddress['_source']['Address']['PostalCode']},
        ${eachAddress['_source']['Address']['CountryName']}`,
          'vendor': element.vendorID === null ? '- -' : element.vendorID
        });
      });
    }
    this.detailsModel.stopList = utils.sortBy(this.detailsModel.stopList, 'stop');
  }
  getStopZipCode(zipCodeData: HitsInterface[], stopValue: StopValues[]) {
    let eachZip;
    if (!utils.isEmpty(zipCodeData['hits']['hits'])) {
      const zipData = utils.uniqBy(zipCodeData['hits']['hits'], '_source.PostalCodeID');
      stopValue.forEach((element) => {
        for (const data of zipData) {
          if (element['pointID'] === data['_source']['PostalCodeID']) {
            eachZip = data;
          }
        }
        this.detailsModel.stopList.push({
          'type': element.typeName,
          'stop': element.stopSequenceNumber,
          'postalCode': this.postalCodeSplice(eachZip._source.PostalCode),
          'country': eachZip._source.City[0].Country.CountryName,
          'stopType': element.typeName,
          'pointToolTip': `${this.postalCodeSplice(eachZip._source.PostalCode)}`,
          'vendor': element.vendorID === null ? '- -' : element.vendorID
        });
      });
    }
    this.detailsModel.stopList = utils.sortBy(this.detailsModel.stopList, 'stop');
  }
  getLocationRampYardStop(locationData: HitsInterface[], stopValue: StopValues[]) {
    let eachLocation;
    if (!utils.isEmpty(locationData['hits']['hits'])) {
      const zipData = utils.uniqBy(locationData['hits']['hits'], '_source.LocationID');
      stopValue.forEach((element) => {
        for (const data of zipData) {
          if (element['pointID'] === data['_source']['LocationID']) {
            eachLocation = data;
          }
        }
        this.detailsModel.stopList.push({
          'type': element.typeName,
          'stop': element.stopSequenceNumber,
          'locationCode': eachLocation._source.LocationCode,
          'locationName': eachLocation._source.LocationName,
          'addressLine1': eachLocation._source.Address.AddressLine1,
          'city': eachLocation._source.Address.CityName,
          'state': eachLocation._source.Address.StateCode,
          'postalCode': eachLocation._source.Address.PostalCode,
          'country': eachLocation._source.Address.CountryCode,
          'stopType': element.typeName,
          'pointToolTip': `${eachLocation._source.LocationName} (${eachLocation._source.LocationCode}),
        ${eachLocation._source.Address.AddressLine1}, ${eachLocation._source.Address.CityName},
        ${eachLocation._source.Address.StateCode}, ${eachLocation._source.Address.PostalCode},
        ${eachLocation._source.Address.CountryCode}`,
          'vendor': element.vendorID === null ? '- -' : element.vendorID
        });
      });
    }
    this.detailsModel.stopList = utils.sortBy(this.detailsModel.stopList, 'stop');
  }
  getCountryStop(stopValue: StopValues[]) {
    if (!utils.isEmpty(stopValue)) {
      stopValue.forEach((element) => {
        this.detailsModel.stopList.push({
          'type': element.typeName,
          'stop': element.stopSequenceNumber,
          'country': element.point,
          'stopType': element.typeName,
          'pointToolTip': `${element.point}`,
          'vendor': element.vendorID === null ? '- -' : element.vendorID
        });
      });
    }
    this.detailsModel.stopList = utils.sortBy(this.detailsModel.stopList, 'stop');
  }
  processedAdditionalDetails(additionalInfo: LineHaulValues) {
    if (additionalInfo['unitOfMeasurement']) {
      additionalInfo['unitOfMeasurement']['lineHaulWeightRangeMinQuantity'] =
        additionalInfo['unitOfMeasurement']['lineHaulWeightRangeMinQuantity'] ||
          additionalInfo['unitOfMeasurement']['lineHaulWeightRangeMinQuantity'] === 0
          ? additionalInfo['unitOfMeasurement']['lineHaulWeightRangeMinQuantity'].toLocaleString() : null;
      additionalInfo['unitOfMeasurement']['lineHaulWeightRangeMaxQuantity'] =
        additionalInfo['unitOfMeasurement']['lineHaulWeightRangeMaxQuantity']
          ? additionalInfo['unitOfMeasurement']['lineHaulWeightRangeMaxQuantity'].toLocaleString() : null;
    }
  }
  processedMileageDetails(additionalInfo: LineHaulValues) {
    if (additionalInfo['mileagePreference']) {
      additionalInfo['mileagePreference']['lineHaulMileageRangeMinQuantity'] =
        additionalInfo['mileagePreference']['lineHaulMileageRangeMinQuantity'] ||
          additionalInfo['mileagePreference']['lineHaulMileageRangeMinQuantity'] === 0
          ? additionalInfo['mileagePreference']['lineHaulMileageRangeMinQuantity'].toLocaleString() : null;
      additionalInfo['mileagePreference']['lineHaulMileageRangeMaxQuantity'] =
        additionalInfo['mileagePreference']['lineHaulMileageRangeMaxQuantity']
          ? additionalInfo['mileagePreference']['lineHaulMileageRangeMaxQuantity'].toLocaleString() : null;
    }
  }

}
