import { StepsModule } from 'primeng/steps';
import { CurrencyPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { AddStairStepModel } from './model/add-stair-step.model';
import { AddStairStepService } from './services/add-stair-step.service';
import { PatchAddStairStepUtilityService } from './services/patch-add-stair-step-utility';

import * as utils from 'lodash';
import { takeWhile } from 'rxjs/operators';
import { MessageService } from 'primeng/components/common/messageservice';
import { freemem } from 'os';


@Component({
  selector: 'app-add-stair-step',
  templateUrl: './add-stair-step.component.html',
  styleUrls: ['./add-stair-step.component.scss']
})
export class AddStairStepComponent implements OnInit, OnDestroy {
  isEditStairStepRateClicked = true;
  stairStepModel: AddStairStepModel;
  constructor(private readonly addStairStepService: AddStairStepService,
    private readonly messageService: MessageService,
    private readonly currencyPipe: CurrencyPipe,
    private readonly changeDetector: ChangeDetectorRef) {
    this.stairStepModel = new AddStairStepModel();
  }
  @Input()
  set buSo(data: number[]) {
    if (data) {
      this.getRateTypes(data);
    }
  }
  @Input()
  set editAccessorialWholeResponse(editAccessorialWholeResponse) {
    if (editAccessorialWholeResponse) {
      this.stairStepModel.editAccessorialWholeResponse = editAccessorialWholeResponse;
    }
  }
  @Input()
  set isEditAccessorialStairStepRateClicked(isEditAccessorialStairStepRateClicked: boolean) {
    this.isEditStairStepRateClicked = isEditAccessorialStairStepRateClicked;
  }
  @Input()
  set addStairStepRateEditResponse(addStairStepRateEditResponse: any) {
    if (addStairStepRateEditResponse) {
      this.stairStepModel.addStairStepRateEditResponse = addStairStepRateEditResponse;
    }
  }
  ngOnInit() {
    this.createStairStepForm();
    this.getRoundingTypes();
    this.getmaxApplidedWhen();
    this.stairStepModel.decimals = 4;
    this.stairStepModel.gap = [1, 0.1, 0.01, 0.001, 0.0001];
    this.patchStairStepAccessorialRates();
  }
  ngOnDestroy() {
    this.stairStepModel.subscribeFlag = false;
  }
  createStairStepForm() {
    this.stairStepModel.addStairStepForm = new FormGroup({
      rateType: new FormControl('', [Validators.required]),
      minAmount: new FormControl(''),
      maxAmount: new FormControl(''),
      rounding: new FormControl('', []),
      maxApplidedWhen: new FormControl(''),
      itemizeRates: new FormControl(false),
      stepsArray: new FormArray([this.createStepsItem()])
    });
  }
  createStepsItem(): FormGroup {
    const amountPattern = '[-0-9., ]*';
    return new FormGroup({
      step: new FormControl('', [Validators.required]),
      fromQuantity: new FormControl('', [Validators.required]),
      toQuantity: new FormControl('', [Validators.required]),
      rateAmount: new FormControl('', [Validators.pattern(amountPattern)])
    });
  }
  patchStairStepAccessorialRates() {
    if (this.isEditStairStepRateClicked && !utils.isEmpty(this.stairStepModel.addStairStepRateEditResponse)) {
      PatchAddStairStepUtilityService.patchAccessorialRates
        (this.stairStepModel.addStairStepRateEditResponse, this.stairStepModel, this.currencyPipe, this);
    }
  }
  setValidatorsRequired() {
    utils.forIn(this.stairStepModel.addStairStepForm.controls.stepsArray['controls'], (forArrayValue, forArrayName: string) => {
      utils.forIn(forArrayValue['controls'], (control, controlName: string) => {
        const error = control.errors;
        control.setValidators(Validators.required);
        control.markAsTouched();
        control.updateValueAndValidity();
        if (error) {
          control.setErrors(error);
        }
        this.changeDetector.detectChanges();
      });

    });
  }
  againValidate(postion) {
    let count = 0;
    this.stairStepModel.rateAmountExceed = [];
    this.stairStepModel.invalidFreeAmount = false;
    this.stairStepModel.rateAmountValid = [];
    const lengthOfArray = this.stairStepModel.addStairStepForm.controls.stepsArray['controls'].length;
    while (count < lengthOfArray) {
      if (count !== (postion + 1)) {
        this.validateRateAmount(count);
      }
      count = count + 1;
    }
  }
  forfromandtoCheck(postion) {
    let count = postion;
    const lengthOfArray = this.stairStepModel.addStairStepForm.controls.stepsArray['controls'].length;
    while (count < lengthOfArray) {
      if (this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][count]['controls']['fromQuantity'].touched) {
        this.checkOverlap(count, 'fromQuantity', false);
      }
      if (this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][count]['controls']['toQuantity'].touched) {
        this.checkOverlap(count, 'toQuantity', false);
      }
      count = count + 1;
    }
  }
  addStair(position: number) {
    this.setValidatorsRequired();
    const rateFC = (this.stairStepModel.addStairStepForm.get('stepsArray') as FormArray).at(position);
    if (rateFC.valid) {
      this.stairStepModel.showMinusIcon = true;
      (this.stairStepModel.addStairStepForm.controls.stepsArray as FormArray).insert(position + 1, this.createStepsItem());
      this.changingStepValue(position);
      const control = this.stairStepModel.addStairStepForm.controls.stepsArray['controls'];
      this.againValidate(position);
      if (position + 1) {
        this.stairStepModel.gaps.splice(this.stairStepModel.gaps.indexOf(position + 1), 1);
      }
      if ((control.length - 1) - (position + 1) > 0) {
        control[position + 2]['controls']['toQuantity'].setErrors(null);
        control[position + 2]['controls']['fromQuantity'].setErrors(null);
        const pos = position + 2;
        this.forfromandtoCheck(pos);
      }
      const toQuantity = rateFC['controls']['toQuantity'].value;
      const toNumber = Number(toQuantity);
      const precision = (rateFC['controls'].toQuantity.value + '').split('.')[1]
        ? (rateFC['controls'].toQuantity.value + '').split('.')[1].length : 0;
      const diffval = 1 / Math.pow(10, precision);
      const addedVal = toNumber + diffval;
      const fixexDecimal = (addedVal).toFixed(precision);
      const rateFC2 = (this.stairStepModel.addStairStepForm.get('stepsArray') as FormArray).at(position + 1);
      rateFC2['controls']['fromQuantity'].setValue(fixexDecimal);
    }
  }
  changingStepValue(position: number) {
    let positionValue = position + 1;
    const lengthOfArray = this.stairStepModel.addStairStepForm.controls.stepsArray['controls'].length;
    if (lengthOfArray > 1) {
      while (positionValue < lengthOfArray) {
        const rateFC1 = (this.stairStepModel.addStairStepForm.get('stepsArray') as FormArray).at(positionValue);
        rateFC1['controls']['step'].setValue(positionValue + this.stairStepModel.indextobeAdded);
        positionValue = positionValue + 1;
      }
    }
  }
  getRateTypes(buSodata) {
    this.addStairStepService.getRateTypes(buSodata).pipe(takeWhile(() => this.stairStepModel.subscribeFlag))
      .subscribe((data) => {
        this.setRAteValue(data);
      });
  }
  setRAteValue(data) {
    if (this.stairStepModel.addStairStepForm && !this.isEditStairStepRateClicked) {
      this.stairStepModel.addStairStepForm['controls']['rateType'].setValue(null);
    }
    this.stairStepModel.rateTypes = [];
    if (data) {
      let rateTypes = data;
      rateTypes = rateTypes.map((rate) => {
        return {
          label: rate.rateTypeName,
          value: rate.rateTypeId
        };
      });
      this.stairStepModel.rateTypes = rateTypes;
    }
  }
  getRoundingTypes() {
    this.addStairStepService.getRoundingTypes().pipe(takeWhile(() => this.stairStepModel.subscribeFlag))
      .subscribe((data) => {
        this.setRoundingValue(data);
      });
  }
  setRoundingValue(data) {
    this.stairStepModel.roundingTypes = [];
    if (data && data['_embedded'] && data['_embedded']['accessorialRateRoundingTypes']) {
      let roundingTypes = data['_embedded']['accessorialRateRoundingTypes'];
      roundingTypes = roundingTypes.map((eachRoundigType) => {
        return {
          label: eachRoundigType.accessorialRateRoundingTypeName,
          value: eachRoundigType.accessorialRateRoundingTypeId
        };
      });
      this.stairStepModel.roundingTypes = roundingTypes;
    }
  }
  getmaxApplidedWhen() {
    this.addStairStepService.getmaxApplidedWhen().pipe(takeWhile(() => this.stairStepModel.subscribeFlag))
      .subscribe((data) => {
        this.setMaximumAppliedWhen(data);
      });
  }
  setMaximumAppliedWhen(data) {
    this.stairStepModel.maxApplidedWhen = [];
    if (data && data['_embedded'] && data['_embedded']['accessorialMaximumRateApplyTypes']) {
      let maxApplidedWhen = data['_embedded']['accessorialMaximumRateApplyTypes'];
      maxApplidedWhen = maxApplidedWhen.map((eachaccessorialMaximumRateApplyTypes) => {
        return {
          label: eachaccessorialMaximumRateApplyTypes.accessorialMaximumRateApplyTypeName,
          value: eachaccessorialMaximumRateApplyTypes['accessorialMaximumRateApplyTypeId']
        };
      });
      this.stairStepModel.maxApplidedWhen = maxApplidedWhen;
    }
  }
  onStairSearch(response, keyName: string) {
    this.stairStepModel.suggestionResult = [];
    if (this.stairStepModel[keyName]) {
      this.stairStepModel[keyName].forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(response['query'].toLowerCase()) !== -1) {
          this.stairStepModel.suggestionResult.push({
            label: element.label,
            value: element.value
          });
        }
        this.stairStepModel.suggestionResult = utils.sortBy(this.stairStepModel.suggestionResult, 'label');
      });
    }
  }
  onFormKeypress(event, keyname: string): boolean | undefined {
    const pattern = /^\-?\d{0,7}(\.\d{0,4})?$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = this.stairStepModel[keyname];
      this.stairStepModel.addStairStepForm['controls'][keyname].setValue(this.stairStepModel[keyname]);
      return false;
    }
    this.stairStepModel[keyname] = event.target.value;
    this.stairStepModel.addStairStepForm['controls'][keyname].setValue(this.stairStepModel[keyname]);
  }
  onFormKeypressRateAmount(event, keyname: string, index): boolean | undefined {
    const pattern = (keyname === 'rateAmount') ? /^\-?\d{0,7}(\.\d{0,4})?$/ : /^\d{0,7}(\.\d{0,4})?$/;
    event.target.value = event.target.value.replace(/,/g, '');
    if (!pattern.test(event.target.value)) {
      event.target.value = this.stairStepModel[keyname];
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls']
      [index]['controls'][keyname].setValue(this.stairStepModel[keyname]);
      return false;
    }
    this.stairStepModel[keyname] = event.target.value;
    this.stairStepModel.addStairStepForm.controls.stepsArray['controls']
    [index]['controls'][keyname].setValue(this.stairStepModel[keyname]);
  }
  onfocusRateAmount(index, keyname: string) {
    this.stairStepModel[keyname] = this.stairStepModel.addStairStepForm.controls.stepsArray['controls']
    [index]['controls'][keyname].value;
    this.stairStepModel[keyname] = this.stairStepModel[keyname].replace(/,/g, '');
    this.stairStepModel.addStairStepForm.controls.stepsArray['controls']
    [index]['controls'][keyname].setValue(this.stairStepModel[keyname]);
  }
  onfocusAmount(controlName: string) {
    this.stairStepModel[controlName] = this.stairStepModel[controlName] ? this.stairStepModel[controlName].replace(/,/g, '') : '';
    this.stairStepModel.addStairStepForm.controls[controlName].setValue(this.stairStepModel[controlName]);
  }
  validateMinMaxAmount(controlName: string) {
    this.converttoTwoDecimal(controlName);
    this.setValidatorsOnSelectMaxApplidedWhen(this.stairStepModel.addStairStepForm['controls']['maxAmount'].value, controlName);
    const minAmountFC = this.stairStepModel.addStairStepForm['controls']['minAmount'];
    const maxAmountFC = this.stairStepModel.addStairStepForm['controls']['maxAmount'];
    this.checkForMaxVAlueRate(maxAmountFC['value']);
    if (minAmountFC.value && maxAmountFC.value) {
      this.checkMinMaxRange();
    }
  }
  converttoTwoDecimal(controlName) {
    const control = this.stairStepModel.addStairStepForm['controls'][controlName];
    const formattedAmount = this.formatAmount(control.value);
    if (formattedAmount && control.value) {
      this.stairStepModel.addStairStepForm['controls'][controlName].setValue(formattedAmount);
    }
  }
  checkMinMaxRange() {
    const rateFC = this.stairStepModel.addStairStepForm['controls'];
    const minAmountFC = rateFC['minAmount'];
    const maxAmountFC = rateFC['maxAmount'];
    const minAmount = parseFloat(minAmountFC.value.replace(/,/g, ''));
    const maxAmount = parseFloat(maxAmountFC.value.replace(/,/g, ''));
    const addRateFormControls = [minAmountFC, maxAmountFC];
    for (const controlName of addRateFormControls) {
      this.setRateFieldError(controlName);
    }
    if (minAmount > maxAmount) {
      this.showError('The minimum amount cannot be greater than the maximum amount');
      minAmountFC.setErrors({ error: true });
      maxAmountFC.setErrors({ error: true });
    }
  }
  setRateFieldError(controlName: AbstractControl) {
    const formattedAmount = this.formatAmount(controlName.value);
    if (formattedAmount) {
      controlName.setErrors(null);
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
  showError(message: string) {
    this.messageService.clear();
    this.messageService.add({
      severity: 'error', summary: 'Valid Information Required',
      detail: message
    });
  }
  setValidatorsOnSelectMaxApplidedWhen(value: string, controlName: string) {
    if (controlName === 'maxApplidedWhen' || controlName === 'maxAmount') {
      const controlT0BeSetValidators = controlName === 'maxApplidedWhen' ? 'maxAmount' : 'maxApplidedWhen';
      this.stairStepModel.addStairStepForm.controls[controlT0BeSetValidators].setValidators(value ? [Validators.required] : null);
      this.stairStepModel.addStairStepForm.controls[controlT0BeSetValidators].updateValueAndValidity();
    }
  }
  onAutoCompleteBlur(event, controlName: string, position: number) {
    this.setValidatorsOnSelectMaxApplidedWhen(event.target.value, controlName);
    if (utils.isEmpty(event.target.value) && controlName === 'step') {
      (this.stairStepModel.addStairStepForm.controls.stepsArray as FormArray).at(position).get(controlName).setValue('');
      (this.stairStepModel.addStairStepForm.controls.stepsArray as FormArray).at(position).get(controlName).markAsDirty();
    }
    if (utils.isEmpty(event.target.value) && controlName !== 'step') {
      this.stairStepModel.addStairStepForm.get(controlName).setValue('');
      this.stairStepModel.addStairStepForm.get(controlName).markAsDirty();
    }
  }
  checkForMaxVAlueRate(maxAmountFC) {
    if (maxAmountFC) {
      const length = this.stairStepModel.addStairStepForm.controls.stepsArray['controls'].length;
      let count = 0;
      while (length > count) {
        if (this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][0]['controls'].step.value.value === 'Free'
          && count === 0) {
          count = count + 1;
          continue;
        }
        this.spliceRateAmounts(maxAmountFC, count);
        count = count + 1;
      }
    } else {
      this.noMaxAmount();
    }
  }

  noMaxAmount() {
    const length = this.stairStepModel.addStairStepForm.controls.stepsArray['controls'].length;
    let count = 0;
    while (length > count) {
      this.validateRateAmount(count);
      count = count + 1;
    }
    this.stairStepModel.rateAmountExceed = [];
  }
  spliceRateAmounts(maxAmountFC, count) {
    const maxValueCheck =
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][count]['controls']['rateAmount'];
    const valuePlaces = new RegExp(',', 'g');
    const intMaxValue = Number(maxAmountFC.toString().replace(valuePlaces, ''));
    const intRateValue = Number(maxValueCheck.value.toString().replace(valuePlaces, ''));
    if (intMaxValue < intRateValue) {
      maxValueCheck.setErrors({ error: true });
      this.checkAndPushGaps(count, 'rateAmountExceed');
    } else if (this.stairStepModel.rateAmountExceed.indexOf(count) >= 0) {
      this.stairStepModel.rateAmountExceed.splice(this.stairStepModel.rateAmountExceed.indexOf(count), 1);
      maxValueCheck.setErrors(null);
    }
  }

  rateAmountValidations(index) {
    const stairFreeValidation = (this.stairStepModel.addStairStepForm.get('stepsArray') as FormArray);
    if (stairFreeValidation.at(0).get('step').value.label === 'Free' && Number(stairFreeValidation.at(0).get('rateAmount').value) !== 0) {
      this.stairStepModel.invalidFreeAmount = true;
      stairFreeValidation['controls'][0]['controls']['rateAmount'].setErrors({ error: true });
    } else {
      this.stairStepModel.invalidFreeAmount = false;
      stairFreeValidation['controls'][0]['controls']['rateAmount'].setErrors(null);
    }
    if ((stairFreeValidation.at(index).get('step').value > 0
      || stairFreeValidation.at(index).get('step').value.label > 0) &&
      Number.parseFloat(stairFreeValidation.at(index).get('rateAmount').value) === 0) {
      this.checkAndPushGaps(index, 'rateAmountValid');
      stairFreeValidation['controls'][index]['controls']['rateAmount'].setErrors({ error: true });
    } else if (this.stairStepModel.rateAmountValid.indexOf(index) >= 0) {
      this.stairStepModel.rateAmountValid.splice(this.stairStepModel.rateAmountValid.indexOf(index), 1);
      stairFreeValidation['controls'][index]['controls']['rateAmount'].setErrors(null);
    }
  }
  converttoTwoDecimalRAte(index) {
    const control = this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['rateAmount'];
    const formattedAmount = this.formatAmount(control.value);
    if (formattedAmount && control.value) {
      control.setValue(formattedAmount);
    }
  }
  validateRateAmount(index) {
    this.converttoTwoDecimalRAte(index);
    this.rateAmountValidations(index);
    const maxAmount = this.stairStepModel.addStairStepForm.controls.maxAmount.value ?
      this.stairStepModel.addStairStepForm.controls.maxAmount.value : '';
    const rateAmount = this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['rateAmount'].value
      ? this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['rateAmount'].value : '';
    const valuePlaces = new RegExp(',', 'g');
    const intMaxValues = Number(maxAmount.toString().replace(valuePlaces, ''));
    const intRateValues = Number(rateAmount.toString().replace(valuePlaces, ''));
    if (this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls'].step.value.value === 'Free'
      && index === 0) {
      if (this.stairStepModel.rateAmountExceed.indexOf(index) >= 0) {
        this.stairStepModel.rateAmountExceed.splice(this.stairStepModel.rateAmountExceed.indexOf(index), 1);
        this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['rateAmount'].setErrors(null);
      }
      return;
    }

    if (maxAmount && (intMaxValues < intRateValues)) {
      this.checkAndPushGaps(index, 'rateAmountExceed');
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['rateAmount'].setErrors({ invalid: true });
    } else if (this.stairStepModel.rateAmountExceed.indexOf(index) >= 0) {
      this.stairStepModel.rateAmountExceed.splice(this.stairStepModel.rateAmountExceed.indexOf(index), 1);
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['rateAmount'].setErrors(null);
    }

  }
  onSelectionOfstep(label) {
    if (label === 'Free') {
      this.stairStepModel.indextobeAdded = 0;
      (this.stairStepModel.addStairStepForm.controls.stepsArray as FormArray).at(0).get('fromQuantity').setValue('0');
      (this.stairStepModel.addStairStepForm.controls.stepsArray as FormArray).at(0).get('rateAmount').setValue('0.00');
      this.stairStepModel.fromQuantityDisabled = true;
      (this.stairStepModel.addStairStepForm.controls.stepsArray as FormArray).at(0).get('fromQuantity').disable();
      this.changingStepValue(0);
    } else {
      this.stairStepModel.indextobeAdded = 1;
      (this.stairStepModel.addStairStepForm.controls.stepsArray as FormArray).at(0).get('fromQuantity').enable();
      this.changingStepValue(0);
    }
    (this.stairStepModel.addStairStepForm.controls.stepsArray as FormArray).at(0).get('fromQuantity').updateValueAndValidity();
    this.rateAmountValidations(0);
    this.validateRateAmount(0);
  }
  removeStair(position: number) {
    const ratesForm = (this.stairStepModel.addStairStepForm.get('stepsArray') as FormArray);
    if (ratesForm.length === 1) {
      const firstRate = ratesForm.at(0);
      firstRate.get('step').setValue('');
      firstRate.get('fromQuantity').setValue('');
      firstRate.get('toQuantity').setValue('');
      firstRate.get('rateAmount').setValue('');
      this.stairStepModel.showMinusIcon = false;
      this.popvalue();
    } else {
      this.removeStairStepLengthNotOne(position, ratesForm);
    }
  }
  removeStairStepLengthNotOne(position, ratesForm) {
    ratesForm.removeAt(position);
    this.changingStepValue(0);
    this.popvalue();
    if (position === 0) {
      (this.stairStepModel.addStairStepForm.controls.stepsArray as FormArray).at(0).get('step').setValue({ label: '1', value: '1' });
      this.onSelectionOfstep(1);
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][0]['controls']['fromQuantity'].setErrors(null);
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][0]['controls']['toQuantity'].setErrors(null);
    }
    ratesForm.length === 1 ? this.checkOverlap(0) :
      (this.stairStepModel.addStairStepForm.controls.stepsArray['controls'].length) === position
        ? this.checkOverlap(position - 1) : this.checkOverlap(position);
    this.validateMinMaxAmount('maxAmount');
    this.forfromandtoCheck(position);
    this.checkOverlap(position, 'fromQuantity');
    const event = {
      target: {
        value
          : this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][position]['controls']['fromQuantity'].value
      }
    };
    this.onFormKeypressRateAmount(event, 'fromQuantity', position);
  }

  popvalue() {
    this.stairStepModel.gaps.pop();
    this.stairStepModel.overlaps.pop();
    this.stairStepModel.invalidRanges.pop();
    this.stairStepModel.invalidPrecisionto.pop();
    this.stairStepModel.invalidPrecisionfrom.pop();
    this.stairStepModel.rateAmountExceed.pop();
    this.stairStepModel.rateAmountValid.pop();
  }
  precisionValidation(index: number, contolVariable: string) {
    const stairForm = (this.stairStepModel.addStairStepForm.get('stepsArray') as FormArray);
    const precision = (stairForm['controls'][0]['controls'].toQuantity.value + '').split('.')[1] ?
      (stairForm['controls'][0]['controls'].toQuantity.value + '').split('.')[1].length : 0;
    const fromQuantityLength = (stairForm['controls'][index]['controls'].fromQuantity.value + '').split('.')[1] ?
      (stairForm['controls'][index]['controls'].fromQuantity.value + '').split('.')[1].length : 0;
    const toQuantityLength = (stairForm['controls'][index]['controls'].toQuantity.value + '').split('.')[1] ?
      (stairForm['controls'][index]['controls'].toQuantity.value + '').split('.')[1].length : 0;
    if ((fromQuantityLength !== precision)) {
      this.checkAndPushGaps(index, 'invalidPrecisionfrom');
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls']
      [index]['controls']['fromQuantity'].setErrors({ invalid: true });
    } else if (this.stairStepModel.invalidPrecisionfrom.indexOf(index) >= 0) {
      this.stairStepModel.invalidPrecisionfrom.splice(this.stairStepModel.invalidPrecisionfrom.indexOf(index), 1);
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['fromQuantity'].setErrors(null);
    }
    if (toQuantityLength !== precision) {
      this.checkAndPushGaps(index, 'invalidPrecisionto');
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['toQuantity'].setErrors({ invalid: true });
    } else if (this.stairStepModel.invalidPrecisionto.indexOf(index) >= 0) {
      this.stairStepModel.invalidPrecisionto.splice(this.stairStepModel.invalidPrecisionto.indexOf(index), 1);
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['toQuantity'].setErrors(null);
    }
  }

  checkOverlap(index: number, range?: string, newAddedRow = true) {
    if (index !== 0) {
      this.precisionValidation(index, range);
    }
    this.gapsLogic(index);
    this.overlapsLogic(index);
    this.checkForNumber(index, 'overlaps');
    if (range && newAddedRow) {
      this.checkOverlapSiblings(index, range);
    }
  }

  gapsLogic(index: number) {
    if (this.checkGaps(index)) {
      this.indexGapOrOverlap(index);
    } else if (this.stairStepModel.gaps.indexOf(index) >= 0) {
      this.stairStepModel.gaps.splice(this.stairStepModel.gaps.indexOf(index), 1);
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['fromQuantity'].setErrors(null);
    } else if (this.stairStepModel.gapOverlap.indexOf(index) >= 0) {
      this.stairStepModel.gapOverlap.splice(this.stairStepModel.gapOverlap.indexOf(index), 1);
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['fromQuantity'].setErrors(null);
    }
  }

  indexGapOrOverlap(index: number) {
    const chargeValues = this.stairStepModel.addStairStepForm['controls'].stepsArray['controls'];
    const diff = (Number(chargeValues[index]['controls']['fromQuantity'].value) -
      Number(chargeValues[index - 1]['controls']['toQuantity'].value));
    if (diff > 0) {
      if (this.stairStepModel.gapOverlap.indexOf(index) >= 0) {
        this.stairStepModel.gapOverlap.splice(this.stairStepModel.gapOverlap.indexOf(index), 1);
        this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['fromQuantity'].setErrors(null);
      }
      this.checkAndPushGaps(index, 'gaps');
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['fromQuantity'].setErrors({ invalid: true });
    } else if (diff <= 0) {
      if (this.stairStepModel.gaps.indexOf(index) >= 0) {
        this.stairStepModel.gaps.splice(this.stairStepModel.gaps.indexOf(index), 1);
        this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['fromQuantity'].setErrors(null);
      }
      this.checkAndPushGaps(index, 'gapOverlap');
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls']
      [index]['controls']['fromQuantity'].setErrors({ invalid: true });
    }
  }
  overlapsLogic(index: number) {
    if (this.checkOverlaps(index)) {
      this.checkAndPushGaps(index, 'overlaps');
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['toQuantity'].setErrors({ invalid: true });
    } else if (this.stairStepModel.overlaps.indexOf(index) >= 0) {
      this.stairStepModel.overlaps.splice(this.stairStepModel.overlaps.indexOf(index), 1);
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['toQuantity'].setErrors(null);
    }
  }

  checkOverlaps(index: number): boolean {
    const chargeValues = this.stairStepModel.addStairStepForm['controls'].stepsArray['controls'];
    const rangeDiff = Number((Number(chargeValues[index]['controls']['fromQuantity'].value) -
      Number(chargeValues[index]['controls']['toQuantity'].value)).toFixed(this.stairStepModel.decimals));
    return ((index && rangeDiff >= 0) || !index && rangeDiff >= 0);
  }

  checkGaps(index: number): boolean {
    const chargeValues = this.stairStepModel.addStairStepForm['controls'].stepsArray['controls'];
    if (chargeValues.length > 1 && index !== 0) {
      this.stairStepModel.gap = [];
      const precision = (chargeValues[index - 1]['controls']['toQuantity'].value + '').split('.')[1]
        ? (chargeValues[index - 1]['controls']['toQuantity'].value + '').split('.')[1].length : 0;
      const diffval = 1 / Math.pow(10, precision);
      const addedVal = 0 + diffval;
      const fixexDecimal = (addedVal).toFixed(precision);
      const numberfixedDecimal = Number(fixexDecimal);
      this.stairStepModel.gap.push(numberfixedDecimal);
    }
    return (index && (this.stairStepModel.gap.indexOf(
      Number((Number(chargeValues[index]['controls']['fromQuantity'].value) -
        Number(chargeValues[index - 1]['controls']['toQuantity'].value))
        .toFixed(this.stairStepModel.decimals))) < 0));
  }

  checkAndPushGaps(index: number, type: string) {
    if (this.stairStepModel[type] && this.stairStepModel[type].indexOf(index) < 0) {
      this.stairStepModel[type].push(index);
    }
  }

  checkOverlapSiblings(overlapIndex: number, range: string) {
    if (range === 'toQuantity' && (this.stairStepModel.addStairStepForm['controls'].stepsArray['controls'].length - 1) !== overlapIndex) {
      this.checkOverlap(overlapIndex + 1);
    } else if (range === 'fromQuantity' && overlapIndex !== 0) {
      this.checkOverlap(overlapIndex - 1);
    }
  }

  checkForNumber(index: number, type: string) {
    if (this.checkNumberValidity(index)) {
      this.checkAndPushGaps(index, 'invalidRanges');
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['fromQuantity'].setErrors({ invalid: true });
      this.stairStepModel.addStairStepForm.controls.stepsArray['controls'][index]['controls']['toQuantity'].setErrors({ invalid: true });
    }
  }

  checkNumberValidity(index) {
    const chargeValues = this.stairStepModel.addStairStepForm['controls'].stepsArray['controls'];
    return utils.isNaN(Number(chargeValues[index]['controls']['fromQuantity'].value)) ||
      utils.isNaN(Number(chargeValues[index]['controls']['toQuantity'].value)) ||
      Number(chargeValues[index]['controls']['toQuantity'].value) < 0 ||
      Number(chargeValues[index]['controls']['fromQuantity'].value) < 0;
  }
}
