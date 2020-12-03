import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { HttpResponseBase, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/components/common/messageservice';

import { AppModule } from '../../../app.module';
import { CreateAgreementModule } from './../create-agreement.module';
import { AddContractsComponent } from './add-contracts.component';
import { BroadcasterService } from '../../../shared/jbh-app-services/broadcaster.service';
import { AgreementDetails, RowEvent } from './model/add-contracts.interface';
import { LocalStorageService } from '../../../shared/jbh-app-services/local-storage.service';
import { AddContractsService } from './service/add-contracts.service';
import { AddContractsUtility } from './service/add-contracts-utility';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Header } from 'primeng/primeng';
import { ChangeDetectorRef } from '@angular/core';
describe('AddContractsComponent', () => {
  let component: AddContractsComponent;
  let fixture: ComponentFixture<AddContractsComponent>;
  let shared: BroadcasterService;
  let agreementDetails: AgreementDetails;
  let localStore: LocalStorageService;
  let service: AddContractsService;
  const formBuilder: FormBuilder = new FormBuilder();
  let contractForm: FormGroup;
  let httpResponseBase: HttpResponseBase;
  let messageService: MessageService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, CreateAgreementModule, HttpClientTestingModule],
      declarations: [],
      providers: [MessageService, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContractsComponent);
    component = fixture.componentInstance;
    shared = TestBed.get(BroadcasterService);
    localStore = TestBed.get(LocalStorageService);
    service = TestBed.get(AddContractsService);
    messageService = TestBed.get(MessageService);
    agreementDetails = {
      customerAgreementID: 943,
      effectiveDate: '1995-01-01',
      expirationDate: '2099-12-31'
    };
    localStore.setItem('createAgreement', 'detail', agreementDetails);
    contractForm = formBuilder.group({
      contractType: ['', Validators.required],
      contractId: ['', Validators.required],
      description: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      notes: ['']
    });
    httpResponseBase = {
      'headers': new HttpHeaders(),
      'ok': true,
      'status': 204,
      'statusText': 'Created',
      'type': 4,
      'url': ''
    };
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
    component.addContractsModel.routeUrl = '/dashboard';
    spyOn(shared, 'on').and.returnValue(of(false));
    component.saveSubscription();
  });
  it('should call savedBroadcast without if condition', () => {
    component.savedBroadcast();
  });
  it('should call savedBroadcast with if condition', () => {
    component.addContractsModel.isSplitView = true;
    component.addContractsModel.contractForm.markAsDirty();
    component.addContractsModel.contractForm.markAsTouched();
    component.savedBroadcast();
  });
  it('should call checkStore', () => {
    component.checkStore();
  });
  it('should call onTypeDate for effective case', () => {
    component.addContractsModel.contractForm.patchValue({
      effectiveDate: new Date()
    });
    component.onTypeDate('06/11/2019', 'effective');
  });
  it('should call onTypeDate for expiration case', () => {
    component.addContractsModel.contractForm.patchValue({
      expirationDate: new Date()
    });
    component.onTypeDate('06/11/2019', 'expiration');
  });
  it('should call onContractTypeSelected without key', () => {
    component.addContractsModel.createAgreement = agreementDetails;
    component.onContractTypeSelected({label: 'Legal'});
  });
  it('should call onContractTypeSelected with key', () => {
    component.addContractsModel.createAgreement = agreementDetails;
    component.onContractTypeSelected({label: 'Legal'}, 'edit');
  });
  it('should call getContractId', () => {
    spyOn(service, 'getContractId').and.returnValue(of(1));
    component.getContractId();
  });
  it('should call onRowSelect', () => {
    const rowEvent: RowEvent = {
      type: 'checkbox',
      data: {
        customerAgreementContractID: 1124,
        customerAgreementContractTypeID: 3,
        customerAgreementContractTypeName: 'Transactional',
        customerAgreementContractVersionID: 1139,
        customerAgreementID: 943,
        customerContractComment: null,
        customerContractName: 'rrrree',
        customerContractNumber: '--',
        effectiveDate: '12/31/2019',
        expirationDate: '12/31/2020'
      }
    };
    component.onRowSelect(rowEvent);
  });
  it('should call patchContractDetail', () => {
    const data = {
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    };
    component.patchContractDetail(data);
  });
  it('should call onSelectEffDate', () => {
    component.addContractsModel.contractForm.patchValue({
      effectiveDate: new Date(), expirationDate: new Date()
    });
    component.addContractsModel.effectiveMinDate = new Date();
    component.addContractsModel.expirationMaxDate = new Date();
    component.onSelectEffDate();
  });
  it('should call onAddContract', () => {
    component.onAddContract();
  });
  it('should call getContractTypeList', () => {
    const contractTypeList = {
      '_embedded' : {
        'contractTypes' : [ {
          'contractTypeName' : 'Legal',
          'contractTypeID' : 1,
          '_links' : {
            'self' : {
              'href' : 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/1'
            },
            'contractType' : {
              'href' : 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/1{?projection}',
              'templated' : true
            }
          }
        }, {
          'contractTypeName' : 'Tariff',
          'contractTypeID' : 2,
          '_links' : {
            'self' : {
              'href' : 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/2'
            },
            'contractType' : {
              'href' : 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/2{?projection}',
              'templated' : true
            }
          }
        }, {
          'contractTypeName' : 'Transactional',
          'contractTypeID' : 3,
          '_links' : {
            'self' : {
              'href' : 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/3'
            },
            'contractType' : {
              'href' : 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/3{?projection}',
              'templated' : true
            }
          }
        } ]
      },
      '_links' : {
        'self' : {
          'href' : ''
        }
      }
    };
    spyOn(service, 'getContractType').and.returnValue(of(contractTypeList));
    component.getContractTypeList();
  });
  it('should call createContractForm', () => {
    component.createContractForm();
  });
  it('should call onClose for if condition', () => {
    component.addContractsModel.contractForm.markAsDirty();
    component.addContractsModel.contractForm.markAsTouched();
    component.onClose();
  });
  it('should call onClose for else condition', () => {
    component.addContractsModel.contractForm.markAsPristine();
    component.addContractsModel.contractForm.markAsUntouched();
    component.onClose();
  });
  it('should call onDontSave', () => {
    component.onDontSave();
  });
  it('should call navigationCheck for next case & if condition', () => {
    component.addContractsModel.nextStep = 'next';
    component.addContractsModel.contractsList = [];
    component.navigationCheck();
  });
  it('should call navigationCheck for next case & else condition', () => {
    component.addContractsModel.nextStep = 'next';
    component.addContractsModel.contractsList = [{
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    }];
    component.navigationCheck();
  });
  it('should call navigationCheck for back case', () => {
    component.addContractsModel.nextStep = 'back';
    component.navigationCheck();
  });
  it('should call navigationCheck for navigate case', () => {
    component.addContractsModel.nextStep = 'navigate';
    component.addContractsModel.routeUrl = '/dashboard';
    component.navigationCheck();
  });
  it('should call onDelete', () => {
    component.addContractsModel.selectedRowContract[0] = {
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    };
    spyOn(service, 'deleteContract').and.returnValue(of(''));
    AddContractsUtility.splitScreenCheck(component.addContractsModel);
    component.onDelete();
  });
  it('should call onPrevious for if condition', () => {
    component.addContractsModel.isSplitView = false;
    component.onPrevious();
  });
  it('should call onPrevious for else - if condition', () => {
    component.addContractsModel.isSplitView = true;
    component.addContractsModel.contractForm.markAsDirty();
    component.onPrevious();
  });
  it('should call onPrevious for else - else condition', () => {
    component.addContractsModel.isSplitView = true;
    component.addContractsModel.contractForm.markAsPristine();
    component.onPrevious();
  });
  it('should call onDateSelected for if condition', () => {
    component.onDateSelected(new Date(), 0);
  });
  it('should call onDateSelected for else condition', () => {
    component.onDateSelected(new Date(), 1);
  });
  it('should call onSaveExit for if condition', () => {
    component.addContractsModel.isSplitView = false;
    component.addContractsModel.searchUrl = '/dashboard';
    component.onSaveExit();
  });
  it('should call onSaveExit for else - if condition', () => {
    component.addContractsModel.isSplitView = true;
    component.addContractsModel.contractForm.markAsDirty();
    component.onSaveExit();
  });
  it('should call onSaveExit for else - else condition', () => {
    component.addContractsModel.isSplitView = true;
    component.addContractsModel.contractForm.markAsPristine();
    component.addContractsModel.searchUrl = '/dashboard';
    component.onSaveExit();
  });
  it('should call editSave', () => {
    const dataValues = {
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    };
    component.addContractsModel.contractForm.patchValue({
      contractType: {label: 'Transactional', value: 3}, notes: null,
      contractId: null, description: 'contract test 1',
      effectiveDate: new Date(), expirationDate: new Date()
    });
    component.addContractsModel.selectedRowContract[0] = dataValues;
    component.addContractsModel.contractsList = [dataValues];
    const formvalues = AddContractsUtility.saveRequest(component.addContractsModel);
    spyOn(service, 'contractEditSave').and.returnValue(of(formvalues));
    component.editSave(formvalues, 'next');
  });
  it('should call onSave for if condition', () => {
    component.addContractsModel.contractForm.patchValue({
      contractType: {label: 'Legal', value: 1}, notes: null,
      contractId: 1, description: 'contract test 1',
      effectiveDate: new Date(), expirationDate: new Date()
    });
    AddContractsUtility.matchedIndex(component.addContractsModel, 'customerContractNumber', 'contractId');
    AddContractsUtility.saveRequest(component.addContractsModel);
    component.onSave();
  });
  it('should call onSave for first elseif condition', () => {
    component.addContractsModel.contractForm.patchValue({
      contractType: {label: 'Legal', value: 1}, notes: null,
      contractId: '', description: 'contract test 1',
      effectiveDate: new Date(), expirationDate: new Date()
    });
    component.onSave();
  });
  it('should call onSave for second elseif condition', () => {
    component.addContractsModel.contractForm.markAsPristine();
    component.onSave();
  });
  it('should call onNextStep for if condition', () => {
    component.addContractsModel.contractsList = [{
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    }];
    component.onNextStep();
  });
  it('should call onNextStep for else condition', () => {
    component.addContractsModel.contractsList = [];
    component.onNextStep();
  });
  it('should call checkEditSave for if condition', () => {
    const dataValues = {
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    };
    component.addContractsModel.selectedRowContract[0] = dataValues;
    component.checkEditSave(dataValues, 1, 1);
  });
  it('should call checkEditSave for else condition', () => {
    const dataValues = {
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    };
    component.addContractsModel.selectedRowContract = [];
    component.checkEditSave(dataValues, 1, 1);
  });
  it('should call duplicateCheck for if condition', () => {
    const dataValues = {
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    };
    component.duplicateCheck(1, 1, dataValues);
  });
  it('should call duplicateCheck for else condition', () => {
    const dataValues = {
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '2019-01-01',
      expirationDate: '2020-12-12'
    };
    component.addContractsModel.tariffContractId = '1';
    spyOn(service, 'contractSave').and.returnValue(of(dataValues));
    component.duplicateCheck(-1, -1, dataValues);
  });
  it('should call screenNavigation for if condition', () => {
    component.addContractsModel.searchUrl = '/dashboard';
    component.screenNavigation('navigate');
  });
  it('should call contractTypeManipulation for transactional case', () => {
    component.contractTypeManipulation({label: 'Transactional'}, false);
  });
  it('should call contractTypeManipulation for tariff case & edit - false', () => {
    component.contractTypeManipulation({label: 'Tariff'}, false);
  });
  it('should call contractTypeManipulation for tariff case & edit - true', () => {
    component.addContractsModel.selectedRowContract = [{
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    }];
    component.contractTypeManipulation({label: 'Tariff'}, true);
  });
  it('should call contractTypeManipulation for legal case', () => {
    component.contractTypeManipulation({label: 'Legal'}, true);
  });
  it('should call nextCheck for if condition', () => {
    component.addContractsModel.isSplitView = true;
    component.addContractsModel.contractForm.markAsDirty();
    component.nextCheck();
  });
  it('should call nextCheck for else condition', () => {
    component.addContractsModel.isSplitView = false;
    component.addContractsModel.contractForm.markAsPristine();
    component.nextCheck();
  });
  it('should call headerCheckboxToggle', () => {
    component.addContractsModel.isSplitView = true;
    component.headerCheckboxToggle();
  });

  it('should call initialDate', () => {
    component.addContractsModel.createAgreement = agreementDetails;
    AddContractsUtility.initialDate(component.addContractsModel);
  });

  it('should call initialDate for else', () => {
    AddContractsUtility.initialDate(component.addContractsModel);
  });

  it('should call onSelectExpDate', () => {
    component.addContractsModel.contractForm.patchValue({
      effectiveDate: new Date()
    });
    component.addContractsModel.contractForm.patchValue({
      expirationDate: new Date()
    });
    AddContractsUtility.onSelectExpDate(component.addContractsModel);
  });

  it('should call getValidDate', () => {
    component.addContractsModel.contractForm.patchValue({
      effectiveDate: new Date('08/13/2019')
    });
    component.addContractsModel.contractForm.patchValue({
      expirationDate: null
    });
    component.addContractsModel.contractForm.controls['expirationDate'].setValue('');
    AddContractsUtility.getValidDate(component.addContractsModel);
  });

  it('should call dateObj', () => {
    AddContractsUtility.dateObj(new Date('08-13-2019'));
  });

  it('should call getPatchValues', () => {
    const contractValue = {label: 'transactional'};
    const saveResponse = {
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    };
    component.addContractsModel.contractForm = contractForm;
    AddContractsUtility.getPatchValues(component.addContractsModel, contractValue, saveResponse);
  });

  it('should call splitScreenCheck', () => {
    component.addContractsModel.isSplitView = true;
    component.addContractsModel.selectedRowContract[0] = {
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    };
    component.addContractsModel.selectedContractsList = [{
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    }];
    AddContractsUtility.splitScreenCheck(component.addContractsModel);
  });

  it('should call onSuccessDeleteContract', () => {
    component.addContractsModel.selectedContractsList = [{
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    }];
    component.addContractsModel.contractsList = [{
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    }];
    AddContractsUtility.onSuccessDeleteContract(httpResponseBase, messageService, component.addContractsModel);
  });

  it('should call getContractType', () => {
    const contractTypeList1 = [{
      tenantID: 1,
      contractTypeName: 'string',
      contractTypeID: 1,
      _links: {
          self : {
          href : 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/3'
        },
        contractType : {
          href : 'https://pricing-dev.jbhunt.com/pricingconfigurationservices/contracttypes/3{?projection}',
          templated : true
        }
      },
      customerAgreementContractID: 1,
      customerContractName: 'string',
      expirationDate: 'string',
      contractType: 'string',
      customerContractNumber: 'string',
      effectiveDate: 'string',
    }];
    AddContractsUtility.getContractType(contractTypeList1);
  });

  it('should call duplicateCheckError', () => {
    AddContractsUtility.duplicateCheckError(1, 1, messageService);
  });

  it('should call saveRequest', () => {
    component.addContractsModel.selectedRowContract[0] = {
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    };
    component.addContractsModel.selectedContractsList = [{
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    }];
    component.addContractsModel.contractForm = contractForm;
    component.addContractsModel.contractForm.controls['contractType'].setValue({label: 'transactional', value: 1});
    component.addContractsModel.contractForm.controls['contractId'].setValue('1');
    component.addContractsModel.contractForm.controls['description'].setValue('abc');
    component.addContractsModel.contractForm.controls['effectiveDate'].setValue(new Date('12/31/2019'));
    component.addContractsModel.contractForm.controls['expirationDate'].setValue(new Date('12/31/2019'));
    component.addContractsModel.contractForm.controls['notes'].setValue('acb');
    AddContractsUtility.saveRequest(component.addContractsModel);
  });

  it('should call matchedIndex', () => {
    component.addContractsModel.contractsList = [{
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    }];
    component.addContractsModel.contractForm.controls['contractId'].setValue('rrrree');
    AddContractsUtility.matchedIndex(component.addContractsModel, 'customerContractName', 'contractId');
  });

  it('should call formFieldsTouched', () => {
    component.addContractsModel.contractForm = contractForm;
    AddContractsUtility.formFieldsTouched(component.addContractsModel, messageService);
  });

  it('should call handleError', () => {
    component.addContractsModel.contractForm = contractForm;
    const error: any = {
      name: 'error',
      message: 'error',
      error: {
        status: 400,
        error: {
          errors: [{
            errorMessage: 'max_size_violation',
            errorType: 'max_size'
          }]
        }
      }
    };
    AddContractsUtility.handleError(error, component.addContractsModel, messageService, fixture.changeDetectorRef);
  });

  it('should call checkTariff', () => {
    component.addContractsModel.selectedRowContract = [{
      customerAgreementContractID: 1124,
      customerAgreementContractTypeID: 3,
      customerAgreementContractTypeName: 'Transactional',
      customerAgreementContractVersionID: 1139,
      customerAgreementID: 943,
      customerContractComment: null,
      customerContractName: 'rrrree',
      customerContractNumber: '--',
      effectiveDate: '12/31/2019',
      expirationDate: '12/31/2020'
    }];
    const event: any = {
      label: 'Transactional'
    };
    AddContractsUtility.checkTariff(component.addContractsModel, event);
  });

  it('should call warningMessage', () => {
    AddContractsUtility.warningMessage(messageService);
  });

});
