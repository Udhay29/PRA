export interface ViewTemplateTableColumnModel {
    name: string;
    property: string;
    isVisible: boolean;
    columnWidth?: string;
}

export interface ElasticResponseModel {
    hits: RootHitsModel;
    timed_out: boolean;
    took: number;
    _shards: ShardsModel;
}

export interface ShardsModel {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
}

export interface RootHitsModel {
    hits: Array<HitsModel>;
    max_score: number;
    total: number;
}
export interface HitsModel {
    sort: Array<string>;
    _id: string;
    _index: string;
    _score: number;
    _source: any;
    _type: string;
}
export interface TemplateList {
    emailTemplateTypeName: string;
    chargeTypeDisplayName: string;
    accessorialNotificationTypeName: string;
    emailTemplateReferenceNumber: string;
    defaultAttachment: string;
    emailTemplateConfigurationId: number;
    lastUpdateProgramName: string;
    lastUpdateTimestamp: string;
    effectiveTimestamp: string;
    expirationTimestamp: string;
    accessorialNotificationTypeId: number;
    emailTemplateTypeId: number;
    chargeTypeId: number;
}
