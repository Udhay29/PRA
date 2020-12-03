import { FormArray, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import * as utils from 'lodash';
import { SelectItem } from 'primeng/api';
import { ChangeDetectorRef } from '@angular/core';

import { FuelPriceBasisRegionTypesItem, DistrictList, SelectButtonEvent } from './../model/fuel-price-interface';
import { FuelPriceModel } from './../model/fuel-price-model';
export class FuelPriceBasisUtility {
  static returnRegionType(fuelPriceBasisRegionTypes: FuelPriceBasisRegionTypesItem[], model: FuelPriceModel): SelectItem[] {
    let regionTypeList = [];
    utils.forEach(fuelPriceBasisRegionTypes, (fuelPriceBasisRegion: FuelPriceBasisRegionTypesItem) => {
      regionTypeList.push({
        label: fuelPriceBasisRegion.fuelPriceBasisRegionTypeName,
        value: {
          fuelPriceBasisRegionTypeID: fuelPriceBasisRegion.fuelPriceBasisRegionTypeID,
          fuelPriceBasisRegionTypeName: fuelPriceBasisRegion.fuelPriceBasisRegionTypeName
        }
      });
    });
    regionTypeList = utils.orderBy(regionTypeList, ['label'], ['desc']);
    model.fuelPriceForm.patchValue({ regionType: regionTypeList[0].value });
    model.isShowRegion = true;
    return regionTypeList;
  }
  static getDistrictList(districts: DistrictList[]): SelectItem[] {
    const districtsList = [];
    utils.forEach(districts, (district: DistrictList) => {
      districtsList.push({
        value: district,
        label: utils.isNull(district.fuelSubDistrictName) ? district.fuelNationalDistrictName : district.fuelSubDistrictName
      });
    });
    return districtsList;
  }
  /** function to delete all the controls of an form array
   * @static
   * @param {FuelPriceModel} model
   * @memberof FuelPriceBasisUtility
   */
  static clearArrayControl(model: FuelPriceModel) {
    const controlArray = model.fuelPriceForm.controls['customRegion'];
    utils.forEach(controlArray['controls'], (controlValue: FormControl) => {
      const validation = (model.fuelPriceForm.controls['averaging'].value) ? null : Validators.required;
      controlValue['controls']['regionStateOption'].setValidators(validation);
      controlValue['controls']['regionStateOption'].reset();
      controlValue['controls']['states'].reset();
      controlValue.updateValueAndValidity();
    });
  }
  static newRegion(model: FuelPriceModel, formBuilder: FormBuilder): FormGroup {
    const validation = (model.fuelPriceForm.controls['averaging'].value) ? null : Validators.required;
    return formBuilder.group({
      region: [null, Validators.required],
      regionStateOption: [null, validation],
      states: [null]
    });
  }
  static duplicateCheck(model: FuelPriceModel): boolean {
    const arrayControl = model.fuelPriceForm.controls['customRegion'] as FormArray;
    let isDuplicate = false;
    if (arrayControl.controls.length > 1 && arrayControl.dirty) {
      utils.forEach(arrayControl.value, (data) => {
        if (!utils.isNull(data.region) && data) {
          const matchData = (model.isAveraging) ? {'region': data.region} :
          {'region': data.region, 'regionStateOption': data.regionStateOption};
          const matchedValue = utils.filter(arrayControl.value, matchData);
          if (matchedValue.length > 1) {
            isDuplicate = true;
            return false;
          }
        }
      });
    }
    return isDuplicate;
  }
  /** function called when region is changed
   * @static
   * @param {FuelPriceModel} model
   * @memberof FuelPriceBasisUtility */
  static onRegionChange(model: FuelPriceModel) {
    model.isShowPopup = false;
    model.fuelPriceForm.get('customRegion').markAsPristine();
    model.regionvalue = model.selectedRegionType;
    model.isShowRegion = true;
    model.fuelPriceForm.patchValue({
      regionType: model.selectedRegionType,
    });
    this.clearArrayControl(model);
    model.fuelPriceForm.controls['averaging'].reset();
    model.fuelPriceForm.updateValueAndValidity();
  }
  static getColumnList(): SelectItem[] {
    return [{
      label: 'Region', value: ''
    }, {
      label: 'Region State Option', value: ''
    }, {
      label: 'Condition Name', value: ''
    }, {
      label: 'States', value: ''
    }];
  }
  /** function to reset view on region type change
   * @static
   * @param {FuelPriceModel} model
   * @param {SelectButtonEvent} event
   * @memberof FuelPriceBasisUtility */
  static onRegionTypeChanged(model: FuelPriceModel, event: SelectButtonEvent) {
    model.fuelPriceForm.get('averaging').reset();
    model.regionvalue = event.value;
    model.regionTableColumnList = this.getColumnList();
    model.isShowRegion = false;
    model.isAveraging = false;
  }
  /** function when averaging checkbox is changed
   * @static
   * @param {FuelPriceModel} model
   * @memberof FuelPriceBasisUtility */
  static yesClicked(model: FuelPriceModel) {
    const checkBoxValue = !model.isAveraging;
    model.fuelPriceForm.get('averaging').setValue(checkBoxValue);
    model.isAveraging = checkBoxValue;
    model.isShowPopup = false;
  }
  static getFormFields(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      fuelPriceType: ['', Validators.required],
      fuelPriceBasisTypes: ['', Validators.required],
      weekToApply: ['', Validators.required],
      dayOfWeek: [''],
      useFuelPriceAsOf: ['', Validators.required],
      priceSource: ['', Validators.required],
      delayForHoliday: ['', Validators.required],
      weeksInAverage: [''],
      regionType: [null, Validators.required],
      averaging: [false],
      customRegion: formBuilder.array([]),
      dayOfMonth: [''],
      monthsInAverage: ['']
    });
  }
  /** function to process the region event
   * @static
   * @param {SelectButtonEvent} event
   * @param {FuelPriceModel} model
   * @memberof FuelPriceBasisUtility */
  static setRegionEvent(event: SelectButtonEvent, model: FuelPriceModel) {
    event.originalEvent.preventDefault();
    event.value = model.regionvalue;
    model.fuelPriceForm.get('regionType').setValue(model.regionvalue,
      { emitModelToViewChange: true });
    model.isShowPopup = true;
    model.fuelPriceForm.get('regionType').updateValueAndValidity();
  }
  /** function to hide loader on error during http calls
   * @static
   * @param {FuelPriceModel} model
   * @param {ChangeDetectorRef} changeDetector
   * @memberof FuelPriceBasisUtility */
  static errorHandling(model: FuelPriceModel, changeDetector: ChangeDetectorRef) {
    model.isPageLoading = false;
    changeDetector.detectChanges();
  }
  /** function called when no is clicked in popup during region change
   * @static
   * @param {FuelPriceModel} model
   * @memberof FuelPriceBasisUtility */
  static onRegionChangeNo(model: FuelPriceModel) {
    model.regionvalue = model.fuelPriceForm.get('regionType').value;
    model.selectedRegionType = model.fuelPriceForm.get('regionType').value;
    model.isShowPopup = false;
  }
}
