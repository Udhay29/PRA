export interface DateFilterModel {
    filterName:  string;
    dateRadioName:  string;
    effDateRadio:  string;
    isEffDateExactMatchFlag: boolean;
    isExpDateExactMatchFlag:  boolean;
    isOriginalEffDateExactMatchFlag:  boolean;
    isOriginalExpDateExactMatchFlag:  boolean;
    isPanelClosed:  boolean;
    isEffDateOnlyFlag:  boolean;
    isExpDateOnlyFlag:  boolean;
    isOriginalEffDateOnlyFlag:  boolean;
    isOriginalExpDateOnlyFlag:  boolean;
    isDisableMatchFlag:  boolean;
    startDate:  string;
    endDate:  string;
    expStartDate:  string;
    expEndDate:  string;
    originEffectiveDate:  string;
    originExpirationDate:  string;
    originalEffectiveDate:  string;
    originalExpirationDate:  string;
    effDateExactMatch:  string;
    defaultEndDate:  string;
    defaultStartDate:  string;
    dateShowHide: object;
    dateFormat:  string;
    effectiveExactMatchParameter: DateFilterParameterModel;
    effectiveParameter: DateFilterParameterModel;
    effectiveAndParameter: DateFilterParameterModel;
}
export interface DateFilterParameterModel {
    dateName: string;
    keyName: string;
    keyNameOther: string;
    index: number;
    pointer: number;
    level: string;
    exactMatch: string;
    dateOnly: string;
}
