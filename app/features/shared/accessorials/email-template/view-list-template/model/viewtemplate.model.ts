
import { MenuItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { ListingDetails } from './viewtemplate.interface';

export class ViewTemplateModel {

    breadCrumbList: MenuItem[];
    breadCrumbListDefault: MenuItem[];
    header: string;
    defaultHeader: string;
    templateForm: FormGroup;
    overflowMenuList: MenuItem[];
    viewTemplateDetails: ListingDetails;
    subscriberFlag: boolean;
    subjectArray: string[];
    introArray = [];
    conclusionArray: string[];
    subjectValue: string;
    emailBodyValue: string;
    defaultSignatureArray: string[];
    batchExcelArr: string[];
    defaultExcelArr: string[];
    datavar: string[];
    dateFormatVar: string;
    dataArrayIntro: string;
    subjectValueArr = [];
    emailBodyValueArr = [];
    idParam: number;
    masterSignatureArray: string[];
    viewMasterTemplateDetails: ListingDetails;

    constructor() {
        this.overflowMenuList = [];
        this.subjectArray = [];
        this.conclusionArray = [];
        this.subjectValue = '';
        this.emailBodyValue = '';
        this.defaultSignatureArray = [];
        this.dataArrayIntro = '';
        this.subscriberFlag = true;
        this.batchExcelArr = [];
        this.defaultExcelArr = [];
        this.datavar = [];
        this.dateFormatVar = '';
        this.masterSignatureArray = [];
        this.initialValues();
    }

    initialValues() {
        this.header = '';
        this.defaultHeader = '';
        this.breadCrumbList = [{
            label: 'Pricing',
            routerLink: ['/dashboard']
        }, {
            label: 'Standards',
            routerLink: ['/standard']
        }, {
            label: 'View Master Email Template'
        }];
        this.breadCrumbListDefault = [{
            label: 'Pricing',
            routerLink: ['/dashboard']
        }, {
            label: 'Standards',
            routerLink: ['/standard']
        }, {
            label: 'View Default Email Template'
        }];
    }
}
