export interface ConfigurationDetail {
  configurationParameterDetailDTOs: ConfigurationParameterDetailDTOsItem[];
}
export interface ConfigurationParameterDetailDTOsItem {
  configurationParameterDetailID: number;
  configurationParameterID: number;
  configurationParameterName: string;
  parameterSpecificationTypeID: number;
  parameterSpecificationTypeName: string;
  configurationParameterValue: string;
  configurationParameterDetailName: string;
}
export interface ControlValueMatch {
  fieldName: string;
  controlName: string;
}
