import { FreeEventNameTypeInterface, FreeEventTimeInterface, EventFreeAmountFirstInterface, EventFreeAmount,
   EventFreeAmountSecondInterface } from './free-event-type.interface';
import { FormGroup } from '@angular/forms';

export class FreeEventTypeModel {
  isSubscribeFlag: boolean;
  freeRuleEventNameTypes: FreeEventNameTypeInterface[];
  freeTypeEventNameFiltered: FreeEventNameTypeInterface[];
  freeRuleEventFreeTimeTypes: FreeEventTimeInterface[];
  freeTypeEventFreeTimeFiltered: FreeEventTimeInterface[];
  eventFreeAmountFirstTypes: EventFreeAmountFirstInterface[];
  eventFreeAmountFirstFiltered: EventFreeAmountFirstInterface[];
  eventFreeAmountSecondTypes: EventFreeAmountSecondInterface[];
  eventFreeAmountSecondFiltered: EventFreeAmountSecondInterface[];
  masterEventFreeAmountTypes: EventFreeAmount;

  freeEventTypeForm: FormGroup;
  isFreeRuleDayOfEventName: boolean;
  isFreeRuleEventFreeTime: boolean;
  freeRuleDayOfEvent: object;
  freeRuleDayOfEventAndDayAfter: object;
  isfreeRuleDayOfEventAndDayAfter: boolean;

  eventFreeAmountFirstDayFree: object;
  eventFreeAmountFirstDayFreeIfEventTimeAfter: object;
  eventFreeAmountFirstDayFreeIfEventTimeBefore: object;
  iseventFreeAmountFirstDayFree: boolean;

  eventFreeAmountSecondDayFree: object;
  eventFreeAmountSecondDayFreeIfEventTimeAfter: object;
  eventFreeAmountSecondDayFreeIfEventTimeBefore: object;

  isFreeRuleFirstTimeIndicator: boolean;
  isFreeRuleSecondTimeIndicator: boolean;

  isPickATimeFirstValidationError: boolean;
  isPickATimeSecondValidationError: boolean;

  isDayBeforeSelectionRule: boolean;
  isDayAfterSelectionRule: boolean;

  isDayBeforeSelectionRuleValidationMessage: string;
  isDayAfterSelectionRuleValidationMessage: string;
  constructor() {
    this.isSubscribeFlag = true;
    this.freeRuleEventNameTypes = [];
    this.freeTypeEventNameFiltered = [];
    this.freeRuleEventFreeTimeTypes = [];
    this.freeTypeEventFreeTimeFiltered = [];
    this.eventFreeAmountFirstTypes = [];
    this.eventFreeAmountFirstFiltered = [];
    this.eventFreeAmountSecondTypes = [];
    this.eventFreeAmountSecondFiltered = [];
    this.isFreeRuleDayOfEventName = false;

    this.isfreeRuleDayOfEventAndDayAfter = false;

    this.isFreeRuleFirstTimeIndicator = false;
    this.isFreeRuleSecondTimeIndicator = false;
     this.freeRuleDayOfEvent = {
      accessorialFreeRuleEventTimeframeTypeID : 1,
      accessorialFreeRuleEventTimeframeTypeName : 'Day of Event'
     };
     this.freeRuleDayOfEventAndDayAfter = {
      accessorialFreeRuleEventTimeframeTypeID : 2,
      accessorialFreeRuleEventTimeframeTypeName : 'Day of Event and Day After'
     };


     this.eventFreeAmountFirstDayFree = {
      accessorialFreeRuleEventModifierTypeID : 1,
      accessorialFreeRuleEventModifierTypeName : 'Day Free'
     };
     this.eventFreeAmountFirstDayFreeIfEventTimeAfter = {
      accessorialFreeRuleEventModifierTypeID : 2,
      accessorialFreeRuleEventModifierTypeName : 'Day Free if Event Time After'
     };
     this.eventFreeAmountFirstDayFreeIfEventTimeBefore = {
      accessorialFreeRuleEventModifierTypeID : 3,
      accessorialFreeRuleEventModifierTypeName : 'Day Free if Event Time Before'
     };


     this.eventFreeAmountSecondDayFree = {
      accessorialFreeRuleEventModifierTypeID : 1,
      accessorialFreeRuleEventModifierTypeName : 'Day Free'
     };
     this.eventFreeAmountSecondDayFreeIfEventTimeAfter = {
      accessorialFreeRuleEventModifierTypeID : 2,
      accessorialFreeRuleEventModifierTypeName : 'Day Free if Event Time After'
     };
     this.eventFreeAmountSecondDayFreeIfEventTimeBefore = {
      accessorialFreeRuleEventModifierTypeID : 3,
      accessorialFreeRuleEventModifierTypeName : 'Day Free if Event Time Before'
     };
     this.isDayBeforeSelectionRuleValidationMessage = `Day after Event  free
     time should be equal or before than  the Day of Event free time.`;
     this.isDayAfterSelectionRuleValidationMessage = `Day after Event  free time should be equal
     or later than  the Day of Event free time.`;
  }
}
