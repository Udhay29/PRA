import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { DebugElement } from '@angular/core';
import {
  FormsModule, ReactiveFormsModule,
  FormControl, Validators, FormBuilder, FormGroup, FormArray, AbstractControl
} from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { AddStairStepService } from './services/add-stair-step.service';
import { AddStairStepComponent } from './add-stair-step.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/components/common/messageservice';
import { PatchAddStairStepUtilityService } from './services/patch-add-stair-step-utility';

import { of } from 'rxjs';

describe('AddStairStepComponent', () => {

  let component: AddStairStepComponent;
  let fixture: ComponentFixture<AddStairStepComponent>;
  let debugElement: DebugElement;
  let messageService: MessageService;
  let addStairStepService: AddStairStepService;
  let currencyPipe: CurrencyPipe;
  const formBuilder = new FormBuilder();
  let formGroup: FormGroup;
  let stairStepControl: AbstractControl;
  let rateType;
  let roundingType;
  let maxAppliedWhen;
  let controlName;
  let patchStairStepRate;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TableModule, AutoCompleteModule, MessagesModule, MessageModule, CheckboxModule, InputTextModule,
        FormsModule, ReactiveFormsModule],
      declarations: [AddStairStepComponent],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, AddStairStepService,
        MessageService, CurrencyPipe]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStairStepComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    addStairStepService = debugElement.injector.get(AddStairStepService);
    messageService = debugElement.injector.get(MessageService);
    currencyPipe = debugElement.injector.get(CurrencyPipe);
    const amountPattern = '[-0-9., ]*';
    formGroup = formBuilder.group({
      rateType: new FormControl('', [Validators.required]),
      minAmount: new FormControl('2'),
      maxAmount: new FormControl('4'),
      rounding: new FormControl('Down', []),
      maxApplidedWhen: new FormControl('Steps Are Exceeded'),
      itemizeRates: new FormControl(false),
      stepsArray: new FormArray([new FormGroup({
        step: new FormControl('1', [Validators.required]),
        fromQuantity: new FormControl('2', [Validators.required]),
        toQuantity: new FormControl('4', [Validators.required]),
        rateAmount: new FormControl('2.00', [Validators.pattern(amountPattern)])
      }),
      new FormGroup({
        step: new FormControl('2', [Validators.required]),
        fromQuantity: new FormControl('5', [Validators.required]),
        toQuantity: new FormControl('7', [Validators.required]),
        rateAmount: new FormControl('5.00', [Validators.pattern(amountPattern)])
      })
      ])
    });
    component.stairStepModel.addStairStepForm = formGroup;
    stairStepControl = (component.stairStepModel.addStairStepForm.controls.stepsArray as FormArray).at(0);
    controlName = (component.stairStepModel.addStairStepForm.controls.stepsArray as FormArray);
    rateType = [{
      'rateTypeId': 16,
      'rateTypeName': 'Quantity Miles',
      'effectiveDate': '2019-01-08',
      'expirationDate': '2099-12-31',
      'lastUpdateTimestampString': '2019-01-08T04:51:33.2716093'
    }];
    roundingType = {
      '_embedded': {
        'accessorialRateRoundingTypes': [{
          '@id': 1,
          'createTimestamp': '2019-04-08T11:06:11.2231586',
          'createProgramName': 'SSIS',
          'lastUpdateProgramName': 'SSIS',
          'createUserId': 'PIDNEXT',
          'lastUpdateUserId': 'PIDNEXT',
          'accessorialRateRoundingTypeName': 'Down',
          'effectiveDate': '2019-04-08',
          'expirationDate': '2099-12-31',
          'lastUpdateTimestampString': '2019-04-08T11:06:11.2231586',
          '_links': {
            'self': {
              'href': 'https://pricing-dev.jbhunt.com/pricingaccessorialservices/customeragreementsroundingtypes/1'
            },
            'accessorialRateRoundingType': {
              'href': 'https://pricing-dev.jbhunt.com/pricingaccessorialservices/customeragreementsroundingtypes/1'
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': 'https://pricing-dev.jbhunt.com/pricingaccessorialservices/customeragreementsroundingtypes{?page,size,sort}',
          'templated': true
        },
        'profile': {
          'href': 'https://pricing-dev.jbhunt.com/pricingaccessorialservices/profile/customeragreementsroundingtypes'
        }
      },
      'page': {
        'size': 50,
        'totalElements': 6,
        'totalPages': 1,
        'number': 0
      }
    };
    maxAppliedWhen = {
      '_embedded': {
        'accessorialMaximumRateApplyTypes': [{
          '@id': 1,
          'createTimestamp': '2019-04-24T05:00:16.697739',
          'createProgramName': 'SSIS',
          'lastUpdateProgramName': 'SSIS',
          'createUserId': 'PIDNEXT',
          'lastUpdateUserId': 'PIDNEXT',
          'accessorialMaximumRateApplyTypeName': 'Steps Are Exceeded',
          'effectiveDate': '2019-04-24',
          'expirationDate': '2099-12-31',
          'lastUpdateTimestampString': '2019-04-24T05:00:16.697739',
          '_links': {
            'self': {
              'href': 'https://pricing-dev.jbhunt.com/pricingaccessorialservices/accessorialmaximumrateapplytype/1'
            },
            'accessorialMaximumRateApplyType': {
              'href': 'https://pricing-dev.jbhunt.com/pricingaccessorialservices/accessorialmaximumrateapplytype/1'
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': 'https://pricing-dev.jbhunt.com/pricingaccessorialservices/accessorialmaximumrateapplytype{?page,size,sort}',
          'templated': true
        },
        'profile': {
          'href': 'https://pricing-dev.jbhunt.com/pricingaccessorialservices/profile/accessorialmaximumrateapplytype'
        }
      },
      'page': {
        'size': 50,
        'totalElements': 2,
        'totalPages': 1,
        'number': 0
      }
    };
    patchStairStepRate = {
      'customerAccessorialStairRateId': 103,
      'accessorialRateTypeId': 7,
      'accessorialRateTypeName': 'Cwt',
      'accessorialRateRoundingTypeId': 7,
      'accessorialRateRoundingTypeName': 'Down',
      'accessorialMaximumRateApplyTypeId': null,
      'accessorialMaximumRateApplyTypeName': null,
      'minimumAmount': null,
      'maximumAmount': null,
      'customerAccessorialStairStepRateDTOs': [
        {
          'customerAccessorialStairStepRateId': 180,
          'fromQuantity': 0,
          'toQuantity': 1,
          'stairStepRateAmount': 0,
          'stepNumber': 0
        },
        {
          'customerAccessorialStairStepRateId': 181,
          'fromQuantity': 2,
          'toQuantity': 112,
          'stairStepRateAmount': 12,
          'stepNumber': 1
        }
      ]
    };

    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onFormKeypress', () => {
    const event = { target: { value: '1' } };
    component.onFormKeypress(event, 'minAmount');
  });
  it('should call onFormKeypress', () => {
    const event = { target: { value: '123456789123' } };
    component.onFormKeypress(event, 'minAmount');
  });
  it('should call onFormKeypressRateAmount', () => {
    const event = { target: { value: '123456789123' } };
    component.onFormKeypressRateAmount(event, 'fromQuantity', 0);
  });
  it('should call onfocusRateAmount', () => {
    component.onfocusRateAmount(0, 'toQuantity');
  });
  it('should call onfocusAmount', () => {
    component.stairStepModel.minAmount = '1';
    component.onfocusAmount('minAmount');
  });
  it('should call againValidate', () => {

    component.againValidate(1);
  });
  it('should call popvalue', () => {
    component.popvalue();
  });
  it('should call gapsLogic', () => {

    stairStepControl.setValidators([Validators.required]);
    expect(stairStepControl.get('fromQuantity').setErrors).toBeDefined();
    component.gapsLogic(0);

  });
  it('should call indexGapOrOverlap', () => {
    component.stairStepModel.addStairStepForm = formGroup;
    component.indexGapOrOverlap(1);
  });
  it('should call indexGapOrOverlap', () => {
    component.stairStepModel.addStairStepForm = formGroup;
    const stepArrayControl = (component.stairStepModel.addStairStepForm.controls.stepsArray as FormArray).at(0);
    stepArrayControl['controls']['fromQuantity'].setValue(0);
    const stepArrayControl1 = (component.stairStepModel.addStairStepForm.controls.stepsArray as FormArray).at(0);
    stepArrayControl1['controls']['toQuantity'].setValue(0);
    component.indexGapOrOverlap(1);
  });
  it('should call overlapsLogic', () => {
    component.overlapsLogic(0);
  });
  it('should call checkMinMaxRange', () => {
    component.checkMinMaxRange();
  });
  it('should call formatAmount', () => {
    component.formatAmount('123');
  });
  it('should call validateMinMaxAmount', () => {
    component.validateMinMaxAmount('minAmount');
  });
  it('should call precisionValidationfromQuantity', () => {
    component.stairStepModel.invalidPrecisionto.push(0);
    component.precisionValidation(0, 'fromQuantity');
  });
  it('should call addStair', () => {
    component.createStairStepForm();
    const stepArrayControl = (component.stairStepModel.addStairStepForm.controls.stepsArray as FormArray).at(0);
    stepArrayControl['controls']['step'].setValue(1);
    stepArrayControl['controls']['fromQuantity'].setValue(1);
    stepArrayControl['controls']['toQuantity'].setValue(1);
    stepArrayControl['controls']['rateAmount'].setValue(1);
    component.addStair(0);
  });
  it('should call addStair', () => {
    component.createStairStepForm();
    const stepArrayControl = (component.stairStepModel.addStairStepForm.controls.stepsArray as FormArray).at(0);
    stepArrayControl['controls']['step'].setValue(1);
    stepArrayControl['controls']['fromQuantity'].setValue(1);
    stepArrayControl['controls']['toQuantity'].setValue(1);
    component.addStair(0);
  });
  it('should call onSelectionOfstep', () => {
    component.stairStepModel.fromQuantityDisabled = true;
    component.onSelectionOfstep('Free');
  });
  it('should call onSelectionOfstep', () => {
    component.onSelectionOfstep('1');
  });
  it('should call setRoundingValue', () => {
    expect(component.stairStepModel.roundingTypes).toBeUndefined();
    component.setRoundingValue(roundingType);
  });
  it('should call setRoundingValueElse', () => {
    component.setRoundingValue('');
  });
  it('should call setMaximumAppliedWhen', () => {
    component.setMaximumAppliedWhen(maxAppliedWhen);
  });
  it('should call setMaximumAppliedWhenElse', () => {
    component.setMaximumAppliedWhen('');
  });
  it('should call setRAteValue', () => {
    component.setRAteValue(rateType);
  });
  it('should call setRAteValueElse', () => {
    component.setRAteValue('');
  });
  it('should call setRAteValueElse', () => {

    component.isEditStairStepRateClicked = false;
    component.setRAteValue('');
  });
  /*it('should call onchargeTypeFilteredSearch', () => {
    component.stairStepModel.suggestionResult = [{
      label: 'string',
      value: 1
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="step"]'));
    element.triggerEventHandler('completeMethod', { 'query': 's' });
  });*/
  it('should call getRoundingTypes', () => {
    component.getRoundingTypes();
    spyOn(addStairStepService, 'getRoundingTypes').and.callThrough();
  });
  it('should call getmaxApplidedWhen', () => {
    component.getmaxApplidedWhen();
    spyOn(addStairStepService, 'getmaxApplidedWhen').and.callThrough();
  });
  it('should call getRateTypes', () => {
    component.getRateTypes([]);
    spyOn(addStairStepService, 'getRateTypes').and.callThrough();
  });
  it('should call checkForNumber', () => {
    component.checkForNumber(0, 'over');
  });
  it('should call checkNumberValidity', () => {
    component.checkNumberValidity(0);
  });
  it('should call checkOverlapSiblings', () => {
    component.checkOverlapSiblings(0, 'toQuantity');
  });
  it('should call checkOverlapSiblingsfromQuantity', () => {
    component.checkOverlapSiblings(0, 'fromQuantity');
  });
  it('should call checkOverlapSiblingsfromQuantity', () => {
    component.checkOverlapSiblings(0, 'MAxAmount');
  });
  it('should call onAutoCompleteBlur', () => {
    const event = { target: { value: '' } };

    component.onAutoCompleteBlur(event, 'step', 0);
  });
  it('should call createStairStepForm', () => {
    component.createStairStepForm();
  });
  it('should call setValidatorsRequired', () => {
    component.setValidatorsRequired();
  });
  it('should call setValidatorsRequiredErroe', () => {
    component.stairStepModel.addStairStepForm['controls'].stepsArray['controls'][0]['controls']['toQuantity'].setErrors({ error: true });
    component.setValidatorsRequired();
  });
  it('should call changingStepValue', () => {
    component.changingStepValue(0);
  });
  it('should call checkForMaxVAlueRate', () => {
    component.checkForMaxVAlueRate(1);
  });
  it('should call checkForMaxVAlueRateElse', () => {
    component.checkForMaxVAlueRate(0);
  });
  it('should call converttoTwoDecimalRAte', () => {
    component.converttoTwoDecimalRAte(0);
  });
  it('should call removeStairStepLengthNotOne', () => {
    component.removeStairStepLengthNotOne(0, controlName);
    component.changingStepValue(0);
  });
  it('should call removeStair', () => {
    component.removeStair(0);
  });
  it('should call checkOverlap0', () => {
    component.checkOverlap(0);
  });
  it('should call checkOverlap1', () => {
    component.stairStepModel.addStairStepForm = formGroup;
    component.checkOverlap(1);
  });
  it('should call checkForNumber', () => {
    component.stairStepModel.addStairStepForm = formGroup;
    const stepArrayControl = (component.stairStepModel.addStairStepForm.controls.stepsArray as FormArray).at(1);
    stepArrayControl['controls']['fromQuantity'].setValue(-1);
    component.checkForNumber(1, 'overlaps');
  });
  it('should call setRateFieldError', () => {
    component.stairStepModel.addStairStepForm = formGroup;
    const stepArrayControl = component.stairStepModel.addStairStepForm['controls']['maxAmount'];
    component.setRateFieldError(stepArrayControl);
  });
  it('should call forfromandtoCheck', () => {
    component.stairStepModel.addStairStepForm = formGroup;
    component.stairStepModel.addStairStepForm.controls.stepsArray['controls'][0]['controls']['fromQuantity'].markAsTouched();
    component.stairStepModel.addStairStepForm.controls.stepsArray['controls'][0]['controls']['toQuantity'].markAsTouched();
    component.forfromandtoCheck(0);
  });
  it('should call checkOverlaps', () => {
    component.stairStepModel.decimals = 2;
    component.stairStepModel.addStairStepForm['controls'].stepsArray['controls'][0]['controls']['fromQuantity'].setValue(0);
    component.stairStepModel.addStairStepForm['controls'].stepsArray['controls'][0]['controls']['toQuantity'].setValue(0);
    component.checkOverlaps(0);
  });
  it('should call onStairSearch', () => {
    component.stairStepModel.rateTypes = null;
    const response = {
      query: 'O'
    };
    component.onStairSearch(response, 'rateTypes');
  });
  it('should call onStairSearch', () => {
    const response = {
      query: 'O'
    };
    component.stairStepModel.rateTypes = [{ label: 'On', value: '12' }];
    component.onStairSearch(response, 'rateTypes');
  });
  it('should call utility service', () => {
    component.stairStepModel.addStairStepForm = formGroup;
    component.stairStepModel.editAccessorialWholeResponse = {
      'rateItemizeIndicator': '0'
    };
    PatchAddStairStepUtilityService.patchAccessorialRates
      (patchStairStepRate, component.stairStepModel, currencyPipe, component);
  });
});


