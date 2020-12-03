import { StandardModule } from './../../../../standard.module';
import { ChargeCodeResponseInterface, RuleType, RuleTypeValue, DocumentationDate } from '../model/standard-create-rules.interface';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CreateStandardRulesComponent } from '../standard-create-rules.component';
import { CreateRuleModel } from '../model/standard-create-rules.model';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../app.module';

import {
  FormBuilder, FormGroup, AbstractControl, FormsModule, ReactiveFormsModule, FormArray,
  FormControl, Validators
} from '@angular/forms';


import { AveragingRulesModel } from './../../../../../shared/accessorials/rule-shared/averaging-rules/models/averaging-rules.model';
import { CreateRuleUtilityService } from './standard-create-rule-utility.service';
import { FreeEventTypeModel } from '../../free-rule/free-event-type/model/free-event-type.model';
import { FreeCalendarModel } from '../../free-rule/free-calendar/model/free-calendar.model';
import { FreeRuleModel } from '../../free-rule/model/free-rule.model';
import { MessageService } from 'primeng/components/common/messageservice';
import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ViewDocumentationModel } from '../../view-documentation/models/standard-view-documentation.model';


describe('CreateRuleUtilityService', () => {
  let serviceRef: CreateRuleUtilityService;
  let http: HttpClient;
  let createRuleModel: CreateRuleModel;
  let averagingRulesModel: AveragingRulesModel;
  let viewDocumentationModel: ViewDocumentationModel;
  let freeEventTypeModel: FreeEventTypeModel;
  let freeCalendarModel: FreeCalendarModel;
  let freeRuleModel: FreeRuleModel;
  let formGroup: FormGroup;
  let averageForm: FormGroup;
  let freeRuleForm: FormGroup;
  let freeEventForm: FormGroup;
  let freeCalendarForm: FormGroup;
  let keyValuepair;
  const formBuilder: FormBuilder = new FormBuilder();
  const messageservice: MessageService = new MessageService();
  let component: CreateStandardRulesComponent;
  let fixture: ComponentFixture<CreateStandardRulesComponent>;
  let currencyPipe: CurrencyPipe;
  let debugElement: DebugElement;

  configureTestSuite(() => {
    const changeDetectorRefStub = { detectChanges: () => ({}) };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule,
        FormsModule, ReactiveFormsModule],
      providers: [CreateRuleUtilityService, { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefStub }, HttpClient, CurrencyPipe],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStandardRulesComponent);
    component = fixture.componentInstance;
    serviceRef = TestBed.get(CreateRuleUtilityService);
    http = TestBed.get(HttpClient);
    debugElement = fixture.debugElement;
    currencyPipe = debugElement.injector.get(CurrencyPipe);
    createRuleModel = new CreateRuleModel();
    averagingRulesModel = new AveragingRulesModel();
    viewDocumentationModel = new ViewDocumentationModel();
    freeEventTypeModel = new FreeEventTypeModel();
    freeCalendarModel = new FreeCalendarModel();
    freeRuleModel = new FreeRuleModel();
    formGroup = formBuilder.group({
      ruleType: ['xyz', Validators.required],
      chargeType: ['x', Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      ruleLevel: ['1', Validators.required]
    });
    createRuleModel.rulesForm = formGroup;

    averageForm = formBuilder.group({
      timeFrame: ['', Validators.required],
      dayOfWeek: [''],
      monthlyAveragingTypes: [''],
      specificDay: [''],
      monthlyDay: [''],
      frequency: ['']
    });
    averagingRulesModel.averagingForm = averageForm;

    freeRuleForm = formBuilder.group({
      freeRuleType: ['', Validators.required]
    });
    freeRuleModel.freeRulesForm = freeRuleForm;

    freeEventForm = formBuilder.group({
      freeTypeEventName: ['', Validators.required],
      freeTimeEvent: ['', Validators.required],
      freeAmountFirstEvent: ['', Validators.required],
      freeAmountSecondEvent: ['', Validators.required],
      pickatimefirst: ['', Validators.required],
      pickatimesecond: ['', Validators.required],
    });
    freeEventTypeModel.freeEventTypeForm = freeEventForm;

    freeCalendarForm = formBuilder.group({
      calendarType: ['monthly', Validators.required]
    });
    freeCalendarModel.freeCalendarForm = freeCalendarForm;
    keyValuepair = {
      value: '1',
      label: 'averaging'
    };
    fixture.detectChanges();
  });

  it('should be created', inject([CreateRuleUtilityService], (service: CreateRuleUtilityService) => {
    expect(service).toBeTruthy();
  }));

  it('should cal validateDate', () => {
    serviceRef.validateDate('', 'effectiveDate', createRuleModel);
  });

  it('should cal validateDate exp', () => {
    serviceRef.validateDate('', 'expirationDate', createRuleModel);
  });

  it('should cal saveParamFramer', () => {
    createRuleModel.rulesForm = formGroup;
    serviceRef.saveParamFramer(createRuleModel, {}, averagingRulesModel, viewDocumentationModel);
  });

  it('should cal errorMsgOnSave', () => {
    spyOn(messageservice, 'clear');
    spyOn(messageservice, 'add');
    serviceRef.errorMsgOnSave(messageservice);
    expect(messageservice.clear).toHaveBeenCalled();
    expect(messageservice.add).toHaveBeenCalled();
  });

  it('should call toastMessage', () => {
    spyOn(messageservice, 'clear');
    spyOn(messageservice, 'add');
    serviceRef.toastMessage(messageservice, 'error', 'Error', 'message');
    expect(messageservice.clear).toHaveBeenCalled();
    expect(messageservice.add).toHaveBeenCalled();
  });

  it('should cal isRuleFieldsValid', () => {
    serviceRef.isRuleFieldsValid(createRuleModel);
  });
  it('should cal isRuleFieldsValidIf 1', () => {
    createRuleModel.isArrival = true;
    serviceRef.isRuleFieldsValid(createRuleModel);
  });

  it('should cal rulefieldsTouched', () => {
    serviceRef.rulefieldsTouched(createRuleModel);
  });

  it('should cal dateCheck', () => {
    serviceRef.dateCheck(createRuleModel);
  });
  it('should cal dateCheckElse', () => {
    createRuleModel.agreementEffectiveDate = '12/12/2019';
    createRuleModel.effectiveDate = '12/11/2019';
    serviceRef.dateCheck(createRuleModel);
  });

  it('should cal validateRuleForm', () => {
    serviceRef.validateRuleForm(createRuleModel);
  });
  it('should cal validateRuleFormelse', () => {
    createRuleModel.isArrival = true;
    serviceRef.validateRuleForm(createRuleModel);
  });

  it('should cal arrivalRuleFormValidation', () => {
    serviceRef.arrivalRuleFormValidation(createRuleModel);
  });

  it('should cal dateReset', () => {
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    serviceRef.dateReset(createRuleModel, changeDetectorRefStub);
  });

  it('should cal setValidation', () => {
    createRuleModel.rulesForm.controls.ruleType.setValue('yes');
    serviceRef.setValidation('ruleType', createRuleModel);
  });
  it('should cal setValidationIf', () => {
    createRuleModel.rulesForm.controls.ruleType.setValue(null);
    serviceRef.setValidation('ruleType', createRuleModel);
  });

  it('should cal setFormErrors', () => {
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    serviceRef.setFormErrors(component, changeDetectorRefStub);
  });

  it('should cal validateEffectiveDate', () => {
    serviceRef.validateEffectiveDate(createRuleModel);
  });
  it('should cal validateEffectiveDateIf', () => {
    createRuleModel.rulesForm.controls.effectiveDate.setValue('10/01/2019');
    createRuleModel.rulesForm.controls.expirationDate.setValue('01/01/2019');
    serviceRef.validateEffectiveDate(createRuleModel);
  });

  it('should cal clearFreeRuleFormOnSaveAndCreateNew', () => {
    serviceRef.clearFreeRuleFormOnSaveAndCreateNew('', '');
  });

  it('should cal populateGracePeriod', () => {
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    serviceRef.populateGracePeriod('', createRuleModel, changeDetectorRefStub);
  });
  it('should cal populateGracePeriodIf', () => {
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    const response = {
      '_embedded': {
        'pricingUnitOfTimeMeasurementAssociations': [{
          '@id': 1,
          'pricingUnitOfTimeMeasurementAssociationId': 16,
          'effectiveTimestamp': '2019-05-24',
          'expirationTimestamp': '2099-12-31',
          'unitOfTimeMeasurementCode': 'Day',
          'pricingFunctionalAreaId': 6,
          'lastUpdateTimestampString': '2019-05-24T14:21:11.6623113',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/pricingUnitOfTimeMeasurementAssociations/16'
            },
            'pricingUnitOfTimeMeasurementAssociation': {
              'href': 'https://pricing-test.jbhunt.com/api/pricingaccessorialservices/pricingUnitOfTimeMeasurementAssociations/16'
            }
          }
        }]
      }
    };
    serviceRef.populateGracePeriod(response, createRuleModel, changeDetectorRefStub);
  });

  it('getFormattedDate should return some date', () => {
    serviceRef.dateFormatter('');
    expect(serviceRef.dateFormatter).toBeTruthy();
  });

  it('should cal populateChargeType', () => {
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    const chargeTypeResponse: ChargeCodeResponseInterface[] = [];
    serviceRef.populateChargeType(chargeTypeResponse, createRuleModel, changeDetectorRefStub);
  });
  it('should cal populateChargeTypeElse', () => {
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    const chargeTypeResponse: ChargeCodeResponseInterface[] = [];
    serviceRef.populateChargeType(null, createRuleModel, changeDetectorRefStub);
  });

  it('should cal populateRuleType', () => {
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    const ruleType: RuleType = {
      _embedded: {
        accessorialRuleTypes: [{
          '@id': 2,
          createTimestamp: 'string',
          createProgramName: 'string',
          lastUpdateProgramName: 'string',
          createUserId: 'string',
          lastUpdateUserId: 'string',
          accessorialRuleTypeName: 'string',
          effectiveDate: 'string',
          expirationDate: 'string',
          lastUpdateTimestampString: 'string',
          _links: {}
        }]
      },
      _links: {},
      page: {
        size: 2,
        totalElements: 1,
        totalPages: 3,
        number: 1
      }
    };
    serviceRef.populateRuleType(ruleType, createRuleModel, changeDetectorRefStub);
  });
  it('should cal populateRuleTypeEsle', () => {
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    serviceRef.populateRuleType(null, createRuleModel, changeDetectorRefStub);
  });

  it('should cal formatAmount', () => {
    serviceRef.formatAmount('2', currencyPipe);
  });
  it('should cal formatAmount', () => {
    serviceRef.formatAmount('string', currencyPipe);
  });

  it('should cal createFreeFuleParamEventType', () => {
    serviceRef.createFreeFuleParamEventType(freeRuleForm, freeEventForm);
  });

  it('should cal createFreeFuleParam', () => {
    serviceRef.createFreeFuleParam(freeRuleForm);
  });
  it('should cal clearCalendarForm', () => {
    freeRuleForm = formBuilder.group({
      freeRuleType: ['', Validators.required],
      quantityType: ['', Validators.required],

    });
    freeRuleModel.freeRulesForm = freeRuleForm;
    freeCalendarForm = formBuilder.group({
      calendarType: ['monthly', Validators.required]
    });
    freeCalendarModel.freeCalendarForm = freeCalendarForm;
    const data = {
      freeRuleModel,
      freeTypeCalendarTab: {
        freeCalendarModel

      }
    };
    serviceRef.clearFreeRuleFormOnSaveAndCreateNew(data, { label: 'Calendar' });
    serviceRef.clearCalendarForm(data);
  });
  it('should cal clearEventForm', () => {
    freeRuleForm = formBuilder.group({
      freeRuleType: ['', Validators.required],
      quantityType: ['', Validators.required],

    });
    freeRuleModel.freeRulesForm = freeRuleForm;
    freeEventForm = formBuilder.group({
      freeTypeEventName: ['', Validators.required],
      freeTimeEvent: ['', Validators.required],
      freeAmountFirstEvent: ['', Validators.required],
      freeAmountSecondEvent: ['', Validators.required],
      pickatimefirst: ['', Validators.required],
      pickatimesecond: ['', Validators.required],
    });
    freeEventTypeModel.freeEventTypeForm = freeEventForm;
    const data = {
      freeRuleModel,
      freeTypeEventTab: {
        freeEventTypeModel

      }
    };
    serviceRef.clearFreeRuleFormOnSaveAndCreateNew(data, { label: 'Event' });

    serviceRef.clearEventForm(data);
  });
  it('should cal clearQuantityForm', () => {
    freeRuleForm = formBuilder.group({
      freeRuleType: ['', Validators.required],
      quantityType: ['', Validators.required],

    });
    freeRuleModel.freeRulesForm = freeRuleForm;
    const data = {
      freeRuleModel
    };
    serviceRef.clearFreeRuleFormOnSaveAndCreateNew(data, { label: 'Quantity' });
    serviceRef.clearQuantityForm(data);
  });

  it('should cal createFreeRuleParamCalendar', () => {
    freeCalendarForm = formBuilder.group({
      calendarType: ['monthly', Validators.required],
      timeFrame: ['', Validators.required]
    });
    freeCalendarForm.controls['calendarType'].setValue({ 'label': 'relative' });
    freeCalendarForm.controls['timeFrame'].setValue({ 'label': 'monthly' });
    serviceRef.getFormControlLabel(freeCalendarForm, 'calendarType');
    serviceRef.createFreeRuleParamCalendar(freeRuleForm, freeCalendarForm);
  });
  it('should cal dayOfWeek', () => {
    averagingRulesModel.averagingForm = averageForm;
    const data = {
      value: null,
      label: 'averaging'
    };
    averagingRulesModel.averagingForm.controls.monthlyDay.setValue(data);
    serviceRef.dayOfWeek(averagingRulesModel, 'onTheDayMonth', data);
  });
  it('should cal dayOfWeekElseif', () => {
    averagingRulesModel.averagingForm = averageForm;
    const data = {
      value: '1',
      label: 'averaging'
    };
    serviceRef.dayOfWeek(averagingRulesModel, 'onTheDayMonth', data);
  });
  it('should cal dayOfWeekElse', () => {
    averagingRulesModel.averagingForm = averageForm;
    const data = {
      value: '1',
      label: 'averaging'
    };
    serviceRef.dayOfWeek(averagingRulesModel, 'week', data);
  });
  it('should cal averageRulesFrameronTheDayMonth', () => {
    averagingRulesModel.averagingForm.controls.frequency.setValue(keyValuepair);
    serviceRef.averageRulesFramer(averagingRulesModel, 'onTheDayMonth', keyValuepair);
  });
  it('should cal averageRulesFrameronTheDayMonth', () => {
    averagingRulesModel.averagingForm.controls.frequency.setValue(keyValuepair);
    averagingRulesModel.averagingForm.controls.monthlyDay.setValue(keyValuepair);
    serviceRef.averageRulesFramer(averagingRulesModel, 'onTheDayMonth', keyValuepair);
  });
  it('should cal averageRulesFramereachDayMonth', () => {
    serviceRef.averageRulesFramer(averagingRulesModel, 'eachDayMonth', keyValuepair);
  });
  it('should cal getFormControlValue', () => {
    freeRuleForm = formBuilder.group({
      freeRuleType: [keyValuepair, Validators.required],
      quantityType: ['', Validators.required],

    });
    freeRuleModel.freeRulesForm = freeRuleForm;
    serviceRef.getFormControlValue(freeRuleForm, 'freeRuleType');
  });
  it('should cal getFormControlValue Else', () => {
    freeRuleForm = formBuilder.group({
      freeRuleType: ['', Validators.required],
      quantityType: ['', Validators.required],

    });
    freeRuleModel.freeRulesForm = freeRuleForm;
    serviceRef.getFormControlValue(freeRuleForm, 'freeRuleType');
  });
  it('should cal getFormControlLabel', () => {
    freeRuleForm = formBuilder.group({
      freeRuleType: [keyValuepair, Validators.required],
      quantityType: ['', Validators.required],

    });
    freeRuleModel.freeRulesForm = freeRuleForm;
    serviceRef.getFormControlLabel(freeRuleForm, 'freeRuleType');
  });
  it('should cal getFormControlLabel Else', () => {
    freeRuleForm = formBuilder.group({
      freeRuleType: ['', Validators.required],
      quantityType: ['', Validators.required],

    });
    freeRuleModel.freeRulesForm = freeRuleForm;
    serviceRef.getFormControlLabel(freeRuleForm, 'freeRuleType');
  });
  it('should cal getFreeRuleDayOfWeekif', () => {
    freeCalendarForm = formBuilder.group({
      calendarType: ['monthly', Validators.required],
      timeFrame: ['', Validators.required],
      dayOfWeek: ['', Validators.required]
    });
    freeCalendarForm.controls['dayOfWeek'].setValue([keyValuepair, '']);
    freeCalendarForm.controls['timeFrame'].setValue({
      value: 'weekly',
      label: 'weekly'
    });
    serviceRef.getFreeRuleDayOfWeek(freeCalendarForm);
  });
  it('should cal getFreeRuleDayOfWeek Else if', () => {
    freeCalendarForm = formBuilder.group({
      calendarType: ['monthly', Validators.required],
      timeFrame: ['', Validators.required],
      dayOfWeek: ['', Validators.required]
    });
    freeCalendarForm.controls['dayOfWeek'].setValue([keyValuepair]);
    freeCalendarForm.controls['timeFrame'].setValue({
      value: 'monthly',
      label: 'monthly'
    });
    serviceRef.getFreeRuleDayOfWeek(freeCalendarForm);
  });
  it('should cal getFreeRuleOccurenceList if', () => {
    freeCalendarForm = formBuilder.group({
      calendarType: [{
        value: 'relative',
        label: 'relative'
      }, Validators.required],
      timeFrame: ['', Validators.required],
      occurrence: ['', Validators.required],
      dayOfWeek: ['', Validators.required]
    });
    freeCalendarForm.controls['dayOfWeek'].setValue([keyValuepair]);
    freeCalendarForm.controls['occurrence'].setValue([keyValuepair]);
    freeCalendarForm.controls['timeFrame'].setValue({
      value: 'monthly',
      label: 'monthly'
    });
    serviceRef.getFreeRuleOccurenceList(freeCalendarForm);
  });
  it('should cal getFreeRuleOccurenceList Else if', () => {
    freeCalendarForm = formBuilder.group({
      calendarType: [{
        value: 'relative',
        label: 'relative'
      }, Validators.required],
      timeFrame: ['', Validators.required],
      appliesToOccurrence: ['', Validators.required],
      dayOfWeek: ['', Validators.required]
    });
    freeCalendarForm.controls['dayOfWeek'].setValue([keyValuepair]);
    freeCalendarForm.controls['appliesToOccurrence'].setValue([keyValuepair]);
    freeCalendarForm.controls['timeFrame'].setValue({
      value: 'weekly',
      label: 'weekly'
    });
    serviceRef.getFreeRuleOccurenceList(freeCalendarForm);
  });
      it('should cal getFreeRuleOccurenceList Else', () => {
        freeCalendarForm = formBuilder.group({
          calendarType: [{
            value: 'NOTrelative',
            label: 'NOTrelative'
          }, Validators.required],
          timeFrame: ['', Validators.required],
          appliesToOccurrence: ['', Validators.required],
          dayOfWeek: ['', Validators.required]
        });
        freeCalendarForm.controls['dayOfWeek'].setValue([keyValuepair]);
        freeCalendarForm.controls['appliesToOccurrence'].setValue([keyValuepair]);
        freeCalendarForm.controls['timeFrame'].setValue({
          value: 'weekly',
          label: 'weekly'
        });
        serviceRef.getFreeRuleOccurenceList(freeCalendarForm);
      });
      it('should cal getFreeRuleDayOfMonth', () => {
        freeCalendarForm = formBuilder.group({
          calendarType: [{
            value: 'NOTrelative',
            label: 'NOTrelative'
          }, Validators.required],
          dayOfMonth: ['', Validators.required]
        });
        freeCalendarForm.controls['dayOfMonth'].setValue(keyValuepair);
        serviceRef.getFreeRuleDayOfMonth(freeCalendarForm);
      });
      it('should cal getFreeRuleDayOfMonth Else', () => {
        freeCalendarForm = formBuilder.group({
          calendarType: [{
            value: 'NOTrelative',
            label: 'NOTrelative'
          }, Validators.required],
          dayOfMonth: ['', Validators.required]
        });
        freeCalendarForm.controls['dayOfMonth'].setValue('');
        serviceRef.getFreeRuleDayOfMonth(freeCalendarForm);
      });
      it('should cal getFreeRuleMonth', () => {
        freeCalendarForm = formBuilder.group({
          calendarType: [{
            value: 'NOTrelative',
            label: 'NOTrelative'
          }, Validators.required],
          months: ['', Validators.required]
        });
        freeCalendarForm.controls['months'].setValue(keyValuepair);
        serviceRef.getFreeRuleMonth(freeCalendarForm);
      });
      it('should cal getFreeRuleMonth Else', () => {
        freeCalendarForm = formBuilder.group({
          calendarType: [{
            value: 'NOTrelative',
            label: 'NOTrelative'
          }, Validators.required],
          months: ['', Validators.required]
        });
        freeCalendarForm.controls['months'].setValue('');
        serviceRef.getFreeRuleMonth(freeCalendarForm);
      });
    });
