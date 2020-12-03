export interface TemplateType {
    id: number;
    name: string;
    association?: string;
}

export interface SubmitStatus {
    status: boolean;
    introParagraph: boolean;
    conclusionParagraph: boolean;
    signatureLine: boolean;
    batchingExcel: boolean;
    defaultExcel: boolean;
    introSave: boolean;
    conclusionSave: boolean;
    signatureSave: boolean;
    defaultSave: boolean;
    batchSave: boolean;
}

export interface TemplateTypeData {
    createProgramName: string;
    createTimestamp: string;
    createUserId: string;
    effectiveDate: string;
    emailTemplateTypeName: string;
    expirationDate: string;
    lastUpdateProgramName: string;
    lastUpdateTimestampString: string;
    lastUpdateUserId: string;
}

export interface TemplateDataElements {
    emailTemplateAttribute: TemplateAttribute;
    emailTemplateAttributeAssociationId: number;
}

export interface TemplateAttribute {
    emailTemplateAttributeId: number;
    emailTemplateAttributeName: string;
}
