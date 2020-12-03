
import { QueryMock, Hits, Document } from '../model/doumentaion.interface';
const businessUnitServiceOfferingDTOs = 'Business Unit and Service Offering';
const serviceLevel = 'Service Level';
const requestedService = 'Requested Service';
const keyword = 'ContractComment.keyword';
const attachementType = 'Attachment Type';
const fileTitle = 'File Title';
const documentId = 'Document ID';
const billToAccount = 'Bill to Account';
const carrierCode = 'Carrier (Code)';
const chargeType = 'Charge Type';
export class DocumentationModel {
    subscriberFlag: boolean;
    sourceData: QueryMock;
    documentList: Document[];
    noResultFoundFlag: boolean;
    gridDataLength: number;
    isPaginatorFlag: boolean;
    tableSize: number;
    isShowLoader: boolean;
    pageStart: number;
    getFieldNames: object;
    getNestedRootVal: object;
    tableColumns: Array<object>;
    isEmptySearch: boolean;
    isFilterEnabled: boolean;

    constructor() {
        this.subscriberFlag = true;
        this.noResultFoundFlag = false;
        this.isPaginatorFlag = true;
        this.tableSize = 25;
        this.isShowLoader = false;
        this.pageStart = 0;
        this.tableColumns = [
            {
                'name': 'Documentation Type', 'property': 'accessorialDocumentType', 'keyword': 'ContractTypeName.keyword',
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': false
            },
            {
                'name': chargeType, 'property': 'chargeTypeName', 'keyword': 'ContractNumber.keyword',
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': true
            },
            {
                'name': 'Contract', 'property': 'customerAgreementContractName', 'keyword': 'ContractName.keyword',
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': true
            },
            {
                'name': 'Section', 'property': 'customerAgreementContractSectionName', 'keyword': 'Status.keyword',
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': true
            },
            {
                'name': businessUnitServiceOfferingDTOs, 'property': 'businessUnitServiceOfferingDTOs',
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': true
            },
            {
                'name': serviceLevel, 'property': 'serviceLevel',
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': true
            },
            {
                'name': requestedService, 'property': 'requestedServices',
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': true
            },
            {
                'name': 'Equipment Category', 'property': 'equipmentClassificationCode', 'keyword': keyword,
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': false
            },
            {
                'name': 'Equipment Type', 'property': 'equipmentClassificationTypeAssociationCode', 'keyword': keyword,
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': false
            },
            {
                'name': 'Equipment Length', 'property': 'equipmentLengthId', 'keyword': keyword,
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': false
            },
            {
                'name': carrierCode, 'property': 'carrierName', 'keyword': keyword,
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': true
            },
            {
                'name': billToAccount, 'property': 'customerAgreementContractSectionAccountName', 'keyword': keyword,
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': true
            },
            {
                'name': 'Text Name', 'property': 'textName', 'keyword': keyword,
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': true
            },
            {
                'name': 'Text', 'property': 'text', 'keyword': keyword,
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': true
            },
            {
                'name': attachementType, 'property': 'accessorialAttachmentTypeName', 'keyword': keyword,
                'isSubcolumn': true, 'isNotFirst': false, 'isArray': true
            },
            {
                'name': 'File Type', 'property': 'fileType', 'keyword': keyword,
                'isSubcolumn': true, 'isNotFirst': true, 'isArray': true
            },
            {
                'name': fileTitle, 'property': 'documentName', 'keyword': keyword,
                'isSubcolumn': true, 'isNotFirst': true, 'isArray': true
            },
            {
                'name': 'Added On', 'property': 'addedOn', 'keyword': keyword,
                'isSubcolumn': true, 'isNotFirst': true, 'isArray': true
            },
            {
                'name': 'Added By', 'property': 'addedBy', 'keyword': keyword,
                'isSubcolumn': true, 'isNotFirst': true, 'isArray': true
            },
            {
                'name': documentId, 'property': 'accessorialAttachmentTypeId', 'keyword': keyword,
                'isSubcolumn': true, 'isNotFirst': true, 'isArray': true
            },
            {
                'name': 'Effective Date', 'property': 'effectiveDate', 'keyword': keyword,
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': false
            },
            {
                'name': 'Expiration Date', 'property': 'expirationDate', 'keyword': keyword,
                'isSubcolumn': false, 'isNotFirst': false, 'isArray': false
            },
        ];
        this.getFieldNames = {
            'Documentation Type': 'accessorialDocumentType.keyword',
            [chargeType]: 'customerAccessorialDocumentChargeTypes.chargeTypeName.keyword',
            'Contract': 'customerAccessorialAccounts.customerAgreementContractName.keyword',
            'Section': 'customerAccessorialAccounts.customerAgreementContractSectionName.keyword',
            'Effective Date': 'effectiveDate',
            'Expiration Date': 'expirationDate',
            [serviceLevel]: 'customerAccessorialServiceLevelBusinessUnitServiceOfferings.serviceLevel.keyword',
            [requestedService]: 'customerAccessorialRequestServices.requestedServiceTypeCode.keyword',
            'Equipment Category': 'equipmentClassificationCode.keyword',
            'Equipment Type': 'equipmentClassificationTypeAssociationCode.keyword',
            'Equipment Length': 'equipmentLength',
            [carrierCode]: 'customerAccessorialCarriers.carrierName.keyword',
            'Carrier': 'customerAccessorialCarriers.carrierCode.keyword',
            [billToAccount]: 'customerAccessorialAccounts.customerAgreementContractSectionAccountName.keyword',
            'Text Name': 'customerAccessorialText.textName.keyword',
            'Text': 'customerAccessorialText.text.keyword',
            [attachementType]: 'customerAccessorialAttachments.accessorialAttachmentType.accessorialAttachmentTypeName.keyword',
            'File Type': 'customerAccessorialAttachments.fileType.keyword',
            [fileTitle]: 'customerAccessorialAttachments.documentName.keyword',
            'Added On': 'customerAccessorialAttachments.addedOn.keyword',
            'Added By': 'customerAccessorialAttachments.addedBy.keyword',
            [documentId]: 'customerAccessorialAttachments.documentNumber.keyword',
            [businessUnitServiceOfferingDTOs]: 'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnit.keyword'
        };

        this.getNestedRootVal = {
            'Text': 'customerAccessorialText',
            'Section': 'customerAccessorialAccounts',
            'Contract': 'customerAccessorialAccounts',
            [billToAccount]: 'customerAccessorialAccounts',
            'Text Name': 'customerAccessorialText',
            [attachementType]: 'customerAccessorialAttachments.accessorialAttachmentType',
            'File Type': 'customerAccessorialAttachments',
            [fileTitle]: 'customerAccessorialAttachments',
            'Added On': 'customerAccessorialAttachments',
            [documentId]: 'customerAccessorialAttachments',
            'Added By': 'customerAccessorialAttachments',
            [businessUnitServiceOfferingDTOs]: 'customerAccessorialServiceLevelBusinessUnitServiceOfferings',
            [serviceLevel]: 'customerAccessorialServiceLevelBusinessUnitServiceOfferings',
            [requestedService]: 'customerAccessorialRequestServices',
            [carrierCode]: 'customerAccessorialCarriers',
            [chargeType]: 'customerAccessorialDocumentChargeTypes'
        };
    }
}
