import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from './../../../../../app.module';
import { configureTestSuite } from 'ng-bullet';

import { ViewAgreementDetailsModule } from './../../../../view-agreement-details/view-agreement-details.module';
import { DocumentListService } from './document-list.service';

describe('DocumentListService', () => {
  let service: DocumentListService;
  let http: HttpClient;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      providers: [DocumentListService, { provide: APP_BASE_HREF, useValue: '/' }, HttpClient],
    });
  });

  beforeEach(() => {
    service = TestBed.get(DocumentListService);
    http = TestBed.get(HttpClient);
  });
  it('should be created', inject([DocumentListService], () => {
    expect(service).toBeTruthy();
  }));
  it('getDocumentList should call post', () =>  {
    const mockResponse = {
      'took': 22,
      'timed_out': false,
      '_shards': {
        'total': 3,
        'successful': 3,
        'skipped': 0,
        'failed': 0
      },
      'hits': {
        'total': 7,
        'max_score': null,
        'hits': [
          {
            '_index': 'pricing-accessorial-documentation',
            '_type': 'doc',
            '_id': '3',
            '_score': null,
            '_source': {
              'effectiveDate': null,
              'expirationDate': null,
              'customerAgreementId': null,
              'accessorialDocumentTypeId': null,
              'chargeTypeId': null,
              'chargeTypeName': null,
              'customerChargeName': null,
              'equipmentCategoryCode': null,
              'equipmentTypeCode': null,
              'equipmentLengthId': null,
              'equipmentTypeId': null,
              'customerAccessorialAccounts': null,
              'customerAccessorialServiceLevelBusinessUnitServiceOfferings': [
                {
                  'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': null,
                  'serviceLevelBusinessUnitServiceOfferingAssociationId': null,
                  'businessUnit': null,
                  'serviceOffering': null,
                  'serviceLevel': null
                }
              ],
              'customerAccessorialRequestServices': [
                {
                  'customerAccessorialRequestServiceId': null,
                  'requestedServiceTypeId': null,
                  'requestedServiceTypeCode': null
                }
              ],
              'customerAccessorialCarriers': [
                {
                  'customerAccessorialCarrierId': null,
                  'carrierId': null,
                  'carrierName': null,
                  'carrierCode': null
                }
              ],
              'level': null,
              'customerAccessorialDocumentConfigurationId': null,
              'accessorialDocumentType': null,
              'documentationCategory': null,
              'customerAccessorialText': {
                'customerAccessorialDocumentTextId': null,
                'textName': null,
                'text': null
              },
              'customerAccessorialAttachments': [
                {
                  'customerAccessorialAttachmentId': null,
                  'accessorialAttachmentTypeId': null,
                  'accessorialAttachmentTypeName': null,
                  'documentNumber': null,
                  'documentName': null,
                  'addedOn': null,
                  'addedBy': null,
                  'fileType': null
                }
              ],
              'accessorialDocumentTypelevel': null
            },
            'sort': [
              null,
              'test3',
              's3',
              null,
              null,
              null,
              null
            ]
          }
        ]
      }
    };
    service.getDocumentList(mockResponse);
  });
  it('getMockJson should call post', () =>  {
    service.getMockJson();
  });
});
