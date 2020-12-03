import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import * as utils from 'lodash';


import { RateDropDownInterface } from '../model/add-rates.interface';
import { AddRatesModel } from '../model/add-rates.model';
import { AddRateEditResponse } from '../../create-rates/model/create-rates.interface';

export class PatchAddRatesUtility {
    static patchAccessorialRates(addRateEditResponse: AddRateEditResponse[], addRatesModel: AddRatesModel, currencyPipe: CurrencyPipe) {
        const rateFormArray = (addRatesModel.addRateForm.controls.rates as FormArray);
        this.clearRateFormArray(rateFormArray);
        const formArrayRates = (addRatesModel.addRateForm.controls.rates as FormArray);
        utils.each(addRateEditResponse, (eachAddEditRate: AddRateEditResponse, index: number) => {
            const rateTypes = {
                label: eachAddEditRate.accessorialRateTypeName,
                value: eachAddEditRate.accessorialRateTypeId
            };
            const roundingTypes = {
                label: eachAddEditRate.accessorialRateRoundingTypeName,
                value: eachAddEditRate.accessorialRateRoundingTypeId
            };
            addRatesModel.rateAmountValues[index] = eachAddEditRate['rateAmount'];
            formArrayRates.push(this.editRateItem(rateTypes, roundingTypes,
                this.setRateValue(eachAddEditRate['rateAmount'], currencyPipe),
                this.setRateValue(eachAddEditRate['minimumAmount'], currencyPipe),
                this.setRateValue(eachAddEditRate['maximumAmount'], currencyPipe)));
        });
        if (addRateEditResponse.length > 1) {
            addRatesModel.isMoreThanOneRate = true;
            const rateItemizeIndicator = (addRatesModel.editAccessorialWholeResponse.rateItemizeIndicator === '1') ?
                true : (addRatesModel.editAccessorialWholeResponse.rateItemizeIndicator === '0') ? false : null;
            const groupRateTypeValue = {
                label: addRatesModel.editAccessorialWholeResponse.groupRateTypeName,
                value: addRatesModel.editAccessorialWholeResponse.groupRateTypeId
            };
            addRatesModel.addRateForm.controls.groupRateType.setValue(groupRateTypeValue);
            addRatesModel.addRateForm.controls.isGroupRateItemize.setValue(rateItemizeIndicator);
        }
    }
    static setRateValue(eachRateValue, currencyPipe: CurrencyPipe): string {
        return eachRateValue ?
            currencyPipe.transform(eachRateValue, '', '', '1.2-4') :
            (eachRateValue === 0) ? currencyPipe.transform('0', '', '', '1.2-4') : '';
    }
    static clearRateFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
        }
    }
    static editRateItem(rateTypes: RateDropDownInterface, roundingTypes: RateDropDownInterface,
        amount: string, minAmount: string, maxAmount: string): FormGroup {
        const amountPattern = '[-0-9., ]*';
        return new FormGroup({
            rateType: new FormControl(rateTypes, [Validators.required]),
            rateAmount: new FormControl(amount, [Validators.pattern(amountPattern)]),
            minAmount: new FormControl(minAmount, [Validators.pattern(amountPattern)]),
            maxAmount: new FormControl(maxAmount, [Validators.pattern(amountPattern)]),
            rounding: new FormControl(roundingTypes, [])
        });
    }
}
