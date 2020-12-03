const contractRangeEffDate = 'effectiveDate';
const contractRangeExpDate = 'expirationDate';
export class MileageFilterModel {
    isDateResetFlag: boolean;
    isPanelClosed: boolean;
    selectedAgreementDefault: string;
    statusSelectedList: Array<object>;
    isEffDateExactMatchFlag: boolean;
    isExpDateExactMatchFlag: boolean;
    isOriginalEffDateExactMatchFlag: boolean;
    isOriginalExpDateExactMatchFlag: boolean;
    isEffDateOnlyFlag: boolean;
    isExpDateOnlyFlag: boolean;
    isOriginalEffDateOnlyFlag: boolean;
    isOriginalExpDateOnlyFlag: boolean;
    isDisableMatchFlag: boolean;
    effectiveDateModel: object;
    expirationDateModel: object;
    originalEffectiveDateModel: object;
    originalExpirationDateModel: object;
    effectiveExactMatchParameter: object;
    effectiveParameter: object;
    effectiveAndParameter: object;
    expirationParameter: object;
    expirationAndParameter: object;
    expirationExactMatchParameter: object;
    constructor() {
        this.isPanelClosed = true;
        this.isDateResetFlag = true;
        this.selectedAgreementDefault = '';
        this.statusSelectedList = [];
        this.isEffDateExactMatchFlag = false;
        this.isExpDateExactMatchFlag = false;
        this.isOriginalEffDateExactMatchFlag = false;
        this.isOriginalExpDateExactMatchFlag = false;
        this.isEffDateOnlyFlag = true;
        this.isExpDateOnlyFlag = true;
        this.isOriginalEffDateOnlyFlag = true;
        this.isOriginalExpDateOnlyFlag = true;
        this.isDisableMatchFlag = true;
        this.isPanelClosed = false;
        this.effectiveDateModel = {
            filterName: 'Effective Date',
            dateRadioName: 'effDateRadio',
            effDateRadio: 'Date',
            isEffDateExactMatchFlag: false,
            isExpDateExactMatchFlag: false,
            isOriginalEffDateExactMatchFlag: false,
            isOriginalExpDateExactMatchFlag: false,
            isPanelClosed: true,
            isEffDateOnlyFlag: true,
            isExpDateOnlyFlag: true,
            isOriginalEffDateOnlyFlag: true,
            isOriginalExpDateOnlyFlag: true,
            isDisableMatchFlag: true,
            startDate: '',
            endDate: '',
            expStartDate: '',
            expEndDate: '',
            originEffectiveDate: '',
            originExpirationDate: '',
            originalEffectiveDate: '',
            originalExpirationDate: '',
            effDateExactMatch: '',
            defaultEndDate: '12/31/2099',
            defaultStartDate: '01/01/1995',
            dateShowHide: {},
            dateFormat: 'MM/DD/YYYY',
            effectiveExactMatchParameter: {
                dateName: 'effDateExactMatch',
                keyName: 'effectiveDate',
                keyNameOther: 'expirationDate',
                index: 19,
                pointer: 0,
                level: 'lte',
                exactMatch: 'isEffDateExactMatchFlag',
                dateOnly: 'isEffDateOnlyFlag'
            },
            effectiveParameter: {
                dateName: 'startDate',
                keyName: contractRangeEffDate,
                keyNameOther: contractRangeExpDate,
                index: 19,
                pointer: 0,
                level: 'gte',
                exactMatch: 'isEffDateExactMatchFlag',
                dateOnly: 'isEffDateOnlyFlag'
            },
            effectiveAndParameter: {
                dateName: 'endDate',
                keyName: contractRangeEffDate,
                keyNameOther: contractRangeExpDate,
                index: 19,
                pointer: 0,
                level: 'lte',
                exactMatch: 'isEffDateExactMatchFlag',
                dateOnly: 'isEffDateOnlyFlag'
            }
        };
        this.expirationDateModel = {
            dateRadioName: 'expDateRadio',
            filterName: 'Expiration Date',
            expDateRadio: 'Date',
            isEffDateExactMatchFlag: false,
            isExpDateExactMatchFlag: false,
            isOriginalEffDateExactMatchFlag: false,
            isOriginalExpDateExactMatchFlag: false,
            isEffDateOnlyFlag: true,
            isExpDateOnlyFlag: true,
            isOriginalEffDateOnlyFlag: true,
            isOriginalExpDateOnlyFlag: true,
            isPanelClosed: true,
            isDisableMatchFlag: true,
            startDate: '',
            endDate: '',
            expStartDate: '',
            expEndDate: '',
            originEffectiveDate: '',
            originExpirationDate: '',
            originalEffectiveDate: '',
            originalExpirationDate: '',
            expDateExactMatch: '',
            defaultEndDate: '12/31/2099',
            defaultStartDate: '01/01/1995',
            dateShowHide: {},
            dateFormat: 'MM/DD/YYYY',
            effectiveExactMatchParameter: {
                dateName: 'expDateExactMatch',
                keyName: contractRangeExpDate,
                keyNameOther: contractRangeEffDate,
                index: 20,
                pointer: 0,
                level: 'gte',
                exactMatch: 'isExpDateExactMatchFlag',
                dateOnly: 'isExpDateOnlyFlag'
            },
            effectiveParameter: {
                dateName: 'expStartDate',
                keyName: contractRangeExpDate,
                keyNameOther: contractRangeEffDate,
                index: 20,
                pointer: 0,
                level: 'gte',
                exactMatch: 'isExpDateExactMatchFlag',
                dateOnly: 'isExpDateOnlyFlag'
            },
            effectiveAndParameter: {
                dateName: 'expEndDate',
                keyName: contractRangeExpDate,
                keyNameOther: contractRangeEffDate,
                index: 20,
                pointer: 0,
                level: 'lte',
                exactMatch: 'isExpDateExactMatchFlag',
                dateOnly: 'isExpDateOnlyFlag'
            }
        };
    }

}

