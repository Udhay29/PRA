import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { FuelCalculationDetailsService } from './service/fuel-calculation-details.service';
import { FuelCalculationDetailsUtility } from './service/fuel-calculation-details-utility';
import { FuelCalculationDetailsComponent } from './fuel-calculation-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { of, throwError } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { FuelCalculationModel } from './models/fuel-calculation.model';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { Table } from 'primeng/table';

import { ElementRef, ChangeDetectorRef } from '@angular/core';

describe('FuelCalculationDetailsComponent', () => {
  let component: FuelCalculationDetailsComponent;
  let fixture: ComponentFixture<FuelCalculationDetailsComponent>;
  let tablecomponent: Table;
  let tablefixture: ComponentFixture<Table>;
  let formGroup: FormGroup;
  const fb = new FormBuilder();
  let fuelCalculationDetailsService: FuelCalculationDetailsService;
  const fuelCalculationModel: FuelCalculationModel = new FuelCalculationModel;
  let broadCastService: BroadcasterService;
  const uploadTablearray = [{
    'fuelIncrementCalculationMethodConfigurationSetID': 10,
    'fuelIncrementCalculationMethodConfigurationID': 25,
    'fuelBeginAmount': '200',
    'fuelEndAmount': '200',
    'fuelSurchargeAmount': 'test',
    'isRemoved': true,
    'isModified': true,
    'fuelBeginAmountErrorMessage': 'test',
    'fuelEndAmountErrorMessage': 'test',
    'fuelSurchargeAmountErrorMessage': 'test',
    'id': 2
  }, {
    'fuelIncrementCalculationMethodConfigurationSetID': 20,
    'fuelIncrementCalculationMethodConfigurationID': 23,
    'fuelBeginAmount': '100',
    'fuelEndAmount': '100',
    'fuelSurchargeAmount': 'test1',
    'isRemoved': true,
    'isModified': true,
    'fuelBeginAmountErrorMessage': 'test1',
    'fuelEndAmountErrorMessage': 'test1',
    'fuelSurchargeAmountErrorMessage': 'test1',
    'id': 2
  }];
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [FuelCalculationDetailsService, BroadcasterService, { provide: APP_BASE_HREF, ElementRef, useValue: '/' },
      ]
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(FuelCalculationDetailsComponent);
    component = fixture.componentInstance;
    tablefixture = TestBed.createComponent(Table);
    tablecomponent = tablefixture.componentInstance;
    fuelCalculationDetailsService = fixture.debugElement.injector.get(FuelCalculationDetailsService);
    broadCastService = fixture.debugElement.injector.get(BroadcasterService);
    component.fuelCalculationModel.uploadTablearray = [{
      fuelIncrementCalculationMethodConfigurationSetID: 1,
      fuelIncrementCalculationMethodConfigurationID: 1,
      fuelBeginAmount: 'string',
      fuelEndAmount: 'string',
      fuelSurchargeAmount: 'string',
      isRemoved: true,
      isModified: true,
      fuelBeginAmountErrorMessage: 'string',
      fuelEndAmountErrorMessage: 'string',
      fuelSurchargeAmountErrorMessage: 'string',
      id: 1,
    }];

    component.fuelCalculationModel.FuelCalculationForm = fb.group({
      fuelcalculationdatetype: ['', Validators.required],
      chargetype: ['', Validators.required],
      roundingdigit: ['', Validators.required],
      calculationtype: ['', Validators.required],
      ratetype: ['', Validators.required],
      fueltype: ['', Validators.required],
      currency: ['', Validators.required],
      rollup: [''],
      draydiscount: [''],
      fuelmethod: ['']
    });

    component.fuelCalculationModel.FlatDetailsForm = fb.group({
      fuelsurchargeamount: ['', Validators.required]
    });
    component.fuelCalculationModel.FormulaDetailsForm = fb.group({
      fuelsurcharge: ['', Validators.required],
      incrementalcharge: ['', Validators.required],
      implementationprice: ['', Validators.required],
      incrementalinterval: ['', Validators.required],
      cap: ['', Validators.required]
    });

    component.fuelCalculationModel.ReferDetailsForm = fb.group({
      distanceunit: ['', Validators.required],
      fuelqtyunit: ['', Validators.required],
      implementprice: ['', Validators.required],
      burnrate: ['', Validators.required],
      distancehour: ['', Validators.required],
      distancerounding: ['', Validators.required],
      loadinghours: [''],
      servicehour: [''],
      addhours: [''],
      servicehourrounding: ['']
    });
    component.fuelCalculationModel.DistanceDetailsForm = fb.group({
      distance: ['', Validators.required],
      fuelqty: ['', Validators.required],
      distanceper: ['', Validators.required],
      incrementalprice: ['', Validators.required],
      addonamount: ['']
    });
    component.fuelCalculationModel.FlatDetailsForm.patchValue({
      fuelsurchargeamount: 10,
    });
    component.fuelCalculationModel.FormulaDetailsForm.patchValue({
      fuelsurcharge: 10,
      incrementalcharge: 20,
      implementationprice: 20,
      incrementalinterval: 10,
      cap: 5
    });
    fixture.detectChanges();
    component.uploadtable = tablecomponent;
  });
  const uploadTable = [{
    'fuelIncrementCalculationMethodConfigurationSetID': 10,
    'fuelIncrementCalculationMethodConfigurationID': 25,
    'fuelBeginAmount': 'test',
    'fuelEndAmount': 'test',
    'fuelSurchargeAmount': 'test',
    'isRemoved': true,
    'isModified': true,
    'fuelBeginAmountErrorMessage': 'test',
    'fuelEndAmountErrorMessage': 'test',
    'fuelSurchargeAmountErrorMessage': 'test',
    'id': 2
  }];
  const chargeTypeResponse = [{
    chargeTypeName: 'SUPINC',
    chargeTypeCode: 'SUPINC',
    chargeTypeID: 1
  }];

  const fuelConfigResponse = {
    'fuelCalculationTypes': [{
      'fuelCalculationTypeID': 1,
      'fuelCalculationTypeName': 'Internal'
    }, {
      'fuelCalculationTypeID': 2,
      'fuelCalculationTypeName': 'Breakthrough Fuel'
    }],
    'fuelRateTypes': [{
      'fuelRateTypeID': 3,
      'fuelRateTypeName': 'Flat'
    }, {
      'fuelRateTypeID': 2,
      'fuelRateTypeName': 'Per Distance'
    }, {
      'fuelRateTypeID': 1,
      'fuelRateTypeName': 'Percent Line Haul'
    }],
    'fuelCalculationDateTypes': [{
      'fuelCalculationDateTypeID': 1,
      'fuelCalculationDateTypeName': 'Order Creation'
    }, {
      'fuelCalculationDateTypeID': 2,
      'fuelCalculationDateTypeName': 'EDI Received'
    }, {
      'fuelCalculationDateTypeID': 3,
      'fuelCalculationDateTypeName': 'Scheduled Pickup'
    }, {
      'fuelCalculationDateTypeID': 4,
      'fuelCalculationDateTypeName': 'Actual Pickup'
    }, {
      'fuelCalculationDateTypeID': 5,
      'fuelCalculationDateTypeName': 'Delivery Appointment'
    }, {
      'fuelCalculationDateTypeID': 6,
      'fuelCalculationDateTypeName': 'Actual Delivery'
    }],
    'fuelRoundingDecimals': [{
      'fuelRoundingDecimalID': 1,
      'fuelRoundingDecimalNumber': 0
    }, {
      'fuelRoundingDecimalID': 2,
      'fuelRoundingDecimalNumber': 1
    }, {
      'fuelRoundingDecimalID': 3,
      'fuelRoundingDecimalNumber': 2
    }, {
      'fuelRoundingDecimalID': 4,
      'fuelRoundingDecimalNumber': 3
    }, {
      'fuelRoundingDecimalID': 5,
      'fuelRoundingDecimalNumber': 4
    }],
    'fuelTypes': [{
      'fuelTypeID': 1,
      'fuelTypeName': 'Diesel'
    }],
    'fuelDiscountTypes': [{
      'fuelDiscountTypeID': 1,
      'fuelDiscountTypeName': 'Origin'
    }, {
      'fuelDiscountTypeID': 2,
      'fuelDiscountTypeName': 'Destination'
    }, {
      'fuelDiscountTypeID': 3,
      'fuelDiscountTypeName': 'Origin and Destination'
    }],
    'fuelCalculationMethodTypes': [{
      'fuelCalculationMethodTypeID': 1,
      'fuelCalculationMethodTypeName': 'Flat'
    }, {
      'fuelCalculationMethodTypeID': 2,
      'fuelCalculationMethodTypeName': 'Formula'
    }, {
      'fuelCalculationMethodTypeID': 3,
      'fuelCalculationMethodTypeName': 'Increment'
    }, {
      'fuelCalculationMethodTypeID': 4,
      'fuelCalculationMethodTypeName': 'Refrigerated'
    }, {
      'fuelCalculationMethodTypeID': 5,
      'fuelCalculationMethodTypeName': 'Distance Per Fuel Quantity'
    }],
    'fuelRoundingTypes': [{
      'fuelRoundingTypeID': 1,
      'fuelRoundingTypeName': 'Down'
    }, {
      'fuelRoundingTypeID': 2,
      'fuelRoundingTypeName': 'Half Down'
    }, {
      'fuelRoundingTypeID': 3,
      'fuelRoundingTypeName': 'Half Up'
    }, {
      'fuelRoundingTypeID': 4,
      'fuelRoundingTypeName': 'Up'
    }]
  };

  const err = {
    'traceid': '343481659c77ad99',
    'errors': [{
      'fieldErrorFlag': false,
      'errorMessage': 'Failed to convert undefined into java.lang.Integer!',
      'errorType': 'System Runtime Error',
      'fieldName': null,
      'code': 'ServerRuntimeError',
      'errorSeverity': 'ERROR'
    }]
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    const aggrement: any = {
      'fuelProgramID': '123',
      'fuelProgramVersionID': '232',
      'agreementID': '134'
    };
    broadCastService.broadcast('agreementDetails', aggrement);
    component.ngOnInit();
  });

  it('should call formInitialization', () => {
    component.formInitialization();
  });
  it('should call onChangeReferDistanceUnit', () => {
    const event = {
      value: {
        unitOfLengthMeasurementCode: 'test'
      }
    };
    component.onChangeReferDistanceUnit(event);
  });
  it('should call onChangeReferFuelUnit', () => {
    const event = {
      value: {
        unitOfVolumeMeasurementCode: 'test'
      }
    };
    component.onChangeReferFuelUnit(event);
  });
  it('should call onChangeMpgDistanceUnit', () => {
    const event = {
      value: {
        unitOfLengthMeasurementCode: 'test'
      }
    };
    component.onChangeMpgDistanceUnit(event);
  });
  it('should call checkDecimalPrecision', () => {
    component.fuelCalculationModel.FuelCalculationForm.controls['fuelmethod'].setValue(component.fuelCalculationModel.selectedFormName);
    component.checkDecimalPrecision('100', 'fuelmethod', /^[0-9]{0,6}(\.[0-9]{0,4})?$/, component.fuelCalculationModel.FuelCalculationForm);
  });

  it('should call checkDecimalPrecision-IsNan', () => {
    component.fuelCalculationModel.FuelCalculationForm.controls['fuelmethod'].setValue(component.fuelCalculationModel.selectedFormName);
    component.checkDecimalPrecision('abc', 'fuelmethod', /^[0-9]{0,6}(\.[0-9]{0,4})?$/, component.fuelCalculationModel.FuelCalculationForm);
  });

  it('should call checkDecimalPrecision-wrong Amt pattern', () => {
    component.fuelCalculationModel.FuelCalculationForm.controls['fuelmethod'].setValue(component.fuelCalculationModel.selectedFormName);
    component.checkDecimalPrecision('10000000.78', 'fuelmethod', /^[0-9]{0,6}(\.[0-9]{0,4})?$/,
      component.fuelCalculationModel.FuelCalculationForm);
  });
  it('should call saveSubscription', () => {
    broadCastService.broadcast('loseChanges', true);
    component.saveSubscription();
  });

  it('should call onButtonSelected', () => {
    component.fuelCalculationModel.selectedFormName = 'Formula';
    component.fuelCalculationModel.flatFuelName = 'Flat';
    component.onButtonSelected('test');
  });
  it('should call getChargeTypeData', () => {
    spyOn(fuelCalculationDetailsService, 'getChargeTypeList').and.returnValues(of(chargeTypeResponse));
    component.getChargeTypeData();
  });
  it('should call getChargeTypeData For Error Response', () => {
    spyOn(fuelCalculationDetailsService, 'getChargeTypeList').and.returnValues(throwError(err));
    component.getChargeTypeData();
  });

  it('should call populateDropdownValues', () => {
    spyOn(fuelCalculationDetailsService, 'getFuelConfigurations').and.returnValues(of(fuelConfigResponse));
    spyOn(fuelCalculationDetailsService, 'getCurrencyDropdown').and.returnValues(of(['CAD', 'USD']));
    spyOn(fuelCalculationDetailsService, 'getCurrencyDetails').and.returnValues(of([{
      'currency': 'USD',
      'sectionLevelFuelProgram': false
    }]));
    spyOn(fuelCalculationDetailsService, 'getLengthMeasurement').and.returnValues(of([{
      'unitOfLengthMeasurementCode': 'Kilometers',
      'pricingFunctionalAreaID': 7
    }, {
      'unitOfLengthMeasurementCode': 'Miles',
      'pricingFunctionalAreaID': 7
    }]));
    spyOn(fuelCalculationDetailsService, 'getVolumeMeasurement').and.returnValues(of([{
      'unitOfVolumeMeasurementCode': 'Gallons',
      'pricingFunctionalAreaID': 7
    }, {
      'unitOfVolumeMeasurementCode': 'Liters',
      'pricingFunctionalAreaID': 7
    }]));
    spyOn(fuelCalculationDetailsService, 'getChargeTypeList').and.returnValues(of(chargeTypeResponse));
    component.populateDropdownValues();
  });

  it('should call populateDropdownValues For Error Response', () => {
    spyOn(fuelCalculationDetailsService, 'getChargeTypeList').and.returnValues(throwError(err));
    component.populateDropdownValues();
  });

  it('should call currencyFetch', () => {
    const response = {
      sectionLevelFuelProgram: true,
      currency: '123'
    };
    spyOn(fuelCalculationDetailsService, 'getCurrencyDetails').and.returnValue(of(response));
    component.currencyFetch(1, 1);
  });
  it('should call populateDropdownValues getCurrencyDropdown For Error Response', () => {
    spyOn(fuelCalculationDetailsService, 'getCurrencyDropdown').and.returnValues(throwError(err));
    component.populateDropdownValues();
  });
  it('should call populateDropdownValues getFuelConfigurations For Error Response', () => {
    spyOn(fuelCalculationDetailsService, 'getFuelConfigurations').and.returnValues(throwError(err));
    component.populateDropdownValues();
  });
  it('should call populateChargeType', () => {
    const element = fixture.debugElement.query(By.css('[formControlName="chargetype"]'));
    component.fuelCalculationModel.chargeList = [{
      'label': 'ADMIN', 'value':
        { 'chargeTypeCode': 'Administration Fee(ADMIN)', 'chargeTypeID': 64, 'chargeTypeName': 'Administration Fee' }
    }];
    element.triggerEventHandler('completeMethod', { query: 'ADMIN' });
    fixture.detectChanges();
  });

  it('should call validateCurrency If Condition', () => {
    component.validateCurrency('100', component.fuelCalculationModel.FuelCalculationForm, 'currency');
  });

  it('should call validateCurrency Amount Condition', () => {
    component.fuelCalculationModel.FuelCalculationForm.controls.currency.setValue('abc');
    component.validateCurrency('abc', component.fuelCalculationModel.FuelCalculationForm, 'currency');
  });

  it('should call validateCurrency Else Condition', () => {
    component.fuelCalculationModel.FuelCalculationForm.controls.currency.setErrors({ 'error': true });
    component.validateCurrency('100', component.fuelCalculationModel.FuelCalculationForm, 'currency');
  });
  it('should call onChangeRateType', () => {
    component.onChangeRateType();
  });
  it('should call onChangeFuelType', () => {
    component.onChangeFuelType();
  });

  it('should call onChangeCurrencyType', () => {
    component.onChangeCurrencyType();
  });
  it('should call defaultValueforDistanceFuelForm', () => {
    const disObj: any = [{
      'label': 'Kilometers', 'value': {
        'unitOfLengthMeasurementCode': 'Kilometers',
        'pricingFunctionalAreaID': 7
      }
    }, {
      'label': 'Miles', 'value': {
        'unitOfLengthMeasurementCode': 'Miles',
        'pricingFunctionalAreaID': 7
      }
    }];
    const fuelObj: any = [{
      'label': 'Gallons', 'value': {
        'unitOfVolumeMeasurementCode': 'Gallons',
        'pricingFunctionalAreaID': 7
      }
    }, {
      'label': 'Liters', 'value': {
        'unitOfVolumeMeasurementCode': 'Liters',
        'pricingFunctionalAreaID': 7
      }
    }];
    component.fuelCalculationModel.referDistanceList = disObj;
    component.fuelCalculationModel.referFuelUnitList = fuelObj;
    component.defaultValueforDistanceFuelForm();
  });

  it('should call handleError', () => {
    const error: any = {
      'traceid': 'e512661ba4e5ee4b',
      'error': {
        'errors': [{
          'errorMessage': 'Cargo Release specified cannot be less than default Cargo Release value',
          'fieldErrorFlag': false,
          'errorType': 'Business Validation Error',
          'fieldName': null,
          'code': 'CARGO_VALUE_LESS_THAN_DEFAULT_VALUE',
          'errorSeverity': 'ERROR'
        }]
      }
    };
    component.handleError(error);
  });

  it('should call defaultValueforFormulaForm', () => {
    component.defaultValueforFormulaForm();
  });

  it('should call sortUploadedData', () => {
    component.fuelCalculationModel.uploadTablearray = uploadTablearray;
    component.fuelCalculationModel.selectedFormName = 'Increment';
    component.sortUploadedData();
  });

  xit('should call onClickNext', () => {
    const obj: any = fuelConfigResponse;
    component.fuelCalculationModel.fuelcalculationDropdownList = obj;
    component.fuelCalculationModel.FuelCalculationForm.controls['fuelcalculationdatetype'].setValue({
      'fuelCalculationDateTypeID': 1,
      'fuelCalculationDateTypeName': 'Order Creation'
    });
    component.fuelCalculationModel.FuelCalculationForm.controls['chargetype'].setValue({
      'label': 'Fuel Surcharge (SUPINC)',
      'value': {
        'chargeTypeCode': 'SUPINC',
        'chargeTypeID': 1,
        'chargeTypeName': 'Fuel Surcharge'
      }
    });
    component.fuelCalculationModel.FuelCalculationForm.controls['roundingdigit'].setValue({
      'fuelRoundingDecimalID': 4,
      'fuelRoundingDecimalNumber': 3
    });
    component.fuelCalculationModel.FuelCalculationForm.controls['calculationtype'].setValue({
      'fuelCalculationTypeID': 1,
      'fuelCalculationTypeName': 'Internal'
    });
    component.fuelCalculationModel.FuelCalculationForm.controls['ratetype'].setValue({
      'fuelRateTypeID': 2,
      'fuelRateTypeName': 'Per Distance'
    });
    component.fuelCalculationModel.FuelCalculationForm.controls['fueltype'].setValue({
      'fuelTypeID': 1,
      'fuelTypeName': 'Diesel'
    });
    component.fuelCalculationModel.FuelCalculationForm.controls['currency'].setValue('USD');
    component.fuelCalculationModel.FuelCalculationForm.controls['fuelmethod'].setValue('Formula');

    component.fuelCalculationModel.FormulaDetailsForm.controls['fuelsurcharge'].setValue('1');
    component.fuelCalculationModel.FormulaDetailsForm.controls['incrementalcharge'].setValue('2');
    component.fuelCalculationModel.FormulaDetailsForm.controls['implementationprice'].setValue('3');
    component.fuelCalculationModel.FormulaDetailsForm.controls['incrementalinterval'].setValue('4');
    component.fuelCalculationModel.FormulaDetailsForm.controls['cap'].setValue('5');
    component.fuelCalculationModel.validationFlag = false;
    fixture.detectChanges();
    const response: any = {
      'fuelCalculationID': null,
      'fuelCurrencyCode': null,
      'chargeType': null,
      'fuelCalculationType': null,
      'fuelRateType': null,
      'fuelCalculationDateType': null,
      'fuelRoundingDecimal': null,
      'fuelType': null,
      'fuelDiscountType': null,
      'fuelCalculationMethodType': null,
      'flatConfiguration': null,
      'formulaConfiguration': null,
      'reeferConfiguration': null,
      'distancePerFuelQuantityConfiguration': null,
      'rollUpIndicator': null,
      'fuelIncrementalPriceDTOs': null
    };
    spyOn(fuelCalculationDetailsService, 'saveCalculationDetails').and.returnValue(of(response));
    component.onClickNext();
  });

  xit('should call onClickNext', () => {
    component.fuelCalculationModel.validationFlag = false;
    component.onClickNext();
  });

  it('should call frameSaveRequestfuel', () => {
    const obj: any = fuelConfigResponse;
    component.fuelCalculationModel.fuelcalculationDropdownList = obj;
    component.fuelCalculationModel.FormulaDetailsForm.controls['fuelsurcharge'].setValue('1');
    component.fuelCalculationModel.FormulaDetailsForm.controls['incrementalcharge'].setValue('2');
    component.fuelCalculationModel.FormulaDetailsForm.controls['implementationprice'].setValue('3');
    component.fuelCalculationModel.FormulaDetailsForm.controls['incrementalinterval'].setValue('4');
    component.fuelCalculationModel.FormulaDetailsForm.controls['cap'].setValue('5');
    component.frameSaveRequestfuel('Formula');
  });

  it('should call onChangeFuelCalculationDateType', () => {
    component.onChangeFuelCalculationDateType();
  });

  it('should call onClickYes', () => {
    component.onClickYes();
  });

  it('should call onFocus', () => {
    formGroup = fb.group({
      fuelcalculationdatetype: ['', Validators.required],
      chargetype: ['', Validators.required],
      roundingdigit: ['', Validators.required],
      calculationtype: ['', Validators.required],
      ratetype: ['', Validators.required],
      fueltype: ['', Validators.required],
      currency: ['', Validators.required],
      rollup: [''],
      draydiscount: [''],
      fuelmethod: ['']
    });
    component.onFocus('string', formGroup, 'fuelmethod');
    const enteredFuelAmount = component.fuelCalculationModel.formValidateName.get('fuelmethod');
    enteredFuelAmount.setValue('100');
  });
  it('should call currencyPipeValidation', () => {
    component['currencyPipeValidation'](10, '10');
  });
  it('should call currencyPipeValidation-else', () => {
    component['currencyPipeValidation'](0, '10');
  });
  it('should call customSort', () => {
    const event = {
      data: [],
      mode: 'string',
      field: 'string',
      order: 1,
      multiSortMeta: [{
        field: 'string',
        order: 1
      }]
    };
    FuelCalculationDetailsUtility.customSort(event);
    component.customSort(event);
  });
  it('should call onChangeDrayDiscount', () => {
    const element = fixture.debugElement.query(By.css('[name="draydiscount"]'));
    element.triggerEventHandler('onChange', { 'value': 'test' });
  });
  it('should call onChangeRollUp', () => {
    const event = true;
    component.onChangeRollUp(event);
  });
  it('should call saveRequestforFormulaFuel', () => {
    component.fuelCalculationModel.formulaCalculationData = {
      formulaConfigurationID: 1,
      fuelSurchargeFactorAmount: 1,
      incrementChargeAmount: 1,
      incrementIntervalAmount: 1,
      implementationAmount: 1,
      capAmount: 1,
    };
    component.saveRequestforFormulaFuel();
    component.saveRequestforReferFuel();
    component.saveRequestforMpgFuel();
  });

  it('should call setMandatoryValidation-Flat', () => {
    component.fuelCalculationModel.flatFuelName = 'Flat';
    component.setMandatoryValidation('Flat');
  });

  it('should call setMandatoryValidation-Formula', () => {
    component.fuelCalculationModel.formulaFuelName = 'Formula';
    component.setMandatoryValidation('Formula');
  });

  it('should call setMandatoryValidation-Refrigerated', () => {
    component.fuelCalculationModel.refrigeratedFuelName = 'Refrigerated';
    component.setMandatoryValidation('Refrigerated');
  });

  it('should call setMandatoryValidation-Distance', () => {
    component.fuelCalculationModel.distanceFuelName = 'Distance Per Fuel Quantity';
    component.setMandatoryValidation('Distance Per Fuel Quantity');
  });

  it('should call resetForm-Flat', () => {
    component.fuelCalculationModel.flatFuelName = 'Flat';
    component.resetForm('Flat');
  });

  it('should call resetForm-Refrigerated', () => {
    component.fuelCalculationModel.refrigeratedFuelName = 'Refrigerated';
    component.resetForm('Refrigerated');
  });

  it('should call resetForm-Distance', () => {
    component.fuelCalculationModel.distanceFuelName = 'Distance Per Fuel Quantity';
    component.resetForm('Distance Per Fuel Quantity');
  });

  it('should call defaultValueforReferForm', () => {
    const disObj: any = [{
      'label': 'Kilometers', 'value': {
        'unitOfLengthMeasurementCode': 'Kilometers',
        'pricingFunctionalAreaID': 7
      }
    }, {
      'label': 'Miles', 'value': {
        'unitOfLengthMeasurementCode': 'Miles',
        'pricingFunctionalAreaID': 7
      }
    }];
    const fuelObj: any = [{
      'label': 'Gallons', 'value': {
        'unitOfVolumeMeasurementCode': 'Gallons',
        'pricingFunctionalAreaID': 7
      }
    }, {
      'label': 'Liters', 'value': {
        'unitOfVolumeMeasurementCode': 'Liters',
        'pricingFunctionalAreaID': 7
      }
    }];
    component.fuelCalculationModel.referDistanceList = disObj;
    component.fuelCalculationModel.referFuelUnitList = fuelObj;
    component.defaultValueforReferForm();
  });

  it('should call onSelectChargeType', () => {
    component.fuelCalculationModel.FuelCalculationForm.controls['chargetype'].setValue('test');
    component.onSelectChargeType(event);
    component.onClearDropDown();
  });
  it('should call onChangeRoundingDigit', () => {
    component.fuelCalculationModel.FuelCalculationForm.controls['roundingdigit'].setValue('test');
    component.onChangeRoundingDigit();
    component.fuelCalculationModel.FuelCalculationForm.controls['calculationtype'].setValue({
      'fuelCalculationTypeName': 'breakthrough fuel'
    });
    component.onChangeCalculationType();
    component.onChangeRateType();
    component.onChangeFuelType();
    component.onChangeCurrencyType();
  });
  it('should call getFormDirtyCheck', () => {
    component.fuelCalculationModel.flatFuelName = 'test';
    component.getFormDirtyCheck('test');
  });
  it('should call getFormDirtyCheck', () => {
    component.fuelCalculationModel.flatFuelName = 'test';
    component.fuelCalculationModel.formulaFuelName = 'test1';
    component.getFormDirtyCheck('test1');
  });
  it('should call getFormDirtyCheck', () => {
    component.fuelCalculationModel.flatFuelName = 'test';
    component.fuelCalculationModel.formulaFuelName = 'test1';
    component.fuelCalculationModel.refrigeratedFuelName = 'test2';
    component.getFormDirtyCheck('test2');
  });
  it('should call getFormDirtyCheck', () => {
    component.fuelCalculationModel.flatFuelName = 'test';
    component.fuelCalculationModel.formulaFuelName = 'test1';
    component.fuelCalculationModel.refrigeratedFuelName = 'test2';
    component.fuelCalculationModel.distanceFuelName = 'test3';
    component.getFormDirtyCheck('test3');
  });
  it('should call getFormDirtyCheck', () => {
    component.fuelCalculationModel.flatFuelName = 'test';
    component.fuelCalculationModel.formulaFuelName = 'test1';
    component.fuelCalculationModel.refrigeratedFuelName = 'test2';
    component.fuelCalculationModel.distanceFuelName = 'test3';
    component.fuelCalculationModel.uploadForm = 'test4';
    component.getFormDirtyCheck('test4');
  });
  it('should call populateChargeType', () => {
    component.fuelCalculationModel.chargeList = [{
      label: 'test',
      value: {
        chargeTypeName: 'test',
        chargeTypeCode: 'test',
        chargeTypeID: 1
      }
    }];
    const element = fixture.debugElement.query(By.css('[formControlName="chargetype"]'));
    element.triggerEventHandler('completeMethod', { 'query': 'a' });
    component.setSearchDataForChargeType();
  });
  it('should call onClickNo', () => {
    component.onClickNo();
  });
  it('should call onClickCancel', () => {
    component.fuelCalculationModel.agreementId = 20;
    component.onClickCancel();
  });
  it('should call omitSpecialChar', () => {
    const event = { charCode: 46 };
    component.omitSpecialChar(event);
  });
  it('should call onClickDeselect', () => {
    component.onClickDeselect();
  });
  it('should call clearErrors', () => {
    FuelCalculationDetailsUtility.checkGapDupliates(fuelCalculationModel);
    component.clearErrors();
  });

  it('should call addNewRow', () => {
    component.uploadtable._selection = [{
      'fuelBeginAmount': '1.010', 'fuelEndAmount': '1.015', 'fuelSurchargeAmount':
        '1.945', 'beginDecimalAmount': 1.01, 'id': 2
    }];
    component.addNewRow();
  });
  it('should call addNewRow-Else', () => {
    component.uploadtable._selection = [{
      'fuelBeginAmount': '1.010', 'fuelEndAmount': '1.015', 'fuelSurchargeAmount':
        '1.945', 'beginDecimalAmount': 1.01, 'id': 2
    }, {
      'fuelBeginAmount': '1.006', 'fuelEndAmount': '1.009',
      'fuelSurchargeAmount': '1.087', 'beginDecimalAmount': 1.006, 'id': 1
    }, {
      'fuelBeginAmount': '1.005',
      'fuelEndAmount': '1.007', 'fuelSurchargeAmount': '0.067', 'beginDecimalAmount': 1.005, 'id': 0
    }];
    component.addNewRow();
  });

  it('should call onClickHeaderCheckbox', () => {
    component.onClickHeaderCheckbox(event);
  });
  it('should call selectedListRow', () => {
    FuelCalculationDetailsUtility.getSelectedListRows(fuelCalculationModel);
    component.selectedListRow(event);
  });
  it('should call checkCharge', () => {
    FuelCalculationDetailsUtility.checkChargeValue(0, component.fuelCalculationModel);
    component.checkCharge(0);
  });
  it('should call checkOverlap', () => {
    component.fuelCalculationModel.FuelCalculationForm.controls['roundingdigit'].setValue({
      'fuelRoundingDecimalID': 4,
      'fuelRoundingDecimalNumber': 3
    });
    component.fuelCalculationModel.uploadTablearray = uploadTablearray;
    component.checkOverlap(0, 'fuelEndAmount');
  });
  it('should call checkOverlapSiblings', () => {
    component.fuelCalculationModel.FuelCalculationForm.controls['roundingdigit'].setValue({
      'fuelRoundingDecimalID': 4,
      'fuelRoundingDecimalNumber': 3
    });
    component.fuelCalculationModel.uploadTablearray = uploadTablearray;
    component.checkOverlapSiblings(1, 'fuelBeginAmount');
  });
  it('should call checkGapAndDuplicates', () => {
    component.fuelCalculationModel.FuelCalculationForm.controls['roundingdigit'].setValue({
      'fuelRoundingDecimalID': 4,
      'fuelRoundingDecimalNumber': 3
    });
    component.fuelCalculationModel.uploadTablearray = uploadTablearray;
    component.checkGapAndDuplicates();
  });
  it('should call roundingDigit', () => {
    FuelCalculationDetailsUtility.fourDecimalprecision(1, component.fuelCalculationModel, 0);
    component.roundingDigit();
  });
  it('should call clickNo', () => {
    component.clickNo();
  });
  it('should call clickYes', () => {
    component.clickYes();
  });
  it('should call uploadPopup', () => {
    component.uploadPopup();
  });
  it('should call uploadPopup-else', () => {
    component.fuelCalculationModel.uploadTablearray = [];
    component.uploadPopup();
  });
  it('should call getFormStatus', () => {
    component.fuelCalculationModel.flatFuelName = 'test';
    component.getFormStatus('test');
  });
  it('should call getFormStatus', () => {
    component.fuelCalculationModel.formulaFuelName = 'test1';
    component.getFormStatus('test1');
  });
  it('should call getFormStatus', () => {
    component.fuelCalculationModel.refrigeratedFuelName = 'test2';
    component.getFormStatus('test2');
  });
  it('should call getFormStatus', () => {
    component.fuelCalculationModel.distanceFuelName = 'test3';
    component.getFormStatus('test3');
  });
  it('should call getFormStatus', () => {
    component.fuelCalculationModel.uploadForm = 'test4';
    component.getFormStatus('test4');
  });
  it('should call onFilesUpload', () => {
    const event = { files: [{ name: 'abc' }] };
    component.onFilesUpload(event);
  });
  it('should call navigationSubscription-Flat', () => {
    component.fuelCalculationModel.selectedFormName = 'Flat';
    component.fuelCalculationModel.flatFuelName = 'Flat';
    fixture.detectChanges();
    broadCastService.broadcast('navigationStarts', 'Flat');
    component.navigationSubscription();
  });
  it('should call navigationSubscription-Formula', () => {

    component.fuelCalculationModel.selectedFormName = 'Formula';
    component.fuelCalculationModel.formulaFuelName = 'Formula';
    fixture.detectChanges();
    broadCastService.broadcast('navigationStarts', 'Formula');
    component.navigationSubscription();
  });
  it('should call navigationSubscription-Refrigerated', () => {

    component.fuelCalculationModel.flatFuelName = '';
    component.fuelCalculationModel.selectedFormName = 'Refrigerated';
    component.fuelCalculationModel.refrigeratedFuelName = 'Refrigerated';
    fixture.detectChanges();
    broadCastService.broadcast('navigationStarts', 'Refrigerated');
    component.navigationSubscription();
  });
  it('should call navigationSubscription-Distance', () => {

    component.fuelCalculationModel.flatFuelName = '';
    component.fuelCalculationModel.selectedFormName = 'Distance Per Fuel Quantity';
    component.fuelCalculationModel.distanceFuelName = 'Distance Per Fuel Quantity';
    fixture.detectChanges();
    broadCastService.broadcast('navigationStarts', 'Distance Per Fuel Quantity');
    component.navigationSubscription();
  });
  it('should call navigationSubscription-Increment', () => {
    component.fuelCalculationModel.flatFuelName = '';
    component.fuelCalculationModel.refrigeratedFuelName = '';
    component.fuelCalculationModel.selectedFormName = 'Increment';
    fixture.detectChanges();
    broadCastService.broadcast('navigationStarts', 'Increment');
    component.navigationSubscription();
  });

  it('should call validateReeferCurrency IF Condition', () => {
    component.fuelCalculationModel.FuelCalculationForm.controls.currency.setErrors({ 'error': true });
    component.validateReeferCurrency('100', component.fuelCalculationModel.FuelCalculationForm, 'currency');
  });
  it('should call validateReeferCurrency IF-Else Condition', () => {
    component.fuelCalculationModel.FuelCalculationForm.controls.currency.setErrors({ 'error': true });
    component.validateReeferCurrency('1a', component.fuelCalculationModel.FuelCalculationForm, 'currency');
  });
  it('should call validateReeferCurrency Else Condition', () => {
    component.fuelCalculationModel.FuelCalculationForm.controls.currency.setErrors({ 'error': true });
    component.validateReeferCurrency(',', component.fuelCalculationModel.FuelCalculationForm, 'currency');
  });

  it('should call onChangeDistRounding', () => {
    const event: any = { 'value': 'close' };
    const evtNeg = new CustomEvent('onChangeDistRounding', event);
    component.onChangeDistRounding(evtNeg, 'distancerounding');
  });

  it('should call onButtonSeIlected For IF Condition', () => {
    component.fuelCalculationModel.selectedFormName = 'Flat';
    component.getFormDirtyCheck('Flat');
    component.onButtonSelected('Flat');
  });
  it('should call onButtonSeIlected For Else Condition', () => {
    component.fuelCalculationModel.selectedFormName = 'Flat';
    component.onButtonSelected('Formula');
  });
  it('should call ngDoCheck For ELSE Condition', () => {
    component.fuelCalculationModel.tableFlag = false;
    component.ngDoCheck();
  });
  it('should call saveRequestforFlatFuel', () => {
    component.saveRequestforFlatFuel();
  });
  it('should call checkRollUp If', () => {
    component.fuelCalculationModel.FuelCalculationForm.controls['calculationtype'].setValue({
      'fuelCalculationTypeName': 'breakthrough fuel'
    });
    component.checkRollUp();
  });

  it('should call checkRollUp Else', () => {
    component.fuelCalculationModel.FuelCalculationForm.controls['calculationtype'].setValue({
      'fuelCalculationTypeName': 'Internal'
    });
    component.checkRollUp();
    it('should call removeCharge', () => {
      const selectedList = [{
        'fuelIncrementCalculationMethodConfigurationSetID': 10,
        'fuelIncrementCalculationMethodConfigurationID': 25,
        'fuelBeginAmount': 'test',
        'fuelEndAmount': 'test',
        'fuelSurchargeAmount': 'test',
        'isRemoved': true,
        'isModified': true,
        'fuelBeginAmountErrorMessage': 'test',
        'fuelEndAmountErrorMessage': 'test',
        'fuelSurchargeAmountErrorMessage': 'test',
        'id': 2
      }];
      tablecomponent.sortOrder = 0;
      tablecomponent.sortField = '';
      component.clearErrors();
      component.removeCharge(selectedList);
    });
  });
  it('should call selectFormName in utility', () => {
    FuelCalculationDetailsUtility.selectFormName('Flat', component);
  });
  it('should call selectFormName in utility', () => {
    FuelCalculationDetailsUtility.selectFormName('Formula', component);
  });
  it('should call selectFormName in utility', () => {
    FuelCalculationDetailsUtility.selectFormName('Refrigerated', component);
  });
  it('should call selectFormName in utility', () => {
    FuelCalculationDetailsUtility.selectFormName('Distance Per Fuel Quantity', component);
  });
  it('should call selectFormName in utility', () => {
    FuelCalculationDetailsUtility.selectFormName('Increment', component);
  });
  it('should call selectFormName in utility', () => {
    FuelCalculationDetailsUtility.selectFormName('test', component);
  });
  it('should call checkAndPushGaps in utility', () => {
    FuelCalculationDetailsUtility.checkAndPushGaps(12, 'string', component.fuelCalculationModel, 'fuelBeginAmount', true);
  });
  it('should call checkAndPushGaps in utility', () => {
    FuelCalculationDetailsUtility.checkAndPushGaps(12, 'overlaps', component.fuelCalculationModel, 'fuelBeginAmount', true);
  });
  it('should call checkAndPushGaps in utility', () => {
    FuelCalculationDetailsUtility.checkAndPushGaps(12, 'gaps', component.fuelCalculationModel, 'fuelBeginAmount', true);
  });
  it('should call checkAndPushGaps in utility', () => {
    FuelCalculationDetailsUtility.checkAndPushGaps(12, 'gaps', component.fuelCalculationModel, 'fuelBegin', true);
  });
  it('should call checkAndPushGaps in utility', () => {
    FuelCalculationDetailsUtility.checkAndPushGaps(12, 'invalidRanges', component.fuelCalculationModel, 'fuelBeginAmount', true);
  });
  it('should call checkAndPushGaps in utility', () => {
    FuelCalculationDetailsUtility.checkAndPushGaps(12, 'invalidCharges', component.fuelCalculationModel, 'fuelBeginAmount', true);
  });
  it('should call checkAndPushGaps in utility', () => {
    FuelCalculationDetailsUtility.checkAndPushGaps(12, 'emptyChargeAmount', component.fuelCalculationModel, 'fuelBeginAmount', true);
  });
  it('should call checkAndPushGaps in utility', () => {
    component.fuelCalculationModel.invalidRanges = [123];
    FuelCalculationDetailsUtility.checkAndPushGaps(12, 'emptyBeginAmount', component.fuelCalculationModel, 'fuelBeginAmount', true);
  });
  it('should call checkAndPushGaps in utility', () => {
    FuelCalculationDetailsUtility.checkAndPushGaps(12, 'emptyEndAmount', component.fuelCalculationModel, 'fuelBeginAmount', true);
  });
  it('should call capValidation in utility', () => {
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
    ChangeDetectorRef
    );
    component.fuelCalculationModel.FormulaDetailsForm = fb.group({
      fuelsurcharge: ['qwe', Validators.required],
      incrementalcharge: ['qwe', Validators.required],
      implementationprice: ['qwe', Validators.required],
      incrementalinterval: ['qwe', Validators.required],
      cap: ['qwe', Validators.required]
    });
    component.fuelCalculationModel.FormulaDetailsForm.controls['cap'].setValue('True');
    FuelCalculationDetailsUtility.capValidation(component.fuelCalculationModel, changeDetectorRefStub);
  });
  it('should call onClickToastMsg in utility', () => {
    component.fuelCalculationModel.selectedFormName = 'Increment';
    component.fuelCalculationModel.uploadTablearray = [{
      id: 12
    }];
    FuelCalculationDetailsUtility.onClickToastMsg(component.fuelCalculationModel);
  });
  it('should call checkGapOrDuplicate in utility no overlap', () => {
    component.fuelCalculationModel.uploadTablearray = [{
      fuelIncrementCalculationMethodConfigurationSetID: 123,
      fuelIncrementCalculationMethodConfigurationID: 123,
      fuelBeginAmount: '123',
      fuelEndAmount: '123',
      fuelSurchargeAmount: '123',
      isRemoved: true,
      isModified: true,
      fuelBeginAmountErrorMessage: 'string',
      fuelEndAmountErrorMessage: 'string',
      fuelSurchargeAmountErrorMessage: 'string',
      id: 123
    },
    {
      fuelIncrementCalculationMethodConfigurationSetID: 123,
      fuelIncrementCalculationMethodConfigurationID: 123,
      fuelBeginAmount: '123',
      fuelEndAmount: '123',
      fuelSurchargeAmount: '123',
      isRemoved: true,
      isModified: true,
      fuelBeginAmountErrorMessage: 'string',
      fuelEndAmountErrorMessage: 'string',
      fuelSurchargeAmountErrorMessage: 'string',
      id: 123
    }];
    FuelCalculationDetailsUtility.checkGapOrDuplicate(1, component.fuelCalculationModel);
  });
  it('should call checkGapOrDuplicate in utility with overlap', () => {
    component.fuelCalculationModel.uploadTablearray = [{
      fuelIncrementCalculationMethodConfigurationSetID: 123,
      fuelIncrementCalculationMethodConfigurationID: 123,
      fuelBeginAmount: '123',
      fuelEndAmount: '124',
      fuelSurchargeAmount: '123',
      isRemoved: true,
      isModified: true,
      fuelBeginAmountErrorMessage: 'string',
      fuelEndAmountErrorMessage: 'string',
      fuelSurchargeAmountErrorMessage: 'string',
      id: 123
    },
    {
      fuelIncrementCalculationMethodConfigurationSetID: 123,
      fuelIncrementCalculationMethodConfigurationID: 123,
      fuelBeginAmount: '123',
      fuelEndAmount: '123',
      fuelSurchargeAmount: '123',
      isRemoved: true,
      isModified: true,
      fuelBeginAmountErrorMessage: 'string',
      fuelEndAmountErrorMessage: 'string',
      fuelSurchargeAmountErrorMessage: 'string',
      id: 123
    }];
    FuelCalculationDetailsUtility.checkGapOrDuplicate(1, component.fuelCalculationModel);
  });
  it('should call checkGapOrDuplicate in utility', () => {
    component.fuelCalculationModel.uploadTablearray = [];
    FuelCalculationDetailsUtility.checkGapOrDuplicate(0, component.fuelCalculationModel);
  });
  it('should call spliceIndex in utility', () => {
    component.fuelCalculationModel.invalidRanges = [123, 234, 1222];
    component.fuelCalculationModel.overlaps = [123, 234, 1233];
    FuelCalculationDetailsUtility.spliceIndex(0, component.fuelCalculationModel, ['invalidRanges', 'overlaps']);
  });
  it('should call spliceIndex in utility else', () => {
    component.fuelCalculationModel.invalidRanges = [-10];
    component.fuelCalculationModel.overlaps = [-20];
    FuelCalculationDetailsUtility.spliceIndex(0, component.fuelCalculationModel, ['invalidRanges', 'overlaps']);
  });
  it('should call saveSubscriptionUtility in utility', () => {
    FuelCalculationDetailsUtility.FuelCalculationForm(fb);
    component.fuelCalculationModel.FuelCalculationForm.markAsDirty();
    component.fuelCalculationModel.flatFuelName = 'a';
    component.fuelCalculationModel.formulaFuelName = 'b';
    component.fuelCalculationModel.refrigeratedFuelName = 'c';
    component.fuelCalculationModel.distanceFuelName = 'd';
    component.fuelCalculationModel.selectedFormName = 'a';
    FuelCalculationDetailsUtility.saveSubscriptionUtility(component.fuelCalculationModel);
  });
  it('should call saveSubscriptionUtility in utility', () => {
    FuelCalculationDetailsUtility.FuelCalculationForm(fb);
    component.fuelCalculationModel.FuelCalculationForm.markAsDirty();
    component.fuelCalculationModel.flatFuelName = 'a';
    component.fuelCalculationModel.formulaFuelName = 'b';
    component.fuelCalculationModel.refrigeratedFuelName = 'c';
    component.fuelCalculationModel.distanceFuelName = 'd';
    component.fuelCalculationModel.selectedFormName = 'b';
    FuelCalculationDetailsUtility.saveSubscriptionUtility(component.fuelCalculationModel);
  });
  it('should call saveSubscriptionUtility in utility', () => {
    FuelCalculationDetailsUtility.FuelCalculationForm(fb);
    component.fuelCalculationModel.FuelCalculationForm.markAsDirty();
    component.fuelCalculationModel.flatFuelName = 'a';
    component.fuelCalculationModel.formulaFuelName = 'b';
    component.fuelCalculationModel.refrigeratedFuelName = 'c';
    component.fuelCalculationModel.distanceFuelName = 'd';
    component.fuelCalculationModel.selectedFormName = 'c';
    FuelCalculationDetailsUtility.saveSubscriptionUtility(component.fuelCalculationModel);
  });
  it('should call saveSubscriptionUtility in utility', () => {
    FuelCalculationDetailsUtility.FuelCalculationForm(fb);
    component.fuelCalculationModel.FuelCalculationForm.markAsDirty();
    component.fuelCalculationModel.flatFuelName = 'a';
    component.fuelCalculationModel.formulaFuelName = 'b';
    component.fuelCalculationModel.refrigeratedFuelName = 'c';
    component.fuelCalculationModel.distanceFuelName = 'd';
    component.fuelCalculationModel.selectedFormName = 'd';
    FuelCalculationDetailsUtility.saveSubscriptionUtility(component.fuelCalculationModel);
  });
  xit('should call checkHeight in utility', () => {
    component.fuelCalculationModel.uploadTablearray = [];
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
      );
      const elref: ElementRef = fixture.debugElement.injector.get(
        ElementRef
        );
    FuelCalculationDetailsUtility.checkHeight(elref, component.fuelCalculationModel,  changeDetectorRefStub);
  });
  it('should call spliceIndex in utility', () => {
    FuelCalculationDetailsUtility.checkValidations(0, component.fuelCalculationModel, 'fuelBeginAmount');
  });
  it('should call spliceIndex in utility without range', () => {
    FuelCalculationDetailsUtility.checkValidations(0, component.fuelCalculationModel);
  });
  it('should call isNumberCheck in utility', () => {
    const uploadDataList = [{
      fuelIncrementCalculationMethodConfigurationSetID: 123,
      fuelIncrementCalculationMethodConfigurationID: 123,
      fuelBeginAmount: '234',
      fuelEndAmount: '234',
      fuelSurchargeAmount: '234',
      isRemoved: true,
      isModified: true,
      fuelBeginAmountErrorMessage: 'string',
      fuelEndAmountErrorMessage: 'string',
      fuelSurchargeAmountErrorMessage: 'string',
      id: 123
    }];
    FuelCalculationDetailsUtility.isNumberCheck(0, component.fuelCalculationModel);
  });
  it('should call isNumberCheck in utility', () => {
    component.fuelCalculationModel.tableFlag = true;
    const uploadDataList = [{
      fuelIncrementCalculationMethodConfigurationSetID: 123,
      fuelIncrementCalculationMethodConfigurationID: 123,
      fuelBeginAmount: '',
      fuelEndAmount: '',
      fuelSurchargeAmount: '',
      isRemoved: true,
      isModified: true,
      fuelBeginAmountErrorMessage: 'string',
      fuelEndAmountErrorMessage: 'string',
      fuelSurchargeAmountErrorMessage: 'string',
      id: 123
    }];
    component.fuelCalculationModel.uploadTablearray = uploadDataList;
    FuelCalculationDetailsUtility.isNumberCheck(0, component.fuelCalculationModel);
  });
  it('should call isChargeNotNumber in utility', () => {
    const uploadDataList = [{
      fuelIncrementCalculationMethodConfigurationSetID: 123,
      fuelIncrementCalculationMethodConfigurationID: 123,
      fuelBeginAmount: '-1',
      fuelEndAmount: '234',
      fuelSurchargeAmount: '234',
      isRemoved: true,
      isModified: true,
      fuelBeginAmountErrorMessage: 'string',
      fuelEndAmountErrorMessage: 'string',
      fuelSurchargeAmountErrorMessage: 'string',
      id: 123
    }];
    component.fuelCalculationModel.uploadTablearray = uploadDataList;
    console.log('blahblah');
    FuelCalculationDetailsUtility.isChargeNotNumber(0, component.fuelCalculationModel);
  });
});
