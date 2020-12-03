export interface QueryMock {
  sourceData: string;
  script: Scripts;
}
export interface Scripts {
  script1: string;
  script2: string;
  script3: string;
}
export interface CustomerAccessorialFreeRuleQuantityLookUpDTOS {
  customerAccessorialFreeRuleConfigurationID: number;
  accessorialFreeRuleQuantityTypeID: number;
  accessorialFreeRuleQuantityTypeName: string;
  freeRuleQuantityDistanceTypeId: number;
  freeRuleQuantityDistanceTypeCode: string;
  freeRuleQuantityTimeTypeId?: any;
  freeRuleQuantityTimeTypeCode?: any;
  accessorialFreeQuantity: number;
  requestedDeliveryDateIndicator: string;
}
export interface CustomerAccessorialFreeRuleEventLookUpDTO {
  customerAccessorialFreeRuleConfigurationID: number;
  accessorialFreeRuleEventTypeID: number;
  accessorialFreeRuleTypeName: string;
  accessorialFreeRuleEventTimeframeTypeID: number;
  accessorialFreeRuleEventTimeFrameTypeName: string;
  dayOfEventFreeRuleModifierID: number;
  accessorialDayOfEventFreeRuleModifierName: string;
  dayOfEventFreeRuleModifierTime: string;
  dayAfterEventFreeRuleModifierID: number;
  accessorialDayAfterEventFreeRuleModifierName: string;
  dayAfterEventFreeRuleModifierTime: string;
  effectiveDate: string;
  expirationDate: string;
}
export interface RootObject {
  accessorialFreeRuleTypeId: number;
  accessorialFreeRuleTypeName: string;
  customerAccessorialFreeRuleQuantityLookUpDTOS?: CustomerAccessorialFreeRuleQuantityLookUpDTOS[];
  customerAccessorialFreeRuleEventLookUpDTOS?: CustomerAccessorialFreeRuleEventLookUpDTO[];
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
export interface Hit {
  _index: string;
  _type: string;
  _id: string;
  _score?: any;
  _source: Source;
  sort: string[];
}
export interface Hits {
  total: number;
  max_score?: any;
  hits: Hit[];
}
export interface Source {
  accessorialFreeRuleQuantityTypeName: string;
  accessorialFreeQuantity: number;
  accessorialFreeRuleQuantityTimeTypeName: string;
  requestedDeliveryDateIndicator: string;
}
export interface ReferenceDataDetails {
  accessorialFreeRuleQuantityTypeName: string;
  accessorialFreeQuantity: number;
  accessorialFreeRuleQuantityTimeTypeName: string;
  requestedDeliveryDateIndicator: string;
}

export interface Fields {
  Status: string[];
  ReferenceDataRanges: string[];
}
export interface TableColumnModel {
  name: string;
  property: string;
}


