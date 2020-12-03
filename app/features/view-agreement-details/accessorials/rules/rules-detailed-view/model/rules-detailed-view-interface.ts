export interface DocumentationReqParamInterface {
  customerChargeName: string;
  effectiveDate: string;
  expirationDate: string;
  customerAgreementId: number;
  level: number;
  accessorialDocumentTypeId: number;
  chargeTypeId: number;
  chargeTypeName: string;
  equipmentCategoryCode: string;
  equipmentLengthId: number;
  equipmentTypeId: number;
  customerAccessorialAccountDTOs: object[];
  businessUnitServiceOfferingDTOs: object[];
  requestServices: object[];
  carrierDTOs: object[];
  equipmentLengthDescription: string;
  currencyCode: string;
}
export interface AgreementDetailsInterface {
  agreementType: string;
  businessUnits: string;
  cargoReleaseAmount: number;
  currencyCode: string;
  customerAgreementID: number;
  customerAgreementName: string;
  effectiveDate: string;
  expirationDate: string;
  invalidIndicator: string;
  invalidReasonTypeName: string;
  taskAssignmentIDs: string;
  teams: string;
  ultimateParentAccountID: number;
}
export interface CustomerAccessorialRuleAdditionalChargeDTO {
  customerAccessorialRuleAdditionalChargeId: number;
  accessorialRuleTypeId: number;
  accessorialRuleTypeName: string;
  additionalChargeTypeId: number;
  additionalChargeTypeName: string;
  additionalChargeCodeName: string;
  ruleAmount: number;
}

export interface RefreshDataDTO {
  accessorialDocumentTypeName: string;
  attachments: string;
  customerAccessorialDocumentConfigurationID:  number;
  customerAccessorialDocumentTextId:  number;
  level:  number;
  text: string;
  textName: string;
}

export interface Attachments {
  customerAccessorialAttachmentId: number;
  accessorialAttachmentTypeDTO: AccessorialAttachmentTypeDTO;
  documentNumber: string;
  documentName: string;
  addedOn: string;
  addedBy: string;
  fileType: string;
}
export interface AccessorialAttachmentTypeDTO {
  accessorialAttachmentTypeId: number;
  accessorialAttachmentTypeName: string;
}
export interface CustomerAccessorialRuleAlternateChargeViewDTO {
  customerAccessorialRuleAlternateChargeId: number;
  accessorialRuleAlternateChargeQuantityTypeId: number;
  accessorialRuleAlternateChargeQuantityTypeName: string;
  alternateChargeTypeId: number;
  customerAlternateChargeThresholdQuantity: number;
  alternateChargeTypeName: string;
  alternateChargeCode: string;
}
export interface CustomerAccessorialRuleChargeDTO {
  customerAccessorialRuleChargeId: number;
  accessorialRuleTypeId: number;
  accessorialRuleTypeName: string;
  accessorialRuleRoundingTypeId: number;
  accessorialRuleRoundinTypeName: string;
  ruleAmount: number;
  minimumAmount: number;
  maximumAmount: number;
  ruleOperator: string;
}

export interface Documentation {
  docIsLegalText: boolean;
  docIsInstructionalText: boolean;
  isRefreshClicked: boolean;
  isValidFormFields: boolean;
  noDocumentationFound: boolean;
  instructionalTextArea: string;
  legalTextArea: string;
  documentTypeID: number;
  isEditRateClicked: boolean;
  legalAttachments: object[];
  instructionalAttachments: object[];
  attachments: object [];
  legalStartDate: string;
  legalEndDate: string;
  instructionStartDate: string;
  instructionEndDate: string;
}
