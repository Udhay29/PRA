import { AddCargoModel } from './../../../create-agreement/add-cargo/models/add-cargo.model';
import { isArray } from 'util';
import { MenuItem } from 'primeng/api';
import { TableColumnsInterface, LineHaulDetailsItem, CustomerAgreementNameConfigurationID, EditLineHaulData } from './line-haul.interface';
import { ReviewWizardStatus } from '../review/model/review.interface';
import { FormGroup } from '@angular/forms';

export class LineHaulModel {
  inactiveLHFlag: boolean;
  addLineHaulScreen: boolean;
  isDelete: boolean;
  isSubscribeFlag: boolean;
  loading: boolean;
  isLineHaulChecked: boolean;
  isAddLineHaul: boolean;
  isEmptyLineHaul: boolean;
  isLineHaulSearch: boolean;
  lineHaulSearchValue: string;
  isPaginatorFlag: boolean;
  isLineHaulDelete: boolean;
  pageStart: number;
  gridDataLength: number;
  tableSize: number;
  createdUser: string;
  selectedLineHaulConfigurationId: Array<number>;
  lineHaulList: Array<LineHaulDetailsItem>;
  gridListItems: Array<MenuItem>;
  menuItemList: Array<MenuItem>;
  selectedLineHaulData: Array<LineHaulDetailsItem>;
  tableColumns: Array<TableColumnsInterface>;
  subColumns: Array<TableColumnsInterface>;
  isTableDataLoading: boolean;
  hasChecked: boolean;
  inactivatePopup: boolean;
  lineHaulInactivateForm: FormGroup;
  showconformationPopup: boolean;
  priorEffDateFlag: boolean;
  priorExpDateFlag: boolean;
  canDeleteFlag: boolean;
  expDate: Date;
  maxDate: Date;
  preceedingEffDate: number;
  exceedingExpDate: number;
  canDeleteCount: number;
  dateFormat: string;
  customerAgreementData: CustomerAgreementNameConfigurationID;
  editLineHaulDetails: EditLineHaulData;
  reviewWizardStatus: ReviewWizardStatus;
  isReview: boolean;
  sortColumns: object;
  nestedColumns: object;
  rateName: string;

  constructor() {
    this.rateName = 'rates';
    this.addLineHaulScreen = false;
    this.isSubscribeFlag = true;
    this.isLineHaulChecked = false;
    this.isAddLineHaul = false;
    this.isLineHaulSearch = false;
    this.lineHaulSearchValue = '';
    this.isPaginatorFlag = false;
    this.isTableDataLoading = false;
    this.tableSize = 25;
    this.pageStart = 0;
    this.dateFormat = 'YYYY-MM-DD';
    this.gridListItems = [];
    this.lineHaulList = [];
    this.selectedLineHaulConfigurationId = [];
    this.selectedLineHaulData = [];
    this.tableColumns = [
      { label: 'Contract', field: 'contractName', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      { label: 'Section', field: 'sectionName', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      { label: 'Origin Point', field: 'originPoint', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      {
        label: 'Destination Point', field: 'destinationPoint', isArray: false, colspan: 1, rowspan: 2,
        isSubcolumn: false, isNotFirst: false
      },
      { label: 'Type', field: 'type', isArray: true, colspan: 1, rowspan: 1, isSubcolumn: true, isNotFirst: false },
      { label: 'Amount', field: 'amount', isArray: true, colspan: 1, rowspan: 1, isSubcolumn: true, isNotFirst: true },
      { label: 'Minimum', field: 'minimum', isArray: true, colspan: 1, rowspan: 1, isSubcolumn: true, isNotFirst: true },
      { label: 'Maximum', field: 'maximum', isArray: true, colspan: 1, rowspan: 1, isSubcolumn: true, isNotFirst: true },
      { label: 'Currency', field: 'currency', isArray: false, colspan: 1, rowspan: 1, isSubcolumn: true, isNotFirst: true },
      { label: 'Group Rate Type', field: 'groupRateType', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      {
        label: 'Group Rate Itemize', field: 'groupRateItemize', isArray: false, colspan: 1,
        rowspan: 2, isSubcolumn: false, isNotFirst: false
      },
      { label: 'Business Unit', field: 'businessUnit', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      {
        label: 'Service Offering', field: 'serviceOfferingDescription', isArray: false, colspan: 1,
        rowspan: 2, isSubcolumn: false, isNotFirst: false
      },
      { label: 'Transit Mode', field: 'transitMode', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      { label: 'Service Level', field: 'serviceLevel', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      {
        label: 'Operational Service', field: 'operationalService', isArray: true, colspan: 1,
        rowspan: 2, isSubcolumn: false, isNotFirst: false
      },
      {
        label: 'Equipment Category', field: 'equipmentClassificationCodeDescription', isArray: false,
        colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false
      },
      {
        label: 'Equipment Type', field: 'equipmentTypeCodeDescription', isArray: false, colspan: 1,
        rowspan: 2, isSubcolumn: false, isNotFirst: false
      },
      {
        label: 'Equipment Length', field: 'unitOfEquipmentLengthMeasurementCode', isArray: false,
        colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false
      },
      { label: 'Award Status', field: 'awardStatus', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      { label: 'Priority', field: 'priorityNumber', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      {
        label: 'Overridden Priority', field: 'overriddenPriority', isArray: false, colspan: 1,
        rowspan: 2, isSubcolumn: false, isNotFirst: false
      },
      { label: 'Stops', field: 'numberOfStops', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      {
        label: 'Stop Charge Included', field: 'stopChargeIncluded', isArray: false, colspan: 1,
        rowspan: 2, isSubcolumn: false, isNotFirst: false
      },
      {
        label: 'Origin Description', field: 'originDescription', isArray: false, colspan: 1,
        rowspan: 2, isSubcolumn: false, isNotFirst: false
      },
      {
        label: 'Destination Description', field: 'destinationDescription', isArray: false,
        colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false
      },
      { label: 'Origin Vendor ID', field: 'originVendorId', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      {
        label: 'Destination Vendor ID', field: 'destinationVendorId', isArray: false,
        colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false
      },
      { label: 'Bill To Code', field: 'billToCode', isArray: true, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      { label: 'Carrier Code', field: 'carrierCode', isArray: true, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      {
        label: 'Mileage Preference', field: 'mileagePreferences', isArray: false,
        colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false
      },
      { label: 'Mileage Range', field: 'mileageRange', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      { label: 'Weight Range', field: 'weightRange', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      {
        label: 'Weight Unit Of Measure', field: 'weightUnitOfMeasure', isArray: false,
        colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false
      },
      { label: 'Hazmat Included', field: 'hazmatIncluded', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      { label: 'Fuel Included', field: 'fuelIncluded', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      {
        label: 'Auto Invoice', field: 'autoInvoice', isArray: false, colspan: 1, rowspan: 2,
        isSubcolumn: false, isNotFirst: false
      },
      {
        label: 'Source Type', field: 'lineHaulSourceTypeName', isArray: false, colspan: 1,
        rowspan: 2, isSubcolumn: false, isNotFirst: false
      },
      { label: 'Source ID', field: 'sourceID', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      {
        label: 'Source Line Haul ID', field: 'sourceLineHaulID', isArray: false, colspan: 1,
        rowspan: 2, isSubcolumn: false, isNotFirst: false
      },
      { label: 'Effective Date', field: 'effectiveDate', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false },
      { label: 'Expiration Date', field: 'expirationDate', isArray: false, colspan: 1, rowspan: 2, isSubcolumn: false, isNotFirst: false }
    ];
    this.setIntialValues();
  }

  setIntialValues() {
    this.sortColumns = {
      'contractName': 'customerAgreementContractNumber.keyword',
      'sectionName': 'customerAgreementContractSectionName.keyword',
      'originPoint': 'origin.points.pointDisplayName.keyword',
      'destinationPoint': 'destination.points.pointDisplayName.keyword',
      'type': 'rates.chargeUnitTypeName.keyword',
      'amount': 'rates.rateAmount',
      'minimum': 'rates.minimumAmount',
      'maximum': 'rates.maximumAmount',
      'currency': 'rates.currencyCode.keyword',
      'groupRateType': 'groupRateType.keyword',
      'groupRateItemize': 'groupRateItemizeIndicator.keyword',
      'businessUnit': 'financeBusinessUnitName.keyword',
      'serviceOfferingDescription': 'serviceOfferingDescription.keyword',
      'transitMode': 'transitMode.keyword',
      'serviceLevel': 'serviceLevelCode.keyword',
      'operationalService': 'operationalServices.serviceTypeDescription.keyword',
      'equipmentClassificationCodeDescription': 'equipmentClassificationCode.keyword',
      'equipmentTypeCodeDescription': 'equipmentTypeCodeDescription.keyword',
      'unitOfEquipmentLengthMeasurementCode': 'equipmentLengthQuantity',
      'awardStatus': 'lineHaulAwardStatusTypeName.keyword',
      'priorityNumber': 'priorityLevelNumber',
      'overriddenPriority': 'overiddenPriorityLevelNumber',
      'numberOfStops': 'numberOfStops',
      'stopChargeIncluded': 'stopChargeIncludedIndicator.keyword',
      'originDescription': 'origin.description.keyword',
      'destinationDescription': 'destination.description.keyword',
      'originVendorId': 'origin.vendorID.keyword',
      'destinationVendorId': 'destination.vendorID.keyword',
      'billToCode': 'billTos.billToName.keyword',
      'carrierCode': 'carriers.carrierName.keyword',
      'mileagePreferences': 'mileagePreference.mileagePreferenceName.keyword',
      'mileageRange': 'mileagePreference.lineHaulMileageRangeMinQuantity',
      'weightRange': 'unitOfMeasurement.lineHaulWeightRangeMinQuantity',
      'weightUnitOfMeasure': 'unitOfMeasurement.description.keyword',
      'hazmatIncluded': 'hazmatIncludedIndicator.keyword',
      'fuelIncluded': 'fuelIncludedIndicator.keyword',
      'autoInvoice': 'autoInvoiceIndicator.keyword',
      'lineHaulSourceTypeName': 'lineHaulSourceTypeName.keyword',
      'sourceID': 'sourceID',
      'sourceLineHaulID': 'sourceLineHaulID',
      'effectiveDate': 'effectiveDate',
      'expirationDate': 'expirationDate'
    };
    this.nestedColumns = {
      'originPoint': 'origin',
      'destinationPoint': 'destination',
      'carrierCode': 'carriers',
      'billToCode': 'billTos',
      'operationalService': 'operationalServices',
      'type': this.rateName,
      'amount': this.rateName,
      'minimum': this.rateName,
      'maximum': this.rateName,
      'currency': this.rateName,
      'originDescription': 'origin',
      'destinationDescription': 'destination',
      'originVendorId': 'origin',
      'destinationVendorId': 'destination',
      'mileagePreferences': 'mileagePreference',
      'mileageRange': 'mileagePreference',
      'weightRange': 'unitOfMeasurement',
      'weightUnitOfMeasure': 'unitOfMeasurement'
    };
    this.customerAgreementData = {
      'customerAgreementName': null,
      'customerLineHaulConfigurationID': null
    };
    this.editLineHaulDetails = {
      'isEditFlag': false,
      'lineHaulDetails': null
    };
  }
}
