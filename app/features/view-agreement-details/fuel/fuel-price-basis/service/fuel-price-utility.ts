import { MessageService } from 'primeng/components/common/messageservice';
import { FuelPriceModel } from './../model/fuel-price-model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import * as utils from 'lodash';
import { SelectItem } from 'primeng/api';

import { PriceFactor, PriceSource, ProgramType, Week, DropdownObject, FuelPriceBasisRegionDTO } from './../model/fuel-price-interface';

export class FuelPriceUtility {
  /****
   * @static
   * @param {boolean} value
   * @param {FuelPriceModel} model
   * @memberof FuelPriceUtility
   */
  static saveSubscription(value: boolean, model: FuelPriceModel) {
    if (value) {
      model.fuelPriceForm.markAsPristine();
      model.fuelPriceForm.markAsUntouched();
    }
  }
  /****
   * @static
   * @param {ProgramType[]} data
   * @param {FuelPriceModel} model
   * @memberof FuelPriceUtility
   */
  static formatPatchFuelPriceBasisType(data: ProgramType[], model: FuelPriceModel) {
    utils.forEach(data, (type: ProgramType) => {
      if (type.fuelProgramPriceBasisTypeName.toLowerCase() === 'calendar') {
        model.fuelPriceType.push({
          label: type.fuelProgramPriceBasisTypeName, value: type.fuelProgramPriceBasisTypeID, styleClass: 'disabled'
        });
      } else {
        model.fuelPriceType.push({ label: type.fuelProgramPriceBasisTypeName, value: type.fuelProgramPriceBasisTypeID });
      }
    });
    model.fuelPriceType = utils.orderBy(model.fuelPriceType, ['label'], ['desc']);
    this.patchDefaultValue(data, model);
  }
  static patchDefaultValue(data: ProgramType[], model: FuelPriceModel) {
    utils.forEach(data, (val: ProgramType) => {
      if (val.fuelProgramPriceBasisTypeName.toLowerCase() === 'price change occurrence') {
        model.fuelPriceForm.patchValue({
          fuelPriceType: val.fuelProgramPriceBasisTypeID
        });
      }
    });
  }
  static formatDropdownData(data: Week[] | PriceFactor[] | PriceSource[], dataValue: string, dataID: string) {
    const List = [];
    utils.forEach(data, (value: Week | PriceFactor | PriceSource) => {
      List.push({
        label: value[dataValue],
        value: {
          label: value[dataValue],
          value: value[dataID]
        }
      });
    });
    return List;
  }
  static formatDayOfWeek(data: string[]) {
    const dayList = [];
    if (!utils.isEmpty(data)) {
      utils.forEach(data, (day: any) => {
        dayList.push({
          label: day.trim(),
          value: {
            label: day.trim(),
            value: day.trim()
          }
        });
      });
    }
    return dayList;
  }
  /****
   * @static
   * @param {FuelPriceModel} model
   * @memberof FuelPriceUtility
   */
  static setDefaultWeek(model: FuelPriceModel) {
    model.weekToApplyList.forEach((defaultWeek: DropdownObject, index: number) => {
      if (defaultWeek.label.toLowerCase() === 'current') {
        model.fuelPriceForm.patchValue({
          weekToApply: model.weekToApplyList[index].value
        });
      }
    });
  }
  /****
   * @static
   * @param {FuelPriceModel} model
   * @memberof FuelPriceUtility
   */
  static setDefaultDayOfWeek(model: FuelPriceModel) {
    if (Number(model.selectedValue) === 1) {
      model.fuelPriceForm.controls.dayOfWeek.setValidators(Validators.required);
      model.dayOfWeekList.forEach((day: DropdownObject, index: number) => {
        if (day.label.toLowerCase() === 'monday') {
          model.fuelPriceForm.controls.dayOfWeek.setValue(model.dayOfWeekList[index].value);
        }
      });
      model.fuelPriceForm.controls.dayOfWeek.updateValueAndValidity();
    } else {
      this.emptyValidators(model, 'dayOfWeek');
    }
  }
  /****
   * @static
   * @param {FuelPriceModel} model
   * @memberof FuelPriceUtility
   */
  static setDefaultMonth(model: FuelPriceModel) {
    if (Number(model.selectedValue) === 2) {
      model.dayOfMonthList.forEach((defaultWeek: DropdownObject, index: number) => {
        if (defaultWeek.label === '1') {
          model.fuelPriceForm.patchValue({
            dayOfMonth: model.dayOfMonthList[index].value
          });
        }
      });
    } else {
      model.dayOfMonthList = [];
      this.emptyValidators(model, 'dayOfMonth');
    }
  }
  static emptyValidators(model: FuelPriceModel, formControl: string) {
    model.fuelPriceForm.controls[formControl].setValue(null);
    model.fuelPriceForm.controls[formControl].setValidators(null);
    model.fuelPriceForm.controls[formControl].updateValueAndValidity();
  }
  /****
   * @static
   * @param {FuelPriceModel} model
   * @memberof FuelPriceUtility
   */
  static setDefaultPriceFactor(model: FuelPriceModel) {
    model.priceFactorTypes.forEach((priceFactor: DropdownObject, index: number) => {
      if (priceFactor.label.toLowerCase() === 'specified fuel day') {
        model.fuelPriceForm.controls.useFuelPriceAsOf.setValue(model.priceFactorTypes[index].value);
        model.selectedPriceFactor = priceFactor.label;
      }
    });
  }
  /***** @static
   * @param {FuelPriceModel} model
   * @memberof FuelPriceUtility
   */
  static setDefaultPriceSource(model: FuelPriceModel) {
    model.priceSource.forEach((priceFactor: DropdownObject, index: number) => {
      if (priceFactor.label.toLowerCase() === 'doe') {
        model.fuelPriceForm.controls.priceSource.setValue(model.priceSource[index].value);
      }
    });
  }
  /****
   * @static
   * @param {FuelPriceModel} model
   * @memberof FuelPriceUtility
   */
  static isShowWeekAvg(model: FuelPriceModel) {
    if (model.selectedPriceFactor.toLowerCase() === 'rolling average') {
      switch (Number(model.selectedValue)) {
        case 1:
          this.showWeekAverage(model);
          break;
        case 2:
          this.showMonthAverage(model);
          break;
        case 3:
          this.showMonthAverage(model);
          break;
        default: break;
      }
      model.fuelPriceForm.controls.monthsInAverage.updateValueAndValidity();
      model.fuelPriceForm.controls.weeksInAverage.updateValueAndValidity();
    } else {
      model.isShowWeekAverage = false;
      model.isshowMonthAverage = false;
      this.emptyValidators(model, 'weeksInAverage');
      this.emptyValidators(model, 'monthsInAverage');
    }
  }
  /***** @static
   * @param {FuelPriceModel} model
   * @memberof FuelPriceUtility
   */
  static showWeekAverage(model: FuelPriceModel) {
    model.isShowWeekAverage = true;
    model.fuelPriceForm.controls.weeksInAverage.setValidators(Validators.required);
    model.weeksInAverage.forEach((day: DropdownObject, index: number) => {
      if (day.label === '4') {
        model.fuelPriceForm.controls.weeksInAverage.setValue(model.weeksInAverage[index].value);
      }
    });
  }
  /****
   * @static
   * @param {FuelPriceModel} model
   * @memberof FuelPriceUtility
   */
  static showMonthAverage(model: FuelPriceModel) {
    model.isshowMonthAverage = true;
    model.fuelPriceForm.controls.monthsInAverage.setValidators(Validators.required);
    model.monthsInAverageList.forEach((day: DropdownObject, index: number) => {
      if (day.label === '3') {
        model.fuelPriceForm.controls.monthsInAverage.setValue(model.monthsInAverageList[index].value);
      }
    });
  }
  static formatRequestParam(model: FuelPriceModel) {
    return {
      fuelPriceChangeOccurrenceTypeDTO: this.formatPriceOccurrenceType(model),
      fuelProgramPriceBasisTypeDTO: this.formatProgramPrice(model),
      fuelPriceFactorTypeDTO: this.formatRequest(model, 'useFuelPriceAsOf', 'fuelPriceFactorTypeID', 'fuelPriceFactorTypeName'),
      fuelPriceSourceTypeDTO: this.formatRequest(model, 'priceSource', 'fuelPriceSourceTypeID', 'fuelPriceSourceTypeName'),
      holidayDelayIndicator: model.fuelPriceForm.controls.delayForHoliday.value.value === 'Yes' ? 'Y' : 'N',
      fuelPriceBasisByWeekDTO: Number(model.selectedValue) === 1 ? this.formatWeekDto(model) : null,
      fuelPriceBasisByMonthDTO: (Number(model.selectedValue) === 2 || Number(model.selectedValue) === 3) ?
        this.formatMonthDto(model) : null,
      fuelPriceBasisRegionSetDTO: {
        fuelPriceBasisRegionTypeDTO: model.fuelPriceForm.get('regionType').value,
        fuelPriceBasisRegionDTOs: this.getRegionDTO(model),
        averageRegionIndicator: model.fuelPriceForm.get('averaging').value ? 'Y' : 'N'
      }
    };
  }
  static formatMonthDto(model: FuelPriceModel) {
    return {
      'averageMonthQuantity': this.getWeekAvg(model, 'monthsInAverage') ? this.getWeekAvg(model, 'monthsInAverage') : null,
      'priceChangeMonthDayNumber': this.getWeekDay(model, 'dayOfMonth') ? this.getWeekDay(model, 'dayOfMonth') : null
    };
  }
  static formatWeekDto(model: FuelPriceModel) {
    return {
      'weekToApplyDTO': this.formatRequest(model, 'weekToApply', 'weekToApplyID', 'weekToApplyName'),
      'priceChangeWeekDayName': this.getWeekDay(model, 'dayOfWeek') ? this.getWeekDay(model, 'dayOfWeek') : null,
      'averageWeekQuantity': this.getWeekAvg(model, 'weeksInAverage') ? this.getWeekAvg(model, 'weeksInAverage') : null
    };
  }
  static getWeekDay(model: FuelPriceModel, formControl: string) {
    let response = '';
    if (model.fuelPriceForm.controls[formControl].value) {
      response = model.fuelPriceForm.controls[formControl].value.value ? model.fuelPriceForm.controls[formControl].value.value : null;
    }
    return response;
  }
  static getWeekAvg(model: FuelPriceModel, formControl: string) {
    let response = '';
    if (model.fuelPriceForm.controls[formControl].value) {
      response = model.fuelPriceForm.controls[formControl].value.label ? model.fuelPriceForm.controls[formControl].value.label : null;
    }
    return response;
  }
  static formatRequest(model: FuelPriceModel, formControl: string, id: string, name: string): object | null {
    const obj = {};
    if (model.fuelPriceForm.controls[formControl].value) {
      obj[name] = model.fuelPriceForm.controls[formControl].value.label;
      obj[id] = model.fuelPriceForm.controls[formControl].value.value;
    }
    return !utils.isEmpty(obj) ? obj : null;
  }
  static formatPriceOccurrenceType(model: FuelPriceModel): object | null {
    const value = model.fuelPriceForm.controls.fuelPriceBasisTypes.value;
    let request = {};
    utils.forEach(model.fuelPriceBasisTypes, (data: SelectItem) => {
      if (data.value === Number(value)) {
        request = {
          'fuelPriceChangeOccurrenceTypeName': data.label,
          'fuelPriceChangeOccurrenceTypeID': data.value
        };
      }
    });
    return (!utils.isEmpty(request)) ? request : null;
  }
  static formatProgramPrice(model: FuelPriceModel): object | null {
    const value = model.fuelPriceForm.controls.fuelPriceType.value;
    let request = {};
    utils.forEach(model.fuelPriceType, (data: SelectItem) => {
      if (data.value === value) {
        request = {
          'fuelProgramPriceBasisTypeID': data.value,
          'fuelProgramPriceBasisTypeName': data.label
        };
      }
    });
    return (!utils.isEmpty(request)) ? request : null;
  }
  /****
   * @static
   * @param {FuelPriceModel} model
   * @param {MessageService} messageService
   * @memberof FuelPriceUtility
   */
  static onClickNext(model: FuelPriceModel, messageService: MessageService) {
    utils.forIn(model.fuelPriceForm.controls, (value: FormControl, name: string) => {
      if (name !== 'customRegion') {
        model.fuelPriceForm.controls[name].markAsTouched();
      } else {
        utils.forEach(model.fuelPriceForm.controls[name]['controls'], (control: FormGroup) => {
          utils.forIn(control['controls'], (data: FormControl, controlname: string) => {
            control['controls'][controlname].markAsTouched();
          });
        });
      }
    });
    this.toast(messageService, 'error', 'Missing Required Information',
      'Provide the required information in the highlighted fields and submit the form again');
  }
  /****
   * @static
   * @param {MessageService} messageService
   * @param {string} type
   * @param {string} title
   * @param {string} detail
   * @memberof FuelPriceUtility
   */
  static toast(messageService: MessageService, type: string, title: string, detail: string) {
    messageService.clear();
    messageService.add({
      severity: type,
      summary: title,
      detail
    });
  }
  /****
   * @static
   * @param {MessageService} messageService
   * @param {string} key
   * @param {string} data
   * @memberof FuelPriceUtility
   */
  static toastMessage(messageService: MessageService, key: string, data: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? 'Error' : 'Success',
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
  /****
   * @static
   * @param {FuelPriceModel} model
   * @memberof FuelPriceUtility
   */
  static resetFlags(model: FuelPriceModel) {
    model.isSelectedWeekly = false;
    model.isSelectedMonthly = false;
    model.isSelectedLastDay = false;
  }
  static getRegionDTO(model: FuelPriceModel): FuelPriceBasisRegionDTO[] | null {
    const returnDto = [];
    if (!utils.isEmpty(model.fuelPriceForm.get('customRegion').value)) {
      utils.forEach(model.fuelPriceForm.get('customRegion').value, (values) => {
        returnDto.push({
          fuelDistrictDTO: values['region'],
          isDefinedRegionStates: (!model.fuelPriceForm.get('averaging').value) ? 'Yes' : null,
          associatedStates: !model.fuelPriceForm.get('averaging').value ? values['states'] : null
        });
      });
    }
    return (!utils.isEmpty(returnDto)) ? returnDto : null;
  }
  /**** * @memberof FuelPriceBasisComponent */
  static resetFormValue(model: FuelPriceModel) {
    model.fuelPriceForm.reset();
    model.fuelPriceForm.markAsUntouched();
    model.fuelPriceForm.markAsPristine();
    model.fuelPriceForm.updateValueAndValidity();
  }
  /** * @static
   * @param {FuelPriceModel} model
   * @memberof FuelPriceUtility */
  static setDefaultDelay(model: FuelPriceModel) {
    model.delayForHoliday.forEach((val: DropdownObject) => {
      if (val.label === 'No') {
        model.fuelPriceForm.patchValue({
          delayForHoliday: val.value
        });
      }
    });
  }
  /**
   * @static
   * @param {FuelPriceModel} model
   * @memberof FuelPriceUtility */
  static weeklySelected(model: FuelPriceModel) {
    this.resetFlags(model);
    model.isSelectedWeekly = true;
    this.setDefaultDayOfWeek(model);
    this.setDefaultWeek(model);
    this.isShowWeekAvg(model);
  }
}


