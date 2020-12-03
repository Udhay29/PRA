import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { FreeEventTypeComponent } from './free-event-type.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../../view-agreement-details.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FreeEventTypeService } from './service/free-event-type.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';

describe('FreeEventTypeComponent', () => {
  let component: FreeEventTypeComponent;
  let fixture: ComponentFixture<FreeEventTypeComponent>;
  let freeEventTypeService: FreeEventTypeService;
  const formBuilder: FormBuilder = new FormBuilder();
  let eventTyperesponse, freeTimeresponse, freeAmountresponse;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [FreeEventTypeService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeEventTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    freeEventTypeService = fixture.debugElement.injector.get(FreeEventTypeService);
    component.freeEventTypeModel.freeEventTypeForm = formBuilder.group({
      freeTypeEventName: ['abc', Validators.required],
      freeTimeEvent: ['0', Validators.required],
      freeAmountFirstEvent: ['1', Validators.required],
      freeAmountSecondEvent: ['2', Validators.required],
      pickatimefirst: ['1', Validators.required],
      pickatimesecond: ['1', Validators.required],
    });
    eventTyperesponse = {
      _embedded: {
        accessorialFreeRuleEventTypes: [{
          accessorialFreeRuleEventTypeId: 1,
          accessorialFreeRuleEventTypeName: 'string',
          _links:  {
            self: {
              href : 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/3'
            }
          }
        }]
      },
      _links:  {
        self: {
          href : 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/3'
        }
      },
      page: {
        size: 1,
        totalElements: 1,
        totalPages: 1,
        number: 1
      }
    };
    freeTimeresponse = {
      _embedded: {
        accessorialFreeRuleEventFreeTimeTypes: [{
          accessorialFreeRuleEventTimeframeTypeID: 1,
          accessorialFreeRuleEventTimeframeTypeName: 'string',
          _links: {
            self: {
              href : 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/3'
            }
          }
        }]
      },
      _links: { self: {
        href : 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/3'
      }},
      page: {
        size: 1,
        totalElements: 1,
        totalPages: 1,
        number: 1
      }
    };
    freeAmountresponse = {
      _embedded: {
        accessorialFreeRuleEventFreeAmountTypes: [{
          accessorialFreeRuleEventModifierTypeID: 1,
          accessorialFreeRuleEventModifierTypeName: 'string',
          _links: {
            self: {
              href: 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/3',
              templated: true
            },
            accessorialFreeRuleEventType: {
              href: 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/3',
              templated: true
            }
          }
        }]
      },
      _links:  {
        self: {
          href: 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/3',
          templated: true
        },
        profile: {
          href: 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/3'
        }
      },
      page: {
        size: 1,
        totalElements: 1,
        totalPages: 1,
        number: 1
      }
    };

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getEventNameTypes', () => {
    spyOn(freeEventTypeService, 'getEventNameTypes').and.returnValue(of(eventTyperesponse));
    component.getEventNameTypes();
  });

  it('should populateEventNameType for if', () => {
    component.populateEventNameType(eventTyperesponse);
  });

  it('should populateEventNameType for else', () => {
    const eventTyperesponse1 = null;
    component.populateEventNameType(eventTyperesponse1);
  });

  it('should call onTypeEventName', () => {
    component.freeEventTypeModel.freeRuleEventNameTypes = [{
      label: 'string',
      value: 1
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="freeTypeEventName"]'));
    element.triggerEventHandler('completeMethod', {'query': 's'});
  });

  it('should call onTypeEventName for else', () => {
    component.freeEventTypeModel.freeRuleEventNameTypes = null;
    const event: any = {
      query: 'abc'
    };
    component.onTypeEventName(event);
  });

  it('should call onTypeEventName for else2', () => {
    component.freeEventTypeModel.freeRuleEventNameTypes = [{
      label: 'string',
      value: 1
    }];
    const event: any = {
      query: '-1'
    };
    component.onTypeEventName(event);
  });

  it('should call onEventNameTypeBlur for if and else', () => {
    const event: any = {
      target: {
        value: false
      }
    };
    component.onEventNameTypeBlur(event, 'freeAmountFirstEvent');
    component.onEventNameTypeBlur(event, 'freeTypeEventName');
    component.freeEventTypeModel.freeEventTypeForm.controls['freeAmountFirstEvent'].setValue('');
    component.onEventNameTypeBlur(event, 'freeAmountFirstEvent');
  });

  it('should call onSelectEventFreeTime', () => {
    component.freeEventTypeModel.freeRuleDayOfEvent = {
      accessorialFreeRuleEventTimeframeTypeID: 1
    };
    component.freeEventTypeModel.freeRuleDayOfEventAndDayAfter = {
      accessorialFreeRuleEventTimeframeTypeID: 1
    };
    component.freeEventTypeModel.freeEventTypeForm.controls['pickatimefirst'].setValue('20/9/2019');
    component.freeEventTypeModel.isFreeRuleFirstTimeIndicator = true;
    const element = fixture.debugElement.query(By.css('[formControlName="freeTimeEvent"]'));
    element.triggerEventHandler('onSelect', {'value': 1});
  });

  it('should call onSelectEventFreeTime for else', () => {
    component.freeEventTypeModel.freeRuleDayOfEvent = {
      accessorialFreeRuleEventTimeframeTypeID: 1
    };
    component.freeEventTypeModel.freeRuleDayOfEventAndDayAfter = {
      accessorialFreeRuleEventTimeframeTypeID: 1
    };
    component.freeEventTypeModel.freeEventTypeForm.controls['pickatimefirst'].setValue('20/9/2019');
    component.freeEventTypeModel.isFreeRuleFirstTimeIndicator = false;
    const element = fixture.debugElement.query(By.css('[formControlName="freeTimeEvent"]'));
    element.triggerEventHandler('onSelect', {'value': 1});
  });

  it('should call onSelectEventFreeTime for else', () => {
    component.freeEventTypeModel.freeRuleDayOfEvent = {
      accessorialFreeRuleEventTimeframeTypeID: 1
    };
    component.freeEventTypeModel.freeRuleDayOfEventAndDayAfter = {
      accessorialFreeRuleEventTimeframeTypeID: 1
    };
    component.freeEventTypeModel.freeEventTypeForm.controls['pickatimefirst'].setValue('20/9/2019');
    component.freeEventTypeModel.isFreeRuleFirstTimeIndicator = false;
    const element = fixture.debugElement.query(By.css('[formControlName="freeTimeEvent"]'));
    element.triggerEventHandler('onSelect', {'value': 2});
  });

  it('should call getEventFreeTime', () => {
    freeTimeresponse = {
      _embedded: {
        accessorialFreeRuleEventTimeFrameTypes: [{
          accessorialFreeRuleEventTimeframeTypeName: 'string',
          accessorialFreeRuleEventTimeframeTypeID: 1
        }]
      }
    };
    component.getEventFreeTime();
  });

  it('should call populateEventFreeTimeType', () => {
    const eventTyperesponse1 = false;
    freeTimeresponse = {
      _embedded: {
        accessorialFreeRuleEventTimeFrameTypes: [{
          accessorialFreeRuleEventTimeframeTypeName: 'string',
          accessorialFreeRuleEventTimeframeTypeID: 1
        }]
      }
    };
    component.populateEventFreeTimeType(freeTimeresponse);
    freeTimeresponse = false;
    component.populateEventFreeTimeType(freeTimeresponse);
  });

  it('should call onTypeFreeTime', () => {
    component.freeEventTypeModel.freeRuleEventFreeTimeTypes = [{
      label: 'string',
      value: 1
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="freeTimeEvent"]'));
    element.triggerEventHandler('completeMethod', {'query': 's'});
  });

  it('should call onTypeFreeTime for else', () => {
    component.freeEventTypeModel.freeRuleEventFreeTimeTypes = [{
      label: 'string',
      value: 1
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="freeTimeEvent"]'));
    element.triggerEventHandler('completeMethod', {'query': '-1'});
  });

  it('should call onTypeFreeTime for else', () => {
    const event: any = {
      query: '-1'
    };
    component.freeEventTypeModel.freeRuleEventFreeTimeTypes = null;
    component.onTypeFreeTime(event);
  });

  it('should call setFormValidations', () => {
    component.setFormValidations('freeTypeEventName', 'add');
    component.setFormValidations('freeTypeEventName', 'remove');
    component.setFormValidations('freeTypeEventName', 'abc');
  });

  it('should call onSelectFreeAmountFirst', () => {
    component.freeEventTypeModel.eventFreeAmountFirstDayFree = {
      accessorialFreeRuleEventModifierTypeID: 1
    };
    component.freeEventTypeModel.eventFreeAmountFirstDayFreeIfEventTimeAfter = {
      accessorialFreeRuleEventModifierTypeID: 1
    };
    component.freeEventTypeModel.eventFreeAmountFirstDayFreeIfEventTimeBefore = {
      accessorialFreeRuleEventModifierTypeID: 1
    };
    const element = fixture.debugElement.query(By.css('[formControlName="freeAmountFirstEvent"]'));
    element.triggerEventHandler('onSelect', {'value': 1});
  });

  it('should call onSelectFreeAmountFirst for else', () => {
    component.freeEventTypeModel.eventFreeAmountFirstDayFree = {
      accessorialFreeRuleEventModifierTypeID: 1
    };
    component.freeEventTypeModel.eventFreeAmountFirstDayFreeIfEventTimeAfter = {
      accessorialFreeRuleEventModifierTypeID: 1
    };
    component.freeEventTypeModel.eventFreeAmountFirstDayFreeIfEventTimeBefore = {
      accessorialFreeRuleEventModifierTypeID: 1
    };
    const element = fixture.debugElement.query(By.css('[formControlName="freeAmountFirstEvent"]'));
    element.triggerEventHandler('onSelect', {'value': 2});
  });

  it('should call onSelectFreeAmountSecond for if', () => {
    const event: any = { value: 1};
    component.freeEventTypeModel.eventFreeAmountSecondDayFree['accessorialFreeRuleEventModifierTypeID'] = 1;
    component.freeEventTypeModel.eventFreeAmountSecondDayFreeIfEventTimeAfter['accessorialFreeRuleEventModifierTypeID'] = 1;
    component.freeEventTypeModel.eventFreeAmountSecondDayFreeIfEventTimeBefore['accessorialFreeRuleEventModifierTypeID'] = 1;
    component.onSelectFreeAmountSecond(event);
  });

  it('should call onSelectFreeAmountSecond for else', () => {
    const event: any = { value: 2};
    component.freeEventTypeModel.eventFreeAmountSecondDayFree['accessorialFreeRuleEventModifierTypeID'] = 1;
    component.freeEventTypeModel.eventFreeAmountSecondDayFreeIfEventTimeAfter['accessorialFreeRuleEventModifierTypeID'] = 1;
    component.freeEventTypeModel.eventFreeAmountSecondDayFreeIfEventTimeBefore['accessorialFreeRuleEventModifierTypeID'] = 1;
    component.onSelectFreeAmountSecond(event);
  });

  it('should call populateEventFreeAmountType', () => {
    const eventFreeAmount1 = {
      _embedded: {
        accessorialFreeRuleEventModifierTypes: [{
          accessorialFreeRuleEventModifierTypeName: 'string',
          accessorialFreeRuleEventModifierTypeID: 1
        }]
      }
    };
    component.populateEventFreeAmountType(eventFreeAmount1);
  });

  it('should call populateEventFreeAmountSecondType', () => {
    const eventFreeAmount1 = {
      _embedded: {
        accessorialFreeRuleEventModifierTypes: [{
          accessorialFreeRuleEventModifierTypeName: 'string',
          accessorialFreeRuleEventModifierTypeID: 1
        }]
      }
    };
    component.populateEventFreeAmountSecondType(eventFreeAmount1);
  });

  it('should call onTypeFreeAmountFirst', () => {
    component.freeEventTypeModel.eventFreeAmountFirstTypes = [{
      label: 'string',
      value: 1
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="freeAmountFirstEvent"]'));
    element.triggerEventHandler('completeMethod', {'query': 's'});
  });

  it('should call onTypeFreeAmountFirst for else', () => {
    component.freeEventTypeModel.eventFreeAmountFirstTypes = [{
      label: 'string',
      value: 1
    }];
    const event: any = {
      query: '-1'
    };
    component.onTypeFreeAmountFirst(event);
  });

  it('should call onTypeFreeAmountFirst for else', () => {
    component.freeEventTypeModel.eventFreeAmountFirstTypes = [];
    const event: any = {
      query: 's'
    };
    component.onTypeFreeAmountFirst(event);
  });

  it('should call onTypeFreeAmountSecond for if', () => {
    component.freeEventTypeModel.eventFreeAmountSecondTypes = [{
      label: 'string',
      value: 1
    }];
    const event: any = {
      query: 's'
    };
    component.onTypeFreeAmountSecond(event);
  });

  it('should call onTypeFreeAmountSecond for else', () => {
    component.freeEventTypeModel.eventFreeAmountSecondTypes = [{
      label: 'string',
      value: 1
    }];
    const event: any = {
      query: '-1'
    };
    component.onTypeFreeAmountSecond(event);
  });

  it('should call onTypeFreeAmountSecond for else', () => {
    component.freeEventTypeModel.eventFreeAmountSecondTypes = [];
    const event: any = {
      query: 's'
    };
    component.onTypeFreeAmountSecond(event);
  });

  it('should call onTimeTypeBlur for else', () => {
    const event: any = {
      target: {
        value: '11:36 AM'
      }
    };
    component.onTimeTypeBlur(event, 'freeTimeEvent');
  });

  it('should call onTimeTypeBlur for if', () => {
    const event: any = {
      target: {
        value: 'abc'
      }
    };
    component.onTimeTypeBlur(event, 'freeTimeEvent');
  });

  it('should call onTimeSelected', () => {
    component.onTimeSelected(new Date('20-01-2019'), 'pickatimefirst');
    component.onTimeSelected(new Date('20-01-2019'), 'pickatimesecond');
  });

});
