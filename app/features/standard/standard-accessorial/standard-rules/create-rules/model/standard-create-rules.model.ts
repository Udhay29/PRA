// tslint:disable-next-line: import-spacing
import { GroupNameInterface }
from './../../../standard-documentation/create-standard-documentation/model/create-standard-documenation.interface';
import { FormGroup } from '@angular/forms';

import { MenuItem } from 'primeng/api';

import {
    RuleTypeInterface, MonthlyTypes, ChargeCodeInterface,
    CreateDocumentationInterface, ErrorMessage, BuSoAssociation,
     AgreementDetailsInterface, DocumentationLevelInterface, ContractTypesItemInterface,
     SectionsGridResponseInterface
} from './standard-create-rules.interface';

export class CreateRuleModel {
    isSubscribeFlag: boolean;
    contractChecked: boolean;
    sectionChecked: boolean;
    isRefreshClicked: boolean;
    validFields: boolean;
    isDateChanged: boolean;
    inValidDate: boolean;
    isCorrectEffDateFormat: boolean;
    isCorrectExpDateFormat: boolean;
    inValidEffDate: boolean;
    inValidExpDate: boolean;
    isShowSavePopup: boolean;
    isValueChangePopup: boolean;
    isRuleType: boolean;
    isRuleLevel: boolean;
    ruleCancel: boolean;
    isDetailsSaved: boolean;
    isChangesSaving: boolean;
    isNavigationChange: boolean;
    errorMsg: boolean;
    isAveragingRules: boolean;
    isSuspend: boolean;
    isArrival: boolean;
    chargeTypeLoading: boolean;
    isNotification: boolean;
    selectedRuleLevel: string;
    effectiveDate: string;
    expirationDate: string;
    agreementEffectiveDate: string;
    agreementExpirationDate: string;
    routingUrl: string;
    setExpirationDate: string;
    agreementEndDate: string;
    arrivalHeading: string;
    superUserBackDateDays: number;
    superUserFutureDateDays: number;
    expirationMinDate: Date;
    effectiveMaxDate: Date;
    effectiveMinDate: Date;
    expirationMaxDate: Date;
    rulesForm: FormGroup;
    agreementDetails: AgreementDetailsInterface;
    selectedRuleType: RuleTypeInterface;
    createDocumentationText: CreateDocumentationInterface;
    disabledEffectiveDate: Date[];
    disabledExpirationDate: Date[];
    breadCrumbList: MenuItem[];
    inlineErrormessage: Array<ErrorMessage>;
    ruleType: RuleTypeInterface[];
    ruleTypeFiltered: RuleTypeInterface[];
    ruleLevel: DocumentationLevelInterface[];
    selectedContractValue: ContractTypesItemInterface[];
    selectedSectionValue: SectionsGridResponseInterface[];
    chargeTypeFiltered: ChargeCodeInterface[];
    chargeType: ChargeCodeInterface[];
    businessUnitBasedOnChargeType: BuSoAssociation[];
    gracePeriod: MonthlyTypes[];
    gracePeriodFiltered: MonthlyTypes[];
    isFreeRules: boolean;
    selectedFreeRuleType: number;
    savedFreeRule: object;
    isFreeRuleSaveAndClose: boolean;
    invalidData: boolean;
    arrivalGraceAmount: number;
    showReferenceGrid: object;
    groupNameValues: Array<GroupNameInterface>;
    groupNameSuggestions: Array<GroupNameInterface>;

    constructor() {
        this.groupNameSuggestions = [];
        this.groupNameValues = [];
        this.isSubscribeFlag = true;
        this.setExpirationDate = '12-31-2099';
        this.ruleType = [];
        this.isFreeRuleSaveAndClose = true;
        this.arrivalHeading = 'arrival grace period';
        this.showReferenceGrid = null;
        this.createDocumentationText = {
            documentationContent:
                'No documentation was found for the provided setup. Create the proper documentation before creating this rule.',
            documentationText: 'Exit the rule without saving and create documentation.',
            cancelText: 'Return to the rule and continue making changes.'
        };
        this.ruleLevel = [{
            label: 'Agreement',
            value: 'Agreement'
        },
        {
            label: 'Contract',
            value: 'contract'
        },
        {
            label: 'Section',
            value: 'section'
        }];
        this.setInitialValues();
    }
    setInitialValues() {

        this.breadCrumbList = [{
            label: 'Pricing',
            routerLink: ['/dashboard']
        }, {
            label: 'Standards',
            routerLink: ['/standard']
        }, {
            label: 'Create Standard Rule'
        }];
    }
}
