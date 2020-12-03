import { TableColumn } from './rules.interface';

export class RulesModel {
    isSubscribeFlag: boolean;
    cols: TableColumn[];
    rules: any;
    loading: boolean;
    totalRuleRecords: number;
    isRuleRecordEmpty: boolean;
    first: number;
    rows: number;
    searchText: string;
    firstCheck: number;
    freeRuleType: object;
    eventTypeHeader: string;
    freeRuleCalendarTypeField: string;
    cannotBeChargeableHeader: string;
    freeRuleQuantityCols: TableColumn[];
    freeRuleEventCols: TableColumn[];
    freeRuleSpecificCols: TableColumn[];
    freeRuleRelativeCols: TableColumn[];
    freeRuleHolidayCols: TableColumn[];
    constructor() {
        this.isSubscribeFlag = true;
        this.freeRuleType = {
            quantityTypeId: 3,
            eventTypeId: 2,
            calendarTypeId: 1,
            relativeTypeId: 3,
            specificTypeId: 2,
            relativeMonthly: 2,
            relativeWeekly: 1
        };
        this.eventTypeHeader = 'Event Name';
        this.cannotBeChargeableHeader = 'Cannot Be First Chargeable Day';
        this.freeRuleCalendarTypeField = 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.accessorialFreeRuleCalendarTypeId';
        this.setFreeRuleQuantityCols();
        this.setFreeRuleEventCols();
        this.setFreeRuleSpecificCols();
        this.setFreeRuleRelativeCols();
        this.setFreeRuleHolidayCols();
        this.setColumns();
        this.totalRuleRecords = 0;
        this.first = 0;
        this.rows = 0;
        this.searchText = '';
        this.firstCheck = 1;
    }
    setFreeRuleQuantityCols() {
        this.freeRuleQuantityCols = [
            {
                field: 'freeRuleQuantity', header: 'Quantity',
                title: 'Quantity', isSubtitle: true, isSubcolumn: true,
                sortField: 'accessorialFreeRuleTypes.accessorialFreeRuleQuantityType.accessorialFreeQuantity',
                isToolTipDisabled: true
            },
            {
                field: 'freeRuleQuantityTimeFrame', header: 'Timeframe',
                isSubcolumn: true, isSubtitle: true,
                sortField: `accessorialFreeRuleTypes.accessorialFreeRuleQuantityType.freeRuleQuantityTimeTypeCode.keyword`,
                isNotFirst: true
            },
            {
                field: 'freeRuleQuantityType', header: 'Quantity Type', isSubcolumn: true, isSubtitle: true,
                sortField: 'accessorialFreeRuleTypes.accessorialFreeRuleQuantityType.accessorialFreeRuleQuantityTypeName.keyword',
                isNotFirst: true
            },
            {
                field: 'freeRuleStartFreeTime', header: 'Start Free Time On', isSubcolumn: true, isSubtitle: true,
                sortField:
                'accessorialFreeRuleTypes.accessorialFreeRuleQuantityType.requestedDeliveryDateIndicator.keyword', isNotFirst: true
            }
        ];
    }
    setFreeRuleEventCols() {
        this.freeRuleEventCols = [
            {
                field: 'freeRuleEventType',
                header: this.eventTypeHeader,
                title: 'Event', isSubtitle: true, isSubcolumn: true,
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleEvent.accessorialFreeRuleEventTypeName.keyword',
                isToolTipDisabled: true
            },
            {
                field: 'freeRuleFreeTime',
                header: 'Free Time', isSubcolumn: true, isSubtitle: true,
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleEvent.accessorialFreeRuleEventTimeFrameTypeName.keyword',
                isNotFirst: true
            },
            {
                field: 'freeRuleDayOfEventFreeAmount', header: 'Day of Event Free Amount', isSubcolumn: true, isSubtitle: true,
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleEvent.accessorialDayOfEventFreeRuleModifierName.keyword',
                isNotFirst: true, width: { width: '180px' }
            },
            {
                field: 'freeRuleDayOfEventTime', header: 'Day of Event Time', isSubcolumn: true, isSubtitle: true,
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleEvent.accessorialDayOfEventFreeRuleModifierTime',
                isNotFirst: true
            },
            {
                field: 'freeRuleDayAfterEventFreeAmount', header: 'Day After Event Free Amount', isSubcolumn: true, isSubtitle: true,
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleEvent.accessorialDayAfterEventFreeRuleModifierName.keyword',
                isNotFirst: true, width: { width: '200px' }
            },
            {
                field: 'freeRuleDayAfterEventTime', header: 'Day After Event Time', isSubcolumn: true, isSubtitle: true,
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleEvent.accessorialDayAfterEventFreeRuleModifierTime',
                isNotFirst: true
            }
        ];
    }
    setFreeRuleSpecificCols() {
        this.freeRuleSpecificCols = [
            {
                field: 'freeRuleSpecificMonth', header: 'Month',
                title: 'Specific', isSubtitle: true, isSubcolumn: true,
                sortField:
            'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarMonth.calendarMonth.keyword',
            sortFilterField:
            // tslint:disable-next-line:max-line-length
            'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarMonth.accessorialFreeRuleCalendarTypeId',
                  sortFilterData: this.freeRuleType['specificTypeId'],
                isToolTipDisabled: true
            },
            {
                field: 'freeRuleDayOfMonth', header: 'Day Of Month', isSubcolumn: true, isSubtitle: true,
                // tslint:disable-next-line:max-line-length
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarMonth.customerAccessorialFreeRuleCalendarDay',
                isNotFirst: true
            },
            {
                field: 'freeRuleYear', header: 'Year', isSubcolumn: true, isSubtitle: true,
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.calendarYear', isNotFirst: true
            },
            {
                field: 'freeRuleNameOfDay', header: 'Name of Day', isSubcolumn: true, isSubtitle: true,
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.calendarDayDescription.keyword', isNotFirst: true
            },
            {
                field: 'freeRuleSpecificApplyIf', header: 'Apply If', isSubcolumn: true, isSubtitle: true,
                sortFilterField: this.freeRuleCalendarTypeField,
                sortFilterData: this.freeRuleType['specificTypeId'],
                // tslint:disable-next-line:max-line-length
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.accessorialFreeRuleCalendarApplyTypeName.keyword', isNotFirst: true
            },
            {
                field: 'freeRuleSpecificEventTypeName', header: this.eventTypeHeader, isSubcolumn: true, isSubtitle: true,
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.accessorialFreeRuleEventTypeName.keyword',
                sortFilterField: this.freeRuleCalendarTypeField,
                sortFilterData: this.freeRuleType['specificTypeId'],
                isNotFirst: true
            },
            {
                field: 'freeRuleSpecificCannotBeChargeableDay', header: this.cannotBeChargeableHeader,
                isSubcolumn: true, isSubtitle: true, width: { width: '210px' },
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.firstDayChargeableIndicator.keyword',
                sortFilterField: this.freeRuleCalendarTypeField,
                sortFilterData: this.freeRuleType['specificTypeId'],
                isNotFirst: true
            }
        ];
    }
    setFreeRuleRelativeCols() {
        this.freeRuleRelativeCols = [
            {
                field: 'freeRuleTimeframe', header: 'Timeframe',
                title: 'Relative', isSubtitle: true, isSubcolumn: true,
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.pricingAveragePeriodTypeName.keyword',
                isToolTipDisabled: true
            },
            {
                field: 'freeRuleDayofWeekWeeklyToShow', header: 'Day of Week', isSubcolumn: true, isSubtitle: true, isArray: true,
                sortField:
         'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarWeekDay.calendarWeekDay.keyword',
                sortFilterField:
                // tslint:disable-next-line:max-line-length
                'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarWeekDay.pricingAveragePeriodTypeId',
                sortFilterData: this.freeRuleType['relativeWeekly'],
                isNotFirst: true
            },
            {
                field: 'freeRuleRelativeMonth', header: 'Month', isSubcolumn: true, isSubtitle: true,
                sortField:
            'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarMonth.calendarMonth.keyword',
                sortFilterField:
            // tslint:disable-next-line:max-line-length
            'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarMonth.accessorialFreeRuleCalendarTypeId',
                sortFilterData: this.freeRuleType['relativeTypeId'],
                isNotFirst: true
            },
            {
                field: 'freeRuleFrequencyToShow', isArray: true, header: 'Frequency', isSubcolumn: true, isSubtitle: true,
                // tslint:disable-next-line:max-line-length
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarDayOccurrences.accessorialFrequencyTypeName.keyword',
                sortFilterField:
                // tslint:disable-next-line:max-line-length
                'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarDayOccurrences.pricingAveragePeriodTypeId',
                sortFilterData: this.freeRuleType['relativeMonthly'],
                isNotFirst: true
            },
            {
                field: 'freeRuleDayofWeekMonthlyToShow', header: 'Day', isSubcolumn: true, isSubtitle: true, isArray: true,
                sortField:
         'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarWeekDay.calendarWeekDay.keyword',
                sortFilterField:
                // tslint:disable-next-line:max-line-length
                'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarWeekDay.pricingAveragePeriodTypeId',
                sortFilterData: this.freeRuleType['relativeMonthly'],
                isNotFirst: true
            },
            {
                field: 'freeRuleRelativeApplyIf', header: 'Apply If', isSubcolumn: true, isSubtitle: true,
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.accessorialFreeRuleCalendarApplyTypeName.keyword',
                sortFilterField: this.freeRuleCalendarTypeField,
                sortFilterData: this.freeRuleType['relativeTypeId'],
                isNotFirst: true
            },
            {
                field: 'freeRuleRelativeEventTypeName', header: this.eventTypeHeader, isSubcolumn: true, isSubtitle: true,
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.accessorialFreeRuleEventTypeName.keyword',
                sortFilterField: this.freeRuleCalendarTypeField,
                sortFilterData: this.freeRuleType['relativeTypeId'],
                isNotFirst: true
            },
            {
                field: 'freeRuleAppliesToOccurrenceToShow', isArray: true,
                header: 'Applies To Occurance', isSubcolumn: true, isSubtitle: true,
                // tslint:disable-next-line:max-line-length
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarDayOccurrences.accessorialFrequencyTypeName.keyword',
                sortFilterField:
                // tslint:disable-next-line:max-line-length
                'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarDayOccurrences.pricingAveragePeriodTypeId',
                sortFilterData: this.freeRuleType['relativeWeekly'],
                isNotFirst: true
            },
            {
                field: 'freeRuleRelativeCannotBeChargeableDay', header: this.cannotBeChargeableHeader,
                isSubcolumn: true, isSubtitle: true, width: { width: '210px' },
                sortField: 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.firstDayChargeableIndicator.keyword',
                sortFilterField: this.freeRuleCalendarTypeField,
                sortFilterData: this.freeRuleType['relativeTypeId'],
                isNotFirst: true
            }];
    }
    setFreeRuleHolidayCols() {
        this.freeRuleHolidayCols = [
            {
                field: '', header: 'Country',
                title: 'Holiday', isSubtitle: true, isSubcolumn: true,
                sortField: '',
                isToolTipDisabled: true
            },
            {
                field: '', header: 'Holiday', isSubcolumn: true, isSubtitle: true,
                sortField: '', isNotFirst: true
            },
            {
                field: '', header: 'Apply If', isSubcolumn: true, isSubtitle: true,
                sortField: '', isNotFirst: true
            },
            {
                field: '', header: 'Event name', isSubcolumn: true, isSubtitle: true,
                sortField: '', isNotFirst: true
            },
            {
                field: '', header: this.cannotBeChargeableHeader, isSubcolumn: true, isSubtitle: true, width: { width: '210px' },
                sortField: '', isNotFirst: true
            }
        ];
    }
    setColumns() {
        this.loading = false;
        this.isRuleRecordEmpty = false;

        this.cols = [
            { field: 'ruleType', header: 'Rule Type', sortField: 'ruleType.raw' },
            { field: 'chargeTypeName', header: 'Charge Type', sortField: 'chargeTypeName.keyword' },
            {
                field: 'contractsToShow', header: 'Contract', isArray: true,
                sortField: 'customerAccessorialAccount.customerAgreementContractName.keyword'
            },
            {
                field: 'sectionsToShow', header: 'Section', isArray: true,
                sortField: 'customerAccessorialAccount.customerAgreementContractSectionName.keyword'
            },
            {
                field: 'busoToShow', header: 'Business Unit and Service Offering', isArray: true,
                sortField: 'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnit.keyword',
                width: { width: '250px' }
            },
            {
                field: 'serviceLevelToShow', header: 'Service Level', isArray: true,
                sortField: 'customerAccessorialServiceLevelBusinessUnitServiceOfferings.serviceLevel.keyword'
            },
            {
                field: 'requestedToShow', header: 'Requested Service', isArray: true,
                sortField: 'customerAccessorialRequestServices.requestedServiceTypeCode.keyword'
            },
            { field: 'equipmentCategoryCode', header: 'Equipment Category', sortField: 'equipmentCategoryCode.raw' },
            { field: 'equipmentTypeCode', header: 'Equipment Type', sortField: 'equipmentTypeCode.keyword' },
            { field: 'equipmentLengthDescription', header: 'Equipment Length', sortField: 'equipmentLength' },
            {
                field: 'carriersToShow', header: 'Carrier (Code)', isArray: true,
                sortField: 'customerAccessorialCarriers.carrierName.keyword'
            },
            {
                field: 'billToCodeToShow', header: 'Bill to Account', isArray: true,
                sortField: 'customerAccessorialAccount.customerAgreementContractSectionAccountName.keyword'
            },
            {
                field: 'documentLegalDescription', header: 'Legal', title: 'Documentation', isSubtitle: true,
                sortField: 'documentLegalDescription.keyword', width: { width: '300px' }, isToolTipDisabled: true
            },
            {
                field: 'documentInstructionalDescription', header: 'Instructional', isSubtitle: true,
                sortField: 'documentInstructionalDescription.raw', width: { width: '300px' }, isToolTipDisabled: true, isNotFirst: true,
            },
            { field: 'documentFileNamesShow', header: 'Attachment', isSubtitle: true, sortField: 'documentFileNames.raw',
              isNotFirst: true, isArray: true },
            { field: 'hasAttachment', header: 'Has Attachment', isSubtitle: true, sortField: 'hasAttachment.raw',   isNotFirst: true, },
            {
                field: 'accessorialNotificationTypeName', header: 'Notification Type',
                sortField: 'accessorialNotificationTypeName.keyword'
            },
            {
                field: 'notificationMethodsToShow', header: 'Notify By',
                sortField: 'customerAccessorialNotificationMethods.accessorialNotificationMethodTypeName.keyword',
                isArray: true
            },
            {
                field: 'templateTypeToShow', header: 'Template Type', isArray: true,
                sortField: 'customerAccessorialNotificationMethods.accessorialEmailTemplateTypeName.keyword'
            },
            {
                field: 'websiteAddressToShow', header: 'Website Address', isArray: true,
                sortField: 'customerAccessorialNotificationMethods.websiteAddress.keyword',
                width: { width: '200px' }
            },
            {
                field: 'eventOccurenceTimeToShow', header: 'Event Occurrence Time',
                sortField: 'customerAccessorialNotificationFrequency.accessorialNotificationOccurrenceTypeName.keyword',
                width: { width: '200px' }
            },
            {
                field: 'eventNameToShow', header: this.eventTypeHeader,
                sortField: 'customerAccessorialNotificationFrequency.accessorialNotificationEventTypeName.keyword'
            },
            {
                field: 'quantityToShow', header: 'Quantity',
                sortField: 'customerAccessorialNotificationFrequency.timeframeQuantity'
            },
            {
                field: 'timeFrameToShow', header: 'Timeframe',
                sortField: 'customerAccessorialNotificationFrequency.pricingUnitOfTimeMeasurementAssociationName.keyword'
            },
            {
                field: 'batchTimeToShow', header: 'Batch Time', isArray: true,
                sortField: 'customerAccessorialNotificationFrequency.customerAccessorialNotificationBatches.batchTime'
            },
            {
                field: 'accessorialNotificationRequiredTypeName', header: 'Notification Preference',
                sortField: 'accessorialNotificationRequiredTypeName.keyword', width: { width: '180px' }
            },

            {
                field: 'batchTimeToShow', header: 'Batch Time', isArray: true,
                sortField: 'customerAccessorialNotificationFrequency.customerAccessorialNotificationBatches.batchTime'
            },
            ...this.freeRuleQuantityCols,
            ...this.freeRuleEventCols,
            ...this.freeRuleSpecificCols,
            ...this.freeRuleRelativeCols,
            ...this.freeRuleHolidayCols,
            { field: 'effectiveDate', header: 'Effective Date', sortField: 'effectiveDate' },
            { field: 'expirationDate', header: 'Expiration Date', sortField: 'expirationDate' },
            { field: 'ruleStatus', header: 'Rule Status', sortField: 'ruleStatus.raw' },
            { field: 'creationDate', header: 'Creation Date', sortField: 'creationDate', width: { width: '200px' } },
            { field: 'createdBy', header: 'Created By', sortField: 'createdBy.keyword' },
            {
                field: 'lastUpdatedDate', header: 'Last Updated Date', sortField: 'lastUpdatedDate',
                width: { width: '200px' }
            },
            { field: 'updatedBy', header: 'Updated By', sortField: 'updatedBy.keyword' }
        ];
        this.rules = [];
    }
}
