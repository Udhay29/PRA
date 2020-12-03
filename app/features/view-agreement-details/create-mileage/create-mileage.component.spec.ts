import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import {
  FormsModule, ReactiveFormsModule,
  FormControl, Validators, FormBuilder, FormGroup, FormArray, AbstractControl
} from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { CanDeactivateGuardService } from '../../../shared/jbh-app-services/can-deactivate-guard.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AppModule } from '../../../app.module';
import { ViewAgreementDetailsModule } from '../view-agreement-details.module';
import { CreateMileageComponent } from './create-mileage.component';
import { CreateMileageService } from './service/create-mileage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateMileageUtility } from './service/create-mileage-utility';
import * as moment from 'moment';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/components/common/messageservice';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { HttpResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { utils } from 'protractor';
import { CommonImportModule } from '../../../shared/common-import.module';
import { MileageSystem } from './models/create-mileage.interface';


describe('CreateMileageComponent', () => {
  let component: CreateMileageComponent;
  let fixture: ComponentFixture<CreateMileageComponent>;
  let createMileageService: CreateMileageService;
  const formBuilder = new FormBuilder();
  let createMileageForm: FormGroup;
  let customerAgreement: any;
  let canDeactivateGuardService: CanDeactivateGuardService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;
  let broadcasterService: BroadcasterService;
  let messageService: MessageService;
  let httpService: HttpClient;

  const response = {
    'name': 'dasd',
    'id': null,
    'agreementDefault': 'N',
    'contractDefault': 'Y',
    'businessUnitCodes': null,
    'customerAgreementContracts': [
      {
        'customerAgreementContractID': 2647,
        'customerContractName': 'contract1'
      }
    ],
    'customerAgreementSections': null,
    'carriers': [
    ],
    'distanceUnit': {
      'code': 'Miles',
      'description': 'Miles'
    },
    'decimalPrecisionIndicator': 'N',
    'borderCrossingParameter': {
      'borderCrossingIndicator': 1,
      'borderCrossingParameter': 'Miles to border'
    },
    'effectiveDate': '2019-07-05',
    'expirationDate': '2019-07-31',
    'notes': '',
    'geographicPointType': {
      'geographicPointTypeID': 2,
      'geographicPointTypeName': 'City State'
    },
    'mileageRouteType': {
      'mileageRouteTypeID': 2,
      'mileageRouteTypeName': 'Shortest'
    },
    'mileageCalculationType': {
      'mileageCalculationTypeID': 1,
      'mileageCalculationTypeName': 'Construct'
    },
    'mileageSystem': {
      'mileageSystemID': 1,
      'mileageSystemName': 'Rand McNally'
    },
    'mileageSystemVersion': {
      'mileageSystemVersionID': 6,
      'mileageSystemVersionName': '18'
    },
    'mileageSystemParameters': [
      {
        'mileageSystemParameterID': 3,
        'mileageSystemParameterName': 'Tolls',
        'mileageSystemParameterAssociationID': 3,
        'mileageParameterSelectIndicator': 'N'
      },
      {
        'mileageSystemParameterID': 4,
        'mileageSystemParameterName': 'Avoid Tolls',
        'mileageSystemParameterAssociationID': 4,
        'mileageParameterSelectIndicator': 'N'
      }
    ]
  };
  const dataForEdit = {
    'customerMileageProgramID': 366,
    'customerMileageProgramVersionID': 366,
    'customerAgreementID': 134,
    'customerAgreementName': 'The Home Depot Inc (HDAT)',
    'mileageProgramName': 'hjhj',
    'mileageType': 'Agreement',
    'financeBusinessUnitAssociations': [],
    'agreementDefaultIndicator': 'N',
    'contractAssociations': [],
    'sectionAssociations': [],
    'mileageSystemID': 1,
    'mileageSystemName': 'Rand McNally',
    'mileageSystemVersionID': 6,
    'mileageSystemVersionName': '18',
    'unitOfDistanceMeasurementCode': 'Miles',
    'geographicPointTypeID': 1,
    'geographicPointTypeName': 'City State',
    'mileageRouteTypeID': 2,
    'mileageRouteTypeName': 'Shortest',
    'mileageCalculationTypeID': 1,
    'mileageCalculationTypeName': 'Construct',
    'mileageBorderMileParameterTypeID': 1,
    'mileageBorderMileParameterTypeName': 'Miles to border',
    'decimalPrecisionIndicator': 'N',
    'carrierAssociations': [
      {
        'name': 'Test Carrier 1',
        'id': 101,
        'code': 'TCR1'
      }
    ],
    'mileageSystemParameters': [
      {
        'mileageSystemParameterID': 2,
        'mileageSystemParameterName': 'Border Open',
        'mileageParameterSelectIndicator': 'N'
      },
      {
        'mileageSystemParameterID': 1,
        'mileageSystemParameterName': 'Mixed Geography',
        'mileageParameterSelectIndicator': 'N'
      },
      {
        'mileageSystemParameterID': 4,
        'mileageSystemParameterName': 'Override Restrictions',
        'mileageParameterSelectIndicator': 'N'
      },
      {
        'mileageSystemParameterID': 3,
        'mileageSystemParameterName': 'Tolls',
        'mileageParameterSelectIndicator': 'N'
      }
    ],
    'effectiveDate': '2019-08-13',
    'expirationDate': '2099-12-31',
    'customerMileageProgramNoteID': null,
    'mileageProgramNoteText': null,
    'createUserId': 'jisadpa',
    'createTimestamp': '2019-08-13T04:10:03.011',
    'createProgramName': 'Process ID',
    'originalEffectiveDate': '2019-08-13',
    'originalExpirationDate': '2099-12-31',
    'invalidIndicator': 'N',
    'invalidReasonType': 'Active',
    'inactivateLevelID': null,
    'lastUpdateUserId': 'jisadpa',
    'lastUpdateTimestamp': '2019-08-13T04:10:03.112',
    'lastUpdateProgramName': 'Process ID'
  };
  const editReqParam = {
    agreementName: 'Test',
    mileageProgramName: 'Program one',
    id:  45,
    agreementDefaultIndicator: 'Y',
    contractDefault: null,
    businessUnitCodes: null,
    customerAgreementContracts: [],
    customerAgreementSections: null,
    carriers: [],
    distanceUnit: {
      'code': 'Miles',
      'description': 'Miles'
    },
    decimalPrecisionIndicator: 'N',
    mileageBorderMileParameterType: {
      'mileageBorderMileParameterTypeID': 1,
      'mileageBorderMileParameterTypeName': 'Miles to border'
    },
    effectiveDate: '2019-09-01',
    expirationDate: '2019-09-10',
    mileageProgramNoteText:  'test',
    geographicPointType: {
      'geographicPointTypeID': 1,
      'geographicPointTypeName': 'City State'
    },
    mileageRouteType: {
      'mileageRouteTypeID': 2,
      'mileageRouteTypeName': 'Shortest'
    },
    mileageCalculationType: {
      'mileageCalculationTypeID': 1,
      'mileageCalculationTypeName': 'Construct'
    },
    mileageSystem: {
      'mileageSystemID': 2,
      'mileageSystemName': 'PC Miller'
    },
    mileageSystemVersion: {
      'mileageSystemVersionID': 1,
      'mileageSystemVersionName': '13'
    },
    mileageSystemParameters: [
      {
        'mileageSystemParameterID': 1,
        'mileageSystemParameterAssociationID': 5,
        'mileageSystemParameterName': 'Mixed Geography',
        'mileageParameterSelectIndicator': 'N'
      },
      {
        'mileageSystemParameterID': 2,
        'mileageSystemParameterAssociationID': 6,
        'mileageSystemParameterName': 'Border Open',
        'mileageParameterSelectIndicator': 'N'
      }
    ]
};
  configureTestSuite(() => {
    const changeDetectorRefStub = { detectChanges: () => ({}) };
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: ChangeDetectorRef, useValue: changeDetectorRefStub },
      { provide: APP_BASE_HREF, useValue: '/' }, CanDeactivateGuardService,
      { provide: RouterStateSnapshot, useValue: CreateMileageComponent },
      { provide: ActivatedRouteSnapshot, useValue: CreateMileageComponent }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMileageComponent);
    component = fixture.componentInstance;
    createMileageService = fixture.debugElement.injector.get(CreateMileageService);
    canDeactivateGuardService = TestBed.get(CanDeactivateGuardService);
    route = TestBed.get(ActivatedRouteSnapshot);
    state = TestBed.get(RouterStateSnapshot);
    broadcasterService = TestBed.get(BroadcasterService);
    messageService = TestBed.get(MessageService);
    httpService = TestBed.get(HttpClient);
    nextState = TestBed.get(RouterStateSnapshot);
    const tmpDate = new Date('1995-12-17T03:24:00');
    createMileageForm = formBuilder.group({
      programName: ['abc'],
      system: ['abc'],
      systemVersion: ['1'],
      distanceUnit: ['m'],
      geographyType: ['abc'],
      routeType: ['abc'],
      calculationType: [''],
      effectiveDate: [tmpDate],
      expirationDate: [tmpDate],
      carrier: [''],
      decimalPrecision: [''],
      agreementDefault: [''],
      selectContract: [''],
      contracts: [''],
      businessUnit: [''],
      sectionsRowDataField: [''],
      notes: [''],
      systemdd: [''],
      systemParameters: ['']
    });
    customerAgreement = {
      tenantID: 1234,
      ultimateParentAccountID: 124,
      customerAgreementName: 'abc',
      customerAgreementID: 123,
      effectiveDate: '01/01/2000',
      expirationDate: '01/01/2000',
      customerAgreementOwnerships: [],
      lastUpdateTimestampString: 'abc',
      _links: null
    };
    component.createMileageModel.customerAgreement = {
      tenantID: 1234,
      ultimateParentAccountID: 124,
      customerAgreementName: 'abc',
      customerAgreementID: 123,
      effectiveDate: '01/01/2000',
      expirationDate: '01/01/2000',
      customerAgreementOwnerships: [],
      lastUpdateTimestampString: 'abc',
      _links: null
    };
    component.createMileageModel.domainAttributes = {
      'mileageCalculationTypes': [
        {
          'mileageCalculationTypeID': 1,
          'mileageCalculationTypeName': 'Construct',
        }
      ],
      'mileageRouteTypes': [
        {
          'mileageRouteTypeID': 1,
          'mileageRouteTypeName': 'Practical',
        }
      ],
      'mileageSystems': [
        {
          'mileageSystemID': 1,
          'mileageSystemName': 'Rand McNally',
          'mileageSystemVersions': [
            {
              'mileageSystemVersionID': 6,
              'mileageSystemVersionName': '18',
              'effectiveDate': '2019-05-24',
              'expirationDate': '2099-12-31'
            },
            {
              'mileageSystemVersionID': 7,
              'mileageSystemVersionName': '19',
              'effectiveDate': '2019-05-24',
              'expirationDate': '2099-12-31'
            }
          ],
          'mileageSystemParameters': [
            {
              'mileageSystemParameterID': 1,
              'mileageSystemParameterAssociationID': 1,
              'mileageSystemParameterName': 'Mixed Geography',
              'mileageParameterSelectIndicator': null,
              'effectiveDate': '2019-05-24',
              'expirationDate': '2099-12-31'
            }
          ]
        }
      ],
      'borderCrossingParameters': [
        {
          'mileageBorderMileParameterTypeID': 1,
          'mileageBorderMileParameterTypeName': 'Miles to border'
        }
      ],
      'geographicPointType': [
        {
          'geographicPointTypeID': 1,
          'geographicPointTypeName': 'City State'
        }
      ],
      'unitOfLengthMeasurements': [
        {
          'code': 'Mile',
          'description': 'Mile'
        }
      ]
    };
    component.createMileageModel.createMileageForm = createMileageForm;
    fixture.detectChanges();
  });
  it('will have the both `ViewChild`s defined', () => {
    expect(fixture.componentInstance.effectiveCal).toBeDefined();
    expect(fixture.componentInstance.expirationCal).toBeDefined();
  });
  it('should create', () => {
    component.agreementID = '1234';
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('it should call onSelectDropdown with switch case 1', () => {
    const event = {
      label: 'label',
      value: 'value'
    };
    const selectedField = 'distanceUnit';
    component.onSelectDropdown(event, selectedField);
    expect(component.onSelectDropdown).toBeTruthy();
  });
  it('it should call onSelectDropdown with default switch case', () => {
    const event = {
      label: 'label',
      value: 'value'
    };
    const selectedField = '';
    component.onSelectDropdown(event, selectedField);
    expect(component.onSelectDropdown).toBeTruthy();
  });
  it('it should call onClearDropDown', () => {
    const control = 'system';
    component.createMileageModel.createMileageForm.controls['system'].setValue('');
    component.createMileageModel.createMileageForm['controls']['systemVersion'].setValue('');
    component.onClearDropDown(control);
    expect(component.onClearDropDown).toBeTruthy();
  });
  it('it should call onClearDropDownelse', () => {
    const control = 'systemVersion';
    component.createMileageModel.createMileageForm.controls['system'].setValue('');
    component.createMileageModel.createMileageForm['controls']['systemVersion'].setValue('');
    component.onClearDropDown(control);
  });
  it('it should call onSelectSystemName', () => {
    const event = {
      label: 1,
      value: 'Rand McNally'
    };
    component.onSelectSystemName(event);
  });
  it('it should call mileageValidations', () => {
    component.mileageValidations();
  });
  it('it should call onSelectSystemVersion', () => {
    const event = {
      label: 123,
      value: 'value'
    };
    component.onSelectSystemVersion(event);
    expect(component.onSelectSystemVersion).toBeTruthy();
  });
  it('it should call onChangeDecimalPrecision', () => {
    const event = {
      checked: true
    };
    component.onChangeDecimalPrecision(event);
    expect(component.onChangeDecimalPrecision).toBeTruthy();
  });
  it('it should call onChangeAgreementDefault', () => {
    const event = {
      checked: true
    };
    component.createMileageModel.customerAgreement = customerAgreement;
    component.onChangeAgreementDefault(event);
  });
  it('it should call onChangeAgreementDefault', () => {
    const event = {
      checked: false
    };
    component.createMileageModel.customerAgreement = customerAgreement;
    component.onChangeAgreementDefault(event);
  });
  it('it should call onDateSelected', () => {
    const event = '01/01/2000';
    const dateSelected = 'effectiveDate';
    component.createMileageModel.customerAgreement = customerAgreement;
    component.createMileageModel.effectiveDate = '01/01/2000';
    component.onDateSelected(event, dateSelected);
    expect(component.onDateSelected).toBeTruthy();
  });
  it('it should call onDateSelected', () => {
    const event = '01/01/2000';
    const dateSelected = 'expirationDate';
    component.createMileageModel.customerAgreement = customerAgreement;
    component.createMileageModel.effectiveDate = '01/01/2000';
    component.onDateSelected(event, dateSelected);
    expect(component.onDateSelected).toBeTruthy();
  });
  it('it should call onDateSelected', () => {
    const event = '01/01/2000';
    const dateSelected = 'expirationDate';
    component.createMileageModel.customerAgreement = customerAgreement;
    component.createMileageModel.effectiveDate = '';
    component.onDateSelected(event, dateSelected);
    expect(component.onDateSelected).toBeTruthy();
  });
  it('it should call onDateSelected', () => {
    const event = '01/01/2000';
    const dateSelected = 'expirationDate';
    component.createMileageModel.customerAgreement = customerAgreement;
    component.createMileageModel.effectiveDate = '';
    component.onDateSelected(event, dateSelected);
    expect(component.onDateSelected).toBeTruthy();
  });
  it('it should call onClickBorderMilesParameter', () => {
    component.createMileageModel.editFlag = true;
    const event = {
      checked: false
    };
    component.createMileageModel.borderMileParameter  = {
      'mileageBorderMileParameterTypeID': 123,
      'mileageBorderMileParameterTypeName': 'abc'
    };
    component.onClickBorderMilesParameter(event, 'value', 123);
    expect(component.onClickBorderMilesParameter).toBeTruthy();
  });
  it('it should call onClickBorderMilesParameter', () => {
    component.createMileageModel.editFlag = false;
    const event = {
      checked: false
    };
    component.onClickBorderMilesParameter(event, 'value', 123);
    expect(component.onClickBorderMilesParameter).toBeTruthy();
  });
  it('it should call onChangeBusinessUnit', () => {
    const event = {
      value: ['abc', 'abc', 'abc']
    };
    component.createMileageModel.businessUnitList = [{
      label: 'abc',
      value: 'abc'
    }];
    component.onChangeBusinessUnit(event);
    expect(component.onChangeBusinessUnit).toBeTruthy();
  });
  it('it should call onChangeContracts', () => {
    const event = {
      value: ['abc']
    };
    component.onChangeContracts(event);
  });
  it('it should call onChangeContracts', () => {
    const event = {
      value: []
    };
    component.onChangeContracts(event);
  });
  it('it should call onSelectCarrier', () => {
    const event = {
      label: 'abc',
      value: 'abc'
    };
    component.onSelectCarrier(event);
  });
  it('it should call onCarrierRemoval', () => {
    const event = {
      label: {
        id: 'test'
      },
      value: 'abc',
    };
    component.onCarrierRemoval(event);
  });
  it('it should call onClickCreate', () => {
    component.createMileageModel.isPageLoaded = true;
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    messageService = fixture.debugElement.injector.get(MessageService);
    const event = {
      value: 'abc'
    };
    component.selectedSections = [{
      customerAgreementContractSectionID: 123,
      customerAgreementContractSectionName: 'string',
      customerAgreementContractID: 234,
      customerContractName: 'string'
    }];
    const data = {
      name: '',
      contractDefault: '',
      customerAgreementSections: [123, 'asd', 123456, 'asdq']
    };
    component.createMileageModel.mandatoryFields = ['carrier'];
    spyOn(createMileageService, 'postMileagePreference').and.returnValues(of(response));
    spyOn(broadcasterService, 'broadcast');
    broadcasterService.broadcast('mileageCreate', 'success');
    spyOn(messageService, 'add');
    spyOn(httpService, 'post');
    httpService.post('abc', 'abcd');
    component.onClickCreate();
    expect(component.onClickCreate).toBeTruthy();
  });
  it('it should call onClickCreate else', () => {
    component.createMileageModel.isPageLoaded = true;
    messageService = fixture.debugElement.injector.get(MessageService);
    component.selectedSections = [];
    component.createMileageModel.createMileageForm.controls['notes'].setValue('notestext');
    component.createMileageModel.mandatoryFields = ['carrier'];
    spyOn(createMileageService, 'postMileagePreference').and.returnValues(of(response));
    spyOn(broadcasterService, 'broadcast');
    broadcasterService.broadcast('mileageCreate', 'success');
    spyOn(messageService, 'add');
    spyOn(httpService, 'post');
    httpService.post('abc', 'abcd');
    component.onClickCreate();
  });

  it('it should call onClickCreate else notesNull', () => {
    component.createMileageModel.isPageLoaded = true;
    messageService = fixture.debugElement.injector.get(MessageService);
    component.selectedSections = [{
      customerAgreementContractSectionID: 123,
      customerAgreementContractSectionName: 'string',
      customerAgreementContractID: 234,
      customerContractName: 'string'
    }];
    component.createMileageModel.createMileageForm.controls['notes'].setValue(null);
    component.createMileageModel.mandatoryFields = ['carrier'];
    spyOn(createMileageService, 'postMileagePreference').and.returnValues(of(response));
    spyOn(broadcasterService, 'broadcast');
    broadcasterService.broadcast('mileageCreate', 'success');
    spyOn(messageService, 'add');
    spyOn(httpService, 'post');
    httpService.post('abc', 'abcd');
    component.onClickCreate();
  });
  it('it should call getAgreementDetails', () => {
    spyOn(createMileageService, 'fetchAgreementDetailsByCustomerAgreementId').and.returnValues(of(response));
    component.getAgreementDetails(1234);
  });
  it('should call getAgreementDetails For Error Response', ()  =>  {
    const err = {
      'error': {
        'traceid' : '343481659c77ad99',
        'errors' : [{
          'fieldErrorFlag' : false,
          'errorMessage' : 'Failed to convert undefined into java.lang.Integer!',
          'errorType' : 'System Runtime Error',
          'fieldName' : null,
          'code' : 'ServerRuntimeError',
          'errorSeverity' : 'ERROR'
      }]
      }
    };
    spyOn(createMileageService, 'fetchAgreementDetailsByCustomerAgreementId').and.returnValues(throwError(err));
    component.getAgreementDetails(1234);
  });
  it('it should call populateInputFields', () => {
    component.populateInputFields();
  });
  it('it should call setDefaults', () => {
    const bdata = [{
      'borderCrossingParameter': {
        'borderCrossingIndicator': 1,
        'borderCrossingParameter': 'Miles to border'
      }
    }];
    component.setDefaults(123);
  });
  it('it should call setContractDefault', () => {
    spyOn(createMileageService, 'getAgreementDefault').and.returnValues(of(true));
    component.setContractDefault(1234);
  });
  it('it should call setContractDefaultelse', () => {
    spyOn(createMileageService, 'getAgreementDefault').and.returnValues(of(false));
    component.setContractDefault(1234);
  });
  it('should call setContractDefault For Error Response', ()  =>  {
    const err = {
      'message' : 'Failed to convert undefined into java.lang.Integer!'
    };
    spyOn(createMileageService, 'getAgreementDefault').and.returnValues(throwError(err));
    component.setContractDefault(1234);
  });
  it('it should call patchDefaultValues', () => {
    const event = [
      {
        label: 123,
        value: 'abc'
      }];
    component.patchDefaultValues();
  });
  it('it should call fetchSystemParameters', () => {
    component.createMileageModel.systemParameters = [{
      label: {
        'mileageSystemParameterID': 1234,
        'mileageSystemParameterAssociationID': 234,
        'mileageSystemParameterName': 'abc',
        'mileageParameterSelectIndicator': 'Y'
      },
      value: 'abcd'
    }];
    component.createMileageModel.systemParametersList  = [];
    component.createMileageModel.defaultSystemParameters = [{
      'mileageSystemParameterID': 1,
      'mileageSystemParameterAssociationID': 1,
      'mileageSystemParameterName': 'Mixed Geography',
      'mileageParameterSelectIndicator': null,
      'effectiveDate': '2018-12-11',
      'expirationDate': '2099-12-31'
    }];
    component.fetchSystemParameters(component.createMileageModel.defaultSystemParameters);
  });
  it('it should call getDomainAttributes', () => {
    component.createMileageModel.systemList = [
      {
        label: {
          mileageSystemID: 123,
          mileageSystemName: 'abc'
        },
        value: 'abc'
      }];
    spyOn(createMileageService, 'getMileageDomainAttributes').and.returnValues(of(response));
    component.getDomainAttributes();
  });
  it('it should call getDomainAttributesempty', () => {
    component.createMileageModel.systemList = [
      {
        label: {
          mileageSystemID: 123,
          mileageSystemName: 'abc'
        },
        value: 'abc'
      }];
    spyOn(createMileageService, 'getMileageDomainAttributes').and.returnValues(of([]));
    component.getDomainAttributes();
  });
  it('it should call getGeographyPointTypes', () => {
    const geodata = [{
      'geographicPointTypeID': 2,
      'geographicPointTypeName': '5-Zip'
    }];
    spyOn(createMileageService, 'getMileageGeographyAttributes').and.returnValues(of(geodata));
    component.getGeographyPointTypes();
  });
  it('should call getGeographyPointTypes For Error Response', ()  =>  {
    const err = {
      'message': 'Failed to convert undefined into java.lang.Integer!'
    };
    spyOn(createMileageService, 'getMileageGeographyAttributes').and.returnValues(throwError(err));
    component.getGeographyPointTypes();
  });
  it('it should call getLengthMeasurementCode', () => {
    const lengthdata = [{
      'label': 'Kilometers',
      'value': 1
    }];
    spyOn(createMileageService, 'getUnitOfLengthMeasurement').and.returnValues(of(lengthdata));
    component.getLengthMeasurementCode();
  });
  it('it should call getContractsList', () => {
    component.createMileageModel.customerAgreement = customerAgreement;
    const contractdata = [{
      'customerAgreementContractID': 2647,
      'customerContractName': 'contract1'
    }];
    spyOn(createMileageService, 'getContractsByAgreementId').and.returnValues(of(contractdata));
    component.getContractsList(true);
  });
  it('it should call getContractsListEmpty', () => {
    component.createMileageModel.customerAgreement = customerAgreement;
    const contractdata = [];
    spyOn(createMileageService, 'getContractsByAgreementId').and.returnValues(of([]));
    component.getContractsList(true);
  });
  it('it should call getBusinessUnitList', () => {
    const datanew = {
      '_embedded': {
        'serviceOfferingBusinessUnitTransitModeAssociations': [
          {
            'financeBusinessUnitServiceOfferingAssociation': {
              'financeBusinessUnitServiceOfferingAssociationID': null,
              'financeBusinessUnitCode': 'DCS',
              'serviceOfferingCode': null,
              'effectiveTimestamp': null,
              'expirationTimestamp': null,
              'lastUpdateTimestampString': null
            },
            'transitMode': null,
            'utilizationClassification': null,
            'freightShippingType': null,
            'lastUpdateTimestampString': null
          }
        ]
      },
    };
    spyOn(createMileageService, 'getBusinessUnit').and.returnValues(of(datanew));
    component.getBusinessUnitList();
  });
  it('it should call getCarrierList', () => {
    const NewData = {
      'took': 21,
      'timed_out': false,
      '_shards': {
        'total': 5,
        'successful': 5,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 5,
        'max_score': 1.1053605,
        'hits': [
          {
            '_index': 'masterdata-carrier-carrierdetails-v2',
            '_type': 'doc',
            '_id': 'AWZjpqh-mEZA5pCXUpzQ',
            '_score': 1.1053605,
            '_source': {
              'LegalName': 'J AND A TRANSPORT',
              'CarrierID': 69,
              'CarrierCode': '0D0Z'
            }
          }
        ]
      }
    };
    spyOn(createMileageService, 'getCarriers').and.returnValues(of(NewData));
    component.getCarrierList();
  });
  it('it should call onTypeCarrierValue', () => {
    component.createMileageModel.carrierList = [
      {
        label: {
          id: 2,
          code: 'test',
          name: 'abc'
        },
        value: 'abc'
      }];
    const event = {
      query: 'abc'
    };
    component.onTypeCarrierValue(event);
  });
  it('it should call onTypeCarrierValueemty', () => {
    component.createMileageModel.carrierList = [];
    const event = {
      query: 'abc'
    };
    component.onTypeCarrierValue(event);
  });
  it('it should call getSystemDataList', () => {
    component.createMileageModel.systemList = [
      {
        label: {
          mileageSystemID: 123,
          mileageSystemName: 'abc'
        },
        value: 'abc'
      }];
    const event = {
      query: 'abc'
    };
    component.getSystemDataList(event);
  });
  it('it should call getSystemDataListelse', () => {
    component.createMileageModel.systemList = [
      {
        label: {
          mileageSystemID: 123,
          mileageSystemName: 'abc'
        },
        value: null
      }];
    const event = {
      query: 'abc'
    };
    component.getSystemDataList(event);
  });
  it('it should call getSystemVersionList', () => {
    const event = {
      query: 'abc'
    };
    component.getSystemVersionList(event);
  });
  it('it should call getSystemVersionListelse', () => {
    component.createMileageModel.systemVersion = [{
      'label': {
        mileageSystemVersionID: 123,
        mileageSystemVersionName: 'abc'
      },
      'value': null
    }];
    const event = {
      query: 'abc'
    };
    component.getSystemVersionList(event);
  });
  it('it should call onSelectEffDate', () => {
    component.createMileageModel.customerAgreement = customerAgreement;
    const varia = new Date('1995-12-17T03:24:00');
    component.createMileageModel.expirationMaxDate = varia;
    component.createMileageModel.effectiveMinDate = varia;
    component.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(new Date(varia));
    const eddDateValue = component.createMileageModel.createMileageForm.controls['effectiveDate'].value;
    component.createMileageModel.inCorrectEffDateFormat = false;
    const event = {
      srcElement: {
        value: '05/06/1995'
      }
    };
    CreateMileageUtility.getValidDate(component.createMileageModel);
    component.onSelectEffDate();
  });
  it('it should call onTypeDate1', () => {
    component.createMileageModel.customerAgreement = customerAgreement;
    const varia = new Date('1995-12-17T03:24:00');
    component.createMileageModel.expirationMaxDate = varia;
    component.createMileageModel.effectiveMinDate = varia;
    component.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(new Date(varia));
    const event = {
      srcElement: {
        value: '05/06/1995'
      }
    };
    const fieldName = 'effectiveDate';
    CreateMileageUtility.getValidDate(component.createMileageModel);
    component.onTypeDate(event, fieldName);
  });
  it('it should call onTypeDate1else', () => {
    component.createMileageModel.customerAgreement = customerAgreement;
    const varia = new Date('1995-12-17T03:24:00');
    component.createMileageModel.expirationMaxDate = varia;
    component.createMileageModel.effectiveMinDate = varia;
    component.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(new Date(varia));
    const event = {
      srcElement: {
        value: '05/06/1995sdf.,'
      }
    };
    const fieldName = 'effectiveDate';
    CreateMileageUtility.getValidDate(component.createMileageModel);
    component.onTypeDate(event, fieldName);
  });
  it('it should call onTypeDate2', () => {
    component.createMileageModel.customerAgreement = customerAgreement;
    const varia = new Date('1995-12-17T03:24:00');
    component.createMileageModel.expirationMaxDate = varia;
    component.createMileageModel.effectiveMinDate = varia;
    component.createMileageModel.createMileageForm.controls['expirationDate'].setValue(varia);
    const event = {
      srcElement: {
        value: '05/06/1995'
      }
    };
    const fieldName = 'expirationDate';
    component.onTypeDate(event, fieldName);
  });
  it('it should call onTypeDate2else', () => {
    component.createMileageModel.customerAgreement = customerAgreement;
    const varia = new Date('1995-12-17T03:24:00');
    component.createMileageModel.expirationMaxDate = varia;
    component.createMileageModel.effectiveMinDate = varia;
    component.createMileageModel.createMileageForm.controls['expirationDate'].setValue(varia);
    const event = {
      srcElement: {
        value: '05/06/1995sdf.,'
      }
    };
    const fieldName = 'expirationDate';
    component.onTypeDate(event, fieldName);
  });
  it('it should call onTypeDate', () => {
    const event = {
      srcElement: {
        value: '06/05/1995'
      }
    };
    const fieldName = '';
    component.onTypeDate(event, fieldName);
  });
  it('it should call setCalendarDate1', () => {
    const field = 'effectiveDate';
    component.setCalendarDate(field);
  });
  it('it should call setCalendarDate2', () => {
    const field = 'expirationDate';
    component.setCalendarDate(field);
  });
  it('it should call getSectionsGrid', () => {
    spyOn(createMileageService, 'getSectionsData').and.returnValues(of(response));
    component.createMileageModel.customerAgreement = customerAgreement;
    messageService = fixture.debugElement.injector.get(MessageService);
    spyOn(messageService, 'add').and.callThrough();
    component.createMileageModel.sectionsList = [];
    component.getSectionsGrid(true);
  });
  it('it should call getSectionsGridelse', () => {
    const responseEmpty = [];
    spyOn(createMileageService, 'getSectionsData').and.returnValues(of(responseEmpty));
    component.createMileageModel.customerAgreement = customerAgreement;
    messageService = fixture.debugElement.injector.get(MessageService);
    spyOn(messageService, 'add').and.callThrough();
    component.createMileageModel.sectionsList = [];
    component.getSectionsGrid(false);
  });
  it('it should call onSearch', () => {
    component.createMileageModel.sectionsList = [{
      'customerAgreementContractSectionID': 2074,
      'customerAgreementContractSectionName': 'sec_122',
      'customerAgreementContractID': 2647,
      'customerContractName': 'contract1',
    }];
    const event = {
      target: {
        value: '06/05/1995'
      }
    };
    component.onSearch(event);
  });
  it('it should call onSearch empty', () => {
    component.createMileageModel.sectionsList = [{
      'customerAgreementContractSectionID': 2074,
      'customerAgreementContractSectionName': 'sec_122',
      'customerAgreementContractID': 2647,
      'customerContractName': 'contract1',
    }];
    const event = {
      target: {
        value: ''
      }
    };
    component.onSearch(event);
  });
  it('it should call onCancel', () => {
    const activatedRoute: ActivatedRoute = fixture.debugElement.injector.get(
      ActivatedRoute
    );
    component.createMileageModel.customerAgreement = customerAgreement;
    spyOn(activatedRoute, 'queryParams').and.callThrough();
    component.onCancel();
  });
  it('it should call canDeactivate for if', () => {
    component.createMileageModel.routingUrl = nextState.url;
    component.createMileageModel.createMileageForm.markAsDirty();
    component.createMileageModel.isDetailsSaved = false;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });
  it('it should call canDeactivate for else', () => {
    component.createMileageModel.createMileageForm.markAsUntouched();
    component.createMileageModel.isDetailsSaved = true;
    component.createMileageModel.routingUrl = nextState.url;
    component.canDeactivate(canDeactivateGuardService, route, state, nextState);
    expect(component.canDeactivate).toBeTruthy();
  });
  it('it should call onPopupYes', () => {
    component.createMileageModel.customerAgreement = customerAgreement;
    const router: Router = fixture.debugElement.injector.get(
      Router
    );
    component.createMileageModel.routingUrl = nextState.url;
    spyOn(router, 'navigate');
    component.onPopupYes();
  });
  it('it should call onPopupNo', () => {
    component.createMileageModel.isChangesSaving = true;
    component.createMileageModel.isSaveChanges = false;
    component.onPopupNo();
  });
  it('it should call handleError', () => {
    const errorResponse = {
      error: {
        error: {
          errors: {
            errorType: 'errorString',
            errorMessage: 'errorMsg'
          }
        }
      }
    };
    component.handleError(errorResponse);
  });
  it('it should call handleErrorelse', () => {
    const errorResponse = {
      error: {
        error: {
        }
      }
    };
    component.handleError(errorResponse);
  });
  it('it should call onChangeCheckboxValue', () => {
    component.createMileageModel.createRequestParam.mileageSystemParameters.mileageSystemParameters = {
      'effectiveDate': '2019-05-24',
      'expirationDate': '2099-12-31',
      'mileageParameterSelectIndicator': 'Y',
      'mileageSystemParameterAssociationID': 1,
      'mileageSystemParameterID': 1,
      'mileageSystemParameterName': 'Mixed Geography'
    };
    component.createMileageModel.systemParameters = [{
      label: {
        'mileageParameterSelectIndicator': 'Y',
        'mileageSystemParameterAssociationID': 2,
        'mileageSystemParameterID': 2,
        'mileageSystemParameterName': 'Mixed Geography'
      },
      'value': 'Mixed Geography'
  }];
    const data = {
      label: {
        'mileageParameterSelectIndicator': 'Y',
        'mileageSystemParameterAssociationID': 1,
        'mileageSystemParameterID': 1,
        'mileageSystemParameterName': 'Mixed Geography'
      },
      'value': 'Mixed Geography'
    };
    const event = true;
    component.onChangeCheckboxValue(event, data);
  });
  it('it should call onChangeCheckboxValueelse', () => {
    component.createMileageModel.createRequestParam.mileageSystemParameters.mileageSystemParameters = {
      'effectiveDate': '2019-05-24',
      'expirationDate': '2099-12-31',
      'mileageParameterSelectIndicator': 'Y',
      'mileageSystemParameterAssociationID': 1,
      'mileageSystemParameterID': 1,
      'mileageSystemParameterName': 'Mixed Geography'
    };
    component.createMileageModel.systemParameters = [{
        label: {
          'mileageParameterSelectIndicator': 'Y',
          'mileageSystemParameterAssociationID': 2,
          'mileageSystemParameterID': 2,
          'mileageSystemParameterName': 'Mixed Geography'
        },
        'value': 'Mixed Geography'
    }];
    const data = {
      label: {
        'mileageParameterSelectIndicator': 'Y',
        'mileageSystemParameterAssociationID': 2,
        'mileageSystemParameterID': 2,
        'mileageSystemParameterName': 'Mixed Geography'
      },
      'value': 'Mixed Geography'
    };
    const event = false;
    component.onChangeCheckboxValue(event, data);
  });
  it('it should call checkValuesOfEachControls', () => {
    component.createMileageModel.agreementDefaulFlag = true;
    component.checkValuesOfEachControls('Agreement');
  });
  it('it should call checkValuesOfEachControlselse', () => {
    component.createMileageModel.agreementDefaulFlag = false;
    component.checkValuesOfEachControls('Agreement');
  });
  it('it should call onMileageTabChange', () => {
    const tabChangeEventMock = {
      'index': 1,
      option: {
        'label': 'Contract',
        value: 'Contract',
      }
    };
    component.createMileageModel.createMileageForm.controls.mileageLevel.setValue('Contract');
    component.onMileageTabChange(tabChangeEventMock);
  });
  it('it should call onMileageTabChangeelse', () => {
    const tabChangeEventMock = {
      'index': 1,
      option: {
        'label': 'Contract',
        value: 'Contract',
      }
    };
    component.createMileageModel.createMileageForm.controls.mileageLevel.setValue('Agreement');
    component.onMileageTabChange(tabChangeEventMock);
  });
  it('it should call onMileageTabChangeelse case Contract', () => {
    const tabChangeEventMock = {
      'index': 1,
      option: {
        'label': 'Agreement',
        value: 'Agreement',
      }
    };
    component.createMileageModel.createMileageForm.controls.mileageLevel.setValue('Contract');
    component.onMileageTabChange(tabChangeEventMock);
  });
  it('it should call onMileageTabChangeelse case Section', () => {
    const tabChangeEventMock = {
      'index': 1,
      option: {
        'label': 'Agreement',
        value: 'Agreement',
      }
    };
    component.createMileageModel.createMileageForm.controls.mileageLevel.setValue('Section');
    component.onMileageTabChange(tabChangeEventMock);
  });
  it('it should call onClickCreateMileagePopupYes', () => {
    component.onClickCreateMileagePopupYes();
  });
  it('it should call removeDirty', () => {
    component.createMileageModel.routingUrl = '/viewagreement';
    component.removeDirty();
  });
  it('it should call removeDirty', () => {
    component.createMileageModel.routingUrl = '/searchagreement';
    component.removeDirty();
  });
  it('should create loadDomainAttributes()', () => {
    component.createMileageModel.systemList = [];
    component.createMileageModel.calculationType = [];
    component.createMileageModel.routeType = [];
    component.loadDomainAttributes(component.createMileageModel.domainAttributes);
  });
  it('should create patchInputFields()', () => {
    component.patchInputFields(dataForEdit);
  });
  it('should create onFormValueChange()', () => {
    component.onFormValueChange();
  });
  it('should create setAuditDetails()', () => {
    component.createMileageModel.editDetails = dataForEdit;
    component.setAuditDetails();
  });
  it('should create affliationValidation()', () => {
    component.selectedSections = [];
    component.affliationValidation();
  });
  it('should create frameCreateReqParam()', () => {
    component.frameCreateReqParam();
  });
  it('should create frameEditReqParam()', () => {
    component.frameEditReqParam();
  });
  it('should create editMileageProgram()', () => {
  const editSuccessMessage = {
    'status' : 'Success',
    'message' : 'You have edited the Program successfully.'
  };
  component.createMileageModel.customerAgreement = {
    tenantID: 1234,
    ultimateParentAccountID: 124,
    customerAgreementName: 'abc',
    customerAgreementID: 123,
    effectiveDate: '01/01/2000',
    expirationDate: '01/01/2000',
    customerAgreementOwnerships: [],
    lastUpdateTimestampString: 'abc',
    _links: null
  };
  component.createMileageModel.editDetails = dataForEdit;
  spyOn(createMileageService, 'editMileageService').and.returnValues(of(editSuccessMessage));
  component.editMileageProgram(editReqParam);
  });
  it('should create iterateSystemParameters()', () => {
    const systemParameters = [
      {
        'mileageSystemParameterID': 3,
        'mileageSystemParameterName': 'Tolls',
        'mileageSystemParameterAssociationID': 3,
        'mileageParameterSelectIndicator': 'N'
      },
      {
        'mileageSystemParameterID': 4,
        'mileageSystemParameterName': 'Avoid Tolls',
        'mileageSystemParameterAssociationID': 4,
        'mileageParameterSelectIndicator': 'N'
      }
    ];
    component.createMileageModel.createRequestParam = editReqParam;
    component.iterateSystemParameters(systemParameters);
  });
  it('it should call onCompleteDropdown', () => {
    const event = {
      'query': 'test'
    };
    component.createMileageModel.calculationType = [
      {
        'label': {
          'mileageCalculationTypeID': 1,
          'mileageCalculationTypeName': 'Construct'
        },
        'value': 'Construct'
      }
    ];
    component.createMileageModel.calculationTypeList = [];
    component.onCompleteDropdown(event, 'calculationTypeList', 'calculationType');
  });

  it('should create getValidDate()', () => {
    component.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(new Date('2019-08-26T03:24:00'));
    component.createMileageModel.createMileageForm.controls['expirationDate'].setValue(new Date('2019-08-24T03:24:00'));
    component.createMileageModel.effectiveMinDate = new Date('2019-08-26T03:24:00');
    CreateMileageUtility.getValidDate(component.createMileageModel);
  });

  it('should create onSelectExpDate()', () => {
    component.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(new Date('2019-08-26T03:24:00'));
    component.createMileageModel.createMileageForm.controls['expirationDate'].setValue(new Date('2019-08-24T03:24:00'));
    component.createMileageModel.expirationMaxDate = new Date('2019-08-26T03:24:00');
    component.createMileageModel.effectiveMinDate = new Date('2019-08-26T03:24:00');
    CreateMileageUtility.onSelectExpDate(component.createMileageModel);
  });

  it('should create viewReset()', () => {
    component.createMileageModel.createMileageForm = createMileageForm;
    CreateMileageUtility.viewReset(component.createMileageModel);
  });

  it('should create frameSystemParameterReq()', () => {
    component.createMileageModel.systemParameters = [{
      label: {
        'mileageSystemParameterID': 1234,
        'mileageSystemParameterAssociationID': 234,
        'mileageSystemParameterName': 'abc',
        'mileageParameterSelectIndicator': 'Y'
      },
      value: 'abcd'
    }];
    CreateMileageUtility.frameSystemParameterReq(component.createMileageModel);
  });

  it('should create frameCarriers()', () => {
    component.createMileageModel.carrierList = [
      {
        label: {
          id: 2,
          code: 'test',
          name: 'abc'
        },
        value: 'abc'
      }];
    CreateMileageUtility.frameCarriers(component.createMileageModel.carrierList);
  });

  it('should create patchValuesForEdit()', () => {
    component.createMileageModel.createMileageForm = createMileageForm;
    dataForEdit.agreementDefaultIndicator = 'Y';
    CreateMileageUtility.patchValuesForEdit(dataForEdit, component.createMileageModel);
  });

  it('should create patchValuesForEdit() for else', () => {
    component.createMileageModel.createMileageForm = createMileageForm;
    dataForEdit.agreementDefaultIndicator = 'N';
    CreateMileageUtility.patchValuesForEdit(dataForEdit, component.createMileageModel);
  });

  it('should create setCarrierRequest()', () => {
    component.createMileageModel.createMileageForm = createMileageForm;
    const event: any = {
      label: {
        id: 2,
        code: 'test',
        name: 'abc'
      },
      value: 'abc'
    };
    CreateMileageUtility.setCarrierRequest(event, component.createMileageModel);
  });

  it('should create setAgreementDefaultForEditParam()', () => {
    component.createMileageModel.createMileageForm.controls['agreementDefault'].setValue('Y');
    CreateMileageUtility.setAgreementDefaultForEditParam(component.createMileageModel);
  });

  it('should create setAgreementDefaultForEditParam() for else', () => {
    component.createMileageModel.createMileageForm.controls['agreementDefault'].setValue('N');
    CreateMileageUtility.setAgreementDefaultForEditParam(component.createMileageModel);
  });
});
