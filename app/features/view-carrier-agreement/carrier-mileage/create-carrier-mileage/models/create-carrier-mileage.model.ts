import {
  FormGroup
} from '@angular/forms';
import {
  MenuItem,
  SelectItem
} from 'primeng/api';
import {
  CarriersInterface,
  DomainAttributesType,
  DropdownListType,
  MileageSystemParameters,
  MileageSystemVersions,
  MockSectionColumnsType,
  MockSectionRowsType,
  MultiSelectDropdownList,
  RequestPayload,
  AgreementDetails,
  CarrierListType,
  DocumentationLevelInterface,
  Column,
  BusinessUnitDropdownListType,
  BorderCrossingParameter,
  CarrierAgreement,
  CarrierAgreementType,
  RootObjectCarrier,
  RootObject,
  MileageUnit,
  BorderCrossingParameterDefault,
  DefaultFieldValues,
  CodesTableColumns
} from './create-carrier-mileage.interface';
export class CreateCarrierMileageModel {
  createMileageForm: FormGroup;
  isSubscriberFlag: boolean;
  carrierAgreement: AgreementDetails;
  carrierSegmentList: SelectItem[];
  carrierSegmentFilteredList: SelectItem[];
  carrierSegment: CarrierAgreementType[];
  carrierSegmentsClone: MileageUnit[];
  domainAttributes: DomainAttributesType;
  systemList: DropdownListType[];
  systemDataList: DropdownListType[];
  segmentDataList: DropdownListType[];
  systemVersion: DropdownListType[];
  systemVersionList: DropdownListType[];
  unitOfLengthMeasurement: DropdownListType[];
  distanceUnit: DropdownListType[];
  distanceUnitList: DropdownListType[];
  systemParameters: DropdownListType[];
  systemParametersList: DropdownListType[];
  calculationType: DropdownListType[];
  calculationTypeList: DropdownListType[];
  borderParameter: BorderCrossingParameterDefault[];
  geographyType: DropdownListType[];
  geographyTypeList: DropdownListType[];
  routeType: DropdownListType[];
  routeTypeList: DropdownListType[];
  businessUnitList: BusinessUnitDropdownListType[];
  businessUnitDataList: BusinessUnitDropdownListType[];
  carrier: DropdownListType[];
  carrierList: CarrierListType[];
  sectionColumns: MockSectionColumnsType[];
  isContractDisplayFlag: boolean;
  isNoResultFoundFlag: boolean;
  isContractListDisplayFlag: boolean;
  isEditFlag: boolean;
  isSystemParametersFlag: boolean;
  isSystemParametersCheckFlag: boolean;
  isCarrierSelectionFlag: boolean;
  isSystemParameterErrorFlag: boolean;
  isSectionDisplayFlag: boolean;
  isBusinessUnitFlag: boolean;
  mandatoryFields: string[];
  createRequestParam: RequestPayload;
  breadCrumbList: MenuItem[];
  detailsList: MultiSelectDropdownList[];
  detailType: string;
  isPageLoaded: boolean;
  isSubscribe: boolean;
  overflowMenuList: MenuItem[];
  isCorrectEffDateFormat: boolean;
  isCorrectExpDateFormat: boolean;
  isNotValidDate: boolean;
  effectiveDate: string;
  expirationDate: string;
  effDate: Date;
  expDate: Date;
  effectiveMinDate: Date;
  effectiveMaxDate: Date;
  expirationMinDate: Date;
  expirationMaxDate: Date;
  disabledEffDatesList: Array<Date>;
  disabledExpDatesList: Array<Date>;
  isSaveChanges: boolean;
  defaultFieldValues: DefaultFieldValues;
  defaultFields: string[];
  defaultSystemVersions: MileageSystemVersions[];
  defaultSystemParameters: MileageSystemParameters[];
  popupMessage: string;
  routingUrl: string;
  isDetailsSaved: boolean;
  isChangesSaving: boolean;
  isTopAdded: boolean;
  isTopAddedContract: boolean;
  defaultMinDate: string;
  defaultMaxDate: string;
  carrierSuggestions: CarriersInterface[];
  mileageLevel: DocumentationLevelInterface[];
  selectedMileageLevel: string;
  codesTableColumns: CodesTableColumns[];
  selectedOption: string;
  searchInputValue: string;
  isNoRecordMsgFlag: boolean;
  selectedAffiliationValue: string;
  isShowAgreementBillTO: boolean;
  isShowSection: boolean;
  isShowAffilcation: boolean;
  isShowEmptyBillTo: boolean;
  errMsg: string;
  cols: MockSectionColumnsType[];
  agreementURL: string;
  viewMileageURL: string;
  agreementID: string;
  systemParametersClone: MileageSystemParameters[];
  borderCrossingParameter: number;
  carrierCheckCounter: number;
  carrierValidationMessage: string;

  isViewCarrierMileageModel: boolean;
  constructor(agreementID: string) {
    this.initialValues(agreementID);
    this.isDetailsSaved = false;
    this.isSubscriberFlag = true;
    this.isContractListDisplayFlag = true;
    this.isTopAdded = false;
    this.isTopAddedContract = false;
    this.systemVersion = [];
    this.distanceUnit = [];
    this.carrierList = [];
    this.carrierSegmentFilteredList = [];
    this.carrierSegmentList = [];
    this.geographyType = [];
    this.mandatoryFields = ['carrierSegment', 'mileageProgramName', 'system', 'systemVersion', 'distanceUnit', 'geographyType', 'routeType',
      'calculationType', 'effectiveDate', 'expirationDate'
    ];
    this.defaultFields = ['carrierSegment', 'distanceUnit', 'geographyType', 'routeType', 'calculationType'];
    this.businessUnitList = [];
    this.disabledEffDatesList = [];
    this.disabledExpDatesList = [];
    this.isCorrectEffDateFormat = false;
    this.isCorrectExpDateFormat = false;
    this.isNotValidDate = false;
    this.isSaveChanges = false;
    this.defaultMaxDate = '2099-12-31';
    this.defaultMinDate = '1995-01-01';
    this.isCarrierSelectionFlag = false;
    this.carrierCheckCounter = 0;
    this.errMsg = 'Error Message';
    this.viewMileageURL = '/viewcarrierdetails';
    this.borderCrossingParameter = 1;
    this.carrierValidationMessage = '';
    this.createRequestParam = {
      carrierSegment: null,
      carrierAgreementName: null,
      agreementTypeName: null,
      carrierAgreementID: null,
      mileageProgramName: null,
      carrierMileageProgramID: null,
      copied: null,
      lineHaulOverrideIndicator: null,
      agreementDefaultIndicator: null,
      financeBusinessUnitCode: null,
      carriers: [],
      distanceUnit: null,
      decimalPrecisionIndicator: null,
      borderCrossingParameter: null,
      effectiveDate: null,
      expirationDate: null,
      notes: null,
      geographicPointType: null,
      mileageRouteType: null,
      mileageCalculationType: null,
      mileageSystem: null,
      mileageSystemVersion: null,
      mileageSystemParameters: [],
      billToAccounts: [],
      sections: [],

    };
    this.mileageLevel = [{
      label: 'No Affiliation',
      value: 'No Affiliation',
      disabled: false
    },
    {
      label: 'Section',
      value: 'section',
      disabled: false
    },
    {
      label: 'Bill to Account',
      value: 'Bill to Account',
      disabled: false
    }
    ];

    this.codesTableColumns = [{
      label: {
        id: '',
        code: 'Carriers'
      },
      value: 'value',
      tooltip: 'value',
      displayName: 'displayName'

    }];
    this.searchInputValue = '';
  }

  initialValues(agreementID: string) {
    this.breadCrumbList = [{
      label: 'Pricing',
      routerLink: ['/dashboard']
    }, {
      label: 'Search Agreements',
      routerLink: ['/searchagreement']
    }, {
      label: 'Agreement Detail',
      routerLink: [`/viewcarrierdetails/${agreementID}`]

    }, {
      label: 'Create Program'
    }];
    this.isSubscribe = true;
    this.detailType = '';
    this.isPageLoaded = false;
    this.defaultFieldValues = {
      'carrierSegment': {
        'label': 1,
        'value': 'Dray',
        'reqKey': 'carrierSegment'
      },
      'distanceUnit': {
        'label': 1,
        'value': 'Miles',
        'reqKey': 'distanceUnit'
      },
      'geographyType': {
        'label': 1,
        'value': 'City State',
        'reqKey': 'geographicPointType'
      },
      'routeType': {
        'label': 1,
        'value': 'Shortest',
        'reqKey': 'mileageRouteType'
      },
      'calculationType': {
        'label': 1,
        'value': 'Construct',
        'reqKey': 'mileageCalculationType'
      }
    };
  }
}
