import { FormGroup } from '@angular/forms';
import {
    CustomerAccessorialFreeRuleEvent
} from './free-rule-detailed-view-interface';

export class FreeRuleDetailModel {

    tableSize: number;
    rateTableColumns: Array<object>;
    stairStepTableColumns: Array<object>;
    additionalChargesColumns: Array<object>;
    freeruleValues: any;
    constructor() {
        this.freeruleValues = { };

                }
}
