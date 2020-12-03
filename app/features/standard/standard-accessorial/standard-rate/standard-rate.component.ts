import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Router, Event } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { CurrencyPipe } from '@angular/common';
import { MessageService } from 'primeng/components/common/messageservice';
import * as moment from 'moment';

import * as utils from 'lodash';
import { StandardRateModel } from './model/standard-rate.model';
import { StandardRateService } from './service/standard-rate.service';
import { StandardRateViewQuery } from './query/standard-rate.query';

@Component({
  selector: 'app-standard-rate',
  templateUrl: './standard-rate.component.html',
  styleUrls: ['./standard-rate.component.scss']
})
export class StandardRateComponent implements OnInit, OnDestroy {

  standardRateModel: StandardRateModel;
  constructor(
    private readonly router: Router,
    private readonly standardRateService: StandardRateService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly messageService: MessageService,
    private readonly currencyPipe: CurrencyPipe) {
    this.standardRateModel = new StandardRateModel();
  }
  ngOnInit() {
    this.getGridValues(null, null);
  }
  ngOnDestroy() {
    this.standardRateModel.isSubscribeFlag = false;
  }

  getGridValues(rateQuery: object, event: Event, searchText?: string) {
    let flag = false;
    if (rateQuery && rateQuery['search']) {
      flag = true;
    }
    const params = StandardRateViewQuery.getRateGridQuery(rateQuery, searchText);
    this.sortClick(event, params);
    this.standardRateModel.loading = true;
    this.standardRateService.getRateData(params)
      .pipe(takeWhile(() => this.standardRateModel.isSubscribeFlag)).subscribe((data) => {
        this.standardRateModel.rateListValues = [];
        if (!utils.isEmpty(data && data['hits']['hits'])) {
          const gridData = [];
          data['hits']['hits'].forEach(value => {
            this.standardRateModel.dataFlag = true;
            this.standardRateModel.paginatorFlag = true;
            this.standardRateModel.searchFlag = false;
            this.standardRateModel.loading = false;
            gridData.push(this.dataFramer(value['_source'], value['inner_hits']));
            this.standardRateModel.gridDataLength = data['hits']['total'];
          });
          this.standardRateModel.rateListValues = gridData;
        } else {
          this.standardRateModel.loading = false;
          this.standardRateModel.dataFlag = false;
          this.standardRateModel.searchFlag = flag;
          this.standardRateModel.paginatorFlag = false;
        }
        this.changeDetector.markForCheck();
      }, (error: Error) => {
        if (error && error['error'] && error['error']['errors']) {
          this.toastMessage(this.messageService, 'error', 'Error', error['error']['errors'][0]['errorMessage']);
          this.standardRateModel.loading = false;
        } else {
          this.standardRateModel.loading = false;
        }
        this.changeDetector.markForCheck();
      });

  }
  searchGridRecords(event: Event) {
    if (event) {
      this.standardRateModel.searchText = event['target']['value'];
      const rateQuery = {};
      rateQuery['size'] = 25;
      rateQuery['from'] = 0;
      rateQuery['search'] = true;
      this.getGridValues(rateQuery, null, this.standardRateModel.searchText);
      this.changeDetector.detectChanges();
    }
  }
  loadGridData(event: Event) {
    if (event && this.standardRateModel.dataFlag) {
      const rateQuery = {};
      rateQuery['size'] = event['rows'];
      rateQuery['from'] = event['first'];
      this.standardRateModel.tableSize = event['rows'];
      this.getGridValues(rateQuery, event, this.standardRateModel.searchText);
      this.changeDetector.detectChanges();
    }
  }
  dataFramer(data: object, nestedData: object) {
    const rateObj = {};
    rateObj['chargeType'] = data['chargeTypeName'];
    rateObj['effectiveDate'] = moment(data['effectiveDate']).format('MM/DD/YYYY') ;
    rateObj['expirationDate'] =
    moment(data['expirationDate']).format('MM/DD/YYYY') ;
    rateObj['customerName'] = data['customerChargeName'];
    rateObj['equipmentCategory'] = data['equipmentClassificationCode'];
    rateObj['equipmentType'] = data['equipmentClassificationTypeAssociationCode'];
    rateObj['equipmentLength'] = data['equipmentLengthDescription'];
    rateObj['currency'] = data['currencyCode'];
    this.rateFramer(data, rateObj);
    this.stairStepFramer(data, rateObj);
    rateObj['alternateCharge'] = this.alternateFramer(data['customerAccessorialRateAlternateCharge']);
    rateObj['additionalCharge'] = this.additionalFramer(data['customerAccessorialRateAdditionalCharges']);
    rateObj['creationDate'] = data['createdDate'];
    rateObj['createdBy'] = data['createdBy'];
    rateObj['lastUpdatedDate'] = data['lastUpdatedDate'];
    rateObj['lastUpdatedBy'] = data['lastUpdatedBy'];
    rateObj['businessService'] = this.businessFramer(data['customerAccessorialServiceLevelBusinessUnitServiceOfferings']);
    rateObj['carrier'] = this.carrierFramer(data['customerAccessorialCarriers']);
    rateObj['waived'] = data['waived'] ? 'Yes' : 'No';
    rateObj['calculateRate'] = data['calculateRateManually'] ? 'Yes' : 'No';
    rateObj['passThrough'] = data['passThrough'] ? 'Yes' : 'No';
    rateObj['rateSetup'] = data['rateSetupStatus'] ? 'Yes' : 'No';
    rateObj['serviceLevel'] = this.serviceLevelFramer(data['customerAccessorialServiceLevelBusinessUnitServiceOfferings']);
    rateObj['requestedService'] = this.requestedServiceFramer(data['customerAccessorialRequestServices']);
    rateObj['legal'] = data['documentLegalDescription'];
    rateObj['accessorialGroupTypeName'] = data['accessorialGroupTypeName'];
    rateObj['instructional'] = data['documentInstructionalDescription'];
    rateObj['attachments'] = data['documentFileNames'];
    rateObj['hasAttachment'] = data['hasAttachment'] ? 'Yes' : 'No';
    return rateObj;
  }
  checkStringValue(value: any) {
    return (value) ? value : '--';
  }
  checkIntegerValue(value: any) {
    return (value || value === 0) ?  this.currencyPipe.transform(value, 'USD', 'symbol', '1.2-4') : '--';
  }
  stairStepFramer(rateValues: object, rateObj: object) {
    rateObj['stepRateAmount'] = [];
    rateObj['fromQuantity'] = [];
    rateObj['toQuantity'] = [];
    if (rateValues['customerAccessorialRateStairStepCharge']) {
      const stairRateDTO = rateValues['customerAccessorialRateStairStepCharge'];
      rateObj['stepItemizedRates'] = (this.itemizeFramer(rateValues['rateItemizeIndicator']));
      this.commanStairStepFramer(stairRateDTO, rateObj);
    }
  }
  commanStairStepFramer(stairRateDTO: object, rateObj: object) {
    rateObj['stepRateType'] = this.checkStringValue(stairRateDTO['accessorialRateTypeName']);
    rateObj['stepRounding'] = this.checkStringValue(stairRateDTO['accessorialRateRoundingTypeName']);
    rateObj['stepMinimunAmount'] = stairRateDTO['minimumAmountDisplayName'] ? stairRateDTO['minimumAmountDisplayName'] : '--';
    rateObj['stepMaximunAmount'] = stairRateDTO['maximumAmountDisplayName'] ? stairRateDTO['maximumAmountDisplayName'] : '--';
    rateObj['maximumApplied'] = this.checkStringValue(stairRateDTO['accessorialMaximumRateApplyTypeName']);

    if (stairRateDTO['customerAccessorialRateStairSteps']) {
      for (const dataVal of stairRateDTO['customerAccessorialRateStairSteps']) {
        rateObj['stepRateAmount'].push(dataVal['stairStepRateAmountDisplayName'] ? dataVal['stairStepRateAmountDisplayName'] : '--');
        rateObj['fromQuantity'].push(dataVal['fromQuantity'] === null ? '--' : dataVal['fromQuantity']);
        rateObj['toQuantity'].push(dataVal['toQuantity'] === null ? '--' : dataVal['toQuantity']);
      }
    }
  }

  rateFramer(rateValues: object, rateObj: object) {
    rateObj['rateType'] = [];
    rateObj['rateAmount'] = [];
    rateObj['itemizedRates'] = [];
    rateObj['minimumAmount'] = [];
    rateObj['maximumAmount'] = [];
    rateObj['rounding'] = [];
    rateObj['rateOperator'] = [];
    if (rateValues['customerAccessorialRateCharges']) {
      for (const dataVal of rateValues['customerAccessorialRateCharges']) {
        rateObj['rateType'].push(dataVal['accessorialRateTypeName'] ? dataVal['accessorialRateTypeName'] : '--');
        rateObj['rateAmount'].push(dataVal['rateAmountDisplayName'] ?
        dataVal['rateAmountDisplayName'] : '--');
        rateObj['itemizedRates'].push(this.itemizeFramer(rateValues['rateItemizeIndicator']));
        this.rateObjectFramer(rateObj, dataVal);
      }
    }
  }

  businessFramer(rateData: Array<object>) {
    let businessArray = [];
    if (rateData) {
      rateData.forEach(value => {
        businessArray.push(value['businessUnit'] ?
          `${value['businessUnit']}-${value['serviceOffering']}` : '--');
      });
    }
    businessArray = utils.uniq(businessArray);
    businessArray.sort(function (element, value) {
      return element.toLowerCase().localeCompare(value.toLowerCase());
  });
    return businessArray;
  }
  rateObjectFramer(rateObj: object, dataVal: object) {
    rateObj['minimumAmount'].push(dataVal['minimumAmountDisplayName'] || dataVal['minimumAmountDisplayName'] === 0 ?
    dataVal['minimumAmountDisplayName'] : '--');
    rateObj['maximumAmount'].push(dataVal['maximumAmountDisplayName'] || dataVal['maximumAmountDisplayName'] === 0 ?
    dataVal['maximumAmountDisplayName'] : '--');
    rateObj['rounding'].push(dataVal['accessorialRateRoundingTypeName'] ? dataVal['accessorialRateRoundingTypeName'] : '--');
    rateObj['rateOperator'].push(dataVal['rateOperator'] ? dataVal['rateOperator'] : '--');
  }
  itemizeFramer(value) {
    let flag = '--';
    if (value === '1') {
      flag = 'Yes';
    } else if (value === '0') {
      flag = 'No';
    }
    return flag;
  }
  additionalFramer(dataValues: Array<object>) {
    const rateArray = [];
    if (dataValues) {
      for (const dataVal of dataValues) {
        const obj = {};
        obj['additionalCharge'] = `${dataVal['additionalChargeTypeName']} ${'('}${(dataVal['additionalChargeCodeName'])} ${')'}`;
        obj['additionalRateType'] = dataVal['accessorialRateTypeName'];
        obj['additionalRateAmount'] = this.currencyPipe.transform(dataVal['additionalRateAmount'], 'USD', 'symbol', '1.2-4');
        rateArray.push(obj);
      }
    }
    return rateArray;
  }
  serviceLevelFramer(data: Array<object>) {
    let serviceArray = [];
    if (data) {
      for (const dataVal of data) {
        serviceArray.push(dataVal['serviceLevel'] ? `${dataVal['serviceLevel']}${' '}` : '--');
      }
    }
    serviceArray = utils.uniq(serviceArray);
    serviceArray.sort(function (element, value) {
      return element.toLowerCase().localeCompare(value.toLowerCase());
  });
    return serviceArray;
  }
  requestedServiceFramer(data: Array<object>) {
    const serviceArray = [];
    if (data) {
      for (const dataValues of data) {
        serviceArray.push(dataValues['requestedServiceTypeCode'] ? dataValues['requestedServiceTypeCode'] : '--');
      }
    }
    serviceArray.sort(function (element, value) {
      return element.toLowerCase().localeCompare(value.toLowerCase());
  });
    return serviceArray;
  }
  carrierFramer(data: Array<object>) {
    const carrierData = [];
    if (data) {
      for (const value of data) {
        carrierData.push(`${value['carrierName']}(${value['carrierCode']})`);
      }
    }
    carrierData.sort(function (element, value) {
      return element.toLowerCase().localeCompare(value.toLowerCase());
  });
    return carrierData;
  }
  alternateFramer(data: object) {
    const obj = {};
    const alternateArray = [];
    obj['accessorialRateAlternateChargeQuantityTypeName'] = data && data['accessorialRateAlternateChargeQuantityTypeName'] ?
      data['accessorialRateAlternateChargeQuantityTypeName'] : '--';
    obj['customerAlternateChargeThresholdQuantity'] = data && data['customerAlternateChargeThresholdQuantity'] ?
      data['customerAlternateChargeThresholdQuantity'] : '--';
    obj['alternateChargeTypeName'] = data && data['alternateChargeTypeName'] ? data['alternateChargeTypeName'] : '--';
    alternateArray.push(obj);
    return alternateArray;
  }
  sortClick(event: Event, elasticQuery: object) {
    if (event && event['sortField'] && event['sortOrder'] && this.standardRateModel.sortColumns[event['sortField']]) {
      const field = this.standardRateModel.sortColumns[event['sortField']];
      const rootVal = this.standardRateModel.nestedColumns[event['sortField']];
      if (this.standardRateModel.nestedObject[event['sortField']]) {
        this.queryFramer(event, field, rootVal, elasticQuery);
      }

      elasticQuery['sort'] = [];
      elasticQuery['sort'][0] = {};
      elasticQuery['sort'][0][field] = {};
      elasticQuery['sort'][0][field]['order'] = event['sortOrder'] === 1 ? 'asc' : 'desc';
      elasticQuery['sort'][0][field]['missing'] = event['sortOrder'] === 1 ? '_first' : '_last';
      if (rootVal) {
        elasticQuery['sort'][0][field]['nested'] = {};
        elasticQuery['sort'][0][field]['nested']['path'] = rootVal;
        elasticQuery['sort'][0][field]['mode'] = 'min';
      }
    }
  }
  queryFramer(event: Event, field: string, rootVal: string, elasticQuery: object) {
    const obj = {};
    obj['nested'] = {};
    obj['nested']['path'] = rootVal;
    obj['nested']['query'] = {};
    obj['nested']['query']['query_string'] = {};
    obj['nested']['query']['query_string']['default_field'] = this.standardRateModel.nestedObject[event['sortField']];
    obj['nested']['query']['query_string']['query'] = '*';
    obj['nested']['inner_hits'] = {};
    obj['nested']['inner_hits']['sort'] = [];
    obj['nested']['inner_hits']['sort'][0] = {};
    obj['nested']['inner_hits']['sort'][0][field] = {};
    obj['nested']['inner_hits']['sort'][0][field]['order']
      = event['sortOrder'] === 1 ? 'asc' : 'desc';
    obj['nested']['inner_hits']['sort'][0][field]['missing']
      = event['sortOrder'] === 1 ? '_first' : '_last';
    elasticQuery['query']['bool']['should'].push(obj);
  }
  toastMessage(messageService: MessageService, severityType: string, title: string, messageDetail: string) {
    const message = {
      severity: severityType,
      summary: title,
      detail: messageDetail
    };
    messageService.clear();
    messageService.add(message);
  }
  onCreateRateSetup() {
    this.router.navigateByUrl('/standard/rates');
  }
}

