import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FreeRuleService } from './service/free-rule.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { CreateRuleUtilityService } from '../create-rules/service/create-rule-utility.service';
import { FreeRuleModel } from './model/free-rule.model';
import { takeWhile } from 'rxjs/operators';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { FreeRuleType, QuantityType, TimeType, DistanceType, TimeTypeInterface, DistanceTypeInterface } from './model/free-rule.interface';
import * as utils from 'lodash';

@Component({
  selector: 'app-free-rule',
  templateUrl: './free-rule.component.html',
  styleUrls: ['./free-rule.component.scss']
})

export class FreeRuleComponent implements OnInit {
  @ViewChild('freeTypeEventTab') freeTypeEventTab;
  @ViewChild('freeTypeCalendarTab') freeTypeCalendarTab;
  @Output() referenceGridData: EventEmitter<boolean> = new EventEmitter<boolean>();
  freeRuleModel: FreeRuleModel;
  constructor(private readonly freeRuleService: FreeRuleService,
    private readonly messageService: MessageService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly formBuilder: FormBuilder,
    private readonly createRuleUtilityService: CreateRuleUtilityService,
    private readonly currencyPipe: CurrencyPipe) {
    this.freeRuleModel = new FreeRuleModel();
  }

  ngOnInit() {
    this.getFreeTypes();
    this.createFreeTypesForm();
  }
  createFreeTypesForm() {
    this.freeRuleModel.freeRulesForm = this.formBuilder.group({
      freeRuleType: ['', Validators.required]
    });
  }
  getFreeTypes() {
    this.freeRuleService.getFreeTypes().pipe(takeWhile(() => this.freeRuleModel.isSubscribeFlag))
      .subscribe((freeType: FreeRuleType) => {
        this.populateFreeType(freeType);
      }, (ruleTypeError: Error) => {
        this.toastMessage(this.messageService, 'error', 'Error', ruleTypeError['error']['errors'][0]['errorMessage']);
      });
  }
  populateFreeType(freeRuleType: FreeRuleType) {
    if (freeRuleType) {
      const freeTypes = freeRuleType['_embedded']['accessorialFreeRuleTypes'];
      const freeRuleTypeValues = freeTypes.map((freeTypeValue) => {
        return {
          label: freeTypeValue['accessorialFreeRuleTypeName'],
          value: freeTypeValue['accessorialFreeRuleTypeID']
        };
      });
      this.freeRuleModel.freeRuleTypes = freeRuleTypeValues;
      this.changeDetector.detectChanges();
    }
  }
  onQuantityKeyPress(event) {
    const regexDecimals = /^[0-9.,]*$/;
    const specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft', 'Delete'];
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = event.target.value;
    current = current.replace(/[, ]/g, '').trim();
    const cursorPosition = event.target.selectionStart;
    const next = current.slice(0, cursorPosition) + event.key + current.slice(cursorPosition, current.length);
    const number = next.split('.')[0];
    const decimal = next.split('.')[1];
    if (next && ((number && number.length > 7) || (decimal && decimal.length > 4)
      || !String(next).match(regexDecimals))) {
      event.preventDefault();
    }
  }
  onSelectFreeType(event: Event) {
    this.clearFreeRuleForm();
    if (event['value'] === this.freeRuleModel.freeRuleTypeQuantity['accessorialFreeRuleTypeID']) {
      this.addQuantityTypeControl();
      this.addControlToForm('timeType', true);
      this.addControlToForm('requestedDeliveryDate', false);
      this.addControlToForm('distanceType', false);
      this.addQuantityControl();
      this.getQuantityTypes();
      this.getFreeRuleTimeTypes();
      this.getFreeRuleDistanceTypes();
      this.freeRuleModel.isFreeRuleTimeType = true;
    } else if (event['value'] === this.freeRuleModel.freeRuleTypeEvent['accessorialFreeRuleTypeID']) {
      this.freeRuleModel.isFreeRuleTypeEvent = true;
    } else if (event['value'] === this.freeRuleModel.freeRuleTypeCalendar['accessorialFreeRuleTypeID']) {
      this.freeRuleModel.isFreeRuleTypeCalendar = true;
    }
    this.changeDetector.detectChanges();
    this.displayReferenceGrid(true);
  }
  onSelectQuantityType(event: Event) {
    this.freeRuleModel.isFreeRuleTimeType = false;
    this.freeRuleModel.isFreeRuleDistanceType = false;
    utils.forIn(this.freeRuleModel.freeRulesForm.controls, (value, name: string) => {
      if (name === 'timeType' || name === 'distanceType' || name === 'requestedDeliveryDate' || name === 'quantity') {
        this.freeRuleModel.freeRulesForm.removeControl(name);
      }
    });
    if (event['value'] === this.freeRuleModel.timeQuantityType['accessorialFreeRuleQuantityTypeId']) {
      this.addControlToForm('timeType', true);
      this.addControlToForm('requestedDeliveryDate', false);
      this.addQuantityControl();
      this.freeRuleModel.isFreeRuleTimeType = true;
    }
    if (event['value'] === this.freeRuleModel.distanceQuantityType['accessorialFreeRuleQuantityTypeId']) {
      this.addControlToForm('distanceType', true);
      this.addQuantityControl();
      this.freeRuleModel.isFreeRuleDistanceType = true;
    }
    this.changeDetector.detectChanges();
  }
  addQuantityTypeControl() {
    this.addControlToForm('quantityType', true);
    this.freeRuleModel.freeRulesForm.controls['quantityType'].setValue({
      label: this.freeRuleModel.timeQuantityType['accessorialFreeRuleQuantityTypeName'],
      value: this.freeRuleModel.timeQuantityType['accessorialFreeRuleQuantityTypeId']
    });
    this.freeRuleModel.isFreeRuleTypeQuantity = true;
  }
  addQuantityControl() {
    this.freeRuleModel.freeRulesForm.addControl('quantity', new FormControl('', [Validators.required, Validators.pattern('[-0-9., ]*')]));
  }
  getQuantityTypes() {
    this.freeRuleService.getQuantityTypes().pipe(takeWhile(() => this.freeRuleModel.isSubscribeFlag))
      .subscribe((quantityType: QuantityType) => {
        this.populateQuanityType(quantityType);
      }, (ruleTypeError: Error) => {
        this.toastMessage(this.messageService, 'error', 'Error', ruleTypeError['error']['errors'][0]['errorMessage']);
      });
  }
  populateQuanityType(quantityType) {
    if (quantityType) {
      const quantityTypes = quantityType['_embedded']['accessorialFreeRuleQuantityTypes'];
      const quantityTypesValues = quantityTypes.map((quantityTypeValue) => {
        return {
          label: quantityTypeValue['accessorialFreeRuleQuantityTypeName'],
          value: quantityTypeValue['accessorialFreeRuleQuantityTypeId']
        };
      });
      this.freeRuleModel.quantityTypes = quantityTypesValues;
      this.changeDetector.detectChanges();
    }
  }

  getFreeRuleTimeTypes() {
    this.freeRuleService.getfreeRuleTimeTypes().pipe(takeWhile(() => this.freeRuleModel.isSubscribeFlag))
      .subscribe((timeType: TimeType) => {
        this.populateTimeType(timeType);
      }, (ruleTypeError: Error) => {
        this.toastMessage(this.messageService, 'error', 'Error', ruleTypeError['error']['errors'][0]['errorMessage']);
      });
  }
  populateTimeType(timeTypes) {
    if (timeTypes) {
      const timeTypesValues = timeTypes.map((timeTypeValue) => {
        return {
          label: timeTypeValue['accessorialFreeRuleQuantityTimeTypeName'],
          value: timeTypeValue['accessorialFreeRuleQuantityTimeTypeId']
        };
      });
      this.freeRuleModel.timeTypes = timeTypesValues;
      this.changeDetector.detectChanges();
    }
  }
  getFreeRuleDistanceTypes() {
    this.freeRuleService.getfreeRuleDistanceTypes().pipe(takeWhile(() => this.freeRuleModel.isSubscribeFlag))
      .subscribe((distanceType: DistanceType) => {
        this.populateDistanceType(distanceType);
      }, (ruleTypeError: Error) => {
        this.toastMessage(this.messageService, 'error', 'Error', ruleTypeError['error']['errors'][0]['errorMessage']);
      });
  }
  populateDistanceType(distanceType) {
    if (distanceType) {
      const distanceTypes = distanceType;
      const distanceTypesValues = distanceTypes.map((distanceTypeValue) => {
        return {
          label: distanceTypeValue['accessorialFreeRuleQuantityDistanceTypeName'],
          value: distanceTypeValue['accessorialFreeRuleQuantityDistanceTypeId']
        };
      });
      this.freeRuleModel.distanceTypes = distanceTypesValues;
      this.changeDetector.detectChanges();
    }
  }
  onFreeTypeBlur(event: Event, controlName: string) {
    if (this.freeRuleModel.freeRulesForm.controls[controlName].value &&
      !event.target['value']) {
      this.freeRuleModel.freeRulesForm.controls[controlName].setValue(null);
      if (controlName === 'freeRuleType') {
        this.clearFreeRuleForm();
        this.changeDetector.detectChanges();
        this.displayReferenceGrid(false);
      }
    }
  }
  onTypeFreeType(event: Event) {
    this.freeRuleModel.freeRuleTypesFiltered = [];
    if (this.freeRuleModel.freeRuleTypes) {
      this.freeRuleModel.freeRuleTypes.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.freeRuleModel.freeRuleTypesFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.freeRuleModel.freeRuleTypesFiltered.sort((freeTypefirstValue, freeTypesecondValue) => {
      return (freeTypefirstValue.label.toLowerCase() > freeTypesecondValue.label.toLowerCase()) ? 1 : -1;
    });
    this.changeDetector.detectChanges();
  }
  onTypeDistanceType(event: Event) {
    this.freeRuleModel.distanceTypesFiltered = [];
    if (this.freeRuleModel.distanceTypes) {
      this.freeRuleModel.distanceTypes.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.freeRuleModel.distanceTypesFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.freeRuleModel.distanceTypesFiltered.sort((freeTypefirstValue, freeTypesecondValue) => {
      return (freeTypefirstValue.label.toLowerCase() > freeTypesecondValue.label.toLowerCase()) ? 1 : -1;
    });
    this.changeDetector.detectChanges();
  }
  onTypeQuantityType(event: Event) {
    this.freeRuleModel.quantityTypesFiltered = [];
    if (this.freeRuleModel.quantityTypes) {
      this.freeRuleModel.quantityTypes.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.freeRuleModel.quantityTypesFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.freeRuleModel.quantityTypesFiltered.sort((freeTypefirstValue, freeTypesecondValue) => {
      return (freeTypefirstValue.label.toLowerCase() > freeTypesecondValue.label.toLowerCase()) ? 1 : -1;
    });
    this.changeDetector.detectChanges();
  }
  onTypeTimeType(event: Event) {
    this.freeRuleModel.timeTypesFiltered = [];
    if (this.freeRuleModel.timeTypes) {
      this.freeRuleModel.timeTypes.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.freeRuleModel.timeTypesFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.freeRuleModel.timeTypesFiltered.sort((freeTypefirstValue, freeTypesecondValue) => {
      return (freeTypefirstValue.label.toLowerCase() > freeTypesecondValue.label.toLowerCase()) ? 1 : -1;
    });
    this.changeDetector.detectChanges();
  }
  onQuantityBlur(value: string) {
    let quantityData;
    quantityData = this.freeRuleModel.freeRulesForm.get('quantity');
    const formattedAmount = this.createRuleUtilityService.formatAmount(value, this.currencyPipe);
    if (formattedAmount) {
      if (Number(formattedAmount) <= 0) {
        this.freeRuleModel.freeRulesForm.controls['quantity'].setErrors({ error: true });
      } else {
        quantityData.setValue(formattedAmount);
      }
    } else {
      this.freeRuleModel.freeRulesForm.controls['quantity'].setErrors({ error: true });
    }
    this.changeDetector.detectChanges();
  }
  clearFreeRuleForm() {
    this.freeRuleModel.isFreeRuleTypeQuantity = false;
    this.freeRuleModel.isFreeRuleTypeEvent = false;
    this.freeRuleModel.isFreeRuleTypeCalendar = false;
    this.freeRuleModel.isFreeRuleTimeType = false;
    this.freeRuleModel.isFreeRuleDistanceType = false;
    utils.forIn(this.freeRuleModel.freeRulesForm.controls, (value, name: string) => {
      if (name !== 'freeRuleType') {
        this.freeRuleModel.freeRulesForm.removeControl(name);
      }
    });
  }
  addControlToForm(controlName, isRequired) {
    this.freeRuleModel.freeRulesForm.addControl(controlName, new FormControl('', isRequired ? Validators.required : null));
  }
  displayReferenceGrid(isDisplay: boolean) {
    this.referenceGridData.emit(isDisplay);
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
