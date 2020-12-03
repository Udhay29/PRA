export interface CalendarTypes {
    _embedded: CalendarTypeEmbedded;
    _links: Links2;
    page: Page;
}
export interface TimeFrames {
    _embedded: TimeFrameEmbedded;
    _links: Links2;
    page: Page;
}export interface DayOfWeekResponse {
    customerAccessorialFreeRuleCalendarWeekDayId: number;
    customerAccessorialFreeRuleCalendarId?: any;
    calendarWeekDay: string;
}
export interface EventTypesResponse {
    _embedded: EventTypesEmbedded;
    _links: Links2;
    page: Page;
}
export interface AppliesToOccurenceResponse {
    _embedded: AppliesToOccurenceEmbedded;
    _links: Links2;
    page: Page;
}
export interface MonthsResponse {
    customerAccessorialFreeRuleCalendarMonthId: number;
    customerAccessorialFreeRuleCalendardId?: any;
    calendarMonth: string;
    customerAccessorialFreeRuleCalendarDay?: any;
}
export interface AccessorialFrequencyType2 {
    href: string;
    templated: boolean;
}

export interface AppliesToLinks {
    self: Self;
    accessorialFrequencyType: AccessorialFrequencyType2;
}

export interface AccessorialFrequencyType {
    accessorialFrequencyTypeId: number;
    accessorialFrequencyTypeName: string;
    _links: AppliesToLinks;
}

export interface AppliesToOccurenceEmbedded {
    accessorialFrequencyTypes: AccessorialFrequencyType[];
}
export interface AccessorialFreeRuleEventType2 {
    href: string;
    templated: boolean;
}
export interface Links {
    self: Self;
    accessorialFreeRuleEventType: AccessorialFreeRuleEventType2;
}
export interface AccessorialFreeRuleEventType {
    accessorialFreeRuleEventTypeName: string;
    accessorialFreeRuleEventTypeId: number;
    _links: Links;
}

export interface EventTypesEmbedded {
    accessorialFreeRuleEventTypes: AccessorialFreeRuleEventType[];
}

export interface PricingAveragePeriodType2 {
    href: string;
    templated: boolean;
}
export interface ApplyIfResponse {
    _embedded: ApplyTypeEmbedded;
    _links: Links2;
    page: Page;
}
export interface AccessorialFreeRuleCalendarApplyType2 {
    href: string;
    templated: boolean;
}

export interface ApplyTypeLinks {
    self: Self;
    accessorialFreeRuleCalendarApplyType: AccessorialFreeRuleCalendarApplyType2;
}
export interface AccessorialFreeRuleCalendarApplyType {
    accessorialFreeRuleCalendarApplyName: string;
    accessorialFreeRuleCalendarApplyTypeId: number;
    _links: ApplyTypeLinks;
}

export interface ApplyTypeEmbedded {
    accessorialFreeRuleCalendarApplyTypes: AccessorialFreeRuleCalendarApplyType[];
}
export interface Links {
    self: Self;
    pricingAveragePeriodType: PricingAveragePeriodType2;
}
export interface PricingAveragePeriodType {
    pricingAveragePeriodTypeId: number;
    pricingAveragePeriodTypeName: string;
    _links: Links;
}

export interface TimeFrameEmbedded {
    pricingAveragePeriodTypes: PricingAveragePeriodType[];
}

export interface AutoCompleteInterface {
    label: string;
    value: number;
}
export interface AccessorialFreeRuleCalendarType2 {
    href: string;
    templated: boolean;
}export interface Self {
    href: string;
}export interface Links {
    self: Self;
    accessorialFreeRuleCalendarType: AccessorialFreeRuleCalendarType2;
}
export interface AccessorialFreeRuleCalendarType {
    accessorialFreeRuleCalendarTypeName: string;
    accessorialFreeRuleCalendarTypeId: number;
    _links: Links;
}
export interface CalendarTypeEmbedded {
    accessorialFreeRuleCalendarTypes: AccessorialFreeRuleCalendarType[];
}
export interface Self2 {
    href: string;
    templated: boolean;
}
export interface Profile {
    href: string;
}
export interface Links2 {
    self: Self2;
    profile: Profile;
}
export interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}
