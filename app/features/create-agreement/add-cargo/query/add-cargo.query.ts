export class AddCargoQuery {
  /** ES Query to fetch data to display in cargo release table
   * @static
   * @param {number} agreementId
   * @returns {object}
   * @memberof AddCargoQuery*/
  static getTableQuery(agreementId: number): object {
    return {
      '_source': '*',
        'size': 10000,
          'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'customerAgreementID',
                'query': `${agreementId}`,
                'default_operator': 'AND'
              }
            },
            {
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
                            'default_field': 'invalidReasonTypeName',
                            'query': 'Active'
                          }
                        }
                      ]
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
          'cargoType.keyword': {
            'order': 'asc'
          }
        },
        {
          'effectiveDate': {
            'order': 'asc'
          }
        }
        ]
    };
}
}
