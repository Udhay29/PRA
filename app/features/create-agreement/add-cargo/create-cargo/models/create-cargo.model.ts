import { FormGroup } from '@angular/forms';
import {
    AgreementType, CargoReleaseDefaultAmount, SectionColumn,
    ContractDropDown, BusinessUnitDropDown, SectionRowData, AgreementDetails, GridRowData
} from './../../models/add-cargo-interface';

export class CreateCargoModel {

    cargoReleaseForm: FormGroup;
    isCancel: boolean;
    isOptional: boolean;
    isSubscribe: boolean;
    isSection: boolean;
    isContract: boolean;
    isChanged: boolean;
    isLoader: boolean;
    isDelete: boolean;
    isSaveChanges: boolean;
    effectiveDate: string;
    expirationDate: string;
    cargoType: string;
    saveError: string;
    agreementId: AgreementDetails;
    searchInputValue: string;
    cargoDefaultAmount: number;
    defaultCargoData: CargoReleaseDefaultAmount;
    selectedSectionsList: SectionRowData;
    sectionsList: Array<SectionRowData>;
    filteredSectionsList: Array<SectionRowData>;
    agreementType: Array<AgreementType>;
    sectionTableColumns: Array<SectionColumn>;
    allContractCargoValues: Array<ContractDropDown>;
    contractCargoValues: Array<ContractDropDown>;
    businessUnit: Array<BusinessUnitDropDown>;
    rowValue: Array<GridRowData>;
    IsPreValSetForBU: boolean;
    cargoReleaseFlag: boolean;
    isNotValidDate: boolean;
    effectiveMinDate: Date;
    expirationMaxDate: Date;
    effectiveMaxDate: Date;
    inCorrectExpDateFormat: boolean;
    expirationMinDate: Date;
    inCorrectEffDateFormat: boolean;
    tabValue: string;
    sectionFlag: boolean;
    agreementDetails: any;
    effDate: Date;
    expDate: Date;
    sectionSelectFlag: boolean;
    effError: boolean;
    expError: boolean;

    constructor() {
        this.IsPreValSetForBU = false;
        this.isNotValidDate = false;
        this.inCorrectExpDateFormat = false;
        this.inCorrectEffDateFormat = false;
        this.isCancel = false;
        this.isOptional = false;
        this.isSubscribe = true;
        this.isSection = false;
        this.isContract = false;
        this.isChanged = false;
        this.cargoReleaseFlag = false;
        this.sectionFlag = true;
        this.effError = false;
        this.expError = false;
        this.contractCargoValues = [];
        this.businessUnit = [];
        this.rowValue = [];
        this.tabValue = 'agreement';
        this.agreementType = [{
            label: 'Agreement',
            value: 'agreement'
        },
        {
            label: 'Contract',
            value: 'contract'
        },
        {
            label: 'Section',
            value: 'section'
        }
        ];
        this.sectionTableColumns = [{
            label: 'Sections', field: 'customerSectionName'
        }, {
            label: 'Contract', field: 'customerContractName'
        }];
    }
}
