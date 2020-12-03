import { Breadcrumb } from '../../../../model/breadcrumb';
import { EditedValueList } from '../groups/model/group.interface';

export class LinehaulPriorityModel {

    breadCrumbList: Breadcrumb[];
    selectedIndex: number;
    lastSelectedIndex: number;
    lastEditedFormFlag: boolean;
    loading: boolean;
    isValuesModified: boolean;
    groupEditFlag: boolean;
    groupRoutingUrl: string;
    routingUrl: string;
    isPopupVisible: boolean;
    popupMessage: string;
    tabChangePopup: boolean;
    tempTabIndex: number;
    groupsFirstLoading: boolean;
    editedGroupValues: EditedValueList[];
    editedGroupIDs: number[];
    duplicateGroupIds: number[];
    groupMap: Map<number, string[]>;

    constructor() {
        this.groupsFirstLoading = true;
        this.groupEditFlag = false;
        this.isPopupVisible = false;
        this.selectedIndex = 0;
        this.editedGroupIDs = [];
        this.editedGroupValues = [];
        this.duplicateGroupIds = [];
        this.groupMap = new Map<number, string[]>();

        this.lastEditedFormFlag = false;
        this.isValuesModified = false;
        this.tabChangePopup = false;
        this.breadCrumbList = [
            {
                label: 'Pricing',
                routerLink: ['/dashboard']
            }, {
                label: 'Settings',
                routerLink: ['/settings']
            }, {
                label: 'Precedence',
                routerLink: ['/settings/precedence']
            }
        ];
    }
}
