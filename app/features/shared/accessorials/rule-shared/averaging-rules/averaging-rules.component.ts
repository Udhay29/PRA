import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MessageService } from 'primeng/components/common/messageservice';

import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';

// tslint:disable-next-line: max-line-length
import { CreateRulesService } from './../../../../standard/standard-accessorial/standard-rules/create-rules/service/standard-create-rules.service';
// tslint:disable-next-line: import-spacing
import { AveragingTimeFrame, DayOfWeekResponse, RuleTypeInterface }
from './../../../../standard/standard-accessorial/standard-rules/create-rules/model/standard-create-rules.interface';
import { AveragingRulesModel } from './models/averaging-rules.model';

@Component({
  selector: 'app-averaging-rules',
  templateUrl: './averaging-rules.component.html',
  styleUrls: ['./averaging-rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AveragingRulesComponent implements OnInit {

  averagingRulesModel: AveragingRulesModel;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly createRulesService: CreateRulesService) {
    this.averagingRulesModel = new AveragingRulesModel();
  }

  ngOnInit() {
    this.averagingRulesForm();
    this.getAveragingTimeFrame();
    this.getDayOfWeek();
    this.getFrequencyTypeValues();
    this.getFrequencySubType();
    this.getSpecificDays();
  }
  averagingRulesForm() {
    this.averagingRulesModel.averagingForm = this.formBuilder.group({
      timeFrame: ['', Validators.required],
      dayOfWeek: [''],
      monthlyAveragingTypes: [''],
      specificDay: [''],
      monthlyDay: [''],
      frequency: ['']
    });
  }
  getAveragingTimeFrame() {
    this.createRulesService.getAverageTimeFrame().pipe(takeWhile(() =>
      this.averagingRulesModel.isSubscribeFlag)).subscribe((timeFrameResponse: AveragingTimeFrame) => {
        this.populateAverageTimeFrame(timeFrameResponse);
      }, (chargeTypeError: Error) => {
        this.toastMessage(this.messageService, 'error', 'Error', chargeTypeError['error']['errors'][0]['errorMessage']);
      });
  }
  populateAverageTimeFrame(timeFrameResponse: AveragingTimeFrame) {
    if (timeFrameResponse) {
      const averageTime = timeFrameResponse['_embedded']['pricingAveragePeriodTypes'];
      const averageTimeValues = averageTime.map((averageTimeValue) => {
        return {
          label: averageTimeValue.pricingAveragePeriodTypeName,
          value: averageTimeValue.pricingAveragePeriodTypeId
        };
      });
      this.averagingRulesModel.averageTimeFrame = averageTimeValues;
      this.changeDetector.detectChanges();
    }
  }
  onTypeTimeFrame(timeTypedValue: Event) {
    this.averagingRulesModel.averageTimeFrameFiltered = [];
    if (this.averagingRulesModel.averageTimeFrame) {
      this.filteredAverageTimeFrame(timeTypedValue);
    }
    this.averagingRulesModel.averageTimeFrameFiltered.sort((averageTimeFramefirstValue, averageTimeFrameSecondValue) => {
      return (averageTimeFramefirstValue.label.toLowerCase() > averageTimeFrameSecondValue.label.toLowerCase()) ? 1 : -1;
    });
    this.changeDetector.detectChanges();
  }
  filteredAverageTimeFrame(timeTypedValue: Event) {
    this.averagingRulesModel.averageTimeFrame.forEach(averageTimeFrameValue => {
      if (averageTimeFrameValue.label &&
        averageTimeFrameValue.label.toString().toLowerCase().indexOf(timeTypedValue['query'].toLowerCase()) !== -1) {
        this.averagingRulesModel.averageTimeFrameFiltered.push({
          label: averageTimeFrameValue.label,
          value: averageTimeFrameValue.value
        });
      }
    });
  }
  onChangeTimeFrame(changedTimeValue: RuleTypeInterface) {
    this.averagingRulesModel.selectedTimeFrame = changedTimeValue;
    if (changedTimeValue.label.toLowerCase() === 'monthly') {
      this.averagingRulesModel.isMonthly = true;
      this.averagingRulesModel.isWeekly = false;
      this.checkMonthlyValue();
      this.setFormValidations('dayOfWeek', 'remove');
      this.setFormValidations('specificDay', 'add');
      this.averagingRulesModel.selectedValue = 1;
    } else if (changedTimeValue.label.toLowerCase() === 'weekly') {
      this.averagingRulesModel.isMonthly = false;
      this.averagingRulesModel.isWeekly = true;
      this.averagingRulesModel.isEachDay = false;
      this.averagingRulesModel.isOnTheDay = false;
      this.averagingRulesModel.selectedValue = 1;
      this.setFormValidations('dayOfWeek', 'add');
      this.setFormValidations('specificDay', 'remove');
    }
  }
  checkMonthlyValue() {
    if (!this.averagingRulesModel.isEachDay && !this.averagingRulesModel.isOnTheDay) {
      this.averagingRulesModel.isEachDay = true;
    }
  }
  setFormValidations(controlValue: string, type: string) {
    if (type === 'add') {
      this.averagingRulesModel.averagingForm.controls[controlValue].setValidators([Validators.required]);
      this.averagingRulesModel.averagingForm.controls[controlValue].setErrors(null);
      this.averagingRulesModel.averagingForm.controls[controlValue].updateValueAndValidity();
    } else if (type === 'remove') {
      this.averagingRulesModel.averagingForm.controls[controlValue].setValue('');
      this.averagingRulesModel.averagingForm.controls[controlValue].markAsUntouched();
      this.averagingRulesModel.averagingForm.controls[controlValue].setValidators(null);
      this.averagingRulesModel.averagingForm.controls[controlValue].setErrors(null);
      this.averagingRulesModel.averagingForm.controls[controlValue].updateValueAndValidity();
    }
  }
  getDayOfWeek() {
    this.createRulesService.getDayOfWeek().pipe(takeWhile(() =>
      this.averagingRulesModel.isSubscribeFlag)).subscribe((dayResponse: DayOfWeekResponse) => {
        this.populateDayOfWeek(dayResponse);
      }, (chargeTypeError: Error) => {
        this.toastMessage(this.messageService, 'error', 'Error', chargeTypeError['error']['errors'][0]['errorMessage']);
      });
  }
  populateDayOfWeek(dayResponse: DayOfWeekResponse) {
    this.averagingRulesModel.dayOfWeek = [];
    if (dayResponse) {
      const days = [];
      dayResponse['priceChangeDayOfWeek'].forEach(dayValue => {
        days.push({
          label: dayValue,
          value: dayValue
        });
      });
      this.averagingRulesModel.dayOfWeek = days;
      this.changeDetector.detectChanges();
    }
  }
  getWeekDays(dayValue) {
    this.averagingRulesModel.dayOfWeekValues = [];
    if (this.averagingRulesModel.dayOfWeek) {
      this.getWeekDayValues(dayValue);
    }
    this.averagingRulesModel.dayOfWeekValues = utils.differenceBy(this.averagingRulesModel.dayOfWeekValues,
      this.averagingRulesModel.averagingForm.controls['dayOfWeek'].value, 'label');
    this.changeDetector.detectChanges();
  }
  getWeekDayValues(dayValue) {
    this.averagingRulesModel.dayOfWeek.forEach(dayOfWeekValue => {
      if (dayOfWeekValue.label &&
        dayOfWeekValue.label.toString().toLowerCase().indexOf(dayValue['query'].toLowerCase()) !== -1) {
        this.averagingRulesModel.dayOfWeekValues.push({
          label: dayOfWeekValue.label,
          value: dayOfWeekValue.value
        });
      }
    });
  }
  getFrequencyTypeValues() {
    this.createRulesService.getFrequencyValues().pipe(takeWhile(() =>
      this.averagingRulesModel.isSubscribeFlag)).subscribe((frequency) => {
        this.populateFrequency(frequency);
      });
  }
  populateFrequency(frequency) {
    this.averagingRulesModel.frequency = [];
    if (frequency) {
      const frequencyValue = [];
      frequency['_embedded']['accessorialFrequencyTypes'].forEach(frequencyData => {
        frequencyValue.push({
          label: frequencyData.accessorialFrequencyTypeName,
          value: frequencyData.accessorialFrequencyTypeId
        });
      });
      this.averagingRulesModel.frequency = frequencyValue;
      this.changeDetector.detectChanges();
    }
  }
  getFrequencyData(frequencyTyped) {
    this.averagingRulesModel.frequencyValues = [];
    if (this.averagingRulesModel.frequency) {
      this.getFrequencyFilteredData(frequencyTyped);
    }
    this.changeDetector.detectChanges();
  }
  getFrequencyFilteredData(frequencyTyped) {
    this.averagingRulesModel.frequency.forEach(frequencyValue => {
      if (frequencyValue.label &&
        frequencyValue.label.toString().toLowerCase().indexOf(frequencyTyped['query'].toLowerCase()) !== -1) {
        this.averagingRulesModel.frequencyValues.push({
          label: frequencyValue.label,
          value: frequencyValue.value
        });
      }
    });
  }
  getFrequencySubType() {
    this.createRulesService.getFrequencySubTypeValues().pipe(takeWhile(() =>
      this.averagingRulesModel.isSubscribeFlag)).subscribe((frequencysubType) => {
        this.populateFrequencySubType(frequencysubType);
      });
  }
  populateFrequencySubType(frequencysubType) {
    this.averagingRulesModel.frequencysubType = [];
    if (frequencysubType) {
      const subFrequencyValue = [];
      frequencysubType['_embedded']['accessorialFrequencySubTypes'].forEach(frequencyData => {
        subFrequencyValue.push({
          label: frequencyData.accessorialFrequencySubTypeName,
          value: frequencyData['accessorialFrequencySubTypeId']
        });
      });
      this.averagingRulesModel.dayOfWeekList.forEach(weekdays => {
        subFrequencyValue.push({
          label: weekdays,
          value: null
        });
      });
      this.averagingRulesModel.frequencysubType = subFrequencyValue;
      this.changeDetector.detectChanges();
    }
  }
  getFrequencySubTypeData(frequencyTyped) {
    this.averagingRulesModel.frequencysubTypeValues = [];
    if (this.averagingRulesModel.frequencysubType) {
      this.getSubFrequencyFilteredData(frequencyTyped);
    }
    this.changeDetector.detectChanges();
  }
  getSubFrequencyFilteredData(frequencyTyped) {
    this.averagingRulesModel.frequencysubType.forEach(subFrequencyValue => {
      if (subFrequencyValue.label &&
        subFrequencyValue.label.toString().toLowerCase().indexOf(frequencyTyped['query'].toLowerCase()) !== -1) {
        this.averagingRulesModel.frequencysubTypeValues.push({
          label: subFrequencyValue.label,
          value: subFrequencyValue.value
        });
      }
    });
  }
  getSpecificDays() {
    this.averagingRulesModel.specificDay = [];
    const dayValue = [];
    for (let i = 1; i <= 28; i++) {
      dayValue.push({
        label: i,
        value: i
      });
    }
    this.averagingRulesModel.specificDay = dayValue;
    this.changeDetector.detectChanges();
  }
  getSpecificDayValues(specificDayTyped) {
    this.averagingRulesModel.specificDayValue = [];
    if (this.averagingRulesModel.specificDay) {
      this.getSpecificDayFilteredData(specificDayTyped);
    }
    this.changeDetector.detectChanges();
  }
  getSpecificDayFilteredData(specificDayTyped) {
    this.averagingRulesModel.specificDay.forEach(dayValue => {
      if (dayValue.label &&
        dayValue.label.toString().toLowerCase().indexOf(specificDayTyped['query'].toLowerCase()) !== -1) {
        this.averagingRulesModel.specificDayValue.push({
          label: dayValue.label,
          value: dayValue.value
        });
      }
    });
    this.averagingRulesModel.specificDayValue = utils.differenceBy(this.averagingRulesModel.specificDayValue,
      this.averagingRulesModel.averagingForm.controls['specificDay'].value, 'label');
  }
  onclickMonthlyTypes(averagingType) {
    switch (averagingType.label) {
      case 'Each':
        this.averagingRulesModel.isEachDay = true;
        this.averagingRulesModel.isOnTheDay = false;
        this.setFormValidations('specificDay', 'add');
        this.setFormValidations('frequency', 'remove');
        this.setFormValidations('monthlyDay', 'remove');
        break;
      case 'On the':
        this.averagingRulesModel.isOnTheDay = true;
        this.averagingRulesModel.isEachDay = false;
        this.setFormValidations('specificDay', 'remove');
        this.setFormValidations('frequency', 'add');
        this.setFormValidations('monthlyDay', 'add');
        break;
    }
  }
  onBlurTimeFrame(event) {
    if (!event.length) {
      this.averagingRulesModel.averagingForm.controls['timeFrame'].setValidators([Validators.required]);
      this.averagingRulesModel.averagingForm.controls['timeFrame'].setErrors({ required: true });
    }
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
