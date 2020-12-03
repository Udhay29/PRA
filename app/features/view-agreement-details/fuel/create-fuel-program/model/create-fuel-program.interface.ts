import { Observable } from 'rxjs';
export interface AgreementDetails {
  customerAgreementID: number;
  customerAgreementName: string;
  agreementType: string;
  ultimateParentAccountID: number;
  currencyCode: string;
  cargoReleaseAmount: number;
  businessUnits: string[];
  taskAssignmentIDs: number[];
  effectiveDate: string;
  expirationDate: string;
  invalidIndicator: string;
  invalidReasonTypeName: string;
}
export interface CanComponentDeactivate {
  canDeactivate: (component, route, state, nextState) => Observable<boolean> | Promise<boolean> | boolean;
}
