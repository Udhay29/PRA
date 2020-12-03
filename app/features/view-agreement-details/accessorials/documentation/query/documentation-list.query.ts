
export class DocumentsFilterQuery {
  static readonly chargeType = 'customerAccessorialDocumentChargeTypes.chargeTypeName.keyword';
  static readonly contractName = 'customerAccessorialAccounts.customerAgreementContractName.keyword';
  static readonly businessUnitDisplayName = 'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnitDisplayName.keyword';
  static readonly requestedService = 'customerAccessorialRequestServices.requestedServiceTypeCode.keyword';
  static readonly carrierDisplayName = 'customerAccessorialCarriers.carrierDisplayName.keyword';
  static readonly attachmentTypeName = 'customerAccessorialAttachments.accessorialAttachmentType.accessorialAttachmentTypeName.keyword';
  static readonly documentName = 'customerAccessorialAttachments.documentName.keyword';

  static getDocumentList(sourceData: any, agreementID) {
    return {
      'from': 0,
      'size': 25,
      '_source': '*',
      'query': {
        'bool': {
          'must': this.mustCondition(agreementID)
        }
      },
      'sort': this.getSortArray()
    };
  }
  static getBaseQuery() {
    return {
      'should': [
        {
          'query_string': {
            'fields': [
              'accessorialDocumentType.keyword',
              'equipmentClassificationCode.keyword',
              'equipmentClassificationTypeAssociationCode.keyword',
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
                'default_field': DocumentsFilterQuery.chargeType,
                'query': '*',
                'default_operator': 'AND'
              }
            },
            'inner_hits': {
              'sort': {
                [DocumentsFilterQuery.chargeType]: {
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
                  DocumentsFilterQuery.contractName,
                  'customerAccessorialAccounts.customerAgreementContractSectionAccountName.keyword',
                  'customerAccessorialAccounts.customerAgreementContractSectionName.keyword'
                ],
                'query': '*',
                'default_operator': 'AND'
              }
            },
            'inner_hits': {
              'sort': {
                [DocumentsFilterQuery.contractName]: {
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
                  DocumentsFilterQuery.businessUnitDisplayName,
                  'customerAccessorialServiceLevelBusinessUnitServiceOfferings.serviceLevel.keyword'
                ],
                'query': '*',
                'default_operator': 'AND'
              }
            },
            'inner_hits': {
              'sort': {
                [DocumentsFilterQuery.businessUnitDisplayName]: {
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
                'default_field': DocumentsFilterQuery.requestedService,
                'query': '*',
                'default_operator': 'AND'
              }
            },
            'inner_hits': {
              'sort': {
                [DocumentsFilterQuery.requestedService]: {
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
                'default_field': DocumentsFilterQuery.carrierDisplayName,
                'query': '*',
                'default_operator': 'AND'
              }
            },
            'inner_hits': {
              'sort': {
                [DocumentsFilterQuery.carrierDisplayName]: {
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
                'default_field': DocumentsFilterQuery.attachmentTypeName,
                'query': '*',
                'default_operator': 'AND'
              }
            },
            'inner_hits': {
              'sort': {
                [DocumentsFilterQuery.attachmentTypeName]: {
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
                  DocumentsFilterQuery.documentName,
                  'customerAccessorialAttachments.documentNumber.keyword',
                  'customerAccessorialAttachments.fileType.keyword'
                ],
                'query': '*',
                'default_operator': 'AND'
              }
            },
            'inner_hits': {
              'sort': {
                [DocumentsFilterQuery.documentName]: {
                  'order': 'asc'
                }
              }
            }
          }
        }
      ]
    };
  }

  static getSortArray() {
    return [
      {
        [DocumentsFilterQuery.chargeType]: {
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
        [DocumentsFilterQuery.carrierDisplayName]: {
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
        [DocumentsFilterQuery.requestedService]: {
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
        [DocumentsFilterQuery.contractName]: {
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
        [DocumentsFilterQuery.businessUnitDisplayName]: {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings'
          }
        }
      },
      {
        'equipmentClassificationCode.keyword': {
          'order': 'asc',
          'missing': '_last'
        }
      },
      {
        'equipmentClassificationTypeAssociationCode.keyword': {
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
        [DocumentsFilterQuery.attachmentTypeName]: {
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
        [DocumentsFilterQuery.documentName]: {
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
    ];
  }
  static emptyBoolCondition() {
    return {
      'bool': {
        'must': []
      }
    };
  }
  static mustCondition(agreementID): object[] {
    const mustArray = [];
    const mustLoopArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    mustLoopArray.forEach(element => {
      mustArray.push({});
    });
    mustArray[0] = this.defaultQuery(agreementID);
    mustArray[1] = this.defaultStatusQuery();
    mustArray[2] = this.sortQuery();
    const mustInnerLoopArray = [3, 4, 5, 6, 7, 8, 9, 10];
    mustInnerLoopArray.forEach(element => {
      mustArray[element] = this.emptyBoolCondition();
    });
    return mustArray;
  }
  static defaultQuery(agreementID): object {
    return {
      'query_string': {
        'default_field': 'customerAgreementId',
        'query': agreementID
      },
    };
  }
  static defaultStatusQuery(): object {
    return {
      'bool': {
        'should': [
          {
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
                    'default_field': 'invalidIndicator',
                    'query': 'N'
                  }
                },
                {
                  'query_string': {
                    'default_field': 'invalidReasonType',
                    'query': 'Active'
                  }
                }
              ]
            }
          }
        ]
      }
    };
  }
  static sortQuery(): object {
    return {
      'bool': this.getBaseQuery()
    };
  }
}


