import { Injectable } from '@angular/core';
import { FreeCalendarModel } from '../model/free-calendar.model';
import {
  CalendarTypes, AutoCompleteInterface, TimeFrames, DayOfWeekResponse, ApplyIfResponse,
  EventTypesResponse, AppliesToOccurenceResponse, MonthsResponse
} from '../model/free-calendar.interface';
import { FormBuilder, Validators, FormControl, AbstractControlDirective, AbstractControl } from '@angular/forms';
import * as utils from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class FreeCalendarUtilityService {
  populateDayOfMOnth(dayOfMonth, freeCalendarModel: FreeCalendarModel, changeDetector) {
    if (dayOfMonth) {
      const dayOfMonthValues = dayOfMonth.map((monthValue) => {
        return {
          label: String(monthValue),
          value: monthValue
        };
      });
      freeCalendarModel.dayOfMonth = dayOfMonthValues;
    }
    changeDetector.detectChanges();
  }
  addAutoCompleteFilteredValues(query: string, controlName: string, arrayList, filteredArrayList,
    freeCalendarModel: FreeCalendarModel, sortBy: string) {
    freeCalendarModel[filteredArrayList] = [];
    if (freeCalendarModel[arrayList]) {
      freeCalendarModel[arrayList].forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1) {
          freeCalendarModel[filteredArrayList].push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    if (sortBy === 'value') {
      freeCalendarModel[filteredArrayList].sort((elementFirstValue, elementSecondValue) => {
        return (elementFirstValue['value'] > elementSecondValue['value']) ? 1 : -1;
      });
    } else {
      freeCalendarModel[filteredArrayList].sort((elementFirstValue, elementSecondValue) => {
        return (elementFirstValue.label.toLowerCase() > elementSecondValue.label.toLowerCase()) ? 1 : -1;
      });
    }
  }
  onTypeCalendarAutoComplete(event: Event, controlName: string, freeCalendarModel: FreeCalendarModel, changeDetector) {
    switch (controlName) {
      case 'calendarType':
        this.addAutoCompleteFilteredValues(event['query'], controlName, 'calendarTypes',
          'calendarTypesFiltered', freeCalendarModel, 'label');
        changeDetector.detectChanges();
        break;

      case 'timeFrame':
        this.addAutoCompleteFilteredValues(event['query'], controlName, 'timeFrames',
          'timeFramesFiltered', freeCalendarModel, 'label');
        changeDetector.detectChanges();
        break;
      case 'dayOfWeek':
        this.addAutoCompleteFilteredValues(event['query'], controlName,
          'dayOfWeek', 'dayOfWeekFiltered', freeCalendarModel, 'value');
        if (freeCalendarModel.isRelativeTimeFrameWeekly) {
          freeCalendarModel.dayOfWeekFiltered =
            utils.differenceBy(freeCalendarModel.dayOfWeekFiltered,
              freeCalendarModel.freeCalendarForm.controls['dayOfWeek'].value, 'label');
        }
        changeDetector.detectChanges();
        break;
      case 'applyIf':
        this.addAutoCompleteFilteredValues(event['query'], controlName,
          'applyIf', 'applyIfFiltered', freeCalendarModel, 'label');
        changeDetector.detectChanges();
        break;
      case 'eventTypes':
        this.addAutoCompleteFilteredValues(event['query'], controlName,
          'eventTypes', 'eventTypesFiltered', freeCalendarModel, 'label');
        changeDetector.detectChanges();
        break;
      case 'appliesToOccurrence':
        this.addAutoCompleteFilteredValues(event['query'], controlName,
          'appliesToOccurrence', 'appliesToOccurrenceFiltered', freeCalendarModel, 'value');
        freeCalendarModel.appliesToOccurrenceFiltered = utils.differenceBy(freeCalendarModel.appliesToOccurrenceFiltered,
          freeCalendarModel.freeCalendarForm.controls['appliesToOccurrence'].value, 'label');
        changeDetector.detectChanges();
        break;

      case 'occurrence':
        this.addAutoCompleteFilteredValues(event['query'],
          controlName, 'occurrence', 'occurrenceFiltered', freeCalendarModel, 'value');
        changeDetector.detectChanges();
        break;

      case 'months':
        this.addAutoCompleteFilteredValues(event['query'],
          controlName, 'months', 'monthsFiltered', freeCalendarModel, 'value');
        changeDetector.detectChanges();
        break;

      case 'dayOfMonth':
        this.addAutoCompleteFilteredValues(event['query'],
          controlName, 'dayOfMonth', 'dayOfMonthFiltered', freeCalendarModel, 'value');
        changeDetector.detectChanges();
        break;
    }
  }
  removeSpecificAndRelativeForm(freeCalendarModel: FreeCalendarModel) {
    utils.forIn(freeCalendarModel.freeCalendarForm.controls, (value, name: string) => {
      if (name !== 'calendarType') {
        freeCalendarModel.freeCalendarForm.removeControl(name);
      }
    });
  }
  addControlsToForm(freeCalendarModel: FreeCalendarModel, controlNames, isRequired: boolean, customValidators?) {
    let controlValidators = [];
    controlValidators = customValidators ? customValidators : [];
    if (isRequired) {
      controlValidators.push(Validators.required);
    }
    if (controlNames.constructor === Array) {
      controlNames.forEach(controlname => {
        if (!freeCalendarModel.freeCalendarForm.controls.controlname) {
          freeCalendarModel.freeCalendarForm.addControl(controlname,
            new FormControl('', controlValidators));
        }
      }, this);
    } else {
      if (!freeCalendarModel.freeCalendarForm.controls.controlNames) {
        freeCalendarModel.freeCalendarForm.addControl(controlNames, new FormControl('', controlValidators));
      }
    }
  }
  removeControlsFromForm(freeCalendarModel: FreeCalendarModel, controlNames) {
    if (controlNames.constructor === Array) {
      controlNames.forEach(value => {
        if (freeCalendarModel.freeCalendarForm.controls[value]) {
          freeCalendarModel.freeCalendarForm.removeControl(value);
        }
      });
    } else {
      if (freeCalendarModel.freeCalendarForm.controls.controlNames) {
        freeCalendarModel.freeCalendarForm.removeControl(controlNames);
      }
    }
  }
  setFormValidations(controlValue: string, type: string, freeCalendarModel: FreeCalendarModel) {
    if (type === 'add') {
      freeCalendarModel.freeCalendarForm.controls[controlValue].setValidators([Validators.required]);
      freeCalendarModel.freeCalendarForm.controls[controlValue].setErrors(null);
      freeCalendarModel.freeCalendarForm.controls[controlValue].updateValueAndValidity();
    } else if (type === 'remove') {
      freeCalendarModel.freeCalendarForm.controls[controlValue].setValue('');
      freeCalendarModel.freeCalendarForm.controls[controlValue].markAsUntouched();
      freeCalendarModel.freeCalendarForm.controls[controlValue].setValidators(null);
      freeCalendarModel.freeCalendarForm.controls[controlValue].setErrors(null);
      freeCalendarModel.freeCalendarForm.controls[controlValue].updateValueAndValidity();
    }
  }
}
