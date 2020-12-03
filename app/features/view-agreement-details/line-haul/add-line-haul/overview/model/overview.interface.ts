export class DropDownInterface {
  code: string;
  description: string;
}
export interface DropDownValues {
  code: string;
  description: string;
  id: number;
}
export interface ServiceOfferingList {
  label: string;
  value: string;
  id: number;
}
export interface EquipmentLengthDropDown {
  label: string;
  value: string;
  id: number;
  specificationId: number;
  code: string;
}
export interface TransitMode {
  value: string;
  id: number;
}
export interface SectionInterface {
  label: string;
  value: number;
}
export interface AwardStatusList {
  label: number;
  value: string;
}
export interface OverriddenPriorityInterface {
  label: number | string;
  value: number | string;
}
export interface BusinessUnitInterface {
  label: string;
  value: string;
}
export interface ContractInterface {
  label: string;
  value: string;
  sectionId: number;
}
export interface ServiceLevel {
  _embedded: ServiceLevelEmbedded;
  _links: object;
}
export interface ServiceLevelEmbedded {
  serviceLevelBusinessUnitServiceOfferingAssociations: Array<ServiceLevelAssociation>;
}
export interface ServiceLevelAssociation {
  serviceLevel: ServiceLevelValues;
  lastUpdateTimestampString: string;
  _links: SelfAndLinks;
}
export interface ServiceLevelValues {
  serviceLevelCode: string;
  serviceLevelDescription: string;
  lastUpdateTimestampString: string;
}
export interface SelfAndLinks {
  self: object;
  serviceLevelBusinessUnitServiceOfferingAssociation: ServiceLevelAssociationId;
  financeBusinessUnitServiceOfferingAssociation: object;
}
export interface ServiceLevelAssociationId {
  href: string;
  templated: string;
}
export interface EquipmentCategory {
  _embedded: EquipmentCategoryEmbedded;
  _links: object;
}
export interface EquipmentCategoryEmbedded {
  equipmentClassifications: Array<ClassificationAssociations>;
}
export interface ClassificationAssociations {
  effectiveTimestamp: string;
  equipmentClassificationCode: string;
  equipmentClassificationDescription: string;
  equipmentFunctionalGroup: string;
  expirationTimestamp: string;
  lastUpdateTimestampString: string;
}
export interface EquipmentType {
  _embedded: EquipmentTypeEmbedded;
  _links: object;
}
export interface EquipmentTypeEmbedded {
  equipmentTypes: Array<EquipmentTypeAssociations>;
}
export interface EquipmentTypeAssociations {
  effectiveTimestamp: string;
  equipmentClassificationTypeAssociations: Array<ClassificationTypeValues>;
  equipmentTypeCode: string;
  equipmentTypeDescription: string;
  expirationTimestamp: string;
  lastUpdateTimestampString: string;
}
export interface ClassificationTypeValues {
  EquipmentClassificationTypeAssociationID: number;
  effectiveTimestamp: string;
  equipmentClassification: string;
  equipmentClassificationTypeAssociationID: number;
  expirationTimestamp: string;
  lastUpdateTimestampString: string;
}
export interface EquipmentLength {
  _embedded: EquipmentLengthEmbedded;
  _links: object;
}
export interface EquipmentLengthEmbedded {
  equipmentDimensions: Array<object>;
}
export interface OperationalService {
  serviceTypeCode: string;
  serviceCategoryCode: string;
  chargeCode: number;
  serviceTypeDescription: string;
  effectiveTimestamp: string;
  expirationTimestamp: string;
  lastUpdateTimestampString: string;
}
export interface ServiceTypeBusinessUnitServiceOfferingAssociations {
  effectiveTimestamp: string;
  expirationTimestamp: string;
  financeBusinessUnitServiceOfferingAssociation: FinanceBusinessUnitServiceOfferingAssociation;
  lastUpdateTimestampString: string;
  serviceTypeCode: string;
}
export interface FinanceBusinessUnitServiceOfferingAssociation {
  effectiveTimestamp: string;
  expirationTimestamp: string;
  financeBusinessUnitCode: string;
  financeBusinessUnitServiceOfferingAssociationID: number;
  lastUpdateTimestampString: string;
  serviceOfferingCode: string;
}
export interface AwardStatus {
  _embedded: AwardStatusEmbedded;
  _links: object;
  page: object;
}
export interface AwardStatusEmbedded {
  lineHaulAwardStatusTypes: Array<AwardStatusAssociations>;
}
export interface AwardStatusAssociations {
  awardStatusTypeID: number;
  awardStatusTypeName: string;
  _links: object;
}
export interface ServiceLevelDropDown {
  code: string;
  description: string;
  id: number;
}
export interface ServiceofferingInterface {
financeBusinessUnitServiceOfferingAssociationID: number;
serviceOfferingCode: string;
serviceOfferingDescription: string;
transitModeId: number;
transitModeCode: string;
transitModeDescription: string;
}
