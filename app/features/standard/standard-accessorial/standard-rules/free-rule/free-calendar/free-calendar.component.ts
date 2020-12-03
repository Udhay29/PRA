import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormControl, ValidatorFn, FormGroup, AbstractControl } from '@angular/forms';
import { FreeCalendarModel } from './model/free-calendar.model';
import {
  CalendarTypes, TimeFrames, AutoCompleteInterface, DayOfWeekResponse, ApplyIfResponse,
  EventTypesResponse, AppliesToOccurenceResponse, MonthsResponse
} from './model/free-calendar.interface';
import { FreeCalendarService } from './service/free-calendar.service';
import { FreeCalendarUtilityService } from './service/free-calendar-utility.service';
import { takeWhile } from 'rxjs/operators';

const yearValidator: ValidatorFn = (fg: FormGroup) => {
  let dayOfMonthValue = '', monthValue = '', yearValue: number, isLeapYear: boolean;
  const dayOfMonthControl = fg.get('dayOfMonth');
  const monthControl = fg.get('months');
  const yearControl = fg.get('year');
  if (dayOfMonthControl && dayOfMonthControl.value) {
    dayOfMonthValue = dayOfMonthControl['value'].length
      && dayOfMonthControl['value'].length > 0 ? dayOfMonthControl['value'][dayOfMonthControl['value'].length - 1]['value'] : null;
  }
  if (monthControl && monthControl.value && monthControl['value'].value) {
    monthValue = monthControl['value'].value;
  }
  if (yearControl && yearControl.value) {
    yearValue = parseFloat(yearControl['value']);
    isLeapYear = ((yearValue % 4 === 0) && (yearValue % 100 !== 0)) || (yearValue % 400 === 0);
  }
  if (yearValue && monthValue && dayOfMonthValue && !isLeapYear) {
    return parseFloat(monthValue) === 2 && parseFloat(dayOfMonthValue) > 28 ? { invalidDayOfMonth: true } : null;
  }
  return null;
};

@Component({
  selector: 'app-free-calendar',
  templateUrl: './free-calendar.component.html',
  styleUrls: ['./free-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FreeCalendarComponent implements OnInit {
  freeCalendarModel: FreeCalendarModel;
  constructor(private readonly formBuilder: FormBuilder,
    private readonly freeCalendarService: FreeCalendarService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly freeCalendarUtilityService: FreeCalendarUtilityService) {
    this.freeCalendarModel = new FreeCalendarModel();
  }

  ngOnInit() {
    this.createFreeCalendarForm();
    this.getCalendarTypes();
  }
  createFreeCalendarForm() {
    this.freeCalendarModel.freeCalendarForm = this.formBuilder.group({
      calendarType: ['', Validators.required]
    }, { validator: yearValidator });
  }
  getCalendarTypes() {
    this.freeCalendarService.getCalendarTypes().pipe(takeWhile(() => this.freeCalendarModel.isSubscribeFlag))
      .subscribe((calendarTypes: CalendarTypes) => {
        if (calendarTypes) {
          const calendarTypeValues = calendarTypes['_embedded']['accessorialFreeRuleCalendarTypes'].map((calendarAccesorialTypes) => {
            return {
              label: calendarAccesorialTypes['accessorialFreeRuleCalendarTypeName'],
              value: calendarAccesorialTypes['accessorialFreeRuleCalendarTypeId']
            };
          });
          this.freeCalendarModel.calendarTypes = calendarTypeValues;
        }
        this.changeDetector.detectChanges();
      });
  }
  getTimeFrames() {
    this.freeCalendarService.getTimeFrames().pipe(takeWhile(() => this.freeCalendarModel.isSubscribeFlag))
      .subscribe((timeFrames: TimeFrames) => {
        if (timeFrames) {
          const timeFrameValues = timeFrames['_embedded']['pricingAveragePeriodTypes'].map((averagePeriodTypes) => {
            return {
              label: averagePeriodTypes['pricingAveragePeriodTypeName'],
              value: averagePeriodTypes['pricingAveragePeriodTypeId']
            };
          });
          this.freeCalendarModel.timeFrames = timeFrameValues;
        }
        this.changeDetector.detectChanges();
      });
  }
  getDayOfWeek() {
    this.freeCalendarService.getDayOfWeek().pipe(takeWhile(() => this.freeCalendarModel.isSubscribeFlag))
      .subscribe((dayOfWeek: DayOfWeekResponse[]) => {
        if (dayOfWeek) {
          const dayOfWeekValues = dayOfWeek.map((dayOfWeekValue) => {
            return {
              label: dayOfWeekValue['calendarWeekDay'],
              value: dayOfWeekValue['customerAccessorialFreeRuleCalendarWeekDayId']
            };
          });
          this.freeCalendarModel.dayOfWeek = dayOfWeekValues;
        }
        this.changeDetector.detectChanges();
      });
  }
  getApplyIf() {
    this.freeCalendarService.getApplyIf().pipe(takeWhile(() => this.freeCalendarModel.isSubscribeFlag))
      .subscribe((applyIf: ApplyIfResponse) => {
        if (applyIf) {
          const applyIfValues = applyIf['_embedded']['accessorialFreeRuleCalendarApplyTypes'].map((applyTypeValue) => {
            return {
              label: applyTypeValue['accessorialFreeRuleCalendarApplyName'],
              value: applyTypeValue['accessorialFreeRuleCalendarApplyTypeId']
            };
          });
          this.freeCalendarModel.applyIf = applyIfValues;
          this.setApplyIfDefault();
        }
        this.changeDetector.detectChanges();
      });
  }
  getEventTypes() {
    this.freeCalendarService.getEvent().pipe(takeWhile(() => this.freeCalendarModel.isSubscribeFlag))
      .subscribe((eventTypes: EventTypesResponse) => {
        if (eventTypes) {
          const eventTypeValues = eventTypes['_embedded']['accessorialFreeRuleEventTypes'].map((eventTypeValue) => {
            return {
              label: eventTypeValue['accessorialFreeRuleEventTypeName'],
              value: eventTypeValue['accessorialFreeRuleEventTypeId']
            };
          });
          this.freeCalendarModel.eventTypes = eventTypeValues;
        }
        this.changeDetector.detectChanges();
      });
  }
  getAppliesToOccurence() {
    this.freeCalendarService.getAppliesToOccurence().pipe(takeWhile(() => this.freeCalendarModel.isSubscribeFlag))
      .subscribe((appliesToOccurence: AppliesToOccurenceResponse) => {
        if (appliesToOccurence) {
          const appliesToOccurenceValues = appliesToOccurence['_embedded']['accessorialFrequencyTypes'].map((appliesToOccurenceValue) => {
            return {
              label: appliesToOccurenceValue['accessorialFrequencyTypeName'],
              value: appliesToOccurenceValue['accessorialFrequencyTypeId']
            };
          });
          this.freeCalendarModel.appliesToOccurrence = appliesToOccurenceValues.filter((occurence) => {
            return occurence['value'] !== this.freeCalendarModel.appliesToOccurrenceLast['accessorialFrequencyTypeId'];
          });
        }
        this.changeDetector.detectChanges();

        if (appliesToOccurence) {
          const occurenceValues = appliesToOccurence['_embedded']['accessorialFrequencyTypes'].map((accesorialFrequencyValue) => {
            return {
              label: accesorialFrequencyValue['accessorialFrequencyTypeName'],
              value: accesorialFrequencyValue['accessorialFrequencyTypeId']
            };
          });
          this.freeCalendarModel.occurrence = occurenceValues;
        }
        this.changeDetector.detectChanges();
      });
  }
  getFreeRuleCalendarMonth() {
    this.freeCalendarService.getFreeRuleCalendarMonth().pipe(takeWhile(() => this.freeCalendarModel.isSubscribeFlag))
      .subscribe((months: MonthsResponse[]) => {
        if (months) {
          const monthValues = months.map((monthValue) => {
            return {
              label: monthValue['calendarMonth'],
              value: monthValue['customerAccessorialFreeRuleCalendarMonthId']
            };
          });
          this.freeCalendarModel.months = monthValues;
        }
        this.changeDetector.detectChanges();
      });
  }
  getDayOfMonth(monthId: number) {
    this.freeCalendarService.getDayOfMonth(monthId).pipe(takeWhile(() => this.freeCalendarModel.isSubscribeFlag))
      .subscribe((months) => {
        this.freeCalendarUtilityService.populateDayOfMOnth(months, this.freeCalendarModel, this.changeDetector);
      });
  }
  onTypeCalendarAutoComplete(event: Event, controlName: string) {
    this.freeCalendarUtilityService.onTypeCalendarAutoComplete(event, controlName,
      this.freeCalendarModel, this.changeDetector);
  }
  onCalendarFormControlBlur(event: Event, controlName: string) {
    if (this.freeCalendarModel.freeCalendarForm.controls[controlName].value &&
      !event.target['value']) {
      this.freeCalendarModel.freeCalendarForm.controls[controlName].setValue(null);
      switch (controlName) {
        case 'calendarType':
          this.onApplyIfReset();
          this.onTimeFrameReset();
          this.onCalendarTypeReset();
          break;
        case 'timeFrame':
          this.onApplyIfReset();
          this.onTimeFrameReset();
          break;
        case 'applyIf':
          this.onApplyIfReset();
          break;
      }
    }
  }
  onCalendarTypeReset() {
    this.freeCalendarModel.isHolidayCalendarType = false;
    this.freeCalendarModel.isRelativeCalendarType = false;
    this.freeCalendarModel.isSpecificCalendarType = false;
    this.freeCalendarUtilityService.removeSpecificAndRelativeForm(this.freeCalendarModel);
  }
  onTimeFrameReset() {
    const weeklyControls = ['dayOfWeek', 'applyIf'];
    const monthlyControls = ['applyIf', 'months', 'dayOfWeek', 'occurrence'];
    this.freeCalendarModel.isRelativeTimeFrameWeekly = false;
    this.freeCalendarModel.isRelativeTimeFrameMonthly = false;
    this.freeCalendarUtilityService.removeControlsFromForm(this.freeCalendarModel, weeklyControls);
    this.freeCalendarUtilityService.removeControlsFromForm(this.freeCalendarModel, monthlyControls);
  }
  onApplyIfReset() {
    const removeControls = ['eventTypes', 'appliesToOccurrence', 'cannotBeFirstChargeableDay'];
    this.freeCalendarModel.isEventName = false;
    this.freeCalendarModel.isRelativeWeeklyAppliesToOccurence = false;
    this.freeCalendarModel.isCannotBeChargeableDay = false;
    this.freeCalendarUtilityService.removeControlsFromForm(this.freeCalendarModel, removeControls);
  }
  onSelectCalendarType(eventValue: number) {
    const specificControls = ['applyIf', 'months', 'dayOfMonth'];
    this.onCalendarTypeReset();
    this.onApplyIfReset();
    this.onTimeFrameReset();
    if (eventValue === this.freeCalendarModel.specificCalendarType['calendarTypeId']) {
      this.freeCalendarUtilityService.addControlsToForm(this.freeCalendarModel, specificControls, true);
      this.freeCalendarUtilityService.addControlsToForm(this.freeCalendarModel, ['holidayName'], false);
      this.freeCalendarUtilityService.addControlsToForm(this.freeCalendarModel, 'year', false , [this.currentYearValidator] );
      this.getApplyIf();
      this.getEventTypes();
      this.getFreeRuleCalendarMonth();
      this.freeCalendarModel.isSpecificCalendarType = true;
    } else if (eventValue === this.freeCalendarModel.relativeCalendarType['calendarTypeId']) {
      this.freeCalendarModel.isRelativeCalendarType = true;
      this.getTimeFrames();
      this.getApplyIf();
      this.getEventTypes();
      this.getAppliesToOccurence();
      this.getDayOfWeek();
      this.getFreeRuleCalendarMonth();
      this.freeCalendarUtilityService.addControlsToForm(this.freeCalendarModel, ['timeFrame'], true);
    } else if (eventValue === this.freeCalendarModel.holidayCalendarType['calendarTypeId']) {
      this.freeCalendarModel.isHolidayCalendarType = true;
    }
    this.changeDetector.detectChanges();
  }
  onSelectTimeFrame(eventValue: number) {
    const weeklyControls = ['dayOfWeek', 'applyIf'];
    const monthlyControls = ['applyIf', 'months', 'dayOfWeek', 'occurrence'];
    this.onTimeFrameReset();
    this.onApplyIfReset();
    if (eventValue === this.freeCalendarModel.relativeTimeFrameWeekly['pricingAveragePeriodTypeId']) {
      this.freeCalendarModel.isRelativeTimeFrameWeekly = true;
      this.freeCalendarUtilityService.addControlsToForm(this.freeCalendarModel, weeklyControls, true);
    } else if (eventValue === this.freeCalendarModel.relativeTimeFrameMonthly['pricingAveragePeriodTypeId']) {
      this.freeCalendarModel.isRelativeTimeFrameMonthly = true;
      this.freeCalendarUtilityService.addControlsToForm(this.freeCalendarModel, monthlyControls, true);
    }
    this.setApplyIfDefault();
    this.changeDetector.detectChanges();
  }
  onSelectApplyIf(eventValue: number) {
    this.onApplyIfReset();
    this.changeDetector.detectChanges();
    if (eventValue === this.freeCalendarModel.applyIfDayOfEvent['accessorialFreeRuleCalendarApplyTypeId'] ||
      eventValue === this.freeCalendarModel.applyIfDayAfterEvent['accessorialFreeRuleCalendarApplyTypeId']
    ) {
      this.freeCalendarModel.isEventName = true;
      this.freeCalendarUtilityService.addControlsToForm(this.freeCalendarModel, 'eventTypes', true);
    }
    if (eventValue !== this.freeCalendarModel.applyIfDayAlways['accessorialFreeRuleCalendarApplyTypeId']
      && this.freeCalendarModel.isRelativeTimeFrameWeekly) {
      this.freeCalendarModel.isRelativeWeeklyAppliesToOccurence = true;
      this.freeCalendarUtilityService.addControlsToForm(this.freeCalendarModel, 'appliesToOccurrence', true);
    }
    if (eventValue !== this.freeCalendarModel.applyIfDayAlways['accessorialFreeRuleCalendarApplyTypeId']) {
      this.freeCalendarModel.isCannotBeChargeableDay = true;
      this.freeCalendarUtilityService.addControlsToForm(this.freeCalendarModel, 'cannotBeFirstChargeableDay', false);
      this.freeCalendarModel.freeCalendarForm.patchValue({
        cannotBeFirstChargeableDay: false
      });
    }
    this.changeDetector.detectChanges();
  }
  onSelectDayOfWeek(eventValue: number, eventLabel: string) {
    if (eventValue && this.freeCalendarModel.isRelativeTimeFrameMonthly) {
      const dayOfWeekValues = [];
      dayOfWeekValues.push({
        label: String(eventLabel),
        value: eventValue
      });
      this.freeCalendarModel.freeCalendarForm.patchValue({
        dayOfWeek: dayOfWeekValues
      });
    }
  }
  onSelectMonth(eventValue: number) {
    if (eventValue) {
      this.getDayOfMonth(eventValue);
      this.freeCalendarModel.freeCalendarForm.patchValue({
        dayOfMonth: []
      });
    }
  }
  onSelectRelativeMonth(eventValue: number, eventLabel: string) {
    const monthValues = [];
    monthValues.push({
      label: String(eventLabel),
      value: eventValue
    });
    this.freeCalendarModel.freeCalendarForm.patchValue({
      months: monthValues
    });
  }
  setApplyIfDefault() {
    if (this.freeCalendarModel.freeCalendarForm.controls['applyIf']) {
      this.freeCalendarModel.applyIf.forEach((element) => {
        if (element['value'] === this.freeCalendarModel.applyIfDayAlways['accessorialFreeRuleCalendarApplyTypeId']) {
          this.freeCalendarModel.freeCalendarForm.patchValue({
            applyIf: element
          });
        }
      }, this);
    }
  }
  onYearKeyPress(event: Event) {
    const numberOnlyRegex = /^\d+$/;
    const enteredNumber = event.currentTarget['value'] + event['key'];
    if (numberOnlyRegex.test(event['key']) && enteredNumber.length <= 4) {
      return true;
    }
    event.preventDefault();
    return false;
  }
 currentYearValidator(control: AbstractControl) {
      const yearValue = control.value;
      const currentYear = new Date().getFullYear();
      return yearValue && (parseFloat(yearValue) < currentYear || parseFloat(yearValue) > 2100) ? {invalid: true} : null;
  }
}
