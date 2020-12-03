export interface FreeEventType {
  _embedded: FreeRuleEventTypeEmbedded;
  _links: EventTypeLinks;
  page: Page;
}
export interface EventFreeTime {
  _embedded: EventFreeTimeTypeEmbedded;
  _links: EventTypeLinks;
  page: Page;
}
export interface EventFreeAmount {
  _embedded: EventFreeAmountTypeEmbedded;
  _links: EventTypeLinks;
  page: Page;
}
export interface FreeRuleEventTypeEmbedded {
  accessorialFreeRuleEventTypes: AccessorialFreeRuleEventTypes[];
}
export interface EventFreeTimeTypeEmbedded {
  accessorialFreeRuleEventFreeTimeTypes: AccessorialFreeRuleEventFreeTimeTypes[];
}
export interface EventFreeAmountTypeEmbedded {
  accessorialFreeRuleEventFreeAmountTypes: AccessorialFreeRuleEventFreeAmountTypes[];
}
export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
export interface AccessorialFreeRuleEventTypes {
  accessorialFreeRuleEventTypeId: number;
  accessorialFreeRuleEventTypeName: string;
  _links: Links;
}
export interface AccessorialFreeRuleEventFreeTimeTypes {
  accessorialFreeRuleEventTimeframeTypeID: number;
  accessorialFreeRuleEventTimeframeTypeName: string;
  _links: Links;
}
export interface AccessorialFreeRuleEventFreeAmountTypes {
  accessorialFreeRuleEventModifierTypeID: number;
  accessorialFreeRuleEventModifierTypeName: string;
  _links: Links;
}
export interface AccessorialFreeRuleEventType {
  href: string;
  templated: boolean;
}
export interface FreeEventNameTypeInterface {
  label: string;
  value: number;
}
export interface FreeEventTimeInterface {
  label: string;
  value: number;
}
export interface EventFreeAmountFirstInterface {
  label: string;
  value: number;
}
export interface EventFreeAmountSecondInterface {
  label: string;
  value: number;
}
export interface Links {
  self: Self;
  accessorialFreeRuleEventType: AccessorialFreeRuleEventType;
}
export interface Self {
  href: string;
  templated: boolean;
}

export interface Profile {
  href: string;
}
export interface EventTypeLinks {
  self: Self;
  profile: Profile;
}
