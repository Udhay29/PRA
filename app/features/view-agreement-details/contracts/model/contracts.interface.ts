import { Observable } from 'rxjs';

export interface QueryMock {
  sourceData: string;
  script: Scripts;
}
export interface Scripts {
  script1: string;
  script2: string;
  script3: string;
}
export interface RootObject {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits[];
  aggregations?: Aggregations;
}
export interface Aggregations {
  nesting: Nesting;
}
export interface Nesting {
  doc_count: number;
  count: Count;
}
export interface Count {
  value: number;
}
export interface Shards {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}
export interface Hits {
  _index?: string;
  _type?: string;
  _id?: string;
  _score?: number;
  _source?: Source;
  fields: Fields;
  sort: string[];
}
export interface Source {
  ContractRanges: Contract;
}
export interface Contract {
  ContractComment: string;
  ContractNumber: string;
  LastUpdateProgram: string;
  CreateUser: string;
  ContractExpirationDate: string;
  ContractInvalidReasonType: string;
  ContractVersionID: number;
  ContractInvalidIndicator: string;
  LastUpdateTimestamp: string;
  ContractName: string;
  LastUpdateUser: string;
  ContractEffectiveDate: string;
  ContractTypeName: string;
  CreateProgram: string;
  CreateTimestamp: string;
  AgreementID?: number;
  ContractID?: number;
}
export interface Fields {
  Status: string[];
  ContractRanges: string[];
}
export interface TableColumnModel {
  name: string;
  property: string;
  keyword: string;
}
export interface ContractDetails {
  customerAgreementContractID: number;
  customerAgreementID: number;
  customerAgreementContractVersionID: number;
  customerAgreementContractTypeID: number;
  customerAgreementContractTypeName: string;
  customerContractName: string;
  customerContractNumber: string;
  effectiveDate: string;
  expirationDate: string;
  customerContractComment: string;
  status: string;
  createUserId: string;
  lastUpdateUserID: string;
  lastUpdateProgramName: string;
  createProgramName: string;
  createTimestamp: string;
  lastUpdateTimestamp: string;
  originalEffectiveDate: string;
  originalExpirationDate: string;
  displayEffectiveDate?: Date;
  displayExpirationDate?: Date;
  displayCreatedOn?: string;
  displayUpdatedOn?: string;
  displayOriginalEffectiveDate?: Date;
  displayOriginalExpirationDate?: Date;
}
export interface CanComponentDeactivate {
  canDeactivate: (component, route, state, nextState) => Observable<boolean> | Promise<boolean> | boolean;
}


