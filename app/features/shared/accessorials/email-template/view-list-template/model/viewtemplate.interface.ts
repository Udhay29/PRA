    export interface EmailTemplateType {
        emailTemplateTypeId: number;
        emailTemplateTypeName: string;
        effectiveDate: string;
        expirationDate: string;
    }

    export interface AccessorialNotificationType {
        accessorialNotificationTypeId: number;
        accessorialNotificationTypeName: string;
        effectiveDate: string;
        expirationDate: string;
    }

    export interface EmailTemplatePartType {
        emailTemplatePartTypeId: number;
        emailTemplatePartTypeName: string;
        effectiveDate: string;
        expirationDate: string;
    }

    export interface EmailTemplateText {
        emailTemplateTextId: number;
        emailTemplateConfigurationId: number;
        emailTemplatePartType: EmailTemplatePartType;
        emailTemplateText: string;
        emailTemplateTextSequenceNumber: number;
    }

    export interface EmailTemplatePartType2 {
        emailTemplatePartTypeId: number;
        emailTemplatePartTypeName: string;
        effectiveDate: string;
        expirationDate: string;
    }

    export interface EmailTemplatePartType3 {
        emailTemplatePartTypeId: number;
        emailTemplatePartTypeName: string;
        effectiveDate: string;
        expirationDate: string;
    }

    export interface EmailTemplateAttribute {
        emailTemplateAttributeId: number;
        emailTemplateAttributeName: string;
        effectiveDate: string;
        expirationDate: string;
    }

    export interface EmailTemplateAttributeAssociation {
        emailTemplateAttributeAssociationId: number;
        emailTemplatePartType: EmailTemplatePartType;
        emailTemplateAttribute: EmailTemplateAttribute;
    }

    export interface EmailTemplatePartAttribute {
        emailTemplatePartAttributeId: number;
        emailTemplateConfigurationId: number;
        emailTemplatePartType: EmailTemplatePartType;
        emailTemplateAttributeAssociation: EmailTemplateAttributeAssociation;
        emailTemplateAttributeSequenceNumber: number;
    }

    export interface ListingDetails {
        emailTemplateConfigurationId: number;
        emailTemplateReferenceNumber: string;
        emailTemplateType: EmailTemplateType;
        accessorialNotificationType: AccessorialNotificationType;
        chargeTypeId: number;
        chargeTypeDisplayName: string;
        chargeTypeCode: string;
        effectiveTimestamp: Date;
        expirationTimestamp: Date;
        lastUpdateProgramName: string;
        lastUpdateUserId: string;
        lastUpdateTimestamp: Date;
        emailTemplateTexts: EmailTemplateText[];
        emailTemplatePartAttributes: EmailTemplatePartAttribute[];
        modifiedBy: string;
    }


