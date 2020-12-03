export class FuelSummaryQuery {
  /** query to fetch the carrier details based on the value typed
   * @static
   * @param {string} value
   * @returns {object}
   * @memberof FuelSummaryQuery
   */
  static getCarrierDetails(value: string): object {
    return {
      'size': 6,
      'from': 0,
      '_source': [
        'LegalName',
        'CarrierCode',
        'CarrierID'
      ],
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'CarrierStatus.keyword',
                'query': 'A',
                'default_operator': 'AND'
              }
            },
            {
              'query_string': {
                'fields': [
                  'LegalName',
                  'CarrierCode'
                ],
                'query': `${value.replace(/[!?:\\["^~=\//\\{}&&||<>()+*\]-]/g, '\\$&')}*`,
                'default_operator': 'AND'
              }
            }
          ]
        }
      },

      'aggs': {
        'unique': {
          'terms': {
            'field': 'LegalName.keyword',
            'size': 5
          },
          'aggs': {
            'Level': {
              'top_hits': {
                '_source': {
                  'includes': [
                    'LegalName',
                    'CarrierCode',
                    'CarrierID'
                  ]
                },
                'size': 1
              }
            }
          }
        }
      }
    };
  }
}
