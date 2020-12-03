import { FormGroup } from '@angular/forms';

import { MenuItem } from 'primeng/api';

import {
    AgreementDetailsInterface, DocumentationLevelInterface
} from '../../../documentation/create-documentation/model/create-documentation.interface';
import { ContractTypesItemInterface } from '../../../shared/contract-list/model/contract-list.interface';
import { SectionsGridResponseInterface } from '../../../shared/sections/model/sections-interface';
import {
    RuleTypeInterface, MonthlyTypes, ChargeCodeInterface,
    CreateDocumentationInterface, ErrorMessage, EditBillToValueInterface
} from './create-rules.interface';
import { BuSoAssociation } from '../../../shared/models/optional-attributes.interface';

export class CreateRuleModel {
    loading: boolean;
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
    isEditAccessorialRuleClicked: boolean;
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
    refreshDocumentResponse;
    editRequestedServiceResponse: object[];
    buSoBasedOnChargeType: BuSoAssociation[];
    rulesDocumentLevel: string;
    buSo: number[];
    agreementEndDate: string;
    showReferenceGrid: object;
    editAccessorialWholeResponse;
    isEditFlagEnabled: boolean;
    editBillToValues: EditBillToValueInterface[];
    editSectionValues: SectionsGridResponseInterface[];
    editContractValues: Array<ContractTypesItemInterface>;
    selectedBuSo: Array<number>;

    constructor(agreementID: string) {
      this.editSectionValues = [];
        this.isSubscribeFlag = true;
        this.editContractValues = [];
        this.buSo = [];
        this.ruleType = [];
        this.selectedBuSo = [];
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
        this.setInitialValues(agreementID);
    }
    setInitialValues(agreementID: string) {

        this.breadCrumbList = [{
            label: 'Pricing',
            routerLink: ['/dashboard']
        }, {
            label: 'Search Agreements',
            routerLink: ['/searchagreement']
        }, {
            label: 'Agreement Details',
            routerLink: ['/viewagreement'],
            queryParams: { id: agreementID }
        }, {
            label: 'Create Rule'
        }];
    }
}
