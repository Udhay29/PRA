export interface PriorityList {
    label?: number;
    value: number;
}
export interface BillToCodeList {
    billToID?: number;
    billToCode?: string;
    billToName?: string;
}
export interface BillToDropdown {
    label: string;
    value: BillToCodeList;
}
export interface CarrierRequest {
    id: number;
    name: string;
    code: string;
}
export interface MileagePreferenceRequest {
    mileagePreferenceID?: number;
    mileagePreferenceName?: string;
    mileagePreferenceMinRange?: number;
    mileagePreferenceMaxRange?: number;
}
export interface UnitOfWeightMeasurementRequest {
    code?: string;
    description?: string;
    lineHaulWeightRangeMinQuantity?: number;
    lineHaulWeightRangeMaxQuantity?: number;
}
export interface ReqParam {
    status?: string;
    message?: string;
    customerLineHaulConfigurationID?: number;
    duplicateFlag: boolean;
    existingOverriddenPriorityNumber: number;
    overridenPriorityNumber: number;
    duplicateErrorMessage: string;
    priorityNumber: number;
    billTos: BillToCodeList[];
    carriers: CarrierRequest[];
    mileagePreference: MileagePreferenceRequest;
    unitOfWeightMeasurement: UnitOfWeightMeasurementRequest;
    hazmatIncludedIndicator: string;
    fuelIncludedIndicator: string;
    autoInvoiceIndicator: string;

}
export interface WeightUnit {
    code: string;
    description: string;
    minWeightRange: number;
    maxWeightRange: number;
}
export interface MileageAutoCompleteDropdown {
    label: number;
    value: string;
}
export interface WeightAutoCompleteDropdown {
    label: string;
    value: string;
}
export interface Source {
    LegalName: string;
    CarrierID: number;
    CarrierCode: string;
}
export interface HitsArray {
    _index: string;
    _type: string;
    _id: string;
    _score: string;
    _source: Source;
}
export interface Hits {
    total: number;
    max_score: number;
    hits: HitsArray[];
}
export interface Shards {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
}
export interface ElasticRootObject {
    took: number;
    timed_out: boolean;
    _shards: Shards;
    hits: Hits;
}

export interface LineHaulDetailData {
    customerAgreementID: string;
    customerAgreementName: string;
    customerAgreementContractSectionID: string;
    customerLineHaulConfigurationID: number;
}

export interface EditLineHaulData {
    lineHaulDetails: any;
    isEditFlag: boolean;
  }

