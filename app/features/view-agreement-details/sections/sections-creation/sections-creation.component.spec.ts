import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import {
  FormsModule, ReactiveFormsModule,
  FormControl, Validators, FormBuilder, FormGroup, FormArray, AbstractControl
} from '@angular/forms';
import { of } from 'rxjs';
import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';
import { SectionsCreationComponent } from './sections-creation.component';
import { BroadcasterService } from '../../../../shared/jbh-app-services/broadcaster.service';
import { SectionsService } from './../service/sections.service';
import { SectionsCreationUtility } from './service/sections-creation-utility';

describe('SectionsCreationComponent', () => {
  let component: SectionsCreationComponent;
  let fixture: ComponentFixture<SectionsCreationComponent>;
  let shared: BroadcasterService;
  let service: SectionsService;
  let formGroup: FormGroup;
  const formBuilder = new FormBuilder();
  let editSectionData: any;
  let effDate: Date;
  let expDate: Date;
  let BillToList: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule, FormsModule],
      providers: [BroadcasterService, SectionsCreationUtility, { provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionsCreationComponent);
    component = fixture.componentInstance;
    shared = TestBed.get(BroadcasterService);
    service = TestBed.get(SectionsService);
    component.sectionsCreationModel.splitViewDetails = {
      isCreate: true,
      titleText: 'Create',
      tableDeatils: [{
        'AgreementID': 71,
        'BillingPartyCode': ['Bay Valley Foods Group (BAGRCA)'],
        'ContractID': 130,
        'ContractNumber': undefined,
        'ContractTypeDisplay': '1401 (test)',
        'SectionCurrencyCode': 'USD',
        'SectionEffectiveDate': '05/23/2019',
        'SectionExpirationDate': '05/31/2019',
        'SectionID': 737,
        'SectionName': 'DSGR69_1',
        'SectionTypeName': 'Standard',
        'SectionVersionID': 737,
        'Status': 'Active',
        'toolTipForBillTo': 'Bay Valley Foods Group (BAGRCA)'
      }],
      agreementId: 71,
      agreementDeatils: {
        'customerAgreementID' : 71,
        'customerAgreementName' : 'Bay Valley Foods, Llc (DSGR69)',
        'agreementType' : 'Customer',
        'ultimateParentAccountID' : 32672,
        'currencyCode' : 'USD',
        'cargoReleaseAmount' : 100000.0000,
        'businessUnits' : [ 'JBI', 'JBT', 'ICS', 'DCS' ],
        'taskAssignmentIDs' : null,
        'effectiveDate' : '1995-01-01',
        'expirationDate' : '2099-12-31',
        'invalidIndicator' : 'N',
        'invalidReasonTypeName' : 'Active'
      },
      'sectionDetails': null
    };
    editSectionData = {
      'customerAgreementContractSectionID' : 87,
      'customerAgreementContractSectionVersionID' : 86,
      'customerAgreementContractSectionName' : 'etstts',
      'customerAgreementContractSectionTypeID' : 1,
      'customerAgreementContractSectionTypeName' : 'Standard',
      'currencyCode' : 'USD',
      'customerAgreementContractTypeID' : 1,
      'customerAgreementContractTypeName' : 'Legal',
      'customerContractNumber' : '123rest',
      'customerContractName' : 'test',
      'customerAgreementContractSectionAccountDTOs' : [ {
        'customerAgreementContractSectionAccountID' : 76,
        'billingPartyID' : 43992,
        'effectiveDate' : '2019-05-28',
        'expirationDate' : '2099-12-31',
        'billingPartyName' : 'Malnove Holding Company, Inc',
        'billingPartyCode' : 'MALOM',
        'isRemoved' : null,
        'customerAgreementContractSectionID' : null,
        'customerAgreementContractSectionName' : null
      } ],
      'effectiveDate' : '2019-05-28',
      'expirationDate' : '2099-12-31',
      'status' : 'Active',
      'createUserID' : 'rcon951',
      'lastUpdateUserID' : 'rcon951',
      'lastUpdateProgramName' : 'Process ID',
      'createProgramName' : 'Process ID',
      'createTimestamp' : '2019-05-28T11:52:29.201',
      'lastUpdateTimestamp' : '2019-05-28T11:52:29.201',
      'originalEffectiveDate' : '2019-05-28',
      'originalExpirationDate' : '2099-12-31'
    };
    effDate = new Date('05 June 2019 14:48 UTC');
    expDate = new Date('06 June 2019 14:48 UTC');
    formGroup = formBuilder.group({
      sectionName: ['abc', Validators.required],
      sectionType: ['abc', Validators.required],
      currency: ['CAD', Validators.required],
      contractId: ['1236', Validators.required],
      effectiveDate: [effDate],
      expirationDate: [expDate],
    });
    component.createForm();
    component.sectionsCreationModel.sectionForm.patchValue({
      sectionName: 'sec1',
      sectionType: {label: 'Standard', value: 1},
      currency: {label: 'USD', value: 'USD'},
      contractId: {contractTypeID: 1,
        contractTypeName: 'Legal',
        customerAgreementContractID: 683,
        customerAgreementContractTypeID: 1,
        customerAgreementContractTypeName: 'Legal',
        customerAgreementID: 71,
        customerContractName: 'Test Validate1',
        customerContractNumber: 'IT1001',
        effectiveDate: '2019-05-09',
        expirationDate: '2020-05-31',
        label: 'IT1001 (Test Validate1)',
        value: 'Test Validate1'
      },
      effectiveDate: new Date(),
      expirationDate: new Date()
    });
    component.sectionsCreationModel.popupFormGroup.patchValue({
      billtoEffective: new Date(),
      billtoExpiration: new Date()
    });
    component.sectionsCreationModel.selectedCodesList = [{
      assignedDates: '--',
      assignment: 'Unassigned',
      billToCodes: 'Bay Valley Foods Group (BAGRBZ)',
      rowDetail: {
        billingPartyCode: 'BAGRBZ',
        billingPartyID: 26395,
        billingPartyName: 'Bay Valley Foods Group',
        customerAgreementContractSectionAccountID: null,
        customerAgreementContractSectionID: null,
        customerAgreementContractSectionName: null,
        effectiveDate: null,
        expirationDate: null,
        isRemoved: null
      }
    }];
    component.sectionsCreationModel.selectedContract = {
      contractTypeID: 1,
      contractTypeName: 'Legal',
      customerAgreementContractID: 683,
      customerAgreementContractTypeID: 1,
      customerAgreementContractTypeName: 'Legal',
      customerAgreementID: 71,
      customerContractName: 'Test Validate1',
      customerContractNumber: 'IT1001',
      effectiveDate: '2019-05-09',
      expirationDate: '2020-05-31',
      label: 'IT1001 (Test Validate1)',
      value: 'Test Validate1'
    };
    BillToList = [
      {
        'assignedDates': '05/01/2019 - 12/31/2099',
        'assignment': 'Tariff Sec1',
        'billToCodes': 'Inter-Divisional Van-Truck (INLOBY)',
        'rowDetail': {
        'billingPartyCode': 'INLOBY',
        'billingPartyID': 43992,
        'billingPartyName': 'Inter-Divisional Van-Truck',
        'customerAgreementContractSectionAccountID': 178,
        'customerAgreementContractSectionID': 140,
        'customerAgreementContractSectionName': 'Tariff Sec1',
        'effectiveDate': '2019-05-01',
        'expirationDate': '2099-12-31',
        'isRemoved': true
        }
      }
    ];
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call navigationSubscription', () => {
    spyOn(shared, 'on').and.returnValue(of(true));
    component.navigationSubscription();
  });
  it('should call saveSubscription', () => {
    spyOn(shared, 'on').and.returnValue(of(true));
    component.saveSubscription();
  });
  it('should call valueChangesSubscription', () => {
    component.sectionsCreationModel.sectionForm.markAsDirty();
    component.sectionsCreationModel.sectionForm.markAsTouched();
    component.valueChangesSubscription();
  });
  it('should call onClose - if condition', () => {
    component.sectionsCreationModel.sectionForm.markAsDirty();
    component.sectionsCreationModel.sectionForm.markAsTouched();
    component.onClose();
  });
  it('should call onClose - else condition', () => {
    component.sectionsCreationModel.sectionForm.markAsPristine();
    component.sectionsCreationModel.sectionForm.markAsUntouched();
    component.onClose();
  });
  it('should call popupCancel', () => {
    component.popupCancel();
  });
  it('should call popupYes', () => {
    component.popupYes();
  });
  it('should call createForm', () => {
    component.createForm();
  });
  it('should call getSectionTypeList', () => {
    const sectionTypeList = {
      '_embedded' : {
        'sectionTypes' : [{
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
    spyOn(service, 'getSectionType').and.returnValue(of(sectionTypeList));
    component.getSectionTypeList();
  });
  it('should call getCurrencyList', () => {
    spyOn(service, 'getCurrency').and.returnValue(of([ 'CAD', 'USD' ]));
    component.getCurrencyList();
  });
  it('should call getContractList', () => {
    const contractList = [{
      'customerAgreementContractID' : 734,
      'customerContractName' : 'Contract1',
      'customerContractNumber' : 'CONEII',
      'contractTypeID' : 1,
      'contractTypeName' : 'Legal',
      'effectiveDate' : '2019-05-01',
      'expirationDate' : '2099-12-31'
    }];
    spyOn(service, 'getContract').and.returnValue(of(contractList));
    component.getContractList();
  });
  it('should call onAutoCompleteClear', () => {
    component.onAutoCompleteClear('', 'sectionType');
  });
  it('should call onAutoCompleteClear for Else case', () => {
    component.onAutoCompleteClear('test', 'sectionType');
  });
  it('should call onAutoCompleteSearch', () => {
    component.onAutoCompleteSearch('a', 'sectionTypeList', 'filteredSectionType');
  });
  it('should call defaultPatch', () => {
    component.sectionsCreationModel.splitViewDetails.isCreate = true;
    component.defaultPatch();
  });
  it('should call defaultPatch else case', () => {
    component.sectionsCreationModel.splitViewDetails.isCreate = false;
    component.defaultPatch();
  });
  it('should call onTypeDate for effective', () => {
    component.onTypeDate('05/21/2019', 'effective');
  });
  it('should call onTypeDate for expiration', () => {
    component.onTypeDate('05/21/2019', 'expiration');
  });
  it('should call onTypeDate for effective', () => {
    component.onTypeDate('', 'effective');
  });
  it('should call onBillToTypeDate for effective', () => {
    component.onBillToTypeDate('05/21/2019', 'effective');
  });
  it('should call onBillToTypeDate for expiration', () => {
    component.onBillToTypeDate('05/21/2019', 'expiration');
  });
  it('should call onBillToTypeDate for effective', () => {
    component.onBillToTypeDate('', 'effective');
  });
  it('should call onSave for if condition', () => {
    component.onSave();
  });
  it('should call onSave for else condition', () => {
    component.sectionsCreationModel.sectionForm.reset();
    component.onSave();
  });
  it('should call getBillToList', () => {
    const billToList = [{
      'customerAgreementContractSectionAccountID' : 1298,
      'billingPartyID' : 1288,
      'effectiveDate' : '2019-05-23',
      'expirationDate' : '2019-05-23',
      'billingPartyName' : 'Bay Valley Foods Group',
      'billingPartyCode' : 'BAGRCA',
      'isRemoved' : null,
      'customerAgreementContractSectionID' : 737,
      'customerAgreementContractSectionName' : 'DSGR69_1'
    }, {
      'customerAgreementContractSectionAccountID' : null,
      'billingPartyID' : 26395,
      'effectiveDate' : null,
      'expirationDate' : null,
      'billingPartyName' : 'Bay Valley Foods Group',
      'billingPartyCode' : 'BAGRBZ',
      'isRemoved' : null,
      'customerAgreementContractSectionID' : null,
      'customerAgreementContractSectionName' : null
    }];
    spyOn(service, 'getCreateSectionBillTo').and.returnValue(of(billToList));
    component.getBillToList();
  });
  it('should call contractSelected', () => {
    const selectedValue = {
      contractTypeID: 1,
      contractTypeName: 'Legal',
      customerAgreementContractID: 683,
      customerAgreementContractTypeID: 1,
      customerAgreementContractTypeName: 'Legal',
      customerAgreementID: 71,
      customerContractName: 'Test Validate1',
      customerContractNumber: 'IT1001',
      effectiveDate: '2019-05-09',
      expirationDate: '2020-05-31',
      label: 'IT1001 (Test Validate1)',
      value: 'Test Validate1'
    };
    component.contractSelected(selectedValue);
  });
  it('should call onDateSelected for if condition', () => {
    component.onDateSelected(new Date(), 0);
  });
  it('should call onDateSelected for else condition', () => {
    component.onDateSelected(new Date(), 1);
  });
  it('should call onBillToDateSelected for if condition', () => {
    component.onBillToDateSelected(new Date(), 0);
  });
  it('should call onBillToDateSelected for else condition', () => {
    component.onBillToDateSelected(new Date(), 1);
  });
  it('should call checkSectionName for if condition', () => {
    component.checkSectionName();
  });
  it('should call checkSectionName for else condition', () => {
    component.sectionsCreationModel.sectionForm.controls.sectionName.setValue('test sec1');
    component.checkSectionName();
  });
  it('should call checkBillToForSave for if condition', () => {
    component.checkBillToForSave();
  });
  it('should call checkBillToForSave for else condition', () => {
    component.sectionsCreationModel.selectedCodesList = [];
    component.checkBillToForSave();
  });
  it('should call checkContractDate for if condition', () => {
    component.checkContractDate();
  });
  it('should call checkContractDate for else condition', () => {
    component.sectionsCreationModel.sectionForm.patchValue({
      effectiveDate: new Date('2019-04-09'),
      expirationDate: new Date()
    });
    component.checkContractDate();
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
  it('should call billToDateSave for if condition', () => {
    component.billToDateSave();
  });
  it('should call billToDateSave for else condition', () => {
    component.sectionsCreationModel.popupFormGroup.reset();
    component.billToDateSave();
  });
  it('should call saveSection', () => {
    component.sectionsCreationModel.popupFormGroup.patchValue({
      billtoEffective: new Date(),
      billtoExpiration: new Date()
    });
    component.saveSection();
  });
  it('should call saveSection Else case', () => {
    component.sectionsCreationModel.splitViewDetails.isCreate = false;
    component.sectionsCreationModel.sectionForm =  formGroup;
        component.sectionsCreationModel.splitViewDetails.agreementId = 1569;
        component.sectionsCreationModel.splitViewDetails.sectionDetails = editSectionData;
        spyOn(service, 'sectionEditSave').and.returnValue(of());
        component.saveSection();
  });
  it('should call setEditFormDetails for if condition', () => {
    component.sectionsCreationModel.splitViewDetails.isCreate = false;
    component.sectionsCreationModel.splitViewDetails.sectionDetails = editSectionData;
    component.setEditFormDetails();
  });

  it('should call setEditFormDetails for else condition', () => {
    component.sectionsCreationModel.splitViewDetails.isCreate = true;
    component.setEditFormDetails();
  });
  it('should call getBillToList for Edit Section', () => {
    const billToList = [{
      'customerAgreementContractSectionAccountID' : 1298,
      'billingPartyID' : 1288,
      'effectiveDate' : '2019-05-23',
      'expirationDate' : '2019-05-23',
      'billingPartyName' : 'Bay Valley Foods Group',
      'billingPartyCode' : 'BAGRCA',
      'isRemoved' : null,
      'customerAgreementContractSectionID' : 737,
      'customerAgreementContractSectionName' : 'DSGR69_1'
    }];
    component.sectionsCreationModel.splitViewDetails.isCreate = false;
    component.sectionsCreationModel.editBillToList = true;
      spyOn(service, 'getCreateSectionBillTo').and.returnValue(of(billToList));
    component.sectionsCreationModel.filteredCodesList = [
    {
      'assignedDates': '05/01/2019 - 12/31/2099',
      'assignment': 'Tariff Sec1',
      'billToCodes': 'Inter-Divisional Van-Truck (INLOBY)',
      'rowDetail': {
      'billingPartyCode': 'INLOBY',
      'billingPartyID': 43992,
      'billingPartyName': 'Inter-Divisional Van-Truck',
      'customerAgreementContractSectionAccountID': 178,
      'customerAgreementContractSectionID': 140,
      'customerAgreementContractSectionName': 'Tariff Sec1',
      'effectiveDate': '2019-05-01',
      'expirationDate': '2099-12-31',
      'isRemoved': null
      }
    }
  ];
    component.sectionsCreationModel.splitViewDetails.sectionDetails = editSectionData;
    component.getBillToList();
  });
  it('should call checkValidDate', () => {
    component.checkValidDate();
  });
  it('should call checkValidDate else case', () => {
    component.sectionsCreationModel.sectionForm.controls['effectiveDate'].setValue('');
    component.checkValidDate();
  });
  it('should call editcontractDateValidation', () => {
    component.editcontractDateValidation();
  });
  it('should call contractDateValidate', () => {
    component.contractDateValidate();
  });
  it('should call createDateValidation', () => {
    const isValidate = true;
    component.createDateValidation(isValidate);
  });
  it('should call sectionValidation', () => {
    const isValidate = true;
    const sectionDetail = {
      'customerAgreementContractSectionID': 1556,
      'customerAgreementContractSectionVersionID': 2082,
      'customerAgreementContractSectionName': 'XEROC-361',
      'customerAgreementContractSectionTypeID': 1,
      'customerAgreementContractSectionTypeName': 'Standard',
      'currencyCode': 'CAD',
      'customerAgreementContractDTO': {
        'customerAgreementContractID': 1262,
        'customerAgreementID': 872,
        'customerAgreementContractTypeID': 1,
        'customerAgreementContractTypeName': 'Legal',
        'customerContractName': 'Xerox Desc',
        'customerContractNumber': 'XEROC-1',
        'effectiveDate': '2019-07-01',
        'expirationDate': '2019-12-31'
      },
      'customerAgreementContractSectionAccountDTOs': null,
      'effectiveDate': '2019-11-01',
      'expirationDate': '2019-11-19',
      'isContractChanged': false,
      'isCreateAgreementFlow': false,
      'customerAgreementOwnershipUpdateDTOs': null,
      'lastUpdateTimestamp': '2019-06-26T05:02:53.397'
    };
    component.sectionsCreationModel.splitViewDetails.agreementId = 750;
    component.sectionsCreationModel.sectionForm =  formGroup;
      spyOn(service, 'sectionSave').and.returnValue(of());
    component.sectionValidation(sectionDetail, isValidate);
  });
  it('should call validationResponse for if condition', () => {
    component.sectionsCreationModel.splitViewDetails.isCreate = true;
    const isValidate = true;
    component.validationResponse(isValidate);
  });
  it('should call validationResponse for else condition', () => {
    component.sectionsCreationModel.splitViewDetails.isCreate = false;
    const isValidate = true;
    component.sectionsCreationModel.sectionForm =  formGroup;
    component.sectionsCreationModel.splitViewDetails.sectionDetails = editSectionData;
    component.sectionsCreationModel.splitViewDetails.sectionDetails.expirationDate = '2019-06-06';
    component.validationResponse(isValidate);
  });
  it('should call ImpactCount for else condition from validationResponse', () => {
    component.sectionsCreationModel.splitViewDetails.isCreate = false;
    const isValidate = true;
    component.sectionsCreationModel.sectionForm =  formGroup;
    component.sectionsCreationModel.splitViewDetails.sectionDetails = editSectionData;
    const impactObj = {
      'accessorials': 1,
      'cargos': 1,
      'fuels': 1,
      'linehauls': 1,
      'mileages': 1,
      'ratingRules': 1
    };
    spyOn(service, 'getImpactCount').and.returnValue(of(impactObj));
    component.validationResponse(isValidate);
  });
  it('should call editsectionSave ', () => {
        component.sectionsCreationModel.sectionForm =  formGroup;
        component.sectionsCreationModel.splitViewDetails.agreementId = 1569;
        component.sectionsCreationModel.splitViewDetails.sectionDetails = editSectionData;
        spyOn(service, 'sectionEditSave').and.returnValue(of());
        component.editsectionSave(false);
      });
  it('should call countpopupCancel', () => {
        component.countpopupCancel();
      });
  it('should call countpopupContinue', () => {
        component.sectionsCreationModel.isShowChildEntityPopup = false;
        component.sectionsCreationModel.sectionForm =  formGroup;
        component.sectionsCreationModel.splitViewDetails.sectionDetails = editSectionData;
        component.countpopupContinue();
      });
  it('should call constructAssignBillToChange', () => {
    const editpopTxt = 'Please select an effective date range for your new selection of Bill To codes.';
    component.sectionsCreationModel.sectionForm =  formGroup;
    component.sectionsCreationModel.splitViewDetails.sectionDetails = editSectionData;
    component.constructAssignBillToChange(editpopTxt);
  });
  it('should call Child impact count  - if condition', () => {
    const impactCountList = {'documents': 0, 'rates': 0, 'gracePeriods': 0,
    'freeRules': 0, 'suspends': 0, 'averages': 0, 'notifications': 0,
    'cargos': 0, 'fuels': 0, 'linehauls': 0, 'mileages': 0, 'ratingRules': 0 };
    SectionsCreationUtility.checkImpactChildCount(impactCountList, component.sectionsCreationModel);
  });
  it('should call Child impact count - else condition', () => {
    const impactCountList = {'documents': 10, 'rates': 20, 'gracePeriods': 10,
    'freeRules': 5, 'suspends': 10, 'averages': 20, 'notifications': 10,
    'cargos': 5, 'fuels': 10, 'linehauls': 10, 'mileages': 10, 'ratingRules': 5 };
    SectionsCreationUtility.checkImpactChildCount(impactCountList, component.sectionsCreationModel);
  });
  it('should call editSectionDTO - If condition', () => {
    component.sectionsCreationModel.editSelectedBillToList = BillToList;
    SectionsCreationUtility.editSectionDTO(component.sectionsCreationModel);
  });
  it('should call editSectionDTO - Else condition', () => {
    component.sectionsCreationModel.editSelectedBillToList  = [];
    component.sectionsCreationModel.selectedCodesList = BillToList;
    SectionsCreationUtility.editSectionDTO(component.sectionsCreationModel);
  });
  it('should call frameEditBillToCodeList - if condition', () => {
    const newlySelectedList = component.sectionsCreationModel.selectedCodesList;
    const deSelectedList = component.sectionsCreationModel.selectedCodesList;
    SectionsCreationUtility.frameEditBillToCodeList(newlySelectedList, deSelectedList);
  });
  it('should call frameEditBillToCodeList - Else condition', () => {
    const newlySelectedList = [];
    const deSelectedList = [];
    SectionsCreationUtility.frameEditBillToCodeList(newlySelectedList, deSelectedList);
  });
  it('should call isBillToChanged - if condition', () => {
    component.sectionsCreationModel.selectedCodeListCopy = BillToList;
    component.sectionsCreationModel.selectedCodesList = BillToList;
    SectionsCreationUtility.isBillToChanged(component.sectionsCreationModel);
  });
  it('should call getAccessorialCount', () => {
    const impactCountList = {'documents': 10, 'rates': 20, 'gracePeriods': 10,
    'freeRules': 5, 'suspends': 10, 'averages': 20, 'notifications': 10,
    'cargos': 5, 'fuels': 10, 'linehauls': 10, 'mileages': 10, 'ratingRules': 5 };
    SectionsCreationUtility.getAccessorialCount(impactCountList);
  });
});
