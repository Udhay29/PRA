export class ViewDocumentationModel {
    docIsLegalText: boolean;
    docIsInstructionalText: boolean;
    isRefreshClicked: boolean;
    isValidFormFields: boolean;
    noDocumentationFound: boolean;
    instructionalTextArea: string;
    legalTextArea: string;
    documentTypeID: number;
    isEditRateClicked: boolean;
    legalAttachments: object[];
    instructionalAttachments: object[];
    attachments: object [];
    legalStartDate: string;
    legalEndDate: string;
    instructionStartDate: string;
    instructionEndDate: string;
    constructor() {
        this.legalTextArea = '';
        this.instructionalTextArea = '';
        this.attachments = [];
        this.legalAttachments = [];
        this.instructionalAttachments = [];
    }
}
