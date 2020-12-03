import { MessageService } from 'primeng/components/common/messageservice';
import { FuelCalculationModel } from '../models/fuel-calculation.model';
import { UploadDataList, CustomToastMessage } from '../models/fuel-calculation.interface';
import { Message } from 'primeng/components/common/message';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FuelCalculationDetailsComponent } from '../fuel-calculation-details.component';
import * as utils from 'lodash';

export class FuelCalculationDetailsUtility {
  static setDefaultReqParam(model: FuelCalculationModel) {
    model.fuelCalculationDetailsReqParam['fuelCalculationDateType'] =
      model.FuelCalculationForm.controls['fuelcalculationdatetype']['value'];
    model.fuelCalculationDetailsReqParam['chargeType'] =
      model.FuelCalculationForm.controls['chargetype']['value']['value'];
    model.fuelCalculationDetailsReqParam['fuelRoundingDecimal'] =
      model.FuelCalculationForm.controls['roundingdigit']['value'];
    model.fuelCalculationDetailsReqParam['fuelCalculationType'] =
      model.FuelCalculationForm.controls['calculationtype']['value'];
    model.fuelCalculationDetailsReqParam['fuelRateType'] =
      model.FuelCalculationForm.controls['ratetype']['value'];
    model.fuelCalculationDetailsReqParam['fuelType'] =
      model.FuelCalculationForm.controls['fueltype']['value'];
    model.fuelCalculationDetailsReqParam['fuelDiscountType'] = null;
    model.fuelCalculationDetailsReqParam['rollUpIndicator'] = 'N';
  }
  static toastMessage(messageService: MessageService, key: string, data: string, customSummary?: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? (customSummary ? customSummary : 'Error') : (customSummary ? customSummary : 'Success'),
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }

  static removeDelimiters(value: string) {
    let enteredAmount;
    if (value !== '') {
      enteredAmount = value.replace(/[, ]/g, '').trim();
    }
    return enteredAmount;
  }

  static uploadClickYes(model: FuelCalculationModel) {
    model.uploadTablearray = [];
    model.selectedItemList = [];
    model.uploadPopup = false;
    model.tableFlag = false;
    model.loaderFlag = false;
    model.uploadFlag = true;
    model.inlineError = false;
  }

  static checkGapDupliates(model: FuelCalculationModel) {
    model.inlineError = true;
    model.overlaps = [];
    model.duplicateCharges = [];
    model.gaps = [];
    model.invalidCharges = [];
    model.invalidRanges = [];
    model.emptyBeginAmount = [];
    model.emptyChargeAmount = [];
    model.emptyEndAmount = [];
  }
  static getIncrementalError(model: FuelCalculationModel): Message {
    return {
      severity: 'error',
      summary: 'Error Message',
      detail: (model.overlaps.length ? 'Overlapping fuel amounts found; please correct to proceed <br>' : '')
        .concat(model.gaps.length ? 'Gaps exist in fuel price range; please correct to proceed <br>' : '')
        .concat(model.duplicateCharges.length ? 'Duplicate rates exist, please correct to proceed <br>' : '')
        .concat(model.invalidRanges.length ? 'Invalid Fuel ranges; please correct to proceed <br>' : '')
        .concat(model.invalidCharges.length ? 'Invalid Charge Amount; please correct to proceed <br>' : '')
        .concat(model.emptyBeginAmount.length ? 'Blank Begin Fuel Surcharge Amount given; please correct or remove row <br>' : '')
        .concat(model.emptyEndAmount.length ? 'Blank End Fuel Surcharge Amount given; please correct or remove row <br>' : '')
        .concat(model.emptyChargeAmount.length ? 'Blank Fuel Amount given; please correct or remove row <br>' : '')
    };
  }
  static getIncrementalSuccess(): Message {
    return {
      severity: 'success',
      summary: 'Success Message',
      detail: 'Increments loaded have passed all validations'
    };
  }
  static getIncrementalFormStatus(model: FuelCalculationModel): boolean {
    return (!model.overlaps.length && !model.duplicateCharges.length
      && model.uploadTablearray.length && !model.gaps.length &&
      !model.invalidRanges.length && !model.invalidCharges.length && !model.emptyBeginAmount.length &&
       !model.emptyEndAmount.length && !model.emptyChargeAmount.length);
  }
  static capValidation(model: FuelCalculationModel, changeDetector: ChangeDetectorRef) {
    model.validationFlag = false;
    const incrementIntervalConstant = this.capAmtFormat(model.FormulaDetailsForm.controls['incrementalinterval'].value);
    const implementationPriceConstant = this.capAmtFormat(
      model.FormulaDetailsForm.controls['implementationprice'].value);
    const incrementalChargeConstant = this.capAmtFormat(model.FormulaDetailsForm.controls['incrementalcharge'].value);
    const fuelSurchargeConstant = this.capAmtFormat(model.FormulaDetailsForm.controls['fuelsurcharge'].value);
    const fuelCalculationConstant = [incrementIntervalConstant, implementationPriceConstant,
      incrementalChargeConstant, fuelSurchargeConstant];
    const capConstant = this.capAmtFormat(model.FormulaDetailsForm.controls['cap'].value);
    let count = 0;
    if (capConstant) {
      for (const fuelValue of fuelCalculationConstant) {
        if ((capConstant > fuelValue) && (capConstant !== fuelValue)) {
          count++;
        }
      }
      if (count === 4) {
        model.capValidationFlag = false;
      } else if (count < 4 && capConstant > 0) {
        model.capValidationFlag = true;
        model.inlineErrormessage = [];
        model.inlineErrormessage.push({
          severity: 'error', summary: 'Error Message',
          detail: 'Cap must be greater than fuel formula factors; please correct or zero the cap amount'
        });
      }
    } else {
      model.capValidationFlag = false;
    }
    changeDetector.detectChanges();
  }
  static capAmtFormat(val: string): number {
    if (val) {
      return parseFloat(val.replace(/[,]/g, ''));
    } else {
      return 0;
    }
  }

  static onClickToastMsg(model: FuelCalculationModel): CustomToastMessage {
    const toastMsg = (model.selectedFormName === 'Increment' && !model.uploadTablearray.length) ?
      'Upload Incremental Program Spreadsheet' : 'Provide the required information in the highlighted fields and submit the form again';
    const toastMsgType = (model.selectedFormName === 'Increment' && !model.uploadTablearray.length) || (this.checkErrors(model)) ?
      'Missing Required Information' : 'Error';
    return { 'data': toastMsg, 'customSummary': toastMsgType };
  }

  static selectFormName(formName: string, fuelCalculationDetailsComponent: FuelCalculationDetailsComponent) {
    switch (formName) {
      case 'Flat':
        fuelCalculationDetailsComponent.saveRequestforFlatFuel();
        break;
      case 'Formula':
        fuelCalculationDetailsComponent.saveRequestforFormulaFuel();
        break;
      case 'Refrigerated':
        fuelCalculationDetailsComponent.saveRequestforReferFuel();
        break;
      case 'Distance Per Fuel Quantity':
        fuelCalculationDetailsComponent.saveRequestforMpgFuel();
        break;
      case 'Increment':
        this.saveRequestforIncremental(fuelCalculationDetailsComponent.fuelCalculationModel);
        break;
      default: break;
    }
  }
  static saveRequestforIncremental(model: FuelCalculationModel) {
    if (!utils.isEmpty(model.uploadTablearray)) {
      utils.forEach(model.uploadTablearray, (data: UploadDataList) => {
        model.uploadreqParam.push({
          'fuelIncrementCalculationMethodConfigurationSetID': null,
          'fuelIncrementCalculationMethodConfigurationID': null,
          'fuelBeginAmount': data.fuelBeginAmount, 'fuelEndAmount': data.fuelEndAmount,
          'fuelSurchargeAmount': data.fuelSurchargeAmount, 'isRemoved': null, 'isEdited': null
        });
      });
    }
    model.flatCalculationData['flatConfigurationID'] = null;
    model.flatCalculationData['fuelSurchargeAmount'] = null;
    model.fuelCalculationDetailsReqParam['flatConfiguration'] = null;
    model.fuelCalculationDetailsReqParam['formulaConfiguration'] = null;
    model.fuelCalculationDetailsReqParam['reeferConfiguration'] = null;
    model.fuelCalculationDetailsReqParam['distancePerFuelQuantityConfiguration'] = null;
    model.fuelCalculationDetailsReqParam['fuelIncrementalPriceDTOs'] = model.uploadreqParam ?
    model.uploadreqParam : null;
  }
  static checkGapAndOverlap(index: number, model: FuelCalculationModel): boolean {
    const chargeValues = model.uploadTablearray;
    const roundvalue = model.FuelCalculationForm.controls['roundingdigit']['value']['fuelRoundingDecimalNumber'];
    const gapDiff = index ? Number((Number(chargeValues[index]['fuelBeginAmount']) - Number(chargeValues[index - 1]['fuelEndAmount']))
    .toFixed(roundvalue)) : 0;
    return (index && (model.gap[roundvalue] !== gapDiff));
  }
  static checkGapOrDuplicate(index: number, model: FuelCalculationModel): string {
    let response;
    const chargeValues = model.uploadTablearray;
    const roundingvalue = model.FuelCalculationForm.controls['roundingdigit']['value']['fuelRoundingDecimalNumber'];
    if (index && (chargeValues[index]['fuelBeginAmount'] !== '' && chargeValues[index]['fuelEndAmount'] !== '' &&
     chargeValues[index - 1]['fuelEndAmount'] !== '') || !index) {
      const gapDiff = index ? Number((Number(chargeValues[index]['fuelBeginAmount']) - Number(chargeValues[index - 1]['fuelEndAmount']))
      .toFixed(roundingvalue)) : 0;
      if (index && ( gapDiff <= 0 )) {
        response = 'overlaps';
      }
      if (index && gapDiff > 0 && model.gap[roundingvalue] !== gapDiff) {
        response = 'gaps';
      }
    }
    return response;
  }
  static checkAndPushGaps(index: number, type: string, model: FuelCalculationModel, range?: string, checkRangeDiff = true) {
    if (model[type] && model[type].indexOf(index) < 0) {
      model[type].push(index);
    }
    switch (type) {
      case 'overlaps':
        const arrayNotOverlap = ['gaps', 'invalidRanges'];
        this.spliceIndex(index, model, arrayNotOverlap);
        break;
      case 'gaps':
        let arrayNotgaps;
        if (range === 'fuelBeginAmount') {
          arrayNotgaps = ['overlaps'];
        } else {
          arrayNotgaps = [];
        }
        this.spliceIndex(index, model, arrayNotgaps);
        break;
      case 'invalidRanges':
        let arrayNotInvalidRange;
        if (!checkRangeDiff) {
          arrayNotInvalidRange = ['gaps'];
        } else {
          arrayNotInvalidRange = ['overlaps'];
        }
        this.spliceIndex(index, model, arrayNotInvalidRange);
        break;
      case 'invalidCharges':
        const arrayNotInvalidCharge = ['emptyChargeAmount'];
        this.spliceIndex(index, model, arrayNotInvalidCharge);
      break;
      case 'emptyChargeAmount':
        const arrayNotEmptyCharge = ['invalidCharges'];
        this.spliceIndex(index, model, arrayNotEmptyCharge);
      break;
      case 'emptyBeginAmount':
        const arrayNotEmptyRange = ['invalidRanges', 'overlaps'];
        this.spliceIndex(index, model, arrayNotEmptyRange);
      break;
      case 'emptyEndAmount':
        const arrayNotEmptyRange1 = ['invalidRanges'];
        this.spliceIndex(index, model, arrayNotEmptyRange1);
      break;
      default: break;
    }
  }
  static spliceIndex(index: number, model: FuelCalculationModel, arr: string[]) {
    utils.forEach(arr, (value) => {
      if (model[value].indexOf(index) >= 0) {
        model[value].splice(model[value].indexOf(index), 1);
      }
    });
  }
  static checkForNumber(index: number, model: FuelCalculationModel, range?: string) {
    this.checkRangeEmpty(index, model, 'fuelBeginAmount', 'emptyBeginAmount');
    this.checkRangeEmpty(index, model, 'fuelEndAmount', 'emptyEndAmount');
    this.isChargeNotNumber(index, model, range);
    this.checkChargeEmpty(index, model);
    if (model.uploadTablearray[index]['fuelSurchargeAmount']) {
      if (utils.isNaN(Number(model.uploadTablearray[index]['fuelSurchargeAmount']))) {
        this.checkAndPushGaps(index, 'invalidCharges', model);
      } else if (model.invalidCharges.indexOf(index) >= 0) {
        model.invalidCharges.splice(model.invalidCharges.indexOf(index), 1);
      }
    }
  }
  static checkRangeEmpty(index: number, model: FuelCalculationModel, rangeType: string, errorType: string) {
    if (model.uploadTablearray[index][rangeType] === '' || !model.uploadTablearray[index][rangeType]) {
      this.checkAndPushGaps(index, errorType, model);
    } else if (model[errorType].indexOf(index) >= 0) {
      model[errorType].splice(model[errorType].indexOf(index), 1);
    }
  }
  static checkChargeEmpty(index: number, model: FuelCalculationModel) {
    if (!model.uploadTablearray[index]['fuelSurchargeAmount']) {
      this.checkAndPushGaps(index, 'emptyChargeAmount', model);
    } else if (model.emptyChargeAmount.indexOf(index) >= 0) {
      model.emptyChargeAmount.splice(model.emptyChargeAmount.indexOf(index), 1);
    }
  }

  static isChargeNotNumber(index: number, model: FuelCalculationModel, range?: string) {
    if (model.uploadTablearray[index]['fuelBeginAmount'] || model.uploadTablearray[index]['fuelEndAmount']) {
      if (this.isNumberCheck(index, model)) {
        const chargeValues = model.uploadTablearray;
        const roundingvalue = model.FuelCalculationForm.controls['roundingdigit']['value']['fuelRoundingDecimalNumber'];
        if (model.uploadTablearray[index]['fuelBeginAmount'] !== '' && model.uploadTablearray[index]['fuelEndAmount'] !== '') {
          const checkRangeDiff = Number((Number(chargeValues[index]['fuelBeginAmount']) -
          Number(chargeValues[index]['fuelEndAmount'])).toFixed(roundingvalue)) > 0;
          this.checkAndPushGaps(index, 'invalidRanges', model, range, checkRangeDiff);
        } else {
          this.checkAndPushGaps(index, 'invalidRanges', model, range);
        }
      } else if (model.invalidRanges.indexOf(index) >= 0) {
        model.invalidRanges.splice(model.invalidRanges.indexOf(index), 1);
      }
    }
  }
  static isNumberCheck(index: number, model: FuelCalculationModel): boolean {
    const chargeValues = model.uploadTablearray;
    const roundingvalue = model.FuelCalculationForm.controls['roundingdigit']['value']['fuelRoundingDecimalNumber'];
    let flagCompare, flagForEndAmt;
    if (model.uploadTablearray[index]['fuelBeginAmount'] !== '' && model.uploadTablearray[index]['fuelEndAmount'] !== '') {
      flagCompare = Number((Number(chargeValues[index]['fuelBeginAmount']) -
      Number(chargeValues[index]['fuelEndAmount'])).toFixed(roundingvalue)) > 0;
    } else {
      flagCompare = false;
    }
    if (model.uploadTablearray[index]['fuelEndAmount'] !== '') {
      flagForEndAmt = Number(model.uploadTablearray[index]['fuelEndAmount']) <= 0;
    } else {
      flagForEndAmt = false;
    }
    if (model.uploadTablearray[index]['fuelBeginAmount'] !== '' && model.uploadTablearray[index]['fuelEndAmount'] !== ''
    && model.uploadTablearray[index]['fuelEndAmount'] !== undefined && model.uploadTablearray[index]['fuelBeginAmount'] !== undefined) {
    return (utils.isNaN(Number(model.uploadTablearray[index]['fuelBeginAmount'])) ||
        utils.isNaN(Number(model.uploadTablearray[index]['fuelEndAmount'])) ||
        flagForEndAmt || Number(model.uploadTablearray[index]['fuelBeginAmount']) < 0 || flagCompare);
    } else {
      return false;
    }
  }
  static overLapOrDuplicateMsg(model: FuelCalculationModel) {
    model.incrementalErrorMsg = [];
    model.incrementalErrorMsg[0] = this.checkErrors(model) ? this.getIncrementalError(model) : this.getIncrementalSuccess();
    }
  static checkErrors(model: FuelCalculationModel) {
    return (model.overlaps.length || model.duplicateCharges.length ||
    model.gaps.length || model.invalidRanges.length ||
    model.invalidCharges.length || model.emptyBeginAmount.length || model.emptyEndAmount.length || model.emptyChargeAmount.length);
  }
  static checkDuplicateCharge(index: number, model: FuelCalculationModel): UploadDataList[] {
    return (model.uploadTablearray.filter(value =>
      value.fuelSurchargeAmount === model.uploadTablearray[index]['fuelSurchargeAmount']));
  }
  static pushDuplicateCharge(index, model: FuelCalculationModel) {
    if (this.checkDuplicateCharge(index, model).length === 2) {
      const tempValues = JSON.parse(JSON.stringify(model.uploadTablearray));
      tempValues[index]['fuelSurchargeAmount'] = '';
      model.duplicateCharges.push(tempValues.findIndex(rowValue =>
        Number(rowValue.fuelSurchargeAmount) === Number(model.uploadTablearray[index]['fuelSurchargeAmount'])));
    }
  }
  static checkChargeValue(index: number, model: FuelCalculationModel) {
    if (model.uploadTablearray[index]['fuelSurchargeAmount'] !== '' && model.uploadTablearray[index]['fuelSurchargeAmount'] !== undefined) {
      if (this.checkDuplicateCharge(index, model).length > 1) {
        this.checkAndPushGaps(index, 'duplicateCharges', model);
        this.pushDuplicateCharge(index, model);
      }
      if (model.duplicateCharges.indexOf(index) >= 0) {
        const tempCharges = JSON.parse(JSON.stringify(model.duplicateCharges));
        for (const tempCharge of tempCharges) {
          if (this.checkDuplicateCharge(tempCharge, model).length === 1) {
            model.duplicateCharges.splice(model.duplicateCharges.indexOf(tempCharge), 1);
          }
        }
      }
    }
      this.checkForNumber(index, model);
      this.overLapOrDuplicateMsg(model);
  }
  static checkMinimumInArray (model: FuelCalculationModel) {
    const errArray = ['overlaps', 'duplicateCharges', 'gaps', 'invalidCharges', 'invalidRanges'];
    model.checkMinArray = [];
    utils.forEach(errArray, data => {
      model.checkMinArray.push(Math.min.apply(null, model[data]));
    });
    model.minArrayVal = Math.min.apply(null , model.checkMinArray) <= 0 ? 1 : Math.min.apply(null , model.checkMinArray);
  }
  static checkOverLapNo(index: number, model: FuelCalculationModel) {
    if (model.overlaps.indexOf(index) >= 0) {
      model.overlaps.splice(model.overlaps.indexOf(index), 1);
    }
    if (model.gaps.indexOf(index) >= 0) {
      model.gaps.splice(model.gaps.indexOf(index), 1);
    }
  }
  static getSelectedListRows(model: FuelCalculationModel) {
    const rowIndex = [];
    const clonedCodes = JSON.parse(JSON.stringify(model.selectedItemList));
    utils.forEach(clonedCodes, (codes: UploadDataList) => {
      rowIndex.push(codes.id);
    });
    model.selectedRowIndex = rowIndex;
  }
  static removeSelectedCharges(model: FuelCalculationModel, selectedItemList: UploadDataList[]) {
    const filteredKeywords = model.uploadTablearray.filter((tableValue) => !selectedItemList.includes(tableValue));
    model.uploadTablearray = filteredKeywords;
    model.selectedItemList = [];
  }
  static checkValidations(index: number, model: FuelCalculationModel, range?: string) {
    if (this.checkGapAndOverlap(index, model)) {
      const errorReason = this.checkGapOrDuplicate(index, model);
      this.checkAndPushGaps(index, errorReason, model);
    } else {
      this.checkOverLapNo(index, model);
    }
    if (range) {
      this.checkForNumber(index, model, range);
    } else {
      this.checkForNumber(index, model);
    }
  }
  static fourDecimalprecision(precision:  number, model: FuelCalculationModel, index: number) {
    model.uploadTablearray[index].fuelBeginAmount = this.checkAndChangePrecision(model, precision, index, 'fuelBeginAmount');
    model.uploadTablearray[index].fuelEndAmount = this.checkAndChangePrecision(model, precision, index, 'fuelEndAmount');
    model.uploadTablearray[index].fuelSurchargeAmount = this.checkAndChangePrecision(model, precision, index, 'fuelSurchargeAmount');
    }
  static checkAndChangePrecision(model: FuelCalculationModel, precision: number, index: number, fieldName: string): string {
    return model.uploadTablearray[index][fieldName] === '' ? '' :
    Number(model.uploadTablearray[index][fieldName]).toFixed(precision).toString()
    === 'NaN' ? model.uploadTablearray[index][fieldName] :
    Number(model.uploadTablearray[index][fieldName]).toFixed(precision).toString();
  }
  static checkIfIncrement(model: FuelCalculationModel) {
    if (model.buttonNavigate !== 'Increment') {
      model.subscriberUploadFlag = false;
    } else {
      model.subscriberUploadFlag = true;
    }
  }

  static customSort(event) {
    event.data.sort((data1, data2) => {
      return (event.order * FuelCalculationDetailsUtility.applySort(data1[event.field], data2[event.field]));
    });
  }

  static applySort(data1: string, data2: string): number {
    let result = 0;
    const value1 = data1 === undefined ? 0 : Number(data1);
    const value2 = data2 === undefined ? 0 : Number(data2);
    if (Number.isNaN(value1) || Number.isNaN(value2)) {
        result = 0;
    } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
    }
    return result;
  }
  static checkHeight(elref: ElementRef, model: FuelCalculationModel,  changeDetector: ChangeDetectorRef) {
      const height = elref.nativeElement.querySelector('.uploadTable .ui-table .ui-table-scrollable-body table').offsetHeight;
      const divHeight = elref.nativeElement.querySelector('.uploadTable .ui-table .ui-table-scrollable-body').offsetHeight;
      if (height > divHeight) {
        model.heightCheckFlag = true;
      } else {
        model.heightCheckFlag = false;
      }
      changeDetector.detectChanges();
  }
  static saveSubscriptionUtility(model: FuelCalculationModel) {
    model.FuelCalculationForm.markAsPristine();
    model.FuelCalculationForm.markAsUntouched();
    if (model.selectedFormName === model.flatFuelName) {
      model.FlatDetailsForm.markAsPristine();
      model.FlatDetailsForm.markAsUntouched();
    } else if (model.selectedFormName === model.formulaFuelName) {
      model.FormulaDetailsForm.markAsPristine();
      model.FormulaDetailsForm.markAsUntouched();
    } else if (model.selectedFormName === model.refrigeratedFuelName) {
      model.ReferDetailsForm.markAsPristine();
      model.ReferDetailsForm.markAsUntouched();
    } else if (model.selectedFormName === model.distanceFuelName) {
      model.DistanceDetailsForm.markAsPristine();
      model.DistanceDetailsForm.markAsUntouched();
    }
  }
  static FuelCalculationForm(formbuilder: FormBuilder): FormGroup {
    return formbuilder.group({
      fuelcalculationdatetype: ['', Validators.required],
      chargetype: ['', Validators.required],
      roundingdigit: ['', Validators.required],
      calculationtype: ['', Validators.required],
      ratetype: ['', Validators.required],
      fueltype: ['', Validators.required],
      currency: ['', Validators.required],
      rollup: [''],
      draydiscount: [''],
      fuelmethod: ['']
    });
  }
  static FlatDetailsForm(formbuilder: FormBuilder): FormGroup {
    return formbuilder.group({
      fuelsurchargeamount: ['', Validators.required]
    });
  }
  static FormulaDetailsForm(formbuilder: FormBuilder): FormGroup {
    return formbuilder.group({
      fuelsurcharge: ['', Validators.required],
      incrementalcharge: ['', Validators.required],
      implementationprice: ['', Validators.required],
      incrementalinterval: ['', Validators.required],
      cap: ['', Validators.required]
    });
  }
  static ReferDetailsForm(formbuilder: FormBuilder): FormGroup {
    return formbuilder.group({
      distanceunit: ['', Validators.required],
      fuelqtyunit: ['', Validators.required],
      implementprice: ['', Validators.required],
      burnrate: ['', Validators.required],
      distancehour: ['', Validators.required],
      distancerounding: ['', Validators.required],
      loadinghours: [''],
      servicehour: [''],
      addhours: [''],
      servicehourrounding: ['']
    });
  }
  static DistanceDetailsForm(formbuilder: FormBuilder): FormGroup {
    return formbuilder.group({
      distance: ['', Validators.required],
      fuelqty: ['', Validators.required],
      distanceper: ['', Validators.required],
      incrementalprice: ['', Validators.required],
      addonamount: ['']
    });
  }
  static onEditTableValidation(event, data: object, value: string, model: FuelCalculationModel): boolean | undefined {
    const pattern = /^\-?\d{0,7}(\.\d{0,4})?$/;
    if (!pattern.test(event.target.value) || Number(event.target.value) > 9999999) {
      event.target.value = model.editValue;
      data[value] = model.editValue;
      return false;
    }
    model.editValue = event.target.value;
    data[value] = model.editValue;
  }
  static checkRollUp(model: FuelCalculationModel) {
    if (model.FuelCalculationForm.controls['calculationtype']['value'] &&
    model.FuelCalculationForm.controls['calculationtype']['value'].fuelCalculationTypeName.
    toLowerCase() === 'breakthrough fuel') {
      model.isShowRollUp = false;
      model.FuelCalculationForm.controls['rollup'].reset();
      model.fuelCalculationDetailsReqParam['rollUpIndicator'] = 'N';
    } else {
      model.isShowRollUp = true;
    }
  }
}
