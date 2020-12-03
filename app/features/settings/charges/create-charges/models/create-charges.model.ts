import { FormGroup } from '@angular/forms';

import { AutoCompleteList, DropdownList, RateTypeDropdown, SaveChargeCodeRequestPayload,
    ServiceOfferingList } from './create-charges.interface';

export class CreateChargesModel {
    subscriberFlag: boolean;
    createChargesForm: FormGroup;
    selectButtonOptions: DropdownList[];
    checkBoxList: string[];
    checkBoxValue: string[];
    associateChargeFlag: boolean;
    mandatoryFields: string[];
    associateChargeMandatoryFields: string[];
    businessUnitList: DropdownList[];
    serviceOfferingList: ServiceOfferingList[];
    usageList: AutoCompleteList[];
    usageListValues: AutoCompleteList[];
    applicationLevels: AutoCompleteList[];
    applicationTypeLevelList: AutoCompleteList[];
    rateTypeList: RateTypeDropdown[];
    createChargeCodeReqParam: SaveChargeCodeRequestPayload;
    isCancelClicked: boolean;
    invalidDateFlag: boolean;
    effectiveMinDate: Date;
    disabledExpDatesList: Array<Date>;
    effectiveMaxDate: Date;
    disabledEffDatesList: Array<Date>;
    routeUrl: string;

    constructor() {
        this.subscriberFlag = true;
        this.checkBoxValue = [];
        this.selectButtonOptions = [
            { label: 'Associate Charge', value: 'Associate Charge' },
            { label: 'Unassociate Charge', value: 'Unassociate Charge' }
        ];
        this.checkBoxList = ['Quantity Required', 'Auto Invoice'];
        this.mandatoryFields = ['chargeIdentifier', 'chargeName'];
        this.associateChargeMandatoryFields = ['businessUnit', 'serviceOffering', 'rateType', 'applicationLevel',
            'usage', 'effectiveDate', 'expirationDate'];
        this.businessUnitList = [];
        this.serviceOfferingList = [];
        this.usageList = [];
        this.applicationLevels = [];
        this.applicationTypeLevelList = [];
        this.rateTypeList = [];
        this.createChargeCodeReqParam = {
            chargeType: null,
            financeBusinessUnitServiceOfferingAssociations: [],
            rateTypes: [],
            chargeUsageType: null,
            chargeApplicationLevelType: null,
            quantityRequiredIndicator: null,
            autoInvoiceIndicator: null,
            effectiveDate: null,
            expirationDate: null
        };
    }
}
