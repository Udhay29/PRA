import { Observable } from 'rxjs';
export interface RuleTypeInterface {
    label: string;
    value: number;
}

export interface RuleType {
    _embedded: RuleTypeValue;
    _links: object;
    page: Page;
}

export interface RuleTypeValue {
    accessorialRuleTypes: AccessorialRuleTypesItem[];
}

export interface AccessorialRuleTypesItem {
    '@id': number;
    createTimestamp: string;
    createProgramName: string;
    lastUpdateProgramName: string;
    createUserId: string;
    lastUpdateUserId: string;
    accessorialRuleTypeName: string;
    effectiveDate: string;
    expirationDate: string;
    lastUpdateTimestampString: string;
    _links: object;
}

export interface BuSoAssociation {
    financeBusinessUnitServiceOfferingAssociationID: number;
    serviceOfferingCode: string;
    serviceOfferingDescription: string;
    transitModeId: number;
    transitModeCode: string;
    transitModeDescription: string;
    financeBusinessUnitCode: string;
    chargeTypeBusinessUnitServiceOfferingAssociationID?: number;
}

export interface DocumentationDate {
    agreementID: number;
    agreementDefaultAmount: number;
    agreementEffectiveDate: string;
    agreementExpirationDate: string;
    customerContractDetailDTO: Array<string>;
    customerSectionDetailDTO: Array<string>;
}

export interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export interface ChargeCodeResponseInterface {
    chargeTypeID: number;
    chargeTypeCode: string;
    chargeTypeName: string;
    chargeTypeDescription: string;
    chargeTypeBusinessUnitServiceOfferingAssociations: ChargeTypeBusinessUnitServiceOfferingAssociationsItem[];
}
export interface ChargeTypeBusinessUnitServiceOfferingAssociationsItem {
    chargeTypeBusinessUnitServiceOfferingAssociationID: number;
    chargeTypeID: null;
    financeBusinessUnitServiceOfferingAssociation: FinanceBusinessUnitServiceOfferingAssociation;
    financeChargeUsageTypeID: number;
    effectiveDate: string;
    expirationDate: string;
}
export interface FinanceBusinessUnitServiceOfferingAssociation {
    financeBusinessUnitServiceOfferingAssociationID: number;
    financeBusinessUnitCode: string;
    serviceOfferingCode: string;
}

export class ChargeCodeInterface {
    label: string;
    value: number;
    description: string;
}

export interface CreateDocumentationInterface {
    documentationContent: string;
    documentationText: string;
    cancelText: string;
}

export interface ErrorMessage {
    severity: string;
    summary: string;
    detail: string;
}

export interface AveragingTimeFrame {
    _embedded: TimeFrame;
    _links: object;
    page: Page;
}
export interface TimeFrame {
    pricingAveragePeriodTypes: PricingAveragePeriodTypesItem[];
}
export interface PricingAveragePeriodTypesItem {
    '@id': number;
    createTimestamp: string;
    createProgramName: string;
    lastUpdateProgramName: string;
    createUserId: string;
    lastUpdateUserId: string;
    pricingAveragePeriodTypeName: string;
    effectiveDate: string;
    expirationDate: string;
    lastUpdateTimestampString: string;
    _links: object;
    pricingAveragePeriodTypeId: number;
}

export interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export interface DayOfWeek {
    label: string;
    value: string;
}

export interface DayOfWeekResponse {
    weeksInAverage: number[];
    priceChangeDayOfWeek: string[];
}

export interface SpecificDaysInterface {
    label: number;
    value: number;
}

export interface MonthlyTypes {
    label: string;
    value: number;
}

export interface GracePeriod {
    _embedded: GracePeriodMeasurement;
    _links: object;
    page: GracePeroidPage;
}
export interface GracePeriodMeasurement {
    pricingUnitOfTimeMeasurementAssociations: PricingUnitOfTimeMeasurementAssociationsItem[];
}
export interface PricingUnitOfTimeMeasurementAssociationsItem {
    '@id': number;
    createTimestamp: string;
    createProgramName: string;
    lastUpdateProgramName: string;
    createUserId: string;
    lastUpdateUserId: string;
    effectiveTimestamp: string;
    expirationTimestamp: string;
    unitOfTimeMeasurementCode: string;
    pricingFunctionalAreaID: number;
    lastUpdateTimestampString: string;
    _links: object;
}
export interface GracePeroidPage {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export interface CanComponentDeactivate {
    canDeactivate: (component, route, state, nextState) => Observable<boolean> | Promise<boolean> | boolean;
}

export interface AgreementDetailsInterface {
    agreementType: string;
    businessUnits: string;
    cargoReleaseAmount: number;
    currencyCode: string;
    customerAgreementID: number;
    customerAgreementName: string;
    effectiveDate: string;
    expirationDate: string;
    invalidIndicator: string;
    invalidReasonTypeName: string;
    taskAssignmentIDs: string;
    teams: string;
    ultimateParentAccountID: number;
}

export interface DocumentationLevelInterface {
    label: string;
    value: string;
    id?: number;
}

export interface ContractTypesItemInterface  {
    customerAgreementContractID?: number;
    customerContractName?: string;
    customerContractNumber?: string;
    contractTypeID?: number;
    contractTypeName?: string;
    effectiveDate?: string;
    expirationDate?: string;
    isChecked: boolean;
}
export interface SectionsGridResponseInterface {
    customerAgreementContractSectionID?: number;
    customerAgreementContractSectionName?: string;
    customerAgreementContractID?: number;
    customerContractName?: string;
    customerContractNumber?: string;
    contractTypeName?: string;
    effectiveDate?: string;
    expirationDate?: string;
    isChecked: boolean;
    currencyCode: string;
}

export interface DateRangeInterface {
    _embedded: {
        configurationParameterDetails: [{
            configurationParameter: object,
            configurationParameterDetailID: number,
            configurationParameterValue: string
        }]
    };
    _links: {
        configurationParameterDetail: {
            href: string,
            templated: boolean
        }
    };
}
