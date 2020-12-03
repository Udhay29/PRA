import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/components/common/messageservice';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';
import { CurrencyPipe } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AddRatesComponent } from './add-rates.component';
import { AddRatesService } from './service/add-rates.service';
import {
  FormBuilder, FormArray, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl,
  AbstractControl
} from '@angular/forms';
import { of } from 'rxjs';
import { AddRatesModel } from './model/add-rates.model';
import { DebugElement } from '@angular/core';
import { AddressValuesInterface } from '../../../line-haul/add-line-haul/lane-card/model/lane-card.interface';
import { GroupRateTypesInterface } from './model/add-rates.interface';


describe('AddRatesComponent', () => {
  let component: AddRatesComponent;
  let fixture: ComponentFixture<AddRatesComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  let formGroup: FormGroup;
  let controlName: AbstractControl;
  const checkboxInterfaces = {
    'waived': true,
    'calculateRate': true,
    'passThrough': true,
    'rollUp': true
  };
  let currencyPipe: CurrencyPipe;
  let debugElement: DebugElement;
  let addRatesService: AddRatesService;
  let groupTypes: GroupRateTypesInterface;

  configureTestSuite(() => {
    const formBuilderStub = {
      group: () => ({})
    };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule,
        FormsModule, ReactiveFormsModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, MessageService, AddRatesService, CurrencyPipe]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRatesComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    addRatesService = debugElement.injector.get(AddRatesService);
    currencyPipe = debugElement.injector.get(CurrencyPipe);
    const amountPattern = '[-0-9., ]*';
    formGroup = formBuilder.group({
      rates: new FormArray([new FormGroup({
        rateType: new FormControl(''),
        rateAmount: new FormControl('1.1, 2.1', [Validators.pattern(amountPattern)]),
        minAmount: new FormControl(2, [Validators.pattern(amountPattern)]),
        maxAmount: new FormControl('3', [Validators.pattern(amountPattern)]),
        rounding: new FormControl('Down', [])
      }),
      new FormGroup({
        rateType: new FormControl('hsg'),
        rateAmount: new FormControl('1.1, 2.1', [Validators.pattern(amountPattern)]),
        minAmount: new FormControl(2, [Validators.pattern(amountPattern)]),
        maxAmount: new FormControl('3', [Validators.pattern(amountPattern)]),
        rounding: new FormControl('Down', [])
      })
      ]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    component.addRatesModel.addRateForm = formGroup;
    (component.addRatesModel.addRateForm.controls.rates as FormArray).at(0).get('rateType').setValue('true');
    controlName = (component.addRatesModel.addRateForm.controls.rates as FormArray).at(0).get('rateAmount');
    groupTypes = {
      groupRateTypeName: 'string',
      groupRateTypeID: 1
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should initialize form', () => {
    component.createRatesForm();
    expect(component.createRatesForm).toBeTruthy();
  });

  it('should initialize component', () => {
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  });

  it('it should createRateItem', () => {
    component.createRateItem();
    expect(component.createRateItem).toBeTruthy();
  });

  it('it should show hide rateGroup', () => {
    const ratesLength = (component.addRatesModel.addRateForm.controls.rates as FormArray).length;
    expect(ratesLength).toEqual(1);
    expect(component.addRatesModel.isMoreThanOneRate).toBeFalsy();
    component.showHideRateGroup();
    expect(component.showHideRateGroup).toBeTruthy();
  });

  it('it should onGroupTypeChange', () => {
    component.onGroupTypeChange();
    expect(component.onGroupTypeChange).toBeTruthy();
  });

  it('it should onTypeGroupRateType', () => {
    const event: any = {query: 'abc'};
    component.addRatesModel.groupRateTypes = [{
      'label': 'abc',
      'value': 2
    }];
    component.onTypeGroupRateType(event);
    expect(component.onTypeGroupRateType).toBeTruthy();
  });

  it('it should onTypeRoundingType', () => {
    component.onTypeRoundingType(event);
    expect(component.onTypeRoundingType).toBeTruthy();
  });

  it('it should cal getRoundingTypes', () => {
    const data = [{
      'accessorialRateRoundingTypeName': 'Half Down',
      '@id': '123'
    }];
    spyOn(AddRatesService.prototype, 'getRoundingTypes').and.returnValue(of(data));
    component.getRoundingTypes();
  });

  it('it should cal setRateAmountFieldError', () => {
    component.addRatesModel.CheckBoxAttributes = checkboxInterfaces;
    expect(component.addRatesModel.CheckBoxAttributes.passThrough).toBe(true);
    controlName.setValue(2);
    expect(controlName.value).toBeDefined();
    expect(controlName.valid).toBeTruthy();
    expect(controlName.setErrors).toBeDefined();

    const rates = (component.addRatesModel.addRateForm.controls.rates as FormArray).at(0);
    rates.get('minAmount').setValue('3');
    rates.get('maxAmount').setValue('2');
    expect(rates.get('minAmount').setErrors).toBeDefined();
    expect(rates.get('maxAmount').setErrors).toBeDefined();
    component.checkMinMaxRange(0);
    component.setRateAmountFieldError(controlName);
    expect(component.checkMinMaxRange).toBeTruthy();
  });

  it('it should showError toastMessage', () => {
    const data = [{
      severity: 'error', summary: 'Missing Required Information',
      detail: 'message'
    }];
    spyOn(MessageService.prototype, 'add').and.returnValue(of(data));
    component.showError('Error Message');
  });

  it('it should cal getRateTypes', () => {
    const data = [{
      'accessorialRateTypeName': 'Half Down',
      'accessorialRateTypeId': '123'
    }];
    spyOn(AddRatesService.prototype, 'getRateTypes').and.returnValue(of(data));
  });

  it('it should cal addRate for if', () => {
    component.addRatesModel.addRateForm = formGroup;
    component.addRate(0);
  });

  it('it should cal addRate for else', () => {
    component.addRatesModel.addRateForm.markAsDirty();
    component.addRatesModel.CheckBoxAttributes = checkboxInterfaces;
    component.addRate(0);
  });

  it('it should cal onautoCompleteBlur', () => {
    const event = {
      target: {
        'value': ''
      }
    };
    (component.addRatesModel.addRateForm.controls.rates as FormArray).at(0).get('rateType').setValue('true');
    component.onautoCompleteBlur(event, 'rateType', 0);
    expect(component.onautoCompleteBlur).toBeTruthy();
  });

  it('it should cal onRateAmountFormKeypress', () => {
     const event: any = {
      target: {
        value: '1.1, 2.1'
      }
    };
    component.onRateAmountFormKeypress(event, 0);
  });

  it('it should cal onFormKeypressRateAmount', () => {
    const event: any = {
      target: {
        value: '1.1, 2.1'
      }
    };
    component.onFormKeypressRateAmount(event, 'rateAmount', 0);
  });

  it('it should cal onTypeRateType', () => {
    const event = { query: 'abc' };
    component.addRatesModel.rateTypes = [{
      'label': 'abc',
      'value': 2
    }];
    expect(component.addRatesModel.rateTypes).toBeDefined();
    component.onTypeRateType(event);
    expect(component.onTypeRateType).toBeTruthy();
  });

  it('it should cal onTypeRateType for else', () => {
    const event = { query: 'abc' };
    component.addRatesModel.rateTypes = null;
    component.onTypeRateType(event);
    expect(component.onTypeRateType).toBeTruthy();
  });

  it('it should cal onTypeGroupRateType', () => {
    const event = { query: 'abc' };
    component.addRatesModel.groupRateTypes = [{
      'label': 'abc',
      'value': 2
    }];
    expect(component.addRatesModel.groupRateTypes).toBeDefined();
    component.onTypeGroupRateType(event);
    expect(component.onTypeGroupRateType).toBeTruthy();
  });

  it('it should cal onTypeRoundingType', () => {
    const event = { query: 'abc' };
    component.addRatesModel.roundingTypes = [{
      'label': 'abc',
      'value': 2
    }];
    expect(component.addRatesModel.roundingTypes).toBeDefined();
    component.onTypeRoundingType(event);
    expect(component.onTypeRoundingType).toBeTruthy();
  });

  it('it should cal on addRate', () => {
    const rateFc = (component.addRatesModel.addRateForm.controls.rates as FormArray).at(0);
    (component.addRatesModel.addRateForm.controls.rates as FormArray).at(0).get('rateAmount').setValue('2');
    (component.addRatesModel.addRateForm.controls.rates as FormArray).at(0).get('rateType').setValue('true');
    expect(rateFc.valid).toBeTruthy();
    component.addRate(0);
    expect(component.addRate).toBeTruthy();
  });

  it('it should cal removeRate', () => {
    const ratesForm = (component.addRatesModel.addRateForm.get('rates') as FormArray);
    expect(ratesForm.length).toEqual(1);
    component.removeRate(0);
    expect(component.removeRate).toBeTruthy();
  });

  it('it should cal removeRate for else', () => {
    formGroup = formBuilder.group({
      rates: new FormArray([]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    component.addRatesModel.addRateForm = formGroup;
    const ratesForm = (component.addRatesModel.addRateForm.get('rates') as FormArray);
    component.removeRate(0);
    expect(component.removeRate).toBeTruthy();
  });

  it('it should cal validateRateAmount for if', () => {
    component.addRatesModel.rateAmountValues = [1, 2];
    expect(controlName.valid).toBeDefined();
    component.addRatesModel.addRateForm = formGroup;
    component.validateRateAmount(0, 'rateAmount');
  });

  it('it should cal validateRateAmount for else', () => {
    component.addRatesModel.rateAmountValues = [];
    expect(controlName.valid).toBeDefined();
    component.addRatesModel.addRateForm = formGroup;
    component.validateRateAmount(0, 'rateAmount');
  });

  it('it should cal validateMinMaxAmount for if', () => {
    component.addRatesModel.addRateForm = formGroup;
    component.validateMinMaxAmount('1', 0, 'rateAmount');
  });

  it('it should cal validateMinMaxAmount for else', () => {
    component.addRatesModel.addRateForm.markAsDirty();
    component.validateMinMaxAmount('1', 0, 'rateAmount');
  });

  it('it should cal isRollUpChecked ', () => {
    component.addRatesModel.CheckBoxAttributes = checkboxInterfaces;
    component.addRatesModel.addRateForm = formGroup;
    component.isRollUpChecked('rateAmount');
  });

  it('it should cal formatAmount', () => {
    const minAmount = '2, 1';
    component.formatAmount(minAmount);
    expect(component.formatAmount).toBeTruthy();
  });

  it('it should cal validateAmountRange', () => {
    component.validateAmountRange(0, 'minAmount');
    expect(component.validateAmountRange).toBeTruthy();
  });

  it('it should cal getGroupRateTypes', () => {
    const groupRateResponse = {
      '_embedded' : {
        'accessorialRateRoundingTypes' : [ {
          '@id' : 1,
          'createTimestamp' : '2019-05-24T14:31:18.3933941',
          'createProgramName' : 'SSIS',
          'lastUpdateProgramName' : 'SSIS',
          'createUserId' : 'PIDNEXT',
          'lastUpdateUserId' : 'PIDNEXT',
          'accessorialRateRoundingTypeName' : 'Down',
          'effectiveDate' : '2019-05-24',
          'expirationDate' : '2099-12-31',
          'lastUpdateTimestampString' : '2019-05-24T14:31:18.3933941',
          '_links' : {}
        } ]
      },
      '_links' : {},
      'page' : {
        'size' : 50,
        'totalElements' : 6,
        'totalPages' : 1,
        'number' : 0
      }
    };
    const response = {
      '_embedded' : {
        'groupRateTypes' : [ {
          'groupRateTypeID' : 1,
          'groupRateTypeName' : 'Sum',
          '_links' : {}
        } ]
      },
      '_links' : {},
      'page' : {
        'size' : 50,
        'totalElements' : 3,
        'totalPages' : 1,
        'number' : 0
      }
    };
    spyOn(AddRatesService.prototype, 'getGroupRateTypes').and.returnValue(of(response));
    component.getGroupRateTypes();
  });

  it('should call getGroupRateTypes', () => {
    component.getGroupRateTypes();
    spyOn(addRatesService, 'getGroupRateTypes').and.callThrough();
  });

  it('should call onBlurgroupRateType', () => {
    const event: any = {
      target: {
        value: null
      }
    };
    component.onBlurgroupRateType(event);
  });

});
