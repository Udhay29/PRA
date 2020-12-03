export class RateFilterModel {
    isPanelClosed: boolean;
    effectiveFlag: boolean;
    expirationFlag: boolean;
    effectiveCheck: boolean;
    expirationCheck: boolean;
    effDateOnlyFlag: boolean;
    expDateOnlyFlag: boolean;
    effectiveExactValue: boolean;
    expirationExactValue: boolean;
    endDate: string;
    startDate: string;
    dateFormat: string;
    defaultSelect: string;
    effectiveType: string;
    expirationType: string;
    expDefaultSelect: string;
    effectiveEndDate: string;
    expirationEndDate: string;
    effDateExactMatch: string;
    effectiveStartDate: string;
    effectiveDateValue: string;
    expirationStartDate: string;
    expirationDateValue: string;
    filterParams: object;
    openedAccordions: Array<number>;

    constructor() {
        this.openedAccordions = [];
        this.effectiveFlag = true;
        this.dateFormat = 'MM/DD/YYYY';
        this.effectiveType = 'Date';
        this.defaultSelect = 'Date';
        this.expirationType = 'Date';
        this.expDefaultSelect = 'Date';
        this.isPanelClosed = true;
        this.effDateOnlyFlag = true;
        this.expDateOnlyFlag = true;

        this.expirationFlag = true;
        this.filterParams = {
            'effectiveDate': '*',
            'expirationDate': '*'
        };


    }
}
