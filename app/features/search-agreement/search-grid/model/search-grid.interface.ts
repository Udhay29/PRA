import { Source } from '../../advance-search/model/advance-search-interface';

export interface TableColumnModel {
  property: string;
  name: string;
  keyword: string;
  isVisible: boolean;
}

export interface TableDataModel {
  id: string;
  equipment: string;
  equipmentCategory: string;
  equipmentType: string;
  maintenanceStatus: string;
  operationalStatus: string;
  ownerShip: string;
  serialNumber: string;
  daysInService: string;
}

export interface SearchData {
  equipmentNumber?: string;
  bussinessUnit?: string;
  equipmentCategory?: string;
  equipmentType?: string;
  maintenanceStatus?: string;
  ownership?: string;
  operationalTeam?: string;
  favouriteName?: string;
}

export interface SearchQuery {
  tableVal: SearchData;
  pgStart: number;
  tblSize: number;
  sortField: string;
  sortOrder: string;
}

export interface SearchResponse {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits;
}

export interface Shards {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}

export interface Hits {
  total: number;
  max_score: number;
  hits: InnerHits[];
}

export interface InnerHits {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: SourceData;
}

export interface SourceData {
  AgreementType: string;
  AgreementTenantID: number;
  AgreementEffectiveDate: Date;
  AgreementID: number;
  AgreementName: string;
  UniqueDocID: number;
  AgreementStatus: string;
  AgreementExpirationDate: Date;
}
