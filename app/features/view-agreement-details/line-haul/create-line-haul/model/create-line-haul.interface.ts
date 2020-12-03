
import { Observable } from 'rxjs';
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
export interface LineHaulSourceList {
  label: string;
  value: string;
}
export interface CanComponentDeactivate {
  canDeactivate: (component, route, state, nextState) => Observable<boolean> | Promise<boolean> | boolean;
}
export interface ErrorMessage {
  severity: string;
  summary: string;
  detail: string;
}
export interface SaveResponseDto {
  customerSectionID: number;
  customerSectionName: string;
  customerContractID: number;
  customerContractName: string;
  sectionEffectiveDate: string;
  sectionExpirationDate: string;
}
export interface StopsDetailsDto {
  geographyPointTypeID: number;
  stopLocationPointID: number;
  stopSequenceNumber: number;
}
export interface StopDetails {
  isStopChargeIncluded: boolean;
  stops: Array<StopsDetailsDto>;
}
export interface SourceDetails {
  lineHaulSourceTypeName: string;
  lineHaulSourceTypeID: number;
}

export interface DateRangeValues {
  effectiveDate: string;
  expirationDate: string;
}
