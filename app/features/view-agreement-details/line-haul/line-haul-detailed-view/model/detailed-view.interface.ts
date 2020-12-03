export interface LineHaulValues {
  customerLineHaulConfigurationID: number;
    laneID: number;
    lineHaulSourceTypeID: number;
    lineHaulSourceTypeName: string;
  origin: object;
  destination: object;
  stops: Array<object>;
  stopChargeIncludedIndicator: boolean;
  status: string;
  effectiveDate: string;
  expirationDate: string;
  customerAgreementID: number;
  customerAgreementName: string;
  customerAgreementContractID: number;
  customerAgreementContractNumber: string;
  customerAgreementContractName: string;
  customerAgreementContractSectionID: number;
  customerAgreementContractSectionName: string;
  financeBusinessUnitServiceOfferingAssociationID: number;
  financeBusinessUnitName: string;
  serviceOfferingCode: string;
  serviceOfferingBusinessUnitTransitModeAssociationID: number;
  transitMode: string;
  serviceLevelBusinessUnitServiceOfferingAssociationID: number;
  serviceLevelCode: string;
  equipment: EquipmentValues;
  operationalServices: Array<OperationalServiceValues>;
  priorityLevelNumber: number;
  overriddenPriority: number | string;
  lineHaulAwardStatusTypeID: number;
  lineHaulAwardStatusTypeName: string;
  rates: Array<object>;
  groupRateType: string;
  groupRateItemizeIndicator: boolean;
  sourceID: number;
  sourceLineHaulID: number;
  overiddenPriorityLevelNumber: number;
  billTos: Array<object>;
  carriers: Array<object>;
  mileagePreference: object;
  lineHaulMileageRangeMinQuantity: number;
  lineHaulMileageRangeMaxQuantity: number;
  unitOfMeasurement: object;
  hazmatIncludedIndicator: string;
  fuelIncludedIndicator: string;
  autoInvoiceIndicator: string;
  equipmentClassificationCode: string;
  equipmentClassificationCodeDescription: string;
  equipmentTypeCode: string;
  equipmentTypeCodeDescription: string;
  equipmentLengthQuantity: number;
  unitOfEquipmentLengthMeasurementCode: number | string;
  recordStatus: string;
}
export interface OperationalServiceValues {
  serviceTypeCode: string;
}
export interface EquipmentValues {
  equipmentRequirementSpecificationAssociationID: number;
  equipmentClassificationCode: string;
  equipmentTypeCode: string;
  equipmentLengthQuantity: number;
  unitOfEquipmentLengthMeasurementCode: string;
}
export interface AgreementDetails {
  customerAgreementName: string;
  lineHaulConfigurationID: number;
}
export interface AgreementDetailsInterface {
  customerAgreementName: string;
  lineHaulConfigurationID: number;
  agreementId: number;
}
export interface EquipmentTypeInterface {
  equipmentTypeCode: string;
  equipmentTypeDescription: string;
  equipmentClassificationTypeAssociations: Array<object>;
  effectiveTimestamp: string;
  expirationTimestamp: string;
  lastUpdateTimestampString: string;
  _links: object;
}
