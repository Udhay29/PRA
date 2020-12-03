import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { takeWhile } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import * as utils from 'lodash';
import * as moment from 'moment';
import { RulesModel } from './model/rules.model';
import { RulesQuery } from './query/rules.query';
import { RulesListService } from './service/rules-list.service';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { RulesService } from './service/rules.service';
import { TimeZoneService } from '../../../../shared/jbh-app-services/time-zone.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RulesComponent implements OnInit {
  @Input() agreementID;
  @ViewChild('ruleTable') ruleTable: any;
  rulesModel: RulesModel;
  private subscription: Subscription;
  constructor(
    private readonly router: Router,
    private readonly rulesService: RulesListService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly datePipe: DatePipe,
    private readonly shared: BroadcasterService,
    private readonly timeZoneService: TimeZoneService
  ) {
    this.rulesModel = new RulesModel();
  }

  onCreateRule() {
    this.shared.broadcast('editAccesorialRules', {
      editRuleData: null,
      isAccessorialRuleEdit: false,
      refreshDocumentResponse: null,
      ruleConfigurationId: null
    });
    this.router.navigate(['/viewagreement/rule'], {
      queryParams: {
        id: this.agreementID
      }
    });
  }
  ngOnInit() {
    RulesService.setElasticparam(RulesQuery.getRulesQuery(null, this.agreementID));
    this.getGridValues();
    this.rulesModel.loading = true;
  }

  onRowSelect(event: Event) {
    if (event['data']['customerAccessorialFreeRuleConfigurationId']) {
      this.router.navigate(['/viewagreement/rulesdetailedview'], {
        queryParams: {
          id: this.agreementID
        }
      });
      this.shared.broadcast('ruleDetailedViewConfigurationId', event['data']['customerAccessorialFreeRuleConfigurationId']);
    }
  }
  loadConfigValuesLazy(event) {
    if (event && this.rulesModel.rules.length) {
      const query: object = RulesService.getElasticparam();
      this.sortRules(event, query);
      query['from'] = event.first;
      query['size'] = event.rows;
      RulesService.setElasticparam(query);
      this.loadRulesData();
    }
  }
  sortRules(event, query) {
    if (this.rulesModel.sortField !== event['sortField'] || this.rulesModel.sortOrder !== event['sortOrder']) {
      const col = utils.find(this.rulesModel.cols, ['field', event['sortField']]);
      const sortQueryFields: object = RulesQuery.sort();
      let sortKey = null;
      const sortObj = utils.find(sortQueryFields, (sort) => {
        if (Object.keys(sort).indexOf(col.sortField) !== -1) {
          sortKey = col.sortField;
          return sort;
        }
      });
      this.rulesModel.sortOrder = event.sortOrder;
      sortObj[sortKey]['order'] = event.sortOrder === 1 ? 'asc' : 'desc';
      if (sortObj[sortKey]['missing']) {
        sortObj[sortKey]['missing'] = event.sortOrder === 1 ? '_first' : '_last';
      }
      if (col['sortFilterField'] && col['sortFilterData']) {
        sortObj[sortKey]['nested']['filter']['match'] = {};
        sortObj[sortKey]['nested']['filter']['match'][col['sortFilterField']] = col['sortFilterData'];
      }
      query['sort'] = [];
      query['sort'].push(sortObj);
    }
  }
  loadRulesData() {
    const query = RulesService.getElasticparam();
    this.rulesModel.loading = true;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.rulesService.getRules(query)
      .pipe(takeWhile(() => this.rulesModel.isSubscribeFlag)).subscribe((data) => {
        const rules = data['hits']['hits'].map(this.parseRulesData.bind(this));
        this.rulesModel.loading = false;
        this.rulesModel.rules = rules;
        this.rulesModel.totalRuleRecords = data['hits']['total'];
        this.rulesModel.isRuleRecordEmpty = this.rulesModel.totalRuleRecords === 0;
        this.changeDetector.detectChanges();
      });
  }
  getGridValues() {
    const query = RulesService.getElasticparam();
    this.rulesModel.loading = true;
    this.rulesService.getRules(query)
      .pipe(takeWhile(() => this.rulesModel.isSubscribeFlag)).subscribe((data) => {
        const rules = data['hits']['hits'].map(this.parseRulesData.bind(this));
        this.rulesModel.loading = false;
        this.rulesModel.rules = rules;
        this.rulesModel.totalRuleRecords = data['hits']['total'];
        this.rulesModel.firstCheck = 0;
        this.rulesModel.isRuleRecordEmpty = this.rulesModel.totalRuleRecords === 0;
        this.changeDetector.detectChanges();
      });
  }
  parseRulesData(rule) {
    rule = rule['_source'];
    rule.contractsToShow = [];
    rule.sectionsToShow = [];
    rule.billToCodeToShow = [];
    rule.serviceLevelToShow = [];
    rule.requestedToShow = [];
    rule.busoToShow = [];
    rule.carriersToShow = [];
    rule.templateTypeToShow = [];
    rule.websiteAddressToShow = [];
    rule.batchTimeToShow = [];
    rule.notificationMethodsToShow = [];
    rule.freeRuleDayofWeekWeeklyToShow = [];
    rule.freeRuleDayofWeekMonthlyToShow = [];
    rule.freeRuleAppliesToOccurrenceToShow = [];
    rule.freeRuleFrequencyToShow = [];
    rule.documentFileNamesShow = [];
    this.parseCustomerAccessorialNotificationFrequency(rule);
    this.customerAccessorialAccount(rule);
    this.parseBUSO(rule);
    utils.each(rule.customerAccessorialRequestServices, (requestedService) => {
      if (requestedService.requestedServiceTypeCode) {
        rule.requestedToShow.push(requestedService.requestedServiceTypeCode);
      }
    });
    utils.each(rule.customerAccessorialCarriers, (carrier) => {
      if (carrier.carrierName) {
        rule.carriersToShow.push(`${carrier.carrierName} (${carrier.carrierCode})`);
      }
    });
    this.parseCustomerAccessorialNotificationMethods(rule);
    this.parseCustomerAccessorialFreeRule(rule);
    this.formatDates(rule);
    return rule;
  }

  parseCustomerAccessorialNotificationFrequency(rule: object) {
    if (rule['customerAccessorialNotificationFrequency']) {
      rule['eventOccurenceTimeToShow'] =
        rule['customerAccessorialNotificationFrequency'].accessorialNotificationOccurrenceTypeName;
      rule['eventNameToShow'] =
        rule['customerAccessorialNotificationFrequency'].accessorialNotificationEventTypeName;
      rule['quantityToShow'] =
        rule['customerAccessorialNotificationFrequency'].timeframeQuantity;
      rule['timeFrameToShow'] =
        rule['customerAccessorialNotificationFrequency'].pricingUnitOfTimeMeasurementAssociationName;

      if (rule['customerAccessorialNotificationFrequency'].customerAccessorialNotificationBatches) {
        rule['batchTimeToShow'] =
          rule['customerAccessorialNotificationFrequency'].customerAccessorialNotificationBatches.map(
            notificationBatch => `${notificationBatch.batchTime} CT`
          );
      }
      rule['timeFrameToShow'] =
        rule['customerAccessorialNotificationFrequency'].pricingUnitOfTimeMeasurementAssociationName;
    }
  }

  parseBUSO(rule: object) {
    utils.each(rule['customerAccessorialServiceLevelBusinessUnitServiceOfferings'], (serviceLevel) => {
      if (serviceLevel.serviceLevel) {
        rule['serviceLevelToShow'].push(serviceLevel.serviceLevel);
      }
      rule['serviceLevelToShow'] = utils.uniq(rule['serviceLevelToShow']);
      if (serviceLevel.businessUnit) {
        rule['busoToShow'].push(`${serviceLevel.businessUnit}`);
      }
      rule['busoToShow'] = utils.uniq(rule['busoToShow']);
    });
  }

  parseCustomerAccessorialNotificationMethods(rule: object) {
    utils.each(rule['customerAccessorialNotificationMethods'], (notificationMethods) => {
      if (notificationMethods && notificationMethods.accessorialEmailTemplateTypeName) {
        rule['templateTypeToShow'].push(notificationMethods.accessorialEmailTemplateTypeName);
      }
      if (notificationMethods && notificationMethods.websiteAddress) {
        rule['websiteAddressToShow'].push(notificationMethods.websiteAddress);
      }
      if (notificationMethods && notificationMethods.accessorialNotificationMethodTypeName) {
        rule['notificationMethodsToShow'].push(notificationMethods.accessorialNotificationMethodTypeName);
      }
    });
  }

  formatDates(rule: object) {
    rule['effectiveDate'] = this.datePipe.transform(rule['effectiveDate'], 'MM/dd/yyyy');
    rule['expirationDate'] = this.datePipe.transform(rule['expirationDate'], 'MM/dd/yyyy');
    rule['creationDate'] = this.timeZoneService.convertToLocalMilitaryUpdatedTime(rule['creationDate']);
    rule['lastUpdatedDate'] = this.timeZoneService.convertToLocalMilitaryUpdatedTime(rule['lastUpdatedDate']);
  }

  customerAccessorialAccount(rule: object) {
    utils.each(rule['customerAccessorialAccounts'], (customerAccessorialAccounts) => {
      if (customerAccessorialAccounts.customerAgreementContractName) {
        rule['contractsToShow'].push(customerAccessorialAccounts.customerAgreementContractName);
      }
      if (customerAccessorialAccounts.customerAgreementContractSectionName) {
        rule['sectionsToShow'].push(customerAccessorialAccounts.customerAgreementContractSectionName);
      }
      if (customerAccessorialAccounts.customerAgreementContractSectionAccountName) {
        rule['billToCodeToShow'].push(customerAccessorialAccounts.customerAgreementContractSectionAccountName);
      }
    });
    rule['contractsToShow'] = utils.uniq(rule['contractsToShow']);
    rule['sectionsToShow'] = utils.uniq(rule['sectionsToShow']);
    rule['billToCodeToShow'] = utils.uniq(rule['billToCodeToShow']);
  }
  parseCustomerAccessorialFreeRule(rule: object) {
    rule['ruleStatus'] = rule['ruleStatus'] ? rule['ruleStatus'] : 'Active';
    rule['documentFileNamesShow'] = rule['documentFileNames'] ? rule['documentFileNames'] : [];
    if (rule['accessorialFreeRuleTypes'] && rule['ruleType'] && rule['ruleType'].toLowerCase() === 'free') {
      const accessorialFreeRule = rule['accessorialFreeRuleTypes'][0] ? rule['accessorialFreeRuleTypes'][0] :
        rule['accessorialFreeRuleTypes'];
      rule['freeRuleTypeId'] = accessorialFreeRule['accessorialFreeRuleTypeId'];
      rule['freeRuleTypeName'] = accessorialFreeRule['accessorialFreeRuleTypeName'];
      if (rule['freeRuleTypeId'] === this.rulesModel.freeRuleType['quantityTypeId']) {
        rule['freeRuleQuantity'] = accessorialFreeRule['accessorialFreeRuleQuantityType']['accessorialFreeQuantity'];
        rule['freeRuleQuantityType'] = accessorialFreeRule['accessorialFreeRuleQuantityType']['accessorialFreeRuleQuantityTypeName'];
        rule['freeRuleQuantityTimeFrame'] = accessorialFreeRule['accessorialFreeRuleQuantityType']['freeRuleQuantityTimeTypeCode'];
        rule['freeRuleQuantityDistance'] = accessorialFreeRule['accessorialFreeRuleQuantityType']['freeRuleQuantityDistanceTypeCode'];
        rule['freeRuleStartFreeTime'] = accessorialFreeRule['accessorialFreeRuleQuantityType']['requestedDeliveryDateIndicator'] === 'Y' ?
          'Yes' : 'No';
      } else if (rule['freeRuleTypeId'] === this.rulesModel.freeRuleType['eventTypeId']) {
        const freeRuleEvent = accessorialFreeRule['customerAccessorialFreeRuleEvent'];
        rule['freeRuleEventType'] = freeRuleEvent['accessorialFreeRuleEventTypeName'];
        rule['freeRuleFreeTime'] = freeRuleEvent['accessorialFreeRuleEventTimeFrameTypeName'];
        rule['freeRuleDayOfEventFreeAmount'] = freeRuleEvent['accessorialDayOfEventFreeRuleModifierName'];
        rule['freeRuleDayOfEventTime'] = this.getHourMinute(freeRuleEvent['accessorialDayOfEventFreeRuleModifierTime']);
        rule['freeRuleDayAfterEventFreeAmount'] = freeRuleEvent['accessorialDayAfterEventFreeRuleModifierName'];
        rule['freeRuleDayAfterEventTime'] = this.getHourMinute(freeRuleEvent['accessorialDayAfterEventFreeRuleModifierTime']);
      } else if (rule['freeRuleTypeId'] === this.rulesModel.freeRuleType['calendarTypeId']) {
        this.parseRuleCalendarRule(accessorialFreeRule, rule);
      }
    }
  }
  getHourMinute(value) {
    let timeValue = '';
    let time = '';
    const symbol = 'T';
    if (value) {
      time = value.replace(' GMT', '');
      if (time && time.split(':').length === 2) {
        const dateTime = moment(new Date()).format('YYYY-MM-DD') + symbol + time;
        timeValue = this.timeZoneService.formatTimeOnlyToLocalMilitaryTime(dateTime);
      }
    }
    return timeValue;
  }
  parseRuleCalendarRule(accessorialFreeRule: object, rule: object) {
    const freeRuleCalendar = accessorialFreeRule['customerAccessorialFreeRuleCalendar'];
    utils.each(freeRuleCalendar['customerAccessorialFreeRuleCalendarMonth'], (calendar) => {
      if (freeRuleCalendar['accessorialFreeRuleCalendarTypeId'] === this.rulesModel.freeRuleType['relativeTypeId']) {
        rule['freeRuleRelativeMonth'] = calendar['calendarMonth'];
      } else if (freeRuleCalendar['accessorialFreeRuleCalendarTypeId'] === this.rulesModel.freeRuleType['specificTypeId']) {
        rule['freeRuleSpecificMonth'] = calendar['calendarMonth'];
      }
      rule['freeRuleDayOfMonth'] = this.getFreeRuleDayOfMonth(calendar);
    });
    utils.each(freeRuleCalendar['customerAccessorialFreeRuleCalendarWeekDay'], (dayOfWeek) => {
      if (freeRuleCalendar['pricingAveragePeriodTypeId'] === this.rulesModel.freeRuleType['relativeWeekly']) {
        rule['freeRuleDayofWeekWeeklyToShow'].push(dayOfWeek['calendarWeekDay']);
      } else if (freeRuleCalendar['pricingAveragePeriodTypeId'] === this.rulesModel.freeRuleType['relativeMonthly']) {
        rule['freeRuleDayofWeekMonthlyToShow'].push(dayOfWeek['calendarWeekDay']);
      }
    });
    utils.each(freeRuleCalendar['customerAccessorialFreeRuleCalendarDayOccurrences'], (frequency) => {
      if (freeRuleCalendar['pricingAveragePeriodTypeId'] === this.rulesModel.freeRuleType['relativeWeekly']) {
        rule['freeRuleAppliesToOccurrenceToShow'].push(frequency['accessorialFrequencyTypeName']);
      } else if (freeRuleCalendar['pricingAveragePeriodTypeId'] === this.rulesModel.freeRuleType['relativeMonthly']) {
        rule['freeRuleFrequencyToShow'].push(frequency['accessorialFrequencyTypeName']);
      }
    });
    rule['freeRuleYear'] = freeRuleCalendar['calendarYear'];
    rule['freeRuleNameOfDay'] = freeRuleCalendar['calendarDayDescription'];
    rule['freeRuleTimeframe'] = freeRuleCalendar['pricingAveragePeriodTypeName'];
    if (freeRuleCalendar['accessorialFreeRuleCalendarTypeId'] === this.rulesModel.freeRuleType['specificTypeId']) {
      rule['freeRuleSpecificApplyIf'] = freeRuleCalendar['accessorialFreeRuleCalendarApplyTypeName'];
      rule['freeRuleSpecificEventTypeName'] = freeRuleCalendar['accessorialFreeRuleEventTypeName'];
      rule['freeRuleSpecificCannotBeChargeableDay'] = freeRuleCalendar['firstDayChargeableIndicator'] === 'Y' ? 'Yes' : 'No';
    } else if (freeRuleCalendar['accessorialFreeRuleCalendarTypeId'] === this.rulesModel.freeRuleType['relativeTypeId']) {
      rule['freeRuleRelativeApplyIf'] = freeRuleCalendar['accessorialFreeRuleCalendarApplyTypeName'];
      rule['freeRuleRelativeEventTypeName'] = freeRuleCalendar['accessorialFreeRuleEventTypeName'];
      rule['freeRuleRelativeCannotBeChargeableDay'] = freeRuleCalendar['firstDayChargeableIndicator'] === 'Y' ? 'Yes' : 'No';
    }
  }
  getFreeRuleDayOfMonth(dayOfMonth) {
    return !utils.isEmpty(dayOfMonth['customerAccessorialFreeRuleCalendarDay'])
      ? dayOfMonth['customerAccessorialFreeRuleCalendarDay'][0] : null;
  }
  searchRule(searchText: string) {
    this.rulesModel.firstCheck = 1;
    const dateTimeRegex = new RegExp('^(1[0-2]|0?[1-9])/(3[01]|[12][0-9]|0?[1-9])/[0-9]{4} (0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$');
    const dateOnlyRegex = new RegExp('^(1[0-2]|0?[1-9])/(3[01]|[12][0-9]|0?[1-9])/[0-9]{4}$');
    if (dateTimeRegex.test(searchText)) {
      const DateSearch: string = this.timeZoneService.convertUpdatedDateTimetoUTC(searchText);
      searchText = `${DateSearch.replace('T', ' ')}`;
      searchText = searchText ? `${'*'}${searchText.replace(/[!"?:\\['^~=\//\\{},-.&&||<>()+*\]]/g, '\\$&')}*` : '*';
      const currentQuery = RulesService.getElasticparam();
      const searchQuery = RulesQuery.searchFields(searchText);
      currentQuery['query']['bool']['must'][3]['bool']['should'] = searchQuery;
      this.loadRulesData();
    } else if (dateOnlyRegex.test(searchText)) {
      const DateSearch = this.timeZoneService.convertUpdatedDateOnlytoUTC(searchText);
      searchText = DateSearch.toString();
      searchText = `${searchText.replace(/[[\]{}() *:\"~&/!?\\^$|]/g, '\\$&')}`;
      searchText = searchText.replace(',', '\"OR\"');
      const currentQuery = RulesService.getElasticparam();
      const searchQuery = RulesQuery.searchFields(searchText);
      currentQuery['query']['bool']['must'][3]['bool']['should'] = searchQuery;
      this.loadRulesData();
    } else {
      searchText = searchText ? `${'*'}${searchText.replace(/[!"?:\\['^~=\//\\{},-.&&||<>()+*\]]/g, '\\$&')}*` : '*';
      const currentQuery = RulesService.getElasticparam();
      const searchQuery = RulesQuery.searchFields(searchText);
      currentQuery['query']['bool']['must'][3]['bool']['should'] = searchQuery;
      this.loadRulesData();
    }
  }
}
