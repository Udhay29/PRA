import { AddStairStepModel } from './../model/add-stair-step.model';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as utils from 'lodash';

export class PatchAddStairStepUtilityService {
    static patchAccessorialRates(addStairStepRateEditResponse: any,
        addStairStepModel: AddStairStepModel, currencyPipe: CurrencyPipe, parentScope) {
        addStairStepModel.showMinusIcon = true;
        this.setValues(addStairStepRateEditResponse, addStairStepModel, currencyPipe, parentScope);
        const rateFormArray = (addStairStepModel.addStairStepForm.controls.stepsArray as FormArray);
        this.clearRateFormArray(rateFormArray);
        const formArrayRates = (addStairStepModel.addStairStepForm.controls.stepsArray as FormArray);
        const precision = this.getPrecision(addStairStepRateEditResponse);
        utils.each(addStairStepRateEditResponse['customerAccessorialStairStepRateDTOs'], (eachAddEditRate: any, index: number) => {
            let stepValue;
            if (index === 0) {
                stepValue = {
                    label: eachAddEditRate['stepNumber'] === 0 ? 'Free' : '1',
                    value: eachAddEditRate['stepNumber']
                };
                addStairStepModel.indextobeAdded = eachAddEditRate['stepNumber'] === 0 ? 0 : 1;
            } else {
                stepValue = eachAddEditRate['stepNumber'];
            }
            formArrayRates.push(this.editRateItem(stepValue,
                eachAddEditRate['fromQuantity'].toFixed(precision).toString(),
                eachAddEditRate['toQuantity'].toFixed(precision).toString(),
                this.setRateValue(eachAddEditRate['stairStepRateAmount'], currencyPipe)));
        });
        const rateItemizeIndicator = addStairStepModel.editAccessorialWholeResponse.rateItemizeIndicator === '1';
        addStairStepModel.addStairStepForm.controls.itemizeRates.setValue(rateItemizeIndicator);
    }
    static setRateValue(eachRateValue, currencyPipe: CurrencyPipe): string {
        let formattedRateAmount = '';
        if (eachRateValue || eachRateValue === 0) {
            const valuePlaces = new RegExp(',', 'g');
            const amount = Number(eachRateValue.toString().replace(valuePlaces, ''));
            if (!isNaN(amount)) {
                const modifiedAmount = amount.toString().replace(/[, ]/g, '').trim();
                formattedRateAmount = currencyPipe.transform(modifiedAmount, '', '', '1.2-4');
            }
        }
        return formattedRateAmount;
    }
    static clearRateFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
        }
    }
    static setValues(addStairStepRateEditResponse, addStairStepModel, currencyPipe, parentScope) {
        const rateTypes = {
            label: addStairStepRateEditResponse['accessorialRateTypeName'],
            value: addStairStepRateEditResponse['accessorialRateTypeId']
        };
        const roundingTypes = {
            label: addStairStepRateEditResponse['accessorialRateRoundingTypeName'],
            value: addStairStepRateEditResponse['accessorialRateRoundingTypeId']
        };
        const maxApplidedWhen = {
            label: addStairStepRateEditResponse['accessorialMaximumRateApplyTypeName'],
            value: addStairStepRateEditResponse['accessorialMaximumRateApplyTypeId']
        };
        addStairStepModel.addStairStepForm.controls.rateType.setValue(
            addStairStepRateEditResponse['accessorialRateTypeId'] ? rateTypes : '');
        addStairStepModel.addStairStepForm.controls.rounding.setValue(
            addStairStepRateEditResponse['accessorialRateRoundingTypeId'] ? roundingTypes : '');
        addStairStepModel.addStairStepForm.controls.maxApplidedWhen.setValue(
            addStairStepRateEditResponse['accessorialMaximumRateApplyTypeId']
                ? maxApplidedWhen : '');
        addStairStepModel.addStairStepForm.controls.maxAmount.setValue(
            this.setRateValue(addStairStepRateEditResponse['maximumAmount']
                , currencyPipe));
        addStairStepModel.maxAmount = this.setRateValue(addStairStepRateEditResponse['maximumAmount'], currencyPipe);
        addStairStepModel.addStairStepForm.controls.minAmount.setValue(
            this.setRateValue(addStairStepRateEditResponse['minimumAmount'],
                currencyPipe));
        addStairStepModel.minAmount = this.setRateValue(addStairStepRateEditResponse['minimumAmount'], currencyPipe);
        this.setValidatorsOnSelectMaxApplidedWhen(addStairStepRateEditResponse['maximumAmount'], 'maxAmount', addStairStepModel);
        this.setValidatorsOnSelectMaxApplidedWhen(maxApplidedWhen.label, 'maxApplidedWhen', addStairStepModel);
    }
    static editRateItem(stepValue, fromQuantityValue, toQuantityValue, rateAmountValue): FormGroup {
        const amountPattern = '[-0-9., ]*';
        return new FormGroup({
            step: new FormControl(stepValue, [Validators.required]),
            fromQuantity: new FormControl(fromQuantityValue, [Validators.required]),
            toQuantity: new FormControl(toQuantityValue, [Validators.required]),
            rateAmount: new FormControl(rateAmountValue, [Validators.pattern(amountPattern)])
        });
    }
    static setValidatorsOnSelectMaxApplidedWhen(value: string, controlName: string, addStairStepModel) {
        if (controlName === 'maxApplidedWhen' || controlName === 'maxAmount') {
            const controlT0BeSetValidators = controlName === 'maxApplidedWhen' ? 'maxAmount' : 'maxApplidedWhen';
            addStairStepModel.addStairStepForm.controls[controlT0BeSetValidators].setValidators(value ? [Validators.required] : null);
            addStairStepModel.addStairStepForm.controls[controlT0BeSetValidators].updateValueAndValidity();
        }
    }
    static getPrecision(addStairStepRateEditResponse) {
        let precision = 0;
        addStairStepRateEditResponse['customerAccessorialStairStepRateDTOs'].forEach(element => {
            const fromValue = this.getValue(element['fromRateTypeQuantity']);
            const toValue = this.getValue(element['toRateTypeQuantity']);
            if (precision < fromValue) {
                precision = fromValue;
            }
            if (precision < toValue) {
                precision = toValue;
            }
        });
        return precision;
    }
    static getValue(value) {
        return (value + '').split('.')[1] ? (value + '').split('.')[1].length : 0;
    }
}
