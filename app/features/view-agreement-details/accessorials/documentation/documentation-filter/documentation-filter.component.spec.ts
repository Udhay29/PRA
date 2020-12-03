import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { configureTestSuite } from 'ng-bullet';
import { MessageService } from 'primeng/components/common/messageservice';

import { AppModule } from '../../../../../app.module';
import { ViewAgreementDetailsModule } from '../../../view-agreement-details.module';

import { DocumentationFilterComponent } from './documentation-filter.component';
import { DocumentationService } from '../service/documentation.service';
import { DocumentationFilterService } from './service/documentation-filter.service';
import { DocumenationFilterUtilityService } from './service/documenation-filter-utility.service';
import { DocumentationFilerModel } from './model/documentation-filter.model';


describe('DocumentationFilterComponent', () => {
  let component: DocumentationFilterComponent;
  let fixture: ComponentFixture<DocumentationFilterComponent>;
  let documentationService: DocumentationService;
  let messageService: MessageService;
  let debugElement: DebugElement;
  let mockESQuery;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, ViewAgreementDetailsModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, DocumentationService, DocumentationFilterService,
      DocumenationFilterUtilityService, MessageService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentationFilterComponent);
    debugElement = fixture.debugElement;
    documentationService = debugElement.injector.get(DocumentationService);
    messageService = TestBed.get(MessageService);
    component = fixture.componentInstance;
    component.documentationFilerModel = new DocumentationFilerModel();
    mockESQuery = {
      'from': 0,
      'size': 25,
      '_source': '*',
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'customerAgreementId',
                'query': 75
              }
            },
            {
              'bool': {
                'should': [
                  {
                    'bool': {
                      'must': [
                        {
                          'query_string': {
                            'default_field': 'invalidIndicator',
                            'query': '*'
                          }
                        },
                        {
                          'query_string': {
                            'default_field': 'invalidReasonType',
                            'query': 'Active OR Inactive'
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              'bool': {
                'should': [
                  {
                    'query_string': {
                      'fields': [
                        'accessorialDocumentType.keyword',
                        'equipmentCategoryCode.keyword',
                        'equipmentTypeCode.keyword',
                        'equipmentLengthDisplayName.keyword',
                        'effectiveDate.keyword',
                        'expirationDate.keyword'
                      ],
                      'query': '*',
                      'default_operator': 'AND'
                    }
                  },
                  {
                    'nested': {
                      'path': 'customerAccessorialDocumentChargeTypes',
                      'query': {
                        'query_string': {
                          'default_field': 'customerAccessorialDocumentChargeTypes.chargeTypeName.keyword',
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      },
                      'inner_hits': {
                        'sort': {
                          'customerAccessorialDocumentChargeTypes.chargeTypeName.keyword': {
                            'order': 'asc'
                          }
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'customerAccessorialAccounts',
                      'query': {
                        'query_string': {
                          'fields': [
                            'customerAccessorialAccounts.customerAgreementContractName.keyword',
                            'customerAccessorialAccounts.customerAgreementContractSectionAccountName.keyword',
                            'customerAccessorialAccounts.customerAgreementContractSectionName.keyword'
                          ],
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      },
                      'inner_hits': {
                        'sort': {
                          'customerAccessorialAccounts.customerAgreementContractName.keyword': {
                            'order': 'asc'
                          }
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings',
                      'query': {
                        'query_string': {
                          'fields': [
                            'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnitDisplayName.keyword',
                            'customerAccessorialServiceLevelBusinessUnitServiceOfferings.serviceLevel.keyword'
                          ],
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      },
                      'inner_hits': {
                        'sort': {
                          'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnitDisplayName.keyword': {
                            'order': 'asc'
                          }
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'customerAccessorialRequestServices',
                      'query': {
                        'query_string': {
                          'default_field': 'customerAccessorialRequestServices.requestedServiceTypeCode.keyword',
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      },
                      'inner_hits': {
                        'sort': {
                          'customerAccessorialRequestServices.requestedServiceTypeCode.keyword': {
                            'order': 'asc'
                          }
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'customerAccessorialCarriers',
                      'query': {
                        'query_string': {
                          'default_field': 'customerAccessorialCarriers.carrierDisplayName.keyword',
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      },
                      'inner_hits': {
                        'sort': {
                          'customerAccessorialCarriers.carrierDisplayName.keyword': {
                            'order': 'asc'
                          }
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'customerAccessorialText',
                      'query': {
                        'query_string': {
                          'fields': [
                            'customerAccessorialText.textName.keyword',
                            'customerAccessorialText.text.keyword'
                          ],
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'customerAccessorialAttachments',
                      'query': {
                        'query_string': {
                          'default_field': 'customerAccessorialAttachments.accessorialAttachmentType.accessorialAttachmentTypeName.keyword',
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      },
                      'inner_hits': {
                        'sort': {
                          'customerAccessorialAttachments.accessorialAttachmentType.accessorialAttachmentTypeName.keyword': {
                            'order': 'asc'
                          }
                        }
                      }
                    }
                  },
                  {
                    'nested': {
                      'path': 'customerAccessorialAttachments',
                      'query': {
                        'query_string': {
                          'fields': [
                            'customerAccessorialAttachments.addedBy.keyword',
                            'customerAccessorialAttachments.addedOn.keyword',
                            'customerAccessorialAttachments.documentName.keyword',
                            'customerAccessorialAttachments.documentNumber.keyword',
                            'customerAccessorialAttachments.fileType.keyword'
                          ],
                          'query': '*',
                          'default_operator': 'AND'
                        }
                      },
                      'inner_hits': {
                        'sort': {
                          'customerAccessorialAttachments.documentName.keyword': {
                            'order': 'asc'
                          }
                        }
                      }
                    }
                  }
                ]
              }
            },
            {
              'bool': {
                'must': [
                  {
                    'query_string': {
                      'default_field': 'accessorialDocumentType.keyword',
                      'query': '(Legal)',
                      'default_operator': 'AND'
                    }
                  }
                ]
              }
            },
            {
              'bool': {
                'must': [
                ]
              }
            },
            {
              'bool': {
                'must': [
                  {
                    'nested': {
                      'path': 'customerAccessorialAccounts',
                      'query': {
                        'query_string': {
                          'default_field': 'customerAccessorialAccounts.customerAgreementContractName.keyword',
                          'query': '(1979\\ \\(test\\ data122334\\))',
                          'default_operator': 'AND'
                        }
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      'sort': [
        {
          'customerAccessorialDocumentChargeTypes.chargeTypeName.keyword': {
            'order': 'asc',
            'missing': '_first',
            'nested': {
              'path': 'customerAccessorialDocumentChargeTypes'
            }
          }
        },
        {
          'accessorialDocumentTypelevel.keyword': {
            'order': 'asc',
            'missing': '_last'
          }
        },
        {
          'customerAccessorialCarriers.carrierDisplayName.keyword': {
            'order': 'asc',
            'missing': '_first',
            'nested': {
              'path': 'customerAccessorialCarriers'
            }
          }
        },
        {
          'accessorialDocumentType.keyword': {
            'order': 'asc',
            'missing': '_last'
          }
        },
        {
          'customerAccessorialRequestServices.requestedServiceTypeCode.keyword': {
            'order': 'asc',
            'missing': '_first',
            'nested': {
              'path': 'customerAccessorialRequestServices'
            }
          }
        },
        {
          'customerAccessorialText.textName.keyword': {
            'order': 'asc',
            'missing': '_first',
            'nested': {
              'path': 'customerAccessorialText'
            }
          }
        },
        {
          'customerAccessorialAccounts.customerAgreementContractName.keyword': {
            'order': 'asc',
            'missing': '_first',
            'nested': {
              'path': 'customerAccessorialAccounts'
            }
          }
        },
        {
          'customerAccessorialAccounts.customerAgreementContractSectionAccountName.keyword': {
            'order': 'asc',
            'missing': '_first',
            'nested': {
              'path': 'customerAccessorialAccounts'
            }
          }
        },
        {
          'customerAccessorialServiceLevelBusinessUnitServiceOfferings.serviceLevel.keyword': {
            'order': 'asc',
            'missing': '_first',
            'nested': {
              'path': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings'
            }
          }
        },
        {
          'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnitDisplayName.keyword': {
            'order': 'asc',
            'missing': '_first',
            'nested': {
              'path': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings'
            }
          }
        },
        {
          'equipmentCategoryCode.keyword': {
            'order': 'asc',
            'missing': '_last'
          }
        },
        {
          'equipmentTypeCode.keyword': {
            'order': 'asc',
            'missing': '_last'
          }
        },
        {
          'equipmentLength': {
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
            }
          }
        },
        {
          'customerAccessorialAttachments.accessorialAttachmentType.accessorialAttachmentTypeName.keyword': {
            'order': 'asc',
            'missing': '_first',
            'nested': {
              'path': 'customerAccessorialAttachments.accessorialAttachmentType'
            }
          }
        },
        {
          'customerAccessorialAttachments.documentNumber.keyword': {
            'order': 'asc',
            'missing': '_first',
            'nested': {
              'path': 'customerAccessorialAttachments'
            }
          }
        },
        {
          'customerAccessorialAttachments.documentName.keyword': {
            'order': 'asc',
            'missing': '_first',
            'nested': {
              'path': 'customerAccessorialAttachments'
            }
          }
        },
        {
          'customerAccessorialAttachments.fileType.keyword': {
            'order': 'asc',
            'missing': '_first',
            'nested': {
              'path': 'customerAccessorialAttachments'
            }
          }
        },
        {
          'customerAccessorialAttachments.addedOn': {
            'order': 'asc',
            'missing': '_first',
            'nested': {
              'path': 'customerAccessorialAttachments'
            }
          }
        },
        {
          'customerAccessorialAttachments.addedBy.keyword': {
            'order': 'asc',
            'missing': '_first',
            'nested': {
              'path': 'customerAccessorialAttachments'
            }
          }
        }
      ]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
  });

  it('should call queryFormation', () => {
    component.queryFormation('yes', true, mockESQuery, 5);
  });

  it('should call queryFormationelse', () => {
    component.queryFormation('yes', false, mockESQuery, 3);
 });

it('should call onListingItemsSelected for chargeType case', () => {
  const listEvent = [{
    label: 'Active Mileage', value: 'Active Mileage'
  }];
  DocumentationService.setElasticparam(mockESQuery);
  component.onListingItemsSelected(listEvent, 'chargeType', 5, true);
});

it('should call onListingItemsSelected for chargeType case else', () => {
  const listEvent = [];
  DocumentationService.setElasticparam(mockESQuery);
  component.onListingItemsSelected(listEvent, 'chargeType', 5, true);
});

it('should call onListingItemsSelected for contract case', () => {
  const listEvent = [{
    label: 'Active Mileage', value: 'Active Mileage'
  }];
  DocumentationService.setElasticparam(mockESQuery);
  component.onListingItemsSelected(listEvent, 'contract', 5, true);
});

it('should call onListingItemsSelected for contract case else', () => {
  const listEvent = [];
  DocumentationService.setElasticparam(mockESQuery);
  component.onListingItemsSelected(listEvent, 'contract', 5, true);
});

it('should call onListingItemsSelected for section case', () => {
  const listEvent = [{
    label: 'Active Mileage', value: 'Active Mileage'
  }];
  DocumentationService.setElasticparam(mockESQuery);
  component.onListingItemsSelected(listEvent, 'section', 5, true);
});

it('should call onListingItemsSelected for section case else', () => {
  const listEvent = [];
  DocumentationService.setElasticparam(mockESQuery);
  component.onListingItemsSelected(listEvent, 'section', 5, true);
});

it('should call onListingItemsSelected for businessUnitServiceoffering case', () => {
  const listEvent = [{
    label: 'Active Mileage', value: 'Active Mileage'
  }];
  DocumentationService.setElasticparam(mockESQuery);
  component.onListingItemsSelected(listEvent, 'businessUnitServiceoffering', 5, true);
});

it('should call onListingItemsSelected for businessUnitServiceoffering case else', () => {
  const listEvent = [];
  DocumentationService.setElasticparam(mockESQuery);
  component.onListingItemsSelected(listEvent, 'businessUnitServiceoffering', 5, true);
});

it('should call onListingItemsSelected for case status', () => {
  const listEvent = [];
  DocumentationService.setElasticparam(mockESQuery);
  component.onListingItemsSelected(listEvent, 'status', 3, false);
});

it('should call onListingItemsSelected for case status2', () => {
  const listEvent = [{
    label: 'status', value: 'status'}];
  DocumentationService.setElasticparam(mockESQuery);
  component.onListingItemsSelected(listEvent, 'status', 3, false);
});

it('should call onListingItemsSelected for documentationType case', () => {
  const listEvent = [{
    label: 'Active Mileage', value: 'Active Mileage'
  }];
  DocumentationService.setElasticparam(mockESQuery);
  component.onListingItemsSelected(listEvent, 'documentationType', 3, false);
});

it('should call onListingItemsSelected for documentationType case else', () => {
  const listEvent = [];
  DocumentationService.setElasticparam(mockESQuery);
  component.onListingItemsSelected(listEvent, 'documentationType', 3, false);
});

it('should call onListingItemsSelected for billToAccount case', () => {
  const listEvent = [{
    label: 'Active Mileage', value: 'Active Mileage'
  }];
  DocumentationService.setElasticparam(mockESQuery);
  component.onListingItemsSelected(listEvent, 'billToAccount', 5, true);
});

it('should call onListingItemsSelected for billToAccount case else', () => {
  const listEvent = [];
  DocumentationService.setElasticparam(mockESQuery);
  component.onListingItemsSelected(listEvent, 'billToAccount', 5, true);
});

it('should call onListingItemsSelected for case default lengthGreaterThan2', () => {
  const listEvent = [{
    label: 'decimalPrecision', value: 'billToAccount'},
    {
      label: 'billToAccount', value: 'billToAccount'}];
      DocumentationService.setElasticparam(mockESQuery);
  component.onListingItemsSelected(listEvent, 'billToAccount', 3, true);
});

it('should call isDeletedSelected', () => {
  const listEvent = ['Inactive', 'Active'];
  DocumentationService.setElasticparam(mockESQuery);
  component.isDeletedSelected(mockESQuery, 3, listEvent);
});

it('should call isDeletedSelected', () => {
  const listEvent = ['Deleted'];
  DocumentationService.setElasticparam(mockESQuery);
  component.isDeletedSelected(mockESQuery, 3, listEvent);
});

it('should call isDeletedSelected', () => {
  const listEvent = ['Inactive'];
  DocumentationService.setElasticparam(mockESQuery);
  component.isDeletedSelected(mockESQuery, 3, listEvent);
});

it('should call onClearAllFilters', () => {
  DocumentationService.setElasticparam(mockESQuery);
  component.onClearAllFilters();
});

it('should call onResetEvent', () => {
  DocumentationService.setElasticparam(mockESQuery);
  component.onResetEvent(true);
});

it('should call onResetEvent', () => {
  DocumentationService.setElasticparam(mockESQuery);
  component.onResetEvent(false);
});
it('should call defaultStatusFetch', () => {
  component.defaultStatusFetch(mockESQuery);
});
it('should call defaultStatusFetch', () => {
  component.defaultStatusFetch(mockESQuery);
});
it('should call defaultStatusFetch', () => {
  component.defaultStatusFetch(mockESQuery);
});
});

