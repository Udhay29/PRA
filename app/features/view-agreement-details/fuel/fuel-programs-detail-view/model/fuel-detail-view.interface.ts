export interface AgreementDetails {
    customerAgreementID: number;
    customerAgreementName: string;
    agreementType: string;
    ultimateParentAccountID: number;
    currencyCode: string;
    cargoReleaseAmount: number | string;
    businessUnits: string[];
    taskAssignmentIDs: number[];
    effectiveDate: string;
    expirationDate: string;
    invalidIndicator: string;
    invalidReasonTypeName: string;
}
