import { FormGroup } from '@angular/forms';
import { CalendarTypes, AutoCompleteInterface } from './free-calendar.interface';
export class FreeCalendarModel {
    freeCalendarForm: FormGroup;
    isSubscribeFlag: boolean;
    isSpecificCalendarType: boolean;
    isRelativeCalendarType: boolean;
    isHolidayCalendarType: boolean;
    isRelativeTimeFrameWeekly: boolean;
    isRelativeTimeFrameMonthly: boolean;
    isEventName: boolean;
    isRelativeWeeklyAppliesToOccurence: boolean;
    isCannotBeChargeableDay: boolean;
    holidayCalendarType: object;
    specificCalendarType: object;
    relativeCalendarType: object;
    relativeTimeFrameWeekly: object;
    relativeTimeFrameMonthly: object;
    applyIfDayAfterEvent: object;
    applyIfDayOfEvent: object;
    applyIfDayAlways: object;
    appliesToOccurrenceLast: object;
    calendarTypes: AutoCompleteInterface[];
    calendarTypesFiltered: AutoCompleteInterface[];
    timeFrames: AutoCompleteInterface[];
    timeFramesFiltered: AutoCompleteInterface[];
    dayOfWeek: AutoCompleteInterface[];
    dayOfWeekFiltered: AutoCompleteInterface[];
    applyIf: AutoCompleteInterface[];
    applyIfFiltered: AutoCompleteInterface[];
    eventTypes: AutoCompleteInterface[];
    eventTypesFiltered: AutoCompleteInterface[];
    appliesToOccurrence: AutoCompleteInterface[];
    appliesToOccurrenceFiltered: AutoCompleteInterface[];
    occurrence: AutoCompleteInterface[];
    occurrenceFiltered: AutoCompleteInterface[];
    months: AutoCompleteInterface[];
    monthsFiltered: AutoCompleteInterface[];
    dayOfMonth: AutoCompleteInterface[];
    dayOfMonthFiltered: AutoCompleteInterface[];
    constructor() {
        this.isSubscribeFlag = true;
        this.isHolidayCalendarType = false;
        this.isRelativeCalendarType = false;
        this.isSpecificCalendarType = false;
        this.isRelativeTimeFrameWeekly = false;
        this.isRelativeTimeFrameMonthly = false;
        this.isCannotBeChargeableDay = false;
        this.calendarTypes = [];
        this.calendarTypesFiltered = [];
        this.timeFrames = [];
        this.timeFramesFiltered = [];
        this.dayOfWeek = [];
        this.dayOfWeekFiltered = [];
        this.applyIf = [];
        this.applyIfFiltered = [];
        this.eventTypes = [];
        this.eventTypesFiltered = [];
        this.appliesToOccurrence = [];
        this.appliesToOccurrenceFiltered = [];
        this.occurrence = [];
        this.occurrenceFiltered = [];
        this.months = [];
        this.monthsFiltered = [];
        this.dayOfMonth = [];
        this.dayOfMonthFiltered = [];
        this.holidayCalendarType = {
            calendarTypeId: 1,
            calendarTypeName: 'Holiday'
        };
        this.specificCalendarType = {
            calendarTypeId: 2,
            calendarTypeName: 'Specific'
        };
        this.relativeCalendarType = {
            calendarTypeId: 3,
            calendarTypeName: 'Relative'
        };
        this.relativeTimeFrameWeekly = {
            pricingAveragePeriodTypeId: 1,
            pricingAveragePeriodTypeName: 'Weekly',
        };
        this.relativeTimeFrameMonthly = {
            pricingAveragePeriodTypeId: 2,
            pricingAveragePeriodTypeName: 'Monthly',
        };
        this.applyIfDayAfterEvent = {
            accessorialFreeRuleCalendarApplyName: 'Day After Event',
            accessorialFreeRuleCalendarApplyTypeId: 3
        };
        this.applyIfDayOfEvent = {
            accessorialFreeRuleCalendarApplyName: 'Day of Event',
            accessorialFreeRuleCalendarApplyTypeId: 4
        };
        this.applyIfDayAlways = {
            accessorialFreeRuleCalendarApplyName: 'Always',
            accessorialFreeRuleCalendarApplyTypeId: 1,
        };
        this.appliesToOccurrenceLast = {
            accessorialFrequencyTypeName: 'Last',
            accessorialFrequencyTypeId: 5,
        };
    }
}
