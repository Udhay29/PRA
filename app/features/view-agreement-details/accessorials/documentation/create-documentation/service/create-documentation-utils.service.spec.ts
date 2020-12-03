import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AppModule } from '../../../../../../app.module';
import { configureTestSuite } from 'ng-bullet';

import { ViewAgreementDetailsModule } from './../../../../../view-agreement-details/view-agreement-details.module';

import { CreateDocumentationUtilsService } from './create-documentation-utils.service';
import { CreateDocumentationComponent } from '../create-documentation.component';
import { CreateDocumentationService } from './create-documentation.service';

describe('CreateDocumentationUtilsService', () => {
  let service: CreateDocumentationUtilsService;
  let http: HttpClient;
  let fixture: ComponentFixture<CreateDocumentationComponent>;
  let createDocComp: CreateDocumentationComponent;
  let response;
  let contractRespone;
  let sectionResponse;
  let createDocumentationService: CreateDocumentationService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [CreateDocumentationService, CreateDocumentationUtilsService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDocumentationComponent);
    createDocComp = fixture.componentInstance;
    service = TestBed.get(CreateDocumentationUtilsService);
    createDocumentationService = TestBed.get(CreateDocumentationService);
    http = TestBed.get(HttpClient);
    response = [{
      'customerAgreementID': 1234,
      'customerAgreementName': 'test',
      'effectiveDate': '2018-12-28',
      'expirationDate': '2018-12-29',
      'customerAgreementContractSectionAccountID': 123,
      'billingPartyID': 123,
      'customerAgreementContractSectionID': 546,
      'customerAgreementContractSectionName': 'Section 1',
      'customerAgreementContractID': 567,
      'customerContractName': 'Conytract 1',
      'billToDetailsDTO': {
        'billToID': 123,
        'billToCode': 'Bill 1',
        'billToName': 'Bill To 1'
      }
    }];
     contractRespone = [{
      'customerAgreementContractID': 1234,
      'customerContractName': 'COntract1',
      'customerContractNumber': 'C123',
      'contractTypeName': 'Legal123',
      'effectiveDate': '2018-12-28',
      'expirationDate': '2018-12-29',
      'isChecked': true
    }];
    sectionResponse = [{
      'customerAgreementContractSectionID': 1234,
      'customerAgreementContractSectionName': 'Section123',
      'customerAgreementContractID': 456,
      'customerContractName': 'COntract1',
      'customerContractNumber': 'C123',
      'contractTypeName': 'Legal123',
      'effectiveDate': '2018-12-28',
      'expirationDate': '2018-12-29',
      'isChecked': true,
      'currencyCode': 'USD',
    }];
  });

  it('should be created', inject([CreateDocumentationUtilsService], () => {
    expect(service).toBeTruthy();
  }));

  it('should call documentationPostFramer', () => {
    createDocComp.createDocumentationForm();
    createDocComp.createDocumentationModel.agreementDetails = {
       'agreementType': 'Legal',
       'businessUnits': 'JCI',
       'cargoReleaseAmount': 1,
       'currencyCode': 'USD',
       'customerAgreementID': 349,
       'customerAgreementName': 'a',
       'effectiveDate': '1995-01-01',
       'expirationDate': '2099-12-31',
       'invalidIndicator': 'test',
       'invalidReasonTypeName': 'test',
       'taskAssignmentIDs': 'test',
       'teams': 'test',
       'ultimateParentAccountID': 1
    };
    const optionalForm = createDocComp.optionalFields['optionalAttributesModel'].optionalForm;
    optionalForm.controls['chargeType'].setValue([{'label': '012_Charge', 'value': 0, 'description': ''}]);
    optionalForm.controls['equipmentType'].value = {'label': 'Intermodal', 'id': 2, 'value': 'Intermodal'};
    createDocComp.createDocumentationModel['selectedDocumentType'] = {'value': 1, 'label': 'Legal'};
    service.documentationPostFramer(createDocComp.createDocumentationModel,
      createDocComp.optionalFields['optionalAttributesModel'], createDocComp.billTo['billToModel']);
  });

  it('should call iterateCarriers', () => {
    createDocComp.optionalFields['optionalAttributesModel']
    .optionalForm.controls['carriers'].setValue([{'label': 'test', 'value': {'code': 'test', 'id': 1}}]);
    service.iterateCarriers(createDocComp.optionalFields['optionalAttributesModel']);
  });

  it('should call iterateRequestedService', () => {
    service.iterateRequestedService(createDocComp.optionalFields['optionalAttributesModel']);
  });

  it('should call iterateBusinessUnitValues', () => {
    service.iterateBusinessUnitValues(createDocComp.optionalFields['optionalAttributesModel']);
  });

  it('should call iterateBillToSection', () => {
    createDocComp.billTo['billToModel']['selectedBillTo'] = response;
    createDocComp.createDocumentationModel['selectedSectionValue'] = sectionResponse;
    service.iterateBillToSection(createDocComp.createDocumentationModel, createDocComp.billTo['billToModel']);
  });

  it('should call iterateBillToContract', () => {
    createDocComp.billTo['billToModel']['selectedBillTo'] = response;
    createDocComp.createDocumentationModel['selectedContractValue'] = contractRespone;
    service.iterateBillToContract(createDocComp.createDocumentationModel, createDocComp.billTo['billToModel']);
  });

  it('should call iterateContractSectionBillTo', () => {
    createDocComp.createDocumentationModel['selectedSectionValue'] = sectionResponse;
    createDocComp.createDocumentationModel['selectedContractValue'] = contractRespone;
    service.iterateContractSectionBillTo(createDocComp.createDocumentationModel);
  });

  it('should call iterateBillTos', () => {
    service.iterateBillTos(createDocComp.createDocumentationModel, createDocComp.billTo['billToModel']);
  });

  it('should call iterateContractSection', () => {
    service.iterateContractSection(createDocComp.createDocumentationModel, createDocComp.billTo['billToModel']);
  });
});
