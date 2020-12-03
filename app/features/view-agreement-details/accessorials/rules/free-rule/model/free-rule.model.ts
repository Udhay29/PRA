import { FreeRuleTypeInterface, QuantityTypeInterface, TimeTypeInterface, DistanceTypeInterface } from './free-rule.interface';
import { FormGroup } from '@angular/forms';

export class FreeRuleModel {
    isSubscribeFlag: boolean;
    freeRuleTypes: FreeRuleTypeInterface[];
    freeRuleTypesFiltered: FreeRuleTypeInterface[];
    quantityTypes: QuantityTypeInterface[];
    quantityTypesFiltered: QuantityTypeInterface[];
    timeTypes: TimeTypeInterface[];
    timeTypesFiltered: TimeTypeInterface[];
    distanceTypes: DistanceTypeInterface[];
    distanceTypesFiltered: DistanceTypeInterface[];
    freeRulesForm: FormGroup;
    isFreeRuleTypeQuantity: boolean;
    isFreeRuleDistanceType: boolean;
    isFreeRuleTimeType: boolean;
    freeRuleTypeQuantity: object;
    freeRuleTypeCalendar: object;
    isFreeRuleTypeEvent: boolean;
    isFreeRuleTypeCalendar: boolean;
    freeRuleTypeEvent: object;
    timeQuantityType: object;
    distanceQuantityType: object;
    constructor() {
        this.isSubscribeFlag = true;
        this.freeRuleTypes = [];
        this.freeRuleTypesFiltered = [];
        this.quantityTypes = [];
        this.quantityTypesFiltered = [];
        this.distanceTypes = [];
        this.distanceTypesFiltered = [];
        this.isFreeRuleTypeQuantity = false;
        this.isFreeRuleDistanceType = false;
        this.isFreeRuleTimeType = false;
        this.freeRuleTypeQuantity = {
            accessorialFreeRuleTypeID: 3,
            accessorialFreeRuleTypeName: 'Quantity',
        };
        this.timeQuantityType = {
            accessorialFreeRuleQuantityTypeId: 2,
            accessorialFreeRuleQuantityTypeName: 'Time'
        };
        this.distanceQuantityType = {
            accessorialFreeRuleQuantityTypeId: 1,
            accessorialFreeRuleQuantityTypeName: 'Distance'
        };
        this.freeRuleTypeEvent = {
          accessorialFreeRuleTypeID: 2,
          accessorialFreeRuleTypeName: 'Event'
        };
        this.freeRuleTypeCalendar = {
            accessorialFreeRuleTypeID: 1,
            accessorialFreeRuleTypeName: 'Calendar'
        };
    }
}
