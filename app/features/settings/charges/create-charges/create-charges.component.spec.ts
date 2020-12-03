import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  FormsModule, ReactiveFormsModule,
  FormControl, Validators, FormBuilder, FormGroup, FormArray, AbstractControl
} from '@angular/forms';
import { AppModule } from '../../../../app.module';
import { SettingsModule } from './../../settings.module';
import { CreateChargesComponent } from './create-charges.component';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { CreateChargesService } from './services/create-charges.service';
import { on } from 'cluster';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { MessageService } from 'primeng/components/common/messageservice';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('CreateChargesComponent', () => {
  let component: CreateChargesComponent;
  let fixture: ComponentFixture<CreateChargesComponent>;
  const formBuilder = new FormBuilder();
  let formGroup: FormGroup;
  let chargesComponentModel: any;
  let broadcasterService: BroadcasterService;
  let createChargesService: CreateChargesService;
  let messageService: MessageService;
  let state: RouterStateSnapshot;

  configureTestSuite(() => {
    const changeDetectorRefStub = { detectChanges: () => ({}) };
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, AppModule, SettingsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: ChangeDetectorRef, useValue: changeDetectorRefStub },
      { provide: APP_BASE_HREF, useValue: '/' },
      { provide: RouterStateSnapshot, useValue: CreateChargesComponent }]
    });
  });
  const err = {
    'error': {
      'traceid': '343481659c77ad99',
      'errors': [{
        'fieldErrorFlag': false,
        'errorMessage': 'Failed to convert undefined into java.lang.Integer!',
        'errorType': 'System Runtime Error',
        'fieldName': null,
        'code': 'ServerRuntimeError',
        'errorSeverity': 'ERROR'
      }]
    }
  };
  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChargesComponent);
    component = fixture.componentInstance;
    state = TestBed.get(RouterStateSnapshot);
    formGroup = formBuilder.group({
      chargeIdentifier: ['1234', Validators.required],
      chargeName: ['qwerty', Validators.required],
      chargeDescription: ['abc'],
      chargeType: ['abc'],
      businessUnit: ['abc'],
      serviceOffering: ['abc'],
      rateType: ['abc'],
      applicationLevel: ['abc'],
      usage: ['abc'],
      effectiveDate: ['02/02/2000'],
      expirationDate: ['02/02/2000'],
    });
    chargesComponentModel = {
      breadCrumbList: [],
      items: [],
      popupMessage: 'abc',
      routingUrl: 'abc',
      activeIndex: 123,
      selectedIndex: 123,
      lastSelectedIndex: 123,
      isChangesSaving: true,
      isPopupVisible: true,
      isSubscribe: true,
      lastEditedFormFlag: true
    };
    broadcasterService = fixture.debugElement.injector.get(
      BroadcasterService
    );
    createChargesService = fixture.debugElement.injector.get(
      CreateChargesService
    );
    messageService = TestBed.get(MessageService);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onChangeChargeType', () => {
    component.chargesComponentModel = chargesComponentModel;
    const event = {
      value: 'Associate Charge'
    };
    component.onChangeChargeType(event);
  });
  it('should call onChangeChargeType else condition', () => {
    component.chargesComponentModel = chargesComponentModel;
    const event = {
      value: 'Associate'
    };
    component.onChangeChargeType(event);
  });
  it('should call onPopupNo', () => {
    component.onPopupNo();
  });
  it('should call onSelectApplicationLevel', () => {
    const event = {
      label: 12,
      value: 'chargeApplicationLevelTypeName'
    };
    component.onSelectApplicationLevel(event);
  });
  it('it should call onChangeBusinessUnit if', () => {
    component.chargesComponentModel = chargesComponentModel;
    const event = {
      value: ['unit1', 'unit2']
    };
    component.onChangeBusinessUnit(event);
  });
  it('it should call onChangeBusinessUnit else', () => {
    component.chargesComponentModel = chargesComponentModel;
    const event = {
      value: undefined
    };
    component.onChangeBusinessUnit(event);
  });
  it('it should call onChangeServiceOffering', () => {
    const event = {
      value: ['unit1', 'unit2']
    };
    component.onChangeServiceOffering(event);
  });
  it('it should call onChangeServiceOffering else condition', () => {
    const event = {
      value: []
    };
    component.onChangeServiceOffering(event);
  });
  it('it should call onChangeRateType if', () => {
    const event = {
      value: true
    };
    component.onChangeRateType(event);
  });
  it('it should call onChangeRateType  else', () => {
    const event = {
      value: undefined
    };
    component.onChangeRateType(event);
  });
  it('it should call onChanges', () => {
    component.createChargesModel.createChargesForm = formGroup;
    component.createChargesModel.createChargesForm.markAsDirty();
    component.onChanges();
  });

  it('it should call onSelectUsageType', () => {
    const event = {
      value: true
    };
    component.onSelectUsageType(event);
  });
  it('it should call onSelectUsageType else', () => {
    const event = {
      value: undefined
    };
    component.onSelectUsageType(event);
  });
  it('it should call onChangeCheckboxList switch case 1', () => {
    const event = {
      value: true
    };
    const field = 'Quantity Required';
    component.onChangeCheckboxList(event, field);
  });
  it('it should call onChangeCheckboxList switch case 2', () => {
    const event = {
      value: true
    };
    const field = 'Auto Invoice';
    component.onChangeCheckboxList(event, field);
  });
  it('it should call onChangeCheckboxList default switch case', () => {
    const event = {
      value: true
    };
    const field = '';
    component.onChangeCheckboxList(event, field);
  });
  it('it should call onDateSelected switch case 1', () => {
    const event = 'Mon May 27 2019 00:00:00 GMT+0000 (Greenwich Mean Time)';
    const dateField = 'effectiveDate';
    component.onDateSelected(event, dateField);
  });
  it('it should call onDateSelected switch case 2', () => {
    const event = 'Mon May 27 2019 00:00:00 GMT+0000 (Greenwich Mean Time)';
    const dateField = 'expirationDate';
    component.onDateSelected(event, dateField);
  });
  it('it should call onDateSelected default switch case', () => {
    const event = 'Mon May 27 2019 00:00:00 GMT+0000 (Greenwich Mean Time)';
    const dateField = '';
    component.onDateSelected(event, dateField);
  });
  it('it should call onTypeDate switch case 1', () => {
    component.chargesComponentModel = chargesComponentModel;
    const event = {
      srcElement: {
        value: '06/05/1995'
      }
    };
    const dateField = 'effectiveDate';
    component.onTypeDate(event, dateField);
  });
  it('it should call onTypeDate switch case 2', () => {
    component.chargesComponentModel = chargesComponentModel;
    const event = {
      srcElement: {
        value: '06/01/1990'
      }
    };
    const dateField = 'expirationDate';
    component.onTypeDate(event, dateField);
  });
  it('it should call onTypeDate default test case', () => {
    component.chargesComponentModel = chargesComponentModel;
    const event = {
      srcElement: {
        value: 'value'
      }
    };
    const dateField = '';
    component.onTypeDate(event, dateField);
  });
  it('it should call onClearDropDown', () => {
    component.chargesComponentModel = chargesComponentModel;
    component.onClearDropDown('applicationLevel');
  });
  it('it should call onClearDropDown else condition', () => {
    component.chargesComponentModel = chargesComponentModel;
    component.onClearDropDown('usage');
  });
  it('it should call onClickClose', () => {
    component.createChargesModel.createChargesForm = formGroup;
    component.createChargesModel.createChargesForm.controls['chargeIdentifier'].markAsDirty();
    component.createChargesModel.createChargesForm.markAsTouched();
    component.onClickClose();
  });
  it('it should call onClickClose with else condition', () => {
    component.chargesComponentModel = chargesComponentModel;
    component.onClickClose();
  });
  it('it should call onClickSaveCharge if bu empty', () => {
    component.chargesComponentModel = chargesComponentModel;
    formGroup = formBuilder.group({
      chargeIdentifier: ['1234'],
      chargeName: ['qwerty'],
      chargeDescription: ['abc'],
      chargeType: ['abc'],
      businessUnit: [''],
      serviceOffering: ['abc'],
      rateType: ['abc'],
      applicationLevel: ['abc'],
      usage: ['abc'],
      effectiveDate: ['02/02/2000'],
      expirationDate: ['02/02/2000'],
    });
    component.createChargesModel.associateChargeFlag = true;
    spyOn(createChargesService, 'postChargeCode').and.callThrough();
    component.onClickSaveCharge();
  });
  it('it should call onClickSaveCharge if so empty', () => {
    component.chargesComponentModel = chargesComponentModel;
    formGroup = formBuilder.group({
      chargeIdentifier: ['1234'],
      chargeName: ['qwerty'],
      chargeDescription: ['abc'],
      chargeType: ['abc'],
      businessUnit: ['abc'],
      serviceOffering: [''],
      rateType: ['abc'],
      applicationLevel: ['abc'],
      usage: ['abc'],
      effectiveDate: ['02/02/2000'],
      expirationDate: ['02/02/2000']
    });
    component.createChargesModel.associateChargeFlag = true;
    component.createChargesModel.createChargesForm = formGroup;
    spyOn(createChargesService, 'postChargeCode').and.callThrough();
    component.onClickSaveCharge();
  });

  it('it should call onClickSaveCharge form valid if', () => {
    component.chargesComponentModel = chargesComponentModel;
    component.createChargesModel.associateChargeFlag = true;
    component.createChargesModel.createChargesForm = formGroup;
    spyOn(createChargesService, 'postChargeCode').and.callThrough();
    component.onClickSaveCharge();
  });
  it('it should call setErrorField', () => {
    component.createChargesModel.createChargesForm = formGroup;
    spyOn(broadcasterService, 'on').and.returnValue(of(true));
    component.setErrorField();
  });
  it('it should call setErrorField', () => {
    component.createChargesModel.createChargesForm = formGroup;
    spyOn(broadcasterService, 'on').and.returnValue(of(false));
    component.setErrorField();
  });
  it('it should call onClickSaveCharge Error handling', () => {
    component.createChargesModel.createChargesForm = formGroup;
    component.chargesComponentModel = chargesComponentModel;
    component.chargesComponentModel.isChangesSaving = false;
    spyOn(createChargesService, 'postChargeCode').and.returnValues(throwError(err));
    component.onClickSaveCharge();
  });
  it('it should call getApplicationLevels', () => {
    const response = {
      '_embedded': {
        'chargeApplicationLevelTypes': [
          {
            'chargeApplicationLevelTypeName': 'Order',
            'chargeApplicationLevelTypeID': 1,
            '_links': {
              'self': {
                'href': 'https://pricing-test.jbhunt.com/api/pricingconfigurationservices/chargeapplicationleveltypes/1'
              },
              'chargeApplicationLevelType': {
                'href': 'https://pricing-test.jbhunt.com/api/pricingconfigurationservices/chargeapplicationleveltypes/1{?projection}',
                'templated': true
              }
            }
          }]
        }
      };
    spyOn(createChargesService, 'getApplicationLevelTypes').and.returnValues(of(response));
    component.getApplicationLevels();
  });
  it('it should call getApplicationLevels error ', () => {
    spyOn(createChargesService, 'getApplicationLevelTypes').and.returnValues(throwError(err));
    component.getApplicationLevels();
  });
  it('it should call getApplicationLevelTypeList', () => {
    const event = {
      query: 'Order'
    };
    component.createChargesModel.applicationLevels = [{ 'label': 1, 'value': 'Order' },
    { 'label': 2, 'value': 'Stop' }];
    component.getApplicationLevelTypeList(event);
  });
  it('it should call getUsageList', () => {
    component.createChargesModel.usageListValues = [];
    const event = {
      query: 'All'
    };
    component.createChargesModel.usageList = [{ 'label': 1, 'value': 'Customer' },
    { 'label': 2, 'value': 'Carrier' }, { 'label': 3, 'value': 'All' }];
    component.getUsageList(event);
  });
  it('it should call getRateTypesList', () => {
    const response = {
      '_embedded' : {
        'rateTypes' : [ {
          'rateTypeName' : 'Percent Entered',
          'rateTypeId' : 1,
          '_links' : {
            'self' : {
              'href' : 'https://pricing-test.jbhunt.com/api/pricingconfigurationservices/ratetypes/1'
            },
            'rateType' : {
              'href' : 'https://pricing-test.jbhunt.com/api/pricingconfigurationservices/ratetypes/1{?projection}',
              'templated' : true
            }
          }
        }]
      }
    };
    spyOn(createChargesService, 'getRateTypes').and.returnValues(of(response));
    component.getRateTypesList();
  });
  it('it should call getRateTypesList', () => {
    spyOn(createChargesService, 'getRateTypes').and.returnValues(throwError(err));
    component.getRateTypesList();
  });
  it('it should call getUsage', () => {
    const response = {
      '_embedded' : {
        'chargeUsageTypes' : [ {
          'chargeUsageTypeName' : 'Customer',
          'chargeUsageTypeID' : 1,
          '_links' : {
            'self' : {
              'href' : 'https://pricing-test.jbhunt.com/api/pricingconfigurationservices/chargeusagetypes/1'
            },
            'chargeUsageType' : {
              'href' : 'https://pricing-test.jbhunt.com/api/pricingconfigurationservices/chargeusagetypes/1{?projection}',
              'templated' : true
            }
          }
        }]
      }
    };
    spyOn(createChargesService, 'getUsage').and.returnValues(of(response));
    component.getUsage();
  });
  it('it should call getUsage err', () => {
    messageService = fixture.debugElement.injector.get(MessageService);
    spyOn(createChargesService, 'getUsage').and.returnValues(throwError(err));
    component.getUsage();
  });
  it('it should call toastMessage', () => {
    const message = {
      severity: 'test',
      summary: 'Success',
      detail: 'test'
    };
    messageService = fixture.debugElement.injector.get(MessageService);
    spyOn(messageService, 'add');
    spyOn(messageService, 'clear');
    component.toastMessage(messageService, 'test', 'test');
  });
  it('it should call createChargesFormInitialization', () => {
    component.createChargesModel.createChargesForm = formGroup;
    component.createChargesFormInitialization();
  });
  it('it should call getBusinessUnitList ', () => {
    const data = [{
      label: 'abcd',
      value: 'abc'
    }];
    const response = {
      '_embedded' : {
        'serviceOfferingBusinessUnitTransitModeAssociations' : [ {
          'financeBusinessUnitServiceOfferingAssociation' : {
            'financeBusinessUnitServiceOfferingAssociationID' : null,
            'financeBusinessUnitCode' : 'DCS',
            'serviceOfferingCode' : null,
            'effectiveTimestamp' : null,
            'expirationTimestamp' : null,
            'lastUpdateTimestampString' : null
          },
          'transitMode' : null,
          'utilizationClassification' : null,
          'freightShippingType' : null,
          'lastUpdateTimestampString' : null,
          '_links' : {
            'self' : {
            },
            'serviceOfferingBusinessUnitTransitModeAssociation' : {
              'templated' : true
            }
          }
        }]
      }
    };
    spyOn(createChargesService, 'getBusinessUnit').and.returnValues(of(response));
    component.getBusinessUnitList();
  });
  it('it should call getBusinessUnitList err handling', () => {
    spyOn(createChargesService, 'getBusinessUnit').and.returnValues(throwError(err));
    component.getBusinessUnitList();
  });
  xit('it should call checkIsValidDateRange', () => {
    component.createChargesModel.createChargesForm = formGroup;
    component.checkIsValidDateRange();
  });
  it('it should call setDateFieldErrors', () => {
    component.createChargesModel.createChargesForm = formGroup;
    component.createChargesModel.invalidDateFlag = true;
    component.setDateFieldErrors();
  });
  it('it should call setDateFieldErrors else condition', () => {
    component.createChargesModel.createChargesForm = formGroup;
    component.createChargesModel.invalidDateFlag = false;
    component.setDateFieldErrors();
  });
  it('it should call setRequestParam', () => {
    component.setRequestParam();
  });
  it('it should call populateInputFields', () => {
    component.populateInputFields();
  });
  it('it should call getCurrentDate', () => {
    component.getCurrentDate();
  });
  it('it should call populateServiceOffering', () => {
    component.createChargesModel.createChargesForm = formGroup;
    component.chargesComponentModel = chargesComponentModel;
    const response = [{
      'serviceOfferingCode': 'string',
      'serviceOfferingDescription': 'string',
      'financeBusinessUnitCode': 'string',
      'transitModeCode': 'string',
      'transitModeDescription': 'string'
    }];
    spyOn(createChargesService, 'getServiceOffering').and.returnValue(of(response));
    component.populateServiceOffering(['DCS', 'JBT']);
  });
  it('it should call populateServiceOffering err handling', () => {
    component.createChargesModel.createChargesForm = formGroup;
    component.chargesComponentModel = chargesComponentModel;
    spyOn(createChargesService, 'getServiceOffering').and.returnValue(throwError(err));
    component.populateServiceOffering(['DCS', 'JBT']);
  });
  it('it should call navigationSubscription', () => {
    const data = {
      key: true,
      message: 'abcd'
    };
    component.chargesComponentModel = chargesComponentModel;
    spyOn(broadcasterService, 'on').and.returnValue(of(state));
    spyOn(broadcasterService, 'broadcast').and.returnValues(of(data));
    component.navigationSubscription();
  });
  it('it should call saveSubscription', () => {
    spyOn(broadcasterService, 'on').and.returnValue(of(true));
    component.createChargesModel.createChargesForm = formGroup;
    component.saveSubscription();
  });
  it('it should call saveSubscription', () => {
    spyOn(broadcasterService, 'on').and.returnValue(of(false));
    component.createChargesModel.createChargesForm = formGroup;
    const router: Router = fixture.debugElement.injector.get(
      Router);
    component.createChargesModel.routeUrl = '/dashboard';
    spyOn(router, 'navigate');
    component.saveSubscription();
  });
  it('it should call onPopupYes', () => {
    component.chargesComponentModel = chargesComponentModel;
    component.onPopupYes(false);
  });
  it('it should call handleError', () => {
    component.handleError(err);
  });
  it('it should call handleError is empty', () => {
   const error = {};
    component.handleError(error);
  });
  it('it should call setAssociateChargeValidators for IF Condition', () => {
    component.createChargesModel.createChargesForm = formGroup;
    component.createChargesModel.associateChargeMandatoryFields = ['businessUnit', 'serviceOffering', 'rateType', 'applicationLevel',
      'usage', 'effectiveDate', 'expirationDate'];
    component.setAssociateChargeValidators(true);
  });
  it('it should call setAssociateChargeValidators for Else Condition', () => {
    component.createChargesModel.createChargesForm = formGroup;
    component.createChargesModel.associateChargeMandatoryFields = ['businessUnit', 'serviceOffering', 'rateType', 'applicationLevel',
      'usage', 'effectiveDate', 'expirationDate'];
    component.setAssociateChargeValidators(false);
  });
  it('it should call setRequestParam', () => {
    component.createChargesModel.createChargesForm = formGroup;
    component.setRequestParam();
  });
  it('it should call setDefaultValues', () => {
    component.createChargesModel.createChargesForm = formGroup;
    component.setDefaultValues();
  });
  it('it should call setMandatoryValidation', () => {
    component.createChargesModel.createChargesForm = formGroup;
    component.setMandatoryValidation();
  });
  it('it should call setMandatoryValidation', () => {
    formGroup = formBuilder.group({
      chargeIdentifier: ['1234', Validators.required],
      chargeName: ['qwerty', Validators.required],
      chargeDescription: ['abc'],
      chargeType: ['Associate Charge'],
      businessUnit: ['abc'],
      serviceOffering: ['abc'],
      rateType: ['abc'],
      applicationLevel: ['abc'],
      usage: ['abc'],
      effectiveDate: ['02/02/2000'],
      expirationDate: ['02/02/2000'],
    });
    component.createChargesModel.createChargesForm = formGroup;
    component.setMandatoryValidation();
  });
  it('it should call restoreDefaultPayloadValues', () => {
    component.chargesComponentModel = chargesComponentModel;
    component.createChargesModel.createChargesForm = formGroup;
    component.restoreDefaultPayloadValues();
  });
});
