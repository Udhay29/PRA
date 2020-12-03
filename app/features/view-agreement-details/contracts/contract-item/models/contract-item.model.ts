import { FormGroup } from '@angular/forms';

export class ContractItemModel {
    contractForm: FormGroup;
    pageLoading: boolean;
    contractTypeList: any;
    isTransactional: boolean;
    isContractTypeDisabled: boolean;
    changeControls: any;
    subscriberFlag: boolean;
    isSaveChanges: boolean;
    tariffContractId: string;
    inCorrectExpDateFormat: boolean;
    inCorrectEffDateFormat: boolean;
    effectiveMinDate: Date;
    effectiveMaxDate: Date;
    expirationMinDate: Date;
    expirationMaxDate: Date;
    agreementDetails: any;
    isShowPopup: boolean;
    routerUrl: string;
    isCancelClicked: boolean;
    effDate: Date;
    expDate: Date;
    defaultStartDate: string;
    defaultEndDate: string;
    constructor() {
        this.subscriberFlag = true;
        this.pageLoading = false;
        this.contractTypeList = [];
        this.changeControls = ['contractId', 'description', 'effectiveDate', 'expirationDate', 'notes'];
        this.tariffContractId = '';
        this.inCorrectExpDateFormat = false;
        this.inCorrectEffDateFormat = false;
        this.defaultStartDate = '01/01/1995';
        this.defaultEndDate = '12/31/2099';
        this.routerUrl = '/viewagreement';
    }
}
