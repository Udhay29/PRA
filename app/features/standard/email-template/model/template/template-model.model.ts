
import { MenuItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { TemplateType, SubmitStatus } from './template-interface';

export class TemplateModel {

    masterBreadCrumbList: MenuItem[];
    defaultBreadCrumbList: MenuItem[];
    header: string;
    templateForm: FormGroup;
    templateTypes: TemplateType[];
    templatePartTypes: TemplateType[];
    subjectElements: TemplateType[];
    BodyElements: TemplateType[];
    partsToMark: string[];
    submitStatus: SubmitStatus;
    isShowPopUp: boolean;
    popUpHeader: string;
    popUpText: string;
    partTypes: any;
    dataElements: string[];
    isLoading: boolean;
    routeToNavigate: string;
    activeRoute: string;
    isDefaultCreate: boolean;
    isDefaultExcel: boolean;
    batchExcelElements: TemplateType[];
    defaultExcelElements: TemplateType[];
    batchOverflow: MenuItem[];
    defaultOverflow: MenuItem[];
    valuesFromDefault: TemplateType[];
    valuesFromBatch: TemplateType[];
    masterTemplateData: any;
    panelFlag: boolean;
    panelDefaultFlag: boolean;
    headerMessages: any;
    masterInfo: string;

    constructor() {
        this.initialValues();
    }

    initialValues() {
        this.header = '';
        this.isLoading = true;
        this.masterBreadCrumbList = [{
            label: 'Pricing',
            routerLink: ['/dashboard']
        }, {
            label: 'Standards',
            routerLink: ['/standard']
        }, {
            label: 'Create Master Email Template'
        }];
        this.defaultBreadCrumbList = [{
            label: 'Pricing',
            routerLink: ['/dashboard']
        }, {
            label: 'Standards',
            routerLink: ['/standard']
        }, {
            label: 'Create Default Email Template'
        }];
        this.partsToMark = ['introParagraph', 'conclusionParagraph', 'signatureLine'];
        this.dataElements = ['bodyDataElements', 'subjectDataElements'];
        this.submitStatus = {
            status: false,
            introParagraph: false,
            conclusionParagraph: false,
            signatureLine: false,
            batchingExcel: false,
            defaultExcel: false,
            introSave: false,
            conclusionSave: false,
            signatureSave: false,
            defaultSave: false,
            batchSave: false
        };
        this.partTypes = {
            introParagraph: 'Email Body Introduction',
            conclusionParagraph: 'Email Body Conclusion',
            signatureLine: 'Signature',
            subjectText: 'Subject',
            bodyDataElements: 'Email Body',
            subjectDataElements: 'Subject'
        };
        this.routeToNavigate = '/standard/email-templates';
        this.headerMessages = {
            remove: {
                header: 'Remove Default Excel Attachment',
                text: 'Are you sure you would like to remove the Default Excel attachment? All mapping will be deleted.'
            },
            copy: {
                header: 'Copy from Default Excel Attachment',
                // tslint:disable-next-line:max-line-length
                text: 'Are you sure you would like to copy columns from the Default Excel attachment? Any current headings will be replaced.'
            }
        };
        // tslint:disable-next-line:max-line-length
        this.masterInfo = 'The Master text is derived from the Master Template and cannot be changed outside of editing the Master Template.';
    }

}
