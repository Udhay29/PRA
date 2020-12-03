import { Breadcrumb } from '../../../../model/breadcrumb.interface';
import { SplitScreenDetails, DrayGroupArray } from './dray-group.interface';

export class DrayGroupModel {
    isSubscriberFlag: boolean;
    isSplitView: boolean;
    splitScreenData: SplitScreenDetails;
    breadCrumbList: Breadcrumb[];
    isShowDrayGroupCreation: boolean;
    drayGroupCreatebutton: boolean;
    tableColumns: Array<any>;
    drayGroupArray: DrayGroupArray[];
    drayGroupFlag: boolean;
    totalRuleRecords: number;
    isRuleRecordEmpty: boolean;
    loading: boolean;
    isSubscribeFlag: boolean;
    drayGroup: any;
    isPageLoading: boolean;
    isSubscribe: boolean;
    dataFlag: boolean;
    filterNoresultFlag: boolean;
    formChanged: boolean;
    showPopup: boolean;
    isChangesSaving: boolean;
    routingUrl: string;
    searchFlag: boolean;
    searchText: string;
    from: number;
    size: number;
    sortField: string;
    sortOrder: string;
    showSearchPopup: boolean;
    constructor() {
        this.isShowDrayGroupCreation = false;
        this.isSubscriberFlag = true;
        this.isSubscribe = true;
        this.isSplitView = false;
        this.drayGroupCreatebutton = false;
        this.searchText = '*';
        this.from = 0;
        this.size = 25;
        this.sortField = 'initialSort';
        this.sortOrder = 'asc';
        this.searchFlag = false;
        this.showSearchPopup = false;
        this.breadCrumbList = [
            { label: 'Pricing', routerLink: ['managereferences'] },
            { label: 'Settings', routerLink: ['/settings'] },
            { label: 'Dray Group', routerLink: ['/settings/draygroup'] }
        ];

        this.tableColumns = [
            {
                headerName: 'Name', field: 'drayGroupName', isSubtitle: false, isSubcolumn: false
            },
            {
                headerName: 'Code', field: 'drayGroupCode', isSubtitle: false, isSubcolumn: false
            },
            {
                headerName: 'Rate Scope', field: 'rateScopeTypeName', isSubtitle: false, isSubcolumn: false
            },
            {
                headerName: 'Country', field: 'countriesToShow', isSubtitle: false, isSubcolumn: false
            },
            {
                headerName: 'Effective Date', field: 'effectiveDate', isSubtitle: false, isSubcolumn: false
            },
            {
                headerName: 'Expiration Date', field: 'expirationDate', isSubtitle: false, isSubcolumn: false
            },
            {
                headerName: 'Created By', field: 'createUserID', isSubtitle: false, isSubcolumn: false
            },
            {
                headerName: 'Created On ', field: 'createTimestamp', isSubtitle: false, isSubcolumn: false
            },
            {
                headerName: 'Created Program', field: 'createProgramName', isSubtitle: false, isSubcolumn: false
            },
            {
                headerName: 'Updated On', field: 'lastUpdateTimestamp', isSubtitle: false, isSubcolumn: false
            },
            {
                headerName: 'Updated By', field: 'lastUpdateUserID', isSubtitle: false, isSubcolumn: false
            },
            {
                headerName: 'Updated Program', field: 'lastUpdateProgramName', isSubtitle: false, isSubcolumn: false
            }
        ];
    }
}
