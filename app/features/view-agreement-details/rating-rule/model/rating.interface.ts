export interface RootObject {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits;
}
export interface Shards {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}

export interface Hits {
  total: number;
  max_score: number;
  hits: HitItems[];
}

export interface HitItems {
  index: string;
  _type: string;
  _id: string;
  _score: string;
  _source: Source;
  sort: Array<string>;
}

export interface Source {
  UniqueDocID: number;
  AgreementID: number;
  AgreementDefaultIndicator: string;
  CitySubstitutionValue: number;
  CitySubstitutionMesurementUnit: string;
  CongestionChargeType: string;
  FlatRateWithStopsType: string;
  HazmatChargeRulesType: string;
  Contract?: string[];
  FinanceBusinessUnitServiceOfferingAssociations?: Associations[];
  ContractAssociations?: Associations[];
  SectionAssociations?: Associations[];
  RatingRuleInvalidIndicator: string;
  RatingRuleInvalidReasonType: string;
  RatingRuleEffectiveDate: string;
  RatingRuleExpirationDate: string;
  RatingRuleType: string;
}

export interface Associations {
  ContractID?: number;
  ContractName?: string;
  ContractType?: string;
  ContractNumber?: string;
  ContractDisplayName?: string;
  FinanceBusinessUnitServiceOfferingAssociationID?: number;
  FinanceBusinessUnitCode?: string;
  ServiceOfferingCode?: string;
  FinanceBusinessUnitServiceOfferingDisplayName?: string;
  SectionID?: number;
  SectionName?: string;
}

export interface RatingRuleDetail {
  status?: string;
  customerRatingRuleID?: number;
  citySubstitutionIndicator?: string;
  citySubstitutionRadiusValue?: number;
  citySubstitutionUnitofLengthMesurement?: number;
  effectiveDate?: string;
  expirationDate?: string;
  customerRatingRuleConfigurationViewDTOs?: CustomerRatingRuleConfiguration[];
  agreementDefaultFlag?: string;
  businessUnitServiceOfferingViewDTOs?: BusinessUnitServiceOffering[];
  customerAgreementContractAssociationViewDTOs?: CustomerAgreementContractAssociation[];
  customerAgreementContractSectionAssociationViewDTOs?: CustomerAgreementContractSectionAssociation[];
}

export interface CustomerRatingRuleConfiguration {
  ruleCriteriaID: number;
  ruleCriteriaName: string;
  ruleCriteriaValueID: number;
  ruleCriteriaValueName: string;
}

export interface BusinessUnitServiceOffering {
  financeBusinessUnitCode: string;
  financeBusinessUnitServiceOfferingAssociationID: number;
  serviceOfferingCode: string;
}

export interface CustomerAgreementContractAssociation {
  customerAgreementContractID: number;
  customerContractName: string;
}

export interface CustomerAgreementContractSectionAssociation {
  customerAgreementContractSectionID: number;
  customerAgreementContractSectionName: string;
}

export interface CheckRatingRuleParam {
  customerAgreementID: number;
}
