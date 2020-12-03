import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment';
import { RulesModel } from './model/rules.model';
import { RulesQuery } from './query/rules.query';
import { RulesService } from './service/rules.service';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';

@Component({
  selector: 'app-standard-rules',
  templateUrl: './standard-rules.component.html',
  styleUrls: ['./standard-rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandardRulesComponent implements OnInit {

  @Input() agreementID;

  @ViewChild('ruleTable') ruleTable: any;

  rulesModel: RulesModel;

  constructor(
    private readonly router: Router,
    private readonly rulesService: RulesService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly datePipe: DatePipe,
    private readonly shared: BroadcasterService
  ) {
    this.rulesModel = new RulesModel();
  }

  onCreateRule() {
    this.router.navigateByUrl('/standard/rule');
  }
  ngOnInit() {
    this.rulesModel.firstCheck = 0;
    this.rulesModel.isRuleRecordEmpty = true;
  }

  onRowSelect(event: Event) {
    if (event['data']['customerAccessorialFreeRuleConfigurationId']) {
      this.router.navigate(['/standard/rulesdetailedview'], { queryParams: { id: this.agreementID } });
      this.shared.broadcast('ruleDetailedViewConfigurationId', event['data']['customerAccessorialFreeRuleConfigurationId']);
    }

  }
  getGridValues(searchText?: string, id?: number) {
    const params = RulesQuery.getRulesQuery(searchText, id);
    this.rulesService.getRules(params)
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
  loadConfigValuesLazy(event) {
      const query: object = RulesQuery.getRulesQuery('', this.agreementID);
      if (event['sortField']) {
        const col = utils.find(this.rulesModel.cols, ['field', event['sortField']]);
        const sortQueryFields: object = RulesQuery.sort();
        let sortKey = null;
        const sortObj: any = utils.find(sortQueryFields, (sort) => {
          if (Object.keys(sort).indexOf(col.sortField) !== -1) {
            sortKey = col.sortField;
            return sort;
          }
        });
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
      query['from'] = event.first;
      query['size'] = event.rows;
      this.loadRulesData(query);
  }
  loadRulesData(query: object) {
    this.rulesModel.loading = true;
    this.rulesService.getRules(query)
      .pipe(takeWhile(() => this.rulesModel.isSubscribeFlag)).subscribe((data) => {
        const rules = data['hits']['hits'].map(this.parseRulesData.bind(this));
        this.rulesModel.loading = false;
        this.rulesModel.rules = rules;
        this.rulesModel.totalRuleRecords = data['hits']['total'];
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
    rule['creationDate'] = this.datePipe.transform(rule['creationDate'], 'MM/dd/yyyy h:mm a') + ' CST';
    rule['lastUpdatedDate'] = this.datePipe.transform(rule['lastUpdatedDate'], 'MM/dd/yyyy h:mm a') + ' CST';
  }

  customerAccessorialAccount(rule: object) {
    utils.each(rule['customerAccessorialAccount'], (customerAccessorialAccount) => {
      if (customerAccessorialAccount.customerAgreementContractName) {
        rule['contractsToShow'].push(customerAccessorialAccount.customerAgreementContractName);
      }

      if (customerAccessorialAccount.customerAgreementContractSectionName) {
        rule['sectionsToShow'].push(customerAccessorialAccount.customerAgreementContractSectionName);
      }

      if (customerAccessorialAccount.customerAgreementContractSectionAccountName) {
        rule['billToCodeToShow'].push(customerAccessorialAccount.customerAgreementContractSectionAccountName);
      }
    });
  }
  parseCustomerAccessorialFreeRule(rule: object) {
    if (rule['accessorialFreeRuleTypes'] && rule['ruleType'] && rule['ruleType'].toLowerCase() === 'free') {
      const accessorialFreeRule = rule['accessorialFreeRuleTypes'][0] ? rule['accessorialFreeRuleTypes'][0]
        : rule['accessorialFreeRuleTypes'];
      rule['freeRuleTypeId'] = accessorialFreeRule['accessorialFreeRuleTypeId'];
      rule['freeRuleTypeName'] = accessorialFreeRule['accessorialFreeRuleTypeName'];
      rule['ruleStatus'] = rule['ruleStatus'] ? rule['ruleStatus'] : 'Active';
      rule['documentFileNamesShow'] = rule['documentFileNames'] ? rule['documentFileNames'] : [];
      if (rule['freeRuleTypeId'] === this.rulesModel.freeRuleType['quantityTypeId']) {
        rule['freeRuleQuantity'] = accessorialFreeRule['accessorialFreeRuleQuantityType']['accessorialFreeQuantity'];
        rule['freeRuleQuantityType'] = accessorialFreeRule['accessorialFreeRuleQuantityType']['accessorialFreeRuleQuantityTypeName'];
        rule['freeRuleQuantityTimeFrame'] = accessorialFreeRule['accessorialFreeRuleQuantityType']['freeRuleQuantityTimeTypeCode'];
        rule['freeRuleQuantityDistance'] = accessorialFreeRule['accessorialFreeRuleQuantityType']['freeRuleQuantityDistanceTypeCode'];
        rule['freeRuleStartFreeTime'] = accessorialFreeRule['accessorialFreeRuleQuantityType']['requestedDeliveryDateIndicator'] === 'Y'
          ? 'Yes' : 'No';
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
    const timeZoneFormat = ' CST';
    if (value && value.split(':').length === 3) {
      timeValue = moment(value, 'HH:mm:ss').format('HH:mm') + timeZoneFormat;
    } else if (value) {
      timeValue = value + timeZoneFormat;
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
      rule['freeRuleDayOfMonth'] = calendar['customerAccessorialFreeRuleCalendarDay'][0];
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
  onRulePaginationChange(event) {
    const query: any = RulesQuery.getRulesQuery('', this.agreementID);
    query['from'] = event.first;
    query['size'] = event.rows;
    this.loadRulesData(query);
  }

  searchRule(searchText: string) {
    this.rulesModel.firstCheck = 1;
    const query = RulesQuery.getRulesQuery(searchText, this.agreementID);
    this.loadRulesData(query);
  }
}
