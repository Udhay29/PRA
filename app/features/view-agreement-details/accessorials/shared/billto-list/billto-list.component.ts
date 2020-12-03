import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  OnDestroy, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter
} from '@angular/core';
import { Message } from 'primeng/components/common/api';

import { BillToModel } from './model/bill-to.model';
import { BillToValueInterface, BillToParams, SectionData } from './model/bill-to.interface';
import { BilltoListService } from './service/billto-list.service';

import { takeWhile, finalize } from 'rxjs/operators';
import * as moment from 'moment';
import * as utils from 'lodash';
import { EditBillToValueInterface } from '../../rates/create-rates/model/create-rates.interface';


@Component({
  selector: 'app-billto-list',
  templateUrl: './billto-list.component.html',
  styleUrls: ['./billto-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BilltoListComponent implements OnInit {
  msgs: Message[] = [];
  multiSortMeta = [];

  @Input() agreementId;
  @Input()
  set isEditAccessorialRateClicked(isEditAccessorialRateClicked: boolean) {
    this.billToModel.isEditRateClicked = isEditAccessorialRateClicked;
  }
  @Input()
  set isEditAccessorialRuleClicked(isEditAccessorialRuleClicked: boolean) {
    this.billToModel.isEditRuleClicked = isEditAccessorialRuleClicked;
  }
  @Input()
  set rateType(value) {
    if (value) {
      this.billToModel.filteredValuesLength = 0;
      this.billToModel.selectedRateType = value;
      this.billToModel.billToGridValues = [];
      this.billToModel.billToSearchValue = '';
      this.bilToTable.reset();
      this.loadDetails();
    }
  }
  @Input()
  set contractValue(value) {
    if (value) {
      this.billToModel.selectedContractValue = value;
      this.loadBillToDetails();
    }
  }
  @Input()
  set sectionValue(value) {
    if (value) {
      this.billToModel.selectedSectionValue = value;
      this.loadBillToDetails();
    }
  }
  @Input()
  set effectiveDate(value) {
    if (value) {
      this.billToModel.effectiveDate = this.dateFormatter(value);
      this.checkDate();
    }
  }
  @Input()
  set expirationDate(value) {
    if (value) {
      this.billToModel.expirationDate = this.dateFormatter(value);
      this.checkDate();
    }
  }
  @Input()
  set editBillToValues(editBillToResponse: EditBillToValueInterface[]) {
    if (editBillToResponse) {
      editBillToResponse.forEach((eactEditBilToRes: EditBillToValueInterface) => {
        this.billToModel.selectedBillToInEdit.push(eactEditBilToRes);
      });
    }
  }
  @Input() detailedViewFlag;
  @Input()
  set billToDetailsFromView(value) {
    if (value) {
      this.fetchBillToListDataFromView(value);
      this.billToModel.isDocumentsDetailedView = true;
      this.changeDetector.detectChanges();
    }
  }
  @Output() rowChange: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('bilToTable') bilToTable: any;
  @Output() isAceesorialEditInBillTo: EventEmitter<boolean> = new EventEmitter<boolean>();

  billToModel: BillToModel;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly billToService: BilltoListService) {
    this.billToModel = new BillToModel();
  }
  ngOnInit() {
    if (!this.detailedViewFlag) {
      this.billToModel.filteredValuesLength = 0;
    }
  }
  loadDetails() {
    if (this.billToModel.selectedRateType.toLowerCase() === 'agreement') {
      this.billToModel.billToSectionEmptyValue = false;
      this.billToModel.billToContractEmptyValue = false;
      this.loadBillToDetails();
    }
  }
  loadBillToDetails() {
    this.billToModel.billToGridValues = [];
    this.billToModel.selectedBillTo = [];
    const params = this.billToParamsFramer();
    if (!utils.isEmpty(params)) {
      this.billToModel.loading = true;
      this.billToService.loadBillToData(params).pipe(takeWhile(() => this.billToModel.subscribeFlag))
        .subscribe((rateSetUp: BillToValueInterface[]) => {
          this.loadBillToGrid(rateSetUp);
          this.changeDetector.detectChanges();
        }, (agreementLevelError: Error) => {
          this.billToModel.loading = false;
          this.changeDetector.detectChanges();
        });
    }
  }
  loadBillToGrid(rateSetUp) {
    this.billToModel.filteredValuesLength = rateSetUp.length;
    if (rateSetUp.length) {
      rateSetUp.forEach((billToValues) => {
        billToValues['billToDetails'] = this.setBillToDetails(billToValues);
        billToValues['customerContractName'] = `${billToValues['contractNumber']} (${billToValues['customerContractName']})`;
        billToValues['effectiveDate'] = this.contractDateFormatter(billToValues['effectiveDate']);
        billToValues['expirationDate'] = this.contractDateFormatter(billToValues['expirationDate']);
        this.billToModel.effectiveDate = this.contractDateFormatter(this.billToModel.effectiveDate);
        this.billToModel.expirationDate = this.contractDateFormatter(this.billToModel.expirationDate);
        const contracteffectiveDate = this.forCheckDate(billToValues['effectiveDate']).setHours(0, 0, 0, 0);
        const contractexpirationDate = this.forCheckDate(billToValues['expirationDate']).setHours(0, 0, 0, 0);
        const agreementeffectiveDate = this.forCheckDate(this.billToModel.effectiveDate).setHours(0, 0, 0, 0);
        const agreementexpirationDate = this.forCheckDate(this.billToModel.expirationDate).setHours(0, 0, 0, 0);
        if (agreementeffectiveDate >= contracteffectiveDate
          && agreementexpirationDate <= contractexpirationDate) {
          billToValues['status'] = 'Active';
        } else {
          billToValues['status'] = 'Inactive';
        }
      });
      this.multiSortMeta.push({ field: 'status', order: 1 });
      this.multiSortMeta.push({ field: 'billToDetails', order: 1 });
      this.billToModel.billToGridValues = rateSetUp;
    }
    if (this.billToModel.isEditRateClicked || this.billToModel.isEditRuleClicked) {
      this.setEditSelectedBillToData();
    }
    this.billToModel.loading = false;
    this.changeDetector.detectChanges();
  }
  setEditSelectedBillToData() {
    if (this.billToModel.selectedBillToInEdit.length) {
      this.billToModel.billToGridValues.forEach((eachBillTo: BillToValueInterface) => {
        this.billToModel.selectedBillToInEdit.forEach((eachEditBillTo: EditBillToValueInterface) => {
          if (eachEditBillTo.customerAgreementContractSectionAccountID === eachBillTo.customerAgreementContractSectionAccountID) {
            this.billToModel.selectedBillTo.push(eachBillTo);
          }
        });
      });
    }
  }
  setBillToDetails(billToValues) {
    if (billToValues['billToDetailsDTO']) {
      return `${billToValues['billToDetailsDTO']['billToName']} (${billToValues['billToDetailsDTO']['billToCode']})`;
    } else {
      return `${billToValues['billToName']} (${billToValues['billToCode']})`;
    }
  }
  checkDate() {
    this.billToModel.billToGridValues.forEach((data) => {
      const contracteffectiveDate = this.forCheckDate(data['effectiveDate']);
      const contractexpirationDate = this.forCheckDate(data['expirationDate']);
      const agreementeffectiveDate = this.forCheckDate(this.billToModel.effectiveDate);
      const agreementexpirationDate = this.forCheckDate(this.billToModel.expirationDate);
      if (agreementeffectiveDate.getTime() >= contracteffectiveDate.getTime()
        && agreementexpirationDate.getTime() <= contractexpirationDate.getTime()) {
        data['status'] = 'Active';
      } else {
        data['status'] = 'Inactive';
      }
    });
    this.multiSortMeta = [];
    this.multiSortMeta.push({ field: 'status', order: 1 });
    this.multiSortMeta.push({ field: 'billToDetails', order: 1 });
    this.changeDetector.detectChanges();
  }
  billToParamsFramer(): BillToParams {
    let params;
    switch (this.billToModel.selectedRateType) {
      case 'Agreement':
        params = {
          customerAgreementID: this.agreementId,
          customerAgreementContractIds: null,
          customerAgreementContractSectionIds: null,
          effectiveDate: null,
          expirationDate: null
        };
        break;
      case 'contract':
        const contractIdValues = this.iterateContractDetails();
        params = {
          customerAgreementID: (contractIdValues.length) ? this.agreementId : null,
          customerAgreementContractIds: (contractIdValues.length) ? contractIdValues : null,
          customerAgreementContractSectionIds: null,
          effectiveDate: null,
          expirationDate: null
        };
        this.billToModel.billToSectionEmptyValue = false;
        this.billToModel.billToContractEmptyValue = (contractIdValues.length) ? false : true;
        this.changeDetector.detectChanges();
        break;
      case 'section':
        params = this.sectionParamFramer();
        this.changeDetector.detectChanges();
        break;
    }
    return params;
  }
  sectionParamFramer(): BillToParams {
    const sectionIdValues = this.iterateSectionDetails();
    let params;
    this.validateValues(sectionIdValues[0], 'contractIds');
    params = {
      customerAgreementID: (sectionIdValues[0] && sectionIdValues[0]['contractIds'].length) ? this.agreementId : null,
      customerAgreementContractIds:
        (sectionIdValues[0] && sectionIdValues[0]['contractIds'].length) ? sectionIdValues[0]['contractIds'] : null,
      customerAgreementContractSectionIds:
        (sectionIdValues[0] && sectionIdValues[0]['sectionIds'].length) ? sectionIdValues[0]['sectionIds'] : null,
      effectiveDate: null,
      expirationDate: null
    };
    this.billToModel.billToContractEmptyValue = false;
    this.billToModel.billToSectionEmptyValue = this.validateValues(sectionIdValues[0], 'contractIds');
    this.changeDetector.detectChanges();
    return params;
  }
  validateValues(sectionIdValues: SectionData, field: string): boolean {
    let isfieldValue;
    if (sectionIdValues && sectionIdValues[field].length) {
      isfieldValue = false;
    } else {
      isfieldValue = true;
    }
    return isfieldValue;
  }
  iterateContractDetails(): number[] {
    const contractIds = [];
    if (this.billToModel.selectedContractValue && this.billToModel.selectedContractValue.length) {
      this.billToModel.selectedContractValue.forEach(selectedContractElement => {
        contractIds.push(selectedContractElement['customerAgreementContractID']);
      });
    }
    return contractIds;
  }
  iterateSectionDetails(): SectionData[] {
    const selectedRowIds = [];
    const sectionIds = [];
    const contractIds = [];
    if (this.billToModel.selectedSectionValue && this.billToModel.selectedSectionValue.length) {
      this.billToModel.selectedSectionValue.forEach(selectedSectionElement => {
        sectionIds.push(selectedSectionElement['customerAgreementContractSectionID']);
        contractIds.push(selectedSectionElement['customerAgreementContractID']);
      });
      const selectedObj = {
        'sectionIds': sectionIds,
        'contractIds': contractIds
      };
      selectedRowIds.push(selectedObj);
    }
    return selectedRowIds;
  }
  onRowSelect(event) {
    let rowValue = this.billToModel.selectedBillTo;
    const dataPresent = this.billToModel.billToGridValues.find(item =>
      item === event['data']);
    if (dataPresent) {
      rowValue.push(event['data']);
      rowValue = utils.uniq(rowValue);
      this.billToModel.selectedBillTo = rowValue;
      this.rowChange.emit();
      this.isAceesorialEditInBillTo.emit(false);
      this.changeDetector.detectChanges();
    }
    const index = this.billToModel.selectedBillTo.findIndex(value =>
      (value['status'] === 'Inactive') &&
      value['customerAgreementContractSectionAccountID'] === event['data']['customerAgreementContractSectionAccountID']);
    if (index !== -1) {
      this.billToModel.selectedBillTo.splice(index, 1);
      this.selectionGrowlMSg();
    }
    this.billToModel.dataSelected = this.billToModel.selectedBillTo;
  }
  onSort(event) {
    if (event.multisortmeta.length && event.multisortmeta[0].field && event.multisortmeta[0].order && event.multisortmeta.length === 1) {
      this.multiSortMeta = [];
      this.multiSortMeta.push({ field: 'status', order: 1 });
      this.multiSortMeta.push({ field: event.multisortmeta[0].field, order: event.multisortmeta[0].order });
    }
  }

  selectionGrowlMSg() {
    this.msgs = [];
    this.msgs.push({
      severity: 'error', summary: 'Date Range Mismatch',
      detail: 'Any bill to account outside the dates cannot be selected. Please update the dates and select.'
    });
  }
  onHeaderCheckboxToggle() {
    this.changeDetector.detectChanges();
    const dataWithId = utils.filter(this.billToModel.billToGridValues,
      (data1) => data1['status'] === 'Active');
    if (dataWithId.length === 0) {
      this.selectionGrowlMSg();
    }
    if (dataWithId.length === this.billToModel.dataSelected.length) {
      this.billToModel.selectedBillTo = [];
      this.billToModel.dataSelected = [];
    } else {
      if (dataWithId.length !== this.billToModel.selectedBillTo.length) {
        this.selectionGrowlMSg();
      }
      this.billToModel.selectedBillTo = dataWithId;
      this.billToModel.dataSelected = this.billToModel.selectedBillTo;
    }
    this.rowChange.emit();
    this.isAceesorialEditInBillTo.emit(false);
  }
  onFilter(length: number) {
    this.billToModel.filteredValuesLength = length;
  }
  onRowUnselect(rowUnCheckEvent) {
    const index = this.billToModel.selectedBillTo.findIndex(value =>
      value['customerAgreementContractSectionAccountID'] === rowUnCheckEvent['data']['customerAgreementContractSectionAccountID']);
    if (index !== -1) {
      this.billToModel.selectedBillTo.splice(index, 1);
    }
    this.rowChange.emit();
    this.isAceesorialEditInBillTo.emit(false);
    this.changeDetector.detectChanges();
    this.billToModel.dataSelected = this.billToModel.selectedBillTo;
  }
  dateFormatter(value: string): string {
    return moment(value).format('YYYY-MM-DD');
  }
  forCheckDate(date) {
    return new Date(date);
  }
  contractDateFormatter(value: string | Date): string {
    return moment(value).format('MM/DD/YYYY');
  }
  fetchBillToListDataFromView(billToDetails) {
    this.loadBillToGrid(billToDetails);
  }
}
