import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment-timezone';
import { FreeEventTypeModel } from './model/free-event-type.model';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import * as utils from 'lodash';
import { takeWhile } from 'rxjs/operators';
import { FreeEventTypeService } from './service/free-event-type.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { FreeEventType, EventFreeTime, EventFreeAmount } from './model/free-event-type.interface';
import { CreateRuleUtilityService } from '../../create-rules/service/create-rule-utility.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-free-event-type',
  templateUrl: './free-event-type.component.html',
  styleUrls: ['./free-event-type.component.scss']
})
export class FreeEventTypeComponent implements OnInit {

  freeEventTypeModel: FreeEventTypeModel;
  selectedFreeRuleTypeId: number;
  @Output() displayEventReferenceGrid: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private readonly freeEventTypeService: FreeEventTypeService,
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly createRuleUtilityService: CreateRuleUtilityService,
    private readonly currencyPipe: CurrencyPipe) {
    this.freeEventTypeModel = new FreeEventTypeModel();
  }

  ngOnInit() {
    this.createFreeEnemtTypesForm();
    this.getEventNameTypes();
    this.getEventFreeTime();
    this.getEventFreeAmount();
  }
  createFreeEnemtTypesForm() {
    this.freeEventTypeModel.freeEventTypeForm = this.formBuilder.group({
      freeTypeEventName: ['', Validators.required],
      freeTimeEvent: ['', Validators.required],
      freeAmountFirstEvent: ['', Validators.required],
      freeAmountSecondEvent: ['', Validators.required],
      pickatimefirst: ['', Validators.required],
      pickatimesecond: ['', Validators.required],
    });
  }

  getEventNameTypes() {
    this.freeEventTypeService.getEventNameTypes().pipe(takeWhile(() => this.freeEventTypeModel.isSubscribeFlag))
      .subscribe((freeEventType: FreeEventType) => {
        this.populateEventNameType(freeEventType);
      }, (freeRuleEventTypeError: Error) => {
        this.toastMessage(this.messageService, 'error', 'Error', freeRuleEventTypeError['error']['errors'][0]['errorMessage']);
      });
  }
  populateEventNameType(freeEventType) {
    if (freeEventType) {
      const freeEventTypes = freeEventType['_embedded']['accessorialFreeRuleEventTypes'];
      const eventTypesValues = freeEventTypes.map((eventTypeValue) => {
        return {
          label: eventTypeValue['accessorialFreeRuleEventTypeName'],
          value: eventTypeValue['accessorialFreeRuleEventTypeId']
        };
      });
      this.freeEventTypeModel.freeRuleEventNameTypes = eventTypesValues;
      this.changeDetector.detectChanges();
    }
  }

  onTypeEventName(event: Event) {
    this.freeEventTypeModel.freeTypeEventNameFiltered = [];
    if (this.freeEventTypeModel.freeRuleEventNameTypes) {
      this.freeEventTypeModel.freeRuleEventNameTypes.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.freeEventTypeModel.freeTypeEventNameFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.freeEventTypeModel.freeTypeEventNameFiltered.sort((freeTypefirstValue, freeTypesecondValue) => {
      return (freeTypefirstValue.label.toLowerCase() > freeTypesecondValue.label.toLowerCase()) ? 1 : -1;
    });
    this.changeDetector.detectChanges();
  }
  onEventNameTypeBlur(event: Event, controlName: string) {
    if (this.freeEventTypeModel.freeEventTypeForm.controls[controlName].value && !event.target['value']) {
      this.freeEventTypeModel.freeEventTypeForm.controls[controlName].setValue(null);
      switch (controlName) {
        case 'freeAmountFirstEvent':
          this.setFreeAmountSecondBasedonDayRule(null);
          if (this.freeEventTypeModel.freeEventTypeForm.controls['freeAmountSecondEvent']
            && this.freeEventTypeModel.isfreeRuleDayOfEventAndDayAfter) {
            this.setFormValidations('freeAmountSecondEvent', 'remove');
            this.setFormValidations('freeAmountSecondEvent', 'add');
          }
          if (this.freeEventTypeModel.freeEventTypeForm.controls['pickatimesecond']) {
            this.setFormValidations('pickatimesecond', 'remove');
          }
          this.freeEventTypeModel.isFreeRuleSecondTimeIndicator = false;
        break;
        case 'freeTypeEventName':
          this.displayEventReferenceGrid.emit(true);
        break;
      }
    }
  }
  onSelectEventFreeTime(event: Event) {
    if (event['value'] === this.freeEventTypeModel.freeRuleDayOfEvent['accessorialFreeRuleEventTimeframeTypeID']) {
      this.freeEventTypeModel.isFreeRuleDayOfEventName = true;
      this.freeEventTypeModel.isfreeRuleDayOfEventAndDayAfter = false;
      this.setFormValidations('freeAmountSecondEvent', 'remove');
      this.setFormValidations('pickatimesecond', 'remove');
      if (this.freeEventTypeModel.freeEventTypeForm.controls['pickatimefirst'] && this.freeEventTypeModel.isFreeRuleFirstTimeIndicator) {
        this.freeEventTypeModel.freeEventTypeForm.controls['pickatimefirst'].setErrors(null);
        this.setRequiredValidation('pickatimefirst', this.freeEventTypeModel);
      }
    }
    if (event['value'] === this.freeEventTypeModel.freeRuleDayOfEventAndDayAfter['accessorialFreeRuleEventTimeframeTypeID']) {
      this.freeEventTypeModel.isfreeRuleDayOfEventAndDayAfter = true;
      this.freeEventTypeModel.isFreeRuleSecondTimeIndicator = false;
      this.setFormValidations('freeAmountSecondEvent', 'add');
      this.freeEventTypeModel.freeEventTypeForm.controls['freeAmountSecondEvent'].setValue(null);
      this.setFormValidations('pickatimesecond', 'add');
      this.addControlToForm('freeAmountSecondEvent', false);
    }
  }
  getEventFreeTime() {
    this.freeEventTypeService.getEventFreeTime().pipe(takeWhile(() => this.freeEventTypeModel.isSubscribeFlag))
      .subscribe((eventFreeTime: EventFreeTime) => {
        this.populateEventFreeTimeType(eventFreeTime);
      }, (freeRuleEventFreeTimeError: Error) => {
        this.toastMessage(this.messageService, 'error', 'Error', freeRuleEventFreeTimeError['error']['errors'][0]['errorMessage']);
      });
  }
  populateEventFreeTimeType(eventFreeTime) {
    if (eventFreeTime) {
      const eventFreeTimes = eventFreeTime['_embedded']['accessorialFreeRuleEventTimeFrameTypes'];
      const eventFreeTimeTypesValues = eventFreeTimes.map((eventFreeTimeTypeValue) => {
        return {
          label: eventFreeTimeTypeValue['accessorialFreeRuleEventTimeframeTypeName'],
          value: eventFreeTimeTypeValue['accessorialFreeRuleEventTimeframeTypeID']
        };
      });
      this.freeEventTypeModel.freeRuleEventFreeTimeTypes = eventFreeTimeTypesValues;
      this.changeDetector.detectChanges();
    }
  }
  onTypeFreeTime(event: Event) {
    this.freeEventTypeModel.freeTypeEventFreeTimeFiltered = [];
    if (this.freeEventTypeModel.freeRuleEventFreeTimeTypes) {
      this.freeEventTypeModel.freeRuleEventFreeTimeTypes.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.freeEventTypeModel.freeTypeEventFreeTimeFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.freeEventTypeModel.freeTypeEventFreeTimeFiltered.sort((freeTypefirstValue, freeTypesecondValue) => {
      return (freeTypefirstValue.label.toLowerCase() > freeTypesecondValue.label.toLowerCase()) ? 1 : -1;
    });
    this.changeDetector.detectChanges();
  }

  setFormValidations(controlValue: string, type: string) {
    if (type === 'add') {
      this.freeEventTypeModel.freeEventTypeForm.controls[controlValue].setValidators([Validators.required]);
      this.freeEventTypeModel.freeEventTypeForm.controls[controlValue].setErrors(null);
      this.freeEventTypeModel.freeEventTypeForm.controls[controlValue].updateValueAndValidity();
    } else if (type === 'remove') {
      this.freeEventTypeModel.freeEventTypeForm.controls[controlValue].setValue('');
      this.freeEventTypeModel.freeEventTypeForm.controls[controlValue].markAsUntouched();
      this.freeEventTypeModel.freeEventTypeForm.controls[controlValue].setValidators(null);
      this.freeEventTypeModel.freeEventTypeForm.controls[controlValue].setErrors(null);
      this.freeEventTypeModel.freeEventTypeForm.controls[controlValue].updateValueAndValidity();
    }
  }
  addControlToForm(controlName, isRequired) {
    this.freeEventTypeModel.freeEventTypeForm.addControl(controlName, new FormControl('', isRequired ? Validators.required : null));
  }
  onSelectFreeAmountFirst(event: Event) {
    const firstDayFreeId = this.freeEventTypeModel.
      eventFreeAmountFirstDayFree['accessorialFreeRuleEventModifierTypeID'];
    const firstDayFreeEventTimeAfterId = this.freeEventTypeModel.
      eventFreeAmountFirstDayFreeIfEventTimeAfter['accessorialFreeRuleEventModifierTypeID'];
    const firstDayFreeEventTimeBeforeId = this.freeEventTypeModel.
      eventFreeAmountFirstDayFreeIfEventTimeBefore['accessorialFreeRuleEventModifierTypeID'];

    if (event['value'] === firstDayFreeId) {
      this.freeEventTypeModel.isFreeRuleFirstTimeIndicator = false;
      this.setFormValidations('pickatimefirst', 'remove');
      this.addControlToForm('pickatimefirst', false);
      this.setFreeAmountSecondBasedonDayRule(firstDayFreeId);
    }
    if (event['value'] === firstDayFreeEventTimeAfterId) {
      this.freeEventTypeModel.isFreeRuleFirstTimeIndicator = true;
      this.setFormValidations('pickatimefirst', 'add');
      this.setFreeAmountSecondBasedonDayRule(firstDayFreeEventTimeAfterId);
    }
    if (event['value'] === firstDayFreeEventTimeBeforeId) {
      this.freeEventTypeModel.isFreeRuleFirstTimeIndicator = true;
      this.setFormValidations('pickatimefirst', 'add');
      this.setFreeAmountSecondBasedonDayRule(firstDayFreeEventTimeBeforeId);
    }
    if (this.freeEventTypeModel.freeEventTypeForm.controls['freeAmountSecondEvent']
      && this.freeEventTypeModel.isfreeRuleDayOfEventAndDayAfter) {
      this.setFormValidations('freeAmountSecondEvent', 'remove');
      this.setFormValidations('freeAmountSecondEvent', 'add');
    }
    if (this.freeEventTypeModel.freeEventTypeForm.controls['pickatimesecond']) {
      this.setFormValidations('pickatimesecond', 'remove');
    }
    this.freeEventTypeModel.isFreeRuleSecondTimeIndicator = false;
  }
  setFreeAmountSecondBasedonDayRule(freeAmountFirstSelectedValue) {
    if (freeAmountFirstSelectedValue &&
      freeAmountFirstSelectedValue !== this.freeEventTypeModel.eventFreeAmountFirstDayFree['accessorialFreeRuleEventModifierTypeID']) {
      this.freeEventTypeModel.eventFreeAmountSecondTypes = [];
      if (this.freeEventTypeModel.masterEventFreeAmountTypes) {
        this.freeEventTypeModel.masterEventFreeAmountTypes['_embedded']
        ['accessorialFreeRuleEventModifierTypes'].forEach((timeTypeValue1) => {
          if (timeTypeValue1['accessorialFreeRuleEventModifierTypeID'] === freeAmountFirstSelectedValue) {
            this.freeEventTypeModel.eventFreeAmountSecondTypes.push({
              label: timeTypeValue1['accessorialFreeRuleEventModifierTypeName'],
              value: timeTypeValue1['accessorialFreeRuleEventModifierTypeID']
            });
          }
        });
      }
    } else if (freeAmountFirstSelectedValue) {
      this.freeEventTypeModel.eventFreeAmountSecondTypes = [];
      this.populateEventFreeAmountSecondType(this.freeEventTypeModel.masterEventFreeAmountTypes);
    } else if (!freeAmountFirstSelectedValue) {
      this.freeEventTypeModel.eventFreeAmountSecondTypes = [];
    }
  }
  onSelectFreeAmountSecond(event: Event) {
    if (event['value'] === this.freeEventTypeModel.eventFreeAmountSecondDayFree['accessorialFreeRuleEventModifierTypeID']) {
      this.freeEventTypeModel.isFreeRuleSecondTimeIndicator = false;
      this.setFormValidations('pickatimesecond', 'remove');
      this.addControlToForm('pickatimesecond', false);
    }
    if (event['value'] === this.freeEventTypeModel.eventFreeAmountSecondDayFreeIfEventTimeAfter['accessorialFreeRuleEventModifierTypeID']) {
      this.freeEventTypeModel.isFreeRuleSecondTimeIndicator = true;
      this.setFormValidations('pickatimesecond', 'add');
    }
    if (event['value'] === this.freeEventTypeModel.eventFreeAmountSecondDayFreeIfEventTimeBefore
    ['accessorialFreeRuleEventModifierTypeID']) {
      this.freeEventTypeModel.isFreeRuleSecondTimeIndicator = true;
      this.setFormValidations('pickatimesecond', 'add');
    }
  }
  getEventFreeAmount() {
    this.freeEventTypeService.getEventFreeAmount().pipe(takeWhile(() => this.freeEventTypeModel.isSubscribeFlag))
      .subscribe((eventFreeAmount: EventFreeAmount) => {
        this.freeEventTypeModel.masterEventFreeAmountTypes = eventFreeAmount;
        this.populateEventFreeAmountType(eventFreeAmount);
        this.populateEventFreeAmountSecondType(eventFreeAmount);
        if (this.freeEventTypeModel.freeEventTypeForm.controls['freeAmountSecondEvent']
        && this.freeEventTypeModel.freeEventTypeForm.controls['freeAmountSecondEvent'].value) {
          this.setFreeAmountSecondBasedonDayRule(this.freeEventTypeModel.freeEventTypeForm.
            controls['freeAmountFirstEvent'].value['value']);
        }
      }, (freeRuleEventFreeAmountError: Error) => {
        this.toastMessage(this.messageService, 'error', 'Error', freeRuleEventFreeAmountError['error']['errors'][0]['errorMessage']);
      });
  }
  populateEventFreeAmountType(eventFreeAmount) {
    if (eventFreeAmount) {
      const eventFreeAmounts = eventFreeAmount['_embedded']['accessorialFreeRuleEventModifierTypes'];
      const eventFreeAmountsValues = eventFreeAmounts.map((timeTypeValue) => {
        return {
          label: timeTypeValue['accessorialFreeRuleEventModifierTypeName'],
          value: timeTypeValue['accessorialFreeRuleEventModifierTypeID']
        };
      });
      this.freeEventTypeModel.eventFreeAmountFirstTypes = eventFreeAmountsValues;
      this.changeDetector.detectChanges();
    }
  }
  populateEventFreeAmountSecondType(eventFreeAmount1) {
    if (eventFreeAmount1) {
      const eventFreeAmounts1 = eventFreeAmount1['_embedded']['accessorialFreeRuleEventModifierTypes'];
      const eventFreeAmountsValues1 = eventFreeAmounts1.map((timeTypeValue1) => {
        return {
          label: timeTypeValue1['accessorialFreeRuleEventModifierTypeName'],
          value: timeTypeValue1['accessorialFreeRuleEventModifierTypeID']
        };
      });
      this.freeEventTypeModel.eventFreeAmountSecondTypes = eventFreeAmountsValues1;
      this.changeDetector.detectChanges();
    }
  }
  onTypeFreeAmountFirst(event: Event) {
    this.freeEventTypeModel.eventFreeAmountFirstFiltered = [];
    if (this.freeEventTypeModel.eventFreeAmountFirstTypes) {
      this.freeEventTypeModel.eventFreeAmountFirstTypes.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.freeEventTypeModel.eventFreeAmountFirstFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.freeEventTypeModel.eventFreeAmountFirstFiltered.sort((freeTypefirstValue, freeTypesecondValue) => {
      return (freeTypefirstValue.label.toLowerCase() > freeTypesecondValue.label.toLowerCase()) ? 1 : -1;
    });
    this.changeDetector.detectChanges();
  }
  onTypeFreeAmountSecond(event: Event) {
    this.freeEventTypeModel.eventFreeAmountSecondFiltered = [];
    if (this.freeEventTypeModel.eventFreeAmountSecondTypes) {
      this.freeEventTypeModel.eventFreeAmountSecondTypes.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.freeEventTypeModel.eventFreeAmountSecondFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.freeEventTypeModel.eventFreeAmountSecondFiltered.sort((freeTypefirstValue, freeTypesecondValue) => {
      return (freeTypefirstValue.label.toLowerCase() > freeTypesecondValue.label.toLowerCase()) ? 1 : -1;
    });
    this.changeDetector.detectChanges();
  }
  onTimeTypeBlur(event: Event, controlName: string) {
    let eventTime = event.target['value'];
    const regex = new RegExp('(1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm])');
    if (!regex.test(eventTime)) {
      eventTime = null;
      this.freeEventTypeModel.freeEventTypeForm.controls[controlName].setValue(null);
    } else {
      eventTime = moment(eventTime, 'hh:mm A');
    }
    this.onTimeSelected(eventTime, controlName);
  }
  onTimeSelected(selectedTime: Date, selectedType: string) {
    let pickatimefirst, pickatimesecond = null;
    if (selectedType === 'pickatimefirst') {
      pickatimefirst = selectedTime ? selectedTime : null;
      pickatimesecond = this.getFormControlValue('pickatimesecond');
    } else if (selectedType === 'pickatimesecond') {
      pickatimesecond = selectedTime ? selectedTime : null;
      pickatimefirst = this.getFormControlValue('pickatimefirst');
    }
    this.checkDayOfEventAndDayAfterEventSelection();
    this.validateTime(pickatimefirst, pickatimesecond);
    this.setTimeValidationError();
  }
  checkDayOfEventAndDayAfterEventSelection() {
    const firstDayFreeEventTimeAfterId = this.freeEventTypeModel.
      eventFreeAmountFirstDayFreeIfEventTimeAfter['accessorialFreeRuleEventModifierTypeID'];
    const firstDayFreeEventTimeBeforeId = this.freeEventTypeModel.
      eventFreeAmountFirstDayFreeIfEventTimeBefore['accessorialFreeRuleEventModifierTypeID'];

    const freeAmountFirstEvent = this.getFormControlValue('freeAmountFirstEvent');
    const freeAmountSecondEvent = this.getFormControlValue('freeAmountSecondEvent');
    this.freeEventTypeModel.isDayBeforeSelectionRule = false;
    this.freeEventTypeModel.isDayAfterSelectionRule = false;
    if (freeAmountFirstEvent && freeAmountSecondEvent) {
      if (freeAmountFirstEvent.value === firstDayFreeEventTimeAfterId && freeAmountSecondEvent.value === firstDayFreeEventTimeAfterId
      ) {
        this.freeEventTypeModel.isDayAfterSelectionRule = true;
      } else if (freeAmountFirstEvent.value === firstDayFreeEventTimeBeforeId &&
        freeAmountSecondEvent.value === firstDayFreeEventTimeBeforeId) {
        this.freeEventTypeModel.isDayBeforeSelectionRule = true;
      }
    }
  }
  validateTime(pickatimefirst, pickatimesecond) {
    this.freeEventTypeModel.isPickATimeFirstValidationError = false;
    this.freeEventTypeModel.isPickATimeSecondValidationError = false;
    pickatimefirst = this.getTimeAsMinutes(pickatimefirst);
    pickatimesecond = this.getTimeAsMinutes(pickatimesecond);
    if ((pickatimefirst && pickatimesecond) &&
     ((this.freeEventTypeModel.isDayAfterSelectionRule && (pickatimesecond < pickatimefirst))
     || (this.freeEventTypeModel.isDayBeforeSelectionRule && (pickatimesecond < pickatimefirst)))) {
      this.freeEventTypeModel.isPickATimeFirstValidationError = true;
      this.freeEventTypeModel.isPickATimeSecondValidationError = true;
    }
  }
  setTimeValidationError() {
    const isPickATimeFirstValidationError = this.freeEventTypeModel.isPickATimeFirstValidationError;
    const isPickATimeSecondValidationError = this.freeEventTypeModel.isPickATimeSecondValidationError;
    if (this.freeEventTypeModel.freeEventTypeForm.controls['pickatimefirst']
      && this.freeEventTypeModel.isFreeRuleFirstTimeIndicator) {
      this.freeEventTypeModel.freeEventTypeForm.controls['pickatimefirst'].setErrors(isPickATimeFirstValidationError ? { invalid: true }
        : null);
      this.setRequiredValidation('pickatimefirst', this.freeEventTypeModel);
    }
    if (this.freeEventTypeModel.freeEventTypeForm.controls['pickatimesecond']
      && this.freeEventTypeModel.isFreeRuleSecondTimeIndicator) {
      this.freeEventTypeModel.freeEventTypeForm.controls['pickatimesecond'].setErrors(isPickATimeSecondValidationError ? { invalid: true }
        : null);
      this.setRequiredValidation('pickatimesecond', this.freeEventTypeModel);
    }
  }
  setRequiredValidation(fieldName: string, freeEventTypeModel: FreeEventTypeModel) {
    if (!freeEventTypeModel.freeEventTypeForm.controls[fieldName].value) {
      freeEventTypeModel.freeEventTypeForm.controls[fieldName].setErrors({
        'required': true
      });
    }
  }
  getFormControlValue(controlName: string) {
    return this.freeEventTypeModel.freeEventTypeForm['controls'][controlName] &&
      this.freeEventTypeModel.freeEventTypeForm['controls'][controlName]['value'] ?
      this.freeEventTypeModel.freeEventTypeForm['controls'][controlName]['value'] : null;
  }
  getTimeAsMinutes(dateTimeValue) {
    if (dateTimeValue) {
      const timeValue = moment(dateTimeValue).format('HH:mm');
      return  parseFloat((timeValue.split(':')[0] * 60) + timeValue.split(':')[1]);
    }
    return null;
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
}


