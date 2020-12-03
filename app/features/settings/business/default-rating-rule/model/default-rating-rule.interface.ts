export interface RootObject {
  customerRatingRuleID?: number;
  citySubstitutionIndicator: string;
  citySubstitutionRadiusValue: number;
  radiusUnitOfLengthMeasurement?: string;
  inactivateIndicator?: string;
  invalidReasonTypeName?: string;
  effectiveDateChanged?: boolean;
  effectiveDate: string;
  expirationDate: string;
  lastUpdatedTimestamp?: string;
  customerRatingRuleConfigurationViewDTOs?: ConfigurationViewDTO[];
  customerRatingRuleConfigurationInputDTOs?: ConfigurationViewDTO[];
  attributeChanged: boolean;
}

export interface ConfigurationViewDTO {
  ruleCriteriaID: number;
  ruleCriteriaName: string;
  ruleCriteriaValueID: number;
  ruleCriteriaValueName: string;
  value?: string;
}

export interface RuleCriteriaObject {
  _embedded: Embedded;
  _links: Links;
  page: Page;
}

export interface Embedded {
  ruleCriterias: RuleCrietria[];
}

export interface RuleCrietria {
  ruleCriteriaName: string;
  value?: string;
  ruleCriteriaID: number;
  ruleCriteriaValues: Rules[];
  _links: Links;
}

export interface Rules {
  ruleCriteriaValueID: number;
  ruleCriteriaValueName: string;
}

export interface Links {
  self: Self;
  ruleCriteria?: Self;
  profile?: Self;
}

export interface Self {
    href?: string;
    templated?: boolean;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface EditValue {
  name: string;
  value: string;
}
