import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { configureTestSuite } from 'ng-bullet';


import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { AppModule } from './../../../../app.module';
import { of, throwError } from 'rxjs';

import { ContractItemComponent } from './contract-item.component';
import { ContractItemService } from './services/contract-item.service';
import { ContractItemUtility } from './services/contract-item.utility';
import { ContractItemModel } from './models/contract-item.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('ContractItemComponent', () => {
  let component: ContractItemComponent;
  let fixture: ComponentFixture<ContractItemComponent>;
  let contractItemService: ContractItemService;
  let messageService: MessageService;
  let contractForm: FormGroup;
  let contractItemModel: ContractItemModel;
  const formBuilder: FormBuilder = new FormBuilder();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, ContractItemService, MessageService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractItemComponent);
    component = fixture.componentInstance;
    contractItemService = fixture.debugElement.injector.get(ContractItemService);
    messageService = TestBed.get(MessageService);
    component = fixture.componentInstance;
    component.agreementID = 12;
    contractItemModel = new ContractItemModel();
    component.contractItemModel = contractItemModel;
    component.contractItemModel.agreementDetails = {
      'customerAgreementID': 60,
      'customerAgreementName': 'Hager Motors (HASAC5)',
      'agreementType': 'Customer',
      'ultimateParentAccountID': 44111,
      'currencyCode': 'USD',
      'cargoReleaseAmount': 100000.0000,
      'businessUnits': ['JBI', 'JBT', 'ICS', 'DCS'],
      'taskAssignmentIDs': null,
      'effectiveDate': '1995-01-01',
      'expirationDate': '2099-12-31',
      'invalidIndicator': 'N',
      'invalidReasonTypeName': 'Active'
    };
    contractForm = formBuilder.group({
      contractType: ['', Validators.required],
      contractId: ['', Validators.required],
      description: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      notes: ['']
    });
    component.contractItemModel.contractForm = contractForm;
    component.contractItemModel.contractForm.controls['effectiveDate'].setValue('01/01/2018');
    component.contractItemModel.contractForm.controls['expirationDate'].setValue('01/01/2018');
    component.contractItemModel.contractForm.controls['contractType'].setValue({
      label: 'Transactional',
      value: 3
    });
    component.contractItemModel.contractForm.controls['contractId'].setValue('1584');
    component.contractItemModel.contractForm.controls['description'].setValue('Test Description');
    component.contractItemModel.contractForm.controls['notes'].setValue('Test Notes');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    const agreemententDetailsResponse = {
      'customerAgreementID': 119,
      'customerAgreementName': 'B & G Truck Line (BGGR)',
      'agreementType': 'Customer',
      'ultimateParentAccountID': 1202,
      'currencyCode': 'USD',
      'cargoReleaseAmount': 100000.0000,
      'businessUnits': ['JBI', 'JBT', 'ICS', 'DCS'],
      'taskAssignmentIDs': null,
      'effectiveDate': '1995-01-01',
      'expirationDate': '2099-12-31',
      'invalidIndicator': 'N',
      'invalidReasonTypeName': 'Active'
    };
    const ContractTypeResponse = {
      '_embedded': {
        'contractTypes': [{
          'contractTypeID': 1,
          'contractTypeName': 'Legal',
          '_links': {
            'self': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/contracttypes/1'
            },
            'contractType': {
              'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/contracttypes/1{?projection}',
              'templated': true
            }
          }
        }]
      },
      '_links': {
        'self': {
          'href': 'https://pricing-test.jbhunt.com/pricingconfigurationservices/contracttypes/search/contracttypes?activeBy=2019-04-30'
        }
      }
    };
    spyOn(contractItemService, 'getAgreementDetails').and.returnValues(of(agreemententDetailsResponse));
    spyOn(contractItemService, 'getContractType').and.returnValues(of(ContractTypeResponse));
    component.ngOnInit();
  });
  it('should call initializeForm', () => {
    component.initializeForm();
  });
  it('should call onContractTypeSelected', () => {
    const selectedContractType = {
      label: 'Transactional',
      value: 3
    };
    component.onContractTypeSelected(selectedContractType);
  });
  it('should call contractTypeManipulation', () => {
    const selectedContractType = {
      label: 'Transactional',
      value: 3
    };
    component.contractItemModel.contractForm.controls['contractId'].setValue(null);
    component.contractItemModel.contractForm.controls['contractId'].setValidators(null);
    component.contractTypeManipulation(selectedContractType);
  });
  it('should call contractTypeManipulation', () => {
    const selectedContractType = {
      label: 'tariff',
      value: 3
    };
    component.contractItemModel.contractForm.controls['contractId'].setValue(null);
    component.contractItemModel.contractForm.controls['contractId'].setValidators(null);
    component.contractTypeManipulation(selectedContractType);
  });
  it('should call contractTypeManipulation', () => {
    const selectedContractType = {
      label: 'legal',
      value: 3
    };
    component.contractItemModel.contractForm.controls['contractId'].setValue(null);
    component.contractItemModel.contractForm.controls['contractId'].setValidators(null);
    component.contractTypeManipulation(selectedContractType);
  });
  it('should call onSave', () => {
    component.onSave();
  });

  it('should call onSelectEffDate', () => {
    component.contractItemModel.inCorrectExpDateFormat = false;
    component.contractItemModel.contractForm.controls['effectiveDate'].setValue(new Date());
    component.contractItemModel.contractForm.controls['expirationDate'].setValue(new Date());
    component.contractItemModel.effectiveMinDate = new Date();
    component.contractItemModel.expirationMaxDate = new Date();
    component.onSelectEffDate();
  });

  it('should call onTypeDate', () => {
    component.contractItemModel.contractForm.patchValue({
      effectiveDate: new Date(), expirationDate: new Date()
    });
    component.contractItemModel.effectiveMinDate = new Date();
    component.contractItemModel.expirationMaxDate = new Date();
    component.contractItemModel.agreementDetails.effectiveDate = '01/01/2019';
    component.contractItemModel.agreementDetails.expirationDate = '01/01/2019';
    component.onTypeDate('01/01/2109', 'effective');
    component.onTypeDate('01/01/2019', 'expiration');
  });
  it('should call onTypeDate', () => {
    component.contractItemModel.contractForm.patchValue({
      effectiveDate: new Date(), expirationDate: new Date()
    });
    component.onTypeDate('', 'effective');
    component.onTypeDate('', 'expiration');
  });
  it('should call saveContract', () => {
    const saveContractReq = {
      createAgreementFlow: true,
      customerAgreementContractID: null,
      customerAgreementContractTypeID: 1,
      customerAgreementContractTypeName: 'Legal',
      customerAgreementContractVersionID: null,
      customerAgreementID: 119,
      customerContractComment: 'TEST',
      customerContractName: 'TEST',
      customerContractNumber: '23',
      effectiveDate: '2019-04-30',
      expirationDate: '2019-04-30'
    };
    const saveContractRespone = {
      createProgramName: 'Abishake Rajamanickam',
      createTimestamp: '2019-04-30T11:57:08.961',
      createUserId: 'rcon958',
      customerAgreementContractID: 445,
      customerAgreementContractTypeID: 1,
      customerAgreementContractTypeName: 'Legal',
      customerAgreementContractVersionID: 445,
      customerAgreementID: 119,
      customerContractComment: 'TEST',
      customerContractName: 'TEST',
      customerContractNumber: '23',
      effectiveDate: '2019-04-30',
      expirationDate: '2019-04-30',
      lastUpdateProgramName: 'Abishake Rajamanickam',
      lastUpdateTimestamp: '2019-04-30T11:57:08.961',
      lastUpdateUserID: 'rcon958',
      originalEffectiveDate: null,
      originalExpirationDate: null,
      status: null
    };
    spyOn(contractItemService, 'saveContracts').and.returnValues(of(saveContractRespone));
    component.contractItemModel.pageLoading = true;
    component.contractItemModel.pageLoading = false;
    component.saveContract(saveContractReq);
  });

  it('should call getContractId', () => {
    component.contractItemModel.tariffContractId = '1583';
    component.contractItemModel.tariffContractId = '';
    spyOn(contractItemService, 'getContractId').and.returnValues(of(23));
    component.getContractId();
  });

  it('should call onClose', () => {
    component.onClose();
  });

  it('should call onDontSave', () => {
    component.onDontSave();
  });

  it('should call closeContract', () => {
    component.closeContract();
  });

  it('should call closeContractOnCreate', () => {
    component.closeContractOnCreate();
  });
  it('should call onClickPopupYes', () => {
    component.contractItemModel.isCancelClicked = true;
    component.onClickPopupYes();
  });
  it('should call onClickPopupYes', () => {
    component.contractItemModel.isCancelClicked = false;
    component.onClickPopupYes();
  });

  it('should call ContractItemUtility.onSelectExpDate', () => {
    component.contractItemModel.inCorrectExpDateFormat = false;
    component.contractItemModel.contractForm.controls['effectiveDate'].setValue(new Date());
    component.contractItemModel.contractForm.controls['expirationDate'].setValue(new Date());
    component.contractItemModel.effectiveMinDate = new Date();
    component.contractItemModel.expirationMaxDate = new Date();
    ContractItemUtility.onSelectExpDate(contractItemModel);
  });

  it('should call ContractItemUtility.warningMessage', () => {
    ContractItemUtility.warningMessage(messageService);
  });


  it('should call ContractItemUtility.toastMessage', () => {
    ContractItemUtility.toastMessage(messageService, 'success', 'Contract has been created successfully');
  });

  it('should call ContractItemUtility.validateDateFormat', () => {
    component.contractItemModel.contractForm.patchValue({
      effectiveDate: new Date(), expirationDate: new Date()
    });
    component.contractItemModel.effectiveMinDate = new Date();
    component.contractItemModel.expirationMaxDate = new Date();
    component.contractItemModel.agreementDetails.effectiveDate = '01/01/2019';
    component.contractItemModel.agreementDetails.expirationDate = '01/01/2019';
    ContractItemUtility.validateDateFormat('12/12/2019', 'effective', component.contractItemModel);
    ContractItemUtility.validateDateFormat('12/12/xyz', 'effective', component.contractItemModel);
    ContractItemUtility.validateDateFormat('12/12/abc', 'expiration', component.contractItemModel);
  });

  it('should call ContractItemUtility.getValidDate', () => {
    component.contractItemModel.contractForm.controls['effectiveDate'].setValue(new Date());
    component.contractItemModel.effectiveMinDate = new Date();
    ContractItemUtility.getValidDate(contractItemModel);
  });
  it('should call getAgreementData', () => {
    const mockAgreementDetails = {
      'customerAgreementID': 144,
      'customerAgreementName': '55 Ferris Associates Inc. (SSBR22)',
      'agreementType': 'Customer',
      'ultimateParentAccountID': 20,
      'currencyCode': 'USD',
      'cargoReleaseAmount': 100000.0000,
      'businessUnits': ['JBI', 'JBT', 'ICS', 'DCS'],
      'taskAssignmentIDs': null,
      'effectiveDate': '1995-01-01',
      'expirationDate': '2099-12-31',
      'invalidIndicator': 'N',
      'invalidReasonTypeName': 'Active',
      'teams': 'string'
    };
    spyOn(contractItemService, 'getAgreementDetails').and.returnValues(of(mockAgreementDetails));
    component.getAgreementData();
  });
  it('should call getAgreementData', () => {
    const mockEmptyAgreementDetails = {};
    spyOn(contractItemService, 'getAgreementDetails').and.returnValues(of(mockEmptyAgreementDetails));
    component.getAgreementData();
  });
  it('should call getAgreementData For Error Response', ()  =>  {
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
    spyOn(contractItemService, 'getAgreementDetails').and.returnValues(throwError(err));
    component.getAgreementData();
  });
  it('should call getContractId', () => {
    component.contractItemModel.tariffContractId = null;
    const contractId = 2712;
    spyOn(contractItemService, 'getContractId').and.returnValues(of(contractId));
    contractItemModel.contractForm.controls['contractId'].setValue(component.contractItemModel.tariffContractId);
    contractItemModel.contractForm.controls['contractId'].setValidators(null);
    component.getContractId();
  });
  it('should call getContractId', () => {
    component.contractItemModel.tariffContractId = '15';
    contractItemModel.contractForm.controls['contractId'].setValue(component.contractItemModel.tariffContractId);
    contractItemModel.contractForm.controls['contractId'].setValidators(null);
    component.getContractId();
  });
  it('should call getContractId', () => {
    const errorValue = {
      error: {
        message: 'failed'
      }
    };
    spyOn(contractItemService, 'getContractId').and.returnValues(throwError(errorValue));
    component.getContractId();
  });
  it('should call clickPopUpOnRoute', () => {
    contractItemModel.routerUrl = '/viewagreement';
    component.clickPopUpOnRoute();
  });
  it('should call clickPopUpOnRoute', () => {
    contractItemModel.routerUrl = '/searchagreement';
    component.clickPopUpOnRoute();
  });
  it('should call ContractItemUtility.handleError', () => {
    const error = {
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
    ContractItemUtility.handleError(error, component.contractItemModel, messageService, component.changeDetector);
  });
});
