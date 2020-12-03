export interface SplitScreenDetails {
  isCreate: boolean;
  titleText: string;
}
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

export interface Shards {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}

export interface DrayGroupCountry {
  drayGroupCountryCode: string;
  drayGroupCountryID: any;
  drayGroupCountryName: string;
}

export interface DrayGroupArray {
  createProgramName: string;
  createTimestamp: string;
  createUserID: string;
  drayGroupCode: string;
  drayGroupName: string;
  effectiveDate: string;
  expirationDate: string;
  invalidIndicator: string;
  invalidReasonTypeID: any;
  invalidReasonTypeName: string;
  lastUpdateProgramName: string;
  lastUpdateTimestamp: string;
  lastUpdateUserID: string;
  rateScopeTypeName: string;
  drayGroupCountries: DrayGroupCountry[];
  drayGroupID?: number;
  drayGroupVersionID?: number;
  rateScopeTypeID?: number;
  drayGroupCountrySetID?: number;
  dbSyncUpdateTimestamp: string;
}

export interface Hit {
  _index: string;
  _type: string;
  _id: string;
  _score?: any;
  _source: DrayGroupArray;
  sort: any[];
}

export interface Hits {
  total: number;
  max_score?: any;
  hits: Hit[];
}

export interface DrayGroup {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits;
}
