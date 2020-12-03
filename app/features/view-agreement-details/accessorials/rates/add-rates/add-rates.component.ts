import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { CurrencyPipe } from '@angular/common';
import * as utils from 'lodash';


import { MessageService } from 'primeng/components/common/messageservice';

import { AddRatesModel } from './model/add-rates.model';
import { AddRatesService } from './service/add-rates.service';
import {
  GroupRateTypesInterface,
  RateDropDownInterface, ResponseType, RoudingTypeValues, RateTypeInterface
} from './model/add-rates.interface';
import { CheckBoxAttributesInterface, EditAccesorialData, AddRateEditResponse } from '../create-rates/model/create-rates.interface';
import { PatchAddRatesUtility } from './service/patch-add-rates-utility';

@Component({
  selector: 'app-add-rates',
  templateUrl: './add-rates.component.html',
  styleUrls: ['./add-rates.component.scss']
})
export class AddRatesComponent implements OnInit, OnDestroy {
  isEditRateClicked: boolean;

  @Input()
  set isEditAccessorialRateClicked(isEditAccessorialRateClicked: boolean) {
    this.isEditRateClicked = isEditAccessorialRateClicked;
  }
  @Input()
  set addRateEditResponse(addRateEditResponse: AddRateEditResponse[]) {
    if (addRateEditResponse) {
      this.addRatesModel.addRateEditResponse = addRateEditResponse;
    }
  }
  @Input()
  set editAccessorialWholeResponse(editAccessorialWholeResponse) {
    if (editAccessorialWholeResponse) {
      this.addRatesModel.editAccessorialWholeResponse = editAccessorialWholeResponse;
    }
  }
  @Input()
  set checkBoxAttributes(checkBoxAttributes: CheckBoxAttributesInterface) {
    if (checkBoxAttributes) {
      this.addRatesModel.CheckBoxAttributes = checkBoxAttributes;
    }
  }
  @Input()
  set buSo(data: number[]) {
    if (data) {
      this.getRateTypes(data);
      if (this.addRatesModel.addRateForm && !this.isEditRateClicked) {
        const ratesForm = (this.addRatesModel.addRateForm.get('rates') as FormArray);
        ratesForm.controls.forEach((rowRef) => {
          rowRef['controls']['rateType'].setValue('');
          this.changeDetector.detectChanges();
        });
      }
    }
  }

  addRatesModel: AddRatesModel;

  constructor(private readonly changeDetector: ChangeDetectorRef,
    private readonly addRatesService: AddRatesService,
    private readonly messageService: MessageService,
    private readonly currencyPipe: CurrencyPipe) {
    this.addRatesModel = new AddRatesModel();
  }

  ngOnInit() {
    this.createRatesForm();
    this.getGroupRateTypes();
    this.getRoundingTypes();
    this.addRatesModel.rateAmountValues.push(null);
    this.patchAccessorialRates();
  }
  ngOnDestroy() {
    this.addRatesModel.subscribeFlag = false;
  }

  createRatesForm() {
    this.addRatesModel.addRateForm = new FormGroup({
      rates: new FormArray([this.createRateItem()]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
  }
  createRateItem(): FormGroup {
    const amountPattern = '[-0-9., ]*';
    return new FormGroup({
      rateType: new FormControl('', [Validators.required]),
      rateAmount: new FormControl('', [Validators.required, Validators.pattern(amountPattern)]),
      minAmount: new FormControl('', [Validators.pattern(amountPattern)]),
      maxAmount: new FormControl('', [Validators.pattern(amountPattern)]),
      rounding: new FormControl('', [])
    });
  }
  patchAccessorialRates() {
    if (this.isEditRateClicked && !utils.isEmpty(this.addRatesModel.addRateEditResponse)) {
      PatchAddRatesUtility.patchAccessorialRates
        (this.addRatesModel.addRateEditResponse, this.addRatesModel, this.currencyPipe);
    }
  }
  getRateTypes(buSoIds: Array<number>) {
    this.addRatesService.getRateTypes(buSoIds).pipe(takeWhile(() => this.addRatesModel.subscribeFlag))
      .subscribe((data: RateTypeInterface[]) => {
        if (data) {
          const rateTypes = [];
          data.forEach((rateType: RateTypeInterface) => {
            rateTypes.push({
              label: rateType.rateTypeName,
              value: rateType.rateTypeId
            });
          });
          this.addRatesModel.rateTypes = rateTypes;
        }
      });
  }
  addRate(position: number) {
    const rateFC = (this.addRatesModel.addRateForm.get('rates') as FormArray).at(position);
    if (rateFC.valid) {
      (this.addRatesModel.addRateForm.controls.rates as FormArray).insert(position + 1, this.createRateItem());
      this.addRatesModel.rateAmountValues.push(null);
      this.showHideRateGroup();
      this.addRatesModel.showMinuIcon = true;
      this.changeDetector.detectChanges();
    } else {
      rateFC.get('rateType').markAsTouched();
      rateFC.get('rateAmount').markAsTouched();
      this.messageService.clear();
      this.messageService.add({
        severity: 'error', summary: 'Missing Required Information',
        detail: 'Provide the required information in the highlighted fields'
      });
      this.checkMinMaxRange(position);
    }
  }
  removeRate(position: number) {
    const ratesForm = (this.addRatesModel.addRateForm.get('rates') as FormArray);
    if (ratesForm.length === 1) {
      const firstRate = ratesForm.at(0);
      firstRate.get('rateType').setValue('');
      firstRate.get('rateAmount').setValue('');
      firstRate.get('minAmount').setValue('');
      firstRate.get('maxAmount').setValue('');
      firstRate.get('maxAmount').setValue('');
      firstRate.get('rounding').setValue('');
    } else {
      ratesForm.removeAt(position);
    }
    this.addRatesModel.rateAmountValues.splice(position, 1);
    this.showHideRateGroup();
  }
  onautoCompleteBlur(event, controlName: string, position: number) {
    const country = (this.addRatesModel.addRateForm.controls.rates as FormArray).at(position).get(controlName).value;
    if (country && !event.target['value']) {
      (this.addRatesModel.addRateForm.controls.rates as FormArray).at(position).get(controlName).setValue(null);
      (this.addRatesModel.addRateForm.controls.rates as FormArray).at(position).get(controlName).markAsDirty();
    }
    if (controlName === 'rateType') {
      this.isRollUpChecked('rateType');
    }
  }
  onRateAmountFormKeypress(event, position: number): boolean | undefined {
    const pattern = /^\-?\d{0,7}(\.\d{0,4})?$/;
    const rateAmountRef = (this.addRatesModel.addRateForm.controls.rates as FormArray).at(position).get('rateAmount');
    const rateAmountVal = rateAmountRef.value;
    const isEditScenario = rateAmountVal.includes(',');
    const rateAmount = rateAmountVal.replace(/,/g, '');
    if (!pattern.test(rateAmount)) {
      if (isEditScenario) {
        rateAmountRef.setValue(this.formatAmount(this.addRatesModel.rateAmountValues[position].toString()));
      } else {
        rateAmountRef.setValue(this.addRatesModel.rateAmountValues[position]);
      }
      return false;
    }
    this.addRatesModel.rateAmountValues[position] = rateAmount;
    rateAmountRef.setValue(event.target.value);
  }
  onFormKeypressRateAmount(event, keyname: string, index): boolean | undefined {
    const pattern = /^\-?\d{0,7}(\.\d{0,4})?$/;
    event.target.value = event.target.value.toString().replace(/,/g, '');
    if (!pattern.test(event.target.value)) {
      event.target.value = this.addRatesModel[keyname];
      this.addRatesModel.addRateForm.controls.rates['controls'][index]['controls'][keyname].setValue(this.addRatesModel[keyname]);
      return false;
    }
    this.addRatesModel[keyname] = event.target.value;
    this.addRatesModel.addRateForm.controls.rates['controls'][index]['controls'][keyname].setValue(this.addRatesModel[keyname]);
  }
  onfocusRateAmount(index, keyname: string) {
    this.addRatesModel[keyname] = this.addRatesModel.addRateForm.controls.rates['controls'][index]['controls'][keyname].value;
    this.addRatesModel[keyname] = this.addRatesModel[keyname].toString().replace(/,/g, '');
    this.addRatesModel.addRateForm.controls.rates['controls'][index]['controls'][keyname].setValue(this.addRatesModel[keyname]);
  }
  onTypeRateType(event) {
    this.addRatesModel.rateTypeSuggestion = [];
    if (this.addRatesModel.rateTypes) {
      this.addRatesModel.rateTypes.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.addRatesModel.rateTypeSuggestion.push({
            label: element.label,
            value: element.value
          });
        }
        this.addRatesModel.rateTypeSuggestion = utils.sortBy(this.addRatesModel.rateTypeSuggestion, 'label');
      });
    }
    this.changeDetector.detectChanges();
  }
  validateRateAmount(position: number, controlName: string) {
    this.isRollUpChecked('rateAmount');
    const amountFC = (this.addRatesModel.addRateForm.get('rates') as FormArray).at(position).get(controlName);
    if (amountFC.valid || amountFC.hasError('error')) {
      const value = this.addRatesModel.rateAmountValues[position] ? this.addRatesModel.rateAmountValues[position].toString() : '';
      const formattedAmount = this.formatAmount(value);
      if (formattedAmount) {
        if ((Number(formattedAmount) === 0 &&
          !this.addRatesModel.CheckBoxAttributes.rollUp) || (Number(formattedAmount) !== 0)) {
          amountFC.setValue(formattedAmount);
          this.validateAmountRange(position, controlName);
        } else if (Number(formattedAmount) === 0) {
          amountFC.setErrors({ error: true });
        }
      } else {
        amountFC.setValue('');
      }
    }
  }
  validateMinMaxAmount(value: string, position: number, controlName: string) {
    const amountFC = (this.addRatesModel.addRateForm.get('rates') as FormArray).at(position).get(controlName);
    if (amountFC.valid || amountFC.hasError('error')) {
      const formattedAmount = this.formatAmount(value);
      if (formattedAmount) {
        amountFC.setValue(formattedAmount);
      } else {
        amountFC.setValue('');
      }
    }
    this.validateAmountRange(position, controlName);
  }
  isRollUpChecked(controlName: string) {
    if (this.addRatesModel.CheckBoxAttributes && this.addRatesModel.CheckBoxAttributes.rollUp) {
      utils.forIn(this.addRatesModel.addRateForm.controls.rates['controls'], (formValue, name: string) => {
        utils.forIn(formValue['controls'], (forArrayValue, forArrayName: string) => {
          if (forArrayName === controlName && !forArrayValue['value']) {
            this.addRatesModel.addRateForm.controls.rates['controls'][name]['controls'][controlName].setValidators
              (Validators.required);
            this.addRatesModel.addRateForm.controls.rates['controls'][name]['controls'][controlName].updateValueAndValidity();
            this.addRatesModel.addRateForm.controls.rates['controls'][name]['controls'][controlName].markAsTouched();
          }
        });
      });
    }
  }
  formatAmount(value: string) {
    let formattedRateAmount = '';
    if (value) {
      const valuePlaces = new RegExp(',', 'g');
      const amount = Number(value.toString().replace(valuePlaces, ''));
      if (!isNaN(amount)) {
        const modifiedAmount = amount.toString().replace(/[, ]/g, '').trim();
        formattedRateAmount = this.currencyPipe.transform(modifiedAmount, '', '', '1.2-4');
      }
    }
    return formattedRateAmount;
  }
  validateAmountRange(position: number, controlName: string) {
    const amountFC = (this.addRatesModel.addRateForm.get('rates') as FormArray).at(position).get('rateAmount');
    const minAmountFC = (this.addRatesModel.addRateForm.get('rates') as FormArray).at(position).get('minAmount');
    const maxAmountFC = (this.addRatesModel.addRateForm.get('rates') as FormArray).at(position).get('maxAmount');

    switch (controlName) {
      case 'rateAmount':
        if (amountFC.value && maxAmountFC.value) {
          this.checkMinMaxRange(position);
        }
        break;

      case 'minAmount':
        if (minAmountFC.value && maxAmountFC.value) {
          this.checkMinMaxRange(position);
        }
        break;

      case 'maxAmount':
        if ((minAmountFC.value && maxAmountFC.value) || (amountFC.value && maxAmountFC.value)) {
          this.checkMinMaxRange(position);
        }
        break;
    }
  }
  checkMinMaxRange(position: number) {
    const rateFC = (this.addRatesModel.addRateForm.get('rates') as FormArray).at(position);
    const minAmountFC = rateFC.get('minAmount');
    const maxAmountFC = rateFC.get('maxAmount');
    const amountFC = rateFC.get('rateAmount');
    const amount = parseFloat(amountFC.value.toString().replace(/,/g, ''));
    const minAmount = parseFloat(minAmountFC.value.toString().replace(/,/g, ''));
    const maxAmount = parseFloat(maxAmountFC.value.toString().replace(/,/g, ''));
    const addRateFormControls = [minAmountFC, maxAmountFC];
    this.setRateAmountFieldError(amountFC);

    for (const controlName of addRateFormControls) {
      this.setRateFieldError(controlName);
    }

    if (Number(minAmount) > Number(maxAmount)) {
      this.showError('The minimum amount cannot be greater than the maximum amount');
      minAmountFC.setErrors({ error: true });
      maxAmountFC.setErrors({ error: true });
    } else if (Number(amount) > Number(maxAmount)) {
      this.showError('The amount specified should be less than the maximum amount specified');
      amountFC.setErrors({ error: true });
      maxAmountFC.setErrors({ error: true });
    }
  }
  setRateFieldError(controlName: AbstractControl) {
    const formattedAmount = this.formatAmount(controlName.value);
    if (formattedAmount) {
      controlName.setErrors(null);
    }
  }
  setRateAmountFieldError(controlName: any) {
    const formattedAmount = this.formatAmount(controlName.value);
    if (Number(formattedAmount) === 0 && this.addRatesModel.CheckBoxAttributes.passThrough
      && !this.addRatesModel.CheckBoxAttributes.rollUp) {
      controlName.setErrors(null);
    } else if (Number(formattedAmount) === 0) {
      controlName.setErrors({ error: true });
    } else if (controlName.hasError('error')) {
      controlName.setErrors(null);
    }
  }
  showError(message: string) {
    this.messageService.clear();
    this.messageService.add({
      severity: 'error', summary: 'Missing Required Information',
      detail: message
    });
  }
  getGroupRateTypes() {
    this.addRatesService.getGroupRateTypes().pipe(takeWhile(() => this.addRatesModel.subscribeFlag))
      .subscribe((data: ResponseType) => {
        if (data) {
          let groupRateTypes = data['_embedded']['groupRateTypes'];
          groupRateTypes = groupRateTypes.map((groupRate: GroupRateTypesInterface) => {
            return {
              label: groupRate.groupRateTypeName,
              value: groupRate.groupRateTypeID
            };
          });

          this.addRatesModel.groupRateTypes = groupRateTypes;
        }
      });
  }
  onTypeGroupRateType(event) {
    this.addRatesModel.groupRateTypeSuggestion = [];
    if (this.addRatesModel.groupRateTypes) {
      this.addRatesModel.groupRateTypes.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.addRatesModel.groupRateTypeSuggestion.push({
            label: element.label,
            value: element.value
          });
        }
        this.addRatesModel.groupRateTypeSuggestion = utils.sortBy(this.addRatesModel.groupRateTypeSuggestion, 'label');
      });
    }
    this.changeDetector.detectChanges();
  }
  onGroupTypeChange() {
    const isGroupRateItemizeFC = this.addRatesModel.addRateForm.get('isGroupRateItemize');
    isGroupRateItemizeFC.setValue(false);
  }
  showHideRateGroup() {
    const ratesLength = (this.addRatesModel.addRateForm.controls.rates as FormArray).length;
    const groupRateType = this.addRatesModel.addRateForm.get('groupRateType');
    const isGroupRateItemizeFC = this.addRatesModel.addRateForm.get('isGroupRateItemize');
    if (ratesLength > 1) {
      this.addRatesModel.isMoreThanOneRate = true;
      groupRateType.setValidators(Validators.required);
    } else {
      this.addRatesModel.isMoreThanOneRate = false;
      groupRateType.setValue('');
      groupRateType.markAsUntouched();
      groupRateType.clearValidators();
      isGroupRateItemizeFC.setValue(false);
    }
    groupRateType.updateValueAndValidity();
  }
  getRoundingTypes() {
    this.addRatesService.getRoundingTypes().pipe(takeWhile(() => this.addRatesModel.subscribeFlag))
      .subscribe((data: ResponseType) => {
        if (data) {
          this.addRatesModel.roundingTypes = [];
          if (data._embedded && data._embedded.accessorialRateRoundingTypes) {
            data._embedded.accessorialRateRoundingTypes.forEach((eachRoundigType: RoudingTypeValues) => {
              this.addRatesModel.roundingTypes.push({
                label: eachRoundigType.accessorialRateRoundingTypeName,
                value: eachRoundigType.accessorialRateRoundingTypeId
              });
            });
          }
        }
      });
  }
  onTypeRoundingType(event) {
    this.addRatesModel.roundingTypeSuggestion = [];
    if (this.addRatesModel.roundingTypes) {
      this.addRatesModel.roundingTypes.forEach((eachRoundigType: RateDropDownInterface) => {
        if (eachRoundigType.label && eachRoundigType.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.addRatesModel.roundingTypeSuggestion.push({
            label: eachRoundigType.label,
            value: eachRoundigType.value
          });
        }
        this.addRatesModel.roundingTypeSuggestion = utils.sortBy(this.addRatesModel.roundingTypeSuggestion, 'label');
      });
    }
    this.changeDetector.detectChanges();
  }
  onBlurgroupRateType(event) {
    if (utils.isEmpty(event.target.value)) {
      this.addRatesModel.addRateForm.controls.groupRateType.setValue(null);
      this.addRatesModel.addRateForm.controls.groupRateType.markAsDirty();
    }
  }
}
