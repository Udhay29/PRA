import { Observable } from 'rxjs';

export interface DocumentationTypeInterface {
    label: string;
    value: number;
}
export interface GroupNameInterface {
    label: string;
    value: number;
}
export interface DocumentationLevelInterface {
    label: string;
    value: string;
    id?: number;
}

export interface DocumentationTypeValues {
    _embedded: AccessorialDocumentTypes;
    _links: Object;
    page: Page;
}
export interface GroupNameTypeValues {
    _embedded: GroupNameTypes;
    _links: Object;
    page: Page;
}
export interface AccessorialDocumentTypes {
    accessorialDocumentTypes: AccessorialDocumentTypesItem[];
}
export interface GroupNameTypes {
    accessorialGroupTypes: GroupNamesTypesItem[];
}
export interface GroupNamesTypesItem {
    '@id': number;
    createTimestamp: string;
    createProgramName: string;
    lastUpdateProgramName: string;
    createUserId: string;
    lastUpdateUserId: string;
    accessorialGroupTypeId: number;
    accessorialGroupTypeName: string;
    defaultIndicator: string;
    effectiveDate: string;
    expirationDate: string;
    lastUpdateTimestampString: string;
    _links: object;
}
export interface AccessorialDocumentTypesItem {
    '@id': number;
    createTimestamp: string;
    createProgramName: string;
    lastUpdateProgramName: string;
    createUserId: string;
    lastUpdateUserId: string;
    accessorialDocumentTypeId: number;
    accessorialDocumentTypeName: string;
    effectiveDate: string;
    expirationDate: string;
    lastUpdateTimestampString: string;
    _links: Object;
}
export interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export interface DocumentationResponse {
    customerAccessorialDocumentConfigurationId: number;
    effectiveDate: string;
    expirationDate: string;
    accessorialDocumentTypeId: number;
    accessorialDocumentType: string;
    chargeTypeId: number;
    chargeTypeName: string;
    equipmentCategoryCode: string;
    equipmentTypeCode: string;
    equipmentLengthId: number;
    equipmentTypeId: number;
    businessUnitServiceOfferingDTOs: BusinessUnitServiceOfferingDTOsItem[];
    requestServiceDTOs: RequestServiceDTOsItem[];
    carrierDTOs: CarrierDTOsItem[];
    customerAccessorialDocumentTextAttachmentDTO: CustomerAccessorialDocumentTextAttachmentDTO;
}

export interface GroupNameSuggestions {
    label: string;
    value: number;
}
export interface BusinessUnitServiceOfferingDTOsItem {
    customerAccessorialServiceLevelBusinessUnitServiceOfferingId: null;
    serviceLevelBusinessUnitServiceOfferingAssociationId: number;
    businessUnit: null;
    serviceOffering: null;
    serviceLevel: null;
}
export interface RequestServiceDTOsItem {
    customerAccessorialRequestServiceId: null;
    requestedServiceTypeId: number;
    requestedServiceTypeCode: string;
}
export interface CarrierDTOsItem {
    customerAccessorialCarrierId: null;
    carrierId: number;
    carrierCode: string;
}
export interface CustomerAccessorialDocumentTextAttachmentDTO {
    customerAccessorialDocumentTextId: null;
    documentationCategory: string;
    textName: string;
    text: string;
    attachmentDTOs: AttachmentDTOsItem[];
}
export interface AttachmentDTOsItem {
    customerAccessorialAttachmentId: null;
    accessorialAttachmentTypeDTO: AccessorialAttachmentTypeDTO;
    documentNumber: string;
    documentName: string;
}
export interface AccessorialAttachmentTypeDTO {
    accessorialAttachmentTypeId: number;
    accessorialAttachmentTypeName: null;
}


export interface UploadedFiles {
    attachmentType: string;
    fileName: string;
    uploaderID: string;
}
export interface CanComponentDeactivate {
    canDeactivate: (component, route, state, nextState) => Observable<boolean> | Promise<boolean> | boolean;
}
export interface UploadFileServiceData {
    byteStream: string;
    docClass: string;
    documentId: string;
    documentTitle: string;
    documentType: string;
    ecmObjectStore: string;
    fileName: string;
    mimeType: string;
}
export interface DateRangeInterface {
    _embedded: {
        configurationParameterDetails: [{
            configurationParameter: object,
            configurationParameterDetailID: number,
            configurationParameterValue: string
        }]
    };
    _links: {
        configurationParameterDetail: {
            href: string,
            templated: boolean
        }
    };
}

export interface RateSetUpResponse {
    customerAccessorialDocumentConfigurationId: number;
    effectiveDate: string;
    expirationDate: string;
    customerAgreementId: number;
    chargeTypeId: number;
    chargeTypeName: string;
    currencyCode: string;
    equipmentCategoryCode: string;
    equipmentTypeCode: string;
    equipmentLengthId: number;
    equipmentTypeId: number;
    customerAgreementContractSectionAccountsDTOs: CustomerAgreementContractSectionAccountsDTOsItem[];
    businessUnitServiceOfferingDTOs: BusinessUnitServiceOfferingDTOsItem[];
    requestServiceDTOs: RequestServiceDTOsItem[];
    carrierDTOs: CarrierDTOsItem[];
    groupRateItemizeIndicator: null;
    groupRateTypeId: null;
}
export interface CustomerAgreementContractSectionAccountsDTOsItem {
    customerAccessorialAccountId: null;
    customerAgreementContractSectionId: number;
    customerAgreementContractSectionName: null;
    customerAgreementContractId: number;
    customerAgreementContractName: null;
    customerAgreementContractSectionAccountId: number;
    customerAgreementContractSectionAccountName: null;
}
