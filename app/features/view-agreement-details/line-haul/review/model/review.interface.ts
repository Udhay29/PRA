export interface AgreementDetails {
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
export interface CustomerAgreementNameConfigurationID {
    customerAgreementName: string;
    customerLineHaulConfigurationID: number;
}
export interface PublishResponseDto {
    status: string;
    message: string;
    customerLineHaulConfigurationID: number;
}

export interface LineHaulstatus {
    isLineHaulEdit: boolean;
  }

  export interface EditLineHaulData {
    lineHaulDetails: any;
    isEditFlag: boolean;
  }

  export interface ReviewWizardStatus {
      isLaneCardInfo: boolean;
      isLineHaulReviewed: boolean;
      isAdditionalInfo: boolean;
  }

