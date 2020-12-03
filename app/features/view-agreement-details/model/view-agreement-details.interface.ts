import { Observable } from 'rxjs';
export interface AgreementDetails {
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
  customerAgreementID: number;
}
export interface DetailList {
  label: string;
  value: string;
}
export interface Teams {
  parentId: number;
  agreementId: number;
  agreementName: string;
  effectiveDate: string;
  expirationDate: string;
}
export interface CustomerAgreementNameConfigurationID {
  customerAgreementName: string;
  customerLineHaulConfigurationID: number;
}
export interface AgreementDetailsInterface {
  customerAgreementName: string;
  lineHaulConfigurationID: number;
  agreementId: number;
}

export interface EditLineHaulData {
  lineHaulDetails: any;
  isEditFlag: boolean;
}
export interface CanComponentDeactivate {
  canDeactivate: (component, route, state, nextState) => Observable<boolean> | Promise<boolean> | boolean;
}
