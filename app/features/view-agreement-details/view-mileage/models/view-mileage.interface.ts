export interface Column {
  label: string;
  field: string;
  isArray: boolean;
}
export interface QueryMock {
  sourceData: string;
}
export interface ViewMileageQueryModel {
  size: number;
  from: number;
  _source: string[];
  query: Query;
  sort: any[];
}
export interface Query {
  bool: Bool;
}
export interface Bool {
  must: MustItem[];
}
export interface MustItem {
  query_string?: Querystring;
  range?: Range;
}
export interface Range {
  expirationDate: ExpirationDate;
}
export interface ExpirationDate {
  gte: string;
}
export interface Querystring {
  default_field: string;
  query: string;
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
export interface EditContractAssociation {
  contractDisplayName: string;
  contractID: number;
  contractName: string;
  contractNumber: string;
  contractType: string;
}
export interface CustomerAgreementContractSections {
  customerAgreementContractSectionID?: number;
  customerAgreementContractSectionName?: string;
  customerAgreementContractID?: number;
  customerContractName?: string;
}
export interface CarrierAssociation {
  name: string;
  id: number;
  code: string;
}
export interface MileageSystemParameters {
  mileageSystemParameterID: number;
  mileageSystemParameterName: string;
  mileageSystemParameterAssociationID?: number;
  mileageParameterSelectIndicator: string;
  effectiveDate?: string;
  expirationDate?: string;
}
