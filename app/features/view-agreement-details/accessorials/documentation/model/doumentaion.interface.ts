export interface QueryMock {
    sourceData: string;
}

export interface Hits {
    _index?: string;
    _type?: string;
    _id?: string;
    _score?: number;
    _source?: any;
    fields: any;
    sort: string[];
}

export interface RootObject {
    took: number;
    timed_out: boolean;
    _shards: Shards;
    hits: Hits[];
    aggregations?: Aggregations;
}

export interface Shards {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
}

export interface Aggregations {
    nesting: Nesting;
}

export interface Nesting {
    doc_count: number;
    count: Count;
}

export interface Count {
    value: number;
}
export interface Document {
    accessorialDocumentType: string;
    accessorialDocumentTypeId: number;
    businessUnitServiceOfferingDTOs: string[];
    carrierDTOs: string;
    chargeTypeId: number;
    chargeTypeName: string;
    customerAccessorialAccountDTOs: string[];
    customerAccessorialAttachmentDTOs: string[];
    customerAccessorialDocumentConfigurationId: number;
    customerAccessorialTextDTO: Object;
    customerAgreementId: number;
    customerChargeName: string;
    documentationCategory: string;
    effectiveDate: string;
    equipmentCategoryCode: string;
    equipmentLengthId: number;
    equipmentTypeCode: string;
    equipmentTypeId: number;
    expirationDate: string;
    level: string;
    requestServiceDTOs: Object;
}
