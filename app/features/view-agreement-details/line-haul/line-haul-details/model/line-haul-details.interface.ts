export interface ColumnInterface {
  name: string;
  queryKey: string;
}
export interface LineHaulValues {
  customerLineHaulConfigurationID: number;
  laneID: number;
  lineHaulSourceTypeID: number;
  lineHaulSourceTypeName: string;
  originPoints: Array<OriginDestinationValues>;
  destinationPoints: Array<OriginDestinationValues>;
  stops: Array<StopValues>;
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
  overriddenPriority: number;
  lineHaulAwardStatusTypeID: number;
  lineHaulAwardStatusTypeName: string;
  rates: Array<RateValues>;
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
  destinationDescription: string;
  destinationVendorID: string;
  originDescription: string;
  originVendorID: string;
}
export interface OriginDestinationValues {
  country: string;
  point: string;
  pointID: number;
  addressLine1: string;
  addressLine2: string;
  cityName: string;
  countryCode: string;
  countryName: string;
  postalCode: string;
  stateCode: string;
  stateName: string;
  lowerBoundID: number;
  lowerBound: string;
  upperBoundID: number;
  upperBound: string;
  description: string;
  pointDisplayName: string;
  subTypeID: number;
  subTypeName: string;
}
export interface StopValues {
  stopSequenceNumber: number;
  typeName: string;
  stopTypeID: number;
  stopCountry: string;
  point: string;
  stopLocationPointID: number;
  vendorID: string;
}
export interface EquipmentValues {
  equipmentRequirementSpecificationAssociationID: number;
  equipmentClassificationCode: string;
  equipmentTypeCode: string;
  equipmentLengthQuantity: number;
  unitOfEquipmentLengthMeasurementCode: string;
}
export interface OperationalServiceValues {
  serviceTypeCode: string;
}
export interface RateValues {
  customerLineHaulRateID: number;
  customerLineHaulConfigurationID: number;
  chargeUnitTypeName: string;
  rateAmount: number;
  minimumAmount: number;
  maximumAmount: number;
  currencyCode: string;
}
export interface RateInterface {
  chargeUnitTypeName: string;
  rateAmount: number;
  currencyCode: string;
  customerLineHaulRateID: number;
  customerLineHaulConfigurationID: number;
  minimumAmount: number;
  maximumAmount: number;
}
export interface RateValuesInterface {
  chargeUnitTypeName: string;
  amount: number;
  minimumamount: number;
  maximumamount: number;
  currencyCode: string;
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
  _source: SourceObject;
}
export interface SourceObject {
  Address: AddressInterface;
}
export interface AddressInterface {
  AddressID: number;
  AddressLine1: string;
  CityName: string;
  CountryCode: string;
  CountryName: string;
  PostalCode: number;
  StateCode: string;
}
export interface CityInterface {
  hits: CityHits;
  max_score: number;
  total: number;
}
export interface CityHits {
  hits: CityHitsItem[];
}
export interface CityHitsItem {
  _id: number;
  _index: string;
  _nested: object;
  _score: number;
  _source: SourceInterface;
  _type: string;
}
export interface SourceInterface {
  city: CityInnerHitsFace;
}
export interface CityInnerHitsFace {
  CityName: string;
  State: StateCodeInterface;
}
export interface StateCodeInterface {
  StateCode: string;
}
export interface Stop {
  type?: string;
  stop?: number;
  city?: string;
  state?: string;
  country?: string;
  addressLine1?: string;
  postalCode?: number;
  stopType?: string;
  locationName?: string;
  locationCode?: string;
  pointToolTip?: string;
  vendor?: string;
}
export interface OriginDestinationInterface {
  city?: string;
  state?: string;
  country?: string;
  type?: string;
  index?: number;
  origindestination?: string;
  addressLine1?: string;
  postalCode?: number | string;
  vendor?: number;
  description?: string;
  locationCode?: string;
  locationName?: string;
  pointToolTip?: string;
}
export interface CarrierInterface {
  CarrierCode: string;
  CarrierID: number;
  LegalName: string;
}
