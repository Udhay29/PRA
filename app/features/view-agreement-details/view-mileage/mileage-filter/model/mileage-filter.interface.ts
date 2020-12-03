export class ListingFilterInterface {
  title: string;
  url: string;
  query: object;
  callback: any;
  inputFlag: boolean;
}
export class StatusInterface {
  title: string;
  data?: any;
  callback?: any;
  url?: string;
  expanded?: boolean;
  isStatus?: boolean;
}
export interface HitsItem {
  _index?: string;
  _type?: string;
  _id?: string;
  _score?: number;
  _source?: Source;
  fields: Fields;
  sort: string[];
}
export interface Source {
  AgreementID: number;
  ContractID: number;
  ContractRanges: Ranges[];
}
export interface Fields {
  Status: string;
  ContractRanges: string[];
}

export interface Ranges {
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
}
