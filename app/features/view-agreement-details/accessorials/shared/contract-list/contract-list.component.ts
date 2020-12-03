import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';

import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';


import { takeWhile, findIndex } from 'rxjs/operators';
import * as utils from 'lodash';
import * as moment from 'moment';

import { ContractListModel } from '../contract-list/model/contract-list.model';
import { ContractListService } from '../contract-list/service/contract-list.service';
import { ContractTypesItemInterface } from '../contract-list/model/contract-list.interface';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ContractListComponent implements OnInit, OnDestroy {
  contractListModel: ContractListModel;
  effectiveDocumentDate: string;
  expirationDocumentDate: string;
  msgs: Message[] = [];
  multiSortMeta = [];

  @Output() contractChecked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() rowChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() isAceesorialEditInContract: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  set isEditAccessorialRateClicked(isEditAccessorialRateClicked: boolean) {
    this.contractListModel.isEditRateClicked = isEditAccessorialRateClicked;
  }
  @Input()
  set isEditAccessorialRuleClicked(isEditAccessorialRuleClicked: boolean) {
    this.contractListModel.isEditRuleClicked = isEditAccessorialRuleClicked;
  }
  @Input()
  set effectiveDate(value) {
    if (value) {
      if (this.effectiveDocumentDate) {
        this.effectiveDocumentDate = value;
        this.checkDateCurrency();
      } else {
        this.effectiveDocumentDate = value;

      }
    }
  }
  @Input()
  set expirationDate(value) {
    if (value) {
      if (this.expirationDocumentDate) {
        this.expirationDocumentDate = value;
        this.checkDateCurrency();

      } else {
        this.expirationDocumentDate = value;
      }
    }
  }
  @Input()
  set selectedCurrency(value) {
    if (value) {
      this.contractListModel.isCurrencyValidationRequired = true;
      this.contractListModel.selectedCurrency = value['label'];
      this.checkDateCurrency();
    }
  }
  @Input()
  set editContractValues(editContractResponse: ContractTypesItemInterface[]) {
    if (editContractResponse) {
      editContractResponse.forEach((eachEditContractResp: ContractTypesItemInterface) => {
        this.contractListModel.selectedContractInEdit.push(eachEditContractResp);
      });
    }
  }
  @Input() agreementId;
  @Input() detailedViewFlag;
  @Input()
  set contractDetail(value) {
    if (value) {
      this.fetchContractsListDataFromView(value);
    }
  }
  @Output() contractData: EventEmitter<ContractTypesItemInterface[]> = new EventEmitter<ContractTypesItemInterface[]>();

  constructor(
    private readonly contractService: ContractListService,
    private readonly messageService: MessageService,
    private readonly changeDetector: ChangeDetectorRef) {
    this.contractListModel = new ContractListModel();
  }

  ngOnInit() {
    if (!this.detailedViewFlag) {
      this.getContractsListData();
    }
  }
  ngOnDestroy() {
    this.contractListModel.isSubscriberFlag = false;
  }
  getContractsListData() {
    this.contractListModel.contractList = [];
    this.contractListModel.selectedContract = [];
    this.effectiveDocumentDate = this.dateFormatter(this.effectiveDocumentDate);
    this.expirationDocumentDate = this.dateFormatter(this.expirationDocumentDate);
    this.contractListModel.loading = true;
    this.contractService.getContactDetails(this.agreementId)
      .pipe(takeWhile(() => this.contractListModel.isSubscriberFlag))
      .subscribe((data: Array<any>) => {
        this.contractListModel.loading = false;
        this.loadContractList(data);
        this.changeDetector.detectChanges();
      }, (contractError: Error) => {
        this.contractListModel.loading = false;
        if (contractError && contractError['error'] && contractError['error']['errors']) {
          this.toastMessage(this.messageService, 'error', 'Error', contractError['error']['errors'][0]['errorMessage']);
        }
        this.changeDetector.detectChanges();
      });
  }
  dateFormatter(value: string | Date): string {
    return moment(value).format('YYYY-MM-DD');
  }
  contractDateFormatter(value: string | Date): string {
    return moment(value).format('MM/DD/YYYY');
  }
  forCheckDate(date) {
    return new Date(date);
  }
  loadContractList(data: Array<any>) {
    const resultset = [];
    data.forEach((contractDetail: ContractTypesItemInterface) => {
      if (contractDetail['contractTypeName'] === 'Transactional') {
        contractDetail['contractName'] =
        `${contractDetail.contractTypeName} (${contractDetail.customerContractName})`;
      } else {
        contractDetail['contractName'] =
        `${contractDetail.customerContractNumber} (${contractDetail.customerContractName})`;
      }
      contractDetail.isChecked = false;
      this.changeStatusContracts(contractDetail);
      resultset.push(contractDetail);
    });
    if (!utils.isEmpty(data)) {
      this.multiSortMeta.push({ field: 'status', order: 1 });
      this.multiSortMeta.push({ field: 'contractName', order: 1 });
      this.contractListModel.contractList = resultset;
    }
    this.contractListModel.filteredValuesLength = this.contractListModel.contractList.length;
    if (this.contractListModel.isEditRateClicked || this.contractListModel.isEditRuleClicked) {
      this.setEditSelectedContractData();
    }
    this.contractData.emit(this.contractListModel.selectedContract);
    this.changeDetector.detectChanges();
  }
  changeStatusContracts(contractDetail) {
    contractDetail['effectiveDate'] = this.contractDateFormatter(contractDetail['effectiveDate']);
    contractDetail['expirationDate'] = this.contractDateFormatter(contractDetail['expirationDate']);
    this.effectiveDocumentDate = this.contractDateFormatter(this.effectiveDocumentDate);
    this.expirationDocumentDate = this.contractDateFormatter(this.expirationDocumentDate);
    const contracteffectiveDate = this.forCheckDate(contractDetail['effectiveDate']).setHours(0, 0, 0, 0);
    const contractexpirationDate = this.forCheckDate(contractDetail['expirationDate']).setHours(0, 0, 0, 0);
    const agreementeffectiveDate = this.forCheckDate(this.effectiveDocumentDate).setHours(0, 0, 0, 0);
    const agreementexpirationDate = this.forCheckDate(this.expirationDocumentDate).setHours(0, 0, 0, 0);
    const isDateMismatch = !(agreementeffectiveDate >= contracteffectiveDate
      && agreementexpirationDate <= contractexpirationDate);
    let isInvalidCurrency = false;
    if (this.contractListModel.isCurrencyValidationRequired) {
      isInvalidCurrency = contractDetail['currencyCode'] !== null
      && contractDetail['currencyCode'] !== this.contractListModel.selectedCurrency;
    }
    this.resetInvalidFlags(contractDetail);
    if (isDateMismatch) {
      contractDetail['status'] = 'Inactive';
      contractDetail['dateMismatchFlag'] = true;
    }
    if (isInvalidCurrency) {
      contractDetail['status'] = 'Inactive';
      contractDetail['InvalidCurrecyFlag'] = true;
    }
    if (!isInvalidCurrency && !isDateMismatch) {
      contractDetail['status'] = 'Active';
    }
  }
  setEditSelectedContractData() {
    if (this.contractListModel.selectedContractInEdit.length) {
      this.contractListModel.contractList.forEach((eachContract: ContractTypesItemInterface) => {
        this.contractListModel.selectedContractInEdit.forEach((eachEditContract: ContractTypesItemInterface) => {
          if (eachContract.customerAgreementContractID === eachEditContract.customerAgreementContractID) {
            this.contractListModel.selectedContract.push(eachContract);
          }
        });
      });
    }
  }
  resetInvalidFlags(contractValue) {
    if (contractValue['InvalidCurrecyFlag']) {
      contractValue['InvalidCurrecyFlag'] = false;
    }
    if (contractValue['dateMismatchFlag']) {
      contractValue['dateMismatchFlag'] = false;
    }
  }
  checkDateCurrency() {
    this.contractListModel.contractList.forEach((data) => {
      const contracteffectiveDate = this.forCheckDate(data['effectiveDate']);
      const contractexpirationDate = this.forCheckDate(data['expirationDate']);
      const agreementeffectiveDate = this.forCheckDate(this.effectiveDocumentDate);
      const agreementexpirationDate = this.forCheckDate(this.expirationDocumentDate);
      const isDateMismatch = !(agreementeffectiveDate.getTime() >= contracteffectiveDate.getTime()
      && agreementexpirationDate.getTime() <= contractexpirationDate.getTime());
      let isCurrencyMismatch = false;
      if (this.contractListModel.isCurrencyValidationRequired) {
        isCurrencyMismatch = data['currencyCode'] !== null
        && data['currencyCode'] !== this.contractListModel.selectedCurrency;
      }
      this.resetInvalidFlags(data);
      if (isDateMismatch) {
        data['status'] = 'Inactive';
        data['dateMismatchFlag'] = true;
      }
      if (isCurrencyMismatch) {
        data['status'] = 'Inactive';
        data['InvalidCurrecyFlag'] = true;
      }
      if (!isCurrencyMismatch && !isDateMismatch) {
        data['status'] = 'Active';
      }
    });
    this.multiSortMeta = [];
    this.multiSortMeta.push({ field: 'status', order: 1 });
    this.multiSortMeta.push({ field: 'contractName', order: 1 });
    this.changeDetector.detectChanges();
  }
  toastMessage(messageService: MessageService, key: string, type: string, data: string) {
    const message = {
      severity: key,
      summary: type,
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
  onFilter(length: number) {
    this.contractListModel.filteredValuesLength = length;
  }
  onRowSelect(rowDataEvent) {
    const contractValue = rowDataEvent['data'];
    const index = this.contractListModel.selectedContract.findIndex(value =>
      (value['status'] === 'Inactive') && value['customerAgreementContractID'] === rowDataEvent['data']['customerAgreementContractID']);
    if (index !== -1) {
      this.contractListModel.selectedContract.splice(index, 1);
      this.msgs = [];
      if (contractValue['dateMismatchFlag']) {
        this.selectionGrowlMSg(false);
      }
      if (contractValue['InvalidCurrecyFlag']) {
        this.invalidCurrencyMsg([contractValue['contractName']], false);
      }
    } else {
      this.contractData.emit(this.contractListModel.selectedContract);
      this.rowChange.emit();
      this.isAceesorialEditInContract.emit(false);
    }
    this.contractListModel.dataSelected = this.contractListModel.selectedContract;
  }
  onHeaderCheckboxToggle() {
    const dataWithId = utils.filter(this.contractListModel.contractList,
      (data1) => data1['status'] === 'Active');
    const dateMismatchContracts = utils.filter(this.contractListModel.contractList,
      (contractValue) => {
        if (contractValue['dateMismatchFlag']) {
          return contractValue;
        }
    });
    const invalidCurrencyContractNames = [];
    this.contractListModel.contractList.forEach((contractValue) => {
      if (contractValue['InvalidCurrecyFlag']) {
         invalidCurrencyContractNames.push(contractValue['contractName']);
      }
    });
    this.changeDetector.detectChanges();
    if (dataWithId.length === 0 && this.contractListModel.contractList.length !== this.contractListModel.dataSelected.length) {
      this.showInvalidSelectionErrMsg(dateMismatchContracts, invalidCurrencyContractNames);
    }
    if (dataWithId.length === this.contractListModel.dataSelected.length ||
      this.contractListModel.contractList.length === this.contractListModel.dataSelected.length) {
      this.contractListModel.selectedContract = [];
      this.contractListModel.dataSelected = [];
    } else {
      this.showInvalidSelectionErrMsg(dateMismatchContracts, invalidCurrencyContractNames);
      this.contractListModel.selectedContract = dataWithId;
      this.contractListModel.dataSelected = this.contractListModel.selectedContract;
    }
    this.contractData.emit(this.contractListModel.selectedContract);
    this.rowChange.emit();
    this.isAceesorialEditInContract.emit(false);
  }
  onRowUnselect(rowDataEvent) {
    this.checkDateCurrency();
    const index = this.contractListModel.selectedContract.findIndex(value =>
      value['customerAgreementContractID'] === rowDataEvent['data']['customerAgreementContractID']);
    if (index !== -1) {
      this.contractListModel.selectedContract.splice(index, 1);
    }
    this.rowChange.emit();
    this.isAceesorialEditInContract.emit(false);
    this.contractData.emit(this.contractListModel.selectedContract);
    this.contractListModel.dataSelected = this.contractListModel.selectedContract;
  }

  onSort(event) {
    if (event.multisortmeta.length && event.multisortmeta[0].field && event.multisortmeta[0].order && event.multisortmeta.length === 1) {
      this.multiSortMeta = [];
      this.multiSortMeta.push({ field: 'status', order: 1 });
      this.multiSortMeta.push({ field: event.multisortmeta[0].field, order: event.multisortmeta[0].order });
    }
  }
  showInvalidSelectionErrMsg(dateMismatchContracts, invalidCurrencyContractNames) {
    this.msgs = [];
    if (dateMismatchContracts.length) {
      this.selectionGrowlMSg(false);
    }
    if (invalidCurrencyContractNames.length) {
      this.invalidCurrencyMsg(invalidCurrencyContractNames, false);
    }
  }
  selectionGrowlMSg(clearPrevMessages= true) {
    if (clearPrevMessages) {
      this.msgs = [];
    }
    this.msgs.push({
      severity: 'error', summary: 'Date Range Mismatch',
      detail: 'Any contract outside the dates cannot be selected. Please update the dates and select.'
    });
  }
  invalidCurrencyMsg(contarctNames, clearPrevMessages= true) {
    if (clearPrevMessages) {
      this.msgs = [];
    }
    const invalidSectionNames = contarctNames.toString().replace(/[,]/gi, ', ');
    this.msgs.push({
      severity: 'error', summary: 'Contract Currency Mismatch',
      detail: `Contracts have conflicting currencies defined; conflict contract(s) ${invalidSectionNames}.`
    });
  }
  fetchContractsListDataFromView(contractsDetail) {
    this.loadContractList(contractsDetail);
  }
}
