import { Breadcrumb } from '../../../model/breadcrumb';


export class AdminModel {
    adminPopulate: object;
    componentValues: object;
    dataList: any;
    routeUrl: string;
    adminRequestData: object;
    requestBody: object;
    warnningMsg: string;
    pageLoading: boolean;
    systemTableValues: Breadcrumb[];
    breadCrumbList: Breadcrumb[];

    constructor() {
        this.adminPopulate = {
            'agreementTypeDTOs': {
                'formName': 'agreementType',
                'value': 'agreementTypeName',
                'key': 'agreementTypeID'
            },
            'contractTypeDTOs': {
                'formName': 'contractType',
                'value': 'contractTypeName',
                'key': 'contractTypeID'
            },
            'sectionTypeDTOs': {
                'formName': 'adminSectionTypes',
                'value': 'sectionTypeName',
                'key': 'sectionTypeID'
            }
        };
        this.adminRequestData = {
            'agreementType': 'agreementTypeDTOs',
            'contractType': 'contractTypeDTOs',
            'adminSectionTypes': 'sectionTypeDTOs'
        };
        this.warnningMsg = 'No Changes Found';
        this.componentValues = {};
        this.requestBody = {};
        this.systemTableValues = [
            { label: 'Charges', routerLink: ['/charges'] }
        ];
        this.breadCrumbList = [
            { label: 'Pricing', routerLink: ['/managereferences'] },
            { label: 'Settings', routerLink: ['/settings'] },
            { label: 'Charges', routerLink: ['/charges'] }
          ];
    }
}
