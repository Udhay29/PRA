import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FreeCalendarComponent } from './free-calendar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../../view-agreement-details.module';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { MessageService } from 'primeng/components/common/messageservice';
import { FreeCalendarService } from './service/free-calendar.service';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { FreeCalendarUtilityService } from './service/free-calendar-utility.service';

describe('FreeCalendarComponent', () => {
  let component: FreeCalendarComponent;
  let fixture: ComponentFixture<FreeCalendarComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  let toastMessage: MessageService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, FormsModule,
        ReactiveFormsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, FreeCalendarUtilityService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeCalendarComponent);
    component = fixture.componentInstance;
    toastMessage = TestBed.get(MessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call create form builder', () => {
    component.createFreeCalendarForm();
  });

  it('should call and check getCalendarTypes', () => {
    const response = {
      '_embedded': {
        'accessorialFreeRuleCalendarTypes': [
          {
            'accessorialFreeRuleCalendarTypeName': 'Holiday',
            'accessorialFreeRuleCalendarTypeId': 1,
            '_links': {
              'self': {
                'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleCalendarType/1'
              },
              'accessorialFreeRuleCalendarType': {
                'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleCalendarType/1{?projection}',
                'templated': true
              }
            }
          }
        ]
      },
      '_links': {
        'self': {
          'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleCalendarType{?page,size,sort,projection}',
          'templated': true
        },
        'profile': {
          'href': 'http://localhost:8083/pricingaccessorialservices/profile/freeRuleCalendarType'
        }
      },
      'page': {
        'size': 20,
        'totalElements': 3,
        'totalPages': 1,
        'number': 0
      }
    };
    spyOn(FreeCalendarService.prototype, 'getCalendarTypes').and.returnValue(of(response));
    component.getCalendarTypes();
  });

  it('should call and check getCalendarTypes for else', () => {
    spyOn(FreeCalendarService.prototype, 'getCalendarTypes').and.returnValue(of(null));
    component.getCalendarTypes();
  });

  it('should call getApplyIf', () => {
    const response = {
      '_embedded': {
        'accessorialFreeRuleCalendarApplyTypes': [
          {
            'accessorialFreeRuleCalendarApplyName': 'Always',
            'accessorialFreeRuleCalendarApplyTypeId': 1,
            '_links': {
              'self': {
                'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleCalendarApplyType/1'
              },
              'accessorialFreeRuleCalendarApplyType': {
                'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleCalendarApplyType/1{?projection}',
                'templated': true
              }
            }
          },
          {
            'accessorialFreeRuleCalendarApplyName': 'Is Within Free Time',
            'accessorialFreeRuleCalendarApplyTypeId': 2,
            '_links': {
              'self': {
                'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleCalendarApplyType/2'
              },
              'accessorialFreeRuleCalendarApplyType': {
                'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleCalendarApplyType/2{?projection}',
                'templated': true
              }
            }
          },
          {
            'accessorialFreeRuleCalendarApplyName': 'Day After Event',
            'accessorialFreeRuleCalendarApplyTypeId': 3,
            '_links': {
              'self': {
                'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleCalendarApplyType/3'
              },
              'accessorialFreeRuleCalendarApplyType': {
                'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleCalendarApplyType/3{?projection}',
                'templated': true
              }
            }
          },
          {
            'accessorialFreeRuleCalendarApplyName': 'Day of Event ',
            'accessorialFreeRuleCalendarApplyTypeId': 4,
            '_links': {
              'self': {
                'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleCalendarApplyType/4'
              },
              'accessorialFreeRuleCalendarApplyType': {
                'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleCalendarApplyType/4{?projection}',
                'templated': true
              }
            }
          }
        ]
      },
      '_links': {
        'self': {
          'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleCalendarApplyType{?page,size,sort,projection}',
          'templated': true
        },
        'profile': {
          'href': 'http://localhost:8083/pricingaccessorialservices/profile/freeRuleCalendarApplyType'
        }
      },
      'page': {
        'size': 20,
        'totalElements': 4,
        'totalPages': 1,
        'number': 0
      }
    };
    spyOn(FreeCalendarService.prototype, 'getApplyIf').and.returnValues(of(response));
    component.getApplyIf();
  });
  it('should call getApplyIf for else ', () => {
    spyOn(FreeCalendarService.prototype, 'getApplyIf').and.returnValues(of(null));
    component.getApplyIf();
  });
  it('should call getEvent', () => {
    const response = {
      '_embedded': {
        'accessorialFreeRuleEventTypes': [{
          'accessorialFreeRuleEventTypeName': 'Deramp',
          'accessorialFreeRuleEventTypeId': 1,
          '_links': {
            'self': {
              'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleEventType/1'
            },
            'accessorialFreeRuleEventType': {
              'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleEventType/1{?projection}',
              'templated': true
            }
          }
        }, {
          'accessorialFreeRuleEventTypeName': 'Drop',
          'accessorialFreeRuleEventTypeId': 2,
          '_links': {
            'self': {
              'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleEventType/2'
            },
            'accessorialFreeRuleEventType': {
              'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleEventType/2{?projection}',
              'templated': true
            }
          }
        }, {
          'accessorialFreeRuleEventTypeName': 'Empty',
          'accessorialFreeRuleEventTypeId': 3,
          '_links': {
            'self': {
              'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleEventType/3'
            },
            'accessorialFreeRuleEventType': {
              'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleEventType/3{?projection}',
              'templated': true
            }
          }
        }, {
          'accessorialFreeRuleEventTypeName': 'Outgate',
          'accessorialFreeRuleEventTypeId': 4,
          '_links': {
            'self': {
              'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleEventType/4'
            },
            'accessorialFreeRuleEventType': {
              'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleEventType/4{?projection}',
              'templated': true
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': 'http://localhost:8083/pricingaccessorialservices/freeRuleEventType{?page,size,sort,projection}',
          'templated': true
        },
        'profile': {
          'href': 'http://localhost:8083/pricingaccessorialservices/profile/freeRuleEventType'
        }
      },
      'page': {
        'size': 20,
        'totalElements': 4,
        'totalPages': 1,
        'number': 0
      }
    };
    spyOn(FreeCalendarService.prototype, 'getEvent').and.returnValues(of(response));
    component.getEventTypes();
  });
  it('should call getEventTypes for else', () => {
    spyOn(FreeCalendarService.prototype, 'getEvent').and.returnValues(of(null));
    component.getEventTypes();
  });
  it('should call getTimeFrames', () => {
    const response = {
      '_embedded': {
        'pricingAveragePeriodTypes': [{
          'pricingAveragePeriodTypeId': 1,
          'pricingAveragePeriodTypeName': 'Weekly',
          '_links': {
            'self': {
              'href': 'http://localhost:8083/pricingaccessorialservices/pricingaverageperiodtypes/1'
            },
            'pricingAveragePeriodType': {
              'href': 'http://localhost:8083/pricingaccessorialservices/pricingaverageperiodtypes/1{?projection}',
              'templated': true
            }
          }
        }, {
          'pricingAveragePeriodTypeId': 2,
          'pricingAveragePeriodTypeName': 'Monthly',
          '_links': {
            'self': {
              'href': 'http://localhost:8083/pricingaccessorialservices/pricingaverageperiodtypes/2'
            },
            'pricingAveragePeriodType': {
              'href': 'http://localhost:8083/pricingaccessorialservices/pricingaverageperiodtypes/2{?projection}',
              'templated': true
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': 'http://localhost:8083/pricingaccessorialservices/pricingaverageperiodtypes{?page,size,sort,projection}',
          'templated': true
        },
        'profile': {
          'href': 'http://localhost:8083/pricingaccessorialservices/profile/pricingaverageperiodtypes'
        }
      },
      'page': {
        'size': 20,
        'totalElements': 2,
        'totalPages': 1,
        'number': 0
      }
    };
    spyOn(FreeCalendarService.prototype, 'getTimeFrames').and.returnValues(of(response));
    component.getTimeFrames();
  });
  it('should call getTimeFrames for else', () => {
    spyOn(FreeCalendarService.prototype, 'getTimeFrames').and.returnValues(of(null));
    component.getTimeFrames();
  });
  it('should call getAppliesToOccurence', () => {
    const response = {
      '_embedded': {
        'accessorialFrequencyTypes': [
          {
            'accessorialFrequencyTypeId': 1,
            'accessorialFrequencyTypeName': 'First',
            '_links': {
              'self': {
                'href': 'http://localhost:8083/pricingaccessorialservices/customeragreementfrequencytypes/1'
              },
              'accessorialFrequencyType': {
                'href': 'http://localhost:8083/pricingaccessorialservices/customeragreementfrequencytypes/1{?projection}',
                'templated': true
              }
            }
          },
          {
            'accessorialFrequencyTypeId': 2,
            'accessorialFrequencyTypeName': 'Second',
            '_links': {
              'self': {
                'href': 'http://localhost:8083/pricingaccessorialservices/customeragreementfrequencytypes/2'
              },
              'accessorialFrequencyType': {
                'href': 'http://localhost:8083/pricingaccessorialservices/customeragreementfrequencytypes/2{?projection}',
                'templated': true
              }
            }
          },
          {
            'accessorialFrequencyTypeId': 3,
            'accessorialFrequencyTypeName': 'Third',
            '_links': {
              'self': {
                'href': 'http://localhost:8083/pricingaccessorialservices/customeragreementfrequencytypes/3'
              },
              'accessorialFrequencyType': {
                'href': 'http://localhost:8083/pricingaccessorialservices/customeragreementfrequencytypes/3{?projection}',
                'templated': true
              }
            }
          },
          {
            'accessorialFrequencyTypeId': 4,
            'accessorialFrequencyTypeName': 'Fourth',
            '_links': {
              'self': {
                'href': 'http://localhost:8083/pricingaccessorialservices/customeragreementfrequencytypes/4'
              },
              'accessorialFrequencyType': {
                'href': 'http://localhost:8083/pricingaccessorialservices/customeragreementfrequencytypes/4{?projection}',
                'templated': true
              }
            }
          },
          {
            'accessorialFrequencyTypeId': 5,
            'accessorialFrequencyTypeName': 'Last',
            '_links': {
              'self': {
                'href': 'http://localhost:8083/pricingaccessorialservices/customeragreementfrequencytypes/5'
              },
              'accessorialFrequencyType': {
                'href': 'http://localhost:8083/pricingaccessorialservices/customeragreementfrequencytypes/5{?projection}',
                'templated': true
              }
            }
          }
        ]
      },
      '_links': {
        'self': {
          'href': 'http://localhost:8083/pricingaccessorialservices/customeragreementfrequencytypes{?page,size,sort,projection}',
          'templated': true
        },
        'profile': {
          'href': 'http://localhost:8083/pricingaccessorialservices/profile/customeragreementfrequencytypes'
        }
      },
      'page': {
        'size': 20,
        'totalElements': 5,
        'totalPages': 1,
        'number': 0
      }
    };
    spyOn(FreeCalendarService.prototype, 'getAppliesToOccurence').and.returnValues(of(response));
    component.getAppliesToOccurence();
  });
  it('should call getAppliesToOccurence for else', () => {
    spyOn(FreeCalendarService.prototype, 'getAppliesToOccurence').and.returnValues(of(null));
    component.getAppliesToOccurence();
  });
  it('should call   getFreeRuleCalendarMonth', () => {
    const response = [
      {
        'customerAccessorialFreeRuleCalendarMonthId': 1,
        'customerAccessorialFreeRuleCalendardId': null,
        'calendarMonth': 'January',
        'customerAccessorialFreeRuleCalendarDay': null
      },
    ];
    spyOn(FreeCalendarService.prototype, 'getFreeRuleCalendarMonth').and.returnValues(of(response));
    component.getFreeRuleCalendarMonth();
  });
  it('should call   getFreeRuleCalendarMonth for else', () => {
    spyOn(FreeCalendarService.prototype, 'getFreeRuleCalendarMonth').and.returnValues(of(null));
    component.getFreeRuleCalendarMonth();
  });
  it('should call patchValuesForEdit', () => {
    component.freeCalendarModel.freeCalendarForm.addControl('dayOfMonth', new FormControl('27', Validators.required));
    component.freeCalendarModel.freeCalendarForm.addControl('months', new FormControl({label: 'july', value: '31'}, Validators.required));
    component.freeCalendarModel.months = [{
      label: 'july',
      value: 31
    }];
    component.patchValuesForEdit();
  });
  it('should call getDayOfMonth', () => {
    const response = [1, 2];
    spyOn(FreeCalendarService.prototype, 'getDayOfMonth').and.returnValues(of(response));
    component.getDayOfMonth(1);
  });
  it('should call getDayOfWeek', () => {
    const response = [{
      'customerAccessorialFreeRuleCalendarWeekDayId': 1,
      'customerAccessorialFreeRuleCalendarId': null,
      'calendarWeekDay': 'Sunday'
    }];
    spyOn(FreeCalendarService.prototype, 'getDayOfWeek').and.returnValues(of(response));
    component.getDayOfWeek();
  });
  it('should call getDayOfWeek for else', () => {
    spyOn(FreeCalendarService.prototype, 'getDayOfWeek').and.returnValues(of(null));
    component.getDayOfWeek();
  });
  it('should call on Reset', () => {
    fixture.detectChanges();
    component.onCalendarTypeReset();
    fixture.detectChanges();
    component.onApplyIfReset();
    fixture.detectChanges();
    component.onTimeFrameReset();
  });
  it('should call  onSelectTimeFrame Weekly', () => {
    const eventValueWeekly = 3;
    component.onSelectCalendarType(eventValueWeekly);
    fixture.detectChanges();
    const eventValue = 2;
    component.onSelectTimeFrame(eventValue);
    fixture.detectChanges();
  });
  it('on Select Month ', () => {
    const eventValue = 2;
    component.onSelectMonth(eventValue);
  });
  it('on Select Month for else', () => {
    const eventValue = null;
    component.onSelectMonth(eventValue);
  });
  it('on set Apply If Default ', () => {
    const eventValue = 2;
    component.onSelectCalendarType(eventValue);
    component.freeCalendarModel.applyIf = [{
      'label': 'Always',
      'value': 1,
    },
    {
      'label': 'Always',
      'value': 2,
    }
    ];
    component.freeCalendarModel.freeCalendarForm.addControl('applyIf',
      new FormControl('', Validators.required));

    component.setApplyIfDefault();
  });
  it('onSelectRelativeMonth', () => {
    component.onSelectRelativeMonth(1, 'January');
  });
  it('on Select Apply If', () => {
    component.onSelectApplyIf(1);
    component.onSelectApplyIf(2);
    component.onSelectApplyIf(3);
    component.onSelectApplyIf(4);
  });
   it('current Year Validator', () => {
    expect(component.currentYearValidator(new FormControl('0'))).toEqual({
        'invalid': true
    });
  });
  it('on TypeCalendarAutoComplete', () => {
    const event = new Event('');
    event['query'] = '';
    component.onSelectCalendarType(3);
    component.onSelectTimeFrame(1);
    component.onTypeCalendarAutoComplete(event, 'applyIf');
    component.onTypeCalendarAutoComplete(event, 'dayOfWeek');
    component.onTypeCalendarAutoComplete(event, 'timeFrame');
    component.onTypeCalendarAutoComplete(event, 'calendarType');
    component.onSelectTimeFrame(2);
    fixture.detectChanges();
    component.onTypeCalendarAutoComplete(event, 'months');
    component.onTypeCalendarAutoComplete(event, 'occurrence');
    component.onSelectTimeFrame(1);
    component.onSelectApplyIf(4);
    fixture.detectChanges();
    component.onTypeCalendarAutoComplete(event, 'appliesToOccurrence');
    component.onTypeCalendarAutoComplete(event, 'eventTypes');
  });
  it('should call onCalendarFormControlBlur calendarType', () => {
    const event: any = {
      target: {
        value: ''
      }
    };
    component.freeCalendarModel.freeCalendarForm.addControl('calendarType', new FormControl(
      {name: 'calendarType'}, Validators.required));
    component.freeCalendarModel.freeCalendarForm.controls['calendarType'].setValue('abc');
    component.onCalendarFormControlBlur(event, 'calendarType');
  });
  it('should call onCalendarFormControlBlur timeFrame', () => {
    const event: any = {
      target: {
        value: ''
      }
    };
    component.freeCalendarModel.freeCalendarForm.addControl('timeFrame', new FormControl(
      {label: 'july', value: '31'}, Validators.required));
    component.onCalendarFormControlBlur(event, 'timeFrame');
  });
  it('should call onCalendarFormControlBlur applyIf', () => {
    const event: any = {
      target: {
        value: ''
      }
    };
    component.freeCalendarModel.freeCalendarForm.addControl('applyIf', new FormControl(
      {label: 'july', value: '31'}, Validators.required));
    component.onCalendarFormControlBlur(event, 'applyIf');
  });
  it('should call onCalendarFormControlBlur for else', () => {
    const event: any = {
      target: {
        value: 'abc'
      }
    };
    component.freeCalendarModel.freeCalendarForm.addControl('applyIf', new FormControl(
      {label: 'july', value: '31'}, Validators.required));
    component.onCalendarFormControlBlur(event, 'applyIf');
  });
  it('should call  onSelectCalendarType for else', () => {
    component.freeCalendarModel.relativeCalendarType['calendarTypeId'] = 2;
    component.onSelectCalendarType(1);
  });
  it('should call  onSelectTimeFrame for else', () => {
    component.freeCalendarModel.relativeTimeFrameWeekly['pricingAveragePeriodTypeId'] = 2;
    component.onSelectTimeFrame(1);
  });
  it('should call onSelectDayOfWeek', () => {
    component.freeCalendarModel.isRelativeTimeFrameMonthly = true;
    component.freeCalendarModel.freeCalendarForm.addControl('applyIf', new FormControl(
      {label: 'july', value: '31'}, Validators.required));
    component.onSelectDayOfWeek(4, 'abc');
  });
  it('should call onSelectDayOfWeek for else', () => {
    component.freeCalendarModel.isRelativeTimeFrameMonthly = false;
    component.onSelectDayOfWeek(4, 'abc');
  });
  xit('should call onYearKeyPress', () => {
    component.onYearKeyPress(event);
  });

});
