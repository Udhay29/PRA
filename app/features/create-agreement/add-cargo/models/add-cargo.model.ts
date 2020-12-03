import { AgreementDetails, Columns, CargoDetailListItem } from './add-cargo-interface';

export class AddCargoModel {
  isSplitView: boolean;
  isCargoDelete: boolean;
  isDefault: boolean;
  isDelete: boolean;
  isSubscribe: boolean;
  checkedbox: boolean;
  pageLoader: boolean;
  isCancel: boolean;
  isAgreementCancel: boolean;
  agreementId: AgreementDetails;
  screen: string;
  deletedCargoList: Array<CargoDetailListItem>;
  rowValue: Array<CargoDetailListItem>;
  routeUrl: string;
  cargoList: Array<CargoDetailListItem>;
  tableColumns: Array<Columns>;
  selectedCargoList: Array<CargoDetailListItem>;
  confirmDialog: boolean;
  index: number;

  constructor() {
    this.index = 0;
    this.isSplitView = false;
    this.confirmDialog = false;
    this.isCargoDelete = false;
    this.isDefault = false;
    this.isDelete = false;
    this.isSubscribe = true;
    this.cargoList = [];
    this.selectedCargoList = [];
    this.deletedCargoList = [];
    this.tableColumns = [
      { label: 'Cargo Release', field: 'cargoAmount', arrayBased: false },
      { label: 'Agreement Default', field: 'agreementDefaultIndicator', arrayBased: false },
      { label: 'Contract', field: 'customerContractName', arrayBased: false },
      { label: 'Business Unit', field: 'businessUnitCode', arrayBased: true },
      { label: 'Section', field: 'customerSectionName', arrayBased: false },
      { label: 'Effective Date', field: 'effectiveDate', arrayBased: false },
      { label: 'Expiration Date', field: 'expirationDate', arrayBased: false }];
  }
}
