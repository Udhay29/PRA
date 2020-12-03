import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { LocalStorageService } from '../../../shared/jbh-app-services/local-storage.service';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../app.module';
import { CreateAgreementModule } from './../create-agreement.module';
import { AddSectionUtility } from './service/add-section-utility';
import { AddSectionService } from './service/add-section.service';
import { AddSectionComponent } from './add-section.component';
import { AgreementDetails, CustomerAgreementContractsItem, RowEvent, HitsItem } from './model/add-section.interface';
import { MessageService } from 'primeng/components/common/messageservice';
import { componentNeedsResolution } from '@angular/core/src/metadata/resource_loading';
import { Validators, FormBuilder, FormGroup, } from '@angular/forms';
import { Router } from '@angular/router';

describe('AddSectionComponent', () => {
  let component: AddSectionComponent;
  let fixture: ComponentFixture<AddSectionComponent>;
  let shared: BroadcasterService;
  let service: AddSectionService;
  let agreementDetails: AgreementDetails;
  let localStore: LocalStorageService;
  let contractIdList: CustomerAgreementContractsItem[];
  let messageService: MessageService;
  const formBuilder = new FormBuilder();
  let router: Router;
  let formGroup: FormGroup;
  const codeResponse = [{
     billingPartyID: 12,
    effectiveDate: 'string',
    expirationDate: 'string',
    billingPartyName: 'string',
    billingPartyCode: 'string',
    codes: 'string',
    isRemoved: true,
    customerAgreementContractSectionAccountID: 123}];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, CreateAgreementModule, HttpClientTestingModule],
      providers: [AddSectionUtility, AddSectionService, BroadcasterService,
         MessageService, LocalStorageService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSectionComponent);
    component = fixture.componentInstance;
    shared = TestBed.get(BroadcasterService);
    service = TestBed.get(AddSectionService);
    messageService = TestBed.get(MessageService);
    localStore = TestBed.get(LocalStorageService);
    formGroup = formBuilder.group({
      sectionName: ['', Validators.required],
      sectionType: ['', Validators.required],
      currency: ['', Validators.required],
      contractId: ['123', Validators.required],
      effectiveDate: [new Date('08-14-2019'), Validators.required],
      expirationDate: [new Date('08-14-2019'), Validators.required]
    });
    agreementDetails = {
      customerAgreementID: 943,
      effectiveDate: '1995-01-01',
      expirationDate: '2099-12-31'
    };
    localStore.setItem('createAgreement', 'detail', agreementDetails);
    contractIdList = [{
      label: '(Transactional) - rrrree',
      value: 'rrrree',
      effectiveDate: '2020-12-31',
      expirationDate: '2019-12-31',
      customerAgreementContractID: 1124,
      customerAgreementID: 943,
      customerContractName: 'rrrree',
      customerAgreementContractTypeName: 'Transactional',
      contractTypeID: '3',
      contractTypeName: 'Transactional',
      customerContractNumber: null
    }];
    component.createSectionForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call saveSubscription for if condition', () => {
    spyOn(shared, 'on').and.returnValue(of(true));
    component.saveSubscription();
  });
  it('should call saveSubscription for else condition', () => {
    component.addSectionModel.routeUrl = '/dashboard';
    spyOn(shared, 'on').and.returnValue(of(false));
    component.saveSubscription();
  });
  it('should call onDontSave', () => {
    component.onDontSave();
  });
  it('shoud call navigationCheck for next - if case', () => {
    component.addSectionModel.sectionsList = [];
    component.addSectionModel.changeText = 'next';
    component.navigationCheck();
  });
  it('shoud call navigationCheck for next - else case', () => {
    component.addSectionModel.sectionsList = [{
      agreementId: 92155,
      contract: 'sdfd-BOGL29 legal',
      contractId: 2660,
      currency: 'USD',
      effectiveDate: '06/07/2019',
      expirationDate: '06/07/2019',
      sectionId: 2211,
      sectionName: 'sec1',
      sectionType: 'Standard',
      sectionVersionID: 2296,
      selectedCode: 'Carriere Family Farms, Inc(BOGL29)',
      toolTipForBillTo: 'Carriere Family Farms, Inc(BOGL29)'
    }];
    component.addSectionModel.changeText = 'next';
    component.navigationCheck();
  });
  it('shoud call navigationCheck for back case', () => {
    component.addSectionModel.changeText = 'back';
    component.navigationCheck();
  });
  it('shoud call navigationCheck for navigate case', () => {
    component.addSectionModel.routeUrl = '/searchagreement';
    component.addSectionModel.changeText = 'navigate';
    component.navigationCheck();
  });
  it('should call valueChangesSubscription', () => {
    component.valueChangesSubscription();
  });
  it('should call getContractList', () => {
    component.addSectionModel.createAgreement = agreementDetails;
    const contractResponse = [{
      'customerAgreementContractID' : 1124,
      'customerContractName' : 'rrrree',
      'customerContractNumber' : null,
      'contractTypeID' : '3',
      'contractTypeName' : 'Transactional',
      'effectiveDate' : '2020-12-31',
      'expirationDate' : '2019-12-31'
    }];
    spyOn(service, 'getContract').and.returnValue(of(contractResponse));
    component.getContractList();
  });
  it('should call checkStore', () => {
    component.checkStore();
  });
  it('should call getSectionTableList', () => {
    const sectionTableDetail = {
      'took': 19,
      'timed_out': false,
      '_shards': {
        'total': 1,
        'successful': 1,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 50,
        'max_score': 9.725645,
        'hits': [{
          '_index': 'pricing-agreement',
          '_type': 'doc',
          '_id': '9471128628',
          '_score': 9.725645,
          '_source': {
            'UniqueDocID': '9471128628',
            'AgreementID': 947,
            'AgreementTenantID': 1,
            'AgreementType': 'Customer',
            'AgreementName': 'Torn & Glasser (TOPOAL)',
            'AgreementEffectiveDate': '1995-01-01',
            'AgreementExpirationDate': '2099-12-31',
            'AgreementStatus': 'Completed',
            'AgreementInvalidIndicator': 'N',
            'AgreementInvalidReasonType': 'Active',
            'UltimateAccountParentID': 23958,
            'UltimateParentAccountName': 'Torn & Glasser',
            'UltimateParentAccountCode': 'TOPOAL',
            'ContractID': 1128,
            'ContractOriginalEffectiveDate': '2019-03-14',
            'ContractOriginalExpirationDate': '2099-12-31',
            'ContractRanges': [{
              'ContractVersionID': 1143,
              'ContractTypeName': 'Legal',
              'ContractName': 'sdfsdf',
              'ContractNumber': 'TOPOAL',
              'ContractComment': null,
              'ContractEffectiveDate': '2019-03-14',
              'ContractExpirationDate': '2099-12-31',
              'ContractInvalidIndicator': 'N',
              'ContractInvalidReasonType': 'Active',
              'CreateUser': 'rcon959',
              'CreateProgram': 'Archana Karthikeyan',
              'CreateTimestamp': '2019-03-14T06:45:15.285',
              'LastUpdateUser': 'rcon959',
              'LastUpdateProgram': 'Archana Karthikeyan',
              'LastUpdateTimestamp': '2019-03-14T06:45:15.285'
            }],
            'SectionID': 628,
            'SectionOriginalEffectiveDate': '2019-03-14',
            'SectionOriginalExpirationDate': '2099-12-31',
            'SectionRanges': [{
              'SectionVersionID': 624,
              'SectionName': 'section2',
              'SectionTypeName': 'Standard',
              'SectionCurrencyCode': 'USD',
              'SectionEffectiveDate': '2019-03-14',
              'SectionExpirationDate': '2099-12-31',
              'SectionInvalidIndicator': 'N',
              'SectionInvalidReasonType': 'Active',
              'CreateUser': 'rcon959',
              'CreateProgram': 'Archana Karthikeyan',
              'CreateTimestamp': '2019-03-14T06:45:31.854',
              'LastUpdateUser': 'rcon959',
              'LastUpdateProgram': 'Archana Karthikeyan',
              'LastUpdateTimestamp': '2019-03-14T06:45:31.854'
            }],
            'Teams': [],
            'BillToCodes': [{
              'ContractSectionAccountID': 1071,
              'BillingPartyID': 23958,
              'BillingPartyName': 'Torn & Glasser',
              'BillingPartyCode': 'TOPOAL',
              'BillToEffectiveDate': '2019-03-14',
              'BillToExpirationDate': '2099-12-31'
            }]
          }
        }]
      }
    };
    component.addSectionModel.createAgreement = agreementDetails;
    spyOn(service, 'getSectionList').and.returnValue(of(sectionTableDetail));
    component.getSectionTableList();
  });
  it('should call onContractIdChanged for isEditDatePatch - false', () => {
    component.addSectionModel.contractIdList = contractIdList;
    component.onContractIdChanged('rrrree', false);
  });
  it('should call onContractIdChanged for isEditDatePatch - true', () => {
    component.addSectionModel.contractIdList = contractIdList;
    component.onContractIdChanged('rrrree', true);
  });
  it('should call createSectionForm', () => {
    component.createSectionForm();
  });
  it('should call getSectionTypeList', () => {
    const sectionTypeResponse = {
      '_embedded' : {
        'sectionTypes' : [ {
          'sectionTypeID' : 1,
          'sectionTypeName' : 'Standard',
          '_links' : {
            'self' : {
              'href' : ''
            },
            'sectionType' : {
              'href' : '',
              'templated' : true
            }
          }
        }]
      },
      '_links' : {
        'self' : {
          'href' : ''
        }
      }
    };
    spyOn(service, 'getSectionType').and.returnValue(of(sectionTypeResponse));
    component.getSectionTypeList();
  });
  it('should call getCurrencyList', () => {
    spyOn(service, 'getCurrency').and.returnValue(of([ 'CAD', 'USD' ]));
    component.getCurrencyList();
  });
  it('should call getBillToCodes', () => {
    component.addSectionModel.sectionForm.patchValue({
      effectiveDate: new Date(), expirationDate: new Date()
    });
    const billToCodeslist = [{
      'customerAgreementContractSectionAccountID' : null,
      'billingPartyID' : 43438,
      'effectiveDate' : null,
      'expirationDate' : null,
      'billingPartyName' : 'Carriere Family Farms, Inc',
      'billingPartyCode' : 'BOGL29',
      'isRemoved' : null,
      'customerAgreementContractSectionID' : null,
      'customerAgreementContractSectionName' : null
    }, {
      'customerAgreementContractSectionAccountID' : null,
      'billingPartyID' : 21328,
      'effectiveDate' : null,
      'expirationDate' : null,
      'billingPartyName' : 'Carriere Family Farms, Inc',
      'billingPartyCode' : 'CAGL69',
      'isRemoved' : null,
      'customerAgreementContractSectionID' : null,
      'customerAgreementContractSectionName' : null
    }];
    spyOn(service, 'getCodes').and.returnValue(of(billToCodeslist));
    component.getBillToCodes();
  });
  it('should call getEditBillToCodes', () => {
    component.addSectionModel.sectionForm.patchValue({
      effectiveDate: new Date(), expirationDate: new Date()
    });
    component.addSectionModel.selectedContractId = 2660;
    component.addSectionModel.selectedEditSection = [{
      agreementId: 92155,
      contract: 'sdfd-BOGL29 legal',
      contractId: 2660,
      currency: 'USD',
      effectiveDate: '06/07/2019',
      expirationDate: '06/07/2019',
      sectionId: 2211,
      sectionName: 'sec1',
      sectionType: 'Standard',
      sectionVersionID: 2296,
      selectedCode: 'Carriere Family Farms, Inc(BOGL29)',
      toolTipForBillTo: 'Carriere Family Farms, Inc(BOGL29)'
    }];
    const editBillToList = [{
      'customerAgreementContractSectionAccountID' : 2914,
      'billingPartyID' : 43438,
      'effectiveDate' : '2019-06-07',
      'expirationDate' : '2019-06-07',
      'billingPartyName' : 'Carriere Family Farms, Inc',
      'billingPartyCode' : 'BOGL29',
      'isRemoved' : null,
      'customerAgreementContractSectionID' : null,
      'customerAgreementContractSectionName' : null
    }, {
      'customerAgreementContractSectionAccountID' : null,
      'billingPartyID' : 21328,
      'effectiveDate' : null,
      'expirationDate' : null,
      'billingPartyName' : 'Carriere Family Farms, Inc',
      'billingPartyCode' : 'CAGL69',
      'isRemoved' : null,
      'customerAgreementContractSectionID' : null,
      'customerAgreementContractSectionName' : null
    }];
    spyOn(service, 'getEditCodes').and.returnValue(of(editBillToList));
    component.getEditBillToCodes();
  });
  it('should call onDateSelected for if condition', () => {
    component.addSectionModel.selectedEditSection = [];
    component.onDateSelected(new Date(), 0);
  });
  it('should call onDateSelected for else condition', () => {
    component.addSectionModel.selectedEditSection = [{
      agreementId: 92155,
      contract: 'sdfd-BOGL29 legal',
      contractId: 2660,
      currency: 'USD',
      effectiveDate: '06/07/2019',
      expirationDate: '06/07/2019',
      sectionId: 2211,
      sectionName: 'sec1',
      sectionType: 'Standard',
      sectionVersionID: 2296,
      selectedCode: 'Carriere Family Farms, Inc(BOGL29)',
      toolTipForBillTo: 'Carriere Family Farms, Inc(BOGL29)'
    }];
    component.onDateSelected(new Date(), 1);
  });
  it('should call onTypeDate for effective', () => {
    component.addSectionModel.sectionForm.patchValue({
      effectiveDate: new Date(), expirationDate: new Date()
    });
    component.addSectionModel.effectiveMinDate = new Date();
    component.addSectionModel.expirationMaxDate = new Date();
    component.onTypeDate('06/07/2019', 'effective');
  });
  it('should call onTypeDate for expiration', () => {
    component.addSectionModel.sectionForm.patchValue({
      effectiveDate: new Date(), expirationDate: new Date()
    });
    component.addSectionModel.effectiveMinDate = new Date();
    component.addSectionModel.expirationMaxDate = new Date();
    component.onTypeDate('06/07/2019', 'expiration');
  });
  it('should call onSelectEffDate', () => {
    component.addSectionModel.sectionForm.patchValue({
      effectiveDate: new Date(), expirationDate: new Date()
    });
    component.addSectionModel.effectiveMinDate = new Date();
    component.addSectionModel.expirationMaxDate = new Date();
    component.onSelectEffDate();
  });
  it('should call onPreviousClick for else condition', () => {
    component.addSectionModel.sectionForm.markAsUntouched();
    component.onPreviousClick();
  });
  it('should call onPreviousClick for if condition', () => {
    component.addSectionModel.sectionForm.markAsTouched();
    component.onPreviousClick();
  });
  it('should call onSaveExit for if condition', () => {
    component.addSectionModel.sectionForm.markAsDirty();
    component.onSaveExit();
  });
  it('should call onSaveExit for else condition', () => {
    component.addSectionModel.sectionForm.markAsPristine();
    component.onSaveExit();
  });
  it('should call nextStepNavigation for if condition', () => {
    component.addSectionModel.sectionsList = [{
      agreementId: 92155,
      contract: 'sdfd-BOGL29 legal',
      contractId: 2660,
      currency: 'USD',
      effectiveDate: '06/07/2019',
      expirationDate: '06/07/2019',
      sectionId: 2211,
      sectionName: 'sec1',
      sectionType: 'Standard',
      sectionVersionID: 2296,
      selectedCode: 'Carriere Family Farms, Inc(BOGL29)',
      toolTipForBillTo: 'Carriere Family Farms, Inc(BOGL29)'
    }];
    component.nextStepNavigation();
  });
  it('should call nextStepNavigation for else condition', () => {
    component.addSectionModel.sectionsList = [];
    component.nextStepNavigation();
  });
  it('should call onNextStep for if condition', () => {
    component.addSectionModel.isSplitView = true;
    component.addSectionModel.sectionForm.markAsTouched();
    component.onNextStep();
  });
  it('should call onNextStep for else condition', () => {
    component.addSectionModel.isSplitView = false;
    component.onNextStep();
  });
  it('should call onAddSection', () => {
    component.onAddSection();
  });
  it('should call onClose for if condition', () => {
    component.addSectionModel.sectionForm.markAsDirty();
    component.addSectionModel.sectionForm.markAsTouched();
    component.onClose();
  });
  it('should call onClose for else condition', () => {
    component.addSectionModel.sectionForm.markAsPristine();
    component.addSectionModel.sectionForm.markAsUntouched();
    component.onClose();
  });
  it('should call onSave for if condition & with section name duplicate', () => {
    component.addSectionModel.sectionForm.patchValue({
      sectionName: 'sec1', effectiveDate: new Date(), expirationDate: new Date(), currency: 'USD',
      sectionType: {label: 'Standard', value: 1}, contractId: 'sdfd-BOGL29 legal'
    });
    component.addSectionModel.sectionsList = [{
      agreementId: 92155,
      contract: 'sdfd-BOGL29 legal',
      contractId: 2660,
      currency: 'USD',
      effectiveDate: '06/07/2019',
      expirationDate: '06/07/2019',
      sectionId: 2211,
      sectionName: 'sec1',
      sectionType: 'Standard',
      sectionVersionID: 2296,
      selectedCode: 'Carriere Family Farms, Inc(BOGL29)',
      toolTipForBillTo: 'Carriere Family Farms, Inc(BOGL29)'
    }];
    component.addSectionModel.selectedCodesList = [{
      'customerAgreementContractSectionAccountID' : null,
      'billingPartyID' : 21328,
      'effectiveDate' : null,
      'expirationDate' : null,
      'billingPartyName' : 'Carriere Family Farms, Inc',
      'billingPartyCode' : 'CAGL69',
      'isRemoved' : null
    }];
    component.onSave('next');
  });
  it('should call onSave for if condition & without section name duplicate', () => {
    component.addSectionModel.sectionForm.patchValue({
      sectionName: 'sec2', effectiveDate: new Date(), expirationDate: new Date(), currency: 'USD',
      sectionType: {label: 'Standard', value: 1}, contractId: 'sdfd-BOGL29 legal'
    });
    component.addSectionModel.sectionsList = [{
      agreementId: 92155,
      contract: 'sdfd-BOGL29 legal',
      contractId: 2660,
      currency: 'USD',
      effectiveDate: '06/07/2019',
      expirationDate: '06/07/2019',
      sectionId: 2211,
      sectionName: 'sec1',
      sectionType: 'Standard',
      sectionVersionID: 2296,
      selectedCode: 'Carriere Family Farms, Inc(BOGL29)',
      toolTipForBillTo: 'Carriere Family Farms, Inc(BOGL29)'
    }];
    component.addSectionModel.selectedCodesList = [{
      'customerAgreementContractSectionAccountID' : null,
      'billingPartyID' : 21328,
      'effectiveDate' : null,
      'expirationDate' : null,
      'billingPartyName' : 'Carriere Family Farms, Inc',
      'billingPartyCode' : 'CAGL69',
      'isRemoved' : null
    }];
    component.onSave('next');
  });
  it('should call onSave for else condition', () => {
    component.addSectionModel.sectionForm.patchValue({
      sectionName: 'sec2', effectiveDate: new Date(), expirationDate: new Date(), currency: 'USD',
      sectionType: {label: 'Standard', value: 1}, contractId: 'sdfd-BOGL29 legal'
    });
    component.addSectionModel.selectedCodesList = [];
    component.onSave('next');
  });
  it('should call saveSection', () => {
    component.addSectionModel.sectionForm.patchValue({
      sectionName: 'sec2', effectiveDate: new Date(), expirationDate: new Date(), currency: 'USD',
      sectionType: {label: 'Standard', value: 1}, contractId: 'sdfd-BOGL29 legal'
    });
    component.addSectionModel.selectedCodesList = [{
      'customerAgreementContractSectionAccountID' : null,
      'billingPartyID' : 21328,
      'effectiveDate' : null,
      'expirationDate' : null,
      'billingPartyName' : 'Carriere Family Farms, Inc',
      'billingPartyCode' : 'CAGL69',
      'isRemoved' : null
    }];
    component.addSectionModel.selectedContractId = 2660;
    spyOn(service, 'sectionSave').and.returnValue(of({}));
    component.saveSection('next');
  });
  it('should call rowSelect', () => {
    const rowEvent: RowEvent = {
      type: 'checkbox',
      data: {
        agreementId: 92155,
        contract: 'sdfd-BOGL29 legal',
        contractId: 2660,
        currency: 'USD',
        effectiveDate: '06/07/2019',
        expirationDate: '06/07/2019',
        sectionId: 2211,
        sectionName: 'sec1',
        sectionType: 'Standard',
        sectionVersionID: 2296,
        selectedCode: 'Carriere Family Farms, Inc(BOGL29)',
        toolTipForBillTo: 'Carriere Family Farms, Inc(BOGL29)'
      }
    };
    component.addSectionModel.sectionForm.markAsDirty();
    component.rowSelect(rowEvent);
  });
  it('should call getDatesForRole', () => {
    const datesForRole = {
      '_embedded' : {
        'configurationParameterDetails' : [{
          'parameterSpecificationType' : {
            'parameterSpecificationTypeID' : 2,
            'parameterSpecificationTypeName' : 'Max'
          },
          'configurationParameter' : {
            'configurationParameterID' : 2,
            'configurationParameterName' : 'Super User Back Date Days',
            'configurationParameterValueType' : 'Number',
            '_links' : {
              'self' : {
                'href' : '',
                'templated' : true
              }
            }
          },
          'configurationParameterDetailID' : 529,
          'configurationParameterValue' : '10',
          '_links' : {
            'self' : {
              'href' : ''
            },
            'configurationParameterDetail' : {
              'href' : '',
              'templated' : true
            },
            'configurationParameter' : {
              'href' : ''
            }
          }
        }]
      },
      '_links' : {
        'self' : {
          'href' : ''
        }
      }
    };
    spyOn(service, 'getDatesByRole').and.returnValue(of(datesForRole));
    component.getDatesForRole();
  });
  it('should call headerCheckboxToggle', () => {
    component.addSectionModel.isSplitView = true;
    component.headerCheckboxToggle();
  });
  it('should call formErrorCheck in utility for if', () => {
    component.addSectionModel.selectedCodesList = [];
    component.addSectionModel.sectionForm.setErrors({ 'invalid': true });
    AddSectionUtility.formErrorCheck(component.addSectionModel,  messageService);
  });
  it('should call formErrorCheck in utility for else if', () => {
    component.addSectionModel.sectionForm.setErrors({ 'valid': true });
    component.addSectionModel.sectionForm.markAsPristine();
    AddSectionUtility.formErrorCheck(component.addSectionModel,  messageService);
  });
  it('should call formErrorCheck in utility for else', () => {
    component.addSectionModel.selectedCodesList = codeResponse;
    component.addSectionModel.sectionForm.setErrors({ 'valid': true });
    component.addSectionModel.sectionForm.markAsDirty();
    AddSectionUtility.formErrorCheck(component.addSectionModel,  messageService);
  });
  it('should call patchData in utility', () => {
    const data = {
      'customerAgreementContractSectionID' : 4715,
      'customerAgreementContractSectionVersionID' : 5963,
      'customerAgreementContractSectionName' : 'sa',
      'customerAgreementContractSectionTypeID' : 2,
      'customerAgreementContractSectionTypeName' : 'LTL',
      'currencyCode' : 'USD',
      'customerAgreementContractTypeID' : 1,
      'customerAgreementContractTypeName' : 'Legal',
      'customerContractNumber' : 'sa',
      'customerContractName' : 'sa',
      'customerAgreementContractSectionAccountDTOs' : [ {
        'customerAgreementContractSectionAccountID' : null,
        'billingPartyID' : 42650,
        'effectiveDate' : '2019-08-14',
        'expirationDate' : '2019-08-21',
        'billingPartyName' : 'Jia Xing Food Service, Inc',
        'billingPartyCode' : 'CHHOBU',
        'isRemoved' : null,
        'customerAgreementContractSectionID' : null,
        'customerAgreementContractSectionName' : null
      }, {
        'customerAgreementContractSectionAccountID' : null,
        'billingPartyID' : 33868,
        'effectiveDate' : '2019-08-14',
        'expirationDate' : '2019-08-21',
        'billingPartyName' : 'Jia Xing Food Service, Inc',
        'billingPartyCode' : 'CHHOBN',
        'isRemoved' : null,
        'customerAgreementContractSectionID' : null,
        'customerAgreementContractSectionName' : null
      } ],
      'effectiveDate' : '2019-08-14',
      'expirationDate' : '2019-08-21',
      'status' : null,
      'createUserID' : null,
      'lastUpdateUserID' : null,
      'lastUpdateProgramName' : null,
      'createProgramName' : null,
      'createTimestamp' : null,
      'lastUpdateTimestamp' : null,
      'originalEffectiveDate' : null,
      'originalExpirationDate' : null
    };
    AddSectionUtility.patchData(data, component.addSectionModel);
  });
  it('should call validateDateFormat in utility for effective', () => {
    AddSectionUtility.validateDateFormat('', 'effective', component.addSectionModel);
  });
  it('should call validateDateFormat in utility for expiration', () => {
    AddSectionUtility.validateDateFormat('', 'expiration', component.addSectionModel);
  });
  it('should call getCustomerContract in utility for if', () => {
    AddSectionUtility.getCustomerContract(component.addSectionModel);
  });
  it('should call getSelectedCodesParam in utility for if', () => {
    component.addSectionModel.selectedEditSection = [];
    AddSectionUtility.getSelectedCodesParam(component.addSectionModel);
  });
  it('should call getSelectedCodesParam in utility for else', () => {
    component.addSectionModel.selectedEditSection = [{
      sectionName: 'string',
      sectionType: 'string',
      currency: 'string',
      contract: 'string',
      effectiveDate: 'string',
      expirationDate: 'string',
      toolTipForBillTo: 'string',
      selectedCode: 'string',
      sectionId: 1,
      agreementId: 12,
      contractId: 12,
      sectionVersionID: 12}];
    AddSectionUtility.getSelectedCodesParam(component.addSectionModel);
  });
  it('should call checkSelectedBillTo in utility for if', () => {
    component.addSectionModel.sectionForm = formGroup;
    const clonedCodes = JSON.parse(JSON.stringify(codeResponse));
    AddSectionUtility.checkSelectedBillTo(component.addSectionModel);
  });
  it('should call checkSelectedBillTo in utility for else', () => {
    const data = [{
      billingPartyID: 12,
      effectiveDate: 'string',
      expirationDate: 'string',
      billingPartyName: 'string',
      billingPartyCode: 'string',
      codes: 'string',
      isRemoved: true,
      customerAgreementContractSectionAccountID: null
    }];
    component.addSectionModel.sectionForm = formGroup;
    const clonedCodes = JSON.parse(JSON.stringify(data));
    AddSectionUtility.checkSelectedBillTo(component.addSectionModel);
  });
  it('should call getSelectedCodes in utility for if', () => {
    const data = [{
      ContractSectionAccountID: 123,
      BillingPartyID: 147,
      BillingPartyName: 'string',
      BillingPartyCode: 'string',
      BillToEffectiveDate: 'string',
      BillToExpirationDate: 'string',
    }];
    AddSectionUtility.getSelectedCodes(data);
  });
  it('should call getSelectedCodes in utility for else', () => {
    const data = [];
    AddSectionUtility.getSelectedCodes(data);
  });
  it('should call displayCodes in utility for if', () => {
    const data = ['abc', 'abcd', 'abgf', 'anm'];
    AddSectionUtility.displayCodes(data);
  });
  it('should call displayCodes in utility for else', () => {
    const data = ['abc', 'abcd'];
    AddSectionUtility.displayCodes(data);
  });
  it('should call checkEmptyBillTo in utility for if', () => {
    component.addSectionModel.filteredCodesList = [];
    AddSectionUtility.checkEmptyBillTo(component.addSectionModel, messageService);
  });
  it('should call checkEmptyBillTo in utility for else', () => {
    component.addSectionModel.filteredCodesList = codeResponse;
    AddSectionUtility.checkEmptyBillTo(component.addSectionModel, messageService);
  });
  it('should call getClonedList in utility for if', () => {
    component.addSectionModel.selectedEditSection = [{
      sectionName: 'string',
      sectionType: 'string',
      currency: 'string',
      contract: 'string',
      effectiveDate: 'string',
      expirationDate: 'string',
      toolTipForBillTo: 'string',
      selectedCode: 'string',
      sectionId: 1,
      agreementId: 12,
      contractId: 12,
      sectionVersionID: 12}];
    AddSectionUtility.getClonedList(component.addSectionModel, codeResponse);
  });
  it('should call getClonedList in utility for else', () => {
    component.addSectionModel.selectedEditSection = [];
    AddSectionUtility.getClonedList(component.addSectionModel, codeResponse);
  });
  it('should call handleSuccess in utility for case 1', () => {
    router = fixture.debugElement.injector.get(
      Router
    );
    spyOn(router, 'navigate');
    AddSectionUtility.handleSuccess('search', router, shared, component.addSectionModel);
  });
  it('should call handleSuccess in utility for case 2', () => {
    spyOn(shared, 'broadcast');
    AddSectionUtility.handleSuccess('next', router, shared, component.addSectionModel);
  });
  it('should call handleSuccess in utility for case 3', () => {
    spyOn(shared, 'broadcast');
    AddSectionUtility.handleSuccess('back', router, shared, component.addSectionModel);
  });
  it('should call handleSuccess in utility for default', () => {
    AddSectionUtility.handleSuccess('acd', router, shared, component.addSectionModel);
  });
  it('should call getDates in utility for case 1', () => {
    const data = [{
       configurationParameterDetailID: 123,
      configurationParameterValue: 'string',
      parameterSpecificationType: {
        parameterSpecificationTypeName: 'string',
        parameterSpecificationTypeID: 123},
      parameterSpecificationTypeName: 'string',
      configurationParameter: {
        configurationParameterID: 123,
        configurationParameterName: 'Super User Back Date Days',
        configurationParameterValueType: 'string'
      },
      _links: {
        self: {
          href: 'string'
        }
      }
    }];
    AddSectionUtility.getDates(data, component.addSectionModel);
  });
  it('should call getDates in utility for case 2', () => {
    const data = [{
       configurationParameterDetailID: 123,
      configurationParameterValue: 'string',
      parameterSpecificationType: {
        parameterSpecificationTypeName: 'string',
        parameterSpecificationTypeID: 123},
      parameterSpecificationTypeName: 'string',
      configurationParameter: {
        configurationParameterID: 123,
        configurationParameterName: 'Super User Future Date Days',
        configurationParameterValueType: 'string'
      },
      _links: {
        self: {
          href: 'string'
        }
      }
    }];
    AddSectionUtility.getDates(data, component.addSectionModel);
  });
  it('should call createRequest in utility', () => {
    component.addSectionModel.sectionForm = formGroup;
    component.addSectionModel.sectionForm.controls['effectiveDate'].setValue(new Date('08-14-2019'));
    component.addSectionModel.sectionForm.controls['expirationDate'].setValue(new Date('08-14-2019'));
    AddSectionUtility.createRequest(component.addSectionModel);
  });
  it('should call fetchTableformat in utility', () => {
    const hitsItem: HitsItem = {
      _index: 'string',
      _type: 'string',
      _id: 'string',
      _score: 14,
      _source: {
        UniqueDocID: 'string',
        AgreementID: 123,
        AgreementTenantID: 145,
        AgreementType: 'string',
        AgreementName: 'string',
        AgreementEffectiveDate: '08-08-2019',
        AgreementExpirationDate: '08-08-2019',
        AgreementStatus: 'string',
        AgreementInvalidIndicator: 'string',
        AgreementInvalidReasonType: 'string',
        UltimateAccountParentID: 159,
        UltimateParentAccountName: 'string',
        UltimateParentAccountCode: 'string',
        ContractID: 132,
        ContractOriginalEffectiveDate: '08-08-2019',
        ContractOriginalExpirationDate: '08-08-2019',
        ContractRanges: [{
          ContractVersionID: 147,
          ContractTypeName: 'string',
          ContractName: 'string',
          ContractNumber: 'string',
          ContractComment: 'string',
          ContractEffectiveDate: '08-08-2019',
          ContractExpirationDate: '08-08-2019',
          ContractInvalidIndicator: 'string',
          ContractInvalidReasonType: 'string',
          CreateUser: 'string',
          CreateProgram: 'string',
          CreateTimestamp: 'string',
          LastUpdateUser: 'string',
          LastUpdateProgram: 'string',
          LastUpdateTimestamp: 'string',
        }],
        SectionID: 987,
        SectionOriginalEffectiveDate: '08-08-2019',
        SectionOriginalExpirationDate: '08-08-2019',
        SectionRanges: [{ SectionVersionID: 159,
          SectionName: 'string',
          SectionTypeName: 'string',
          SectionCurrencyCode: 'string',
          SectionEffectiveDate: '08-08-2019',
          SectionExpirationDate: '08-08-2019',
          SectionInvalidIndicator: 'string',
          SectionInvalidReasonType: 'string',
          CreateUser: 'string',
          CreateProgram: 'string',
          CreateTimestamp: 'string',
          LastUpdateUser: 'string',
          LastUpdateProgram: 'string',
          LastUpdateTimestamp: 'string',
          BillToCodes: [{
            ContractSectionAccountID: 357,
            BillingPartyID: 258,
            BillingPartyName: 'string',
            BillingPartyCode: 'string',
            BillToEffectiveDate: '08-08-2019',
            BillToExpirationDate: '08-08-2019',
          }]
        }],
        Teams: [{
          TaskAssignmentID: 852,
          TeamID: 963,
          TeamName: 'string',
          TeamEffectiveDate: '08-08-2019',
          TeamExpirationDate: '08-08-2019',
          teamAssignmentID: '123',
          teamID: '123',
          teamName: 'string'
        }]
      }
    };
    component.addSectionModel.sectionForm = formGroup;
    AddSectionUtility.fetchTableformat(hitsItem);
  });
    it('should call getSectionType in utility', () => {
      const data = [{
        sectionTypeName: 'string',
        sectionTypeID: 123,
        _links: {
          self: {
           href: 'string'
          }
         }
      }];
      AddSectionUtility.getSectionType(data);
    });
    it('should call getValidDate in utility for if', () => {
    component.addSectionModel.sectionForm = formGroup;
    AddSectionUtility.getValidDate(component.addSectionModel);
    });
});
