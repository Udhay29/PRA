import { Observable } from 'rxjs';

export interface CreateRequestParam {
    customerAgreementContractID: number;
    customerAgreementContractVersionID: number;
    customerAgreementID: number;
    customerAgreementContractTypeID: number;
    customerAgreementContractTypeName: string;
    customerContractNumber: number;
    customerContractName: string;
    effectiveDate: string;
    expirationDate: string;
    customerContractComment: string;
    createAgreementFlow: boolean;
    isElasticSync: boolean;
}
export interface ListItem {
    value: number;
    label: string;
}
export interface CanComponentDeactivate {
    canDeactivate: (component, route, state, nextState) => Observable<boolean> | Promise<boolean> | boolean;
  }
