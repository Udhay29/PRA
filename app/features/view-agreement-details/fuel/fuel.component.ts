import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { FuelModel } from './model/fuel.model';
import * as utils from 'lodash';

import { FuelProgramQuery } from './query/fuel-program.query';
import { takeWhile } from 'rxjs/operators';
import { FuelService } from './service/fuel.service';

import { Hits, RootObject, Source, QueryMock } from './model/fuel.interface';
import { isArray } from 'util';
import * as moment from 'moment';
import { MessageService } from 'primeng/components/common/messageservice';
import { LocalStorageService } from './../../../shared/jbh-app-services/local-storage.service';

@Component({
  selector: 'app-fuel',
  templateUrl: './fuel.component.html',
  styleUrls: ['./fuel.component.scss']
})
export class FuelComponent implements OnInit, OnDestroy {
  fuelModel: FuelModel;
  @ViewChild('fuelTable') fuelTable: any;
  constructor(private readonly router: Router, private readonly route: ActivatedRoute,
    private readonly messageService: MessageService, private readonly fuelService: FuelService,
    private readonly changeDetector: ChangeDetectorRef, private readonly localStore: LocalStorageService) {
    this.fuelModel = new FuelModel();
  }

  ngOnInit() {
    this.getAgreementId();
    this.localStore.setItem('agreementDetails', 'create', 'Fuel', true);
    this.getMockJson();
  }

  ngOnDestroy() {
    this.fuelModel.isSubscribe = false;
  }

  loadFuelProgramRecords() {
    const params = this.fuelService.getElasticparam();
    this.fuelService.getFuelList(params).pipe(takeWhile(() => this.fuelModel.isSubscribe)).subscribe((data: RootObject) => {
      if (!utils.isEmpty(data) && !utils.isEmpty(data['hits']) && isArray(data['hits']['hits'])) {
        this.fuelModel.gridDataLength = data['hits']['total'];
        this.fuelModel.fuelList = [];
        utils.forEach(data['hits']['hits'], (response: Hits) => {
          this.fuelModel.fuelList.push(this.loadGridFields(response['_source']));
          this.changeDetector.detectChanges();
        });
        this.fuelModel.noResultFoundFlag = (this.fuelModel.fuelList.length === 0);
        if (this.fuelModel.gridDataLength !== 0 ) {
          this.fuelModel.isPaginatorFlag = true;
        } else {
          this.fuelModel.isPaginatorFlag = false;
        }
        this.fuelModel.loading = false;
        this.changeDetector.detectChanges();
      }
    }, (error: Error) => {
      this.fuelModel.loading = false;
      this.fuelModel.noResultFoundFlag = true;
      this.fuelModel.isPaginatorFlag = false;
      this.fuelModel.gridDataLength = 0;
      this.toastMessage('error', error.message);
      this.changeDetector.detectChanges();
    });
  }
  loadGridFields(resultset: Source): Source {
    const dateFormat = 'MM/DD/YYYY';
    resultset['FuelProgramName'] = resultset.FuelProgram.FuelProgramName;
    resultset['AgreementName'] = resultset.AgreementDefaultIndicator;
    this.fuelModel.contractList = this.getFieldArrayList(resultset.ContractAssociations, 'ContractDisplayName');
    this.fuelModel.busoList = (this.getFieldArrayList(resultset.FinanceBusinessUnitServiceOfferingAssociations,
      'FinanceBusinessUnitServiceOfferingDisplayName'));
    this.fuelModel.carrierList = this.getFieldArrayList(resultset.CarrierAssociations, 'CarrierName');
    this.fuelModel.billtoList = this.getFieldArrayListBillTo(resultset.BillToAccountAssociations);
    this.fuelModel.sectionList = this.getFieldArrayList(resultset['SectionAssociations'], 'SectionName');
    resultset['contractListTooltip'] = (!utils.isEmpty(this.fuelModel.contractList)) ? this.fuelModel.contractList.join('\n') : '--';
    resultset['busoListTooltip'] = (!utils.isEmpty(this.fuelModel.busoList)) ? this.fuelModel.busoList.join('\n') : '--';
    resultset['carrierListTooltip'] = (!utils.isEmpty(this.fuelModel.carrierList)) ? this.fuelModel.carrierList.join('\n') : '--';
    resultset['billtoListTooltip'] = (!utils.isEmpty(this.fuelModel.billtoList)) ? this.fuelModel.billtoList.join('\n') : '--';
    resultset['sectionListTooltip'] = (!utils.isEmpty(this.fuelModel.sectionList)) ? this.fuelModel.sectionList.join('\n') : '--';
    resultset['Contract'] = (!utils.isEmpty(this.fuelModel.contractList)) ?
      this.displayCodes(this.fuelModel.contractList).join('\n') : '--';
    resultset['Section'] = (!utils.isEmpty(this.fuelModel.sectionList)) ?
      this.displayCodes(this.fuelModel.sectionList).join('\n') : '--';
    resultset['BusinessUnitsandServiceOffering'] = (!utils.isEmpty(this.fuelModel.busoList)) ?
      this.displayCodes(this.fuelModel.busoList).join('\n') : '--';
    resultset['BillToAccount'] = (!utils.isEmpty(this.fuelModel.billtoList)) ?
      this.displayCodes(this.fuelModel.billtoList).join('\n') : '--';
    resultset['EffectiveDate'] = resultset.EffectiveDate ? moment(resultset.EffectiveDate).format(dateFormat) : '--';
    resultset['ExpirationDate'] = resultset.ExpirationDate ? moment(resultset.ExpirationDate).format(dateFormat) : '--';
    resultset['Carrier'] = (!utils.isEmpty(this.fuelModel.carrierList)) ? this.displayCodes(this.fuelModel.carrierList).join('\n') : '--';
    resultset['Conditions'] = resultset.FuelProgram.Conditions;
    resultset['UpdatedBy'] = `${resultset.FuelProgram.LastUpdateProgramName} (${resultset.FuelProgram.LastUpdateUserID})`;
    resultset['UpdatedOn'] = moment(resultset.FuelProgram.LastUpdateDate).format(dateFormat);
    resultset['CreatedBy'] = `${resultset.FuelProgram.CreateProgramName} (${resultset.FuelProgram.CreateUserID})`;
    resultset['CreatedOn'] = moment(resultset.FuelProgram.CreatedDate).format(dateFormat);
    this.getFuelCalculationDetails(resultset);
    this.getFuelPriceBasis(resultset);
    return resultset;
  }
  getFieldArrayListBillTo(resultSet) {
    let resultList = [];
    if (!utils.isEmpty(resultSet)) {
      resultSet.forEach(
        (response) => {
          const billTo = `${response['BillingPartyName']} ( ${response['BillingPartyCode']} )`;
          if (response['BillingPartyName'] !== null && response['BillingPartyCode']) { resultList.push(billTo.trim()); }
        });
    }
    resultList = utils.uniq(resultList);
    return resultList;
  }
  getFuelCalculationDetails(resultset) {
    if (resultset.FuelProgram.FuelCalculationDetails) {
      resultset['FuelCalculationDateType'] = resultset.FuelProgram.FuelCalculationDetails.FuelCalculationDateTypeName;
      resultset['FuelType'] = resultset.FuelProgram.FuelCalculationDetails.FuelTypeName;
      resultset['RoundingDigit'] = resultset.FuelProgram.FuelCalculationDetails.FuelRoundingDecimalNumber;
      resultset['ChargeType'] = `${resultset.FuelProgram.FuelCalculationDetails.ChargeTypeName}
       (${resultset.FuelProgram.FuelCalculationDetails.ChargeTypeCode})`;
      resultset['RateType'] = resultset.FuelProgram.FuelCalculationDetails.FuelRateTypeName;
      resultset['DrayDiscount'] = resultset.FuelProgram.FuelCalculationDetails.FuelDiscountTypeName;
      resultset['Currency'] = resultset.FuelProgram.FuelCalculationDetails.CurrencyCode;
      resultset['CalculationType'] = resultset.FuelProgram.FuelCalculationDetails.FuelCalculationTypeName;
      resultset['CalculationMethod'] = resultset.FuelProgram.FuelCalculationDetails.FuelCalculationMethodTypeName;
      resultset['RollUp'] = resultset.FuelProgram.FuelCalculationDetails.FuelRollUpIndicator;
    }
    this.getFuelMethod(resultset);
  }
  getFuelPriceBasis(resultset) {
    if (resultset.FuelProgram.FuelPriceBasis) {
      resultset['PriceSource'] = resultset.FuelProgram.FuelPriceBasis.FuelPriceSourceTypeName;
      resultset['PriceChangeOccurrence'] = resultset.FuelProgram.FuelPriceBasis.FuelPriceChangeOccurenceTypeName;
      resultset['PriceChangeDayofWeek'] = resultset.FuelProgram.FuelPriceBasis.PriceChangeWeekDayName;
      resultset['PriceChangeDayofMonth'] = resultset.FuelProgram.FuelPriceBasis.PriceChangeMonthDayNumber;
      resultset['DelayforHoliday'] = resultset.FuelProgram.FuelPriceBasis.HolidayDelayIndicator;
      resultset['CustomFuelCalendar'] = resultset.FuelProgram.FuelPriceBasis.CustomFuelCalendar;
      resultset['UseFuelPriceAsOf'] = resultset.FuelProgram.FuelPriceBasis.FuelPriceFactorTypeName;
      resultset['WeeksinAverage'] = resultset.FuelProgram.FuelPriceBasis.AverageWeekQuantity;
      resultset['MonthsinAverage'] = resultset.FuelProgram.FuelPriceBasis.AverageMonthQuantity;
      this.fuelModel.regionList = this.getFieldArrayList(resultset['FuelProgram']['FuelPriceBasis']['FuelPriceRegionAssociations'],
        'DistrictName');
      resultset['regionListTooltip'] = (!utils.isEmpty(this.fuelModel.regionList)) ? this.fuelModel.regionList.join('\n') : '--';
      resultset['Region'] = (!utils.isEmpty(this.fuelModel.regionList)) ?
        this.displayCodes(this.fuelModel.regionList).join('\n') : '--';
      resultset['UseDefinedRegionStates'] = resultset.FuelProgram.FuelPriceBasis.UseDefinedRegionStates;
      resultset['Averaging'] = resultset.FuelProgram.FuelPriceBasis.AverageFuelFactorIndicator;
    }
  }
  getFuelMethod(resultset) {
    if (resultset.FuelProgram.FuelCalculationDetails && resultset.FuelProgram.FuelCalculationDetails.FuelFlat) {
      resultset['FuelSurchargeAmount'] = resultset.FuelProgram.FuelCalculationDetails.FuelFlat.FuelSurchargeAmount;
    }
    this.getFuelFormulaData(resultset);
    this.getFuelQuantityData(resultset);
    this.getFuelReferrerData(resultset);
  }
  getFuelFormulaData(resultset) {
    resultset['FuelSurchargeFactor'] = resultset.FuelProgram.FuelCalculationDetails.FuelFormula.FuelSurchargeFactorAmount;
    resultset['IncrementalCharge'] = resultset.FuelProgram.FuelCalculationDetails.FuelFormula.IncrementChargeAmount;
    if (resultset.FuelProgram.FuelCalculationDetails.FuelFormula.ImplementationAmount) {
      resultset['ImplementationPrice'] = resultset.FuelProgram.FuelCalculationDetails.FuelFormula.ImplementationAmount;
    }
    resultset['IncrementInterval'] = resultset.FuelProgram.FuelCalculationDetails.FuelFormula.IncrementIntervalAmount;
    resultset['Cap'] = resultset.FuelProgram.FuelCalculationDetails.FuelFormula.CapAmount;
  }
  getFuelQuantityData(resultset) {
    if (resultset.FuelProgram.FuelCalculationDetails.FuelQuantity.ImplementationAmount) {
      resultset['ImplementationPrice'] = resultset.FuelProgram.FuelCalculationDetails.FuelQuantity.ImplementationAmount;
    }
    if (resultset.FuelProgram.FuelCalculationDetails.FuelQuantity.PricingUnitOfLengthMeasurementCode) {
      resultset['DistanceBasis'] = resultset.FuelProgram.FuelCalculationDetails.FuelQuantity.PricingUnitOfLengthMeasurementCode;
    }
    if (resultset.FuelProgram.FuelCalculationDetails.FuelQuantity.PricingUnitOfVolumeMeasurementCode) {
      resultset['FuelQuantityBasis'] = resultset.FuelProgram.FuelCalculationDetails.FuelQuantity.PricingUnitOfVolumeMeasurementCode;
    }
    resultset['DistancePerFuelQuantity'] = resultset.FuelProgram.FuelCalculationDetails.FuelQuantity.DistancePerFuelQuantity;
    resultset['AddonAmount'] = resultset.FuelProgram.FuelCalculationDetails.FuelQuantity.AddonAmount;
  }
  getFuelReferrerData(resultset) {
    if (resultset.FuelProgram.FuelCalculationDetails.FuelReefer.ImplementationAmount) {
      resultset['ImplementationPrice'] = resultset.FuelProgram.FuelCalculationDetails.FuelReefer.ImplementationAmount;
    }
    if (resultset.FuelProgram.FuelCalculationDetails.FuelReefer.PricingUnitOfLengthMeasurementCode) {
      resultset['DistanceBasis'] = resultset.FuelProgram.FuelCalculationDetails.FuelReefer.PricingUnitOfLengthMeasurementCode;
    }
    if (resultset.FuelProgram.FuelCalculationDetails.FuelReefer.PricingUnitOfVolumeMeasurementCode) {
      resultset['FuelQuantityBasis'] = resultset.FuelProgram.FuelCalculationDetails.FuelReefer.PricingUnitOfVolumeMeasurementCode;
    }
    resultset['DistancePerHour'] = resultset.FuelProgram.FuelCalculationDetails.FuelReefer.DistancePerHourQuantity;
    resultset['DistanceRoundType'] = resultset.FuelProgram.FuelCalculationDetails.FuelReefer.TravelTimeHourRoundingTypeName;
    resultset['BurnRatePerHour'] = resultset.FuelProgram.FuelCalculationDetails.FuelReefer.BurnRatePerHourQuantity;
    resultset['Loading/UnloadingHour'] = resultset.FuelProgram.FuelCalculationDetails.FuelReefer.LoadUnloadHourQuantity;
    resultset['ServiceHourAddon'] = resultset.FuelProgram.FuelCalculationDetails.FuelReefer.ServiceHourAddonQuantity;
    resultset['AddHourAfterDistance'] = resultset.FuelProgram.FuelCalculationDetails.FuelReefer.ServiceHourAddonDistanceQuantity;
    resultset['ServiceHourRoundType'] = resultset.FuelProgram.FuelCalculationDetails.FuelReefer.ServiceHourRoundingTypeName;
  }
  loadGridData(event: Event) {
    if (event && this.fuelModel.fuelList && this.fuelModel.fuelList.length) {
      const elasticQuery = this.fuelService.getElasticparam();
      elasticQuery['size'] = event['rows'];
      elasticQuery['from'] = event['first'];
      this.fuelModel.tableSize = event['rows'];
      this.sortGridData(elasticQuery, event);
      this.fuelService.setElasticparam(elasticQuery);
      this.fuelModel.loading = true;
    }
    this.loadFuelProgramRecords();
  }
  getFieldArrayList(resultSet, property) {
    let resultList = [];
    if (!utils.isEmpty(resultSet)) {
      resultSet.forEach(
        (response) => {
          const value = response[property];
          if (value !== null) { resultList.push(value.trim()); }
        });
    }
    resultList = utils.uniq(resultList);
    return resultList;
  }
  displayCodes(value) {
    if (value.length > 2) {
      const selectedField = utils.slice(value, 0, 2);
      const length = value.length - 2;
      return utils.concat(selectedField, `${length} More`);
    } else {
      return value;
    }
  }

  getGridValues(event: Event) {
    this.fuelModel.searchFlag = true;
    const enteredValue = (event.target && event.target['value']) ? event.target['value'] : '';
    const datePat = /^(\d{2,2})(\/)(\d{2,2})\2(\d{4}|\d{4})$/;
    const matchArray = enteredValue.match(datePat);
    const currentQuery = this.fuelService.getElasticparam();
    if (enteredValue !== '') {
      currentQuery['from'] = 0;
    }
    if (matchArray !== null && Array.isArray(matchArray) && moment(enteredValue).isValid()) {
      this.frameDateSearchQuery(currentQuery, enteredValue);
    } else {
      this.frameSearchQuery(currentQuery, enteredValue);
    }
    this.fuelService.setElasticparam(currentQuery);
    this.fuelModel.loading = true;
    this.fuelTable.reset();
  }
  frameSearchQuery(currentQuery: any, enteredValue: string) {
    enteredValue = enteredValue.replace(/[!?:\\[" '^~=\//\\{}&&||<>()+*\]-]/g, '\\$&');
    currentQuery['query']['bool']['must'][2]['bool']['should'] = [];
    currentQuery['query']['bool']['must'][2]['bool']['should'] = FuelProgramQuery.defaultSearchQuery();
    utils.forEach(currentQuery['query']['bool']['must'][2]['bool']['should'], (shouldQuery) => {
      if (shouldQuery['nested']) {
        if (shouldQuery['nested']['query']['nested']) {
          shouldQuery['nested']['query']['nested']['query']['query_string']['query'] = `*${enteredValue}*`;
        } else {
          shouldQuery['nested']['query']['query_string']['query'] = `*${enteredValue}*`;
        }
      } else {
        shouldQuery['query_string']['query'] = `*${enteredValue}*`;
      }
    });
  }
  frameDateSearchQuery(currentQuery: any, enteredValue: string) {
    currentQuery['query']['bool']['must'][2]['bool']['should'] = [];
    currentQuery['query']['bool']['must'][2]['bool']['should'] = FuelProgramQuery.dateSearchQuery();
    const createdDate = 'FuelProgram.CreatedDate';
    const lastUpdateDate = 'FuelProgram.LastUpdateDate';
    utils.forEach(currentQuery['query']['bool']['must'][2]['bool']['should'], (shouldQuery) => {
      if (shouldQuery['range'] && shouldQuery['range']['EffectiveDate']) {
        shouldQuery['range']['EffectiveDate']['gte'] = enteredValue;
        shouldQuery['range']['EffectiveDate']['lte'] = enteredValue;
      }
      if (shouldQuery['range'] && shouldQuery['range']['ExpirationDate']) {
        shouldQuery['range']['ExpirationDate']['gte'] = enteredValue;
        shouldQuery['range']['ExpirationDate']['lte'] = enteredValue;
      }
      if (shouldQuery['nested'] && shouldQuery['nested']['query']['range'][createdDate]) {
        shouldQuery['nested']['query']['range'][createdDate]['gte'] = enteredValue;
        shouldQuery['nested']['query']['range'][createdDate]['lte'] = enteredValue;
      }
      if (shouldQuery['nested'] && shouldQuery['nested']['query']['range'][lastUpdateDate]) {
        shouldQuery['nested']['query']['range'][lastUpdateDate]['gte'] = enteredValue;
        shouldQuery['nested']['query']['range'][lastUpdateDate]['lte'] = enteredValue;
      }
    });
  }

  sortGridData(elasticQuery: object, event: Event) {
    if (event && event['sortField'] && event['sortOrder']) {
      const field = this.fuelModel.getFieldNames[event['sortField']];
      const rootVal = this.fuelModel.getNestedRootVal[event['sortField']];
      elasticQuery['sort'] = [];
      elasticQuery['sort'][0] = {};
      elasticQuery['sort'][0][field] = {};
      elasticQuery['sort'][0][field]['order'] = event['sortOrder'] === 1 ? 'asc' : 'desc';
      elasticQuery['sort'][0][field]['missing'] = event['sortOrder'] === -1 ? '_first' : '_last';
      if (rootVal) {
        elasticQuery['sort'][0][field]['nested_path'] = rootVal;
        elasticQuery['sort'][0][field]['mode'] = 'min';
      }
      this.distanceQuantityBasisSort(elasticQuery, event);
    }
  }

  getMockJson() {
    this.fuelService.getMockJson().pipe(takeWhile(() =>
      this.fuelModel.isSubscribe)).subscribe((data: QueryMock) => {
        this.fuelModel.sourceData = data;
      });
  }

  distanceQuantityBasisSort(elasticQuery: object, event: Event) {
    let rootVal;
    switch (event['sortField']) {
      case 'Fuel Quantity Basis':
        this.sortScriptFramer(elasticQuery, this.fuelModel.sourceData.sortQuantityBasis, 'string', event);
        break;
      case 'Distance Basis':
        this.sortScriptFramer(elasticQuery, this.fuelModel.sourceData.sortDistanceBasis, 'string', event);

        break;
      case 'Bill to Account':
        rootVal = 'BillToAccountAssociations';
        this.sortQueryFramer(elasticQuery,
          'BillToAccountAssociations.BillingPartyCode.raw', event, rootVal);
        break;
      case 'Charge Type':
        this.sortQueryFramer(elasticQuery,
          'FuelProgram.FuelCalculationDetails.ChargeTypeCode.raw', event, rootVal);
        break;
      case 'Implementation Price':
        this.sortScriptFramer(elasticQuery, this.fuelModel.sourceData.sortImplementationAmount, 'number', event);
        break;
      case 'Created By':
        rootVal = 'FuelProgram';
        this.sortQueryFramer(elasticQuery,
          'FuelProgram.CreateUserID.keyword', event, rootVal);
        break;
      case 'Updated By':
        rootVal = 'FuelProgram';
        this.sortQueryFramer(elasticQuery,
          'FuelProgram.LastUpdateUserID.keyword', event, rootVal);
        break;
      case 'Distance Per Hour':
        this.sortScriptFramer(elasticQuery, this.fuelModel.sourceData.sortDistancePerHourQuantity, 'number', event);
        rootVal = 'FuelProgram';
        this.sortQueryFramer(elasticQuery,
          'FuelProgram.FuelCalculationDetails.FuelReefer.PricingUnitOfLengthMeasurementCode.raw', event, rootVal);
        break;
      case 'Add Hour After Distance':
        this.sortScriptFramer(elasticQuery, this.fuelModel.sourceData.sortServiceHourAddonDistanceQuantity, 'number', event);
        rootVal = 'FuelProgram';
        this.sortQueryFramer(elasticQuery, 'FuelProgram.FuelCalculationDetails.FuelReefer.PricingUnitOfLengthMeasurementCode.raw',
          event, rootVal);
        break;
      default:
        break;
    }
  }
  sortScriptFramer(elasticQuery: object, data: any, type: string, event: Event) {
    elasticQuery['sort'] = [];
    elasticQuery['sort'][0] = {
      '_script': {
        'script': {
          'lang': 'painless',
          'source': data
        },
        'order': 'asc',
        'type': type
      }
    };
    elasticQuery['sort'][0]['_script']['order'] = event['sortOrder'] === 1 ? 'asc' : 'desc';
  }
  sortQueryFramer(elasticQuery: object, field: string, event: Event, rootVal: string) {
    elasticQuery['sort'][1] = {};
    elasticQuery['sort'][1][field] = {};
    elasticQuery['sort'][1][field]['order'] = event['sortOrder'] === 1 ? 'asc' : 'desc';
    elasticQuery['sort'][1][field]['missing'] = event['sortOrder'] === -1 ? '_first' : '_last';
    elasticQuery['sort'][1][field]['nested_path'] = rootVal;
    elasticQuery['sort'][1][field]['mode'] = 'min';
  }
  getAgreementId() {
    this.fuelModel.loading = true;
    this.route.queryParams.subscribe((params: Params) => {
      this.fuelModel.agreementId = params['id'];
      const currentQuery = FuelProgramQuery.getFuelProgramQuery(this.fuelModel.agreementId);
      this.fuelService.setElasticparam(currentQuery);
      this.loadFuelProgramRecords();
    });
  }
  onCreateFuel() {
    this.router.navigate(['/viewagreement/fuel'], { queryParams: { id: this.fuelModel.agreementId } });
  }
  toastMessage(key: string, data: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? 'Error' : 'Success',
      detail: data
    };
    this.messageService.clear();
    this.messageService.add(message);
  }
  onRowSelect(event) {
    const programId = event['data']['FuelProgram']['FuelProgramID'];
    if (event.type === 'row') {
      this.router.navigate(['/viewagreement/fuel-details-view'], { queryParams: { id: programId } });
    }
  }
}
