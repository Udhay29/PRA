import { FormGroup } from '@angular/forms';
import { ChargeUsageType, ChargeCodeConfigurables,
    ApplicationLevelType, ChargeUsageTypeRequest, ChargeApplicationLevelTypeRequest } from './values-interface';

export class ValuesModel {
    errorMessage: string;
    valuesForm: FormGroup;
    chargeUsageValues: ChargeUsageTypeRequest[];
    applicationLevelTypes: ChargeApplicationLevelTypeRequest[];
    chargeUsageValuesDataList: ChargeUsageType[];
    applicationLevelTypesDataList: ApplicationLevelType[];
    valuesSubscriberFlag: boolean;
    chargeCodeConfigurables: ChargeCodeConfigurables;
    usageDuplicateValues: ChargeUsageTypeRequest[];
    applicationLevelDuplicateValues: ChargeApplicationLevelTypeRequest[];
    isSaveChanges: boolean;
    routingUrl: string;
    isDetailsSaved: boolean;
    isChangesSaving: boolean;
    routeUrl: string;
    constructor() {
        this.errorMessage = 'Duplicates for the same field are not permissible. Please correct to proceed further';
        this.valuesSubscriberFlag = true;
        this.chargeUsageValues = [];
        this.applicationLevelTypes = [];
        this.chargeUsageValuesDataList = [];
        this.applicationLevelTypesDataList = [];
        this.usageDuplicateValues = [];
        this.applicationLevelDuplicateValues = [];
    }
}
