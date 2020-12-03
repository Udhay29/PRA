import { CurrencyPipe } from '@angular/common';
import { FormControl, FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';

import * as utils from 'lodash';

import { EditAdditionalChargeResponse } from './../model/additional-charges-interface';
import { AdditionalChargesModel } from '../model/additional-charges-model';

export class PathcAdditionalChargesUtility {
    static patchAdditionalChargeValues(editAdditionalChargeResponse: EditAdditionalChargeResponse[],
         addChargesModel: AdditionalChargesModel, currencypipe: CurrencyPipe) {
        const chargeFormArray = (addChargesModel.addChargesForm.controls.charges as FormArray);
        this.clearRateFormArray(chargeFormArray);
        const formArrayCharges = (addChargesModel.addChargesForm.controls.charges as FormArray);
        utils.each(editAdditionalChargeResponse, (editAdditionalChargeData: EditAdditionalChargeResponse, index) => {
            const additionalChargeTypeName = editAdditionalChargeData.additionalChargeTypeName;
            const additionalChargeTypeCode = editAdditionalChargeData.additionalChargeCodeName;
            const additionalChargeTypeinEdit = `${additionalChargeTypeName} (${additionalChargeTypeCode})`;
            let chargeType;
            chargeType = ({
                label: additionalChargeTypeinEdit,
                value: editAdditionalChargeData.additionalChargeTypeId,
                description: editAdditionalChargeData.additionalChargeCodeName
            });
            const rateTypes = {
                label: editAdditionalChargeData.accessorialRateTypeName,
                value: editAdditionalChargeData.accessorialRateTypeId
            };
            const rateAmount = editAdditionalChargeData['additionalRateAmount'] ?
            currencypipe.transform(editAdditionalChargeData['additionalRateAmount'], '', '', '1.2-4') : '';
            formArrayCharges.push(this.editChargeItem(chargeType, rateTypes, rateAmount));
            addChargesModel.rateAmountValues[index] = editAdditionalChargeData['additionalRateAmount'];
        });
    }
    static clearRateFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
        }
    }
    static editChargeItem(chargeType, rateTypes, rateAmount): FormGroup {
        const amountPattern = '[-0-9., ]*';
        return new FormGroup({
            chargeType: new FormControl(chargeType, [Validators.required]),
            rateType: new FormControl(rateTypes, [Validators.required]),
            rateAmount: new FormControl(rateAmount, [Validators.required, Validators.pattern(amountPattern)])
        });
    }
}
