import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { CreateCarrierMileageService } from './service/create-carrier-mileage.service';
import { MileageSystemParameters } from './models/create-carrier-mileage.interface';
import { MileageSystemVersions } from './models/create-carrier-mileage.interface';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { CanDeactivateGuardService } from '../../../../shared/jbh-app-services/can-deactivate-guard.service';
import { LocalStorageService } from './../../../../shared/jbh-app-services/local-storage.service';
import { CreateCarrierMileageComponent } from './create-carrier-mileage.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../../../../app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { ViewCarrierAgreementModule } from '../../view-carrier-agreement.module';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CreateCarrierMileageUtility } from './service/create-carrier-mileage-utility';
import { stringify } from '@angular/compiler/src/util';
import { componentFactoryName } from '@angular/compiler';
import { Messages } from '../../../../../../src/config/messages.config';

describe('CreateCarrierMileageComponent', () => {
  let component: CreateCarrierMileageComponent;
  let fixture: ComponentFixture<CreateCarrierMileageComponent>;
  const formBuilder = new FormBuilder();
  let createMileageForm: FormGroup;
  let carrierAgreement: any;
  let canDeactivateGuardService: CanDeactivateGuardService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;
  let broadcasterService: BroadcasterService;
  let messageService: MessageService;
  let httpService: HttpClient;
  const carrierCheckCounter = 0;
  const response = {
    'name': 'dasd',
    'id': null,
    'agreementDefault': 'N',
    'contractDefault': 'Y',
    'businessUnitCodes': null,
    'carrierAgreementSections': null,
    'carriers': [
    ],
    'distanceUnit': {
      'code': 'Miles',
      'description': 'Miles'
    },
    'decimalPrecisionIndicator': 'N',
    'borderCrossingParameter': {
      'borderCrossingParameterID': 1,
      'borderCrossingParameterName': 'Miles to border'
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
        'mileageSystemParameterName': 'Tolls'
      },
      {
        'mileageSystemParameterID': 4,
        'mileageSystemParameterName': 'Avoid Tolls'
      }
    ]
  };
  const setDefaults = {
    'carrierSegment': {
      'label': 1,
      'value': 'Dray'
    },
    'businessUnit': {
      'label': 'JBI',
      'value': 'JBI'
    },
    'mileageProgramName': '',
    'system': '',
    'systemVersion': '',
    'distanceUnit': {
      'label': 1,
      'value': 'Miles'
    },
    'geographyType': {
      'label': 1,
      'value': 'City State'
    },
    'routeType': {
      'label': 2,
      'value': 'Shortest'
    },
    'calculationType': {
      'label': 1,
      'value': 'Construct'
    },
    'effectiveDate': '1994-12-31T00:00:00.000Z',
    'expirationDate': '2099-12-30T00:00:00.000Z',
    'carrier': '',
    'decimalPrecisionIndicator': false,
    'agreementDefaultIndicator': '',
    'borderCrossingParameter': '',
    'sectionsRowDataField': '',
    'notes': '',
    'systemdd': '',
    'mileageSystemParameters': '',
    'mileageLevel': 'No Affiliation'
  };
  configureTestSuite(() => {
    const changeDetectorRefStub = { detectChanges: () => ({}) };
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, AppModule, ViewCarrierAgreementModule, RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: ChangeDetectorRef, useValue: changeDetectorRefStub },
      { provide: APP_BASE_HREF, useValue: '/' }, CanDeactivateGuardService,
      { provide: RouterStateSnapshot, useValue: CreateCarrierMileageComponent },
      { provide: ActivatedRouteSnapshot, useValue: CreateCarrierMileageComponent }],
      declarations: [],
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCarrierMileageComponent);
    component = fixture.componentInstance;
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
    carrierAgreement = {
      tenantID: 1234,
      ultimateParentAccountID: 124,
      carrierAgreementName: 'abc',
      carrierAgreementID: 123,
      effectiveDate: '01/01/2000',
      expirationDate: '01/01/2000',
      carrierAgreementOwnerships: [],
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
              'mileageSystemVersionName': '18'
            },
            {
              'mileageSystemVersionID': 7,
              'mileageSystemVersionName': '19'
            }
          ],
          'mileageSystemParameters': [
            {
              'mileageSystemParameterID': 1,
              'mileageSystemParameterName': 'Mixed Geography'
            }
          ]
        }
      ],
      'borderCrossingParameter':
      {
        'borderCrossingParameterID': 1,
        'borderCrossingParameterName': 'Miles to border'
      },
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
  it('should create', () => {
    component.agreementID = '150';
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('will have the both `ViewChild`s defined', () => {
    expect(fixture.componentInstance.effectiveCal).toBeDefined();
    expect(fixture.componentInstance.expirationCal).toBeDefined();
  });
  it('should call createMileageFormInitialization', () => {
    component.createMileageFormInitialization();
  });
  it('should call getAgreementDetails', () => {
    const carrier = {
      'agreementType': 'Carrier',
      'agreementName': 'Heston Group III',
      'agreementStatus': 'Active',
      'agreementEffectiveDate': '1994-12-31',
      'agreementExpirationDate': '2099-12-30',
      'carriers': [
        {
          'carrierID': 111113,
          'carrierName': 'Heston Group III',
          'carrierCode': 'hegr01'
        }
      ]
    };
    const agreementId = 158;
    const createMileageService: CreateCarrierMileageService = fixture.debugElement.injector.get(CreateCarrierMileageService);
    spyOn(createMileageService, 'fetchAgreementDetailsBycarrierAgreementId').and.returnValues(of(carrier));
    component.getAgreementDetails(agreementId);
  });
  it('it should call getCarrierList', () => {
    const agreement = {
      'agreementType': 'Carrier',
      'agreementName': 'Bear & Cub Shipping LLC',
      'agreementStatus': 'Active',
      'agreementEffectiveDate': '1994-12-31',
      'agreementExpirationDate': '2099-12-30',
      'carriers': [{
        'carrierID': 1,
        'carrierName': 'willacarr 1',
        'carrierCode': '111'
      },
      {
        'carrierID': 2,
        'carrierName': 'willacarr 2',
        'carrierCode': '222'
      }]
    };
    component.getCarrierList(agreement);
  });
  it('should call populateInputFields', () => {
    spyOn(component, 'getLengthMeasurementCode').and.callFake(() => {
    });
    spyOn(component, 'getGeographyPointTypes').and.callFake(() => {
    });
    spyOn(component, 'getBusinessUnitList').and.callFake(() => {
    });
    spyOn(component, 'getDomainAttributes').and.callFake(() => {
    });
    component.populateInputFields();
  });
  it('it should call getLengthMeasurementCode', () => {
    const lengthdata = [{
      'label': 'Kilometers',
      'value': 1
    }];
    const createMileageService: CreateCarrierMileageService = fixture.debugElement.injector.get(
      CreateCarrierMileageService
    );
    spyOn(createMileageService, 'getUnitOfLengthMeasurement').and.returnValues(of(lengthdata));
    component.getLengthMeasurementCode();
  });
  it('should call getGeographyPointTypes', () => {
    const getGeographyPointTypesResponse = [
      {
        geographicPointTypeID: 1,
        geographicPointTypeName: 'City State'
      },
      {
        geographicPointTypeID: 2,
        geographicPointTypeName: '5-Zip'
      }
    ];
    const createMileageService: CreateCarrierMileageService = fixture.debugElement.injector.get(CreateCarrierMileageService);
    spyOn(createMileageService, 'getMileageGeographyAttributes').and.returnValues(of(getGeographyPointTypesResponse));
    component.getGeographyPointTypes();
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
    const createMileageService: CreateCarrierMileageService = fixture.debugElement.injector.get(
      CreateCarrierMileageService
    );
    spyOn(createMileageService, 'getBusinessUnit').and.returnValues(of(datanew));
    component.getBusinessUnitList();
  });
  it('should call getDomainAttributes', () => {
    const getDomainAttributesResponse = {
      'mileageCalculationTypes': [
        {
          'mileageCalculationTypeID': 1,
          'mileageCalculationTypeName': 'Construct',
          'effectiveDate': '2019-05-24',
          'expirationDate': '2099-12-31'
        }
      ],
      'mileageRouteTypes': [
        {
          'mileageRouteTypeID': 1,
          'mileageRouteTypeName': 'Practical',
          'expirationDate': '2099-12-31',
          'effectiveDate': '2019-05-24'
        }
      ],
      'mileageSystems': [
        {
          'mileageSystemID': 1,
          'mileageSystemName': 'Rand McNally',
          'effectiveDate': '2019-05-24',
          'expirationDate': '2099-12-31',
          'mileageSystemVersions': [
            {
              'mileageSystemVersionID': 6,
              'mileageSystemVersionName': '18',
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
      'geographicPointTypes': [
        {
          'geographicPointTypeID': 1,
          'geographicPointTypeName': 'City State'
        },
        {
          'geographicPointTypeID': 2,
          'geographicPointTypeName': '5Zip'
        }
      ],
      'unitOfLengthMeasurements': [
        {
          'code': 'Mile',
          'description': 'Mile'
        },
        {
          'code': 'Kilometer',
          'description': 'Kilometer'
        }
      ]
    };
    const createMileageService: CreateCarrierMileageService = fixture.debugElement.injector.get(CreateCarrierMileageService);
    spyOn(createMileageService, 'getMileageDomainAttributes').and.returnValues(of(getDomainAttributesResponse));
    component.getDomainAttributes();
  });
  it('it should call patchDefaultValues', () => {
    const Event = [
      {
        label: 123,
        value: 'abc'
      }];
    component.patchDefaultValues();
  });
  it('it should call onSelectDropdown with switch case 1', () => {
    const Event = {
      label: 'label',
      value: 'value'
    };
    const id = 1234;
    const name = 'abc';
    const selectedField = 'distanceUnit';
    component.onSelectDropdown(Event, selectedField);
    expect(component.onSelectDropdown).toBeTruthy();
  });
  it('it should call onSelectDropdown with  case 2', () => {
    const Event = {
      label: 'label',
      value: 'value'
    };
    const selectedField = 'carrierSegment';
    component.onSelectDropdown(Event, selectedField);
    expect(component.onSelectDropdown).toBeTruthy();
  });
  it('it should call onSelectDropdown with default switch case', () => {
    const Event = {
      id: 'label1',
      name: 'value1'
    };
    const selectedField = 'newDumy';
    component.createMileageModel.createRequestParam[selectedField] = {
      id: 'label1',
      name: 'value1'
    };
    component.onSelectDropdown(Event, selectedField);
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
    const Event = {
      label: 1,
      value: 'Rand McNally'
    };
    component.onSelectSystemName(Event);
    expect(component.onSelectSystemName).toBeTruthy();
  });
  it('it should call onSelectSystemVersion', () => {
    const Event = {
      label: 123,
      value: 'value'
    };
    component.onSelectSystemVersion(Event);
    expect(component.onSelectSystemVersion).toBeTruthy();
  });
  it('it should call onChangedecimalPrecisionIndicator', () => {
    const Event = {
      checked: true
    };
    component.onChangedecimalPrecisionIndicator(Event);
    expect(component.onChangedecimalPrecisionIndicator).toBeTruthy();
  });
  it('it should call onChangeAgreementDefault', () => {
    const Event = {
      checked: true
    };
    component.createMileageModel.carrierAgreement = carrierAgreement;
    component.onChangeAgreementDefault(Event);
  });
  it('it should call onChangeAgreementDefault', () => {
    const Event = {
      checked: false
    };
    component.createMileageModel.carrierAgreement = carrierAgreement;
    component.onChangeAgreementDefault(Event);
  });
  it('it should call onDateSelected effectiveDate', () => {
    const Event = '01/01/2000';
    const dateSelected = 'effectiveDate';
    component.createMileageModel.carrierAgreement = carrierAgreement;
    component.createMileageModel.effectiveDate = '01/01/2000';
    component.onDateSelected(Event, dateSelected);
    expect(component.onDateSelected).toBeTruthy();
  });
  it('it should call onDateSelected', () => {
    const Event = '01/01/2000';
    const dateSelected = 'expirationDate';
    component.createMileageModel.carrierAgreement = carrierAgreement;
    component.createMileageModel.effectiveDate = '01/01/2000';
    component.onDateSelected(Event, dateSelected);
    expect(component.onDateSelected).toBeTruthy();
  });
  it('it should call onDateSelected', () => {
    const Event = '01/01/2000';
    const dateSelected = 'expirationDate';
    component.createMileageModel.carrierAgreement = carrierAgreement;
    component.createMileageModel.effectiveDate = '';
    component.onDateSelected(Event, dateSelected);
    expect(component.onDateSelected).toBeTruthy();
  });
  it('it should call onClickBorderMilesParameter', () => {
    const Event = {
      mileageBorderMileParameterTypeID: 12,
      mileageBorderMileParameterTypeName: 'aaa'
    };
    component.onClickBorderMilesParameter(Event);
    expect(component.onClickBorderMilesParameter).toBeTruthy();
  });
  it('it should call onChangeBusinessUnit', () => {
    const Event = {
      value: ['abc', 'abc', 'abc']
    };
    component.createMileageModel.businessUnitList = [{
      label: 'abc',
      value: 'abc'
    }];
    component.onChangeBusinessUnit(Event);
    expect(component.onChangeBusinessUnit).toBeTruthy();
  });
  it('it should call onSelectCarrier', () => {
    const Event = {
      data:
      {
        label: {
          id: 1,
          code: '111'
        },
        value: 'willacarr 1',
        displayName: 'willacarr 1 (111)'
      },
      type: 'checkbox'
    };
    component.onSelectCarrier(Event);
  });
  it('it should call onDeSelectCarrier', () => {
    const Event = {
      data:
      {
        label: {
          id: 1,
          code: '111'
        },
        value: 'willacarr 1',
        displayName: 'willacarr 1 (111)'
      },
      type: 'checkbox'
    };
    component.onDeSelectCarrier(Event);
  });
  it('it should call onClickCreate', () => {
    component.createMileageModel.isPageLoaded = true;
    const messages = Messages.getMessage();
    const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
      ChangeDetectorRef
    );
    const createMileageService: CreateCarrierMileageService = fixture.debugElement.injector.get(
      CreateCarrierMileageService
    );
    messageService = fixture.debugElement.injector.get(MessageService);
    const Event = {
      value: 'abc'
    };
    const data = {
      name: '',
      contractDefault: '',
      customerAgreementSections: [123, 'asd', 123456, messages.warningMessage.mandatoryFields]
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
    const createMileageService: CreateCarrierMileageService = fixture.debugElement.injector.get(
      CreateCarrierMileageService
    );
    messageService = fixture.debugElement.injector.get(MessageService);
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
  it('it should call onClickCreate else notesNull case', () => {
    component.createMileageModel.isPageLoaded = true;
    const createMileageService: CreateCarrierMileageService = fixture.debugElement.injector.get(
      CreateCarrierMileageService
    );
    messageService = fixture.debugElement.injector.get(MessageService);
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
  it('it should call onClickCreate if', () => {
    component.createMileageModel.isSystemParametersCheckFlag = true;
    component.onClickCreate();
  });
  it('it should call onClickCreate else, if', () => {
    component.createMileageModel.isSystemParametersCheckFlag = false;
    component.onClickCreate();
  });
  it('it should call fetchSystemParameters', () => {
    component.createMileageModel.systemParameters = [{
      label: 12,
      value: 'abcd'
    }];
    component.createMileageModel.defaultSystemParameters = [{
      'mileageSystemParameterID': 1,
      'mileageSystemParameterName': 'Mixed Geography'
    }];
    component.fetchSystemParameters(component.createMileageModel.defaultSystemParameters);
  });
  it('it should call checkCarrierList', () => {
    component.createMileageModel.createRequestParam['carriers'].length = 0;
    component.checkCarrierList();
  });
  it('it should call onTypeCarrierValue', () => {
    component.createMileageModel.carrierList = [
      {
        label: {
          id: 2,
          code: 'test',
        },
        value: 'abc',
        displayName: 'aaa'
      }];
    const Event: any = {
      query: 'abc'
    };
    component.onTypeCarrierValue(Event);
  });
  it('it should call onTypeCarrierValueemty', () => {
    component.createMileageModel.carrierList = [];
    const Event: any = {
      query: 'abc'
    };
    component.onTypeCarrierValue(Event);
  });
  it('it should call getSystemDataList', () => {
    component.createMileageModel.systemList = [
      {
        label: 123,
        value: 'abc'
      }];
    const Event = {
      query: 'abc'
    };
    component.getSystemDataList(Event);
  });
  it('it should call getSystemDataListelse', () => {
    component.createMileageModel.systemList = [
      {
        label: 123,
        value: null
      }];
    const Event = {
      query: 'abc'
    };
    component.getSystemDataList(Event);
  });
  it('it should call getSystemVersionList', () => {
    const Event = {
      query: 'abc'
    };
    component.getSystemVersionList(Event);
  });
  it('it should call getSystemVersionListelse', () => {
    component.createMileageModel.systemVersion = [{
      'label': 12,
      'value': null
    }];
    const Event = {
      query: 'abc'
    };
    component.getSystemVersionList(Event);
  });
  it('it should call getMileageUnitsList', () => {
    const Event = {
      query: 'abc'
    };
    component.getMileageUnitsList(Event);
  });
  it('it should call getMileageUnitsListelse', () => {
    component.createMileageModel.distanceUnit = [
      {
        label: 123,
        value: null
      }];
    const Event = {
      query: 'abc'
    };
    component.getMileageUnitsList(Event);
  });
  it('it should call getCalculationTypeList', () => {
    component.createMileageModel.calculationType = [
      {
        label: 123,
        value: 'abc'
      }];
    const Event = {
      query: 'abc'
    };
    component.getCalculationTypeList(Event);
  });
  it('it should call getCalculationTypeListelse', () => {
    component.createMileageModel.calculationType = [
      {
        label: 123,
        value: null
      }];
    const Event = {
      query: 'abc'
    };
    component.getCalculationTypeList(Event);
  });
  it('it should call getGeographyTypeList', () => {
    component.createMileageModel.geographyType = [
      {
        label: 123,
        value: 'abc'
      }];
    const Event = {
      query: 'abc'
    };
    component.getGeographyTypeList(Event);
  });
  it('it should call getGeographyTypeListelse', () => {
    component.createMileageModel.geographyType = [
      {
        label: 123,
        value: null
      }];
    const Event = {
      query: 'abc'
    };
    component.getGeographyTypeList(Event);
  });
  it('it should call getRouteTypeList', () => {
    component.createMileageModel.routeType = [
      {
        label: 123,
        value: 'abc'
      }];
    const Event = {
      query: 'abc'
    };
    component.getRouteTypeList(Event);
  });
  it('it should call getRouteTypeListelse', () => {
    component.createMileageModel.routeType = [
      {
        label: 123,
        value: null
      }];
    const Event = {
      query: 'abc'
    };
    component.getRouteTypeList(Event);
  });
  it('it should call onSelectEffDate', () => {
    component.createMileageModel.carrierAgreement = carrierAgreement;
    const varia = new Date('1995-12-17T03:24:00');
    component.createMileageModel.expirationMaxDate = varia;
    component.createMileageModel.effectiveMinDate = varia;
    component.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(new Date(varia));
    const eddDateValue = component.createMileageModel.createMileageForm.controls['effectiveDate'].value;
    component.createMileageModel.isCorrectEffDateFormat = false;
    const Event = {
      srcElement: {
        value: '05/06/1995'
      }
    };
    CreateCarrierMileageUtility.getValidDate(component.createMileageModel);
    component.onSelectEffDate();
  });
  it('it should call onTypeDate1', () => {
    component.createMileageModel.carrierAgreement = carrierAgreement;
    const varia = new Date('1995-12-17T03:24:00');
    component.createMileageModel.expirationMaxDate = varia;
    component.createMileageModel.effectiveMinDate = varia;
    component.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(new Date(varia));
    const Event = {
      srcElement: {
        value: '05/06/1995'
      }
    };
    const fieldName = 'effectiveDate';
    CreateCarrierMileageUtility.getValidDate(component.createMileageModel);
    component.onTypeDate(Event, fieldName);
  });
  it('it should call onTypeDate1else', () => {
    component.createMileageModel.carrierAgreement = carrierAgreement;
    const varia = new Date('1995-12-17T03:24:00');
    component.createMileageModel.expirationMaxDate = varia;
    component.createMileageModel.effectiveMinDate = varia;
    component.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(new Date(varia));
    const Event = {
      srcElement: {
        value: '05/06/1995sdf.,'
      }
    };
    const fieldName = 'effectiveDate';
    CreateCarrierMileageUtility.getValidDate(component.createMileageModel);
    component.onTypeDate(Event, fieldName);
  });
  it('it should call onTypeDate2', () => {
    component.createMileageModel.carrierAgreement = carrierAgreement;
    const varia = new Date('1995-12-17T03:24:00');
    component.createMileageModel.expirationMaxDate = varia;
    component.createMileageModel.effectiveMinDate = varia;
    component.createMileageModel.createMileageForm.controls['expirationDate'].setValue(varia);
    const Event = {
      srcElement: {
        value: '05/06/1995'
      }
    };
    const fieldName = 'expirationDate';
    component.onTypeDate(Event, fieldName);
  });
  it('it should call onTypeDate2else', () => {
    component.createMileageModel.carrierAgreement = carrierAgreement;
    const varia = new Date('1995-12-17T03:24:00');
    component.createMileageModel.expirationMaxDate = varia;
    component.createMileageModel.effectiveMinDate = varia;
    component.createMileageModel.createMileageForm.controls['expirationDate'].setValue(varia);
    const Event = {
      srcElement: {
        value: '05/06/1995sdf.,'
      }
    };
    const fieldName = 'expirationDate';
    component.onTypeDate(Event, fieldName);
  });
  it('it should call onTypeDate', () => {
    const Event = {
      srcElement: {
        value: '06/05/1995'
      }
    };
    const fieldName = '';
    component.onTypeDate(Event, fieldName);
  });
  it('it should call setCalendarDate1', () => {
    const field = 'effectiveDate';
    component.setCalendarDate(field);
  });
  it('it should call setCalendarDate2', () => {
    const field = 'expirationDate';
    component.setCalendarDate(field);
  });
  it('it should call onCancel', () => {
    const activatedRoute: ActivatedRoute = fixture.debugElement.injector.get(
      ActivatedRoute
    );
    component.createMileageModel.carrierAgreement = carrierAgreement;
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
    component.createMileageModel.carrierAgreement = carrierAgreement;
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

  it('it should call onChangeCheckboxValue', () => {
    component.createMileageModel.createRequestParam['mileageSystemParameters'].push({
      'mileageSystemParameterID': 1,
      'mileageSystemParameterName': 'www'
    });
    const data: any = {
      label: 2,
      value: 'Border Open'
    };
    const Event: any = true;
    component.onChangeCheckboxValue(Event, data);
  });
  it('shoul call CreateCarrierMileageUtility.getValidDate', () => {
    component.createMileageModel.carrierAgreement = carrierAgreement;
    const varia = new Date('1995-12-17T03:24:00');
    component.createMileageModel.expirationMaxDate = varia;
    component.createMileageModel.effectiveMinDate = varia;
    component.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(new Date(varia));
    const eddDateValue = component.createMileageModel.createMileageForm.controls['effectiveDate'].value;
    component.createMileageModel.isCorrectEffDateFormat = false;
    const Event = {
      srcElement: {
        value: '05/06/1995'
      }
    };
    CreateCarrierMileageUtility.getValidDate(component.createMileageModel);
  });
  it('should call CreateCarrierMileageUtility.setFormErrors', () => {
    component.createMileageModel.carrierAgreement = carrierAgreement;
    const varia = new Date('1995-12-17T03:24:00');
    component.createMileageModel.expirationMaxDate = varia;
    component.createMileageModel.effectiveMinDate = varia;
    component.createMileageModel.createMileageForm.controls['effectiveDate'].setValue(new Date(varia));
    const eddDateValue = component.createMileageModel.createMileageForm.controls['effectiveDate'].value;
    component.createMileageModel.isCorrectEffDateFormat = false;
    const Event = {
      srcElement: {
        value: '05/06/1995'
      }
    };
    CreateCarrierMileageUtility.setFormErrors(component.createMileageModel);
  });
  it('should call onChangeMileageChange case1', () => {
    const value = 'No Affiliation';
    component.onChangeMileageChange(value);
  });
  it('should call onChangeMileageChange', () => {
    const value = 'section';
    component.onChangeMileageChange(value);
  });
  it('should call onChangeMileageChange', () => {
    const value = 'default';
    component.onChangeMileageChange(value);
  });
  it('should call checkValidFieldFilled', () => {
    const value = {
      severity: 'error',
      summary: 'errMsg',
      detail: 'You have to fill all mandatory fields'
    };
    component.checkValidFieldFilled();
  });
  it('should call getCarrierSegmentList', () => {
    component.createMileageModel.carrierSegmentFilteredList = [];
    component.createMileageModel.carrierSegmentList.forEach((carrierSegment) => {
      component.createMileageModel.carrierSegmentFilteredList.push({
        label: '1',
        value: 'ab'
      });
    });
    component.getCarrierSegmentList();
  });
  it('should call onCheckCarrierLength', () => {
    const Event: any = {
      target: {
        value: '123'
      }
    };
    component.onCheckCarrierLength(Event);
  });
  it('should call checkValidFieldFilled', () => {
    component.checkValidFieldFilled();
  });
  it('should call checkValidFieldFilled', () => {
    component.checkValidFieldFilled();
  });
  it('it should call carrierMileageChangeSection', () => {
    component.createMileageModel.isShowAgreementBillTO = false;
    component.createMileageModel.isShowAffilcation = false;
    component.createMileageModel.isShowSection = true;
    CreateCarrierMileageUtility.carrierMileageChangeSection(component.createMileageModel);
  });
});
