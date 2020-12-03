export class FilterDataInterface {
    title: string;
    url: string;
    query: object;
    callback: any;
}
export class ListingFilterInterface {
    title: string;
    url: string;
    query: object;
    callback: any;
    inputFlag: boolean;
    expanded?: boolean;
    isStatus?: boolean;
}
export interface ListRadio {
    title: string;
    data: Array<object>;
}
export class SliderDataInterface {
    title: string;
    min: number;
    max: number;
    range: boolean;
    default: number;
    hideRange: boolean;
}
export interface ListItem {
    value: string;
    label: string;
}


export interface Shards {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
}

export interface SectionAssociation {
    sectionName?: string;
    sectionID?: number;
}

export interface ContractAssociation {
    contractDisplayName: string;
    contractType: string;
    contractNumber?: number;
    contractName: string;
    customerAgreementContractID: number;
}

export interface FinanceBusinessUnitAssociation {
    financeBusinessUnitCode?: number;
    financeBusinessUnitCargoID?: number;
}

export interface Source {
    cargoType: string;
    customerAgreementCargoIDs: number[];
    lastUpdateProgram: string;
    agreementDefaultIndicator: string;
    uniqueDocID: string;
    sectionAssociation: SectionAssociation;
    createTimestamp: Date;
    lastUpdateTimestamp: Date;
    originalEffectiveDate: string;
    originalExpirationDate: string;
    invalidIndicator: string;
    invalidReasonTypeName: string;
    agreementID: number;
    cargoReleaseAmount: number;
    contractAssociation: ContractAssociation;
    lastUpdateUser: string;
    createUser: string;
    effectiveDate: string;
    createProgram: string;
    financeBusinessUnitAssociations: FinanceBusinessUnitAssociation[];
    expirationDate: string;
}

export interface Hit {
    _index: string;
    _type: string;
    _id: string;
    _score?: number;
    _source: Source;
    sort: string[];
}

export interface Hits {
    total: number;
    max_score?: number;
    hits: Hit[];
}

export interface RootObject {
    took: number;
    timed_out: boolean;
    _shards: Shards;
    hits: Hits;
}
export interface GeneralType {
    configurationParameterDetailName: string;
    configurationParameterValue: number;
}



