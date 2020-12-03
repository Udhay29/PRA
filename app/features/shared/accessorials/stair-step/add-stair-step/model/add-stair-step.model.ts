import { FormGroup } from '@angular/forms';
import {
    RateDropDownInterface,
    StepValueDownInterface, EditAccessorialWholeResponse, AddStairStepRateEditResponse
} from './add-stair.interface';

export class AddStairStepModel {
    subscribeFlag: boolean;
    addStairStepForm: FormGroup;
    suggestionResult: StepValueDownInterface[];
    rateTypes: RateDropDownInterface[];
    roundingTypes: RateDropDownInterface[];
    maxApplidedWhen: RateDropDownInterface[];
    stepValue: StepValueDownInterface[];
    indextobeAdded: number;
    fromQuantityDisabled: boolean;
    showMinusIcon: boolean;
    gap: number[];
    decimals: number;
    overlaps: number[];
    rateAmountExceed: number[];
    gaps: number[];
    invalidRanges: number[];
    invalidPrecision: number[];
    invalidFreeAmount: boolean;
    rateAmountValid: number[];
    maxAmount: string;
    minAmount: string;
    rateAmount: number;
    fromQuantity: number;
    toQuantity: number;
    invalidPrecisionfrom: number[];
    invalidPrecisionto: number[];
    gapOverlap: number[];
    addStairStepRateEditResponse: AddStairStepRateEditResponse[];
    editAccessorialWholeResponse: EditAccessorialWholeResponse;
    constructor() {
        this.subscribeFlag = true;
        this.invalidPrecisionto = [];
        this.invalidPrecisionfrom = [];
        this.stepValue = [{ label: 'Free', value: 0 }, { label: '1', value: 1 }];
        this.indextobeAdded = 0;
        this.fromQuantityDisabled = true;
        this.showMinusIcon = false;
        this.overlaps = [];
        this.gaps = [];
        this.rateAmountExceed = [];
        this.invalidRanges = [];
        this.invalidPrecision = [];
        this.invalidFreeAmount = false;
        this.rateAmountValid = [];
        this.gapOverlap = [];
    }
}
