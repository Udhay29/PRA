import { FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import {
    BorderMileParameter, CarriersInterface, DomainAttributesType, DropdownListType, EditMileageDetails, MileageSystemParameters,
     MileageSystemVersions, MockSectionColumnsType, MockSectionRowsType,
    MultiSelectDropdownList, ParameterDropDownListType, RequestPayload, AgreementDetails, CustomerAgreementContractSections, CarrierListType
} from './create-mileage.interface';
import { DocumentationLevelInterface } from './../../accessorials/documentation/create-documentation/model/create-documentation.interface';
export class CreateMileageModel {
    createMileageForm: FormGroup;
    subscriberFlag: boolean;
    customerAgreement: AgreementDetails;
    domainAttributes: DomainAttributesType;
    systemList: DropdownListType[];
    systemDataList: DropdownListType[];
    systemVersion: DropdownListType[];
    systemVersionList: DropdownListType[];
    unitOfLengthMeasurement: DropdownListType[];
    distanceUnit: DropdownListType[];
    distanceUnitList: DropdownListType[];
    systemParameters: ParameterDropDownListType[];
    systemParametersList: ParameterDropDownListType[];
    calculationType: DropdownListType[];
    calculationTypeList: DropdownListType[];
    geographyType: DropdownListType[];
    geographyTypeList: DropdownListType[];
    routeType: DropdownListType[];
    routeTypeList: DropdownListType[];
    businessUnitList: MultiSelectDropdownList[];
    carrier: DropdownListType[];
    carrierList: CarrierListType[];
    sectionRowData: CustomerAgreementContractSections[];
    sectionColumns: MockSectionColumnsType[];
    sectionsList: CustomerAgreementContractSections[];
    contractsList: MultiSelectDropdownList[];
    editFlag: boolean;
    systemParametersFlag: boolean;
    systemParameterErrorFlag: boolean;
    mandatoryFields: string[];
    createRequestParam;
    breadCrumbList: MenuItem[];
    detailsList: MultiSelectDropdownList[];
    detailType: string;
    isPageLoaded: boolean;
    overflowMenuList: MenuItem[];
    inCorrectEffDateFormat: boolean;
    inCorrectExpDateFormat: boolean;
    isNotValidDate: boolean;
    effectiveDate: string;
    expirationDate: string;
    agreementExpirationDate: string;
    effDate: Date;
    expDate: Date;
    effectiveMinDate: Date;
    effectiveMaxDate: Date;
    expirationMinDate: Date;
    expirationMaxDate: Date;
    disabledEffDatesList: Array<Date>;
    disabledExpDatesList: Array<Date>;
    isSaveChanges: boolean;
    defaultFieldValues: any;
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
    createMileagePopUp: boolean;
    tabChangeValue: string;
    controlsInMileageTab: string[];
    sectionErrorFlag: boolean;
    agreementDefaulFlag: boolean;
    mileageId: number;
    editDetails: EditMileageDetails;
    createBreadCrumbValue: string;
    borderMileParameter: BorderMileParameter;
    isContractAfflitation: boolean;
    sectionListCopy: CustomerAgreementContractSections[];

    constructor(agreementID: string) {
        this.initialValues(agreementID);
        this.isDetailsSaved = false;
        this.subscriberFlag = true;
        this.isTopAdded = false;
        this.isTopAddedContract = false;
        this.systemVersion = [];
        this.distanceUnit = [];
        this.carrierList = [];
        this.contractsList = [];
        this.geographyType = [];
        this.sectionRowData = [];
        this.sectionsList = [];
        this.mandatoryFields = ['programName', 'system', 'systemVersion', 'distanceUnit', 'geographyType', 'routeType',
            'calculationType', 'effectiveDate', 'expirationDate'];
        this.defaultFields = ['system', 'distanceUnit', 'geographyType', 'routeType', 'calculationType'];
        this.businessUnitList = [];
        this.disabledEffDatesList = [];
        this.disabledExpDatesList = [];
        this.inCorrectEffDateFormat = false;
        this.inCorrectExpDateFormat = false;
        this.isNotValidDate = false;
        this.isSaveChanges = false;
        this.defaultMaxDate = '2099-12-31';
        this.defaultMinDate = '1995-01-01';
        this.createRequestParam = {
            agreementName: null,
            mileageProgramName: null,
            id: null,
            agreementDefaultIndicator: 'Y',
            contractDefault: null,
            businessUnitCodes: null,
            customerAgreementContracts: [],
            customerAgreementSections: null,
            carriers: [],
            distanceUnit: null,
            decimalPrecisionIndicator: null,
            mileageBorderMileParameterType: null,
            effectiveDate: null,
            expirationDate: null,
            mileageProgramNoteText: null,
            geographicPointType: null,
            mileageRouteType: null,
            mileageCalculationType: null,
            mileageSystem: null,
            mileageSystemVersion: null,
            mileageSystemParameters: []
        };
    }

    initialValues(agreementID: string) {
        this.createBreadCrumbValue = 'Create Program';
        this.breadCrumbList = [{
            label: 'Pricing',
            routerLink: ['/dashboard']
        }, {
            label: 'Search Agreements',
            routerLink: ['/searchagreement']
        }, {
            label: 'Agreement Detail',
            routerLink: ['/viewagreement'],
            queryParams: { id: agreementID }

        }, {
            label: 'Create Program'
        }];
        this.detailType = '';
        this.isPageLoaded = false;
        this.defaultFieldValues = {
            'system': {
                'label': {
                    'mileageSystemID': 1,
                    'mileageSystemName': 'Rand McNally'
                },
                'value': 'Rand McNally',
                'reqKey': 'mileageSystem'
            },
            'distanceUnit': {
                'label': {
                    'code': 'Miles',
                    'description': 'Miles'
                },
                'value': 'Miles',
                'reqKey': 'distanceUnit'
            },
            'geographyType': {
                'label': {
                    'geographicPointTypeID' : 1,
                    'geographicPointTypeName': 'City State'
                },
                'value': 'City State',
                'reqKey': 'geographicPointType'
            },
            'routeType': {
                'label': {
                    'mileageRouteTypeID': 2,
                    'mileageRouteTypeName': 'Shortest'
                },
                'value': 'Shortest',
                'reqKey': 'mileageRouteType'
            },
            'calculationType': {
                'label': {
                    'mileageCalculationTypeID': 1,
                    'mileageCalculationTypeName': 'Construct'
                },
                'value': 'Construct',
                'reqKey': 'mileageCalculationType'
            }
        };
        this.mileageLevel = [{
            label: 'Agreement',
            value: 'Agreement'
        },
        {
            label: 'Contract',
            value: 'Contract'
        },
        {
            label: 'Section',
            value: 'Section'
        }];
        this.defaultSystemVersions = [];
        this.defaultSystemParameters = [];
        this.controlsInMileageTab = ['agreementDefault', 'contract', 'businessUnit'];
        this.sectionListCopy = [];
        }
}
