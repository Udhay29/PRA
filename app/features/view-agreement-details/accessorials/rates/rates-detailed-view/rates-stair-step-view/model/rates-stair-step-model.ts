import { FormGroup } from '@angular/forms';
import {
    CustomerAccessorialAdditionalChargeDTOs, CustomerAccessorialStairRateDTO,
    CustomerAccessorialStairStepRateDTOs
} from './rates-stair-step-interface';

export class StairStepModel {

    tableSize: number;
    rateTableColumns: Array<object>;
    stairStepTableColumns: Array<object>;
    additionalChargesColumns: Array<object>;
    stairListRateValues: Array<object>;
    stairListStairValues: Array<object>;
    stairListAdditionalValues: Array<object>;

    constructor() {
        this.stairListRateValues = [];
        this.stairListStairValues = [];
        this.stairListAdditionalValues = [];
        this.rateTableColumns = [
            { 'name': 'Rate Type', 'property': 'accessorialRateTypeName' },
            { 'name': 'Rounding', 'property': 'accessorialRateRoundingTypeName' },
            { 'name': 'Minimum Amount', 'property': 'minimumAmount' },
            { 'name': 'Maximum Amount', 'property': 'maximumAmount' },
            { 'name': 'Maximum Applied When', 'property': 'accessorialMaximumRateApplyTypeName' }
        ];
        this.stairStepTableColumns = [
            { 'name': 'Step', 'property': 'stepNumber' },
            { 'name': 'From Quantity', 'property': 'fromQuantity' },
            { 'name': 'To Quantity', 'property': 'toQuantity' },
            { 'name': 'Rate Amount', 'property': 'stairStepRateAmount' }
        ];
        this.additionalChargesColumns = [
            { 'name': 'Charge Type', 'property': 'additionalChargeTypeName' },
            { 'name': 'Rate Type', 'property': 'accessorialRateTypeName' },
            { 'name': 'Rate Amount', 'property': 'additionalRateAmount' }
        ];
    }
}
