import { FormGroup } from '@angular/forms';

import { Message } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { AgreementResultList, BillToResultList, ContractResultList, CarrierNameList } from '../model/advance-search-interface';
import { Menu } from 'primeng/menu';


export class AdvanceSearchModel {
    advanceSearchForm: FormGroup;
    agreementTypeList: MenuItem[];
    isSubscriberFlag: boolean;
    filteredAgreementType: MenuItem[];
    filteredCodeStatus: MenuItem[];
    filteredAgreementStatus: MenuItem[];
    carrierFilteredCarrierStatus: MenuItem[];
    carrierFilteredAgreementStatus: MenuItem[];
    filteredTeamsList: MenuItem[];
    agreementList: string[];
    codeStatusList: MenuItem[];
    teamsList: MenuItem[];
    agreementStatusList: MenuItem[];
    carrierStatus: MenuItem[];
    agreementStatus: MenuItem[];
    contractNameList: ContractResultList[];
    isMandatoryFlag: boolean;
    isShowError: boolean;
    agreementNameList: AgreementResultList[];
    billToList: BillToResultList[];
    advanceSearchFormValue: string;
    carrierSearchFormValue: string;
    advanceSearchFormField: object;
    validateFlag: boolean;
    isAgreementType: boolean;
    isPageLoading: boolean;
    isCarrierFlag: boolean;
    carrierStatusFlag: boolean;
    carrierAgreementNameList: CarrierNameList[];
    carrierList: CarrierNameList[];
    dateFormat: string;
    momentDateFormat: string;

    constructor() {
        this.isSubscriberFlag = true;
        this.isAgreementType = false;
        this.isPageLoading = false;
        this.carrierStatusFlag = true;
        this.agreementList = [];
        this.agreementNameList = [];
        this.teamsList = [];
        this.contractNameList = [];
        this.agreementTypeList = [];
        this.billToList = [];
        this.agreementStatusList = [];
        this.carrierStatus = [];
        this.agreementStatus = [];
        this.codeStatusList = [];
        this.isShowError = false;
        this.filteredCodeStatus = [];
        this.filteredTeamsList = [];
        this.isCarrierFlag = false;
        this.carrierAgreementNameList = [];
        this.carrierList = [];
        this.dateFormat = 'MM/dd/yyyy';
        this.momentDateFormat = 'MM/DD/YYYY';
        this.advanceSearchFormField = {
            'agreementType': {'key': 'value', 'name': 'Agreement Type'},
            'agreement': {'key': 'AgreementName', 'name': 'Agreement'},
            'contract': {'key': 'Contract', 'name': 'Contract'},
            'billTo': {'key': 'BillToCode', 'name': 'Bill To'},
            'codeStatus': {'key': 'value', 'name': 'Code Status'},
            'operationalTeam': {'key': 'value', 'name': 'Team'},
            'agreementStatus': {'key': 'value', 'name': 'Agreement Status'},
            'carrierStatus': {'key': 'value', 'name': 'Carrier Status'},
            'carrierAgreement': {'key': 'CarrierAgreementName', 'name': 'Agreement'},
            'carrier': {'key': 'CarrierName', 'name': 'Carrier'},
            'CarrierAgreementStatus': {'key': 'value', 'name': 'Agreement Status'}
        };
    }
}
