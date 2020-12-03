export interface ElasticViewResponseModel {
    took: number;
    timed_out: boolean;
    _shards: Shards;
    hits: Hits;
}
interface Shards {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
}
interface Hits {
    total: number;
    max_score: null;
    hits: HitsItem[];
}
export interface HitsItem {
    _index: string;
    _type: string;
    _id: string;
    _score: null;
    _source: Source;
    sort: string[];
}
export interface Source {
    carrierSegmentTypeName: string;
    financeBusinessUnitCode: string;
    calculationType: string;
    distanceUnit: string;
    preferenceName: string;
    programNote: string;
    geographyType: string;
    mileageSystemVersionName: string;
    createdOn: string;
    mileageType: string;
    billToAccountsAssociations: BillToAccountsAssociations[];
    originalEffectiveDate: string;
    invalidReasonType: string;
    agreementName: string;
    UniqueDocID: string;
    carrierMileageProgramName: string;
    routeType: string;
    expirationDate: string;
    sectionAssociations: SectionAssociation[];
    updatedBy: string;
    mileageID: string;
    createdProgramName: string;
    updatedOn: string;
    decimalPrecision: string;
    borderMilesParameter: string;
    mileageSystemName: string;
    originalExpirationDate: string;
    mileagePreferenceSystemDefaultIndicator: string;
    invalidIndicator: string;
    createdBy: string;
    agreementID: string;
    mileageSystemParameterAssociations: SystemParameterAssociation[];
    updatedProgramName: string;
    agreementDefault: string;
    carrierAssociations: CarrierAssociation[];
    borderCrossingFlag: string;
    effectiveDate: string;
    copyIndicator: string;
}
export interface SectionAssociation {
    sectionName?: string;
    carrierAgreementSectionID?: number;
}
export interface CarrierAssociation {
    carrierCode: string;
    carrierID: number;
    carrierName: string;
}
export interface SystemParameterAssociation {
    mileageSystemParameterName: string;
    mileageSystemParameterID: number;
}
export interface BillToAccountsAssociations {
    billToAccountId: number;
    billToAccountName: string;
}
