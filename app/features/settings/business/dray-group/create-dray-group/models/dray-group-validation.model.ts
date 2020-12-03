
export class DrayGroupValidationModel {
    isInValidEffDate: boolean;
    isInValidExpDate: boolean;
    isInValidDate: boolean;
    isInCorrectEffDateFormat: boolean;
    isInCorrectExpDateFormat: boolean;
    isSubscribeFlag: boolean;
    effectiveDate: string;
    expirationDate: string;
    effectiveMinDate: Date;
    expirationMinDate: Date;
    effectiveMaxDate: Date;
    expirationMaxDate: Date;
    currentDate: Date;
    maxExpirationDate: Date;
    drayGroupNameError: string;
    drayGroupCodeError: string;
    draygroupEffDateError: string;
    drayGroupDateValid: string;
    draygroupExpDateError: string;
    drayGroupCountryError: string;
    groupNameMaxLength: number;
    groupCodeMaxLength: number;


    constructor() {
        this.currentDate = new Date();
        this.maxExpirationDate = new Date('12/31/2099');
        this.isInValidEffDate = false;
        this.isInValidEffDate = false;
        this.isInValidDate = false;
        this.isInCorrectEffDateFormat = false;
        this.isInCorrectExpDateFormat = false;
        this.drayGroupNameError = 'Provide Dray Group Name';
        this.drayGroupCodeError = 'Provide Dray Group Code';
        this.draygroupEffDateError = 'Provide Effective Date';
        this.drayGroupDateValid = 'Provide a valid date';
        this.draygroupExpDateError = 'Provide Expiration Date';
        this.drayGroupCountryError = 'Provide Country';
        this.groupNameMaxLength = 35;
        this.groupCodeMaxLength = 4;
    }
}
