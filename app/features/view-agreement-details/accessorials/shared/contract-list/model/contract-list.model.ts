import { ContractListGridColumnsObjInterface, ContractTypesItemInterface } from './contract-list.interface';

export class ContractListModel {
  loading: boolean;
  isSubscriberFlag: boolean;
  tableColumns: Array<ContractListGridColumnsObjInterface>;
  contractList: Array<ContractTypesItemInterface>;
  filteredValuesLength: number;
  selectedContract: ContractTypesItemInterface[];
  selectedContractInEdit: ContractTypesItemInterface[];
  isAllContractsSelected: boolean;
  errorText: string;
  dataSelected: ContractTypesItemInterface[];
  isEditRateClicked: boolean;
  isEditRuleClicked: boolean;
  selectedCurrency: string;
  isCurrencyValidationRequired: boolean;
  constructor() {
    this.contractList = [];
    this.isSubscriberFlag = true;
    this.filteredValuesLength = 0;
    this.selectedContract = [];
    this.selectedContractInEdit = [];
    this.isAllContractsSelected = false;
    this.dataSelected = [];
    this.selectedCurrency = '';
    this.isCurrencyValidationRequired = false;
    this.errorText = 'Missing Required Information';
    this.tableColumns = [
      { 'name': 'Contract', 'property': 'contractName' },
      { 'name': 'Effective Date', 'property': 'effectiveDate' },
      { 'name': 'Expiration Date', 'property': 'expirationDate' }
    ];
  }
}
