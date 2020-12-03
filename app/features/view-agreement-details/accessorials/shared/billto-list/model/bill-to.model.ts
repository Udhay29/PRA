import { BillToModelInterface, BillToValueInterface } from './bill-to.interface';
import { ContractTypesItemInterface } from '../../contract-list/model/contract-list.interface';
import { SectionsGridResponseInterface } from '../../sections/model/sections-interface';
import { EditBillToValueInterface } from '../../../rates/create-rates/model/create-rates.interface';
export class BillToModel {
    loading: boolean;
    tableColumns: BillToModelInterface[];
    subscribeFlag: boolean;
    filteredValuesLength: number;
    billToGridValues: BillToValueInterface[];
    selectedBillTo: BillToValueInterface[];
    selectedRateType: string;
    selectedContractValue: ContractTypesItemInterface[];
    selectedSectionValue: SectionsGridResponseInterface[];
    billToContractEmptyValue: boolean;
    billToSectionEmptyValue: boolean;
    billToSearchValue: string;
    effectiveDate: string;
    expirationDate: string;
    dataSelected: BillToValueInterface[];
    selectedBillToInEdit: EditBillToValueInterface[];
    isEditRateClicked: boolean;
    isEditRuleClicked: boolean;
    isDocumentsDetailedView: boolean;

    constructor() {
        this.dataSelected = [];
        this.tableColumns = [
            {
                'name': 'Bill to Account',
                'property': 'billToDetails'
            },
            {
                'name': 'Section',
                'property': 'customerAgreementContractSectionName'
            },
            {
                'name': 'Contract',
                'property': 'customerContractName'
            }
        ];
        this.subscribeFlag = true;
        this.billToGridValues = [];
        this.selectedBillTo = [];
        this.selectedBillToInEdit = [];
    }
}
