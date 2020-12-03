export class ChargeCodeInterface {
  label: string;
  value: number;
  description: string;
}
export interface ChargeCodeResponseInterface {
  content: [ContentInterface];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: string;
  totalElements: number;
  totalPages: number;
}

export interface ContentInterface {
  chargeTypeBusinessUnitServiceOfferingAssociations: [object];
  chargeTypeCode: string;
  chargeTypeDescription: string;
  chargeTypeID: number;
  chargeTypeName: string;
}

export interface DropDownInterface {
  value: string;
  label: string;
}
export interface CurrencyCodeInterface {
  label: string;
  value: string;
}

export interface BusinessUnitAssociation {
  financeBusinessUnitServiceOfferingAssociationID: number;
  financeBusinessUnitCode: string;
  serviceOfferingCode?: string;
  serviceOfferingDescription?: string;
  effectiveTimestamp: string;
  expirationTimestamp: string;
  lastUpdateTimestampString: string;
}
export interface SoBuAssociation {
  financeBusinessUnitServiceOfferingAssociation: BusinessUnitAssociation;
  transitMode: string;
  utilizationClassification: string;
  freightShippingType: string;
  lastUpdateTimestampString: string;
  _links: object;
}
export interface BusinessUnitEmbedded {
  serviceOfferingBusinessUnitTransitModeAssociations: Array<SoBuAssociation>;
}
export interface BuSoAssociation {
  chargeTypeBusinessUnitServiceOfferingAssociationID: null;
  financeBusinessUnitServiceOfferingAssociationID: number;
  serviceOfferingCode: string;
  serviceOfferingDescription: string;
  transitModeId: number;
  transitModeCode: string;
  transitModeDescription: string;
  financeBusinessUnitCode: string;
}
export interface BusinessUnit {
  _embedded: BusinessUnitEmbedded;
  _links: object;
}
export class BusinessUnitInterface {
  label: string;
  value: object;
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
  financeBusinessUnitServiceOfferingAssociation: BusinessUnitAssociation;
  lastUpdateTimestampString: string;
  serviceLevelBusinessUnitServiceOfferingAssociationID: string;
  _links: object;
}
export interface ServiceLevelValues {
  serviceLevelCode: string;
  serviceLevelDescription: string;
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
  equipmentClassificationTypeAssociations?: Array<object>;
  equipmentDimensions?: Array<object>;
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
export interface EquipmentTypeList {
  label: string;
  value: string;
  id?: number;
}
export interface EquipmentLengthDropDown {
  label: string;
  value: string;
  id: number;
  specificationId?: number;
  code?: string;
}
export interface CarrierInterface {
  CarrierCode: string;
  CarrierID: number;
  LegalName: string;
}
export interface HitsInterface {
  total: number;
  max_score: number;
  hits: HitsItem[];
}
export interface HitsItem {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: object;
}
export interface CarriersItem {
  code: string;
  id: number;
  name: string;
}
export interface CarriersInterface {
  label: string;
  value: CarriersItem;
}
