import { DateValidation } from './../../../../../../shared/jbh-app-services/date-validation';
import { Injectable, ChangeDetectorRef, ComponentFactoryResolver } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import * as utils from 'lodash';
import * as moment from 'moment';

import { AveragingRulesModel } from './../../../../../shared/accessorials/rule-shared/averaging-rules/models/averaging-rules.model';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormGroup } from '@angular/forms';
import { CreateRuleModel } from '../model/standard-create-rules.model';
import { FreeRuleModel } from '../../free-rule/model/free-rule.model';
import {
  SpecificDaysInterface, DayOfWeek, RuleType, ChargeCodeResponseInterface, DocumentationDate
 } from '../model/standard-create-rules.interface';
import { FreeEventTypeModel } from '../../free-rule/free-event-type/model/free-event-type.model';
import { FreeCalendarModel } from '../../free-rule/free-calendar/model/free-calendar.model';
import { CreateStandardRulesComponent } from '../standard-create-rules.component';
import { TimeZoneService } from '../../../../../../shared/jbh-app-services/time-zone.service';


@Injectable({
  providedIn: 'root'
})
export class CreateRuleUtilityService {

  constructor(private readonly timeZoneService: TimeZoneService) { }

  validateDate(date, fieldName: string, createRuleModel: CreateRuleModel) {
    const agreementEffectiveDates = createRuleModel.agreementEffectiveDate;
    const agreementEndDate = createRuleModel.agreementExpirationDate;
    switch (fieldName) {
      case 'effectiveDate':
        if (date > new Date(agreementEndDate) ||
          date < moment(agreementEffectiveDates).subtract(createRuleModel.superUserBackDateDays, 'days') ||
          date > moment(agreementEndDate).add(createRuleModel.superUserFutureDateDays, 'days')) {
          createRuleModel.inValidEffDate = true;
          break;
        } else {
          createRuleModel.inValidEffDate = false;
          break;
        }
      case 'expirationDate':
        if (date > new Date(agreementEndDate) ||
          date <= moment(new Date()).subtract(createRuleModel.superUserBackDateDays, 'days')) {
          createRuleModel.inValidExpDate = true;
          break;
        } else {
          createRuleModel.inValidExpDate = false;
          break;
        }
    }
  }
  saveParamFramer(createRuleModel: CreateRuleModel, framerObject: object,
    averagingRulesModel: AveragingRulesModel, viewDocumentationModel): object {
    framerObject['customerAccessorialAverageConfigurationId'] = null;
    framerObject['pricingAveragePeriodTypeId'] = averagingRulesModel.averagingForm.controls['timeFrame'].value['value'];
    framerObject['pricingAveragePeriodTypeName'] = averagingRulesModel.averagingForm.controls['timeFrame'].value['label'];
    framerObject['accessorialDocumentTypeId'] = 1;
    if (!utils.isEmpty(averagingRulesModel)) {
      framerObject['customerAccessorialAveragePeriodDTOs'] = this.averagingRules(averagingRulesModel);
    }
    return framerObject;
  }
  saveParamFramerFree(createRuleModel: CreateRuleModel, framerObject: object,
    freeRuleModel: FreeRuleModel, freeEventTypeModel: FreeEventTypeModel, freeCalendarModel: FreeCalendarModel,
    documentModel, optionalModel) {
    framerObject['chargeTypeName'] = createRuleModel.rulesForm.controls.chargeType.value ?
      createRuleModel.rulesForm.controls.chargeType.value.label : null;
    framerObject['accessorialEquipmentLengthDescription'] = (optionalModel.optionalForm.controls['equipmentLength'].value) ?
      optionalModel.optionalForm.controls['equipmentLength'].value['value'] : null;
    framerObject['accessorialEquipmentLength'] = (optionalModel.optionalForm.controls['equipmentLength'].value) ?
      optionalModel.optionalForm.controls['equipmentLength'].value['label'] : null;
    framerObject['accessorialRuleType'] = createRuleModel.rulesForm.controls.ruleType.value ?
      createRuleModel.rulesForm.controls.ruleType.value.label : null;
    framerObject['docLegalDescription'] = this.checkNullConditionForDocumentation(documentModel.legalTextArea);
    framerObject['docInstructionalDescription'] = this.checkNullConditionForDocumentation(documentModel.instructionalTextArea);
    framerObject['docFileNames'] = this.getDocumentFileNames(documentModel.attachments);
    framerObject['accessorialDocumentTypeId'] = 1;
    if (freeRuleModel && freeEventTypeModel) {
      framerObject['accessorialFreeRuleTypes'] = [];
      framerObject['accessorialFreeRuleTypes'].push(this.createFreeFuleParamEventType(freeRuleModel.freeRulesForm,
        freeEventTypeModel.freeEventTypeForm));
    } else if (freeRuleModel && freeCalendarModel) {
      framerObject['accessorialFreeRuleTypes'] = [];
      framerObject['accessorialFreeRuleTypes'].
        push(this.createFreeRuleParamCalendar(freeRuleModel.freeRulesForm, freeCalendarModel.freeCalendarForm));
    } else if (freeRuleModel) {
      framerObject['accessorialFreeRuleTypes'] = [];
      framerObject['accessorialFreeRuleTypes'].push(this.createFreeFuleParam(freeRuleModel.freeRulesForm));
    }
    return framerObject;
  }
  getDocumentFileNames(attachments) {
    const fileNames = [];
    attachments.forEach( (attachment) => {
      fileNames.push(attachment['documentName']);
    });
    return fileNames;
  }
  notificationId(appNotifyWhen) {
    let notificationId = null;
    appNotifyWhen.notifyWhenModel.accessorialNotificationRequiredTypes.forEach((checkbox) => {
      if (checkbox.label ===
        appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['accessorialNotificationRequiredTypes'].value) {
        notificationId = checkbox.value;
      }
    });
    return notificationId;
  }
  checkNullConditionForDocumentation(documentLegalOrInstruction: string): string {
    return (documentLegalOrInstruction &&
      documentLegalOrInstruction.length) ? documentLegalOrInstruction : null;
  }
  saveParamFramerNotification(framerObject: object, appNotifyWhen, appNotifyBy, documentModel, optionalModel, parentScope): object {
    framerObject['chargeTypeName'] = this.checkForDateOrNull(parentScope.createRuleModel.rulesForm.controls.chargeType.value.label);
    framerObject['accessorialEquipmentLengthDescription'] = (optionalModel.optionalForm.controls['equipmentLength'].value) ?
      optionalModel.optionalForm.controls['equipmentLength'].value['value'] : null;
    framerObject['accessorialEquipmentLength'] = (optionalModel.optionalForm.controls['equipmentLength'].value) ?
      optionalModel.optionalForm.controls['equipmentLength'].value['label'] : null;
    framerObject['accessorialRuleType'] = parentScope.createRuleModel.rulesForm.controls.ruleType.value ?
      parentScope.createRuleModel.rulesForm.controls.ruleType.value.label : null;
    framerObject['docLegalDescription'] = this.checkNullConditionForDocumentation(documentModel.legalTextArea);
    framerObject['docInstructionalDescription'] = this.checkNullConditionForDocumentation(documentModel.instructionalTextArea);
    framerObject['docFileNames'] = this.documentationName(documentModel);
    framerObject['docHasAttachment'] = framerObject['docFileNames'].length !== 0;
    framerObject['customerAccessorialNotificationMethodDTOs'] = this.notifactionBy(appNotifyBy);
    framerObject['customerAccessorialNotificationConfigurationId'] = null;
    framerObject['accessorialNotificationTypeId'] = appNotifyBy.notifyByModel.notifyByForm.controls['notificationType'].value ?
      appNotifyBy.notifyByModel.notifyByForm.controls['notificationType'].value.value : null;
    framerObject['accessorialNotificationTypeName'] = appNotifyBy.notifyByModel.notifyByForm.controls['notificationType'].value ?
      appNotifyBy.notifyByModel.notifyByForm.controls['notificationType'].value.label : null;
    framerObject['accessorialNotificationRequiredTypeId'] = this.notificationId(appNotifyWhen);
    framerObject['accessorialNotificationRequiredTypeName'] =
      appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['accessorialNotificationRequiredTypes'].value;
    framerObject['customerAccessorialNotificationFrequencyDTO'] = {
      'accessorialNotificationTriggerFrequencyTypeId': appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['frequency'].value ?
        appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['frequency'].value.value : null,
      'accessorialNotificationTriggerFrequencyTypeName': appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['frequency'].value ?
        appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['frequency'].value.label : null,
      'accessorialNotificationOccurrenceTypeId': appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['eventOccuranceTime'].value ?
        appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['eventOccuranceTime'].value.value : null,
      'accessorialNotificationOccurrenceTypeName': appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['eventOccuranceTime'].value ?
        appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['eventOccuranceTime'].value.label : null,
      'accessorialNotificationEventTypeId': appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['eventName'].value ?
        appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['eventName'].value.value : null,
      'accessorialNotificationEventTypeName': appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['eventName'].value ?
        appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['eventName'].value.label : null,
      'timeframeQuantity': appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['timeframeInput'].value ?
        appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['timeframeInput'].value : null,
      'pricingUnitOfTimeMeasurementAssociationId': appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['timeframe'].value ?
        appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['timeframe'].value.value : null,
      'pricingUnitOfTimeMeasurementAssociationName': appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['timeframe'].value ?
        appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['timeframe'].value.label : null,
      'customerAccessorialNotificationBatches':
        appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['batchTime'].value ?
          this.batchTImeFramer(appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['batchTime'].value) : null,
    };
    return framerObject;
  }

  checkForDateOrNull(value) {
    return value ? value : null;
  }
  documentationName(documentModel) {
    const documentationName = [];
    documentModel.attachments.forEach((data) => {
      documentationName.push(data['documentName']);
    });
    return documentationName;
  }
  notifactionBy(appNotifyBy) {
    let emailid;
    let websiteId;
    let manualID;
    const NotifyByArray = [];
    appNotifyBy.notifyByModel.CheckBoxData.forEach((checkbox) => {
      switch (checkbox.label) {
        case 'Email': emailid = checkbox.value;
          break;
        case 'Website': websiteId = checkbox.value;
          break;
        case 'Manual': manualID = checkbox.value;
          break;
      }
    });
    if (appNotifyBy.notifyByModel.notifyByForm.controls['selectionCheckbox']) {
      appNotifyBy.notifyByModel.notifyByForm.controls['selectionCheckbox'].value.forEach(data => {
        this.frameNotifyByDto(data, appNotifyBy, emailid, websiteId, manualID, NotifyByArray);
      });
    }
    return NotifyByArray;
  }
  frameNotifyByDto(data, appNotifyBy, emailid, websiteId, manualID, NotifyByArray) {
    if (data === 'Email') {
      NotifyByArray.push({
        'customerAccessorialNotificationMethodId': null,
        'accessorialNotificationMethodTypeId': emailid,
        'accessorialNotificationMethodTypeName': data,
        'accessorialEmailTemplateTypeId':
          this.checkForDateOrNull(appNotifyBy.notifyByModel.notifyByForm.controls['emailNotificationType'].value.value),
        'accessorialEmailTemplateTypeName':
          this.checkForDateOrNull(appNotifyBy.notifyByModel.notifyByForm.controls['emailNotificationType'].value.label),
        'websiteAddress': null
      });
    }
    if (data === 'Website') {
      NotifyByArray.push({
        'customerAccessorialNotificationMethodId': null,
        'accessorialNotificationMethodTypeId': websiteId,
        'accessorialNotificationMethodTypeName': data,
        'accessorialEmailTemplateTypeId': null,
        'accessorialEmailTemplateTypeName': null,
        'websiteAddress': appNotifyBy.notifyByModel.notifyByForm.controls['websiteDesc'].value
      });
    }
    if (data === 'Manual') {
      NotifyByArray.push({
        'customerAccessorialNotificationMethodId': null,
        'accessorialNotificationMethodTypeId': manualID,
        'accessorialNotificationMethodTypeName': data,
        'accessorialEmailTemplateTypeId': null,
        'accessorialEmailTemplateTypeName': null,
        'websiteAddress': null
      });
    }
  }
  batchTImeFramer(data) {
    const batch = [];
    if (data) {
      data.forEach(day => {
        if (day) {
          batch.push({ batchTime: day['value'] });
        }
      });
    }
    return batch;
  }
  averagingRules(averagingRulesModel: AveragingRulesModel) {
    const framerValue = [];
    if (averagingRulesModel.isWeekly) {
      averagingRulesModel.averagingForm.controls['dayOfWeek'].value.forEach(dayElement => {
        framerValue.push(this.averageRulesFramer(averagingRulesModel, 'week', dayElement));
      });
    } else if (averagingRulesModel.isMonthly && averagingRulesModel.isEachDay) {
      averagingRulesModel.averagingForm.controls['specificDay'].value.forEach(specificDayElement => {
        framerValue.push(this.averageRulesFramer(averagingRulesModel, 'eachDayMonth', specificDayElement));
      });
    } else if (averagingRulesModel.isMonthly && averagingRulesModel.isOnTheDay) {
      framerValue.push(this.averageRulesFramer(averagingRulesModel, 'onTheDayMonth'));
    }
    return framerValue;
  }
  createFreeFuleParam(freeRuleModel: FormGroup) {
    const accessorialFreeRuleType = {};
    const valuePlaces = new RegExp(',', 'g');
    const quantityValue = freeRuleModel.controls['quantity'] && freeRuleModel.controls['quantity']['value'] ?
      freeRuleModel.controls['quantity']['value'].toString().replace(valuePlaces, '') : null;
    accessorialFreeRuleType['accessorialFreeRuleTypeId'] = this.getFormControlValue(freeRuleModel, 'freeRuleType');
    accessorialFreeRuleType['accessorialFreeRuleTypeName'] = this.getFormControlLabel(freeRuleModel, 'freeRuleType');
    accessorialFreeRuleType['accessorialFreeRuleQuantityType'] = {};
    accessorialFreeRuleType['accessorialFreeRuleQuantityType']
    ['accessorialFreeRuleQuantityTypeId'] = this.getFormControlValue(freeRuleModel, 'quantityType');
    accessorialFreeRuleType['accessorialFreeRuleQuantityType']
    ['accessorialFreeRuleQuantityTypeName'] = this.getFormControlLabel(freeRuleModel, 'quantityType');
    accessorialFreeRuleType['accessorialFreeRuleQuantityType']['freeRuleQuantityDistanceTypeId'] =
      this.getFormControlValue(freeRuleModel, 'distanceType');
    accessorialFreeRuleType['accessorialFreeRuleQuantityType']
    ['freeRuleQuantityDistanceTypeCode'] = this.getFormControlLabel(freeRuleModel, 'distanceType');
    accessorialFreeRuleType['accessorialFreeRuleQuantityType']
    ['freeRuleQuantityTimeTypeId'] = this.getFormControlValue(freeRuleModel, 'timeType');
    accessorialFreeRuleType['accessorialFreeRuleQuantityType']
    ['freeRuleQuantityTimeTypeCode'] = this.getFormControlLabel(freeRuleModel, 'timeType');
    accessorialFreeRuleType['accessorialFreeRuleQuantityType']
    ['accessorialFreeQuantity'] = quantityValue ?
        quantityValue : null;
    accessorialFreeRuleType['accessorialFreeRuleQuantityType']
    ['requestedDeliveryDateIndicator'] = (freeRuleModel.controls['requestedDeliveryDate']
      && freeRuleModel.controls['requestedDeliveryDate'].value)
        ? 'Y' : 'N';
    return accessorialFreeRuleType;
  }
  createFreeRuleParamCalendar(freeRulesForm: FormGroup, freeCalendarForm: FormGroup) {
    const accessorialFreeRuleType = {};
    accessorialFreeRuleType['accessorialFreeRuleTypeId'] = this.getFormControlValue(freeRulesForm, 'freeRuleType');
    accessorialFreeRuleType['accessorialFreeRuleTypeName'] = this.getFormControlLabel(freeRulesForm, 'freeRuleType');
    accessorialFreeRuleType['customerAccessorialFreeRuleCalendar'] = {};
    accessorialFreeRuleType['customerAccessorialFreeRuleCalendar']
    ['accessorialFreeRuleCalendarTypeId'] = this.getFormControlValue(freeCalendarForm, 'calendarType');
    accessorialFreeRuleType['customerAccessorialFreeRuleCalendar']
    ['accessorialFreeRuleCalendarTypeName'] = this.getFormControlLabel(freeCalendarForm, 'calendarType');
    accessorialFreeRuleType['customerAccessorialFreeRuleCalendar']
    ['pricingAveragePeriodTypeId'] = this.getFormControlValue(freeCalendarForm, 'timeFrame');
    accessorialFreeRuleType['customerAccessorialFreeRuleCalendar']
    ['pricingAveragePeriodTypeName'] = this.getFormControlLabel(freeCalendarForm, 'timeFrame');
    accessorialFreeRuleType['customerAccessorialFreeRuleCalendar']
    ['customerAccessorialFreeRuleCalendarWeekDay'] = this.getFreeRuleDayOfWeek(freeCalendarForm);
    accessorialFreeRuleType['customerAccessorialFreeRuleCalendar']
    ['customerAccessorialFreeRuleCalendarDayOccurrences'] = this.getFreeRuleOccurenceList(freeCalendarForm);

    accessorialFreeRuleType['customerAccessorialFreeRuleCalendar']['calendarDayDescription'] = freeCalendarForm.controls['holidayName']
      && freeCalendarForm.controls['holidayName']['value'] ? freeCalendarForm.controls['holidayName']['value'] : null;

    accessorialFreeRuleType['customerAccessorialFreeRuleCalendar']['calendarYear'] = freeCalendarForm.controls['year']
      && freeCalendarForm.controls['year']['value'] ? parseFloat(freeCalendarForm.controls['year']['value']) : null;

    accessorialFreeRuleType['customerAccessorialFreeRuleCalendar']['firstDayChargeableIndicator'] =
      freeCalendarForm.controls['cannotBeFirstChargeableDay']
        && freeCalendarForm.controls['cannotBeFirstChargeableDay']['value'] ? 'Y' : 'N';

    accessorialFreeRuleType['customerAccessorialFreeRuleCalendar']['accessorialFreeRuleCalendarApplyTypeId'] =
      this.getFormControlValue(freeCalendarForm, 'applyIf');

    accessorialFreeRuleType['customerAccessorialFreeRuleCalendar']['accessorialFreeRuleCalendarApplyTypeName'] =
      this.getFormControlLabel(freeCalendarForm, 'applyIf');

    accessorialFreeRuleType['customerAccessorialFreeRuleCalendar']['accessorialFreeRuleEventTypeId'] =
      this.getFormControlValue(freeCalendarForm, 'eventTypes');

    accessorialFreeRuleType['customerAccessorialFreeRuleCalendar']['accessorialFreeRuleEventTypeName'] =
      this.getFormControlLabel(freeCalendarForm, 'eventTypes');

    accessorialFreeRuleType['customerAccessorialFreeRuleCalendar']
    ['customerAccessorialFreeRuleCalendarMonth'] = [];
    if (this.getFormControlLabel(freeCalendarForm, 'timeFrame') !== 'Weekly') {
      accessorialFreeRuleType['customerAccessorialFreeRuleCalendar']
      ['customerAccessorialFreeRuleCalendarMonth'].push({
        'calendarMonth': this.getFreeRuleMonth(freeCalendarForm),
        'customerAccessorialFreeRuleCalendarDay': this.getFreeRuleDayOfMonth(freeCalendarForm)
      });
    }
    return accessorialFreeRuleType;
  }
  getFreeRuleMonth(freeCalendarForm: FormGroup) {
    let calendarMonth = null;
    const month = freeCalendarForm.controls['months'] && freeCalendarForm.controls['months'].value ?
      freeCalendarForm.controls['months'].value : null;
    calendarMonth = month && month['label'] ? month['label'] : null;
    return calendarMonth;
  }
  getFreeRuleDayOfMonth(freeCalendarForm: FormGroup) {
    const customerAccessorialFreeRuleCalendarDay = [];
    const dayOfMonth = freeCalendarForm.controls['dayOfMonth'] && freeCalendarForm.controls['dayOfMonth'].value ?
      freeCalendarForm.controls['dayOfMonth'].value : null;
      if (dayOfMonth) {
        customerAccessorialFreeRuleCalendarDay.push(dayOfMonth['value']);
    }
    return customerAccessorialFreeRuleCalendarDay;
  }
  getFreeRuleOccurenceList(freeCalendarForm: FormGroup) {
    const customerAccessorialFreeRuleCalendarDayOccurrences = [];
    const calendarTypeControl = this.getFormControlLabel(freeCalendarForm, 'calendarType') ?
    this.getFormControlLabel(freeCalendarForm, 'calendarType').toLowerCase() : null ;
    if (calendarTypeControl === 'relative') {
      const controlName = this.getFormControlLabel(freeCalendarForm, 'timeFrame').toLowerCase() === 'monthly'
        ? 'occurrence' : 'appliesToOccurrence';
      const occurrenceList = freeCalendarForm.controls[controlName] && freeCalendarForm.controls[controlName].value ?
        freeCalendarForm.controls[controlName].value : null;
      if (occurrenceList && controlName === 'appliesToOccurrence') {
        occurrenceList.forEach(occurrence => {
          const occurrenceParam = {
            accessorialFrequencyTypeId: occurrence['value'],
            accessorialFrequencyTypeName: occurrence['label']
          };
          customerAccessorialFreeRuleCalendarDayOccurrences.push(occurrenceParam);
        });
      } else if (occurrenceList && controlName === 'occurrence') {
        const occurrenceParam = {
          accessorialFrequencyTypeId: occurrenceList['value'],
          accessorialFrequencyTypeName: occurrenceList['label']
        };
        customerAccessorialFreeRuleCalendarDayOccurrences.push(occurrenceParam);
      }
    }
    return customerAccessorialFreeRuleCalendarDayOccurrences;
  }
  getFreeRuleDayOfWeek(freeCalendarForm: FormGroup) {
    const calendarWeekDay = [];
    const dayOfWeekList = freeCalendarForm.controls['dayOfWeek'] && freeCalendarForm.controls['dayOfWeek'].value ?
      freeCalendarForm.controls['dayOfWeek'].value : null;
      const timeFrameValue = this.getFormControlLabel(freeCalendarForm, 'timeFrame') ?
      this.getFormControlLabel(freeCalendarForm, 'timeFrame').toLowerCase() : null;
    if (dayOfWeekList && timeFrameValue === 'weekly') {
      dayOfWeekList.forEach(dayOfWeek => {
        if (dayOfWeek) {
          const dayOfWeekParam = {
            calendarWeekDay: dayOfWeek['label']
          };
          calendarWeekDay.push(dayOfWeekParam);
        }
      });
    } else if (dayOfWeekList && timeFrameValue === 'monthly') {
      const dayOfWeekParam = {
        calendarWeekDay: dayOfWeekList['label']
      };
      calendarWeekDay.push(dayOfWeekParam);
    }
    return calendarWeekDay;
  }
  getFormControlValue(form: FormGroup, controlName: string) {
    return form.controls[controlName] && form.controls[controlName].value ? form.controls[controlName].value['value'] : null;
  }
  getFormControlLabel(form: FormGroup, controlName: string) {
    return form.controls[controlName] && form.controls[controlName].value ? form.controls[controlName].value['label'] : null;
  }
  createFreeFuleParamEventType(freeRuleModel: FormGroup, freeEventTypeModel: FormGroup) {
    const accessorialFreeRuleEventType = {};
    accessorialFreeRuleEventType['accessorialFreeRuleTypeId'] = this.getFormControlValue(freeRuleModel, 'freeRuleType');
    accessorialFreeRuleEventType['accessorialFreeRuleTypeName'] = this.getFormControlLabel(freeRuleModel, 'freeRuleType');
    accessorialFreeRuleEventType['customerAccessorialFreeRuleEvent'] = {};
    accessorialFreeRuleEventType['customerAccessorialFreeRuleEvent']
    ['accessorialFreeRuleEventTypeID'] = this.getFormControlValue(freeEventTypeModel, 'freeTypeEventName');
    accessorialFreeRuleEventType['customerAccessorialFreeRuleEvent']
    ['accessorialFreeRuleEventTypeName'] = this.getFormControlLabel(freeEventTypeModel, 'freeTypeEventName');

    accessorialFreeRuleEventType['customerAccessorialFreeRuleEvent']
    ['accessorialFreeRuleEventTimeframeTypeID'] = this.getFormControlValue(freeEventTypeModel, 'freeTimeEvent');
    accessorialFreeRuleEventType['customerAccessorialFreeRuleEvent']
    ['accessorialFreeRuleEventTimeFrameTypeName'] = this.getFormControlLabel(freeEventTypeModel, 'freeTimeEvent');

    accessorialFreeRuleEventType['customerAccessorialFreeRuleEvent']
    ['accessorialDayOfEventFreeRuleModifierId'] = this.getFormControlValue(freeEventTypeModel, 'freeAmountFirstEvent');

    accessorialFreeRuleEventType['customerAccessorialFreeRuleEvent']
    ['accessorialDayOfEventFreeRuleModifierName'] = this.getFormControlLabel(freeEventTypeModel, 'freeAmountFirstEvent');

    accessorialFreeRuleEventType['customerAccessorialFreeRuleEvent']
    ['accessorialDayOfEventFreeRuleModifierTime'] = freeEventTypeModel.controls['pickatimefirst'] &&
      freeEventTypeModel.controls['pickatimefirst'].value ?
      this.timeZoneService.convertTimeOnlytoUTC(freeEventTypeModel.controls['pickatimefirst'].value) : null;

    accessorialFreeRuleEventType['customerAccessorialFreeRuleEvent']
    ['accessorialDayAfterEventFreeRuleModifierTime'] = freeEventTypeModel.controls['pickatimesecond']
      && freeEventTypeModel.controls['pickatimesecond'].value ?
      this.timeZoneService.convertTimeOnlytoUTC(freeEventTypeModel.controls['pickatimesecond'].value) : null;

    accessorialFreeRuleEventType['customerAccessorialFreeRuleEvent']
    ['accessorialDayAfterEventFreeRuleModifierId'] = this.getFormControlValue(freeEventTypeModel, 'freeAmountSecondEvent');

    accessorialFreeRuleEventType['customerAccessorialFreeRuleEvent']
    ['accessorialDayAfterEventFreeRuleModifierName'] = this.getFormControlLabel(freeEventTypeModel, 'freeAmountFirstEvent');
    return accessorialFreeRuleEventType;
  }
  formatAmount(value: string, currencyPipe: CurrencyPipe) {
    let formattedRateAmount;
    const enteredAmount = value.replace(/[, ]/g, '').trim();
    const wholeAmount = enteredAmount.split('.')[0].substring(0, 7);
    const decimalAmount = enteredAmount.split('.')[1] || '';
    const amount = +`${wholeAmount}.${decimalAmount}`;
    if (isNaN(amount)) {
      formattedRateAmount = null;
    } else {
      const modifiedAmount = amount.toString().replace(/[, ]/g, '').trim();
      formattedRateAmount = currencyPipe.transform(modifiedAmount, '', '', '1.2-4');
    }
    return formattedRateAmount;
  }
  averageRulesFramer(averagingRulesModel: AveragingRulesModel, ruleType: string, formValue?: SpecificDaysInterface | DayOfWeek) {
    return {
      customerAccessorialAveragePeriodId: null,
      accessorialFrequencyTypeId: (ruleType === 'onTheDayMonth') ?
        averagingRulesModel.averagingForm.controls['frequency'].value.value : null,
      accessorialFrequencyTypeName: (ruleType === 'onTheDayMonth') ?
        averagingRulesModel.averagingForm.controls['frequency'].value.label : null,
      accessorialFrequencySubTypeId: (ruleType === 'onTheDayMonth') ?
        averagingRulesModel.averagingForm.controls['monthlyDay'].value.value : null,
      accessorialFrequencySubTypeName: (ruleType === 'onTheDayMonth' &&
        averagingRulesModel.averagingForm.controls['monthlyDay'].value.value) ?
        averagingRulesModel.averagingForm.controls['monthlyDay'].value.label : null,
      averagePeriodWeekDayName: this.dayOfWeek(averagingRulesModel, ruleType, formValue),
      averagePeriodMonthDayNumber: (ruleType === 'eachDayMonth') ? formValue.value : null
    };
  }
  dayOfWeek(averagingRulesModel: AveragingRulesModel, ruleType: string, formValue?: SpecificDaysInterface | DayOfWeek) {
    let weekDay = null;
    if (ruleType === 'onTheDayMonth' && averagingRulesModel.averagingForm.controls['monthlyDay'].value.value === null) {
      weekDay = averagingRulesModel.averagingForm.controls['monthlyDay'].value.label;
    } else if (ruleType === 'week') {
      weekDay = formValue.value;
    }
    return weekDay;
  }
  populateAgreementLevel(documentationDate: DocumentationDate, createRuleModel: CreateRuleModel, changeDetector) {
    if (documentationDate) {
      createRuleModel.rulesForm.controls['expirationDate'].
        setValue(this.dateFormatter(documentationDate['agreementExpirationDate']));
      createRuleModel.rulesForm.controls['effectiveDate'].setValue(this.dateFormatter(new Date()));
      createRuleModel.expirationDate = this.dateFormatter(documentationDate['agreementExpirationDate']);
      createRuleModel.effectiveDate = this.dateFormatter(new Date());
      createRuleModel.agreementEffectiveDate = createRuleModel.effectiveDate;
      createRuleModel.agreementExpirationDate = createRuleModel.expirationDate;
      changeDetector.detectChanges();
    }
  }
  populateRuleType(ruleType: RuleType, createRuleModel: CreateRuleModel, changeDetector) {
    if (ruleType) {
      const ruleTypes = ruleType['_embedded']['accessorialRuleTypes'];
      const ruleTypeValues = ruleTypes.map((ruleTypeValue) => {
        return {
          label: ruleTypeValue.accessorialRuleTypeName,
          value: ruleTypeValue['accessorialRuleTypeID']
        };
      });
    const notificationOnly = ruleTypeValues.filter((elemnt) => elemnt.label.toLowerCase() === 'notification');
    createRuleModel.ruleType = notificationOnly;
      changeDetector.detectChanges();
    }
  }
  populateChargeType(chargeTypeResponse: ChargeCodeResponseInterface[], createRuleModel: CreateRuleModel, changeDetector) {
    if (!utils.isEmpty(chargeTypeResponse)) {
      createRuleModel.chargeType =
        chargeTypeResponse.map((value: ChargeCodeResponseInterface) => {
          return {
            label: `${value['chargeTypeName']} (${value['chargeTypeCode']})`,
            value: value['chargeTypeID'],
            description: value['chargeTypeCode']
          };
        });
      createRuleModel.chargeTypeLoading = false;
      changeDetector.detectChanges();
    }
  }
  dateFormatter(value: string | Date): string {
    return moment(value).format('MM/DD/YYYY');
  }
  populateGracePeriod(gracePeriod: any, createRuleModel: CreateRuleModel, changeDetector) {
    if (gracePeriod) {
      const gracePeriods = gracePeriod['_embedded']['pricingUnitOfTimeMeasurementAssociations'];
      const gracePeriodValues = gracePeriods.map((gracePeriodValue) => {
        return {
          label: gracePeriodValue.unitOfTimeMeasurementCode,
          value: gracePeriodValue.pricingUnitOfTimeMeasurementAssociationId
        };
      });
      createRuleModel.gracePeriod = gracePeriodValues;
      changeDetector.detectChanges();
    }
  }
  clearFreeRuleFormOnSaveAndCreateNew(freeRuleTab, freeRuleType) {
    if (freeRuleType && freeRuleType.label === 'Quantity') {
      this.clearQuantityForm(freeRuleTab);
    } else if (freeRuleType && freeRuleType.label === 'Event') {
      this.clearEventForm(freeRuleTab);
    } else if (freeRuleType && freeRuleType.label === 'Calendar') {
      this.clearCalendarForm(freeRuleTab);
    }
  }
  clearQuantityForm(freeRuleTab) {
    utils.forIn(freeRuleTab.freeRuleModel.freeRulesForm.controls, (value, name: string) => {
      if (name !== 'freeRuleType') {
        freeRuleTab.freeRuleModel.freeRulesForm.removeControl(name);
      } else if (name === 'freeRuleType') {
        freeRuleTab.freeRuleModel.freeRulesForm.controls[name].reset();
      }
    });
    freeRuleTab.freeRuleModel.isFreeRuleTypeQuantity = false;
    freeRuleTab.freeRuleModel.isFreeRuleTimeType = false;
    freeRuleTab.freeRuleModel.isFreeRuleDistanceType = false;
  }
  clearEventForm(freeRuleTab) {
    utils.forIn(freeRuleTab.freeRuleModel.freeRulesForm.controls, (value, name: string) => {
      if (name === 'freeRuleType') {
        freeRuleTab.freeRuleModel.freeRulesForm.controls[name].reset();
      }
    });
    utils.forIn(freeRuleTab.freeTypeEventTab.freeEventTypeModel.freeEventTypeForm.controls, (value, name: string) => {
      if (freeRuleTab.freeTypeEventTab.freeEventTypeModel.freeEventTypeForm.controls[name]) {
        freeRuleTab.freeTypeEventTab.freeEventTypeModel.freeEventTypeForm.removeControl(name);
      }
    });
    freeRuleTab.freeRuleModel.isFreeRuleTypeEvent = false;
    freeRuleTab.freeTypeEventTab.freeEventTypeModel.isFreeRuleFirstTimeIndicator = false;
    freeRuleTab.freeTypeEventTab.freeEventTypeModel.isfreeRuleDayOfEventAndDayAfter = false;
    freeRuleTab.freeTypeEventTab.freeEventTypeModel.isFreeRuleSecondTimeIndicator = false;
  }
  clearCalendarForm(freeRuleTab) {
    utils.forIn(freeRuleTab.freeRuleModel.freeRulesForm.controls, (controlValue, controlName: string) => {
      if (controlName === 'freeRuleType') {
        freeRuleTab.freeRuleModel.freeRulesForm.controls[controlName].reset();
      }
    });
    utils.forIn(freeRuleTab.freeTypeCalendarTab.freeCalendarModel.freeCalendarForm.controls, (controlValue, controlName: string) => {
      if (freeRuleTab.freeTypeCalendarTab.freeCalendarModel.freeCalendarForm.controls[controlName]) {
        freeRuleTab.freeTypeCalendarTab.freeCalendarModel.freeCalendarForm.removeControl(controlName);
      }
    });
    freeRuleTab.freeRuleModel.isFreeRuleTypeCalendar = false;
    freeRuleTab.freeTypeCalendarTab.freeCalendarModel.isHolidayCalendarType = false;
    freeRuleTab.freeTypeCalendarTab.freeCalendarModel.isRelativeCalendarType = false;
    freeRuleTab.freeTypeCalendarTab.freeCalendarModel.isSpecificCalendarType = false;
    freeRuleTab.freeTypeCalendarTab.freeCalendarModel.isRelativeTimeFrameWeekly = false;
    freeRuleTab.freeTypeCalendarTab.freeCalendarModel.isRelativeTimeFrameMonthly = false;
    freeRuleTab.freeTypeCalendarTab.freeCalendarModel.isCannotBeChargeableDay = false;
  }
  validateEffectiveDate(createRuleModel: CreateRuleModel) {
    if (createRuleModel.rulesForm.controls['effectiveDate'].value &&
      createRuleModel.rulesForm.controls['expirationDate'].value &&
      (new Date(createRuleModel.rulesForm.controls['effectiveDate'].value) >
        new Date(createRuleModel.rulesForm.controls['expirationDate'].value))) {
      createRuleModel.inValidDate = true;
    } else {
      createRuleModel.inValidDate = false;
    }
  }
  setFormErrors(parentScope: CreateStandardRulesComponent, changeDetector: ChangeDetectorRef) {
    const createRuleModel = parentScope.createRuleModel;
    const effError = (createRuleModel.inValidEffDate || createRuleModel.inValidDate);
    const expError = (createRuleModel.inValidExpDate || createRuleModel.inValidDate);
    createRuleModel.rulesForm.controls.effectiveDate.setErrors(
      DateValidation.setDateFieldError( createRuleModel.rulesForm.controls['effectiveDate'].errors,
       createRuleModel.rulesForm.controls['effectiveDate'].value,
      effError));
      createRuleModel.rulesForm.controls.expirationDate.setErrors(
      DateValidation.setDateFieldError( createRuleModel.rulesForm.controls['expirationDate'].errors,
       createRuleModel.rulesForm.controls['expirationDate'].value,
      expError));
  }
  setValidation(fieldName: string, createRuleModel: CreateRuleModel) {
    if (!createRuleModel.rulesForm.controls[fieldName].value) {
      createRuleModel.rulesForm.controls[fieldName].setErrors({
        'required': true
      });
    }
  }
  dateReset(createRuleModel: CreateRuleModel, changeDetector) {
    createRuleModel.rulesForm.controls['effectiveDate']
      .setValue(createRuleModel.agreementEffectiveDate);
    createRuleModel.rulesForm.controls['expirationDate'].setValue(createRuleModel.agreementExpirationDate);
    createRuleModel.effectiveDate = createRuleModel.agreementEffectiveDate;
    createRuleModel.expirationDate = createRuleModel.agreementExpirationDate;
    createRuleModel.inValidEffDate = false;
    createRuleModel.inValidDate = false;
    createRuleModel.inValidExpDate = false;
    changeDetector.detectChanges();
  }
  postErrorHandling(postResponeError: Error, createRuleModel: CreateRuleModel,
    messageService: MessageService, changeDetector: ChangeDetectorRef, topElemRef) {
    if ((postResponeError['error'] && postResponeError['error']['errors'][0]) &&
      (postResponeError['error']['errors'][0]['code'] === 'FREERULES_DUPLICATE_EXISTS' ||
        postResponeError['error']['errors'][0]['code'] === 'RULES_DUPLICATE_EXISTS' ||
        postResponeError['error']['errors'][0]['code'] === 'FINAL_NOTIFY_FIRST_AUTHORIZATION_EXIST')) {
      createRuleModel.errorMsg = true;
      createRuleModel.isDetailsSaved = false;
      this.showDuplicateRuleError(createRuleModel, messageService, changeDetector, topElemRef, postResponeError);
    } else {
      this.toastMessage(messageService, 'error', 'Error', postResponeError['error']['errors'][0]['errorMessage']);
    }
  }
  showDuplicateRuleError(createRuleModel: CreateRuleModel,
    messageService: MessageService, changeDetector: ChangeDetectorRef, topElemRef, postResponeError) {
    createRuleModel.inlineErrormessage = [];
    messageService.clear();
    const identicalRatesMessage = 'The combination of options are identical to an existing rule. ';
    const cancelRateMessage = 'Please cancel creating this rule or make changes to the existing fields';
    createRuleModel.inlineErrormessage.push({
      severity: 'error',
      summary: postResponeError['error']['errors'][0]['code'] === 'FINAL_NOTIFY_FIRST_AUTHORIZATION_EXIST' ?
        'Rule Violation' : 'Rule Already Exists',
      detail: postResponeError['error']['errors'][0]['code'] === 'FINAL_NOTIFY_FIRST_AUTHORIZATION_EXIST' ?
        postResponeError['error']['errors'][0]['errorMessage'] : `${identicalRatesMessage}${cancelRateMessage}.`
    });
    topElemRef.nativeElement.scrollIntoView();
    changeDetector.detectChanges();
  }
  validateRuleForm(createRuleModel: CreateRuleModel): boolean {
    let ruleFormValid = true;
    if (createRuleModel.isArrival) {
      ruleFormValid = this.arrivalRuleFormValidation(createRuleModel);
    } else if (!createRuleModel.isArrival && !createRuleModel.rulesForm.valid) {
      ruleFormValid = false;
    }
    return ruleFormValid;
  }
  arrivalRuleFormValidation(createRuleModel: CreateRuleModel) {
    let ruleFormValid = true;
    const formFields = ['effectiveDate', 'expirationDate', 'chargeType', 'ruleType'];
    formFields.forEach(fieldName => {
      if (createRuleModel.rulesForm.controls[fieldName].invalid) {
        ruleFormValid = false;
      }
    });
    return ruleFormValid;
  }
  dateCheck(createRuleModel: CreateRuleModel) {
    if (createRuleModel.agreementEffectiveDate !== createRuleModel.effectiveDate ||
      createRuleModel.agreementExpirationDate !== createRuleModel.expirationDate) {
      createRuleModel.isDateChanged = true;
    }
  }
  isRuleFieldsValid(createRuleModel: CreateRuleModel) {
    if (createRuleModel.isArrival) {
      this.rulefieldsTouched(createRuleModel);
    } else if (!createRuleModel.isArrival) {
      utils.forIn(createRuleModel.rulesForm.controls, (value, name: string) => {
        createRuleModel.rulesForm.controls[name].markAsTouched();
      });
    }
  }
  rulefieldsTouched(createRuleModel: CreateRuleModel) {
    const formFields = ['effectiveDate', 'expirationDate', 'chargeType', 'ruleType'];
    utils.forIn(formFields, (name: string) => {
      createRuleModel.rulesForm.controls[name].markAsTouched();
    });
  }
  toastMessage(messageService: MessageService, key: string, type: string, data: string) {
    const message = {
      severity: key,
      summary: type,
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
  errorMsgOnSave(messageService: MessageService) {
    messageService.clear();
    messageService.add({
      severity: 'error', summary: 'Missing Required Information',
      detail: 'Provide the required information in the highlighted fields and submit the form again'
    });
  }
}



