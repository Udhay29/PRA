import { LinehaulPriorityGroupValue, LineHaulPriorityGroupsItem, EditedValueList } from './group.interface';


export class GroupModel {

    column: Array<string>;
    tableValue: LinehaulPriorityGroupValue[];
    editValues: EditedValueList[];
    editedPriorityList: Array<string>;
    editflag: boolean;
    isSaveChanges: boolean;
    popupMessage: string;
    routingUrl: string;
    subsrciberFlag: boolean;
    duplicateGroupIds: number[];
    emptyGroupIds: number[];
    editedGroupIDs: number[];
    loading: boolean;
    initialValues: LineHaulPriorityGroupsItem[];
    constructor() {
        this.column = ['Point type', 'Group Priority'];
        this.tableValue = [];
        this.initialValues = [];
        this.editValues = [];
        this.subsrciberFlag = true;
        this.duplicateGroupIds = [];
        this.editedGroupIDs = [];
        this.emptyGroupIds = [];
        this.loading = false;
    }
}
