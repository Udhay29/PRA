export interface CustomerAccessorialFreeRuleEvent {
    customerAccessorialFreeRuleEventId: number;
    accessorialFreeRuleEventTypeID: number;
    accessorialFreeRuleTypeName: string;
    accessorialFreeRuleEventTypeName: string;
    accessorialFreeRuleEventTimeframeTypeID: number;
    accessorialFreeRuleEventTimeFrameTypeName: string;
    accessorialDayOfEventFreeRuleModifierName: string;
    accessorialDayOfEventFreeRuleModifierId: number;
    accessorialDayAfterEventFreeRuleModifierName: string;
    accessorialDayOfEventFreeRuleModifierTime: string;
    accessorialDayAfterEventFreeRuleModifierId: number;
    accessorialDayAfterEventFreeRuleModifierTime: string;
}
export interface AccessorialFreeRuleQuantityType {
    accessorialFreeRuleQuantityTypeId: number;
    accessorialFreeRuleQuantityTypeName: string;
    freeRuleQuantityDistanceTypeId: number;
    freeRuleQuantityDistanceTypeCode?: string;
    freeRuleQuantityTimeTypeId: number;
    freeRuleQuantityTimeTypeCode: string;
    accessorialFreeQuantity: string;
    requestedDeliveryDateIndicator: string;
}
export interface AccessorialFreeRuleCalendarType {
    customerAccessorialFreeRuleConfigurationID: number;
    customerAccessorialFreeRuleCalendarId: number;
    accessorialFreeRuleCalendarTypeId: number;
    accessorialFreeRuleCalendarTypeName: string;
    accessorialFreeRuleEventTimeframeTypeID: number;
    accessorialFreeRulecalendarNameofDay: string;
    calendarMonth: string;
    calendarDayOfMonth: number;
    calendarYear?: any;
    accessorialFreeRuleCalendarApplyIfTypeId: number;
    accessorialFreeRuleCalendarApplyIfTypeName: string;
    accessorialFreeRuleCalendarApplyIfTypeEventName: string;
    firstDayChargeableIndicator: string;
  }
