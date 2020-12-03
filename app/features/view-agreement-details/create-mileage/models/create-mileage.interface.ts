import { Event } from '@angular/router';
import { Observable } from 'rxjs';
export interface CalculationType {
    mileageCalculationTypeID: number;
    mileageCalculationTypeName: string;
}
export interface RouteType {
    mileageRouteTypeID: number;
    mileageRouteTypeName: string;
}
export interface GeographicPointType {
    geographicPointTypeID: number;
    geographicPointTypeName: string;
}
export interface LengthMeasurementCode {
    unitOfLengthMeasurementCode: string;
    pricingFunctionalAreaID: number;
}
export interface MileageSystemVersions {
    mileageSystemVersionID: number;
    mileageSystemVersionName: string;
    effectiveDate?: string;
    expirationDate?: string;
}
export interface MileageSystem {
    mileageSystemID: number;
    mileageSystemName: string;
    mileageSystemParameters?: MileageSystemParameters[];
    mileageSystemVersions?: MileageSystemVersions[];
}
export interface MileageSystemParameters {
    mileageSystemParameterID: number;
    mileageSystemParameterName: string;
    mileageSystemParameterAssociationID?: number;
    mileageParameterSelectIndicator: string;
    effectiveDate?: string;
    expirationDate?: string;
}
export interface BorderCrossingParameters {
    mileageBorderMileParameterTypeID: number;
    mileageBorderMileParameterTypeName: string;
}
export interface DomainAttributesType {
    mileageCalculationTypes: CalculationType[];
    mileageRouteTypes: RouteType[];
    geographicPointType: GeographicPointType[];
    mileageSystems: MileageSystem[];
    borderCrossingParameters: BorderCrossingParameters[];
    unitOfLengthMeasurements: DistanceUnit[];
}
export interface DropdownListType {
    label: LabelType;
    value: string;
}
export interface LabelType {
    mileageSystemID?: number;
    mileageSystemName?: string;
    mileageSystemVersionID?: number;
    mileageSystemVersionName?: string;
    mileageCalculationTypeID?: number;
    mileageCalculationTypeName?: string;
    mileageRouteTypeID?: number;
    mileageRouteTypeName?: string;
    geographicPointTypeID?: number;
    geographicPointTypeName?: string;
    code?: string;
    description?: string;
}
export interface ParameterDropDownListType {
    label: SystemParameterLabel;
    value: string;
}
export interface SystemParameterLabel {
    mileageSystemParameterID: number;
    mileageSystemParameterAssociationID: number;
    mileageParameterSelectIndicator: string;
    mileageSystemParameterName: string;
}
export interface CarrierListType {
    label: CarrierLabel;
    value: string;
}
export interface CarrierLabel {
    id: number;
    code: string;
    name: string;
}
export interface MultiSelectDropdownList {
    label: string;
    value: string;
}
export interface MockSectionColumnsType {
    fieldName: string;
    displayName: string;
}
export interface MockSectionRowsType {
    section: string;
    contract: string;
}
export interface MockSectionsType {
    mileageSections: MockSectionColumnsType[];
    mileageSectionsRowData: MockSectionRowsType[];
}
export interface Self {
    href: string;
    templated?: boolean;
}
export interface AgreementStatusLink {
    href: string;
}
export interface CustomerAgreementLink {
    href: string;
    templated?: boolean;
}
export interface Links {
    self?: Self;
    agreementStatus?: AgreementStatusLink;
    customerAgreement?: CustomerAgreementLink;
    customerAgreementContract?: CustomerAgreementLink;
    unitOfLengthMeasurement?: UnitOfLengthMeasurementLink;
    profile?: ProfileLink;
    serviceOfferingBusinessUnitTransitModeAssociation?: ServiceOfferingBusinessUnitTransitModeAssociationLink;
}
export interface AgreementStatus {
    tenantID: number;
    agreementStatusName: string;
    effectiveDate: string;
    expirationDate: string;
    lastUpdateTimestampString: string;
}
export interface CustomerAgreement {
    expirationDate: string;
    customerAgreementID: number;
    effectiveDate: string;
    customerAgreementName: string;
    agreementStatus: AgreementStatus;
    _links: Links;
}
export interface Embedded {
    customerAgreement?: CustomerAgreement;
    customerAgreementContracts?: CustomerAgreementContracts[];
    unitOfLengthMeasurements?: UnitOfLengthMeasurement[];
    serviceOfferingBusinessUnitTransitModeAssociations?: ServiceOfferingBusinessUnitTransitModeAssociations[];
}
export interface CustomerAgreementOwnerships {
    tenantID: number;
    taskAssignmentID: number;
    effectiveDate: string;
    expirationDate: string;
    lastUpdateTimestampString: string;
    _embedded: Embedded;
    _links: Links;
}
export interface AgreementDetails {
    tenantID: number;
    ultimateParentAccountID: number;
    customerAgreementName: string;
    customerAgreementID: number;
    effectiveDate: string;
    expirationDate: string;
    customerAgreementOwnerships: CustomerAgreementOwnerships[];
    lastUpdateTimestampString: string;
    _links: Links;
}
export interface Source {
    CarrierID?: number;
    CarrierCode?: string;
}
export interface HitsArray {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: Source;
}
export interface Hits {
    total: number;
    max_score: number;
    hits: HitsArray[];
}
export interface Shards {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
}
export interface RootObject {
    took: number;
    timed_out: boolean;
    _shards: Shards;
    hits: Hits;
}
export interface CustomerAgreementContracts {
    customerAgreementContractID?: number;
    customerContractNumber?: string;
    customerContractName?: string;
    customerAgreementContractTypeName?: string;
    contractTypeName?: string;
}

export interface CustomerAgreementContractsDetails {
    _embedded: Embedded;
    _links: Links;
}
export interface UnitOfLengthMeasurementLink {
    href: string;
}
export interface ProfileLink {
    href: string;
}
export interface UnitOfLengthMeasurement {
    unitOfLengthMeasurementCode: string;
    unitOfLengthMeasurementDescription: string;
    lastUpdateTimestampString: string;
    _links: Links;
}
export interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}
export interface MileageUnit {
    _embedded: Embedded;
    _links: Links;
    page: Page;
}
export interface ServiceOfferingBusinessUnitTransitModeAssociationLink {
    href: string;
    templated?: boolean;
}
export interface FinanceBusinessUnitServiceOfferingAssociation {
    financeBusinessUnitServiceOfferingAssociationID: number;
    financeBusinessUnitCode: string;
    serviceOfferingCode: string;
    effectiveTimestamp: string;
    expirationTimestamp: string;
    lastUpdateTimestampString: string;
}
export interface ServiceOfferingBusinessUnitTransitModeAssociations {
    financeBusinessUnitServiceOfferingAssociation: FinanceBusinessUnitServiceOfferingAssociation;
    transitMode: string;
    utilizationClassification: string;
    freightShippingType: string;
    lastUpdateTimestampString: string;
    _links: Links;
}
export interface BusinessUnitServiceOffering {
    _embedded: Embedded;
    _links: Links;
}
export interface Carriers {
    name: string;
    id: number;
    code: string;
}
export interface DistanceUnit {
    code: string;
    description: string;
}
export interface RequestPayload {
    agreementName: string;
    mileageProgramName: string;
    id: number;
    agreementDefaultIndicator: string;
    contractDefault: string;
    businessUnitCodes: string[];
    customerAgreementContracts: CustomerAgreementContracts[];
    customerAgreementSections: CustomerAgreementContractSections[];
    carriers: Carriers[];
    distanceUnit: DistanceUnit;
    decimalPrecisionIndicator: string;
    mileageBorderMileParameterType: BorderCrossingParameters;
    effectiveDate: string;
    expirationDate: string;
    mileageProgramNoteText: string;
    geographicPointType: GeographicPointType;
    mileageRouteType: RouteType;
    mileageCalculationType: CalculationType;
    mileageSystem: MileageSystem;
    mileageSystemVersion: MileageSystemVersions;
    mileageSystemParameters: MileageSystemParameters[];
}
export interface Match {
    CarrierStatus?: string;
    LegalName?: string;
    CarrierCode?: string;
}
export interface MatchQuery {
    //  match: Match;
    query_string?: QueryStr;
}
export interface Must {
    match?: Match;
    bool?: Bool;
}
export interface Bool {
    must?: Must[];
    should?: MatchQuery[];
}
export interface Query {
    bool: Bool;
}
export interface CarrierReqQuery {
    query: Query;
    from: number;
    size: number;
    _source: string[];
}
export interface QueryStr {
    fields: string[];
    query: string;
}
export interface CustomerAgreementContractSections {
    customerAgreementContractSectionID?: number;
    customerAgreementContractSectionName?: string;
    customerAgreementContractID?: number;
    customerContractName?: string;
}

export interface CanComponentDeactivate {
    canDeactivate: (component, route, state, nextState) => Observable<boolean> | Promise<boolean> | boolean;
}

export interface CarriersItem {
    id: number;
    code: string;
}
export interface CarriersInterface {
    label: CarriersItem;
    value: string;
}
export interface TabEventInterface {
    index: number;
    option: MultiSelectDropdownList;
}
export interface BorderMileParameter {
    mileageBorderMileParameterTypeID: number;
    mileageBorderMileParameterTypeName: string;
}
export interface EditMileageDetails {
    customerMileageProgramID: number;
    customerMileageProgramVersionID: number;
    customerAgreementID: number;
    customerAgreementName: string;
    mileageProgramName: string;
    mileageType: string;
    financeBusinessUnitAssociations: string[];
    agreementDefaultIndicator: string;
    contractAssociations: EditContractAssociation[];
    sectionAssociations: CustomerAgreementContractSections[];
    mileageSystemID: number;
    mileageSystemName: string;
    mileageSystemVersionID: number;
    mileageSystemVersionName: string;
    unitOfDistanceMeasurementCode: string;
    geographicPointTypeID: number;
    geographicPointTypeName: string;
    mileageRouteTypeID: number;
    mileageRouteTypeName: string;
    mileageCalculationTypeID: number;
    mileageCalculationTypeName: string;
    mileageBorderMileParameterTypeID: number;
    mileageBorderMileParameterTypeName: string;
    decimalPrecisionIndicator: string;
    carrierAssociations: CarrierAssociation[];
    mileageSystemParameters: MileageSystemParameters[];
    effectiveDate: string;
    expirationDate: string;
    customerMileageProgramNoteID: number;
    mileageProgramNoteText: string;
    createUserId: string;
    createTimestamp: string;
    createProgramName: string;
    originalEffectiveDate: string;
    originalExpirationDate: string;
    invalidIndicator: string;
    invalidReasonType: string;
    inactivateLevelID: number;
    lastUpdateUserId: string;
    lastUpdateTimestamp: string;
    lastUpdateProgramName: string;
  }
  export interface CarrierAssociation {
    name: string;
    id: number;
    code: string;
  }
  export interface EditContractAssociation {
    contractDisplayName: string;
    contractID: number;
    contractName: string;
    contractNumber: string;
    contractType: string;
  }

