import { MenuItem } from 'primeng/api';
import { SectionDetails, Section, QueryMock, SplitScreenDetails } from './sections.interface';
import { Subscription } from 'rxjs';
export class SectionsModel {
  from: number;
  size: number;
  name: string;
  isSubscriberFlag: boolean;
  detailsValue: object;
  isFilterEnabled: boolean;
  isSplitView: boolean;
  sectionList: Section[];
  isPaginatorFlag: boolean;
  tableSize: number;
  isShowLoader: boolean;
  pageStart: number;
  gridDataLength: number;
  tableColumns: Array<object>;
  associatedCodeTableColumns: Array<object>;
  filterFlag: boolean;
  sourceData: QueryMock;
  getFieldNames: object;
  splitButtonMenu: MenuItem[];
  splitViewAction: string;
  splitViewTitle: string;
  sectionViewDetails: SectionDetails;
  noResultFoundFlag: boolean;
  agreementID: number;
  effectiveDateRange: object;
  expirationDateRange: object;
  originalEffectiveDateRange: object;
  originalExpirationDateRange: object;
  dateSearchFields: Array<string>;
  showCreateSection: boolean;
  defaultSearchFields: Array<string>;
  billToCodesLabel: string;
  CreateTimestamp: string;
  LastUpdateTimestamp: string;
  isShowSectionsCreation: boolean;
  splitScreenData: SplitScreenDetails;
  isShowPopup: boolean;
  isChangesAvailable: boolean;
  selectedRowEvent: Event;
  editButtonDisable: boolean;
  isSearchWithCreate: boolean;
  defaultDate: string;
  dateFormat: string;
  sortOrder: string;
  sectionsDataSubscription: Subscription;
  constructor() {
    this.isShowPopup = false;
    this.isShowSectionsCreation = false;
    this.isSubscriberFlag = true;
    this.isSplitView = false;
    this.isPaginatorFlag = true;
    this.tableSize = 25;
    this.isShowLoader = false;
    this.pageStart = 0;
    this.filterFlag = false;
    this.isFilterEnabled = false;
    this.noResultFoundFlag = false;
    this.splitViewAction = 'View';
    this.splitViewTitle = 'Section Details';
    this.splitButtonMenu = [];
    this.billToCodesLabel = 'Bill To Codes';
    this.defaultDate = 'MM/dd/yyyy||yyyy';
    this.dateFormat = 'MM/DD/YYYY';
    this.tableColumns = [{
      'name': 'Section Name', 'property': 'SectionName', 'keyword': 'SectionName.keyword', 'width': { 'width': '120px' },
      'tooltip': 'SectionName'
    },
    {
      'name': 'Section Type', 'property': 'SectionTypeName', 'width': { 'width': '140px' },
      'keyword': 'SectionTypeName.keyword', 'tooltip': 'SectionTypeName'
    },
    {
      'name': 'Currency', 'property': 'SectionCurrencyCode', 'width': { 'width': '120px' },
      'keyword': 'SectionCurrencyCode.keyword', 'tooltip': 'SectionCurrencyCode'
    },
    {
      'name': 'Contract', 'property': 'ContractTypeDisplay', 'keyword': 'ContractTypeDisplay.keyword',
      'tooltip': 'ContractTypeDisplay', 'width': { 'width': '220px' }
    },
    {
      'name': this.billToCodesLabel,
      'property': 'BillingPartyCode', 'keyword': 'BillingPartyCode.keyword', 'tooltip': 'toolTipForBillTo', 'width': { 'width': '220px' }
    },
    {
      'name': 'Status', 'property': 'Status', 'keyword': 'Status.keyword', 'tooltip': 'Status', 'width': { 'width': '120px' }
    },
    {
      'name': 'Effective Date', 'property': 'SectionEffectiveDate', 'tooltip': 'SectionEffectiveDate', 'width': { 'width': '120px' }
    },
    {
      'name': 'Expiration Date', 'property': 'SectionExpirationDate', 'tooltip': 'SectionExpirationDate', 'width': { 'width': '120px' }
    },
    {
      'name': 'Updated By', 'property': 'LastUpdateUser', 'tooltip': 'LastUpdateUser', 'width': { 'width': '120px' }
    },
    {
      'name': 'Updated On', 'property': 'LastUpdateTimestamp', 'tooltip': 'LastUpdateTimestamp', 'width': { 'width': '120px' }
    },
    {
      'name': 'Last Updated Program', 'property': 'LastUpdateProgram', 'tooltip': 'LastUpdateProgram', 'width': { 'width': '120px' }
    },
    {
      'name': 'Created By', 'property': 'CreateUser', 'tooltip': 'CreateUser', 'width': { 'width': '120px' }
    },
    {
      'name': 'Created On', 'property': 'CreateTimestamp', 'tooltip': 'CreateTimestamp', 'width': { 'width': '120px' }
    },
    {
      'name': 'Created Program', 'property': 'CreateProgram', 'tooltip': 'CreateProgram', 'width': { 'width': '120px' }
    },
    {
      'name': 'Original Effective Date', 'property': 'originalEffectiveDate', 'tooltip': 'originalEffectiveDate',
      'width': { 'width': '120px' }
    },
    {
      'name': 'Original Expiration Date', 'property': 'originalExpirationDate',
      'tooltip': 'originalExpirationDate', 'width': { 'width': '120px' }
    }
    ];
    this.getFieldNames = {
      'Section Name': 'SectionName.keyword',
      'Section Type': 'SectionTypeName.keyword',
      'Currency': 'SectionCurrencyCode.keyword',
      'Contract': 'contractDisplayName.keyword',
      'Bill To Codes': 'BillToCodes.billingPartyDisplayName.aux',
      'Status': 'Status.keyword',
      'Effective Date': 'SectionEffectiveDate.keyword',
      'Expiration Date': 'SectionExpirationDate.keyword',
      'Created Program': 'CreateProgram.keyword',
      'Last Updated Program': 'LastUpdateProgram.keyword',
      'Created By': 'CreateUser.keyword',
      'Updated By': 'LastUpdateUser.keyword',
      'Original Effective Date': 'originalEffectiveDate.keyword',
      'Original Expiration Date': 'originalExpirationDate.keyword',
      'Updated On': 'LastUpdateTimestamp.keyword',
      'Created On': 'CreateTimestamp.keyword'
    };
    this.associatedCodeTableColumns = [{
      'name': this.billToCodesLabel,
      'property': 'billToCodes'
    },
    {
      'name': 'Assigned Date Range',
      'property': 'assignedDateRange'
    }
    ];
    this.effectiveDateRange = {
      'range': {
        'SectionRanges.SectionEffectiveDate': {
          'gte': '',
          'lte': '',
          'format': this.defaultDate
        }
      }
    };
    this.expirationDateRange = {
      'range': {
        'SectionRanges.SectionExpirationDate': {
          'gte': '',
          'lte': '',
          'format': this.defaultDate
        }
      }
    };
    this.originalEffectiveDateRange = {
      'range': {
        'SectionRanges.originalEffectiveDate.keyword': {
          'gte': '',
          'lte': '',
          'format': this.defaultDate
        }
      }
    };
    this.originalExpirationDateRange = {
      'range': {
        'SectionRanges.originalExpirationDate.keyword': {
          'gte': '',
          'lte': '',
          'format': this.defaultDate
        }
      }
    };
    this.dateSearchFields = [
      'SectionRanges.SectionName', 'SectionRanges.SectionTypeName', 'SectionRanges.SectionCurrencyCode',
    ];
    this.defaultSearchFields = [
      'SectionRanges.SectionName', 'SectionRanges.SectionTypeName', 'SectionRanges.SectionCurrencyCode',
      'SectionRanges.CreateProgram', 'SectionRanges.LastUpdateProgram', 'SectionRanges.CreateUser', 'SectionRanges.LastUpdateUser',
    ];
    this.editButtonDisable = false;
  }
}
