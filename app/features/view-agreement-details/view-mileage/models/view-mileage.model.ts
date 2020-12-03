import { Column, EditMileageDetails, QueryMock } from './view-mileage.interface';
import { MenuItem } from 'primeng/api';
import { Source } from './view-mileage-elasticresponse.interface';

export class ViewMileageModel {

  isSplitView: boolean;
  isFilterEnabled: boolean;
  splitViewTitle: string;
  isFilterView: boolean;
  filterFlag: boolean;
  tableColumns: Column[];
  from: number;
  gridSize: number;
  subscriberFlag: boolean;
  gridRows: Source[];
  pageLoading: boolean;
  menuItemList: Array<MenuItem>;
  gridDataLength: number;
  sourceData: QueryMock;
  defaultEndDate: string;
  defaultStartDate: string;
  effectiveDateRange: object;
  expirationDateRange: object;
  defaultSearchFields: object;
  mileageFieldNames: object;
  mileageNestedRootVal: object;
  allowPagination: boolean;
  tableSize: number;
  noResultFoundFlag: boolean;
  isSearchGrid: boolean;
  isEmptySearch: boolean;
  systemParameter: string;
  businessUnit: string;
  mileageDetails: any;
  UniqueDocID: number;
  agreementID: number;
  pageStart: number;
  source: any[];
  mileageDetailsForEdit: EditMileageDetails;
  constructor() {
    this.subscriberFlag = true;
    this.isSplitView = false;
    this.isFilterView = false;
    this.filterFlag = false;
    this.isFilterEnabled = false;
    this.gridSize = 50;
    this.pageLoading = false;
    this.gridRows = [];
    this.source = [];
    this.splitViewTitle = 'Program Detail';
    this.mileageDetails = {};
    this.from = 0;
    this.gridSize = 25;
    this.pageStart = 0;
    this.systemParameter = 'System Parameters';
    this.businessUnit = 'Business Unit';
    this.pageStart = 0;
    this.tableColumns = [
      { label: 'Program Name', field: 'mileageProgramName', isArray: false },
      { label: 'Agreement Default', field: 'agreementDefaultIndicator', isArray: false },
      { label: 'Contract', field: 'contracts', isArray: true },
      { label: 'Section', field: 'sections', isArray: true },
      { label: this.businessUnit, field: 'businessUnits', isArray: true },
      { label: 'Carrier', field: 'carriers', isArray: true },
      { label: 'System', field: 'system', isArray: false },
      { label: 'System Version', field: 'mileageSystemVersionName', isArray: false },
      { label: this.systemParameter, field: 'systemParameters', isArray: true },
      { label: 'Distance Unit', field: 'unitOfDistanceMeasurementCode', isArray: false },
      { label: 'Geography Type', field: 'geographyType', isArray: false },
      { label: 'Route Type', field: 'mileageRouteTypeName', isArray: false },
      { label: 'Calculation Type', field: 'mileageCalculationTypeName', isArray: false },
      { label: 'Decimal Precision', field: 'decimalPrecisionIndicator', isArray: false },
      { label: 'Status', field: 'status', isArray: false },
      { label: 'Border Miles Parameter', field: 'borderCrossingParameter', isArray: false },
      { label: 'Effective Date', field: 'effectiveDate', isArray: false },
      { label: 'Expiration Date', field: 'expirationDate', isArray: false },
      { label: 'Notes', field: 'mileageProgramNoteText', isArray: true }
    ];
    this.mileageFieldNames = {
      'Program Name': 'mileageProgramName.keyword',
      'Agreement Default': 'agreementDefaultIndicator.keyword',
      'Contract': 'customerMileageProgramContractAssociations.customerContractDisplayName.keyword',
      'Section': 'customerMileageProgramSectionAssociations.customerAgreementContractSectionName.keyword',
      [this.businessUnit]: 'customerMileageProgramBusinessUnits.financeBusinessUnitCode.keyword',
      'Carrier': 'customerMileageProgramCarrierAssociations.carrierDisplayName.keyword',
      'System': 'mileageSystemName.keyword',
      'System Version': 'mileageSystemVersionName.text',
      [this.systemParameter]: 'mileageSystemParameters.mileageSystemParameterName.keyword',
      'Distance Unit': 'unitOfDistanceMeasurementCode.keyword',
      'Geography Type': 'geographyType.keyword',
      'Route Type': 'mileageRouteTypeName.keyword',
      'Calculation Type': 'mileageCalculationTypeName.keyword',
      'Decimal Precision': 'decimalPrecisionIndicator.keyword',
      'Status': 'expirationDate.keyword',
      'Border Miles Parameter': 'mileageBorderMileParameterTypeName.keyword',
      'Effective Date': 'effectiveDate.keyword',
      'Expiration Date': 'expirationDate.keyword',
      'Notes': 'mileageProgramNoteText.keyword'
    };
    this.mileageNestedRootVal = {
      'Contract': 'customerMileageProgramContractAssociations',
      'Section': 'customerMileageProgramSectionAssociations',
      [this.businessUnit]: 'customerMileageProgramBusinessUnits',
      'Carrier': 'customerMileageProgramCarrierAssociations',
      [this.systemParameter]: 'mileageSystemParameters'
    };
  }
}
