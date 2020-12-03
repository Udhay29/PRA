import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AddRatesService } from './service/add-rates.service';
import { AppModule } from './../../../../../../app.module';
import { StandardModule } from './../../../../standard.module';
import { configureTestSuite } from 'ng-bullet';

import { AddRatesComponent } from './add-rates.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
// tslint:disable-next-line:max-line-length
import { FormBuilder, FormGroup, AbstractControl, FormsModule, ReactiveFormsModule, FormArray, FormControl, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { DebugElement } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
describe('AddRatesComponent', () => {
  let component: AddRatesComponent;
  let fixture: ComponentFixture<AddRatesComponent>;
  let addRatesService: AddRatesService;
  const formBuilder: FormBuilder = new FormBuilder();
  let formGroup: FormGroup;
  let controlName: AbstractControl;
  let currencyPipe:  CurrencyPipe;
  let debugElement: DebugElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, StandardModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, MessageService, AddRatesService, CurrencyPipe]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    addRatesService = TestBed.get(AddRatesService);
    debugElement =  fixture.debugElement;
    currencyPipe =  debugElement.injector.get(CurrencyPipe);
    const amountPattern = '[-0-9., ]*';
    formGroup = formBuilder.group({
      rates: new FormArray([ new FormGroup({
        rateType: new FormControl(''),
        rateAmount: new FormControl('1', [Validators.pattern(amountPattern)]),
        minAmount: new FormControl('2', [Validators.pattern(amountPattern)]),
        maxAmount: new FormControl('3', [Validators.pattern(amountPattern)]),
        rounding: new FormControl('Down', [])
      })
      ]),
      groupRateType: new FormControl(''),
      isGroupRateItemize: new FormControl(false)
    });
    component.addRatesModel.addRateForm = formGroup;
    (component.addRatesModel.addRateForm.controls.rates as FormArray).at(0).get('rateType').setValue('true');
    fixture.detectChanges();
    controlName = (component.addRatesModel.addRateForm.controls.rates as FormArray).at(0).get('rateAmount');
  });
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    spyOn(addRatesService, 'getRoundingTypes').and.returnValues(of(groupRateResponse));
    component.ngOnInit();
  });
  it('should call getRateTypes', () => {
    component.buSo = [1];
    const rateTypeResponse = [ {
      'rateTypeId' : 7,
      'rateTypeName' : 'Cwt',
      'effectiveDate' : '2019-05-24',
      'expirationDate' : '2099-12-31',
      'lastUpdateTimestampString' : '2019-05-24T13:42:44.7201447'
    }];
    spyOn(addRatesService, 'getRateTypes').and.returnValues(of(rateTypeResponse));
    component.getRateTypes([1]);
  });
  it('should call onTypeRoundingType', () => {
    component.addRatesModel.roundingTypes = [{label: 'Cwt', value: 7}];
    const element = fixture.debugElement.query(By.css('[name="rounding"]'));
    element.triggerEventHandler('completeMethod', {'query': 'c'});
  });
  it('should call showHideRateGroup', () => {
    component.showHideRateGroup();
    component.showError('test');
  });
  it('should call onTypeRateType', () => {
    component.addRatesModel.rateTypes = [{label: 'Cwt', value: 7}];
    const element = fixture.debugElement.query(By.css('[name="rateType"]'));
    element.triggerEventHandler('completeMethod', {'query': 'c'});
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
  it('it should cal validateRateAmount', () => {
    controlName.setValue(2);
    expect(controlName.valid).toBeDefined();
    component.validateRateAmount('32', 0, 'rateAmount');
    component.validateRateAmount('32', 0, 'minAmount');
    component.validateRateAmount('32', 0, 'minAmount');
  });
  it('it should cal getGroupRateTypes', () => {
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
  it('should call validateRateAmount', () => {
    component.validateAmountRange(0, 'minAmount');
    component.validateAmountRange(0, 'maxAmount');
  });
  it('it should call onautoCompleteBlur', () => {
    component.addRatesModel.CheckBoxAttributes = {
      'waived': true,
      'calculateRate': true,
      'passThrough': true,
      'rollUp': true
    };
    const event = {
      target: {
        'value': ''
      }
    };
    (component.addRatesModel.addRateForm.controls.rates as FormArray).at(0).get('rateType').setValue('true');
    component.onautoCompleteBlur(event, 'rateType', 0);
    const eventElse = {
      target: {
        'value': 'a'
      }
    };
    (component.addRatesModel.addRateForm.controls.rates as FormArray).at(0).get('rateAmount').setValue('2');
    component.onautoCompleteBlur(eventElse, 'rateAmount', 0);
    expect(component.onautoCompleteBlur).toBeTruthy();
  });
});
