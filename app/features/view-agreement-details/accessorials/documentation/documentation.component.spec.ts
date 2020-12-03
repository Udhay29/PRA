import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from 'ng-bullet';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppModule } from '../../../../app.module';
import { ViewAgreementDetailsModule } from '../../view-agreement-details.module';

import { DocumentationComponent } from './documentation.component';
import { DocumentListService } from '../documentation/service/document-list.service';
import { DocumentationService } from '../documentation/service/documentation.service';
import { DocumentsFilterQuery } from '../documentation/query/documentation-list.query';

describe('DocumentationComponent', () => {
  let component: DocumentationComponent;
  let fixture: ComponentFixture<DocumentationComponent>;

  const mockQuery = {
    'from': 0,
    'size': 25,
    '_source': '*',
    'query': {
      'bool': {
        'must': [
          {
            'range': {
              'expirationDate': {
                'gte': 'now/d'
              }
            }
          },
          {
            'query_string': {
              'default_field': 'customerAgreementId',
              'query': 144
            }
          }
        ]
      }
    },
    'sort': [
      {
        'chargeTypeName.raw': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      {
        'accessorialDocumentTypelevel.keyword': {
          'order': 'asc',
          'missing': '_last'
        }
      },
      {
        'customerAccessorialCarriers.carrierName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialCarriers'
          },
          'mode': 'min'
        }
      },
      {
        'customerAccessorialCarriers.carrierCode.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialCarriers'
          },
          'mode': 'min'
        }
      },
      {
        'accessorialDocumentType.keyword': {
          'order': 'asc',
          'missing': '_last'
        }
      },
      {
        'customerAccessorialText.textName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialText'
          },
          'mode': 'min'
        }
      },
      {
        'customerAccessorialAccounts.customerAgreementContractName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialAccounts'
          },
          'mode': 'min'
        }
      },
      {
        'customerAccessorialAccounts.customerAgreementContractSectionAccountName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialAccounts'
          },
          'mode': 'min'
        }
      },
      {
        'customerAccessorialServiceLevelBusinessUnitServiceOfferings.serviceLevel.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings'
          },
          'mode': 'min'
        }
      },
      {
        'equipmentCategoryCode.raw': {
          'order': 'asc',
          'missing': '_last'
        }
      },
      {
        'equipmentTypeCode.raw': {
          'order': 'asc',
          'missing': '_last'
        }
      },
      {
        'equipmentLengthId': {
          'order': 'asc',
          'missing': '_last'
        }
      },
      {
        'effectiveDate': {
          'order': 'asc',
          'missing': '_last'
        }
      },
      {
        'expirationDate': {
          'order': 'asc',
          'missing': '_last'
        }
      },
      {
        'customerAccessorialText.text.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialText'
          },
          'mode': 'min'
        }
      },
      {
        'customerAccessorialAttachments.accessorialAttachmentType.accessorialAttachmentTypeName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialAttachments.accessorialAttachmentType'
          },
          'mode': 'min'
        }
      },
      {
        'customerAccessorialAttachments.documentNumber.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested_path': 'customerAccessorialAttachments',
          'mode': 'min'
        }
      },
      {
        'customerAccessorialAttachments.accessorialAttachmentType.accessorialAttachmentTypeId': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialAttachments.accessorialAttachmentType'
          },
          'mode': 'min'
        }
      },
      {
        'customerAccessorialAttachments.fileType.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialAttachments'
          },
          'mode': 'min'
        }
      },
      {
        'customerAccessorialAttachments.addedOn.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialAttachments'
          },
          'mode': 'min'
        }
      },
      {
        'customerAccessorialAttachments.addedBy.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialAttachments'
          },
          'mode': 'min'
        }
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
    fixture = TestBed.createComponent(DocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getContractsListData()', () => {
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
    spyOn(DocumentListService.prototype, 'getDocumentList').and.returnValue(of(mockResponse));
  });
  it('should call getContractsListData', () => {
    const errorValue = {
      error: {
        message: 'failed'
      }
    };
    spyOn(DocumentListService.prototype, 'getDocumentList').and.returnValues(throwError(errorValue));
    component.getContractsListData();
  });
  it('should call formatListData()', () => {
    const mockResponse = {
      'chargeTypeId': 59,
      'equipmentLengthId': null,
      'chargeTypeName': 'Blocking & Bracing Charge (BLOCKBRACE)',
      'equipmentLength': null,
      'level': null,
      'accessorialDocumentTypeId': 1,
      'equipmentCategoryCode': null,
      'documentationCategory': 'Text Only',
      'customerAccessorialCarriers': [
      ],
      'customerChargeName': 'Blocking & Bracing Charge (BLOCKBRACE)',
      'customerAccessorialAttachments': [
        {
          'accessorialAttachmentType': {
            'accessorialAttachmentTypeId': 1,
            'accessorialAttachmentTypeName': 'Signed Accessorials'
          },
          'documentNumber': '{14F2A6B1-BCAF-4547-A7A9-9F93C908C382}',
          'addedBy': 'jisapr7',
          'customerAccessorialAttachmentId': null,
          'documentName': 'tiff doc - Copy.tiff',
          'addedOn': '06/25/2019 11:35 AM',
          'fileType': 'tiff'
        }
      ],
      'accessorialDocumentTypelevel': 'Agreement_BU',
      'customerAccessorialRequestServices': [{
        'customerAccessorialRequestServiceId': null,
        'requestedServiceTypeCode': 'Blind Shipment',
        'requestedServiceTypeId': null
      }
      ],
      'equipmentTypeId': null,
      'customerAccessorialDocumentConfigurationId': 2012,
      'customerAccessorialAccounts': [{
        'customerAgreementContractNumber': null,
        'customerAgreementContractName': '1973 (SSBR22)',
        'customerAccessorialAccountId': null,
        'customerAgreementContractSectionId': null,
        'customerAgreementContractSectionAccountId': null,
        'customerAgreementContractSectionName': null,
        'customerAgreementContractId': null,
        'customerAgreementContractSectionAccountName': null
      }
      ],
      'customerAccessorialText': {
        'textName': 'tuesday',
        'text': 'tuesday text',
        'customerAccessorialDocumentTextId': null
      },
      'customerAgreementId': 144,
      'customerAccessorialServiceLevelBusinessUnitServiceOfferings': [
        {
          'serviceOffering': 'Backhaul',
          'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': null,
          'businessUnit': 'DCS',
          'serviceLevelBusinessUnitServiceOfferingAssociationId': 11,
          'serviceLevel': 'Standard'
        }
      ],
      'accessorialDocumentType': 'Legal',
      'equipmentLengthDisplayName': null,
      'effectiveDate': '2019-06-25',
      'equipmentTypeCode': null,
      'expirationDate': '2099-12-31'
    };
    component.formatListData(mockResponse);
  });
  it('should call onCreateDocumentation()', () => {
    component.onCreateDocumentation();
  });
  it('should call ngOnDestroy()', () => {
    component.ngOnDestroy();
  });
  it('should call loadGridData()', () => {
    const event = {
      filters: {},
      first: 0,
      globalFilter: null,
      multiSortMeta: undefined,
      rows: 25,
      sortField: 'Contract',
      sortOrder: 1
    };
    component.documentationModel.documentList = [{
      accessorialDocumentType: 'Legal',
      accessorialDocumentTypeId: 1,
      businessUnitServiceOfferingDTOs: [],
      carrierDTOs: null,
      chargeTypeId: null,
      chargeTypeName: null,
      customerAccessorialAccountDTOs: null,
      customerAccessorialAttachmentDTOs: null,
      customerAccessorialDocumentConfigurationId: 966,
      customerAccessorialTextDTO: { textName: '1', text: '1', customerAccessorialDocumentTextId: null },
      customerAgreementId: 1846,
      customerChargeName: null,
      documentationCategory: 'Both',
      effectiveDate: '03/28/2019',
      equipmentCategoryCode: null,
      equipmentLengthId: null,
      equipmentTypeCode: null,
      equipmentTypeId: null,
      expirationDate: '12/31/2099',
      level: null,
      requestServiceDTOs: null,
    }];
    component.loadGridData(event);
  });

  it('should call onRowSelect', () => {
    const event = new Event('click');
    event['data'] = {
      customerAccessorialDocumentConfigurationViewId: '1234'
    };
    component.onRowSelect(event);
  });

  it('should call getMockJson', () => {
    DocumentationService.setElasticparam(mockQuery);
    component.getMockJson();
  });

  it('should call getMergedList', () => {
    const data = ['test'];
    component.getMergedList(data, 'test');
  });

  it('should call reqServiceFramer', () => {
    const data = [
      {
        'customerAccessorialRequestServiceId': null,
        'requestedServiceTypeId': null,
        'requestedServiceTypeCode': null
      }
    ];
    component.reqServiceFramer(data);
  });

  it('should call businessFramer', () => {
    const data = [
      {
        'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': null,
        'serviceLevelBusinessUnitServiceOfferingAssociationId': null,
        'businessUnit': null,
        'serviceOffering': null,
        'serviceLevel': null
      }
    ];
    component.businessFramer(data);
  });

  it('should call serviceLevelFramer', () => {
    const data = [
      {
        'customerAccessorialServiceLevelBusinessUnitServiceOfferingId': null,
        'serviceLevelBusinessUnitServiceOfferingAssociationId': null,
        'businessUnit': null,
        'serviceOffering': null,
        'serviceLevel': null
      }
    ];
    component.serviceLevelFramer(data);
  });

  it('should call carrierFramer', () => {
    const data = [
      {
        'customerAccessorialCarrierId': null,
        'carrierId': null,
        'carrierName': null,
        'carrierCode': null
      }
    ];
    component.carrierFramer(data);
  });

  it('should call toastMessage', () => {
    component.toastMessage('test', 'test');
  });
  it('should call sortGridData', () => {
    const mockSortEvent = {
      filters: {},
      first: 0,
      globalFilter: null,
      multiSortMeta: undefined,
      rows: 25,
      sortField: 'Carrier (Code)',
      sortOrder: 1
    };
    component.sortGridData(mockQuery, mockSortEvent);
  });
  it('should call on ViewMileageQuery.viewMileageGridQuery', () => {
    const queryMock = {
      sourceData: 'test'
    };
    DocumentsFilterQuery.getDocumentList(queryMock, 5);
  });
});
