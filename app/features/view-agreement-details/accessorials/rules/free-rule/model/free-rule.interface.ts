
export interface FreeRuleType {
    _embedded: FreeRuleTypeEmbedded;
    _links: QuantityTypeLinks2;
    page: Page;
}
export interface QuantityType {
    _embedded: QuantityTypeEmbedded;
    _links: QuantityTypeLinks2;
    page: Page;
}
export interface TimeType {
    accessorialFreeRuleQuantityTimeTypeId: number;
    accessorialFreeRuleQuantityTimeTypeName: string;
}

export interface FreeRuleTypeInterface {
    label: string;
    value: number;
}
export interface QuantityTypeInterface {
    label: string;
    value: number;
}
export interface TimeTypeInterface {
    label: string;
    value: number;
}
export interface DistanceTypeInterface {
    label: string;
    value: number;
}
export interface Self {
    href: string;
}

export interface AccessorialFreeRuleQuantityType2 {
    href: string;
    templated: boolean;
}

export interface Links {
    self: Self;
    accessorialFreeRuleQuantityType: AccessorialFreeRuleQuantityType2;
}

export interface AccessorialFreeRuleQuantityType {
    accessorialFreeRuleQuantityTypeId: number;
    accessorialFreeRuleQuantityTypeName: string;
    _links: Links;
}

export interface QuantityTypeEmbedded {
    accessorialFreeRuleQuantityTypes: AccessorialFreeRuleQuantityType[];
}



export interface TimeTypeEmbedded {
    accessorialFreeRuleQuantityTimeTypes: AccessorialFreeRuleQuantityTimeTypes[];
}

export interface FreeRuleTypeEmbedded {
    accessorialFreeRuleTypes: AccessorialFreeRuleTypes[];
}

export interface AccessorialFreeRuleTypes {
    accessorialFreeRuleTypeID: number;
    accessorialFreeRuleTypeName: string;
    _links: Links;
}

export interface DistanceType {
    accessorialFreeRuleQuantityDistanceTypeId: number;
    accessorialFreeRuleQuantityDistanceTypeName: string;
}

export interface AccessorialFreeRuleQuantityTimeTypes {
    accessorialFreeRuleQuantityTimeTypeId: number;
    accessorialFreeRuleQuantityTimeTypeName: string;
    _links: Links;
}


export interface Self2 {
    href: string;
    templated: boolean;
}

export interface Profile {
    href: string;
}

export interface QuantityTypeLinks2 {
    self: Self2;
    profile: Profile;
}

export interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}


