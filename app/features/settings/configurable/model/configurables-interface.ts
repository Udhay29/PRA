export interface ConfigGeneralType {
    configurationParameterDetailDTOs: GeneralType;
}

export interface GeneralType {
    configurationParameterDetailID: number;
    tenantID: number;
    configurationParameterID: number;
    configurationParameterName: string;
    parameterSpecificationTypeID: number;
    parameterSpecificationTypeName: string;
    configurationParameterValue: number;
    configurationParameterDetail: string;
}
