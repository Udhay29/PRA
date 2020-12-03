import { Observable } from 'rxjs';
export interface CarrierDetails {
  agreementName: string;
  agreementStatus: string;
  agreementType: string;
  carriers: Carrier[];
  agreementEffectiveDate: string;
  agreementExpirationDate: string;
}
export interface Carrier {
  carrierID: number;
  carrierName: string;
  carrierCode: string;
}
export interface DetailList {
  label: string;
  value: string;
}
export interface CanComponentDeactivate {
  canDeactivate: (component, route, state, nextState) => Observable<boolean> | Promise<boolean> | boolean;
}
