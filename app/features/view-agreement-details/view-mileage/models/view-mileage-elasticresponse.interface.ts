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
  uniqueDocID: string;
  agreementDefaultIndicator: string;
  agreementID: number;
  agreementName: string;
  mileageBorderMileParameterTypeID: number;
  mileageBorderMileParameterTypeName: string;
  mileageCalculationTypeName: string;
  customerMileageProgramBusinessUnits: BusinessUnitAssociation[];
  customerMileageProgramCarrierAssociations: CarrierAssociation[];
  customerMileageProgramContractAssociations: ContractAssociation[];
  customerMileageProgramSectionAssociations: SectionAssociation[];
  mileageSystemParameters: SystemParameterAssociation[];
  createUserID: string;
  createTimestamp: string;
  createProgramName: string;
  decimalPrecisionIndicator: string;
  unitOfDistanceMeasurementCode: string;
  effectiveDate: string;
  expirationDate: string;
  geographyType: string;
  inactivateLevelID: number;
  invalidIndicator: string;
  invalidReasonType: string;
  customerMileageProgramID: number;
  mileageProgramName: string;
  customerMileageProgramVersionID: number;
  mileageProgramSystemDefaultIndicator: string;
  mileageProgramType: string;
  customerMileageProgramNoteID: string;
  mileageProgramNoteText: string;
  originalEffectiveDate: string;
  originalExpirationDate: string;
  mileageRouteTypeName: string;
  mileageSystemName: string;
  mileageSystemVersionName: string;
  lastUpdateUserID: string;
  lastUpdateTimestamp: string;
  lastUpdateProgramName: string;
}
export interface SectionAssociation {
  customerAgreementContractSectionName?: string;
  customerAgreementContractSectionID?: number;
}
export interface CarrierAssociation {
  carrierCode: string;
  carrierID: number;
  carrierName: string;
  carrierDisplayName?: string;
}
export interface BusinessUnitAssociation {
  financeBusinessUnitCode: string;
}
export interface SystemParameterAssociation {
  mileageSystemParameterName: string;
  mileageSystemParameterID: string;
  mileageParameterSelectIndicator?: string;
}
export interface ContractAssociation {
  customerContractDisplayName: string;
  customerContractTypeName: string;
  customerAgreementContractID: number;
  customerContractNumber: string;
  customerContractName: string;
}
