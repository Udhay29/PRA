import { NotificationModule } from './../notification.module';
import { NotifyWhenService } from './service/notify-when.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from './../../../../../app.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { APP_BASE_HREF } from '@angular/common';
import { DebugElement } from '@angular/core';

import { NotifyWhenComponent } from './notify-when.component';


describe('NotifyWhenComponent', () => {
  let component: NotifyWhenComponent;
  let fixture: ComponentFixture<NotifyWhenComponent>;
  let notifyWhenService: NotifyWhenService;
  let debugElement: DebugElement;

  const notificationType = {
    '_embedded': {
      'accessorialNotificationRequiredTypes': [
        {
          '@id': 1,
          'createTimestamp': '2019-05-24T14:35:50.4588722',
          'createProgramName': 'SSIS',
          'lastUpdateProgramName': 'SSIS',
          'createUserId': 'PIDNEXT',
          'lastUpdateUserId': 'PIDNEXT',
          'accessorialNotificationRequiredTypeId': 1,
          'accessorialNotificationRequiredTypeName': 'Notification Preferred',
          'effectiveDate': '2019-05-24',
          'expirationDate': '2099-12-31',
          'lastUpdateTimestampString': '2019-05-24T14:35:50.4588722',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationRequiredTypes/1'
            },
            'accessorialNotificationRequiredType': {
              'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationRequiredTypes/1'
            }
          }
        }
      ]
    },
    '_links': {
      'self': {
        'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationRequiredTypes{?page,size,sort}',
        'templated': true
      },
      'profile': {
        'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/profile/accessorialNotificationRequiredTypes'
      }
    },
    'page': {
      'size': 50,
      'totalElements': 2,
      'totalPages': 1,
      'number': 0
    }
  };
  const frequency = {
    '_embedded': {
      'accessorialNotificationTriggerFrequencyTypes': [{
        '@id': 1,
        'createTimestamp': '2019-05-24T14:36:08.0821129',
        'createProgramName': 'SSIS',
        'lastUpdateProgramName': 'SSIS',
        'createUserId': 'PIDNEXT',
        'lastUpdateUserId': 'PIDNEXT',
        'accessorialNotificationTriggerFrequencyTypeId': 1,
        'accessorialNotificationTriggerFrequencyTypeName': 'Batch',
        'effectiveDate': '2019-05-24',
        'expirationDate': '2099-12-31',
        'lastUpdateTimestampString': '2019-05-24T14:36:08.0821129',
        '_links': {
          'self': {
            'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationTriggerFrequencyTypes/1'
          },
          'accessorialNotificationTriggerFrequencyType': {
            'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationTriggerFrequencyTypes/1'
          }
        }
      }]
    },
    '_links': {
      'self': {
        'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationTriggerFrequencyTypes{?page,size,sort}',
        'templated': true
      },
      'profile': {
        'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/profile/accessorialNotificationTriggerFrequencyTypes'
      }
    },
    'page': {
      'size': 50,
      'totalElements': 2,
      'totalPages': 1,
      'number': 0
    }
  };
  const eventOccuarnceTime = {
    '_embedded': {
      'accessorialNotificationOccurrenceTypes': [{
        '@id': 1,
        'createTimestamp': '2019-05-24T14:36:37.4840292',
        'createProgramName': 'SSIS',
        'lastUpdateProgramName': 'SSIS',
        'createUserId': 'PIDNEXT',
        'lastUpdateUserId': 'PIDNEXT',
        'accessorialNotificationOccurrenceTypeId': 1,
        'accessorialNotificationOccurrenceTypeName': 'On',
        'effectiveDate': '2019-05-24',
        'expirationDate': '2099-12-31',
        'lastUpdateTimestampString': '2019-05-24T14:36:37.4840292',
        '_links': {
          'self': {
            'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationOccurrenceTypes/1'
          },
          'accessorialNotificationOccurrenceType': {
            'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationOccurrenceTypes/1'
          }
        }
      }]
    },
    '_links': {
      'self': {
        'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationOccurrenceTypes{?page,size,sort}',
        'templated': true
      },
      'profile': {
        'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/profile/accessorialNotificationOccurrenceTypes'
      }
    },
    'page': {
      'size': 50,
      'totalElements': 3,
      'totalPages': 1,
      'number': 0
    }
  };

  const eventName = {
    '_embedded': {
      'accessorialNotificationEventTypes': [{
        '@id': 1,
        'createTimestamp': '2019-05-24T14:37:12.3678947',
        'createProgramName': 'SSIS',
        'lastUpdateProgramName': 'SSIS',
        'createUserId': 'PIDNEXT',
        'lastUpdateUserId': 'PIDNEXT',
        'accessorialNotificationEventTypeId': 1,
        'accessorialNotificationEventTypeName': 'Arrival',
        'effectiveDate': '2019-05-24',
        'expirationDate': '2099-12-31',
        'lastUpdateTimestampString': '2019-05-24T14:37:12.3678947',
        '_links': {
          'self': {
            'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationEventTypes/1'
          },
          'accessorialNotificationEventType': {
            'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationEventTypes/1'
          }
        }
      }]
    },
    '_links': {
      'self': {
        'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationEventTypes{?page,size,sort}',
        'templated': true
      },
      'profile': {
        'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/profile/accessorialNotificationEventTypes'
      }
    },
    'page': {
      'size': 50,
      'totalElements': 4,
      'totalPages': 1,
      'number': 0
    }
  };
  const timeframe = {
    '_embedded': {
      'pricingUnitOfTimeMeasurementAssociations': [{
        '@id': 1,
        'createTimestamp': '2019-05-24T14:21:11.6623113',
        'createProgramName': 'SSIS',
        'lastUpdateProgramName': 'SSIS',
        'createUserId': 'PIDNEXT',
        'lastUpdateUserId': 'PIDNEXT',
        'pricingUnitOfTimeMeasurementAssociationId': 16,
        'effectiveTimestamp': '2019-05-24',
        'expirationTimestamp': '2099-12-31',
        'unitOfTimeMeasurementCode': 'Days',
        'pricingFunctionalAreaId': 6,
        'lastUpdateTimestampString': '2019-05-24T14:21:11.6623113',
        '_links': {
          'self': {
            'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/pricingUnitOfTimeMeasurementAssociations/16'
          },
          'pricingUnitOfTimeMeasurementAssociation': {
            'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/pricingUnitOfTimeMeasurementAssociations/16'
          }
        }
      }]
    },
    '_links': {
      'self': {
        // tslint:disable-next-line: max-line-length
        'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/pricingUnitOfTimeMeasurementAssociations/search/getPricingUnitOfTimeMeasurementAssociations'
      }
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, HttpClientTestingModule, NotificationModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, NotifyWhenService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyWhenComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    notifyWhenService = debugElement.injector.get(NotifyWhenService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getFrequency', () => {
    component.getFrequency();
    spyOn(notifyWhenService, 'getFrequency').and.callThrough();
  });
  it('should call getAccessorialNotificationRequiredTypes', () => {
    component.getAccessorialNotificationRequiredTypes();
    spyOn(notifyWhenService, 'getAccessorialNotificationRequiredTypes').and.callThrough();
  });
  it('should call getEventOccurrenceTime', () => {
    component.getEventOccurrenceTime();
    spyOn(notifyWhenService, 'getEventOccurrenceTime').and.callThrough();
  });
  it('should call getEventName', () => {
    component.getEventName();
    spyOn(notifyWhenService, 'getEventName').and.callThrough();
  });
  it('should call getTimeFrame', () => {
    component.getTimeFrame();
    spyOn(notifyWhenService, 'getTimeFrame').and.callThrough();
  });
  it('should cal onDropdownClick', () => {
    const response = {
      query: 'O'
    };
    component.notifyWhenModel.frequency = [{ label: 'On', value: 12 }];
    component.onDropDownClick(response, 'frequency');
  });
  it('should cal onBlureventOccuranceTime', () => {
    const event = {
      target: {
        value: ''
      }
    };
    component.onBlureventOccuranceTime(event);
  });
  it('should cal onBlureventOccuranceTimeElse', () => {
    const event = {
      target: {
        value: 'ss'
      }
    };
    component.onBlureventOccuranceTime(event);
  });
  it('should cal onBlurtimeframe', () => {
    const event = {
      target: {
        value: ''
      }
    };
    component.onBlurtimeframe(event);
  });
  it('should cal onBlurtimeframeElse', () => {
    const event = {
      target: {
        value: 'ss'
      }
    };
    component.onBlurtimeframe(event);
  });
  it('should cal onBlureventName', () => {
    const event = {
      target: {
        value: ''
      }
    };
    component.onBlureventName(event);
  });
  it('should cal onBlureventNameElse', () => {
    const event = {
      target: {
        value: 'ss'
      }
    };
    component.onBlureventName(event);
  });
  it('should cal onBlurFrequency', () => {
    const event = {
      target: {
        value: ''
      }
    };
    component.onBlurFrequency(event);
  });
  it('should cal onBlurFrequencyElse', () => {
    const event = {
      target: {
        value: 'ss'
      }
    };
    component.onBlurFrequency(event);
  });
  it('should cal onSelectFrequencyPerEvent', () => {
    const event = {
      label: 'Per Event'
    };
    component.notifyWhenModel.notifyWhenForm.controls.frequency.setValue('On');
    component.onSelectFrequency(event);
  });
  it('should cal onSelectFrequencyPerEventElse', () => {
    const event = {
      label: 'On'
    };
    component.notifyWhenModel.notifyWhenForm.controls.frequency.setValue('On');
    component.onSelectFrequency(event);
  });
  it('should cal onSelectFrequencyBatch', () => {
    const event = {
      label: 'Batch'
    };
    component.notifyWhenModel.notifyWhenForm.controls.frequency.setValue('On');
    component.onSelectFrequency(event);
  });
  it('should cal onSelecteventOccurrenceTimeOn', () => {
    const event = {
      label: 'On'
    };
    component.onSelecteventOccurrenceTime(event);
  });
  it('should cal onSelecteventOccurrenceTimeRAtherThanOn', () => {
    const event = {
      label: 'Per'
    };
    component.onSelecteventOccurrenceTime(event);
  });

  it('should cal populateFrequency', () => {
    component.populateFrequency(frequency);
  });
  it('should cal populateFrequencyelse', () => {
    const value = '';
    component.populateFrequency(value);
  });

  it('should cal populateAccessorialNotificationRequiredTypes', () => {
    component.populateAccessorialNotificationRequiredTypes(notificationType);
  });
  it('should cal populateAccessorialNotificationRequiredTypeselse', () => {
    const value = '';
    component.populateAccessorialNotificationRequiredTypes(value);
  });
  it('should cal populateEventOccurrenceTime', () => {
    component.populateEventOccurrenceTime(eventOccuarnceTime);
  });
  it('should cal populateEventOccurrenceTimeelse', () => {
    const value = '';
    component.populateEventOccurrenceTime(value);
  });
  it('should cal populateEventName', () => {
    component.populateEventName(eventName);
  });
  it('should cal populateEventNameElse', () => {
    const value = '';
    component.populateEventName(value);
  });
  it('should cal populateTimeFrame', () => {
    component.populateTimeFrame(timeframe);
  });
  it('should cal populateTimeFrameElse', () => {
    const value = '';
    component.populateTimeFrame(value);
  });
  it('should cal batchTimeSuggestionClick', () => {
    component.notifyWhenModel.suggestionResult = [{ label: 'e', value: 1 }, { label: 'e', value: 1 }];
    component.notifyWhenModel.notifyWhenForm.controls.batchTime.setValue({ label: 'e', value: 1 });
    component.batchTimeSuggestionClick('batchTime');
  });
  it('should cal emptyMethod', () => {
    component.createForm();
    component.removeValidatorsOnSelectOfBatch();
    component.setValidatorsOnSelectOfBatch();
    component.removeValidatorsOnSelectOfPerEvent();
    component.setValidatorsOnSelectOfPerEvent();
    component.removeValidationOnEvent();
    component.setValidationOnEvent();
    component.batchTimeSuggestion();
  });
  it('should cal onBlurEInputTimeframe', () => {
    component.notifyWhenModel.notifyWhenForm.controls.timeframe.setValue('');
    component.notifyWhenModel.notifyWhenForm.controls.timeframeInput.setValue('');
    component.onBlurInputTimeframe();
  });
  it('should cal onBlurEInputTimeframeMinute', () => {
    const value = {
      label: 'Minute',
      value: 'Minute'
    };
    component.notifyWhenModel.notifyWhenForm.controls.timeframe.setValue(value);
    component.notifyWhenModel.notifyWhenForm.controls.timeframeInput.setValue(20);
    component.onBlurInputTimeframe();
  });
  it('should cal onBlurEInputTimeframeDay', () => {
    const value = {
      label: 'Days',
      value: 'Days'
    };
    component.notifyWhenModel.notifyWhenForm.controls.timeframe.setValue(value);
    component.notifyWhenModel.notifyWhenForm.controls.timeframeInput.setValue(15);
    component.onBlurInputTimeframe();
  });
  it('should cal timeFrameCheckifCandition', () => {
    component.notifyWhenModel.notifyWhenForm.controls.timeframeInput.setValue(15);
    component.timeFrameCheck();
  });
  it('should cal timeFrameCheckElseCondition', () => {
    component.notifyWhenModel.notifyWhenForm.controls.timeframeInput.setValue(0);
    component.timeFrameCheck();
  });
});
