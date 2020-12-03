export interface RootObject {
    took: number;
    timed_out: boolean;
    _shards: Shards;
    hits: Hits[];
}
export interface Shards {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
}
export interface Source {
    FuelProgram: FuelProgramInterface;
    uniqueDocID: string;
    AgreementID: number;
    AgreementName?: string;
    AgreementDefaultIndicator?: string;
    ContractAssociations: Array<ContractsInterface>;
    SectionAssociations: Array<SectionInterface>;
    FinanceBusinessUnitServiceOfferingAssociations: Array<BusinessUnitInterface>;
    BillToAccountAssociations: Array<BillToInterface>;
    CarrierAssociations: Array<CarrierInterface>;
    EffectiveDate: string;
    ExpirationDate: string;
    businessUnit: Array<string>;
    carrier: Array<string>;
}
export class FuelProgramInterface {
    LastUpdateUserID: string;
    FuelProgramID: number;
    FuelProgramStatus: string;
    CreateUserID: string;
    FuelProgramType: string;
    Conditions: string;
    CreateProgramName: string;
    FuelPriceBasis: object;
    CreatedDate: string;
    FuelProgramVersionID: number;
    FuelCalculationDetails: object;
    FuelProgramName: string;
    LastUpdateProgramName: string;
    LastUpdateDate: string;
}
export interface ContractsInterface {
    ContractNumber: number;
    ContractDisplayName: string;
    ContractType: string;
    ContractID: number;
    ContractName: string;
}
export interface SectionInterface {
    SectionName: string;
    SectionID: number;
}
export interface BusinessUnitInterface {
    FinanceBusinessUnitCode: string;
    ServiceOfferingCode: string;
    FinanceBusinessUnitServiceOfferingAssociationID: number;
    FinanceBusinessUnitServiceOfferingDisplayName: string;
}
export interface BillToInterface {
    BillingPartyID: number;
    BillingPartyName: string;
    BillingPartyCode: string;
}
export interface CarrierInterface {
    CarrierID: number;
    CarrierName: string;
    CarrierCode: string;
}
export interface Hits {
    _index: string;
    _type: string;
    _id: string;
    _version: number;
    found: boolean;
    _source: Source;
}
export interface AgreementDetails {
    customerAgreementID: number;
    customerAgreementName: string;
    agreementType: string;
    ultimateParentAccountID: number;
    currencyCode: string;
    cargoReleaseAmount: number | string;
    businessUnits: string[];
    taskAssignmentIDs: number[];
    effectiveDate: string;
    expirationDate: string;
    invalidIndicator: string;
    invalidReasonTypeName: string;
}
