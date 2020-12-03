import { DocumentationDate } from './../../../documentation/create-documentation/model/create-documentation.interface';
import { ChargeCodeResponseInterface, RuleType, RuleTypeValue } from './../model/create-rules.interface';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CreateRulesComponent } from './../create-rules.component';
import { CreateRuleModel } from './../model/create-rules.model';
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


import { ViewAgreementDetailsModule } from './../../../../../view-agreement-details/view-agreement-details.module';

import { CreateRuleUtilityService } from './create-rule-utility.service';
import { AveragingRulesModel } from './../../../../../shared/accessorials/rule-shared/averaging-rules/models/averaging-rules.model';
import { ViewDocumentationModel } from '../../../shared/view-documentation/models/view-documentation.model';
import { FreeEventTypeModel } from '../../free-rule/free-event-type/model/free-event-type.model';
import { FreeCalendarModel } from '../../free-rule/free-calendar/model/free-calendar.model';
import { FreeRuleModel } from '../../free-rule/model/free-rule.model';
import { MessageService } from 'primeng/components/common/messageservice';
import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FreeRuleComponent } from '../../free-rule/free-rule.component';
import { FreeEventTypeComponent } from '../../free-rule/free-event-type/free-event-type.component';
import { FreeCalendarComponent } from '../../free-rule/free-calendar/free-calendar.component';
import { NotifyByComponent } from '../../../../../shared/accessorials/notification/notify-by/notify-by.component';
import { NotifyWhenComponent } from '../../../../../shared/accessorials/notification/notify-when/notify-when.component';


describe('CreateRuleUtilityService', () => {
  let freeRuleComponent: FreeRuleComponent;
  let freeEvent: FreeEventTypeComponent;
  let freeCalendar: FreeCalendarComponent;
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
  const formBuilder: FormBuilder = new FormBuilder();
  const messageservice: MessageService = new MessageService();
  let component: CreateRulesComponent;
  let fixture: ComponentFixture<CreateRulesComponent>;
  let freeRuleFixture: ComponentFixture<FreeRuleComponent>;
  let freeEventFixture: ComponentFixture<FreeEventTypeComponent>;
  let freeCalenderFixture: ComponentFixture<FreeCalendarComponent>;
  let currencyPipe: CurrencyPipe;
  let debugElement: DebugElement;
  let notifyByComponent: NotifyByComponent;
  let notifyByFixture: ComponentFixture<NotifyByComponent>;
  let notifyWhenComponent: NotifyWhenComponent;
  let notifyWhenFixture: ComponentFixture<NotifyWhenComponent>;

  configureTestSuite(() => {
    const changeDetectorRefStub = { detectChanges: () => ({}) };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule,
        FormsModule, ReactiveFormsModule],
      providers: [CreateRuleUtilityService, { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefStub }, HttpClient, CurrencyPipe],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRulesComponent);
    component = fixture.componentInstance;
    freeRuleFixture = TestBed.createComponent(FreeRuleComponent);
    freeRuleComponent = freeRuleFixture.componentInstance;
    freeEventFixture = TestBed.createComponent(FreeEventTypeComponent);
    freeEvent = freeEventFixture.componentInstance;
    freeCalenderFixture = TestBed.createComponent(FreeCalendarComponent);
    notifyByFixture = TestBed.createComponent(NotifyByComponent);
    notifyWhenFixture = TestBed.createComponent(NotifyWhenComponent);
    notifyWhenComponent = notifyWhenFixture.componentInstance;
    notifyByComponent = notifyByFixture.componentInstance;
    freeCalendar = freeCalenderFixture.componentInstance;
    serviceRef = TestBed.get(CreateRuleUtilityService);
    http = TestBed.get(HttpClient);
    debugElement = fixture.debugElement;
    currencyPipe = debugElement.injector.get(CurrencyPipe);
    createRuleModel = new CreateRuleModel('1');
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
    fixture.detectChanges();
  });

  it('should be created', inject([CreateRuleUtilityService], (service: CreateRuleUtilityService) => {
    expect(service).toBeTruthy();
  }));

  it('should cal validateDate', () => {
    serviceRef.validateDate('', 'effectiveDate', createRuleModel);
  });

  it('should cal validateDate for else', () => {
    createRuleModel.agreementExpirationDate = '09/19/2019';
    serviceRef.validateDate('09/17/2019', 'effectiveDate', createRuleModel);
  });

  it('should cal validateDate exp', () => {
    serviceRef.validateDate('', 'expirationDate', createRuleModel);
  });

  it('should cal validateDate exp for else', () => {
    createRuleModel.agreementEffectiveDate = '09/19/2019';
    serviceRef.validateDate('09/17/2019', 'expirationDate', createRuleModel);
  });

  it('should cal saveParamFramer', () => {
    createRuleModel.rulesForm = formGroup;
    serviceRef.saveParamFramer(createRuleModel, {}, averagingRulesModel, viewDocumentationModel);
  });

  it('should cal saveParamFramerFree', () => {
    createRuleModel.rulesForm = formGroup;
    const optionalForm = formBuilder.group({
      name: ['abc', Validators.required],
      equipmentLength: [{label: '10', value: 10}, Validators.required]
    });
    component.optionalFields.optionalAttributesModel.optionalForm = optionalForm;
    serviceRef.saveParamFramerFree(createRuleModel, {} , freeRuleModel, freeEventTypeModel,
      freeCalendarModel, component.documentation.viewDocumentationModel, component.optionalFields['optionalAttributesModel']);
  });

  it('should cal getDocumentFileNames', () => {
    component.documentation.viewDocumentationModel = {
      attachments: [ {documentName: 'abc'}]
    };
    serviceRef.getDocumentFileNames(component.documentation.viewDocumentationModel.attachments);
  });

  it('should cal checkNullConditionForDocumentation', () => {
    serviceRef.checkNullConditionForDocumentation('abc');
  });

  it('should cal notifactionBy', () => {
    component.appNotifyBy = notifyByComponent;
    component.appNotifyBy.notifyByModel.CheckBoxData = [{
      label: 'Manual',
      value: 'Manual'
    }];
    component.appNotifyBy.notifyByModel.notifyByForm = new FormGroup({
      selectionCheckbox: new FormControl([], [Validators.required])
    });
    serviceRef.notifactionBy(component.appNotifyBy);
  });

  it('should cal frameNotifyByDto for email', () => {
    component.appNotifyBy = notifyByComponent;
    component.appNotifyBy.notifyByModel.CheckBoxData = [{
      label: 'Email',
      value: 'Email'
    }];
    const NotifyByArray = [];
    component.appNotifyBy.notifyByModel.notifyByForm.controls['emailNotificationType'].setValue({label: 'Email', value: 'Email'});
    serviceRef.frameNotifyByDto('Email', component.appNotifyBy, component.appNotifyBy.notifyByModel.CheckBoxData.value,
      component.appNotifyBy.notifyByModel.CheckBoxData.value, component.appNotifyBy.notifyByModel.CheckBoxData.value,
      NotifyByArray);
  });

  it('should cal frameNotifyByDto for Website', () => {
    component.appNotifyBy = notifyByComponent;
    component.appNotifyBy.notifyByModel.CheckBoxData = [{
      label: 'Website',
      value: 'Website'
    }];
    const NotifyByArray = [];
    component.appNotifyBy.notifyByModel.notifyByForm.controls['emailNotificationType'].setValue({label: 'Website', value: 'Website'});
    serviceRef.frameNotifyByDto('Website', component.appNotifyBy, component.appNotifyBy.notifyByModel.CheckBoxData.value,
      component.appNotifyBy.notifyByModel.CheckBoxData.value, component.appNotifyBy.notifyByModel.CheckBoxData.value,
      NotifyByArray);
  });

  it('should cal frameNotifyByDto for Manual', () => {
    component.appNotifyBy = notifyByComponent;
    component.appNotifyBy.notifyByModel.CheckBoxData = [{
      label: 'Manual',
      value: 'Manual'
    }];
    const NotifyByArray = [];
    component.appNotifyBy.notifyByModel.notifyByForm.controls['emailNotificationType'].setValue({label: 'Manual', value: 'Manual'});
    serviceRef.frameNotifyByDto('Manual', component.appNotifyBy, component.appNotifyBy.notifyByModel.CheckBoxData.value,
      component.appNotifyBy.notifyByModel.CheckBoxData.value, component.appNotifyBy.notifyByModel.CheckBoxData.value,
      NotifyByArray);
  });

  it('should cal batchTImeFramer', () => {
    component.appNotifyWhen = notifyWhenComponent;
    component.appNotifyWhen.notifyWhenModel.notifyWhenForm = new FormGroup({
      frequency: new FormControl('', [Validators.required]),
      eventOccuranceTime: new FormControl('', [Validators.required]),
      accessorialNotificationRequiredTypes: new FormControl('Notification Required'),
      eventName: new FormControl('', [Validators.required]),
      timeframe: new FormControl(''),
      batchTime: new FormControl(['monday']),
      timeframeInput: new FormControl('')
    });
    serviceRef.batchTImeFramer(component.appNotifyWhen.notifyWhenModel.notifyWhenForm.controls['batchTime'].value);
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

  it('should cal rulefieldsTouched', () => {
    serviceRef.rulefieldsTouched(createRuleModel);
  });

  it('should cal dateCheck', () => {
    serviceRef.dateCheck(createRuleModel);
  });

  it('should cal validateRuleForm', () => {
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
    serviceRef.setValidation('ruleType', createRuleModel);
  });

  it('should cal setFormErrors', () => {
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    serviceRef.setFormErrors(component, changeDetectorRefStub);
  });

  it('should cal validateEffectiveDate', () => {
    createRuleModel.rulesForm.controls['effectiveDate'].setValue(new Date('03/07/2019'));
    createRuleModel.rulesForm.controls['expirationDate'].setValue(new Date('02/07/2019'));
    serviceRef.validateEffectiveDate(createRuleModel);
    createRuleModel.rulesForm.controls['effectiveDate'].setValue(new Date('03/07/2019'));
    createRuleModel.rulesForm.controls['expirationDate'].setValue(new Date('05/09/2019'));
    serviceRef.validateEffectiveDate(createRuleModel);
  });

  it('should cal clearFreeRuleFormOnSaveAndCreateNew', () => {
    const freeRuleTypeResponse = {
      label: 'Quantity'
    };
    freeRuleComponent.freeRuleModel.freeRulesForm = freeRuleForm;
    serviceRef.clearFreeRuleFormOnSaveAndCreateNew(freeRuleComponent, freeRuleTypeResponse);
    const freeRuleTypeResponse1 = {
      label: 'Event'
    };
    freeRuleComponent.freeTypeEventTab = freeEvent;
    freeRuleComponent.freeTypeEventTab.freeEventTypeModel.freeEventTypeForm = freeEventForm;
    serviceRef.clearFreeRuleFormOnSaveAndCreateNew(freeRuleComponent, freeRuleTypeResponse1);
    const freeRuleTypeResponse2 = {
      label: 'Calendar'
    };
    freeRuleComponent.freeTypeCalendarTab = freeCalendar;
    freeRuleComponent.freeTypeCalendarTab.freeCalendarModel.freeCalendarForm = freeCalendarForm;
    serviceRef.clearFreeRuleFormOnSaveAndCreateNew(freeRuleComponent, freeRuleTypeResponse2);
    const freeRuleTypeResponse3 = {
      label: 'Cal'
    };
    serviceRef.clearFreeRuleFormOnSaveAndCreateNew(freeRuleComponent, freeRuleTypeResponse3);
  });

  it('should cal populateGracePeriod', () => {
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    const graceResponse = {
      _embedded: {
        pricingUnitOfTimeMeasurementAssociations: [{
          unitOfTimeMeasurementCode: 'test',
          pricingUnitOfTimeMeasurementAssociationId: 1
        }]
      },
      _links: {}
    };
    serviceRef.populateGracePeriod(graceResponse, createRuleModel, changeDetectorRefStub);
    serviceRef.populateGracePeriod(false, createRuleModel, changeDetectorRefStub);
  });

  it('getFormattedDate should return some date', () => {
    serviceRef.dateFormatter('');
    expect(serviceRef.dateFormatter).toBeTruthy();
  });

  it('should cal populateChargeType', () => {
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    const chargeTypeResponse = [{
      chargeTypeID: 1,
      chargeTypeCode: 'string',
      chargeTypeName: 'string',
      chargeTypeDescription: 'string',
      chargeTypeBusinessUnitServiceOfferingAssociations: [{
        chargeTypeBusinessUnitServiceOfferingAssociationID: 1,
        chargeTypeID: null,
        financeBusinessUnitServiceOfferingAssociation: {
          financeBusinessUnitServiceOfferingAssociationID: 1,
          financeBusinessUnitCode: 'string',
          serviceOfferingCode: 'string',
        },
        financeChargeUsageTypeID: 1,
        effectiveDate: 'string',
        expirationDate: 'string',
      }]
    }];
    serviceRef.populateChargeType(chargeTypeResponse, createRuleModel, changeDetectorRefStub);
    serviceRef.populateChargeType([], createRuleModel, changeDetectorRefStub);
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
    serviceRef.populateRuleType(null, createRuleModel, changeDetectorRefStub);
  });

  it('should cal populateAgreementLevel', () => {
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    const documentationDate: DocumentationDate = {
      agreementID: 123,
      agreementDefaultAmount: 123,
      agreementEffectiveDate: 'string',
      agreementExpirationDate: 'string',
      customerContractDetailDTO: ['a'],
      customerSectionDetailDTO: ['a']
    };
    serviceRef.populateAgreementLevel(documentationDate, createRuleModel, changeDetectorRefStub);
    serviceRef.populateAgreementLevel(null, createRuleModel, changeDetectorRefStub);
  });

  it('should cal formatAmount', () => {
    serviceRef.formatAmount('2', currencyPipe);
  });

  it('should cal createFreeFuleParamEventType', () => {
    serviceRef.createFreeFuleParamEventType(freeRuleForm, freeEventForm, createRuleModel);
  });

  it('should cal createFreeFuleParam', () => {
    serviceRef.createFreeFuleParam(freeRuleForm, createRuleModel);
  });

  it('should cal createFreeRuleParamCalendar', () => {
    freeCalendarForm = formBuilder.group({
      calendarType: ['monthly', Validators.required],
      timeFrame: ['', Validators.required]
    });
    freeCalendarForm.controls['calendarType'].setValue({ 'label': 'relative' });
    freeCalendarForm.controls['timeFrame'].setValue({ 'label': 'monthly' });
    serviceRef.getFormControlLabel(freeCalendarForm, 'calendarType');
    serviceRef.createFreeRuleParamCalendar(freeRuleForm, freeCalendarForm, createRuleModel);
  });

});
