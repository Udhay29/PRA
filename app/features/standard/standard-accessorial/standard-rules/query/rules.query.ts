/* tslint:disable:max-line-length */
export class RulesQuery {
  static quantityTypeNestedPath = `accessorialFreeRuleTypes.accessorialFreeRuleQuantityType`;
  static freeRuleEventNestedPath = 'accessorialFreeRuleTypes.customerAccessorialFreeRuleEvent';
  static freeRuleCalendarNestedPath = 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar';
  static getRulesQuery(searchText: string, id: number) {
    if (searchText && searchText.trim().length) {
      searchText = `*${searchText.replace(/[^a-zA-Z0-9 ]/gi, '\\$&')}*`;
    } else {
      searchText = searchText && searchText.trim().length ? searchText : '*';
    }

    return {
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
                'query': `${id}`,
                'default_operator': 'AND'
              }
            },
            {
              'query_string': {
                'default_field': 'ruleType.keyword',
                'query': 'Notification OR Free',
                'default_operator': 'AND'
              }
            },
            {
              'bool': {
                'should': this.should(searchText)
              }
            }
          ]
        }
      },
      'sort': this.defaultSort()
    };
  }

  static should(searchText: string) {
    return [
      {
        'query_string': {
          'fields': ['chargeTypeName', 'equipmentCategoryCode',
            'equipmentLengthDescription', 'documentInstructionalDescription', 'documentLegalDescription',
            'hasAttachment', 'accessorialNotificationTypeName', 'notifyBy',
            'notificationPreference', 'ruleType', 'ruleStatus', 'createdBy',
            'updatedBy', 'documentFileNames'],
          'query': `${searchText}`,
          'default_operator': 'AND'
        }
      },
      {
        'query_string': {
          'default_field': 'creationDate.text',
          'query': `${searchText}`,
          'default_operator': 'AND'
        }
      },
      {
        'query_string': {
          'default_field': 'lastUpdatedDate.text',
          'query': `${searchText}`,
          'default_operator': 'AND'
        }
      },
      {
        'query_string': {
          'default_field': 'effectiveDate.text',
          'query': `${searchText}`,
          'default_operator': 'AND'
        }
      },
      {
        'query_string': {
          'default_field': 'expirationDate.text',
          'query': `${searchText}`,
          'default_operator': 'AND'
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialAccount',
          'query': {
            'query_string': {
              'fields': ['customerAccessorialAccount.customerAgreementContractName',
                'customerAccessorialAccount.customerAgreementContractSectionName',
                'customerAccessorialAccount.customerAgreementContractSectionAccountName'],
              'query': `${searchText}`,
              'default_operator': 'AND'
            }
          }
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings',
          'query': {
            'query_string': {
              'fields': ['customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnit',
                'customerAccessorialServiceLevelBusinessUnitServiceOfferings.serviceOffering',
                'customerAccessorialServiceLevelBusinessUnitServiceOfferings.serviceLevel'],
              'query': `${searchText}`,
              'default_operator': 'AND'
            }
          }
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialCarriers',
          'query': {
            'query_string': {
              'fields': ['customerAccessorialCarriers.carrierCode', 'customerAccessorialCarriers.carrierName'],
              'query': `${searchText}`,
              'default_operator': 'AND'
            }
          }
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialNotificationMethods',
          'query': {
            'query_string': {
              'fields': ['customerAccessorialNotificationMethods.accessorialEmailTemplateTypeName',
                'customerAccessorialNotificationMethods.websiteAddress', 'customerAccessorialNotificationMethods.accessorialNotificationMethodTypeName'],
              'query': `${searchText}`,
              'default_operator': 'AND'
            }
          }
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialNotificationFrequency',
          'query': {
            'query_string': {
              'fields': ['customerAccessorialNotificationFrequency.accessorialNotificationEventTypeName',
                'customerAccessorialNotificationFrequency.timeframeQuantity',
                'customerAccessorialNotificationFrequency.pricingUnitOfTimeMeasurementAssociationName',
                'customerAccessorialNotificationFrequency.accessorialNotificationOccurrenceTypeName'],
              'query': `${searchText}`,
              'default_operator': 'AND'
            }
          }
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialNotificationFrequency',
          'query': {
            'query_string': {
              'default_field': 'customerAccessorialNotificationFrequency.customerAccessorialNotificationBatches.batchTime.text',
              'query': `${searchText}`,
              'default_operator': 'AND'
            }
          }
        }
      },
      {
        'nested': {
          'path': 'customerAccessorialRequestServices',
          'query': {
            'query_string': {
              'default_field': 'customerAccessorialRequestServices.requestedServiceTypeCode',
              'query': `${searchText}`,
              'default_operator': 'AND'
            }
          }
        }
      }

    ];
  }
  static defaultSort() {
    return [
      {
        'ruleType.raw': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      {
        'chargeTypeName.keyword': {
          'order': 'asc'
        }
      }
    ];
  }

  static sort() {
    return [
      {
        'ruleType.raw': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      {
        'chargeTypeName.keyword': {
          'order': 'asc'
        }
      },
      {
        'customerAccessorialAccount.customerAgreementContractName.keyword': {
          'order': 'asc',
          'mode': 'min',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialAccount'
          }
        }
      },
      {
        'customerAccessorialAccount.customerAgreementContractSectionName.keyword': {
          'order': 'asc',
          'mode': 'min',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialAccount'
          }
        }
      },
      {
        'customerAccessorialAccount.customerAgreementContractSectionAccountName.keyword': {
          'order': 'asc',
          'mode': 'min',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialAccount'
          }
        }
      },
      {
        'customerAccessorialServiceLevelBusinessUnitServiceOfferings.businessUnit.keyword': {
          'order': 'asc',
          'mode': 'min',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings'
          }
        }
      },
      {
        'customerAccessorialServiceLevelBusinessUnitServiceOfferings.serviceOffering.keyword': {
          'order': 'asc',
          'mode': 'min',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings'
          }
        }
      },
      {
        'customerAccessorialServiceLevelBusinessUnitServiceOfferings.serviceLevel.keyword': {
          'order': 'asc',
          'mode': 'min',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialServiceLevelBusinessUnitServiceOfferings'
          }
        }
      },
      {
        'customerAccessorialRequestServices.requestedServiceTypeCode.keyword': {
          'order': 'asc',
          'mode': 'min',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialRequestServices'
          }
        }
      },
      {
        'equipmentCategoryCode.raw': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      {
        'equipmentTypeCode.keyword': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      {
        'equipmentLengthId': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      {
        'equipmentLength': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      {
        'equipmentLengthDescription.keyword': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      {
        'customerAccessorialCarriers.carrierName.keyword': {
          'order': 'asc',
          'mode': 'min',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialCarriers'
          }
        }
      },
      {
        'customerAccessorialAccount.customerAgreementContractSectionAccountName.keyword': {
          'order': 'asc',
          'mode': 'min',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialAccount'
          }
        }
      },
      {
        'documentLegalDescription.keyword': {
          'order': 'asc',
          'missing': '_first',
        }
      },
      {
        'documentInstructionalDescription.raw': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      {
        'documentFileNames.raw': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      {
        'hasAttachment.raw': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      {
        'accessorialNotificationTypeName.keyword': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      {
        'notifyBy.raw': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      {
        'customerAccessorialNotificationMethods.accessorialEmailTemplateTypeName.keyword': {
          'order': 'asc',
          'mode': 'min',
          'nested': {
            'path': 'customerAccessorialNotificationMethods'
          }
        }
      },
      {
        'customerAccessorialNotificationMethods.websiteAddress.keyword': {
          'order': 'asc',
          'mode': 'min',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialNotificationMethods'
          }
        }
      },
      {
        'customerAccessorialNotificationFrequency.accessorialNotificationOccurrenceTypeName.keyword': {
          'order': 'asc',
          'mode': 'min',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialNotificationFrequency'
          }
        }
      },
      ...this.sort2()
    ];
  }

  static sort2() {
    return [
      {
        'customerAccessorialNotificationFrequency.accessorialNotificationEventTypeName.keyword': {
          'order': 'asc',
          'mode': 'min',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialNotificationFrequency'
          }
        }
      },
      {
        'customerAccessorialNotificationFrequency.timeframeQuantity.integer': {
          'order': 'asc',
          'mode': 'min',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialNotificationFrequency'
          }
        }
      },
      {
        'customerAccessorialNotificationFrequency.pricingUnitOfTimeMeasurementAssociationName.keyword': {
          'order': 'asc',
          'mode': 'min',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialNotificationFrequency'
          }
        }
      },
      {
        'customerAccessorialNotificationFrequency.customerAccessorialNotificationBatches.batchTime': {
          'order': 'asc',
          'mode': 'min',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialNotificationFrequency'
          }
        }
      },
      {
        'customerAccessorialNotificationMethods.accessorialNotificationMethodTypeName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'customerAccessorialNotificationMethods'
          }
        }
      },
      {
        'accessorialNotificationRequiredTypeName.keyword': {
          'order': 'desc'
        }
      },
      {
        'effectiveDate': {
          'order': 'asc'
        }
      },
      {
        'expirationDate': {
          'order': 'asc'
        }
      },
      {
        'ruleStatus.raw': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      {
        'creationDate': {
          'order': 'asc'
        }
      },
      {
        'createdBy.keyword': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      {
        'lastUpdatedDate': {
          'order': 'asc'
        }
      },
      {
        'updatedBy.keyword': {
          'order': 'asc',
          'missing': '_first'
        }
      },
      ...this.sort3()
    ];
  }

  static sort3() {
    return [
      {
        'accessorialFreeRuleTypes.accessorialFreeRuleQuantityType.requestedDeliveryDateIndicator.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested_path': 'accessorialFreeRuleTypes.accessorialFreeRuleQuantityType'
        }
      },
      {
        'accessorialFreeRuleTypes.accessorialFreeRuleQuantityType.accessorialFreeQuantity': {
          'order': 'asc',
          'missing': '_first',
          'nested_path': this.quantityTypeNestedPath
        }
      },
      {
        'accessorialFreeRuleTypes.accessorialFreeRuleQuantityType.freeRuleQuantityTimeTypeCode.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested_path': this.quantityTypeNestedPath
        }
      },
      {
        'accessorialFreeRuleTypes.accessorialFreeRuleQuantityType.accessorialFreeRuleQuantityTypeName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested_path': this.quantityTypeNestedPath
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleEvent.accessorialFreeRuleEventTypeName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested_path': this.freeRuleEventNestedPath
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleEvent.accessorialFreeRuleEventTimeFrameTypeName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested_path': this.freeRuleEventNestedPath
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleEvent.accessorialDayOfEventFreeRuleModifierTime': {
          'order': 'asc',
          'missing': '_first',
          'nested_path': this.freeRuleEventNestedPath
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleEvent.accessorialDayOfEventFreeRuleModifierName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested_path': this.freeRuleEventNestedPath
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleEvent.accessorialDayAfterEventFreeRuleModifierName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested_path': this.freeRuleEventNestedPath
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleEvent.accessorialDayAfterEventFreeRuleModifierTime': {
          'order': 'asc',
          'missing': '_first',
          'nested_path': this.freeRuleEventNestedPath
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarMonth.calendarMonth.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarMonth',
            'filter': {
              'match': {
                'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarMonth.calendarMonth': ''
              }
            }
          }
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.calendarYear': {
          'order': 'asc',
          'missing': '_first',
          'nested_path': this.freeRuleCalendarNestedPath
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.calendarDayDescription.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested_path': this.freeRuleCalendarNestedPath
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.accessorialFreeRuleCalendarApplyTypeName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': this.freeRuleCalendarNestedPath,
            'filter': {
              'match': {
                [this.freeRuleCalendarNestedPath]: ''
              }
            }
          }
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.accessorialFreeRuleEventTypeName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': this.freeRuleCalendarNestedPath,
            'filter': {
              'match': {
                [this.freeRuleCalendarNestedPath]: ''
              }
            }
          }
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.firstDayChargeableIndicator.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': this.freeRuleCalendarNestedPath,
            'filter': {
              'match': {
                [this.freeRuleCalendarNestedPath]: ''
              }
            }
          }
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.pricingAveragePeriodTypeName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested_path': this.freeRuleCalendarNestedPath
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarWeekDay.calendarWeekDay.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarWeekDay',
            'filter': {
              'match': {
                [this.freeRuleCalendarNestedPath]: ''
              }
            }
          }
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarDayOccurrences.accessorialFrequencyTypeName.keyword': {
          'order': 'asc',
          'missing': '_first',
          'nested': {
            'path': 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarDayOccurrences',
            'filter': {
              'match': {
                [this.freeRuleCalendarNestedPath]: ''
              }
            }
          }
        }
      },
      {
        'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarMonth.customerAccessorialFreeRuleCalendarDay': {
          'order': 'desc',
          'missing': '_first',
          'nested': {
            'path': 'accessorialFreeRuleTypes.customerAccessorialFreeRuleCalendar.customerAccessorialFreeRuleCalendarMonth',
          }
        }
      }
    ];
  }
}
