import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';

import { AppModule } from '../../../../../../app.module';
import { ViewAgreementDetailsModule } from './../../../../view-agreement-details.module';
import { RatesStairStepViewComponent } from './rates-stair-step-view.component';

describe('RatesStairStepViewComponent', () => {
  let component: RatesStairStepViewComponent;
  let fixture: ComponentFixture<RatesStairStepViewComponent>;
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
    'customerAccessorialStairRateDTO': {
      'customerAccessorialStairRateId': 1,
      'accessorialRateTypeId': 4,
      'accessorialRateTypeName': 'string',
      'accessorialRateRoundingTypeId': 5,
      'accessorialRateRoundingTypeName': 'string test',
      'accessorialMaximumRateApplyTypeId': 6,
      'accessorialMaximumRateApplyTypeName': 'string string',
      'minimumAmount': 45,
      'maximumAmount': 90,
      'customerAccessorialStairStepRateDTOs': [{
        'customerAccessorialStairStepRateId': 55,
        'fromRateTypeQuantity': 12,
        'toRateTypeQuantity': 4,
        'stairStepRateAmount': 1000,
        'stepNumber': 2
      }]
    },
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
    'customerAccessorialRateAdditionalChargeDTOs': [{
      'customerAccessorialAdditionalChargeId': 12,
      'chargeTypeId': 2,
      'chargeTypeName': 'string',
      'accessorialRateTypeName': 'string test',
      'accessorialRateTypeId': 45,
      'additionalRateAmount': 500
    }],
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
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterTestingModule, HttpClientTestingModule, AppModule, ViewAgreementDetailsModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesStairStepViewComponent);
    component = fixture.componentInstance;
    component.detailedViewResponse = mockRatesDetailedViewResponse;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call on init', () => {
    component.ngOnInit();
  });
});
