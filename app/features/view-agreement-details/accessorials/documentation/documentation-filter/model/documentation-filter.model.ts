export class DocumentationFilerModel {
    isPanelClosed: boolean;
    isStatusFlag: boolean;
    statusSelectedList: Array<object>;
    activeInactiveReasonType: string;
    constructor() {
        this.isPanelClosed = true;
        this.statusSelectedList = [];
        this.isStatusFlag = true;
        this.activeInactiveReasonType = 'Active OR Inactive';

    }
}
