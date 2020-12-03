export interface TableColumn {
    field: string;
    header: string;
    title?: string;
    isSubtitle?: boolean;
    isArray?: boolean;
    sortField: string;
    width?: object;
    isToolTipDisabled?: boolean;
    isNotFirst?: boolean;
    isSubcolumn?: true;
    sortFilterField?: string;
    sortFilterData?: string;
}
