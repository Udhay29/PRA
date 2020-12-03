export class SectionsFilterQuery {
  static startDate: '01/01/1995';
  static endDate: '12/31/2099';
  static DateFormat = 'MM/dd/yyyy||yyyy';
  static sectionNameKeyword = 'SectionRanges.SectionName.keyword';
  static sectionNameData = 'SectionRanges.SectionName.aux';
  static sectionTypeNameData = 'SectionRanges.SectionTypeName';
  static sectionExpirationDateData = 'SectionRanges.SectionExpirationDate';
  static sectionInvalidReasonTypeKeyword = 'SectionRanges.SectionInvalidReasonType.keyword';
  static sectionSectionInvalidIndicatorKeyword = 'SectionRanges.SectionInvalidIndicator.keyword';
   static getSectionsListQuery(sourceData: any) {
     return {
      'from': 0, 'size': 25,
      '_source': [ '*', this.sectionNameData, this.sectionTypeNameData,
      'SectionRanges.SectionCurrencyCode', 'SectionRanges.SectionEffectiveDate', this.sectionExpirationDateData,
      'SectionRanges.BillToCodes', 'AgreementID', 'ContractRanges.ContractNumber', 'SectionRanges.*',
      'SectionID', 'ContractID', 'ContractRanges.ContractName', 'ContractRanges.ContractTypeName', 'ContractRanges.contractDisplayName'],
      'sort': [{
          'SectionRanges.SectionName.aux': {'order': 'asc', 'nested': { 'path': 'SectionRanges' }, 'mode': 'min' }},
        {'ContractRanges.contractDisplayName.key': {'order': 'asc', 'nested': {'path': 'ContractRanges' }, 'mode': 'min'}}
      ],
      'query': {
        'bool': {
          'must': [
            {
              'query_string': { 'default_field': 'AgreementID.keyword', 'query': sourceData['agreementID'], 'default_operator': 'AND'} },
            {
              'bool': {
                'should': [
                  {
                    'nested': {
                      'path': 'SectionRanges',
                      'query': {
                        'bool': {
                          'must': [
                            {
                              'bool': {
                                'should': [
                                        this.getFilterActiveStatusQuery()
                                      ]}
                            },
                            {
                              'bool': {
                                'should': [
                                  {
                                    'query_string': {
                                      'fields': [
                                        this.sectionNameData,
                                        this.sectionTypeNameData,
                                        'SectionRanges.SectionCurrencyCode',
                                        'SectionRanges.contractDisplayName',
                                        'SectionRanges.BillToCodes.billingPartyDisplayName',
                                        'SectionRanges.CreateProgram',
                                        'SectionRanges.LastUpdateProgram',
                                        'SectionRanges.CreateUser',
                                        'SectionRanges.LastUpdateUser'
                                      ],
                                      'query': '*', 'default_operator': 'AND'
                                    }
                                  }
                                ]
                              }
                            },
                            {
                              'bool' : {
                                'must' : [
                                ]
                              }
                            }
                          ]
                        }
                      },
                      'inner_hits': {'sort': {} }
                    }
                  }
                ]} }
          ]
        }
      },
      'script_fields': {
        'Status': {
          'script': {
            'lang': 'painless',
            'source': `def x = [];def now=new Date();
            def sf = new SimpleDateFormat('yyyy-MM-dd');\n\n
            def equateNow=sf.format(now);for(def i = 0;\n\n
              i < params['_source']['SectionRanges'].length; i++)\n
              {def expire=params['_source']['SectionRanges'][i]['SectionExpirationDate'];\n\n
              if((sf.parse(expire).after(now)\n\n  | expire == equateNow)\n\n
               && params['_source']['SectionRanges'][i]['SectionInvalidIndicator']\n\n
                == 'N' && params['_source']['SectionRanges'][i]['SectionInvalidReasonType']\n\n
                 == 'Active'){x.add('Active')}else if((sf.parse(expire).before(now)\n\n
                  && params['_source']['SectionRanges'][i]['SectionInvalidIndicator'] == 'Y'\n\n
                    && params['_source']['SectionRanges'][i]\n\n
                     ['SectionInvalidReasonType'] == 'InActive')\n\n
                      || (sf.parse(expire).before(now) && params['_source']['SectionRanges'][i]\n\n
                    ['SectionInvalidIndicator'] == 'N'\n\n
                     && params['_source']['SectionRanges'][i]\n\n
                       ['SectionInvalidReasonType'] == 'InActive')\n\n
                        || (sf.parse(expire).before(now) &&\n\n
                        params['_source']['SectionRanges'][i]['SectionInvalidIndicator']\n\n
                          == 'N' && params['_source']['SectionRanges'][i]['SectionInvalidReasonType'] == 'Active'))\n\n
                       {x.add('Inactive')}else if(params['_source']['SectionRanges'][i]\n\n
                       ['SectionInvalidIndicator'] == 'Y' &&\n\n
                        params['_source']['SectionRanges'][i]['SectionInvalidReasonType'] == 'Deleted'){x.add('Deleted')}}return x\n`
         } } } }; }

  static getStatusSortQuery(value: string, order: string): object {
    return {
      '_script': {
        'script': {
          'lang': 'painless',
          'source': value
        },
        'order': order,
        'type': 'string'
      }
    };
  }
  static getFilterActiveStatusQuery(): object {
    return  {
      'bool': {
        'must': [
          {
            'query_string': {
              'default_field':  this.sectionSectionInvalidIndicatorKeyword,
              'query': 'N'
            }
          },
          {
            'query_string': {
              'default_field': this.sectionInvalidReasonTypeKeyword,
              'query': 'Active'
            }
          },
          {
            'range': {
              [this.sectionExpirationDateData]: {
                'gte': 'now/d'
              }
            }
          }
        ]
      }
    };
  }
  static getFilterInActiveStatusQuery(): object {
    return {
      'bool': {
        'must': [
          {
            'range': {
              [this.sectionExpirationDateData]: {
                'lte': 'now-1d'
              }
            }
          },
          {
            'query_string': {
              'default_field': this.sectionInvalidReasonTypeKeyword,
              'query': 'Active OR InActive'
            }
          },
          {
            'query_string': {
              'default_field': this.sectionSectionInvalidIndicatorKeyword,
              'query': 'N OR Y'
            }
          }
        ]
      }
    };
  }
  static getFilterDeletedStatusQuery(): object {
    return {
      'bool': {
        'must': [
          {
            'query_string': {
              'default_field': this.sectionInvalidReasonTypeKeyword,
              'query': 'Deleted'
            }
          },
          {
            'query_string': {
              'default_field': this.sectionSectionInvalidIndicatorKeyword,
              'query': 'Y OR N'
            }
          }
        ]
      }
    };
  }
  static getFilterFieldQuery(defaultField, searchText) {
    return {
      'query_string': {
        'default_field': defaultField, 'query': searchText
      }
    };
  }
  static getFilterFieldTimeStampQuery(defaultField, startDate, endDate, dateFormat) {
    return {
      'range': {
       [defaultField]: { 'lte': endDate, 'gte': startDate, 'format': dateFormat }
      }
    };
  }
}
