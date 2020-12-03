import { NotificationModule } from './../notification.module';
import { NotifyByService } from './service/notify-by.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from './../../../../../app.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { configureTestSuite } from 'ng-bullet';
import { APP_BASE_HREF } from '@angular/common';
import { NotifyByComponent } from './notify-by.component';

describe('NotifyByComponent', () => {
  let component: NotifyByComponent;
  let fixture: ComponentFixture<NotifyByComponent>;
  let notifyByService: NotifyByService;
  let debugElement: DebugElement;
  const frequency = {
    '_embedded': {
      'accessorialNotificationTypes': [{
        '@id': 1,
        'createTimestamp': '2019-05-24T14:35:25.0637895',
        'createProgramName': 'SSIS',
        'lastUpdateProgramName': 'SSIS',
        'createUserId': 'PIDNEXT',
        'lastUpdateUserId': 'PIDNEXT',
        'accessorialNotificationTypeId': 1,
        'accessorialNotificationTypeName': 'Prenotify',
        'effectiveDate': '2019-05-24',
        'expirationDate': '2099-12-31',
        'lastUpdateTimestampString': '2019-05-24T14:35:25.0637895',
        '_links': {
          'self': {
            'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationTypes/1'
          },
          'accessorialNotificationType': {
            'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationTypes/1'
          }
        }
      }]
    }
  };

  const frequency1 = {
    '_embedded': {
      'accessorialEmailTemplateTypes': [{
        '@id': 1,
        'createTimestamp': '2019-05-24T14:37:23.8376289',
        'createProgramName': 'SSIS',
        'lastUpdateProgramName': 'SSIS',
        'createUserId': 'PIDNEXT',
        'lastUpdateUserId': 'PIDNEXT',
        'accessorialEmailTemplateTypeId': 1,
        'accessorialEmailTemplateTypeName': 'Default',
        'effectiveDate': '2019-05-24',
        'defaultIndicator': 'Y',
        'expirationDate': '2099-12-31',
        'lastUpdateTimestampString': '2019-05-24T14:37:23.8376289',
        '_links': {
          'self': {
            'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialEmailTemplateTypes/1'
          },
          'accessorialEmailTemplateType': {
            'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialEmailTemplateTypes/1'
          }
        }
      }]
    }
  };

  const frequency2 = {
    '_embedded': {
      'accessorialNotificationMethodTypes': [{
        '@id': 1,
        'createTimestamp': '2019-05-24T14:36:26.6869762',
        'createProgramName': 'SSIS',
        'lastUpdateProgramName': 'SSIS',
        'createUserId': 'PIDNEXT',
        'lastUpdateUserId': 'PIDNEXT',
        'accessorialNotificationMethodTypeId': 1,
        'accessorialNotificationMethodTypeName': 'Email',
        'expirationDate': '2099-12-31',
        'defaultIndicator': 'Y',
        'effectiveDate': '2019-05-24',
        'lastUpdateTimestampString': '2019-05-24T14:36:26.6869762',
        '_links': {
          'self': {
            'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationMethodTypes/1'
          },
          'accessorialNotificationMethodType': {
            'href': 'https://pricing-test.jbhunt.com/pricingaccessorialservices/accessorialNotificationMethodTypes/1'
          }
        }
      }]
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, HttpClientTestingModule, NotificationModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyByComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    notifyByService = debugElement.injector.get(NotifyByService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getNotificationType', () => {
    component.getNotificationType();
    spyOn(notifyByService, 'getNotificationType').and.callThrough();
  });

  it('should call getTemplateType', () => {
    component.getTemplateType();
    spyOn(notifyByService, 'getTemplateType').and.callThrough();
  });

  it('should call getCheckBoxData', () => {
    component.getCheckBoxData();
    spyOn(notifyByService, 'getCheckBoxData').and.callThrough();
  });

  it('should cal onDropdownClick', () => {
    const response = {
      query: 'O'
    };
    component.notifyByModel.TemplateType = [{ label: 'On', value: 12 }];
    component.onDropDownClick(response, 'TemplateType');
  });
  it('should cal onDropdownClickElse', () => {
    const response = {
      query: 'O'
    };
    component.notifyByModel.TemplateType = [{ label: '123', value: 12 }];
    component.onDropDownClick(response, 'TemplateType');
  });
  it('should cal onDropdownClickElseLast', () => {
    component.notifyByModel.TemplateType = null;
    component.onDropDownClick(null, 'TemplateType');
  });

  it('should cal checkboxChange', () => {
    component.checkBoxChange();
    component.setvalidators();
  });
  it('should cal checkboxChangeIf', () => {
    component.notifyByModel.notifyByForm.controls['selectionCheckbox'].setValue(['Email', 'Website']);
    component.setvalidators();
  });
  it('should cal checkboxChangeIf', () => {
    component.notifyByModel.notifyByForm.controls['selectionCheckbox'].setValue(['Website']);
    component.setvalidators();
  });

  it('should cal patternCheck', () => {
    component.patternCheck();
  });
  it('should cal patternCheckElse', () => {
    component.notifyByModel.notifyByForm.controls['websiteDesc'].setValue('http://www.google');
    component.patternCheck();
  });

  it('should cal onBlurNotificationType', () => {
    const event = {
      target: {
        value: ''
      }
    };
    component.onBlurNotificationType(event);
  });
  it('should cal onBlurNotificationTypeElse', () => {
    const event = {
      target: {
        value: '123'
      }
    };
    component.onBlurNotificationType(event);
  });

  it('should cal onBluremailNotificationType', () => {
    const event = {
      target: {
        value: ''
      }
    };
    component.onBluremailNotificationType(event);
  });
  it('should cal onBluremailNotificationTypeElse', () => {
    const event = {
      target: {
        value: '123'
      }
    };
    component.onBluremailNotificationType(event);
  });

  it('should cal populateNotificationType', () => {
    component.populateNotificationType(frequency);
  });
  it('should cal populateNotificationTypeElse', () => {
    component.populateNotificationType(null);
  });

  it('should cal populateTemplateType', () => {
    component.populateTemplateType(frequency1);
  });
  it('should cal populateTemplateTypeElse', () => {
    component.populateTemplateType(null);
  });
  it('should cal removeWebsiteValidatorsRequired', () => {
    component.removeWebsiteValidatorsRequired();
  });
  it('should cal setWebsiteMandatory', () => {
    component.setWebsiteMandatory();
  });
  it('should cal removeEmailValidators', () => {
    component.removeEmailValidators();
  });
  it('should cal setEmailAsRequired', () => {
    component.setEmailAsRequired();
  });

  it('should cal populateCheckBoxData', () => {
    component.populateCheckBoxData(frequency2);
  });
  it('should cal populateCheckBoxDataElse', () => {
    component.populateCheckBoxData(null);
  });
});
