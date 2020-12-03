import { FilterData } from './email-template-interface.interface';
import { Message } from 'primeng/api';
export class EmailTemplateModel {

    bodyElements: FilterData[];
    isShowPopUp: boolean;
    popUpHeader: string;
    popUpText: string;
    controlNameToRemove: string;
    indexToRemove: number;
    notificationTypes: FilterData[];
    filterednotifications: FilterData[];
    chargeTypes: FilterData[];
    filteredChargeTypes: FilterData[];
    duplicateMessages: Message[];
    batchingExcelValues: FilterData[];
    batchingExcelSuggestions: FilterData[];
    defaultExcelValues: FilterData[];
    defaultExcelSuggestions: FilterData[];
    isBatchAdding: boolean;
    isDefaultAdding: boolean;
    saveControlToRemove: string;

    constructor() {
        this.duplicateMessages = [];
    }
}
