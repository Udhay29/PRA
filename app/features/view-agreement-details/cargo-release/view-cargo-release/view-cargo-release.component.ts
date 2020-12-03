import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import * as moment from 'moment';
import { CargoReleaseModel } from '../model/cargo-release.model';
import { ViewCargoService } from './services/view-cargo.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-view-cargo-release',
  templateUrl: './view-cargo-release.component.html',
  styleUrls: ['./view-cargo-release.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewCargoReleaseComponent implements OnDestroy, OnInit {
  cargoReleaseModel: CargoReleaseModel;
  rowData: object;
  @Input() agreementID: number;
  @Input()
  set viewScreenData(value) {
    this.rowData = value;
    this.getCargoDetails();
  }

  @Output() closeClick: EventEmitter<String> = new EventEmitter<String>();

  constructor(
    private readonly viewService: ViewCargoService,
    private readonly changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.cargoReleaseModel = new CargoReleaseModel();
    this.cargoReleaseModel.buttonItems = [
      {
        label: 'Inactivate', command: () => {
          alert();
        }
      },
      {
        label: 'Delete', command: () => {
          alert();
        }
      }
    ];
  }
  ngOnDestroy() {
    this.cargoReleaseModel.subscribeFlag = false;
  }
  onClose(): void {
    this.closeClick.emit('close');
  }
  getCargoDetails() {
    if (this.agreementID) {
      const cargoType = this.rowData['cargoType'];
      const cargoId = this.rowData['customerAgreementCargoIDs'];
      this.viewService.getViewScreenData(this.agreementID,
        cargoId, cargoType).pipe(takeWhile(() =>
          this.cargoReleaseModel.subscribeFlag)).subscribe((data: any) => {
            if (data) {
              this.businessFormatter(data);
            }
            this.cargoReleaseModel.viewData = data;
            this.changeDetector.markForCheck();
          });
    }
  }
  businessFormatter(data) {
    const businessUnit = [];
    switch (this.rowData['cargoType']) {
      case 'AgreementBU':
        for (const value of data['customerAgreementBusinessUnitCargoList']) {
          businessUnit.push(value['financeBusinessUnitCode']);
          data['effectiveDate'] = this.dateFormatter(value['agreementBuEffectiveDate']);
          data['expirationDate'] = this.dateFormatter(value['agreementBuExpirationDate']);
          data['cargoAmount'] = this.amountFormatter(value['agreementBusinessUnitCargoAmount']);
          data['agreementDefault'] = 'No';
        }
        data['businessUnitData'] = businessUnit;
        data['originalEffectiveDate'] = this.dateFormatter(data['originalEffectiveDate']);
        data['originalExpirationDate'] = this.dateFormatter(data['originalExpirationDate']);
        data['createdDate'] = this.dateValidator(data['createdDate']);
        data['updatedDate'] = this.dateValidator(data['updatedDate']);
        break;
      case 'ContractBU':
        for (const value of data['customerContractBusinessUnitCargoList']) {
          businessUnit.push(value['financeBusinessUnitCode']);
          data['effectiveDate'] = this.dateFormatter(value['contractBuEffectiveDate']);
          data['expirationDate'] = this.dateFormatter(value['contractBuExpirationDate']);
          data['cargoAmount'] = this.amountFormatter(value['contractBusinessUnitCargoAmount']);
          data['agreementDefault'] = 'No';
        }
        data['businessUnitData'] = businessUnit;
        data['originalEffectiveDate'] = this.dateFormatter(data['originalEffectiveDate']);
        data['originalExpirationDate'] = this.dateFormatter(data['originalExpirationDate']);
        data['createdDate'] = this.dateValidator(data['createdDate']);
        data['updatedDate'] = this.dateValidator(data['updatedDate']);
        break;
      case 'SectionBU':
        for (const value of data['customerSectionBusinessUnitCargo']) {
          businessUnit.push(value['financeBusinessUnitCode']);
          data['effectiveDate'] = this.dateFormatter(value['sectionBuEffectiveDate']);
          data['expirationDate'] = this.dateFormatter(value['sectionBuExpirationDate']);
          data['cargoAmount'] = this.amountFormatter(value['sectionBusinessUnitCargoAmount']);
          data['agreementDefault'] = 'No';
        }
        data['businessUnitData'] = businessUnit;
        data['originalEffectiveDate'] = this.dateFormatter(data['originalEffectiveDate']);
        data['originalExpirationDate'] = this.dateFormatter(data['originalExpirationDate']);
        data['createdDate'] = this.dateValidator(data['createdDate']);
        data['updatedDate'] = this.dateValidator(data['updatedDate']);
        data['customerContractName'] = null;
        break;
      case 'Section':
        data['effectiveDate'] = this.dateFormatter(data['effectiveDate']);
        data['expirationDate'] = this.dateFormatter(data['expirationDate']);
        data['originalEffectiveDate'] = this.dateFormatter(data['originalEffectiveDate']);
        data['originalExpirationDate'] = this.dateFormatter(data['originalExpirationDate']);
        data['createdDate'] = this.dateValidator(data['createdDate']);
        data['updatedDate'] = this.dateValidator(data['updatedDate']);
        data['cargoAmount'] = this.amountFormatter(data['cargoAmount']);
        data['customerContractName'] = null;
        break;
      case 'Agreement':
      case 'Contract':
        data['effectiveDate'] = this.dateFormatter(data['effectiveDate']);
        data['expirationDate'] = this.dateFormatter(data['expirationDate']);
        data['originalEffectiveDate'] = this.dateFormatter(data['originalEffectiveDate']);
        data['originalExpirationDate'] = this.dateFormatter(data['originalExpirationDate']);
        data['createdDate'] = this.dateValidator(data['createdDate']);
        data['updatedDate'] = this.dateValidator(data['updatedDate']);
        data['cargoAmount'] = this.amountFormatter(data['cargoAmount']);
        break;
    }
  }
  dateFormatter(value: string): string {
    return moment(value).format('MM/DD/YYYY');
  }
  amountFormatter(amount: string): string {
    let cargoAmountValue;
    if (amount) {
      const value = amount.toLocaleString();
      if (value.includes('.')) {
        cargoAmountValue = value;
      } else {
        const dataVal = `${value}${'.00'}`;
        cargoAmountValue = dataVal;
      }
    }
    return cargoAmountValue;
  }
  dateValidator(date): string {
    if (date) {
      const dateVal = date.split('T');
      return moment(dateVal[0]).format('MM/DD/YYYY');
    }
  }

}
