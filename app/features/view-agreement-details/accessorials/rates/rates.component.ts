import { Table } from 'primeng/table';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router, Event } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { CurrencyPipe } from '@angular/common';
import { MessageService } from 'primeng/components/common/messageservice';
import * as moment from 'moment';

import * as utils from 'lodash';


import { RateModel } from './model/rate-model';
import { RateViewService } from './services/rate-view.service';
import { RateViewQuery } from './query/rate-view.query';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatesComponent implements OnInit {

  rateModel: RateModel;
  @ViewChild('dt') dataTable: Table;
  @Input() agreementID;
  constructor(
    private readonly router: Router,
    private readonly rateViewService: RateViewService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly messageService: MessageService,
    private readonly currencyPipe: CurrencyPipe,
    private readonly shared: BroadcasterService) {
    this.rateModel = new RateModel();
  }
  ngOnInit() {
    this.getGridValues(null, '');
  }
  onRowSelect(event: Event) {
    if (event['type'] !== 'checkbox') {
      this.shared.broadcast('rateDetailedViewConfigurationId', event['data']['customerAccessorialRateConfigurationId']);
      this.router.navigate(['/viewagreement/ratesdetailedview'], { queryParams: { id: this.agreementID } });
    }
  }

  getGridValues(rateQuery: object, event) {
    const params = RateViewQuery.getRateGridQuery(rateQuery, this.agreementID);
    this.sortClick(event, params);
    this.rateModel.loading = true;
    this.rateViewService.getRateData(params)
      .pipe(takeWhile(() => this.rateModel.isSubscribeFlag)).subscribe((data) => {
        if (!utils.isEmpty(data && data['hits']['hits'])) {
          const rateArray = [];
          data['hits']['hits'].forEach(value => {
            this.rateModel.dataFlag = true;
            this.rateModel.loading = false;
            rateArray.push(this.dataFramer(value['_source'], value['inner_hits']));
            this.rateModel.gridDataLength = data['hits']['total'];
          });
          this.rateModel.rateListValues = rateArray;
        } else {
          this.rateModel.rateListValues = [];
          this.rateModel.loading = false;
          this.rateModel.dataFlag = false;
        }
        this.changeDetector.markForCheck();
      }, (error: Error) => {
        if (error && error['error'] && error['error']['errors']) {
          this.toastMessage(this.messageService, 'error', 'Error', error['error']['errors'][0]['errorMessage']);
          this.rateModel.loading = false;
        } else {
          this.rateModel.loading = false;
        }
        this.rateModel.rateListValues = [];
        this.changeDetector.markForCheck();
      });

  }
  loadGridData(event: Event) {
    if (event && this.rateModel.rateListValues.length) {
      this.rateModel.timeDelay = 0;
      this.rateModel.filterDetails['size'] = event['rows'];
      this.rateModel.filterDetails['from'] = event['first'];
      this.rateModel.tableSize = event['rows'];
    }
  }
  onPage() {
    this.getGridValues(this.rateModel.filterDetails, '');
  }
  onSort(event) {
    this.getGridValues(this.rateModel.filterDetails, event);
  }
  onCreateRateSetup() {
    this.shared.broadcast('editAccesorialRates', {
      editRateData: null,
      isAccessorialRateEdit: false,
      refreshDocumentResponse: null,
      rateConfigurationId: null
    });
    this.router.navigate(['/viewagreement/rates'], { queryParams: { id: this.agreementID } });
  }
  dataFramer(data: object, nestedData: object) {
    const rateObj = {};
    const dateFormat = 'MM/DD/YYYY';
    rateObj['chargeType'] = `${data['chargeTypeName']}`;
    rateObj['effectiveDate'] = moment(data['effectiveDate']).format(dateFormat);
    rateObj['expirationDate'] =
      moment(data['expirationDate']).format(dateFormat);
    rateObj['customerName'] = data['customerChargeName'];
    rateObj['equipmentCategory'] = data['equipmentClassificationCode'];
    rateObj['equipmentType'] = data['equipmentClassificationTypeAssociationCode'];
    rateObj['equipmentLength'] = data['equipmentLengthDescription'];
    rateObj['section'] = this.sectionFramer(data['customerAccessorialAccounts']);
    rateObj['contract'] = this.contractFramer(data['customerAccessorialAccounts']);
    rateObj['billToAccounts'] = this.billToFramer(data['customerAccessorialAccounts']);
    rateObj['currency'] = data['currencyCode'];
    this.rateFramer(data, rateObj);
    this.stairStepFramer(data, rateObj);
    rateObj['alternateCharge'] = this.alternateFramer(data['customerAccessorialRateAlternateCharge']);
    rateObj['additionalCharge'] = this.additionalFramer(data['customerAccessorialRateAdditionalCharges']);
    rateObj['creationDate'] = moment(data['createdDate']).format(dateFormat);
    rateObj['createdBy'] = data['createdBy'];
    rateObj['lastUpdatedDate'] = data['lastUpdatedDate'] ? moment(data['lastUpdatedDate']).format(dateFormat) : data['lastUpdatedDate'];
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
    rateObj['instructional'] = data['documentInstructionalDescription'];
    rateObj['attachments'] = data['documentFileNames'];
    rateObj['hasAttachment'] = data['documentFileNames'] ? data['documentFileNames'].length ? 'Yes' : 'No' : 'No';
    rateObj['customerAccessorialRateConfigurationId'] = data['customerAccessorialRateConfigurationId'];
    return rateObj;
  }
  contractFramer(contractValues: Array<object>) {
    let contractArray = [];
    if (contractValues) {
      for (const value of contractValues) {
        if (value['customerAgreementContractNumber']) {
          contractArray.push(value['customerAgreementContractName']);
        } else if (value['customerAgreementContractName']) {
          contractArray.push(value['customerAgreementContractName']);
        }
      }
    }
    contractArray = utils.uniq(contractArray);
    contractArray.sort(function (element, value) {
      return element.toLowerCase().localeCompare(value.toLowerCase());
    });
    return contractArray;
  }

  billToFramer(accountValues: Array<object>) {
    let billtoArray = [];
    if (accountValues) {
      for (const value of accountValues) {
        if (value['customerAgreementContractSectionAccountName']) {
          billtoArray.push(value['customerAgreementContractSectionAccountName']);
        }
      }
    }
    billtoArray = utils.uniq(billtoArray);
    billtoArray.sort(function (element, value) {
      return element.toLowerCase().localeCompare(value.toLowerCase());
    });
    return billtoArray;
  }
  sectionFramer(contractValues: Array<object>) {
    let contractArray = [];
    if (contractValues) {
      for (const value of contractValues) {
        if (value['customerAgreementContractSectionName']) {
          contractArray.push(value['customerAgreementContractSectionName']);
        }
      }
    }
    contractArray = utils.uniq(contractArray);
    contractArray.sort(function (element, value) {
      return element.toLowerCase().localeCompare(value.toLowerCase());
    });
    return contractArray;
  }
  checkStringValue(value: any) {
    return (value) ? value : '--';
  }
  checkIntegerValue(value: any) {
    return (value || value === 0) ? this.currencyPipe.transform(value, 'USD', 'symbol', '1.2-4') : '--';
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
        businessArray.push(value['businessUnitDisplayName'] ?
          value['businessUnitDisplayName'] : '--');
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
    if (event && event['field'] && event['order'] && this.rateModel.sortColumns[event['field']]) {
      this.sortClickWithEvent(event, elasticQuery);
    } else {
      this.sortCilckwithoutEvent(elasticQuery);
    }
  }
  sortClickWithEvent(event: Event, elasticQuery: object) {
    elasticQuery['sort'] = [];
    const field = this.rateModel.sortColumns[event['field']];
    const rootVal = this.rateModel.nestedColumns[event['field']];
    if (this.rateModel.nestedObject[event['field']]) {
      this.queryFramer(event, field, rootVal, elasticQuery);
    }
    elasticQuery['sort'][0] = {};
    elasticQuery['sort'][0][field] = {};
    elasticQuery['sort'][0][field]['order'] = event['order'] === 1 ? 'asc' : 'desc';
    elasticQuery['sort'][0][field]['missing'] = event['order'] === 1 ? '_first' : '_last';
    this.rateModel.sortValuesort = elasticQuery['sort'];
    elasticQuery['sort'][0][field]['nested'] = {};
    elasticQuery['sort'][0][field]['nested']['path'] = rootVal;
    elasticQuery['sort'][0][field]['mode'] = 'min';
    this.rateModel.sortValuesort = elasticQuery['sort'][0];
  }
  sortCilckwithoutEvent(elasticQuery) {
    elasticQuery['sort'] = [];
    if (this.rateModel.sortValuesort) {
      elasticQuery['sort'] = this.rateModel.sortValuesort;
      if (this.rateModel.sortValueobj) {
        elasticQuery['query']['bool']['should'].push(this.rateModel.sortValueobj);
      }
    }
  }
  queryFramer(event: Event, field: string, rootVal: string, elasticQuery: object) {
    const obj = {};
    obj['nested'] = {};
    obj['nested']['path'] = rootVal;
    obj['nested']['query'] = {};
    obj['nested']['query']['query_string'] = {};
    obj['nested']['query']['query_string']['default_field'] = this.rateModel.nestedObject[event['field']];
    obj['nested']['query']['query_string']['query'] = '*';
    obj['nested']['inner_hits'] = {};
    obj['nested']['inner_hits']['sort'] = [];
    obj['nested']['inner_hits']['sort'][0] = {};
    obj['nested']['inner_hits']['sort'][0][field] = {};
    obj['nested']['inner_hits']['sort'][0][field]['order']
      = event['order'] === 1 ? 'asc' : 'desc';
    obj['nested']['inner_hits']['sort'][0][field]['missing']
      = event['order'] === 1 ? '_first' : '_last';
    elasticQuery['query']['bool']['should'].push(obj);
    this.rateModel.sortValueobj = obj;
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
  onFilterClick() {
    this.rateModel.filterFlag = !this.rateModel.filterFlag;
    this.rateModel.isFilterEnabled = !this.rateModel.isFilterEnabled;
  }
  loadGridBasedOnFilter(event) {
    this.rateModel.first = 0;
    this.dataTable.reset();
    this.rateModel.filterNoresultFlag = true;
    this.rateModel.filterDetails['from'] = 0;
    this.rateModel.filterDetails['size'] = 25;
    this.effectiveDateFramer(event);
    this.expirationDateFramer(event);
    this.getGridValues(this.rateModel.filterDetails, '');
  }
  effectiveDateFramer(event) {
    if (event && event['effectiveDate'] && event['effectiveDate']['type']) {
      switch (event['effectiveDate']['type']) {
        case 'effectiveDateRange':
        case 'effectiveExactMatch':
          this.rateModel.filterDetails['effectiveDateStart'] = event['effectiveDate']['lte'];
          this.rateModel.filterDetails['effectiveDateEnd'] = event['effectiveDate']['gte'];
          this.rateModel.filterDetails['effectiveType'] = event['effectiveDate']['type'];
          break;
        case 'effectiveNonMatch':
          this.rateModel.filterDetails['effectiveType'] = event['effectiveDate']['type'];
          this.rateModel.filterDetails['effectiveNonMatchDate'] = event['effectiveDate']['lte'];
          this.rateModel.filterDetails['effectiveDateStart'] = event['effectiveDate']['lte'];
          this.rateModel.filterDetails['effectiveDateEnd'] = this.rateModel.expireDateEnd;
          break;
        default:
          break;
      }
    } else {
      this.rateModel.filterDetails['effectiveDateEnd'] = this.rateModel.expireDateEnd;
      this.rateModel.filterDetails['effectiveDateStart'] = this.rateModel.expireDateStart;
      this.rateModel.filterDetails['effectiveType'] = '*';
    }
  }
  expirationDateFramer(event) {
    if (event && event['expirationDate'] && event['expirationDate']['type']) {
      if (event['expirationDate']['type'] === 'expirationExactMatch' ||
        event['expirationDate']['type'] === 'expirationDateRange') {
        this.rateModel.filterDetails['expireDateStart'] = event['expirationDate']['lte'];
        this.rateModel.filterDetails['expireDateEnd'] = event['expirationDate']['gte'];
        this.rateModel.filterDetails['expirationType'] = event['expirationDate']['type'];
      } else if (event['expirationDate']['type'] === 'expirationNonMatch') {
        this.rateModel.filterDetails['expirationType'] = event['expirationDate']['type'];
        this.rateModel.filterDetails['expirationNonMatchDate'] = event['expirationDate']['lte'];
        this.rateModel.filterDetails['expireDateStart'] = this.rateModel.expireDateStart;
        this.rateModel.filterDetails['expireDateEnd'] = event['expirationDate']['lte'];
      }
    } else {
      this.rateModel.filterDetails['expireDateEnd'] = this.rateModel.expireDateEnd;
      this.rateModel.filterDetails['expireDateStart'] = this.rateModel.expireDateStart;
      this.rateModel.filterDetails['expirationType'] = '*';
    }
  }
}
