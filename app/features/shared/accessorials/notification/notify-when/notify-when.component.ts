import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';

import { NotifyWhenModel } from './model/notify-When.model';
import { NotifyWhenService } from './service/notify-when.service';

@Component({
  selector: 'app-notify-when',
  templateUrl: './notify-when.component.html',
  styleUrls: ['./notify-when.component.scss']
})
export class NotifyWhenComponent implements OnInit {
  notifyWhenModel: NotifyWhenModel;
  constructor(private readonly changeDetector: ChangeDetectorRef,
    private readonly notifyWhenService: NotifyWhenService) {
    this.notifyWhenModel = new NotifyWhenModel();
  }

  ngOnInit() {
    this.createForm();
    this.getFrequency();
    this.getAccessorialNotificationRequiredTypes();
    this.getEventOccurrenceTime();
    this.getEventName();
    this.getTimeFrame();
    this.batchTimeSuggestion();
  }
  createForm() {
    this.notifyWhenModel.notifyWhenForm = new FormGroup({
      frequency: new FormControl('', [Validators.required]),
      eventOccuranceTime: new FormControl('', [Validators.required]),
      accessorialNotificationRequiredTypes: new FormControl('Notification Required'),
      eventName: new FormControl('', [Validators.required]),
      timeframe: new FormControl(''),
      batchTime: new FormControl(''),
      timeframeInput: new FormControl('')
    });
  }
  batchTimeSuggestion() {
    for (let hour = 0; hour < 24; hour = hour + 1) {
      let minute = 0;
      const batchTime1 = hour < 10 ? `0${hour}:00 CT` : `${hour}:00 CT`;
      const batchTime1Value = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      this.notifyWhenModel.batchTime.push({ label: batchTime1, value: batchTime1Value });
      for (let minutes = 0; minutes < 3; minutes++) {
        minute = minute + 15;
        const batchTime = hour < 10 ? `0${hour}:${minute} CT` : `${hour}:${minute} CT`;
        const batchTimeValue = hour < 10 ? `0${hour}:${minute}` : `${hour}:${minute}`;
        this.notifyWhenModel.batchTime.push({ label: batchTime, value: batchTimeValue });
      }
    }
  }
  getFrequency() {
    this.notifyWhenService.getFrequency().pipe(takeWhile(() => this.notifyWhenModel.isSubscribeFlag))
      .subscribe((frequency) => {
        this.populateFrequency(frequency);
      });
  }
  populateFrequency(frequency) {
    if (frequency) {
      const frequencys = frequency['_embedded']['accessorialNotificationTriggerFrequencyTypes'];
      const frequencyValues = frequencys.map((frequencyValue) => {
        return {
          label: frequencyValue.accessorialNotificationTriggerFrequencyTypeName,
          value: frequencyValue.accessorialNotificationTriggerFrequencyTypeId
        };
      });
      this.notifyWhenModel.frequency = frequencyValues;
      this.notifyWhenModel.frequency.forEach(defaultvalue => {
        if (defaultvalue.label === 'Per Event') {
          this.notifyWhenModel.notifyWhenForm.controls.frequency.setValue(defaultvalue);
        }
      });
      this.changeDetector.detectChanges();
    }
  }
  getAccessorialNotificationRequiredTypes() {
    this.notifyWhenService.getAccessorialNotificationRequiredTypes().pipe(takeWhile(() => this.notifyWhenModel.isSubscribeFlag))
      .subscribe((accessorialNotificationRequiredTypes) => {
        this.populateAccessorialNotificationRequiredTypes(accessorialNotificationRequiredTypes);
      });
  }
  populateAccessorialNotificationRequiredTypes(data) {
    if (data) {
      const datas = data['_embedded']['accessorialNotificationRequiredTypes'];
      const dataValues = datas.map((dataValue) => {
        return {
          label: dataValue.accessorialNotificationRequiredTypeName,
          value: dataValue.accessorialNotificationRequiredTypeId
        };
      });
      this.notifyWhenModel.accessorialNotificationRequiredTypes = dataValues;
      this.changeDetector.detectChanges();
    }
  }
  getEventOccurrenceTime() {
    this.notifyWhenService.getEventOccurrenceTime().pipe(takeWhile(() => this.notifyWhenModel.isSubscribeFlag))
      .subscribe((eventOccurrenceTime) => {
        this.populateEventOccurrenceTime(eventOccurrenceTime);
      });
  }
  populateEventOccurrenceTime(eventOccurrenceTime) {
    if (eventOccurrenceTime) {
      const eventOccurrenceTimes = eventOccurrenceTime['_embedded']['accessorialNotificationOccurrenceTypes'];
      const eventOccurrenceTimeValues = eventOccurrenceTimes.map((eventOccurrenceTimeValue) => {
        return {
          label: eventOccurrenceTimeValue.accessorialNotificationOccurrenceTypeName,
          value: eventOccurrenceTimeValue.accessorialNotificationOccurrenceTypeId
        };
      });
      this.notifyWhenModel.eventOccurrenceTime = eventOccurrenceTimeValues;
      this.changeDetector.detectChanges();
    }
  }
  getEventName() {
    this.notifyWhenService.getEventName().pipe(takeWhile(() => this.notifyWhenModel.isSubscribeFlag))
      .subscribe((eventName) => {
        this.populateEventName(eventName);
      });
  }
  populateEventName(eventName) {
    if (eventName) {
      const eventNames = eventName['_embedded']['accessorialNotificationEventTypes'];
      const eventNameValues = eventNames.map((eventNameValue) => {
        return {
          label: eventNameValue.accessorialNotificationEventTypeName,
          value: eventNameValue.accessorialNotificationEventTypeId
        };
      });
      this.notifyWhenModel.eventName = eventNameValues;
      this.changeDetector.detectChanges();
    }
  }
  getTimeFrame() {
    this.notifyWhenService.getTimeFrame().pipe(takeWhile(() => this.notifyWhenModel.isSubscribeFlag))
      .subscribe((timeFrame) => {
        this.populateTimeFrame(timeFrame);
      });
  }

  populateTimeFrame(timeFrame) {
    if (timeFrame) {
      const timeFrames = timeFrame['_embedded']['pricingUnitOfTimeMeasurementAssociations'];
      const timeFrameValues = timeFrames.map((timeFrameValue) => {
        return {
          label: timeFrameValue.unitOfTimeMeasurementCode,
          value: timeFrameValue.pricingUnitOfTimeMeasurementAssociationId
        };
      });
      this.notifyWhenModel.timeFrame = timeFrameValues;
      this.changeDetector.detectChanges();
    }
  }
  onDropDownClick(response, keyName: string) {
    this.notifyWhenModel.suggestionResult = [];
    if (this.notifyWhenModel[keyName]) {
      this.notifyWhenModel[keyName].forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(response['query'].toLowerCase()) !== -1) {
          this.notifyWhenModel.suggestionResult.push({
            label: element.label,
            value: element.value
          });
        }
        this.batchTimeSuggestionClick(keyName);
        this.notifyWhenModel.suggestionResult = utils.sortBy(this.notifyWhenModel.suggestionResult, 'label');
      });
    }
  }
  batchTimeSuggestionClick(keyName: string) {
    if (keyName === 'batchTime') {
      this.notifyWhenModel.suggestionResult = utils.differenceBy(this.notifyWhenModel.suggestionResult,
        this.notifyWhenModel.notifyWhenForm.controls.batchTime.value, 'label');
      this.notifyWhenModel.suggestionResult = utils.sortBy(this.notifyWhenModel.suggestionResult, 'label');
    }
  }
  onBlurFrequency(event) {
    if (utils.isEmpty(event.target.value)) {
      this.notifyWhenModel.notifyWhenForm.controls.frequency.setValue(null);
      this.removeValidatorsOnSelectOfBatch();
      this.removeValidatorsOnSelectOfPerEvent();
    }
  }
  onSelectFrequency(event) {
    if (event.label !== this.notifyWhenModel.notifyWhenForm.controls.frequency.value) {
      this.notifyWhenModel.notifyWhenForm.controls.eventOccuranceTime.reset();
      this.notifyWhenModel.notifyWhenForm.controls.eventName.reset();
      this.notifyWhenModel.notifyWhenForm.controls.timeframe.reset();
      this.notifyWhenModel.notifyWhenForm.controls.batchTime.reset();
      this.notifyWhenModel.notifyWhenForm.controls.timeframeInput.reset();
      if (event.label === 'Per Event') {
        this.setValidatorsOnSelectOfPerEvent();
        this.removeValidatorsOnSelectOfBatch();
      }
      if (event.label === 'Batch') {
        this.setValidatorsOnSelectOfBatch();
        this.removeValidatorsOnSelectOfPerEvent();
        this.removeValidationOnEvent();
      }
    }
  }
  onBlureventOccuranceTime(event) {
    if (utils.isEmpty(event.target.value)) {
      this.notifyWhenModel.notifyWhenForm.controls.eventOccuranceTime.setValue(null);
      this.removeValidationOnEvent();
    }
  }
  onSelecteventOccurrenceTime(event) {
    if (event.label === 'On Event' || event.label === 'On') {
      this.removeValidationOnEvent();
    } else {
      this.setValidationOnEvent();
    }
    this.notifyWhenModel.notifyWhenForm.controls.timeframeInput.reset();
    this.notifyWhenModel.notifyWhenForm.controls.timeframe.reset();
  }
  onBlureventName(event) {
    if (utils.isEmpty(event.target.value)) {
      this.notifyWhenModel.notifyWhenForm.controls.eventName.setValue(null);
    }
  }
  onBlurtimeframe(event) {
    if (utils.isEmpty(event.target.value)) {
      this.notifyWhenModel.notifyWhenForm.controls.timeframe.setValue(null);
    }
  }
  onBlurInputTimeframe() {
    if (this.notifyWhenModel.notifyWhenForm.controls.timeframe.value && this.notifyWhenModel.notifyWhenForm.controls.timeframeInput.value &&
      this.notifyWhenModel.notifyWhenForm.controls.timeframe.value.label === 'Minute') {
      this.timeFrameCheck();
    }
    if (this.notifyWhenModel.notifyWhenForm.controls.timeframe.value && this.notifyWhenModel.notifyWhenForm.controls.timeframeInput.value &&
      this.notifyWhenModel.notifyWhenForm.controls.timeframe.value.label !== 'Minute') {
      this.timeFrameCheck();
      this.notifyWhenModel.notifyWhenForm.controls.timeframeInput.setErrors(null);
      this.notifyWhenModel.minuteErrorMessage = false;
    }
    if (!this.notifyWhenModel.notifyWhenForm.controls.timeframe.value) {
      this.notifyWhenModel.notifyWhenForm.controls.timeframe.setValidators([Validators.required]);
      this.notifyWhenModel.notifyWhenForm.controls.timeframe.updateValueAndValidity();
    }
    if (!this.notifyWhenModel.notifyWhenForm.controls.timeframeInput.value) {
      this.notifyWhenModel.notifyWhenForm.controls.timeframeInput.setValidators([Validators.required]);
      this.notifyWhenModel.notifyWhenForm.controls.timeframeInput.updateValueAndValidity();
    }
  }
  timeFrameCheck() {
    const number = Number(this.notifyWhenModel.notifyWhenForm.controls.timeframeInput.value);
    if (!(this.notifyWhenModel.inputCheckForMinute.indexOf(number) >= 0)) {
      this.notifyWhenModel.notifyWhenForm.controls.timeframeInput.setErrors({ error: true });
      this.notifyWhenModel.minuteErrorMessage = true;
    } else {
      this.notifyWhenModel.notifyWhenForm.controls.timeframeInput.setErrors(null);
      this.notifyWhenModel.minuteErrorMessage = false;
    }
  }
  setValidationOnEvent() {
    this.notifyWhenModel.notifyWhenForm.controls.timeframe.setValidators([Validators.required]);
    this.notifyWhenModel.notifyWhenForm.controls.timeframe.updateValueAndValidity();
    this.notifyWhenModel.notifyWhenForm.controls.timeframeInput.setValidators([Validators.required]);
    this.notifyWhenModel.notifyWhenForm.controls.timeframeInput.updateValueAndValidity();
  }
  removeValidationOnEvent() {
    this.notifyWhenModel.notifyWhenForm.controls.timeframe.setValidators(null);
    this.notifyWhenModel.notifyWhenForm.controls.timeframe.updateValueAndValidity();
    this.notifyWhenModel.notifyWhenForm.controls.timeframeInput.setValidators(null);
    this.notifyWhenModel.notifyWhenForm.controls.timeframeInput.updateValueAndValidity();
  }
  setValidatorsOnSelectOfPerEvent() {
    this.notifyWhenModel.notifyWhenForm.controls.eventOccuranceTime.setValidators([Validators.required]);
    this.notifyWhenModel.notifyWhenForm.controls.eventOccuranceTime.updateValueAndValidity();
    this.notifyWhenModel.notifyWhenForm.controls.eventName.setValidators([Validators.required]);
    this.notifyWhenModel.notifyWhenForm.controls.eventName.updateValueAndValidity();
  }
  removeValidatorsOnSelectOfPerEvent() {
    this.notifyWhenModel.notifyWhenForm.controls.eventOccuranceTime.setValidators(null);
    this.notifyWhenModel.notifyWhenForm.controls.eventOccuranceTime.updateValueAndValidity();
    this.notifyWhenModel.notifyWhenForm.controls.eventName.setValidators(null);
    this.notifyWhenModel.notifyWhenForm.controls.eventName.updateValueAndValidity();
  }
  setValidatorsOnSelectOfBatch() {
    this.notifyWhenModel.notifyWhenForm.controls.batchTime.setValidators([Validators.required]);
    this.notifyWhenModel.notifyWhenForm.controls.batchTime.updateValueAndValidity();
  }
  removeValidatorsOnSelectOfBatch() {
    this.notifyWhenModel.notifyWhenForm.controls.batchTime.setValidators(null);
    this.notifyWhenModel.notifyWhenForm.controls.batchTime.updateValueAndValidity();
  }
}
