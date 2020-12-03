import { Observable } from 'rxjs';
export interface RootObject {
  _embedded: Embedded;
  _links: Links;
  page?: Page;
}
export interface Embedded {
  ruleCriterias?: RuleCriteriasItem[];
  serviceOfferingBusinessUnitTransitModeAssociations?: ServiceOfferingBusinessUnitTransitModeAssociationsItem[];
}
export interface ServiceOfferingBusinessUnitTransitModeAssociationsItem {
  financeBusinessUnitServiceOfferingAssociation: FinanceBusinessUnitServiceOfferingAssociation;
  transitMode: TransitMode;
  utilizationClassification: UtilizationClassification;
  freightShippingType: FreightShippingType;
  lastUpdateTimestampString: string;
  _links: Links;
}
export interface SectionList {
  customerAgreementContractSectionID: number;
  customerAgreementContractSectionName: string;
  customerAgreementContractID: number;
  customerContractName: string;
  customerContractNumber: string;
  contractTypeName: string;
  effectiveDate: string;
  expirationDate: string;
}
export interface TransitMode {
  transitModeCode: string;
  transitModeDescription: string;
  lastUpdateTimestampString: string;
}
export interface UtilizationClassification {
  utilizationClassificationCode: string;
  utilizationClassificationDescription: string;
  lastUpdateTimestampString: string;
}
export interface FreightShippingType {
  freightShippingTypeCode: string;
  freightShippingTypeDescription: string;
  lastUpdateTimestampString: string;
}
export interface FinanceBusinessUnitServiceOfferingAssociation {
  financeBusinessUnitServiceOfferingAssociationID: number;
  financeBusinessUnitCode: string;
  serviceOfferingCode: string;
  effectiveTimestamp: string;
  expirationTimestamp: string;
  lastUpdateTimestampString: string;
}
export interface RuleCriteriasItem {
  ruleCriteriaID: number;
  ruleCriteriaName: string;
  ruleCriteriaValues: RuleCriteriaValuesItem[];
  _links: Links;
}
export interface RuleCriteriaValuesItem {
  ruleCriteriaValueID: number;
  ruleCriteriaValueName: string;
  ruleCriteriaID?: number | null;
  ruleCriteriaName?: string;
}
export interface Links {
  self: Self;
  ruleCriteria: Self;
  profile?: Self;
  search?: Self;
  serviceOfferingBusinessUnitTransitModeAssociation?: Self;
}
export interface Self {
  href: string;
  templated?: boolean;
}
export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
export interface RuleCriteriaItem {
  name: string;
  values: RuleCriteriaValuesItem[];
}
export interface SaveRequest {
  citySubstitutionIndicator: string;
  citySubstitutionRadiusValue: number | null;
  citySubstitutionUnitofLengthMesurement: string | null;
  effectiveDate: string;
  expirationDate: string;
  customerRatingRuleConfigurationInputDTOs: RuleCriteriaValuesItem[];
  customerRatingRuleBusinessUnitAssociationInputDTOs: ListValue[] | null;
  customerRatingRuleContractAssociationInputDTOs: SaveContractsItem[] | null;
  customerRatingRuleSectionAssociationInputDTOs: SectionSaveItem[] | null;
  ratingRuleAction: string;
  ratingRuleLevel: string;
  dateChanged: boolean;
  customerRatingRuleIDs: number[] | null;
}
export interface EditRequest {
  citySubstitutionIndicator: string;
  citySubstitutionRadiusValue: number;
  citySubstitutionUnitofLengthMesurement: string;
  effectiveDate: string;
  expirationDate: string;
  customerRatingRuleConfigurationInputDTOs: RuleCriteriaValuesItem[];
  businessUnitServiceOfferingInputDTOs: BusinessUnitServiceOfferingInputDTOs[] | null;
  customerAgreementContractAssociationInputDTOs: SaveContractsItem[] | null;
  customerAgreementContractSectionAssociationInputDTOs: SectionSaveItem[] | null;
  ratingRuleAction: string;
  ratingRuleLevel: string;
  dateChanged: boolean;
  customerRatingRuleIDs: number[] | null;
}
export interface CustomerAgreementContractSectionAssociationInputDTOs {
  customerAgreementContractSectionID: number;
  customerAgreementContractSectionName: string;

}
export interface CustomerAgreementContractAssociationInputDTOs {
  customerAgreementContractID: number;
  customerAgreementContractName: string;
  customerAgreementContractType: string;
  customerAgreementContractNumber: string;
}
export interface BusinessUnitServiceOfferingInputDTOs {
  financeBusinessUnitServiceOfferingAssociationID: number;
  financeBusinessUnitCode: string;
  serviceOfferingCode: string;
}
export interface CustomerRatingRuleConfigurationInputDTOs {
  ruleCriteriaID: number;
  ruleCriteriaName: string;
  ruleCriteriaValueID: number;
  ruleCriteriaValueName: string;
}

export interface CanComponentDeactivate {
  canDeactivate: (component, route, state, nextState) => Observable<boolean> | Promise<boolean> | boolean;
}
export interface RatingRuleDetails {
  agreementId: number;
  isAgreementDefault: boolean;
  isCreate: boolean;
  ratingRuleId?: number;
}
export interface AgreementDetails {
  customerAgreementID: number;
  customerAgreementName: string;
  agreementType: string;
  ultimateParentAccountID: number;
  currencyCode: string;
  cargoReleaseAmount: number;
  businessUnits: string[];
  taskAssignmentIDs: number[];
  effectiveDate: string;
  expirationDate: string;
  invalidIndicator: string;
  invalidReasonTypeName: string;
}
export interface ListItem {
  label: string;
  value: ListValue;
}
export interface ListValue {
  financeBusinessUnitServiceOfferingAssociationID: number;
  financeBusinessUnitCode: string;
  serviceOfferingCode: string;
  financeBusinessUnitServiceOfferingDisplayName: string;
}
export interface AffiliationEvent {
  originalEvent: Event;
  value: string;
}
export interface ContractsListItem {
  customerAgreementContractID: number;
  customerAgreementContractTypeID: number;
  customerContractName: string;
  contractTypeName: string;
  customerContractNumber: string | null;
  effectiveDate: string;
  expirationDate: string;
}
export interface DateFormat {
  date: DateObject;
}
export interface DateObject {
  year: number;
  month: number;
  day: number;
}
export interface ContractTableFormat {
  effectiveDate: string;
  expirationDate: string;
  display: string;
  saveData: SaveContractsItem;
}
export interface SaveContractsItem {
  contractID: number;
  contractName: string;
  contractType: string;
  contractNumber: string | null;
  contractDisplayName: string;
}
export interface SectionTableFormat {
  effectiveDate: string;
  expirationDate: string;
  contractDetail: string;
  sectionDetail: string;
  sectionSaveData: SectionSaveItem;
}
export interface SectionSaveItem {
  sectionID: string;
  sectionName: string;
}
