import { DropdowmInterface } from './fuel-filter.interface';
export class FuelFilterModel {
    subscribeFlag: boolean;
    updatedFlag: boolean;
    createdFlag: boolean;
    filterParams: object;
    fuelPrice: boolean;
    currencyValue: any;
    createdOnDate: string;
    createdOnTime: string;
    updatedOnDate: string;
    updatedOnTime: string;
    effectiveFlag: boolean;
    expirationFlag: boolean;
    effectiveDateValue: string;
    expirationDateValue: string;
    effectiveEndDate: string;
    effectiveStartDate: string;
    defaultSelect: string;
    effDateOnlyFlag: boolean;
    expDateOnlyFlag: boolean;
    expDefaultSelect: string;
    expirationEndDate: string;
    expirationStartDate: string;
    sourceTypeList: DropdowmInterface[];
    regionList: DropdowmInterface[];
    effectiveType: string;
    effectiveExactValue: boolean;
    expirationType: string;
    expirationExactValue: boolean;
    dateFormat: string;
    dateTimeFormat: string;
    errorFlag: boolean;
    effectiveCheck: boolean;
    expirationCheck: boolean;
    constructor() {
        this.dateFormat = 'YYYY-MM-DD';
        this.dateTimeFormat = 'YYYY-MM-DDTHH:mm';
        this.sourceTypeList = [];
        this.regionList = [];
        this.effectiveType = 'date';
        this.expirationType = 'date';
        this.effDateOnlyFlag = true;
        this.expDateOnlyFlag = true;
        this.subscribeFlag = true;
        this.createdFlag = true;
        this.updatedFlag = true;
        this.effectiveFlag = true;
        this.expirationFlag = true;
        this.defaultSelect = 'Date';
        this.expDefaultSelect = 'Date';
        this.filterParams = {
            'fuelPriceSourceTypeName': 'DOE',
            'fuelRegionName': 'National',
            'fuelPriceAmount': '*',
            'unitOfVolumeMeasurementCode': '*',
            'currencyCode': '*',
            'pricingCountryCode': '*',
            'fuelTypeName': '*',
            'createUserID': '*',
            'createTimestamp': '*',
            'createProgramName': '*',
            'lastUpdateUserID': '*',
            'lastUpdateTimestamp': '*',
            'lastUpdateProgramName': '*',
            'effectiveDate': '*',
            'expirationDate': '*'
        };
        this.fuelPrice = true;
    }
}
