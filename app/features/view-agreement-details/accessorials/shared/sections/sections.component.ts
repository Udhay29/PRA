import { Component, ChangeDetectorRef, Input, OnDestroy, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

import { takeWhile } from 'rxjs/operators';
import * as moment from 'moment';
import * as utils from 'lodash';
import { Message } from 'primeng/components/common/api';

import { SectionsModel } from './model/sections-model';
import { SectionsService } from './services/sections.service';
import { SectionsGridResponseInterface } from './model/sections-interface';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})

export class SectionsComponent implements OnInit, OnDestroy {
  sectionsModel: SectionsModel;
  effectiveDocumentDate: string;
  expirationDocumentDate: string;
  msgs: Message[] = [];
  multiSortMeta = [];
  @Input()
  set isEditAccessorialRateClicked(isEditAccessorialRateClicked: boolean) {
    this.sectionsModel.isEditRateClicked = isEditAccessorialRateClicked;
  }
  @Input()
  set isEditAccessorialRuleClicked(isEditAccessorialRuleClicked: boolean) {
    this.sectionsModel.isEditRuleClicked = isEditAccessorialRuleClicked;
  }
  @Input()
  set editContractValues(editContractResponse: SectionsGridResponseInterface[]) {
    if (editContractResponse) {
      editContractResponse.forEach((eachEditContractResp: SectionsGridResponseInterface) => {
        this.sectionsModel.selectedSectionInEdit.push(eachEditContractResp);
      });
    }
  }
  @Input()
  set effectiveDate(value: string) {
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
  set expirationDate(value: string) {
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
      this.sectionsModel.isCurrencyValidationRequired = true;
      this.sectionsModel.selectedCurrency = value['label'];
      this.checkDateCurrency();
    }
  }
  @Input() agreementId: number;
  @Input() detailedViewFlag;
  @Input()
  set sectionDetail(value) {
    if (value) {
      this.fetchSectionsListDataFromView(value);
    }
  }
  constructor(
    private readonly sectionsService: SectionsService,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    this.sectionsModel = new SectionsModel();
  }
  @Input()
  set editSectionValues(editSectionResponse: SectionsGridResponseInterface[]) {
    if (editSectionResponse) {
      editSectionResponse.forEach((eactEditSectionRes: SectionsGridResponseInterface) => {
        this.sectionsModel.selectedSectionInEdit.push(eactEditSectionRes);
      });
    }
  }
  @Output() SectionChecked: EventEmitter<boolean> = new EventEmitter();
  @Output() rowChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() sectionData: EventEmitter<SectionsGridResponseInterface[]> = new EventEmitter<SectionsGridResponseInterface[]>();
  @Output() isAceesorialEditInSection: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
    this.sectionsModel.isSubscriberFlag = true;
    this.sectionsModel.filteredValuesLength = 5;
    if (!this.detailedViewFlag) {
      this.getData();
    }
  }
  ngOnDestroy() {
    this.sectionsModel.isSubscriberFlag = false;
  }
  getData() {
    this.sectionsModel.loading = true;
    this.sectionsModel.selectedSection = [];
    this.effectiveDocumentDate = this.dateFormatter(this.effectiveDocumentDate);
    this.expirationDocumentDate = this.dateFormatter(this.expirationDocumentDate);
    this.sectionsService.getSectionGridData(this.agreementId).pipe(takeWhile(() =>
      this.sectionsModel.isSubscriberFlag)).subscribe((data: Array<any>) => {
        this.sectionsModel.loading = false;
        this.loadContractList(data);
      });
  }
  dateFormatter(value: string | Date): string {
    return moment(value).format('YYYY-MM-DD');
  }
  contractDateFormatter(value: string | Date): string {
    return moment(value).format('MM/DD/YYYY');
  }
  loadContractList(data: Array<SectionsGridResponseInterface>) {
    const resultset = [];
    data.forEach((sectionDetail: SectionsGridResponseInterface) => {
      sectionDetail['effectiveDate'] = this.contractDateFormatter(sectionDetail['effectiveDate']);
      sectionDetail['expirationDate'] = this.contractDateFormatter(sectionDetail['expirationDate']);
      sectionDetail['currencyCode'] = sectionDetail.currencyCode;
      this.effectiveDocumentDate = this.contractDateFormatter(this.effectiveDocumentDate);
      this.expirationDocumentDate = this.contractDateFormatter(this.expirationDocumentDate);
      const contracteffectiveDate = this.forCheckDate(sectionDetail['effectiveDate']).setHours(0, 0, 0, 0);
      const contractexpirationDate = this.forCheckDate(sectionDetail['expirationDate']).setHours(0, 0, 0, 0);
      const agreementeffectiveDate = this.forCheckDate(this.effectiveDocumentDate).setHours(0, 0, 0, 0);
      const agreementexpirationDate = this.forCheckDate(this.expirationDocumentDate).setHours(0, 0, 0, 0);
      const isDateMismatch = !(agreementeffectiveDate >= contracteffectiveDate
        && agreementexpirationDate <= contractexpirationDate);
        let isInvalidCurrency = false;
        if (this.sectionsModel.isCurrencyValidationRequired) {
          isInvalidCurrency = sectionDetail['currencyCode'] !== null
          && sectionDetail['currencyCode'] !== this.sectionsModel.selectedCurrency;
        }
        this.resetInvalidFlags(sectionDetail);
        if (isDateMismatch) {
          sectionDetail['status'] = 'Inactive';
          sectionDetail['dateMismatchFlag'] = true;
        }
        if (isInvalidCurrency) {
          sectionDetail['status'] = 'Inactive';
          sectionDetail['InvalidCurrecyFlag'] = true;
        }
        if (!isInvalidCurrency && !isDateMismatch) {
          sectionDetail['status'] = 'Active';
        }
        resultset.push(sectionDetail);
        sectionDetail.isChecked = false;
      });
    if (!utils.isEmpty(data)) {
      this.multiSortMeta.push({ field: 'status', order: 1 });
      this.multiSortMeta.push({ field: 'customerAgreementContractSectionName', order: 1 });
      this.sectionsModel.accessorialGridValue = resultset;
    }
    this.sectionsModel.filteredValuesLength = data.length;
    this.sectionsModel.accessorialGridValue = data;
    if (this.sectionsModel.isEditRateClicked || this.sectionsModel.isEditRuleClicked) {
      this.setEditSelectedSectionData();
    }
    this.sectionData.emit(this.sectionsModel.selectedSection);
    this.changeDetector.detectChanges();
  }
  setEditSelectedSectionData() {
    if (this.sectionsModel.selectedSectionInEdit.length) {
      this.sectionsModel.accessorialGridValue.forEach((eachSection: SectionsGridResponseInterface) => {
        this.sectionsModel.selectedSectionInEdit.forEach((eachEditContract: SectionsGridResponseInterface) => {
          if (eachSection.customerAgreementContractSectionID === eachEditContract.customerAgreementContractSectionID) {
            this.sectionsModel.selectedSection.push(eachSection);
          }
        });
      });
    }
  }
  onFilter(length: number) {
    this.sectionsModel.filteredValuesLength = length;
  }
  selectAllContractList(isSelectAllChecked: boolean) {
    utils.map(this.sectionsModel.accessorialGridValue, (contract) => {
      contract.isChecked = isSelectAllChecked;
    });
  }

  forCheckDate(date) {
    return new Date(date);
  }
  resetInvalidFlags(sectionValue) {
    if (sectionValue['InvalidCurrecyFlag']) {
      sectionValue['InvalidCurrecyFlag'] = false;
    }
    if (sectionValue['dateMismatchFlag']) {
      sectionValue['dateMismatchFlag'] = false;
    }
  }
  checkDateCurrency() {
    this.sectionsModel.accessorialGridValue.forEach((data) => {
      const contracteffectiveDate = this.forCheckDate(data['effectiveDate']);
      const contractexpirationDate = this.forCheckDate(data['expirationDate']);
      const agreementeffectiveDate = this.forCheckDate(this.effectiveDocumentDate);
      const agreementexpirationDate = this.forCheckDate(this.expirationDocumentDate);
      const isDateMismatch = !(agreementeffectiveDate.getTime() >= contracteffectiveDate.getTime()
      && agreementexpirationDate.getTime() <= contractexpirationDate.getTime());
      let isCurrencyMismatch = false;
      if (this.sectionsModel.isCurrencyValidationRequired) {
        isCurrencyMismatch = data['currencyCode'] !== null && data['currencyCode'] !== this.sectionsModel.selectedCurrency;
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
    this.multiSortMeta.push({ field: 'customerAgreementContractSectionName', order: 1 });
    this.changeDetector.detectChanges();
  }

  onRowSelect(rowCheckEvent) {
    const sectionValue = rowCheckEvent['data'];
    const index = this.sectionsModel.selectedSection.findIndex(value =>
      (value['status'] === 'Inactive') &&
      value['customerAgreementContractSectionID'] === rowCheckEvent['data']['customerAgreementContractSectionID']);
    if (index !== -1) {
      this.sectionsModel.selectedSection.splice(index, 1);
      this.msgs = [];
      if (sectionValue['dateMismatchFlag']) {
        this.selectionGrowlMSg(false);
      }
      if (sectionValue['InvalidCurrecyFlag']) {
        this.invalidCurrencyMsg([sectionValue['customerAgreementContractSectionName']], false);
      }
    } else {
      this.sectionData.emit(this.sectionsModel.selectedSection);
      this.rowChange.emit();
      this.isAceesorialEditInSection.emit(false);
    }
    this.sectionsModel.dataSelected = this.sectionsModel.selectedSection;
  }
  onHeaderCheckboxToggle() {
    const dataWithId = utils.filter(this.sectionsModel.accessorialGridValue,
    (data1) => data1['status'] === 'Active');
    const dateMismatchSections = utils.filter(this.sectionsModel.accessorialGridValue,
      (sectionValue) => {
        if (sectionValue['dateMismatchFlag']) {
          return sectionValue;
        }
    });
    const invalidCurrencySectionNames = [];
    this.sectionsModel.accessorialGridValue.forEach((sectionValue) => {
      if (sectionValue['InvalidCurrecyFlag']) {
         invalidCurrencySectionNames.push(sectionValue['customerAgreementContractSectionName']);
      }
    });
    this.changeDetector.detectChanges();
    if (dataWithId.length === 0 && this.sectionsModel.accessorialGridValue.length !== this.sectionsModel.dataSelected.length) {
      this.showInvalidSelectionErrMsg(dateMismatchSections, invalidCurrencySectionNames);
    }
    if (dataWithId.length === this.sectionsModel.dataSelected.length ||
       this.sectionsModel.accessorialGridValue.length === this.sectionsModel.dataSelected.length) {
      this.sectionsModel.selectedSection = [];
      this.sectionsModel.dataSelected = [];
    } else {
      this.showInvalidSelectionErrMsg(dateMismatchSections, invalidCurrencySectionNames);
      this.sectionsModel.selectedSection = dataWithId;
      this.sectionsModel.dataSelected = this.sectionsModel.selectedSection;
    }
    this.sectionData.emit(this.sectionsModel.selectedSection);
    this.rowChange.emit();
    this.isAceesorialEditInSection.emit(false);
  }
  onRowUnselect(rowUnCheckEvent) {
    this.checkDateCurrency();
    const index = this.sectionsModel.selectedSection.findIndex(value =>
      value['customerAgreementContractSectionID'] === rowUnCheckEvent['data']['customerAgreementContractSectionID']);
    if (index !== -1) {
      this.sectionsModel.selectedSection.splice(index, 1);
    }
    this.rowChange.emit();
    this.sectionData.emit(this.sectionsModel.selectedSection);
    this.isAceesorialEditInSection.emit(false);
    this.sectionsModel.dataSelected = this.sectionsModel.selectedSection;
  }

  onSort(event) {
    if (event.multisortmeta.length && event.multisortmeta[0].field && event.multisortmeta[0].order && event.multisortmeta.length === 1) {
      this.multiSortMeta = [];
      this.multiSortMeta.push({ field: 'status', order: 1 });
      this.multiSortMeta.push({ field: event.multisortmeta[0].field, order: event.multisortmeta[0].order });
    }
  }
  showInvalidSelectionErrMsg(dateMismatchSections, invalidCurrencySectionNames) {
    this.msgs = [];
    if (dateMismatchSections.length) {
      this.selectionGrowlMSg(false);
    }
    if (invalidCurrencySectionNames.length) {
      this.invalidCurrencyMsg(invalidCurrencySectionNames, false);
    }
  }
  selectionGrowlMSg(clearPrevMessages= true) {
    if (clearPrevMessages) {
      this.msgs = [];
    }
    this.msgs.push({
      severity: 'error', summary: 'Date Range Mismatch',
      detail: 'Any section outside the dates cannot be selected. Please update the dates and select.'
    });
  }
  invalidCurrencyMsg(sectionNames, clearPrevMessages= true) {
    if (clearPrevMessages) {
      this.msgs = [];
    }
    const invalidSectionNames = sectionNames.toString().replace(/[,]/gi, ', ');
    this.msgs.push({
      severity: 'error', summary: 'Section Currency Mismatch',
      detail: `Sections have conflicting currencies defined; conflict section(s) ${invalidSectionNames}.`
    });
  }
  fetchSectionsListDataFromView(sectionDetail) {
    this.loadContractList(sectionDetail);
  }
}

