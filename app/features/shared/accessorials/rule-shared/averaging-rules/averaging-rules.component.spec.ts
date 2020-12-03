import { RuleSharedModule } from './../rule-shared.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
// tslint:disable-next-line: max-line-length
import { CreateRulesService } from './../../../../standard/standard-accessorial/standard-rules/create-rules/service/standard-create-rules.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MessageService } from 'primeng/components/common/messageservice';

import { AveragingRulesComponent } from './averaging-rules.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AveragingRulesComponent', () => {
  let component: AveragingRulesComponent;
  let fixture: ComponentFixture<AveragingRulesComponent>;
  let createRulesService: CreateRulesService;
  let messageService: MessageService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, RuleSharedModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AveragingRulesComponent);
    component = fixture.componentInstance;
    createRulesService = TestBed.get(CreateRulesService);
    messageService = TestBed.get(MessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call averagingRulesForm', () => {
    component.averagingRulesForm();
    expect(component.averagingRulesForm).toBeTruthy();
  });

  it('should call checkMonthlyValue', () => {
    component.checkMonthlyValue();
    expect(component.checkMonthlyValue).toBeTruthy();
  });
  it('should call checkMonthlyValueElse', () => {
    component.averagingRulesModel.isEachDay = true;
    component.checkMonthlyValue();
    expect(component.checkMonthlyValue).toBeTruthy();
  });

  it('should call getSpecificDays', () => {
    component.getSpecificDays();
    expect(component.getSpecificDays).toBeTruthy();
  });

  it('should call onTypeTimeFrame', () => {
    component.averagingRulesModel.averageTimeFrame = [{
      label: 'rule',
      value: 1
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="timeFrame"]'));
    element.triggerEventHandler('completeMethod', { 'value': {} });
  });
  it('should call onTypeTimeFrameElse', () => {
    component.averagingRulesModel.averageTimeFrame = null;
    const element = fixture.debugElement.query(By.css('[formControlName="timeFrame"]'));
    element.triggerEventHandler('completeMethod', { 'value': {} });
  });

  it('should call getWeekDays', () => {
    const dayValue = { 'originalEvent': { 'isTrusted': true }, 'query': 'mo' };
    component.getWeekDays(dayValue);
    expect(component.getWeekDays).toBeTruthy();
  });
  it('should call getWeekDaysElse', () => {
    const dayValue = { 'originalEvent': { 'isTrusted': true }, 'query': 'mo' };
    component.averagingRulesModel.dayOfWeek = null;
    component.getWeekDays(dayValue);
    expect(component.getWeekDays).toBeTruthy();
  });

  it('should call getFrequencyData', () => {
    const dayValue = { 'originalEvent': { 'isTrusted': true }, 'query': 'mo' };
    component.getFrequencyData(dayValue);
    expect(component.getFrequencyData).toBeTruthy();
  });
  it('should call getFrequencyDataeLSE', () => {
    const dayValue = { 'originalEvent': { 'isTrusted': true }, 'query': 'mo' };
    component.averagingRulesModel.frequency = null;
    component.getFrequencyData(dayValue);
    expect(component.getFrequencyData).toBeTruthy();
  });

  it('should call getFrequencySubTypeData', () => {
    const dayValue = { 'originalEvent': { 'isTrusted': true }, 'query': 'mo' };
    component.getFrequencySubTypeData(dayValue);
    expect(component.getFrequencySubTypeData).toBeTruthy();
  });
  it('should call getFrequencySubTypeDataElse', () => {
    const dayValue = { 'originalEvent': { 'isTrusted': true }, 'query': 'mo' };
    component.averagingRulesModel.frequencysubType = null;
    component.getFrequencySubTypeData(dayValue);
    expect(component.getFrequencySubTypeData).toBeTruthy();
  });

  it('should call getFrequencyFilteredData', () => {
    const dayValue = { 'originalEvent': { 'isTrusted': true }, 'query': 'mo' };
    component.averagingRulesModel.frequency = [{
      label: 'rule',
      value: 2
    }];
    component.getFrequencyFilteredData(dayValue);
    expect(component.getFrequencyFilteredData).toBeTruthy();
  });

  it('should call getSpecificDayValues', () => {
    const dayValue = { 'originalEvent': { 'isTrusted': true }, 'query': 'mo' };
    component.getSpecificDayValues(dayValue);
    expect(component.getSpecificDayValues).toBeTruthy();
  });
  it('should call getSpecificDayValuesElse', () => {
    const dayValue = { 'originalEvent': { 'isTrusted': true }, 'query': 'mo' };
    component.averagingRulesModel.specificDay = null;
    component.getSpecificDayValues(dayValue);
    expect(component.getSpecificDayValues).toBeTruthy();
  });

  it('should call onclickMonthlyTypes', () => {
    const dayValue = {
      label: 'On the day',
      value: 1
    };
    component.averagingRulesModel.frequencysubType = [{
      label: 'On the day',
      value: 1
    }];
    component.onclickMonthlyTypes(dayValue);
    expect(component.onclickMonthlyTypes).toBeTruthy();
  });

  it('should call onclickMonthlyTypes', () => {
    const dayValue = {
      label: 'Each',
      value: 1
    };
    component.averagingRulesModel.frequencysubType = [{
      label: 'Each',
      value: 1
    }];
    component.onclickMonthlyTypes(dayValue);
    expect(component.onclickMonthlyTypes).toBeTruthy();
  });

  it('should call onChangeTimeFrame for if  condition', () => {
    const date = {
      label: 'monthly',
      value: 1
    };
    component.onChangeTimeFrame(date);
    component.setFormValidations('dayOfWeek', 'add');
    component.setFormValidations('dayOfWeek', 'remove');
    expect(component.onChangeTimeFrame).toBeTruthy();
  });

  it('should call onChangeTimeFrame for else condition', () => {
    const day = {
      label: 'weekly',
      value: 2
    };
    component.onChangeTimeFrame(day);
    component.setFormValidations('dayOfWeek', 'add');
    component.setFormValidations('specificDay', 'remove');
    expect(component.onChangeTimeFrame).toBeTruthy();
  });

  it('should call toastMessage', () => {
    const key = 'error';
    const type = 'error';
    const data = 'error message';
    component.toastMessage(messageService, key, type, data);
    expect(component.toastMessage).toBeTruthy();
  });

  it('should call getAveragingTimeFrame', () => {
    const response = {
      '_embedded': {
        'pricingAveragePeriodTypes': [{
          '@id': 1,
          'createTimestamp': '2019-04-04T15:40:40.0872047',
          'createProgramName': 'SSIS',
          'lastUpdateProgramName': 'SSIS',
          'createUserId': 'PIDNEXT',
          'lastUpdateUserId': 'PIDNEXT',
          'pricingAveragePeriodTypeName': 'Weekly',
          'effectiveDate': '2019-04-04',
          'expirationDate': '2099-12-31',
          'lastUpdateTimestampString': '2019-04-04T15:40:40.0872047',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/pricingaverageperiodtypes/1'
            },
            'pricingAveragePeriodType': {
              'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/pricingaverageperiodtypes/1'
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/pricingaverageperiodtypes{?page,size,sort}',
          'templated': true
        },
        'profile': {
          'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/profile/pricingaverageperiodtypes'
        }
      },
      'page': {
        'size': 50,
        'totalElements': 2,
        'totalPages': 1,
        'number': 0
      }
    };
    spyOn(CreateRulesService.prototype, 'getAverageTimeFrame').and.returnValues(of(response));
    component.getAveragingTimeFrame();
    // component.populateAverageTimeFrame(response);

  });

  it('should call populateAverageTimeFrameElse', () => {
    component.populateAverageTimeFrame(null);

  });
  it('should call populateDayOfWeekElse', () => {
    component.populateDayOfWeek(null);

  });
  it('should call populateFrequencyElse', () => {
    component.populateFrequency(null);
  });
  it('should call populateFrequencySubTypeElse', () => {
    component.populateFrequencySubType(null);
  });
  it('should call onBlurTimeFrameElse', () => {
    component.onBlurTimeFrame([1, 2]);
  });
  it('should call onBlurTimeFrame', () => {
    component.onBlurTimeFrame('');
  });
  it('should call getDayOfWeek', () => {
    const response = {
      'weeksInAverage': ['1', '2', '3', '4', '5', '6'],
      'priceChangeDayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    };
    spyOn(CreateRulesService.prototype, 'getDayOfWeek').and.returnValues(of(response));
    component.getDayOfWeek();
  });

  it('should call getFrequencyTypeValues', () => {
    const response = {
      '_embedded': {
        'accessorialFrequencyTypes': [{
          '@id': 1,
          'createTimestamp': '2019-04-04T15:40:34.8319657',
          'createProgramName': 'SSIS',
          'lastUpdateProgramName': 'SSIS',
          'createUserId': 'PIDNEXT',
          'lastUpdateUserId': 'PIDNEXT',
          'accessorialFrequencyTypeName': 'First',
          'effectiveDate': '2019-04-04',
          'expirationDate': '2099-12-31',
          'lastUpdateTimestampString': '2019-04-04T15:40:34.8319657',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/customeragreementfrequencytypes/1'
            },
            'accessorialFrequencyType': {
              'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/customeragreementfrequencytypes/1'
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/customeragreementfrequencytypes{?page,size,sort}',
          'templated': true
        },
        'profile': {
          'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/profile/customeragreementfrequencytypes'
        }
      },
      'page': {
        'size': 50,
        'totalElements': 5,
        'totalPages': 1,
        'number': 0
      }
    };
    spyOn(CreateRulesService.prototype, 'getFrequencyValues').and.returnValues(of(response));
    component.getFrequencyTypeValues();
  });

  it('should call getFrequencySubType', () => {
    const response = {
      '_embedded': {
        'accessorialFrequencySubTypes': [{
          '@id': 1,
          'createTimestamp': '2019-04-04T15:40:40.0872047',
          'createProgramName': 'SSIS',
          'lastUpdateProgramName': 'SSIS',
          'createUserId': 'PIDNEXT',
          'lastUpdateUserId': 'PIDNEXT',
          'accessorialFrequencySubTypeName': 'Day',
          'effectiveDate': '2019-04-04',
          'expirationDate': '2099-12-31',
          'lastUpdateTimestampString': '2019-04-04T15:40:40.0872047',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/customeragreementfrequencysubtypes/1'
            },
            'accessorialFrequencySubType': {
              'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/customeragreementfrequencysubtypes/1'
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/customeragreementfrequencysubtypes{?page,size,sort}',
          'templated': true
        },
        'profile': {
          'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/profile/customeragreementfrequencysubtypes'
        }
      },
      'page': {
        'size': 50,
        'totalElements': 1,
        'totalPages': 1,
        'number': 0
      }
    };
    spyOn(CreateRulesService.prototype, 'getFrequencySubTypeValues').and.returnValues(of(response));
    component.getFrequencySubType();
  });

});
