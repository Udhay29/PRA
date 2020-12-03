import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from './../../../view-agreement-details.module';
import { RatesDetailedViewComponent } from './rates-detailed-view.component';
import { RatesDetailedViewService } from './service/rates-detailed-view.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RatesDetailedViewComponent', () => {
  let component: RatesDetailedViewComponent;
  let fixture: ComponentFixture<RatesDetailedViewComponent>;
  let detailService: RatesDetailedViewService;
  const mockRatesDetailedViewResponse = {
    'customerAccessorialRateConfigurationId': 1143,
    'currencyCode': 'USD',
    'equipmentCategoryCode': 'Hopper',
    'equipmentTypeDescription': null,
    'equipmentLengthId': 197,
    'equipmentLength': 47,
    'equipmentTypeId': null,
    'rateItemizeIndicator': null,
    'groupRateTypeId': null,
    'groupRateTypeName': null,
    'equipmentLengthDescription': 'Feet',
    'chargeTypeId': 5,
    'chargeTypeName': null,
    'chargeTypeCode': null,
    'waived': false,
    'calculateRateManually': false,
    'passThrough': true,
    'rateSetupStatus': false,
    'documentLegalDescription': null,
    'documentInstructionalDescription': null,
    'documentFileNames': null,
    'hasAttachment': null,
    'status': 'active',
    'effectiveDate': '2019-05-21',
    'expirationDate': '2099-12-31',
    'customerAgreementId': 2249,
    'accessorialDocumentTypeId': null,
    'customerChargeName': null,
    'businessUnitServiceOfferingDTOs': [
      {
        'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': null,
        'serviceLevelBusinessUnitServiceOfferingAssociationId': 11,
        'financeBusinessUnitServiceOfferingAssociationID': 4,
        'businessUnit': 'DCS',
        'serviceOffering': 'Backhaul',
        'serviceLevel': 'Standard'
      }
    ],
    'requestServiceDTOs': [{
      'customerAccessorialRequestServiceId': 1052,
      'requestedServiceTypeId': null,
      'requestedServiceTypeCode': 'Team'
    }],
    'carrierDTOs': [
      {
        'customerAccessorialCarrierId': null,
        'carrierId': 70,
        'carrierName': 'A A A COOPER TRANSPORTATION',
        'carrierCode': null
      }
    ],
    'level': 'Agreement - BU',
    'customerAccessorialStairRateDTO': null,
    'customerAccessorialRateChargeDTOs': [
      {
        'customerAccessorialRateChargeId': 1117,
        'accessorialRateTypeId': 5,
        'accessorialRateTypeName': 'Percent Pte',
        'accessorialRateRoundingTypeId': 1,
        'accessorialRateRoundingTypeName': 'Down',
        'rateAmount': 12,
        'minimumAmount': null,
        'maximumAmount': null,
        'rateOperator': null
      }
    ],
    'customerAccessorialRateAdditionalChargeDTOs': null,
    'customerAccessorialRateAlternateChargeViewDTO': null,
    'contracts' : [ {
      'customerAgreementContractID' : 230,
      'customerContractName' : 'RED-EDF',
      'customerContractNumber' : null,
      'contractTypeID' : 3,
      'contractTypeName' : 'Transactional',
      'effectiveDate' : '2019-02-13',
      'expirationDate' : '2099-12-31'
    } ],
    'sections' : [ {
      'customerAgreementContractSectionID' : 244,
      'customerAgreementContractSectionName' : 'WER',
      'customerContractID' : 230,
      'customerContractName' : 'RED-EDF',
      'customerContractNumber' : null,
      'customerAgreementContractTypeName' : null,
      'effectiveDate' : '2019-02-13',
      'expirationDate' : '2099-12-31'
    } ],
    'sectionAccounts': [
      {
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

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesDetailedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    detailService = fixture.debugElement.injector.get(RatesDetailedViewService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create overflowMenuList()', () => {
    component.overflowMenuList();
  });
  it('should create getDocumentationDetails()', () => {
    const documentResponse = [{
      'accessorialDocumentTypeName': 'Legal'
    }];
    spyOn(detailService, 'getRatesDocumentation').and
    .returnValue(of(documentResponse));

    component.getDocumentationDetails(mockRatesDetailedViewResponse);
  });
  it('should create getDocumentationDetails()', () => {
    const documentResponse = [{
      'accessorialDocumentTypeName': 'Instructional'
    }];
    spyOn(detailService, 'getRatesDocumentation').and
    .returnValue(of(documentResponse));

    component.getDocumentationDetails(mockRatesDetailedViewResponse);
  });
  it('should create loadRequestService()', () => {
    component.ratesDetailedViewModel.serviceDetails = [{
      'customerAccessorialRequestServiceId': 1052,
      'requestedServiceTypeId': null,
      'requestedServiceTypeCode': 'Team'
    }];
    component.loadRequestService();
  });
  it('should create errorHandling()', () => {
    const errorResponse = {
      'error': {
        'errors': [{
          'errorMessage': 'Error'
        }
        ]
      }
    };
    component.errorHandling(errorResponse);
  });
  it('should create getRatesDetail()', () => {
    spyOn(detailService, 'getRatesDetailedViewData').and
    .returnValue(of(mockRatesDetailedViewResponse));

    component.getRatesDetail();
  });
  it('should create getRatesDetail with error()', () => {
    const partial = {
      'responseStatus' : 'PARTIAL',
      'errorMessages' : ['error']
    };
    const withPartialError = {...mockRatesDetailedViewResponse, ...partial};
    spyOn(detailService, 'getRatesDetailedViewData').and
    .returnValue(of(withPartialError));
    component.getRatesDetail();
  });
  it('should create frameDocumentationReqParam()', () => {
    component.frameDocumentationReqParam(mockRatesDetailedViewResponse);
  });
  it('should create frameAccountDTOForDocument()', () => {
    component.ratesDetailedViewModel.ratesDetailedViewResponse = mockRatesDetailedViewResponse;
    component.frameAccountDTOForDocument();
  });
  it('should create setAccountDTO()', () => {
    component.ratesDetailedViewModel.ratesDetailedViewResponse = mockRatesDetailedViewResponse;
    component.setAccountDTO();
  });
  it('should create iterateAgreementBillTo()', () => {
    component.ratesDetailedViewModel.ratesDetailedViewResponse = mockRatesDetailedViewResponse;
    component.iterateAgreementBillTo();
  });
  it('should create setContractAccountDTO()', () => {
    component.ratesDetailedViewModel.ratesDetailedViewResponse = mockRatesDetailedViewResponse;
    component.setContractAccountDTO();
  });
  it('should create setSectionAccountDTO()', () => {
    component.ratesDetailedViewModel.ratesDetailedViewResponse = mockRatesDetailedViewResponse;
    component.setSectionAccountDTO();
  });
  it('should create iterateContract()', () => {
    component.ratesDetailedViewModel.ratesDetailedViewResponse = mockRatesDetailedViewResponse;
    component.iterateContract();
  });
  it('should create iterateSection()', () => {
    component.ratesDetailedViewModel.ratesDetailedViewResponse = mockRatesDetailedViewResponse;
    component.iterateSection();
  });
  it('should create iterateContractBillTo()', () => {
    component.ratesDetailedViewModel.ratesDetailedViewResponse = mockRatesDetailedViewResponse;
    component.iterateContractBillTo();
  });
  it('should create iterateSectionBillTo()', () => {
    component.ratesDetailedViewModel.ratesDetailedViewResponse = mockRatesDetailedViewResponse;
    component.iterateSectionBillTo();
  });
  it('should create setContractBillTo()', () => {
    const billToElement = mockRatesDetailedViewResponse['sectionAccounts'][0];
    component.setContractBillTo(billToElement);
  });
  it('should create setSectionBillTo()', () => {
    const billToElement = mockRatesDetailedViewResponse['sectionAccounts'][0];
    component.setContractBillTo(billToElement);
  });
  it('should create iterateSectionContract()', () => {
    const mockAccountObj = {
      customerAccessorialAccountId: null,
      customerAgreementContractSectionId: 325,
      customerAgreementContractSectionName: 'test',
      customerAgreementContractId: 458,
      customerAgreementContractName: null,
      customerAgreementContractSectionAccountId: 55,
      customerAgreementContractSectionAccountName: 'mock',
    };
    component.iterateSectionContract(mockAccountObj);
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
});
