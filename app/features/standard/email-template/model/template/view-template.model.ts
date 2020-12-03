import { ViewTemplateTableColumnModel, TemplateList} from './view-template.inteface';

export class ViewTemplateModel {
tableColumns: ViewTemplateTableColumnModel[];
loading: boolean;
templateListQuery: any;
subscribeFlag: boolean;
noResultFlag: boolean;
from: number;
size: number;
sortOrder: string;
templateGridValues: TemplateList[];
totalRecords: number;
firstCheck: boolean;
searchText: string;
sortField: string;
searchFlag: number;
isDefaultTemplateExist: boolean;
dateFormat: string;
dateTimeFormat: string;
constructor() {
    this.loading = true;
    this.noResultFlag = false;
    this.from = 0;
    this.size = 25;
    this.sortOrder = 'asc';
    this.firstCheck = false;
    this.sortField = 'initialSort';
    this.searchText = '';
    this.searchFlag = 0;
    this.isDefaultTemplateExist = false;
    this.dateFormat = 'YYYY-MM-DD';
    this.dateTimeFormat = 'YYYY-MM-DD HH:mm';
    this.tableColumns = [
        {
        'name': 'Template Type',
        'property': 'emailTemplateTypeName',
        'isVisible': true
    },
    {
        'name': 'Charge Type',
        'property': 'chargeTypeDisplayName',
        'isVisible': true
    },
    {
        'name': 'Notification Type',
        'property': 'accessorialNotificationTypeName',
        'isVisible': true
    },
    {
        'name': 'Template Number',
        'property': 'emailTemplateReferenceNumber',
        'isVisible': true
    },
    {
        'name': 'Default Attachment',
        'property': 'defaultAttachment',
        'isVisible': true
    },
    {
        'name': 'Modified By',
        'property': 'modifiedBy',
        'isVisible': true
    },
    {
        'name': 'Date Modified',
        'property': 'lastUpdateTimestamp',
        'isVisible': true
    },
];
}
}
