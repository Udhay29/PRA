import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeWhile, take } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment';
import { LineHaulOverviewService } from './services/line-haul-overview.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { LineHaulOverViewModel } from './model/line-haul-overview.model';
import {
  RateInterface, StopValues, HitsInterface, LineHaulValues, CityInterface, HitsItem,
  EquipmentTypeInterface
} from './model/line-haul-overview.interface';
import { LineHaulQuery } from '../query/line-haul.query';
import { ViewAgreementDetailsUtility } from './../../../service/view-agreement-details-utility';
import { OverviewService } from '../../add-line-haul/overview/services/overview.service';
import { ServiceofferingInterface, OperationalService } from '../../add-line-haul/overview/model/overview.interface';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';

@Component({
  selector: 'app-line-haul-overview',
  templateUrl: './line-haul-overview.component.html',
  styleUrls: ['./line-haul-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineHaulOverviewComponent implements OnDestroy {

  overViewModel: LineHaulOverViewModel;

  constructor(private readonly lineHaulOverviewService: LineHaulOverviewService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly utilityService: ViewAgreementDetailsUtility,
    private readonly messageService: MessageService,
    private readonly overviewService: OverviewService, private readonly broadCastService: BroadcasterService) {
    this.overViewModel = new LineHaulOverViewModel();
  }
  @Input()
  set afterBroadcast(value) {
    if (value !== undefined) {
      this.getLineHaulOverview();
    }
  }
  ngOnDestroy() {
    this.overViewModel.subscriberFlag = false;
  }
  getLineHaulConfigurationID() {
    this.overViewModel.nameConfigurationDetails = this.utilityService.getConfigurationID();
  }
  getLineHaulOverview() {
    this.overViewModel.lineHaulOverview = null;
    const subscription = this.broadCastService.on<LineHaulValues>('linehaulOverView')
    .pipe(takeWhile(() => this.overViewModel.subscriberFlag)).subscribe((linehaulOverviewData: LineHaulValues) => {
      if (!utils.isEmpty(linehaulOverviewData) && this.overViewModel.isCallCheckFlag) {
        this.overViewModel.isCallCheckFlag = false;
        const data = linehaulOverviewData;
        this.overViewModel.lineHaulOverview = data;
        this.overViewModel.lineHaulOverview['overriddenPriority'] =
          (this.overViewModel.lineHaulOverview['overiddenPriorityLevelNumber'] !== null) ?
            this.overViewModel.lineHaulOverview['overiddenPriorityLevelNumber'].toString() : '--';
        this.overViewModel.lineHaulOverview.customerAgreementContractName = (data.customerAgreementContractNumber) ?
          `${data['customerAgreementContractNumber']} (${data['customerAgreementContractName']})`
          : `(Transactional) - ${data['customerAgreementContractName']}`;
        this.overViewModel.rateValues = [];
        this.setRateValues();
        this.overViewModel.operationalServices = [];
        this.setOperationalSerivces(data);
        this.changeDetector.markForCheck();
        this.overViewModel.originPoints = [];
        this.overViewModel.destinationPoints = [];
        this.overViewModel.originRangeDisplay = [];
        this.overViewModel.destinationRangeDisplay = [];
        this.getOriginDestinationValues(this.overViewModel.lineHaulOverview);
        this.getStateIds(this.overViewModel.lineHaulOverview);
        this.setServiceOffering(this.overViewModel.lineHaulOverview);
        this.changeDetector.markForCheck();
        if (subscription) {
          subscription.unsubscribe();
        }
        this.changeDetector.detectChanges();
      }
    });
  }
  stateIdCity(element: StopValues, index: number) {
    const cityStateQuery = LineHaulQuery.getCityQuery(element.pointID);
    this.lineHaulOverviewService.getCityState(cityStateQuery).pipe(takeWhile(() => this.overViewModel.subscriberFlag)).
      subscribe((data: HitsInterface[]) => {
        if (!utils.isEmpty(data)) {
          this.stopCityStateValues(data, index);
        }
        this.changeDetector.markForCheck();
      });
  }
  stateIdAddress(element: StopValues, index: number) {
    const addressQuery = LineHaulQuery.getOriginDestinationQuery(element.pointID);
    this.lineHaulOverviewService.getOriginPoint(addressQuery).pipe(takeWhile(() => this.overViewModel.subscriberFlag)).
      subscribe((data: HitsInterface[]) => {
        if (!utils.isEmpty(data)) {
          this.stopAddresValues(data, index);
        }
        this.changeDetector.markForCheck();
      });
  }
  stateIdState(element: StopValues, index: number) {
    const stateQuery = LineHaulQuery.getStateQuery(element.pointID);
    this.lineHaulOverviewService.getCityState(stateQuery).pipe(takeWhile(() => this.overViewModel.subscriberFlag)).
      subscribe((data: HitsInterface[]) => {
        if (!utils.isEmpty(data)) {
          this.stopStateValues(data, index);
        }
        this.changeDetector.markForCheck();
      });
  }
  stateIdZip(element: StopValues, index: number) {
    const zipQuery = LineHaulQuery.getPostalZipQuery(element.pointID);
    this.lineHaulOverviewService.getCityState(zipQuery).pipe(takeWhile(() => this.overViewModel.subscriberFlag)).
      subscribe((data: HitsInterface[]) => {
        if (!utils.isEmpty(data)) {
          this.stopZipValues(element.typeName, data, index);
        }
        this.changeDetector.markForCheck();
      });
  }
  stateIdLocationRampYard(element: StopValues, index: number) {
    const locationQuery = LineHaulQuery.getRampYardQuery(element.pointID);
    this.lineHaulOverviewService.getOriginPoint(locationQuery).pipe(takeWhile(() => this.overViewModel.subscriberFlag)).
      subscribe((data: HitsInterface[]) => {
        if (!utils.isEmpty(data)) {
          this.stopLocationValues(element.typeName, data, index);
        }
        this.changeDetector.markForCheck();
      });
  }
  getStateIds(overViewValues: LineHaulValues) {
    if (overViewValues.stops) {
      this.overViewModel.stopDetails = [];
      overViewValues.stops.forEach((element: StopValues, index) => {
        switch (element.typeName) {
          case 'City State':
            this.stateIdCity(element, index);
            break;
          case 'Address':
            this.stateIdAddress(element, index);
            break;
          case 'State':
            this.stateIdState(element, index);
            break;
          case '2-Zip':
            this.stateIdZip(element, index);
            break;
          case '3-Zip':
            this.stateIdZip(element, index);
            break;
          case '5-Zip':
            this.stateIdZip(element, index);
            break;
          case '6-Zip':
            this.stateIdZip(element, index);
            break;
          case '9-Zip':
            this.stateIdZip(element, index);
            break;
          case 'Location':
            this.stateIdLocationRampYard(element, index);
            break;
          case 'Ramp':
            this.stateIdLocationRampYard(element, index);
            break;
          case 'Yard':
            this.stateIdLocationRampYard(element, index);
            break;
          case 'Country':
            this.stopCountryValues(element, index);
            break;
          default:
            break;
        }
      });
    }
  }
  originDestCity(overViewValues, element: string) {
    const cityStateQuery = LineHaulQuery.getCityQuery(overViewValues.pointID);
    this.lineHaulOverviewService.getCityState(cityStateQuery).pipe(takeWhile(() => this.overViewModel.subscriberFlag)).
      subscribe((data: HitsInterface[]) => {
        if (!utils.isEmpty(data)) {
          const cityStateValues = data['hits']['hits'];
          cityStateValues.forEach((cityValue: CityInterface[]) => {
            const EachCity: CityInterface = cityValue['inner_hits']['City']['hits'];
            this.overViewModel[element].push({
              CityName: EachCity.hits[0]._source.CityName,
              State: EachCity.hits[0]._source.State.StateCode,
              type: 'City,State'
            });
          });
          this.overViewModel[element] = utils.uniqBy(this.overViewModel[element], 'CityName');
        }
        this.changeDetector.markForCheck();
      });
  }
  originDestAddress(overViewValues, element: string) {
    const addressQuery = LineHaulQuery.getOriginDestinationQuery(overViewValues.pointID);
    this.lineHaulOverviewService.getOriginPoint(addressQuery).pipe(takeWhile(() => this.overViewModel.subscriberFlag)).
      subscribe((data: HitsInterface[]) => {
        if (!utils.isEmpty(data)) {
          const stopData = data['hits'];
          stopData.hits.forEach((EachAddress: HitsItem) => {
            this.overViewModel[element].push({
              AddressLine1: EachAddress['_source']['Address']['AddressLine1'],
              CityName: EachAddress['_source']['Address']['CityName'],
              StateCode: EachAddress['_source']['Address']['StateCode'],
              PostalCode: EachAddress['_source']['Address']['PostalCode'],
              CountryCode: EachAddress['_source']['Address']['CountryCode'],
              type: 'Address'
            });
          });
        }
        this.changeDetector.markForCheck();
      });
  }
  originDestState(overViewValues, element: string) {
    const stateQuery = LineHaulQuery.getStateQuery(overViewValues.pointID);
    this.lineHaulOverviewService.getCityState(stateQuery).pipe(takeWhile(() => this.overViewModel.subscriberFlag)).
      subscribe((data: HitsInterface[]) => {
        if (!utils.isEmpty(data['hits']['hits'])) {
          const EachCity: CityInterface = data['hits']['hits'][0]['inner_hits']['City']['hits'];
          this.overViewModel[element].push({
            State: EachCity.hits[0]._source.State.StateName,
            type: 'State'
          });
        }
        this.changeDetector.markForCheck();
      });
  }
  originDestZip(overViewValues, element: string) {
    const zipQuery = LineHaulQuery.getPostalZipQuery(overViewValues.pointID);
    this.lineHaulOverviewService.getCityState(zipQuery).pipe(takeWhile(() => this.overViewModel.subscriberFlag)).
      subscribe((data: HitsInterface[]) => {
        if (!utils.isEmpty(data['hits']['hits'])) {
          const EachCity = data['hits'];
          this.overViewModel[element].push({
            PostalCode: this.postalCodeSplice(EachCity.hits[0]._source.PostalCode),
            type: overViewValues.subTypeName
          });
        }
        this.changeDetector.markForCheck();
      });
  }
  originDestZipRange(overViewValues, element: string) {
    const postalArray = [];
    const zipQuery = LineHaulQuery.getPostalZipRangeQuery(overViewValues);
    this.lineHaulOverviewService.getCityState(zipQuery).pipe(takeWhile(() => this.overViewModel.subscriberFlag)).
      subscribe((data: HitsInterface[]) => {
        if (!utils.isEmpty(data['hits']['hits'])) {
          const EachCity = data['hits'];
          if (EachCity.total > 1) {
            EachCity['hits'].forEach((value) => {
              postalArray.push(this.postalCodeSplice(value._source.PostalCode));
            });
          }
        }
        this.overViewModel[element].push({
          PostalCodeLower: postalArray[0] < postalArray[1] ? postalArray[0] : postalArray[1],
          PostalCodeUpper: postalArray[0] < postalArray[1] ? postalArray[1] : postalArray[0],
          type: overViewValues.subTypeName
        });
        this.changeDetector.markForCheck();
      });
  }
  postalCodeSplice(PostalCode: any) {
    if (PostalCode.length === 9 && !PostalCode.includes('-')) {
      return `${PostalCode.substring(0, 5)}-${PostalCode.substring(5, 9)}`;
    } else {
      return PostalCode;
    }
  }
  originDestLocation(overViewValues, element: string) {
    const locationQuery = LineHaulQuery.getRampYardQuery(overViewValues.pointID);
    this.lineHaulOverviewService.getOriginPoint(locationQuery).pipe(takeWhile(() => this.overViewModel.subscriberFlag)).
      subscribe((data: HitsInterface[]) => {
        if (!utils.isEmpty(data['hits']['hits'])) {
          this.overViewModel[element].push({
            LocationCode: data['hits']['hits'][0]._source.LocationCode,
            LocationName: data['hits']['hits'][0]._source.LocationName,
            AddressLine1: data['hits']['hits'][0]._source.Address.AddressLine1,
            CityName: data['hits']['hits'][0]._source.Address.CityName,
            StateCode: data['hits']['hits'][0]._source.Address.StateCode,
            PostalCode: data['hits']['hits'][0]._source.Address.PostalCode,
            CountryCode: data['hits']['hits'][0]._source.Address.CountryCode,
            type: overViewValues.subTypeName
          });
        }
        this.changeDetector.markForCheck();
      });
  }
  getOriginDestinationValues(overViewValues: LineHaulValues) {
    if (overViewValues.originPoints && overViewValues.destinationPoints) {
      const originDestinationArray = [{
        point: 'originPoints', type: 'originType'},
        {point: 'destinationPoints', type: 'destinationType'}];
      originDestinationArray.forEach((element) => {
        if (overViewValues[element.type].includes('Region')) {
          this.originDestForRegion(overViewValues, element);
        } else {
          overViewValues[element.point].forEach((dataValue) => {
            this.originDestinationTypeFinder(dataValue, element.point);
          });
        }
      });
    }
  }
  frameCityStateRegion(hitsData, element) {
    const displayString = [];
    utils.forEach(hitsData, (data) => {
      if (data && data.inner_hits && data.inner_hits.City && data.inner_hits.City.hits && data.inner_hits.City.hits.hits &&
         data.inner_hits.City.hits.hits.length) {
           const value = data.inner_hits.City.hits.hits;
           displayString.push(`${value[0]._source.CityName}, ${value[0]._source.State.StateCode}`);
      }
    });
    displayString.sort();
    this.overViewModel[element.point].push({
      type: this.overViewModel.lineHaulOverview[element.type],
      regionDisplay: utils.join(utils.uniq(displayString), '; ')
    });
  }
  frameZipRegion(hitData, element) {
    const displayString = [];
    utils.forEach(this.overViewModel.lineHaulOverview[element.point], (data) => {
      if (data.subTypeName === '3-Zip' ) {
        const filteredObject = utils.filter(hitData, ['PostalCodeID', data.pointID]);
        data.pointDisplayName = filteredObject[0]['PostalCode'];
        displayString.push(filteredObject[0]['PostalCode']);
      } else {
        const lowerValue = utils.filter(hitData, ['PostalCodeID', data.lowerBoundID])[0]['PostalCode'];
        const upperValue = utils.filter(hitData, ['PostalCodeID', data.upperBoundID])[0]['PostalCode'];
        data.pointDisplayName = `${lowerValue} - ${upperValue}`;
        displayString.push(`${lowerValue} - ${upperValue}`);
      }
    });
    displayString.sort();
    this.overViewModel[element.point].push({
      type: this.overViewModel.lineHaulOverview[element.type],
      regionDisplay: utils.join(displayString, '; ')
    });
  }
  originDestCitStateRegion(listValues, element) {
    const postalCodeIDList = [];
    utils.forEach(listValues, (listValue) => {
      postalCodeIDList.push(listValue.pointID);
    });
    const zipQuery = LineHaulQuery.getCityStateRegionQuery(postalCodeIDList);
    this.lineHaulOverviewService.getCityState(zipQuery).pipe(takeWhile(() => this.overViewModel.subscriberFlag)).
      subscribe((data: any) => {
        if (!utils.isEmpty(data) && !utils.isEmpty(data.hits) && !utils.isEmpty(data.hits.hits)) {
          this.frameCityStateRegion(data.hits.hits, element);
        }
        this.changeDetector.markForCheck();
      });
  }
  orginDestZipRegion(listValues, element) {
    const postalCodeIDList = [];
    utils.forEach(listValues, (listValue) => {
      if (listValue.subTypeName === '3-Zip') {
        postalCodeIDList.push(listValue.pointID);
      } else {
        postalCodeIDList.push(listValue.lowerBoundID);
        postalCodeIDList.push(listValue.upperBoundID);
      }
    });
    const zipQuery = LineHaulQuery.getPostalZipRangeQuery(postalCodeIDList, true);
    this.lineHaulOverviewService.getCityState(zipQuery).pipe(takeWhile(() => this.overViewModel.subscriberFlag)).
    subscribe((data) => {
      if (!utils.isEmpty(data['hits']['hits'])) {
        const postalCodeList = [];
        utils.forEach(data['hits']['hits'], (hit) => {
          postalCodeList.push(hit._source);
        });
        this.frameZipRegion(postalCodeList, element);
      }
      this.changeDetector.markForCheck();
    });
  }
  originDestForRegion(overViewValues, element) {
    switch (overViewValues[element.type]) {
      case '3-Zip Region':
        this.orginDestZipRegion(overViewValues[element.point], element);
        break;
      case 'City State Region':
        this.originDestCitStateRegion(overViewValues[element.point], element);
        break;
      default: break;
    }
  }
  originDestinationTypeFinder(overViewValues, element) {
    switch (overViewValues.subTypeName) {
      case 'City State':
        this.originDestCity(overViewValues, element);
        break;
      case 'Address':
        this.originDestAddress(overViewValues, element);
        break;
      case 'State':
        this.originDestState(overViewValues, element);
        break;
      case '2-Zip':
      case '3-Zip':
      case '5-Zip':
      case '6-Zip':
      case '9-Zip':
        this.originDestZip(overViewValues, element);
        break;
      case '3-Zip Range':
      case '5-Zip Range':
      case '6-Zip Range':
      case '9-Zip Range':
        this.originDestZipRange(overViewValues, element);
        break;
      case 'Location':
      case 'Ramp':
      case 'Yard':
        this.originDestLocation(overViewValues, element);
        break;
      default:
        break;
    }
  }
  stopAddresValues(data: HitsInterface[], indexValue: number) {
    const stopData: HitsInterface = data['hits'];
    const EachAddress: HitsItem = stopData.hits[0];
    this.overViewModel.stopDetails.push({
      AddressLine1: EachAddress._source.Address.AddressLine1,
      CityName: EachAddress._source.Address.CityName,
      StateCode: EachAddress._source.Address.StateCode,
      PostalCode: EachAddress._source.Address.PostalCode,
      CountryCode: EachAddress._source.Address.CountryCode,
      State: EachAddress._source.Address.StateCode,
      stopTye: 'Address',
      index: indexValue
    });
    this.overViewModel.stopDetails = utils.sortBy(this.overViewModel.stopDetails, 'index');
  }
  stopCityStateValues(data: HitsInterface[], indexValue: number) {
    if (!utils.isEmpty(data['hits']['hits'])) {
      const EachCity: CityInterface = data['hits']['hits'][0]['inner_hits']['City']['hits'];
      this.overViewModel.stopDetails.push({
        CityName: EachCity.hits[0]._source.CityName,
        State: EachCity.hits[0]._source.State.StateCode,
        stopTye: 'City,State',
        index: indexValue,
        AddressLine1: EachCity.hits[0]._source.AddressLine1,
        StateCode: EachCity.hits[0]._source.StateCode,
        PostalCode: EachCity.hits[0]._source.PostalCode,
        CountryCode: EachCity.hits[0]._source.CountryCode
      });
    }
    this.overViewModel.stopDetails = utils.sortBy(this.overViewModel.stopDetails, 'index');
  }
  stopStateValues(data: HitsInterface[], indexValue: number) {
    if (!utils.isEmpty(data['hits']['hits'])) {
      const EachCity: CityInterface = data['hits']['hits'][0]['inner_hits']['City']['hits'];
      this.overViewModel.stopDetails.push({
        CityName: EachCity.hits[0]._source.CityName,
        State: EachCity.hits[0]._source.State.StateName,
        stopTye: 'State',
        index: indexValue,
        AddressLine1: EachCity.hits[0]._source.AddressLine1,
        StateCode: EachCity.hits[0]._source.StateCode,
        PostalCode: EachCity.hits[0]._source.PostalCode,
        CountryCode: EachCity.hits[0]._source.CountryCode
      });
    }
    this.overViewModel.stopDetails = utils.sortBy(this.overViewModel.stopDetails, 'index');
  }
  stopZipValues(stopName: string, data: HitsInterface[], indexValue: number) {
    if (!utils.isEmpty(data['hits']['hits'])) {
      this.overViewModel.stopDetails.push({
        stopTye: stopName,
        index: indexValue,
        PostalCode: this.postalCodeSplice(data['hits']['hits'][0]._source.PostalCode)
      });
    }
    this.overViewModel.stopDetails = utils.sortBy(this.overViewModel.stopDetails, 'index');
  }
  stopLocationValues(stopName: string, data: HitsInterface[], indexValue: number) {
    if (!utils.isEmpty(data['hits']['hits'])) {
      this.overViewModel.stopDetails.push({
        stopTye: stopName,
        index: indexValue,
        LocationCode: data['hits']['hits'][0]._source.LocationCode,
        LocationName: data['hits']['hits'][0]._source.LocationName,
        AddressLine1: data['hits']['hits'][0]._source.Address.AddressLine1,
        CityName: data['hits']['hits'][0]._source.Address.CityName,
        StateCode: data['hits']['hits'][0]._source.Address.StateCode,
        PostalCode: data['hits']['hits'][0]._source.Address.PostalCode,
        CountryCode: data['hits']['hits'][0]._source.Address.CountryCode
      });
    }
    this.overViewModel.stopDetails = utils.sortBy(this.overViewModel.stopDetails, 'index');
  }
  stopCountryValues(element: StopValues, index: number) {
    if (!utils.isEmpty(element)) {
      this.overViewModel.stopDetails.push({
        stopTye: element.typeName,
        index: index,
        CountryCode: element.point
      });
    }
    this.overViewModel.stopDetails = utils.sortBy(this.overViewModel.stopDetails, 'index');
  }
  setRateValues() {
    if (!utils.isEmpty(this.overViewModel.lineHaulOverview.rates)) {
      this.overViewModel.lineHaulOverview.rates.forEach((element: RateInterface) => {
        this.overViewModel.rateValues.push({
          'chargeUnitTypeName': element.chargeUnitTypeName,
          'rateAmount': element.rateAmount,
          'currencyCode': element.currencyCode
        });
      });
    }
  }
  setServiceOffering(lineHaulOverview: LineHaulValues) {
    this.overviewService.getServiceOffering(lineHaulOverview.financeBusinessUnitName)
      .pipe(takeWhile(() => this.overViewModel.subscriberFlag))
      .subscribe((serviceOfferingValues: ServiceofferingInterface[]) => {
        if (serviceOfferingValues) {
          serviceOfferingValues.forEach((eachServiceOffering: ServiceofferingInterface) => {
            if (lineHaulOverview.serviceOfferingCode === eachServiceOffering.serviceOfferingCode) {
              this.overViewModel.serviceOffering = eachServiceOffering.serviceOfferingDescription;
              this.changeDetector.markForCheck();
            }
          });
        }
      });
  }
  setOperationalSerivces(lineHaulOverview: LineHaulValues) {
    const operationalServiceRequestPayLoad = {
      businessUnit: lineHaulOverview.financeBusinessUnitName,
      serviceOffering: lineHaulOverview.serviceOfferingCode,
      serviceCategoryCode: 'ReqServ'
    };
    this.overviewService.getOperationalServices(operationalServiceRequestPayLoad).pipe(takeWhile(() => this.overViewModel.subscriberFlag))
      .subscribe((response: Array<OperationalService>) => {
        this.overViewModel.operationalServices = [];
        if (response) {
          lineHaulOverview.operationalServices.forEach(element => {
            response.forEach((eachOperationalService: OperationalService) => {
              if (element.serviceTypeCode === eachOperationalService.serviceTypeCode) {
                this.overViewModel.operationalServices.push(eachOperationalService.serviceTypeDescription);
                this.changeDetector.markForCheck();
              }
            });
          });
        }
      }, (error: HttpErrorResponse) => {
        if (error.status >= 500) {
          this.toastMessage(this.messageService, 'error', 'OrderManagementReferenceData service is unavailable');
        }
      });
  }
  toastMessage(messageService: MessageService, key: string, data: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? 'Error' : 'Success',
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
}
