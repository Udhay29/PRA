export interface RuleTypeInterface {
    label: string;
    value: number;
}

export interface RuleType {
    _embedded: RuleTypeValue;
    _links: object;
    page: Page;
}

export interface RuleTypeValue {
    accessorialRuleTypes: AccessorialRuleTypesItem[];
}
export interface EditBillToValueInterface {
  customerAgreementID: number;
  customerAgreementName: string;
  effectiveDate: string;
  expirationDate: string;
  customerAgreementContractSectionAccountID: number;
  billingPartyID: number;
  customerAgreementContractSectionID: number;
  customerAgreementContractSectionName: string;
  customerAgreementContractID: number;
  customerContractName: string;
  billToID: number;
  billToCode: string;
  billToName: string;
  contractNumber: string;
}

export interface EditRequestedServiceResponse    {
  customerAccessorialRequestServiceId: number;
 requestedServiceTypeId: number;
 requestedServiceTypeCode: string;
 requestedServiceTypeDescription: string;
}

export interface AccessorialRuleTypesItem {
    '@id': number;
    createTimestamp: string;
    createProgramName: string;
    lastUpdateProgramName: string;
    createUserId: string;
    lastUpdateUserId: string;
    accessorialRuleTypeName: string;
    effectiveDate: string;
    expirationDate: string;
    lastUpdateTimestampString: string;
    _links: object;
}

export interface EditRuleAccesorialData {
  editRuleData: object;
  isAccessorialRuleEdit: boolean;
  refreshDocumentResponse: object;
  ruleConfigurationId: number;
}
export interface EditRequestedServiceResponse    {
  customerAccessorialRequestServiceId: number;
  requestedServiceTypeId: number;
  requestedServiceTypeCode: string;
  requestedServiceTypeDescription: string;
}
export interface EditAlternateChargeResponse {
  customerAccessorialRuleAlternateChargeId: number;
  accessorialRuleAlternateChargeQuantityTypeId: number;
  accessorialRuleAlternateChargeQuantityTypeName: string;
  alternateChargeTypeId: number;
  alternateChargeTypeName: string;
  alternateChargeCode: string;
  customerAlternateChargeThresholdQuantity: number;
}
export interface EditRequestedServiceResponse    {
  customerAccessorialRequestServiceId: number;
 requestedServiceTypeId: number;
 requestedServiceTypeCode: string;
 requestedServiceTypeDescription: string;
}
export interface BuSoAssociation {
  financeBusinessUnitServiceOfferingAssociationID: number;
  serviceOfferingCode: string;
  serviceOfferingDescription: string;
  transitModeId: number;
  transitModeCode: string;
  transitModeDescription: string;
  financeBusinessUnitCode: string;
  chargeTypeBusinessUnitServiceOfferingAssociationID?: number;
}

export interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export interface ChargeCodeResponseInterface {
    chargeTypeID: number;
    chargeTypeCode: string;
    chargeTypeName: string;
    chargeTypeDescription: string;
    chargeTypeBusinessUnitServiceOfferingAssociations: ChargeTypeBusinessUnitServiceOfferingAssociationsItem[];
}
export interface ChargeTypeBusinessUnitServiceOfferingAssociationsItem {
    chargeTypeBusinessUnitServiceOfferingAssociationID: number;
    chargeTypeID: null;
    financeBusinessUnitServiceOfferingAssociation: FinanceBusinessUnitServiceOfferingAssociation;
    financeChargeUsageTypeID: number;
    effectiveDate: string;
    expirationDate: string;
}
export interface FinanceBusinessUnitServiceOfferingAssociation {
    financeBusinessUnitServiceOfferingAssociationID: number;
    financeBusinessUnitCode: string;
    serviceOfferingCode: string;
}

export class ChargeCodeInterface {
    label: string;
    value: number;
    description: string;
}

export interface CreateDocumentationInterface {
    documentationContent: string;
    documentationText: string;
    cancelText: string;
}

export interface ErrorMessage {
    severity: string;
    summary: string;
    detail: string;
}

export interface AveragingTimeFrame {
    _embedded: TimeFrame;
    _links: object;
    page: Page;
}
export interface TimeFrame {
    pricingAveragePeriodTypes: PricingAveragePeriodTypesItem[];
}
export interface PricingAveragePeriodTypesItem {
    '@id': number;
    createTimestamp: string;
    createProgramName: string;
    lastUpdateProgramName: string;
    createUserId: string;
    lastUpdateUserId: string;
    pricingAveragePeriodTypeName: string;
    effectiveDate: string;
    expirationDate: string;
    lastUpdateTimestampString: string;
    _links: object;
    pricingAveragePeriodTypeId: number;
}

export interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export interface DayOfWeek {
    label: string;
    value: string;
}

export interface DayOfWeekResponse {
    weeksInAverage: number[];
    priceChangeDayOfWeek: string[];
}

export interface SpecificDaysInterface {
    label: number;
    value: number;
}

export interface MonthlyTypes {
    label: string;
    value: number;
}

export interface GracePeriod {
    _embedded: GracePeriodMeasurement;
    _links: object;
    page: GracePeroidPage;
}
export interface GracePeriodMeasurement {
    pricingUnitOfTimeMeasurementAssociations: PricingUnitOfTimeMeasurementAssociationsItem[];
}
export interface PricingUnitOfTimeMeasurementAssociationsItem {
    '@id': number;
    createTimestamp: string;
    createProgramName: string;
    lastUpdateProgramName: string;
    createUserId: string;
    lastUpdateUserId: string;
    effectiveTimestamp: string;
    expirationTimestamp: string;
    unitOfTimeMeasurementCode: string;
    pricingFunctionalAreaID: number;
    lastUpdateTimestampString: string;
    _links: object;
}
export interface GracePeroidPage {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}
