import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as utils from 'lodash';
import * as moment from 'moment';

import { SettingsModel } from './../../models/settings.model';
import { ViewChargesModel } from './models/view-charges.model';
import { ViewChargesService } from './services/view-charges.service';
import { ViewChargesQueryService } from './services/view-charges-query.service';
import { takeWhile } from 'rxjs/operators';
import { RootObject } from './models/view-charges.interface';
import { ChargesModel } from './../models/charges.model';
import { MessageService } from 'primeng/components/common/messageservice';
import { ViewChargesQuery } from './query/view-charges.query';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-view-charges',
  templateUrl: './view-charges.component.html',
  styleUrls: ['./view-charges.component.scss']
})
export class ViewChargesComponent implements AfterViewInit, OnDestroy, OnInit {
  viewChargesModel: ViewChargesModel;

  @Input() settingsModel: SettingsModel;
  @Input() chargesModel: ChargesModel;
  @ViewChild('createCharges') createChargesRef: any;
  @ViewChild('chargeList') chargeListRef: any;
  serviceOfferingList: Array<string>;
  rateTypes: Array<string>;
  chargeUsageTypeList: Array<string>;
  screenHeight: any;
  chargeCodeSubscription: Subscription;
  constructor(private readonly viewChargeCodes: ViewChargesService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly messageService: MessageService) {
    this.serviceOfferingList = [];
    this.rateTypes = [];
    this.viewChargesModel = new ViewChargesModel();
  }

  ngOnInit() {
    ViewChargesQueryService.setElasticparam(
      ViewChargesQuery.getViewChargesQuery()
    );
    this.fetchChargeCodes();
    this.screenHeight = (window.innerHeight - 460) + 'px';
    this.viewChargesModel.isSplitView = false;
  }
  onResize() {
    this.screenHeight = (window.innerHeight - 460) + 'px';
  }
  ngAfterViewInit() {
    this.viewChargesModel.createChargesForm = this.createChargesRef.createChargesModel.createChargesForm;
  }
  ngOnDestroy() {
    this.viewChargesModel.subscriberFlag = false;
  }
  onClickCreateCharge() {
    if (this.viewChargesModel.isFilterEnabled) {
      this.onFilterClick();
    }
    this.viewChargesModel.isSplitView = true;
  }
  closeSplitView(event: Event) {
    this.viewChargesModel.isSplitView = false;
    this.viewChargesModel.showCreateButton = true;
    if (event) {
      this.viewChargesModel.sortDirection = 'asc';
      this.viewChargesModel.sortField = 'chargeIdentifier';
      this.viewChargesModel.pageNumber = 0;
      this.viewChargesModel.pageSize = 25;
      this.viewChargesModel.selectedPage = 0;
      this.fetchChargeCodes();
    }
  }
  loadGridData(event) {
     this.viewChargesModel.selectedChargeData = [];
    if (event && this.viewChargesModel.tableContent && this.viewChargesModel.tableContent.length) {
      const elasticQuery = ViewChargesQueryService.getElasticparam();
      elasticQuery['size'] = event['rows'];
      elasticQuery['from'] = event['first'];
      this.viewChargesModel.pageSize = event['rows'];
      this.sortGridData(elasticQuery, event);
      ViewChargesQueryService.setElasticparam(elasticQuery);
      this.fetchChargeCodes();
    }
  }
  sortGridData(elasticQuery, event) {
    if (event && event['sortField'] && event['sortOrder']) {
      const order = event['sortOrder'] === 1 ? 'asc' : 'desc';
      const sortnesteddadta = event['sortOrder'] === 1 ? '_first' : '_last';
      elasticQuery['sort'] = [];
      const field = this.viewChargesModel.getFieldNames[event['sortField']];
      elasticQuery['sort'] = [];
      elasticQuery['sort'][0] = {};
      elasticQuery['sort'][0][`${field}`] = {};
      elasticQuery['sort'][0][`${field}`]['order'] = order;
      elasticQuery['sort'][0][`${field}`]['missing'] = sortnesteddadta;
      if (event['sortField'] === 'Service Offering' ||
        event['sortField'] === 'Usage' || event['sortField'] === 'Rate Type') {
        elasticQuery['sort'][0][`${field}`]['nested_path'] = field ? field.split('.')[0] : '';
        elasticQuery['sort'][0][`${field}`]['mode'] = 'min';
      }
    }
  }
  onFilterClick() {
    this.viewChargesModel.filterFlag = !this.viewChargesModel.filterFlag;
    this.viewChargesModel.isSplitView = false;
    this.viewChargesModel.isFilterEnabled = !this.viewChargesModel.isFilterEnabled;
  }

  onRowSelect(event: Event) {
    if (event.type === 'row' && !utils.isEmpty(event['data'] && this.viewChargesModel.isFilterEnabled)) {
      this.onFilterClick();
    }
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
  onSearch(event: Event, keyName: string) {
    const enteredValue = event.target && event.target['value'] ? event.target['value'] : '';
    const currentQuery = ViewChargesQueryService.getElasticparam();
    const datePat = /^(\d{1,2})(\/)(\d{1,2})\2(\d{4}|\d{4})$/;
    const matchArray = enteredValue.match(datePat);
    const searchText = `*${enteredValue.replace(/[-!`?:\\['^~=\//\\{}(),.&&||<>"+*\]]/g, '\\$&')}*`;
    this.viewChargesModel.selectedChargeData = [];
    if (matchArray !== null && Array.isArray(matchArray) && moment(enteredValue).isValid()) {
      this.frameDateSearchQuery(enteredValue, currentQuery['query']['bool']['must'][1]['bool']['should']);
    } else if (currentQuery['query']['bool']['must'][1]['bool']['should'].length === 6) {
      currentQuery['query']['bool']['must'][1]['bool']['should'].pop();
      currentQuery['query']['bool']['must'][1]['bool']['should'].pop();
    }
    currentQuery['query']['bool']['must'][1]['bool']['should'][0]['query_string']['query'] = searchText;
    currentQuery['query']['bool']['must'][1]['bool']['should'][1]['nested']['query']
    ['bool']['must'][0]['query_string']['query'] = searchText;
    currentQuery['query']['bool']['must'][1]['bool']['should'][2]['nested']['query']['query_string']['query'] = searchText;
    currentQuery['query']['bool']['must'][1]['bool']['should'][3]['nested']['query']['query_string']['query'] = searchText;
    currentQuery['query']['bool']['must'][1]['bool']['should'][6]['query_string']['query'] = searchText;
    currentQuery['from'] = 0;
    this.chargeListRef.first = 0;
    this.fetchChargeCodes();
  }
  frameDateSearchQuery(enteredValue: string, query: RootObject) {
    query[4] = this.viewChargesModel.effectiveDateSearchQuery;
    query[5] = this.viewChargesModel.expirationDateSearchQuery;
    query[4].range['EffectiveDate'].gte = enteredValue;
    query[4].range['EffectiveDate'].lte = enteredValue;
    query[5].range['ExpirationDate'].gte = enteredValue;
    query[5].range['ExpirationDate'].lte = enteredValue;
  }
  getServiceOfferingList(chargeCode) {
    let serviceOfferingList = [];
    if (!utils.isEmpty(chargeCode.BusinessUnitServiceOfferings)) {
      chargeCode.BusinessUnitServiceOfferings.forEach(
        (chargeCodeServiceOffering) => {
          const serviceOffering = chargeCodeServiceOffering['BusinessUnitServiceOfferingName'];
          serviceOfferingList.push(serviceOffering);
        });
    }
    serviceOfferingList = utils.uniq(serviceOfferingList);
    return serviceOfferingList;
  }
  getRateTypes(chargeCode) {
    const rateTypes = [];
    if (!utils.isEmpty(chargeCode.RateTypes)) {
      chargeCode.RateTypes.forEach(rateType => {
        rateTypes.push(rateType.RateTypeName);
      });
    }
    return utils.sortBy(rateTypes);
  }
  getUsageTypeList(chargeCode) {
    const usageTypesList = [];
    if (!utils.isEmpty(chargeCode.ChargeUsageTypes)) {
      chargeCode.ChargeUsageTypes.forEach(chargeUsageType => {
        usageTypesList.push(chargeUsageType.ChargeUsageTypeName);
      });
    }
    return utils.sortBy(usageTypesList);
  }
  fetchChargeCodes() {
    const params = ViewChargesQueryService.getElasticparam();
    this.viewChargesModel.isLoader = true;
    this.chargeCodeSubscription =
    this.viewChargeCodes.getViewChargeCodes(params).pipe(takeWhile(() => this.viewChargesModel.subscriberFlag))
      .subscribe((response: RootObject) => {
        const tableValues = [];
        this.viewChargesModel.totalRecords = response['hits']['total'];
        const chargeCodes = response['hits']['hits'];
        chargeCodes.forEach(ChargeCode => {
          const chargeCode = ChargeCode['_source'];
          this.viewChargesModel.chargeCodesDetails = Object.create(this.viewChargesModel.chargeCodesDetails);
          this.viewChargesModel.chargeCodesDetails.chargeIdentifier = chargeCode.ChargeTypeIdentifier;
          this.viewChargesModel.chargeCodesDetails.chargeTypeDescription = chargeCode.ChargeTypeDescription;
          this.viewChargesModel.chargeCodesDetails.autoInvoiceIndicator = chargeCode.AutoInvoiceIndicator;
          this.viewChargesModel.chargeCodesDetails.quantityRequiredIndicator = chargeCode.QuantityRequiredIndicator;
          this.viewChargesModel.chargeCodesDetails.effectiveDate = chargeCode.EffectiveDate;
          this.viewChargesModel.chargeCodesDetails.expirationDate = chargeCode.ExpirationDate;
          this.serviceOfferingList = this.getServiceOfferingList(chargeCode);
          this.rateTypes = this.getRateTypes(chargeCode);
          this.viewChargesModel.chargeCodesDetails.tableToolTip = this.serviceOfferingList.join('\n');
          this.viewChargesModel.chargeCodesDetails.chargeTypeBusinessUnitServiceOfferingAssociations =
            this.displayCodes(this.serviceOfferingList).join('\n');
          this.chargeUsageTypeList = this.getUsageTypeList(chargeCode);
          this.viewChargesModel.chargeCodesDetails.chargeUsageTypeToolTip = this.chargeUsageTypeList.join('\n');
          this.viewChargesModel.chargeCodesDetails.chargeUsageType = this.displayCodes(this.chargeUsageTypeList).join('\n');
          this.viewChargesModel.chargeCodesDetails.chargeApplicationLevelTypes = (chargeCode.ApplicationLevel &&
            chargeCode.ApplicationLevel.ChargeApplicationLevelTypeName) ?
            chargeCode.ApplicationLevel.ChargeApplicationLevelTypeName : null;
          this.viewChargesModel.chargeCodesDetails.rateTypeToolTip = this.rateTypes.join('\n');
          this.viewChargesModel.chargeCodesDetails.rateTypes =
            this.displayCodes(this.rateTypes).join('\n');
          this.viewChargesModel.chargeCodesDetails.effectiveDate =
            chargeCode.EffectiveDate ? moment(chargeCode.EffectiveDate).format('MM/DD/YYYY') : '--';
          this.viewChargesModel.chargeCodesDetails.expirationDate =
            chargeCode.ExpirationDate ? moment(chargeCode.ExpirationDate).format('MM/DD/YYYY') : '--';
          tableValues.push(this.viewChargesModel.chargeCodesDetails);
        });
        this.viewChargesModel.tableContent = tableValues;
        this.viewChargesModel.noResultFoundFlag = tableValues.length === 0;
        this.viewChargesModel.isLoader = false;
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        this.viewChargesModel.tableContent = [];
        this.viewChargesModel.isLoader = false;
        this.viewChargesModel.noResultFoundFlag = false;
        this.handleError(error, 'error');
        this.changeDetector.detectChanges();
      });
  }

  handleError(error: Error, key: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? 'Error' : 'Success',
      detail: error.message
    };
    this.messageService.clear();
    this.messageService.add(message);
  }

  onMouseEnter(rowData): void {
    rowData.hover = true;
  }

  onMouseLeave(rowData): void {
    rowData.hover = false;
  }
  filterGridData(event: Event) {
    this.chargeListRef.first = 0;
    const currentQuery = ViewChargesQueryService.getElasticparam();
    currentQuery['from'] = 0;
    ViewChargesQueryService.setElasticparam(currentQuery);
    if (this.chargeCodeSubscription) {
      this.chargeCodeSubscription.unsubscribe();
      this.viewChargesModel.isLoader = false;
    }
    this.fetchChargeCodes();
  }
}
