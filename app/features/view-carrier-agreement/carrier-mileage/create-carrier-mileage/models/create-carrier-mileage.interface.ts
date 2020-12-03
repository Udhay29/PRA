import { Observable } from 'rxjs';
import { QueryString } from '../../../../create-agreement/agreement-details/model/agreement-details.interface';
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
}
export interface BorderCrossingParameter {
    borderCrossingParameterID: number;
    borderCrossingParameterName: string;
}
export interface BorderCrossingParameterDefault {
    mileageBorderMileParameterTypeID: number;
    mileageBorderMileParameterTypeName: string;
}
export interface DomainAttributesType {
    mileageCalculationTypes: CalculationType[];
    mileageRouteTypes: RouteType[];
    geographicPointType: GeographicPointType[];
    mileageSystems: MileageSystem[];
    borderCrossingParameter: BorderCrossingParameter;
    unitOfLengthMeasurements: DistanceUnit[];
}
export interface DropdownListType {
    label: number;
    value: string;
}
export interface BusinessUnitDropdownListType {
    label: string;
    value: string;
}
export interface CarrierListType {
    label: CarrierLabel;
    value: string;
    displayName: string;
}
export interface CarrierLabel {
    id: number;
    code: string;
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
export interface CarrierAgreementLink {
    href: string;
    templated?: boolean;
}
export interface Links {
    self?: Self;
    agreementStatus?: AgreementStatusLink;
    carrierAgreement?: CarrierAgreementLink;
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
export interface CarrierAgreement {
    expirationDate: string;
    carrierAgreementID: number;
    effectiveDate: string;
    carrierAgreementName: string;
    agreementStatus: AgreementStatus;
    _links: Links;
}

export interface CarrierAgreementType {
    carrierSegmentID: string;
    carrierSegmentName: string;
}
export interface Embedded {
    carrierAgreement?: CarrierAgreement;
    unitOfLengthMeasurements?: UnitOfLengthMeasurement[];
    serviceOfferingBusinessUnitTransitModeAssociations?: ServiceOfferingBusinessUnitTransitModeAssociations[];
}
export interface CarrierAgreementOwnerships {
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
    carrierAgreementName: string;
    carrierAgreementID: number;
    agreementName: string;
    agreementType: string;
    effectiveDate: string;
    expirationDate: string;
    carrierAgreementOwnerships: CarrierAgreementOwnerships[];
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

export interface RootObjectCarrier {
    _embedded: Embedded;
    _links?: Links;
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
    carrierName: string;
    carrierID: number;
    carrierCode: string;
}
export interface DistanceUnit {
    code: string;
    description: string;
}
export interface RequestPayload {
    carrierSegment: CarrierAgreementType;
    carrierAgreementName: string;
    agreementTypeName: string;
    carrierAgreementID: number;
    mileageProgramName: string;
    carrierMileageProgramID: number;
    copied: string;
    lineHaulOverrideIndicator: string;
    agreementDefaultIndicator: string;
    financeBusinessUnitCode: string;
    carriers: Carriers[];
    distanceUnit: DistanceUnit;
    decimalPrecisionIndicator: string;
    borderCrossingParameter: BorderCrossingParameter;
    effectiveDate: string;
    expirationDate: string;
    notes: string;
    geographicPointType: GeographicPointType;
    mileageRouteType: RouteType;
    mileageCalculationType: CalculationType;
    mileageSystem: MileageSystem;
    mileageSystemVersion: MileageSystemVersions;
    mileageSystemParameters: MileageSystemParameters[];
    billToAccounts: BillToAccounts[];
    sections: Sections[];
}
export interface Match {
    CarrierStatus?: string;
    LegalName?: string;
    CarrierCode?: string;
}
export interface MatchQuery {
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
export interface DocumentationLevelInterface {
    label: string;
    value: string;
    id?: number;
    disabled?: boolean;
}
export interface Column {
    label: string;
    value: string;
    tooltip: string;
}
export interface CarrierSegmentTypesItem {
    carrierSegmentTypeID: string;
    carrierSegmentTypeName: string;
    defaultBusinessUnitCode: string;
    effectiveDate: string;
    expirationDate: string;
    defaultIndicator: string;
}
export interface DefaultFieldValues {
    carrierSegment: DefaultFieldValuesItems;
    distanceUnit: DefaultFieldValuesItems;    geographyType: DefaultFieldValuesItems;
    routeType: DefaultFieldValuesItems;
    calculationType: DefaultFieldValuesItems;
}
export interface DefaultFieldValuesItems {
    label: 1;
    value: string;
    reqKey: string;
}
export interface CodesTableColumns {
    label: CodesTableColumnsLabel;
    value: string;
    tooltip: string;
    displayName: string;
}
export interface CodesTableColumnsLabel {
    id: string;
    code: string;
}
export interface BillToAccounts {
    billToAccountCode: number;
    billToAccountID: number;
    billToAccountName: string;
}
export interface Sections {
    carrierAgreementSectionID: number;
    sectionName: string;
}
