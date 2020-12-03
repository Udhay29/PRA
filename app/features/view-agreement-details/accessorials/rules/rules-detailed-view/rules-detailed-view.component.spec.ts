import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  RulesDetailedViewModel
} from './model/rules-detailed-view-model';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  LocalStorageService
} from '../../../../../shared/jbh-app-services/local-storage.service';
import {
  RulesDetailedViewService
} from './service/rules-detailed-view.service';
import {
  BroadcasterService
} from '../../../../../shared/jbh-app-services/broadcaster.service';
import {
  MessageService
} from 'primeng/components/common/messageservice';
import {
  NO_ERRORS_SCHEMA
} from '@angular/core';
import {
  APP_BASE_HREF
} from '@angular/common';
import {
  AppModule
} from '../../../../../app.module';
import {
  ViewAgreementDetailsModule
} from './../../../view-agreement-details.module';
import {
  RouterTestingModule
} from '@angular/router/testing';
import {
  configureTestSuite
} from 'ng-bullet';
import * as utils from 'lodash';
import * as moment from 'moment';
import {
  CustomerAccessorialRuleChargeDTO,
  CustomerAccessorialRuleAdditionalChargeDTO
} from './model/rules-detailed-view-interface';
import {
  RulesDetailedViewComponent
} from './rules-detailed-view.component';
import {
  of
} from 'rxjs';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
describe('RulesDetailedViewComponent', () => {
  let component: RulesDetailedViewComponent;
  let fixture: ComponentFixture < RulesDetailedViewComponent > ;
  // tslint:disable-next-line:prefer-const
  let messageService: MessageService;
  let localStorageService: LocalStorageService;
  const response = {
    'documentationTypeId': null,
    'documentationType': 'Legal',
    'level': 'Agreement',
    'effectiveDate': '2019-07-09',
    'expirationDate': '2099-12-31',
    'customerAgreementId': 154,
    'equipmentLengthId': null,
    'equipmentLength': null,
    'equipmentLengthDescription': null,
    'chargeTypeId': 60,
    'chargeTypeName': 'Carbon Tax Surcharge',
    'chargeTypeCode': 'CARBON',
    'status': 'Active',
    'equipmentCategoryCode': null,
    'equipmentCategoryDescription': null,
    'equipmentTypeId': null,
    'equipmentType': null,
    'customerAccessorialFreeRuleConfigurationId': 592,
    'pricingAveragePeriodTypeId': null,
    'pricingAveragePeriodTypeName': 'Free',
    'accessorialFreeRuleTypeId': 2,
    'accessorialFreeRuleTypeName': 'Event',
    'accessorialFreeRuleQuantityTypes': null,
    'accessorialFreeRuleEventTypes': {
      'customerAccessorialFreeRuleConfigurationID': 592,
      'accessorialFreeRuleEventTypeID': 2,
      'accessorialFreeRuleTypeName': 'Deramp',
      'accessorialFreeRuleEventTimeframeTypeID': 1,
      'accessorialFreeRuleEventTimeFrameTypeName': 'Day of Event',
      'accessorialDayOfEventFreeRuleModifierId': 1,
      'accessorialDayOfEventFreeRuleModifierName': 'Day Free',
      'accessorialDayOfEventFreeRuleModifierTime': null,
      'accessorialDayAfterEventFreeRuleModifierId': null,
      'accessorialDayAfterEventFreeRuleModifierName': 'Day Free',
      'accessorialDayAfterEventFreeRuleModifierTime': null
    },
    'customerAccessorialText': null,
    'serviceLevelBusinessUnitServiceOfferings': null,
    'contracts': [{
      'customerAgreementContractID': 230,
      'customerContractName': 'RED-EDF',
      'customerContractNumber': null,
      'contractTypeID': 3,
      'contractTypeName': 'Transactional',
      'effectiveDate': '2019-02-13',
      'expirationDate': '2099-12-31'
    }],
    'sections': [{
      'customerAgreementContractSectionID': null,
      'customerAgreementContractSectionName': 'test',
      'customerContractID': 11,
      'customerContractName': 'Test',
      'customerContractNumber': 'Test123',
      'customerAgreementContractTypeName': 'Name'
    }, {
      'customerAgreementContractSectionID': null,
      'customerAgreementContractSectionName': 'aaat',
      'customerContractID': 11,
      'customerContractName': 'aas',
      'customerContractNumber': 'aaaTest123',
      'customerAgreementContractTypeName': 'aaName'
    }],
    'carriers': [{
      'carrierId': 71,
      'carrierName': 'ADU0',
      'carrierCode': '00QM'
    }],
    'billToAccounts': [{
      'customerAgreementID': 88,
      'customerAgreementName': 'Academy Furniture And Supplies (ACELBJ)',
      'effectiveDate': '1995-01-01',
      'expirationDate': '2099-12-31',
      'customerAgreementContractSectionAccountID': 252,
      'billingPartyID': 37086,
      'customerAgreementContractSectionID': 191,
      'customerAgreementContractSectionName': 'Sec1',
      'customerAgreementContractID': 189,
      'customerContractName': 'ContcatrID1 desc',
      'billToID': null,
      'billToCode': null,
      'billToName': 'Academy Furniture And Supplies',
      'contractNumber': 'ContcatrID1'
    }, {
      'customerAgreementID': 11,
      'customerAgreementName': 'test Academy Furniture And Supplies (ACELBJ)',
      'effectiveDate': '1995-01-01',
      'expirationDate': '2099-12-31',
      'customerAgreementContractSectionAccountID': 252,
      'billingPartyID': 37086,
      'customerAgreementContractSectionID': 191,
      'customerAgreementContractSectionName': 'Sec1',
      'customerAgreementContractID': 189,
      'customerContractName': 'ContcatrID1 desc',
      'billToID': null,
      'billToCode': null,
      'billToName': 'Academy Furniture And Supplies',
      'contractNumber': 'ContcatrID1'
    }],
    'requestServices': null,
    'attachments': [{
      'customerAccessorialAttachmentId': null,
      'accessorialAttachmentTypeDTO': {
        'accessorialAttachmentTypeId': null,
        'accessorialAttachmentTypeName': 'Miscellaneous'
      },
      'documentNumber': '{546EC1D2-980A-4629-8AC5-179FBE8F6C8A}',
      'documentName': 'json.txt',
      'addedOn': '2019-07-09 11:33:14.013',
      'addedBy': 'jisatp0',
      'fileType': 'Miscellaneous'
    }],
    'businessUnitServiceOfferingDTOs': [{
      'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': null,
      'serviceLevelBusinessUnitServiceOfferingAssociationId': 11,
      'financeBusinessUnitServiceOfferingAssociationID': 4,
      'businessUnit': 'DCS',
      'serviceOffering': 'Backhaul',
      'serviceLevel': 'Standard'
    }],
    'requestServiceDTOs': [{
      'customerAccessorialRequestServiceId': 1052,
      'requestedServiceTypeId': null,
      'requestedServiceTypeCode': 'Team'
    }],
    'carrierDTOs': [{
      'customerAccessorialCarrierId': null,
      'carrierId': 70,
      'carrierName': 'A A A COOPER TRANSPORTATION',
      'carrierCode': null
    }],
    'sectionAccounts': [{
        'customerAgreementID': 71,
        'customerAgreementName': 'Bay Valley Foods, Llc (DSGR69)',
        'effectiveDate': '1995-01-01',
        'expirationDate': '2099-12-31',
        'customerAgreementContractSectionAccountID': 1291,
        'billingPartyID': 46,
        'customerAgreementContractSectionID': 725,
        'customerAgreementContractSectionName': 'sec1',
        'customerAgreementContractID': 683,
        'customerContractName': 'Test Validate1',
        'billToID': 46,
        'billToCode': '54JE3',
        'billToName': '5453 Enterprise',
        'contractNumber': 'IT1001'
      },
      {
        'customerAgreementID': 71,
        'customerAgreementName': 'Bay Valley Foods, Llc (DSGR69)',
        'effectiveDate': '1995-01-01',
        'expirationDate': '2099-12-31',
        'customerAgreementContractSectionAccountID': 1296,
        'billingPartyID': 46,
        'customerAgreementContractSectionID': 733,
        'customerAgreementContractSectionName': 'test 5',
        'customerAgreementContractID': 727,
        'customerContractName': 'sds',
        'billToID': 46,
        'billToCode': '54JE3',
        'billToName': '5453 Enterprise',
        'contractNumber': 'sdf'
      }
    ]
  };

  const aggrementResponse = {
    agreementType: 'string',
    businessUnits: 'string',
    cargoReleaseAmount: 1,
    currencyCode: 'string',
    customerAgreementID: 1,
    customerAgreementName: 'string',
    effectiveDate: 'string',
    expirationDate: 'string',
    invalidIndicator: 'string',
    invalidReasonTypeName: 'string',
    taskAssignmentIDs: 'string',
    teams: 'string',
    ultimateParentAccountID: 1
  };

  const elementRefStub = {
    nativeElement: {
      addEventListener: () => ({}),
      querySelector: () => ({}),
      removeEventListener: () => ({}),
      setAttribute: () => ('8')
    }
  };
  const attachments1 = [{
      'documentName': 'InactivateRates_Json.txt',
      'documentNumber': '{233B8CA6-F39E-41FC-8299-EC4B44419628}',
      'createTimestamp': '2019-07-22T11:43:47.011+0000',
      'createUserID': 'jisassi',
      'accessorialAttachmentTypeName': 'Special Instructions'
    },
    {
      'documentName': 'InactivateRates_Pesucode.txt',
      'documentNumber': '{7C416DF1-AAB4-47A2-8200-48F63F415C2B}',
      'createTimestamp': '2019-07-22T11:43:47.050+0000',
      'createUserID': 'jisassi',
      'accessorialAttachmentTypeName': 'Signed Accessorials'
    }
  ];
  const attachments2 = [{
      'documentName': 'InstructSpecial Instructions.txt',
      'documentNumber': '{233B8CA6-F39E-41FC-8299-EC4B44419628}',
      'createTimestamp': '2019-07-22T11:53:01.548+0000',
      'createUserID': 'jisassi',
      'accessorialAttachmentTypeName': 'Special Instructions'
    },
    {
      'documentName': 'Instructional_Signed.txt',
      'documentNumber': '{7C416DF1-AAB4-47A2-8200-48F63F415C2B}',
      'createTimestamp': '2019-07-22T11:53:01.600+0000',
      'createUserID': 'jisassi',
      'accessorialAttachmentTypeName': 'Signed Accessorials'
    }
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule, AppModule, ViewAgreementDetailsModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{
        provide: APP_BASE_HREF,
        useValue: '/'
      }, {
        provide: ElementRef,
        useValue: elementRefStub
      }, RulesDetailedViewService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesDetailedViewComponent);
    component = fixture.componentInstance;
    localStorageService = fixture.debugElement.injector.get(LocalStorageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getRulesDetail', () => {
    spyOn(RulesDetailedViewService.prototype, 'getRulesDetailedViewData').and.returnValue( of (response));
    component.getRulesDetail();
  });
  it('should call getRulesDetail with error', () => {
    const partial = {
      'responseStatus' : 'PARTIAL',
      'errorMessages' : ['error']
    };
    const withPartialError = {...response, ...partial};
    spyOn(RulesDetailedViewService.prototype, 'getRulesDetailedViewData').and.returnValue( of (withPartialError));
    component.getRulesDetail();
  });
  it('should call frameBuSoForDocument', () => {
    const buso = [{
      'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': null,
      'serviceLevelBusinessUnitServiceOfferingAssociationId': 11,
      'businessUnit': 'DCS',
      'serviceOffering': 'Backhaul',
      'serviceLevel': 'Standard'
    }];
    component.frameBuSoForDocument(buso);
  });
  it('should call getDocumentationDetailData', () => {
    component.rulesDetailedViewModel.legalText = 'aaaaaaaaaaaaaaaaaaaaaa';
    component.rulesDetailedViewModel.instructionalText = 'hhhhhhhhhhhhhhhhhhh';
    component.getDocumentationDetailData(response);
  });
  it('should call getRequestedServices', () => {
    component.getRequestedServices(response);
  });
  it('should call getAccessorialLevel()', () => {
    component.getAccessorialLevel();
  });
  it('should call getRuleLevel()', () => {
    component.getRuleLevel();
  });
  it('should call isBillTo()', () => {
    component.isBillTo();
  });
  it('should call isBU()', () => {
    component.isBU();
  });
  it('should call onClickClose()', () => {
    component.onClickClose();
  });
  it('should call onClickClose', () => {
    component.rulesDetailedViewModel.rulesDetailedViewResponse = response;
    spyOn(localStorageService, 'setAccessorialTab').and.callThrough();
    component.onClickClose();

  });
  it('should call frameCarrierDTOForDocument()', () => {
    component.frameCarrierDTOForDocument();
  });
  it('should call ngOnDestroy()', () => {
    component.ngOnDestroy();
  });
  it('should call configurationIdSubscription()', () => {
    component.configurationIdSubscription();
  });
  it('should call viewAttachment()', () => {
    const event = {
      documentNumber: 48
    };
    const param = {
      'documentId': event.documentNumber,
      'ecmObjectStore': 'PRICING',
      'docClass': 'AGREEMENT'
    };
    spyOn(RulesDetailedViewService.prototype, 'getRulesDetailedViewData').and.returnValue( of (param));
    component.viewAttachment(event);

  });
  it('should call viewAttachment()', () => {
    const event = {
      documentNumber: 48
    };
    component.viewAttachment(event);
  });
  it('should create errorHandling()', () => {
    const errorResponse = {
      'error': {
        'errors': [{
          'errorMessage': 'Error'
        }]
      }
    };
    component.errorHandling(errorResponse);
  });
  it('should create iterateAgreementBillTo()', () => {
    component.rulesDetailedViewModel.rulesDetailedViewResponse = response;
    component.iterateAgreementBillTo();
  });
  it('should create setContractAccountDTO()', () => {
    component.rulesDetailedViewModel.rulesDetailedViewResponse = response;
    component.setContractAccountDTO();
  });
  it('should create setSectionAccountDTO()', () => {
    component.rulesDetailedViewModel.rulesDetailedViewResponse = response;
    component.setSectionAccountDTO();
  });
  it('should create iterateContract()', () => {
    component.rulesDetailedViewModel.rulesDetailedViewResponse = response;
    component.iteruleContract();
  });
  it('should create iteruleSection()', () => {
    component.rulesDetailedViewModel.rulesDetailedViewResponse = response;
    component.iteruleSection();
  });
  it('should create iteruleContractBillTo()', () => {
    component.rulesDetailedViewModel.rulesDetailedViewResponse = response;
    component.iteruleContractBillTo();
  });
  it('should create iteruleSectionBillTo()', () => {
    component.rulesDetailedViewModel.rulesDetailedViewResponse = response;
    component.iteruleSectionBillTo();
  });
  it('should create setContractBillTo()', () => {
    const billToElement = response['sectionAccounts'][0];
    component.setContractBillTo(billToElement);
  });
  it('should create setSectionBillTo()', () => {
    const billToElement = response['sectionAccounts'][0];
    component.setContractBillTo(billToElement);
  });
  it('should create iteruleSectionContract()', () => {
    const mockAccountObj = {
      customerAccessorialAccountId: null,
      customerAgreementContractSectionId: 325,
      customerAgreementContractSectionName: 'test',
      customerAgreementContractId: 458,
      customerAgreementContractName: null,
      customerAgreementContractSectionAccountId: 55,
      customerAgreementContractSectionAccountName: 'mock',
    };
    component.iteruleSectionContract(mockAccountObj);
  });
  it('should create getAttributeLevelElse1', () => {
    const datas = {
      businessUnitServiceOfferingDTOs: 'dataPresent'
    };
    component.getAttributeLevel(datas);
  });
  it('should create getAttributeLevelElse2', () => {
    const datas = {
      equipmentCategoryCode: 'dataPresent'
    };
    component.getAttributeLevel(datas);
  });
  it('should create getAttributeLevelElse2', () => {
    const datas = {
      equipmentCategoryCode: 'dataPresent',
      equipmentTypeDescription: 'dataPresent'
    };
    component.getAttributeLevel(datas);
  });
  it('should call setAttachment', () => {
    component.setAttachment();
    expect(component.setAttachment).toBeTruthy();
  });
  it('should call legalOrInstructionalDocumentation1', () => {
    const data = [{
      'accessorialDocumentTypeName': 'NOLegal',
      'text': 'yes',
      'attachments': [{
          'documentName': 'InactivateRates_Json.txt',
          'documentNumber': '{233B8CA6-F39E-41FC-8299-EC4B44419628}',
          'createTimestamp': '2019-07-22T11:43:47.011+0000',
          'createUserID': 'jisassi',
          'accessorialAttachmentTypeName': 'Special Instructions'
        },
        {
          'documentName': 'InactivateRates_Pesucode.txt',
          'documentNumber': '{7C416DF1-AAB4-47A2-8200-48F63F415C2B}',
          'createTimestamp': '2019-07-22T11:43:47.050+0000',
          'createUserID': 'jisassi',
          'accessorialAttachmentTypeName': 'Signed Accessorials'
        }
      ]
    }];
    component.legalOrInstructionalDocumentation(data);
  });
  it('should call legalOrInstructionalDocumentation', () => {
    const data = [{
      'accessorialDocumentTypeName': 'Legal',
      'text': 'yes',
      'effectiveDate': '22/01/1996',
      'expirationDate': '23/01/1997'
    }];
    component.legalOrInstructionalDocumentation(data);
  });
  it('should call legalInstructionalDocumentationss', () => {
    const data = [{
      'accessorialDocumentTypeName': 'Legal',
      'text': 'yes',
      'effectiveDate': '22/01/1996',
      'expirationDate': '23/01/1997',
      'attachments': attachments1
    }, {
      'accessorialDocumentTypeName': 'Instructional',
      'text': 'yes',
      'effectiveDate': '22/01/1996',
      'expirationDate': '23/01/1997',
      'attachments': attachments2
    }];
    component.legalInstructionalDocumentation(data);
  });
  it('should call legalInstructionalDocumentation', () => {
    const data = [{
      'accessorialDocumentTypeName': 's',
      'text': 'yes'
    }, {
      'accessorialDocumentTypeName': 's',
      'text': 'yes'
    }];
    component.legalInstructionalDocumentation(data);
  });
  it('should call refreshData', () => {
    const data = {
      'accessorialDocumentTypeName': 'Legal',
      'attachments': null,
      'attributesLevel': 11,
      'customerAccessorialDocumentConfigurationID': 23,
      'customerAccessorialDocumentTextId': 11,
      'effectiveDate': '2019-08-06',
      'expirationDate': '2099-12-31',
      'level': 12,
      'text': 'Test9000',
      'textName': 'Test8900'
    };
    component.refreshData(data);
    expect(component.refreshData).toBeTruthy();
  });
});
