import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';

import { DocumentationDetailedViewComponent } from './documentation-detailed-view.component';
import { DocumentationDetailedViewService } from './service/documentation-detailed-view.service';
import { of, throwError } from 'rxjs';
import { LocalStorageService } from './../../../../../shared/jbh-app-services/local-storage.service';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';
import { MessageService } from 'primeng/components/common/messageservice';

describe('DocumentationDetailedViewComponent', () => {
  const textVAlue = `7tsdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  7tsdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  7tsdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  7tsdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
  let component: DocumentationDetailedViewComponent;
  let fixture: ComponentFixture<DocumentationDetailedViewComponent>;
  let documentationDetailedViewService: DocumentationDetailedViewService;
  let localStorageService: LocalStorageService;
  let broadcasterService: BroadcasterService;
  let messageService: MessageService;
  const response = {
    'documentationTypeId': 1,
    'documentationType': 'Legal',
    'level': 'Agreement',
    'effectiveDate': '2019-06-03',
    'expirationDate': '2019-06-30',
    'customerAgreementId': 66,
    'equipmentCategoryCode': 'Chassis',
    'equipmentCategoryDescription': null,
    'equipmentTypeId': null,
    'equipmentType': 'Rod',
    'equipmentLengthId': 95,
    'equipmentLength': 44,
    'equipmentLengthDescription': 'Feet',
    'chargeTypeId': 2,
    'chargeTypeName': 'Detention With Power',
    'chargeTypeCode': 'DETENTIONP',
    'status': 'Active',
    'customerAccessorialText': {
      'customerAccessorialDocumentTextId': 392,
      'textName': '7t',
      'text': textVAlue
    },
    'serviceLevelBusinessUnitServiceOfferings': [
      {
        'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': null,
        'serviceLevelBusinessUnitServiceOfferingAssociationId': 3,
        'businessUnit': 'ICS',
        'serviceOffering': 'LTL',
        'serviceLevel': 'Standard'
      }
    ],
    'contracts': [
      {
        'customerAgreementContractID': 230,
        'customerContractName': 'RED-EDF',
        'customerContractNumber': null,
        'contractTypeID': 3,
        'contractTypeName': 'Transactional',
        'effectiveDate': '2019-02-13',
        'expirationDate': '2099-12-31'
      }
    ],
    'sections': null,
    'carriers': [
      {
        'customerAccessorialCarrierId': null,
        'carrierId': 1010,
        'carrierName': 'Test Carrier 10',
        'carrierCode': 'TCR10'
      }
    ],
    'billToAccounts': [
      {
        'customerAgreementID': 66,
        'customerAgreementName': 'Mission Foods-Wall Mart&Sam\'S (INLOBV)',
        'effectiveDate': '1995-01-01',
        'expirationDate': '2099-12-31',
        'customerAgreementContractSectionAccountID': 170,
        'billingPartyID': 507,
        'customerAgreementContractSectionID': 136,
        'customerAgreementContractSectionName': 'Legal Sec1',
        'customerAgreementContractID': 141,
        'customerContractName': 'Description for Legal Contract',
        'billToID': 507,
        'billToCode': 'ABSU15',
        'billToName': 'Ana Broker Service',
        'contractNumber': 'HG Legal Contract for INLOBV'
      }
    ],
    'requestServices': [
      {
        'customerAccessorialRequestServiceId': 1,
        'requestedServiceTypeId': null,
        'requestedServiceTypeCode': 'Blind Shipment'
      }
    ],
    'attachments': [
      {
        'customerAccessorialAttachmentId': 98,
        'accessorialAttachmentTypeDTO': {
          'accessorialAttachmentTypeId': 3,
          'accessorialAttachmentTypeName': 'Miscellaneous'
        },
        'documentNumber': '{5C4F9942-65C8-4303-9847-EDFBB0B2979B}',
        'documentName': 'Test Excel 12.xlsx',
        'addedOn': '2019-06-03',
        'addedBy': 'jisapr7',
        'fileType': null
      }
    ]
  };
  const response1 = {
    'documentationTypeId': 1,
    'documentationType': 'Instructional',
    'level': 'Agreement',
    'effectiveDate': '2019-06-03',
    'expirationDate': '2019-06-30',
    'customerAgreementId': 66,
    'equipmentCategoryCode': 'Chassis',
    'equipmentCategoryDescription': null,
    'equipmentTypeId': null,
    'equipmentType': 'Rod',
    'equipmentLengthId': 95,
    'equipmentLength': 44,
    'equipmentLengthDescription': 'Feet',
    'chargeTypeId': 2,
    'chargeTypeName': 'Detention With Power',
    'chargeTypeCode': 'DETENTIONP',
    'status': 'Active',
    'customerAccessorialText': {
      'customerAccessorialDocumentTextId': 392,
      'textName': '7t',
      'text': textVAlue
    },
    'serviceLevelBusinessUnitServiceOfferings': [
      {
        'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': null,
        'serviceLevelBusinessUnitServiceOfferingAssociationId': 3,
        'businessUnit': 'ICS',
        'serviceOffering': 'LTL',
        'serviceLevel': 'Standard'
      }
    ],
    'contracts': [
      {
        'customerAgreementContractID': 230,
        'customerContractName': 'RED-EDF',
        'customerContractNumber': null,
        'contractTypeID': 3,
        'contractTypeName': 'Transactional',
        'effectiveDate': '2019-02-13',
        'expirationDate': '2099-12-31'
      }
    ],
    'sections': null,
    'carriers': [
      {
        'customerAccessorialCarrierId': null,
        'carrierId': 1010,
        'carrierName': 'Test Carrier 10',
        'carrierCode': 'TCR10'
      }
    ],
    'billToAccounts': [
      {
        'customerAgreementID': 66,
        'customerAgreementName': 'Mission Foods-Wall Mart&Sam\'S (INLOBV)',
        'effectiveDate': '1995-01-01',
        'expirationDate': '2099-12-31',
        'customerAgreementContractSectionAccountID': 170,
        'billingPartyID': 507,
        'customerAgreementContractSectionID': 136,
        'customerAgreementContractSectionName': 'Legal Sec1',
        'customerAgreementContractID': 141,
        'customerContractName': 'Description for Legal Contract',
        'billToID': 507,
        'billToCode': 'ABSU15',
        'billToName': 'Ana Broker Service',
        'contractNumber': 'HG Legal Contract for INLOBV'
      }
    ],
    'requestServices': [
      {
        'customerAccessorialRequestServiceId': 1,
        'requestedServiceTypeId': null,
        'requestedServiceTypeCode': 'Blind Shipment'
      }
    ],
    'attachments': [
      {
        'customerAccessorialAttachmentId': 98,
        'accessorialAttachmentTypeDTO': {
          'accessorialAttachmentTypeId': 3,
          'accessorialAttachmentTypeName': 'Miscellaneous'
        },
        'documentNumber': '{5C4F9942-65C8-4303-9847-EDFBB0B2979B}',
        'documentName': 'Test Excel 12.xlsx',
        'addedOn': '2019-06-03',
        'addedBy': 'jisapr7',
        'fileType': null
      }
    ]
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentationDetailedViewComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, LocalStorageService, BroadcasterService, MessageService]
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentationDetailedViewComponent);
    component = fixture.componentInstance;
    documentationDetailedViewService = fixture.debugElement.injector.get(DocumentationDetailedViewService);
    localStorageService = fixture.debugElement.injector.get(LocalStorageService);
    broadcasterService = fixture.debugElement.injector.get(BroadcasterService);
    messageService = fixture.debugElement.injector.get(MessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    component.documentationDetailedViewModel.documentationDetailedViewResponse = response;
    component.ngOnInit();
  });

  it('should call ngOnDestroy', () => {
    component.documentationDetailedViewModel.documentationDetailedViewResponse = response;
    component.ngOnDestroy();
  });

  it('should call onClickClose', () => {
    component.documentationDetailedViewModel.documentationDetailedViewResponse = response;
    spyOn(localStorageService, 'setAccessorialTab').and.callThrough();
    component.onClickClose();
  });
  it('should call getAgreementDetails', () => {
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
    spyOn(documentationDetailedViewService, 'getAgreementDetails').and.returnValues(of(mockAgreementDetails));
    component.getAgreementDetails();
  });
  it('should call getAgreementDetails', () => {
    const mockEmptyAgreementDetails = {};
    spyOn(documentationDetailedViewService, 'getAgreementDetails').and.returnValues(of(mockEmptyAgreementDetails));
    component.getAgreementDetails();
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
    spyOn(documentationDetailedViewService, 'getAgreementDetails').and.returnValues(throwError(err));
    component.getAgreementDetails();
  });
  it('should call errorScenarioInagreementDetails', () => {
    const value = {
      error: {
        errors: [
          {
            errorMessage: 'failed'
          }
        ]
      }
    };
    component.errorScenarioInagreementDetails(value);
  });
  it('should call getDocumentationDetail', () => {
    component.documentationDetailedViewModel.documentationDetailedViewResponse = response;
    spyOn(documentationDetailedViewService, 'getDoumentaionDetails').and.callThrough();
    component.getDocumentationDetail();
  });
  it('should call getDocumentationDetail', () => {
    const errorValue = {
      error: {
        message: 'failed'
      }
    };
    spyOn(documentationDetailedViewService, 'getDoumentaionDetails').and.returnValues(throwError(errorValue));
    component.getDocumentationDetail();
  });
  it('should call errorScenarioForDocumentDetail', () => {
    const value = {
      error: {
        message: 'failed'
      }
    };
    component.errorScenarioForDocumentDetail(value);
  });

  it('should call getDocumentationDetailData', () => {
    component.documentationDetailedViewModel.documentationDetailedViewResponse = response;
    component.getDocumentationDetailData(response);
  });
  it('should call getDocumentationDetailData with error', () => {
    const partial = {
      'responseStatus' : 'PARTIAL',
      'errorMessages' : ['error']
    };
    const withPartialError = {...response, ...partial};
    component.documentationDetailedViewModel.documentationDetailedViewResponse = response;
    component.getDocumentationDetailData(withPartialError);
  });
  it('should call getDocumentationDetailData', () => {
    component.documentationDetailedViewModel.documentationDetailedViewResponse = response1;
    component.getDocumentationDetailData(response1);
  });

  it('should call getBusinessOffering', () => {
    component.documentationDetailedViewModel.documentationDetailedViewResponse = response;
    component.getBusinessOffering(response);
  });

  it('should call getCarrierCodes', () => {
    component.documentationDetailedViewModel.documentationDetailedViewResponse = response;
    component.getCarrierCodes(response);
  });

  it('should call getRequestService', () => {
    component.documentationDetailedViewModel.documentationDetailedViewResponse = response;
    component.getRequestService(response);
  });

  it('should call getattachmentAddedOnDate', () => {
    component.documentationDetailedViewModel.documentationDetailedViewResponse = response;
    component.getattachmentAddedOnDate(response);
  });

  it('should call viewAttachment', () => {
    component.documentationDetailedViewModel.documentationDetailedViewResponse = response;
    spyOn(documentationDetailedViewService, 'viewAttachmentDetails').and.callThrough();
    component.viewAttachment(response.attachments);
  });

  it('should call toastMessage', () => {
    component.toastMessage(messageService, 'critical', 'success', 'Contract has been created successfully');
  });
  it('should create overflowMenuList()', () => {
    component.overflowMenuList();
  });
});
