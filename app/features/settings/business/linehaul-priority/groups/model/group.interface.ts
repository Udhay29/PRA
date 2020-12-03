export interface Column {
    label: string;
    property: string;
}

export interface LineHaulPriorityGroups {
    _embedded: LineHaulGroupEmbedded;
    _links: LineHaulGroupLinks;
    page: Page;
}
export interface LineHaulGroupEmbedded {
    lineHaulPriorityGroups: LineHaulPriorityGroupsItem[];
}
export interface LineHaulPriorityGroupsItem {
    lineHaulGroupPriorityNumber: number;
    lineHaulPriorityGroupName: string;
    lineHaulPriorityGroupID: number;
    _links: LineHaulGroupLinks;
}
export interface LineHaulGroupLinks {
    self: LinehaulGroupSelf;
    lineHaulPriorityGroup: LineHaulPriorityGroup;
    profile?: Profile;
}
export interface LinehaulGroupSelf {
    href: string;
    templated?: boolean;
}
export interface LineHaulPriorityGroup {
    href: string;
    templated: boolean;
}
export interface Profile {
    href: string;
}
export interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export interface LinehaulPriorityGroupValue {
    lineHaulGroupPriorityNumber: number;
    lineHaulPriorityGroupName: string;
    lineHaulPriorityGroupID: number;
}
export interface EditedValueList {
    lineHaulGroupPriorityNumber: number | string;
    lineHaulPriorityGroupName: string | number;
    lineHaulPriorityGroupID: number;
}
