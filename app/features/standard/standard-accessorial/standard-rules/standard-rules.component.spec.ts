import { StandardModule } from './../../standard.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app.module';

import { StandardRulesComponent } from './standard-rules.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RulesService } from './service/rules.service';
import { of } from 'rxjs';

describe('StandardRulesComponent', () => {
  let component: StandardRulesComponent;
  let fixture: ComponentFixture<StandardRulesComponent>;
  let rulesService: RulesService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule],
      declarations: [],
      providers: [RulesService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    rulesService = TestBed.get(RulesService);
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('should parse Rule Data', () => {
    const ruleData = {
      '_index': 'pricing-accessorial-rule',
      '_type': 'doc',
      '_id': '1790',
      '_score': null,
      '_source': {
        'chargeTypeId': 7,
        'chargeTypeName': 'asdwew (asdfre)',
        'equipmentLength': null,
        'ruleStatus': null,
        'hasAttachment': null,
        'documentFileNames': null,
        'ruleType': 'Free',
        'equipmentLengthDescription': null,
        'customerAgreementId': 92130,
        'customerAccessorialFreeRuleConfigurationId': 1790,
        'customerAccessorialServiceLevelBusinessUnitServiceOfferings': null,
        'equipmentTypeCode': null,
        'expirationDate': '2099-12-31',
        'equipmentLengthId': null,
        'updatedBy': 'Shrikar Tare',
        'level': 12,
        'accessorialDocumentTypeId': null,
        'documentLegalDescription': 'Test346543',
        'accessorialFreeRuleTypes': [
          {
            'accessorialFreeRuleTypeName': 'Event',
            'accessorialFreeRuleTypeId': 2,
            'customerAccessorialFreeRuleCalendar': null,
            'accessorialFreeRuleQuantityType': null,
            'customerAccessorialFreeRuleEvent': {
              'accessorialDayOfEventFreeRuleModifierId': 2,
              'accessorialFreeRuleTypeName': null,
              'accessorialDayAfterEventFreeRuleModifierId': 2,
              'accessorialDayOfEventFreeRuleModifierName': 'Day Free if Event Time After',
              'accessorialFreeRuleEventTimeframeTypeID': 2,
              'accessorialDayAfterEventFreeRuleModifierTime': '22:43:16',
              'accessorialDayAfterEventFreeRuleModifierName': 'Day Free if Event Time After',
              'customerAccessorialFreeRuleEventId': 144,
              'accessorialDayOfEventFreeRuleModifierTime': '21:43:11',
              'accessorialFreeRuleEventTypeID': 1,
              'accessorialFreeRuleEventTypeName': null,
              'accessorialFreeRuleEventTimeFrameTypeName': 'Day of Event and Day After'
            }
          }
        ],
        'equipmentCategoryCode': null,
        'customerAccessorialCarriers': null,
        'customerChargeName': null,
        'creationDate': '2019-07-04T13:43:32.953',
        'customerAccessorialRequestServices': null,
        'lastUpdatedDate': '2019-07-04T13:43:32.953',
        'equipmentTypeId': null,
        'createdBy': 'Shrikar Tare',
        'customerAccessorialAccount': [
        ],
        'documentInstructionalDescription': null,
        'effectiveDate': '2019-07-04'
      }
    };
    component.parseRulesData(ruleData);
    expect(component).toBeTruthy();
  });
  it('should parse Free Rule Quantity Data', () => {
    const freeRuleQuantity = {
      'accessorialFreeRuleTypes': [
        {
          'accessorialFreeRuleTypeName': 'Quantity',
          'accessorialFreeRuleTypeId': 3,
          'customerAccessorialFreeRuleCalendar': null,
          'accessorialFreeRuleQuantityType': {
            'accessorialFreeRuleQuantityId': 1185,
            'freeRuleQuantityTimeTypeId': 7,
            'accessorialFreeQuantity': 7899,
            'requestedDeliveryDateIndicator': 'Y',
            'freeRuleQuantityDistanceTypeCode': null,
            'accessorialFreeRuleQuantityTypeName': 'Time',
            'accessorialFreeRuleQuantityTypeId': 2,
            'freeRuleQuantityDistanceTypeId': null,
            'freeRuleQuantityTimeTypeCode': 'Day'
          },
          'customerAccessorialFreeRuleEvent': null
        },
      ],
      'ruleType' : 'Free'
    };
    component.parseCustomerAccessorialFreeRule(freeRuleQuantity);
    expect(component).toBeTruthy();
  });
  it('should parse Free Rule Calendar  Specific Data', () => {
    const freeRuleSpecific = {
      'accessorialFreeRuleTypes': [
        {
          'accessorialFreeRuleTypeName': 'Calendar',
          'accessorialFreeRuleTypeId': 1,
          'customerAccessorialFreeRuleCalendar': {
            'pricingAveragePeriodTypeId': null,
            'calendarYear': 2022,
            'customerAccessorialFreeRuleCalendarId': 358,
            'accessorialFreeRuleCalendarApplyTypeName': 'Day After Event',
            'calendarDayDescription': 'Holiday Name',
            'customerAccessorialFreeRuleCalendarWeekDay': [],
            'accessorialFreeRuleCalendarTypeId': 2,
            'accessorialFreeRuleEventTypeId': 2,
            'accessorialFreeRuleCalendarApplyTypeId': 3,
            'customerAccessorialFreeRuleCalendarMonth': [
              {
                'calendarMonth': 'January',
                'customerAccessorialFreeRuleCalendarDay': [
                  1
                ],
                'customerAccessorialFreeRuleCalendarMonthId': 217,
                'customerAccessorialFreeRuleCalendardId': null
              }
            ],
            'customerAccessorialFreeRuleCalendarDayOccurrences': [],
            'accessorialFreeRuleCalendarTypeName': 'Specific',
            'customerAccessorialFreeRuleConfigurationId': null,
            'accessorialFreeRuleEventTypeName': 'Drop',
            'pricingAveragePeriodTypeName': null,
            'firstDayChargeableIndicator': 'Y'
          },
          'accessorialFreeRuleQuantityType': null,
          'customerAccessorialFreeRuleEvent': null
        }
      ],
      'freeRuleDayofWeekWeeklyToShow': [],
      'freeRuleDayofWeekMonthlyToShow': [],
      'freeRuleAppliesToOccurrenceToShow': [],
      'freeRuleFrequencyToShow': [],
      'documentFileNamesShow': [],
      'ruleType': 'Free',
    };
    component.parseCustomerAccessorialFreeRule(freeRuleSpecific);
  });
  it('should parse Free Rule Calendar  Relative monthly Data', () => {
    const freeRuleRelativeMonthly = {
      'accessorialFreeRuleTypes': [
        {
          'accessorialFreeRuleTypeName': 'Calendar',
          'accessorialFreeRuleTypeId': 1,
          'customerAccessorialFreeRuleCalendar': {
            'pricingAveragePeriodTypeId': 2,
            'calendarYear': null,
            'customerAccessorialFreeRuleCalendarId': 359,
            'accessorialFreeRuleCalendarApplyTypeName': 'Day After Event',
            'calendarDayDescription': null,
            'ruleType': 'Free',
            'customerAccessorialFreeRuleCalendarWeekDay': [
              {
                'customerAccessorialFreeRuleCalendarWeekDayId': 181,
                'customerAccessorialFreeRuleCalendarId': null,
                'calendarWeekDay': 'Tuesday'
              }
            ],
            'accessorialFreeRuleCalendarTypeId': 3,
            'accessorialFreeRuleEventTypeId': 1,
            'accessorialFreeRuleCalendarApplyTypeId': 3,
            'customerAccessorialFreeRuleCalendarMonth': [
              {
                'calendarMonth': 'March',
                'customerAccessorialFreeRuleCalendarDay': [
                ],
                'customerAccessorialFreeRuleCalendarMonthId': 218,
                'customerAccessorialFreeRuleCalendardId': null
              }
            ],
            'customerAccessorialFreeRuleCalendarDayOccurrences': [
              {
                'accessorialFrequencyTypeId': 3,
                'accessorialFrequencyTypeName': 'Third',
                'effectiveDate': null,
                'expirationDate': null
              }
            ],
            'accessorialFreeRuleCalendarTypeName': 'Relative',
            'customerAccessorialFreeRuleConfigurationId': null,
            'accessorialFreeRuleEventTypeName': 'Deramp',
            'pricingAveragePeriodTypeName': 'Monthly',
            'firstDayChargeableIndicator': 'Y'
          }
        }
      ],
      'freeRuleDayofWeekWeeklyToShow': [],
      'freeRuleDayofWeekMonthlyToShow': [],
      'freeRuleAppliesToOccurrenceToShow': [],
      'freeRuleFrequencyToShow': [],
      'ruleType': 'Free'
    };
    component.parseCustomerAccessorialFreeRule(freeRuleRelativeMonthly);
  });
  it('should sort data', () => {
    const event = {
      'sortField': 'sectionsToShow',
      'sortOrder' : 1
    };
    const response = {
        'took': 26,
        'timed_out': false,
        '_shards': {
          'total': 3,
          'successful': 3,
          'skipped': 0,
          'failed': 0
        },
        'hits': {
          'total': 11,
          'max_score': null,
          'hits': [
            {
              '_index': 'pricing-accessorial-rule',
              '_type': 'doc',
              '_id': '1788',
              '_score': null,
              '_source': {
                'chargeTypeId': 7,
                'chargeTypeName': 'asdwew (asdfre)',
                'equipmentLength': null,
                'ruleStatus': null,
                'hasAttachment': null,
                'documentFileNames': null,
                'ruleType': 'Free',
                'equipmentLengthDescription': null,
                'customerAgreementId': 92130,
                'customerAccessorialFreeRuleConfigurationId': 1788,
                'customerAccessorialServiceLevelBusinessUnitServiceOfferings': null,
                'equipmentTypeCode': null,
                'expirationDate': '2099-12-31',
                'equipmentLengthId': null,
                'updatedBy': 'Shrikar Tare',
                'level': 12,
                'accessorialDocumentTypeId': null,
                'documentLegalDescription': 'Test346543',
                'accessorialFreeRuleTypes': [
                  {
                    'accessorialFreeRuleTypeName': 'Quantity',
                    'accessorialFreeRuleTypeId': 3,
                    'customerAccessorialFreeRuleCalendar': null,
                    'accessorialFreeRuleQuantityType': {
                      'accessorialFreeRuleQuantityId': 1185,
                      'freeRuleQuantityTimeTypeId': 7,
                      'accessorialFreeQuantity': 7899.0,
                      'requestedDeliveryDateIndicator': 'Y',
                      'freeRuleQuantityDistanceTypeCode': null,
                      'accessorialFreeRuleQuantityTypeName': 'Time',
                      'accessorialFreeRuleQuantityTypeId': 2,
                      'freeRuleQuantityDistanceTypeId': null,
                      'freeRuleQuantityTimeTypeCode': 'Day'
                    },
                    'customerAccessorialFreeRuleEvent': null
                  }
                ],
                'equipmentCategoryCode': null,
                'customerAccessorialCarriers': null,
                'customerChargeName': null,
                'creationDate': '2019-07-04T13:33:43.955',
                'customerAccessorialRequestServices': null,
                'lastUpdatedDate': '2019-07-04T13:33:43.955',
                'equipmentTypeId': null,
                'createdBy': 'Shrikar Tare',
                'customerAccessorialAccount': [
                ],
                'documentInstructionalDescription': null,
                'effectiveDate': '2019-07-04',
                'documentFileNamesShow': []
              },
              'sort': [
              ]
            }
          ]
        }
    };
    spyOn(RulesService.prototype, 'getRules').and.returnValue(of(response));
    component.loadConfigValuesLazy(event);
  });

  it('should call getGridValues', () => {
    const gridResponse = {
      'took': 42,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 3,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-accessorial-rule-2-2019.06.20',
            '_type': 'doc',
            '_id': '123',
            '_score': null,
            '_source': {
              'chargeTypeId': 42,
              'chargeTypeName': 'Bobtail',
              'equipmentLength': 53,
              'accessorialNotificationTypeId': 2,
              'hasAttachment': null,
              'documentFileNames': null,
              'accessorialNotificationRequiredTypeName': 'Notification Preferred',
              'ruleType': 'Notification',
              'customerAccessorialNotificationMethods': [
                {
                  'customerAccessorialNotificationMethodId': null,
                  'accessorialNotificationMethodTypeId': 1,
                  'accessorialEmailTemplateDefaultIndicator': null,
                  'accessorialEmailTemplateTypeName': 'Default',
                  'accessorialNotificationMethodDefaultIndicator': null,
                  'websiteAddress': null,
                  'accessorialNotificationMethodTypeName': 'Email',
                  'accessorialEmailTemplateTypeId': 1
                }
              ],
              'equipmentLengthDescription': '53 Feet in Length',
              'customerAgreementId': 48,
              'customerAccessorialServiceLevelBusinessUnitServiceOfferings': [
                {
                  'serviceOffering': 'Backhaul',
                  'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': null,
                  'businessUnit': 'DCS',
                  'serviceLevelBusinessUnitServiceOfferingAssociationId': 11,
                  'serviceLevel': 'Standard'
                }
              ],
              'accessorialNotificationTypeName': 'Final Notify',
              'equipmentTypeCode': 'Chassis',
              'expirationDate': '2099-12-31',
              'customerAccessorialNotificationFrequency': {
                'pricingUnitOfTimeMeasurementAssociationId': 16,
                'accessorialNotificationEventTypeId': 1,
                'accessorialNotificationEventTypeName': 'Arrival',
                'timeframeQuantity': 12,
                'accessorialNotificationOccurrenceTypeId': 3,
                'accessorialNotificationTriggerFrequencyTypeId': 2,
                'accessorialNotificationTriggerFrequencyTypeName': 'Per Event',
                'accessorialNotificationOccurrenceTypeName': 'After Event',
                'customerAccessorialNotificationBatches': null,
                'pricingUnitOfTimeMeasurementAssociationName': 'Days',
                'customerAccessorialNotificationFrequencyId': null
              },
              'equipmentLengthId': 2350,
              'updatedBy': 'Process ID',
              'level': 11,
              'accessorialDocumentTypeId': null,
              'documentLegalDescription': 'textField',
              'equipmentCategoryCode': 'Chassis',
              'accessorialNotificationRequiredTypeId': 1,
              'customerAccessorialCarriers': [
                {
                  'customerAccessorialCarrierId': null,
                  'carrierName': 'A A A COOPER TRANSPORTATION',
                  'carrierCode': 'AAA0',
                  'carrierId': 70
                }
              ],
              'customerChargeName': null,
              'creationDate': '2019-06-21T05:51:47.334',
              'customerAccessorialRequestServices': [
                {
                  'customerAccessorialRequestServiceId': null,
                  'requestedServiceTypeCode': 'Team Driving',
                  'requestedServiceTypeId': null
                }
              ],
              'lastUpdatedDate': '2019-06-21T05:51:47.334',
              'equipmentTypeId': 27,
              'createdBy': 'Process ID',
              'customerAccessorialAccount': [],
              'documentInstructionalDescription': null,
              'effectiveDate': '2019-06-21',
              'customerAccessorialNotificationConfigurationId': 123
            },
            'sort': []
          }
        ]
      }
    };
    spyOn(RulesService.prototype, 'getRules').and.returnValues(of(gridResponse));
    component.getGridValues('s', 1);
    component.parseCustomerAccessorialNotificationMethods(gridResponse);
  });

  it('should call searchRule', () => {
    component.searchRule('s');
    const event = {first: 0, rows: 25};
    component.onRulePaginationChange(event);
  });
});
